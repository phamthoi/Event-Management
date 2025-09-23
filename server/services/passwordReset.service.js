// server/services/passwordReset.service.js
import prisma from "../prisma/client.js";
import bcrypt from "bcryptjs";

const CODE_TTL_MINUTES = 15;

export async function createResetCode(email) {
  // create plain numeric 6-digit code
  const code = (Math.floor(100000 + Math.random() * 900000)).toString();

  const codeHash = await bcrypt.hash(code, 10);
  const expiresAt = new Date(Date.now() + CODE_TTL_MINUTES * 60 * 1000);

  // insert a new password reset record
  await prisma.passwordReset.create({
    data: {
      email,
      codeHash,
      expiresAt,
      used: false,
    },
  });

  return code; // return plain code so caller can send to user
}

export async function verifyResetCode(email, code) {
  // find the most recent, unused, not-expired record
  const record = await prisma.passwordReset.findFirst({
    where: {
      email,
      used: false,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: "desc" },
  });

  if (!record) return false;

  const match = await bcrypt.compare(code, record.codeHash);
  return match ? record : false;
}

export async function markCodeUsed(recordId) {
  await prisma.passwordReset.update({
    where: { id: recordId },
    data: { used: true },
  });
}

// optional: cleanup expired records (can be run by cron)
export async function cleanupExpired() {
  await prisma.passwordReset.deleteMany({
    where: { expiresAt: { lt: new Date() }, used: false },
  });
}

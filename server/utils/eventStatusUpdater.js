// utils/eventStatusUpdater.js
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function updateEventStatus() {
  const now = new Date();

  try {
    console.log("🕒 Checking events:", now.toISOString());

    // 1️⃣ DRAFT -> REGISTRATION
    const draftEvents = await prisma.event.findMany({
      where: {
        status: "DRAFT",
        registrationStartAt: { lte: now },
        registrationEndAt: { gt: now },
      },
    });

    for (const ev of draftEvents) {
      await prisma.event.update({
        where: { id: ev.id },
        data: { status: "REGISTRATION" },
      });
      console.log(`📌 Event ${ev.id} moved DRAFT -> REGISTRATION`);
    }

    // 2️⃣ REGISTRATION -> READY | CANCELLED
    const regEvents = await prisma.event.findMany({
      where: {
        status: "REGISTRATION",
        registrationEndAt: { lte: now },
      },
      include: { registrations: true },
    });

    for (const ev of regEvents) {
      const registered = ev.registrations.length;
      if (registered >= (ev.minAttendees || 1)) {
        await prisma.event.update({
          where: { id: ev.id },
          data: { status: "READY" },
        });
        console.log(`✅ Event ${ev.id} REGISTRATION -> READY`);
      } else {
        await prisma.event.update({
          where: { id: ev.id },
          data: { status: "CANCELLED" },
        });
        console.log(`❌ Event ${ev.id} REGISTRATION -> CANCELLED`);
      }
    }

    // 3️⃣ READY -> ONGOING
    await prisma.event.updateMany({
      where: { status: "READY", startAt: { lte: now } },
      data: { status: "ONGOING" },
    });

    // 4️⃣ ONGOING -> COMPLETED
    await prisma.event.updateMany({
      where: { status: "ONGOING", endAt: { lte: now } },
      data: { status: "COMPLETED" },
    });

  } catch (err) {
    console.error("❌ Error updating event statuses:", err);
  }
}

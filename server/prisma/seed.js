// prisma/seed.js
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const PASSWORD = "123"; // mật khẩu cho tất cả user

// Nếu schema event.status enum khác, sửa mảng này tương ứng
const EVENT_STATUSES = [
  "DRAFT",
  "REGISTRATION",
  "ONGOING",
  "FINISHED",
  "CANCELLED"
];

async function main() {
  console.log("🌱 Start seeding...");

  // Xoá dữ liệu cũ (tuỳ theo quan hệ trong schema bạn có thể thay đổi thứ tự)
  await prisma.notification.deleteMany();
  await prisma.attachment.deleteMany();
  await prisma.registration.deleteMany();
  await prisma.event.deleteMany();
  await prisma.user.deleteMany();
  await prisma.organization.deleteMany();

  // Tạo 2 tổ chức
  const org1 = await prisma.organization.create({
    data: { name: "Organization One", slug: "org-one" },
  });

  const org2 = await prisma.organization.create({
    data: { name: "Organization Two", slug: "org-two" },
  });

  // Tạo admin cho mỗi tổ chức (password = "123")
  const admin1 = await prisma.user.create({
    data: {
      email: "admin1@org1.example",
      fullName: "Admin One",
      phoneNumber: "0901000001",
      passwordHash: await bcrypt.hash(PASSWORD, 10),
      role: "ADMIN",
      organizationId: org1.id,
    },
  });

  const admin2 = await prisma.user.create({
    data: {
      email: "admin2@org2.example",
      fullName: "Admin Two",
      phoneNumber: "0901000002",
      passwordHash: await bcrypt.hash(PASSWORD, 10),
      role: "ADMIN",
      organizationId: org2.id,
    },
  });

  // Tạo vài members cho mỗi tổ chức (password = "123")
  const org1Members = [];
  for (let i = 1; i <= 3; i++) {
    const u = await prisma.user.create({
      data: {
        email: `member${i}@org1.example`,
        fullName: `Org1 Member ${i}`,
        phoneNumber: `09011000${i}`,
        passwordHash: await bcrypt.hash(PASSWORD, 10),
        role: "MEMBER",
        organizationId: org1.id,
      },
    });
    org1Members.push(u);
  }

  const org2Members = [];
  for (let i = 1; i <= 2; i++) {
    const u = await prisma.user.create({
      data: {
        email: `member${i}@org2.example`,
        fullName: `Org2 Member ${i}`,
        phoneNumber: `09012000${i}`,
        passwordHash: await bcrypt.hash(PASSWORD, 10),
        role: "MEMBER",
        organizationId: org2.id,
      },
    });
    org2Members.push(u);
  }

  // Tạo events CHỈ cho organization 1, do admin1 tạo
  // Mỗi event có một trạng thái từ EVENT_STATUSES
  const now = Date.now();
  const events = [];
  for (let i = 0; i < EVENT_STATUSES.length; i++) {
    const status = EVENT_STATUSES[i];
    const start = new Date(now + (i + 1) * 24 * 60 * 60 * 1000); // i ngày sau
    const end = new Date(start.getTime() + 4 * 60 * 60 * 1000); // 4 giờ sau

    const ev = await prisma.event.create({
      data: {
        title: `Org1 Event - ${status}`,
        description: `Sự kiện mẫu (status=${status})`,
        location: "HCMC",
        minAttendees: 5,
        maxAttendees: 50,
        startAt: start,
        endAt: end,
        status: status, // <-- nếu schema khác, sửa giá trị này
        organizationId: org1.id,
        createdById: admin1.id,
      },
    });

    events.push(ev);
  }

  // Tạo một vài registration cho một số members vào một số event
  // (ví dụ: member1 đăng ký event có status REGISTRATION; 1 member mark attendance false)
  const eventByStatus = {};
  for (const e of events) eventByStatus[e.status] = e;

  // Nếu có event REGISTRATION thì đăng ký 2 members
  if (eventByStatus["REGISTRATION"]) {
    await prisma.registration.createMany({
      data: [
        {
          eventId: eventByStatus["REGISTRATION"].id,
          userId: org1Members[0].id,
          status: "REGISTERED",
          attendance: false,
        },
        {
          eventId: eventByStatus["REGISTRATION"].id,
          userId: org1Members[1].id,
          status: "REGISTERED",
          attendance: false,
        },
      ],
    });
  }

  // Nếu có event ONGOING thì đánh dấu 1 member đã tham gia (attendance true)
  if (eventByStatus["ONGOING"]) {
    await prisma.registration.create({
      data: {
        eventId: eventByStatus["ONGOING"].id,
        userId: org1Members[2].id,
        status: "REGISTERED",
        attendance: true,
      },
    });
  }

  // Tạo vài notification mẫu
  await prisma.notification.createMany({
    data: [
      {
        title: "Welcome to Org1",
        message: "Chào mừng bạn đã tham gia Organization One",
        type: "SYSTEM",
        recipientId: admin1.id,
      },
      {
        title: "Event created",
        message: `Admin ${admin1.fullName} đã tạo một loạt sự kiện mẫu.`,
        type: "EVENT",
        recipientId: org1Members[0].id,
      },
    ],
  });

  console.log("✅ Seeding finished.");
}

main()
  .catch((e) => {
    console.error("❌ Error while seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

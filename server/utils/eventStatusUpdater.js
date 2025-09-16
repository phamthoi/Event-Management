// utils/eventStatusUpdater.js
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function updateEventStatus() {
  const now = new Date();

  try {
    console.log("🕒 Checking events:", now.toISOString());

    // 0️⃣ DRAFT -> ONGOING (for events created during event time)
    const draftEventsInProgress = await prisma.event.findMany({
      where: {
        status: "DRAFT",
        startAt: { lte: now },
        endAt: { gt: now },
      },
      include: { registrations: true },
    });

    for (const ev of draftEventsInProgress) {
      const registered = ev.registrations.length;
      if (registered >= (ev.minAttendees || 1)) {
        await prisma.event.update({
          where: { id: ev.id },
          data: { status: "ONGOING" },
        });
        console.log(`🚀 Event ${ev.id} moved DRAFT -> ONGOING (created during event time)`);
      } else {
        await prisma.event.update({
          where: { id: ev.id },
          data: { status: "CANCELLED" },
        });
        console.log(`❌ Event ${ev.id} DRAFT -> CANCELLED (insufficient attendees during event time)`);
      }
    }

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

    // 2.5️⃣ DRAFT -> READY (for events that are 1 day before start and registration has ended)
    const oneDayBeforeEvents = await prisma.event.findMany({
      where: {
        status: "DRAFT",
        registrationEndAt: { lt: now },
        startAt: { gt: now },
      },
      include: { registrations: true },
    });

    for (const ev of oneDayBeforeEvents) {
      const eventStart = new Date(ev.startAt);
      const oneDayBefore = new Date(eventStart);
      oneDayBefore.setDate(oneDayBefore.getDate() - 1);
      
      if (now >= oneDayBefore) {
        const registered = ev.registrations.length;
        if (registered >= (ev.minAttendees || 1)) {
          await prisma.event.update({
            where: { id: ev.id },
            data: { status: "READY" },
          });
          console.log(`✅ Event ${ev.id} DRAFT -> READY (1 day before)`);
        } else {
          await prisma.event.update({
            where: { id: ev.id },
            data: { status: "CANCELLED" },
          });
          console.log(`❌ Event ${ev.id} DRAFT -> CANCELLED (insufficient attendees)`);
        }
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

// client/src/pages/events/UpcomingEventsPage.jsx
import React, { useEffect, useState } from "react";
// import { getEvents } from "../../../services/admin/event/eventService";
// import { getRegistrations } from "../../../services/admin/event/attendanceService";
import { getUpcomingEvents, registerEvent, cancelRegistration, getMemberRegistrations } from "../../../services/member/event/activeOfMemberService";
import { getEventStatus } from "../../../utils/getEventStatus";
import EventCard from "../../../components/member/EventList/EventCard";
import { showErrorAlert } from "../../../utils/member/errorHandler";

const UpcomingEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState({});
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const limit = 10;

  //======== API thật=========
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const currentMemberId = currentUser?.id;

  //=========== Fake API =========
  // const currentUser = { id: 1, fullName: "Demo Member" }; // fake currentUser
  // const currentMemberId = currentUser.id;

  //===========Fake API=========== 
  // const fakeUpcomingEvents = [
  //   {
  //     id: 3,
  //     title: "Seminar AI & Machine Learning",
  //     description: "Tìm hiểu về AI và Machine Learning trong thời đại 4.0",
  //     startDate: "2024-04-10T09:00:00Z",
  //     endDate: "2024-04-10T16:00:00Z",
  //     location: "Đà Nẵng",
  //     maxParticipants: 80,
  //     currentParticipants: 45,
  //     status: "ACTIVE",
  //     isRegistered: false
  //   },
  //   {
  //     id: 4,
  //     title: "Conference DevOps 2024",
  //     description: "Hội nghị về DevOps và các công cụ tự động hóa",
  //     startDate: "2024-04-15T08:30:00Z",
  //     endDate: "2024-04-15T17:30:00Z",
  //     location: "Hà Nội",
  //     maxParticipants: 120,
  //     currentParticipants: 89,
  //     status: "ACTIVE",
  //     isRegistered: true
  //   },
  //   {
  //     id: 5,
  //     title: "Workshop Mobile Development",
  //     description: "Workshop phát triển ứng dụng di động với React Native",
  //     startDate: "2024-04-20T13:00:00Z",
  //     endDate: "2024-04-20T18:00:00Z",
  //     location: "TP.HCM",
  //     maxParticipants: 60,
  //     currentParticipants: 60,
  //     status: "ACTIVE",
  //     isRegistered: false
  //   }
  // ];

  // const getUpcomingEvents = async () => {
  //   await new Promise((resolve) => setTimeout(resolve, 500));
  //   return fakeUpcomingEvents;
  // };

  // const registerEvent = async (eventId) => {
  //   await new Promise((resolve) => setTimeout(resolve, 500));
  //   const event = fakeUpcomingEvents.find(e => e.id === eventId);
  //   if (event && !event.isRegistered && event.currentParticipants < event.maxParticipants) {
  //     event.isRegistered = true;
  //     event.currentParticipants += 1;
  //     return { message: "Đăng ký thành công" };
  //   }
  //   throw new Error("Không thể đăng ký event này");
  // };

  // const cancelRegistration = async (eventId) => {
  //   await new Promise((resolve) => setTimeout(resolve, 500));
  //   const event = fakeUpcomingEvents.find(e => e.id === eventId);
  //   if (event && event.isRegistered) {
  //     event.isRegistered = false;
  //     event.currentParticipants -= 1;
  //     return { message: "Hủy đăng ký thành công" };
  //   }
  //   throw new Error("Không thể hủy đăng ký event này");
  // };
  //==========end fake API==========

  // ========== Fake Events ==========
  // const fakeEvents = Array.from({ length: 12 }, (_, i) => {
  //   const now = new Date();
  //   const startAt = new Date(now.getTime() + i * 86400000); // cách i ngày
  //   const endAt = new Date(startAt.getTime() + 3 * 86400000); // kéo dài 3 ngày
  //   const registrationEndAt = new Date(startAt.getTime() + 2 * 86400000); // đóng đăng ký sau 2 ngày
  //   return {
  //     id: i + 1,
  //     name: `Event ${i + 1}`,
  //     startAt: startAt.toISOString(),
  //     endAt: endAt.toISOString(),
  //     registrationEndAt: registrationEndAt.toISOString(),
  //     maxAttendees: 10,
  //   };
  // });

  // Fake registrations
  // const [fakeRegs, setFakeRegs] = useState({}); // { memberId: { eventId: true } }
  //==================== End Fake API =====================
  
// Load danh sách sự kiện từ backend
  const loadEvents = async () => {
    try {
      setLoading(true);
      const res = await getUpcomingEvents(page, limit);
      // res = { events: [], total: number, page, limit, totalPages }
      const filteredEvents = res.events.map(ev => ({ ...ev, status: getEventStatus(ev) }));
      setEvents(filteredEvents);
      setTotal(res.total);
    } catch (err) {
      console.error("Error loading events:", err);
      showErrorAlert(err);
    } finally {
      setLoading(false);
    }
  };

  //================ fake loadevents=============
  // const loadEvents = async () => {
  //   setLoading(true);
  //   // Fake pagination
  //   const start = (page - 1) * limit;
  //   const end = start + limit;
  //   const paged = fakeEvents.slice(start, end).map((ev) => ({
  //     ...ev,
  //     status: getEventStatus(ev),
  //   }));
  //   setEvents(paged);
  //   setTotal(fakeEvents.length);
  //   setLoading(false);
  // };
  //============== END ======================

  // Load danh sách registrations của member
  const loadRegistrations = async () => {
    try {
      const res = await getMemberRegistrations();
      // res = [{ eventId: 1 }, { eventId: 2 }, ...]
      const regMap = res.reduce((acc, r) => {
        acc[r.eventId] = true;
        return acc;
      }, {});
      setRegistrations({ [currentMemberId]: regMap });
    } catch (err) {
      console.error("Error loading registrations:", err);
      showErrorAlert(err);
    }
  };
 
 //================= fake load registrations=========
 // Load registrations
 //  const loadRegistrations = async () => {
 //    const memberRegs = fakeRegs[currentMemberId] || {};
 //    setRegistrations({ [currentMemberId]: memberRegs });
 //  };
  // ================== END ====================
 
  useEffect(() => {
    loadEvents();
    loadRegistrations();
  }, [page]);
  
  //============ Fake===========
  // useEffect(() => {
  //   loadEvents();
  //   loadRegistrations();
  // }, [page, fakeRegs]);
  
  // Xử lý đăng ký / hủy đăng ký
  const handleToggleRegister = async (event) => {
    if (!currentMemberId) {
      alert("Bạn chưa đăng nhập");
      return;
    }

    const registered = registrations[currentMemberId]?.[event.id];
    const canCancel = registered && new Date() <= new Date(event.registrationEndAt);

    try {
      if (registered && canCancel) {
        await cancelRegistration(event.id); // DELETE /member/events/:eventId/register
        alert("Đã hủy đăng ký");
      } else if (!registered) {
        if (event.status === "DRAFT") {
          alert("Sự kiện chưa mở đăng ký");
          return;
        }
        await registerEvent(event.id); // POST /member/events/:eventId/register
        alert("Đăng ký thành công");
      } else {
        alert("Không thể hủy sự kiện này");
        return;
      }
      
      // Reload cả danh sách sự kiện và registrations
      await loadEvents();
      await loadRegistrations();
    } catch (err) {
      console.error("Registration error:", err);
      showErrorAlert(err);
    }
  };

  //============= Fake register / cancel
  // const handleToggleRegister = async (event) => {
  // const memberRegs = fakeRegs[currentMemberId] || {};
  // const registered = !!memberRegs[event.id];
  // const canCancel = registered && new Date() <= new Date(event.registrationEndAt);

  // if (registered && canCancel) {
  //   // Hủy đăng ký
  //   const newRegs = { ...memberRegs };
  //   delete newRegs[event.id];
  //   setFakeRegs({ ...fakeRegs, [currentMemberId]: newRegs });
  //   alert("Đã hủy đăng ký");
  // } else if (!registered) {
  //   // Chỉ cho phép đăng ký nếu status === "REGISTRATION"
  //   if (event.status !== "REGISTRATION") {
  //     alert("Sự kiện chưa mở đăng ký hoặc đã kết thúc");
  //     return;
  //   }
  //   const newRegs = { ...memberRegs, [event.id]: true };
  //   setFakeRegs({ ...fakeRegs, [currentMemberId]: newRegs });
  //   alert("Đăng ký thành công");
  // } else {
  //   alert("Không thể hủy sự kiện này");
  // }
// };
  //====================== END====================

  if (loading) return <p className="text-center mt-10">Đang tải...</p>;

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Upcoming Events</h1>
      {events.length === 0 ? (
        <div className="text-gray-500">Không có sự kiện sắp tới</div>
      ) : (
        <div className="space-y-4">
          {events.map((ev) => {
            const registered = !!registrations[currentMemberId]?.[ev.id];
            const canCancel =
              registered && new Date() <= new Date(ev.registrationEndAt);

            return (
              <EventCard
                key={ev.id}
                event={ev}
                registered={registered}
                remaining={ev.registeredCount}
                onToggleRegister={handleToggleRegister}
                canCancel={canCancel}
              />
            );
          })}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400 disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {page} / {Math.ceil(total / limit)}
        </span>
        <button
          disabled={page * limit >= total}
          onClick={() => setPage(page + 1)}
          className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UpcomingEventsPage;

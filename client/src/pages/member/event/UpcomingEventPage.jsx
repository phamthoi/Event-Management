// client/src/pages/events/UpcomingEventsPage.jsx
import React, { useEffect, useState } from "react";
import { getEvents } from "../../../services/admin/event/eventService";
import { getRegistrations } from "../../../services/admin/event/attendanceService";
import { registerEvent, cancelRegistration } from "../../../services/member/activeOfMember";
import { getEventStatus } from "../../../utils/getEventStatus";
import EventCard from "../../../components/member/EventList/EventCard";

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

  /*
  //=========== Fake API =========
  const currentUser = { id: 1, fullName: "Demo Member" }; // fake currentUser
  const currentMemberId = currentUser.id;

  // ========== Fake Events ==========
  const fakeEvents = Array.from({ length: 12 }, (_, i) => {
    const now = new Date();
    const startAt = new Date(now.getTime() + i * 86400000); // cách i ngày
    const endAt = new Date(startAt.getTime() + 3 * 86400000); // kéo dài 3 ngày
    const registrationEndAt = new Date(startAt.getTime() + 2 * 86400000); // đóng đăng ký sau 2 ngày
    return {
      id: i + 1,
      name: `Event ${i + 1}`,
      startAt: startAt.toISOString(),
      endAt: endAt.toISOString(),
      registrationEndAt: registrationEndAt.toISOString(),
      maxAttendees: 10,
    };
  });

  // Fake registrations
  const [fakeRegs, setFakeRegs] = useState({}); // { memberId: { eventId: true } }
  //==================== End Fake API =====================
*/
  
// Load danh sách sự kiện từ backend
  const loadEvents = async () => {
    try {
      setLoading(true);
      const res = await getEvents({ page, limit, status: ["DRAFT", "REGISTRATION"] });
      res = { events: [], total: number }
      const filteredEvents = res.events.map(ev => ({ ...ev, status: getEventStatus(ev) }));
      setEvents(filteredEvents);
      setTotal(res.total);
    } catch (err) {
      console.error("Error loading events:", err);
      alert("Không thể tải sự kiện");
    } finally {
      setLoading(false);
    }
  };

  /*
  //================ fake loadevents=============
  const loadEvents = async () => {
    setLoading(true);
    // Fake pagination
    const start = (page - 1) * limit;
    const end = start + limit;
    const paged = fakeEvents.slice(start, end).map((ev) => ({
      ...ev,
      status: getEventStatus(ev),
    }));
    setEvents(paged);
    setTotal(fakeEvents.length);
    setLoading(false);
  };
  //============== END ======================
*/

  // Load danh sách registrations của member
  const loadRegistrations = async () => {
    try {
      const res = await getRegistrations();
      // res = [{ eventId: 1 }, { eventId: 2 }, ...]
      const regMap = res.reduce((acc, r) => {
        acc[r.eventId] = true;
        return acc;
      }, {});
      setRegistrations({ [currentMemberId]: regMap });
    } catch (err) {
      console.error("Error loading registrations:", err);
    }
  };
 /*
 //================= fake load registrations=========
 // Load registrations
  const loadRegistrations = async () => {
    const memberRegs = fakeRegs[currentMemberId] || {};
    setRegistrations({ [currentMemberId]: memberRegs });
  };
  // ================== END ====================
  */
 
  useEffect(() => {
    loadEvents();
    loadRegistrations();
  }, [page]);
  
  //============ Fake===========
  /*
  useEffect(() => {
    loadEvents();
    loadRegistrations();
  }, [page, fakeRegs]);
*/
  
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
        await cancelRegistration(event.id); // DELETE /member/registrations/:eventId
        alert("Đã hủy đăng ký");
      } else if (!registered) {
        if (event.status === "DRAFT") {
          alert("Sự kiện chưa mở đăng ký");
          return;
        }
        await registerEvent(event.id); // POST /member/registrations/:eventId
        alert("Đăng ký thành công");
      } else {
        alert("Không thể hủy sự kiện này");
        return;
      }
      await loadRegistrations();
    } catch (err) {
      console.error("Toggle register failed:", err);
      alert("Đăng ký / hủy đăng ký thất bại");
    }
  };

  /*
  //============= Fake register / cancel
  const handleToggleRegister = async (event) => {
  const memberRegs = fakeRegs[currentMemberId] || {};
  const registered = !!memberRegs[event.id];
  const canCancel = registered && new Date() <= new Date(event.registrationEndAt);

  if (registered && canCancel) {
    // Hủy đăng ký
    const newRegs = { ...memberRegs };
    delete newRegs[event.id];
    setFakeRegs({ ...fakeRegs, [currentMemberId]: newRegs });
    alert("Đã hủy đăng ký");
  } else if (!registered) {
    // Chỉ cho phép đăng ký nếu status === "REGISTRATION"
    if (event.status !== "REGISTRATION") {
      alert("Sự kiện chưa mở đăng ký hoặc đã kết thúc");
      return;
    }
    const newRegs = { ...memberRegs, [event.id]: true };
    setFakeRegs({ ...fakeRegs, [currentMemberId]: newRegs });
    alert("Đăng ký thành công");
  } else {
    alert("Không thể hủy sự kiện này");
  }
};
  //====================== END====================
*/
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
            const remaining = ev.maxAttendees - (registered ? 1 : 0);
            const canCancel =
              registered && new Date() <= new Date(ev.registrationEndAt);

            return (
              <EventCard
                key={ev.id}
                event={ev}
                registered={registered}
                remaining={remaining}
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

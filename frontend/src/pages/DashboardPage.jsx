import Explorer from "../components/Dashboard/Explorer";
import DashboardContent from "../components/Dashboard/DashboardContent";
import Calendar from "../components/Dashboard/Calendar";
import useDeviceStore from "../store/deviceStore";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import dayjs from "dayjs";
import useTodoStore from "../store/todoStore";

function DashboardPage() {
  const [recentEvents, setRecentEvents] = useState([]);
  const isMobile = useDeviceStore((state) => state.isMobile);
  const { events } = useTodoStore();
  const calendarRef = useRef(null);

  useEffect(() => {
    handleDatesSet();
  }, [events]);

  const handleChangeCalendarView = (viewType) => {
    let calendarApi = calendarRef.current?.getApi();
    let events = calendarApi.getEvents();
    // console.log(events);
    // calendarApi.changeView(viewType);
    console.log(recentEvents);
  };

  const handleDatesSet = () => {
    let calendarApi = calendarRef.current.getApi();
    // let events = calendarApi.getEvents();

    let today = dayjs();
    let start = today.subtract(6, "day").startOf("day"); // 일주일 전
    let end = today.add(1, "day").startOf("day"); // 내일의 시작 시점
    let filteredEvents = events.filter((event) => {
      let eventStart = dayjs(event.start);
      return eventStart.isAfter(start) && eventStart.isBefore(end);
    });

    setRecentEvents(filteredEvents);
  };

  return (
    <div className="flex h-screen ">
      {/* Explorer 컴포넌트의 너비를 비례적으로 조정 */}
      <div
        className={`relative ${
          isMobile ? "w-[70px]" : "w-1/12 min-w-[80px] "
        } max-w-[110px]`}
      >
        <Explorer />
      </div>
      {!isMobile && (
        <div className="flex-grow w-1/3 min-h-[500px] min-w-[200px]">
          <DashboardContent calendarChange={handleChangeCalendarView} />
        </div>
      )}
      <div
        className={`flex-grow ${isMobile ? "w-full" : "w-2/3"} min-h-[500px]`}
      >
        <Calendar calendarRef={calendarRef} />
      </div>
    </div>
  );
}

export default DashboardPage;

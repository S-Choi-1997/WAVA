import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Field, Fieldset, Input, Label } from "@headlessui/react";

import "./Calendar.css";

import useDeviceStore from "../../store/deviceStore";
import useTodoStore from "../../store/todoStore";
import TodoModal from "./Calendar/TodoModal";
import DateRangePicker from "./Calendar/DateRangePicker";

import { validateEvent } from "../../util/func";
import TypeRadio from "./Calendar/TypeRadio";
import ImportantRadio from "./Calendar/ImportantRadio";
import Filters from "./Calendar/Filters";
import MobileExplorer from "../common/MobileExplorer";

const Calendar = ({ calendarRef }) => {
  const [eventsTypeFilter, setEventsTypeFilter] = useState({
    type: "ALL",
    important: "ALL",
  });

  const [state, setState] = useState({});
  const [isOpen, setIsOpen] = useState(false); // 모달오픈여부
  const [showFilters, setShowFilters] = useState(false); // 필터 옵션 표시 여부

  // Todo Item Info
  const [start, setStart] = useState(new Date());
  const [end, setEnd] = useState(new Date());
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isFinish, setIsFinish] = useState(false);
  const [important, setImportant] = useState("하"); // 상 중 하
  const [type, setType] = useState("WORK"); // WORK, REST
  // Todo Item Info 끝

  const isMobile = useDeviceStore((state) => state.isMobile);

  const {
    filteredEvents,
    setFilteredEvents,
    events,
    addEvent,
    fetchEvents,
    updateEvent,
    deleteEvent,
  } = useTodoStore();

  // 최초 접속 시 이벤트목록 받아오기
  useEffect(() => {
    (async () => {
      await fetchEvents();
    })();
  }, [fetchEvents]);

  // 필터링된 이벤트 설정
  useEffect(() => {
    let filtered = null;
    switch (eventsTypeFilter.type) {
      case "WORK":
        filtered = events?.filter((el) => el?.type === "WORK");
        break;
      case "REST":
        filtered = events?.filter((el) => el?.type === "REST");
        break;
      case "ALL":
      default:
        filtered = events;
        break;
    }
    switch (eventsTypeFilter.important) {
      case "상":
        filtered = filtered?.filter((el) => el?.important === "상");
        break;
      case "중":
        filtered = filtered?.filter((el) => el?.important === "중");
        break;
      case "하":
        filtered = filtered?.filter((el) => el?.important === "하");
        break;
      case "ALL":
      default:
        break;
    }
    if (Array.isArray(filtered)) {
      setFilteredEvents(filtered);
    }
  }, [events, eventsTypeFilter, setFilteredEvents]);

  const handleDateSelect = (selectInfo) => {
    if (
      selectInfo.view.type === "timeGridWeek" ||
      selectInfo.view.type === "timeGridDay" ||
      selectInfo.view.type === "threeDays"
    ) {
      selectInfo.view.calendar.unselect();
      setState({ selectInfo, state: "create" });
      setStart(selectInfo.start);
      setEnd(selectInfo.end);
      openModal(true);
    }
  };

  function openModal() {
    setIsOpen(true);
  }

  const closeModal = () => {
    setIsOpen(false);
    setTitle("");
    setState({});
    setStart(new Date());
    setEnd(new Date());
    setIsFinish(false);
    setContent("");
    setImportant("하");
  };

  // 달력에 뜨는 이벤트 커스텀
  function renderEventContent(eventInfo) {
    return (
      <div
        className={
          `${eventInfo.event?.extendedProps?.isFinish ? "todo-finish " : ""}` +
          [...eventInfo.event.classNames] +
          " animate-fade-in"
        }
      >
        <i
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {eventInfo.event.title}
        </i>
      </div>
    );
  }

  // 수정 함수
  const handleEdit = async () => {
    state.clickInfo.event.setStart(start);
    state.clickInfo.event.setEnd(end);

    state.clickInfo.event.mutate({
      standardProps: {
        title,
      },
    });
    const event = {
      id: state.clickInfo.event.id,
      title,
      start,
      end,
      className: important,
      content,
      important,
      isFinish,
      type,
    };
    if (validateEvent(event)) {
      const result = await updateEvent(event);
      if (result) {
        closeModal();
      }
    } else {
      alert("입력값을 확인해 주세요.");
    }
  };

  // 생성 함수
  const handleSubmit = async () => {
    const newEvent = {
      title,
      start,
      end,
      content,
      className: important,
      important,
      type,
      isFinish,
    };

    if (!validateEvent(newEvent)) {
      return alert("입력값을 확인해 주세요.");
    }

    await addEvent(newEvent);
    closeModal();
  };

  // 삭제 함수
  const handleDelete = async () => {
    const rst = await deleteEvent(state.clickInfo.event.id);
    console.log(state.clickInfo.event.id);
    if (rst) {
      state.clickInfo.event.remove();
    }
    closeModal();
  };

  // 항목 클릭 -> 수정 모달 오픈
  const handleEventClick = (clickInfo) => {
    setState({ clickInfo, state: "update" });
    setTitle(clickInfo.event.title);
    setStart(clickInfo.event.start);
    setIsFinish(clickInfo.event.extendedProps?.isFinish);
    setContent(clickInfo.event.extendedProps?.content);
    setImportant(clickInfo.event.extendedProps?.important);
    setType(clickInfo.event.extendedProps?.type);
    setEnd(clickInfo.event.end);
    setIsOpen(true);
  };

  // 이벤트 크기 줄이기늘리기, 옮기기 -> 시간만 변경됨
  const handleEventResizeAmdDrop = (checkInfo) => {
    setState({ checkInfo, state: "resize" });
    const { start, end, id, title } = checkInfo?.event;
    const { content, important, isFinish, type } =
      checkInfo?.event?.extendedProps;
    const editedEvent = {
      id,
      start,
      end,
      title,
      content,
      important,
      isFinish,
      type,
      className: important,
    };
    updateEvent(editedEvent);
  };

  const renderFiltersButton = () => {
    return {
      text: "필터",
      click: () => setShowFilters(!showFilters),
    };
  };

  return (
    <div className="bg-white relative rounded-lg shadow-lg text-black h-full px-4 overflow-scroll scroll container mx-auto p-4">
      <div className="flex bg-white z-10">{isMobile && <MobileExplorer />}</div>

      <FullCalendar
        stickyHeaderDates={false}
        height="auto"
        views={{
          threeDays: {
            type: "timeGrid",
            duration: { days: 3 },
            buttonText: "3day",
          },
        }}
        allDaySlot={false}
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        headerToolbar={{
          // center: isMobile ? "" : "title",
          left: isMobile ? false : `todoCreate filtersButton`,
          center: isMobile ? "prev,next" : "prev,today,next",
          right: isMobile
            ? false
            : "dayGridMonth,timeGridWeek,threeDays,timeGridDay",
          // right: isMobile
          // ? "prev,next dayGridMonth,threeDays"
          // : "prev,today,next dayGridMonth,timeGridWeek,threeDays,timeGridDay",
        }}
        footerToolbar={
          isMobile
            ? {
                left: "filtersButton",

                right: "dayGridMonth,threeDays",
              }
            : false
        }
        customButtons={{
          todoCreate: {
            text: "일정 등록",
            click: openModal,
          },
          filtersButton: renderFiltersButton(),
        }}
        editable={true}
        initialView="threeDays"
        selectMirror={true}
        selectable={true}
        dayMaxEvents={true}
        weekends={true}
        events={filteredEvents}
        select={handleDateSelect}
        eventContent={renderEventContent}
        eventClick={handleEventClick}
        eventDrop={handleEventResizeAmdDrop}
        eventResize={handleEventResizeAmdDrop}
      />
      {showFilters && (
        <div className="absolute top-16 left-4 bg-white border border-gray-300 rounded-md shadow-lg flex flex-col items-start z-10">
          <Filters filter={eventsTypeFilter} setFilter={setEventsTypeFilter} />
        </div>
      )}
      <div className="divider" />
      {/* 모달 */}
      <TodoModal
        isOpen={isOpen}
        onClose={closeModal}
        title={state.state === "update" ? "일정 수정" : "일정 추가"}
        onSubmit={state.clickInfo ? handleEdit : handleSubmit}
        onDelete={state.clickInfo && handleDelete}
        submitText={state.clickInfo ? "수정" : "저장"}
        deleteText="삭제"
      >
        <Fieldset className={isMobile ? "space-y-2" : ""}>
          <Field className={isMobile ? "flex flex-col space-y-2" : ""}>
            <Label
              htmlFor="title"
              className={isMobile ? "text-sm font-medium" : "ms-2 me-2"}
            >
              할 일 :
            </Label>
            <Input
              className="text-black border rounded-md p-2 w-3/4"
              type="text"
              id="title"
              name="title"
              placeholder="할 일을 입력해주세요."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <div className={isMobile ? "flex items-center space-x-2" : ""}>
              <Label
                htmlFor="isFinish"
                className={
                  isMobile
                    ? "text-sm font-medium whitespace-nowrap"
                    : "ms-2 me-2"
                }
              >
                완료 여부 :
              </Label>
              <Input
                id="isFinish"
                type="checkbox"
                checked={isFinish}
                onChange={(e) => setIsFinish(e.target.checked)}
                className={isMobile ? "h-4 w-4 text-blue-600" : "mt-2 mb-4"}
              />
            </div>
          </Field>
          <Field>
            <Label
              htmlFor="content"
              className={isMobile ? "text-sm font-medium" : "ms-2 me-2"}
            >
              내 용 :
            </Label>
            <Input
              defaultValue={content}
              className={
                isMobile
                  ? "text-black border rounded-md p-2 w-full h-24"
                  : "text-black border rounded-md p-2 w-3/4 h-48"
              }
              id="content"
              name="content"
              placeholder="내용을 입력해주세요."
              onChange={(e) => setContent(e.target.value)}
            />
          </Field>
          <Field className={"me-4 mt-7 mb-5"}>
            <div style={{ zIndex: 1 }}>
              <div className="flex justify-between">
                {isMobile ? (
                  <>
                    <select
                      className="border rounded-md p-2 ms-4"
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                    >
                      <option value="WORK">일정 및 업무</option>
                      <option value="REST">여가 및 휴식</option>
                    </select>
                    <select
                      className="border rounded-md p-2"
                      value={important}
                      onChange={(e) => setImportant(e.target.value)}
                    >
                      <option value="상">상</option>
                      <option value="중">중</option>
                      <option value="하">하</option>
                    </select>
                  </>
                ) : (
                  <>
                    <TypeRadio selected={type} setSelected={setType} />
                    <ImportantRadio
                      selected={important}
                      setSelected={setImportant}
                    />
                  </>
                )}
              </div>
            </div>
          </Field>
          {/* 옵션 선택 끝 */}
          <Field>
            <div className="text-center">
              <Label
                htmlFor="exampleEmail"
                className="text-black justify-center font-semibold hidden md:block"
              >
                시작 날짜(시간) - 마감 날짜(시간)
              </Label>
              <div className="divider" />
              {!isMobile && (
                <>
                  <DateRangePicker
                    timeSet={start}
                    editTimeSet={setStart}
                    className=""
                  />
                  <DateRangePicker
                    timeSet={end}
                    editTimeSet={setEnd}
                    className=""
                  />
                </>
              )}
            </div>
          </Field>
        </Fieldset>
      </TodoModal>
    </div>
  );
};

export default Calendar;

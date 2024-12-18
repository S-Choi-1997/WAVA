import React from "react";
import GraphView from "./Graph/GraphView";
import { useNavigate } from "react-router-dom";
import useUserStore from "../../store/userStore";
import useGptStore from "../../store/gptStore";
import dayjs from "dayjs";
import ReactMarkdown from "react-markdown";
import { useEffect, useState } from "react";
import mainLogic from "../../util/assistant-logic";
import { ArrowPathIcon, PlayCircleIcon } from "@heroicons/react/24/outline";
import useTodoStore from "../../store/todoStore";
import remarkGfm from "remark-gfm";
import TypingEffect from "./TypingEffect";
import Weather from "./Weather";
import CalendarMonthTwoToneIcon from "@mui/icons-material/CalendarMonthTwoTone";
import FmdGoodOutlinedIcon from "@mui/icons-material/FmdGoodOutlined";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import { getTodayTodoList } from "../../api/todoApi";


const DashboardContent = () => {
  const navigate = useNavigate();
  const { worcation } = useUserStore((state) => state.userInfo);

  // 수정 페이지로 이동
  const handleClick = () => {
    navigate("/worcation");
  };

  const [answer, setAnswer] = useState(null);
  const [isComment, setIsComment] = useState(false);

  const { setComments, comment } = useGptStore();

  // const [todayEvents, setTodayEvents] = useState("")

  const ai_test = async () => {
    const comment = await mainLogic();
    setComments(comment);
    setAnswer(comment);
  };

  const [isWorcationInfoOpen, setIsWorcationInfoOpen] = useState(true);

  const toggleDropdown = () => {
    setIsWorcationInfoOpen(!isWorcationInfoOpen);
  };

  // 컴포넌트를 unMount해서 삭제
  const setAIComment = async () => {
    try {
      setIsComment(false);
    } finally {
      await ai_test();
      setIsComment(true);
    }
  };

  // 페이지 로드 시 자동으로 AI 코멘트 실행
  useEffect(() => {
    setAIComment();
  }, []);

  return (
    <>
      <div
        className="bg-white text-mainTxt text-center flex flex-col h-full ms-1 me-0.5 pt-1.5"
        style={{ fontFamily: "'IBM Plex Sans KR', sans-serif" }}
      >
        <div className="shadow-md rounded-b-xl rounded-t-sm p-2 flex-shrink-0 bg-[#4aa2ee] text-white">
          <div className="px-1 cursor-pointer mt-1" onClick={toggleDropdown}>
            <div
              className="font-bold text-xl break-keep inline-block mb-1 relative tooltip tooltip-bottom"
              data-tip="클릭하면 카드가 열리거나 닫힙니다."
            >
              나의 워케이션 정보
            </div>
            <div
              className={`overflow-hidden transition-max-height duration-500 ease-in-out ${
                isWorcationInfoOpen ? "max-h-72" : "max-h-0"
              }`}
            >
              <div className="flex gap-2 py-1">
                <div className="flex-2 flex items-center justify-center">
                  <div className="h-full flex items-center">
                    <Weather />
                  </div>
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div className="bg-[#3d5893] p-0.5 rounded-lg shadow-md flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-[#edf1f5] text-sm mb-5 font-medium">
                        <CalendarMonthTwoToneIcon className="me-1 mb-0.5 text-slate-200" />
                        {dayjs(worcation.start).format("YY/MM/DD")}
                        <br />
                        ~ <br />
                        <CalendarMonthTwoToneIcon className="me-1 mb-0.5 text-slate-200" />
                        {dayjs(worcation.end).format("YY/MM/DD")}
                      </p>
                      <p className="text-[#edf1f5] text-sm mt-1 font-medium">
                        <FmdGoodOutlinedIcon className="me-1 mb-0.5 text-slate-200" />
                        {worcation.sido} {worcation.sigungu}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <button
                      className="w-full inline-flex justify-center items-center gap-2 rounded-md bg-[#3d5893] py-2 px-3 text-sm font-semibold text-[#edf1f5] shadow-sm transition-colors duration-300 hover:bg-[#18336c] hover:text-white focus:outline-none"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClick();
                      }}
                    >
                      워케이션 수정
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full flex-shrink-0 flex flex-col items-center shadow-md rounded-lg pt-2 pb-1 me-3 ms-0.5 my-3 bg-[#ffe9ae]">
          <GraphView />
        </div>

        <div className="w-full text-wrap flex-col items-center shadow-md rounded-lg me-3 ms-0.5 mb-1 flex-grow overflow-auto min-h-[100px] break-all">
          <div className="flex justify-between items-center shadow-md sticky top-0 bg-[#4aa2ee] p-2">
            <p
              className="text-center flex-grow text-white relative tooltip tooltip-bottom text-xl ms-12"
              data-tip="새로고침 버튼을 클릭하면 WAVA's AI ASISTANT의 내용을 새로 받을 수 있습니다."
            >
              WAVA'S AI ASISTANT
            </p>
            <button
              type="button"
              onClick={setAIComment}
              className="rounded-full drop-shadow-md text-[#ffe9ae] ml-4"
            >
              <ArrowPathIcon className="w-8" />
            </button>
          </div>
          {isComment && <TypingEffect text={comment} />}
          <article className="text-pretty p-3 bg-[#dde8ee] h-full">
            <p style={{ fontFamily: "'IBM Plex Sans KR', sans-serif" }}>
              {/* <ReactMarkdown className="" children={answer} remarkPlugins={[remarkGfm]} /> */}
            </p>
          </article>
        </div>
      </div>
    </>
  );
};

export default DashboardContent;

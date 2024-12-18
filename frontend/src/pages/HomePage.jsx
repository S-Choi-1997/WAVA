import React, { useEffect, useRef, useState } from "react";
import Carousel from "../components/Home/Carousel";
import AnimatedDiv from "../components/Home/AnimatedDiv";
import useDeviceStore from "../store/deviceStore";
import { Link } from "react-router-dom";
import ExpectationSection from "../components/Home/ExpectationSection";

function HomePage() {
  const [animate, setAnimate] = useState(false);
  const isMobile = useDeviceStore((state) => state.isMobile);

  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const promptTimeout = useRef(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    setAnimate(true);
  }, []);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event) => {
      // Prevent the mini-infobar from appearing on mobile
      event.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(event);
      // Show the install prompt
      setShowInstallPrompt(true);

      // Clear any existing timeouts
      if (promptTimeout.current) {
        clearTimeout(promptTimeout.current);
      }

      // Hide the prompt automatically after 10 seconds
      promptTimeout.current = setTimeout(() => {
        setShowInstallPrompt(false);
      }, 10000);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      if (promptTimeout.current) {
        clearTimeout(promptTimeout.current);
      }
    };
  }, []);

  const scrollToSection = () => {
    sectionRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the A2HS prompt");
        } else {
          console.log("User dismissed the A2HS prompt");
        }
        setDeferredPrompt(null);
        setShowInstallPrompt(false);
      });
    }
  };

  const handleInstallClose = () => {
    setShowInstallPrompt(false);
  };
  return (
    <>
      <div
        className="w-full mx-auto"
        style={{ fontFamily: "'IBM Plex Sans KR', sans-serif" }}
      >
        {/* 메인 Section */}
        <section
          id="서비스 소개"
          className="py-2 text-center px-6 bg-cover bg-center bg-no-repeat flex flex-col justify-center items-center overflow-hidden"
          style={{
            backgroundImage: "url('/assets/메인/talk.webp')",
            height: "75vh",
          }}
        >
          <h1
            className={`text-4xl font-bold text-white transform -translate-y-32 
            ${animate ? "animate-dropInTitle" : ""}
          `}
          >
            WELCOME TO WAVA
          </h1>
          <p className="text-lg mt-2 text-white transform -translate-y-32">
            Work And Vacation’s Assistant
          </p>
        </section>

        {/* 카드 섹션 */}
        <section className="container mx-auto px-4 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div
              onClick={scrollToSection}
              className="aspect-w-4 aspect-h-3 cursor-pointer"
            >
              <img
                src={`/assets/메인/진행중인 워케이션.webp`}
                alt="진행중인 워케이션"
                className="object-cover w-full h-full rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
              />
            </div>
            <div className="aspect-w-4 aspect-h-3">
              <Link to="/dashboard">
                <img
                  src={`/assets/메인/대시보드.webp`}
                  alt="대시보드"
                  className="object-cover w-full h-full rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
                />
              </Link>
            </div>
            <div className="aspect-w-4 aspect-h-3">
              <Link to="/channel/group/discover-groups">
                <img
                  src={`/assets/메인/모임 채널.webp`}
                  alt="모임 채널"
                  className="object-cover w-full h-full rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
                />
              </Link>
            </div>
            <div className="aspect-w-4 aspect-h-3">
              <Link to="/channel/feed">
                <img
                  src={`/assets/메인/개인 채널.webp`}
                  alt="개인 채널"
                  className="object-cover w-full h-full rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
                />
              </Link>
            </div>
          </div>
        </section>

        {/* 워케이션 소개 Section */}
        <section
          id="워케이션 소개"
          className="relative py-2 text-center px-6 bg-cover bg-center bg-no-repeat flex flex-col justify-center items-center overflow-hidden"
          style={{
            backgroundImage: "url('/assets/메인/fire.webp')",
            height: "95vh",
          }}
        >
          <h1 className="text-4xl font-bold text-white transform -translate-y-64">
            워케이션이란?
          </h1>
          <div
            className={`absolute bottom-0 right-0 text-right p-4 ${
              isMobile ? "bg-black bg-opacity-30 rounded-lg w-full" : ""
            }`}
          >
            <p
              className={`mt-2 text-white ${isMobile ? "text-sm" : "text-lg"}`}
            >
              Work(일), Vacation(휴가)의 합성어로,
            </p>
            <p
              className={`mt-2 text-white ${isMobile ? "text-sm" : "text-lg"}`}
            >
              집과 사무실에서 벗어나
            </p>
            <p
              className={`mt-2 text-white ${isMobile ? "text-sm" : "text-lg"}`}
            >
              휴가지에서 업무와 휴식을 동시에 경험하는
            </p>
            <p
              className={`mt-2 text-white ${isMobile ? "text-sm" : "text-lg"}`}
            >
              새로운 근무제도를 뜻합니다.
            </p>
            <p
              className={`mt-2 text-white ${isMobile ? "text-sm" : "text-lg"}`}
            >
              WAVA에서
            </p>
            <p
              className={`mt-2 text-white ${isMobile ? "text-sm" : "text-lg"}`}
            >
              일(Work)상에서 쉼표가 되는 순간을 기대해주세요!
            </p>
          </div>
        </section>

        {/* 진행중인 워케이션 */}
        <section
          ref={sectionRef}
          id="진행중인 워케이션"
          className="py-16 text-center px-6 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/assets/bgbg.webp')" }}
        >
          <h2 className="text-3xl font-semibold mb-5 text-white">
            진행중인 워케이션
          </h2>
          <Carousel />
        </section>
        {/* 기대효과 섹션 */}
        <ExpectationSection />
      </div>

      {/* 설치 권유창 */}
      <div
        className={`fixed inset-x-0 bottom-4 flex justify-center transition-all duration-[400ms] ease-in-out ${
          showInstallPrompt
            ? "visible opacity-100 translate-y-0"
            : "invisible opacity-0 translate-y-4"
        }`}
      >
        <div className="p-4 mb-4 bg-slate-400 shadow-lg rounded-lg">
          <p className="text-center text-base mb-3 font-medium text-white">
            WAVA를 설치하고 더 빠르고 편리하게 이용하세요!
          </p>
          <div className="flex justify-center space-x-3">
            <button
              onClick={handleInstallClick}
              className="bg-mainBlue text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-lg"
            >
              확인
            </button>
            <button
              onClick={handleInstallClose}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200 shadow-lg"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default HomePage;

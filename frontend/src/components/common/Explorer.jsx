import React, { useEffect, useState } from "react";
import useDeviceStore from "../../store/deviceStore";

const Explorer = () => {
  const isMobile = useDeviceStore((state) => state.isMobile);

  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  // 대시보드, 채널에서 사용하는 navbar
  return (
    <>
      {/* Explorer 컴포넌트의 너비를 비례적으로 조정 */}
      <div
        className={`relative ${
          isMobile ? "w-[70px]" : "w-1/12 min-w-[80px] "
        } max-w-[110px]`}
      >
        <div
          className={`bg-gray-800 text-white h-full p-4 min-h-[500px]  ${
            animate ? "animate-slideIn" : ""
          }}`}
        >
          <h1
            className={`text-2xl ${animate ? "animate-dropIn" : ""}`}
            style={{ fontSize: "1.25rem" }}
          >
            홈
          </h1>
          <h2
            className={`text-xl mt-4 ${animate ? "animate-dropIn" : ""}`}
            style={{ fontSize: "1rem" }}
          >
            채널
          </h2>
        </div>
      </div>
    </>
  );
};

export default Explorer;

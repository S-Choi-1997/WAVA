import { create } from "zustand";
import { persist } from "zustand/middleware";
import { login, logout } from "../api/userApi";
import { httpStatusCode } from "../util/http-status";
import Swal from "sweetalert2";

const useUserStore = create(
  persist(
    (set, get) => ({
      isLogin: false,
      isLoginError: false,
      isValidToken: false,
      userInfo: null,
      loginFunc: async (user) => {
        try {
          await login(
            user,
            (response) => {
              console.log("여기");
              console.log(response.status);
              if (response.status === httpStatusCode.OK) {
                console.log("로그인 성공");
                let accessToken = response.headers["authorization"];
                let refreshToken = response.headers["refreshtoken"];
                set(() => ({ isLogin: true }));
                set(() => ({ isLoginError: false }));
                set(() => ({ isValidToken: true }));
                const { nickName, worcation, profile } = response?.data;
                set(() => ({ userInfo: { nickName, profile, worcation } }));
                sessionStorage.setItem("accessToken", accessToken);
                sessionStorage.setItem("refreshToken", refreshToken);
              }
            },
            async (error) => {
              const errorMessage = error.response.data.msg;
              await Swal.fire({
                position: "center",
                icon: "error",
                titleText: errorMessage || "네트워크 연결을 확인해 주세요",
                showConfirmButton: false,
                timer: 2500,
              });
              console.log("로그인 실패");
              console.log(error);
              set(() => ({ isLogin: false }));
              set(() => ({ isLoginError: true }));
              set(() => ({ isValidToken: false }));
            }
          );
        } catch (e) {
          console.error("네트워크 에러");
        }
      },
      logoutFunc: async () => {
        try {
          const token = {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
            },
          };
          await logout(
            token,
            (response) => {
              if (response.status === httpStatusCode.OK) {
                console.log("로그아웃 성공");
                set(() => ({ isLogin: false }));
                set(() => ({ isLoginError: false }));
                set(() => ({ isValidToken: false }));
                sessionStorage.removeItem("accessToken");
                sessionStorage.removeItem("refreshToken");
                localStorage.removeItem("userStorage");
              } else {
                console.error("로그인 정보 없음");
              }
            },
            (error) => {
              console.log(error);
            }
          );
        } catch (e) {
          console.error("네트워크 에러");
        }
      },
    }),
    {
      name: "userStorage",
    }
  )
);

export default useUserStore;

import axios from "axios";

// function localAxios() {
//   const instance = axios.create({
//     baseURL: process.env.REACT_APP_SERVER_ADDRESS,
//   });
//   instance.defaults.headers.common["Authorization"] = "";
//   instance.defaults.headers.common["Content-Type"] = "application/json";

//   return instance;
// }

// export { localAxios };

// 싱글턴 패턴으로 axios 인스턴스 생성
const localAxios = axios.create({
  baseURL: process.env.REACT_APP_SERVER_ADDRESS,
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터 설정
localAxios.interceptors.request.use(
  (config) => {
    // 로컬 스토리지에서 토큰을 읽어오기
    const token = sessionStorage.getItem("accessToken");

    console.log(token);
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => console.log(error)
  // (error) => Promise.reject(error)
);

// 응답 인터셉터 설정
localAxios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 401 Unauthorized: 토큰 만료 혹은 인증 실패
    if (error.response.status === 401) {
      console.log("토큰이 만료되었습니다.");

      // 토큰을 갱신하는 비동기 함수 호출,
      return refreshToken().then((newToken) => {
        // 새 토큰으로 axios config 설정
        error.config.headers["Authorization"] = `Bearer ${newToken}`;
        // 새 토큰으로 원래 요청 재시도
        return axios.request(error.config);
      });
    }
    return Promise.reject(error);
  }
);

function refreshToken() {
  const token = sessionStorage.getItem("accessToken");
  const re_token = sessionStorage.getItem("refreshToken");
  // 토큰을 갱신하는 로직을 작성
  return axios
    .post(
      process.env.REACT_APP_SERVER_ADDRESS + "/user/reissue",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          refreshToken: re_token,
        },
      }
    )
    .then((response) => {
      console.log(response);
      let accessToken = response.headers["authorization"];
      let refreshToken = response.headers["refreshtoken"];

      sessionStorage.setItem("accessToken", accessToken);
      sessionStorage.setItem("refreshToken", refreshToken);

      return accessToken;
    })
    .catch((e) => {
      sessionStorage.removeItem("userStorage");
      sessionStorage.removeItem("accessToken");
      sessionStorage.removeItem("refreshToken");
      console.error(e + " 장시간 미사용으로 로그아웃되었습니다");
    });
}

export { localAxios };

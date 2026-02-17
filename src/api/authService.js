import axios from 'axios';

// 🚀 내 컴퓨터 IP 주소로 설정하세요 (예: 192.168.x.x)
const API_URL = 'http://192.168.x.x:8080/api/v1'; 

// 1. 아이디 중복 확인 (회원가입용)
export const checkIdDuplicate = async (loginId) => {
  try {
    const response = await axios.post(`${API_URL}/auth/check-id`, { loginId });
    return { available: response.data.available, message: response.data.message };
  } catch (error) {
    if (error.response && error.response.status === 400) {
      return { available: false, message: error.response.data.message || "이미 사용 중인 아이디입니다." };
    }
    return { available: false, message: "서버 통신 오류가 발생했습니다." };
  }
};

// 2. 전화번호 중복 확인 (회원가입용)
export const checkPhoneDuplicate = async (phoneNumber) => {
  try {
    const response = await axios.post(`${API_URL}/auth/check-phone`, { phoneNumber });
    return { available: response.data.available, message: response.data.message };
  } catch (error) {
    if (error.response && error.response.status === 400) {
      return { available: false, message: error.response.data.message || "이미 등록된 번호입니다." };
    }
    return { available: false, message: "통신 오류가 발생했습니다." };
  }
};

// 3. ✨ 새로 추가: 계정 확인 함수 (비밀번호 찾기용)
export const checkAccountExists = async (loginId, phoneNumber) => {

    // 🚀 [가짜 테스트 모드]
  // 서버에 요청을 보내는 대신, 0.5초 기다렸다가 결과를 바로 반환합니다.
  return new Promise((resolve) => {
    setTimeout(() => {
      // 테스트하고 싶은 시나리오에 따라 true/false를 바꿔보세요.
      if (loginId === "test" && phoneNumber === "010-1234-5678") {
        resolve({ status: "200", message: "계정이 확인되었습니다." });
      } else {
        // 일부러 실패를 보고 싶을 때
        resolve({ status : "400", message: "일치하는 정보가 없습니다." });
      }
    }, 500);
  });
  //🔗 나중에 진짜 서버 연결할 때 이 주석을 푸세요!
  /*try {
    const response = await axios.post(`${API_URL}/auth/find-account`, { loginId, phoneNumber });
    return { exists: true, message: response.data.message };
  } catch (error) {
    return { exists: false, message: error.response?.data?.message || "계정을 찾을 수 없습니다." };
  }*/
};

// 4. 최종 회원가입 (fetch -> axios로 변경)
export const signupUser = async (finalData) => {
  try {
    // 🚀 axios는 status 2xx가 아니면 자동으로 catch로 던져서 처리가 편합니다.
    const response = await axios.post(`${API_URL}/auth/signup`, finalData);
    return response; 
  } catch (error) {
    throw error;
  }
};

// 5. 로그인
export const loginUser = async (loginId, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, { loginId, password });
    return response.data; // 명세서의 중첩된 데이터 구조 반영
  } catch (error) {
    throw error;
  }
};

// [가짜] 서버 없이 우리끼리 테스트할 때
export const verifyAuthCode = async (phoneNumber, code, type) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 🚀 내가 정한 번호 "123456"이 오면 무조건 성공(200)을 보내줌!
      if (code === "123456") {
        resolve({ status: "200", message: "성공!" });
      } else {
        resolve({ status: "400", message: "인증번호가 틀려요." });
      }
    }, 500); // 0.5초 기다리는 척 하기
  });
};
/*// 🚀 인증번호 검증 (리얼 서버 연결용) 실제 연결시 주석해제
export const verifyAuthCode = async (phoneNumber, code, type) => {
  try {
    // 명세서 규격: phoneNumber, code, type (ENUM)
    const response = await axios.post(`${API_URL}/auth/verify`, {
      phoneNumber, // 예: "010-1234-5678"
      code,        // 예: "123456"
      type         // 예: "signup", "findid", "findpw"
    });

    // status 200 성공 시 응답 반환
    return response.data; 
  } catch (error) {
    // status 400 등 에러 발생 시 처리
    if (error.response) {
      return error.response.data; // 서버가 보낸 "인증번호가 올바르지 않습니다" 메시지 활용
    }
    throw new Error("통신 오류가 발생했습니다.");
  }
};*/
import client from './client'; // 🚀 우리가 만든 axios 인스턴스 사용

// 🚀 true면 가짜 로직(123456 등)으로 작동, false면 실제 서버로 요청 보냄!
const IS_TEST_MODE = true; 

/**
 * 1. 아이디 중복 확인
 */
export const checkIdDuplicate = async (loginId) => {
  if (IS_TEST_MODE) {
    return { available: loginId !== 'admin', message: loginId === 'admin' ? "이미 사용 중인 아이디입니다." : "사용 가능한 아이디입니다." };
  }

  try {
    const response = await client.post('/auth/verify-id', { loginId });
    return response.data;
  } catch (error) {
    return { available: false, message: error.response?.data?.message || "중복 확인 오류" };
  }
};

/**
 * 2. 전화번호 중복 확인
 */
export const checkPhoneDuplicate = async (phoneNumber) => {
  if (IS_TEST_MODE) return { available: true, message: "사용 가능한 번호입니다." };

  try {
    const response = await client.post('/auth/verify-phone', { phoneNumber });
    return response.data;
  } catch (error) {
    return { available: false, message: error.response?.data?.message || "번호 확인 오류" };
  }
};

/**
 * 3. 계정 확인 (비밀번호 찾기용)
 */
export const checkAccountExists = async (loginId, phoneNumber) => {
  if (IS_TEST_MODE) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // 테스트용: 아이디 'test', 전번 '010-1234-5678'일 때만 성공
        if (loginId === "test" && phoneNumber.includes("1234-5678")) {
          resolve({ status: 200, message: "계정이 확인되었습니다." });
        } else {
          resolve({ status: 400, message: "일치하는 정보가 없습니다." });
        }
      }, 500);
    });
  }

  try {
    const response = await client.post('/auth/find-id', { loginId, phoneNumber });
    return response.data;
  } catch (error) {
    return { status: 400, message: error.response?.data?.message || "계정 없음" };
  }
};

/**
 * 4. 인증번호 검증 (회원가입/비번찾기 공통)
 */
export const verifyAuthCode = async (phoneNumber, code, type) => {
  if (IS_TEST_MODE) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (code === "123456") {
          resolve({ status: 200, message: "성공!" });
        } else {
          resolve({ status: 400, message: "인증번호가 틀려요." });
        }
      }, 500);
    });
  }

  try {
    // type: 'SIGNUP', 'FIND_ID', 'FIND_PW' 등 백엔드 규격에 맞춤
    const response = await client.post('/auth/verify-number', { phoneNumber, code, type });
    return response.data;
  } catch (error) {
    return error.response?.data || { status: 400, message: "통신 오류" };
  }
};

/**
 * . 회원가입용 인증번호 전송 (/auth/signup-sendnum)
 */
export const sendSignupAuthCode = async (phoneNumber) => {
  if (IS_TEST_MODE) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // 테스트 모드일 때는 무조건 성공 응답을 보냄
        resolve({ status: 200, message: "테스트용 인증번호가 발송되었습니다. (123456)" });
      }, 500);
    });
  }

  // 실제 서버 연결 시 이미지 속 URL 사용
  const response = await client.post('/auth/signup-sendnum', { phoneNumber });
  return response.data;
};

/**
 * 5. 최종 회원가입 (테스트 모드 대응)
 */
export const signupUser = async (finalData) => {
  if (IS_TEST_MODE) {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("🛠️ 가입 전송 데이터 확인:", finalData);
        // 서버에서 오는 성공 응답 규격을 흉내냅니다.
        resolve({ status: 200, message: '회원가입이 성공적으로 완료되었습니다.' });
      }, 1000);
    });
  }

  // 실제 서버 연결 시
  const response = await client.post('/auth/signup', finalData);
  return response.data;
};

/**
 * 6. 로그인 (테스트용 계정: test / 1234)
 */
export const loginUser = async (loginId, password) => {
  if (IS_TEST_MODE) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (loginId === 'test' && password === '1234') {
          resolve({
            status: 200,
            data: {
              //userToken: 'mock-token-for-testing-12345', // 메인 진입용 가짜 토큰
              //userName: '테스터',
              //loginId: 'test'
              token: {accessToken:'mock-token-12345'},
              user: {userId: 1,userName:'테스터'}
            }
          });
        } else {
          // 일부러 실패 응답을 줘서 UI의 에러 처리를 확인합니다.
          resolve({ status: 401, message: '아이디 또는 비밀번호가 틀렸습니다.' });
        }
      }, 800);
    });
  }

  // 실제 서버 연결 시
  const response = await client.post('/auth/login', { loginId, password });
  return response.data;
};

export const requestSignupAuth = async (phoneNumber) => {
  try {
    // 1단계: 전화번호 중복 확인 (/auth/verify-phone)
    const checkResult = await checkPhoneDuplicate(phoneNumber);
    
    // 테스트 모드거나 서버 응답이 '사용 가능'일 때만 다음으로 진행
    if (checkResult.available || checkResult.status === 200) {
      // 2단계: 중복이 아니면 인증번호 발송 (/auth/signup-sendnum)
      return await sendSignupAuthCode(phoneNumber);
    } else {
      // 이미 가입된 번호라면 해당 메시지 반환
      return { status: 400, message: checkResult.message || "이미 등록된 번호입니다." };
    }
  } catch (error) {
    return { status: 500, message: "통신 중 오류가 발생했습니다." };
  }
};
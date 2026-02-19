import client from './client';

const IS_TEST_MODE = true; // 🚀 실제 서버 연결 시 false로 변경

/**
 * 1. 내 프로필 정보 조회 (/users/me/dashboard)
 * 마이페이지 메인 대시보드 데이터를 가져옵니다.
 */
export const getMyProfile = async () => {
  if (IS_TEST_MODE) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          status: 200,
          message: "마이페이지 조회 성공",
          data: {
            loginId: "pastus_id",   // 명세서 규격
            useName: "홍길동",      // 주의: userName이 아니라 useName
            profileImageUrl: null,
            stats: {                // 🚀 중첩 구조
              postCount: 4,
              trustScore: 50,       // 시안에 맞춘 50점
              tokenBalance: 8       // 시안에 맞춘 8개
            }
          }
        });
      }, 300);
    });
  }

  try {
    const response = await client.get('/users/me/dashboard'); // 실제 엔드포인트
    return response.data;
  } catch (error) {
    // 🚀 에러 발생 시 상세 정보 로그 출력
    console.error("대시보드 로드 실패:", error.response?.data || error.message);
    throw error; // UI 컴포넌트에서 에러를 처리할 수 있게 던집니다.
  }
};

/**
 * 2. 계정 상세 정보 조회 (/users/me/detail)
 * 계정 설정 페이지에 필요한 상세 정보를 가져옵니다.
 */
export const getAccountDetail = async () => {
  if (IS_TEST_MODE) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          status: 200,
          data: {
            profileImageUrl: null,
            userName: "홍길동",
            gender: "M",
            birthDate: "2000-08-31",
            phoneNumber: "010-1234-5678",
            loginId: "pastus_id",
            hasPassword: true,
            subscriptionType: "FREE",
            socialProviders: [
              { type: 'GOOGLE', linked: true, email: 'skhu12345@gmail.com' },
              { type: 'NAVER', linked: false, email: null },
              { type: 'KAKAO', linked: false, email: null }
            ]
          }
        });
      }, 500);
    });
  }

  try {
    const response = await client.get('/users/me/detail'); // 실제 엔드포인트
    return response.data;
  } catch (error) {
    console.error("계정 상세 정보 조회 실패:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * 3. 계정 정보 수정 (아이디/프로필사진 등) (/users/me/detail)
 * 계정 설정에서 수정한 정보를 서버에 반영합니다.
 */
export const updateAccountInfo = async (updateData) => {
  if (IS_TEST_MODE) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          status: 200,
          message: "회원정보가 수정되었습니다.",
          data: {
            userId: 101,
            loginId: updateData.loginId || "new_id",
            profileImageUrl: updateData.profileImageUrl || null
          }
        });
      }, 500);
    });
  }

  try {
    // 🚀 부분 수정을 위해 PATCH 메서드 사용
    const response = await client.patch('/users/me/detail', updateData);
    return response.data;
  } catch (error) {
    console.error("계정 정보 수정 실패:", error.response?.data || error.message);
    // 💡 400 에러 등 구체적인 실패 사유가 있다면 이를 반환
    return error.response?.data || { status: 400, message: "수정 중 오류 발생" };
  }
};
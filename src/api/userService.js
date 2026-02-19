import client from './client';

const IS_TEST_MODE = true; // 🚀 나중에 실제 서버 연결 시 false로 변경

/**
 * 내 프로필 정보 조회 (/users/me/dashboard)
 */
export const getMyProfile = async () => {
  if (IS_TEST_MODE) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          status: 200,
          data: {
            userId: 1,
            userName: "테스터",
            trustScore: 85,
            tokenBalance: 120,
          }
        });
      }, 300);
    });
  }
  const response = await client.get('/users/me/dashboard');
  return response.data;
};

// 🚀 계정 상세 정보 조회(/users/me/detail)
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
            ] // 🚀 여기를 ['NAVER']나 ['KAKAO']로 바꾸면 화면도 바뀜
          }
        });
      }, 500);
    });
  }
  const response = await client.get('/users/me/detail');
  return response.data;
};

// 🚀 계정 정보 수정 (아이디/프로필사진 등)(/users/me/detail)
export const updateAccountInfo = async (updateData) => {
  if (IS_TEST_MODE) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          status: 200,
          message: "회원정보가 수정되었습니다.",
          data: {
            userId: 101,
            loginId: updateData.loginId || "new_id", // 보낸 아이디가 있으면 적용
            profileImageUrl: updateData.profileImageUrl || null
          }
        });
      }, 500);
    });
  }
  // 실제 PATCH 요청
  const response = await client.patch('/users/me/detail', updateData);
  return response.data;
};
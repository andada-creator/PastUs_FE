import client from './client';

const IS_TEST_MODE = true; 

/**
 * 내 프로필 정보 조회 (/users/me)
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
  const response = await client.get('/users/me');
  return response.data;
};
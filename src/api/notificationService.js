// src/api/notificationService.js
const IS_TEST_MODE = true; // 🚀 나중에 실제 백엔드 연결 시 false로만 바꾸면 끝!

/**
 * 알림 상세 조회 (/notifications/{id})
 */
export const getNotificationDetail = async (id) => {
  if (IS_TEST_MODE) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          status: 200,
          data: {
            id: id,
            date: "2026.02.20",
            sender: "운영자",
            content: `${id}번 알림에 대한 테스트 데이터입니다. IS_TEST_MODE가 켜져 있어서 이 내용이 보입니다.`
          }
        });
      }, 500);
    });
  }

  // 🚀 실제 서버 연결 시 로직
  try {
    const response = await client.get(`/notifications/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};
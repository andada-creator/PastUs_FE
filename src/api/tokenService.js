import * as SecureStore from 'expo-secure-store';

const BASE_URL = 'http://백엔드주소/api/v1/tokens';

/**
 * 토큰 관련 공통 통신 함수
 * @param {string} type - 'earn'(적립) 또는 'deduct'(차감)
 * @param {object} params - { amount, reason, refId }
 */
export const requestTokenAction = async (type, { amount, reason, refId = null }) => {
  try {
    // 1. 보안 저장소에서 출입증(토큰) 꺼내기
    const userToken = await SecureStore.getItemAsync('userToken');

    // 2. 서버에 요청 보내기
    const response = await fetch(`${BASE_URL}/${type}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${userToken}`, // 내 신분 증명
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount, reason, refId }), // 명세서 데이터 규격
    });

    const result = await response.json();

    if (response.ok) {
      return result; // { success: true, remainingTokens: 150 }
    } else {
      // 서버에서 보낸 에러 메시지(예: 토큰 부족) 처리
      throw new Error(result.message || '토큰 처리 중 오류가 발생했습니다.');
    }
  } catch (error) {
    console.error(`Token ${type} Error:`, error.message);
    throw error;
  }
};
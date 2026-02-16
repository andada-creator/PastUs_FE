import axios from 'axios';

const API_URL = 'https://api.pastus.com'; // 실제 서버 주소

//아이디 중복 확인
export const checkIdDuplicate = async (loginId) => {
  try {
    const response = await axios.post(`${API_URL}/auth/check-id`, 
      { loginId }, // 명세서 요구사항: key값 "loginId"
      { headers: { 'Content-Type': 'application/json' } } // Request Header 적용
    );

    // status 200~1인 경우: 사용 가능
    return {
      available: response.data.available,
      message: response.data.message
    };
  } catch (error) {
    // status 400 등 에러가 발생한 경우: 중복된 아이디
    if (error.response && error.response.status === 400) {
      return {
        available: false,
        message: error.response.data.message || "중복된 아이디입니다."
      };
    }
    return { available: false, message: "서버 통신 오류가 발생했습니다." };
  }
};

export const signupUser = async (finalData) => {
  try {
    const response = await fetch('http://백엔드주소/api/v1/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(finalData),
    });
    return response;
  } catch (error) {
    throw error;
  }
};

//전화번호 중복 확인 
export const checkPhoneDuplicate = async (phoneNumber) => {
  try {
    const response = await axios.post(`${API_URL}/auth/check-phone`, //<- 백엔드 api_url연결!
      { phoneNumber }, // 명세서 요구사항: "010-1234-5678" 형식
      { headers: { 'Content-Type': 'application/json' } }
    );
    return { available: response.data.available, message: response.data.message };
  } catch (error) {
    if (error.response && error.response.status === 400) {
      return { available: false, message: error.response.data.message || "이미 등록된 번호입니다."};
    }
    return { available: false, message: "통신 오류가 발생했습니다." };
  }
};

// src/api/authService.js

export const loginUser = async (loginId, password) => {
  try {
    // 명세서 규격: POST, application/json, loginId/password
    const response = await axios.post(`${API_URL}/auth/login`,  //API_URL 백엔드!!L
      { loginId, password },
      { headers: { 'Content-Type': 'application/json' } }
    );
    
    // 성공 시 전체 데이터 반환 (status 200)
    return response.data; 
  } catch (error) {
    // 401 에러(Invalid credentials) 등 처리
    throw error;
  }
};
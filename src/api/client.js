import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const client = axios.create({
  baseURL: 'http://192.168.219.168:8080', //
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청을 보내기 전, 저장소에서 토큰을 꺼내 헤더에 삽입합니다.
client.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default client;


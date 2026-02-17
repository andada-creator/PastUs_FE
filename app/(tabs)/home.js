import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';

export default function HomeScreen() {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. 화면이 열리자마자 실행되는 useEffect
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      // 2. 폰에 저장해둔 '출입증(토큰)'을 꺼냅니다.
      const token = await SecureStore.getItemAsync('userToken');

      if (!token) {
        Alert.alert("로그인 필요", "다시 로그인해주세요.");
        return;
      }

      // 3. 서버에 프로필 정보를 요청합니다. (명세서 2-3번)
      const response = await fetch('http://백엔드주소/api/v1/users/me', {
        method: 'GET',
        headers: {
          // [핵심] 헤더에 토큰을 실어서 보냅니다.
          'Authorization': `Bearer ${token}`, 
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        // 4. 받아온 유저 정보를 상태(State)에 저장합니다.
        setUserInfo(data); 
      } else {
        console.log("프로필 로드 실패");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <ActivityIndicator size="large" />;

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: 'center' }}>
      {/* 5. 서버에서 받아온 실제 데이터를 화면에 뿌려줍니다. */}
      <Text style={{ fontSize: 20 }}>{userInfo?.userName}님, 반갑습니다!</Text>
      <Text>현재 신뢰도 점수: {userInfo?.trustScore}점</Text>
      <Text>보유 토큰: {userInfo?.tokenBalance}개</Text>
      <Text>요금제: {userInfo?.plan === 'PRO' ? '💎 프로 버전' : '🌱 무료 버전'}</Text>
    </View>
  );
}
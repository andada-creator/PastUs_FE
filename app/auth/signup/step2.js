//아이디 중복 체크와 비밀번호 일치 여부를 실시간으로 확인하고, 계정 생성을 완료하는 화면입니다.

import React, { useState } from 'react';
import { View, TextInput, Text, Pressable, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

// 분리된 자원들 임포트
import { styles } from '../../../src/styles/authStyles';
import { checkIdDuplicate, signupUser } from '../../../src/api/authService';

export default function SignupStep2() {
  const router = useRouter();
  
  // 1. Step 1에서 넘어온 데이터 보따리 풀기
  const params = useLocalSearchParams(); 

  // 2. 입력값 및 상태 관리
  const [id, setId] = useState('');
  const [idMessage, setIdMessage] = useState('');
  const [isIdAvailable, setIsIdAvailable] = useState(false);
  const [pw, setPw] = useState('');
  const [pwCheck, setPwCheck] = useState('');

  // 3. 아이디 중복 체크 (실제 API 연결)
  const handleIdChange = async (text) => {
    setId(text);
    // 4~10자 사이일 때만 서버에 물어봅니다
    if (text.length >= 4 && text.length <= 10) {
      const result = await checkIdDuplicate(text); // 우리가 만든 API 함수
      setIsIdAvailable(result.available);
      setIdMessage(result.message);
    } else {
      setIdMessage(text.length > 0 ? '아이디는 4~10자 사이여야 합니다.' : '');
      setIsIdAvailable(false);
    }
  };

  // 4. 유효성 검사 로직
  const isPwMismatch = pw !== pwCheck && pwCheck.length > 0;
  // 버튼 활성화: 아이디 사용 가능 + 비번 입력됨 + 비번 일치
  const isSubmitDisabled = !isIdAvailable || !pw || !pwCheck || isPwMismatch;

  // 5. 최종 회원가입 함수
  const handleSignup = async () => {
    try {
      // params에서 꺼내올 때 안전하게 처리
      const formattedBirth = (params.birth || "").replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
      const formattedPhone = (params.phone || "").replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
      
      const finalData = {
        loginId: id,
        password: pw,
        confirmPassword: pwCheck,
        userName: params.userName,
        birthDate: formattedBirth,
        gender: params.gender === 'MALE' ? 'M' : 'F',
        phoneNumber: formattedPhone,
        thirdPartyConsent: params.thirdPartyConsent === 'true',
        marketingConsent: params.marketingConsent === 'true',
      };

      console.log("서버 전송 데이터:", finalData);

      // 분리해둔 signupUser API 함수 호출
      const response = await signupUser(finalData);

      if (response.ok) {
        Alert.alert("가입 완료", `${params.userName}님, 환영합니다!`);
        router.replace('/auth/login');
      } else {
        const errorData = await response.json();
        Alert.alert("가입 실패", errorData.message || "정보를 다시 확인해주세요.");
      }
    } catch (error) {
      Alert.alert("에러", "서버와 통신 중 문제가 발생했습니다.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>PastUs</Text>

      {/* 아이디 입력 영역 */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>아이디</Text>
        <TextInput
          // 에러가 있을 때만 빨간 테두리 적용
          style={[styles.input, idMessage && !isIdAvailable && styles.inputError]}
          placeholder="아이디를 입력해주세요"
          value={id}
          onChangeText={handleIdChange} // setId 대신 handleIdChange 사용!
          autoCapitalize="none"
          maxLength={10}
        />
        {/* 서버 메시지 또는 유효성 메시지 표시 */}
        {idMessage ? (
          <Text style={isIdAvailable ? styles.successText : styles.errorText}>
            {idMessage}
          </Text>
        ) : null}
      </View>

      {/* 비밀번호 입력 영역 */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>비밀번호</Text>
        <TextInput
          style={styles.input}
          placeholder="비밀번호를 입력해주세요"
          value={pw}
          onChangeText={setPw}
          secureTextEntry
        />
      </View>

      {/* 비밀번호 확인 영역 */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>비밀번호 확인</Text>
        <TextInput
          style={[styles.input, isPwMismatch && styles.inputError]}
          placeholder="비밀번호를 다시 입력해주세요"
          value={pwCheck}
          onChangeText={setPwCheck}
          secureTextEntry
        />
        {isPwMismatch && <Text style={styles.errorText}>비밀번호가 일치하지 않습니다.</Text>}
      </View>

      {/* 가입하기 버튼 */}
      <Pressable
        style={[styles.submitButton, isSubmitDisabled && styles.disabledButton]}
        onPress={handleSignup}
        disabled={isSubmitDisabled}
      >
        <Text style={styles.submitButtonText}>가입하기</Text>
      </Pressable>
    </View>
  );
}


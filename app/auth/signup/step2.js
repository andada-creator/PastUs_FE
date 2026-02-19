//아이디 중복 체크와 비밀번호 일치 여부를 실시간으로 확인하고, 계정 생성을 완료하는 화면입니다.

import React, { useState } from 'react';
import { View, TextInput, Text, Pressable, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

// 🚀 [수정] 통일된 스타일과 서비스 함수 임포트
import { styles } from '../../../src/styles/authStyles';
import { checkIdDuplicate, signupUser } from '../../../src/api/authService';

export default function SignupStep2() {
  const router = useRouter();
  const params = useLocalSearchParams(); 

  const [id, setId] = useState('');
  const [idMessage, setIdMessage] = useState('');
  const [isIdAvailable, setIsIdAvailable] = useState(false);
  const [pw, setPw] = useState('');
  const [pwCheck, setPwCheck] = useState('');

  // 1. 아이디 중복 체크 (서비스 함수 호출로 다이어트!)
  const handleIdChange = async (text) => {
    setId(text);
    
    if (text.length >= 4 && text.length <= 10) {
      // 🚀 authService 내부의 테스트 모드 로직이 실행됩니다.
      const result = await checkIdDuplicate(text);
      setIsIdAvailable(result.available);
      setIdMessage(result.message);
    } else {
      setIdMessage(text.length > 0 ? '아이디는 4~10자 사이여야 합니다.' : '');
      setIsIdAvailable(false);
    }
  };

  // 2. 유효성 검사 로직 (실시간 반영)
  const isPwMismatch = pw !== pwCheck && pwCheck.length > 0;
  const isSubmitDisabled = !isIdAvailable || !pw || !pwCheck || isPwMismatch;

  // 3. 최종 회원가입 함수
  const handleSignup = async () => {
    try {
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

      console.log("🛠️ 회원가입 시도 데이터:", finalData);

      // 🚀 서비스 함수 호출 (테스트 모드일 땐 가짜 성공 반환)
      const response = await signupUser(finalData);

      // axios 응답(response.status) 또는 가짜 응답 처리
      if (response.status === 200 || response.status === "200") {
        Alert.alert("가입 완료", `${params.userName}님, 환영합니다!`, [
          { text: "확인", onPress: () => router.replace('/auth/login') }
        ]);
      } else {
        Alert.alert("가입 실패", response.message || "정보를 다시 확인해주세요.");
      }
    } catch (error) {
      Alert.alert("에러", "서버와 통신 중 문제가 발생했습니다.");
    }
  };

  return (
    <View style={styles.step2Container}>
      <Text style={styles.title}>PastUs</Text>

      {/* 아이디 입력 영역 */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>아이디</Text>
        <TextInput
          style={[styles.input, idMessage && !isIdAvailable && styles.inputError]}
          placeholder="아이디를 입력해주세요"
          value={id}
          onChangeText={handleIdChange}
          autoCapitalize="none"
          maxLength={10}
        />
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
//아이디 중복 체크와 비밀번호 일치 여부를 실시간으로 확인하고, 계정 생성을 완료하는 화면입니다.

import React, { useState } from 'react';
import { View, TextInput, Text, Pressable, StyleSheet, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function SignupStep2() {
  const router = useRouter();
  
  // 1. Step 1에서 넘어온 데이터 보따리 풀기
  const { 
    userName = "", 
    birth = "", 
    gender = "MALE", 
    phone = "", 
    thirdPartyConsent = "false", 
    marketingConsent = "false" 
  } = useLocalSearchParams();

  // 2. 입력값 상태 관리
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [pwCheck, setPwCheck] = useState('');

  // 3. 유효성 검사 로직 (백엔드 명세 반영)
  const isIdInvalidRange = id.length > 0 && (id.length < 4 || id.length > 10); // 4~10자
  const isIdDup = id === 'hong1999'; // 디자인 예시용 중복 아이디
  const isPwMismatch = pw !== pwCheck && pwCheck.length > 0;

  // 4. 최종 회원가입 함수
  const handleSignup = async () => {
    try {
      // 날짜 형식 변환 (YYYYMMDD -> YYYY-MM-DD)
      const formattedBirth = (birth || "").replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
      
      const finalData = {
        loginId: id,
        password: pw, // 서버에서 VARCHAR(255)로 암호화 저장됨
        userName: userName,
        birthDate: formattedBirth,
        gender: gender, // 'MALE' | 'FEMALE'
        phoneNumber: (phone || "").replace(/\s/g, ''), // 공백 제거
        thirdPartyConsent: thirdPartyConsent === 'true', // BOOLEAN 변환
        marketingConsent: marketingConsent === 'true',
      };

      console.log("서버로 전송할 최종 데이터:", finalData);

      // 실제 백엔드 API 호출
      const response = await fetch('http://백엔드주소/api/v1/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalData),
      });

      if (response.ok) {
        Alert.alert("가입 완료", `${userName}님, PastUs의 회원이 되신 것을 환영합니다!`);
        router.replace('/auth/login'); // 가입 완료 후 로그인 화면으로 이동
      } else {
        const errorData = await response.json();
        Alert.alert("가입 실패", errorData.message || "이미 사용 중인 아이디일 수 있습니다.");
      }
    } catch (error) {
      Alert.alert("에러", "서버와 통신하는 중 문제가 발생했습니다.");
    }
  };

  // 버튼 활성화 조건
  const isSubmitDisabled = !id || !pw || !pwCheck || isIdInvalidRange || isIdDup || isPwMismatch;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>PastUs</Text>

      {/* 아이디 입력 영역 */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>아이디</Text>
        <TextInput
          style={[styles.input, (isIdDup || isIdInvalidRange) && styles.inputError]}
          placeholder="아이디를 입력해주세요"
          value={id}
          onChangeText={setId}
          autoCapitalize="none"
          maxLength={10} // 명세상 최대 10자
        />
        {isIdDup && <Text style={styles.errorText}>중복된 아이디입니다.</Text>}
        {isIdInvalidRange && <Text style={styles.errorText}>아이디는 4~10자 사이여야 합니다.</Text>}
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
        {isPwMismatch && <Text style={styles.errorText}>비밀번호를 확인해주세요.</Text>}
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 30, justifyContent: 'center' },
  title: { fontSize: 60, fontWeight: 'bold', textAlign: 'center', marginBottom: 60, fontFamily: 'serif' },
  inputGroup: { marginBottom: 25 },
  label: { color: '#4A7DFF', fontSize: 14, fontWeight: '600', marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#4A7DFF',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
  },
  inputError: { borderColor: '#FF4D4D' }, // 에러 발생 시 빨간색 테두리
  errorText: { color: '#FF4D4D', fontSize: 12, marginTop: 5, fontWeight: '500' }, // 빨간색 에러 문구
  submitButton: {
    borderWidth: 1,
    borderColor: '#4A7DFF',
    borderRadius: 10,
    padding: 18,
    alignItems: 'center',
    marginTop: 80,
  },
  submitButtonText: { color: '#4A7DFF', fontSize: 20, fontWeight: '600' },
  disabledButton: { opacity: 0.3 },
});
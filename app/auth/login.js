import React, { useState } from 'react';
import { View, TextInput, Text, Pressable, StyleSheet, Image, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

export default function Login() {
  const router = useRouter();
  
  // 1. 기존 로직 상태 유지
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    // 필수 입력 체크
    if (!id || !pw) {
      setErrorMsg('아이디와 비밀번호를 모두 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      // 명세서 기반 백엔드 통신
      const response = await fetch('http://백엔드서버주소/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ loginId: id, password: pw }), 
      });

      const data = await response.json();

      if (response.ok) {
        // 토큰 안전 저장 및 홈으로 이동
        await SecureStore.setItemAsync('userToken', data.accessToken);
        router.replace('/(tabs)/home');
      } else {
        // 디자인 이미지의 에러 메시지 형식
        setErrorMsg(data.message || '아이디/비밀번호가 다릅니다. 다시 확인해주세요');
      }
    } catch (error) {
      Alert.alert("연결 에러", "서버와 통신할 수 없습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* 로고 및 서비스 설명 */}
      <Text style={styles.title}>PastUs</Text>
      <Text style={styles.subtitle}>
        여러 사람의 과거의 선택과 경험을 모아{"\n"}지금의 나에게 힌트를 주는 서비스
      </Text>

      {/* 아이디 입력창 */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>아이디</Text>
        <TextInput 
          style={styles.input} 
          placeholder="hong1999" 
          value={id} 
          onChangeText={setId}
          autoCapitalize="none"
        />
      </View>

      {/* 비밀번호 입력창 */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>비밀번호</Text>
        <TextInput 
          style={styles.input} 
          placeholder="**********" 
          value={pw} 
          onChangeText={setPw} 
          secureTextEntry 
        />
        <Pressable style={styles.forgotPw}>
          <Text style={styles.forgotPwText}>비밀번호를 잊으셨나요?</Text>
        </Pressable>
      </View>

      {/* 에러 메시지 영역 */}
      <View style={styles.errorContainer}>
        {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}
      </View>

      {/* 로그인 및 로딩 스피너 */}
      {isLoading ? (
        <ActivityIndicator size="large" color="#2B57D0" style={{ marginVertical: 20 }} />
      ) : (
        <>
          <Pressable style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>로그인</Text>
          </Pressable>
          <Pressable style={styles.signupButton} onPress={() => router.push('/auth/signup/step1')}>
            <Text style={styles.signupButtonText}>회원가입</Text>
          </Pressable>
        </>
      )}

      {/* 간편 로그인 섹션 */}
      <View style={styles.separatorContainer}>
        <View style={styles.line} />
        <Text style={styles.orText}>or</Text>
        <View style={styles.line} />
      </View>

      <View style={styles.socialContainer}>
        <SocialBtn platform="Google" color="#fff" textColor="#000" borderColor="#eee" />
        <SocialBtn platform="Naver" color="#03C75A" textColor="#fff" />
        <SocialBtn platform="Kakao" color="#FEE500" textColor="#000" />
      </View>
    </ScrollView>
  );
}

// 소셜 버튼 컴포넌트
const SocialBtn = ({ platform, color, textColor, borderColor = 'transparent' }) => (
  <Pressable style={[styles.socialButton, { backgroundColor: color, borderColor, borderWidth: borderColor === '#eee' ? 1 : 0 }]}>
    <Text style={[styles.socialText, { color: textColor }]}>{platform}로 시작하기</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#fff', padding: 30, paddingTop: 60 },
  title: { fontSize: 60, fontWeight: 'bold', textAlign: 'center', marginBottom: 10, fontFamily: 'serif' },
  subtitle: { fontSize: 13, color: '#333', textAlign: 'center', lineHeight: 20, marginBottom: 40 },
  inputGroup: { marginBottom: 15 },
  label: { color: '#4A7DFF', fontSize: 14, fontWeight: '600', marginBottom: 5 },
  input: { borderWidth: 1, borderColor: '#4A7DFF', borderRadius: 10, padding: 15, fontSize: 16 },
  forgotPw: { alignSelf: 'flex-end', marginTop: 5 },
  forgotPwText: { fontSize: 10, color: '#4A7DFF', textDecorationLine: 'underline' },
  errorContainer: { height: 20, marginVertical: 10, alignItems: 'center' },
  errorText: { color: '#FF4D4D', fontSize: 12, fontWeight: 'bold' },
  loginButton: { backgroundColor: '#2B57D0', borderRadius: 10, padding: 18, alignItems: 'center', marginBottom: 12 },
  loginButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  signupButton: { borderWidth: 1, borderColor: '#4A7DFF', borderRadius: 10, padding: 18, alignItems: 'center' },
  signupButtonText: { color: '#4A7DFF', fontSize: 18, fontWeight: 'bold' },
  separatorContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 30 },
  line: { flex: 1, height: 1, backgroundColor: '#4A7DFF' },
  orText: { marginHorizontal: 15, color: '#4A7DFF', fontSize: 16 },
  socialContainer: { gap: 10 },
  socialButton: { padding: 15, borderRadius: 10, alignItems: 'center' },
  socialText: { fontSize: 16, fontWeight: '600' }
});
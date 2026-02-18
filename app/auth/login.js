import React, { useState } from 'react';
import { View, TextInput, Text, Pressable, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
//import client from '../../src/api/client'; // [핵심] 우리가 만든 axios 인스턴스 임포트
import { loginUser } from '../../src/api/authService';

export default function Login() {
  const router = useRouter();
  
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
  if (!id || !pw) {
    setErrorMsg('아이디와 비밀번호를 모두 입력해주세요.');
    return;
  }

  setIsLoading(true);
  setErrorMsg('');

  try {
    // 🚀 [수정] client.post 대신 우리가 만든 loginUser를 호출합니다.
    // 그래야 'test/1234' 치트키가 먹힙니다!
    const result = await loginUser(id, pw); 

    // 🚀 [주의] authService의 Mock 응답 구조와 화면의 기대치가 맞아야 합니다.
    if (result.status === 200 || result.status === "200") {
      
      // 현재 Login.js는 result.data.token.accessToken을 찾고 있죠?
      // Mock 데이터(authService.js)도 이 구조와 똑같이 맞춰줘야 터지지 않습니다.
      const token = result.data.token.accessToken; 
      const userId = result.data.user.userId;

      if (token) {
        await SecureStore.setItemAsync('userToken', token);
        await SecureStore.setItemAsync('userId', String(userId));
        router.replace('/(tabs)/main'); // 메인으로 입성!
      }
    } else {
      // 아이디/비번이 틀렸을 때 (Mock에서 401 등을 줬을 때)
      setErrorMsg(result.message || '아이디 또는 비밀번호가 올바르지 않습니다.');
    }
  } catch (error) {
    // 실제 네트워크 자체가 안 될 때만 여기로 옵니다.
    setErrorMsg('아이디 또는 비밀번호가 올바르지 않습니다.');
    if (!error.response) {
      Alert.alert("연결 에러", "네트워크 상태를 확인해주세요.");
    }
  } finally {
    setIsLoading(false);
  }
};
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>PastUs</Text>
      <Text style={styles.subtitle}>
        여러 사람의 과거의 선택과 경험을 모아{"\n"}지금의 나에게 힌트를 주는 서비스
      </Text>

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

      <View style={styles.inputGroup}>
        <Text style={styles.label}>비밀번호</Text>
        <TextInput 
          style={styles.input} 
          placeholder="**********" 
          value={pw} 
          onChangeText={setPw} 
          secureTextEntry 
        />
        <Pressable style={styles.forgotPw} onPress={() => router.push('/auth/forgot-password')}>
          <Text style={styles.forgotPwText}>비밀번호를 잊으셨나요?</Text>
        </Pressable>
      </View>

      <View style={styles.errorContainer}>
        {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}
      </View>

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

const SocialBtn = ({ platform, color, textColor, borderColor = 'transparent' }) => (
  <Pressable style={[styles.socialButton, { backgroundColor: color, borderColor, borderWidth: borderColor === '#eee' ? 1 : 0 }]}>
    <Text style={[styles.socialText, { color: textColor }]}>{platform}로 시작하기</Text>
  </Pressable>
);

// 스타일은 기존과 동일하게 유지
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
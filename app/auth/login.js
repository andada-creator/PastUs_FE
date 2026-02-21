import React, { useState } from 'react';
import { View, TextInput, Text, Pressable, StyleSheet, ScrollView, ActivityIndicator, Alert, Image } from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { Ionicons } from '@expo/vector-icons';
import { loginUser } from '../../src/api/authService';

// 보조 컴포넌트: 소셜 로그인 바 
const SocialBar = ({ type, onLinkPress }) => {
  const configs = {
    GOOGLE: { name: '구글', color: '#fff', logo: 'https://cdn-icons-png.flaticon.com/512/2991/2991148.png', textColor: '#000', border: 1 },
    NAVER: { name: '네이버', color: '#03C75A', logo: 'https://static.nid.naver.com/oauth/button_g.PNG', textColor: '#fff' },
    KAKAO: { name: '카카오', color: '#FEE500', logo: 'https://cdn.icon-icons.com/icons2/2429/PNG/512/kakaotalk_logo_icon_147272.png', textColor: '#000' }
  };
  const config = configs[type];

  return (
    <Pressable 
      style={[styles.socialBar, { backgroundColor: config.color, borderWidth: config.border || 0, borderColor: '#eee' }]} 
      onPress={() => onLinkPress(type)}
    >
      <Image source={{ uri: config.logo }} style={styles.socialLogo} />
      <Text style={[styles.socialText, { color: config.textColor }]}>
        {config.name} 계정으로 시작하기
      </Text>
    </Pressable>
  );
};

export default function Login() {
  const router = useRouter();
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 로그인 로직 (return 위로 배치)
  const handleLogin = async () => {
    if (!id || !pw) {
      setErrorMsg('아이디/비밀번호가 다릅니다. 다시 확인해주세요');
      return;
    }
    setIsLoading(true);
    setErrorMsg('');

    try {
      const result = await loginUser(id, pw); 
      if (result.status === 200 || result.status === "200") {
        const token = result.data.accessToken; 
        const userId = result.data.userId;
        if (token) {
          await SecureStore.setItemAsync('userToken', token);
          await SecureStore.setItemAsync('userId', String(userId));
          router.replace('/main');
        }
      } else {
        setErrorMsg('아이디/비밀번호가 다릅니다. 다시 확인해주세요');
      }
    } catch (error) {
      setErrorMsg('아이디/비밀번호가 다릅니다. 다시 확인해주세요');
    } finally {
      setIsLoading(false);
    }
  };

  
  return (
    <ScrollView contentContainerStyle={styles.container} bounces={false}>
      {/* 1. 로고 섹션 */}
      <View style={styles.headerSection}>
        <Text style={styles.logoText}>PastUs</Text>
        <Text style={styles.subtitle}>
          여러 사람의 과거의 선택과 경험을 모아{"\n"}지금의 나에게 힌트를 주는 서비스
        </Text>
      </View>

      {/* 2. 입력 섹션 */}
      <View style={styles.inputArea}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>아이디</Text>
          <TextInput style={styles.input} placeholder="hong1999" value={id} onChangeText={setId} autoCapitalize="none" />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>비밀번호</Text>
          <TextInput style={styles.input} placeholder="**********" value={pw} onChangeText={setPw} secureTextEntry />
          <Pressable style={styles.forgotPw} onPress={() => router.push('/auth/forgot-password')}>
            <Text style={styles.forgotPwText}>비밀번호를 잊으셨나요?</Text>
          </Pressable>
        </View>
      </View>

      {/* 3. 에러 메시지 섹션 */}
      <View style={styles.errorContainer}>
        {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}
      </View>

      {/* 4. 버튼 섹션 */}
      <View style={styles.buttonArea}>
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
      </View>

      {/* 5. 소셜 로그인 섹션 */}
      <View style={styles.separatorContainer}>
        <View style={styles.line} /><Text style={styles.orText}>or</Text><View style={styles.line} />
      </View>

      <View style={styles.socialContainer}>
        <SocialBar type="GOOGLE" onLinkPress={() => {}} />
        <SocialBar type="NAVER" onLinkPress={() => {}} />
        <SocialBar type="KAKAO" onLinkPress={() => {}} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#F8F9FF', padding: 35, paddingTop: 80 },
  headerSection: { alignItems: 'center', marginBottom: 50 },
  
  
  logoText: { 
    fontSize: 70, 
    fontFamily: 'NoticiaText-Bold', 
    color: '#000',
    marginBottom: 5,
    textAlign: 'center'
  },
  subtitle: { fontSize: 13, color: '#333', textAlign: 'center', lineHeight: 20, fontWeight: '500', marginBottom: 20 },
  
  inputArea: { width: '100%' },
  inputGroup: { marginBottom: 20 },
  label: { color: '#4A7DFF', fontSize: 13, fontWeight: '700', marginBottom: 8, marginLeft: 5 },
  input: { borderWidth: 1.5, borderColor: '#4A7DFF', borderRadius: 12, padding: 15, fontSize: 14, backgroundColor: '#fff' },
  forgotPw: { alignSelf: 'flex-end', marginTop: 8 },
  forgotPwText: { fontSize: 10, color: '#4A7DFF' },
  
  errorContainer: { height: 30, justifyContent: 'center', alignItems: 'center' },
  errorText: { color: '#FF4D4D', fontSize: 12, fontWeight: '600' },

  buttonArea: { gap: 12, marginTop: 10 },
  loginButton: { backgroundColor: '#2B57D0', borderRadius: 12, padding: 18, alignItems: 'center' },
  loginButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  signupButton: { borderWidth: 1.5, borderColor: '#4A7DFF', borderRadius: 12, padding: 18, alignItems: 'center', backgroundColor: '#fff' },
  signupButtonText: { color: '#4A7DFF', fontSize: 18, fontWeight: 'bold' },

  separatorContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 35 },
  line: { flex: 1, height: 1.5, backgroundColor: '#4A7DFF', opacity: 0.3 },
  orText: { marginHorizontal: 15, color: '#4A7DFF', fontSize: 14, fontWeight: '600' },

  socialContainer: { gap: 10, paddingBottom: 30 },
  socialBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 50, borderRadius: 12, paddingHorizontal: 20 },
  socialLogo: { width: 22, height: 22, marginRight: 15, resizeMode: 'contain' },
  socialText: { fontSize: 14, fontWeight: '700' },
});
import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { styles } from '../../../src/styles/authStyles';

export default function ResetPassword() {
  const router = useRouter();
  const [pw, setPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');

  const isPwMismatch = pw !== confirmPw && confirmPw.length > 0;
  const isSubmitDisabled = !pw || !confirmPw || isPwMismatch;

  const handleReset = () => {
    if (pw !== confirmPw) {
      Alert.alert("오류", "비밀번호가 일치하지 않습니다.");
      return;
    }
    // 백엔드 API로 새 비밀번호 전송 로직
    Alert.alert("성공", "비밀번호가 재설정되었습니다.", [
      { text: "확인", onPress: () => router.replace('/auth/login') }
    ]);
  };

  return (
    <View style={styles.step2Container}>
      <Text style={styles.title}>PastUs</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>비밀번호</Text>
        <TextInput style={styles.input} value={pw} onChangeText={setPw} secureTextEntry placeholder="새로운 비밀번호 입력" />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>비밀번호 확인</Text>
        <TextInput style={[styles.input, isPwMismatch && styles.inputError]} 
            value={confirmPw} 
            onChangeText={setConfirmPw} 
            secureTextEntry 
            placeholder="다시 한번 입력" 
        />
            {isPwMismatch && <Text style={styles.errorText}>비밀번호가 일치하지 않습니다.</Text>}
      </View>

      <Pressable 
        style={[styles.submitButton, isSubmitDisabled && styles.disabledButton]} 
        onPress={handleReset}
        disabled = {isSubmitDisabled}
      >
        <Text style={styles.submitButtonText}>확인</Text>
      </Pressable>
    </View>
  );
}

// 스타일은 ForgotPassword와 유사하게 (submitButton은 하단 배치 권장)
/*const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 30, paddingTop: 100 },
  title: { fontSize: 60, fontWeight: 'bold', textAlign: 'center', marginBottom: 60, fontFamily: 'serif' },
  inputGroup: { marginBottom: 25 },
  label: { color: '#4A7DFF', fontSize: 14, fontWeight: '600', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#4A7DFF', borderRadius: 10, padding: 15, fontSize: 16 },
  submitButton: { borderWidth: 1, borderColor: '#4A7DFF', borderRadius: 10, padding: 18, alignItems: 'center', marginTop: 'auto', marginBottom: 50 },
  submitButtonText: { color: '#4A7DFF', fontSize: 18, fontWeight: 'bold' }
});*/
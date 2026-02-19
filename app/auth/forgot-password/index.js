import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Modal, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { formatPhone } from '../../../src/utils/signupUtils'; // 🚀 유틸리티 가져오기
import { styles } from '../../../src/styles/authStyles'; // 🚀 통일된 스타일 사용
import { checkAccountExists } from '../../../src/api/authService';
import { useTimer } from '../../../src/hooks/useTimer';
import { formatTime, formatAuthCode } from '../../../src/utils/signupUtils';
import { verifyAuthCode } from '../../../src/api/authService';

export default function ForgotPassword() {
  const router = useRouter();

  const [id, setId] = useState('');
  const [phone, setPhone] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [showAlert, setShowAlert] = useState(false); // 계정 없음 모달 제어

  const { timer, isActive: isSent, startTimer, resetTimer } = useTimer(147);

  // 계정 확인 및 인증번호 전송(이건 테스트용 가짜)
  const handleCheckAccount = async () => {
  // 1. 입력값 정리 (이건 로컬 로직이라 에러 날 확률이 적음)
  const rawPhone = phone.replace(/\s/g, '');
  const hyphenPhone = rawPhone.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');

  try {
    // 이제 이 함수는 IS_TEST_MODE 값에 따라 알아서 가짜 혹은 진짜 데이터를 가져옵니다.
    const result = await checkAccountExists(id, hyphenPhone);

    // 🚀 타입 체크 주의: result.status가 숫자 200인지 확인
    if (result.status === 200) {
      startTimer();
      Alert.alert("발송 성공", result.message);
    } else {
      // 400 에러 등이 올 경우 모달 띄우기
      setShowAlert(true);
    }
  } catch (error) {
    console.error("통신 에러:", error);
    Alert.alert("알림", "서버와의 연결이 원활하지 않습니다.");
  }
};
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.step2Container}>
        <Text style={styles.title}>PastUs</Text>

        {/* 아이디 입력창 */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>아이디</Text>
          <TextInput 
            style={styles.input} 
            value={id} 
            onChangeText={setId} 
            placeholder="아이디 입력" 
          />
        </View>

        {/* 전화번호 입력창 */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>전화번호</Text>
          <TextInput 
            style={styles.input} 
            value={phone} 
            onChangeText={(t) => setPhone(formatPhone(t))} 
            keyboardType="numeric" 
            maxLength={13}
            placeholder="010 1234 5678" 
          />
        </View>

        {/* 인증번호 및 전송 버튼 */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>인증번호</Text>
          <View style={styles.row}>
            <TextInput 
              style={[styles.input, { flex: 1 }]} 
              value={authCode} 
              onChangeText={(t) => setAuthCode(formatAuthCode(t))} 
              placeholder="1 2 3 4 5 6" 
              keyboardType="numeric"
              maxLength={11} 
            />
            <View style = {styles.timerColumn}>
                <Pressable style={styles.sendButton} onPress={handleCheckAccount}>
                    <Text style={styles.sendButtonText}>전송</Text>
                </Pressable>
                {isSent && (
                <Text style={styles.timerTextBelow}>{formatTime(timer)}</Text>
            )}
            </View>
            
            
          </View>
        </View>

        {/* 다음 버튼 */}
        <Pressable 
          style={[styles.nextButton, !isSent && styles.disabledButton]} 
          onPress={() => router.push('/auth/forgot-password/reset')}
          disabled={!isSent}
        >
          <Text style={styles.nextButtonText}>다음</Text>
        </Pressable>
        {/* --- 계정 없음 알림 모달 --- */}
        <Modal visible={showAlert} transparent animationType="fade">
            <View style={styles.modalOverlay}>
                <View style={styles.alertBox}>
                    {/* 텍스트 영역: 아래쪽 마진으로 버튼과 간격을 둡니다. */}
                    <Text style={styles.alertText}>계정정보가 존재하지 않습니다.</Text>
                    {/* 버튼 영역: 세로 높이를 키워 터치하기 편하게 만듭니다. */}
                    <Pressable 
                    style={styles.alertConfirmBtn} 
                    onPress={() => setShowAlert(false)}
                    >
                    <Text style={styles.alertConfirmText}>확인</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
      </View>
    </TouchableWithoutFeedback>
  );
}

/*const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 30, paddingTop: 100 },
  title: { fontSize: 60, fontWeight: 'bold', textAlign: 'center', marginBottom: 60, fontFamily: 'serif' },
  inputGroup: { marginBottom: 20 },
  label: { color: '#4A7DFF', fontSize: 14, fontWeight: '600', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#4A7DFF', borderRadius: 10, padding: 15, fontSize: 16 },
  row: { flexDirection: 'row', gap: 10 },
  sendButton: { backgroundColor: '#2B57D0', borderRadius: 10, paddingHorizontal: 25, justifyContent: 'center' },
  sendButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  timerText: { color: '#FF4D4D', fontSize: 12, marginTop: 5, textAlign: 'center' },
  nextButton: { borderWidth: 1, borderColor: '#4A7DFF', borderRadius: 10, padding: 18, alignItems: 'center', marginTop: 40 },
  nextButtonText: { color: '#4A7DFF', fontSize: 18, fontWeight: 'bold' },
  disabledButton: { borderColor: '#ccc' },
  
  // 모달 스타일
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  alertBox: { backgroundColor: '#fff', borderRadius: 20, padding: 30, width: '80%', alignItems: 'center' },
  alertText: { fontSize: 16, fontWeight: '600', marginBottom: 20, textAlign: 'center' },
  alertConfirmBtn: { borderWidth: 1, borderColor: '#4A7DFF', borderRadius: 20, paddingHorizontal: 30, paddingVertical: 5 },
  alertConfirmText: { color: '#4A7DFF', fontSize: 14, fontWeight: 'bold' }
});*/
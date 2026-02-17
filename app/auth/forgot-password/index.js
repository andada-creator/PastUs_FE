import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Modal } from 'react-native';
import { useRouter } from 'expo-router';

export default function ForgotPassword() {
  const router = useRouter();
  const [id, setId] = useState('');
  const [phone, setPhone] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [timer, setTimer] = useState(147); // 2:27 설정
  const [showAlert, setShowAlert] = useState(false); // 계정 없음 모달 제어

  // 타이머 로직
  useEffect(() => {
    let interval;
    if (isSent && timer > 0) {
      interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isSent, timer]);

  // 계정 확인 및 인증번호 전송
  const handleCheckAccount = async () => {
    // 실제로는 여기서 백엔드 API를 호출하여 DB를 확인합니다.
    // 예시: const exists = await checkUserInDB(id, phone);
    const exists = id === "hong1999" && phone.replace(/\s/g, '') === "01012345678";

    if (exists) {
      setIsSent(true);
      setTimer(147);
    } else {
      setShowAlert(true); // 계정 정보가 없으면 모달 띄움
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>PastUs</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>아이디</Text>
        <TextInput style={styles.input} value={id} onChangeText={setId} placeholder="아이디 입력" />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>전화번호</Text>
        <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="numeric" placeholder="01012345678" />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>인증번호</Text>
        <View style={styles.row}>
          <TextInput 
            style={[styles.input, { flex: 1 }]} 
            value={authCode} 
            onChangeText={setAuthCode} 
            placeholder="여섯자리 숫자" 
            editable={isSent} // 전송 후에만 입력 가능
          />
          <Pressable style={styles.sendButton} onPress={handleCheckAccount}>
            <Text style={styles.sendButtonText}>전송</Text>
          </Pressable>
        </View>
        {isSent && <Text style={styles.timerText}>{Math.floor(timer/60)} : {String(timer%60).padStart(2,'0')}</Text>}
      </View>

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
            <Text style={styles.alertText}>계정정보가 존재하지 않습니다.</Text>
            <Pressable style={styles.alertConfirmBtn} onPress={() => setShowAlert(false)}>
              <Text style={styles.alertConfirmText}>확인</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
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
});
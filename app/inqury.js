import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';

export default function InquiryScreen() {
  const [content, setContent] = useState('');
  const router = useRouter();

  const handleSend = () => {
    if (!content.trim()) return Alert.alert("알림", "문의 내용을 입력해주세요.");
    
    // 🚀 백엔드 전송 로직 예시 (POST /api/inquiries)
    Alert.alert("성공", "문의 사항이 전달되었습니다.", [
      { text: "확인", onPress: () => router.back() }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}><Ionicons name="close" size={28} /></Pressable>
        <Text style={styles.headerTitle}>문의하기</Text>
      </View>
      
      <View style={styles.inputSection}>
        <Text style={styles.label}>문의 내용</Text>
        <TextInput 
          style={styles.textArea}
          multiline
          placeholder="불편한 점이나 건의사항을 자유롭게 적어주세요."
          value={content}
          onChangeText={setContent}
        />
        <Pressable style={styles.sendBtn} onPress={handleSend}>
          <Text style={styles.sendBtnText}>보내기</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', marginLeft: 15 },
  inputSection: { padding: 20 },
  label: { fontSize: 14, fontWeight: '700', marginBottom: 10 },
  textArea: { 
    height: 200, 
    borderWidth: 1.5, 
    borderColor: '#2B57D0',
    borderRadius: 15, 
    padding: 15, 
    textAlignVertical: 'top' 
  },
  sendBtn: { 
    marginTop: 20, 
    backgroundColor: '#2B57D0',
    height: 55, 
    borderRadius: 15, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  sendBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});
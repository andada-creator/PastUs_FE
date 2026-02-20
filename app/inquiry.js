import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Alert, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function InquiryPage() {
  const router = useRouter();
  const [content, setContent] = useState('');

  // 문의 접수 로직
  const handleSubmit = () => {
    if (content.trim().length === 0) {
      Alert.alert("알림", "문의 내용을 입력해주세요.");
      return;
    }
    // TODO: 백엔드 API 연결 (userService.js 등)
    Alert.alert("성공", "문의가 정상적으로 접수되었습니다.", [
      { text: "확인", onPress: () => router.back() }
    ]);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.outerContainer}>
        <SafeAreaView style={styles.statusBarBg} edges={['top']} />
        <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
          <Stack.Screen options={{ headerShown: false }} />

          {/* 상단 헤더 */}
          <View style={styles.header}>
            <Pressable onPress={() => router.back()} style={styles.headerBtn}>
              <Ionicons name="chevron-back" size={24} color="black" />
            </Pressable>
            <Text style={styles.headerTitle}>고객센터 문의</Text>
            <View style={{ width: 34 }} /> 
          </View>

          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.contentContainer}
          >
            {/* 중앙 문의 입력창 */}
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.textInput}
                placeholder="문의할 내용을 적어주세요"
                placeholderTextColor="#C4C4C4"
                multiline
                value={content}
                onChangeText={setContent}
                textAlignVertical="top"
              />
            </View>

            {/* 하단 안내 문구*/}
            <View style={styles.guideWrapper}>
              <Text style={styles.guideText}>
                접수 후 답변까지 2~3일이 소요될 수 있습니다.{"\n"}
                답변은 알림센터에서 확인해주세요.
              </Text>
            </View>

            {/* 하단 문의하기 버튼*/}
            <Pressable 
              style={[styles.submitBtn, !content.trim() && styles.disabledBtn]} 
              onPress={handleSubmit}
            >
              <Text style={styles.submitBtnText}>문의하기</Text>
            </Pressable>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  outerContainer: { flex: 1, backgroundColor: '#F8F9FD' }, 
  statusBarBg: { backgroundColor: '#fff' },
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: '#fff',
  },
  headerBtn: { padding: 5 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#000' },
  contentContainer: { flex: 1, paddingHorizontal: 25, paddingTop: 30 },
  inputWrapper: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#2B57D0', 
    borderRadius: 15,
    height: '45%', 
    padding: 20,
    marginBottom: 30,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: '#000',
    lineHeight: 22,
  },
  guideWrapper: {
    alignItems: 'center',
    marginBottom: 40,
  },
  guideText: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  submitBtn: {
    backgroundColor: '#2B57D0',
    borderRadius: 12,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  disabledBtn: {
    backgroundColor: '#ADC4FF', // 내용 없을 때 연한 블루
  },
  submitBtnText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
});
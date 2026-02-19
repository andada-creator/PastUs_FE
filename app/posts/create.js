import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, Pressable, Alert } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { createPost } from '../../src/api/postService';

// 🚀 입력 섹션 컴포넌트 (디자인 시안의 파란 테두리 + 글자 수 반영)
const InputBox = ({ label, placeholder, value, onChange, maxLength, multiline, height }) => (
  <View style={styles.sectionContainer}>
    <Text style={styles.sectionLabel}>{label}</Text>
    <View style={[styles.inputWrapper, { height: height || 50 }]}>
      <TextInput
        style={[styles.textInput, multiline && { textAlignVertical: 'top' }]}
        placeholder={placeholder}
        placeholderTextColor="#C4C4C4"
        value={value}
        onChangeText={(text) => onChange(text.slice(0, maxLength))}
        multiline={multiline}
      />
      <Text style={styles.charCounter}>{value.length}/{maxLength}</Text>
    </View>
  </View>
);

export default function CreatePost() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: '', situation: '', action: '', retrospective: '',
    isAnonymous: false, useToken: false
  });

  const handlePost = async () => {
    if (!form.title || !form.situation || !form.action || !form.retrospective) {
      Alert.alert("알림", "모든 항목을 작성해주세요.");
      return;
    }
    const res = await createPost(form);
    if (res.status === 200) {
      Alert.alert("성공", "기록이 완료되었습니다.");
      router.replace('/(tabs)/main');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* 1. 상단 헤더 */}
      <View style={styles.header}>
        <Text style={styles.logo}>PastUs</Text>
        <View style={styles.headerIcons}>
          <Ionicons name="search-outline" size={26} color="black" />
          <Ionicons name="menu-outline" size={30} color="black" style={{ marginLeft: 15 }} />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* 2. 상단 컨트롤 바 (사각형 체크박스 + 알약 버튼) */}
        <View style={styles.controlBar}>
          <Pressable 
            style={styles.anonymousRow} 
            onPress={() => setForm({...form, isAnonymous: !form.isAnonymous})}
          >
            <Text style={styles.controlText}>익명</Text>
            {/* 🚀 익명 체크박스: 시안처럼 둥근 사각형 모양 */}
            <View style={[styles.squareBox, form.isAnonymous && styles.boxChecked]}>
              {form.isAnonymous && <Ionicons name="checkmark" size={14} color="#fff" />}
            </View>
          </Pressable>

          <View style={styles.btnGroup}>
            <Pressable 
              style={[styles.pillBtn, styles.tokenBtn, form.useToken && styles.activeToken]}
              onPress={() => setForm({...form, useToken: !form.useToken})}
            >
              <Text style={[styles.pillBtnText, { color: form.useToken ? '#fff' : '#2B57D0' }]}>토큰사용</Text>
            </Pressable>
            <Pressable style={[styles.pillBtn, styles.submitBtn]} onPress={handlePost}>
              <Text style={styles.submitBtnText}>작성</Text>
            </Pressable>
          </View>
        </View>

        {/* 3. 입력 폼 (시안 순서대로) */}
        <InputBox label="제목" placeholder="제목을 작성해주세요" value={form.title} maxLength={30} onChange={(v)=>setForm({...form, title: v})} />
        <InputBox label="상황명시" placeholder="당시 상황에 대해 자유롭게 적어주세요" value={form.situation} maxLength={300} multiline height={180} onChange={(v)=>setForm({...form, situation: v})} />
        <InputBox label="구체적 행동 서술" placeholder="실제로 어떤 행동을 하였는지를 구체적으로 적어주세요" value={form.action} maxLength={300} multiline height={180} onChange={(v)=>setForm({...form, action: v})} />
        <InputBox label="회고" placeholder="당시에 선택과 과정들을 돌아봤을 때 어떤 생각을 가지고 있으신가요?" value={form.retrospective} maxLength={300} multiline height={180} onChange={(v)=>setForm({...form, retrospective: v})} />
      </ScrollView>

      {/* 4. 하단 탭 바 */}
      <View style={styles.bottomTab}>
        <Pressable style={styles.tabItem} onPress={() => router.replace('/(tabs)/main')}>
          <Ionicons name="home" size={24} color="#000" />
          <Text style={styles.tabLabel}>홈</Text>
        </Pressable>
        <View style={styles.fabWrapper}><View style={styles.fab}><Text style={styles.fabIcon}>+</Text></View></View>
        <Pressable style={styles.tabItem} onPress={() => router.push('/profile')}>
          <Ionicons name="person-outline" size={24} color="#333" />
          <Text style={styles.tabLabel}>마이페이지</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 10 },
  logo: { fontSize: 28, fontWeight: 'bold', fontFamily: 'serif' },
  headerIcons: { flexDirection: 'row', alignItems: 'center' },
  scrollContent: { padding: 20, paddingBottom: 120 },

  // 상단 컨트롤 바 스타일
  controlBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  anonymousRow: { flexDirection: 'row', alignItems: 'center' },
  controlText: { fontSize: 15, fontWeight: 'bold', marginRight: 10 },
  squareBox: { width: 22, height: 22, borderWidth: 2, borderColor: '#2B57D0', borderRadius: 6, justifyContent: 'center', alignItems: 'center' },
  boxChecked: { backgroundColor: '#2B57D0' },
  btnGroup: { flexDirection: 'row', gap: 10 },
  pillBtn: { borderRadius: 20, paddingVertical: 6, paddingHorizontal: 15, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#2B57D0' },
  tokenBtn: { backgroundColor: '#fff' },
  activeToken: { backgroundColor: '#2B57D0' },
  submitBtn: { backgroundColor: '#2B57D0', borderWidth: 0 },
  pillBtnText: { fontSize: 12, fontWeight: 'bold' },
  submitBtnText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },

  // 입력 섹션 스타일
  sectionContainer: { marginBottom: 25 },
  sectionLabel: { fontSize: 15, fontWeight: 'bold', marginBottom: 8 },
  inputWrapper: { borderWidth: 1.5, borderColor: '#2B57D0', borderRadius: 12, padding: 12, backgroundColor: '#fff' },
  textInput: { flex: 1, fontSize: 13, color: '#333' },
  charCounter: { position: 'absolute', bottom: 10, right: 12, fontSize: 10, color: '#2B57D0' },

  // 하단 탭 (메인과 동일)
  bottomTab: { position: 'absolute', bottom: 0, width: '100%', height: 70, backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#f0f0f0', paddingBottom: 10 },
  tabItem: { alignItems: 'center', width: 80 },
  tabLabel: { fontSize: 10, marginTop: 4, fontWeight: '600' },
  fabWrapper: { top: -25 },
  fab: { width: 65, height: 65, borderRadius: 32.5, backgroundColor: '#B5C7F7', justifyContent: 'center', alignItems: 'center', elevation: 5 },
  fabIcon: { fontSize: 40, color: '#fff', fontWeight: '300' }
});
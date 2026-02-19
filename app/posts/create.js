import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, Pressable, Alert } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar'; // 🚀 상태 표시줄 제어용
import { createPost } from '../../src/api/postService';

// 🚀 입력 섹션 컴포넌트
const InputBox = ({ label, placeholder, value, onChange, maxLength, multiline, height }) => (
  <View style={styles.sectionContainer}>
    {/* 🚀 피그마 명세 반영: Pretendard 600 */}
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
    // 🚀 1. 최상위 부모를 화이트로 하여 상태 표시줄 영역까지 하얗게 만듭니다.
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* 🚀 2. 시간/와이파이 아이콘을 검은색으로 설정 */}
      <StatusBar style="dark" />
      <Stack.Screen options={{ headerShown: false }} />

      {/* 🚀 3. 상단 헤더 (화이트) */}
      <View style={styles.header}>
        <Text style={styles.logo}>PastUs</Text>
        <View style={styles.headerIcons}>
          <Ionicons name="search-outline" size={26} color="black" />
          <Ionicons name="menu-outline" size={30} color="black" style={{ marginLeft: 15 }} />
        </View>
      </View>

      {/* 🚀 4. 본문 영역: 여기서부터 연한 하늘색 배경 적용 */}
      <View style={styles.bodyWrapper}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {/* 상단 컨트롤 바 */}
          <View style={styles.controlBar}>
            <Pressable 
              style={styles.anonymousRow} 
              onPress={() => setForm({...form, isAnonymous: !form.isAnonymous})}
            >
              <Text style={styles.controlText}>익명</Text>
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

          {/* 입력 폼 */}
          <InputBox label="제목" placeholder="제목을 작성해주세요" value={form.title} maxLength={30} onChange={(v)=>setForm({...form, title: v})} />
          <InputBox label="상황명시" placeholder="당시 상황에 대해 자유롭게 적어주세요" value={form.situation} maxLength={300} multiline height={180} onChange={(v)=>setForm({...form, situation: v})} />
          <InputBox label="구체적 행동 서술" placeholder="실제로 어떤 행동을 하였는지를 구체적으로 적어주세요" value={form.action} maxLength={300} multiline height={180} onChange={(v)=>setForm({...form, action: v})} />
          <InputBox label="회고" placeholder="당시에 선택과 과정들을 돌아봤을 때 어떤 생각을 가지고 있으신가요?" value={form.retrospective} maxLength={300} multiline height={180} onChange={(v)=>setForm({...form, retrospective: v})} />
        </ScrollView>
      </View>

      {/* 하단 탭 바 */}
      <View style={styles.bottomTab}>
        <Pressable style={styles.tabItem} onPress={() => router.replace('/(tabs)/main')}>
          <Ionicons name="home-outline" size={24} color="#000" />
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
  // 🚀 최상단 영역 화이트 처리
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 10, backgroundColor: '#fff' },
  logo: { fontSize: 28, fontWeight: 'bold', fontFamily: 'serif' },
  headerIcons: { flexDirection: 'row', alignItems: 'center' },
  
  // 🚀 본문 배경 하늘색 처리
  bodyWrapper: { flex: 1, backgroundColor: '#F6F8FD' },
  scrollContent: { padding: 20, paddingBottom: 120 },

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

  sectionContainer: { marginBottom: 25 },
  // 🚀 피그마 명세 반영: 16px, 600
  sectionLabel: { fontSize: 16, fontWeight: '600', marginBottom: 8, fontFamily: 'Pretendard' },
  inputWrapper: { borderWidth: 1.5, borderColor: '#2B57D0', borderRadius: 12, padding: 12, backgroundColor: '#fff' }, // 🚀 입력창은 흰색으로 대비
  textInput: { flex: 1, fontSize: 13, color: '#333' },
  charCounter: { position: 'absolute', bottom: 10, right: 12, fontSize: 10, color: '#2B57D0' },

  bottomTab: { position: 'absolute', bottom: 0, width: '100%', height: 75, backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#f0f0f0', paddingBottom: 15 },
  tabItem: { alignItems: 'center', width: 80 },
  tabLabel: { fontSize: 10, marginTop: 4, fontWeight: '600' },
  fabWrapper: { top: -25 },
  fab: { width: 65, height: 65, borderRadius: 32.5, backgroundColor: '#B5C7F7', justifyContent: 'center', alignItems: 'center', elevation: 5 },
  fabIcon: { fontSize: 40, color: '#fff', fontWeight: '300' }
});
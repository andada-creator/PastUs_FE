import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Pressable, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getPostDetail, updatePost, deletePost } from '../../../src/api/postService';

export default function EditPostScreen() {
  const { postId } = useLocalSearchParams();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: '',
    situation: '',
    action: '',
    retrospective: '', // 🚀 백엔드 명세서 필드명 준수
    tags: [],
    isAnonymous: false
  });

  useEffect(() => {
    const fetchOriginalPost = async () => {
      try {
        setLoading(true);
        const res = await getPostDetail(postId);
        if (res.status === 200) {
          const d = res.data;
          setForm({
            title: d.title,
            situation: d.situation,
            action: d.action,
            retrospective: d.retrospective,
            tags: d.tags || [],
            isAnonymous: d.isAnonymous
          });
        }
      } catch (e) { Alert.alert("에러", "데이터 로딩 실패"); }
      finally { setLoading(false); }
    };
    if (postId) fetchOriginalPost();
  }, [postId]);

  const handleUpdate = async () => {
    try {
      // await updatePost(postId, form);
      Alert.alert("성공", "글이 수정되었습니다.", [{ text: "확인", onPress: () => router.back() }]);
    } catch (e) { console.error(e); }
  };

  const handleDelete = () => {
    Alert.alert("삭제", "정말 삭제하시겠습니까?", [
      { text: "취소" },
      { text: "삭제", onPress: () => {
        // deletePost(postId);
        router.replace('/main');
      }}
    ]);
  };

  if (loading) return <ActivityIndicator size="large" color="#2B57D0" style={{flex:1}} />;

  return (
    <View style={styles.outerContainer}>
      <SafeAreaView style={styles.statusBarBg} edges={['top']} />
      <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
        <Stack.Screen options={{ headerShown: false }} />

        {/* --- [1. 최상단 헤더: PastUs + 아이콘] --- */}
        <View style={styles.header}>
          <Text style={styles.logo}>PastUs</Text>
          <View style={styles.headerIcons}>
            <Pressable onPress={() => router.push('/search')} hitSlop={15}>
              <Ionicons name="search-outline" size={24} color="black" />
            </Pressable>
            <Pressable onPress={() => router.push('/menu')} hitSlop={15}>
              <Ionicons name="menu-outline" size={28} color="black" style={{ marginLeft: 15 }} />
            </Pressable>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* --- [2. 옵션바: 익명 체크 및 버튼 그룹] --- */}
          <View style={styles.optionRow}>
            <View style={styles.anonGroup}>
              <Text style={styles.optionLabel}>익명</Text>
              <Pressable style={styles.checkbox} onPress={() => setForm({...form, isAnonymous: !form.isAnonymous})}>
                <Ionicons name={form.isAnonymous ? "checkbox" : "square-outline"} size={22} color="#2B57D0" />
              </Pressable>
            </View>
            
            <View style={styles.btnGroup}>
              <View style={styles.tokenBadge}><Text style={styles.tokenText}>토큰사용</Text></View>
              <Pressable style={styles.blueBtn} onPress={handleUpdate}><Text style={styles.btnText}>수정</Text></Pressable>
              {/* 🚀 삭제 버튼도 파란색으로 수정 */}
              <Pressable style={styles.blueBtn} onPress={handleDelete}><Text style={styles.btnText}>삭제</Text></Pressable>
            </View>
          </View>

          {/* --- [3. 태그 영역] --- */}
          <View style={styles.tagSection}>
            <Text style={styles.label}>태그</Text>
            <View style={styles.tagRow}>
              {form.tags.map((tag, i) => (
                <View key={i} style={styles.tagItem}>
                  <Text style={styles.tagText}>{tag} ×</Text>
                </View>
              ))}
              <Pressable onPress={() => Alert.alert("태그 팝업")} hitSlop={10}>
                <Ionicons name="add-circle" size={30} color="#2B57D0" />
              </Pressable>
            </View>
          </View>

          {/* --- [4. 입력 필드 섹션] --- */}
          <InputBox label="제목" value={form.title} onChange={(v) => setForm({...form, title: v})} limit={30} placeholder="제목을 작성해주세요" />
          <InputBox label="상황명시" value={form.situation} onChange={(v) => setForm({...form, situation: v})} limit={300} multiline placeholder="당시 상황에 대해 자유롭게 적어주세요" />
          <InputBox label="구체적 행동 서술" value={form.action} onChange={(v) => setForm({...form, action: v})} limit={300} multiline placeholder="실제로 어떤 행동을 하였는지를 구체적으로 적어주세요" />
          <InputBox label="회고" value={form.retrospective} onChange={(v) => setForm({...form, retrospective: v})} limit={300} multiline placeholder="당시에 선택과 과정들을 돌아봤을 때 어떤 생각을 가지고 있으신가요?" />
        </ScrollView>

        {/* 🚀 하단 탭 바 (85px 디자인 통일) */}
        <View style={styles.tabBarContainer}>
           <Pressable onPress={() => router.replace('/main')} style={styles.tabItem}>
             <Ionicons name="home" size={24} color="#000" />
             <Text style={styles.tabLabel}>홈</Text>
           </Pressable>
           <View style={styles.fabContainer}>
             <View style={styles.fabBackground}>
               <Pressable style={styles.fabButton}><Ionicons name="add" size={35} color="white" /></Pressable>
             </View>
           </View>
           <Pressable onPress={() => router.replace('/profile')} style={styles.tabItem}>
             <Ionicons name="person" size={24} color="#000" />
             <Text style={styles.tabLabel}>마이페이지</Text>
           </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

// 🚀 공통 입력창 컴포넌트
const InputBox = ({ label, value, onChange, limit, multiline, placeholder }) => (
  <View style={styles.inputSection}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.inputContainer}>
      <TextInput 
        style={[styles.input, multiline && { height: 130, textAlignVertical: 'top' }]}
        value={value}
        onChangeText={onChange}
        maxLength={limit}
        multiline={multiline}
        placeholder={placeholder}
        placeholderTextColor="#999"
      />
      <Text style={styles.counter}>{value?.length || 0}/{limit}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  outerContainer: { flex: 1, backgroundColor: '#F2F6FF' },
  statusBarBg: { backgroundColor: '#fff' },
  container: { flex: 1 },
  
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12, backgroundColor: '#fff' },
  logo: { fontSize: 28, fontWeight: 'bold', fontFamily:'NoticiaText-Bold'},
  headerIcons: { flexDirection: 'row', alignItems: 'center' },
  
  scrollContent: { paddingHorizontal: 20, paddingBottom: 110 },

  optionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 15 },
  anonGroup: { flexDirection: 'row', alignItems: 'center' },
  optionLabel: { fontSize: 14, fontWeight: '700', marginRight: 5 },
  
  btnGroup: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  tokenBadge: { borderWidth: 1.5, borderColor: '#2B57D0', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  tokenText: { fontSize: 11, color: '#2B57D0', fontWeight: 'bold' },
  blueBtn: { backgroundColor: '#2B57D0', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20 },
  btnText: { color: '#fff', fontSize: 13, fontWeight: 'bold' },

  tagSection: { marginBottom: 15 },
  label: { fontSize: 15, fontWeight: '700', marginBottom: 8 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8 },
  tagItem: { backgroundColor: '#2B57D0', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  tagText: { color: '#fff', fontSize: 12, fontWeight: '600' },

  inputSection: { marginBottom: 20 },
  inputContainer: { position: 'relative' },
  input: { 
    backgroundColor: '#fff', 
    borderWidth: 1.5, 
    borderColor: '#2B57D0', // 🚀 시안 블루 테두리
    borderRadius: 12, 
    padding: 15, 
    fontSize: 13, 
    color: '#333' 
  },
  counter: { position: 'absolute', right: 12, bottom: 8, fontSize: 10, color: '#2B57D0', fontWeight: 'bold' },

  tabBarContainer: { flexDirection: 'row', height: 85, backgroundColor: '#fff', borderTopWidth: 2, borderTopColor: '#F0F0F0', position: 'absolute', bottom: 0, width: '100%' },
  tabItem: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  tabLabel: { fontSize: 11, marginTop: 4, fontWeight: '700' },
  fabContainer: { position: 'absolute', left: '50%', top: -25, marginLeft: -35 },
  fabBackground: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' },
  fabButton: { width: 55, height: 55, borderRadius: 27.5, backgroundColor: '#A8C3FF', justifyContent: 'center', alignItems: 'center' }
});
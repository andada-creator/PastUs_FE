import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, Pressable, Alert, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router'; 
import { SafeAreaView } from 'react-native-safe-area-context'; 
import { Ionicons } from '@expo/vector-icons';
import { getPostDetail, updatePost, deletePost, getPostTags, updatePostTags } from '../../src/api/postService'; 
import TagSelectModal from '../../src/components/modals/TagSelectModal';

export default function EditPost() {
  const { postId } = useLocalSearchParams();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [isTagModalVisible, setIsTagModalVisible] = useState(false);
  
  // 🚀 1. 수정할 데이터를 담을 상태(State) 정의
  const [form, setForm] = useState({
    title: '',
    situation: '',
    action: '',
    retrospective: '',
    isAnonymous: false,
    useToken: false,
  });
  const [selectedTags, setSelectedTags] = useState([]);

  useEffect(() => {
    const initData = async () => {
      try {
        setLoading(true);
        // 게시글 본문 및 태그 정보 병렬 로드
        const [postRes, tagRes] = await Promise.all([
          getPostDetail(postId),
          getPostTags(postId)
        ]);

        if (postRes.data) {
          setForm({
            title: postRes.data.title,
            situation: postRes.data.situation,
            action: postRes.data.action,
            retrospective: postRes.data.retrospective,
            isAnonymous: postRes.data.isAnonymous,
            useToken: postRes.data.useToken,
          });
        }
        if (tagRes.data) setSelectedTags(tagRes.data);
      } catch (error) {
        Alert.alert("알림", "데이터를 불러오지 못했습니다.");
        router.back();
      } finally {
        setLoading(false);
      }
    };
    if (postId) initData();
  }, [postId]);

  // 🚀 2. 수정 완료 처리 (본문 + 태그)
  const handleUpdate = async () => {
    try {
      await updatePost(postId, form);
      await updatePostTags(postId, { tagIds: selectedTags.map(t => t.tagId) });
      Alert.alert("성공", "수정이 완료되었습니다.", [{ text: "확인", onPress: () => router.back() }]);
    } catch (e) {
      Alert.alert("오류", "수정 중 문제가 발생했습니다.");
    }
  };

  // --- [삭제 확인 팝업 및 로직] ---
  const handleDelete = () => {
    Alert.alert(
      "게시글 삭제", 
      "정말 이 글을 삭제하시겠습니까?\n삭제된 글은 복구할 수 없습니다.", 
      [
        { text: "취소", style: "cancel" },
        { 
          text: "삭제", 
          style: "destructive", 
          onPress: async () => {
            try {
              const res = await deletePost(postId); // 🚀 실제 서버 삭제 요청
              
              if (res.status === 204) { // 🚀 204 No Content: 삭제 성공
                Alert.alert("완료", "게시글이 삭제되었습니다.");
                router.replace('/main'); // 삭제 후 메인 화면으로 이동
              }
            } catch (error) {
              // 🚀 명세서 기반 에러 대응
              const status = error.response?.status;
              if (status === 401) Alert.alert("오류", "인증이 필요합니다.");
              else if (status === 403) Alert.alert("오류", "작성자만 삭제할 수 있습니다.");
              else if (status === 404) Alert.alert("오류", "존재하지 않는 게시글입니다.");
              else Alert.alert("오류", "서버 오류가 발생했습니다.");
            }
          }
        }
      ]
    );
  };

  if (loading) return <ActivityIndicator size="large" color="#2B57D0" style={{ flex: 1 }} />;

  return (
    <View style={styles.outerContainer}>
      <SafeAreaView style={styles.statusBarBg} edges={['top']} />
      <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
        <Stack.Screen options={{ headerShown: false }} />

        {/* 상단 헤더 */}
        <View style={styles.header}>
          <Text style={styles.logo}>PastUs</Text>
          <View style={styles.headerIcons}>
            <Ionicons name="search-outline" size={26} color="black" />
            <Pressable onPress={() => router.push('/menu')}>
              <Ionicons name="menu-outline" size={30} color="black" style={{ marginLeft: 15 }} />
            </Pressable>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* 🚀 옵션 바: 익명 체크, 토큰, 수정, 삭제 */}
          <View style={styles.optionRow}>
            <View style={styles.anonGroup}>
              <Text style={styles.label}>익명</Text>
              <Pressable onPress={() => setForm({...form, isAnonymous: !form.isAnonymous})}>
                <Ionicons name={form.isAnonymous ? "checkbox" : "square-outline"} size={22} color="#2B57D0" style={{marginLeft: 5}} />
              </Pressable>
            </View>
            <View style={styles.btnGroup}>
              <View style={styles.tokenBadge}><Text style={styles.tokenText}>토큰사용</Text></View>
              <Pressable style={styles.blueBtn} onPress={handleUpdate}><Text style={styles.btnText}>수정</Text></Pressable>
              <Pressable style={styles.blueBtn} onPress={handleDelete}>
                <Text style={styles.btnText}>삭제</Text>
              </Pressable>
            </View>
          </View>

          {/* 태그 영역 */}
          <View style={styles.tagSection}>
            <Text style={styles.fieldLabel}>태그</Text>
            <View style={styles.tagRow}>
              {selectedTags.map((tag) => (
                <View key={tag.tagId} style={styles.tagBadge}><Text style={styles.tagText}>#{tag.name} ×</Text></View>
              ))}
              <Pressable onPress={() => setIsTagModalVisible(true)}>
                <Ionicons name="add-circle" size={32} color="#2B57D0" />
              </Pressable>
            </View>
          </View>

          {/* 🚀 입력 섹션들 (TextInput으로 교체) */}
          <InputBox label="제목" value={form.title} onChange={(v) => setForm({...form, title: v})} limit={30} />
          <InputBox label="상황명시" value={form.situation} onChange={(v) => setForm({...form, situation: v})} limit={300} multiline />
          <InputBox label="구체적 행동 서술" value={form.action} onChange={(v) => setForm({...form, action: v})} limit={300} multiline />
          <InputBox label="회고" value={form.retrospective} onChange={(v) => setForm({...form, retrospective: v})} limit={300} multiline />
        </ScrollView>
      </SafeAreaView>

      <TagSelectModal 
        visible={isTagModalVisible} 
        onClose={() => setIsTagModalVisible(false)}
        initialSelectedIds={selectedTags.map(t => t.tagId)}
        onApply={(newIds) => { /* 태그 ID 기반 업데이트 로직 */ setIsTagModalVisible(false); }}
      />
    </View>
  );
}

// 🚀 재사용 가능한 입력 필드 컴포넌트
const InputBox = ({ label, value, onChange, limit, multiline }) => (
  <View style={styles.inputSection}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <View style={styles.inputContainer}>
      <TextInput 
        style={[styles.input, multiline && { height: 120, textAlignVertical: 'top' }]}
        value={value}
        onChangeText={onChange}
        maxLength={limit}
        multiline={multiline}
        placeholder={`${label} 내용을 입력하세요.`}
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
  logo: { fontSize: 28, fontWeight: 'bold', fontFamily: 'NoticiaText-Bold', },
  headerIcons: { flexDirection: 'row', alignItems: 'center' },
  scrollContent: { padding: 20, paddingBottom: 50 },

  optionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  anonGroup: { flexDirection: 'row', alignItems: 'center' },
  label: { fontSize: 14, fontWeight: '700' },
  btnGroup: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  tokenBadge: { borderWidth: 1.5, borderColor: '#2B57D0', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  tokenText: { fontSize: 11, color: '#2B57D0', fontWeight: 'bold' },
  blueBtn: { backgroundColor: '#2B57D0', paddingHorizontal: 15, paddingVertical: 6, borderRadius: 20 },
  btnText: { color: '#fff', fontSize: 13, fontWeight: 'bold' },

  tagSection: { marginBottom: 20 },
  fieldLabel: { fontSize: 15, fontWeight: '700', marginBottom: 10 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8 },
  tagBadge: { backgroundColor: '#2B57D0', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  tagText: { color: '#fff', fontSize: 12, fontWeight: '600' },

  inputSection: { marginBottom: 20 },
  inputContainer: { position: 'relative' },
  input: { backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#2B57D0', borderRadius: 12, padding: 15, fontSize: 14 },
  counter: { position: 'absolute', right: 12, bottom: 8, fontSize: 10, color: '#2B57D0', fontWeight: 'bold' }
});
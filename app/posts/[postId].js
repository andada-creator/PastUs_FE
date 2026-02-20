import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, Pressable, Alert } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router'; 
import { SafeAreaView } from 'react-native-safe-area-context'; 
import { Ionicons } from '@expo/vector-icons';
import { getPostDetail, getPostTags, deletePost } from '../../src/api/postService'; 

export default function PostDetail() {
  const { postId } = useLocalSearchParams();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [isAuthor, setIsAuthor] = useState(false); // 🚀 내 글 여부 확인용

  useEffect(() => {
  const initData = async () => {
    try {
      setLoading(true);
      const [postRes, tagRes] = await Promise.all([
        getPostDetail(postId),
        getPostTags(postId).catch(() => ({ data: [] })) // 태그 실패 시 빈 배열 처리
      ]);

      if (postRes.data) {
        setPost(postRes.data);
        setIsAuthor(postRes.data.isAuthor || false);
      }
      
      
      if (tagRes.data) {
        setSelectedTags(tagRes.data); 
      }
    } catch (error) {
      console.error("❌ 상세 로드 에러:", error);
      Alert.alert("알림", "데이터를 불러오지 못했습니다.");
      router.back();
    } finally {
      setLoading(false);
    }
  };
  if (postId) initData();
}, [postId]);

  // 삭제 로직 (작성자 전용)
  const handleDelete = () => {
    Alert.alert("게시글 삭제", "정말 삭제하시겠습니까?", [
      { text: "취소", style: "cancel" },
      { text: "삭제", style: "destructive", onPress: async () => {
          try {
            await deletePost(postId);
            Alert.alert("완료", "삭제되었습니다.");
            router.replace('/main');
          } catch (e) { Alert.alert("오류", "삭제에 실패했습니다."); }
      }}
    ]);
  };

  if (loading) return <ActivityIndicator size="large" color="#2B57D0" style={{ flex: 1 }} />;
  if (!post) return null;

  // 작성자 이름 처리: 익명 여부에 따라 결정
  const authorName = post.isAnonymous ? "익명" : (post.loginId || post.authorId || "사용자");
  const dateStr = (post.createdAt || "2026.01.30").split('T')[0].replace(/-/g, '.');

  return (
    <View style={styles.outerContainer}>
      <SafeAreaView style={styles.statusBarBg} edges={['top']} />
      <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
        <Stack.Screen options={{ headerShown: false }} />

        {/* 상단 헤더: PastUs 로고 및 메뉴 */}
        <View style={styles.header}>
          <Text style={styles.logo}>PastUs</Text>
          <View style={styles.headerIcons}>
            <Ionicons name="search-outline" size={24} color="black" />
            <Pressable onPress={() => router.push('/menu')}>
              <Ionicons name="menu-outline" size={28} color="black" style={{ marginLeft: 15 }} />
            </Pressable>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.dateText}>{dateStr}</Text>
          <Text style={styles.mainTitle}>{post.title}</Text>

          <View style={styles.infoRow}>
            <Text style={styles.authorLabel}>작성자: <Text style={styles.authorValue}>{authorName}</Text></Text>
            <View style={styles.statsRow}>
              <Ionicons name="heart-outline" size={16} color="#888" />
              <Text style={styles.statsValue}>{post.likeCount || 0}</Text>
              <Ionicons name="eye-outline" size={16} color="#888" style={{ marginLeft: 8 }} />
              <Text style={styles.statsValue}>{post.viewCount || 0}</Text>
              <Pressable onPress={() => Alert.alert("알림", "신고 접수되었습니다.")}>
                <Text style={styles.reportBtn}>신고</Text>
              </Pressable>
            </View>
          </View>

          {/* 태그 및 작성자 아래 구분선 (시안 반영) */}
          <View style={styles.mainDivider} />

          {/* 태그 영역 */}
          <View style={styles.tagContainer}>
            {selectedTags.map((tag, i) => ( // tags 대신 selectedTags 사용
              <View key={i} style={styles.tagBadge}>
                <Text style={styles.tagText}>#{tag.name || tag.replace('#', '')}</Text>
              </View>
            ))}
          </View>

          {/* 본문 섹션 (디자인 시안 스타일 적용) */}
          <DetailSection label="상황명시" content={post.situation} />
          <DetailSection label="구체적 행동 서술" content={post.action} />
          <DetailSection label="회고" content={post.retrospective} />

          {/* 작성자 옵션: 내 글일 때만 토큰사용, 수정, 삭제 노출 */}
          <View style={styles.bottomActionRow}>
            <View style={styles.flexOne}>
              {/* 내 글이 아닐 때만 토큰 사용 버튼 숨김 */}
              {isAuthor && (
                <View style={styles.tokenBadge}>
                  <Text style={styles.tokenText}>토큰사용</Text>
                </View>
              )}
            </View>
            
            {isAuthor && (
              <View style={styles.editBtnGroup}>
                <Pressable style={styles.actionBtn} onPress={() => router.push(`/posts/edit/${postId}`)}>
                  <Text style={styles.actionBtnText}>수정</Text>
                </Pressable>
                <Pressable style={styles.actionBtn} onPress={handleDelete}>
                  <Text style={styles.actionBtnText}>삭제</Text>
                </Pressable>
              </View>
            )}
          </View>
        </ScrollView>

        {/* 시안 하단 내비게이션 바 */}
        <View style={styles.bottomNav}>
          <Pressable onPress={() => router.push('/main')} style={styles.navItem}>
            <Ionicons name="home" size={24} color="black" />
            <Text style={styles.navText}>홈</Text>
          </Pressable>
          <Pressable style={styles.plusBtn}>
            <Ionicons name="add" size={32} color="white" />
          </Pressable>
          <Pressable onPress={() => router.push('/mypage')} style={styles.navItem}>
            <Ionicons name="person" size={24} color="black" />
            <Text style={styles.navText}>마이페이지</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

// 본문 박스 컴포넌트 (디자인 시안 기준)
const DetailSection = ({ label, content }) => (
  <View style={styles.sectionWrapper}>
    <Text style={styles.sectionLabel}>{label}</Text>
    <View style={styles.sectionBox}>
      <Text style={styles.sectionContent}>{content}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  outerContainer: { flex: 1, backgroundColor: '#fff' },
  statusBarBg: { backgroundColor: '#fff' },
  container: { flex: 1 },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  logo: { fontSize: 26, fontWeight: 'bold', fontFamily: 'NoticiaText-Bold' },
  headerIcons: { flexDirection: 'row', alignItems: 'center' },
  scrollContent: { padding: 20, paddingBottom: 100 },
  dateText: { fontSize: 11, color: '#888', textAlign: 'right', marginBottom: 4 },
  mainTitle: { fontSize: 20, fontWeight: 'bold', color: '#000', marginBottom: 12 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  authorLabel: { fontSize: 13, color: '#444' },
  authorValue: { fontWeight: '600' },
  statsRow: { flexDirection: 'row', alignItems: 'center' },
  statsValue: { fontSize: 13, color: '#888', marginLeft: 4 },
  reportBtn: { fontSize: 12, color: '#FF4D4D', marginLeft: 10, fontWeight: 'bold' },
  mainDivider: { height: 1.5, backgroundColor: '#333', marginBottom: 15 }, // 🚀 시안의 굵은 구분선
  tagContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 20 },
  tagBadge: { backgroundColor: '#2B57D0', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 15 },
  tagText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },

  sectionWrapper: { marginBottom: 18 },
  sectionLabel: { fontSize: 15, fontWeight: 'bold', marginBottom: 8 },
  sectionBox: { backgroundColor: '#F8FAFF', borderWidth: 1, borderColor: '#2B57D0', borderRadius: 10, padding: 15, minHeight: 80 },
  sectionContent: { fontSize: 14, color: '#333', lineHeight: 20 },
  bottomActionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  flexOne: { flex: 1 },

  tokenBadge: { alignSelf: 'flex-start', borderWidth: 1.5, borderColor: '#2B57D0', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  tokenText: { fontSize: 11, color: '#2B57D0', fontWeight: 'bold' },
  editBtnGroup: { flexDirection: 'row', gap: 8 },
  actionBtn: { backgroundColor: '#2B57D0', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20 },
  actionBtnText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  bottomNav: { position: 'absolute', bottom: 0, width: '100%', height: 70, backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#EEE' },
  navItem: { alignItems: 'center' },
  navText: { fontSize: 10, marginTop: 4 },
  plusBtn: { width: 50, height: 50, backgroundColor: '#ADC4FF', borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3 }
});
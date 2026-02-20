import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, Pressable, Alert } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router'; 
import { SafeAreaView } from 'react-native-safe-area-context'; 
import { Ionicons } from '@expo/vector-icons';
import { getPostDetail, toggleLikePost } from '../../src/api/postService'; 
import BottomBar from '../../src/components/navigation/BottomBar';

export default function PostDetail() {
  const { postId } = useLocalSearchParams();
  const router = useRouter();
  
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  // 1. 게시글 데이터 불러오기 로직
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const response = await getPostDetail(postId);
        
        // 🚀 에러 해결: 'data' 변수를 명시적으로 선언하여 참조 오류 방지
        const postData = response.data; 

        if (postData) {
          setPost(postData);
          setIsLiked(postData.liked);      // 초기 좋아요 여부 설정
          setLikeCount(postData.likeCount); // 초기 좋아요 수 설정
        }
      } catch (error) {
        console.error("상세 로딩 에러:", error);
        Alert.alert("알림", "글을 불러오지 못했습니다.");
        router.back();
      } finally {
        setLoading(false);
      }
    };
    if (postId) fetchDetail();
  }, [postId]);

  // 2. 좋아요 토글 로직 (낙관적 업데이트)
  const handleLikeToggle = async () => {
    try {
      const prevLiked = isLiked;
      const prevCount = likeCount;

      // UI 즉시 업데이트 (사용자 경험 향상)
      setIsLiked(!prevLiked);
      setLikeCount(prevLiked ? prevCount - 1 : prevCount + 1);

      // 백엔드 서버에 전달
      const res = await toggleLikePost(postId);
      
      // 서버 응답 기반으로 최종 상태 확정 (필요 시)
      if (res && res.data) {
        setIsLiked(res.data.liked);
        setLikeCount(res.data.likeCount);
      }
    } catch (error) {
      // 통신 실패 시 원래 상태로 롤백
      console.error("좋아요 실패:", error);
      setIsLiked(isLiked);
      setLikeCount(likeCount);
      Alert.alert("알림", "좋아요 처리에 실패했습니다.");
    }
  };

  if (loading) return <ActivityIndicator size="large" color="#2B57D0" style={{ flex: 1 }} />;
  if (!post) return null;

  // 날짜 가공 및 수정 여부 확인
  const displayDate = post.createdAt?.split('T')[0].replace(/-/g, '.');
  const isEdited = post.createdAt !== post.updatedAt;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* 상단 헤더 (PastUs 로고 스타일) */}
      <View style={styles.header}>
        <Text style={styles.logo}>PastUs</Text>
        <View style={styles.headerIcons}>
          <Pressable onPress={() => router.push('/search')}>
            <Ionicons name="search-outline" size={26} color="black" />
          </Pressable>
          <Ionicons name="menu-outline" size={30} color="black" style={{ marginLeft: 15 }} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* 날짜 및 수정 표시 */}
        <Text style={styles.dateText}>{displayDate} {isEdited && "(수정됨)"}</Text>
        
        {/* 제목 */}
        <Text style={styles.titleText}>{post.title}</Text>
        
        {/* 작성자 정보 & 신뢰도 & 통계 (아이콘 디자인 적용) */}
        <View style={styles.infoRow}>
          <Text style={styles.authorText}>
            작성자 | <Text style={styles.bold}>{post.isAnonymous ? '익명' : (post.userName || '작성자')}</Text> 
            (신뢰도: {post.trustScore || 0}%)
          </Text>
          
          <View style={styles.statContainer}>
            {/* 🚀 에러 해결: 정의한 handleLikeToggle 함수를 여기에 연결함 */}
            <Pressable style={styles.iconItem} onPress={handleLikeToggle}>
              <Ionicons 
                name={isLiked ? "heart" : "heart-outline"} 
                size={18} 
                color={isLiked ? "#FF4D4D" : "#888"} 
              />
              <Text style={[styles.statNum, isLiked && { color: '#FF4D4D' }]}>{likeCount}</Text>
            </Pressable>
            
            <View style={styles.iconItem}>
              <Ionicons name="eye-outline" size={18} color="#888" />
              <Text style={styles.statNum}>{post.viewCount || 0}</Text>
            </View>
          </View>
        </View>

        {/* 태그 목록 (Badge 스타일) */}
        <View style={styles.tagWrapper}>
          {(post.tags || post.hashtags || []).map((tag, i) => (
            <View key={i} style={styles.tagBadge}><Text style={styles.tagText}>{tag}</Text></View>
          ))}
        </View>

        {/* 상세 본문 3단 구성 (딥블루 테두리 적용) */}
        <View style={styles.contentSection}>
          <Text style={styles.label}>상황명시</Text>
          <View style={styles.contentBox}><Text style={styles.contentText}>{post.situation}</Text></View>
        </View>

        <View style={styles.contentSection}>
          <Text style={styles.label}>구체적 행동 서술</Text>
          <View style={styles.contentBox}><Text style={styles.contentText}>{post.action}</Text></View>
        </View>

        <View style={styles.contentSection}>
          <Text style={styles.label}>회고</Text>
          <View style={styles.contentBox}><Text style={styles.contentText}>{post.retrospective}</Text></View>
        </View>
      </ScrollView>

      {/* 하단 탭 바 */}
      <BottomBar activeTab="" /> 
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 10 },
  logo: { fontSize: 28, fontWeight: 'bold', fontFamily: 'serif' },
  headerIcons: { flexDirection: 'row', alignItems: 'center' },
  scrollContent: { padding: 20, paddingBottom: 100 },
  dateText: { fontSize: 11, color: '#888', textAlign: 'right', marginBottom: 5 },
  titleText: { fontSize: 22, fontWeight: 'bold', marginBottom: 15, color: '#000' },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  authorText: { fontSize: 13, color: '#333' },
  bold: { fontWeight: '700' },
  statContainer: { flexDirection: 'row', gap: 12 },
  iconItem: { flexDirection: 'row', alignItems: 'center' },
  statNum: { fontSize: 13, color: '#888', marginLeft: 4, fontWeight: '500' },
  tagWrapper: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 30 },
  tagBadge: { backgroundColor: '#2B57D0', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  tagText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  contentSection: { marginBottom: 25 },
  label: { fontSize: 16, fontWeight: '700', color: '#000', marginBottom: 10 },
  contentBox: { borderWidth: 1.5, borderColor: '#2B57D0', borderRadius: 12, padding: 15, minHeight: 100, backgroundColor: '#fff' },
  contentText: { fontSize: 14, lineHeight: 22, color: '#333' }
});
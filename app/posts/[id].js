import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, Pressable, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Constants from 'expo-constants'; 
import client from '../../src/api/client'; // [핵심] 공통 axios 인스턴스 사용

export default function PostDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPostDetail = async () => {
      try {
        // 1. fetch 대신 client.get 사용
        // 헤더에 토큰을 수동으로 넣을 필요가 없습니다.
        const response = await client.get(`/posts/${id}`);
        
        // 2. axios 응답 데이터 추출 (result.data)
        setPost(response.data.data);
      } catch (error) {
        console.error(error);
        const status = error.response?.status;
        
        if (status === 404) {
          Alert.alert("알림", "존재하지 않는 게시글입니다.");
        } else if (status === 401) {
          Alert.alert("인증 오류", "로그인이 필요합니다.");
        } else {
          Alert.alert("에러", "글을 불러오는 중 문제가 발생했습니다.");
        }
        router.back();
      } finally {
        setLoading(false);
      }
    };
    
    if (id) fetchPostDetail();
  }, [id]);

  if (loading) return <ActivityIndicator size="large" color="#2B57D0" style={styles.loader} />;
  if (!post) return null;

  return (
    <View style={styles.container}>
      {/* 상단 헤더: 이미지 6 디자인 */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.headerIconText}>〈</Text>
        </Pressable>
        <Text style={styles.logo}>PastUs</Text>
        <View style={styles.headerRightIcons}>
          <Text style={styles.headerIconText}>🔍</Text>
          <Text style={styles.headerIconText}>☰</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* 날짜 포맷팅 */}
        <Text style={styles.dateText}>
          {post.createdAt?.split('T')[0].replace(/-/g, '.')}
          {post.createdAt !== post.updatedAt ? " (수정됨)" : ""}
        </Text>
        
        <Text style={styles.titleText}>{post.title}</Text>
        
        <View style={styles.infoRow}>
          <Text style={styles.authorText}>
            작성자: {post.isAnonymous ? '익명' : '작성자'}
          </Text>
          <View style={styles.statRow}>
            <Text style={styles.stats}>❤️ {post.likeCount}  👁️ {post.viewCount}</Text>
            <Pressable><Text style={styles.reportText}>신고</Text></Pressable>
          </View>
        </View>

        {/* 상황 태그 리스트 */}
        <View style={styles.tagWrapper}>
          {post.tags?.map((tag, i) => (
            <View key={i} style={styles.tagBadge}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>

        {/* 3단 본문 구성: 이미지 6의 파란색 박스 디자인 */}
        <View style={styles.contentSection}>
          <Text style={styles.label}>상황명시</Text>
          <View style={styles.contentBox}>
            <Text style={styles.contentText}>{post.situation}</Text>
          </View>
        </View>

        <View style={styles.contentSection}>
          <Text style={styles.label}>구체적 행동 서술</Text>
          <View style={styles.contentBox}>
            <Text style={styles.contentText}>{post.action}</Text>
          </View>
        </View>

        <View style={styles.contentSection}>
          <Text style={styles.label}>회고</Text>
          <View style={styles.contentBox}>
            <Text style={styles.contentText}>{post.retrospective}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: Constants.statusBarHeight },
  loader: { flex: 1, justifyContent: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, height: 60 },
  logo: { fontSize: 24, fontWeight: 'bold', fontFamily: 'serif' },
  headerRightIcons: { flexDirection: 'row', gap: 15 },
  headerIconText: { fontSize: 22 },
  scrollContent: { padding: 20, paddingBottom: 40 },
  dateText: { fontSize: 12, color: '#888', textAlign: 'right', marginBottom: 5 },
  titleText: { fontSize: 22, fontWeight: 'bold', marginBottom: 15 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  authorText: { fontSize: 14, color: '#333' },
  statRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  stats: { fontSize: 13, color: '#666' },
  reportText: { fontSize: 13, color: '#FF4D4D', fontWeight: 'bold' },
  tagWrapper: { flexDirection: 'row', gap: 8, marginBottom: 30 },
  tagBadge: { backgroundColor: '#2B57D0', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  tagText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  contentSection: { marginBottom: 25 },
  label: { fontSize: 16, fontWeight: 'bold', color: '#000', marginBottom: 10 },
  contentBox: { 
    borderWidth: 1.5, 
    borderColor: '#2B57D0', 
    borderRadius: 12, 
    padding: 15, 
    minHeight: 120,
    backgroundColor: '#F9FBFF' 
  },
  contentText: { fontSize: 14, lineHeight: 22, color: '#333' }
});
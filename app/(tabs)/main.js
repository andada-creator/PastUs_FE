import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

// 🚀 [중요] 반드시 { } 중괄호를 확인하세요!
import { getMyProfile } from '../../src/api/userService';
import { getAllPosts, getTrendingPosts, getTrendingTags } from '../../src/api/postService';
import PostCard from '../../src/components/main/PostCard'; 

export default function MainScreen() {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState(null);
  const [popularTags, setPopularTags] = useState([]);
  const [popularPosts, setPopularPosts] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchAllData(); }, []);

  const fetchAllData = async () => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      if (!token) { router.replace('/auth/login'); return; }

      // 🚀 모든 통신을 '가짜 모드'가 심어진 서비스 함수로 진행!
      const [userRes, tagsRes, popRes, recentRes] = await Promise.all([
        getMyProfile(),
        getTrendingTags(),
        getTrendingPosts(),
        getAllPosts(0, 3), 
      ]);

      // 서비스에서 돌려준 데이터를 상태에 저장
      if (userRes.status === 200) setUserInfo(userRes.data);
      if (tagsRes.status === 200) setPopularTags(tagsRes.data);
      if (popRes.status === 200) setPopularPosts(popRes.data); 
      if (recentRes.status === 200) setRecentPosts(recentRes.data.content);

    } catch (error) {
      console.log("데이터 로딩 중 발생한 에러:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <ActivityIndicator size="large" color="#2B57D0" style={{ flex: 1 }} />;

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 상단 배너 섹션 */}
        <View style={styles.proBanner}>
          <Text style={styles.proTitle}>정확한 문장 검색 + 제약없는 글쓰기</Text>
          <Text style={styles.proSub}>
            {userInfo?.userName}님의 현재 신뢰도는 {userInfo?.trustScore}% 입니다.
          </Text>
        </View>

        {/* 인기글 섹션 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>이번 달 인기글 Top 10</Text>
            <Pressable onPress={() => router.push('/posts/popular-list')}>
              <Text style={styles.more}>〉</Text>
            </Pressable>
          </View>
          {popularPosts.map(post => <PostCard key={post.postId} item={post} />)}
        </View>

        {/* 전체글 섹션 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>전체글 보기</Text>
            <Pressable onPress={() => router.push('/posts/all-list')}>
              <Text style={styles.more}>〉</Text>
            </Pressable>
          </View>
          {recentPosts.map(post => <PostCard key={post.postId} item={post} />)}
        </View>
      </ScrollView>
    </View>
  );
}

// 스타일 시트는 기존과 동일

// 스타일 시트는 기존과 동일하게 유지됩니다.
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 50 },
  header: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 10 },
  logo: { fontSize: 28, fontWeight: 'bold', fontFamily: 'serif' },
  headerIcons: { flexDirection: 'row', gap: 15 },
  icon: { fontSize: 22 },
  proBanner: { backgroundColor: '#2B57D0', margin: 20, padding: 20, borderRadius: 15 },
  proTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
  proSub: { color: '#fff', fontSize: 12, textAlign: 'center', marginTop: 8 },
  tokenInfo: { color: '#FFD700', fontSize: 13, fontWeight: 'bold', textAlign: 'center', marginTop: 5 },
  section: { paddingHorizontal: 20, marginBottom: 25 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  more: { fontSize: 20, color: '#999' },
  tagScroll: { flexDirection: 'row' },
  tagBadge: { backgroundColor: '#2B57D0', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, marginRight: 8 },
  tagText: { color: '#fff', fontWeight: 'bold' },
  fab: { 
    position: 'absolute', bottom: 30, alignSelf: 'center',
    backgroundColor: '#B5C7F7', width: 64, height: 64, borderRadius: 32,
    justifyContent: 'center', alignItems: 'center', elevation: 5 
  },
  fabText: { color: '#fff', fontSize: 40, fontWeight: '300' }
});
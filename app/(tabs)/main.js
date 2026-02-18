import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { useRouter, Stack } from 'expo-router'; // 🚀 Stack 추가!
import * as SecureStore from 'expo-secure-store';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

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

      const [userRes, tagsRes, popRes, recentRes] = await Promise.all([
        getMyProfile(),
        getTrendingTags(),
        getTrendingPosts(),
        getAllPosts(0, 3), 
      ]);

      if (userRes.status === 200) setUserInfo(userRes.data);
      if (tagsRes.status === 200) setPopularTags(tagsRes.data);
      if (popRes.status === 200) setPopularPosts(popRes.data.slice(0, 3)); 
      if (recentRes.status === 200) setRecentPosts(recentRes.data.content);

    } catch (error) {
      console.log("데이터 로딩 중 에러:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <ActivityIndicator size="large" color="#2B57D0" style={{ flex: 1 }} />;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* 🚀 시스템 헤더 숨기기 */}
      <Stack.Screen options={{ headerShown: false }}/>

      {/* 🚀 헤더 섹션: View로 감싸서 가로 정렬 */}
      <View style={styles.header}>
        <Text style={styles.logo}>PastUs</Text>
        <View style={styles.headerIcons}>
          <Pressable onPress={() => router.push('/search')}>
            <Ionicons name="search-outline" size={28} color="black" />
          </Pressable>
          <Pressable onPress={() => router.push('/menu')}>
            <Ionicons name="menu-outline" size={32} color="black" style={{ marginLeft: 15 }} />
          </Pressable>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 상단 배너 */}
        <View style={styles.proBanner}>
          <Text style={styles.proTitle}>정확한 문장 검색 + 제약없는 글쓰기</Text>
          <Text style={styles.proSub}>
            {userInfo?.userName}님의 현재 신뢰도는 {userInfo?.trustScore}% 입니다.
          </Text>
        </View>

        {/* 인기 태그 */}
        <View style={styles.tagSection}>
          <Text style={styles.sectionTitle}>이번 주 인기 태그</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tagList}>
            {popularTags.map((tag, index) => (
              <View key={index} style={styles.tagBadge}>
                <Text style={styles.tagText}>#{tag}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* 인기글 3개 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>이번 주 인기글 Top 10</Text>
            <Pressable onPress={() => router.push('/posts/popular-list')}>
              <Text style={styles.more}>〉</Text>
            </Pressable>
          </View>
          {popularPosts.map(post => <PostCard key={post.postId} item={post} />)}
        </View>

        {/* 전체글 3개 */}
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

      {/* 6. 플로팅 버튼 (+) */}
      <Pressable style={styles.fab} onPress={() => router.push('/posts/create')}>
        <Text style={styles.fabText}>+</Text>
      </Pressable>
      
    </SafeAreaView> // 🚀 여기서 닫아야 모든 콘텐츠가 안전 영역 안에 들어옵니다!
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingVertical: 15 
  },
  logo: { fontSize: 28, fontWeight: 'bold', fontFamily: 'serif' },
  headerIcons: { flexDirection: 'row', alignItems: 'center' },
  proBanner: { backgroundColor: '#2B57D0', margin: 20, padding: 20, borderRadius: 15 },
  proTitle: { color: '#fff', fontSize: 15, fontWeight: 'bold', textAlign: 'center' },
  proSub: { color: '#fff', fontSize: 12, textAlign: 'center', marginTop: 8 },
  tagSection: { paddingHorizontal: 20, marginBottom: 25 },
  tagList: { flexDirection: 'row', marginTop: 10 },
  tagBadge: { backgroundColor: '#2B57D0', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginRight: 8 },
  tagText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  section: { paddingHorizontal: 20, marginBottom: 25 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold' },
  more: { fontSize: 22, color: '#999' },
  fab: { 
    position: 'absolute', bottom: 30, right: 30, 
    backgroundColor: '#B5C7F7', width: 60, height: 60, borderRadius: 30, 
    justifyContent: 'center', alignItems: 'center', elevation: 5 
  },
  fabText: { color: '#fff', fontSize: 35, fontWeight: '300' }
});


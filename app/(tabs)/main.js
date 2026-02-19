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

      {/* 🚀 [핵심] 하단 탭 바 섹션 */}
      <View style={styles.bottomTab}>
        {/* 홈 버튼 */}
        <Pressable style={styles.tabItem} onPress={() => router.replace('/(tabs)/main')}>
          <Ionicons name="home" size={24} color="#000" />
          <Text style={styles.tabLabel}>홈</Text>
        </Pressable>

        {/* 플러스(+) 플로팅 버튼 */}
        <View style={styles.fabWrapper}>
          <Pressable style={styles.fab} onPress={() => router.push('/posts/create')}>
            <Text style={styles.fabIcon}>+</Text>
          </Pressable>
        </View>

        {/* 마이페이지 버튼 */}
        <Pressable style={styles.tabItem} onPress={() => router.push('/profile')}>
          <Ionicons name="person" size={24} color="#333" />
          <Text style={styles.tabLabel}>마이페이지</Text>
        </Pressable>
      </View>
      
    </SafeAreaView> // 🚀 여기서 닫아야 모든 콘텐츠가 안전 영역 안에 들어옵니다!
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff' 
  },
  /* 🚀 1. 헤더: 로고와 아이콘 정밀 배치 */
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingVertical: 12 
  },
  logo: { 
    fontSize: 26, 
    fontWeight: '700', 
    fontFamily: 'serif', // 세리프 서체 적용
    color: '#000'
  },
  headerIcons: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },

  /* 🚀 2. 프로 배너: 피그마 블루 컬러 적용 */
  proBanner: { 
    backgroundColor: '#2B57D0', 
    marginHorizontal: 20, 
    marginVertical: 15,
    paddingVertical: 24, 
    borderRadius: 12, // 시안의 둥근 모서리
    alignItems: 'center' 
  },
  proTitle: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: '700' 
  },
  proSub: { 
    color: 'rgba(255, 255, 255, 0.8)', 
    fontSize: 12, 
    marginTop: 6 
  },

  /* 🚀 3. 섹션 타이틀: 피그마 규격(18px, 600) 강제 적용 */
  section: { 
    paddingHorizontal: 20, 
    marginBottom: 30 
  },
  sectionHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 12 
  },
  sectionTitle: { 
    fontSize: 18,        // 피그마 명세
    fontWeight: '600',    // 피그마 명세 (SemiBold)
    lineHeight: 22,      // 피그마 명세
    color: '#000' 
  },
  more: { 
    fontSize: 20, 
    color: '#000', 
    fontWeight: '300' 
  },

  /* 🚀 4. 인기 태그: 가로 스크롤 및 배지 스타일 */
  tagSection: { 
    paddingLeft: 20, // 왼쪽 정렬 유지를 위해 패딩 분리
    marginBottom: 30 
  },
  tagList: { 
    marginTop: 10 
  },
  tagBadge: { 
    backgroundColor: '#2B57D0', 
    paddingHorizontal: 14, 
    paddingVertical: 7, 
    borderRadius: 20, 
    marginRight: 8 
  },
  tagText: { 
    color: '#fff', 
    fontSize: 12, 
    fontWeight: '700' 
  },

  /* 🚀 5. 하단 탭 바: 입체감 있는 그림자 적용 */
  bottomTab: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 85,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 25,
    // 그림자 설정 (iOS & Android)
    borderTopWidth: 0,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  tabItem: { 
    alignItems: 'center', 
    width: 60 
  },
  tabLabel: { 
    fontSize: 11, 
    marginTop: 4, 
    fontWeight: '500',
    color: '#000'
  },

  /* 🚀 6. 플로팅 플러스 버튼 (FAB) */
  fabWrapper: {
    top: -20,
  },
  fab: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#B5C7F7', // 시안 특유의 연블루
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  fabIcon: { 
    fontSize: 40, 
    color: '#fff', 
    fontWeight: '200' 
  }
});
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, ActivityIndicator, Pressable } from 'react-native'; // 🚀 ActivityIndicator 추가
import { useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getTrendingPosts } from '../../src/api/postService';
import PostCard from '../../src/components/main/PostCard';
import { Ionicons } from '@expo/vector-icons';

export default function PopularListScreen() {
  const router = useRouter();
  const [allPopular, setAllPopular] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPopular = async () => {
      try {
        const res = await getTrendingPosts();
        if (res.status === 200) {
          setAllPopular(res.data);
          setFilteredPosts(res.data);
        }
      } catch (error) {
        console.error("데이터 로딩 실패:", error);
      } finally {
        setLoading(false); // 🚀 데이터 로드 완료 후 로딩 해제
      }
    };
    fetchPopular();
  }, []);

  const onSearch = (text) => {
    setSearchText(text);
    const query = text.toLowerCase().replace('#', '');
    const filtered = allPopular.filter(post => 
      post.title.toLowerCase().includes(query) || 
      post.tags?.some(tag => tag.toLowerCase().includes(query))
    );
    setFilteredPosts(filtered);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <TextInput
            style={styles.input}
            placeholder="태그 검색 시 #삽입, 예) #진학"
            placeholderTextColor="#C4C4C4"
            value={searchText}
            onChangeText={onSearch}
            maxLength={20}
          />
          {/* 🚀 글자 수 표시 추가! */}
          <Text style={styles.charCount}>{searchText.length}/20</Text>
        </View>
        
        {/* 🚀 제목 두께를 아주 두껍게(900) 하고 간격을 벌렸습니다 */}
        <Text style={styles.pageTitle}>이번주 인기글 Top 10</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2B57D0" style ={{ flex: 1 }}/>
        </View>
      ) : (
        <FlatList
          data={filteredPosts}
          keyExtractor={(item) => item.postId.toString()}
          renderItem={({ item }) => <PostCard item={item} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<Text style={styles.emptyText}>검색 결과가 없습니다.</Text>}
        />
      )}
      <View style={styles.tabBarContainer}>
          <Pressable onPress={() => router.replace('/main')} style={[styles.tabItem, { borderRightWidth: 1, borderColor: '#F0F0F0' }]}>
            <Ionicons name="home" size={24} color="#000" />
            <Text style={styles.tabLabel}>홈</Text>
          </Pressable>

          <View style={styles.fabContainer}>
            <View style={styles.fabBackground}>
              <Pressable style={styles.fabButton} onPress={() => router.push('/posts/create')}>
                <Ionicons name="add" size={35} color="white" />
              </Pressable>
            </View>
          </View>

          <Pressable onPress={() => router.replace('/profile')} style={styles.tabItem}>
            <Ionicons name="person" size={24} color="#000" />
            <Text style={styles.tabLabel}>마이페이지</Text>
          </Pressable>
        </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  searchSection: { paddingHorizontal: 20, marginTop: 15 },
  searchBar: { 
    borderWidth: 1.5, 
    borderColor: '#4A7DFF', 
    borderRadius: 12, 
    paddingHorizontal: 15, 
    height: 48, 
    // 🚀 추가: 인풋과 0/20을 가로로 배치하기 위해 필수!
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  input: { 
    flex: 1, // 🚀 추가: 인풋이 남은 공간을 다 차지하게 함
    fontSize: 13 
  },
  charCount: { 
    fontSize: 11, 
    color: '#4A7DFF' 
  },
  pageTitle: { 
    // 🚀 피그마 규격대로 수정: 18px, 600>>700으로 변경
    fontSize: 18, 
    fontWeight: '700', 
    lineHeight: 22,
    color: '#000',
    textAlign: 'center', 
    // 🚀 간격 수정: "너무 붙어있다"는 피드백 반영
    marginTop: 14, 
    marginBottom: 20 
  },
  listContent: { paddingHorizontal: 20, paddingBottom: 40 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#999' },
//하단 탭 바 디자인
  tabBarContainer: { 
    flexDirection: 'row', 
    height: 85, 
    backgroundColor: '#fff', 
    borderTopWidth: 2, 
    borderTopColor: '#F0F0F0', 
    position: 'absolute', 
    bottom: 0, 
    width: '100%' 
  },
  tabItem: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: 5 },
  tabLabel: { fontSize: 11, marginTop: 4, fontWeight: '700' },
  fabContainer: { position: 'absolute', left: '50%', top: -25, marginLeft: -35, zIndex: 10 },
  fabBackground: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' },
  fabButton: { width: 55, height: 55, borderRadius: 27.5, backgroundColor: '#A8C3FF', justifyContent: 'center', alignItems: 'center' },
});
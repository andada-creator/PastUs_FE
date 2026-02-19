import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, ActivityIndicator } from 'react-native'; // 🚀 ActivityIndicator 추가
import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getTrendingPosts } from '../../src/api/postService';
import PostCard from '../../src/components/main/PostCard';

export default function PopularListScreen() {
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
});
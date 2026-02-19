import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// 🚀 우리가 만든 서비스 함수 임포트
import { getTrendingTags, searchPosts } from '../src/api/postService';

export default function SearchScreen() {
  const router = useRouter();
  
  // 상태 관리
  const [searchQuery, setSearchQuery] = useState('');
  const [popularTags, setPopularTags] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false); // 검색 수행 여부 체크

  // 1. 초기 로딩 시 인기 태그 가져오기
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await getTrendingTags();
        if (res.status === 200) setPopularTags(res.data);
      } catch (e) { console.log("태그 로딩 실패", e); }
    };
    fetchTags();
  }, []);

  // 2. 검색 실행 함수
  const handleSearch = async (overrideQuery) => {
    const query = overrideQuery || searchQuery;
    if (!query.trim()) return;

    setLoading(true);
    setSearched(true);
    
    try {
      // 명세서 규격에 맞춘 파라미터 전달 (기본 최신순)
      const res = await searchPosts({ 
        tags: [], // 필요 시 태그 ID 전달
        page: 0, 
        size: 20, 
        sort: 'latest' 
      });

      // 명세서 구조인 'items' 배열을 저장
      if (res.items) {
        setResults(res.items);
      }
    } catch (e) {
      console.log("검색 실패", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* 시스템 헤더 숨기기 */}
      <Stack.Screen options={{ headerShown: false }} />

      {/* 🚀 상단 검색 바 섹션 */}
      <View style={styles.searchHeader}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={30} color="black" />
        </Pressable>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.input}
            placeholder="검색어를 입력하세요"
            placeholderTextColor="#C4C4C4"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={() => handleSearch()} // 엔터 시 검색
            autoFocus={true} // 진입 시 바로 키보드 활성화
          />
          <Pressable onPress={() => handleSearch()}>
            <Ionicons name="search" size={22} color="#2B57D0" />
          </Pressable>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* 3. 인기 태그 섹션 (검색 전이나 결과가 없을 때 표시) */}
        {!searched && (
          <View style={styles.tagSection}>
            <Text style={styles.sectionTitle}>인기 태그</Text>
            <View style={styles.tagWrapper}>
              {popularTags.map((tag, index) => (
                <Pressable 
                  key={index} 
                  style={styles.tagBadge}
                  onPress={() => {
                    setSearchQuery(tag);
                    handleSearch(tag);
                  }}
                >
                  <Text style={styles.tagText}>#{tag}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {/* 4. 검색 결과 리스트 */}
        {loading ? (
          <ActivityIndicator size="large" color="#2B57D0" style={{ marginTop: 50 }} />
        ) : (
          results.map((item) => (
            <Pressable 
              key={item.postId} 
              style={styles.resultCard}
              onPress={() => router.push(`/posts/${item.postId}`)}
            >
              <Text style={styles.resultTitle}>{item.title}</Text>
              {/* 명세서의 preview(요약) 필드 활용 */}
              <Text style={styles.resultPreview} numberOfLines={2}>
                {item.preview}
              </Text>
              <View style={styles.resultFooter}>
                <View style={styles.statsRow}>
                  <Text style={styles.statsText}>👁️ {item.viewCount}</Text>
                  <Text style={styles.statsText}> 👍 {item.helpfulCount}</Text>
                </View>
                <Text style={styles.resultDate}>
                  {item.createdAt.split('T')[0].replace(/-/g, '.')}
                </Text>
              </View>
            </Pressable>
          ))
        )}

        {/* 검색 결과가 없을 때 메시지 */}
        {searched && !loading && results.length === 0 && (
          <Text style={styles.emptyText}>검색 결과가 없습니다.</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  // 상단 검색바 스타일
  searchHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 15, 
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0'
  },
  backBtn: { marginRight: 5 },
  searchContainer: { 
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#F5F5F5', 
    borderRadius: 25, 
    paddingHorizontal: 15, 
    height: 45 
  },
  input: { flex: 1, fontSize: 14, color: '#333', marginLeft: 5 },

  scrollContent: { padding: 20 },

  // 인기 태그 섹션 스타일
  tagSection: { marginBottom: 30 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 15, color: '#000' },
  tagWrapper: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  tagBadge: { 
    backgroundColor: '#F0F4FF', 
    paddingHorizontal: 14, 
    paddingVertical: 8, 
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#B5C7F7'
  },
  tagText: { color: '#2B57D0', fontSize: 13, fontWeight: '600' },

  // 검색 결과 카드 스타일
  resultCard: { 
    paddingVertical: 15, 
    borderBottomWidth: 1, 
    borderBottomColor: '#F0F0F0',
    marginBottom: 10
  },
  resultTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 6 },
  resultPreview: { fontSize: 13, color: '#666', lineHeight: 18, marginBottom: 10 },
  resultFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statsRow: { flexDirection: 'row', gap: 10 },
  statsText: { fontSize: 12, color: '#999' },
  resultDate: { fontSize: 12, color: '#C4C4C4' },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#999', fontSize: 15 }
});
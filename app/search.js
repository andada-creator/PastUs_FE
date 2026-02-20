import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, Pressable, ActivityIndicator, Modal } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import PostCard from '../src/components/main/PostCard'; 
import { searchPosts } from '../src/api/postService';

export default function SearchScreen() {
  const router = useRouter();
  const PRIMARY_400 = '#A8C3FF'; // 🚀 시안의 포인트 컬러

  // 🚀 15개 전체 태그 명단
  const ALL_TAGS = [
    "전체", "과제/팀플", "군대", "대학원", "성적", "새내기", "연애", "자취", 
    "장학금", "전과", "졸업", "취업", "편입", "휴학/복학", "N수/반수"
  ];

  const [searchQuery, setSearchQuery] = useState('');
  const [recentTags, setRecentTags] = useState([]);  
  const [filteredTags, setFilteredTags] = useState([]);
  const [results, setResults] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [viewState, setViewState] = useState('initial'); 
  const [sort, setSort] = useState('latest'); 
  const [isSortModalVisible, setIsSortModalVisible] = useState(false);

  useEffect(() => {
    const initData = async () => {
      try {
        const saved = await AsyncStorage.getItem('recent_search_tags');
        if (saved) setRecentTags(JSON.parse(saved));
      } catch (e) { console.log("데이터 로딩 실패", e); }
    };
    initData();
  }, []);

  const handleInputChange = (text) => {
    if (text.length <= 30) {
      setSearchQuery(text);
      if (text.trim().length > 0) {
        setViewState('typing'); //
        const query = text.startsWith('#') ? text.substring(1) : text;
        const filtered = ALL_TAGS.filter(tag => tag.toLowerCase().includes(query.toLowerCase()));
        setFilteredTags(filtered);
      } else {
        setViewState('initial'); //
      }
    }
  };

  const handleSearch = async (overrideQuery) => {
    let query = overrideQuery || searchQuery;
    if (!query.trim()) return;
    if (!query.startsWith('#')) query = `#${query}`;

    setLoading(true);
    setViewState('results'); //
    setSearchQuery(query);

    const pureTag = query.substring(1);
    const updatedRecent = [pureTag, ...recentTags.filter(t => t !== pureTag)].slice(0, 10);
    setRecentTags(updatedRecent);
    await AsyncStorage.setItem('recent_search_tags', JSON.stringify(updatedRecent));

    try {
      const res = await searchPosts({ tags: [pureTag], sort: sort }); 
      setResults(res.items || []);
      setTotalCount(res.totalElements || 0);
    } catch (e) { console.log("검색 실패", e); }
    finally { setLoading(false); }
  };

  // 🚀 정렬 메뉴 아이템 (아카이브 스타일)
  const SortItem = ({ label, value, current, onSelect }) => (
    <Pressable style={styles.sortMenuItem} onPress={() => onSelect(value)}>
      <Text style={[styles.sortMenuItemText, current === value && styles.activeSortText]}>{label}</Text>
    </Pressable>
  );

  return (
    <View style={styles.outerContainer}>
      {/* 🚀 상태바 영역 흰색 고정 */}
      <SafeAreaView style={styles.statusBarBg} edges={['top']} />
      
      <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
        <Stack.Screen options={{ headerShown: false }} />

        {/* 🚀 검색바: 중앙 정렬 및 0/30 위치 */}
        <View style={styles.searchHeader}>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.input}
              placeholder="태그 검색 시 # 삽입, 예) #진학"
              placeholderTextColor="#C4C4C4"
              value={searchQuery}
              onChangeText={handleInputChange}
              onSubmitEditing={() => handleSearch()}
            />
            <Text style={styles.charCounter}>{searchQuery.length}/30</Text>
          </View>
        </View>

        <ScrollView 
          style={styles.contentBg} 
          contentContainerStyle={viewState === 'results' ? { paddingBottom: 100 } : {}} 
          showsVerticalScrollIndicator={false}
        >
          {/* 초기 화면: 15개 전체 태그 */}
          {viewState === 'initial' && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>전체 태그</Text>
                <Text style={styles.subInfo}>토큰 사용하기</Text>
              </View>
              <View style={styles.tagWrapper}>
                {ALL_TAGS.map((tag, i) => (
                  <Pressable key={i} style={styles.tagBadge} onPress={() => handleSearch(tag)}>
                    <Text style={styles.tagText}>#{tag}</Text>
                  </Pressable>
                ))}
              </View>
              {recentTags.length > 0 && (
                <View style={styles.recentSection}>
                  <Text style={styles.sectionTitle}>최근 검색 태그</Text>
                  <View style={styles.recentWrapper}>
                    {recentTags.map((tag, i) => (
                      <Pressable key={i} style={styles.recentBadge} onPress={() => handleSearch(tag)}>
                        <Text style={styles.recentText}>#{tag}</Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              )}
            </View>
          )}

          {/* 타이핑 모드 */}
          {viewState === 'typing' && (
            <View style={styles.typingSection}>
              {filteredTags.map((tag, i) => (
                <Pressable key={i} style={styles.autoCompleteItem} onPress={() => handleSearch(tag)}>
                  <View style={styles.hashIcon}><Text style={{color: 'white', fontWeight: 'bold'}}>#</Text></View>
                  <Text style={styles.autoCompleteText}>{tag}</Text>
                </Pressable>
              ))}
            </View>
          )}

          {/* 결과 모드 */}
          {viewState === 'results' && (
            loading ? (
              <ActivityIndicator size="large" color="#2B57D0" style={{ marginTop: 50 }} />
            ) : (
              <View style={styles.resultsContainer}>
                <View style={styles.resultsHeader}>
                  <Text style={styles.resultCount}>검색결과: {totalCount}개</Text>
                  <Pressable style={styles.sortBtn} onPress={() => setIsSortModalVisible(true)}>
                    <Text style={styles.sortText}>
                      {sort === 'latest' ? '최신순' : sort === 'likes' ? '좋아요순' : '조회수순'} 
                    </Text>
                    <Ionicons name="chevron-down" size={16} color="black" />
                  </Pressable>
                </View>
                {results.map((item) => (
                  <PostCard key={item.postId} item={item} isSearch={true} />
                ))}
              </View>
            )
          )}
        </ScrollView>

        {/* 🚀 결과창 하단 탭 바 (제공해주신 디자인 적용) */}
        {viewState === 'results' && (
          <View style={styles.tabBarContainer}>
            <Pressable onPress={() => router.replace('/main')} style={[styles.tabItem, { borderRightWidth: 1, borderColor: '#F0F0F0' }]}>
              <Ionicons name="home" size={24} color="#000" />
              <Text style={styles.tabLabel}>홈</Text>
            </Pressable>

            <View style={styles.fabContainer}>
              <View style={styles.fabBackground}>
                {/* 🚀 + 누르면 게시글 작성 창으로 이동 */}
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
        )}
      </SafeAreaView>

      {/* 정렬 모달 */}
      <Modal visible={isSortModalVisible} transparent animationType="none">
        <Pressable style={styles.modalOverlay} onPress={() => setIsSortModalVisible(false)}>
          <View style={styles.sortMenuContainer}>
            <SortItem label="최신순" value="latest" current={sort} onSelect={(v) => {setSort(v); setIsSortModalVisible(false);}} />
            <SortItem label="좋아요순" value="likes" current={sort} onSelect={(v) => {setSort(v); setIsSortModalVisible(false);}} />
            <SortItem label="조회수순" value="views" current={sort} onSelect={(v) => {setSort(v); setIsSortModalVisible(false);}} />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: { flex: 1, backgroundColor: '#F8FAFF' }, 
  statusBarBg: { backgroundColor: '#fff' }, 
  container: { flex: 1 },

  searchHeader: { padding: 15, backgroundColor: '#F8FAFF' },
  searchContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#fff', 
    borderWidth: 1.5, 
    borderColor: '#2B57D0', 
    borderRadius: 12, 
    paddingHorizontal: 15, 
    height: 55, 
    position: 'relative' 
  },
  // 🚀 텍스트 중앙 정렬 최적화
  input: { 
    flex: 1, 
    fontSize: 14, 
    fontWeight: '600', 
    textAlignVertical: 'center', 
    paddingVertical: 0, 
    height: '100%' 
  },
  charCounter: { position: 'absolute', right: 12, bottom: 6, fontSize: 10, color: '#2B57D0', fontWeight: 'bold' },

  contentBg: { flex: 1 },
  section: { padding: 20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#333' },
  subInfo: { fontSize: 12, color: '#999' },
  tagWrapper: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  tagBadge: { backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#E0E0E0' },
  tagText: { color: '#333', fontSize: 14, fontWeight: '600' },

  recentSection: { marginTop: 30 },
  recentWrapper: { flexDirection: 'column', gap: 10, marginTop: 10 }, 
  recentBadge: { backgroundColor: '#2B57D0', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, alignSelf: 'flex-start' },
  recentText: { color: '#fff', fontSize: 13, fontWeight: '700' },

  typingSection: { paddingHorizontal: 20 },
  autoCompleteItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15 },
  hashIcon: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#2B57D0', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  autoCompleteText: { fontSize: 16, fontWeight: '600' },

  resultsContainer: { paddingHorizontal: 20 },
  resultsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15 },
  resultCount: { fontSize: 14, fontWeight: '700' },
  sortBtn: { flexDirection: 'row', alignItems: 'center' },
  sortText: { fontSize: 14, fontWeight: '600' },

  // 🚀 하단 탭 바 (디자인 완벽 이식)
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

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.05)' },
  sortMenuContainer: { position: 'absolute', top: 180, right: 20, backgroundColor: '#fff', borderRadius: 10, padding: 5, elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 5 },
  sortMenuItem: { paddingHorizontal: 20, paddingVertical: 12, borderBottomWidth: 0.5, borderBottomColor: '#f0f0f0' },
  sortMenuItemText: { fontSize: 13, color: '#333' },
  activeSortText: { color: '#2B57D0', fontWeight: 'bold' }
});
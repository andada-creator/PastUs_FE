import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, Pressable, ActivityIndicator, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, Stack } from 'expo-router'; // 🚀 Stack, useRouter 모두 포함
import { getArchivePosts } from '../../src/api/archiveService';
import BottomBar from '../../src/components/navigation/BottomBar';

// --- [1. 정렬 모달용 개별 아이템 컴포넌트] ---
const SortItem = ({ label, value, current, onSelect }) => (
  <Pressable style={styles.sortMenuItem} onPress={() => onSelect(value)}>
    <Text style={[styles.sortMenuItemText, current === value && styles.activeSortText]}>
      {label}
    </Text>
  </Pressable>
);

// --- [2. 아카이브 전용 포스트 카드 컴포넌트] ---
const ArchivePostCard = ({ item, onPress }) => (
  <Pressable style={styles.card} onPress={onPress}>
    <View style={styles.cardHeader}>
      <View style={styles.labelGroup}>
        <Text style={styles.cardLabel}>작성자</Text>
        <View style={styles.verticalDivider} />
        <Text style={styles.cardValue}>
          {item.userName || '익명'} 
          <Text style={styles.trustText}> (신뢰도: {item.trustScore || 50}%)</Text>
        </Text>
      </View>
      <Text style={styles.dateText}>2026.01.30</Text>
    </View>

    <View style={styles.labelGroup}>
      <Text style={styles.cardLabel}>제목</Text>
      <View style={styles.verticalDivider} />
      <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
    </View>

    <View style={styles.cardFooter}>
      <View style={styles.tagGroup}>
        {(item.hashtags || ['#태그', '#태그', '#태그']).map((tag, i) => (
          <View key={i} style={styles.tagBadge}><Text style={styles.tagText}>{tag}</Text></View>
        ))}
      </View>
      <View style={styles.statsGroup}>
        <Ionicons name="heart-outline" size={14} color="#888" />
        <Text style={styles.statNum}>{item.likeCount || 12}</Text>
        <Ionicons name="eye-outline" size={14} color="#888" style={{ marginLeft: 8 }} />
        <Text style={styles.statNum}>{item.viewCount || 12}</Text>
      </View>
    </View>
  </Pressable>
);

// --- [3. 메인 아카이브 스크린] ---
export default function ArchiveScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState('MY_POST'); 
  const [sort, setSort] = useState('latest');      
  const [isSortModalVisible, setIsSortModalVisible] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchPosts();
  }, [filter, sort]);

  const fetchPosts = async () => {
    try {
      setLoading(false); // 로딩 표시를 위해 잠시 끔
      const res = await getArchivePosts(filter, sort); 
      if (res.status === 200) setPosts(res.data.content);
    } catch (e) {
      console.error("아카이브 로드 실패:", e);
    } finally {
      setLoading(false);
    }
  };

  const getSortLabel = () => {
    if (sort === 'likes') return '좋아요순';
    if (sort === 'views') return '조회수순';
    return '최신순';
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* 🚀 상단 PastUs 헤더 제거 */}
      <Stack.Screen options={{ headerShown: false }} />

      {/* 🚀 1. 검색바: 최상단 밀착 */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <TextInput
            style={styles.input}
            placeholder="태그 검색 시 #삽입, 예) #진학"
            placeholderTextColor="#C4C4C4"
            value={searchText}
            onChangeText={setSearchText}
          />
          <Text style={styles.charCount}>{searchText.length}/20</Text>
        </View>
      </View>

      {/* 🚀 2. 탭 및 정렬: 검색바 바로 아래 */}
      <View style={styles.controlRow}>
        <View style={styles.tabs}>
          <Pressable style={[styles.tab, filter === 'MY_POST' && styles.activeTab]} onPress={() => setFilter('MY_POST')}>
            <Text style={[styles.tabText, filter === 'MY_POST' && styles.activeTabText]}>나의 과거</Text>
          </Pressable>
          <Pressable style={[styles.tab, filter === 'LIKED' && styles.activeTab]} onPress={() => setFilter('LIKED')}>
            <Text style={[styles.tabText, filter === 'LIKED' && styles.activeTabText]}>타인의 과거</Text>
          </Pressable>
        </View>

        <Pressable style={styles.sortBtn} onPress={() => setIsSortModalVisible(true)}>
          <Text style={styles.sortLabel}>{getSortLabel()}</Text>
          <Ionicons name="chevron-down" size={14} color="black" />
        </Pressable>
      </View>

      {/* 🚀 3. 리스트 영역 */}
      <View style={styles.listWrapper}>
        {loading ? (
          <ActivityIndicator size="large" color="#2B57D0" style={{ marginTop: 50 }} />
        ) : (
          <FlatList
            data={posts}
            keyExtractor={(item) => item.postId.toString()}
            renderItem={({ item }) => (
              <ArchivePostCard 
                item={item} 
                onPress={() => router.push(`/posts/${item.postId}`)} //archive에서 경로 변경!
              />
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      {/* 🚀 4. 정렬 모달: 버튼 바로 아래에 메뉴가 뜸 */}
      <Modal visible={isSortModalVisible} transparent animationType="none">
        <Pressable style={styles.modalOverlay} onPress={() => setIsSortModalVisible(false)}>
          <View style={styles.sortMenuContainer}>
            <SortItem label="최신순" value="latest" current={sort} onSelect={(v) => {setSort(v); setIsSortModalVisible(false);}} />
            <SortItem label="좋아요순" value="likes" current={sort} onSelect={(v) => {setSort(v); setIsSortModalVisible(false);}} />
            <SortItem label="조회수순" value="views" current={sort} onSelect={(v) => {setSort(v); setIsSortModalVisible(false);}} />
          </View>
        </Pressable>
      </Modal>

      
        {/* 하단바 추가 */}
        <BottomBar activeTab="profile" />
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  searchSection: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 12 },
  searchBar: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: '#4A7DFF', borderRadius: 12, paddingHorizontal: 15, height: 48 },
  input: { flex: 1, fontSize: 13 },
  charCount: { fontSize: 11, color: '#4A7DFF' },

  controlRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#eee' },
  tabs: { flexDirection: 'row', gap: 20 },
  tab: { paddingVertical: 12 },
  activeTab: { borderBottomWidth: 2, borderBottomColor: '#2B57D0' },
  tabText: { fontSize: 15, color: '#999' },
  activeTabText: { color: '#2B57D0', fontWeight: 'bold' },
  sortBtn: { flexDirection: 'row', alignItems: 'center' },
  sortLabel: { fontSize: 14, marginRight: 4 },

  listWrapper: { flex: 1, backgroundColor: '#F6F8FD', paddingBottom: 80 }, 
  listContent: { paddingHorizontal: 20, paddingVertical: 20 },

  /* 카드 디자인 (연한 파란색 배경) */
  card: { backgroundColor: '#D7E3FF', borderRadius: 20, padding: 18, marginBottom: 15 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  labelGroup: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  cardLabel: { fontSize: 12, fontWeight: '700', width: 40 },
  verticalDivider: { width: 1.5, height: 12, backgroundColor: '#000', marginHorizontal: 10 },
  cardValue: { fontSize: 12, fontWeight: '700' },
  trustText: { fontSize: 10, fontWeight: '400', color: '#666' },
  cardTitle: { fontSize: 12, fontWeight: '700', flex: 1 },
  dateText: { fontSize: 10, color: '#888' },

  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  tagGroup: { flexDirection: 'row', gap: 6 },
  tagBadge: { backgroundColor: '#2B57D0', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 15 },
  tagText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  statsGroup: { flexDirection: 'row', alignItems: 'center' },
  statNum: { fontSize: 11, color: '#888', marginLeft: 3 },

  fab: { position: 'absolute', bottom: 100, alignSelf: 'center', width: 60, height: 60, borderRadius: 30, backgroundColor: '#A8C3FF', justifyContent: 'center', alignItems: 'center', elevation: 5 },

  /* 🚀 정렬 메뉴: 위치를 버튼 아래로 조정 */
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.05)' },
  sortMenuContainer: { position: 'absolute', top: 120, right: 20, backgroundColor: '#fff', borderRadius: 10, padding: 5, elevation: 10 },
  sortMenuItem: { paddingHorizontal: 20, paddingVertical: 12, borderBottomWidth: 0.5, borderBottomColor: '#f0f0f0' },
  sortMenuItemText: { fontSize: 13, color: '#333' },
  activeSortText: { color: '#2B57D0', fontWeight: 'bold' }
});
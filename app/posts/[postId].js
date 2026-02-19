import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, Pressable, Alert } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router'; // 🚀 Stack 추가
import { SafeAreaView } from 'react-native-safe-area-context'; // 🚀 SafeAreaView 추가
import { Ionicons } from '@expo/vector-icons';
import { getPostDetail } from '../../src/api/postService';

export default function PostDetail() {
  const { postId } = useLocalSearchParams();
  const router = useRouter();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await getPostDetail(id);
        setPost(response.data); // 명세서상 data 바로 아래 필드들이 있음
      } catch (error) {
        Alert.alert("알림", "글을 불러오지 못했습니다.");
        router.back();
      } finally { setLoading(false); }
    };
    if (postId) fetchDetail();
  }, [postId]);

  if (loading) return <ActivityIndicator size="large" color="#2B57D0" style={{ flex: 1 }} />;
  if (!post) return null;

  // 🚀 데이터 가공
  const displayDate = post.createdAt?.split('T')[0].replace(/-/g, '.');
  const isEdited = post.createdAt !== post.updatedAt;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* 🚀 시스템 헤더 숨기기 */}
      <Stack.Screen options={{ headerShown: false }} />

      {/* 1. 상단 헤더 (디자인 통일) */}
      <View style={styles.header}>
        <Text style={styles.logo}>PastUs</Text>
        <View style={styles.headerIcons}>
          <Ionicons name="search-outline" size={26} color="black" />
          <Ionicons name="menu-outline" size={30} color="black" style={{ marginLeft: 15 }} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* 날짜 및 수정 표시 */}
        <Text style={styles.dateText}>{displayDate} {isEdited && "(수정됨)"}</Text>
        
        <Text style={styles.titleText}>{post.title}</Text>
        
        {/* 작성자 및 통계 (Flat 구조 반영) */}
        <View style={styles.infoRow}>
          <Text style={styles.authorText}>
            작성자: {post.isAnonymous ? '익명' : '작성자'} (신뢰도: {post.trustScore}%)
          </Text>
          <View style={styles.statRow}>
            <Text style={styles.stats}>❤️ {post.likeCount}  👁️ {post.viewCount}</Text>
            <Pressable onPress={() => Alert.alert("신고", "신고 접수되었습니다.")}>
              <Text style={styles.reportText}>신고</Text>
            </Pressable>
          </View>
        </View>

        {/* 태그 */}
        <View style={styles.tagWrapper}>
          {post.tags?.map((tag, i) => (
            <View key={i} style={styles.tagBadge}><Text style={styles.tagText}>{tag}</Text></View>
          ))}
        </View>

        {/* 2. 경험 박스 3단 구성 */}
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

      {/* 3. 하단 탭 바 (Main과 동일) */}
      <View style={styles.bottomTab}>
        <Pressable style={styles.tabItem} onPress={() => router.replace('/(tabs)/main')}>
          <Ionicons name="home" size={24} color="#000" />
          <Text style={styles.tabLabel}>홈</Text>
        </Pressable>
        <View style={styles.fabWrapper}>
          <Pressable style={styles.fab} onPress={() => router.push('/posts/create')}>
            <Text style={styles.fabIcon}>+</Text>
          </Pressable>
        </View>
        <Pressable style={styles.tabItem} onPress={() => router.push('/profile')}>
          <Ionicons name="person-outline" size={24} color="#333" />
          <Text style={styles.tabLabel}>마이페이지</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

// 스타일 시트는 기존과 거의 동일 (하단 탭 바 스타일 추가 필수)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 10 },
  logo: { fontSize: 28, fontWeight: 'bold', fontFamily: 'serif' },
  headerIcons: { flexDirection: 'row', alignItems: 'center' },
  scrollContent: { padding: 20, paddingBottom: 100 },
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
  contentBox: { borderWidth: 1.5, borderColor: '#2B57D0', borderRadius: 12, padding: 15, minHeight: 120, backgroundColor: '#fff' },
  contentText: { fontSize: 14, lineHeight: 22, color: '#333' },
  
  // 하단 탭 바 (Main.js에서 가져온 스타일)
  bottomTab: { position: 'absolute', bottom: 0, width: '100%', height: 70, backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#f0f0f0', paddingBottom: 10 },
  tabItem: { alignItems: 'center', width: 80 },
  tabLabel: { fontSize: 10, marginTop: 4, fontWeight: '600' },
  fabWrapper: { top: -25 },
  fab: { width: 65, height: 65, borderRadius: 32.5, backgroundColor: '#B5C7F7', justifyContent: 'center', alignItems: 'center', elevation: 5 },
  fabIcon: { fontSize: 40, color: '#fff', fontWeight: '300' }
});
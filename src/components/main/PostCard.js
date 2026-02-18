import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

export default function PostCard({ item }) {
  const router = useRouter();

  // 1. 익명 여부에 따른 이름 처리
  // isAnonymous가 true면 '익명', false면 loginId를 보여줍니다.
  const authorName = item.author?.isAnonymous ? '익명' : item.author?.loginId || '알 수 없음';
  
  // 2. 날짜 포맷팅: "2026-01-30T..." -> "2026.01.30"
  const formattedDate = item.createdAt ? item.createdAt.split('T')[0].replace(/-/g, '.') : '';

  return (
    // 카드를 누르면 상세 페이지로 이동 (게시글 ID 전달)
    <Pressable 
      style={styles.card} 
      onPress={() => router.push(`/posts/${item.postId}`)}
    >
      <View style={styles.header}>
        <View style={styles.authorRow}>
          <Text style={styles.authorLabel}>작성자 </Text>
          <Text style={styles.authorValue}>|  {authorName}</Text>
          {/* 신뢰도 표시: ERD 및 API 명칭 참고 */}
          <Text style={styles.trustScore}> (신뢰도: {item.author?.trustScore || 0}%)</Text>
        </View>
        <Text style={styles.date}>{formattedDate}</Text>
      </View>

      <View style={styles.titleRow}>
        <Text style={styles.titleLabel}>제목 </Text>
        <Text style={styles.titleValue} numberOfLines={1}>|  {item.title}</Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.tagContainer}>
          {/* 상황 태그 매핑 */}
          {item.tags?.map((tag, index) => (
            <View key={index} style={styles.tagBadge}>
              <Text style={styles.tagText}>{tag.startsWith('#') ? tag : `#${tag}`}</Text>
            </View>
          ))}
        </View>
        
        {/* 좋아요 및 조회수 */}
        <View style={styles.statsContainer}>
          <Text style={styles.statsText}>❤️ {item.stats?.likeCount || 0}  👁️ {item.stats?.viewCount || 0}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#E6EEFF', // 이미지 1의 연한 파란색 배경
    borderRadius: 15,
    padding: 15,
    marginBottom: 12,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  authorRow: { flexDirection: 'row', alignItems: 'center' },
  authorLabel: { fontSize: 12, color: '#333' },
  authorValue: { fontSize: 12, fontWeight: 'bold', color: '#000' },
  trustScore: { fontSize: 11, color: '#666' },
  date: { fontSize: 11, color: '#888' },
  titleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  titleLabel: { fontSize: 13, color: '#333' },
  titleValue: { fontSize: 13, fontWeight: '600', color: '#000', flex: 1 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  tagContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 5 },
  tagBadge: { 
    backgroundColor: '#2B57D0', // 진한 파란색 태그
    paddingHorizontal: 10, 
    paddingVertical: 4, 
    borderRadius: 20 
  },
  tagText: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
  statsContainer: { flexDirection: 'row', gap: 10 },
  statsText: { fontSize: 12, color: '#666' }
});
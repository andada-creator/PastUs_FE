
import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { toggleLikePost } from '../../api/postService';

export default function PostCard({ item }) {
  const router = useRouter();

  // 1. 좋아요 상태 및 카운트 관리 (초기값은 서버 데이터 기준)
  // 보통 서버에서 해당 게시글을 내가 눌렀는지 여부(liked)도 함께 보내줍니다.
  const [isLiked, setIsLiked] = useState(item.liked || false); 
  const [likeCount, setLikeCount] = useState(item.stats?.likeCount ?? item.helpfulCount ?? 0);

  // 2. 좋아요 토글 핸들러
  const handleLike = async () => {
    try {
      // API 호출: 명세서의 POST /posts/{postId}/like 실행
      const res = await toggleLikePost(item.postId);

      // 서버 응답({liked, totalLikes})을 바탕으로 상태 확정
      setIsLiked(res.liked);
      setLikeCount(res.totalLikes);
    } catch (error) {
      console.error("좋아요 처리 실패:", error);
      // 실패 시 사용자에게 알림을 주거나 이전 상태로 롤백하는 로직을 추가할 수 있습니다.
    }
  };

  // 🚀 데이터 구조 방어 로직
  const authorName = item.author?.loginId || item.loginId || (item.isAnonymous ? '익명' : '작성자');
  const trustScore = item.author?.trustScore || item.trustScore || 0;
  
  // 인기글은 stats.likeCount, 전체글은 helpfulCount를 사용함
  
  const views = item.stats?.viewCount ?? item.viewCount ?? 0;
  const date = (item.createdAt || "").split('T')[0].replace(/-/g, '.');

  return (
    <Pressable 
      style={styles.card} 
      onPress={() => router.push(`/posts/${item.postId}`)}
    >
      <View style={styles.topRow}>
        <Text style={styles.authorText}>
          작성자 | <Text style={styles.bold}>{authorName}</Text> (신뢰도: {trustScore}%)
        </Text>
        <Text style={styles.dateText}>{date}</Text>
      </View>

      <View style={styles.contentRow}>
        <Text style={styles.titleText} numberOfLines={1}>
          제목 | <Text style={styles.bold}>{item.title}</Text>
        </Text>
        {/* 전체글 리스트에만 있는 요약(preview) 표시 */}
        {item.preview && (
          <Text style={styles.previewText} numberOfLines={1}>{item.preview}</Text>
        )}
      </View>

      <View style={styles.footer}>
        <View style={styles.tagRow}>
          {item.tags?.map((tag, i) => (
            <View key={i} style={styles.tagBadge}>
              <Text style={styles.tagText}>{tag.startsWith('#') ? tag : `#${tag}`}</Text>
            </View>
          ))}
        </View>
        <View style={styles.statsRow}>
          {/* 🚀 하트 클릭 시 부모(카드 전체)로 이벤트가 퍼지는 것을 막습니다. */}
          <Pressable 
            onPress={(e) => {
              e.stopPropagation(); // 🚀 이 줄이 '카드 클릭(상세 이동)'을 막아주는 핵심입니다!
              handleLike();
            }} 
            style={styles.iconWrapper}
            hitSlop={10} // 💡 추가 팁: 클릭 영역을 조금 더 넓혀서 누르기 편하게 만듭니다.
          >     
            <Ionicons 
              name={isLiked ? "heart" : "heart-outline"} 
              size={18} 
              color={isLiked ? "#FF4D4D" : "#888"} 
            />
          </Pressable>

          <Text style={[styles.statsValue, isLiked && { color: '#FF4D4D' }]}>
            {likeCount}
          </Text>
  
          <Ionicons name="eye-outline" size={18} color="#888" style={{ marginLeft: 10 }} />
          <Text style={styles.statsValue}>{views}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#F0F4FF', borderRadius: 15, padding: 15, marginBottom: 8 }, // 🚀 카드 간격 더 좁게 (10 -> 8)
  topRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  authorText: { fontSize: 13, color: '#333' },
  divider: { color: '#000', fontWeight: 'normal' },
  bold: { fontWeight: 'bold', color: '#000' },
  dateText: { fontSize: 11, color: '#999' },
  contentRow: { marginBottom: 12 },
  titleText: { fontSize: 15, color: '#333' },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  tagRow: { flexDirection: 'row', gap: 5 },
  tagBadge: { backgroundColor: '#2B57D0', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 15 },
  tagText: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
  statsRow: { flexDirection: 'row', alignItems: 'center' },
  iconWrapper: { padding: 2 }, // 하트 클릭 영역 확보
  statsValue: { fontSize: 12, color: '#666', marginLeft: 4 }
});
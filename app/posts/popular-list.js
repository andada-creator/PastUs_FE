import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TextInput, StyleSheet, ActivityIndicator } from 'react-native';
import { getTrendingPosts } from '../../src/api/postService';
import PostCard from '../../src/components/main/PostCard';

export default function PopularPostsList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTrending = async () => {
      try {
        const response = await getTrendingPosts(); // 🚀 /posts/trending 호출
        if (response.status === 200) setPosts(response.data);
      } finally { setLoading(false); }
    };
    loadTrending();
  }, []);

  return (
    <View style={styles.container}>
      {/* 🚀 상단 검색바 UI (image_59cb0f.jpg 반영) */}
      <View style={styles.searchSection}>
        <TextInput 
          style={styles.searchInput} 
          placeholder="태그 검색 시 #삽입, 예) #진학" 
          placeholderTextColor="#999"
        />
        <Text style={styles.charLimit}>0/20</Text>
      </View>

      <Text style={styles.pageTitle}>이번주 인기글 Top 10</Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        {loading ? (
          <ActivityIndicator size="large" color="#2B57D0" />
        ) : (
          posts.map((item) => <PostCard key={item.postId} item={item} />)
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 20, paddingTop: 60 },
  searchSection: { 
    borderWidth: 1, borderColor: '#2B57D0', borderRadius: 10, 
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, marginBottom: 30 
  },
  searchInput: { flex: 1, paddingVertical: 12, fontSize: 14 },
  charLimit: { fontSize: 12, color: '#2B57D0' },
  pageTitle: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 }
});
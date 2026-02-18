import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TextInput, StyleSheet, ActivityIndicator } from 'react-native';
import { getAllPosts } from '../../src/api/postService';
import PostCard from '../../src/components/main/PostCard';

export default function AllPostsList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0); // 🚀 페이지 번호 (0부터 시작)

  useEffect(() => {
    const loadAllPosts = async () => {
      try {
        // 🚀 명세서 규격에 맞춰 page와 size(예: 20) 전달
        const response = await getAllPosts(page, 20); 
        if (response.status === 200) {
          setPosts(response.data.content); // content 배열 추출
        }
      } finally { setLoading(false); }
    };
    loadAllPosts();
  }, [page]);

  return (
    <View style={styles.container}>
      <View style={styles.searchSection}>
        <TextInput style={styles.searchInput} placeholder="태그 검색 시 #삽입, 예) #진학" />
      </View>

      <Text style={styles.pageTitle}>전체글</Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        {posts.map((item) => <PostCard key={item.postId} item={item} />)}
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
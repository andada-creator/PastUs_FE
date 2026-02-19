import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function BottomBar({ activeTab }) {
  const router = useRouter();
  const PRIMARY_400 = '#A8C3FF'; // 🚀 시안의 primary/400 색상

  return (
    <View style={styles.tabBarContainer}>
      {/* 1. 홈 버튼 */}
      <Pressable
        onPress={() => router.replace('/main')}
        style={[styles.tabItem, activeTab === 'home' && { backgroundColor: PRIMARY_400 }, { borderRightWidth: 1, borderColor: '#fff' }]}
      >
        <Ionicons name="home" size={24} color="#000" />
        <Text style={styles.tabLabel}>홈</Text>
      </Pressable>

      {/* 2. 가운데 플러스 버튼 */}
      <View style={styles.fabContainer}>
        <View style={styles.fabBackground}>
          <Pressable style={styles.fabButton} onPress={() => router.push('/posts/create')}>
            <Ionicons name="add" size={35} color="white" />
          </Pressable>
        </View>
      </View>

      {/* 3. 마이페이지 버튼 (아카이브도 마이페이지 탭에 포함됨) */}
      <Pressable
        onPress={() => router.replace('/profile')}
        style={[styles.tabItem, activeTab === 'profile' && { backgroundColor: PRIMARY_400 }]}
      >
        <Ionicons name="person" size={24} color="#000" />
        <Text style={styles.tabLabel}>마이페이지</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    height: 80,
    backgroundColor: '#fff',
    borderTopWidth: 2,           // 🚀 흰색 테두리 구분선
    borderTopColor: '#F0F0F0',   
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  tabItem: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: 5 },
  tabLabel: { fontSize: 11, marginTop: 4, fontWeight: '700' },
  fabContainer: { position: 'absolute', left: '50%', top: -25, marginLeft: -35, zIndex: 10 },
  fabBackground: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' },
  fabButton: { width: 55, height: 55, borderRadius: 27.5, backgroundColor: '#A8C3FF', justifyContent: 'center', alignItems: 'center' }
});
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function NoticeCenterScreen() {
  const router = useRouter();

  // 🚀 가짜 데이터 (실제로는 백엔드 GET 요청)
  const notifications = [
    { id: 1, title: '새로운 댓글이 달렸습니다.', date: '2026.02.20', isRead: false },
    { id: 2, title: '작성하신 글이 인기 게시글로 선정되었습니다!', date: '2026.02.20', isRead: false },
    { id: 3, title: '시스템 점검 안내 공지', date: '2026.02.19', isRead: true },
  ];

  return (
    <View style={styles.outerContainer}>
      <SafeAreaView style={styles.statusBarBg} edges={['top']} />
      <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
        <Stack.Screen options={{ headerShown: false }} />
        
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={20}>
            <Ionicons name="chevron-back" size={28} color="black" />
          </Pressable>
          <Text style={styles.headerTitle}>알림센터</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {notifications.map((item) => (
            <Pressable 
              key={item.id} 
              style={[styles.noticeCard, item.isRead ? styles.readCard : styles.unreadCard]}
              onPress={() => router.push(`/notice-center/${item.id}`)}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.noticeTitle}>{item.title}</Text>
                <Ionicons name="chevron-forward" size={18} color="#888" />
              </View>
              <Text style={styles.noticeDate}>{item.date}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: { flex: 1, backgroundColor: '#F2F6FF' },
  statusBarBg: { backgroundColor: '#fff' },
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, backgroundColor: '#fff' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', marginLeft: 15 },
  scrollContent: { padding: 20 },
  
  noticeCard: { 
    borderRadius: 15, 
    padding: 18, 
    marginBottom: 12, 
    borderWidth: 1, 
    borderColor: '#E0E0E0',
    // 그림자 효과
    elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 
  },
  unreadCard: { backgroundColor: '#E8EFFF' }, // 🚀 안 읽은 알림: 퍼런 카드
  readCard: { backgroundColor: '#FFFFFF' },   // 🚀 읽은 알림: 하얀 카드
  
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  noticeTitle: { fontSize: 15, fontWeight: '600', color: '#333', flex: 1 },
  noticeDate: { fontSize: 12, color: '#999' }
});
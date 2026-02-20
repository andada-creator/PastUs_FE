import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function MenuScreen() {
  const router = useRouter();

  // 메뉴 클릭 이벤트 핸들러
  const navigateTo = (path) => {
    if (path) router.push(path);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* --- [1. 뒤로가기 헤더] --- */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={20}>
          <Ionicons name="chevron-back" size={28} color="black" />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* --- [2. 알림 섹션] --- */}
        <Pressable style={styles.mainItem} onPress={() => navigateTo('/notifications')}>
          <Text style={styles.mainItemText}>알림</Text>
        </Pressable>

        {/* --- [3. 내 계정 섹션] --- */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>내 계정</Text>
            <View style={styles.divider} />
          </View>
          
          <MenuItem label="마이페이지" onPress={() => router.replace('/profile')} />
          <MenuItem label="아카이브" onPress={() => navigateTo('/archive')} />
          <MenuItem label="계정 설정" onPress={() => navigateTo('/profile/settings')} />
        </View>

        {/* --- [4. 고객센터 섹션] --- */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>고객센터</Text>
            <View style={styles.divider} />
          </View>
          
          <MenuItem label="알림센터" onPress={() => navigateTo('/notice-center')} />
          <MenuItem label="문의" onPress={() => navigateTo('/inquiry')} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// 🚀 재사용 가능한 메뉴 아이템 컴포넌트
const MenuItem = ({ label, onPress }) => (
  <Pressable style={styles.menuItem} onPress={onPress}>
    <Text style={styles.menuItemText}>{label}</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { paddingHorizontal: 20, paddingVertical: 15 },
  content: { paddingHorizontal: 25, paddingVertical: 10 },
  
  mainItem: { marginBottom: 40 },
  mainItemText: { fontSize: 20, fontWeight: '700', color: '#000' },

  section: { marginBottom: 35 },
  sectionHeader: { marginBottom: 15 },
  sectionTitle: { fontSize: 13, color: '#A0A0A0', fontWeight: '600', marginBottom: 8 },
  divider: { height: 1, backgroundColor: '#333', width: '100%' }, // 시안의 진한 구분선

  menuItem: { paddingVertical: 12 },
  menuItemText: { fontSize: 18, fontWeight: '700', color: '#000' }
});
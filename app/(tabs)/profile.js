import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { getMyProfile } from '../../src/api/userService'; 

export default function ProfileScreen() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // 🚀 명세서 주소: /users/me/dashboard 호출
        const res = await getMyProfile();
        if (res.status === 200) {
          setUser(res.data);
        }
      } catch (e) {
        console.error("마이페이지 로드 실패:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) return <ActivityIndicator size="large" color="#2B57D0" style={{ flex: 1 }} />;

  // 🚀 명세서의 중첩 구조 꺼내기
  const stats = user?.stats || {};

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={styles.header}>
        <Text style={styles.logo}>PastUs</Text>
        <View style={styles.headerIcons}>
          <Ionicons name="search-outline" size={26} color="black" />
          <Ionicons name="menu-outline" size={30} color="black" style={{ marginLeft: 15 }} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* 1. 프로필 정보: 명세서의 loginId, useName, profileImageUrl 반영 */}
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            {user?.profileImageUrl ? (
              <Image source={{ uri: user.profileImageUrl }} style={styles.avatarImage} />
            ) : (
              <Ionicons name="person" size={40} color="#888" />
            )}
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.userId}>{user?.loginId || '아이디'}</Text>
            {/* 🚀 명세서 필드명 'useName' 적용 */}
            <Text style={styles.userName}>{user?.useName || '이름'}</Text>
          </View>
        </View>

        {/* 2. 내가 쓴 글 개수: stats.postCount 반영 */}
        <Text style={styles.postCountText}>내가 쓴 글  <Text style={styles.bold}>{stats.postCount || 0}</Text></Text>

        <View style={styles.btnRow}>
            <Pressable style={styles.outlineBtn}>
                <Text style={styles.btnText}>아카이브</Text>
            </Pressable>
  
            {/* 🚀 계정 설정 페이지로 이동 연결 */}
            <Pressable 
                style={styles.outlineBtn} 
                onPress={() => router.push('/profile/settings')}
            >
                <Text style={styles.btnText}>계정 설정</Text>
            </Pressable>
        </View>

        {/* 3. 내 신뢰 PU: stats.trustScore 반영 */}
        <View style={styles.trustSection}>
          <Text style={styles.sectionTitle}>내 신뢰PU  {stats.trustScore || 0}점</Text>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${stats.trustScore || 0}%` }]} />
          </View>
        </View>

        {/* 4. 토큰 카드: stats.tokenBalance 반영 */}
        <View style={styles.tokenSection}>
          <Text style={styles.sectionTitle}>토큰</Text>
          <View style={styles.tokenCard}>
            <View style={styles.tokenCircle}><Text style={styles.tokenP}>P</Text></View>
            <Text style={styles.tokenCount}>{stats.tokenBalance || 0} 개</Text>
          </View>
        </View>

        {/* 5. 출석 체크 섹션 (기존 UI 유지) */}
        <View style={styles.attendanceSection}>
          <Text style={styles.sectionTitle}>출석</Text>
          <Text style={styles.attendanceSub}>게시물 1개 이상 조회 시 출석이 인정됩니다</Text>
          <View style={styles.attendanceRow}>
            {[1, 2, 3, 4, 5, 6].map((day) => (
              <View key={day} style={styles.dayCol}>
                <Text style={styles.dayText}>{day}일차</Text>
                <View style={[styles.checkCircle, day <= 3 && styles.checked]}>
                   {day <= 3 && <Text style={styles.checkText}>완료</Text>}
                </View>
              </View>
            ))}
            <View style={styles.dayCol}>
                <Text style={styles.dayText}>7일차</Text>
                <View style={styles.tokenCircleSmall}><Text style={styles.tokenPSmall}>P</Text></View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12 },
  logo: { fontSize: 28, fontWeight: 'bold', fontFamily: 'serif' },
  headerIcons: { flexDirection: 'row', alignItems: 'center' },
  scrollContent: { paddingHorizontal: 25, paddingBottom: 100 },
  
  profileSection: { flexDirection: 'row', alignItems: 'center', marginTop: 20, marginBottom: 15 },
  avatar: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#E0E0E0', justifyContent: 'center', alignItems: 'center' },
  avatarImage: { width: 70, height: 70, borderRadius: 35 },
  profileInfo: { marginLeft: 20 },
  userId: { fontSize: 18, fontWeight: '600' },
  userName: { fontSize: 14, color: '#666', marginTop: 4 },
  
  postCountText: { fontSize: 14, marginVertical: 10 },
  bold: { fontWeight: 'bold' },
  
  btnRow: { flexDirection: 'row', gap: 10, marginBottom: 30 },
  outlineBtn: { flex: 1, height: 40, borderWidth: 1, borderColor: '#2B57D0', borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  btnText: { color: '#2B57D0', fontWeight: '600' },

  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 12, fontFamily: 'Pretendard' },
  
  trustSection: { marginBottom: 35 },
  progressBarBg: { height: 12, backgroundColor: '#E0E0E0', borderRadius: 6, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: '#2B57D0' },

  tokenSection: { marginBottom: 35 },
  tokenCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#B5C7F7', padding: 20, borderRadius: 12 },
  tokenCircle: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#2B57D0', justifyContent: 'center', alignItems: 'center' },
  tokenP: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  tokenCount: { fontSize: 22, fontWeight: '700' },

  attendanceSection: { marginBottom: 20 },
  attendanceSub: { fontSize: 11, color: '#888', marginBottom: 15 },
  attendanceRow: { flexDirection: 'row', justifyContent: 'space-between' },
  dayCol: { alignItems: 'center' },
  dayText: { fontSize: 10, color: '#333', marginBottom: 5 },
  checkCircle: { width: 40, height: 45, backgroundColor: '#F0F0F0', borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  checked: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#2B57D0' },
  checkText: { fontSize: 10, color: '#2B57D0', fontWeight: 'bold' },
  tokenCircleSmall: { width: 40, height: 45, borderRadius: 8, backgroundColor: '#B5C7F7', justifyContent: 'center', alignItems: 'center' },
  tokenPSmall: { color: '#2B57D0', fontWeight: 'bold' },
  resetText: { fontSize: 9, color: '#2B57D0', marginTop: 15, textAlign: 'center' }
});
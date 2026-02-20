import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Stack } from 'expo-router';
import { getMyProfile } from '../../src/api/userService';  

export default function ProfileScreen() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const res = await getMyProfile(); // /users/me/dashboard
        if (res.status === 200) setUser(res.data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, []);

  if (loading) return <ActivityIndicator size="large" color="#2B57D0" style={{ flex: 1 }} />;

  const stats = user?.stats || { postCount: 0, trustScore: 0, tokenBalance: 0 };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* 🚀 1. 상단바: PastUs(Serif), 돋보기, 메뉴바 */}
      <View style={styles.header}>
        <Text style={styles.logo}>PastUs</Text>
        <View style={styles.headerIcons}>
            <Pressable 
            onPress={() => router.push('/search')}
            style={styles.searchBtn}
            >
                <Ionicons name="search-outline" size={24} color="black" />
            </Pressable>
          <Ionicons name="menu-outline" size={30} color="black" style={{ marginLeft: 15 }} />
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        {/* 2. 프로필: 아바타, 아이디, 이름 */}
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            {user?.profileImageUrl ? (
              <Image source={{ uri: user.profileImageUrl }} style={styles.avatarImage} />
            ) : (
              <Ionicons name="person" size={50} color="#D1D1D1" />
            )}
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.userId}>{user?.loginId || '아이디'}</Text>
            <Text style={styles.userName}>{user?.useName || '이름'}</Text>
          </View>
        </View>

        {/* 3. 내가 쓴 글 카운트 */}
        <Text style={styles.postCountText}>내가 쓴 글  <Text style={styles.bold}>{stats.postCount || 0}</Text></Text>

        {/* 4. 아카이브/계정설정 버튼 (파란색 테두리) */}
        <View style={styles.btnRow}>
          <Pressable style={styles.outlineBtn} onPress={() => router.push('/archive')}>
            <Text style={styles.btnText}>아카이브</Text>
          </Pressable>
          <Pressable style={styles.outlineBtn} onPress={() => router.push('/profile/settings')}>
            <Text style={styles.btnText}>계정 설정</Text>
          </Pressable>
        </View>

        {/* 5. 내 신뢰PU (프로그레스 바) */}
        <View style={styles.cardSection}>
          <Text style={styles.sectionTitle}>내 신뢰PU  <Text style={{color:'#000'}}>{stats.trustScore}점</Text></Text>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${stats.trustScore}%` }]} />
          </View>
        </View>

        {/* 6. 토큰 (연한 파란색 카드) */}
        <View style={styles.cardSection}>
          <Text style={styles.sectionTitle}>토큰</Text>
          <View style={styles.tokenCard}>
            <View style={styles.tokenCircle}><Text style={styles.tokenP}>P</Text></View>
            <Text style={styles.tokenCount}>{stats.tokenBalance } 개</Text>
          </View>
        </View>

        {/* 7. 출석 (그리드 레이아웃) */}
        <View style={styles.cardSection}>
          <Text style={styles.sectionTitle}>출석</Text>
          <Text style={styles.attendanceSub}>게시물 1개 이상 조회시 출석이 인정됩니다</Text>
          <View style={styles.attendanceGrid}>
            {[1, 2, 3, 4, 5, 6, 7].map((day) => (
              <View key={day} style={styles.dayCol}>
                <Text style={styles.dayText}>{day}일차</Text>
                <View style={[styles.dayBox, day <= 3 && styles.dayBoxActive]}>
                  {day <= 3 ? (
                    <Text style={styles.activeText}>완료</Text>
                  ) : day === 7 ? (
                    <View style={styles.miniToken}><Text style={styles.miniTokenText}>P</Text></View>
                  ) : null}
                </View>
              </View>
            ))}
          </View>
          <Text style={styles.resetNotice}>연속 출석에 실패하면 기록이 초기화됩니다</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  // 상단바: 시안처럼 하얀 배경에 고정
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingVertical: 12,
    backgroundColor: '#fff'
  },
  logo: { fontSize: 26, fontWeight: 'bold', fontFamily: 'serif' }, // Serif 계열 폰트 적용
  headerIcons: { flexDirection: 'row', alignItems: 'center' },
  
  // 🚀 전체 배경색 적용
  scrollContent: { 
    backgroundColor: '#F6F8FD', 
    paddingHorizontal: 25, 
    paddingBottom: 100 
  },
  
  profileSection: { flexDirection: 'row', alignItems: 'center', marginTop: 30 },
  avatar: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#F0F0F0', justifyContent: 'center', alignItems: 'center' },
  avatarImage: { width: 70, height: 70, borderRadius: 35 },
  profileInfo: { marginLeft: 15 },
  userId: { fontSize: 18, fontWeight: '700', color: '#000' },
  userName: { fontSize: 14, color: '#888', marginTop: 2 },
  
  postCountText: { fontSize: 14, marginTop: 25, marginBottom: 15 },
  bold: { fontWeight: '700' },
  
  btnRow: { flexDirection: 'row', gap: 12 },
  outlineBtn: { 
    flex: 1, 
    height: 45, 
    borderWidth: 1.5, 
    borderColor: '#4A7DFF', 
    borderRadius: 12, 
    backgroundColor: '#fff',
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  btnText: { color: '#2B57D0', fontWeight: '700', fontSize: 14 },

  cardSection: { marginTop: 35 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#666', marginBottom: 15 },
  
  progressBarBg: { height: 10, backgroundColor: '#E0E0E0', borderRadius: 5 },
  progressBarFill: { height: '100%', backgroundColor: '#2B57D0', borderRadius: 5 },

  tokenCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#C1D1FF', 
    padding: 20, 
    borderRadius: 15,
    // 🚀 시안의 그림자 느낌 추가
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2
  },
  tokenCircle: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#2B57D0', justifyContent: 'center', alignItems: 'center' },
  tokenP: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  tokenCount: { flex: 1, textAlign: 'right', fontSize: 22, fontWeight: '700' },

  attendanceSub: { fontSize: 10, color: '#888', marginBottom: 15 },
  attendanceGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  dayCol: { alignItems: 'center' },
  dayText: { fontSize: 9, color: '#2B57D0', marginBottom: 8, fontWeight: '600' },
  dayBox: { 
    width: 42, 
    height: 60, 
    backgroundColor: '#fff', 
    borderWidth: 1, 
    borderColor: '#F0F0F0', 
    borderRadius: 8, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  dayBoxActive: { borderColor: '#2B57D0' },
  activeText: { fontSize: 10, color: '#2B57D0', fontWeight: '700' },
  miniToken: { width: 22, height: 22, borderRadius: 11, backgroundColor: '#2B57D0', justifyContent: 'center', alignItems: 'center' },
  miniTokenText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  resetNotice: { fontSize: 9, color: '#2B57D0', marginTop: 12 }
});
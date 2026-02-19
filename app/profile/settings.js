import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { getAccountDetail, updateAccountInfo } from '../../src/api/userService'; // 🚀 서비스 함수 필요

export default function AccountSettingsScreen() {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [idModalVisible, setIdModalVisible] = useState(false);
  const [pwModalVisible, setPwModalVisible] = useState(false);

  useEffect(() => {
    fetchDetail();
  }, []);

  const fetchDetail = async () => {
    try {
      // 🚀 GET /users/me/detail 호출
      const res = await getAccountDetail();
      if (res.status === 200) setUserInfo(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateId = () => {
    // 🚀 PATCH /users/me/detail 로직 연결부
    Alert.alert("아이디 변경", "한 달에 한 번만 수정 가능합니다. 변경하시겠습니까?", [
      { text: "취소", style: "cancel" },
      { text: "변경", onPress: () => console.log("아이디 변경 로직 실행") }
    ]);
  };

  if (loading) return <ActivityIndicator size="large" color="#2B57D0" style={{ flex: 1 }} />;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.logo}>PastUs</Text>
        <View style={styles.headerIcons}>
          <Ionicons name="search-outline" size={26} color="black" />
          <Ionicons name="menu-outline" size={30} color="black" style={{ marginLeft: 15 }} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>내 정보</Text>

        {/* 1. 프로필 사진 섹션 */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarWrapper}>
            {userInfo?.profileImageUrl ? (
              <Image source={{ uri: userInfo.profileImageUrl }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <Ionicons name="person" size={60} color="#888" />
              </View>
            )}
            <Pressable style={styles.editIconBtn}>
              <Text style={styles.editPhotoText}>프로필사진 변경 <Ionicons name="pencil" size={14} /></Text>
            </Pressable>
          </View>
        </View>

        {/* 2. 상세 정보 리스트 */}
        <View style={styles.infoBox}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>이름</Text>
            <Text style={styles.infoValue}>{userInfo?.userName}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>성별/생년월일</Text>
            <Text style={styles.infoValue}>
              {userInfo?.gender === 'M' ? '남성' : '여성'}/{userInfo?.birthDate?.replace(/-/g, '')}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>전화번호</Text>
            <Text style={styles.infoValue}>{userInfo?.phoneNumber}</Text>
          </View>
          <View style={styles.divider} />
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>아이디</Text>
            <View style={styles.valueWithBtn}>
              <Text style={styles.infoValue}>{userInfo?.loginId}</Text>
              <Pressable onPress={handleUpdateId}><Text style={styles.changeLink}>변경</Text></Pressable>
            </View>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>비밀번호</Text>
            <View style={styles.valueWithBtn}>
              <Text style={styles.infoValue}>************</Text>
              <Pressable><Text style={styles.changeLink}>변경</Text></Pressable>
            </View>
          </View>
          <Text style={styles.noticeText}>
            정보 변경은 아이디, 비밀번호만 가능합니다.{"\n"}
            이름, 성별, 전화번호가 변경된 경우, 고객센터로 문의해주세요.
          </Text>
        </View>

        {/* 3. 사용 버전 섹션 */}
        <Text style={styles.sectionTitle}>사용 버전</Text>
        <View style={styles.versionRow}>
          <View style={[styles.versionCard, userInfo?.subscriptionType === 'FREE' && styles.activeVersion]}>
            <Text style={[styles.vTitle, userInfo?.subscriptionType === 'FREE' && styles.activeText]}>무료 버전</Text>
            <Text style={[styles.vSub, userInfo?.subscriptionType === 'FREE' && styles.activeSubText]}>기본 태그 검색 가능{"\n"}한정된 토큰 사용</Text>
          </View>
          <View style={[styles.versionCard, userInfo?.subscriptionType === 'PRO' && styles.activeVersion]}>
            <Text style={[styles.vTitle, userInfo?.subscriptionType === 'PRO' && styles.activeText]}>PRO 버전</Text>
            <Text style={[styles.vSub, userInfo?.subscriptionType === 'PRO' && styles.activeSubText]}>모든 검색 기능 활용 가능!{"\n"}제한 없는 글쓰기</Text>
          </View>
        </View>

        {/* 4. 로그인 정보 */}
        <Text style={styles.sectionTitle}>로그인 정보</Text>
        <View style={styles.loginInfoCard}>
          <Image source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg' }} style={styles.googleIcon} />
          <Text style={styles.emailText}>skhu12345@gmail.com</Text>
        </View>
      </ScrollView>

      {/* 하단 탭 바 생략 (Main과 동일하게 추가 가능) */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FD' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12, backgroundColor: '#fff' },
  logo: { fontSize: 26, fontWeight: 'bold', fontFamily: 'serif' },
  headerIcons: { flexDirection: 'row', alignItems: 'center' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 50 },
  pageTitle: { fontSize: 22, fontWeight: '700', marginTop: 20, marginBottom: 10 },
  
  avatarSection: { alignItems: 'center', marginVertical: 20 },
  avatarWrapper: { alignItems: 'center' },
  avatar: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#fff' },
  avatarPlaceholder: { justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#eee' },
  editIconBtn: { marginTop: -15, alignSelf: 'flex-end' },
  editPhotoText: { fontSize: 11, color: '#888' },

  infoBox: { backgroundColor: '#fff', borderRadius: 15, padding: 20, elevation: 2 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12 },
  infoLabel: { fontSize: 14, color: '#333', width: 100 },
  infoValue: { fontSize: 14, fontWeight: '600', color: '#000', flex: 1 },
  valueWithBtn: { flexDirection: 'row', flex: 1, justifyContent: 'space-between' },
  changeLink: { fontSize: 12, color: '#2B57D0', textDecorationLine: 'underline' },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 5 },
  noticeText: { fontSize: 10, color: '#888', textAlign: 'center', marginTop: 15, lineHeight: 16 },

  sectionTitle: { fontSize: 16, fontWeight: '700', marginTop: 30, marginBottom: 15 },
  versionRow: { flexDirection: 'row', gap: 10 },
  versionCard: { flex: 1, padding: 15, borderRadius: 12, backgroundColor: '#fff', borderWidth: 1, borderColor: '#eee' },
  activeVersion: { backgroundColor: '#2B57D0', borderColor: '#2B57D0' },
  vTitle: { fontSize: 14, fontWeight: '700', marginBottom: 8 },
  vSub: { fontSize: 10, color: '#666', lineHeight: 14 },
  activeText: { color: '#fff' },
  activeSubText: { color: 'rgba(255,255,255,0.8)' },

  loginInfoCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 30 },
  googleIcon: { width: 20, height: 20, marginRight: 15 },
  emailText: { fontSize: 14, fontWeight: '500' }
});
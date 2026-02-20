import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image, ActivityIndicator, Modal, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker'; 
import { getAccountDetail, updateAccountInfo } from '../../src/api/userService';

export default function AccountSettingsScreen() {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState(null); // 사용자 정보 저장
  const [loading, setLoading] = useState(true);   // 로딩 상태 관리

  // --- [상태 관리: 모달 제어 및 입력값] ---
  const [idModalVisible, setIdModalVisible] = useState(false); // 아이디 모달 열림/닫힘
  const [pwModalVisible, setPwModalVisible] = useState(false); // 비번 모달 열림/닫힘
  const [newId, setNewId] = useState('');           // 새 아이디 입력값
  const [newPw, setNewPw] = useState('');           // 새 비밀번호 입력값
  const [confirmPw, setConfirmPw] = useState('');   // 비밀번호 확인 입력값

  // 페이지 진입 시 데이터 불러오기
  useEffect(() => { fetchDetail(); }, []);

  const fetchDetail = async () => {
    try {
      const res = await getAccountDetail(); // 서버에서 내 정보 가져오기
      if (res.status === 200) setUserInfo(res.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  // 🚀 1. 아이디 변경 실행 (PATCH 요청)
  const handleIdUpdate = async () => {
    if (!newId.trim()) return Alert.alert("알림", "새 아이디를 입력해주세요.");
    const res = await updateAccountInfo({ loginId: newId }); // 백엔드 전송
    if (res.status === 200) {
      setUserInfo({ ...userInfo, loginId: res.data.loginId }); // 화면 업데이트
      setIdModalVisible(false); // 모달 닫기
      setNewId(''); // 입력창 초기화
      Alert.alert("성공", "아이디가 변경되었습니다.");
    }
  };

  // 🚀 2. 비밀번호 변경 실행
  const handlePwUpdate = () => {
    if (newPw === confirmPw && newPw !== '') {
      Alert.alert("성공", "비밀번호가 변경되었습니다.");
      setPwModalVisible(false); // 성공 시 닫기
      setNewPw(''); setConfirmPw('');
    } else {
      Alert.alert("오류", "비밀번호가 일치하지 않습니다.");
    }
  };

  // 🚀 3. 프로필 사진 변경 (갤러리 연결)
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const localUri = result.assets[0].uri;
      setUserInfo(prev => ({ ...prev, profileImageUrl: localUri })); // 선 업데이트 (UX 향상)
      try { await updateAccountInfo({ profileImageUrl: localUri }); } catch (e) { console.warn("서버 미연결"); }
    }
  };

  // 🚀 4. 소셜 연동 토글 (별도 모달 없이 바로 변경)
  const handleSocialLink = (provider) => {
    if (userInfo) {
      const updated = (userInfo.socialProviders || []).map(p => 
        p.type === provider ? { ...p, linked: !p.linked, email: !p.linked ? 'skhu12345@gmail.com' : null } : p
      );
      setUserInfo({ ...userInfo, socialProviders: updated });
    }
  };

  if (loading) return <ActivityIndicator size="large" color="#2B57D0" style={{ flex: 1 }} />;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* --- [1. 헤더 영역] --- */}
      <View style={styles.header}>
        <Text style={styles.logo}>PastUs</Text>
        <View style={styles.headerIcons}>
            <Pressable 
                onPress={() => router.push('/search')}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10}}
            >
                <Ionicons name="search-outline" size={24} color="black" />
            </Pressable>

            <Pressable onPress={() => router.push('/menu')} hitSlop={15}>
                <Ionicons name="menu-outline" size={28} color="black" style={{ marginLeft: 15 }} />
            </Pressable>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* --- [2. 페이지 타이틀: Pretendard 400, 20px] --- */}
        <Text style={styles.pageTitle}>내 정보</Text>

        {/* --- [3. 프로필 카드] --- */}
        <View style={styles.avatarCard}>
          <Pressable style={styles.editPhotoLabel} onPress={pickImage}>
            <Text style={styles.editPhotoText}>프로필사진 변경 </Text>
            <Ionicons name="pencil" size={12} color="#61636B" />
          </Pressable>

          <Pressable style={styles.avatarCircle} onPress={pickImage}>
            {userInfo?.profileImageUrl ? (
              <Image source={{ uri: userInfo.profileImageUrl }} style={styles.fullImg} />
            ) : (
              <Ionicons name="person" size={80} color="#D1D1D1" />
            )}
          </Pressable>
        </View>

        {/* --- [4. 정보 리스트: 수직 정렬 130px] --- */}
        <View style={styles.infoCard}>
          <DataRow label="이름" value={userInfo?.userName} />
          <DataRow label="성별/생년월일" value={`${userInfo?.gender === 'M' ? '남성' : '여성'}/${userInfo?.birthDate?.replace(/-/g, '')}`} />
          <DataRow label="전화번호" value={userInfo?.phoneNumber} />
          <View style={styles.divider} />
          <DataRow label="아이디" value={userInfo?.loginId} canChange onPress={() => setIdModalVisible(true)} />
          <DataRow label="비밀번호" value="************" canChange onPress={() => setPwModalVisible(true)} />
          <Text style={styles.noticeText}>정보 변경은 아이디, 비밀번호만 가능합니다.</Text>
        </View>

        {/* --- [5. 사용 버전 섹션] --- */}
        <Text style={styles.sectionTitle}>사용 버전</Text>
        <View style={styles.versionContainer}>
          <View style={[styles.vBox, userInfo?.subscriptionType === 'FREE' && styles.vBoxActive]}>
            <Text style={[styles.vTitle, userInfo?.subscriptionType === 'FREE' && styles.whiteText]}>무료 버전</Text>
            <Text style={[styles.vSub, userInfo?.subscriptionType === 'FREE' && styles.vSubActive]}>기본 태그 검색 가능{"\n"}한정된 토큰 사용</Text>
          </View>
          <View style={[styles.vBox, userInfo?.subscriptionType === 'PRO' && styles.vBoxActive]}>
            <Text style={[styles.vTitle, userInfo?.subscriptionType === 'PRO' && styles.whiteText]}>PRO 버전</Text>
            <Text style={[styles.vSub, userInfo?.subscriptionType === 'PRO' && styles.vSubActive]}>모든 검색 기능 활용 가능!{"\n"}제한 없는 글쓰기</Text>
          </View>
        </View>

        {/* --- [6. 로그인 정보: 연동 상태 동적 표시] --- */}
        <Text style={styles.sectionTitle}>로그인 정보</Text>
        <View style={styles.socialContainer}>
          {(userInfo?.socialProviders || []).map((item) => (
            <SocialBar key={item.type} type={item.type} linked={item.linked} email={item.email} onLinkPress={handleSocialLink} />
          ))}
        </View>
      </ScrollView>

      {/* --- [7. 모달창들 (취소 버튼 없음)] --- */}
      <IdUpdateModal visible={idModalVisible} onUpdate={handleIdUpdate} value={newId} onChange={setNewId} />
      <PwUpdateModal visible={pwModalVisible} newPw={newPw} setNewPw={setNewPw} confirmPw={confirmPw} setConfirmPw={setConfirmPw} onUpdate={handlePwUpdate} />
    </SafeAreaView>
  );
}

// 🚀 보조 컴포넌트: 데이터 행 (라벨 400, 데이터 600 정교한 배치)
const DataRow = ({ label, value, canChange, onPress }) => (
  <View style={styles.infoRow}>
    <View style={styles.labelContainer}>
      <Text style={styles.labelText}>{label}</Text>
      {/* "변경" 클릭 범위 확장 */}
      {canChange && (
        <Pressable onPress={onPress} hitSlop={{top: 20, bottom: 20, left: 10, right: 30}}>
          <Text style={styles.changeText}>변경</Text>
        </Pressable>
      )}
    </View>
    <Text style={styles.valueText}>{value || "-"}</Text>
  </View>
);

// 🚀 보조 컴포넌트: 아이디 변경 모달
const IdUpdateModal = ({ visible, onUpdate, value, onChange }) => (
  <Modal visible={visible} transparent animationType="fade">
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <TextInput 
          style={styles.modalInput} 
          placeholder="변경할 아이디를 입력해주세요" // placeholder 적용
          placeholderTextColor="#C4C4C4"
          value={value} 
          onChangeText={onChange} 
        />
        <Pressable style={styles.modalBtn} onPress={onUpdate}>
          <Text style={styles.modalBtnText}>변경하기</Text>
        </Pressable>
      </View>
    </View>
  </Modal>
);

// 🚀 보조 컴포넌트: 비밀번호 변경 모달
const PwUpdateModal = ({ visible, newPw, setNewPw, confirmPw, setConfirmPw, onUpdate }) => (
  <Modal visible={visible} transparent animationType="fade">
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <TextInput 
          style={styles.modalInput} 
          placeholder="변경할 비밀번호를 입력해주세요" // placeholder 1
          secureTextEntry 
          placeholderTextColor="#C4C4C4"
          value={newPw} 
          onChangeText={setNewPw} 
        />
        <TextInput 
          style={[styles.modalInput, {marginTop: 10}]} 
          placeholder="변경할 비밀번호를 다시 입력해주세요" // placeholder 2
          secureTextEntry 
          placeholderTextColor="#C4C4C4"
          value={confirmPw} 
          onChangeText={setConfirmPw} 
        />
        <Pressable style={styles.modalBtn} onPress={onUpdate}>
          <Text style={styles.modalBtnText}>변경하기</Text>
        </Pressable>
      </View>
    </View>
  </Modal>
);

// 🚀 보조 컴포넌트: 소셜 로그인 바
const SocialBar = ({ type, linked, email, onLinkPress }) => {
  const configs = {
    GOOGLE: { name: '구글', color: '#fff', logo: 'https://cdn-icons-png.flaticon.com/512/2991/2991148.png', textColor: '#000', border: 1 },
    NAVER: { name: '네이버', color: '#03C75A', logo: 'https://static.nid.naver.com/oauth/button_g.PNG', textColor: '#fff' },
    KAKAO: { name: '카카오', color: '#FEE500', logo: 'https://cdn.icon-icons.com/icons2/2429/PNG/512/kakaotalk_logo_icon_147272.png', textColor: '#000' }
  };
  const config = configs[type] || configs.GOOGLE;
  return (
    <Pressable style={[styles.socialBar, { backgroundColor: config.color, borderWidth: config.border || 0, borderColor: '#eee' }]} onPress={() => onLinkPress(type)}>
      <Image source={{ uri: config.logo }} style={styles.socialLogo} />
      <Text style={[styles.socialText, { color: config.textColor }]}>
        {linked ? email : `${config.name} 계정 연동하기`}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  /* [1. 전체 레이아웃 및 배경] */
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12, backgroundColor: '#fff' },
  logo: { fontSize: 26, fontWeight: 'bold', fontFamily: 'NoticiaText-Bold', },
  scrollContent: { 
    backgroundColor: '#F6F8FD', // 🚀 배경색 #F6F8FD 고정
    paddingHorizontal: 20, 
    paddingBottom: 60 
  },
  headerIcons: { 
    flexDirection: 'row', // 가로로 나열
    alignItems: 'center'   // 아이콘 높이 중앙 정렬
  },

  /* [2. 타이포그래피 정밀 매칭] */
  pageTitle: { 
    fontFamily: 'Pretendard', 
    fontSize: 20, 
    fontWeight: '400', // Pretendard 400
    lineHeight: 26, 
    color: '#000', 
    marginTop: 25, 
    marginBottom: 15 
  },
  labelText: { 
    fontFamily: 'Pretendard', 
    fontSize: 12, 
    fontWeight: '400', // 라벨: Pretendard 400
    lineHeight: 16, 
    color: '#000' 
  },
  valueText: { 
    fontFamily: 'Pretendard', 
    fontSize: 12, 
    fontWeight: '600', // 데이터값: Pretendard 600
    lineHeight: 16, 
    color: '#000', 
    flex: 1 
  },

  /* [3. 카드 및 리스트 스타일] */
  avatarCard: { backgroundColor: '#fff', borderRadius: 20, paddingVertical: 35, alignItems: 'center', marginBottom: 20, position: 'relative' },
  editPhotoLabel: { position: 'absolute', top: 15, right: 15, flexDirection: 'row', alignItems: 'center' },
  editPhotoText: { fontSize: 11, color: '#61636B', fontWeight: '400' }, // GrayScale700
  
  avatarCircle: { width: 140, height: 140, borderRadius: 70, backgroundColor: '#F0F0F0', justifyContent: 'center', alignItems: 'center' },
  fullImg: { width: '100%', height: '100%', borderRadius: 70, resizeMode: 'cover' },
  
  infoCard: { backgroundColor: '#fff', borderRadius: 20, paddingHorizontal: 20, paddingVertical: 10, marginBottom: 30 },
  infoRow: { flexDirection: 'row', paddingVertical: 12, alignItems: 'center' },
  labelContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    width: 130 // 🚀 수직 정렬을 위한 라벨 고정 너비
  },
  changeText: { fontSize: 10, color: '#2B57D0', marginLeft: 8 }, // 밑줄 없음
  divider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 5 },
  noticeText: { fontSize: 10, color: '#888', textAlign: 'center', marginTop: 15, lineHeight: 16 },

  /* [4. 섹션 스타일 (버전/소셜)] */
  sectionTitle: { fontSize: 17, fontWeight: '700', marginTop: 10, marginBottom: 15 },
  versionContainer: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  vBox: { flex: 1, backgroundColor: '#fff', borderRadius: 15, padding: 18, borderWidth: 1, borderColor: '#eee' },
  vBoxActive: { backgroundColor: '#2B57D0', borderColor: '#2B57D0' },
  vTitle: { fontSize: 15, fontWeight: '700', marginBottom: 8 },
  vSub: { fontSize: 10, color: '#666', lineHeight: 14 },
  vSubActive: { color: 'rgba(255,255,255,0.8)' },
  whiteText: { color: '#fff' },
  socialContainer: { gap: 10, marginBottom: 40 },
  socialBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 50, borderRadius: 12, paddingHorizontal: 20 },
  socialLogo: { width: 22, height: 22, marginRight: 15, resizeMode: 'contain' },
  socialText: { fontSize: 14, fontWeight: '700' },

  /* [5. 모달 디자인 스타일] */
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '85%', backgroundColor: '#fff', borderRadius: 20, padding: 25, alignItems: 'center' },
  modalInput: { 
    width: '100%', 
    height: 48, 
    borderWidth: 1.5, 
    borderColor: '#4A7DFF', // 시안 블루 테두리
    borderRadius: 12, 
    paddingHorizontal: 15, 
    fontSize: 13 
  },
  modalBtn: { 
    marginTop: 20, 
    width: '50%', 
    height: 42, 
    borderWidth: 1.5, 
    borderColor: '#4A7DFF', 
    borderRadius: 25, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  modalBtnText: { color: '#2B57D0', fontWeight: 'bold' }
});
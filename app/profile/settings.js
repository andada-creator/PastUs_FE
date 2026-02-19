import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image, ActivityIndicator, Modal, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker'; // 🚀 사진첩 접근용
import { getAccountDetail, updateAccountInfo } from '../../src/api/userService';

export default function AccountSettingsScreen() {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- [상태 관리: 모달 및 입력값] ---
  const [idModalVisible, setIdModalVisible] = useState(false);
  const [pwModalVisible, setPwModalVisible] = useState(false);
  const [newId, setNewId] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');

  useEffect(() => { fetchDetail(); }, []);

  const fetchDetail = async () => {
    try {
      const res = await getAccountDetail(); // /users/me/detail 조회
      if (res.status === 200) setUserInfo(res.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  // 🚀 1. 아이디 변경 실행 (백엔드 전송)
  const handleIdUpdate = async () => {
    if (!newId.trim()) return Alert.alert("알림", "새 아이디를 입력해주세요.");
    const res = await updateAccountInfo({ loginId: newId });
    if (res.status === 200) {
      setUserInfo({ ...userInfo, loginId: res.data.loginId });
      setIdModalVisible(false);
      setNewId('');
      Alert.alert("성공", "아이디가 변경되었습니다.");
    }
  };

  // 🚀 2. 비밀번호 변경 실행
  const handlePwUpdate = () => {
    if (newPw === confirmPw && newPw !== '') {
      Alert.alert("성공", "비밀번호가 변경되었습니다.");
      setPwModalVisible(false);
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

    // 1️⃣ 우선 화면(UI)부터 즉시 업데이트! (서버 기다리지 않음)
    setUserInfo(prev => ({ ...prev, profileImageUrl: localUri }));

    // 2️⃣ 그다음 백엔드 전송 시도 (실패해도 앱은 안 멈춤)
    try {
      // IS_TEST_MODE가 true면 가짜 응답을 보낼 거예요.
      const res = await updateAccountInfo({ profileImageUrl: localUri });
      if (res.status === 200) {
        console.log("서버 저장 성공!");
      }
    } catch (e) {
      // 서버가 없으면 여기가 실행되지만, 이미 위에서 사진을 바꿨으니 화면은 멀쩡함!
      console.warn("현재 서버 미연결 상태: 로컬에서만 사진을 표시합니다.");
    }
  }
  };

  // 🚀 소셜 연동 실행 함수: 실제로는 여기서 외부 브라우저를 엽니다.
  const handleSocialLink = (provider) => {
    // 💡 나중에는 여기에 WebBrowser.openBrowserAsync(authUrl) 등이 들어갑니다.
    console.log(`${provider} 연동 페이지로 이동 시도...`);
    
    if (userInfo) {
      // 테스트용: 클릭 시 연동 상태가 토글되도록 설정
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
      
      {/* --- 1. 헤더 영역 --- */}
      <View style={styles.header}>
        <Text style={styles.logo}>PastUs</Text>
        <View style={styles.headerIcons}>
          <Ionicons name="search-outline" size={24} color="black" />
          <Ionicons name="menu-outline" size={28} color="black" style={{ marginLeft: 15 }} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* --- 2. 페이지 타이틀 (Pretendard 400, 20px) --- */}
        <Text style={styles.pageTitle}>내 정보</Text>

        {/* --- 3. 프로필 이미지 섹션 --- */}
        <View style={styles.avatarCard}>
          <Pressable style={styles.editPhotoLabel} onPress={pickImage}>
            <Text style={styles.editPhotoText}>프로필사진 변경 </Text>
            <Ionicons name="pencil" size={12} color="#61636B" />
          </Pressable>
          <View style={styles.avatarCircle}>
            {userInfo?.profileImageUrl ? (
              <Image source={{ uri: userInfo.profileImageUrl }} style={styles.fullImg} />
            ) : (
              <Ionicons name="person" size={80} color="#D1D1D1" />
            )}
          </View>
        </View>

        {/* --- 4. 정보 상세 리스트 (수직 정렬 최적화) --- */}
        <View style={styles.infoCard}>
          <DataRow label="이름" value={userInfo?.userName} />
          <DataRow label="성별/생년월일" value={`${userInfo?.gender === 'M' ? '남성' : '여성'}/${userInfo?.birthDate?.replace(/-/g, '')}`} />
          <DataRow label="전화번호" value={userInfo?.phoneNumber} />
          <View style={styles.divider} />
          <DataRow label="아이디" value={userInfo?.loginId} canChange onPress={() => setIdModalVisible(true)} />
          <DataRow label="비밀번호" value="************" canChange onPress={() => setPwModalVisible(true)} />
          
          <Text style={styles.noticeText}>
            정보 변경은 아이디, 비밀번호만 가능합니다.{"\n"}
            이름, 성별, 전화번호가 변경된 경우, 고객센터로 문의해주세요.
          </Text>
        </View>

        {/* --- 5. 사용 버전 섹션 --- */}
        <Text style={styles.sectionTitle}>사용 버전</Text>
        <View style={styles.versionContainer}>
          <View style={[styles.vBox, userInfo?.subscriptionType === 'FREE' && styles.vBoxActive]}>
            <Text style={[styles.vTitle, userInfo?.subscriptionType === 'FREE' && styles.whiteText]}>무료 버전</Text>
            <Text style={[styles.vSub, userInfo?.subscriptionType === 'FREE' && styles.vSubActive]}>
              기본 태그 검색 가능{"\n"}한정된 토큰 사용
            </Text>
          </View>
          <View style={[styles.vBox, userInfo?.subscriptionType === 'PRO' && styles.vBoxActive]}>
            <Text style={[styles.vTitle, userInfo?.subscriptionType === 'PRO' && styles.whiteText]}>PRO 버전</Text>
            <Text style={[styles.vSub, userInfo?.subscriptionType === 'PRO' && styles.vSubActive]}>
              모든 검색 기능 활용 가능!{"\n"}제한 없는 글쓰기
            </Text>
          </View>
        </View>

        {/* --- 6. 로그인 정보 (조건부 소셜 바) --- */}
        <Text style={styles.sectionTitle}>로그인 정보</Text>
        <View style={styles.socialContainer}>
          {/* 유저 데이터의 socialType(예: GOOGLE, NAVER, KAKAO)에 따라 렌더링 */}
          {(userInfo?.socialProviders).map((item) => (
            <SocialBar 
                key={item.type} 
                type={item.type}
                linked={item.linked}
                email={item.email} 
                onLinkPress={handleSocialLink} //함수전달!
            />
          ))}
        </View>
      </ScrollView>

      {/* --- 7. 변경 모달 (아이디/비밀번호) --- */}
      <IdUpdateModal visible={idModalVisible} onClose={() => setIdModalVisible(false)} onUpdate={handleIdUpdate} value={newId} onChange={setNewId} />
      <PwUpdateModal visible={pwModalVisible} onClose={() => setPwModalVisible(false)} newPw={newPw} setNewPw={setNewPw} confirmPw={confirmPw} setConfirmPw={setConfirmPw} onUpdate={handlePwUpdate} />
    </SafeAreaView>
  );
}

// 🚀 보조 컴포넌트: 데이터 행 (라벨 400, 데이터 600 정밀 분리)
const DataRow = ({ label, value, canChange, onPress }) => (
  <View style={styles.infoRow}>
    <View style={styles.labelContainer}>
      <Text style={styles.labelText}>{label}</Text>
      {canChange && <Pressable onPress={onPress} hitSlop={15}><Text style={styles.changeText}>변경</Text></Pressable>}
    </View>
    <Text style={styles.valueText}>{value || "-"}</Text>
  </View>
);
// 🚀 아이디 변경 모달
const IdUpdateModal = ({ visible, onClose, onUpdate, value, onChange }) => (
  <Modal visible={visible} transparent animationType="fade">
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <TextInput 
          style={styles.modalInput} 
          placeholder="변경할 아이디를 입력해주세요" 
          value={value} 
          onChangeText={onChange} 
        />
        <Pressable style={styles.modalBtn} onPress={onUpdate}>
          <Text style={styles.modalBtnText}>변경하기</Text>
        </Pressable>
        <Pressable style={{marginTop: 15}} onPress={onClose}>
          <Text style={{color: '#999', fontSize: 12}}>취소</Text>
        </Pressable>
      </View>
    </View>
  </Modal>
);

// 🚀 비밀번호 변경 모달
const PwUpdateModal = ({ visible, onClose, newPw, setNewPw, confirmPw, setConfirmPw, onUpdate }) => (
  <Modal visible={visible} transparent animationType="fade">
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <TextInput style={styles.modalInput} placeholder="변경할 비밀번호" secureTextEntry value={newPw} onChangeText={setNewPw} />
        <TextInput style={[styles.modalInput, {marginTop: 10}]} placeholder="비밀번호 확인" secureTextEntry value={confirmPw} onChangeText={setConfirmPw} />
        <Pressable style={styles.modalBtn} onPress={onUpdate}>
          <Text style={styles.modalBtnText}>변경하기</Text>
        </Pressable>
        <Pressable style={{marginTop: 15}} onPress={onClose}>
          <Text style={{color: '#999', fontSize: 12}}>취소</Text>
        </Pressable>
      </View>
    </View>
  </Modal>
);

// 🚀 보조 컴포넌트: 소셜 로그인 바
const SocialBar = ({ type, linked, email, onLinkPress }) => {
  const configs = {
    GOOGLE: {
      name: '구글', 
      color: '#fff', 
      logo: 'https://cdn-icons-png.flaticon.com/512/2991/2991148.png',
      textColor: '#000', 
      border: 1
    },
    NAVER: { 
      name: '네이버', 
      color: '#03C75A', 
      logo: 'https://static.nid.naver.com/oauth/button_g.PNG',
      textColor: '#fff'
    },
    KAKAO: { 
      name: '카카오', 
      color: '#FEE500', 
      logo: 'https://cdn.icon-icons.com/icons2/2429/PNG/512/kakaotalk_logo_icon_147272.png',
      textColor: '#000'
    }
  };
  const config = configs[type];

  return (
    <Pressable 
      style={[styles.socialBar, { backgroundColor: config.color, borderWidth: config.border || 0, borderColor: '#eee' }]}
      onPress={!linked ? () => onLinkPress(type) : null} //미연동 시에만 클릭 작동
    >
      <Image source={{ uri: config.logo }} style={styles.socialLogo} />
      <Text style={[styles.socialText, { color: config.textColor }]}>
        {linked ? email : `${config.name} 계정 연동하기`}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  /* [1. 기본 레이아웃] */
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12, backgroundColor: '#fff' },
  logo: { fontSize: 26, fontWeight: 'bold', fontFamily: 'serif' },
  headerIcons: { flexDirection: 'row', alignItems: 'center' },
  scrollContent: { backgroundColor: '#F6F8FD', paddingHorizontal: 20, paddingBottom: 60 },

  /* [2. 타이틀 스타일] */
  pageTitle: { fontFamily: 'Pretendard', fontSize: 20, fontWeight: '400', lineHeight: 26, color: '#000', marginTop: 25, marginBottom: 15 },

  /* [3. 프로필 카드 스타일] */
  avatarCard: { backgroundColor: '#fff', borderRadius: 20, padding: 20, alignItems: 'center', marginBottom: 20 },
  editPhotoLabel: { alignSelf: 'flex-end', flexDirection: 'row', alignItems: 'center' },
  editPhotoText: { fontSize: 11, color: '#61636B', fontWeight: '400' },
  avatarCircle: { width: 140, height: 140, borderRadius: 70, backgroundColor: '#F0F0F0', justifyContent: 'center', alignItems: 'center', marginVertical: 10 },
  fullImg: { width: '100%', height: '100%', borderRadius: 70, resizeMode: 'cover' },

  /* [4. 정보 리스트 스타일] */
  infoCard: { backgroundColor: '#fff', borderRadius: 20, paddingHorizontal: 20, paddingVertical: 10, marginBottom: 30 },
  infoRow: { flexDirection: 'row', paddingVertical: 12, alignItems: 'center' },
  labelContainer: { flexDirection: 'row', alignItems: 'center', width: 130 }, // 🚀 수직 정렬을 위한 고정 너비
  labelText: { fontFamily: 'Pretendard', fontSize: 12, fontWeight: '400', lineHeight: 16, color: '#000' }, //
  valueText: { fontFamily: 'Pretendard', fontSize: 12, fontWeight: '600', lineHeight: 16, color: '#000', flex: 1 }, //
  changeText: { fontSize: 10, color: '#2B57D0', marginLeft: 8 }, // 🚀 밑줄 제거 반영
  divider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 5 },
  noticeText: { fontSize: 10, color: '#888', textAlign: 'center', marginTop: 15, lineHeight: 16 },

  /* [5. 사용 버전 스타일] */
  sectionTitle: { fontSize: 17, fontWeight: '700', marginTop: 10, marginBottom: 15 },
  versionContainer: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  vBox: { flex: 1, backgroundColor: '#fff', borderRadius: 15, padding: 18, borderWidth: 1, borderColor: '#eee' },
  vBoxActive: { backgroundColor: '#2B57D0', borderColor: '#2B57D0' },
  vTitle: { fontSize: 15, fontWeight: '700', marginBottom: 8 },
  vSub: { fontSize: 10, color: '#666', lineHeight: 14 },
  vSubActive: { color: 'rgba(255,255,255,0.8)' },
  whiteText: { color: '#fff' },

  /* [6. 소셜 로그인 바 스타일] */
  socialContainer: { gap: 10, marginBottom: 40 },
  socialBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 50, borderRadius: 12, paddingHorizontal: 20 },
  socialLogo: { width: 24, height: 24, marginRight: 15, resizeMode: 'contain' },
  socialText: { fontSize: 14, fontWeight: '700' },

 
  
});
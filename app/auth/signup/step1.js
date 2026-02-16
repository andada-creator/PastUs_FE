//전화번호 자동 포맷팅, 타이머, 만 14세 미만 체크 로직이 포함됩니다.

import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, Pressable, StyleSheet, ScrollView, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // 뒤로가기 아이콘용

export default function SignupStep1() {
  const router = useRouter();

  // 1. 상태 관리
  const [name, setName] = useState('');
  const [birth, setBirth] = useState('');
  const [gender, setGender] = useState('MALE');
  const [phone, setPhone] = useState('');
  const [authCode, setAuthCode] = useState('');
  
  // 2. 흐름 및 에러 상태
  const [isSent, setIsSent] = useState(false);
  const [timer, setTimer] = useState(147); 
  const [showAgeError, setShowAgeError] = useState(false);
  const [showMissingError, setShowMissingError] = useState(false);

  // 3. 약관 동의 상태
  const [agree1, setAgree1] = useState(false);
  const [agree2, setAgree2] = useState(false);
  const [agree3, setAgree3] = useState(false);
  const [agree4, setAgree4] = useState(false);
  const [agree5, setAgree5] = useState(false);

  // 약관 모달 제어 상태
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState('');
  const [currentAgreeKey, setCurrentAgreeKey] = useState(null);

  // 약관 데이터
  const termsData = {
  1: {
    title: '회원 이용 약관',
    sections: [
      {
        header: '서비스 목적',
        bullets: [
          'PastUs는 개인의 과거 경험을 익명 또는 실명으로 공유하고,',
          '본 서비스의 모든 콘텐츠는 조언이나 정답을 제공하지 않으며, 개인의 판단과 선택에 대한 책임은 사용자 본인에게 있습니다.'
        ]
      },
      {
        header: '콘텐츠 작성 및 책임',
        bullets: [
          '사용자는 본인이 작성한 콘텐츠에 대해 책임을 집니다.',
          '허위 사실, 타인의 명예를 훼손하는 내용, 불법적이거나 부적절한 콘텐츠는 게시할 수 없습니다.',
          '운영진은 약관 위반 콘텐츠에 대해 사전 통보 없이 수정 또는 삭제할 수 있습니다.'
        ]
      },
      {
        header: '콘텐츠 작성 및 책임', // 중복 제목!!
        bullets: [
          '사용자는 게시글 작성 시 실명 또는 익명을 선택할 수 있습니다.',
          '익명 게시물이라 하더라도, 법령에 따라 요청이 있을 경우 관련 정보가 제공될 수 있습니다.'
        ]
      },
      {
        header: '익명성 및 공개 범위',
        bullets: [
          'PastUs는 서비스의 일부 또는 전부를 사전 공지 후 변경하거나 종료할 수 있습니다.',
          '무료 및 유료 기능의 범위는 운영 정책에 따라 변경될 수 있습니다.'
        ]
      },
      {
        header: '계정 관리',
        bullets: [
          '계정 정보 관리의 책임은 사용자에게 있으며,',
          '부정 사용이 확인될 경우 서비스 이용이 제한될 수 있습니다.'
        ]
      }
    ]
  },
  2: {
    title: '계정정보 수집 약관',
    intro: 'PastUs는 회원 가입 및 서비스 제공을 위해 아래와 같은 최소한의 계정 정보를 수집·이용합니다.',
    sections: [

      {
        header: '1. 수집 항목',
        bullets: ['아이디(이용자를 식별하기위한 고유 식별자)',
            '비밀번호(암호화되어 저장 및 관리됨)'

        ]
      },
      {
        header: '2. 수집 목적',
        bullets: ['회원 식별 및 서비스 제공', '계정 생성 및 관리', '부정 이용 방지 및 서비스 안정성 확보']
      },
      {
        header: '3. 개인정보 보관 및 이용 기간',
        bullets: ['회원 탈퇴 시까지 보관하며', '단, 관련 법령에 따라 보존이 필요한 경우 해당 기간 동안 보관']
      },
      {
        header: '4. 개인정보 제공',
        bullets: [' PastUs는 원칙적으로 사용자의 계정 정보를 외부에 제공하지 않습니다. 다만, 법령에 따라 요청이 있을 경우 예외로 합니다.']
      },
      {
        header: '5. 동의 거부 권리 안내',
        bullets: ['본 동의는 서비스 이용을 위해 필수이며, 동의를 거부할 경우 회원 가입 및 서비스 이용이 제한될 수 있습니다.']
      }
    ]
  },
  3: {
    title: '개인정보 제3자 제공 동의',
    intro: 'PastUs는 서비스 이용 편의 제공을 위해 아래와 같은 개인정보를 선택적으로 수집·이용할 수 있습니다.',
    sections: [
      
      {
        header: '1. 수집 항목',
        bullets: ['이름', '성별', '전화번호', '생년월일']
      },
      {
        header: '2. 수집 목적',
        bullets: ['사용자 식별 보조', '고객 문의 응대', '서비스 품질 개선을 위한 참고 자료']
      },
      {
        header: '3. 개인정보 보관 및 이용 기간',
        bullets: ['회원 탈퇴 시까지 보관', '또는 수집·이용 목적 달성 시 즉시 파기']
      },
      {
        header: '4. 개인정보의 활용',
        text: 'PastUs는 서비스 개선 및 연구 목적을 위해 해당 개인정보를 개인을 식별할 수 없는 형태로 가공하여 활용할 수 있습니다.\n이 과정에서 다음 정보는 절대 포함되지 않습니다.',
        bullets: ['개인의 신원 정보', '계정 정보', '연락처 등 직접 식별 정보']
      },
      {
        header: '5. 동의 거부 권리 안내',
        // 불렛 없이 설명글만 있는 경우
        text: '본 동의는 선택 사항이며, 동의하지 않더라도 회원 가입 및 PastUs의 핵심 서비스 이용에는 제한이 없습니다.',
        bullets: []
      }
    
    ]
  }
};

  // 내용보기 클릭 핸들러
  const openTerms = (id) => {
    if (termsData[id]) {
      setModalTitle(termsData[id].title);
      setModalContent(termsData[id].content);
      setCurrentAgreeKey(id);
      setModalVisible(true);
    }
  };
  // 확인했습니다 클릭 핸들러
  const handleTermsConfirm = () => {
    if (currentAgreeKey === 1) setAgree1(true);
    if (currentAgreeKey === 2) setAgree2(true);
    if (currentAgreeKey === 3) setAgree3(true);
    setModalVisible(false);
  };

  // 4. 전화번호 띄어쓰기 포맷팅 (010 1234 5678)
  const formatPhone = (text) => {
    const cleaned = text.replace(/\D/g, ''); // 숫자만 남기기
    return cleaned.replace(/(\d{3})(\d{0,4})(\d{0,4})/, (match, p1, p2, p3) => {
      return [p1, p2, p3].filter(Boolean).join(' '); // 공백으로 연결
    }).trim();
  };

  // 5. 인증번호 자간 띄우기 (1 2 3 4 5 6)
  const formatAuthCode = (text) => {
    const cleaned = text.replace(/\D/g, ''); // 숫자만 남기기
    return cleaned.split('').join(' ').trim(); // 글자 사이마다 공백 넣기
  };

  // 6. 만 14세 미만 체크 로직
  const checkIsUnder14 = (birthStr) => {
    if (birthStr.length !== 8) return false;
    const year = parseInt(birthStr.substring(0, 4));
    const today = new Date();
    const age = today.getFullYear() - year;
    return age < 14;
  };

  // 7. 타이머 로직
  useEffect(() => {
    let interval;
    if (isSent && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isSent, timer]);

  // 8. 다음 단계로 이동 전 유효성 검사
  // **[핵심] 기본 정보 입력 완료 여부 판단**
  const isBasicInfoComplete = 
    name.length > 0 && 
    birth.length === 8 && 
    phone.replace(/\s/g, '').length === 11;

  const handleNextPress = () => {
    setShowAgeError(false);
    setShowMissingError(false);

    // 9. 실제 데이터 값 (공백 제거 후 체크)
   // 최종 가입 단계에서는 인증번호와 필수 약관을 모두 체크합니다.
    const rawAuth = authCode.replace(/\s/g, '');
    

    //에러체크
    //공백이 없는 진짜 길이가 11인지 체크
    const rawPhone = phone.replace(/\s/g, '');
    if (rawPhone.length < 11) {
    setShowMissingError(true);
    return;
  }
    //1) 미입력 체크 (필수 약관 포함)
    const isMissing = rawAuth.length < 6 || !agree1 || !agree2 || !agree3;

    
    if (isMissing) {
      setShowMissingError(true);
      return;
    }

    // 2) 나이 체크
    if (checkIsUnder14(birth)) {
      setShowAgeError(true);
      return;
    }

    // 3) 약관 동의 등 추가 필수 정보 체크
    if (!agree1 || !agree2 || !agree3) {
      setShowMissingError(true);
      return;
    }

    // 에러 안걸리고 통과 시 Step 2로 데이터 토스
    router.push({
      pathname: '/auth/signup/step2',
      params: { 
        userName: name, birth, gender, 
        phone: rawPhone,
        thirdPartyConsent: agree4.toString(),
        marketingConsent: agree5.toString()
      }
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 50 }}>
      <Text style={styles.title}>PastUs</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>이름</Text>
        <TextInput style={styles.input} placeholder="홍길동" value={name} onChangeText={setName} />
      </View>

      <View style={styles.row}>
        <View style={{ flex: 1.5 }}>
          <Text style={styles.label}>생년월일</Text>
          <TextInput style={styles.input} placeholder="19990101" value={birth} onChangeText={(t)=>setBirth(t.replace(/[^0-9]/g,''))} keyboardType="numeric" maxLength={8} />
          <Text style={styles.subText}>생년월일 8자리 ex) 19890428</Text>
        </View>
        <View style={{ flex: 1, marginLeft: 20 }}>
          <Text style={styles.label}>성별</Text>
          <View style={styles.genderRow}>
            <Pressable style={styles.radioRow} onPress={() => setGender('MALE')}>
              <View style={[styles.radio, gender === 'MALE' && styles.radioSelected]} />
              <Text style={styles.radioText}>남성</Text>
            </Pressable>
            <Pressable style={styles.radioRow} onPress={() => setGender('FEMALE')}>
              <View style={[styles.radio, gender === 'FEMALE' && styles.radioSelected]} />
              <Text style={styles.radioText}>여성</Text>
            </Pressable>
          </View>
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>전화번호</Text>
        <TextInput 
          style={styles.input} 
          placeholder="010 1234 5678" 
          value={phone} 
          onChangeText={(t) => setPhone(formatPhone(t))} //
          keyboardType="numeric" 
          maxLength={13} // 띄어쓰기 포함 길이
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>인증번호</Text>
        <View style={styles.row}>
          <TextInput 
            style={[styles.input, { flex: 1 }]} 
            placeholder="1 2 3 4 5 6" 
            value={authCode} 
            onChangeText={(t) => setAuthCode(formatAuthCode(t))} //
            keyboardType="numeric" 
            maxLength={11} // 숫자 6개 + 공백 5개
          />
          <View style={styles.sendButtonWrapper}>
            <Pressable style={styles.sendButton} onPress={() => {setIsSent(true); setTimer(147);}}>
                <Text style={styles.sendButtonText}>전송</Text>
            </Pressable>
            {isSent && (
                <Text style={styles.timerAbsolute}>
                    {Math.floor(timer/60)} : {String(timer%60).padStart(2,'0')}
                </Text>
            )}
          </View>
        </View>
      </View>

      {/* 약관 동의 영역 (조건부 랜더링 : 기본 정보가 입력되면 나타나는 섹션) */}
     {isBasicInfoComplete && ( 
        <View style = {styles.fadeContainer}> 
            <View style={styles.agreementSection}>
                <Text style={styles.label}>약관동의</Text>
                <AgreementItem label="회원 이용 약관 (필수)" checked={agree1} onChange={setAgree1} onDetail={() => openTerms(1)}/>
                <AgreementItem label="개인정보 수집 약관 (필수)" checked={agree2} onChange={setAgree2} onDetail={() => openTerms(2)}/>
                <AgreementItem label="만 14세 이상입니다 (필수)" checked={agree3} onChange={setAgree3} onDetail={() => openTerms(3)}/>
                <AgreementItem label="개인정보 제3자 제공 동의(선택)" checked={agree4} onChange={setAgree4} />
                <AgreementItem label="마케팅 정보 수신 동의(선택)" checked={agree5} onChange={setAgree5} />
            </View>

            <View style={styles.errorContainer}>
                {showAgeError && <Text style={styles.mainErrorText}>14세 미만은 가입할 수 없습니다.</Text>}
                {showMissingError && <Text style={styles.mainErrorText}>정보를 모두 입력해주세요.</Text>} 
            </View>

            <Pressable style={styles.nextButton} onPress={handleNextPress}>
                <Text style={styles.nextButtonText}>다음</Text>
            </Pressable>
        </View> )}
        {/* ---약관 상세 모달---*/}
        <Modal visible={modalVisible} animationType="slide">
            <View style={modalStyles.modalContainer}>
                <View style={modalStyles.modalHeader}>
                    <Pressable onPress={() => setModalVisible(false)}>
                        <Ionicons name="chevron-back" size={24} color="black" />
                    </Pressable>
                    <Text style={modalStyles.modalTitleText}>{modalTitle}</Text>
                    <View style={{ width: 24 }} /> 
                </View>
          
                <ScrollView style={modalStyles.modalContentScroll} showsVerticalScrollIndicator={false}>
                    {/* 1. 도입글(intro)이 있는 약관(예: 3번 약관)이라면 먼저 보여줍니다 */}
                    {termsData[currentAgreeKey]?.intro && (
                        <Text style={modalStyles.bodyText}>{termsData[currentAgreeKey].intro}</Text>
                    )}
                    
                    {/* 2. 각 섹션(제목 + 본문)을 반복해서 그려줍니다 */}
                    {termsData[currentAgreeKey]?.sections.map((section, sIndex) => (
                        <View key={sIndex} style={modalStyles.sectionContainer}>

                            {/* 굵은 제목 (서비스 목적, 1. 수집 항목 등) */}
                            <Text style={modalStyles.sectionHeader}>{section.header}</Text>
                            
                            {/* 섹션 내에 일반 설명글(text)이 있다면 보여줍니다 */}
                            {section.text && (
                                <Text style={modalStyles.bodyText}>{section.text}</Text>
                            )}
                            
                            {/* 불렛 항목들을 하나씩 나열합니다 */}
                            {section.bullets.map((bullet, bIndex) => (
                                <View key={bIndex} style={modalStyles.bulletRow}>
                                    <Text style={modalStyles.bulletDot}>•</Text>
                                    <Text style={modalStyles.bulletText}>{bullet}</Text>
                                </View>
                            ))}
                        </View>
                    ))}
                </ScrollView>

                <Pressable style={modalStyles.modalConfirmButton} onPress={handleTermsConfirm}>
                    <Text style={modalStyles.modalConfirmButtonText}>확인했습니다</Text>
                </Pressable>
            </View>
        </Modal>
    </ScrollView>
  );
}

// ... styles 및 AgreementItem은 기존과 동일
const AgreementItem = ({ label, checked, onChange, onDetail }) => (
  <View style={styles.agreeRow}>
    <Pressable style={styles.checkboxRow} onPress={() => onChange(!checked)}>
      <View style={[styles.checkbox, checked && styles.checkboxChecked]} />
      <Text style={styles.agreeText}>{label}</Text>
    </Pressable>
    {onDetail && (
      <Pressable onPress={onDetail}>
        <Text style={styles.detailLink}>내용보기</Text>
      </Pressable>
    )}
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 25 },
  title: { fontSize: 60, fontWeight: 'bold', textAlign: 'center', marginTop: 40, marginBottom: 40, fontFamily: 'serif' },
  inputGroup: { marginBottom: 20 },
  label: { color: '#4A7DFF', fontSize: 14, fontWeight: '600', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#4A7DFF', borderRadius: 10, padding: 15, fontSize: 16 },
  subText: { fontSize: 10, color: '#666', marginTop: 5 },
  row: { flexDirection: 'row', alignItems: 'center' },
  genderRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  radioRow: { flexDirection: 'row', alignItems: 'center', marginRight: 15 },
  radio: { width: 18, height: 18, borderRadius: 9, borderWidth: 1, borderColor: '#4A7DFF', marginRight: 6, justifyContent: 'center', alignItems: 'center' },
  radioSelected: { backgroundColor: '#4A7DFF' },
  radioText: { fontSize: 14, color: '#333' },
  sendButton: { backgroundColor: '#2B57D0', paddingHorizontal: 30, paddingVertical: 15, borderRadius: 10, marginLeft: 15 },
  sendButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  sendButtonWrapper: {
  marginLeft: 15,
  alignItems: 'center',
  position: 'relative', // 타이머가 이 박스를 기준으로 움직이게 함 
  },
 timerAbsolute: { 
  position: 'absolute', // 자리를 차지하지 않고 둥둥 떠 있게 함
  bottom: -22,          // 버튼 박스 아래로 22만큼 내려서 표시
  color: 'red', 
  fontSize: 12, 
  fontWeight: 'bold',
},
  agreementSection: { marginTop: 10 },
  agreeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  checkboxRow: { flexDirection: 'row', alignItems: 'center' },
  checkbox: { width: 20, height: 20, borderRadius: 5, borderWidth: 1, borderColor: '#4A7DFF', marginRight: 10 },
  checkboxChecked: { backgroundColor: '#4A7DFF' },
  agreeText: { fontSize: 14, color: '#333' },
  detailLink: { fontSize: 12, color: '#999', textDecorationLine: 'underline' },
  
  
  errorContainer: { height: 30, marginTop: 10, justifyContent: 'center', alignItems: 'center' },
  mainErrorText: { color: '#FF4D4D', fontSize: 14, fontWeight: 'bold' },
  nextButton: { borderWidth: 1, borderColor: '#4A7DFF', borderRadius: 10, padding: 18, alignItems: 'center', marginTop: 5 },
  nextButtonText: { color: '#4A7DFF', fontSize: 20, fontWeight: '600' }
});

const modalStyles = StyleSheet.create({
  // 1. 컨테이너: 좌우 여백을 피그마와 동일하게 20으로 고정
  modalContainer: { 
    flex: 1, 
    backgroundColor: '#fff', 
    paddingHorizontal: 25 
  },

  // 2. 헤더: 높이를 60으로 고정하여 아이콘과 제목이 정중앙에 오도록 배치
  modalHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    //height: 60, 
    marginBottom: 30,
    marginTop: 60 // 상태바 높이 고려
    
  },

  // 3. 제목: 피그마의 Bold(700) 두께 반영
  modalTitleText: { 
    fontSize: 18, 
    fontWeight: '700', 
    color: '#000' 
  },

  modalContentScroll: { 
    flex: 1, 
    //marginTop: 20,
    marginBottom: 10 
  },

  // --- 약관 본문 전용 스타일 ---
  sectionContainer: { marginBottom: 15 },
  sectionHeader: { 
    fontSize: 16, 
    fontWeight: '700', // 두꺼운 글자
    color: '#000', 
    marginBottom: 10,
    marginTop: 15,
  },
  bulletRow: { 
    flexDirection: 'row', 
    marginBottom: 6, 
    paddingLeft: 5 
  },
  bulletDot: { 
    fontSize: 14, 
    color: '#333', 
    marginRight: 6, 
    lineHeight: 22 
  },
  bulletText: { 
    fontSize: 14, 
    color: '#333', 
    lineHeight: 22, 
    flex: 1 
  },
  bodyText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 22,
    marginBottom: 15, // 문단 간 간격
  },

  // 4. 확인 버튼: 피그마의 1px 테두리와 둥근 모서리 반영
  modalConfirmButton: { 
    borderWidth: 1, 
    borderColor: '#4A7DFF', 
    borderRadius: 10, 
    paddingVertical: 18, // 세로 길이를 피그마 비율에 맞춤
    alignItems: 'center', 
    marginBottom: 40,    // 하단 홈 바(Home Indicator) 여백 고려
    backgroundColor: '#fff' 
  },

  modalConfirmButtonText: { 
    color: '#4A7DFF', 
    fontSize: 18, 
    fontWeight: '700' 
  },
});
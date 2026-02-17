//전화번호 자동 포맷팅, 타이머, 만 14세 미만 체크 로직이 포함됩니다.

import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, Pressable, ScrollView, Modal, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// 🚀 API 함수 임포트 추가!
import { checkPhoneDuplicate } from '../../../src/api/authService'; 
import { termsData } from '../../../src/constants/terms';
import { formatTime, TIMER_COLORS, formatPhone, formatAuthCode, checkIsUnder14 } from '../../../src/utils/signupUtils';
import { styles, modalStyles } from '../../../src/styles/authStyles';
import { AgreementItem } from '../../../src/components/auth/AgreementItem';

import { useTimer } from '../../../src/hooks/useTimer'; // 🚀 커스텀 훅 추가


export default function SignupStep1() {
  const router = useRouter();

  //상태 관리
  const [name, setName] = useState('');
  const [birth, setBirth] = useState('');
  const [gender, setGender] = useState('MALE');
  const [phone, setPhone] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [phoneMessage, setPhoneMessage] = useState('');
  
  //흐름 및 에러 상태
  const { timer, isActive: isSent, startTimer, resetTimer } = useTimer(147);
  const [showAgeError, setShowAgeError] = useState(false);
  const [showMissingError, setShowMissingError] = useState(false);

  //약관동의 상태
  const [agree1, setAgree1] = useState(false);
  const [agree2, setAgree2] = useState(false);
  const [agree3, setAgree3] = useState(false);
  const [agree4, setAgree4] = useState(false);
  const [agree5, setAgree5] = useState(false);

  //약관 모달 제어 상태
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [currentAgreeKey, setCurrentAgreeKey] = useState(null);

  //내용보기 클릭 핸들러
  const openTerms = (id) => {
    if (termsData[id]) {
      setModalTitle(termsData[id].title);
      setCurrentAgreeKey(id);
      setModalVisible(true);
    }
  };

  //확인했습니다. 클릭 핸들러
  const handleTermsConfirm = () => {
    
    if (currentAgreeKey === 1) setAgree1(true);
    if (currentAgreeKey === 2) setAgree2(true);
    if (currentAgreeKey === 3) setAgree3(true); 
    setModalVisible(false);
  };


  //다음 단계로 이동 전 유효성 검사
  const isBasicInfoComplete = 
    name.length > 0 && 
    birth.length === 8 && 
    phone.replace(/\s/g, '').length === 11;

  const handleSendAuthCode = async () => {
    const rawPhone = phone.replace(/\s/g, ''); 
    if (rawPhone.length < 11) {
      setShowMissingError(true);
      return;
    }

    

    try {
      const hyphenPhone = rawPhone.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
      const result = await checkPhoneDuplicate(hyphenPhone);
      if (result.available) {
        startTimer();
        setPhoneMessage('');
        Alert.alert("인증번호 발송", result.message);
      } else {
        setPhoneMessage(result.message);
       
      }
    } catch (error) {
        // 💡 3. 현재 "통신 오류"가 뜨는 이유는 API_URL이 가짜이기 때문입니다.
    // 테스트용으로 타이머를 돌려보고 싶다면 아래 두 줄의 주석을 해제하세요!
    // setIsSent(true); 
    // setTimer(147);
      setPhoneMessage("서버 연결 실패 (API 주소를 확인해주세요)");
      
    }
  };

  const handleNextPress = () => {
    setShowAgeError(false);
    setShowMissingError(false);

    const rawAuth = authCode.replace(/\s/g, '');
    const rawPhone = phone.replace(/\s/g, '');
 
    // 필수 약관 체크 로직 (agree1, 2, 4 필수)
    const isMissing = rawAuth.length < 6 || !agree1 || !agree2 || !agree4 || name === '' || birth.length < 8;
    
    if (isMissing) {
      setShowMissingError(true);
      return;
    }

    if (checkIsUnder14(birth)) {
      setShowAgeError(true);
      return;
    }

    router.push({
      pathname: '/auth/signup/step2',
      params: { 
        userName: name, birth, gender, 
        phone: rawPhone,
        thirdPartyConsent: agree3.toString(),
        marketingConsent: agree5.toString()
      }
    });
  };

  return (
    <ScrollView style={styles.step1Container} contentContainerStyle={ styles.step1ScrollContent}>
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
          style={[styles.input, phoneMessage !== '' && styles.inputError]} 
          placeholder="010 1234 5678" 
          value={phone} 
          onChangeText={(t) => {
            setPhone(formatPhone(t)); 
            setPhoneMessage('');

          }}
          keyboardType="numeric" 
          maxLength={13} 
        />
        {phoneMessage !== '' && <Text style={styles.errorText}>{phoneMessage}</Text>}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>인증번호</Text>
        <View style={styles.row}>
          <TextInput 
            style={[styles.input, { flex: 1 }]} 
            placeholder="1 2 3 4 5 6" 
            value={authCode} 
            onChangeText={(t) => setAuthCode(formatAuthCode(t))}
            keyboardType="numeric" 
            maxLength={11} 
          />
          <View style={styles.timerColumn}>
            
            <Pressable style={styles.sendButton} onPress={handleSendAuthCode}>
                <Text style={styles.sendButtonText}>{isSent ? "재전송" : "전송"}</Text>
            </Pressable>
            {isSent && (
                <Text style={styles.timerTextBelow}>
                    {formatTime(timer)}
                </Text>
            )}
          </View>
        </View>
      </View>

      {isBasicInfoComplete && ( 
        <View style={styles.fadeContainer}> 
            <View style={styles.agreementSection}>
                <Text style={styles.label}>약관동의</Text>
                <AgreementItem label="회원 이용 약관 (필수)" checked={agree1} onChange={setAgree1} onDetail={() => openTerms(1)}/>
                <AgreementItem label="계정정보 수집 약관 (필수)" checked={agree2} onChange={setAgree2} onDetail={() => openTerms(2)}/>
                <AgreementItem label="개인정보 제3자 제공 동의(선택)" checked={agree3} onChange={setAgree3} onDetail={() => openTerms(3)}/>
                <AgreementItem label="만 14세 이상입니다 (필수)" checked={agree4} onChange={setAgree4} />
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
                    {termsData[currentAgreeKey]?.intro && (
                        <Text style={modalStyles.bodyText}>{termsData[currentAgreeKey].intro}</Text>
                    )}
                    
                    {termsData[currentAgreeKey]?.sections?.map((section, sIndex) => (
                        <View key={sIndex} style={modalStyles.sectionContainer}>
                            <Text style={modalStyles.sectionHeader}>{section.header}</Text>
                            {section.text && (
                                <Text style={modalStyles.bodyText}>{section.text}</Text>
                            )}
                            {section.bullets?.map((bullet, bIndex) => (
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
import { StyleSheet } from 'react-native';


export const styles = StyleSheet.create({
  // --- [1. 레이아웃: Step 1 & Step 2 분리] ---
  // Step 1: ScrollView용 (에러 방지)
  step1Container: { 
    flex: 1, 
    backgroundColor: '#fff' 
  },
  step1ScrollContent: { 
    flexGrow: 1, 
     
    padding: 25, 
    paddingTop: 80,
    paddingBottom: 50 
  },
  // Step 2: 일반 View용 (중앙 정렬 포함)
  step2Container: { 
    flex: 1, 
    backgroundColor: '#fff', 
    padding: 30, 
    paddingTop: 80,
     
  },

  // --- [2. 공통 요소: 제목 및 입력창] ---
  title: { fontSize: 60, fontWeight: 'bold', textAlign: 'center', marginBottom: 60, fontFamily: 'NoticiaText-Bold', },
  inputGroup: { marginBottom: 20 },
  label: { color: '#4A7DFF', fontSize: 14, fontWeight: '600', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#4A7DFF', borderRadius: 10, padding: 15, fontSize: 16 },
  inputError: { borderColor: '#FF4D4D' }, 
  subText: { fontSize: 10, color: '#666', marginTop: 5 },
  row: { flexDirection: 'row', alignItems: 'flex-start', width: '100%' },

  // --- [3. 성별 선택 (Radio)] ---
  genderRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  radioRow: { flexDirection: 'row', alignItems: 'center', marginRight: 15 },
  radio: { width: 18, height: 18, borderRadius: 9, borderWidth: 1, borderColor: '#4A7DFF', marginRight: 6, justifyContent: 'center', alignItems: 'center' },
  radioSelected: { backgroundColor: '#4A7DFF' },
  radioText: { fontSize: 14, color: '#333' },

  // --- [4. 인증번호 및 타이머] ---
  sendButton: { backgroundColor: '#2B57D0', paddingHorizontal: 20, paddingVertical: 15, borderRadius: 10, width: '100%', justifyContent: 'center', alignItems: 'center', },
  sendButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  sendButtonWrapper: { marginLeft: 15, alignItems: 'center', position: 'relative' },
  timerAbsolute: { position: 'absolute', bottom: -22, color: 'red', fontSize: 12, fontWeight: 'bold' },

  timerColumn: {
  flexDirection: 'column', // 세로로 쌓기
  alignItems: 'center',
  marginLeft: 10,    // 버튼과 타이머 중앙 맞추기
  width: 90,               // 버튼 너비에 맞춰 고정 (선택사항)
},

timerTextBelow: {
  color: '#FF4D4D', 
  fontSize: 12,
  marginTop: 6,            // 버튼과의 간격
  fontWeight: 'bold',
},


  // --- [5. 약관 동의 영역 (Step 1 핵심)] ---
  agreementSection: { marginTop: 10 },
  agreeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  checkboxRow: { flexDirection: 'row', alignItems: 'center' },
  checkbox: { width: 20, height: 20, borderRadius: 5, borderWidth: 1, borderColor: '#4A7DFF', marginRight: 10 },
  checkboxChecked: { backgroundColor: '#4A7DFF' },
  agreeText: { fontSize: 14, color: '#333' },
  detailLink: { fontSize: 12, color: '#999', textDecorationLine: 'underline' },

  // --- [6. 에러 및 성공 메시지] ---
  errorContainer: { minHeight: 20, marginTop: 8, marginBottom: 5, justifyContent: 'center', alignItems: 'center' },
  mainErrorText: { color: '#FF4D4D', fontSize: 14, fontWeight: 'bold' },
  errorText: { color: '#FF4D4D', fontSize: 12, marginTop: 5, fontWeight: '500', textAlign: 'center' },
  successText: { color: '#4A7DFF', fontSize: 12, marginTop: 5, paddingLeft: 5 },

  // --- [7. 하단 버튼들] ---
  nextButton: { borderWidth: 1, borderColor: '#4A7DFF', borderRadius: 10, padding: 18, alignItems: 'center', marginTop: 5 },
  nextButtonText: { color: '#4A7DFF', fontSize: 20, fontWeight: '600' },
  submitButton: { borderWidth: 1, borderColor: '#4A7DFF', borderRadius: 10, padding: 18, alignItems: 'center', marginTop: 80 },
  submitButtonText: { color: '#4A7DFF', fontSize: 20, fontWeight: '600' },
  disabledButton: { opacity: 0.3 },
});

export const modalStyles = StyleSheet.create({
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
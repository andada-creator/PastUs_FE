import { StyleSheet } from 'react-native';


export const styles = StyleSheet.create({
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
  
  
  errorContainer: { minheight: 20, marginTop: 8, marginBottom: 5, justifyContent: 'center', alignItems: 'center' },
  mainErrorText: { color: '#FF4D4D', fontSize: 14, fontWeight: 'bold' },
  nextButton: { borderWidth: 1, borderColor: '#4A7DFF', borderRadius: 10, padding: 18, alignItems: 'center', marginTop: 5 },
  nextButtonText: { color: '#4A7DFF', fontSize: 20, fontWeight: '600' },

  // 에러 메시지: 피그마의 빨간색 텍스트 수치 반영
  errorText: { 
    color: '#FF4D4D', 
    fontSize: 12, 
    //marginTop: 5, 
    //paddingLeft: 5,
    fontWeight: '500',
    textAlign: 'center',
  },
  
  // 성공 메시지 (아이디 사용 가능할 때)
  successText: {
    color: '#4A7DFF',
    fontSize: 12,
    marginTop: 5,
    paddingLeft: 5
  },
  //test2.js 스타일
  container: { flex: 1, backgroundColor: '#fff', padding: 30, justifyContent: 'center' },
  title: { fontSize: 60, fontWeight: 'bold', textAlign: 'center', marginBottom: 60, fontFamily: 'serif' },
  inputGroup: { marginBottom: 25 },
  label: { color: '#4A7DFF', fontSize: 14, fontWeight: '600', marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#4A7DFF',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
  },
  //inputError: { borderColor: '#FF4D4D' }, // 에러 발생 시 빨간색 테두리
  errorText: { color: '#FF4D4D', fontSize: 12, marginTop: 5, fontWeight: '500' }, // 빨간색 에러 문구
  submitButton: {
    borderWidth: 1,
    borderColor: '#4A7DFF',
    borderRadius: 10,
    padding: 18,
    alignItems: 'center',
    marginTop: 80,
  },
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
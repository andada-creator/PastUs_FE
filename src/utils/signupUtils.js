// 4. 전화번호 띄어쓰기 포맷팅 (010 1234 5678)
  export const formatPhone = (text) => {
    const cleaned = text.replace(/\D/g, ''); // 숫자만 남기기
    return cleaned.replace(/(\d{3})(\d{0,4})(\d{0,4})/, (match, p1, p2, p3) => {
      return [p1, p2, p3].filter(Boolean).join(' '); // 공백으로 연결
    }).trim();
  };

  // 5. 인증번호 자간 띄우기 (1 2 3 4 5 6)
  export const formatAuthCode = (text) => {
    const cleaned = text.replace(/\D/g, ''); // 숫자만 남기기
    return cleaned.split('').join(' ').trim(); // 글자 사이마다 공백 넣기
  };

  // 6. 만 14세 미만 체크 로직
  export const checkIsUnder14 = (birthStr) => {
    if (birthStr.length !== 8) return false;
    const year = parseInt(birthStr.substring(0, 4));
    const today = new Date();
    const age = today.getFullYear() - year;
    return age < 14;
  };

  export const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m} : ${s < 10 ? '0' : ''}${s}`;
};
//이 코드는 모든 화면을 감싸는 Root Layout입니다. 여기서 로그인 화면과 메인 화면의 연결 고리를 설정합니다.

import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    // Stack은 화면을 층층이 쌓는 방식의 네비게이션입니다.
    <Stack
      screenOptions={{
        headerShown: true, // 기본적으로 헤더를 보여줍니다.
        headerTitle: 'PastUs', // 헤더 중앙에 뜰 제목입니다.
      }}
    >
      {/* index.js는 앱의 시작점이므로 가장 먼저 정의합니다. */}
      <Stack.Screen name="index" options={{ headerShown: false }} />

      {/* 로그인 그룹: 헤더가 필요 없는 화면들입니다. */}
      <Stack.Screen name="auth/login" options={{ headerShown: false }} />
      
      {/* 회원가입: 제목을 직접 지정해줍니다. */}
      <Stack.Screen name="auth/signup/step1" options={{ title: '본인 인증' }} />
      <Stack.Screen name="auth/signup/step2" options={{ title: '계정 생성' }} />

      {/* 하단 탭 그룹 */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
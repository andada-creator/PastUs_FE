//이 코드는 모든 화면을 감싸는 Root Layout입니다. 여기서 로그인 화면과 메인 화면의 연결 고리를 설정합니다.

import { Stack } from 'expo-router';
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
//  폰트 로딩을 위한 패키지 임포트
import { useFonts, NoticiaText_700Bold } from '@expo-google-fonts/noticia-text';

// 폰트가 로드될 때까지 스플래시 화면을 유지합니다.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  //  폰트 로드 및 별칭 설정
  const [fontsLoaded, error] = useFonts({
    'NoticiaText-Bold': NoticiaText_700Bold,
  });

  useEffect(() => {
    // 폰트 로드가 완료되었거나 에러가 발생하면 스플래시 화면을 숨깁니다.
    if (fontsLoaded || error) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  // 폰트가 로드되지 않았다면 아무것도 렌더링하지 않습니다.
  if (!fontsLoaded && !error) {
    return null;
  }

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
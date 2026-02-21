//이 코드는 모든 화면을 감싸는 Root Layout입니다. 여기서 로그인 화면과 메인 화면의 연결 고리를 설정합니다.

import { View } from 'react-native';
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';

import * as SplashScreen from 'expo-splash-screen'; 
import { useFonts, NoticiaText_700Bold } from '@expo-google-fonts/noticia-text';
import { SplashScreenView } from '../src/components/SplashScreenView';

// 앱이 켜지자마자 네이티브 스플래시가 자동으로 숨겨지는 것을 방지합니다.
//SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [fontsLoaded, fontError] = useFonts({
    'NoticiaText-Bold': NoticiaText_700Bold,
  });

  useEffect(() => {
    async function prepare() {
      try {
        await SplashScreen.hideAsync();
        if (fontsLoaded || fontError) {
          // 확인을 위해 3초 대기
          await new Promise(resolve => setTimeout(resolve, 3000));
          setAppIsReady(true);
        }
      } catch (e) {
        console.warn(e);
      }
    }
    prepare();
  }, [fontsLoaded, fontError]);

  

  // 🚀 [수정 핵심] early return을 지우고 하나의 return문으로 합칩니다.
  return (
    <View style={{ flex: 1, backgroundColor: '#2B57D0' }}>
      {!appIsReady ? (
        <SplashScreenView />
      ) : (
        <Stack
          screenOptions={{
            headerShown: true,
            headerTitle: 'PastUs',
            contentStyle: { backgroundColor: '#2B57D0' }
          }}
        >
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="auth/login" options={{ headerShown: false }} />
          <Stack.Screen name="auth/signup/step1" options={{ title: '본인 인증' }} />
          <Stack.Screen name="auth/signup/step2" options={{ title: '계정 생성' }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      )}
    </View>
  );
}
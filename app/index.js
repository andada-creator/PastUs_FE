// app/index.js
import { Redirect } from 'expo-router';

export default function Index() {
  // 앱을 실행하면 바로 /auth/login 화면으로 보냅니다.
  return <Redirect href="/auth/login" />;
}

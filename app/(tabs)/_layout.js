import React from 'react';
import { Tabs } from 'expo-router';
import BottomBar from '../../src/components/navigation/BottomBar';

export default function TabLayout() {
  return (
    <Tabs 
      tabBar={(props) => (
        // 🚀 현재 인덱스에 따라 activeTab을 home 또는 profile로 전달합니다.
        <BottomBar activeTab={props.state.index === 0 ? 'home' : 'profile'} />
      )} 
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="main" />   
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
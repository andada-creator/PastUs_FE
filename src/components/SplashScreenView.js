import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

export const SplashScreenView = () => {
  return (
    <View style={styles.container}>
      
      <Text style={styles.text}>PastUs</Text>
      
      
      <ActivityIndicator 
        size="small" 
        color="#ffffff" 
        style={{ marginTop: 30, opacity: 0.8 }} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
    backgroundColor: '#2B57D0', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#ffffff',
    fontSize: 85, 
    fontFamily: 'NoticiaText-Bold', 
    letterSpacing: -1, 
  },
});
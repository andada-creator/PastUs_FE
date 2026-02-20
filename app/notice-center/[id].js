import React, { useEffect, useState } from 'react'; 
import { View, Text, StyleSheet, Pressable, ScrollView, ActivityIndicator, Alert } from 'react-native'; 
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getNotificationDetail } from '../../src/api/notificationService'; 

export default function NotificationDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter(); 
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initData = async () => {
      try {
        setLoading(true);
        const res = await getNotificationDetail(id); 
        setData(res.data);
      } catch (err) {
        Alert.alert("오류", "내용을 불러올 수 없습니다.");
      } finally {
        setLoading(false);
      }
    };
    if (id) initData();
  }, [id]);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} color="#2B57D0" />;
  if (!data) return null;

  return (
    <View style={styles.outerContainer}>
      <SafeAreaView style={styles.statusBarBg} edges={['top']} />
      <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
        <Stack.Screen options={{ headerShown: false }} />

        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.headerBtn}>
            <Ionicons name="chevron-back" size={24} color="black" />
          </Pressable>
          <Text style={styles.headerTitle}>알림센터</Text>
          <Pressable style={styles.headerBtn}>
            <Ionicons name="search-outline" size={24} color="black" />
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          
          <Text style={styles.dateText}>{data.date}</Text>

          <View style={styles.detailCard}>
            <Text style={styles.senderText}>
              발신인  <Text style={styles.boldText}>{data.sender}</Text>
            </Text>
            <View style={styles.cardDivider} />
            <Text style={styles.contentBody}>
              {data.content}
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}


const styles = StyleSheet.create({
  outerContainer: { flex: 1, backgroundColor: '#F8F9FD' },
  statusBarBg: { backgroundColor: '#fff' },
  container: { flex: 1 },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 15, 
    paddingVertical: 12, 
    backgroundColor: '#fff' 
  },
  headerBtn: { padding: 5 },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#000' },
  scrollContent: { padding: 20 },
  dateText: { fontSize: 14, color: '#333', marginBottom: 15 },
  detailCard: { 
    backgroundColor: '#fff', 
    borderRadius: 15, 
    padding: 20, 
    minHeight: 400, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2
  },
  senderText: { fontSize: 15, color: '#444', marginBottom: 15 },
  boldText: { fontWeight: 'bold', color: '#000' },
  cardDivider: { height: 1, backgroundColor: '#F0F0F0', marginBottom: 20 },
  contentBody: { fontSize: 14, color: '#333', lineHeight: 22 }
});
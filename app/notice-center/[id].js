export default function NoticeDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}><Ionicons name="chevron-back" size={28} /></Pressable>
        <Text style={styles.headerTitle}>알림 내용</Text>
      </View>
      <View style={styles.detailBox}>
        <Text style={styles.detailTitle}>알림 제목이 여기에 들어갑니다.</Text>
        <Text style={styles.detailDate}>2026.02.20 14:30</Text>
        <View style={styles.divider} />
        <Text style={styles.detailContent}>
          상세한 알림 내용이 이곳에 뿌려집니다. 전공자님이 시안에서 요청하신 대로 깔끔한 텍스트 배치를 적용했습니다.
        </Text>
      </View>
    </SafeAreaView>
  );
}
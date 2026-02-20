import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getAllSituationTags } from '../../api/postService'; // GET /tags/situations

export default function TagSelectModal({ visible, onClose, initialSelectedIds, onApply }) {
  const [allTags, setAllTags] = useState([]); // 전체 마스터 태그
  const [selectedIds, setSelectedIds] = useState([]); // 현재 선택된 tagId 리스트
  const [loading, setLoading] = useState(false);

  // 🚀 모달이 열릴 때 전체 태그 목록 로드 및 초기값 설정
  useEffect(() => {
    if (visible) {
      fetchTags();
      setSelectedIds(initialSelectedIds || []);
    }
  }, [visible]);

  const fetchTags = async () => {
    try {
      setLoading(true);
      const res = await getAllSituationTags(); // API 명세서 기반 호출
      setAllTags(res.data || []);
    } catch (e) { console.error("태그 로드 실패", e); }
    finally { setLoading(false); }
  };

  const toggleTag = (tagId) => {
    if (selectedIds.includes(tagId)) {
      setSelectedIds(selectedIds.filter(id => id !== tagId));
    } else {
      // 🚀 명세서 제약 조건: 최대 3개
      if (selectedIds.length >= 3) {
        return alert("태그는 최대 3개까지만 선택 가능합니다.");
      }
      setSelectedIds([...selectedIds, tagId]);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>상황 태그 선택</Text>
            <Pressable onPress={onClose} hitSlop={15}>
              <Ionicons name="close" size={24} color="black" />
            </Pressable>
          </View>
          
          <Text style={styles.subText}>최대 3개까지 선택할 수 있습니다.</Text>

          {loading ? (
            <ActivityIndicator size="small" color="#2B57D0" style={{ marginVertical: 30 }} />
          ) : (
            <ScrollView contentContainerStyle={styles.tagGrid} showsVerticalScrollIndicator={false}>
              {allTags.map((tag) => {
                const isSelected = selectedIds.includes(tag.tagId);
                return (
                  <Pressable 
                    key={tag.tagId} 
                    style={[styles.tagItem, isSelected && styles.tagItemActive]} 
                    onPress={() => toggleTag(tag.tagId)}
                  >
                    <Text style={[styles.tagText, isSelected && styles.tagTextActive]}>#{tag.name}</Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          )}

          <Pressable style={styles.applyBtn} onPress={() => onApply(selectedIds)}>
            <Text style={styles.applyBtnText}>적용하기</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '85%', maxHeight: '60%', backgroundColor: '#fff', borderRadius: 25, padding: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  modalTitle: { fontSize: 18, fontWeight: '700' },
  subText: { fontSize: 12, color: '#888', marginBottom: 20 },
  tagGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center' },
  tagItem: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1.5, borderColor: '#E0E0E0' },
  tagItemActive: { backgroundColor: '#2B57D0', borderColor: '#2B57D0' },
  tagText: { fontSize: 13, color: '#666', fontWeight: '600' },
  tagTextActive: { color: '#fff' },
  applyBtn: { marginTop: 25, backgroundColor: '#A8C3FF', height: 50, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  applyBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' }
});
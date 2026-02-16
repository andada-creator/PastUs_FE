import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { styles } from '../../styles/authStyles';

export const AgreementItem = ({ label, checked, onChange, onDetail }) => (
  <View style={styles.agreeRow}>
    <Pressable style={styles.checkboxRow} onPress={() => onChange(!checked)}>
      <View style={[styles.checkbox, checked && styles.checkboxChecked]} />
      <Text style={styles.agreeText}>{label}</Text>
    </Pressable>
    {onDetail && (
      <Pressable onPress={onDetail}>
        <Text style={styles.detailLink}>내용보기</Text>
      </Pressable>
    )}
  </View>
);
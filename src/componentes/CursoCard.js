import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function CursoCard({ nome, modalidade, nivel, duracao, turno, onPress }) {
  return (
    <Card mode="outlined" style={styles.card} onPress={onPress}>
      <Card.Content>
        <Text style={styles.nivel}>{nivel}</Text>

        <Text variant="titleMedium" style={styles.nome}>{nome}</Text>

        <View style={styles.info}>
          <MaterialCommunityIcons name="clock-outline" size={16} />
          <Text style={styles.infoText}>{duracao}</Text>
        </View>

        <View style={styles.info}>
          <MaterialCommunityIcons name="weather-night" size={16} />
          <Text style={styles.infoText}>{turno}</Text>
        </View>

        <View style={styles.info}>
          <MaterialCommunityIcons name="account-group-outline" size={16} />
          <Text style={styles.infoText}>{modalidade}</Text>
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
  },
  nivel: {
    fontSize: 12,
    color: '#555',
    marginBottom: 4,
  },
  nome: {
    marginBottom: 10,
    color: '#1C9B5E',
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  infoText: {
    marginLeft: 6,
    fontSize: 14,
  },
});

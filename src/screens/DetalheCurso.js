// src/screens/DetalheCurso.js
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text, Card, Divider, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';


export default function DetalheCurso({ route }) {
  
  const {
    nome,
    modalidade,
    nivel,
    unidade,
    duracao,
    turno,
    descricao,
  } = route.params;

  const navigation = useNavigation();


  return (
    <ScrollView style={styles.container}>
      <Card mode="outlined" style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge">{nome}</Text>
          <Divider style={styles.divisor} />

          <Text variant="bodyMedium">📚 Modalidade: {modalidade}</Text>
          <Text variant="bodyMedium">🎓 Nível: {nivel}</Text>
          <Text variant="bodyMedium">📍 Unidade: {unidade}</Text>
          <Text variant="bodyMedium">⏱️ Duração: {duracao}</Text>
          <Text variant="bodyMedium" >🕓Turno: {turno}</Text>        
         

          <Divider style={styles.divisor} />
          <Text variant="titleSmall" style={styles.subtitulo}>Descrição:</Text>
          <Text style={styles.descricao}>{descricao}</Text>
        </Card.Content>
      </Card>
      <Button
                mode="outlined"
                onPress={() => navigation.goBack()}
                style={styles.botaoVoltar}
            >
                Voltar
            </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  card: { marginBottom: 16 },
  divisor: { marginVertical: 10 },
  subtitulo: { marginTop: 10, marginBottom: 4 },
  descricao: { marginTop: 8, lineHeight: 20 },
  botaoVoltar: { marginTop: 10 },
});

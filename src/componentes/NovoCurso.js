import React, { useState } from 'react';
import { ScrollView, StyleSheet, Alert, View } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { supabase } from '../config/supabase';
import { useUsuario } from '../contexto/UsuarioContexto';
import { useNavigation } from '@react-navigation/native';

export default function NovoCurso() {
    
  const { perfil } = useUsuario();
  const navigation = useNavigation();

  const [nome, setNome] = useState('');
  const [modalidade, setModalidade] = useState('');
  const [nivel, setNivel] = useState('');
  const [turno, setTurno] = useState('');
  const [unidade, setUnidade] = useState('');
  const [duracao, setDuracao] = useState('');
  const [descricao, setDescricao] = useState('');

  const salvarCurso = async () => {
    if (!nome || !modalidade || !nivel || !turno) {
      Alert.alert('Campos obrigatórios', 'Preencha todos os campos principais.');
      return;
    }

    const { error } = await supabase.from('cursos').insert([
      {
        nome,
        modalidade,
        nivel,
        turno,
        unidade,
        duracao,
        descricao
      }
    ]);

    if (error) {
      Alert.alert('Erro ao salvar', error.message);
    } else {
      Alert.alert('Sucesso', 'Curso cadastrado!');
      navigation.navigate('Cursos');
    }
  };
  

  if (perfil?.tipo !== 'admin') {
    return (
      <View style={styles.bloqueado}>
        <Text variant="titleLarge">⛔ Acesso restrito</Text>
        <Text>Esta funcionalidade é exclusiva para administradores.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text variant="titleLarge" style={styles.titulo}>Novo Curso</Text>

      <TextInput label="Nome" value={nome} onChangeText={setNome} style={styles.input} />
      <TextInput label="Modalidade" value={modalidade} onChangeText={setModalidade} style={styles.input} />
      <TextInput label="Nível" value={nivel} onChangeText={setNivel} style={styles.input} />
      <TextInput label="Turno" value={turno} onChangeText={setTurno} style={styles.input} />
      <TextInput label="Unidade" value={unidade} onChangeText={setUnidade} style={styles.input} />
      <TextInput label="Duração" value={duracao} onChangeText={setDuracao} style={styles.input} />
      <TextInput label="Descrição" value={descricao} onChangeText={setDescricao} multiline style={styles.input} />

      <Button mode="contained" onPress={salvarCurso} style={{ marginTop: 20 }}>
        Salvar Curso
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24 },
  titulo: { marginBottom: 16 },
  input: { marginBottom: 12 },
  bloqueado: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
});

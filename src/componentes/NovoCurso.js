import React, { useState } from 'react';
import { ScrollView, StyleSheet, Alert, View, Platform, Pressable, Image } from 'react-native';
import { TextInput, Button, Text, Switch } from 'react-native-paper';
import { supabase } from '../config/supabase';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useUsuario } from '../contexto/UsuarioContexto';

import * as DocumentPicker from 'expo-document-picker';


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
  const [carregando, setCarregando] = useState(false);
  

  const [arquivoUrl, setArquivoUrl] = useState(null);

  const selecionarArquivo = async () => {
        try {
            const resultado = await DocumentPicker.getDocumentAsync({
                type: 'application/pdf',
            });

            console.log('Resultado do picker:', resultado);

            // Verifica se existe arquivos
            if (resultado.assets && resultado.assets.length > 0) {
                console.log('Arquivo selecionado');

                // Acessa o primeiro registro
                const { uri, name } = resultado.assets[0];

                // Converte o URI para blob
                const resposta = await fetch(uri);
                const blob = await resposta.blob();

                // Define o caminho no storage
                const caminho = `eventos/${Date.now()}_${name}`;

                // Faz o upload para o supabase
                const { data, error } = await supabase
                    .storage
                    .from('eventos')
                    .upload(caminho, blob);

                if (error) {
                    Alert.alert('Erro', 'Falha ao enviar o PDF.');
                    console.error('Erro no upload:', error);
                } else {
                    // Obtém a URL pública
                    const { data: { publicUrl } } = supabase
                        .storage
                        .from('eventos')
                        .getPublicUrl(caminho);

                    setArquivoUrl(publicUrl);
                    console.log(publicUrl);
                }
            }
        } catch (error) {
            console.error('Erro ao selecionar arquivo:', error);
            Alert.alert('Erro', 'Ocorreu um erro ao selecionar o arquivo.');
        }
    };



  const salvarCurso = async () => {
    if (!nome || !modalidade || !nivel || !turno) {
      Alert.alert('Campos obrigatórios', 'Preencha todos os campos principais.');
      return;
    }

    setCarregando(true);

    try {
    const { error } = await supabase.
      from('cursos')
      .insert([{
        nome,
        modalidade,
        nivel,
        turno,
        unidade,
        duracao,
        descricao,
        arquivo_url: arquivoUrl, // <- Aqui está a correção
      }
    ]);

  if (error) {
          Alert.alert('Erro', 'Não foi possível cadastrar o evento.');
          console.error('Erro ao cadastrar evento:', error);

          return;
        }

        Alert.alert('Sucesso!', 'Evento cadastrado com sucesso.');
        navigation.navigate('Cursos');

      } catch (error) {
        Alert.alert('Erro inesperado', 'Tente novamente mais tarde.');
      } finally {
        setCarregando(false);
      }
    };

  return (
    <LinearGradient colors={['#DFF5EB', '#FFFFFF']} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text variant="titleLarge" style={{ marginBottom: 16 }}>Novo Curso</Text>

        <TextInput label="Nome" value={nome} onChangeText={setNome} style={styles.input} />
        <TextInput label="Modalidade" value={modalidade} onChangeText={setModalidade} style={styles.input} />
        <TextInput label="Nível" value={nivel} onChangeText={setNivel} style={styles.input} />
        <TextInput label="Turno" value={turno} onChangeText={setTurno} style={styles.input} />
        <TextInput label="Unidade" value={unidade} onChangeText={setUnidade} style={styles.input} />
        <TextInput label="Duração" value={duracao} onChangeText={setDuracao} style={styles.input} />
        <TextInput label="Descrição" value={descricao} onChangeText={setDescricao} multiline style={styles.input} />

        <Button mode="outlined" onPress={selecionarArquivo}>
                  Selecionar PDF do evento
              </Button>

        {arquivoUrl && <Text>Arquivo enviado com sucesso!</Text>}

        <Button mode="contained" onPress={salvarCurso} loading={carregando}>
          Cadastrar Evento
        </Button>

        <Button onPress={() => navigation.goBack()} style={{ marginTop: 8 }}>
          Cancelar
        </Button>

      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flexGrow: 1,
    justifyContent: 'center',
  },
  input: {
    marginBottom: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
});
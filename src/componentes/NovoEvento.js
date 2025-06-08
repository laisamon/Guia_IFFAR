import React, { useState } from 'react';
import { ScrollView, StyleSheet, Alert, View, Image, Platform } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { supabase } from '../config/supabase';
import { useNavigation } from '@react-navigation/native';
import { useUsuario } from '../contexto/UsuarioContexto';
import * as ImagePicker from 'expo-image-picker';

export default function NovoEvento() {
  const { perfil } = useUsuario();
  const navigation = useNavigation();

  const [titulo, setTitulo] = useState('');
  const [data, setData] = useState('');
  const [local, setLocal] = useState('');
  const [descricao, setDescricao] = useState('');
  const [total_vagas, setTotalVagas] = useState('');
  const [carregando, setCarregando] = useState(false);

  const [fotosSelecionadas, setFotosSelecionadas] = useState([]);
  const [carregandoFoto, setCarregandoFoto] = useState(false);

  // Função para fazer upload da imagem no Supabase
  const uploadImagem = async (uri) => {
    try {
      setCarregandoFoto(true);
      const resposta = await fetch(uri);
      const blob = await resposta.blob();
      const nomeImagem = `evento_${Date.now()}.jpg`;

      const { error: uploadError } = await supabase.storage
        .from('eventos')
        .upload(nomeImagem, blob);

      if (uploadError) {
        Alert.alert('Erro ao enviar imagem');
        return null;
      }

      const { data } = supabase.storage.from('eventos').getPublicUrl(nomeImagem);
      return data?.publicUrl || null;
    } catch (err) {
      console.error('Erro ao enviar imagem:', err);
      return null;
    } finally {
      setCarregandoFoto(false);
    }
  };

  // Selecionar imagem da galeria
  const escolherDaGaleria = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão negada...');
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!resultado.canceled) {
      const imagens = resultado.assets.map((asset) => asset.uri);
      setFotosSelecionadas((prev) => [...prev, ...imagens]);
    }
  };

  // Tirar foto com câmera
  const tirarFoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão da câmera negada...');
      return;
    }

    const resultado = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!resultado.canceled) {
      const imagem = resultado.assets[0];
      setFotosSelecionadas((prev) => [...prev, imagem.uri]);
    }
  };

  const selecionarImagem = () => {
    Alert.alert('Adicionar Imagem', 'Escolha a origem da imagem:', [
      { text: 'Câmera', onPress: tirarFoto },
      { text: 'Galeria', onPress: escolherDaGaleria },
      { text: 'Cancelar', style: 'cancel' },
    ]);
  };

  // Cadastro do evento
  const cadastrarEvento = async () => {
    if (!titulo || !data || !local || !descricao || !total_vagas) {
      Alert.alert('Campos obrigatórios', 'Preencha todos os campos.');
      return;
    }

    let dataFormatada;
    try {
      dataFormatada = new Date(data.replace(' ', 'T'));
      if (isNaN(dataFormatada.getTime())) throw new Error('Data inválida');
    } catch {
      Alert.alert('Data inválida', 'Informe a data no formato correto.');
      return;
    }

    setCarregando(true);

    const { data: eventoCriado, error: erroEvento } = await supabase
      .from('eventos')
      .insert([{
        titulo,
        data: dataFormatada.toISOString(),
        local,
        descricao,
        inscricao: true,
        total_vagas: parseInt(total_vagas),
        vagas_disponiveis: parseInt(total_vagas),
        foto_url: null, // ou usar uma das imagens depois
      }])
      .select()
      .single();

    if (erroEvento || !eventoCriado) {
      setCarregando(false);
      Alert.alert('Erro ao cadastrar evento', erroEvento?.message || 'Erro desconhecido');
      return;
    }

    // Envia as imagens e associa ao evento
    for (const uri of fotosSelecionadas) {
      const url = await uploadImagem(uri);

      if (url) {
        const { error: imagemError } = await supabase
          .from('imagens_evento')
          .insert({
            evento_id: eventoCriado.id,
            url,
          });

        if (imagemError) {
          console.error('Erro ao salvar imagem no banco:', imagemError.message);
          Alert.alert('Erro', 'Erro ao salvar imagem no banco.');
        }
      }
    }


    setCarregando(false);
    Alert.alert('Sucesso', 'Evento e imagens cadastrados com sucesso!');
    navigation.navigate('Eventos');
  };

  if (!perfil || perfil.tipo !== 'admin') {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text variant="titleLarge">Acesso negado</Text>
        <Button onPress={() => navigation.navigate('Cursos')} style={styles.botao}>
          Voltar
        </Button>
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text variant="titleLarge" style={{ marginBottom: 16 }}>Cadastrar novo evento</Text>

      <TextInput label="Título" value={titulo} onChangeText={setTitulo} style={styles.input} />
      <TextInput label="Data (AAAA-MM-DD)" value={data} onChangeText={setData} style={styles.input} />
      <TextInput label="Local" value={local} onChangeText={setLocal} style={styles.input} />
      <TextInput label="Descrição" value={descricao} onChangeText={setDescricao} style={styles.input} multiline />
      <TextInput label="Total de Vagas" value={total_vagas} onChangeText={setTotalVagas} keyboardType="numeric" style={styles.input} />

      <Button mode="outlined" onPress={selecionarImagem} style={{ marginTop: 20 }}>
        Adicionar Imagens do Evento
      </Button>

      {Platform.OS === 'web' && (
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={async (event) => {
            const files = event.target.files;
            if (files.length > 0) {
              const novasFotos = [];
              for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const objectUrl = URL.createObjectURL(file);
                novasFotos.push(objectUrl);
              }
              setFotosSelecionadas((prev) => [...prev, ...novasFotos]);
            }
          }}
          style={{ marginTop: 10 }}
        />
      )}

      {fotosSelecionadas.length > 0 && (
        <View style={{ marginTop: 10 }}>
          {fotosSelecionadas.map((uri, index) => (
            <Image
              key={index}
              source={{ uri }}
              style={{ width: 200, height: 200, borderRadius: 10, marginBottom: 10 }}
            />
          ))}
        </View>
      )}

      <Button mode="contained" onPress={cadastrarEvento} loading={carregando} style={styles.botao}>
        Cadastrar Evento
      </Button>

      <Button onPress={() => navigation.navigate('Eventos')} style={styles.botao}>
        Voltar
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, flexGrow: 1, justifyContent: 'center' },
  input: { marginBottom: 12 },
  botao: { marginTop: 16 },
});

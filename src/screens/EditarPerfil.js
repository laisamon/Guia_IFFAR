// EditarPerfil.js
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, Image } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { supabase } from '../config/supabase';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { useUsuario } from '../contexto/UsuarioContexto';

export default function EditarPerfil() {
  const { perfil, setPerfil } = useUsuario();
  const [nome, setNome] = useState(perfil?.nome || '');
  const [imagemUri, setImagemUri] = useState(perfil?.foto_url || null);
  const [carregando, setCarregando] = useState(false);

  const navigation = useNavigation();

  const escolherImagem = async () => {
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!resultado.canceled) {
      setImagemUri(resultado.assets[0].uri);
    }
  };

  const atualizarPerfil = async () => {
    if (!nome.trim()) {
      Alert.alert('Campo obrigatório', 'Por favor, preencha o nome.');
      return;
    }

    setCarregando(true);

    try {
      let urlImagem = perfil.foto_url;

if (imagemUri && imagemUri !== perfil.foto_url) {
  try {
    const resposta = await fetch(imagemUri);
    const blob = await resposta.blob();
    const caminho = `${perfil.id}.jpg`;

    const { data: uploadData, error: erroUpload } = await supabase.storage
      .from('fotos-perfil')
      .upload(caminho, blob, {
        upsert: true,
        contentType: 'image/jpeg',
      });

    if (erroUpload) {
      console.error('Erro ao fazer upload da imagem:', erroUpload.message);
      throw erroUpload;
    }

    const { data: urlData } = supabase
      .storage
      .from('fotos-perfil')
      .getPublicUrl(caminho);

    urlImagem = urlData.publicUrl;
    console.log('Imagem salva em:', urlImagem);

  } catch (e) {
    Alert.alert('Erro ao salvar imagem de perfil', e.message);
    return;
  }
}


      
      const { error } = await supabase
        .from('usuarios')
        .update({ nome, foto_url: urlImagem })
        .eq('id', perfil.id);

      if (error) {
        Alert.alert('Erro ao atualizar perfil', error.message);
        return;
      }

      // Adiciona timestamp para forçar atualização da imagem
      const novaUrl = urlImagem ? `${urlImagem}?t=${new Date().getTime()}` : null;

      setPerfil({ ...perfil, nome, foto_url: novaUrl });

      Alert.alert('Sucesso', 'Perfil atualizado com sucesso.');
      navigation.goBack();
    } catch (error) {
      console.error('Erro inesperado:', error);
      Alert.alert('Erro inesperado', 'Tente novamente mais tarde.');
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    if (perfil) {
      setNome(perfil.nome);
      setImagemUri(perfil.foto_url);
    }
  }, [perfil]);

  return (
    <View style={styles.container}>
      <Text variant="titleLarge" style={styles.titulo}>Editar Perfil</Text>

      {imagemUri && (
        <Image source={{ uri: imagemUri }} style={styles.imagem} />
      )}

      <Button mode="outlined" onPress={escolherImagem} style={styles.botaoImagem}>
        Escolher Imagem de Perfil
      </Button>

      <TextInput
        label="Nome"
        value={nome}
        onChangeText={setNome}
        style={styles.input}
        mode="outlined"
      />

      <Button mode="contained" onPress={atualizarPerfil} loading={carregando}>
        Atualizar
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
    justifyContent: 'center',
  },
  titulo: {
    textAlign: 'center',
    marginBottom: 24,
  },
  imagem: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#6200ee',
  },
  botaoImagem: {
    marginBottom: 16,
    alignSelf: 'center',
  },
  input: {
    marginBottom: 16,
  },
});


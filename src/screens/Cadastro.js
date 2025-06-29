import React, { useState } from 'react';
import { View, StyleSheet, Alert, Image } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { supabase } from '../config/supabase';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';

export default function Cadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [imagemUri, setImagemUri] = useState(null);
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

const cadastrar = async () => {
  if (!email.trim() || !senha.trim() || !nome.trim()) {
    Alert.alert('Campos obrigatórios', 'Por favor, preencha todos os campos.');
    return;
  }

  setCarregando(true);

  try {
    // Cria usuário com e-mail e senha
    const { data, error } = await supabase.auth.signUp({
      email,
      password: senha,
    });

    if (error) {
      console.error('Erro no cadastro:', error);
      Alert.alert('Erro no cadastro', error.message);
      return;
    }

    // Aguarda um tempo para garantir que o usuário foi criado
    await new Promise(resolve => setTimeout(resolve, 2000));

    let urlImagem = null;

    // Upload da imagem, se houver
    if (imagemUri) {
      const resposta = await fetch(imagemUri);
      const blob = await resposta.blob();
      const caminho = `${data.user.id}.jpg`;

      const { error: erroUpload } = await supabase.storage
        .from('fotos-perfil')
        .upload(caminho, blob, {
          upsert: true,
          contentType: 'image/jpeg',
        });

      if (erroUpload) {
        console.error('Erro ao fazer upload da imagem:', erroUpload);
        Alert.alert('Erro no upload da imagem', erroUpload.message);
        return;
      }

      const publicUrlData = supabase.storage
        .from('fotos-perfil')
        .getPublicUrl(caminho);

      urlImagem = publicUrlData.publicUrl;
    }

    // Insere dados do usuário na tabela "usuarios"
    const { error: erroPerfil } = await supabase.from('usuarios').insert({
      id: data.user.id, // Use apenas o ID retornado
      nome,
      foto_url: urlImagem,
    });

    if (erroPerfil) {
      console.error('Erro ao criar perfil:', erroPerfil);
      Alert.alert('Erro ao criar perfil', erroPerfil.message);
      return;
    }

    Alert.alert(
      'Cadastro realizado!',
      'Enviamos um e-mail para você confirmar sua conta. Verifique sua caixa de entrada.',
      [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
    );

  } catch (error) {
    console.error('Erro inesperado:', error);
    Alert.alert('Erro inesperado', 'Tente novamente mais tarde.');
  } finally {
    setCarregando(false);
  }
};
  return (
    <LinearGradient colors={['#DFF5EB', '#FFFFFF']} style={[styles.container, { flex: 1 }]}>
      <View style={styles.container}>
        <Text variant="titleLarge" style={{ marginBottom: 16 }}>Criar Conta</Text>

        <TextInput
          label="Nome completo"
          value={nome}
          onChangeText={setNome}
          style={styles.input}
        />
        <TextInput
          label="E-mail"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />
        <TextInput
          label="Senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
          style={styles.input}
        />

        <Button onPress={escolherImagem} style={{ marginBottom: 16 }}>
          Escolher Imagem de Perfil
        </Button>

        {imagemUri && (
          <Image
            source={{ uri: imagemUri }}
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              alignSelf: 'center',
              marginBottom: 16
            }}
          />
        )}

        <Button mode="contained" onPress={cadastrar} loading={carregando}>
          Cadastrar
        </Button>

        <Button onPress={() => navigation.navigate('Login')} style={{ marginTop: 8 }}>
          Já tenho conta
        </Button>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, flex: 1, justifyContent: 'center' },
  input: { marginBottom: 16 },
});

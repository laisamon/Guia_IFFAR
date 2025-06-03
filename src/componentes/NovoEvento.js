import React, { useState } from 'react';
import { ScrollView, StyleSheet, Alert, View, Platform, Pressable, Image } from 'react-native';
import { TextInput, Button, Text, Switch } from 'react-native-paper';
import { supabase } from '../config/supabase';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useUsuario } from '../contexto/UsuarioContexto';

import * as ImagePicker from 'expo-image-picker';



export default function NovoEvento() {
  const [titulo, setTitulo] = useState('');
  const [data, setData] = useState('');
  const [local, setLocal] = useState('');
  const [descricao, setDescricao] = useState('');
  const [inscricao, setInscricao] = useState(true);
  const [total_vagas, setTotalVagas] = useState('');
  const [carregando, setCarregando] = useState(false);
  const navigation = useNavigation();
  const { perfil } = useUsuario();

    //parte da foto
    const [fotoEventoUrl, setFotoEventoUrl] = useState(null);
    const [fotoLocal, setFotoLocal] = useState(null);
    const [carregandoFoto, setCarregandoFoto] = useState(false);

    // Funções para seleção e upload da foto
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
            setFotoLocal(imagem.uri);
            await uploadFoto(imagem.uri);
        }
    };

    const escolherDaGaleria = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permissão negada...');
            return;
        }

        const resultado = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.7,
        });

        if (!resultado.canceled) {
            const imagem = resultado.assets[0];
            setFotoLocal(imagem.uri);
            await uploadFoto(imagem.uri);
        }
    };

    const uploadFoto = async (uri) => {
        setCarregandoFoto(true);
        try {
            const resposta = await fetch(uri);
            const blob = await resposta.blob();
            const nomeImagem = `eventos/foto_${Date.now()}.jpg`;

            const { error } = await supabase.storage
                .from('eventos')
                .upload(nomeImagem, blob);

            if (error) {
                console.log(error);
                Alert.alert('Erro ao enviar imagem');
                console.error(error);
            } else {
                const { data: { publicUrl } } = supabase
                    .storage
                    .from('eventos')
                    .getPublicUrl(nomeImagem);

                console.log(publicUrl);

                setFotoEventoUrl(publicUrl);
            }
        } catch (err) {
            console.error('Erro no envio da imagem:', err);
        }
        finally {
            setCarregandoFoto(false);
        }
    };

    const selecionarImagem = () => {
        Alert.alert('Adicionar Imagem',
            'Escolha a origem da imagem:',
            [
                { text: 'Câmera', onPress: tirarFoto },
                { text: 'Galeria', onPress: escolherDaGaleria },
                { text: 'Cancelar', style: 'cancel' },
            ]);
    };

    //Fim funções foto

  const cadastrarEvento = async () => {
    if (!titulo.trim() || !data.trim() || !local.trim() || !descricao.trim() || !total_vagas.trim()) {
      Alert.alert('Campos obrigatórios', 'Por favor, preencha todos os campos.');
      return;
    }

    setCarregando(true);

    try {
      const { error } = await supabase
        .from('eventos')
        .insert([{
          titulo,
          data,
          local,
          descricao,
          inscricao,
          total_vagas: parseInt(total_vagas, 10),
          vagas_disponiveis: parseInt(total_vagas, 10), // <-- vírgula corrigida aqui
          foto_url: fotoEventoUrl
        }]);

      if (error) {
        Alert.alert('Erro', 'Não foi possível cadastrar o evento.');
        console.error('Erro ao cadastrar evento:', error);

        return;
      }

      Alert.alert('Sucesso!', 'Evento cadastrado com sucesso.');
      navigation.navigate('Eventos');

    } catch (error) {
      Alert.alert('Erro inesperado', 'Tente novamente mais tarde.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <LinearGradient colors={['#DFF5EB', '#FFFFFF']} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text variant="titleLarge" style={{ marginBottom: 16 }}>Cadastrar Evento</Text>

        <TextInput
          label="Título"
          value={titulo}
          onChangeText={setTitulo}
          style={styles.input}
        />
        <TextInput
          label="Data (AAAA-MM-DD)"
          value={data}
          onChangeText={setData}
          style={styles.input}
        />
        <TextInput
          label="Local"
          value={local}
          onChangeText={setLocal}
          style={styles.input}
        />
        <TextInput
          label="Descrição"
          value={descricao}
          onChangeText={setDescricao}
          multiline
          numberOfLines={3}
          style={styles.input}
        />
        <View style={styles.switchContainer}>
          <Text>Inscrição aberta?</Text>
          <Switch value={inscricao} onValueChange={() => setInscricao(!inscricao)} />
        </View>

        <TextInput
          label="Total de Vagas"
          value={total_vagas}
          onChangeText={setTotalVagas}
          keyboardType="numeric"
          style={styles.input}
        />



            {/* Foto */}
            <Button mode="outlined" onPress={selecionarImagem} style={{ marginTop: 20 }}>
                Adicionar Imagem do Evento
            </Button>

            {Platform.OS === 'web' && (
                <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => {
                        const file = event.target.files[0];
                        if (file) {
                            const uri = URL.createObjectURL(file);
                            setFotoLocal(uri);
                            uploadFoto(uri);
                        }
                    }}
                />
            )}

            {fotoLocal && (
                <Image
                    source={{ uri: fotoLocal }}
                    style={{ width: 200, height: 200, borderRadius: 10, marginTop: 10 }}
                />
            )}

        <Button mode="contained" onPress={cadastrarEvento} loading={carregando}>
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
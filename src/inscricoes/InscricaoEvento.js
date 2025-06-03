import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, Button, ActivityIndicator } from 'react-native-paper';
import { supabase } from '../config/supabase';
import { useUsuario } from '../contexto/UsuarioContexto';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function InscricaoEvento() {
  const { perfil, usuario } = useUsuario();
  const navigation = useNavigation();
  const route = useRoute();

  const [carregando, setCarregando] = useState(false);

  const { evento_id } = route.params;

  const inscreverUsuario = async () => {
      console.log('Função inscreverUsuario chamada');


    setCarregando(true);


    const { error } = await supabase.from('eventos_inscricoes').insert([
      {
        usuario_id: perfil.id,
        evento_id: evento_id,
        status: 'confirmada'
      }
    ]);

    setCarregando(false);

    if (error) {
        Alert.alert('Erro', `Erro ao se inscrever no evento: ${error.message}`);
      console.log('Perfil:', perfil.id);
        console.log('Evento ID:', evento_id);
    } else {
        Alert.alert('Sucesso', 'Inscrição realizada com sucesso!');
      navigation.navigate('Eventos');
      console.log('Perfil:', perfil.id);
        console.log('Evento ID:', evento_id);
    }
  };

  return (
    <View style={styles.container}>
      <Button mode="contained" onPress={inscreverUsuario} loading={carregando} style={styles.botao}>
        Confirmar Inscrição
      </Button>


      <Button
        mode="outlined"
        onPress={() => navigation.navigate('Eventos')}
        style={styles.botao}
      >
        Voltar
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: 'center',
    flex: 1,
  },
  titulo: {
    marginBottom: 16,
    textAlign: 'center',
  },
  texto: {
    marginBottom: 20,
    textAlign: 'center',
  },
  botao: {
    marginTop: 16,
  }
});

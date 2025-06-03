import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { ActivityIndicator, Button, Text } from 'react-native-paper';
import EventoCard from '../componentes/EventoCard';
import { supabase } from '../config/supabase';
import { useIsFocused } from '@react-navigation/native'; 
import { useUsuario } from '../contexto/UsuarioContexto'; 


export default function Eventos({ navigation }) {
  const { perfil } = useUsuario();
  const [eventos, setEventos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const isFocused = useIsFocused(); 

  useEffect(() => {
    async function buscarEventos() {
      setCarregando(true); 
      const { data, error } = await supabase.from('eventos').select('*');

      if (error) {
        console.error('Erro ao buscar eventos:', error);
      } else {
        setEventos(data);
      }

      setCarregando(false);
    }

    buscarEventos();
  }, [isFocused]); 

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text variant="titleLarge" style={styles.titulo}>Eventos Acadêmicos</Text>

      {carregando && <ActivityIndicator animating />}
      {!carregando && eventos.length === 0 && <Text>Nenhum evento encontrado.</Text>}



      {eventos.map((evento, index) => (
  <EventoCard
    key={index}
    {...evento}
    onPress={() => navigation.navigate('DetalheEvento', { ...evento })}
  />
))}


      {perfil?.tipo === 'admin' && (
        <Button
          mode="contained"
          onPress={() => navigation.navigate('NovoEvento')}
          style={styles.botao}
        >
          Novo Evento
        </Button>
      )}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  titulo: { marginBottom: 16 },
  botao: {
    width: '100%',
    marginVertical: 8,
  },
});

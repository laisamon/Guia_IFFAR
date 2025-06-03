import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import CursoCard from '../componentes/CursoCard';
import {supabase} from '../config/supabase';

export default function Cursos({ navigation }) {

  const [cursos, setCursos] = useState([]);
  const [carregando, setCarregando] = useState(true);
    
  useEffect(() => {
    async function buscarCursos() {
      const{data, error} = 
        await supabase.from('cursos').select('*');

      if (error) {
        console.error('Erro ao buscar cursos:', error);
      }
      else{
        setCursos(data);
      }
      setCarregando(false);
    }

    buscarCursos();
  }, [])

    return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text variant="titleLarge" style={styles.titulo}>Cursos do Campus</Text>
      
      {carregando && <ActivityIndicator animating/>}
      {!carregando && cursos.length == 0 && <Text>Nenhum curso encontrado.</Text>}

      {cursos.map((curso, index) => (
        <CursoCard key={index} {...curso} onPress={() => navigation.navigate('DetalheCurso', curso)} />
      ))}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  titulo: { marginBottom: 16 },
});

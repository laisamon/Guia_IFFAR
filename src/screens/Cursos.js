import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { ActivityIndicator, Button, Text } from 'react-native-paper';
import CursoCard from '../componentes/CursoCard';
import { supabase } from '../config/supabase';
import { useIsFocused } from '@react-navigation/native'; 
import { useUsuario } from '../contexto/UsuarioContexto'; 

export default function Cursos({ navigation }) {
  const { perfil } = useUsuario();
  const [cursos, setCursos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const isFocused = useIsFocused(); 
    
  useEffect(() => {
    async function buscarCursos() {
      setCarregando(true); 

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
  }, [isFocused])

    return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text variant="titleLarge" style={styles.titulo}>Cursos do Campus</Text>
      
      {carregando && <ActivityIndicator animating/>}
      {!carregando && cursos.length == 0 && <Text>Nenhum curso encontrado.</Text>}

      {cursos.map((curso, index) => (
        <CursoCard key={index} {...curso} onPress={() => navigation.navigate('DetalheCurso', curso)} />
      ))}

      {perfil?.tipo === 'admin' && (
              <Button
                mode="contained"
                onPress={() => navigation.navigate('NovoCurso')}
                style={styles.botao}
              >
                Novo Curso
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

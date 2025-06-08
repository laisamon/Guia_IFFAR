import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, ScrollView } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { supabase } from '../config/supabase';

export default function GaleriaImagensEvento({ eventoId }) {
  const [imagens, setImagens] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregarImagens() {
      setCarregando(true);
      const { data, error } = await supabase
        .from('imagens_evento') // ✅ Confirme se o nome está certo
        .select('url')          // ✅ Campo deve ser 'url', não 'url_imagem'
        .eq('evento_id', eventoId);

      if (error) {
        console.error('Erro ao carregar imagens:', error.message);
      } else {
        setImagens(data || []);
      }
      setCarregando(false);
    }

    if (eventoId) carregarImagens();
  }, [eventoId]);

  if (carregando) return <ActivityIndicator animating={true} />;

  if (imagens.length === 0) {
    return <Text>Nenhuma imagem cadastrada para este evento.</Text>;
  }

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {imagens.map((img, index) => (
        <Image
          key={index}
          source={{ uri: img.url }}
          style={styles.imagem}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  imagem: {
    width: 200,
    height: 200,
    marginRight: 10,
    borderRadius: 10,
  },
});

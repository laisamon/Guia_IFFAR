import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, ActivityIndicator, View } from 'react-native';
import { Text, Card, Badge, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { useUsuario } from '../contexto/UsuarioContexto';
import { supabase } from '../config/supabase';

export default function MeusEventos() {
  const { perfil } = useUsuario();
  const [eventos, setEventos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    const buscarEventos = async () => {
      if (!perfil) return;

      setCarregando(true);

      // Busca as inscrições do usuário
      const { data: inscricoes, error: errInscricoes } = await supabase
        .from('eventos_inscricoes')
        .select('evento_id, status')
        .eq('usuario_id', perfil.id); // Certifique que seja perfil.id ou perfil.usuario_id conforme seu contexto

      if (errInscricoes) {
        console.error('Erro ao buscar inscrições:', errInscricoes);
        setCarregando(false);
        return;
      }

      if (!inscricoes || inscricoes.length === 0) {
        setEventos([]);
        setCarregando(false);
        return;
      }

      // Pega só os IDs dos eventos
      const idsEventos = inscricoes.map(i => i.evento_id);

      // Busca dados completos dos eventos (título, data, local)
      const { data: dadosEventos, error: errEventos } = await supabase
        .from('eventos')
        .select('id, titulo, data, local, vagas_disponiveis, inscricao')
        .in('id', idsEventos);

      if (errEventos) {
        console.error('Erro ao buscar dados dos eventos:', errEventos);
        setCarregando(false);
        return;
      }

      // Junta os dados dos eventos com o status da inscrição
      const eventosCompletos = dadosEventos.map(ev => {
        const inscricao = inscricoes.find(i => i.evento_id === ev.id);
        return { ...ev, status: inscricao?.status || 'desconhecido' };
      });

      setEventos(eventosCompletos);
      setCarregando(false);
    };

    buscarEventos();
  }, [perfil]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text variant="titleLarge" style={styles.titulo}>Meus Eventos</Text>

      {carregando && <ActivityIndicator animating size="large" />}

      {!carregando && eventos.length === 0 && (
        <Text>Nenhum evento encontrado.</Text>
      )}

      {eventos.map((evento) => {
        // Decide badge e cor baseado no status
        const corBadge = evento.status === 'confirmada' ? theme.colors.primary : theme.colors.outline;
        return (
          <Card key={evento.id} style={styles.card} mode="outlined">
            <Card.Content>
              <View style={styles.header}>
                <Text variant="titleMedium" style={styles.tituloEvento}>{evento.titulo}</Text>
                <Badge style={[styles.badge, { backgroundColor: corBadge }]}>
                  {evento.status}
                </Badge>
              </View>

              <View style={styles.info}>
                <MaterialCommunityIcons name="calendar" size={16} color="#000" />
                <Text variant="bodyMedium" style={styles.infoText}>
                  Data: {evento.data ? format(new Date(evento.data), 'dd/MM/yyyy') : 'Não informado'}
                </Text>
              </View>

              <View style={styles.info}>
                <MaterialCommunityIcons name="map-marker" size={16} color="#000" />
                <Text variant="bodyMedium" style={styles.infoText}>
                  Local: {evento.local || 'Não informado'}
                </Text>
              </View>
            </Card.Content>
          </Card>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  titulo: { marginBottom: 16, textAlign: 'center' },
  card: {
    marginBottom: 12,
  },
  tituloEvento: {
    color: '#1C9B5E',
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  infoText: {
    marginLeft: 6,
    fontSize: 14,
  },
  badge: {
    alignSelf: 'center',
  },
});

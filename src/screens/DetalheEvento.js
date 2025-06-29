import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View, Alert } from 'react-native';
import { Text, Card, Badge, Divider, Button, useTheme, TextInput } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';
import { useUsuario } from '../contexto/UsuarioContexto';
import { supabase } from '../config/supabase';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import GaleriaImagensEvento from '../componentes/galeriaImagensEvento';

export default function DetalheEvento({ route }) {
  const { id, titulo, data, local, inscricao, descricao, foto_url } = route.params;
  const theme = useTheme();
  const navigation = useNavigation();
  const { perfil, eventosInscritos, atualizarEventosInscritos } = useUsuario();

  const [comentarios, setComentarios] = useState([]);
  const [novoComentario, setNovoComentario] = useState('');
  const [imagens, setImagens] = useState([]);
  const [curtido, setCurtido] = useState(false);
  const [totalCurtidas, setTotalCurtidas] = useState(0);
  const [mostrarImagens, setMostrarImagens] = useState(false);
  const [mostrarComentarios, setMostrarComentarios] = useState(false);

  const inscrito = eventosInscritos.find(e => e.evento_id === id);

  useEffect(() => {
    if (perfil?.id) {
      buscarCurtidas();
      buscarComentarios();
      buscarImagens();
    }
  }, [id, perfil?.id]);

  const buscarCurtidas = async () => {
    const { count } = await supabase
      .from('curtidas_evento')
      .select('*', { count: 'exact' })
      .eq('evento_id', id);

    setTotalCurtidas(count);

    const { data: minhaCurtida } = await supabase
      .from('curtidas_evento')
      .select('*')
      .eq('evento_id', id)
      .eq('usuario_id', perfil.id)
      .single();

    setCurtido(!!minhaCurtida);
  };

  const alternarCurtida = async () => {
    if (curtido) {
      await supabase
        .from('curtidas_evento')
        .delete()
        .eq('evento_id', id)
        .eq('usuario_id', perfil.id);
    } else {
      await supabase
        .from('curtidas_evento')
        .insert({ evento_id: id, usuario_id: perfil.id });
    }

    buscarCurtidas();
  };

  const buscarImagens = async () => {
    const { data, error } = await supabase
      .from('imagens_evento')
      .select('url')
      .eq('evento_id', id);

    if (!error) {
      setImagens(data.map(img => img.url));
    }
  };

  const buscarComentarios = async () => {
    const { data, error } = await supabase
      .from('comentarios_evento')
      .select(`id, comentario, created_at, usuario_id, usuarios ( nome )`)
      .eq('evento_id', id)
      .order('created_at', { ascending: false });

    if (!error) {
      setComentarios(data);
    } else {
      console.error('Erro ao buscar comentários:', error.message);
    }
  };

  const enviarComentario = async () => {
    if (!novoComentario.trim()) return;

    const { error } = await supabase
      .from('comentarios_evento')
      .insert({
        evento_id: id,
        usuario_id: perfil.id,
        comentario: novoComentario,
      });

    if (error) {
      Alert.alert('Erro', 'Não foi possível enviar o comentário.');
    } else {
      setNovoComentario('');
      buscarComentarios();
    }
  };

  console.log(perfil.email)

// Função corrigida para enviar e-mail via fetch diretamente
async function enviarEmailConfirmacao(email, tituloEvento, dataEvento) {
  console.log('Usu:', perfil)
  if (!email) {
    console.error('Email do usuário não definido');
    return;
  }

  try {
    const response = await fetch('https://dgbojihnuqfzjdhxiteu.supabase.co/functions/v1/email-inscricao', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: perfil.email,
        subject: `Confirmação de inscrição no evento: ${tituloEvento}`,
        html: `<p>Você está inscrito no evento <strong>${tituloEvento}</strong> que acontecerá em ${new Date(dataEvento).toLocaleDateString()}.</p>`,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }

    const data = await response.json();
    console.log('Email enviado:', data);
  } catch (error) {
    console.error('Erro ao enviar email:', error);
  }
}





  // Estilo do badge de inscrição
  let corBadge = theme.colors.outline;
  let textoBadge = 'Encerradas';

  if (inscrito) {
    textoBadge = 'Inscrito';
    corBadge = theme.colors.tertiary || theme.colors.primary;
  } else if (inscricao) {
    textoBadge = 'Inscrições abertas';
    corBadge = theme.colors.primary;
  }

  const verImagens = () => {
    setMostrarImagens(!mostrarImagens);
  };

  const toggleComentarios = () => {
    setMostrarComentarios(!mostrarComentarios);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card mode="outlined" style={styles.card}>
        {foto_url && (
          <Card.Cover
            source={{ uri: foto_url }}
            style={{ height: 200, borderTopLeftRadius: 8, borderTopRightRadius: 8 }}
          />
        )}

        <Card.Content>
          <View style={styles.header}>
            <Text variant="titleMedium" style={styles.titulo}>{titulo}</Text>
            <Badge style={[styles.badge, { backgroundColor: corBadge }]}>
              {textoBadge}
            </Badge>
          </View>

          <Divider style={styles.divisor} />

          {/* Data e Local */}
          <View style={styles.info}>
            <MaterialCommunityIcons name="calendar" size={16} color="#000" />
            <Text variant="bodyMedium" style={styles.infoText}>Data: {format(new Date(data), 'dd/MM/yyyy')}</Text>
          </View>
          <View style={styles.info}>
            <MaterialCommunityIcons name="map-marker" size={16} color="#000" />
            <Text variant="bodyMedium" style={styles.infoText}>Local: {local}</Text>
          </View>

          <Divider style={styles.divisor} />

          {/* Descrição */}
          <Text variant="titleSmall" style={styles.subtitulo}>Descrição:</Text>
          <Text style={styles.descricao}>{descricao}</Text>

          <Divider style={styles.divisor} />

          <View style={styles.iconesContainer}>
            <MaterialCommunityIcons
              name="comment-processing-outline"
              size={16}
              color="#000"
              onPress={toggleComentarios}
            />
            <Text>{comentarios.length}</Text>

            <MaterialCommunityIcons
              name={curtido ? "cards-heart" : "cards-heart-outline"}
              size={16}
              color="#000"
              onPress={alternarCurtida}
            />
            <Text>{totalCurtidas}</Text>

            <MaterialCommunityIcons
              name="image-outline"
              size={16}
              color="#000"
              onPress={verImagens}
            />
            <Text>{imagens.length}</Text>
          </View>

          {/* Galeria de Imagens */}
          {mostrarImagens && (
            <View style={{ marginTop: 10 }}>
              <Text variant="titleMedium" style={{ marginBottom: 8 }}>Imagens do Evento</Text>
              <GaleriaImagensEvento eventoId={id} />
            </View>
          )}

          {/* Comentários */}
          {mostrarComentarios && (
            <View style={{ marginTop: 16 }}>
              <View style={styles.comentarioHeader}>
                <MaterialCommunityIcons name="comment-processing-outline" size={16} color='#000' />
                <Text variant="titleSmall">Comentários ({comentarios.length})</Text>
              </View>

              {comentarios.length === 0 ? (
                <Text style={{ fontStyle: 'italic' }}>Ainda não há comentários.</Text>
              ) : (
                comentarios.map(com => (
                  <View key={com.id} style={{ marginVertical: 6 }}>
                    <Text style={{ fontWeight: 'bold' }}>{com.usuarios?.nome ?? 'Usuário desconhecido'}:</Text>
                    <Text style={{ fontSize: 14 }}>{com.comentario}</Text>
                    <Text style={{ fontSize: 12, color: 'gray' }}>
                      {format(new Date(com.created_at), 'dd/MM/yyyy HH:mm')}
                    </Text>
                  </View>
                ))
              )}

              {perfil?.id && (
                <>
                  <TextInput
                    label="Escreva um comentário"
                    value={novoComentario}
                    onChangeText={setNovoComentario}
                    mode="outlined"
                    multiline
                    style={{ marginTop: 12 }}
                  />
                  <Button onPress={enviarComentario} mode="contained" style={{ marginTop: 8 }}>
                    Enviar
                  </Button>
                </>
              )}
            </View>
          )}
        </Card.Content>
      </Card>

      {/* Botões de inscrição */}
      {inscricao && !inscrito && (
        <Button
          mode="contained"
         onPress={async () => {
  const { error } = await supabase
    .from('eventos_inscricoes')
    .insert({
      evento_id: id,
      usuario_id: perfil.id,
      status: 'confirmada',
    });

  if (!error) {
    Alert.alert('Sucesso!', 'Você foi inscrito no evento.');
    atualizarEventosInscritos();

    // Enviar email
    enviarEmailConfirmacao(perfil.email, titulo, data);
  } else {
    Alert.alert('Erro', 'Não foi possível inscrever.');
    console.error('Erro ao inscrever:', error.message);
  }
}}

          style={styles.botao}
        >
          Inscrever-se
        </Button>
      )}

      {inscrito && (
        <Button
          onPress={async () => {
            const { error } = await supabase
              .from('eventos_inscricoes')
              .delete()
              .match({ usuario_id: perfil.id, evento_id: id });

            if (!error) {
              atualizarEventosInscritos();
              Alert.alert('Inscrição cancelada', 'Sua inscrição foi cancelada.');
            } else {
              console.error('Erro ao cancelar inscrição:', error.message);
              Alert.alert('Erro', 'Não foi possível cancelar a inscrição.');
            }
          }}
          style={styles.botao}
        >
          Cancelar Inscrição
        </Button>
      )}

      <Button
        mode="outlined"
        onPress={() => navigation.navigate('Eventos')}
        style={styles.botao}
      >
        Voltar
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  card: { marginBottom: 12 },
  titulo: { color: '#1C9B5E', flex: 1 },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  infoText: { marginLeft: 6, fontSize: 14 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  badge: {
    color: '#fff',
    paddingHorizontal: 10,
    fontSize: 12,
    height: 20,
    textAlignVertical: 'center',
    borderRadius: 20,
  },
  divisor: {
    marginVertical: 8,
  },
  subtitulo: {
    marginBottom: 6,
    fontWeight: 'bold',
  },
  descricao: {
    fontSize: 14,
    lineHeight: 20,
  },
  iconesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  botao: {
    marginTop: 12,
  },
  comentarioHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
});

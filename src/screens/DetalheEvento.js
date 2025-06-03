
import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, View, Alert } from 'react-native';
import { Text, Card, Badge, Divider, Button, useTheme } from 'react-native-paper';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';
import { useUsuario } from '../contexto/UsuarioContexto';
import { supabase } from '../config/supabase';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 


export default function DetalheEvento({ route }) {
  const { id, titulo, data, local, inscricao, descricao, vagas_disponiveis, total_vagas} = route.params;
  const theme = useTheme();
  const navigation = useNavigation();
  const { perfil, eventosInscritos, atualizarEventosInscritos } = useUsuario();
  const [carregando, setCarregando] = useState(false);

  // Atualiza ao focar
  useFocusEffect(
    useCallback(() => {
      if (perfil?.id) {
        atualizarEventosInscritos(perfil.id);
      }
    }, [perfil?.id])
  );

  const inscrito = eventosInscritos.find(e => e.evento_id === id);

  let corBadge = theme.colors.outline;
  let textoBadge = 'Encerradas';

  if (inscrito) {
    textoBadge = 'Inscrito';
    corBadge = theme.colors.tertiary || theme.colors.primary;
  } else if (inscricao === true) {
    textoBadge = 'Inscrições abertas';
    corBadge = theme.colors.primary;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card mode="outlined" style={styles.card}>
        <Card.Content>
          <View style={styles.header}>
              <Text variant="titleMedium" style={styles.titulo}>{titulo}</Text>
              <Badge style={[styles.badge, { backgroundColor: corBadge }]}>
                  {textoBadge}
              </Badge>
          </View>

          <Divider style={styles.divisor} />

          <View style={styles.info}>
              <MaterialCommunityIcons name="calendar" size={16} color="#000" />
              <Text variant="bodyMedium" style={styles.infoText}>Data: {format(data, 'dd/MM/yyyy')}</Text>
          </View>
          <View style={styles.info}>
              <MaterialCommunityIcons name="map-marker" size={16} color="#000" />
              <Text variant="bodyMedium" style={styles.infoText}>Local: {local}</Text>
          </View>
          
          <Divider style={styles.divisor} />

          <Text variant="titleSmall" style={styles.subtitulo}>Descrição:</Text>
          <Text style={styles.descricao}>{descricao}</Text>

          <Divider style={styles.divisor} />

          <View style={styles.iconesContainer}>
              <MaterialCommunityIcons name="comment-processing-outline" size={16} color='#000'style={styles.icone} />
              <MaterialCommunityIcons name="cards-heart-outline" size={16} color='#000' style={styles.icone} />
              <MaterialCommunityIcons name="image" size={16} color='#000' style={styles.icone} />
          </View>
        </Card.Content>
      </Card>

      {inscricao && !inscrito && (
        <Button
          mode="contained"
          onPress={() => navigation.navigate('InscricaoEvento', { evento_id: id })}
          style={styles.botao}
          disabled={carregando}
        >
          Inscrever-se
        </Button>
      )}

      {inscrito && (
        <Button
            onPress={async () => {
            const { data, error } = await supabase
                .from('eventos_inscricoes')
                .delete()
                .match({ usuario_id: perfil.id, evento_id: id });

            if (error) {
                console.log('Erro ao deletar:', error.message);
            } else {
                console.log('Registro deletado:', data);
                // Atualiza os eventos inscritos para refletir a mudança
                atualizarEventosInscritos();
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

    card: {
        marginBottom: 12,
    },
    titulo: {
        marginBottom: 10,
        color: '#1C9B5E',
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
    vagasText: {
        marginTop: 4, // Estilo para a nova linha de texto
        fontSize: 14,
        fontWeight: 'bold',
        color: '#000',
    },
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
    },
    
    divisor: { marginVertical: 12 },
    subtitulo: { marginBottom: 4 },
    descricao: { marginTop: 8, lineHeight: 20 },
    botao: { marginTop: 10 },

    botaoInscricao: {
        marginTop: 10,
    },

    iconesContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 8,
    gap: 16, // Se estiver usando React Native Paper ou versão nova do React Native
    // Caso não funcione, substitua por:
    // columnGap: 16,
},
icone: {
    // opcional: padding ou efeito ao toque
},

});
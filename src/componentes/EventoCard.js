import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text, Badge, useTheme, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import { format } from 'date-fns';
import { useUsuario } from '../contexto/UsuarioContexto';

export default function EventoCard({ id, titulo, data, local, inscricao, vagas_disponiveis, onPress }) {
    const theme = useTheme();
    const { eventosInscritos } = useUsuario();

    const inscrito = eventosInscritos.find(e => e.evento_id === id);

    let textoBadge = '';
    let corBadge = '';
    let mostrarBotaoInscricao = false;

    if (inscrito) {
        textoBadge = 'Inscrito';
        corBadge = theme.colors.tertiary || theme.colors.primary;
    } else if (vagas_disponiveis > 0 && inscricao) {
        corBadge = theme.colors.primary;
        textoBadge = 'Inscrições abertas';
        mostrarBotaoInscricao = true;
    } else {
        corBadge = theme.colors.outline;
        textoBadge = 'Encerradas';
    }

    return (
        <Card style={styles.card} mode="outlined" onPress={onPress}>
            <Card.Content>
                <View style={styles.header}>
                    <Text variant="titleMedium" style={styles.titulo}>{titulo}</Text>
                    <Badge style={[styles.badge, { backgroundColor: corBadge }]}>
                        {textoBadge}
                    </Badge>
                </View>
                <View style={styles.info}>
                    <MaterialCommunityIcons name="calendar" size={16} color="#000" />
                    <Text variant="bodyMedium" style={styles.infoText}>Data: {format(data, 'dd/MM/yyyy')}</Text>
                </View>
                <View style={styles.info}>
                    <MaterialCommunityIcons name="map-marker" size={16} color="#000" />
                    <Text variant="bodyMedium" style={styles.infoText}>Local: {local}</Text>
                </View>

                <View style={styles.iconesContainer}>
                    <MaterialCommunityIcons name="comment-processing-outline" size={16} color='#000'style={styles.icone} />
                    <MaterialCommunityIcons name="cards-heart-outline" size={16} color='#000' style={styles.icone} />
                    <MaterialCommunityIcons name="image" size={16} color='#000' style={styles.icone} />
                </View>
            </Card.Content>
        </Card>
    );
}

const styles = StyleSheet.create({
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
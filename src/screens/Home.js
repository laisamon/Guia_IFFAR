import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useUsuario } from '../contexto/UsuarioContexto'; 

export default function Home({ navigation }) {

    const { usuario, perfil, logout} = useUsuario(); 

    const sair = async () => {
        await logout();
        navigation.navigate('Login');
    }

    return (
        <LinearGradient colors={['#DFF5EB', '#FFFFFF']} style={styles.container}>
            <View style={styles.centered}>
                <Text style={styles.title}>Bem-vindo(a) {perfil?.nome || "visitante"}</Text>

                <Image
                    source={require('../../assets/marca_pb.png')}
                    style={styles.logo}
                />
                <Text style={styles.title}>Guia Acadêmico</Text>

                <Button
                    mode="contained"
                    onPress={() => navigation.navigate('Cursos')}
                    style={styles.botao}
                >
                    Ver Cursos
                </Button>

                <Button
                    mode="contained"
                    onPress={() => navigation.navigate('Eventos')}
                    style={styles.botao}
                >
                    Ver Eventos
                </Button>

                <Button
                    mode="outlined"
                    onPress={() => navigation.navigate('Sobre')}
                    style={styles.botao}
                >
                    Sobre o App
                </Button>

                {usuario && (
                    <Button 
                        mode="outlined"
                        onPress={sair}        
                        style={styles.botao}
                        >
                        Sair
                    </Button>   
                )}
                
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    logo: {
        width: 120,
        height: 120,
        marginBottom: 20,
        resizeMode: 'contain',
    },
    title: {
        fontSize: 22,
        marginBottom: 30,
        textAlign: 'center',
    },
    botao: {
        width: '100%',
        marginVertical: 8,
    },
});

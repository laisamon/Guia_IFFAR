import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { supabase } from '../config/supabase';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useUsuario } from '../contexto/UsuarioContexto'; 

export default function Login() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [carregando, setCarregando] = useState(false);

    const { setUsuario, setPerfil } = useUsuario(); 

    const navigation = useNavigation();

    const fazerLogin = async () => {
        setCarregando(true);

        const { data, error } = await supabase.auth.signInWithPassword({	
            email: email,
            password: senha,
        });

        if (error) {
            console.error('Erro no login:', error);
            Alert.alert('Erro', 'E-mail ou senha incorretos.');
            setCarregando(false);
            return;
        }

        const user = data.user;

        console.log(user);
        if (user) {
            // Verifica se o usuário já existe na tabela 'usuarios'
            const { data: perfilUsuario, error: erroUsuario } = await supabase
                .from('usuarios')
                .select('*')
                .eq('id', user.id)
                .single(); 

            if (erroUsuario ) {
                console.error('Erro ao buscar usuário:', erroUsuario);
                Alert.alert('Erro', 'Erro ao verificar cadastro de usuário.');
                setCarregando(false);
                return;
            }

            setUsuario(user);
            setPerfil(perfilUsuario);
            setCarregando(false);
            navigation.navigate('Home');
        }
    }

    return (
        <LinearGradient colors={['#DFF5EB', '#FFFFFF']} style={[styles.container, { flex: 1 }]}>
            <View style={styles.container}>
                <Text variant="titleLarge" style={{ marginBottom: 16 }}>Login</Text>

                <TextInput
                    label="E-mail"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={styles.input}
                    accessibilityLabel="Campo para inserir o e-mail"
                />
                <TextInput
                    label="Senha"
                    value={senha}
                    onChangeText={setSenha}
                    secureTextEntry
                    style={styles.input}
                    accessibilityLabel="Campo para inserir a senha"
                />

                <Button
                    mode="contained"
                    onPress={fazerLogin}
                    loading={carregando}
                    disabled={carregando}
                    style={styles.botao}
                >
                    Entrar
                </Button>

                <Button
                    onPress={() => !carregando && navigation.navigate('Cadastro')}
                    style={{ marginTop: 8 }}
                >
                    Ainda não tenho conta
                </Button>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: { padding: 24, flex: 1, justifyContent: 'center' },
    input: { marginBottom: 16 },
    botao: { marginTop: 16 },
});

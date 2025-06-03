import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { supabase } from '../config/supabase';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';


export default function Cadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);

  const navigation = useNavigation();

  const cadastrar = async () => {
    if (!email.trim() || !senha.trim() || !nome.trim()) {
      Alert.alert('Campos obrigatórios', 'Por favor, preencha todos os campos.');
      return;
    }

    setCarregando(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: senha,
  
      });

      if (error) {
        console.error('Erro no cadastro:', error);
        Alert.alert('Erro no cadastro', error.message);
        return;
      }

      Alert.alert(
        'Cadastro realizado!',
        'Enviamos um e-mail para você confirmar sua conta. Verifique sua caixa de entrada.',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );

    } catch (error) {
      console.error('Erro inesperado:', error);
      Alert.alert('Erro inesperado', 'Tente novamente mais tarde.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <LinearGradient colors={['#DFF5EB', '#FFFFFF']} style={[styles.container, { flex: 1 }]}>
    
      <View style={styles.container}>
        <Text variant="titleLarge" style={{ marginBottom: 16 }}>Criar Conta</Text>

        <TextInput
          label="Nome completo"
          value={nome}
          onChangeText={setNome}
          style={styles.input}
        />
        <TextInput
          label="E-mail"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />
        <TextInput
          label="Senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
          style={styles.input}
        />

        <Button mode="contained" onPress={cadastrar} loading={carregando}>
          Cadastrar
        </Button>

        <Button onPress={() => navigation.navigate('Login')} style={{ marginTop: 8 }}>
          Já tenho conta
        </Button>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, flex: 1, justifyContent: 'center' },
  input: { marginBottom: 16 },
});

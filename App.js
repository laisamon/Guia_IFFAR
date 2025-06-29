import React from 'react';
import { Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons, } from '@expo/vector-icons';
import { Provider as PaperProvider } from 'react-native-paper';

// importação de telas
import Home from './src/screens/Home';
import Cursos from './src/screens/Cursos';
import Eventos from './src/screens/Eventos';
import Sobre from './src/screens/Sobre';

import DetalheCurso from './src/screens/DetalheCurso';
import DetalheEvento from './src/screens/DetalheEvento';
import NovoEvento from './src/componentes/NovoEvento';

import NovoCurso from './src/componentes/NovoCurso';

import Login from './src/screens/Login';

import EditarPerfil from './src/screens/EditarPerfil';
import MeusEventos from './src/screens/MeusEventos';

import Cadastro from './src/screens/Cadastro';

// importação do tema
import { tema } from './src/config/tema';

// contexto de usuário
import { UsuarioProvider, useUsuario } from './src/contexto/UsuarioContexto';

// inscrições
import InscricaoEvento from './src/inscricoes/InscricaoEvento';

const Tab = createBottomTabNavigator();

function Navegacao() {
  const { perfil } = useUsuario();

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: true,
          tabBarActiveTintColor: tema.colors.primary,
        }}
      >
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="home" size={size} color={color} />
            ),
          }}
        />

        <Tab.Screen
          name="Cursos"
          component={Cursos}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="book-outline" size={size} color={color} />
            ),
          }}
        />

        <Tab.Screen
          name="Eventos"
          component={Eventos}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="calendar-month-outline" size={size} color={color} />
            ),
          }}
        />

        <Tab.Screen
          name="Sobre"
          component={Sobre}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="information-outline" size={size} color={color} />
            ),
          }}
        />

        <Tab.Screen
          name="Login"
          component={Login}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="account" size={size} color={color} />
            ),
          }}
        />

        <Tab.Screen
          name="Cadastro"
          component={Cadastro}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="account" size={size} color={color} />
            ),
          }}
        />

        <Tab.Screen
          name="Editar Perfil"
          component={EditarPerfil}
          options={{
            tabBarIcon: ({ color, size }) =>
              perfil?.foto_url ? (
                <Image
                  source={{ uri: perfil.foto_url }}
                  style={{
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    borderWidth: 1,
                    borderColor: color,
                  }}
                />
              ) : (
                <MaterialCommunityIcons name="account" size={size} color={color} />
              ),
          }}
        />

        <Tab.Screen
          name="Meus Eventos"
          component={MeusEventos}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="account" size={size} color={color} />
            ),
          }}
        />

        <Tab.Screen
          name="DetalheCurso"
          component={DetalheCurso}
          options={{ tabBarButton: () => null, tabBarStyle: { display: 'none' } }}
        />

        <Tab.Screen
          name="DetalheEvento"
          component={DetalheEvento}
          options={{ tabBarButton: () => null, tabBarStyle: { display: 'none' } }}
        />

        <Tab.Screen
          name="InscricaoEvento"
          component={InscricaoEvento}
          options={{ tabBarButton: () => null, tabBarStyle: { display: 'none' } }}
        />

        <Tab.Screen
          name="NovoEvento"
          component={NovoEvento}
          options={{
            tabBarButton: () => null,
            tabBarStyle: { display: 'none' },
            headerShown: true,
          }}
        />

        <Tab.Screen
          name="NovoCurso"
          component={NovoCurso}
          options={{
            headerShown: true,
            title: 'Novo Curso',
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <PaperProvider theme={tema}>
      <UsuarioProvider>
        <Navegacao />
      </UsuarioProvider>
    </PaperProvider>
  );
}

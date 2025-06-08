import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../config/supabase'; 

const UsuarioContext = createContext();

export const UsuarioProvider = ({ children }) => {
    const [usuario, setUsuario] = useState(null);
    const [perfil, setPerfil] = useState(null);
    const [eventosInscritos, setEventosInscritos] = useState([]);
    const [carregando, setCarregando] = useState(true);

    const logout = async () => {
        await supabase.auth.signOut();
        setUsuario(null);
        setPerfil(null);
    };

const atualizarEventosInscritos = async (usuarioId = perfil?.id) => {
  if (!usuarioId) {
    console.warn("Usuário ID não disponível para buscar eventos inscritos.");
    return;
  }

  const { data, error } = await supabase
    .from('eventos_inscricoes')
    .select('evento_id, status')
    .eq('usuario_id', usuarioId);

  if (!error) {
    setEventosInscritos(data);
  } else {
    console.error('Erro ao carregar eventos inscritos:', error.message);
  }
};


useEffect(() => {
  if (perfil?.id) {
    atualizarEventosInscritos(perfil.id);
  }
}, [perfil]);


// Atualiza inscrições quando o perfil muda

    return (
        <UsuarioContext.Provider 
            value={{ 
                usuario, 
                setUsuario,
                perfil,     
                setPerfil,
                carregando,
                setCarregando,
                logout,
                eventosInscritos, 
                setEventosInscritos,
                atualizarEventosInscritos
            }}>
            {children}
        </UsuarioContext.Provider>
    );
};

export const useUsuario = () => useContext(UsuarioContext);
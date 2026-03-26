import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { StyleSheet, Text, TextInput, View, Button, TouchableOpacity, Alert, ActivityIndicator, FlatList } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from "@expo/vector-icons";

const Stack = createNativeStackNavigator();
const API_BASE = 'http://localhost:3001';

function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert('Atenção', 'Preencha email e senha');
      return;
    }
    navigation.navigate('ListaContatos', { updated: true });
    try {
       const res = await axios.get(`${API_BASE}/Cadastro`, {
         params: { email, senha },
       });
         if (res.data && res.data.length > 0) {
         navigation.navigate('ListaContatos', { updated: true });
       } else {
         Alert.alert('Erro', 'Usuário ou senha inválidos');
       }
     } catch (error) {
       Alert.alert('Erro', 'Não foi possível conectar ao servidor');
     }
  };

  return (
    <View style={styles.container}>
      <View style={styles.loginHeader}>
        <Ionicons name="person-circle" size={72} color="#4A7DFF" />
        <Text style={styles.title}>LOGIN</Text>
      </View>
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Senha" value={senha} onChangeText={setSenha} secureTextEntry />
      <View style={styles.buttonGroup}>
        <Button title="Entrar" onPress={handleLogin} />
      </View>
      <View style={styles.buttonGroup}>
        <Button title="Cadastre-se" onPress={() => navigation.navigate('CadastroUsuario')} />
      </View>
    </View>
  );
}

function ListaContatosScreen({ navigation, route }) {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchContatos = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/Contato`);
      setContacts(response.data);
    } catch (error) {
      Alert.alert('Erro', 'Falha ao buscar contatos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContatos();
  }, []);

  useEffect(() => {
    if (route?.params?.updated) {
      fetchContatos();
    }
  }, [route?.params?.updated]);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>LISTA DE CONTATOS</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('CadastroContato', { onSaved: () => fetchContatos() })}
        >
          <Ionicons name="add" size={28} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#4A7DFF" />
      ) : (
        <FlatList
          data={contacts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.contactItem}
              onPress={() => navigation.navigate('DetalheContato', { contact: item })}
            >
              <View style={styles.contactRow}>
                <Ionicons name="person-circle" size={30} color="#4A7DFF" style={{ marginRight: 10 }} />
                <View style={styles.contactInfo}>
                  <Text style={styles.contactName}>{item.nome}</Text>
                  <Text style={styles.contactText}>{item.email}</Text>
                  <Text style={styles.contactText}>{item.telefone}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={<Text>Nenhum contato cadastrado.</Text>}
        />
      )}
    </View>
  );
}

function CadastroUsuarioScreen({ navigation }) {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleSalvar = async () => {
    if (!nome || !cpf || !email || !senha) {
      Alert.alert('Atenção', 'Preencha todos os campos');
      return;
    }

    try {
      await axios.post(`${API_BASE}/Cadastro`, { nome, cpf, email, senha });
      Alert.alert('Sucesso', 'Usuário cadastrado com sucesso', [
        { text: 'OK', onPress: () => navigation.navigate('Login') },
      ]);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível cadastrar usuário');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.botao} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={28} color="#FFFFFF" />
      </TouchableOpacity>
      <Text style={styles.title}>CADASTRO DE USUÁRIOS</Text>
      <TextInput style={styles.input} placeholder="Nome" value={nome} onChangeText={setNome} />
      <TextInput style={styles.input} placeholder="CPF" value={cpf} onChangeText={setCpf} />
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Senha" value={senha} onChangeText={setSenha} secureTextEntry />
      <View style={styles.buttonGroup}>
        <Button title="Salvar" onPress={handleSalvar} />
      </View>
    </View>
  );
}

function CadastroContatoScreen({ navigation, route }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');

  const handleSalvar = async () => {
    if (!nome || !email || !telefone) {
      Alert.alert('Atenção', 'Preencha todos os campos');
      return;
    }

    try {
      await axios.post(`${API_BASE}/Contato`, { nome, email, telefone });
      Alert.alert('Sucesso', 'Contato cadastrado');
      if (route.params?.onSaved) {
        route.params.onSaved();
      }
      navigation.navigate('ListaContatos', { updated: true });
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível cadastrar contato');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.botao} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={28} color="#FFFFFF" />
      </TouchableOpacity>
      <Text style={styles.title}>CADASTRO DE CONTATO</Text>
      <TextInput style={styles.input} placeholder="Nome" value={nome} onChangeText={setNome} />
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Telefone" value={telefone} onChangeText={setTelefone} />
      <View style={styles.buttonGroup}>
        <Button title="Salvar" onPress={handleSalvar} />
      </View>
    </View>
  );
}

function DetalheContatoScreen({ navigation, route }) {
  const contact = route?.params?.contact;
  const [nome, setNome] = useState(contact?.nome ?? '');
  const [email, setEmail] = useState(contact?.email ?? '');
  const [telefone, setTelefone] = useState(contact?.telefone ?? '');

  const handleAlterar = async () => {
    if (!nome || !email || !telefone) {
      Alert.alert('Atenção', 'Preencha todos os campos');
      return;
    }

    try {
      await axios.put(`${API_BASE}/Contato/${contact.id}`, { nome, email, telefone });
      Alert.alert('Sucesso', 'Contato alterado');
      navigation.navigate('ListaContatos', { updated: true });
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível alterar contato');
    }
  };

  const handleExcluir = async () => {
    Alert.alert('Confirmar', 'Deseja excluir este contato?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await axios.delete(`${API_BASE}/Contato/${contact.id}`);
            Alert.alert('Sucesso', 'Contato excluído');
            navigation.navigate('ListaContatos', { updated: true });
          } catch (error) {
            Alert.alert('Erro', 'Não foi possível deletar contato');
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.botao} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={28} color="#FFFFFF" />
      </TouchableOpacity>
      <Text style={styles.title}>ALTERAÇÃO / EXCLUSÃO DE CONTATO</Text>
      <TextInput style={styles.input} placeholder="Nome" value={nome} onChangeText={setNome} />
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Telefone" value={telefone} onChangeText={setTelefone} />
      <View style={styles.buttonGroup}>
        <Button title="Alterar" onPress={handleAlterar} />
      </View>
      <View style={styles.buttonGroup}>
        <Button title="Excluir" color="#E53935" onPress={handleExcluir} />
      </View>
    </View>
  );
}

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{headerShown:false}}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="ListaContatos" component={ListaContatosScreen} />
        <Stack.Screen name="CadastroUsuario" component={CadastroUsuarioScreen} />
        <Stack.Screen name="CadastroContato" component={CadastroContatoScreen} />
        <Stack.Screen name="DetalheContato" component={DetalheContatoScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F5F7FA',
  },
  title: {
    fontSize: 22,
    marginBottom: 16,
    fontWeight: 'bold',
  },
  contactItem: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  contactName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  contactText: {
    fontSize: 14,
    color: '#666',
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactInfo: {
    flex: 1,
  },
  loginHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  headerRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#4A7DFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    height: 44,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 12,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#fff',
  },
  botao: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4A7DFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  buttonGroup: {
    width: '100%',
    marginBottom: 8,
  },
});

export default App;


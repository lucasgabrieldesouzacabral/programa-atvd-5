import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, Button, TouchableOpacity } from 'react-native';
import { NavigationContainer, useRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from "@expo/vector-icons";

const Stack = createNativeStackNavigator();


function LoginScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>LOGIN</Text>

      <TextInput style={styles.input} placeholder="login" />
      <TextInput style={styles.input} placeholder="senha" />

      <Button title="Login" onPress={() => navigation.navigate("ListaContatos")} />
      <Button title="Cadastre-se" onPress={() => navigation.navigate("CadastroUsuario")} />
    </View>
  );
}

function ListaContatosScreen({ navigation }) {
  const contacts = [
    { id: '1', name: 'Maria Silva', email: 'maria.silva@example.com', telefone: '(11) 99999-0001' },
    { id: '2', name: 'João Souza', email: 'joao.souza@example.com', telefone: '(11) 99999-0002' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>LISTA DE CONTATOS</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('CadastroContato')}
        >
          <Ionicons name="add" size={28} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {contacts.map((c) => (
        <TouchableOpacity
          key={c.id}
          style={styles.contactItem}
          onPress={() => navigation.navigate('DetalheContato', { contact: c })}
        >
          <Text style={styles.contactName}>{c.name}</Text>
          <Text style={styles.contactText}>{c.email}</Text>
          <Text style={styles.contactText}>{c.telefone}</Text>
        </TouchableOpacity>
      ))}

    </View>
  );
}

function CadastroUsuarioScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.botao} onPress={() => navigation.navigate("Login")}>
        <Ionicons name="arrow-back" size={28} color="#FFFFFF" />
      </TouchableOpacity>
      <Text style={styles.title}>CADASTRO DE USUÁRIOS</Text>

      <TextInput style={styles.input} placeholder="nome" />
      <TextInput style={styles.input} placeholder="cpf" />
      <TextInput style={styles.input} placeholder="email" />
      <TextInput style={styles.input} placeholder="senha" />

      <Button title="Salvar" onPress={() => navigation.navigate("Login")} />
    </View>
  );
}

function CadastroContatoScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.botao} onPress={() => navigation.navigate("ListaContatos")}>
        <Ionicons name="arrow-back" size={28} color="#FFFFFF" />
      </TouchableOpacity>
      <Text style={styles.title}>CADASTRO DE CONTATO</Text>

      <TextInput style={styles.input} placeholder="Nome" />
      <TextInput style={styles.input} placeholder="Email" />
      <TextInput style={styles.input} placeholder="Telefone" />

      <Button title="Salvar" onPress={() => navigation.navigate("ListaContatos")} />
    </View>
  );
}

function DetalheContatoScreen({ navigation, route }) {
  const contact = route?.params?.contact;
  const [nome, setNome] = useState(contact?.name ?? '');
  const [email, setEmail] = useState(contact?.email ?? '');
  const [telefone, setTelefone] = useState(contact?.telefone ?? '');

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.botao} onPress={() => navigation.navigate('ListaContatos')}>
        <Ionicons name="arrow-back" size={28} color="#FFFFFF" />
      </TouchableOpacity>
      <Text style={styles.title}>ALTERAÇÃO / EXCLUSÃO DE CONTATO</Text>

      <TextInput style={styles.input} placeholder="Nome" value={nome} onChangeText={setNome} />
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Telefone" value={telefone} onChangeText={setTelefone} />

      <Button title="Alterar" onPress={() => navigation.navigate('ListaContatos')} />
      <Button title="Excluir" onPress={() => navigation.navigate('ListaContatos')} />
    </View>
  );
}



function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen
          name="ListaContatos"
          component={ListaContatosScreen}
          options={{ title: 'Lista de Contatos' }}
        />
        <Stack.Screen
          name="CadastroUsuario"
          component={CadastroUsuarioScreen}
          options={{ title: 'Usuário' }}
        />
        <Stack.Screen
          name="CadastroContato"
          component={CadastroContatoScreen}
          options={{ title: 'Contato' }}
        />
        <Stack.Screen
          name="DetalheContato"
          component={DetalheContatoScreen}
          options={{ title: 'Contato' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 20,
    marginBottom: 16,
  },
  contactItem: {
    width: '90%',
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
  headerRow: {
    width: '90%',
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
    width: '80%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  botao: {
    width: 60,
    height: 60,
    borderRadius: 30, 
    backgroundColor: "#4A7DFF", 
    justifyContent: "center",
    alignItems: "center",

    
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,

    elevation: 6,
  },
});
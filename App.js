//@@ Configuração, dados e estado global (Context)
import 'react-native-gesture-handler';
import React, { createContext, useContext, useState } from 'react';
import {
  StyleSheet, Text, View, Image, FlatList, TouchableOpacity,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';

const Drawer = createDrawerNavigator();
const COR = '#EA1D2C';

const foto = (id) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=600&q=60`;
const dinheiro = (v) => `R$ ${v.toFixed(2).replace('.', ',')}`;

const CATEGORIAS = [
  { id: '1', nome: 'Lanches', emoji: '🍔' },
  { id: '2', nome: 'Pizza', emoji: '🍕' },
  { id: '3', nome: 'Japonesa', emoji: '🍣' },
  { id: '4', nome: 'Saudável', emoji: '🥗' },
  { id: '5', nome: 'Sobremesas', emoji: '🍦' },
];

const RESTAURANTES = [
  {
    id: '1', nome: 'Burger House', tipo: 'Lanches', nota: 4.8,
    tempo: '25-35 min', imagem: foto('photo-1568901346375-23c9450c58cd')
  },
  {
    id: '2', nome: 'Pizzaria Napoli', tipo: 'Pizza', nota: 4.6,
    tempo: '35-45 min', imagem: foto('photo-1513104890138-7c749659a591')
  },
  {
    id: '3', nome: 'Sushi Tokyo', tipo: 'Japonesa', nota: 4.9,
    tempo: '40-50 min', imagem: foto('photo-1579871494447-9811cf80d66c')
  },
  {
    id: '4', nome: 'Verde Vivo', tipo: 'Saudável', nota: 4.7,
    tempo: '20-30 min', imagem: foto('photo-1512621776951-a57141f2eefd')
  },
];

const PRODUTOS = [
  {
    id: 'p1', nome: 'X-Burger Duplo', preco: 28.9,
    descricao: 'Dois hambúrgueres, queijo cheddar, alface e molho especial.',
    imagem: foto('photo-1568901346375-23c9450c58cd')
  },
  {
    id: 'p2', nome: 'Batata Frita Grande', preco: 19.9,
    descricao: 'Porção crocante com sal e páprica.',
    imagem: foto('photo-1573080496219-bb080dd4f877')
  },
  {
    id: 'p3', nome: 'Pizza Margherita', preco: 42.0,
    descricao: 'Molho de tomate, mussarela, manjericão fresco.',
    imagem: foto('photo-1513104890138-7c749659a591')
  },
  {
    id: 'p4', nome: 'Combo Sushi 20 peças', preco: 54.9,
    descricao: 'Salmão, atum e uramaki variados.',
    imagem: foto('photo-1579871494447-9811cf80d66c')
  },
  {
    id: 'p5', nome: 'Salada Caesar', preco: 24.5,
    descricao: 'Alface americana, frango grelhado, croutons e parmesão.',
    imagem: foto('photo-1512621776951-a57141f2eefd')
  },
  {
    id: 'p6', nome: 'Sorvete Artesanal', preco: 14.9,
    descricao: 'Duas bolas com calda à escolha.',
    imagem: foto('photo-1563805042-7684c019e1cb')
  },
];

// Estado global: carrinho e pedidos compartilhados entre as telas
const AppContext = createContext();
const useApp = () => useContext(AppContext);

function AppProvider({ children }) {
  const [carrinho, setCarrinho] = useState([]);
  const [pedidos, setPedidos] = useState([
    {
      id: '1021', restaurante: 'Burger House', data: '15/10/2026',
      total: 48.8, status: 'Entregue'
    },
    {
      id: '1017', restaurante: 'Sushi Tokyo', data: '09/10/2026',
      total: 54.9, status: 'Entregue'
    },
  ]);

  const adicionar = (produto) => {
    setCarrinho((atual) => {
      const existe = atual.find((i) => i.id === produto.id);
      if (existe) {
        return atual.map((i) =>
          i.id === produto.id ? { ...i, qtd: i.qtd + 1 } : i
        );
      }
      return [...atual, { ...produto, qtd: 1 }];
    });
  };

  const alterarQtd = (id, delta) => {
    setCarrinho((atual) =>
      atual
        .map((i) => (i.id === id ? { ...i, qtd: i.qtd + delta } : i))
        .filter((i) => i.qtd > 0)
    );
  };

  const total = carrinho.reduce((soma, i) => soma + i.preco * i.qtd, 0);

  const finalizar = () => {
    if (carrinho.length === 0) return false;
    const novo = {
      id: String(Date.now()).slice(-4),
      restaurante: 'FoodGo Express',
      data: new Date().toLocaleDateString('pt-BR'),
      total,
      status: 'Em preparo',
    };
    setPedidos((atual) => [novo, ...atual]);
    setCarrinho([]);
    return true;
  };

  return (
    <AppContext.Provider
      value={{ carrinho, pedidos, total, adicionar, alterarQtd, finalizar }}
    >
      {children}
    </AppContext.Provider>
  );
}

//@@ Tela 1 - Início (Home)
function HomeScreen({ navigation }) {
  const cabecalho = (
    <View>
      <Image
        source={{ uri: foto('photo-1504674900247-0877df9cc836') }}
        style={styles.banner}
      />
      <Text style={styles.titulo}>O que você quer comer hoje?</Text>
      <FlatList
        data={CATEGORIAS}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 12 }}
        renderItem={({ item }) => (
          <View style={styles.categoria}>
            <Text style={styles.categoriaEmoji}>{item.emoji}</Text>
            <Text style={styles.categoriaNome}>{item.nome}</Text>
          </View>
        )}
      />
      <Text style={styles.subtitulo}>Restaurantes perto de você</Text>
    </View>
  );

  return (
    <FlatList
      style={styles.tela}
      data={RESTAURANTES}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={cabecalho}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.cardRest}
          onPress={() => navigation.navigate('Cardapio')}
        >
          <Image source={{ uri: item.imagem }} style={styles.cardRestImg} />
          <View style={styles.cardRestInfo}>
            <Text style={styles.cardNome}>{item.nome}</Text>
            <Text style={styles.cardTexto}>
              {item.tipo} • ⭐ {item.nota}
            </Text>
            <Text style={styles.cardTexto}>🕒 {item.tempo}</Text>
          </View>
        </TouchableOpacity>
      )}
    />
  );
}

//@@ Tela 2 - Cardápio
function CardapioScreen() {
  const { adicionar } = useApp();

  return (
    <FlatList
      style={styles.tela}
      contentContainerStyle={{ padding: 16 }}
      data={PRODUTOS}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.produto}>
          <Image source={{ uri: item.imagem }} style={styles.produtoImg} />
          <View style={{ flex: 1 }}>
            <Text style={styles.cardNome}>{item.nome}</Text>
            <Text style={styles.cardTexto} numberOfLines={2}>
              {item.descricao}
            </Text>
            <View style={styles.linhaPreco}>
              <Text style={styles.preco}>{dinheiro(item.preco)}</Text>
              <TouchableOpacity
                style={styles.botaoPequeno}
                onPress={() => adicionar(item)}
              >
                <Text style={styles.botaoTexto}>+ Adicionar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    />
  );
}

//@@ Tela 3 - Carrinho
function CarrinhoScreen({ navigation }) {
  const { carrinho, total, alterarQtd, finalizar } = useApp();

  return (
    <View style={styles.tela}>
      <FlatList
        data={carrinho}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, flexGrow: 1 }}
        ListEmptyComponent={
          <View style={styles.vazio}>
            <Text style={styles.vazioEmoji}>🛒</Text>
            <Text style={styles.vazioTexto}>Seu carrinho está vazio</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.produto}>
            <Image source={{ uri: item.imagem }} style={styles.itemImg} />
            <View style={{ flex: 1 }}>
              <Text style={styles.cardNome}>{item.nome}</Text>
              <Text style={styles.preco}>
                {dinheiro(item.preco * item.qtd)}
              </Text>
            </View>
            <View style={styles.qtdBox}>
              <TouchableOpacity
                style={styles.qtdBotao}
                onPress={() => alterarQtd(item.id, -1)}
              >
                <Text style={styles.qtdBotaoTexto}>−</Text>
              </TouchableOpacity>
              <Text style={styles.qtdNumero}>{item.qtd}</Text>
              <TouchableOpacity
                style={styles.qtdBotao}
                onPress={() => alterarQtd(item.id, 1)}
              >
                <Text style={styles.qtdBotaoTexto}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <View style={styles.rodape}>
        <Text style={styles.total}>Total: {dinheiro(total)}</Text>
        <TouchableOpacity
          style={styles.botao}
          onPress={() => {
            if (finalizar()) navigation.navigate('Pedidos');
          }}
        >
          <Text style={styles.botaoTexto}>Finalizar Pedido</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

//@@ Tela 4 - Meus Pedidos
function PedidosScreen() {
  const { pedidos } = useApp();

  return (
    <FlatList
      style={styles.tela}
      contentContainerStyle={{ padding: 16 }}
      data={pedidos}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.pedido}>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardNome}>{item.restaurante}</Text>
            <Text style={styles.cardTexto}>
              Pedido #{item.id} • {item.data}
            </Text>
            <Text style={styles.preco}>{dinheiro(item.total)}</Text>
          </View>
          <Text
            style={[
              styles.status,
              item.status === 'Entregue' ? styles.statusOk : styles.statusAndamento,
            ]}
          >
            {item.status}
          </Text>
        </View>
      )}
    />
  );
}

//@@ Tela 5 - Meu Perfil
function PerfilScreen() {
  const { pedidos } = useApp();
  const dados = [
    { id: '1', rotulo: 'E-mail', valor: 'aluno@email.com' },
    { id: '2', rotulo: 'Telefone', valor: '(11) 99999-0000' },
    { id: '3', rotulo: 'Endereço', valor: 'Rua das Flores, 123 - São Paulo' },
    { id: '4', rotulo: 'Pedidos feitos', valor: String(pedidos.length) },
  ];

  return (
    <View style={styles.tela}>
      <View style={styles.perfilTopo}>
        <Image
          source={{ uri: 'https://i.pravatar.cc/200?img=12' }}
          style={styles.avatar}
        />
        <Text style={styles.perfilNome}>Aluno Exemplo</Text>
        <Text style={styles.perfilSub}>Cliente FoodGo</Text>
      </View>
      <FlatList
        data={dados}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View style={styles.linhaPerfil}>
            <Text style={styles.perfilRotulo}>{item.rotulo}</Text>
            <Text style={styles.perfilValor}>{item.valor}</Text>
          </View>
        )}
      />
    </View>
  );
}

//@@ Menu Drawer e navegação (App)
function MenuLateral(props) {
  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.menuTopo}>
        <Image
          source={{ uri: foto('photo-1565299624946-b28f40a0ae38') }}
          style={styles.menuLogo}
        />
        <Text style={styles.menuTitulo}>FoodGo</Text>
        <Text style={styles.menuSub}>Peça e receba em casa</Text>
      </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

export default function App() {
  return (
    <AppProvider>
      <NavigationContainer>
        <Drawer.Navigator
          initialRouteName="Home"
          drawerContent={(props) => <MenuLateral {...props} />}
          screenOptions={{
            headerStyle: { backgroundColor: COR },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' },
            drawerActiveTintColor: COR,
            drawerStyle: { backgroundColor: '#fff', width: 270 },
          }}
        >
          <Drawer.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: 'Início', drawerLabel: '🏠  Início' }}
          />
          <Drawer.Screen
            name="Cardapio"
            component={CardapioScreen}
            options={{ title: 'Cardápio', drawerLabel: '🍽️  Cardápio' }}
          />
          <Drawer.Screen
            name="Carrinho"
            component={CarrinhoScreen}
            options={{ title: 'Carrinho', drawerLabel: '🛒  Carrinho' }}
          />
          <Drawer.Screen
            name="Pedidos"
            component={PedidosScreen}
            options={{ title: 'Meus Pedidos', drawerLabel: '📦  Meus Pedidos' }}
          />
          <Drawer.Screen
            name="Perfil"
            component={PerfilScreen}
            options={{ title: 'Meu Perfil', drawerLabel: '👤  Meu Perfil' }}
          />
        </Drawer.Navigator>
      </NavigationContainer>
    </AppProvider>
  );
}

//@@ Estilos
const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: '#f5f5f5' },
  titulo: { fontSize: 22, fontWeight: 'bold', color: '#333', margin: 16 },
  subtitulo: {
    fontSize: 18, fontWeight: 'bold', color: '#333',
    marginHorizontal: 16, marginTop: 20, marginBottom: 8,
  },
  banner: { width: '100%', height: 160 },

  categoria: {
    backgroundColor: '#fff', borderRadius: 12, padding: 12,
    marginHorizontal: 4, alignItems: 'center', width: 88, elevation: 2,
  },
  categoriaEmoji: { fontSize: 30 },
  categoriaNome: { fontSize: 12, color: '#333', marginTop: 4 },

  cardRest: {
    flexDirection: 'row', backgroundColor: '#fff', borderRadius: 12,
    marginHorizontal: 16, marginBottom: 12, overflow: 'hidden', elevation: 2,
  },
  cardRestImg: { width: 100, height: 100 },
  cardRestInfo: { flex: 1, padding: 12, justifyContent: 'center' },
  cardNome: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  cardTexto: { fontSize: 13, color: '#777', marginTop: 2 },

  produto: {
    flexDirection: 'row', backgroundColor: '#fff', borderRadius: 12,
    padding: 10, marginBottom: 12, alignItems: 'center', elevation: 2,
  },
  produtoImg: { width: 90, height: 90, borderRadius: 10, marginRight: 12 },
  itemImg: { width: 60, height: 60, borderRadius: 10, marginRight: 12 },
  linhaPreco: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginTop: 8,
  },
  preco: { fontSize: 15, fontWeight: 'bold', color: COR },

  botao: {
    backgroundColor: COR, borderRadius: 10, paddingVertical: 14,
    alignItems: 'center', marginTop: 10,
  },
  botaoPequeno: {
    backgroundColor: COR, borderRadius: 8,
    paddingVertical: 6, paddingHorizontal: 10,
  },
  botaoTexto: { color: '#fff', fontWeight: 'bold', fontSize: 14 },

  qtdBox: { flexDirection: 'row', alignItems: 'center' },
  qtdBotao: {
    width: 30, height: 30, borderRadius: 15, backgroundColor: '#eee',
    alignItems: 'center', justifyContent: 'center',
  },
  qtdBotaoTexto: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  qtdNumero: { marginHorizontal: 10, fontSize: 16, fontWeight: 'bold' },

  rodape: {
    backgroundColor: '#fff', padding: 16, borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  total: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  vazio: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  vazioEmoji: { fontSize: 60 },
  vazioTexto: { fontSize: 16, color: '#777', marginTop: 8 },

  pedido: {
    flexDirection: 'row', backgroundColor: '#fff', borderRadius: 12,
    padding: 14, marginBottom: 12, alignItems: 'center', elevation: 2,
  },
  status: {
    fontSize: 12, fontWeight: 'bold', paddingVertical: 4,
    paddingHorizontal: 10, borderRadius: 12, overflow: 'hidden',
  },
  statusOk: { backgroundColor: '#E0F5E4', color: '#1E8E3E' },
  statusAndamento: { backgroundColor: '#FFF1D6', color: '#B26A00' },

  perfilTopo: { backgroundColor: COR, alignItems: 'center', padding: 24 },
  avatar: {
    width: 100, height: 100, borderRadius: 50,
    borderWidth: 3, borderColor: '#fff',
  },
  perfilNome: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginTop: 10 },
  perfilSub: { fontSize: 13, color: '#ffd5d8' },
  linhaPerfil: {
    backgroundColor: '#fff', borderRadius: 10, padding: 14, marginBottom: 10,
  },
  perfilRotulo: { fontSize: 12, color: '#999' },
  perfilValor: { fontSize: 16, color: '#333', marginTop: 2 },

  menuTopo: { alignItems: 'center', padding: 20, backgroundColor: '#fafafa' },
  menuLogo: { width: 80, height: 80, borderRadius: 40 },
  menuTitulo: { fontSize: 22, fontWeight: 'bold', color: COR, marginTop: 8 },
  menuSub: { fontSize: 12, color: '#777' },
});
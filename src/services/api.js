import axios from 'axios'

const api = axios.create({
  baseURL: 'http://35.196.79.227:8000',
})

export async function getProdutos() {
  const response = await api.get('/products/user/228')
  
  const produtos = response.data.map(produto => ({
    ...produto,
    image_path: produto.image_path 
      ? `http://35.196.79.227:8000${produto.image_path}` 
      : '/placeholder-image.jpg'
  }))
  
  return produtos
}

export async function login(email, password) {
  const response = await api.post('/login', { email, password })
  const token = response.data.token
  if (token) {
    localStorage.setItem('token', token)
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }
  return response.data
}

export async function register(name, email, password) {
  const response = await api.post('/register', { name, email, password })
  return response.data
}

// informações do usuario
export async function getUsuario() {
  const response = await api.get('/users/me')
  return response.data
}

// ENDEREÇOS
export async function getEnderecos() {
  const response = await api.get('/addresses/')
  return response.data
}

export async function criarEndereco(endereco) {
  const response = await api.post('/addresses/', endereco)
  return response.data
}

export async function atualizarEndereco(id, endereco) {
  const response = await api.put(`/addresses/${id}`, endereco)
  return response.data
}

export async function deletarEndereco(id) {
  const response = await api.delete(`/addresses/${id}`)
  return response.data
}

export async function getEndereco(id) {
  const response = await api.get(`/addresses/${id}`)
  return response.data
}

export async function buscarProdutosAdmin228() {
  const response = await api.get('/products/user/228')
  return response.data
}

export async function getCategorias() {
  const response = await api.get('/categories/')
  return response.data
}

export async function getCategoriasPorUsuario228() {
  const response = await api.get('/categories/user/228')
  return response.data
}

// pega o carrinho do usuario
export async function getCarrinho() {
  const response = await api.get('/cart/')
  return response.data
}

// pega os itens do carrinho do usuario
export async function getItensCarrinho() {
  const response = await api.get('/cart/items')
  return response.data
}

// adiciona um item ao carrinho do usuario
export async function adicionarItemCarrinho(produtoId, quantidade, precoUnitario) {
  // adiciona um item ao carrinho do usuario
  const response = await api.post('/cart/items', {
    product_id: produtoId,
    quantity: quantidade,
    unit_price: precoUnitario
  })
  
  // atualiza o carrinho do usuario
  return response.data
}

export async function atualizarQuantidadeCarrinho(produtoId, quantidade) {
  const response = await api.put('/cart/items', {
    product_id: produtoId,
    quantity: quantidade
  })
  return response.data
}

export async function removerItemCarrinho(produtoId) {
  const response = await api.delete('/cart/items', {
    data: { product_id: produtoId }
  })
  return response.data
}

export async function limparCarrinho() {
  const response = await api.delete('/cart/clear')
  return response.data
}

export async function criarModerador(dados) {
  const response = await api.post('/users/create-moderator', dados)
  return response.data
}

const token = localStorage.getItem('token')
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

export default api
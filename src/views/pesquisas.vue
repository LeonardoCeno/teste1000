<template>

<Header></Header>

<div class="imagemdefundo" >
    <pracima :visivel="mostrarBotaoTopo"></pracima>
<div class="inputpesquisa" >
    <h2 v-if="isLancamentos">Lançamentos</h2>
    <h2 v-else-if="categoriaSelecionada"> {{ categoriaSelecionada.name }} </h2>
    <h2 v-else> <span v-if="!termoBusca" > Tudo </span> <span v-if="termoBusca">" Resultados para: {{ termoBusca }}"</span></h2>
    </div>

<div class="tudo" >
    <div class="filtros" >
        <div class="filtros-header" >
            <div class="header-cima" >
            <h2>Filtros</h2>
            <img src="../components/img/filtrero.webp" alt="">
            </div>
        <div class="botaoquelimpa">
            <span @click="algumFiltroAtivo && limparFiltros()" :style="`visibility: ${algumFiltroAtivo ? 'visible' : 'hidden'}; user-select: none; `" >Limpar filtros</span>
        </div>
        </div>
        <div class="filtro-botoes-separados">
            <div class="filtro-bloco">
                <button class="filtro-btn" @click="abertoPrecos = !abertoPrecos">
                    <p>Preços</p>
                    <img src="../components/img/setaprabaxo.png" alt=""
                        :style="{ transform: abertoPrecos ? 'rotate(180deg)' : 'rotate(0deg)' }">
                </button>
                <transition name="fade">
                    <div v-if="abertoPrecos" class="filtro-conteudo">
                        <label><input type="radio" name="preco" value="ate20" v-model="precoSelecionado"> Até R$ 20</label><br>
                        <label><input type="radio" name="preco" value="20a50" v-model="precoSelecionado"> R$ 20 a R$ 50</label><br>
                        <label><input type="radio" name="preco" value="50a100" v-model="precoSelecionado"> R$ 50 a R$ 100</label><br>
                        <label><input type="radio" name="preco" value="100a200" v-model="precoSelecionado"> R$ 100 a R$ 200</label><br>
                        <label><input type="radio" name="preco" value="acima200" v-model="precoSelecionado"> Acima de R$ 200</label>
                    </div>
                </transition>
            </div>
            <div class="filtro-bloco" v-if=" !categoriaSelecionadaId">
                <button class="filtro-btn" @click="abertoCategoria = !abertoCategoria">
                    <p>Categoria</p>
                    <img src="../components/img/setaprabaxo.png" alt=""
                        :style="{ transform: abertoCategoria ? 'rotate(180deg)' : 'rotate(0deg)' }">
                </button>
                <transition name="fade">
                    <div v-if="abertoCategoria" class="filtro-conteudo">
                        <div v-for="cat in categorias" class="alinhando-categorias" :key="cat.id">
                            <label>
                                <input type="checkbox" v-model="categoriasSelecionadas[cat.id]"> <p> {{ cat.name }} </p>
                            </label>
                        </div>
                        <div>
                            <label v-if="!isLancamentos" >
                                <input type="checkbox" v-model="ordenarPorMaisRecentes"> Lançamentos
                            </label>
                        </div>
                    </div>
                </transition>
            </div>
            <div class="filtro-bloco">
                <button class="filtro-btn" @click="abertoFormato = !abertoFormato">
                    <p>Formato de capa</p>
                    <img src="../components/img/setaprabaxo.png" alt=""
                        :style="{ transform: abertoFormato ? 'rotate(180deg)' : 'rotate(0deg)' }">
                </button>
                <transition name="fade">
                    <div v-if="abertoFormato" class="filtro-conteudo">
                        <label><input type="checkbox"> Capa dura</label><br>
                        <label><input type="checkbox"> Capa comum</label>
                    </div>
                </transition>
            </div>
            <div class="filtro-bloco">
                <button class="filtro-btn" @click="abertoDescontos = !abertoDescontos">
                    <p>Descontos</p>
                    <img src="../components/img/setaprabaxo.png" alt=""
                        :style="{ transform: abertoDescontos ? 'rotate(180deg)' : 'rotate(0deg)' }">
                </button>
                <transition name="fade">
                    <div v-if="abertoDescontos" class="filtro-conteudo">
                        <label><input type="checkbox"> 10% ou mais</label><br>
                        <label><input type="checkbox"> 20% ou mais</label><br>
                        <label><input type="checkbox"> 30% ou mais</label><br>
                        <label><input type="checkbox"> 40% ou mais</label><br>
                        <label><input type="checkbox"> 50% ou mais</label>
                    </div>
                </transition>
            </div>
        </div>
    </div>
    <div class="conteudos" >
        <div class="Header-conteudos" >
            <div class="header-conteudos-left">
                <button ref="btn2" @click="toggleModo2" class="header-btn-quadrado"  ><img src="../components/img/img1111.png" alt=""></button>
                <button ref="btn1" @click="toggleModo" class="header-btn-quadrado" ><img src="../components/img/img2222.png" alt=""></button>
            </div>
            <div class="header-conteudos-right">
                <label for="filtroOrdem" class="header-label">Ordenar por:</label>
                <select id="filtroOrdem" v-model="ordemSelecionada" class="header-select">
                    <option value="Padrao">Padrão</option>
                    <option value="valor-crescente">Valor: menor para maior</option>
                    <option value="valor-decrescente">Valor: maior para menor</option>
                    <option value="alfabetica">Ordem alfabética</option>
                    <option value="Mais-recentes">Mais recentes</option>
                </select>
            </div>
        </div>
        <div class="tudo-conteudos">
            <div v-if="carregando" class="loading-container">
                <div class="loading-spinner"></div>
                <p>Carregando produtos...</p>
            </div>
            <div v-else-if="erro" class="erro">{{ erro }}</div>
            <div v-else-if="produtosFiltrados.length === 0" class="nenhum-produto">Nenhum produto encontrado.</div>
            <div v-else-if="!modoum" class="lista-pesquisa">
                <div class="produto" v-for="produto in produtosPaginados" :key="produto.id">
                    <div class="nome-preco-imagem" style="position:relative;">
                        <img :src="produto.image_path" alt="Imagem do produto" class="produto-imagem" />
                        <img :src="produto.stock >= 1 ? DISPONIVELREAL : INDISPONIVELREAL" :alt="produto.stock >= 1 ? 'Disponível' : 'Indisponível'" class="disponivel-selo" />
                        <h4>{{ produto.name }}</h4>
                        <p>R$ {{ produto.price }}</p>
                    </div>
                    <div class="add">
                        <button v-if="!produtoEstaNoCarrinho(produto.id)" @click="adicionarAoCarrinho(produto)">
                            <img src="../components/img/maisumcarrinho.png" alt="">
                            <p>Adicionar</p>
                        </button>
                        <button v-else @click="removerDoCarrinho(produto)" class="remover-btn">
                            <img src="../components/img/maisumcarrinho.png" alt="">
                            <p>Remover</p>
                        </button>
                        <img :src="produtoEstaNosFavoritos(produto.id) ? CORACAOFAV : CORACAOVAZIO" alt="" @click="toggleFavorito(produto.id)" style="cursor: pointer;" :class="{ 'coracao-favorito': produtoEstaNosFavoritos(produto.id) }">
                    </div>
                </div>
            </div>
            <div v-if="modoum" class="lista-pesquisa2">
                <div class="produto2" v-for="produto in produtosPaginados" :key="produto.id">
                    <div class="nome-preco-imagem2" style="position:relative;">
                        <img :src="produto.image_path" alt="Imagem do produto" class="produto-imagem" />
                        <img :src="produto.stock >= 1 ? DISPONIVELREAL : INDISPONIVELREAL" :alt="produto.stock >= 1 ? 'Disponível' : 'Indisponível'" class="disponivel-selo2" />
                        <div class="aolado" >
                        <h4>{{ produto.name }}</h4>
                        <p>R$ {{ produto.price }}</p>
                        <div class="add2" >
                        <button v-if="!produtoEstaNoCarrinho(produto.id)" @click="adicionarAoCarrinho(produto)">
                            <img src="../components/img/maisumcarrinho.png" alt="">
                            <p>Adicionar</p>
                        </button>
                        <button v-else @click="removerDoCarrinho(produto)" class="remover-btn">
                            <img src="../components/img/maisumcarrinho.png" alt="">
                            <p>Remover</p>
                        </button>
                        <img :src="produtoEstaNosFavoritos(produto.id) ? CORACAOFAV : CORACAOVAZIO" alt="" @click="toggleFavorito(produto.id)" style="cursor: pointer;" :class="{ 'coracao-favorito': produtoEstaNosFavoritos(produto.id) }">
                        </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Sistema de Paginação -->
            <div v-if="produtosFiltrados.length > 0" class="paginacao-container">
                <div class="paginacao-esquerda">
                    <div class="paginacao-numeros">
                        <button 
                            @click="paginaAnterior()"
                            class="paginacao-btn seta"
                            :disabled="paginaAtual <= 1"
                        >
                            &lt;
                        </button>
                        <button 
                            v-for="pagina in paginasVisiveis" 
                            :key="pagina"
                            @click="irParaPagina(pagina)"
                            :class="['paginacao-btn', { 'ativo': pagina === paginaAtual }]"
                        >
                            {{ pagina }}
                        </button>
                        <button 
                            @click="proximaPagina()"
                            class="paginacao-btn seta"
                            :disabled="paginaAtual >= totalPaginas"
                        >
                            &gt;
                        </button>
                    </div>
                </div>
                
                <div class="paginacao-direita">
                    <span>Mostrar</span>
                    <select v-model="itensPorPagina" @change="mudarItensPorPagina" class="paginacao-select">
                        <option value="12">12</option>
                        <option value="20">20</option>
                        <option value="24">24</option>
                        <option value="32">32</option>
                    </select>
                    <span>por página</span>
                    <span class="paginacao-info">
                        {{ (paginaAtual - 1) * itensPorPagina + 1 }}-{{ Math.min(paginaAtual * itensPorPagina, produtosFiltrados.length) }} de {{ produtosFiltrados.length }}
                    </span>
                </div>
            </div>
        </div>
    </div>
</div>
</div>
<Footer></Footer>

</template>

<script setup>
// muitas importações né?
import { ref, onMounted, watch, computed, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import Header from '../components/Headercomponent.vue'
import Footer from '../components/Footercomponent.vue'
import pracima from '../components/pracima.vue'
import api, { adicionarItemCarrinho, removerItemCarrinho, getItensCarrinho } from '../services/api'
import { useToast } from 'vue-toastification'
import DISPONIVELREAL from '../components/img/DISPONIVELREAL.png'
import INDISPONIVELREAL from '../components/img/INDISPONIVELREAL.png'
import CORACAOFAV from '../components/img/coraçaofav.png'
import CORACAOVAZIO from '../components/img/coraçaovazio.png'
import { getCategoriasPorUsuario228 } from '../services/api'

// muitas const, fazer oq
const abertoPrecos = ref(false)
const abertoCategoria = ref(false)
const abertoFormato = ref(false)
const abertoDescontos = ref(false)
const mostrarBotaoTopo = ref(false)
const ordemSelecionada = ref('Padrao')
const produtos = ref([])
const produtosFiltrados = ref([])
const carregando = ref(false)
const erro = ref('')
const toast = useToast()

// Paginação
const paginaAtual = ref(1)
const itensPorPagina = ref(20) // Padrão para modo grid (!modoum)

// Verificar se o usuário está logado
const isLoggedIn = computed(() => {
    const token = localStorage.getItem('token')
    return !!token && !!api.defaults.headers.common['Authorization']
})

// Carrinho
const itensCarrinho = ref([])

// Função para verificar se um produto está no carrinho
const produtoEstaNoCarrinho = (produtoId) => {
    return itensCarrinho.value.some(item => item.product_id === produtoId)
}

// Função para verificar se um produto está nos favoritos
const produtoEstaNosFavoritos = (produtoId) => {
    // Usar a variável reativa para forçar recálculo
    favoritosAtualizados.value
    
    const favoritosStorage = localStorage.getItem('favoritos')
    if (favoritosStorage) {
        const favoritosIds = JSON.parse(favoritosStorage)
        return favoritosIds.includes(produtoId)
    }
    return false
}

// Variável reativa para forçar atualização
const favoritosAtualizados = ref(0)

// Função para adicionar/remover dos favoritos
function toggleFavorito(produtoId) {
    const favoritosStorage = localStorage.getItem('favoritos')
    let favoritosIds = []
    
    if (favoritosStorage) {
        favoritosIds = JSON.parse(favoritosStorage)
    }
    
    if (produtoEstaNosFavoritos(produtoId)) {
        // Remover dos favoritos
        favoritosIds = favoritosIds.filter(id => id !== produtoId)
        toast.success('Produto removido dos favoritos!', { timeout: 3500 })
    } else {
        // Adicionar aos favoritos
        favoritosIds.push(produtoId)
        toast.success('Produto adicionado aos favoritos!', { timeout: 3500 })
    }
    
    localStorage.setItem('favoritos', JSON.stringify(favoritosIds))
    
    // Forçar atualização da interface
    favoritosAtualizados.value++
}

// Sistema de paginação completamente novo
const totalPaginas = computed(() => {
    const total = produtosFiltrados.value.length
    if (total === 0) return 0
    return Math.ceil(total / itensPorPagina.value)
})

const produtosPaginados = computed(() => {
    const produtos = produtosFiltrados.value
    if (produtos.length === 0) return []
    
    const inicio = (paginaAtual.value - 1) * itensPorPagina.value
    const fim = Math.min(inicio + itensPorPagina.value, produtos.length)
    
    return produtos.slice(inicio, fim)
})

const paginasVisiveis = computed(() => {
    const total = totalPaginas.value
    if (total === 0) return []
    
    const paginas = []
    
    // Se tem 10 páginas ou menos, mostra todas
    if (total <= 10) {
        for (let i = 1; i <= total; i++) {
            paginas.push(i)
        }
    } else {
        // Se tem mais de 10 páginas, mostra uma janela de 10 páginas
        let inicio = Math.max(1, paginaAtual.value - 4)
        let fim = Math.min(total, inicio + 9)
        
        // Ajusta se estamos no final
        if (fim === total) {
            inicio = Math.max(1, fim - 9)
        }
        
        for (let i = inicio; i <= fim; i++) {
            paginas.push(i)
        }
    }
    
    return paginas
})

// Função para obter quantidade de um produto no carrinho
const getQuantidadeNoCarrinho = (produtoId) => {
    const item = itensCarrinho.value.find(item => item.product_id === produtoId)
    return item ? item.quantity : 0
}
const route = useRoute()
const termoBusca = ref('')
const isLancamentos = ref(false)
const btn1 = ref(null)
const btn2 = ref(null)

const categoriaSelecionadaId = computed(() => Number(route.query.categoriaId) || null)

const categoriaSelecionada = computed(() => {
    if (categoriaSelecionadaId.value) {
        return categorias.value.find(cat => cat.id === categoriaSelecionadaId.value) || null
    }
    return null
})

const modoum = ref(false)
const ordenarPorMaisRecentes = ref(false)

const toggleModo = () => {
    modoum.value = true;
    btn1.value.style.filter = 'brightness(0.9)'
    btn2.value.style.filter = 'brightness(1.2)'
}
const toggleModo2 = () => {
    modoum.value = false;
    btn1.value.style.filter = 'brightness(1.2)'
    btn2.value.style.filter = 'brightness(0.9)'
}

onMounted(() => {
    if (modoum.value) {
        btn1.value.style.filter = 'brightness(0.9)'
        btn2.value.style.filter = 'brightness(1.2)'
    } else {
        btn1.value.style.filter = 'brightness(1.2)'
        btn2.value.style.filter = 'brightness(0.9)'
    }
})

// Estado reativo pro filtro de preço
const precoSelecionado = ref('')

// Estado reativo pras checkboxes
const categorias = ref([]) // lista de categorias da API
const categoriasSelecionadas = ref({}) // id boolean

// Computed para saber se tem filtro ligado
const algumFiltroAtivo = computed(() => {
    const algumaCategoria = Object.values(categoriasSelecionadas.value).some(v => v)
    const algumPreco = !!precoSelecionado.value
    // (pode adicionar outros filtros aqui 👍)
    return algumaCategoria || algumPreco
})

// Função para limpar todos os filtros
function limparFiltros() {
    // Limpa categorias
    for (const id in categoriasSelecionadas.value) {
        categoriasSelecionadas.value[id] = false
    }
    // Limpa preço
    precoSelecionado.value = ''
}

// função async que renderiza os produtos
async function buscarProdutos() {
    carregando.value = true
    erro.value = ''
    try {
        const response = await api.get('/products/user/228')
        produtos.value = response.data.map(produto => ({
            ...produto,
            image_path: produto.image_path && !produto.image_path.startsWith('http')
                ? 'http://35.196.79.227:8000' + produto.image_path
                : produto.image_path
        }))
        filtrarProdutos()
    } catch (e) {
        erro.value = 'Erro ao buscar produtos.'
    } finally {
        carregando.value = false
    }
}

// bagui que ordena os produtos, esse é o que fica mais na direita, em cima da lista dos produtos, achei daora fazer esse (pq foi facil 👍)
// detalhe: la em cima tem mais o "Padrao", não fiz um filtro pra ele pq né (o padrao é o padrao por si só)
function ordenarProdutos(lista) {
    if (ordenarPorMaisRecentes.value) {
        return lista.slice().sort((a, b) => b.id - a.id)
    } else if (ordemSelecionada.value === 'valor-crescente') {
        return lista.slice().sort((a, b) => Number(a.price) - Number(b.price))
    } else if (ordemSelecionada.value === 'valor-decrescente') {
        return lista.slice().sort((a, b) => Number(b.price) - Number(a.price))
    } else if (ordemSelecionada.value === 'alfabetica') {
        return lista.slice().sort((a, b) => a.name.localeCompare(b.name))
    } else if (ordemSelecionada.value === 'Mais-recentes') {
        return lista.slice().sort((a, b) => b.id - a.id)
    }
    return lista
}

// as categorias
async function buscarCategorias() {
    try {
        const data = await getCategoriasPorUsuario228()
        categorias.value = data
        // Inicializa o objeto de seleção
        categoriasSelecionadas.value = {}
        for (const cat of data) {
            categoriasSelecionadas.value[cat.id] = false
        }
    } catch (e) {
        // erro ao buscar categorias
    }
}

// como eu deixei claro no nome, filtra os produtos com base no que o usuario clicou no header
// junto tambem os filtros de preço etc
function filtrarProdutos() {
    isLancamentos.value = !!route.query.lancamentos
    let filtrados = produtos.value
    // Filtragem por categoria dinâmica
    const idsAtivos = Object.entries(categoriasSelecionadas.value)
        .filter(([id, ativo]) => ativo)
        .map(([id]) => Number(id))
    if (idsAtivos.length > 0) {
        filtrados = filtrados.filter(p => idsAtivos.includes(p.category_id))
    }
    // Filtragem por preço
    if (precoSelecionado.value) {
        filtrados = filtrados.filter(p => {
            const preco = Number(p.price)
            if (precoSelecionado.value === 'ate20') return preco <= 20
            if (precoSelecionado.value === '20a50') return preco > 20 && preco <= 50
            if (precoSelecionado.value === '50a100') return preco > 50 && preco <= 100
            if (precoSelecionado.value === '100a200') return preco > 100 && preco <= 200
            if (precoSelecionado.value === 'acima200') return preco > 200
            return true
        })
    }
    const termo = termoBusca.value.trim().toLowerCase()
    if (termo.length > 0) {
        filtrados = filtrados.filter(p => p.name && p.name.toLowerCase().includes(termo))
            .map(p => ({
                ...p,
                matchIndex: p.name.toLowerCase().indexOf(termo)
            }))
            .sort((a, b) => {
                if (a.matchIndex !== b.matchIndex) return a.matchIndex - b.matchIndex
                return a.name.length - b.name.length
            })
    }
    if (categoriaSelecionadaId.value) {
    filtrados = filtrados.filter(p => p.category_id == categoriaSelecionadaId.value)
    }
    
    // Aplica ordenação sem limite - a paginação cuidará do limite
    if (isLancamentos.value) {
        filtrados = filtrados.slice().sort((a, b) => b.id - a.id)
    }

    // aplica a ordenação dinâmica sem limite
    produtosFiltrados.value = ordenarProdutos(filtrados)
}

// busca os produtos da categoria da vez que foi selecionada pelo usuario
onMounted(async () => {
    termoBusca.value = route.query.termo ? String(route.query.termo) : ''
    isLancamentos.value = !!route.query.lancamentos
    await buscarCategorias()
    await buscarProdutos()
    
    // Carregar carrinho se usuário estiver logado
    if (isLoggedIn.value) {
        await carregarCarrinho()
    }
    
    // Adicionar listener para detectar quando o header dos filtros não está visível
    window.addEventListener('scroll', verificarVisibilidadeHeader)
})

// Watch q reage a mudanças na URL (termo, categoriaId, lancamentos etc)
watch(
    () => route.query,
    (query) => {
        termoBusca.value = query.termo ? String(query.termo) : ''
        isLancamentos.value = !!query.lancamentos
    // resetar filtros quando muda categoria ou lançamento
        precoSelecionado.value = ''
        ordemSelecionada.value = 'Padrao'
        filtrarProdutos()
    },
    { deep: true }
)

// Reage à mudança nas checkboxes q sao as categorias separadas
watch(categoriasSelecionadas, filtrarProdutos, { deep: true })

// Reage a mudanças de preço/ordem
watch([precoSelecionado, ordemSelecionada, ordenarPorMaisRecentes], filtrarProdutos)

// Função para carregar carrinho
async function carregarCarrinho() {
    if (!isLoggedIn.value) return
    
    try {
        const dadosCarrinho = await getItensCarrinho()
        itensCarrinho.value = dadosCarrinho.items || []
    } catch (error) {
        console.error('Erro ao carregar carrinho:', error)
        itensCarrinho.value = []
    }
}

// Função para adicionar produto ao carrinho
async function adicionarAoCarrinho(produto) {
    if (!isLoggedIn.value) {
        toast.error('Faça login para adicionar produtos ao carrinho.')
        return
    }
    
    if (produto.stock < 1) {
        toast.error('Produto indisponível no momento.')
        return
    }
    
    // Verificar se produto já está no carrinho
    if (produtoEstaNoCarrinho(produto.id)) {
        toast.error('Produto já está no carrinho.')
        return
    }
    
    try {
        // Primeiro, garantir que o carrinho existe
        try {
            await api.post('/cart/')
        } catch (cartError) {
            // Carrinho já existe
        }
        
        // Converter preço para número se for string
        const precoUnitario = typeof produto.price === 'string' ? parseFloat(produto.price) : produto.price
        
        await adicionarItemCarrinho(produto.id, 1, precoUnitario)
        toast.success('Produto adicionado ao carrinho!', { timeout: 3500 })
        await carregarCarrinho() // Recarregar carrinho
        
        // Notificar outros componentes sobre a mudança no carrinho
        window.dispatchEvent(new Event('carrinho-atualizado'))
    } catch (error) {
        console.error('Erro ao adicionar produto:', error)
        toast.error('Erro ao adicionar produto ao carrinho.')
    }
}

// Função para remover produto do carrinho
async function removerDoCarrinho(produto) {
    try {
        await removerItemCarrinho(produto.id)
        toast.success('Produto removido do carrinho!', { timeout: 3500 })
        await carregarCarrinho() // Recarregar carrinho
        
        // Notificar outros componentes sobre a mudança no carrinho
        window.dispatchEvent(new Event('carrinho-atualizado'))
    } catch (error) {
        console.error('Erro ao remover produto:', error)
        toast.error('Erro ao remover produto do carrinho.')
    }
}

// Funções de paginação simplificadas
function irParaPagina(pagina) {
    if (pagina >= 1 && pagina <= totalPaginas.value) {
        paginaAtual.value = pagina
        irParaTopo()
    }
}

function mudarItensPorPagina() {
    paginaAtual.value = 1
    irParaTopo()
}

function proximaPagina() {
    if (paginaAtual.value < totalPaginas.value) {
        paginaAtual.value++
        irParaTopo()
    }
}

function paginaAnterior() {
    if (paginaAtual.value > 1) {
        paginaAtual.value--
        irParaTopo()
    }
}

function irParaTopo() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Função para verificar se o header dos filtros está visível
function verificarVisibilidadeHeader() {
    const filtrosHeader = document.querySelector('.filtros-header')
    if (filtrosHeader) {
        const rect = filtrosHeader.getBoundingClientRect()
        // Se o header dos filtros não está visível (está acima da viewport)
        mostrarBotaoTopo.value = rect.bottom < 0
    }
}

// Limpar listener quando componente for desmontado
onUnmounted(() => {
    window.removeEventListener('scroll', verificarVisibilidadeHeader)
})

// Watchers simplificados
watch(produtosFiltrados, () => {
    paginaAtual.value = 1
})

watch(modoum, (novoModo) => {
    itensPorPagina.value = novoModo ? 12 : 20
    paginaAtual.value = 1
})

watch(totalPaginas, (novoTotal) => {
    if (paginaAtual.value > novoTotal && novoTotal > 0) {
        paginaAtual.value = novoTotal
    }
})

</script>

<style scoped>

.imagemdefundo {
    background: linear-gradient( to top, #dcdcdc49 0%, #ebebeb49 50%, #ffffff49 100% );
}

.aolado {
    width: 100%;
    padding: 10px;
    padding-left: 60px;
}

.aolado h4 {
    font-size: 30px;
    color: rgb(65, 65, 65);
    font-family: sans-serif;
}

.aolado p {
    font-size: 30px;
    font-weight: bold;
    font-family: sans-serif;
    color: #242424;
}

.add2 {
    display: flex;
    align-items: center;
    justify-content: start;
    gap: 10px;
    margin-top: 15px;
}

.nome-preco-imagem2 .aolado img {
    width: 27px;
    height: 27px;
    border: none;
    opacity: 0.92;
}

.nome-preco-imagem2 .aolado img:hover {
    opacity: 0.8;
}

/* Filtro para deixar o coração vermelho quando estiver nos favoritos (modo modoum) */
.nome-preco-imagem2 .aolado img.coracao-favorito {
    filter: invert(27%) sepia(51%) saturate(2878%) hue-rotate(346deg) brightness(104%) contrast(97%);
}

.nome-preco-imagem2 .aolado button {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgb(255, 255, 255);
    gap: 10px;
    padding: 7px;
    border-radius: 7px;
    width: 175px;
    height: 50px;
    filter: invert(1);
    opacity: 0.92;
}

.nome-preco-imagem2 .aolado button p {
    font-size: 19px;
    color: rgb(0, 0, 0);
}

.nome-preco-imagem2 .aolado button:hover {
    opacity: 0.8;
}

.lista-pesquisa2 {
    display: flex;
    justify-content: center;
    flex-direction: column;
    padding: 40px;
    padding-bottom: 10px;
    padding-left: 50px;
    position: relative;
    gap: 10px;
    width: 100%;
    background-color: #ffffff;
    border: 1px solid rgba(173, 173, 173, 0.507);
}

.produto2 {
    margin-bottom:40px;
    padding: 20px;
    border: 0.5px solid transparent;
    border-radius: 5px;
}

.produto2:hover {
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.116);
    border-color: rgba(0, 0, 0, 0.555);
}

.nome-preco-imagem2 {
    display: flex;
}

.nome-preco-imagem2 img {
    width: 270px;
    height: 290px;
    border: 1px solid rgba(173, 173, 173, 0.507);
    cursor: pointer;
}

.nome-preco-imagem2 .disponivel-selo2 {
    width: 160px;
    height: auto;
    border: none;
    position: absolute;
    left: 267px;
    bottom: 5px;
    z-index: 2;
    border-radius: 9px;
}

.botaoquelimpa span {
    color: #e11d48;
    cursor: pointer;
    text-decoration: underline;
    font-size: 1rem;
    font-weight: 500;
    margin-top: 2px;
}

.header-cima {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
}

.tudo{
    display: flex;
    justify-content: center;
    width: 100%;
    height: auto;
    min-height: 100vh;
    padding: 15px;
    gap: 20px;
}

.inputpesquisa{
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 15vh;
}

.inputpesquisa h2 {
    font-size: 3.5rem;
    font-family: roboto;
    font-weight: none;
    color: rgb(41, 41, 41);
}

.filtros {
    width: 290px;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.filtros-header {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    margin-bottom: 35px;
}

.filtros-header h2 {
    font-size: 2.4rem;
    font-family: Roboto;
}

.filtros-header img {
    width: 45px;
    height: auto;
}

.filtro-botoes-separados {
    display: flex;
    flex-direction: column;
    gap: 32px;
    width: 100%;
    align-items: center;
}

.filtro-bloco {
    width: 99%;
    border: 1px solid #a3a3a3;
    border-radius: 7px;
    padding: 7px;
    background-color: white;
}

.filtro-btn {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px;
    width: 270px;
    height: 50px;
    background-color: #060f18fa;
    border: none;
    border-radius: 7px;
    color: white;
    font-family: helvetica;
    font-size: 1.1rem;
    cursor: pointer;
    transition: background 0.2s;
}

.filtro-btn img {
    width: 20px;
    height: 17px;
    filter: invert(1);
}

.filtro-btn:hover {
    background: #1a2633;
}

.filtro-conteudo {
    width: 100%;
    color: #222;
    border-radius: 0 0 7px 7px;
    padding: 18px 18px 12px 18px;
    font-size: 1.08rem;
    z-index: 1;
    position: relative;
}

.filtro-conteudo input[type="checkbox"] {
    width: 22px;
    height: 22px;
    accent-color: #2961a1;
    border: 2.5px solid #222;
    border-radius: 4px;
    margin-right: 12px;
}

    label {
    display: flex;
    align-items: center;
}

.conteudos {
    width: 1100px;
    height: 100%;
    background-color: transparent;
    margin-bottom: 100px;
}

.Header-conteudos {
    width: 100%;
    height: 55px;
    background-color: #fffffffa;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 18px;
    box-sizing: border-box;
    border: 1px solid rgba(173, 173, 173, 0.507);
    border-bottom: none;
}

.header-conteudos-left {
    display: flex;
    align-items: center;
    gap: 0;
    margin: 35px;
}

.header-btn-quadrado {
    width: 50px;
    height: 44px;
    background: #fffffffa;
    color: #fff;
    border: none;
    font-size: 1.3rem;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}

.header-btn-quadrado:hover {
    filter: brightness(0.92);
}

.header-conteudos-right {
    display: flex;
    align-items: center;
    gap: 10px;
}

.header-label {
    color: #000000;
    font-size: 1rem;
    font-weight: 500;
}

.header-select {
    padding: 7px 12px 7px 12px;
    border-radius: 6px;
    border: 1px solid rgba(173, 173, 173, 0.507);
    font-size: 1rem;
    background: #eeeeee;
    color: #222;
    outline: none;
}

.tudo-conteudos {
    display: flex;
    flex-direction: column;
    width: 100%;
    align-items: center;
}

.lista-pesquisa {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    justify-items: center;
    padding: 4px;
    position: relative;
    gap: 10px;
    padding-bottom: 25px;
    width: 100%;
    border: 1px solid rgba(173, 173, 173, 0.507);
    background-color: #fffffffa;
}

.produto {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    text-align: center;
    width: 240px;
    height: 96%;
    margin-top: 3vh;
    padding-left: 10px;
    padding-right: 10px;
    border: 0.5px solid transparent;
    border-radius: 5px;
}

.nome-preco-imagem {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.nome-preco-imagem p {
    font-size: 22px;
    font-weight: bold;
    font-family: sans-serif;
    color: #222222;
}

.nome-preco-imagem img {
    margin-top: 10px;
    height: 268px;
    width: 187px;
    border: 0.1px solid rgb(212, 212, 212);
    filter: contrast(100%);
}

.nome-preco-imagem .disponivel-selo {
    width: 105px;
    height: auto;
    border: none;
    position: absolute;
    left: 0px;
    bottom: 80px;
    z-index: 2;
    border-radius: 9px;
}

.add {
    display: flex;
    flex-direction: row;
    width: 100%;
    align-items: center;
    justify-content: center;
    gap: 12px;
    opacity: 0;
    pointer-events: none;
    margin-top: 5px;
    margin-bottom: 10px;
    padding-bottom: 10px;
}
.add button {
    display: flex;
    align-items: center;
    background-color: #030a11f5;
    justify-content: center;
    padding: 8px;
    border-radius: 7px;
    gap: 7px;
    width: 150px;
}
.add button:hover {
    background-color: #02060ade;
}


.add button p {
    color: white;
}
.add button img {
    width: 20px;
    height: auto;
    border: none;
    filter: invert(1);
}
.add img {
    width: 27px;
    height: auto;
    filter: invert(6%) sepia(50%) saturate(200%) hue-rotate(160deg) brightness(100%) contrast(100%);
}
.add img:hover {
    opacity: 0.9;
}

.add img.coracao-favorito {
    filter: invert(27%) sepia(51%) saturate(2878%) hue-rotate(346deg) brightness(104%) contrast(97%);
}

.produto:hover .add {
    opacity: 1;
    pointer-events: auto;
}
.produto:hover {
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.116);
    border-color: rgba(0, 0, 0, 0.555);
}
.produto h4 {
    font-family: sans-serif;
    font-size: 15px;
    color: rgb(65, 65, 65);
    margin-top: 10px;
    height: 40px;
}
.nenhum-produto {
    color: #444;
    font-size: 1.25rem;
    font-weight: 500;
    margin-top: 32px;
    text-align: center;
    width: 100%;
}
.loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px;
    text-align: center;
}

.loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #3498db;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 15px;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.carregando {
    color: #3a9c73;
    margin-top: 20px;
    font-size: 1.1rem;
}
.erro {
    color: #c0392b;
    margin-top: 20px;
    font-size: 1.1rem;
}

@media (max-width: 1200px) {
    .lista-pesquisa {
        grid-template-columns: repeat(4, 1fr);
    }
}
@media (max-width: 950px) {
    .lista-pesquisa {
        grid-template-columns: repeat(3, 1fr);
    }
}
@media (max-width: 700px) {
    .lista-pesquisa {
        grid-template-columns: repeat(1, 1fr);
    }
}

/* Estilos da Paginação */
.paginacao-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
    background: none;
    border: none;
    width: 100%;
}

.paginacao-esquerda {
    display: flex;
    align-items: center;
}

.paginacao-numeros {
    display: flex;
    gap: 8px;
    align-items: center;
}

.paginacao-btn {
    padding: 8px 12px;
    border: 1px solid #dee2e6;
    color: #495057;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s;
    min-width: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fffffffa;
}

.paginacao-btn:hover {
    background: #e9ecef;
    border-color: #adb5bd;
}

.paginacao-btn.ativo {
    background: #02060af5;
    color: white;
    border-color: #02060af5;
}

.paginacao-btn.seta {
    font-weight: bold;
}

.paginacao-btn:disabled {
    cursor: not-allowed;
    background: #fff;
    color: #495057;
    border-color: #dee2e6;
}

.paginacao-btn:disabled:hover {
    background: #e9ecef;
    border-color: #adb5bd;
}





.paginacao-direita {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: #495057;
}

.paginacao-info {
    margin-left: 16px;
    color: #666;
    font-size: 12px;
}

.paginacao-select {
    padding: 6px 8px;
    border: 1px solid #dee2e6;
    border-radius: 4px;
    background: #fff;
    font-size: 14px;
    color: #495057;
    cursor: pointer;
}

.paginacao-select:focus {
    outline: none;
    border-color: #02060af5;
}

@media (max-width: 768px) {
    .paginacao-container {
        flex-direction: column;
        gap: 16px;
        padding: 16px;
    }
    
    .paginacao-numeros {
        gap: 4px;
    }
    
    .paginacao-btn {
        padding: 6px 10px;
        font-size: 12px;
        min-width: 32px;
    }
    
    .paginacao-direita {
        font-size: 12px;
    }
    
    .paginacao-select {
        padding: 4px 6px;
        font-size: 12px;
    }
}

</style>
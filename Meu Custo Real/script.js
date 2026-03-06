// ============================
// DADOS DOS PRODUTOS
// ============================

const produtos = [
  { nome: "Arroz", categoria: "Mercearia" },
  { nome: "Feijão", categoria: "Mercearia" },
  { nome: "Macarrão", categoria: "Mercearia" },
  { nome: "Óleo", categoria: "Mercearia" },
  { nome: "Farinha de Trigo", categoria: "Mercearia" },
  { nome: "Farinha de Rosca", categoria: "Mercearia" },
  { nome: "Açúcar", categoria: "Mercearia" },
  { nome: "Sal", categoria: "Mercearia" },
  { nome: "Farinha de Mandioca", categoria: "Mercearia" },

  { nome: "Banana", categoria: "Hortifruti" },
  { nome: "Maçã", categoria: "Hortifruti" },
  { nome: "Batata", categoria: "Hortifruti" },
  { nome: "Cebola", categoria: "Hortifruti" },
  { nome: "Alho", categoria: "Hortifruti" },
  { nome: "Tomate", categoria: "Hortifruti" },
  { nome: "Alface", categoria: "Hortifruti" },
  { nome: "Ovos", categoria: "Hortifruti" },

  { nome: "Presunto", categoria: "Frios" },
  { nome: "Mussarela", categoria: "Frios" },
  { nome: "Margarina", categoria: "Frios" },
  { nome: "Manteiga", categoria: "Frios" },
  { nome: "Leite", categoria: "Frios" },
  { nome: "Leite em Pó", categoria: "Frios" },

  { nome: "Água", categoria: "Liquidos" },
  { nome: "Cerveja", categoria: "Liquidos" },
  { nome: "Vinho", categoria: "Liquidos" },
  { nome: "Destilados", categoria: "Liquidos" },

  { nome: "Carne moida", categoria: "Açougue" },
  { nome: "Filé de frango", categoria: "Açougue" },
  { nome: "Coxa e Sobrecoxa", categoria: "Açougue" },
  { nome: "Coxão Duro", categoria: "Açougue" },
  { nome: "Picanha", categoria: "Açougue" },
  { nome: "Coxão Mole", categoria: "Açougue" },
  { nome: "Linguiça", categoria: "Açougue" },
  { nome: "Filé de Tilápia", categoria: "Açougue" },

  { nome: "Embalagem Aluminio P", categoria: "Embalagens" },
  { nome: "Embalagem Aluminio M", categoria: "Embalagens" },
  { nome: "Embalagem Aluminio G", categoria: "Embalagens" },
  { nome: "Embalagem Isopor P", categoria: "Embalagens" },
  { nome: "Embalagem Isopor M", categoria: "Embalagens" },
  { nome: "Embalagem Isopor G", categoria: "Embalagens" },
  { nome: "Embalagem Papelão P", categoria: "Embalagens" },
  { nome: "Embalagem Papelão M", categoria: "Embalagens" },
  { nome: "Embalagem Papelão G", categoria: "Embalagens" },
]

const categorias = [...new Set(produtos.map((p) => p.categoria))]

let cesta = []

// ============================
// RENDER CATEGORIAS
// ============================

function renderCategorias() {
  const menu = document.getElementById("menuCategorias")
  menu.innerHTML = ""

  categorias.forEach((cat) => {
    const btn = document.createElement("button")
    btn.textContent = cat

    btn.onclick = () => {
      renderProdutos(cat)
    }

    menu.appendChild(btn)
  })
}

// ============================
// RENDER PRODUTOS
// ============================

function renderProdutos(categoria) {
  const grid = document.getElementById("gridProdutos")
  grid.innerHTML = ""

  const filtrados = produtos.filter((p) => p.categoria === categoria)

  filtrados.forEach((produto) => {
    const card = document.createElement("div")
    card.className = "cardProduto"

    card.innerHTML = `

<img src="assets/images/${produto.nome}.png">

<h3>${produto.nome.replace("_", " ")}</h3>

<button onclick="abrirCalculadora('${produto.nome}')">
Calcular
</button>

`

    grid.appendChild(card)
  })
}

// ============================
// FUNÇÃO PARA REMOVER ACENTOS
// ============================
function removerAcentos(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
}

// ============================
// BUSCA DE PRODUTOS
// ============================
function buscarProduto() {
  const termo = removerAcentos(
    document.getElementById("busca").value.toLowerCase(),
  )

  const grid = document.getElementById("gridProdutos")
  grid.innerHTML = ""

  const filtrados = produtos.filter((p) =>
    removerAcentos(p.nome.toLowerCase()).includes(termo),
  )

  filtrados.forEach((produto) => {
    const card = document.createElement("div")
    card.className = "cardProduto"

    card.innerHTML = `
      <img src="assets/images/${produto.nome}.png">
      <h3>${produto.nome.replace("_", " ")}</h3>
      <button onclick="abrirCalculadora('${produto.nome}')">Calcular</button>
    `

    grid.appendChild(card)
  })
}

// ============================
// CALCULADORA
// ============================

let produtoAtual = ""

function abrirCalculadora(nome) {
  produtoAtual = nome

  document.getElementById("painelCalculadora").style.display = "block"

  document.getElementById("nomeProduto").textContent = nome.replace("_", " ")
  function fecharCalculadora() {
    document.getElementById("painelCalculadora").style.display = "none"
  }
}

// ============================
// MASCARA DINHEIRO
// ============================

function mascaraDinheiro(campo) {
  let v = campo.value.replace(/\D/g, "")

  v = (v / 100).toFixed(2) + ""

  v = v.replace(".", ",")

  campo.value = "R$ " + v
}

// ============================
// CALCULO
// ============================

function calcular() {
  let preco = document.getElementById("preco").value

  preco = preco.replace("R$", "").replace(",", ".").trim()

  preco = parseFloat(preco)

  const pesoComprado = converterParaBase(
    document.getElementById("pesoComprado").value,
  )

  const pesoUsado = converterParaBase(
    document.getElementById("pesoUsado").value,
  )

  if (!preco || !pesoComprado || !pesoUsado) {
    document.getElementById("resultado").textContent = "R$ 0.00"

    return 0
  }

  const precoPorGrama = preco / pesoComprado

  const custo = precoPorGrama * pesoUsado

  document.getElementById("resultado").textContent = "R$ " + custo.toFixed(2)

  return custo
}

// ============================
// ADICIONAR NA CESTA
// ============================

function adicionarCesta() {
  const custoBase = calcular() // pega o custo da calculadora

  // Pega os valores da cesta
  const margem = parseFloat(document.getElementById("margemLucro").value) || 0
  const taxa = parseFloat(document.getElementById("taxaPlataforma").value) || 0

  // Calcula custo final com margem e taxa
  const custoFinal =
    custoBase + custoBase * (margem / 100) + custoBase * (taxa / 100)

  cesta.push({
    produto: produtoAtual,
    custoBase: custoBase,
    margem: margem,
    taxaPlataforma: taxa,
    valor: custoFinal,
  })
  document
    .getElementById("margemLucro")
    .addEventListener("input", atualizarCesta)
  document
    .getElementById("taxaPlataforma")
    .addEventListener("input", atualizarCesta)

  renderCesta()
  limparCalculadora()
  fecharCalculadora()
}

// ============================
// RENDER CESTA
// ============================

function renderCesta() {
  const lista = document.getElementById("listaCesta")
  lista.innerHTML = ""

  let total = 0

  cesta.forEach((item, index) => {
    total += item.valor

    const div = document.createElement("div")

    div.innerHTML = `
      <strong>${item.produto}</strong> - R$ ${item.valor.toFixed(2)}
      <br>
      <small>Custo: R$ ${item.custoBase.toFixed(2)}, Margem: ${item.margem}%, Taxa: ${item.taxaPlataforma}%</small>
      <br>
      <button onclick="removerItem(${index})">🗑</button>
    `

    lista.appendChild(div)
  })

  document.getElementById("totalReceita").textContent = "R$ " + total.toFixed(2)
}

// ============================
// REMOVER ITEM
// ============================

function removerItem(index) {
  cesta.splice(index, 1)

  renderCesta()
}

function fecharCalculadora() {
  document.getElementById("painelCalculadora").style.display = "none"
}

function limparCalculadora() {
  document.getElementById("preco").value = ""
  document.getElementById("pesoComprado").value = ""
  document.getElementById("pesoUsado").value = ""

  document.getElementById("resultado").textContent = "R$ 0.00"
}

// ============================
// CONVERTER PESOS E MEDIDAS
// ============================

function converterParaBase(valor) {
  if (!valor) return 0

  valor = valor.toString().toLowerCase().trim()

  if (valor.includes("kg")) {
    return parseFloat(valor.replace("kg", "")) * 1000
  }

  if (valor.includes("g")) {
    return parseFloat(valor.replace("g", ""))
  }

  if (valor.includes("ml")) {
    return parseFloat(valor.replace("ml", ""))
  }

  if (valor.includes("l")) {
    return parseFloat(valor.replace("l", "")) * 1000
  }

  return parseFloat(valor)
}

// ============================
// INICIAR SISTEMA
// ============================

renderCategorias()
renderProdutos("Mercearia")

// ============================
// ATUALIZAR CESTA
// ============================

function atualizarCesta() {
  const margem = parseFloat(document.getElementById("margemLucro").value) || 0
  const taxa = parseFloat(document.getElementById("taxaPlataforma").value) || 0

  cesta.forEach((item) => {
    // Recalcula o valor final de cada item
    item.valor =
      item.custoBase +
      item.custoBase * (margem / 100) +
      item.custoBase * (taxa / 100)
    item.margem = margem
    item.taxaPlataforma = taxa
  })

  renderCesta()
}

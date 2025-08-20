// Funções assíncronas são funções que permitem esperar por resultados de operações que demoram,
// como buscar dados de uma API.
// Usamos `async` para definir que a função é assíncrona,
// e `await` para esperar pela resposta do `fetch`,
// que é uma função que busca dados de uma URL (neste caso, a PokéAPI).


// Uma API é uma interface que permite que programas se comuniquem entre si.
// A PokéAPI é uma API pública que fornece dados sobre Pokémon, como nome, tipo, habilidades, etc.


// Quando o usuário clicar no botão "Buscar Pokémon", a função buscarPokemon será chamada
// Função assíncrona para buscar dados do Pokémon digitado
async function buscarPokemon() {
  // Captura o valor digitado no input, e transforma em minúsculas para evitar erros de escrita
  const input = document.getElementById('pokemonInput').value.toLowerCase();
  // Monta a URL da PokéAPI com o nome ou número do Pokémon
  const url = `https://pokeapi.co/api/v2/pokemon/${input}`;


  // Tenta buscar os dados do Pokémon na PokéAPI
  // Se a busca falhar, o erro será capturado no bloco catch


  try {
    // Faz uma requisição à PokéAPI
    const resposta = await fetch(url);
    // Verifica se a resposta foi bem-sucedida (código 200 OK)
    if (!resposta.ok) {
      throw new Error('Pokémon não encontrado');
    }


    // Converte a resposta para JSON
    const dados = await resposta.json();


    // Tenta pegar o sprite animado da 5ª geração (Black & White)
    const spriteAnimado = dados.sprites.versions["generation-v"]["black-white"].animated.front_default;


    // Extrai e formata os dados principais
    const nome = dados.name.toUpperCase(); // Nome em letras maiúsculas
    const tipos = dados.types.map(t => t.type.name).join(', '); // Junta todos os tipos do Pokémon
    const altura = (dados.height / 10).toFixed(1) + " m"; // Altura em metros (API retorna em decímetros)
    const peso = (dados.weight / 10).toFixed(1) + " kg"; // Peso em kg (API retorna em hectogramas)
    const habilidades = dados.abilities.map(h => h.ability.name).join(', '); // Lista as habilidades


    // Atualiza o HTML com os dados obtidos
    document.getElementById('pokemonName').textContent = nome;
    document.getElementById('pokemonImage').src = spriteAnimado || dados.sprites.front_default; // Usa animado ou fallback
    document.getElementById('pokemonType').textContent = tipos;
    document.getElementById('pokemonHeight').textContent = altura;
    document.getElementById('pokemonWeight').textContent = peso;
    document.getElementById('pokemonAbilities').textContent = habilidades;


    // Pega a lista de stats no HTML e limpa o conteúdo anterior
    const statsList = document.getElementById('statsList');
    statsList.innerHTML = "";


    // Para cada stat (HP, ataque, etc.), cria um <li> e adiciona na lista
    dados.stats.forEach(stat => {
      const li = document.createElement('li');
      li.textContent = `${stat.stat.name.toUpperCase()}: ${stat.base_stat}`;
      statsList.appendChild(li);
    });


    // Exibe o card com os dados
    document.getElementById('pokemonCard').classList.remove('hidden');


  } catch (erro) {
    // Se houver erro (nome incorreto, por exemplo), mostra alerta e esconde o card
    alert(erro.message);
    document.getElementById('pokemonCard').classList.add('hidden');
  }
}


async function carregarGeracao() {
  const container = document.getElementById('pokemonContainer');
  container.innerHTML = "Carregando...";


  const geracao = document.getElementById('geracaoSelect').value;
  const url = `https://pokeapi.co/api/v2/generation/${geracao}`;


  try {
    const resposta = await fetch(url);
    const dados = await resposta.json();


    const listaDeNomes = dados.pokemon_species.map(p => p.name);
    listaDeNomes.sort(); // ordena os nomes em ordem alfabética


    container.innerHTML = "";


    for (const nome of listaDeNomes) {
      try {
        // Faz requisição ao endpoint /pokemon/{nome}
        const dadosPokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${nome}`).then(res => {
          if (!res.ok) throw new Error(`Erro ao carregar ${nome}`);
          return res.json();
        });


        const nomeFormatado = dadosPokemon.name.toUpperCase();
        const tipo = dadosPokemon.types.map(t => t.type.name).join(', ');


        // Prioriza sprite animado da geração V; usa padrão se não houver
        const sprite = dadosPokemon.sprites.versions["generation-v"]["black-white"].animated.front_default
                    || dadosPokemon.sprites.front_default;


        // Cria um card para exibir o Pokémon
        const card = document.createElement('div');
        card.classList.add('pokemon-card');
        card.innerHTML = `
          <h3>${nomeFormatado}</h3>
          <img src="${sprite}" alt="${nomeFormatado}">
          <p><strong>Tipo:</strong> ${tipo}</p>
        `;


        container.appendChild(card);
      } catch (erroInterno) {
        console.warn(`Erro ao carregar o Pokémon "${nome}":`, erroInterno.message);
      }
    }
  } catch (erro) {
    container.innerHTML = "Erro ao carregar geração.";
    console.error(erro);
  }
}


// Ao carregar a página, carrega a geração selecionada por padrão
window.addEventListener('DOMContentLoaded', carregarGeracao);

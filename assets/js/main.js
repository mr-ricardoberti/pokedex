const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')
const pokemonModal = document.getElementById('poke-details-modal');

const maxRecords = 151
const limit = 10
let offset = 0;

function closeModal() {
    const modal = document.getElementById('poke-details-modal');
    modal.setAttribute('style', 'display: none;');
}

function convertSinglePokemon(poke) {
    pokemon = pokeApi.convertPokeApiDetailedToPokemon(poke);
   
    return `
    <li class="pokemon ${pokemon.type}">
        <header id="poke-detail-header">
            <button class="btn-close-modal" onclick="closeModal()">&#x2190;</button>
            <h1 id="detail-title-modal">Detalhes</h1>
        </header>

        <span class="number">#${pokemon.number}</span>
        <span class="name">${pokemon.name}</span>

        <div class="details-modal">
            <ol class="types">
                ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
            </ol>

            <ol class="details">
                <li>Experience: ${pokemon.exp}</li>
                <li>Height: ${pokemon.height}</li>
                <li>Weight: ${pokemon.weight}</li>
            </ol>

            <img src="${pokemon.photo}"
                alt="${pokemon.name}">
        </div>
    </li>`;

}

function openModal(number) {
    const modal = document.getElementById('poke-details-modal');
    modal.setAttribute('style', 'display: visible;');

    pokeApi.getSinglePokemon(number).then((pokemon) => {
        const newModal = convertSinglePokemon(pokemon);
        pokemonModal.innerHTML = newModal;
    });

    location.href = '#home';
}

function convertPokemonToLi(pokemon) {
    return `
        <li onclick="openModal(${pokemon.number})" class="pokemon ${pokemon.type}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml
    })
}

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})
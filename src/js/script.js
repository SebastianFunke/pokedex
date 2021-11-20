let currentPokemon;
let allPokemons = {};
let pname;
let types = [];
let colors = [];
let offset = 0;
let limit = 30;
let adress;
let id;
let centerColor = 'grey'
let responseGroup = [];
let searchedPokemons = [];

function init() {
    loadAllPokemons();

    loadPokeGroup();
    console.log(responseGroup);
}

async function loadPokeGroup() {
    let url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
    offset += 20;
    let response = await fetch(url);
    responseGroup = await response.json();
    for (let i = 0; i < responseGroup['results'].length; i++) {
        loadPokemon(responseGroup['results'][i]['name']);

    }

}


async function loadAllPokemons() {
    let url = `https://pokeapi.co/api/v2/pokemon?limit=2000`;
    let response = await fetch(url);
    allPokemons = await response.json();
    console.log(allPokemons);

}

function searchPoke(val) {
    searchedPokemons = [];
    for (var i = 0; i < allPokemons['results'].length; i++) {
        if (allPokemons['results'][i]['name'].includes(val)) {
            console.log(allPokemons['results'][i]['name']);
            searchedPokemons.push(allPokemons['results'][i]['name']);

        }
        console.log(searchedPokemons);
    }
    document.getElementById('pokeList').innerHTML = '';
    for (let i = 0; i < searchedPokemons.length; i++) {
        if (i > 31) { break; }
        loadPokemon(searchedPokemons[i]);
    }

}

async function loadPokemon(name) {
    let url = `https://pokeapi.co/api/v2/pokemon/${name}`;
    let response = await fetch(url);
    currentPokemon = await response.json();
    pname = currentPokemon['name'];
    console.log(currentPokemon);
    types = [];
    colors = [];
    for (let i = 0; i < currentPokemon['types'].length; i++) {
        types.push(currentPokemon['types'][i]['type']['name']);
        colors.push(currentPokemon['types'][i]['type']['name']);
    }
    if (colors.length < 2) {
        colors.push(colors[0]);
        centerColor = colors[0];
    } else {
        centerColor = 'grey';
    }
    let adress = currentPokemon['sprites']['front_default'];
    id = currentPokemon['id'];
    document.getElementById('pokeList').innerHTML += getSnippet(pname, adress);
}


function getColorSnippet() {
    let returnString = '';
    //<p class="pokeType1" style="background-color: var(--${colors[i]});color: white;">${types[i]}</p>`
    for (let i = 0; i < types.length; i++) {
        returnString += `<p class="pokeType1" style="background-color: var(--${colors[i]});color: white;">${types[i]}</p>`
    }
    return returnString;
}

function loadPokedetails(pokename) {
    console.log(pokename);
}

function getSnippet(pokename, spriteAdress) {
    return `<div class="mb-3 col-xl-3 col-lg-4 col-md-6">
    <div class="pokecontainer" onclick="loadPokedetails('${pokename}')" style="background: linear-gradient(140deg, var(--${colors[0]}) 0%, var(--${colors[0]}) 40%,var(--${centerColor}) 50%,var(--${colors[1]}) 60%,var(--${colors[1]}) 100%);">
    <div class="m-1 pokeHead">
            <h3>#${id}<h3>
            <h2>${pokename}</h2>
        </div>
        <div class="pokeContainerLowerBox row ">
            <div class="m-0 p-0 pokeTypes col-4 ">` +
        getColorSnippet() +
        `
            </div>
            <div class="m-0 p-0 col-8 ">
                <img class="pokePic" src="${spriteAdress}" alt=" ">
            </div>
        </div>
    </div>
</div>`;
}
let currentPokemon;
let allPokemons = {};
let pname;
let types = [];
let colors = [];
let offset = 0;
let limit = 100;
let adress;

function init() {
    loadPokeGroup();
}

async function loadPokeGroup() {
    let url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
    offset += 20;
    let response = await fetch(url);
    responseGroup = await response.json();
    console.log(currentPokemon);
    for (let i = 0; i < responseGroup['results'].length; i++) {
        loadPokemon(responseGroup['results'][i]['name']);

    }

}


async function loadPokemon(name) {
    let url = `https://pokeapi.co/api/v2/pokemon/${name}`;
    let response = await fetch(url);
    currentPokemon = await response.json();
    console.log(currentPokemon);

    pname = currentPokemon['name'];
    types = [];
    colors = [];
    for (let i = 0; i < currentPokemon['types'].length; i++) {
        types.push(currentPokemon['types'][i]['type']['name']);
        colors.push(currentPokemon['types'][i]['type']['name']);
    }
    let adress = currentPokemon['sprites']['front_default'];
    console.log(pname);
    console.log(types);
    console.log(colors);
    console.log(getSnippet(pname, adress));

    document.getElementById('pokeList').innerHTML += getSnippet(pname, adress);
}


function getColorSnippet() {
    let returnString = '';
    console.log('return: ' + returnString);
    for (let i = 0; i < colors.length; i++) {
        returnString += `<p class="pokeType1" style="background-color: var(--${colors[i]});color: white;">${types[i]}</p>`
    }
    console.log('return: ' + returnString);
    return returnString;
}

function getSnippet(pokename, spriteAdress) {
    return `<div class="mb-3 col-xl-3 col-lg-4 col-md-6">
    <div class="pokecontainer" style="background-color: var(--${colors[0]});">
        <div class="m-1 ">
            <h2>${pokename}</h2>
        </div>
        <div class="pokeContainerLowerBox row ">
            <div class="m-0 p-0 pokeTypes col-4 ">` +
        getColorSnippet() +
        `
                
            </div>
            <div class="m-0 p-0 col-8 ">
                <img class="pokePic " src="${spriteAdress}" alt=" ">
            </div>
        </div>
    </div>
</div>`;
}
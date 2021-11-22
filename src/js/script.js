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


/**
 * function loaded at first
 */
async function init() {
    await loadAllPokemons();
    loadPokeGroup();
}


async function loadPokeGroup() {
    /*
    let url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
    offset += 20;
    let response = await fetch(url);
    responseGroup = await response.json();*/
    console.log(allPokemons);
    for (let i = 0; i < limit; i++) {
        loadPokemon(allPokemons['results'][offset + i]['name']);
        console.log(offset + i);
    }
    offset += limit;
}

function checkScrollEnd() {
    let bodyID = document.getElementById('pokeList');

    /*if (window.scrollY + document.documentElement.clientHeight >= document.documentElement.offsetHeight) {
        console.log('scrollend');
        window.scrollY -= 20;
        loadPokeGroup();



    }*/
}


async function loadAllPokemons() {
    let url = `https://pokeapi.co/api/v2/pokemon?limit=2000`;
    let response = await fetch(url);
    allPokemons = await response.json();
    console.log(allPokemons);
}

function searchPoke(val) {
    document.getElementById('pokeList').innerHTML = '';
    searchedPokemons = [];
    for (var i = 0; i < allPokemons['results'].length; i++) {
        if (allPokemons['results'][i]['name'].includes(val)) {
            searchedPokemons.push(allPokemons['results'][i]['name']);
        }
    }

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

async function loadPokedetails(pokename) {
    let url = `https://pokeapi.co/api/v2/pokemon/${pokename}`;
    let response = await fetch(url);
    currentPokemon = await response.json();
    let progressBars = document.getElementsByClassName('line');
    for (let i = 0; i < progressBars.length; i++) {
        progressBars[i].innerHTML = getBar(currentPokemon['stats'][i]['stat']['name'], currentPokemon['stats'][i]['base_stat'])
    }
    document.getElementById('detailImg').src = currentPokemon['sprites']['front_default'];
    document.getElementById('pokeId').innerText = '#' + currentPokemon['id'];
    document.getElementById('pokeName').innerText = currentPokemon['name'];
    document.getElementById('detailPokemon').classList.toggle('d-none');
    blurred();
}

function getBar(text, val) {
    let valPercent = val * 0.5;
    return `
    <p class="col-4">${text}</p>
    <div class="progress col-7">
        <div class="progress-bar" role="progressbar" style="width: ${valPercent}%; background-color: var(--${text});" aria-valuenow="25" aria-valuemin="0" aria-valuemax="200">${val}</div>
    </div>
    `
}


function blurred() {
    document.getElementById('navBar').classList.toggle('blurred');
    document.getElementById('pokeList').classList.toggle('blurred');
}

function detailEnd() {
    document.getElementById('detailPokemon').classList.toggle('d-none');
    blurred();

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
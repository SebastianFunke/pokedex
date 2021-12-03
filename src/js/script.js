let currentPokemon;
let allPokemons = {};
let pname;
let types = [];
let colors = [];
let offset = 0;
let limit = 20;
let adress;
let centerColor = 'grey'
let responseGroup = [];
let searchedPokemons = [];
let localPoke = 'detailPoke';
let searchedPokeLocal = 'searched';
let searchPos = 0;
/**
 * function loaded at first
 */
async function init() {
    await loadAllPokemons();
    if (loadArrayFromLocalStorage(searchedPokeLocal)) {
        searchPoke(loadArrayFromLocalStorage(searchedPokeLocal));
        document.getElementById('inputSearch').value = loadArrayFromLocalStorage(searchedPokeLocal);
    } else {
        loadPokeGroup();
    }

}

async function loadPokeGroup() {
    /*
    let url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
    offset += 20;
    let response = await fetch(url);
    responseGroup = await response.json();*/
    if (document.getElementById('inputSearch').value == '') {
        for (let i = 0; i < limit; i++) {
            loadPokemon(allPokemons['results'][offset + i]['name']);
        }
        offset += limit;
    } else {
        for (let i = 2; i < searchedPokemons.length - searchPos; i++) {
            console.log(searchPos);
            console.log(searchedPokemons.length - searchPos);
            if (i > 19) { break; }
            loadPokemon(searchedPokemons[searchPos]);
            searchPos++;
        }
    }
}

async function loadAllPokemons() {
    let url = `https://pokeapi.co/api/v2/pokemon?limit=2000`;
    let response = await fetch(url);
    allPokemons = await response.json();
}

async function searchPoke() {
    await new Promise(resolve => setTimeout(resolve, 100));
    let val = document.getElementById('inputSearch').value;
    console.log(val);
    searchPos = 0;
    offset = limit;
    saveArrayToLocalStorage(searchedPokeLocal, val)
    document.getElementById('pokeList').innerHTML = '';
    searchedPokemons = [];
    for (var i = 0; i < allPokemons['results'].length; i++) {
        if (allPokemons['results'][i]['name'].includes(val)) {
            searchedPokemons.push(allPokemons['results'][i]['name']);
        }
    }

    for (let i = 0; i < searchedPokemons.length; i++) {
        if (i > 19) { break; }
        loadPokemon(searchedPokemons[searchPos]);
        searchPos++;
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
    adress = getSprite();
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

function getSprite() {
    if (currentPokemon['sprites']['other']['home']['front_default']) {
        return adress = currentPokemon['sprites']['other']['home']['front_default'];
    } else {
        return adress = currentPokemon['sprites']['front_default'];
    }
}


async function loadPokedetails() {
    pokename = loadArrayFromLocalStorage(localPoke);
    let url = `https://pokeapi.co/api/v2/pokemon/${pokename}`;
    let response = await fetch(url);
    currentPokemon = await response.json();
    let progressBars = document.getElementsByClassName('line');
    for (let i = 0; i < progressBars.length; i++) {
        progressBars[i].innerHTML = getBar(currentPokemon['stats'][i]['stat']['name'], currentPokemon['stats'][i]['base_stat'])
    }
    document.getElementById('detailImg').src = getSprite();
    document.getElementById('pokeName').innerText = currentPokemon['name'];
    displayData(pokename);
    setTitle(currentPokemon['name']);
}

function getBar(text, val) {
    let valPercent = val * 0.5;
    return `
    <p class="col-3">${text}</p>
    <div class="progress col-8">
        <div class="progress-bar" role="progressbar" style="width: ${valPercent}%; background-color: var(--${text});" aria-valuenow="25" aria-valuemin="0" aria-valuemax="200">${val}</div>
    </div>
    `
}

async function displayData(pokename) {
    let url = `https://pokeapi.co/api/v2/pokemon/${pokename}`;
    let response = await fetch(url);
    currentPokemon = await response.json();
    for (let i = 0; i < currentPokemon['abilities'].length; i++) {
        document.getElementById('detailData').innerHTML += getDataAbility(currentPokemon['abilities'][i]['ability']['name']);
    }
    if (currentPokemon['types'].length > 1) {
        document.getElementById('detailTypes').innerHTML += `<h3>Typen:</h3>`
    } else {
        document.getElementById('detailTypes').innerHTML += `<h2>Typ:</h2>`
    }
    for (let i = 0; i < currentPokemon['types'].length; i++) {
        document.getElementById('detailTypes').innerHTML += getDataAbility(currentPokemon['types'][i]['type']['name']);
    }
}

function getDataAbility(ability) {
    return `
    <p class="abilityParagraph">${ability}</p>    
    `
}

function getDataTypes(type) {
    return `
    <p class="abilityParagraph">${type}</p>    
    `
}

function getSnippet(pokename, spriteAdress) {
    return `<div class="mb-3 col-xl-3 col-lg-4 col-md-6">
    <div class="pokecontainer" onclick="openDetailSite('${pokename}')" style="background: linear-gradient(140deg, var(--${colors[0]}) 0%, var(--${colors[0]}) 40%,var(--${centerColor}) 50%,var(--${colors[1]}) 60%,var(--${colors[1]}) 100%);">
    <div class="m-1 pokeHead">
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




function detailBg() {
    randomizePixel();
    setInterval(movePixel, 20);
    loadPokedetails();
    setTitle();
}

function setTitle(titleName) {
    document.title = titleName;
}

function movePixel() {
    let pixel = document.getElementsByClassName('pixel');
    for (let i = 0; i < pixel.length; i++) {
        pixel[i].style.left = (pixel[i].offsetLeft + (Math.random() * 5) - 2) + 'px';
        pixel[i].style.top = (pixel[i].offsetTop + Math.random() * 10) - 4 + 'px';
        let windowHeightReset = window.innerHeight - 170;
        let windowWidthReset = window.innerWidth - 170;
        if (pixel[i].offsetTop > windowHeightReset || pixel[i].offsetTop < 0 || pixel[i].offsetLeft > windowWidthReset || pixel[i].offsetLeft < 0) {
            pixel[i].style.top = windowHeightReset * Math.random() + 'px';
            pixel[i].style.left = (Math.random() * windowWidthReset) + 'px';
        }
    }
}

function randomizePixel() {
    let pixel = document.getElementsByClassName('pixel');
    for (let i = 0; i < pixel.length; i++) {
        pixel[i].style.top = (window.innerHeight * 0.8) * Math.random() + 'px';
        pixel[i].style.left = (window.innerWidth * 0.8) * Math.random() + 'px';
    }
}

function openDetailSite(inputPoke) {
    saveArrayToLocalStorage(localPoke, inputPoke);
    window.location.href = 'details.html';
}
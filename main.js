import {appendLines, El} from './utils.js';

const countriesBaseUrl = `https://restcountries.eu/rest/v2`;

const response = await axios.get(countriesBaseUrl + '/all');
const allCountriesData = response.data;
const alpha2Codes = allCountriesData.map(c => c.alpha2Code);
// console.log(`alpha2 codes: `, alpha2Codes);
// console.log(`all Countries: `, allCountriesData);
// console.log(`countries w/ multiple currencies: `, allCountriesData.filter( c => c.currencies.length > 1).map( c => [c.name, c.currencies] ) );

const searchContainer = document.getElementById('search-container');

const nameInput = El.input({id: 'country-input', type: 'text', placeholder: 'country name'});
searchContainer.appendChild(nameInput);

const searchButton = El.button({id: 'search-button'});
searchButton.innerText = 'Zoek';
searchContainer.appendChild(searchButton);

const flagNameEl = document.getElementById('flag-name');
const summaryEl = document.getElementById('summary');

appendLines(summaryEl, 'Hieronder komen de gegevens:');
getCountryByName();

setFocus();

searchButton.onclick = getCountryByName;
nameInput.onkeyup = keyHandler;
nameInput.onfocus = setFocus;
nameInput.onblur = setBlur;

async function getCountryData(url) {
    const response = await axios.get(url);
    const countryData = response.data[0];
    console.log(`countryData:`, countryData);
    return countryData;
}

function createFlagAndName(countryData) {
    const countryFlagEl = El.img({className: 'country-flag', src: countryData.flag, alt: 'national flag'});
    flagNameEl.appendChild(countryFlagEl);
    flagNameEl.appendChild(El.text(`${countryData.name}`));
}

function createSummary(countryData) {
    const {name, subregion, population, currencies, languages} = countryData;
    appendLines(summaryEl
        , `${name} is situated in ${subregion},`
        , `It has a population of ${new Intl.NumberFormat().format(population)} people,`
        , `and you can pay with ${nameListing(currencies)}.`
        , `They speak ${nameListing(languages)}.`);
}

function getUrl() {
    const name = nameInput.value;
    let url = countriesBaseUrl;
    if (name) {
        url += `/name/${name}`;
    } else {
        const randomIndex = Math.floor(alpha2Codes.length * Math.random());
        const code = alpha2Codes[randomIndex];
        url += `/alpha?codes=${code}`;
    }
    return url;
}

async function getCountryByName() {
    const url = getUrl();
    nameInput.value = '';
    try {
        const countryData = await getCountryData(url);
        clearOutput();
        createFlagAndName(countryData);
        createSummary(countryData);
    } catch (error) {
        console.error(error);
        clearOutput();
        createFlagAndName({flag: './assets/sad.png', name: 'No match!'})
    }
    setFocus();
}

function clearOutput() {
    summaryEl.innerHTML = '';
    flagNameEl.innerHTML = '';
}

function nameListing(array) {
    return listing(array.map(item => item.name).filter(name => name));
}

function listing(array) {
    if (array.length === 1) return array[0];
    return array.slice(0, -1).join(', ') + ' and ' + array.slice(-1);
}

function keyHandler(event) {
    if (event.key === 'Enter') {
        getCountryByName();
    }
}

function setFocus() {
    nameInput.focus();
    searchContainer.className = 'on-focus';
}

function setBlur() {
    searchContainer.className = 'on-blur';
}

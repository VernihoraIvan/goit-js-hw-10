import './css/styles.css';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries';

const debounce = require('lodash.debounce');
const DEBOUNCE_DELAY = 300;
const refs = {
  searchForm: document.querySelector('#search-box'),
  searchList: document.querySelector('.country-list'),
  searchInfo: document.querySelector('.country-info'),
};

refs.searchForm.addEventListener(
  'input',
  debounce(onSubmitInput, DEBOUNCE_DELAY)
);

function onSubmitInput(e) {
  e.preventDefault();
  if (e.target.value === '') {
    return;
  } else {
    fetchCountries(refs.searchForm.value.trim())
      .then(response => {
        if (response.length > 10) {
          removeHtml(refs.searchList);
          removeHtml(refs.searchInfo);
          Notiflix.Notify.failure(
            'Too many matches found. Please enter a more specific name.'
          );
        } else if (response.length === 1) {
          removeHtml(refs.searchList);
          createCountryInfo(response[0]);
        } else {
          removeHtml(refs.searchInfo);
          insertContent(response);
        }
      })
      .catch(error => {
        Notiflix.Notify.failure('Oops, there is no country with that name');
        clearHtml(refs.searchList);
        clearHtml(refs.searchInfo);
      });
  }
}

// let markup = '';

function createCountryInfo(item) {
  const languageList = Object.values(item.languages);
  return (refs.searchInfo.innerHTML = `
  <div class ='country-card'>
  <img class='country-img' src='${item.flags.svg}' alt = "flag of ${item.flags.alt}">
    <h2 class = 'country-name'>${item.name.official}</h2>
    </div>
    <p class = 'country-info'><span class = 'country-subtitle'>Capital:</span>${item.capital}</p>
    <p class = 'country-info'><span class = 'country-subtitle'>Population:</span>${item.population}</p>
    <p class = 'country-info'><span class = 'country-subtitle'>Languages:</span>${languageList}
    </p>`);
}

function countriesList(array) {
  return array.reduce((acc, item) => acc + createLi(item), '');
}

function createLi(item) {
  return `<li class = 'item'>
    <img class='item-img' src='${item.flags.svg}' alt = "flag of ${item.flags.alt}">
    <p class = 'item-descr'>${item.name.official}</p>
  </li>`;
}

function generateCountries(array) {
  return array.reduce((acc, item) => acc + createLi(item), '');
}

function insertContent(array) {
  const countryList = generateCountries(array);
  return (refs.searchList.innerHTML = countryList);
}

function removeHtml(el) {
  return (el.innerHTML = '');
}

import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const _ = require('lodash');
/* // Using _.debounce() method
// with its parameters
var debounce_fun = _.debounce(function () {
  console.log('Function debounced after 1000ms!');
  }, 1000);
  
debounce_fun();  */
const DEBOUNCE_DELAY = 300;

function fetchCountries(name) {
	return fetch('https://restcountries.com/v3.1/name/' + name + '?fields=name,capital,population,flags,languages')
		.then(response => {
			if (!response.ok) {
				throw new Error(response.status);
			}
			return response.json();
		})
}

const search = document.querySelector('#search-box')
const list = document.querySelector('.country-list')
const info = document.querySelector('.country-info')

search.addEventListener('input', _.debounce(searchQuery, DEBOUNCE_DELAY));

function searchQuery() {
	list.innerHTML = '';
	info.innerHTML = '';
	const name = search.value.trim()
	if (name) {
		fetchCountries(name)
			.then(response => {
				if (response.length > 10) {
					Notify.info('Too many matches found. Please enter a more specific name.')
				} else if (response.length > 1) {
					list.insertAdjacentHTML('beforeend', response.map(el => `<li     class="list-item">
					<img class="flag" src="${el.flags.svg}" alt="${el.name.official}">
					<p>${el.name.official}</p>
					</li>`).join(''));
				} else {
					info.insertAdjacentHTML('beforeend', `<ul class="info-list">
					<li class="list-item">
						<img class="flag" src="${response[0].flags.svg}" alt="${response[0].name.official}">
						<h1>${response[0].name.official}</h1></li>
					<li class="list-item"><p><b>Capital:</b> ${response[0].capital}</p></li>
					<li class="list-item"><p><b>Population:</b> ${response[0].population}</p></li>
					<li class="list-item"><p><b>Languages: </b>${Object.values(response[0].languages).join(', ')}</p></li>
					</ul>`);
				}
			})
			.catch(err => {
				Notify.failure('Oops, there is no country with that name')
			});
	}
}
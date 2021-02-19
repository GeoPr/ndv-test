import { Component } from '../Component.js';
import './style.css';

const API_KEY = 'ffca34d4d8764ce99c5ed44b3337ee00';
const url = `https://openexchangerates.org/api/latest.json?app_id=${API_KEY}`;
const LSKey = 'favorites';

export class Home extends Component {
  constructor(params) {
    super(params);
    this.params = params;
    this.root = null;
    this.favorites = JSON.parse(localStorage.getItem(LSKey) ?? '[]');
    this.addButtons = null;
    this.favoritesEl = null;
  }

  async getHtml() {
    const rates = await this.fetchCurrency();
    const entries = Object.entries(rates);
    localStorage.setItem('rates', JSON.stringify(entries));

    return /*html*/ `
      <section class="home">
        <div class="_container">
          <div class="home__body">
            <ul class="home__favorites">
              ${this.favorites
                .map(title => this.getFavoritesListHTML(title))
                .join('')}
            </ul>
            <ul class="home__list">
              ${entries
                .map(([currency, value]) => {
                  value = value.toFixed(2);

                  return /*html*/ `
                    <li class="home__item" data-title="${currency}">
                      <button class="home__add-button">Add to favorites</button>
                      <span>${currency} = ${value}</span>
                    </li>
                  `;
                })
                .join('')}
            </ul>
          </div>
        </div>
      </section>
		`;
  }

  async fetchCurrency() {
    const response = await fetch(url);
    const { rates } = await response.json();

    return rates;
  }

  getCurrentRoot(root) {
    this.root = root;
    this.favoritesEl = this.root.querySelector('.home__favorites');
    this.addButtons = this.root.querySelectorAll('.home__add-button');

    this.addButtons.forEach(button => {
      button.addEventListener('click', this.addFavorite.bind(this));
    });
  }

  addFavorite(e) {
    const parent = e.target.closest('.home__item');
    const { title } = parent.dataset;

    if (!this.favorites.includes(title)) {
      this.favorites.push(title);
      this.updateLS();
      this.renderFavoritesList();
    }
  }

  renderFavoritesList() {
    this.favoritesEl.innerHTML = `
      ${this.favorites.map(title => this.getFavoritesListHTML(title)).join('')}
    `;
  }

  getFavoritesListHTML(title) {
    return /*html*/ `
      <li class="home__item" data-title="${title}">
        <span>${title}</span>
      </li>
    `;
  }

  updateLS() {
    localStorage.setItem(LSKey, JSON.stringify(this.favorites));
  }
}

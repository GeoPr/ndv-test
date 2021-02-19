import { Component } from '../Component';
import './style.css';

export class Converter extends Component {
  constructor(params) {
    super(params);
    this.params = params;
    this.rates = JSON.parse(localStorage.getItem('rates'));
    this.currencyFrom = null;
    this.countFrom = null;
    this.currencyTo = null;
    this.countTo = null;
    this.inputs = [];
  }

  async getHtml() {
    return /*html*/ `
      <section class="converter">
        <div class="_container">
          <div class="converter__body">
            <form class="converter__form" id="converter-form">
              <div class="converter__block">
                <input 
                  type="text"
                  placeholder="RUB"
                  class="converter__currency converter__input"
                  id="currency-from"
                  data-type="currency"
                  autoComplete="off"
                />
                <input
                  min="0"
                  value="0"
                  type="number"
                  class="converter__count converter__input"
                  data-type="count"
                  id="count-from"
                />
              </div>
              <div class="converter__block">
                <input 
                  placeholder="EUR"
                  type="text"
                  class="converter__currency converter__input"
                  id="currency-to"
                  data-type="currency"
                  autoComplete="off"
                />
                <input
                  min="0"
                  value="0"
                  type="number"
                  class="converter__count converter__count_to converter__input"
                  data-type="count"
                  id="count-to"
                  readonly="true"
                />
              </div>
              <button 
                class="converter__button"
                type="submit"
              >
                Convert
              </button>
            </form>
            <button class="converter__button converter__button_clear" id="clear-button">Clear</button>
          </div>
        </div>
      </section>
		`;
  }

  getCurrentRoot(root) {
    const form = root.querySelector('#converter-form');
    const clearButton = root.querySelector('#clear-button');
    this.currencyFrom = form.querySelector('#currency-from');
    this.countFrom = form.querySelector('#count-from');
    this.currencyTo = form.querySelector('#currency-to');
    this.countTo = form.querySelector('#count-to');
    this.inputs = form.querySelectorAll('.converter__input');

    form.addEventListener('submit', this.convert.bind(this));
    clearButton.addEventListener('click', this.clearForm.bind(this));
  }

  convert(e) {
    e.preventDefault();

    const titleFrom = this.currencyFrom.value;
    const countFrom = this.countFrom.value;
    const titleTo = this.currencyTo.value;
    const candidateFrom = this.getCandidate(titleFrom);
    const candidateTo = this.getCandidate(titleTo);

    if (candidateFrom && candidateTo) {
      const result = (candidateTo[1] / candidateFrom[1]) * countFrom;
      this.countTo.classList.add('active');
      this.countTo.value = result.toFixed(2);
    }
  }

  getCandidate(title) {
    return this.rates.find(([rateTitle]) => {
      return rateTitle.toLowerCase() === title.toLowerCase();
    });
  }

  clearForm() {
    this.inputs.forEach(input => {
      const isCurrency = input.dataset.type === 'currency';

      input.value = isCurrency ? '' : '0';
    });
  }
}

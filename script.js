const telegramWebApp = null

// // Deviding by comma in inputs
// let inputElements = document.querySelectorAll(".comma");

// inputElements.forEach(element => {
//   element.addEventListener("keyup",(event)=>{
//     var tempNumber = element.value.replace(/,/gi, "");
//     var commaSeparatedNumber = tempNumber.split(/(?=(?:\d{3})+$)/).join(",");
//     element.value = commaSeparatedNumber;
//   });
// });

const currencies = {
  'RUB': ['USDT', 'TRY', 'KZT', 'AED', 'SAR'],
  'USDT': ['RUB', 'TRY', 'KZT', 'AED', 'SAR'],
  'TRY': ['RUB', 'USDT'],
  'KZT': ['RUB', 'USDT']
};

const selectionsContent = {
  'countriesList': ['🇷🇺 Махачкала', '🇹🇷 Стамбул', '🇷🇺 Москва', '🇦🇪 Дубаи'],
  'fromList': ['USDT', 'RUB', 'TRY', 'KZT'],
  'toList': currencies,
  'moneyTypeList': ['💰 Наличка', '💳 Карта']
};

const hintText = {
  'RUB': 'Рубли',
  'USDT': 'USDT (Крипто-доллар)',
  'TRY': 'Лиры',
  'KZT': 'Тенге',
  'AED': 'Дирхамы',
  'SAR': 'Риалы',
}

// SELECT ELEMENTS
const exchangeRateEl = document.querySelector('.exchange-rate');
const f_select = document.querySelector('.from-currency .select');
const t_select = document.querySelector('.to-currency .select');
const f_input = document.querySelector('#from-currency-amount');
const t_input = document.querySelector('#to-currency-amount');

// HELPERS : get inputs values
function fromCurrencyCode() {
  console.log(f_select.value);
  return f_select.value;
}
function toCurrencyCode() {
  return t_select.value;
}
function fromCurrencyAmount() {
  return f_input.value;
}
function toCurrencyAmount() {
  return t_input.value;
}

// VARS AND CONSTS
const DEFAULT_BASE_CURRENCY_CODE = 'USD';
const DATA_PRECISION = 2;
let exchangeRate;
let currenciesList;
let ECO_MODE = false;

// get exchange rate
async function getExchangeRate(fromCurrencyCode, toCurrencyCode) {
  const amount = 1;

  // const response = await fetch(currencyLayer.convert(fromCurrencyCode, toCurrencyCode, amount));
  const data = 1;
  const rate = data.result;

  return rate;
}

// render exchange rate
async function renderExchangeRate(fromCurrencyCode, toCurrencyCode) {
  exchangeRate = await getExchangeRate(fromCurrencyCode, toCurrencyCode);


  plural = exchangeRate === 1 ? 's' : '';

  exchangeRateEl.innerHTML = `<p>1 ${currenciesList[fromCurrencyCode]} equals</p>
  <h1>${exchangeRate.toFixed(DATA_PRECISION)} ${currenciesList[toCurrencyCode]}${plural}</h1>`;
}

// render select options
function renderSelectOptions(list) {
  t_select.innerHTML = '';

  for (const currencyCode in list) {
    t_select.innerHTML += `<button class="dropdown-item" href="#">${currencyCode}</button>
                            <hr class="dropdown-divider">`;
  }
}


// convert
async function convert(direction) {
  if (direction === 'from->to') {
    t_input.value = fromCurrencyAmount() * exchangeRate;
  } else if (direction === 'to->from') {
    f_input.value = toCurrencyAmount() / exchangeRate;
  }
}

// EVENT LISTENERS
f_select.addEventListener('change', async () => {
  // renderSelectOptions(currencies)
  console.log('Hello')
  await renderExchangeRate(fromCurrencyCode(), toCurrencyCode());
  convert('from->to');
});
t_select.addEventListener('change', async () => {
  await renderExchangeRate(fromCurrencyCode(), toCurrencyCode());
  convert('to->from');
});
f_input.addEventListener('input', async () => {
  if (!ECO_MODE) {
    exchangeRate = 1;
    console.log(exchangeRate);
  }
  convert('from->to');
});
t_input.addEventListener('input', async () => {
  if (!ECO_MODE) {
    exchangeRate = 1;
    // exchangeRate = await getExchangeRate(fromCurrencyCode(), toCurrencyCode());
  }
  convert('to->from');
});


// SELECTION IN DROPDOWNS
const dropdownEls = document.querySelectorAll(".dropdown-center");

dropdownEls.forEach(element => {
  element.addEventListener("click", function(event) {
    
    fromBtn = document.getElementById("fromBtn")
    toBtn = document.getElementById("toBtn")

    if(event.target.matches('.dropdown-item')) {
      element.querySelector('.dropdown-toggle').textContent=event.target.textContent
    }

    listEl = element.querySelector(".dropdown-menu")
    listEl.innerHTML = '';

    if(listEl.id != 'toList') {
      for (const el of selectionsContent[listEl.id]) {
        if (el == element.querySelector('.dropdown-toggle').textContent){
          continue
        }
        listEl.innerHTML += `<button class="dropdown-item" href="#">${el}</button>
                                <hr class="dropdown-divider">`;
      }
  
      if (listEl.id == 'fromList' && event.target.matches('.dropdown-item')) {
        document.querySelector('#toList').innerHTML = '';
        toBtn.textContent = currencies[event.target.textContent][0];
        for (const el of currencies[event.target.textContent]) {
          if (el == element.querySelector('.dropdown-toggle').textContent){
            continue
          }
          document.querySelector('#toList').innerHTML += `<button class="dropdown-item" href="#">${el}</button>
                                                          <hr class="dropdown-divider">`;
        }
      }
    } else {
      for (const el of currencies[fromBtn.textContent]) {
        if (el == element.querySelector('.dropdown-toggle').textContent){
          continue
        }
        listEl.innerHTML += `<button class="dropdown-item" href="#">${el}</button>
                              <hr class="dropdown-divider">`;
      }
    }

    document.getElementById('fromImg').src = `assets/${fromBtn.textContent}.png`
    document.getElementById('toImg').src = `assets/${toBtn.textContent}.png`

    document.getElementById('fromHint-text').textContent = hintText[fromBtn.textContent]
    document.getElementById('toHint-text').textContent = hintText[toBtn.textContent]

    if (fromBtn.textContent == '' && toBtn.textContent == '') {

    }
    

  });
});

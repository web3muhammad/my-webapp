const tg = window.Telegram.WebApp;
tg.expand();

tg.MainButton.setParams({  
  "text": 'Отправить заявку',
  "is_active": false,
  "is_visible": true});

// tg.MainButton.text = 'Отправить заявку'; // текст кнопки, по умолчанию: "Continue"
// tg.MainButton.color = '#2cab37';// цвет текста
// tg.MainButton.textColor  = '#FFFFFF';// цвет подложки
// tg.MainButton.isVisible = true; // видна ли кнопка (по умолчанию false) 
// tg.MainButton.isActive = false;

// tg.MainButton.show();

// Dicts
const currencies = {
  'RUB': ['USDT', 'TRY', 'KZT', 'AED', 'SAR'],
  'USDT': ['RUB', 'TRY', 'KZT', 'AED', 'SAR'],
  'TRY': ['RUB', 'USDT'],
  'KZT': ['RUB', 'USDT'],
  'AED': ['RUB', 'USDT']
};

const selectionsContent = {
  'countriesList': ['🇷🇺 Махачкала', '🇹🇷 Стамбул', '🇷🇺 Москва', '🇦🇪 Дубаи'],
  'fromList': ['USDT', 'RUB', 'TRY', 'KZT', 'AED'],
  'toList': currencies,
};

const hintText = {
  'RUB': 'Рубли',
  'USDT': 'USDT (Крипто-доллар)',
  'TRY': 'Лиры',
  'KZT': 'Тенге',
  'AED': 'Дирхамы',
  'SAR': 'Риалы',

  'RUBUSDT': 'Выберите каким способом отдать рубли.',
  'USDTRUB': 'Выберите каким способом получить рубли.',
  'TRY': 'Лиры',
  'KZT': 'Тенге',
  'AED': 'Дирхамы',
  'SAR': 'Риалы'
}

const testRates = {
  'RUBUSDT': 2,
  'USDTRUB': 3,
  'RUBTRY': 1.5,
  'TRYRUB': 10,
  'USDTAED': 3.55
}

// HTML's elements
const exchangeRateEl = document.querySelector('.exchange-rate');
const f_select = document.querySelector('.from-currency .select');
const t_select = document.querySelector('.to-currency .select');
const f_input = document.querySelector('#from-currency-amount');
const t_input = document.querySelector('#to-currency-amount');
const fromBtn = document.getElementById("fromBtn");
const toBtn = document.getElementById("toBtn");
const fromImg = document.getElementById('fromImg');
const toImg = document.getElementById('toImg');
const fromHint = document.getElementById('fromHint-text');
const toHint = document.getElementById('toHint-text');
const detailsHint = document.getElementById('detailsHint');
const cashOrCardEl = document.getElementById("cashOrCard");
const cashOrCardElInputs = cashOrCardEl.querySelectorAll('input');
const dropdownEls = document.querySelectorAll(".dropdown-center");
const userWallet = document.getElementById("userWallet");
const cashInput = document.getElementById('cashInput');
const cardInput = document.getElementById('cardInput');

const pickupOrDelivery = document.getElementById("pickupOrDelivery");
const pickupOrDeliveryInputs = pickupOrDelivery.querySelectorAll('input');
const pickupInput = document.getElementById('cashInput');
const deliveryInput = document.getElementById('cardInput');

const copyInputs = document.querySelectorAll('.copy-input');

copyInputs.forEach(element => {
  element.addEventListener("click", function(event) {
    navigator.clipboard.writeText(event.target.value).then(function() {
    }, function(err) {
      console.error('Async: Could not copy text: ', err);
    });
  });
});

// HELPERS : get inputs values
function fromCurrencyCode() {
  return document.getElementById("fromBtn").textContent;
}
function toCurrencyCode() {
  return document.getElementById("toBtn").textContent;
}
function fromCurrencyAmount() {
  return f_input.value;
}
function toCurrencyAmount() {
  return t_input.value;
}

// VARS AND CONSTS
const DATA_PRECISION = 2;
let exchangeRate;
let changePair;

// get exchange rate
async function getExchangeRate(fromCurrencyCode, toCurrencyCode) {
  const rate = testRates[fromCurrencyCode + toCurrencyCode];
  return rate;
}

// Convert func
async function convert(direction) {
  if (direction === 'from->to') {
    t_input.value = fromCurrencyAmount() * exchangeRate;
  } else if (direction === 'to->from') {
    f_input.value = toCurrencyAmount() / exchangeRate;
  }
}


// Correct selection in dropdowns
dropdownEls.forEach(element => {
  element.addEventListener("click", function(event) {
    
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

    if (listEl.id == 'fromList' || listEl.id == 'toList') {
      fromImg.src = `assets/${fromBtn.textContent}.png`
      toImg.src = `assets/${toBtn.textContent}.png`
  
      fromHint.textContent = hintText[fromBtn.textContent]
      toHint.textContent = hintText[toBtn.textContent]

      if(event.target.matches('.dropdown-item')) {
        document.querySelectorAll('.form-element').forEach( element => {
          element.classList.add('visually-hidden');
        });

        cashOrCardElInputs.forEach( element => {
          element.checked = false
          element.disabled = false
        });
        pickupOrDeliveryInputs.forEach( element => {
          element.checked = false
          element.disabled = false
        });
      }

      changePair = fromBtn.textContent + toBtn.textContent;
      detailsHint.textContent = hintText[changePair]

      showOrHideHtmlEl(toBtn.textContent == 'USDT', 'userWallet');
      showOrHideHtmlEl(fromBtn.textContent == 'USDT', 'ourWallet');

      if (changePair == "RUBAED") {
        disableCard();
        showOrHideHtmlEl(true, 'pickupOrDelivery');
      }

      if (changePair == "USDTAED") {
        disableCard();
        showOrHideHtmlEl(true, 'pickupOrDelivery');
      }

      if (fromBtn.textContent == 'KZT') {
        disableCash();
        showOrHideHtmlEl(true, 'kazakhstanBankInfo');

      }

      if (toBtn.textContent == 'KZT') {
        disableCash();
        showOrHideHtmlEl(true, 'kazakhstanBankInput');
        
      }

      if (toBtn.textContent == 'SAR') {
        disableCard();
        showOrHideHtmlEl(true, 'userAddress');
        
      }
    }
  });
});


// Cash or card element events
cashOrCardElInputs.forEach( element => {
  element.addEventListener("click", function(){
    const cardChecked = cashOrCardEl.querySelector('input:checked').value == 1

    if (changePair == 'USDTRUB') {   
      showOrHideHtmlEl(cardChecked, 'userBankInput');

    } else if (changePair == 'RUBTRY') {
      showOrHideHtmlEl(cardChecked, 'turkeyBankInput');
      showOrHideHtmlEl(!cardChecked, 'userAddress'); 

    } else if (changePair == 'TRYRUB') {
      showOrHideHtmlEl(cardChecked, 'userBankInput');

    } else if (changePair == 'USDTTRY') {
      showOrHideHtmlEl(cardChecked, 'turkeyBankInput');
      showOrHideHtmlEl(!cardChecked, 'pickupOrDelivery');

    } else if (changePair == 'USDTKZT') {
      showOrHideHtmlEl(cardChecked, 'kazakhstanBankInput');

    } else if (changePair == 'AEDRUB') {
      showOrHideHtmlEl(!cardChecked, 'pickupOrDelivery');

    }
  });
});

pickupOrDeliveryInputs.forEach( element => {
  element.addEventListener("click", function(){
    const deliveryChecked = pickupOrDelivery.querySelector('input:checked').value == 1

    if (changePair == 'USDTRUB') {   
      showOrHideHtmlEl(deliveryChecked, 'userAddress');
      showOrHideHtmlEl(deliveryChecked, 'ourWallet');

    } else if (changePair == 'RUBAED') {
      showOrHideHtmlEl(deliveryChecked, 'userAddress');
    }
  });
});

// Element hide helper
function showOrHideHtmlEl(condition, htmlEl) {
  if (condition) {
    document.getElementById(htmlEl).classList.remove('visually-hidden')
  } else {
    document.getElementById(htmlEl).classList.add('visually-hidden')
  }
}

function disableCash() {
  cashInput.disabled = true;
  cardInput.checked = true;
}

function disableCard() {
  cardInput.disabled = true;
  cashInput.checked = true;
}


// Convert events
f_select.addEventListener('click', async (event) => {
  if (event.target.matches('.dropdown-item')) {
    exchangeRate = await getExchangeRate(event.target.textContent, currencies[event.target.textContent][0]);
  }
  convert('from->to');
});

t_select.addEventListener('click', async (event) => {
  if (event.target.matches('.dropdown-item')) {
    exchangeRate = await getExchangeRate(fromCurrencyCode(), event.target.textContent,);
  }
  convert('to->from');
});

f_input.addEventListener('input', async () => {
  exchangeRate = await getExchangeRate(fromCurrencyCode(), toCurrencyCode());
  convert('from->to');
});
t_input.addEventListener('input', async () => {
  exchangeRate = await getExchangeRate(fromCurrencyCode(), toCurrencyCode());
  convert('to->from');
});

userWallet.addEventListener('click', async (event) => {
  if (true) {
    tg.MainButton.isActive = true
  }
});

// // Deviding by comma in inputs
// let inputElements = document.querySelectorAll(".comma");

// inputElements.forEach(element => {
//   element.addEventListener("keyup",(event)=>{
//     var tempNumber = element.value.replace(/,/gi, "");
//     var commaSeparatedNumber = tempNumber.split(/(?=(?:\d{3})+$)/).join(",");
//     element.value = commaSeparatedNumber;
//   });
// });
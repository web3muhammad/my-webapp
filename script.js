let tg = window.Telegram.WebApp;

tg.expand();

let usercard = document.getElementById("usercard");

let username = document.getElementById("username");
let p = document.createElement("p");

p.innerText = `${tg.initDataUnsafe.user.id}`;

usercard.appendChild(p);


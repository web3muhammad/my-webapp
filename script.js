let tg = window.Telegram.WebApp;

tg.expand();

let usercard = document.getElementById("usercard");

let username = document.getElementById("username");
let p = document.createElement("p");

ßß
p.innerText = `${tg.WebAppInitData.user.id}`
let inputElements = document.querySelectorAll(".nnn");

console.log(inputElements)
inputElements.forEach(element => {
  element.addEventListener("keyup",(event)=>{
    var tempNumber = element.value.replace(/,/gi, "");
    var commaSeparatedNumber = tempNumber.split(/(?=(?:\d{3})+$)/).join(",");
    element.value = commaSeparatedNumber;
  });
});
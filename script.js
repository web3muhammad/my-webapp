let inputElement = document.querySelector(".nnn");
         inputElement.addEventListener("keyup",(event)=>{
      var tempNumber = inputElement.value.replace(/,/gi, "");
      var commaSeparatedNumber = tempNumber.split(/(?=(?:\d{3})+$)/).join(",");
      inputElement.value = commaSeparatedNumber;
     })
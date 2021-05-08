window.onload = function(){
    const mobileBtn = document.getElementById("mobileMenu");
         nav = document.querySelector("nav")
         mobileBtnExit = document.getElementById("menuExit");
 
     mobileBtn.addEventListener("click",() => {
         nav.classList.add("menu-btn");
     } )
 
     mobileBtnExit.addEventListener("click",() => {
         nav.classList.remove("menu-btn");
     } )
 
 };
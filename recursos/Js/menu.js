var enlaceMenu;

function iniciarMenu() {
    enlaceMenu = document.querySelector("nav > a");
    
    if (enlaceMenu) {
        enlaceMenu.addEventListener("click", despliegaMenu, false);
    }
}

function despliegaMenu(e) {
    
    e.preventDefault();

    document.querySelector("nav > ul").classList.toggle('desplegado');
}

window.addEventListener("load", iniciarMenu, false);
var enlaceMenu;

function iniciarMenu() 
{
	enlaceMenu = document.querySelector("nav>a");
	enlaceMenu.addEventListener("click", despliegaMenu, false);
}

function despliegaMenu()
{
	document.querySelector("nav>ul").classList.toggle('desplegado');
}

window.addEventListener("load", iniciarMenu, false);

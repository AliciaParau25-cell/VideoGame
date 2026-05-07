var enlaceMenu;

function iniciarMenu() 
{
	enlaceMenu = document.querySelector("#page>nav>a");
	enlaceMenu.addEventListener("click", despliegaMenu, false);
}

function despliegaMenu()
{
	document.querySelector("#page>nav>ul").classList.toggle('desplegado');
}

window.addEventListener("load", iniciarMenu, false);

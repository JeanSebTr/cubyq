// JavaScript Document
window.onload=configurer;
	function configurer ()
	{
		/*----- Initialisation des attributs pour la s�lection du bloc d'information -----*/
		/*document.getElementById("cont_hist").className = "";
		document.getElementById("cont_htp").className = "invisible";
		document.getElementById("cont_hiScr").className = "invisible";*/
	}
	/*---------- D�but des fonctions de la s�lection du bloc voulu ----------*/
	function changerdiv1()
	{
		document.getElementById("cont_hist").className = "";
		document.getElementById("cont_htp").className = "invisible";
		document.getElementById("cont_hiScr").className = "invisible";
		
		document.getElementById("hist").className ="selectionne";
		document.getElementById("htp").className ="";
		document.getElementById("hiScr").className ="";
	}
	
	function changerdiv2()
	{
		document.getElementById("cont_hist").className = "invisible";
		document.getElementById("cont_htp").className = "";
		document.getElementById("cont_hiScr").className = "invisible";
		
		document.getElementById("hist").className ="";
		document.getElementById("htp").className ="selectionne";
		document.getElementById("hiScr").className ="";
	}
	
	function changerdiv3()
	{
		document.getElementById("cont_hist").className = "invisible";
		document.getElementById("cont_htp").className = "invisible";
		document.getElementById("cont_hiScr").className = "";
		
		document.getElementById("hist").className ="";
		document.getElementById("htp").className ="";
		document.getElementById("hiScr").className ="selectionne";
	}
	/*---------- Fin des fonctions de la s�lection du bloc voulu ----------*/
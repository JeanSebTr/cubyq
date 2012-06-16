// JavaScript Document
window.onload=configurer;
	function configurer ()
	{
		/*----- Initialisation des attributs pour la sélection du bloc d'information -----*/
		/*document.getElementById("cont_hist").className = "";
		document.getElementById("cont_htp").className = "invisible";
		document.getElementById("cont_hiScr").className = "invisible";*/
	}
	/*---------- Début des fonctions de la sélection du bloc voulu ----------*/
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
	/*---------- Fin des fonctions de la sélection du bloc voulu ----------*/
	
	/*---------- Début des fonctions de la sélection du bloc voulu ----------*/
	function changer2div1()
	{
		document.getElementById("cont_hist_phone").className = "";
		document.getElementById("cont_htp_phone").className = "invisible";
		document.getElementById("cont_hiScr_phone").className = "invisible";
		document.getElementById("cont_desc_phone").className = "invisible";
		
		document.getElementById("hist_phone").className ="selectionne";
		document.getElementById("htp_phone").className ="";
		document.getElementById("hiScr_phone").className ="";
		document.getElementById("credits_phone").className = "";
	}
	
	function changer2div2()
	{
		document.getElementById("cont_hist_phone").className = "invisible";
		document.getElementById("cont_htp_phone").className = "";
		document.getElementById("cont_hiScr_phone").className = "invisible";
		document.getElementById("cont_desc_phone").className = "invisible";
		
		document.getElementById("hist_phone").className ="";
		document.getElementById("htp_phone").className ="selectionne";
		document.getElementById("hiScr_phone").className ="";
		document.getElementById("credits_phone").className = "";
	}
	
	function changer2div3()
	{
		document.getElementById("cont_hist_phone").className = "invisible";
		document.getElementById("cont_htp_phone").className = "invisible";
		document.getElementById("cont_hiScr_phone").className = "";
		document.getElementById("cont_desc_phone").className = "invisible";
		
		document.getElementById("hist_phone").className ="";
		document.getElementById("htp_phone").className ="";
		document.getElementById("hiScr_phone").className ="selectionne";
		document.getElementById("credits_phone").className = "";
	}
	
	function changer2div4()
	{
		document.getElementById("cont_hist_phone").className = "invisible";
		document.getElementById("cont_htp_phone").className = "invisible";
		document.getElementById("cont_hiScr_phone").className = "invisible";
		document.getElementById("cont_desc_phone").className = "";
		
		document.getElementById("hist_phone").className ="";
		document.getElementById("htp_phone").className ="";
		document.getElementById("hiScr_phone").className ="";
		document.getElementById("credits_phone").className = "selectionne";
	}
	/*---------- Fin des fonctions de la sélection du bloc voulu ----------*/
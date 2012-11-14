var Game, socket;
	function changerdiv0()
	{
		document.getElementById("cont_desc").style.display = "none";
		document.getElementById("cont_hist").className = "invisible";
		document.getElementById("cont_htp").className = "invisible";
		
		document.getElementById("jouer").className ="selectionne";
		document.getElementById("hist").className ="";
		document.getElementById("htp").className ="";
		if(!Game) {
	        Game = new GameEngine();
	        Game.init('canvas', function() {
	        	Game.changeState(Game.States.initGame);
	        });
	    }
	}
	function changerdiv1()
	{
		document.getElementById("cont_desc").style.display = "block";
		document.getElementById("cont_play").className = "invisible";
		document.getElementById("cont_hist").className = "";
		document.getElementById("cont_htp").className = "invisible";
		
		document.getElementById("jouer").className ="";
		document.getElementById("hist").className ="selectionne";
		document.getElementById("htp").className ="";
	}
	
	function changerdiv2()
	{
		document.getElementById("cont_desc").style.display = "block";
		document.getElementById("cont_play").className = "invisible";
		document.getElementById("cont_hist").className = "invisible";
		document.getElementById("cont_htp").className = "";
		
		document.getElementById("jouer").className ="";
		document.getElementById("hist").className ="";
		document.getElementById("htp").className ="selectionne";
	}

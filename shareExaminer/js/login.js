$(document).ready(function(){
	
    allEvents();
    function load(){
		  setTimeout(function(){
				window.location = "login.html";
			}, 3000);  
	}
});   
 
function allEvents()
{
	$('#cancel').click(function(){
		alert("Test");
	});
	
	$('#skip, #submit').click(function(){
		window.location = 'main.html';
		 /* showPopup(
                  {
                      headText: "head",
                      innerText: "inner",
                      button1: "ok",
                      popupHdlr: 
                          function(data)
                          {
                             // alert("done");
                          }
                  });*/
	});
}
var globalClickedListId = null;
var globalClickedMemName = "test";
$('ui-btn').css('background-color','#f6f6f6');  
$( document ).on( "vmousedown", "button,a", function() {
    	//console.log("mouse down");
    	var id = $(this).attr('id');
    	if(id != "addExpense")
    		{
    			// $(this).css('background-color','#3388cc'); //on click change of color 
    		}
    });
    $( document ).on( "vmouseup", "button,a", function() {
    	//console.log("mouse up");
    	var id2 = $(this).attr('id');
    	if(id2 != "addExpense")
    		{
    			//$(this).css('background-color','#f6f6f6'); 
    		}
  });
    
function saveClickedListForNextpage(id,name){
	globalClickedListId = id;
	globalClickedMemName = name;
}

    
$(document).delegate('#loginPage,#mainpage', 'pageshow', function () {
      var the_height = ($(window).height() - $(this).find('[data-role="header"]').height() - $(this).find('[data-role="footer"]').height() - 40);
      $(this).height($(window).height()).find('[data-role="content"]').height(the_height);
});

//STRINGS starts
//var memberDetailData = '{"metadata":[{"member":[]}]}';
var memberDetailDataLocalStorage;
var memberDetailData;
localStorage.setItem("memberDetailData",'{"metadata":[{"member":[]}]}');
//var memberDetailData = '{"metadata":[{"member":[{"id":"mem_1","name":"tej","amount":"40","entry":[{"id":"ent_1","purpose":"lunch","location":"goa","time":"12-25-2015","amount":"50"},{"id":"ent_2","purpose":"dinner","location":"dvg","time":"2-9-2015","amount":"12"}]},{"id":"mem_2","name":"neha","amount":"50","entry":[{"id":"ent_1","purpose":"petrol","location":"goa","time":"12-25-2015","amount":"50"},{"id":"ent_2","purpose":"breakfast","location":"dvg","time":"2-9-2015","amount":"12"}]}]}]}';
//STRINGS ends
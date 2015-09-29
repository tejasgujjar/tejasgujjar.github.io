$(document).ready(function(){
	showHomePage();
	$.mobile.loading( "show", {theme: "d"});
	 setTimeout(function(){
    	 $.mobile.loading( "hide" );
    }, 3);
	 memberDetailData = localStorage.getItem("memberDetailData");
	 alert("data"+memberDetailData);
	var jsonData = memberDetailData; 
    parsedData = $.parseJSON(jsonData);
    memObj = parsedData.metadata[0].member;
    setTimeout(function(){
    	populateMemberList(parsedData);
    }, 5); //remove setTimeout later
    
    
	$('#addExp_submit').unbind('click',function(){});
	$('#addExp_submit').bind('click',function(){
		addExpense();
	});
	$('#addExp_cancel').unbind('click',function(){});
	$('#addExp_cancel').bind('click',function(){
		$("#addExpense_popupDialog").popup("close");
		$('#amtInv').val("");
		$('#amtLoc').val("");
		$('#amtPurpose').val("");
	});
	$('#addMemSubmit').unbind('click',function(){});
	$('#addMemSubmit').bind('click',function(){
		$("#addMem_popupDialog").popup("close");
		acceptNewMember();
	});
	
	$('#addExpense_popupDialog_Btn').click(function(){
		$('#memListDropdown').html("");
		var i;
		memObj = parsedData.metadata[0].member;
		var len= memObj.length;
		for(i=0;i<=len-1;i++)
		{
			$('#memListDropdown').append($('<option>', {
				   value: memObj[i].name,
				   text: memObj[i].name
				}));
		}
	});
});

function showHomePage()
{
	$('#expensesPage').hide();
	$('#membersPage').show();
	$('#backBtnHdr').hide();
	$('#addMemBtnHdr').show();
	$('#headerMemName').text("Admin");
}
function showExpensePage(selectedMemName)
{
	$('#membersPage').hide();
	$('#expensesPage').show();
	$('#backBtnHdr').show();
	$('#addMemBtnHdr').hide();
	$('#headerMemName').text(selectedMemName);
}

var parsedData;
var memObj;

$( document ).on( "click", ".show-page-loading-msg", function() {
    $.mobile.loading( "show", {theme: "d"});
    setTimeout(function(){
    	 $.mobile.loading( "hide" );
    }, 3000);
});

function addExpense()
{
	var amt = $('#amtInv').val();
	var loc = $('#amtLoc').val();
	var purpose = $('#amtPurpose').val();
	var selected_option = $('#memListDropdown').find(":selected").text();
	var valid = true;
	var numbers = /^[0-9]+$/;  
  /*  if(amt.match(numbers))  
    	valid = true;
    else
    	valid = false;*/
    if(loc == "" || purpose == "" || !(amt.match(numbers)))
    	valid = false;
    else
    	valid = true;
    
    if(valid)
    {
    	//alert("OK");
    	$( "#addExp_cancel" ).trigger( "click" );
    	acceptExpense(selected_option,amt,purpose,loc);
    }
    else
    {
    	alert("Entered Invalid Data");
    /*	showPopup(
                {
                    headText: "Error",
                    innerText: "Proper",
                    button1: "ok"
                });*/	
    }
    $('#amtInv').val("");
	$('#amtLoc').val("");
	$('#amtPurpose').val("");
}

function acceptExpense(name,amt,purpose,loc)
{
	//alert("Name: "+name+" amount: "+amt+" purpose: "+purpose+" loc: "+loc);
	var dt = new Date();
	var time = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
	var d = new Date();
	var month = d.getMonth()+1;
	var day = d.getDate();
	var output= (day<10 ? '0' : '') + day + '-'+ (month<10 ? '0' : '') + month + '-' + d.getFullYear();
	console.log("Name: "+name+" amount: "+amt+" purpose: "+purpose+" loc: "+loc+" "+output+" "+time);
	memObj = parsedData.metadata[0].member;
	var index = getIndex(name,parsedData);
	var expObj = memObj[index]['entry'];
	expObj.push({"id":"ent_5","purpose":purpose,"location":loc,"time":time,"amount":amt,"date":output});
	memberDetailData = JSON.stringify(parsedData);
	alert("idex "+name);
//	updateMemberAmount(amt,index);
	showHomePage();
}

function acceptNewMember()
{
	var mobNumber = $('#memMobNumber').val();
	var memName = $('#memName').val();
	if(checkPreviousName(memName)){
		
	}
	else{
		alert("Name already exists");
		return;
	}
	if(memName == "" || memName == " "){
		alert("Please enter name");
		return ;
	}
	else{
		var member = parsedData.metadata[0]['member'];
		member.push({"id":"mem_7","name":memName,"amount":"00","entry":[]});
		memberDetailData = JSON.stringify(parsedData);
		localStorage.removeItem("memberDetailData");
		localStorage.setItem("memberDetailData",memberDetailData);
		$('#memMobNumber').val('');
		$('#memName').val('');
		populateMemberList(parsedData);
	}
}

function populateMemberList(parsedData) //IMP
{
	memObj = parsedData.metadata[0].member;
	var memLength = memObj.length;
	var items = [];
	var i;
	$('#member_list').html("");
	var serialNum =0; 
	if(memLength != 0)
	{
		for(i =0;i<=memLength-1;i++)
			{
				$('#member_list').html("");
				serialNum = i+1;
				var toPush = '<li class="list" id="'+memObj[i].name+'"><span class="serialNo">'+serialNum+'.</span><span class="memName">'+memObj[i].name+'</span><span class="amt"><img alt="Rs" src="img/rupee.png" width="7" height="10" style="vertical-align: baseline" data-file-width="512" data-file-height="754">'+memObj[i].amount+'</span></li>';
				items.push(toPush);
				$('<ul/>', {
				    html: items.join('')
				  }).appendTo('#member_list');
			}
	}
	else
	{
      alert("No members currently.");
	}
	$('#member_list ul li').bind('click',function(){
		var selected_memberId = $(this).attr('id');
		showExpensePage(selected_memberId);
		var index = getIndex(selected_memberId,parsedData);
		if(index == "Error in fetching details"){
			alert("Error in fetching details");
		}
		else{
			populateMemExpenseDetail(parsedData,index);
		}
	});
}

function populateMemExpenseDetail(parsedData,index){
	memObj = parsedData.metadata[0].member;
	var expObj = memObj[index].entry;
	var len = expObj.length;
	var items = [];
	var i;
	$('#expense_list').html("");
	var serialNum =0; 
	if(len != 0)
	{
		for(i =0;i<=len-1;i++)
			{
				$('#expense_list').html("");
				//alert("asd"+i+" "+memObj[i].id+" "+memObj[i].name+" "+memObj[i].amount);
				serialNum = i+1;
				var toPush = '<li class="list" id="'+expObj[i].id+'"><span class="serialNo">'+serialNum+'.</span><span class="memName">'+expObj[i].purpose+'</span><span class="amt"><img alt="Rs" src="img/rupee.png" width="7" height="10" style="vertical-align: baseline" data-file-width="512" data-file-height="754">'+expObj[i].amount+'</span></li>';
				items.push(toPush);
				$('<ul/>', {
				    html: items.join('')
				  }).appendTo('#expense_list');
			}
	}
	else
	{
      alert("No expenses available currently.");
      showHomePage();
	}
	$('#expense_list ul li').bind('click',function(){
		var id = $(this).attr('id');
		var memId = $('#headerMemName').text();
		var index = getIndex(memId,parsedData);
		if(index == "Error in fetching details"){
			alert("Error in fetching details");
		}
		else{
			populateExpenseEntryDetails(parsedData,index,id);
		}
		//parsedData.metadata[0].member;
		
	});
}

function populateExpenseEntryDetails(parsedData,index,entryId)
{
	var expObj = memObj[index]['entry'];	
	var entryIndex = getEntryIndex(expObj,entryId);
	if(entryIndex == "Error in fetching details"){
		alert("Error in fetching Expense details");
	}
	else{
		var entryObj = expObj[entryIndex];
		$('#purpose_detail').val(entryObj.purpose);
		$('#amount_detail').val(entryObj.amount);
		$('#location_detail').val(entryObj.location);
		$('#date_detail').val(entryObj.date);
		$('#time_detail').val(entryObj.time);
		$("#showDetailPopUp").popup("open");
	}
}


function getEntryIndex(expObj,entryId)
{
	var len = expObj.length;
	var i =0;
	var retText = 'Error in fetching details';
	for(i=0;i<=len-1;i++)
	{
		if(expObj[i].id == entryId)
		{
			return i;
		}
	}
	return retText;
}

function getIndex(selected_memberId,parsedData)
{
	memObj = parsedData.metadata[0].member;
	var len = memObj.length;
	var i;
	var retText = "Error in fetching details";
	for(i=0;i<=len-1;i++)
	{
		if(selected_memberId == memObj[i].name){
			return i;
		}
	}
	return retText;
}
function checkPreviousName(memName){
	memObj = parsedData.metadata[0].member;
	var i;
	var len = memObj.length;
	var text1 = "alreadExists";
	var flag = 0;
	for(i=0;i<=len-1;i++)
	{
		if(memName == memObj[i].name){
			return false;
		}
		else{
			
		}
	}
	return true;
}

//Store
/*	localStorage.setItem("language", "en");
	// Retrieve
	document.getElementById("result").innerHTML = localStorage.getItem("language");
	location.reload();*/

function updateMemberAmount(amt)
{
	
}


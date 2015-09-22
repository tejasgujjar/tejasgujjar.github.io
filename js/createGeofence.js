var mobiSetText = "Set";
var mobiCancelText = "Cancel";
var mobiDayText = 'Day';
var mobiMonthText = 'Month';
var mobiHourText = 'Hours';
var mobiMinuteText = 'Minutes';
var mobiSecText = 'Seconds';
var mobiYearText = 'Year';
var mobiNowText = 'Now';

function updateHomefence(fenceObject)
{
	var startTime = fenceObject.startTime;
	var startDate = fenceObject.startDate;
	var address = fenceObject.address;
	var endDate = fenceObject.endDate;
	var longitude = fenceObject.longitude;
	var radius = fenceObject.radius;
	var latitude = fenceObject.latitude;
	var endTime = fenceObject.endTime;
	populateSavedValues(startTime,startDate,endDate,endTime,radius,address);
}

function populateSavedValues(startTime,startDate,endDate,endTime,radius,address)
{
	$('#startDate').val(new Date(startDate).toDateString());
	$('#startTime').val(convertTimetoAMPM(new Date(startDate+" "+startTime)));
	$('#endTime').val(convertTimetoAMPM(new Date(endDate+" "+endTime)));
	$('#endDate').val(new Date(endDate).toDateString());
	$('#geofence_radius').text(radius);
	$('#address').text(address);
	$("#createGeofence_select").val('on').slider('refresh');
}

function convertTimetoAMPM(date,time)
{ 
	date.setMinutes(Math.ceil(date.getMinutes()/15) * 15);
	var hours = date.getHours();
	var minutes = date.getMinutes();
	var ampm = hours >= 12 ? 'PM' : 'AM';
	hours = hours % 12;
	hours = hours ? hours : 12; // the hour '0' should be '12'
	minutes = minutes < 10 ? '0'+minutes : minutes;
	var strTime = hours + ':' + minutes + ' ' + ampm; //11:45 AM
	return strTime;
}

function populateDefaultValues()
{
	isHomeFenceCreated = false;
	var end_date = plus15Minutes(new Date());
	$('#startDate').val(new Date().toDateString());
	$('#startTime').val(convertTimetoAMPM(new Date()));
	$('#endTime').val(convertTimetoAMPM(end_date,'end'));
	$('#endDate').val(end_date.toDateString());
	$('#geofence_radius').text(startingRadiusVal);
	$('#inputAddressBar').text('');
	$("#createGeofence_select").val('off').slider('refresh');
	$('#create_geo_name_val').val("");
	$('#inputAddressBar').val("");
}

function plus15Minutes(date)
{
	//var date = new Date(end_date+" "+endTime);
	var time = convertTimetoAMPM(date);
	date = new Date(date.toDateString()+" "+time);
	date.setMinutes(date.getMinutes()+15);
	return date;
	
}
function pickDatefromMobiScrollPopup(inputID)
{
	var dateformat = 'D M dd yyyy';
	var sel_id = $(inputID).attr('id');
	var selValue = $("#"+sel_id).val();
	var now = new Date();
	var selYear = now.getFullYear();
	var selMonth = now.getMonth();
	var selDay = now.getDate();
	var selDate = new Date();
	if(selValue != null && selValue.length != 0)
	{
		selDate = new Date(selValue);
		selYear = selDate.getFullYear();
		selMonth = selDate.getMonth();
		selDay = selDate.getDate();
	}
	console.log("sel_id :"+sel_id+"|| selValue :"+selValue+"|| now :"+now+"|| selYear :"+selYear+"|| selMonth :"+selMonth+"|| selDay :"+selDay+"|| selDate :"+selDate);
	$('#'+sel_id).mobiscroll({
		preset:'date',
		dateOrder: 'Mddyy',
		dateFormat: dateformat,
		startYear : new Date().getFullYear()-1,
		endYear: new Date().getFullYear()+5,
	    theme: 'default',
	    display: 'model',
	    mode: 'clickpick',
	   
	    onCancel : function(html, inst){
	    	if(selValue.length == 0){
	    		$('#' + sel_id).val('');
	    	}
	    }
	}).scroller('setDate',new Date(selYear, selMonth, selDay), true);
	$('#' + sel_id).mobiscroll('show');
}

function pickTimefromMobiScrollPopup(inputId)
{
	var sel_id = $(inputId).attr('id');
	var selValue = $("#"+sel_id).val();
	
	function setDateTime()
	{
		var now = new Date();
		now.setMinutes(Math.ceil(now.getMinutes()/15) * 15);
		var selHour = now.getHours();
		var selMin = now.getMinutes();
		if (selValue.length != 0 && selValue != "")
		{
			selTime = selValue.split(":");
			selHour = selTime[0];
			selMin = selTime[1].substring(0,2);
			if (selTime[1].search("PM") != -1 && selHour != 12)
			{
				selHour = parseInt(selHour, 10) + 12;
			}
			if (selTime[1].search("AM") != -1 && selHour == 12)
			{
				selHour = 0;
			}
		}
		return new Date(1900, 1, 1, selHour, selMin);
	}
	setDateTime();
	$('#'+sel_id).mobiscroll({
		preset:'time',
		theme: 'default',
		display: 'model',
		timeWheels : 'hhiiA',
		timeFormat : 'hh:ii A',
		stepMinute : 15,
		mode: 'clickpick',
		onCancel : function(html, inst){
	    	if(selValue.length == 0){
	    		$('#' + sel_id).val('');
	    	}
	    }
	}).scroller('setDate',setDateTime(), true);	
	$('#'+sel_id).mobiscroll('show');
}

function createGeofence()
{
	var category = 'KeepOut';
	if($('#stay_img').hasClass('radio-select')){
		category = "Stay Within";
	}
	var iflag = 0;
	var name = $('#create_geo_name_val').val();
	var radius = $('#geofence_radius').text();
	var startDate = $('#startDate').val();
	var startTime = $('#startTime').val();
	var endDate = $('#endDate').val();
	var endTime = $('#endTime').val();
	var address = $('#inputAddressBar').val();
	var requestString = JSON.stringify({
		"name":name,
		 "address":address,
		 "radius":radius,
		 "category":category,
		 "latitude":homeLat,
		 "longitude":homeLng,
		 "startDate":startDate,
		 "startTime":startTime,
		 "endDate":endDate,
		 "endTime":endTime
	 });
	if (IsNull(name)) {
		iflag = 0;
		showPopup(
	            {
	                headText: error_title,
	                innerText: geofenceName_Null_errorMsg,
	                button1: ok_button_text,
	                popupHdlr: function()
	                {
	                	$("#createGeofence_select").val('off').slider('refresh');
	                	$('#create_geo_name_val').focus();
	                }
	            });
		return false;
	} else {
			iflag = 1;
	}
	if (IsNull(address)) {
		iflag = 0;
		showPopup(
	            {
	                headText: error_title,
	                innerText: geoAddress_Null_errorMsg,
	                button1: ok_button_text,
	                popupHdlr: function()
	                {
	                	$("#createGeofence_select").val('off').slider('refresh');	                	
	                }
	            });
		return false;
	} else {
			iflag = 1;
	}
	if(validateDates(startDate, startTime, endDate, endTime))
	{
		createGeofenceRequest(requestString);
	}
	else
	{
		$("#createGeofence_select").val('off').slider('refresh');
	}
}

function validateDates(startDate, startTime, endDate, endTime) 
{
    var errorMsg = "";
	if ((startDate == null) || (startDate == ""))
    {
	    errorMsg = invalid_startDate;
    }
	else if ((startTime == null) || (startTime == ""))
    {
	    errorMsg = invalid_startTime;
    }
	else if ((endDate == null) || (endDate == ""))
    {
        errorMsg = invalid_endDate;
    }
	else if ((endTime == null) || (endTime == ""))
    {
	    errorMsg= invalid_endTime;
    }
	if (errorMsg != "")
	{
       alert(errorMsg);
	}
	else
	{
		var start = new Date(startDate + " " + startTime);
		var end = new Date(endDate + " " + endTime);
		var now = new Date();
		var curr_Date = now.toDateString();
		var curr_Time = convertTimetoAMPM(now);
		var currFullDateStr = new Date(curr_Date + " " + curr_Time);
		console.log(start.getTime(), currFullDateStr.getTime());
		console.log(start.getTime()>=currFullDateStr.getTime());
		if(start.getTime()>=currFullDateStr.getTime()){
			if(end.getTime() > start.getTime()){
				return true;
			}
			else if(start.getTime() >= end.getTime())
			{
				showPopup(
			            {
			                headText: error_title,
			                innerText: geoFence_duration_validation_text1,
			                button1: ok_button_text,
			                popupHdlr: function()
			                {
			                	$("#createGeofence_select").val('off').slider('refresh');
			                }
			            });
			}
		}
		else
		{
			showPopup(
		            {
		                headText: error_title,
		                innerText: geoFence_duration_validation_text2,
		                button1: ok_button_text,
		                popupHdlr: function()
		                {
		                	$("#createGeofence_select").val('off').slider('refresh');
		                }
		            });
		}
	}
}

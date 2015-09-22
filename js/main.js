$(document).ready(function()
{
	allevents();
	
});

function allevents(){
	
	$('#viewmap_button').unbind();
	$('#viewmap_button').bind('click',function(){
		$('#create_geofence_screen').hide();
		loadMap(globalRadius);
		$('#viewMap_screen').show();
		$('#back').hide();
	});
	
	$('#map_submit').unbind();
	$('#map_submit').bind('click',function(){
		clickedonMap(globalMarkerLocation,true);
		$('#create_geofence_screen').show();
		$('#viewMap_screen').hide();
		isEnteredAddress = false;
		saveMapData();		
	});
	$('#map_back').bind('click',function(){
		$('#create_geofence_screen').show();
		$('#viewMap_screen').hide();
		isEnteredAddress = false;
		restoreMapData();
	});
	$('#radius_map_new').keyup(function(){
		enteredRadiusVal();
	});
	
	$(document).on('slidestop', '#createGeofence_select', function(){
		var togg = document.getElementById("createGeofence_select").value;
		if(togg=="on")
		{
			createGeofence();
		}
		else if(togg == "off")
		{
			//off function
		}
	});
	
}
function pickDate(str){
	if(str != null){
		var dateTime = convertStringToDate(str);
		return getLocalizedDateStr(dateTime);
	}
	return null;
}
function pickTime(str){
	if(str != null)
	{
		var dateTime = convertStringToDate(str);
		var timeStr = formatAMPM(dateTime);
		return timeStr;	
	}
	return null;
}

convertStringToDate = function(str)
{
    var retDate = null;
    if (str != null)
    {
    	if(str instanceof Date)
		{
			retDate = str;
		}
    	else
		{
			retDate = new Date(str);
		}
    }
   return retDate;
};

function formatNewAMPM(date)
{
	date.setMinutes(Math.ceil(date.getMinutes()/15) * 15);
	var hours = date.getHours();
	var minutes = date.getMinutes();
	var ampm = hours >= 12 ? 'PM' : 'AM';
	hours = hours % 12;
	hours = hours ? hours : 12; // the hour '0' should be '12'
	hours = ('0' + String(hours)).substr(-2);
	minutes = ('0' + String(minutes)).substr(-2);
	var strTime = hours + ':' + minutes + ' ' + ampm;
	return strTime;
}

getLocalizedDateStr = function(dateVal)
{
    if (dateVal == null || 
       !(dateVal instanceof Date))
    {
       return dateVal;
    }
    var str = dateVal.toDateString();
    str = str.replace(dateVal.toString().split(" ")[0], shortDayNames[dateVal.getDay()]);
    str = str.replace(dateVal.toString().split(" ")[1], shortMonthNames[dateVal.getMonth()]);
    if(navigator.language.search('en') == 0)
    {
    	str = getNewFormatDate(str);
    }
    return str;
};

getNewFormatDate = function(dateVal)
{
	var str = dateVal.split(' ');
	var newStr = '';
	newStr = newStr+ str[0];
	newStr = newStr+", ";
	newStr = newStr+str[1];
	newStr = newStr+". ";
	newStr = newStr+str[2];
	newStr = newStr+", ";
	newStr = newStr+str[3];
	return newStr;
};

function formatAMPM(date)
{
	var hours = date.getHours();
	var minutes = date.getMinutes();
	var ampm = hours >= 12 ? 'PM' : 'AM';
	hours = hours % 12;
	hours = hours ? hours : 12; // the hour '0' should be '12'
	hours = ('0' + String(hours)).substr(-2);
	minutes = ('0' + String(minutes)).substr(-2);
	var strTime = hours + ':' + minutes + ' ' + ampm;
	return strTime;
}

function GetTimezoneShort(now)
{
	if(now==null)
		return '';
	var str = now.toString();
    // Split on the first ( character
    var s = str.split("(");
    if (s.length == 2)
    {
    	// remove the ending ')'
    	var n = s[1].replace(")", "");
    	return n;
    }
}
function pickNewTime(str){
	if(str != null && str != "")
	{
		var dateTime = convertStringToDate(str);
		var timeStr = formatNewAMPM(dateTime);
		return timeStr;	
	}
	return null;
}
function formatNewAMPM(date)
{
	date.setMinutes(Math.ceil(date.getMinutes()/15) * 15);
	var hours = date.getHours();
	var minutes = date.getMinutes();
	var ampm = hours >= 12 ? 'PM' : 'AM';
	hours = hours % 12;
	hours = hours ? hours : 12; // the hour '0' should be '12'	
	hours = ('0' + String(hours)).substr(-2);
	minutes = ('0' + String(minutes)).substr(-2);
	var strTime = hours + ':' + minutes + ' ' + ampm;
	return strTime;
}

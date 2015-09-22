var NOTIFICATION_KEY = 'notification';
var notificationsHashTable = {};
function populateNofiticationList(data)
{
	var listHeight = window.innerHeight - 150;
	$('#notifications_list').css({'height':listHeight,'min-height':listHeight,'overflow-y':'auto'});
	$('#header_txt').text(notifications_text);
	$('#notifications_list ul').html('');
	$("#notifications_list").show();
	$("#notifications_details").hide();
	$('#back').show();
	if(data != null)
	{
        var items = [];
        var list = "list" ;
        var a_start = '<a href="#" >';
        var a_end = "</a>";
        var readNotification = "<div class='list-default'></div>";
        var unreadNotification = "<div class='list-highlight'></div>";
        var arrow_selection = "<div class='arrow-unselect'><img /></div>";
        if (data != null && data.length > 0)
        {
        	$.each(data, function(i, listitem)
            {
                var listHightlightClass = isNotificationRead(listitem['notificationMsgId']) ? readNotification
                                                                            : unreadNotification;
                items.push('<li id="'+ listitem['notificationMsgId'] +'" class="'+ list +'">'+ 
                   listHightlightClass +'<div>' + a_start + listitem['serviceType'] + '<br>' +
                   pickDate(listitem['notificationCreateDate'])+"  "+pickTime(listitem['notificationCreateDate'])+" "+GetTimezoneShort(new Date())+a_end + '</div>'+ arrow_selection +'</li>');
                notificationsHashTable[listitem['notificationMsgId']] = listitem;
            });
            var ul_exists = $('#notifications_list ul').length;
            if(ul_exists){
            	var listItems = items.join('');
            	$(listItems).appendTo('#notifications_list ul');
            }
            else {
            	$('<ul/>', {
                    html: items.join('')
                    }).appendTo('#notifications_list');
            }
            $("#notifications_list ul li").bind('click',function(){
                var selectedNotificationId = $(this).attr('id');
                markNotificationRead(selectedNotificationId);
                $(this).find('div[class="list-highlight"]').removeClass('list-highlight').addClass('list-default');
                $("#notifications_list").hide();
                $("#notifications_details").show();
                populateNotificationDetails(data, selectedNotificationId);
            });
        }
        
        $('#backto_notificationslist, #notification_name').click(function(){
        	$("#notifications_list").show();
            $("#notifications_details").hide();
            $('#back').show();
        });
	}
}

function populateNotificationDetails(wholeNotificationList, selectedNotificationId)
{
	$('#back').hide();
	var selecteditem = notificationsHashTable[selectedNotificationId];
    if (selecteditem != null)
    {
        $('#notification_name').html(selecteditem['serviceType'] + "<br>" +
        		pickDate(selecteditem['notificationCreateDate'])+"  "+pickTime(selecteditem['notificationCreateDate'])+" "+GetTimezoneShort(new Date()));
        $('#notification_content').html(selecteditem['notificationMessage']);
    }
}

function isNotificationRead(notificationId)
{
    if (typeof(Storage) !== "undefined")
    {
        return localStorage.hasOwnProperty(NOTIFICATION_KEY + notificationId);
    }
    return false;
}

function markNotificationRead(notificationId)
{
	if (typeof(Storage) !== "undefined")
    {
        var notifyId = NOTIFICATION_KEY + notificationId;
        if (!isNotificationRead(notifyId))
        {
            localStorage.setItem(notifyId, true);
        }
    }
}
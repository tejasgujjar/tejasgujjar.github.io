$(document).ready(function(){
	loginPageSetup();
	$('#login').unbind();
	$('#login').bind('click',function(){
		checkLogin();
	});
	$('#reset').unbind();
	$('#reset').bind('click',function(){
		$('#username').val("");
		$('#password').val("");
	});
});
function loginPageSetup()
{
	$('#username').attr("placeholder", username);
	$('#password').attr("placeholder", password);
}

function checkLogin() 
{
    username = document.getElementById('username').value.trim();
    password = document.getElementById('password').value.trim();
    var msg = '';
    var focusField = '';
    if (username == '') 
    {
        msg = userid_emtymsg+'\n';
        focusField = 'username';
    }
    else
    {
        focusField = 'username';
        var str = username;
        var at="@";
        var dot=".";
        var lat = str.indexOf(at);
        var lstr = str.length;
        if ((str.indexOf(at)==-1) ||
             (str.indexOf(at)==-1 || str.indexOf(at)==0 || str.indexOf(at)==lstr) ||
             (str.indexOf(dot)==-1 || str.indexOf(dot)==0 || str.indexOf(dot)==lstr) ||
             (str.indexOf(at,(lat+1))!=-1) ||
             (str.substring(lat-1,lat)==dot || str.substring(lat+1,lat+2)==dot) ||
             (str.indexOf(dot,(lat+2))==-1) ||
             (str.indexOf(" ")!=-1))
        {
            showPopup(
                    {
                        headText: error_title,
                        innerText: invalid_email_id,
                        button1: ok_button_text,
                        popupHdlr: 
                            function(data)
                            {
                                document.getElementById(focusField).focus();
                            }
                    });
            return false;
        }
    }
    
    if ((username != '') && (password == '')) 
    {
        msg = please_enter_password;
        focusField = 'password';
    }
    if (msg != '') 
    {
        showPopup(
                {
                    headText: error_title,
                    innerText: msg,
                    button1: ok_button_text,
                    popupHdlr: 
                        function(data)
                        {
                            document.getElementById(focusField).focus();
                        }
                });
    } 
    else 
    {
        makeLoginReq(username, password);
    	//window.location = "main.html";
    }
}
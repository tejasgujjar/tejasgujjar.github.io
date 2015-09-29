(function()
{
    var mBlockUICount = 0;
    blockUI = function(messageObj)
    {
        console.log("In blockUI");
        console.log(messageObj);
        $.blockUI(messageObj);
        mBlockUICount++;
    };

    unblockUI = function()
    {
        console.log("In unblockUI");
        if (mBlockUICount > 0)
        {
            mBlockUICount--;
        }
        if (mBlockUICount == 0)
        {
            $.unblockUI();
        }
    };

    getBlockUICount = function()
    {
        return mBlockUICount;
    };
    
	var mDefaultButton = null;

    showPopup = function(opts)
    {
    	console.log("Showing pop up");
        // This function has alerts for debugging purposes. Do not remove them.
        if (opts === undefined)
        {
            alert("showPopup:: Specify options");
        }
        else if (opts.headText === undefined || typeof opts.headText != 'string')
        {
            alert("showPopup:: Specify text for headText");
        }
        else if (opts.innerText === undefined || typeof opts.innerText != 'string')
        {
            alert("showPopup:: Specify text for innerText");
        }
        else if (opts.button1 === undefined || typeof opts.button1 != 'string')
        {
            alert("showPopup:: Specify text for button1");
        }
        else if (opts.button2 !== undefined && typeof opts.button2 != 'string')
        {
            alert("showPopup:: Specify text for button2");
        }
        else if ((opts.popupHdlr !== undefined && typeof opts.popupHdlr != 'function') ||
                 (opts.button2 !== undefined && opts.popupHdlr === undefined))
        {
            alert("showPopup:: Specify function for popupHdlr");
        }
        else if (opts.button1 !== undefined && opts.button2 !== undefined &&
                 ((opts.defaultBtn === undefined) || 
                   (opts.defaultBtn != opts.button1 && opts.defaultBtn != opts.button2) ))
        {
            alert("showPopup:: Specify text for default button from one of the 2 buttons");
        }
        else
        {
            button1Txt = (opts.button1Txt === undefined) ? opts.button1: opts.button1Txt;
            button2Txt = (opts.button2Txt === undefined) ? opts.button2: opts.button2Txt;
            opts.defaultBtn = (opts.defaultBtn !== undefined) ? opts.defaultBtn : opts.button1;
            createPopup(opts.headText, opts.innerText, opts.button1, button1Txt,
                        opts.button2, button2Txt, opts.popupHdlr, opts.defaultBtn);
        }
    };

    delegateBackEventToPopup= function()
    {
        if (mDefaultButton != null)
        {
            $('#' + mDefaultButton). trigger('click');
            return true;
        }
        return false;
    };

    // Hiding the createPopup implementation, so that showPopup is used everywhere and not this function.
    function createPopup(headText, innerText, button1, button1Txt, 
                         button2, button2Txt, popupHandlerFunc, defaultBtn)
    {
        var POPUP_DELAY = 500;

        mDefaultButton = defaultBtn;
        $('#popup_head').html(headText);
        $('#popup_text').html(innerText);
        $('#popup_buttons').html("");
        var button = "<input type='button' data-role='none' class='black-button medium-txt' />";

        function evtHandler(btnText)
        {
            mDefaultButton = null;
            $("#commonPopup_popup").popup('close');
            $('#commonPopup_popup').css('display','none');
            $.unblockUI();
            // A hacky way to support multiple modal dialog is to add a delay
            setTimeout(function()
            {
                if (popupHandlerFunc != null)
                {
                    popupHandlerFunc.apply(undefined, [btnText]);
                }
            }, POPUP_DELAY); 
        }

        if (button1 != null)
        {
            $(button).attr('id',button1).val(button1Txt).appendTo('#popup_buttons');
            $('#'+button1).unbind();
            $('#'+button1).bind('click',function()
                {
                    evtHandler(button1Txt);
                });
        }
        if (button2 != null)
        {
            $(button).attr('id',button2).val(button2Txt).appendTo('#popup_buttons');
            $('#'+button2).unbind();
            $('#'+button2).bind('click',function()
                {
                    evtHandler(button2Txt);
                });
        }
        $('#commonPopup_popup').css('display','block');
        $.blockUI({message:$('#commonPopup_popup'),css:{background:'none',border:'none',
            textAlign:'center',width:'90%',left:'4%'}});
    }
}());

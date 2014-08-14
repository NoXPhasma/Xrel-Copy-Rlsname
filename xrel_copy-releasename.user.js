// ==UserScript==
// @name			xrel copy rlsname
// @namespace			NoXPhasma
// @author			NoXPhasma
// @version			1.3.3
// @description			This Script helps to copy RLS names from xrel.to
// @source 			https://github.com/NoXPhasma/Xrel-Copy-Rlsname
// @include			http://www.xrel.to/*
// @require			https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @updateURL			https://github.com/NoXPhasma/Xrel-Copy-Rlsname/raw/master/xrel_copy-releasename.user.js
// @downloadURL			https://github.com/NoXPhasma/Xrel-Copy-Rlsname/raw/master/xrel_copy-releasename.user.js
// @date 			2014-06-15
// ==/UserScript==

// ---------- Cookie Functions -----------------------------------------------------------------------------------------
//
function setCookie(name,value,days)
{
    if (days)
    {
        var date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        var expires = "; expires="+date.toGMTString();
    }
    else var expires = "";
    document.cookie = name+"="+value+expires+"; path=/";
}

function getCookie(name)
{
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++)
    {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function deleteCookie(name) { setCookie(name,"",-1); }
//
// ---------- Cookie Functions -----------------------------------------------------------------------------------------

// ---------- xrel copy rlsname Script --------------------------------------------------------------------------------
//
$.noConflict();

jQuery("head").append("<style type=\"text/css\" charset=\"utf-8\">"
    +".google{"
        +"cursor:pointer;"
        +"width:11px;"
        +"height:12px !important;"
        +"color:#000;"
        +"background:#59cbef;"
        +"background:#59cbef -moz-linear-gradient(top,#ADE5F7,#59CBEF);"
        +"background:#59cbef #ddd -webkit-linear-gradient(top,#ADE5F7,#59CBEF);"
        +"background:#59cbef #ddd -o-linear-gradient(top,#ADE5F7,#59CBEF);"
        +"position:absolute;"
        +"margin-top:-1px;"
        +"margin-left:-1px;"
        +"margin-bottom:-2px;"
        +"display:inline-block"
        +"font-family:monospace;"
        +"font-size:13px;"
        +"padding:2px 0 0 2px;"
        +"line-height:12px;"
        +"border:1px solid #089DCB"
    +"}"
    +".showrls{"
        +"padding:0px 2px;"
        +"width:688px;"
        +"border:0px;"
        +"font-size:11px;"
        +"background:none;"
        +"text-shadow:0px 0px 1px #eee;"
        +"margin-top:2px;"
        +"position:absolute;"
        +"margin-left:16px;"
        +"height:11px"
    +"}"
    +".shdiv{"
        +"background:#ddd;"
        +"background:#ddd -moz-linear-gradient(top,#eee,#ccc);"
        +"background:#ddd -webkit-linear-gradient(top,#eee,#ccc);"
        +"background:#ddd -o-linear-gradient(top,#eee,#ccc);"
        +"height:16px;"
        +"margin:0 0 -1px -120px;"
        +"width:708px;"
        +"display:none;"
        +"border:1px solid #bbb;"
        +"height:14px"
    +"}"
    +".clickme{"
        +"display:inline-block;"
        +"color:#000;"
        +"background:#bede78;"
        +"background:-moz-linear-gradient(top,#DFF1B6,#BEDE78);"
        +"background:#ddd -webkit-linear-gradient(top,#DFF1B6,#BEDE78);"
        +"background:#ddd -o-linear-gradient(top,#DFF1B6,#BEDE78);"
        +"cursor:pointer;"
        +"padding:0 0 1px 3px !important;"
        +"width:7px;"
        +"line-height:12px;"
        +"height:9px !important;"
        +"border:1px solid #87A93E;"
        +"font-family:monospace;"
        +"font-size:8px"
    +"}"
    +"#xrel_header{"
        +"position:relative;"
        +"z-index:1!important;"
    +"}"
    +"#XCRoptions{"
        +"display:none;"
        +"position:absolute !important;"
        +"z-index:100 !important;"
        +"background:linear-gradient(top,#F2F2F2,#F8F8F8);"
        +"background:-moz-linear-gradient(top,#F2F2F2,#F8F8F8);"
        +"background:-webkit-linear-gradient(top,#F2F2F2,#F8F8F8);"
        +"background:-o-linear-gradient(top,#F2F2F2,#F8F8F8);"
        +"top:30px;"
        +"margin-left:-50px;"
        +"left:1;"
        +"padding:0 5px;"
        +"border:1px solid #D9D9D9;"
        +"border-right:0px;"
        +"font-size:12px"
    +"}"
    +"#XCRoptions #setfilter{"
        +"position:relative;"
        +"top:2px"
    +"}"
    +"#XCRoptions .l{"
        +"float:left;"
        +"width:100px"
    +"}"
    +"#XCRoptions .r{"
        +"float:right;"
        +"width:90px;"
        +"text-align:right"
    +"}"
    +"#XCRoptions #savefilter{"
        +"font-size:12px"
    +"}"
    +"#XCRoptions textarea{"
        +"width:252px;" 
        +"height:93px;"
        +"border:1px solid #aaa;"
        +"border-radius:4px;"
        +"padding:2px"
    +"}"
    +"#XCRoptions #saved{"
        +"opacity:0;"
        +"font-size:10px;"
    +"}"
    +"#XCR{"
        +"cursor:pointer"
    +"}"
+"</style>");

// ---------- google search filter --------------------------------------------------------------------------------
//
var isfilter = getCookie('filter');
var isdomain = getCookie('domains');

var domaindata = '';
var filact = '';
var gfilter = '';

if (isfilter)
    filact = ' checked';

if (isdomain != undefined)
    domaindata = isdomain.replace(/#/g, "\r\n");
    domaindata = domaindata.trim();

if (isfilter && isdomain != undefined)
{
    domainar = isdomain.split("#"); 
    domainar.forEach(function(entry)
    {
        gfilter = gfilter+"+-"+entry;
    });
}

jQuery('#top_bar div[style*="float:right;"]').prepend('<span id="XCR" class="span_padding" title="xrel copy rlsname Options">XCR</span>'
    +'<span id="XCRoptions">'
        +'<div>'
            +'<div class="l">'
                +'<input type="checkbox" value="1" id="setfilter" title="Activate Filter on Google search?"'+ filact +'> Activate filter?'
            +'</div>'
            +'<div class="r">'
                +'<span id="saved">Saved </span>'
                +'<button id="savefilter">Save</button>'
            +'</div>'
            +'<div style="clear:both"></div>'
        +'</div>'
        +'<textarea title="Add Domains you want to be filtered\non Google search. One entry per line." id="filterdomains">'+ domaindata +'</textarea>'
    +'</span>'
);

jQuery('#XCR').click(function() {jQuery( "#XCRoptions" ).slideToggle( "slow");});

jQuery('#savefilter').on( "click", function()
{
    if ( jQuery('#setfilter').is(':checked') )
        var filter = 1;
    else
        var filter = 0;

    var domains = jQuery("#filterdomains").val();
    var domains = domains.replace(/\r\n/g, "#"); 
    var domains = domains.replace(/\n/g, "#");

    setCookie('filter',filter,365);
    setCookie('domains',domains,365);
    
    jQuery('#XCRoptions #saved').animate({opacity: 1.00}, 400).delay(700).animate({opacity: 0.00}, 400);
});
//
// ---------- google search filter --------------------------------------------------------------------------------

jQuery('.nfo_title').attr({title: 'click to mark rlsname'});
jQuery('.nfo_title').click(function() {var shortSelector = jQuery('.nfo_title .sub').selectText();});
jQuery('.release_title').prepend('<span class="clickme" title="click to show rlsname">R</span>');
jQuery('.release_title_p2p').prepend('<span class="clickme" title="click to show rlsname">R</span>');
jQuery('.clickme').click(function() {var y = jQuery(this).attr('id');jQuery('#b'+y).slideToggle(0);});

jQuery('.release_title').mouseover(function()
{
	var uid = new Date().getTime();
	if (jQuery(this).attr("active") == undefined)
    {
		jQuery(this).find('.clickme').attr('id', uid);
		var b = jQuery(this).find('.truncd').attr('id');
		if (b == undefined)
        {
			b = jQuery(this).find('.sub_link span').html();
            jQuery(this).append(
                '<div id="b'+uid+'" class="shdiv">'
                    +'<span class="google" onclick="window.open(\'http://www.google.de/search?q=&quot;'+b+'&quot;'+gfilter+'\');" title="click to search with google">G</span>'
                    +'<input id="a'+uid+'" class="showrls" onmouseover="select(this.value);" value="'+b+'" />'
                +'</div>'
            );
            jQuery(this).attr("active", true);
		}
        else
        {
			var a = jQuery('#'+b).attr("title");
            if(a == '')
            {
                a = jQuery(this).find('.sub_link span').html();
            }
            jQuery(this).append(
                '<div id="b'+uid+'" class="shdiv">'
                    +'<span id="b'+uid+'" class="google" title="click to search with google" onclick="window.open(\'http://www.google.de/search?q=&quot;'+a+'&quot;'+gfilter+'\');">G</span>'
                    +'<input id="a'+uid+'" class="showrls" onmouseover="select(this.value);" value="'+a+'" />'
                +'</div>'
            );
            jQuery(this).attr("active", true);
		}
	}
});

jQuery('.release_title_p2p').mouseover(function()
{
	var uid = new Date().getTime();
	if (jQuery(this).attr("active") == undefined)
    {
		jQuery(this).find('.clickme').attr('id', uid);
		var b = jQuery(this).find('.truncd').attr('id');
		if (b == undefined)
        {
			b = jQuery(this).find('.sub_link span').html();
            jQuery(this).append(
                '<div id="b'+uid+'" class="shdiv">'
                    +'<span class="google" onclick="window.open(\'http://www.google.de/search?q=&quot;'+b+'&quot;'+gfilter+'\');" title="click to search with google">G</span>'
                    +'<input id="a'+uid+'" class="showrls" onmouseover="select(this.value);" value="'+b+'" />'
                +'</div>'
            );jQuery(this).attr("active", true);
		}
        else
        {
			var a = jQuery('#'+b).attr("title");
            var a = jQuery('#'+b).attr("title");
            if(a == '')
            {
                a = jQuery(this).find('.sub_link span').html();
            }
            jQuery(this).append(
                '<div id="b'+uid+'" class="shdiv">'
                    +'<span id="b'+uid+'" class="google" title="click to search with google" onclick="window.open(\'http://www.google.de/search?q=&quot;'+a+'&quot;'+gfilter+'\');">G</span>'
                    +'<input id="a'+uid+'" class="showrls" onmouseover="select(this.value);" value="'+a+'" />'
                +'</div>'
            );
            jQuery(this).attr("active", true);
		}
	}
});
//
// ---------- xrel copy rlsname Script --------------------------------------------------------------------------------

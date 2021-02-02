/* eslint-disable no-undef */
// ==UserScript==
// @name            xrel copy rlsname
// @namespace       xcr
// @author          NoXPhasma
// @version         1.4.0
// @description     This Script helps to copy RLS names from xrel.to
// @source          https://github.com/NoXPhasma/Xrel-Copy-Rlsname
// @include         http*://www.xrel.to/*
// @require         https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @updateURL       https://github.com/NoXPhasma/Xrel-Copy-Rlsname/raw/master/xrel_copy-releasename.user.js
// @downloadURL     https://github.com/NoXPhasma/Xrel-Copy-Rlsname/raw/master/xrel_copy-releasename.user.js
// @icon		        https://www.xrel.to/favicon.ico
// @date            2021-02-02
// @grant           none
// @inject-into     auto
// ==/UserScript==

// ---------- Cookie Functions -----------------------------------------------------------------------------------------
//
function setCookie (name, value, days) {
  let expires = ''
  if (days) {
    const date = new Date()
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000))
    expires = '; expires=' + date.toGMTString()
  }
  document.cookie = name + '=' + value + expires + '; path=/'
}

function getCookie (name) {
  const nameEQ = name + '='
  const ca = document.cookie.split(';')
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) === ' ') c = c.substring(1, c.length)
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
  }
  return null
}

// function deleteCookie(name) { setCookie(name,"",-1); }
//
// ---------- Cookie Functions -----------------------------------------------------------------------------------------

// ---------- xrel copy rlsname Script --------------------------------------------------------------------------------
//
// eslint-disable-next-line no-undef
$.noConflict()

jQuery('head').append('<style type="text/css" charset="utf-8">' +
    '.google{' +
        'cursor:pointer;' +
        'width:11px;' +
        'height:12px !important;' +
        'color:#000;' +
        'background:#59cbef;' +
        'background:#59cbef -moz-linear-gradient(top,#ADE5F7,#59CBEF);' +
        'background:#59cbef #ddd -webkit-linear-gradient(top,#ADE5F7,#59CBEF);' +
        'background:#59cbef #ddd -o-linear-gradient(top,#ADE5F7,#59CBEF);' +
        'position:absolute;' +
        'margin-top:-1px;' +
        'margin-left:-1px;' +
        'margin-bottom:-2px;' +
        'display:inline-block' +
        'font-family:monospace;' +
        'font-size:13px;' +
        'padding:2px 0 0 2px;' +
        'line-height:12px;' +
        'border:1px solid #089DCB' +
    '}' +
    '.showrls{' +
        'padding:0px 2px;' +
        'width:688px;' +
        'border:0px;' +
        'font-size:11px;' +
        'color:#bbb;' +
        'background:none;' +
        'text-shadow:0px 0px 0px #eee;' +
        'margin-top:2px;' +
        'position:absolute;' +
        'margin-left:16px;' +
        'height:11px' +
    '}' +
    '.shdiv{' +
        'background:#353944;' +
        'height:16px;' +
        'margin:0 0 -1px -120px;' +
        'width:708px;' +
        'display:none;' +
        'border:1px solid #21252b;' +
        'height:14px' +
    '}' +
    '.dirname-truncated{height:16px}' +
    '.release_title_p2p .shdiv{' +
        'background:#353944;' +
        'height:16px;' +
        'margin:0 0 -1px -120px;' +
    '}' +
    '.clickme{' +
        'display:inline-block;' +
        'color:#000;' +
        'background:#bede78;' +
        'background:-moz-linear-gradient(top,#DFF1B6,#BEDE78);' +
        'background:#ddd -webkit-linear-gradient(top,#DFF1B6,#BEDE78);' +
        'background:#ddd -o-linear-gradient(top,#DFF1B6,#BEDE78);' +
        'cursor:pointer;' +
        'padding:0 0 1px 3px !important;' +
        'width:7px;' +
        'line-height:12px;' +
        'height:9px !important;' +
        'border:1px solid #87A93E;' +
        'font-family:monospace;' +
        'font-size:8px' +
    '}' +
    '#xrel_header{' +
        'position:relative;' +
        'z-index:1!important;' +
    '}' +
    '#XCRoptions{' +
        'display:none;' +
        'position:absolute !important;' +
        'z-index:100 !important;' +
        'background:#2f343f;' +
        'top:30px;' +
        'margin-left:-65px;' +
        'left:1;' +
        'padding:0 5px;' +
        'border:1px solid #21252b;' +
        'font-size:12px' +
    '}' +
    '#XCRoptions #setfilter{' +
        'position:relative;' +
        'top:2px' +
    '}' +
    '#XCRoptions .l{' +
        'float:left;' +
        'width:100px' +
    '}' +
    '#XCRoptions .r{' +
        'float:right;' +
        'width:90px;' +
        'text-align:right' +
    '}' +
    '#XCRoptions #savefilter{' +
        'font-size:12px' +
    '}' +
    '#XCRoptions textarea{' +
        'width:252px;' +
        'height:93px;' +
        'border:1px solid #aaa;' +
        'border-radius:4px;' +
        'padding:2px' +
    '}' +
    '#XCRoptions #saved{' +
        'opacity:0;' +
        'font-size:10px;' +
    '}' +
    '#XCR{' +
        'cursor:pointer' +
    '}' +
'</style>')

// ---------- google search filter --------------------------------------------------------------------------------
//
const isfilter = getCookie('filter')
const isdomain = getCookie('domains')

let domaindata = ''
let filact = ''
let gfilter = ''

if (isfilter === '1') { filact = ' checked' }
if (isdomain !== undefined) { domaindata = isdomain.replace(/#/g, '\r\n') }
domaindata = domaindata.trim()

if (isfilter && isdomain !== undefined) {
  domainar = isdomain.split('#')
  domainar.forEach(function (entry) {
    gfilter = gfilter + '+-' + entry
  })
}

jQuery('#top_bar div[style*="float:right;"]').prepend('<span id="XCR" class="span_padding" title="xrel copy rlsname Options">XCR</span>' +
    '<span id="XCRoptions">' +
        '<div>' +
            '<div class="l">' +
                '<input type="checkbox" value="1" id="setfilter" title="Activate Filter on Google search?"' + filact + '> Activate filter?' +
            '</div>' +
            '<div class="r">' +
                '<span id="saved">Saved </span>' +
                '<button id="savefilter">Save</button>' +
            '</div>' +
            '<div style="clear:both"></div>' +
        '</div>' +
        '<textarea title="Add Domains you want to be filtered\non Google search. One entry per line." id="filterdomains">' + domaindata + '</textarea>' +
    '</span>'
)

jQuery('#XCR').click(function () { jQuery('#XCRoptions').slideToggle('slow') })

jQuery('#savefilter').on('click', function () {
  if (jQuery('#setfilter').is(':checked')) {
    setCookie('filter', 1, 365)
  } else {
    setCookie('filter', 0, 365)
  }

  let domains = jQuery('#filterdomains').val()
  domains = domains.replace(/\r\n/g, '#')
  domains = domains.replace(/\n/g, '#')

  setCookie('domains', domains, 365)

  jQuery('#XCRoptions #saved').animate({ opacity: 1.00 }, 400).delay(700).animate({ opacity: 0.00 }, 400)
})
//
// ---------- google search filter --------------------------------------------------------------------------------

jQuery('.release_title').prepend('<span class="clickme" title="click to show rlsname">R</span>')
jQuery('.release_title_p2p').prepend('<span class="clickme" title="click to show rlsname">R</span>')
jQuery('.clickme').click(function () { const y = jQuery(this).attr('id'); jQuery('#b' + y).slideToggle(0) })

jQuery('.release_title').mouseover(function () {
  const uid = new Date().getTime()
  if (jQuery(this).attr('active') === undefined) {
    jQuery(this).find('.clickme').attr('id', uid)
    let b = jQuery(this).find('.truncd').attr('id')
    if (b === undefined) {
      b = jQuery(this).find('a.sub').attr('title')
      if (b === undefined) {
        b = jQuery(this).find('a.sub').html()
      }
      jQuery(this).append(
        '<div id="b' + uid + '" class="shdiv">' +
            '<span class="google" onclick="window.open(\'http://www.google.de/search?q=&quot;' + b + '&quot;' + gfilter + '\');" title="click to search with google">G</span>' +
            '<input id="a' + uid + '" class="showrls" onmouseover="select(this.value);" value="' + b + '" />' +
        '</div>'
      )
      jQuery(this).attr('active', true)
    } else {
      let a = jQuery('#' + b).attr('title')
      a = jQuery(this).find('a.sub').html()
      if (a === undefined) {
        a = jQuery(this).find('a.sub').attr('title')
      }
      if (a === '') {
        a = jQuery(this).find('a.sub').html()
      }
      jQuery(this).append(
        '<div id="b' + uid + '" class="shdiv">' +
            '<span id="b' + uid + '" class="google" title="click to search with google" onclick="window.open(\'http://www.google.de/search?q=&quot;' + a + '&quot;' + gfilter + '\');">G</span>' +
            '<input id="a' + uid + '" class="showrls" onmouseover="select(this.value);" value="' + a + '" />' +
        '</div>'
      )
      jQuery(this).attr('active', true)
    }
  }
})

jQuery('.release_title_p2p').mouseover(function () {
  const uid = new Date().getTime()
  if (jQuery(this).attr('active') === undefined) {
    jQuery(this).find('.clickme').attr('id', uid)

    let b = jQuery(this).find('.truncd').attr('id')
    if (b === undefined) {
      b = jQuery(this).find('a.sub').attr('title')
      if (b === undefined) {
        b = jQuery(this).find('a.sub').html()
      }
      jQuery(this).append(
        '<div id="b' + uid + '" class="shdiv">' +
            '<span class="google" onclick="window.open(\'http://www.google.de/search?q=&quot;' + b + '&quot;' + gfilter + '\');" title="click to search with google">G</span>' +
            '<input id="a' + uid + '" class="showrls" onmouseover="select(this.value);" value="' + b + '" />' +
        '</div>'
      ); jQuery(this).attr('active', true)
    } else {
      let a = jQuery('#' + b).attr('title')
      if (a === '') {
        a = jQuery(this).find('.sub_link span').html()
      }
      jQuery(this).append(
        '<div id="b' + uid + '" class="shdiv">' +
            '<span id="b' + uid + '" class="google" title="click to search with google" onclick="window.open(\'http://www.google.de/search?q=&quot;' + a + '&quot;' + gfilter + '\');">G</span>' +
            '<input id="a' + uid + '" class="showrls" onmouseover="select(this.value);" value="' + a + '" />' +
        '</div>'
      )
      jQuery(this).attr('active', true)
    }
  }
})
//
// ---------- xrel copy rlsname Script --------------------------------------------------------------------------------

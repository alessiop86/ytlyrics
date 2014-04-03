var localpath = '';
localpath = 'https://yt-lyrics.appspot.com/';
/*localpath = 'http://localhost:8080/';*/

var language_pack = {
    'localpath': localpath + 'en/',
    'iemessage': "YTLyrics is not compatible with Internet Explorer < 9.0. Please update your browser.",
    'reportbug': 'Report a bug',
    'suggestions': 'Suggerimenti',
    'credits': 'Credits',
    'loading': ' Loading ',
    'searchlyrics': 'Search lyrics',
    'artist': 'Artist',
    'song': 'Song',
    'nolyricsfound1': ' No lyrics found for: "',
    'nolyricsfound2': '" (song title) and "',
    'nolyricsfound3': ' "(artist). ',
    'modifysearch': 'You can modify the research if the detected artist or the song name are wrong:<br/>'



};

function trim1(str) {
    return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}

function capitaliseFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


/*prima esecuzione*/
if (window.myBookmarklet === undefined) {

    var rv = 10.0;
    var ua = navigator.userAgent;
    var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
    if (re.exec(ua) != null)
        rv = parseFloat(RegExp.$1);

    if (rv < 9) {
        alert(language_pack.iemessage)
    }
    else {


        //carico il css esterno
        var fileref = document.createElement("link");
        fileref.setAttribute("rel", "stylesheet");
        fileref.setAttribute("type", "text/css");
        fileref.setAttribute("href", localpath + "resources/bookmarklet.css");

        document.getElementsByTagName("head")[0].appendChild(fileref);

        // the minimum version of jQuery we want
        var v = "1.9.1";

        // check prior inclusion and version
        if (window.jQuery === undefined || window.jQuery.fn.jquery < v) {
            var done = false;
            var script = document.createElement("script");
            script.src = "https://ajax.googleapis.com/ajax/libs/jquery/" + v + "/jquery.min.js";
            script.onload = script.onreadystatechange = function () {
                if (!done && (!this.readyState || this.readyState == "loaded" || this.readyState == "complete")) {
                    done = true;
                    initialization();
                }
            };

            document.getElementsByTagName("head")[0].appendChild(script);

        }
        else {

            initialization();

        }

    }
}


function initialization() {



    /*inizializzazione grafica */
    var newDiv = $('<div id="bookmarklet_yt2_container" class="bookmarklet_yt2">');
    $('body').append(newDiv);


    var header_bookmarklet_div = '<button type="button" class="close" id="bookmarklet_yt_button">×</button><a href="' + localpath + '" target="_blank"><img src="' + localpath + 'resources/logo.png" alt="yt lyrics" /></a>';
    header_bookmarklet_div += "<div id='bookmarklet_yt2_content'></div>";
    header_bookmarklet_div += '<div class="ytlinksbar"><div class="small" id="bookmarklet_yt_increasefont"><button class="close">+</button></div><div class="small notfirst" id="bookmarklet_yt_reducefont"><button class="close" style="margin-top:-3px">-</button></div><div class="small notfirst"><a href="https://www.facebook.com/pages/YTLyrics/425290784236106" target="_blank"><img src="' + localpath + 'resources/facebook-icon.png" style="height:16px;" /></a></div><div class="small notfirst"><a href="' + language_pack.localpath + '#credits" target="_blank">' + language_pack.credits + '</a></div><div class="small notfirst" ><a href="' + language_pack.localpath + '#new-features-and-bug-report" target="_blank">' + language_pack.suggestions + '</a></div><div class="small notfirst"><a href="' + language_pack.localpath + '#new-features-and-bug-report" target="_blank">' + language_pack.reportbug + '</a></div></div>';


    $('#bookmarklet_yt2_container').html(header_bookmarklet_div);


    $('#bookmarklet_yt_button').click(function () {

        $("#bookmarklet_yt2_container").hide();

    });

    $('#bookmarklet_yt_increasefont').click(function () {

        ytLyricsChangeFontSize(2);


    });
    $('#bookmarklet_yt_reducefont').click(function () {

        ytLyricsChangeFontSize(-2);


    });


    ytLyricsFetchContent();


}

function ytLyricsFetchContent() {
    (window.myBookmarklet = function () {

        $("#bookmarklet_yt2_container").show();

        var url_site = document.baseURI;
        var stringa_title = document.title;

        if (url_site.match(/youtube/)) {


            stringa_title = stringa_title.replace(/\([^\)]*\)/g, "");
            stringa_title = stringa_title.replace(/\[[^\]]*\]/g, "");
            stringa_title = stringa_title.replace(/M\/V/, "");
            stringa_title = stringa_title.replace(/\- YouTube/, "");
            stringa_title = stringa_title.replace(/▶/, "");

            var youtube_details = stringa_title.split("-");


            var artist = youtube_details[0];
            var title;
            if (youtube_details[1] === undefined)
                title = "";
            else
                title = youtube_details[1];


            ytlyricsDoSearch(artist, title);

        }
        /* demo support for grooveshark */
        else if (url_site.match(/grooveshark/)) {

            var myRegex = /^(?:▶ )?"(.*)" by (.*) (?:on "(.*))?(?:- Profile)? - Grooveshark$/;
            var match = myRegex.exec(stringa_title);

            if (match !== null)
                ytlyricsDoSearch(match[2], match[1]);
        }

        else {
            showSearchForm("","");
        }


    })();
}


function ytLyricsChangeFontSize(amount) {
    var currentSize = $('#bookmarklet_yt2_inner_content_lyrics').css("font-size").replace("px", "");
    var newSize = amount + parseInt(currentSize);
    $('#bookmarklet_yt2_inner_content_lyrics').css("font-size", newSize + "px");
}


function ytLyricsFormSearch2() {

    ytlyricsDoSearch($("#ytlyricsartist").val(), $("#ytlyricstitle").val(), true);

}

function ytlyricsDoSearch(artist, title) {


    $("#bookmarklet_yt2_container").show();
    $('#bookmarklet_yt2_content').html('<div id="bookmarklet_yt2_inner_content"><div id="bookmarklet_yt2_inner_content_lyrics"><p style="margin: 8px 0 0 8px">' + language_pack.loading + '<img src="' + localpath + 'resources/ajax-loader.gif" alt="loading" /></p></div></div>');


    jQuery.ajax({
        url: 'https://yt-lyrics.appspot.com/ciao?artist=' + encodeURIComponent(artist) + '&song=' + encodeURIComponent(title),
        type : 'GET',
        dataType: 'text',
        crossDomain: true,
        success: function (response) {


            if (response == '0') {
                showSearchForm(artist,title)
            }
            else {

                var message_header = "<h2> <strong>" + title + "</strong> - <strong>" + artist + "</strong></h2>";
                $('#bookmarklet_yt2_content').html('<div id="bookmarklet_yt2_inner_content">' + message_header
                    + '<div id="bookmarklet_yt2_inner_content_lyrics">' + response + '<br/><br/><hr/></div></div>');

            }
         },
         error: function (xhr) {
              showSearchForm(artist,title) 
        }  

        });


}

function showSearchForm(artist,title) {
var ytLyricsForm = '<form id="ytLyricsForm"><div class="ytLyricsField"><label>' + language_pack.artist + '</label><input type="text" name="artist" id="ytlyricsartist" placeholder="artist" value="' + artist + '"/></div>';
                ytLyricsForm += '<div class="ytLyricsField"><label>' + language_pack.song + '</label><input type="text" name="title" id="ytlyricstitle" placeholder="song" value="' + title + '"/></div>';
                ytLyricsForm += '<div class="ytLyricsButton" onclick="ytLyricsFormSearch2();">' + language_pack.searchlyrics + '</div></form>';


                var ytLyricsOutput = '<div id="bookmarklet_yt2_inner_content">' + '<div id="bookmarklet_yt2_inner_content_lyrics">';
                ytLyricsOutput += language_pack.nolyricsfound1 + title + language_pack.nolyricsfound2 + artist + language_pack.nolyricsfound3;
                ytLyricsOutput += language_pack.modifysearch + ytLyricsForm + "</div></div>";

                $('#bookmarklet_yt2_content').html(ytLyricsOutput);

}

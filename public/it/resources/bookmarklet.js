var localpath = '';
localpath = 'http://www.summarify.com/ytlyrics/it/'


var language_pack = {
    'localpath': localpath,
    'iemessage': "YTLyrics non funziona con versioni di Internet Explorer precedenti alla 9.0. Per favore, aggiorna il tuo browser.",
    'suggestions' : 'Suggerimenti',
    'reportbug': 'Segnala un bug',
    'credits' : 'Info',
    'loading' : ' Caricamento in corso ',
    'searchlyrics' : 'Ricerca testo',
    'artist' : 'Artista',
    'song' : 'Canzone',
    'nolyricsfound1' : ' Nessun testo trovato per: "',
    'nolyricsfound2': '" (titolo canzone) e "',
    'nolyricsfound3' : ' "(artista). ',
    'modifysearch' : "Puoi modificare la ricerca se l'artista o il nome della canzone individuati sono sbagliati:<br/>"



};

function trim1 (str) {
    return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}

function capitaliseFirstLetter(string)
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}




	/*prima esecuzione*/
	if(window.myBookmarklet===undefined) {
			
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
			var fileref=document.createElement("link")
	  		fileref.setAttribute("rel", "stylesheet")
	  		fileref.setAttribute("type", "text/css")
	  		fileref.setAttribute("href", localpath + "resources/bookmarklet.css");
	 
			document.getElementsByTagName("head")[0].appendChild(fileref);

			//devo caricare jquery o c'è già nella pagina?
			//da togliere se su youtube c'è già

			// the minimum version of jQuery we want
			var v = "1.9.1";

			// check prior inclusion and version
			if (window.jQuery === undefined || window.jQuery.fn.jquery < v) {
				var done = false;
				var script = document.createElement("script");
				script.src = "http://ajax.googleapis.com/ajax/libs/jquery/" + v + "/jquery.min.js";
				script.onload = script.onreadystatechange = function(){
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


		var script = document.createElement("script");
		script.src = "http://yui.yahooapis.com/3.8.0/build/yui/yui-min.js";					
		document.getElementsByTagName("head")[0].appendChild(script);


		/*inizializzazione grafica */
		var newDiv = $('<div id="bookmarklet_yt2_container" class="bookmarklet_yt2">');
		$('body').append(newDiv);
		

		var header_bookmarklet_div = '<button type="button" class="close" id="bookmarklet_yt_button">×</button><a href="' + localpath + '" target="_blank"><img src="' + localpath + 'resources/logo.png" alt="yt lyrics" /></a>';
		header_bookmarklet_div += "<div id='bookmarklet_yt2_content'></div>";
		header_bookmarklet_div +='<div class="ytlinksbar"><div class="small" id="bookmarklet_yt_increasefont"><button class="close">+</button></div><div class="small notfirst" id="bookmarklet_yt_reducefont"><button class="close" style="margin-top:-3px">-</button></div><div class="small notfirst"><a href="https://www.facebook.com/pages/YTLyrics/425290784236106" target="_blank"><img src="' + localpath + 'resources/facebook-icon.png" style="height:16px;" /></a></div><div class="small notfirst"><a href="' + localpath + '#credits" target="_blank">' + language_pack.credits + '</a></div><div class="small notfirst" ><a href="' + localpath + '#new-features-and-bug-report" target="_blank">' + language_pack.suggestions + '</a></div><div class="small notfirst"><a href="' + localpath + '#new-features-and-bug-report" target="_blank">'+ language_pack.reportbug +'</a></div></div>';


			$('#bookmarklet_yt2_container').html(header_bookmarklet_div);


			$('#bookmarklet_yt_button').click(function() { 
				
				  $("#bookmarklet_yt2_container").hide();				

			});
			
			$('#bookmarklet_yt_increasefont').click(function() { 
				
				  ytLyricsChangeFontSize(2);
				

			});
			$('#bookmarklet_yt_reducefont').click(function() { 
				
				  ytLyricsChangeFontSize(-2);
				

			});

			script.onload = function() {
				ytLyricsFetchContent();
			}



	}

	function ytLyricsFetchContent() {
		(window.myBookmarklet = function() {

            var url_site = document.baseURI;
            var stringa_title = document.title;

            if (url_site.match(/youtube/)) {



                stringa_title = stringa_title.replace(/\([^\)]*\)/g , "");
                stringa_title = stringa_title.replace(/\[[^\]]*\]/g , "");
                stringa_title = stringa_title.replace(/M\/V/, "");
                stringa_title = stringa_title.replace(/\- YouTube/, "");
                stringa_title = stringa_title.replace(/▶/,"");

                var youtube_details = stringa_title.split("-");


                var artist = youtube_details[0];
                var title;
                if (youtube_details[1] === undefined)
                    title = "";
                else
                    title = youtube_details[1];


                ytlyricsDoSearch(artist,title,true);

            }
            /* demo support for grooveshark */
            else if (url_site.match(/grooveshark/)) {

                var myRegex = /^(?:▶ )?"(.*)" by (.*) (?:on "(.*))?(?:- Profile)? - Grooveshark$/;
                var match = myRegex.exec(stringa_title);

                if (match !== null)
                    ytlyricsDoSearch(match[2],match[1],false);
            }

		})();
	}




	function ytLyricsChangeFontSize(amount) {
	var currentSize = $('#bookmarklet_yt2_inner_content_lyrics').css("font-size").replace("px","");
	var newSize = amount + parseInt(currentSize) ;
		$('#bookmarklet_yt2_inner_content_lyrics').css("font-size", newSize +"px");
	}
	
	
	


	function ytLyricsFormSearch2() {

		ytlyricsDoSearch($("#ytlyricsartist").val(),$("#ytlyricstitle").val(), true);

	}

	function ytlyricsDoSearch(artist, title, swap_title_artist_if_no_match) {

        if (swap_title_artist_if_no_match === true) {
            artist = capitaliseFirstLetter(trim1(artist));
            title = capitaliseFirstLetter(trim1(title));
        }

			$("#bookmarklet_yt2_container").show();
			$('#bookmarklet_yt2_content').html('<div id="bookmarklet_yt2_inner_content"><div id="bookmarklet_yt2_inner_content_lyrics"><p style="margin: 8px 0 0 8px"> '+ language_pack.loading + '<img src="' + localpath +'resources/ajax-loader.gif" alt="loading" /></p></div></div>');

		var script = document.createElement("script");
		script.src = "http://lyrics.wikia.com/api.php?fmt=json&artist=" + encodeURIComponent(artist.toLowerCase()) +"&song=" + encodeURIComponent(title.toLowerCase());
		script.onload = function() {


			var full_lyrics = "";

			YUI().use('node', 'event', 'yql', function(Y) {

                try {

                    var yql_query = "select * from html where url='" + song.url +"'";
                    yql_query += " and xpath=\"//div[@class='lyricbox']\"";

                    Y.YQL(yql_query, function(response) {



                        if(response.query.results){
                            var message_header = "<h2> <strong>" + title + "</strong> - <strong>" +artist +"</strong></h2>";
                            $('#bookmarklet_yt2_content').html(  '<div id="bookmarklet_yt2_inner_content">' + message_header +  '<div id="bookmarklet_yt2_inner_content_lyrics">' + response.query.results.div.p.content.split(' \n ').join('<br />') + '<br/><br/><hr/><p><a href="' + song.url + '" target="_blank">' + song.url +"</a></p>" +"</div></div>");
                        } else{


                            if (swap_title_artist_if_no_match === true) {

                                ytlyricsDoSearch(title,artist,false);
                            }
                            else {

                                var ytLyricsForm = '<form id="ytLyricsForm"><div class="ytLyricsField"><label>' + language_pack.artist + '</label><input type="text" name="artist" id="ytlyricsartist" placeholder="artist" value="' + title + '"/></div>';
                                ytLyricsForm += '<div class="ytLyricsField"><label>' + language_pack.song + '</label><input type="text" name="title" id="ytlyricstitle" placeholder="song" value="' + artist + '"/></div>';
                                ytLyricsForm += '<div class="ytLyricsButton" onclick="javascript:ytLyricsFormSearch2();">' + language_pack.searchlyrics + '</div></form>';


                                var ytLyricsOutput = '<div id="bookmarklet_yt2_inner_content">' +'<div id="bookmarklet_yt2_inner_content_lyrics">'
                                ytLyricsOutput += language_pack.nolyricsfound1 +  artist + language_pack.nolyricsfound2 +title  + language_pack.nolyricsfound3;
                                ytLyricsOutput += language_pack.modifysearch + ytLyricsForm + "</div></div>"

                                $('#bookmarklet_yt2_content').html( ytLyricsOutput);


                            }
                        }



                    });


                }
                catch(e) {

                    var ytLyricsForm = '<form id="ytLyricsForm"><div class="ytLyricsField"><label>' + language_pack.artist + '</label><input type="text" name="artist" id="ytlyricsartist" placeholder="artist" value="' + artist + '"/></div>';
                    ytLyricsForm += '<div class="ytLyricsField"><label>' + language_pack.song + '</label><input type="text" name="title" id="ytlyricstitle" placeholder="song" value="' + title + '"/></div>';
                    ytLyricsForm += '<div class="ytLyricsButton" onclick="javascript:ytLyricsFormSearch2();">'+ language_pack.searchlyrics +'</div></form>';


                    var ytLyricsOutput = '<div id="bookmarklet_yt2_inner_content">' +'<div id="bookmarklet_yt2_inner_content_lyrics">'
                    ytLyricsOutput += language_pack.nolyricsfound1 +  title + language_pack.nolyricsfound2 +artist  + language_pack.nolyricsfound3;
                    ytLyricsOutput += language_pack.modifysearch + ytLyricsForm + "</div></div>"

                    $('#bookmarklet_yt2_content').html( ytLyricsOutput);

                }
            });
		

		}
				document.getElementsByTagName("head")[0].appendChild(script);
	}
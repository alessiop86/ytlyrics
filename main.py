#!/usr/bin/env python

import webapp2
import httplib2
import json
import urllib


class MainHandler(webapp2.RequestHandler):

    def dispatch(self):
        self.response.headers['Access-Control-Allow-Origin'] = '*'
        super(MainHandler, self).dispatch()
    #def __init__(self):
    #   lyrics_url = "";
    #  lyrics_output = "";

    def get(self):
        self.response.headers['Content-Type'] = 'application/json'
        artist = self.request.GET['artist']
        song = self.request.GET['song']
        
        jsonSearchObj = self.cercaCanzone(artist,song)

        if jsonSearchObj['lyrics'] == 'Not found':
            jsonSearchObj = self.cercaCanzone(song,artist)            
            if jsonSearchObj['lyrics'] == 'Not found':
                self.response.write('0');
        else:
            self.lyrics_url = jsonSearchObj['url']
            self.estraiTestoCanzone()
            self.response.write(self.lyrics_output)
            
    def cercaCanzone(self, artist, song):
        search_lyrics_url = "http://lyrics.wikia.com/api.php?fmt=json&artist=" + urllib.quote_plus(artist) +"&song=" + urllib.quote_plus(song)

        #verifica il comportamento di canzoni con gli apici!
        resp, content = httplib2.Http().request(search_lyrics_url)
        jsonSearchObj = json.loads(content[7:].replace("'", "\""))

        return jsonSearchObj

    def estraiTestoCanzone(self):
            
        headers2, content2 = httplib2.Http().request(self.lyrics_url)
        #self.response.write(content2)


        from bs4 import BeautifulSoup,Comment
        parsed_html = BeautifulSoup(content2)
        div_lyricbox = parsed_html.body.find('div', attrs={'class':'lyricbox'});
        [s.extract() for s in div_lyricbox('div', attrs={'class': ['rtMatcher', 'lyricsbreak'] }) ]

        # Remove HTML comments
        for comment in div_lyricbox.findAll(text=lambda text: isinstance(text, Comment)):
          comment.extract()

        #self.response.write ( div_lyricbox )
        self.lyrics_output = div_lyricbox.renderContents()




app = webapp2.WSGIApplication([
    ('/ciao', MainHandler)
], debug=True)

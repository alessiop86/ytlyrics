ytlyrics
========

YT-Lyrics bookmarklet

Second version of the YTLyrics bookmarklet.

This time I involved App Engine and python (plus obviously Javascript)
because of new restriction of the webkit browser (improving XSS security)
broke the old bookmarklet based on 100% Javascript and Yahoo's YQL, and
I couldn't figure out how to serve the lyrics without using a backend of mine.

I have a very basic knowledge of python, but at the time i developed the 
bookmarklet the PHP version of App Engine was not out yet (now it is :) ),
and I really needed the Google TLS certificate to avoid the XSS protection nuisance.



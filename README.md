# my own insta ; )

my_own_insta ; ) is a website / Progressive Web App that lets you share photos fast and in best quality. It’s simple, easy to use, easy to install, doesn’t have any metrics, ads or clutter and you can style its appearance as you wish.

I’m using it as an online photo diary. You can use it for whatever you want ;)


## How to use 

The front end is a very simple image browser. Users can scroll through a list of jpegs and when reaching the bottom of the site, more pictures are loaded.
Tapping on a picture will open the original uploaded jpeg file in a new browser tab. 
If the image contains Exif or IPTC metadata, the following contents will be extracted from the jpeg file and shown below each picture:
* Exif  “DateTimeOriginal” (the date / time when the photo has been taken)
* Exif GPS location (this will display a little marker icon – clicking on it shows the location on openstreetmap.org)
* IPTC Caption
Users can install the website as an app on their homescreen / desktop by opening the info window and clicking the install link.


## How it works

### Front end

The front end is a single html file (index.html) which runs the Javscript “myowninsta.js”. The javascript loads the array “entries[]” from “myowninsta.json”. The array contains the ID’s of the pictures to be shown. The javascript then builds html content boxes, loads the pictures into those boxes, and creates descriptions based on the images’ Exif and IPTC metadata. When the user scrolls to the bottom of the document, the javascript builds more html boxes and fills them with more pictures, until all content is loaded.
Progressive Web App

The front end can be installed as a “Progressive Web App” (PWA). This is a bit of a hack, though. In order to be accepted by the browser as a PWA, “myowninsta.js” has to start a service worker script (“serviceworker.js”) in the background. The idea is that the service worker would offer offline functionality, when the app is used without Internet connection. However, “serviceworker.js” doesn’t really do anything. It’s only there to make the add to homescreen (A2HS) link work. The whole PWA/A2HS thing also only works, if the server is contacted via HTTPS. 

### Back end

The back end is accessed by opening “upload/”.  There you can upload jpegs to the server, e.g. from your mobile device and also tag, sort and delete pictures. “upload/” always shows you the latest uploaded picture by default. Specific entries will be accessed by a GET request, e.g. “upload/index.php?item=1” will show the last item in the “entries[]” array, which is the last picture at the end of the photo stream.
When you are uploading a jpeg, the php script saves the original picture with a new name and an ID number in the folders “/0”, “/1”, “/2”, “/…” (always 100 images go into one folder, then the next folder is created) on your server. The script also makes two copies, a 1024 pixel wide low resolution copy (this is what the front end shows) and a 512 pixel wide thumbnail (this is what the gallery in the back end shows).
In the IPTC Caption field, you can enter an image caption. When you press “save caption”, the IPTC metadata of all the original photo and of the two copies will be updated. IPTC stands for International Press Telecommunications Council and the IPTC-IIM-Standard is basically a format for metadata which is stored in the jpeg file, similar to Exif.
“Delete this photo” will delete this photo and its low resolution copies. It will also delete its ID in “myowninsta.json”
“Gallery overview / select” lets you see all available pictures. You can select an image by clicking on it.
“Sort photos by date” sorts the content in the “entries[]” array newest first by the pictures’ Exif date / time of creation.
When you are manipulating Exif data and “myowninsta.json” via the back end, please be aware that your browser might not display the changes and show you cached content instead. You can hold down Ctrl & Shift while clicking the refresh symbol in Chrome in order to reload the page from the server. However, this also doesn’t necessarily make the browser reload the image files, so you might not see IPTC tag updates immediately. 


## How to install

### Requirements

In order to run your own installation of my own insta ;) you need webspace on a server which runs PHP. If you want it to work as a Progressive Web App, the server needs to be accessed via HTTPS.
Installing step by step

* Download everything 
* Create a folder on your server 
* Drop everything there 
* You’re done!
      
Ok, this was maybe a little bit fast. Before uploading it on your server, you might want to adapt a few things. Here’s a list:

* Modify the title, the text in the info box, and the footer in “index.html”
* Adapt colors and font in “myowninsta.css”
* Adapt colors and  the value of the variable “photo_file_name” in “myowninsta.json”. (Uploaded pictures will be renamed according to the name that you specify here.) 
* In case you want to modify more of the front end’s appearance, have a look at the functions “layout()” and “createContentBoxes()” in “myowninsta.js”.
* Change the image files in the “/icon” folder. This will be the icon of your app.
* Change the URL and the names in “myowninsta.webmanifest”. This is how the app will be displayed on the homescreen / desktop.
* Upload everything onto your server
* Restrict the access to the “/upload” folder with an “.htaccess” and “.htpasswd” file.
* Congratulations, now you have your own insta ;)


## Possible improvements

This is my first project using PHP and JSON. I’ve never manipulated Exif and IPTC metadata with a script before. While working on this project, I learned that A2HS is not a neurodevelopmental disorder and that PWA is more than just the TLA of the Professional Windsurfers Association. I guess what I want to say is that I’m definitely not an expert on any of this. I’m not a web developer, I’m just happy that it all works. Therefore I’m also not sure if I’ll spend more time on this project in the close future, but if I should do so (or if you want to), here would be some ideas for improvements & enhancements:
* Make the browser always reload the full content. Not sure how this could be done, but it would lead to a much better experience, especially on the back end.
* Adapt the appearance of the back end to the appearance of the front end.
* Make the service worker actually really do something.
* Make an embed function for single posts.
* Build a bot that automatically posts content from my own insta ;) e.g. on Twitter. Because, even if I don’t like to use social networks, others still like to use them. Automatic posts could be a way to keep those updated who prefer to scroll through Twitter feeds.
* In case some people are using this, an aggregator app could be interesting. One could subscribe to feeds on different servers and see all pictures in one app. Heck, one could even add metrics in such an app, with likes and hearts and everything that I deliberately left out :)








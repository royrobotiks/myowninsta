var debug=false;
var debug_count=0;
var loop_count=0;

var w,h;              // width and height of viewport - will be calculated when loaded
var img_width, border_width, headline_size, title_size, text_size, line_height, title_height, head_space,fade_space,circle_size,shadow_size;

var scroll = 0;
var fade = 1;
var show_info=false;
var scroll_to=-1;
var scroll_pos=-1;
var scroll_item = 0;

var last_html_item      = -1; //the index number of the last generated item
var last_filled_item    = -1; //the index number of the last loaded item
var last_visible_item   = -1; //the index number of the last item that was faded in when it entered the screen
var entries_list;             // will be received from entries.json
var entries = -1;
var file_name ='';

function init(){

  if(debug){document.getElementById("debug_box").style.visibility='visible';}
  //---------------------------------------------------------------------------- load settings from myowninsta.json
    loadJSON('../myowninsta.json', function(settings_file){
      console.log('settings:')
      settings_list = JSON.parse(settings_file);
      console.log(settings_list);
      file_name = settings_list.photo_file_name;
      console.log('file name: '+file_name);
  });

  //---------------------------------------------------------------------------- load entries list from myowninsta.json
    loadJSON('../myowninsta.json', function(entries_file){
      console.log('entry list received:')
      entries_list = JSON.parse(entries_file);
      console.log(entries_list);
      var amount_of_entries = entries_list.entries.length;
      console.log('amount of entries: '+amount_of_entries);
      console.log(entries_list.entries[0]);
      entries             = amount_of_entries;
      last_html_item      = entries + 1; //the index number of the last generated item
      last_filled_item    = entries + 1; //the index number of the last loaded item
      last_visible_item   = entries + 1; //the index number of the last item that was faded in when it entered the screen
      createContentBoxes();
  });

  //---------------------------------------------------------------------------- when html is loaded - set up everything:
  getSizes();      // calculate general sizes, like w & h of viewport, image width, etc.
  document.getElementById('content_box').style.width = ( Math.floor(w/img_width)*(img_width + (border_width*3)) )+'px';
  console.log('~~~~~~~~~~~~~~~~ w:'+w+' i_w:'+img_width+' w/i:'+(Math.floor(w/img_width)*img_width));
  window.setInterval(function(){loop()}, 100); // start the loop function
}

// ----------------------------------------------------------------------------- LOOP!
function loop(){
  loop_count++;

  // ........................................................................... do repeatedly
  if (last_filled_item<=entries){ // fade in items
    for (var item_to_check = last_visible_item-1; item_to_check >= last_filled_item; item_to_check--){
        document.getElementById('item'+item_to_check).style.opacity = 1;
        last_visible_item = item_to_check;
    }
  }

    // create new content boxes when reaching end
    var empty_items = last_filled_item - last_html_item; // how many html items are not filled with pictures, yet?
    var bottom_y = Math.floor(document.getElementById("footer").getBoundingClientRect().top)-h; // how far is it till the bottom of the document?
  //  document.getElementById("debug_box").innerHTML     =  'h: '+h+'  bottom: '+bottom_y+'  f-h: '+(bottom_y-h);

    if (empty_items==0 && bottom_y <= h){ // if all html items are filled and the site is scrolled to the bottom: create new html boxes
      scroll_pos = window.scrollY;  // remember scroll position and return to scroll position when first loaded picture fades in
      console.log('///////////> remember scrolling position: '+scroll_pos);
      createContentBoxes();
    }

    if(last_filled_item > last_html_item){ //
      fillItem(last_filled_item-1); //  will update last_filled_item
    }

    // debug info
    if (debug_count>2){
      document.getElementById("debug_box").innerHTML     =  '/debug/';
    }
}




// ----------------------------------------------------------------------------- fill html item with picture
function fillItem(item_number){
  console.log('try to load pic#'+item_number);
  var photo_number = entries_list.entries[entries - item_number];
  console.log('= photo#'+photo_number);
  var img = document.getElementById('item_img'+item_number); // store reference to html image
  var new_img = new Image; //       create new empty image
  new_img.onload = function() {//   when content for new empty image is completely loaded:
    img.src = this.src;          // put the new loaded image into the empty html placeholder
    // extract exif data
    EXIF.getData(img, function() {

        // check exif for original date / time and build date string if available
        var date_string = '';
        var exif_date = EXIF.getTag(this, "DateTimeOriginal");
        var allIptcData = EXIF.getAllIptcTags(this);

        if(typeof exif_date !== "undefined"){
          var months=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
          var str = exif_date.split(" ");
          var dateStr = str[0].split(":");
          date_string = ' - '+months[parseInt(dateStr[1]-1)]+'/'+dateStr[2]+'/'+dateStr[0];
        }

        // check exif for GPS coordinates and build location string if available
        var location_icon  ='';
        var lat,latr,lon,lonr;

        lat = EXIF.getTag(this, "GPSLatitude");
        latr =EXIF.getTag(this, "GPSLatitudeRef");
        lon = EXIF.getTag(this, "GPSLongitude");
        lonr =EXIF.getTag(this, "GPSLongitudeRef");

        if(typeof lat !== "undefined" && typeof latr !== "undefined" && typeof lon !== "undefined" && typeof lonr !== "undefined" ) {
          var latFinal = ConvertDMSToDD(lat[0], lat[1], lat[2], latr);
          var lonFinal = ConvertDMSToDD(lon[0], lon[1], lon[2], lonr);
          var osm_url='http://www.openstreetmap.org/?mlat='+latFinal+'&mlon='+lonFinal+'&zoom=17'; // openstreetmap URL
          location_icon='&nbsp;&nbsp;<a href="'+osm_url+'" target="_blank" style="padding:'+border_width+'px;font-style:normal; text-decoration:none; text-align: right;">&nbsp;&#x2316;&#xFE0E;&nbsp;</a>';
        }

        // create item title with index# , date (if avail.), location (if avail.) and IPTC caption (if avail.)
        var pic_title = document.getElementById('item_title'+item_number);
        pic_title.innerHTML = '<div class="photo title"  style="font-style:italic"><center>#'+item_number+date_string+location_icon+'</center></div>';
        if(typeof allIptcData['caption'] !== "undefined"){
          pic_title.innerHTML +='<div class="caption" style="font-size: '+text_size+'px; font-style:normal;"><center>'+allIptcData['caption']+'</center></div>';
        }

        pic_title.style.fontSize=headline_size+'px';
        pic_title.style.lineHeight=line_height+'px';
        pic_title.style.fontVariantNumeric='oldstyle-nums';
        //pic_title.style.fontStyle='italic';
        console.log('pic#'+item_number+' is loaded');
        fadeIn(item_number);
    });
  }
  new_img.src = '../'+Math.floor(photo_number/100)+'/'+file_name+'_Lores_Thumb_'+photo_number+'.jpg'; // load content for new empty image
}

  // --------------------------------------------------------------------------- fade-in item once image is loaded
function fadeIn(item_number){
  console.log('fading #'+item_number);
    fade_img = document.getElementById('item'+item_number);
    last_filled_item = item_number;
    if(scroll_pos>-1){
      scroll_to=scroll_pos;
      setTimeout(function() {
        window.scrollTo(0,scroll_to);
        console.log('///////////> scrolling to: '+scroll_to);
      }, 300);
      scroll_pos=-1;
    }
}

// ----------------------------------------------------------------------------- create empty html content boxes from show_f to and including show_t
function createContentBoxes(){

  var top_item = last_html_item-1;
  var bot_item = Math.max(last_html_item -100,1);

  for (var i = top_item; i>=bot_item; i--){
    var content_box = document.getElementById('content_box');
    content_box.innerHTML+='\
      <div id="item'+i+'" style="opacity: 0; display:inline-block; float:left; overflow:hidden; margin:'+(border_width/2)+'px; background:white; transition: all 1s; width:'+(img_width+border_width*2)+'px; height:'+((img_width/3*5)+border_width*2)+'px; box-shadow: '+shadow_size+'px '+shadow_size+'px '+shadow_size+'px rgba(0,0,0,.1)">\
        <a href="index.php?item='+(i)+'&r='+Math.floor(Math.random()*100000)+'" style="-webkit-tap-highlight-color: rgba(0,0,0,0); margin-bottom:0px;">\
          <img id="item_img'+i+'" style=" margin-bottom:0px; z-index='+(i*2+1)+'; width: '+img_width+'px; border:'+border_width+'px solid white;">\
        </a>\
        <div class="titles">\
          <div id="item_title'+i+'" style=" padding-bottom: '+(line_height/4)+'px; padding-top:0px; background: white; width:'+(img_width+border_width*2)+'px">\
            item'+i+'\
          </div>\
        </div>\
      </div>';
  }
  last_html_item = bot_item;
}

///////////////////////////////////////////////////////////////////--------------------------GET W & H OF VIEWPORT
function getSizes(){

  //measure width of viewport with the help of 100% wide div
  w =  document.getElementById('w100p').getBoundingClientRect().width ;
  h =  document.getElementById('h100p').getBoundingClientRect().height ;

  if (w<340){w=340;} // special rule for tiny screens
  console.log('w: '+w+' h: '+h);

  //calculate width of images and border thickness - this will be the size reference for everything
  img_width = h*(3/4)*.9; // landscape orientation
  if (h>w){               // portrait orientation
    img_width = w*.9;
  }
  border_width = img_width/100;
  img_width=img_width/3;

  // calculate font sizes
  text_size = img_width/17;
  headline_size = img_width/13;
  line_height = img_width/13*1.5;
  title_size = img_width/11;
  title_height = img_width/11*2; // title box height

  // calculate div sizes
  circle_size=img_width/6;
  head_space = circle_size*2 + title_height;
  fade_space=img_width/4;

  shadow_size =img_width/100;
}

//------------------------------------ GPS coordinate converter from https://awik.io/extract-gps-location-exif-data-photos-using-javascript/
function ConvertDMSToDD(degrees, minutes, seconds, direction) {
    var dd = degrees + (minutes/60) + (seconds/3600);
    if (direction == "S" || direction == "W") {
        dd = dd * -1;
    }
    return dd;
}

//------------------------------------ load json from https://wiki.selfhtml.org/wiki/JSON#Einbindung
function loadJSON(file,callback) {
  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType('application/json');
  xobj.open('GET', file, true);
  xobj.onreadystatechange = function () {
    if (xobj.readyState == 4 && xobj.status == '200') {
      callback(xobj.responseText);
    }
  };
  xobj.send(null);
}

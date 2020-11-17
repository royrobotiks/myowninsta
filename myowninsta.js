var debug=false;
var debug_count=0;
var loop_count=0;

var w,h;              // width and height of viewport - will be calculated when loaded
var img_width, border_width, headline_size, title_size, text_size, line_height, title_height, head_space,fade_space,shadow_size;
var p_scroll=0; // scrolling positions for determining scroll direction
var scroll = 0;
var scroll_to=-1;
var scroll_pos=-1;

var last_html_item      = -1; //the index number of the last generated item
var last_filled_item    = -1; //the index number of the last loaded item
var last_visible_item   = -1; //the index number of the last item that was faded in when it entered the screen
var entries_list;             // will be received from entries.json
var entries = -1;
var file_name ='';
var got_settings=false;
var got_entries=false;
var info_box_y=5000;
var info_box_open = 0;
var show_info_button =1;
var info_box_height,info_box_y_hidden,info_box_y_button,info_box_y_open;
var load_begin=0;
var load_time=0;
var background_color, foreground_color, foreground_hover;

//////////////////////////////////////////////////////////////////////////////// INIT!
function init(){
  if(debug){document.getElementById("debug_box").style.visibility='visible';}
  //---------------------------------------------------------------------------- load settings from myowninsta.json
    loadJSON('myowninsta.json', function(settings_file){
      settings_list = JSON.parse(settings_file);
      file_name = settings_list.photo_file_name;
      background_color = settings_list.background_color;
      foreground_color = settings_list.foreground_color;
      foreground_hover = settings_list.foreground_hover;
      got_settings=true;
  });

  //---------------------------------------------------------------------------- load entries list from myowninsta.json
    loadJSON('myowninsta.json', function(entries_file){
      entries_list = JSON.parse(entries_file);
      var amount_of_entries = entries_list.entries.length;
      console.log('amount of entries: '+amount_of_entries);
      console.log(entries_list.entries[0]);
      entries             = amount_of_entries;
      last_html_item      = entries + 1; //the index number of the last generated item
      last_filled_item    = entries + 1; //the index number of the last loaded item
      last_visible_item   = entries + 1; //the index number of the last item that was faded in when it entered the screen
      got_entries=true;
  });
  //---------------------------------------------------------------------------- when html is loaded - set up everything:

  layout();
  window.setInterval(function(){loop()}, 100); // start the loop function
}

//////////////////////////////////////////////////////////////////////////////// LOOP!
function loop(){
  loop_count++;
//.............................................................................. update measurements
  w =  document.getElementById('w100p').getBoundingClientRect().width ;
  h =  Math.max(document.getElementById('h100p').getBoundingClientRect().height,window.innerHeight) ;
  info_box_height = document.getElementById('info_box').getBoundingClientRect().height;


//.............................................................................. position info box
  info_box_y_button = h+info_box_height-(img_width/9);  // info box position when button is visible
  info_box_y_open   = h;                                // info box position when info box is visible
  info_box_y_hidden = h+info_box_height+shadow_size;                              // info box position when button and box is hidden
  if((document.body.clientHeight-h-window.scrollY)<10){ // check if scrolled to the end of the document with all pictures loaded
    show_info_button =1;                                // if yes: show the info button
  }
  if (info_box_open) {
    info_box_y = info_box_y_open;
  }else{
    if (show_info_button){
      info_box_y = info_box_y_button;
    }else{
      info_box_y = info_box_y_hidden;
    }
  }
  document.getElementById('info_box').style.bottom = info_box_y +'px';

//.............................................................................. fade page title in and out based on scroll position
  if (window.scrollY>h){
    document.getElementById('title_container').style.opacity=0;
  }else{
    document.getElementById('title_container').style.opacity=1;
  }
//.............................................................................. fade footer in
  if (last_filled_item==1){ // fade in footer when all entries are loaded
    document.getElementById('footer').style.opacity=1;
  }
//.............................................................................. fade items in when they enter the screen
  if (last_filled_item <= entries){
    for (var item_to_check = last_visible_item-1; item_to_check >= last_filled_item; item_to_check--){
      if (document.getElementById('item'+item_to_check).getBoundingClientRect().top<h){
        console.log    ('---------------> item: '+item_to_check+' is visible');
        document.getElementById('item'+item_to_check).style.opacity = 1;
        last_visible_item = item_to_check;
      }else{
        break;
      }
    }
  }
//..............................................................................  find out if new content boxes have to be created
//    how many html items are not filled with pictures yet?
  var empty_items = last_filled_item - last_html_item;
//    distance to bottom of content
  var bottom_y = Math.floor(document.getElementById("bottom_of_content").getBoundingClientRect().top)-h;
//    if all html items are filled and the site is scrolled to the bottom: create new html boxes
  if (empty_items==0 && bottom_y <= h/2){
//  remember scroll position and return to scroll position when first loaded picture fades in
    scroll_pos = window.scrollY;
    console.log('///////////> remember scrolling position: '+scroll_pos);
    createContentBoxes();
  }

  if(last_filled_item > last_html_item){
    fillItem(last_filled_item-1);        //  update last_filled_item
  }

//.............................................................................. debug

  //document.getElementById("debug_box").innerHTML     =  loading;

}
//////////////////////////////////////////////////////////////////////////////// LOOP END!
//============================================================================== Info box and info box button handling
// ----------------------------------------------------------------------------- mouse over 'open info box'-button
function overShowInfo(){
  document.getElementById('open_shift'     ).style.left       = (text_size/2)+'px';
  document.getElementById('open_shift'     ).style.opacity    = 1;
  if(info_box_open==1){
    document.getElementById('info_box'     ).style.background = foreground_color;
  }else{
    document.getElementById('info_box'     ).style.background = foreground_hover;
  }
}
// ----------------------------------------------------------------------------- mouse leaving 'open info box'-button
function outShowInfo(){
  document.getElementById('open_shift'     ).style.left       = (text_size/6)+'px';
  document.getElementById('open_shift'     ).style.opacity    = .6;
  if(info_box_open==1){
    document.getElementById('info_box'     ).style.background = foreground_color;
  }else{
    document.getElementById('info_box'     ).style.background = foreground_color;
  }
}

// ----------------------------------------------------------------------------- scrolling:
function scrolling(){
  p_scroll = scroll; //                                                          check scroll direction
  scroll = Math.floor(window.scrollY);
  //............................................................................ scrolling down: hide 'open info box'-button
  if (scroll>p_scroll){
    show_info_button = 0;
  }
  //............................................................................ scrolling up: show 'open info box'-button
  if (scroll<p_scroll){
     show_info_button = 1;
  }
}

// ----------------------------------------------------------------------------- is triggered by mouseclick on button,
//                                                                               handles how info box is shown
function showInfo(){
  if (info_box_open==0){ // .................................................... open info box
    info_box_open = 1;
    document.getElementById('info_box'        ).style.bottom       =  info_box_y_open +'px';
    document.getElementById('open_info'       ).style.transform    = 'rotateZ(-90deg)';
    document.getElementById('info_bgnd'       ).style.opacity      = .6;
    document.getElementById('info_box'        ).style.background   = 'rgba(255,255,255,1)';
    document.getElementById('info_bgnd'       ).style.visibility   = 'visible';
    document.getElementById('info_text'       ).style.opacity      = 1;
  }else{ // .................................................................... close info box
    info_box_open = 0;
    show_info_button = 1;
    document.getElementById('info_box'          ).style.bottom     =  info_box_y_button +'px';
    document.getElementById('open_info'         ).style.transform  = 'rotateZ(90deg)';
    document.getElementById('info_bgnd'       ).style.opacity      = 0;
    document.getElementById('info_box'          ).style.background = 'rgba(255,255,255,.6)';
    document.getElementById('info_bgnd'         ).style.visibility = 'collapse';
    document.getElementById('info_text'         ).style.opacity    = 0;
  }
}

//============================================================================== content handling
// ----------------------------------------------------------------------------- create empty html content boxes
function createContentBoxes(){
  if (got_entries &&got_settings){
    var top_item = last_html_item-1;
    var bot_item = Math.max(last_html_item -25,1);

    for (var i = top_item; i>=bot_item; i--){
      var content_box = document.getElementById('content_box');
      content_box.innerHTML+='\
      <center>\
        <div id="item'+i+'" style="opacity: 0; background:'+foreground_color+'; height: 0px; overflow: hidden; transition: all 1s; width:'+(img_width+border_width*2)+'px; box-shadow: '+shadow_size+'px '+shadow_size+'px '+shadow_size+'px rgba(0,0,0,.1)">\
          <a href="'+Math.floor(entries_list.entries[entries-i]/100)+'/'+file_name+'_'+entries_list.entries[entries-i]+'.jpg" target="_blank" style="-webkit-tap-highlight-color: rgba(0,0,0,0); margin-bottom:0px;">\
            <img id="item_img'+i+'" style=" margin-bottom:0px; z-index='+(i*2+1)+'; width: '+img_width+'px; border:'+border_width+'px solid '+foreground_color+';">\
          </a>\
          <div class="titles">\
            <div id="item_title'+i+'" style=" padding-top:0px; padding-bottom: '+(line_height/2)+'px; padding-top: '+(line_height/3)+'px; background:'+foreground_color+'; width:'+(img_width+border_width*2)+'px">\
              item'+i+'\
            </div>\
          </div>\
        </div>\
      </center>\
      <div id="item_spacer'+i+'" style="height: '+(h*1.2)+'px; transition:all 1s">\
      </div>';
    }
    last_html_item = bot_item;
  }
}

// ----------------------------------------------------------------------------- fill html content boxes with content
function fillItem(item_number){
  console.log('try to load pic#'+item_number);
  var photo_number = entries_list.entries[entries - item_number];
  console.log('= photo#'+photo_number);
  var img = document.getElementById('item_img'+item_number); // store reference to html image
  var new_img = new Image;           // create new empty image
  if(load_begin==0){                 // remember time in order to find out how long it took to load image
    load_begin=Date.now();
  }
  new_img.onload = function() {      // when content for new empty image is completely loaded:

    if(load_time==0){
      load_time=Date.now()-load_begin; // calculate load duration of first image (might be used later to show lores version if bad bandwidth?)
      console.log('load_time===='+load_time);
    }
    img.src = this.src;              // put the new loaded image into the empty html placeholder
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
        pic_title.innerHTML = '<div class="photo title"><center>#'+item_number+date_string+location_icon+'</center></div>';
        if(typeof allIptcData['caption'] !== "undefined"){
          pic_title.innerHTML +='<div class="caption" style="margin:'+(text_size)+'px; margin-bottom:'+(text_size*.3)+'px; margin-top:'+(text_size*.45)+'px; font-size: '+text_size+'px; line-height:'+(text_size*1.25)+'px; font-style:normal;"><center>'+allIptcData['caption']+'</center></div>';
        }

        pic_title.style.fontSize=headline_size+'px';
        pic_title.style.lineHeight=line_height+'px';
        pic_title.style.fontVariantNumeric='oldstyle-nums';
        //pic_title.style.fontStyle='italic';
        console.log('pic#'+item_number+' is loaded');
        fadeIn(item_number);
    });
  }
  new_img.src = Math.floor(photo_number/100)+'/'+file_name+'_Lores_'+photo_number+'.jpg'; // load content for new empty image
}

  // --------------------------------------------------------------------------- move up item once image is loaded
function fadeIn(item_number){
  console.log('moving #'+item_number);
    if((item_number+1)<=entries){
    prev_spacer = document.getElementById('item_spacer'+(item_number+1));
    prev_spacer.style.height = line_height+'px';
    }
    document.getElementById('item'+item_number).style.height='100%';
    last_filled_item = item_number;
    // as we're filling html stuff into the document, it might be added above the viewport and make the viewport scroll down.
    // Therefore: scroll up again to last verified scroll position after new boxes were created, filled and expanded.
    if(scroll_pos>-1){
      scroll_to=scroll_pos;
      setTimeout(function() {
        window.scrollTo({
          top: scroll_to,
          left: 0,
          behavior: 'smooth'
        });
        console.log('///////////> scrolling to: '+scroll_to);
      }, 300);
      scroll_pos=-1;
    }
}

//============================================================================== calculate all sizes and layout document
function layout(){

  //measure width of viewport with the help of 100% wide div
  w =  document.getElementById('w100p').getBoundingClientRect().width ;
  h =  document.getElementById('h100p').getBoundingClientRect().height ;

  if (w<340){w=340;} // special rule for tiny screens
  console.log('w: '+w+' h: '+h);

  //calculate width of images and border thickness - this will be the size reference for everything
  img_width = h*(3/4)*.9; // landscape orientation
  border_width = h/150;

  if (h>w){ // portrait orientation
    img_width = w*.9;
    border_width = w/100;
  }


  // calculate font sizes
  info_text_size = img_width/24;
  text_size = img_width/20;
  headline_size = img_width/16;
  line_height = img_width/16*1.5;
  title_size = img_width/11;
  title_height = img_width/11*2; // title box height

  // calculate div sizes
  head_space = text_size*10;
  fade_space = text_size*2;

  shadow_size =img_width/100;

  document.getElementById('debug_box'         ).innerHTML        = 'w: '+ Math.floor(w)+'  h: '+Math.floor(h)+'  i: '+Math.floor(img_width);
  document.getElementById('debug_box'         ).style.fontSize   = headline_size  +'px';
  document.getElementById('headspace'         ).style.height     = head_space    +'px';
  document.getElementById('title'             ).style.height     = head_space     +'px';
  document.getElementById('title'             ).style.textShadow = shadow_size+'px '+shadow_size+'px '+shadow_size+'px rgba(0,0,0,.1)';
  document.getElementById('title_container'   ).style.fontSize   = title_size     +'px';
  document.getElementById('title_container'   ).style.height     = title_height     +'px';
  document.getElementById('title_container'   ).style.transition = 'opacity 2s';
  document.getElementById('title_container'   ).style.opacity    = 1;
  document.getElementById('title_container'   ).style.bottom     = (h-text_size*6) +'px';
  document.getElementById('fade_box'          ).style.height     = fade_space     +'px';
  document.getElementById('fade_box'          ).style.fontSize   = title_size     +'px';
  document.getElementById('info_box'          ).style.bottom     = (h*6) +'px';
  document.getElementById('info_box'          ).style.fontSize   = (info_text_size)+'px';
  document.getElementById('info_box'          ).style.lineHeight = (info_text_size*1.3)+'px';
  document.getElementById('info_box'          ).style.width      = (img_width+border_width*2)+'px';
  document.getElementById('info_text'         ).style.padding    = (img_width/12)+'px';
  document.getElementById('info_text'         ).style.paddingBottom= (text_size)+'px';
  document.getElementById('open_info_wrapper' ).style.width      = (img_width+border_width*2) +'px';
  document.getElementById('open_info_wrapper' ).style.height     = (img_width/12) +'px';
  document.getElementById('open_info_wrapper' ).style.fontSize   = (img_width/12) +'px';
  document.getElementById('open_info'         ).style.width      = (img_width/15)+'px';
  document.getElementById('open_info'         ).style.left       = '0px';
  document.getElementById('open_shift'        ).style.top        = (-text_size/6)+'px';
  document.getElementById('open_shift'        ).style.left       = (text_size/6)+'px';
  document.getElementById('content_box'       ).style.textShadow = (shadow_size/2)+'px '+(shadow_size/2)+'px '+(shadow_size/2)+'px rgba(0,0,0,.1)';
  document.getElementById('footer'            ).style.fontSize   = text_size +'px';
  document.getElementById('footer'            ).style.lineHeight= (text_size*1.4) +'px';
}

//============================================================================== additional functions

//------------------------------------------------------------------------------ GPS coordinate converter
//source: https://awik.io/extract-gps-location-exif-data-photos-using-javascript/
function ConvertDMSToDD(degrees, minutes, seconds, direction) {
    var dd = degrees + (minutes/60) + (seconds/3600);
    if (direction == "S" || direction == "W") {
        dd = dd * -1;
    }
    return dd;
}

//------------------------------------------------------------------------------ load json
//source: https://wiki.selfhtml.org/wiki/JSON#Einbindung
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

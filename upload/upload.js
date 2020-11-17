var w,h;              // width and height of viewport - will be calculated when loaded & resized
var img_width, border_width, text_size, line_height, margin;

function file_selected(){
  document.getElementById("upload_label").innerHTML = "Uploading ...";
  document.upload_form.submit();
}

function init(){

  layout();      // calculate general sizes, like w & h of viewport, image width, etc.

}

///////////////////////////////////////////////////////////////////--------------------------GET W & H OF VIEWPORT
function layout(){

  //measure width of viewport with the help of 100% wide div
  w =  document.getElementById('w100p').getBoundingClientRect().width ;
  if (w<340){w=340;}
  h = window.innerHeight
  || document.documentElement.clientHeight
  || document.body.clientHeight;
  var s = Math.min(w,h); // s: find shorter measurement w/h?

  if(w>h){ //landscape screen formatting
    console.log('w:'+w+'  h:'+h);

    img_width = h*(3/4)*.8;
    border_width = h/150;

    // calculate font sizes
    text_size   = img_width/20;
    line_height = img_width/15;
    shadow_size = img_width/100;
    margin      = (w-(img_width*2))/3;


    document.getElementById("image_block"        ).style.position      = 'fixed';
    document.getElementById("image_block"        ).style.width         = (img_width+border_width*2) + 'px';
    document.getElementById("image_block"        ).style.left          = margin + 'px';
    document.getElementById("image_block"        ).style.top           = (img_width*.1) + 'px';
    document.getElementById("menu_block"         ).style.position      = 'fixed';
    document.getElementById("menu_block"         ).style.width         = (img_width+border_width*2) + 'px';
    document.getElementById("menu_block"         ).style.left          = (margin*2+img_width) + 'px';
    document.getElementById("menu_block"         ).style.top           = (img_width*.1) + 'px';
    document.getElementById("all"                ).style.fontSize      = text_size+'px';
    document.getElementById("links"              ).style.fontSize      = text_size+'px';
    document.getElementById("links"              ).style.lineHeight    = text_size+'px';
    document.getElementById("upload_label"       ).style.width         = (img_width + border_width*2) +'px';
    document.getElementById("upload_label"       ).style.height        = (text_size*3) + 'px';
    document.getElementById("upload_label"       ).style.marginBottom  = (border_width*2) + 'px';
    document.getElementById("upload_label"       ).style.boxShadow     = shadow_size+'px '+shadow_size+'px '+shadow_size+'px rgba(0,0,0,.1)';
if (document.getElementById("link1")!=null){
    document.getElementById("link1"              ).style.boxShadow     = shadow_size+'px '+shadow_size+'px '+shadow_size+'px rgba(0,0,0,.1)';
    document.getElementById("link1"              ).style.marginBottom  = (border_width*2) + 'px';
    document.getElementById("link1"              ).style.height        = (text_size*3) + 'px';
    document.getElementById("link1"              ).style.width         = (img_width + border_width*2) +'px';
}
if (document.getElementById("link3")!=null){
    document.getElementById("link3"              ).style.boxShadow     = shadow_size+'px '+shadow_size+'px '+shadow_size+'px rgba(0,0,0,.1)';
    document.getElementById("link3"              ).style.marginBottom  = (border_width*2) + 'px';
    document.getElementById("link3"              ).style.height        = (text_size*3) + 'px';
    document.getElementById("link3"              ).style.width         = (img_width + border_width*2) +'px';
}
if (document.getElementById("link4")!=null){
  document.getElementById("link4"              ).style.boxShadow     = shadow_size+'px '+shadow_size+'px '+shadow_size+'px rgba(0,0,0,.1)';
  document.getElementById("link4"              ).style.marginBottom  = (border_width*2) + 'px';
  document.getElementById("link4"              ).style.height        = (text_size*3) + 'px';
  document.getElementById("link4"              ).style.width         = (img_width + border_width*2) +'px';
  }

    //check if there's an image - if not, there's an error
    var selected_photo = document.getElementById('selected_photo');
    var error_message  = !(typeof(selected_photo) != 'undefined' && selected_photo != null);
    if (!error_message){
      console.log('photo exists!');
      var img_aspect = document.getElementById('selected_photo').naturalHeight/document.getElementById('selected_photo').naturalWidth;
      document.getElementById("headline"          ).style.fontSize      = text_size+'px';
      document.getElementById("headline"          ).style.lineHeight    = line_height+'px';
      document.getElementById("headline"          ).style.position      = 'fixed';
      document.getElementById("headline"          ).style.width         = (img_width+border_width*2) + 'px';
      document.getElementById("headline"          ).style.top           = (img_aspect*img_width+img_width*.15) +'px';
      document.getElementById("headline"          ).style.left          = margin + 'px';
      document.getElementById("selected_photo"    ).style.border        = border_width+'px solid white';
      document.getElementById("selected_photo"    ).style.width         = img_width+'px';
      document.getElementById("selected_photo"    ).style.boxShadow     = shadow_size+'px '+shadow_size+'px '+shadow_size+'px rgba(0,0,0,.1)';
      document.getElementById("caption_title"     ).style.fontSize      = text_size+'px';
      document.getElementById("caption_title"     ).style.height        = (text_size*2)+'px';
      document.getElementById("iptc_caption_field").style.fontSize      = text_size+'px';
      document.getElementById("iptc_caption_field").style.width         = (img_width + border_width*2) + 'px';
      document.getElementById("iptc_caption_field").style.marginBottom  = (border_width) + 'px';
      document.getElementById("iptc_caption_field").style.padding       = (border_width*2) + 'px';
      document.getElementById("submit_button"     ).style.width         = (img_width + border_width*2) +'px';    document.getElementById("iptc_caption_field" ).style.height        = (text_size*5) + 'px';
      document.getElementById("submit_button"     ).style.fontSize      = text_size+'px';
      document.getElementById("submit_button"     ).style.height        = (text_size*3) + 'px';
      document.getElementById("submit_button"     ).style.marginBottom  = (border_width*2) + 'px';
      document.getElementById("submit_button"     ).style.boxShadow     = shadow_size+'px '+shadow_size+'px '+shadow_size+'px rgba(0,0,0,.1)';
      document.getElementById("link2"             ).style.boxShadow     = shadow_size+'px '+shadow_size+'px '+shadow_size+'px rgba(0,0,0,.1)';
      document.getElementById("link2"             ).style.marginBottom  = (border_width*2) + 'px';
      document.getElementById("link2"             ).style.height        = (text_size*3) + 'px';
      document.getElementById("link2"             ).style.width         = (img_width + border_width*2) +'px';
    }

    //--------------------------------------------------------------------------- end of landscape formatting
  }else{
    //--------------------------------------------------------------------------- portrait formatting
    img_width = w*.9;
    border_width = w/100;

    // calculate font sizes
    text_size   = img_width/20;
    line_height = img_width/15;
    shadow_size = img_width/100;
    margin      = (w-(img_width*2))/3;



    document.getElementById("all"                ).style.width         = (img_width+border_width*2) + 'px';
    document.getElementById("all"                ).style.display       = 'block';
    document.getElementById("all"                ).style.position      = 'absolute';
    document.getElementById("all"                ).style.left          = ((w-(img_width+border_width*2))/2)+'px';
    document.getElementById("all"                ).style.top           = ((w-(img_width+border_width*2))/2)+'px';
    document.getElementById("image_block"        ).style.width         = (img_width+border_width*2) + 'px';
    document.getElementById("menu_block"         ).style.width         = (img_width+border_width*2) + 'px';
    document.getElementById("all"                ).style.fontSize      = text_size+'px';
    document.getElementById("links"              ).style.fontSize      = text_size+'px';
    document.getElementById("links"              ).style.lineHeight    = text_size+'px';
    document.getElementById("upload_label"       ).style.width         = (img_width + border_width*2) +'px';
    document.getElementById("link1"              ).style.width         = (img_width + border_width*2) +'px';
    document.getElementById("link3"              ).style.width         = (img_width + border_width*2) +'px';
    document.getElementById("link4"              ).style.width         = (img_width + border_width*2) +'px';
    document.getElementById("upload_label"       ).style.height        = (text_size*3) + 'px';
    document.getElementById("link1"              ).style.height        = (text_size*3) + 'px';
    document.getElementById("link3"              ).style.height        = (text_size*3) + 'px';
    document.getElementById("link4"              ).style.height        = (text_size*3) + 'px';
    document.getElementById("upload_label"       ).style.marginBottom  = ((w-(img_width+border_width*2))*.5)+'px';
    document.getElementById("link1"              ).style.marginBottom  = (border_width*2) + 'px';
    document.getElementById("link3"              ).style.marginBottom  = (border_width*2) + 'px';
    document.getElementById("link4"              ).style.marginBottom  = ((w-(img_width+border_width*2))/2)+'px';
    document.getElementById("upload_label"       ).style.boxShadow     = shadow_size+'px '+shadow_size+'px '+shadow_size+'px rgba(0,0,0,.1)';
    document.getElementById("link1"              ).style.boxShadow     = shadow_size+'px '+shadow_size+'px '+shadow_size+'px rgba(0,0,0,.1)';
    document.getElementById("link3"              ).style.boxShadow     = shadow_size+'px '+shadow_size+'px '+shadow_size+'px rgba(0,0,0,.1)';
    document.getElementById("link4"              ).style.boxShadow     = shadow_size+'px '+shadow_size+'px '+shadow_size+'px rgba(0,0,0,.1)';

    //check if there's an image - if not, there's an error
    var selected_photo = document.getElementById('selected_photo');
    var error_message  = !(typeof(selected_photo) != 'undefined' && selected_photo != null);
    if (!error_message){
      console.log('photo exists!');
      var img_aspect = document.getElementById('selected_photo').naturalHeight/document.getElementById('selected_photo').naturalWidth;

      document.getElementById("headline"          ).style.fontSize      = text_size+'px';
      document.getElementById("headline"          ).style.lineHeight    = line_height+'px';
      document.getElementById("headline"          ).style.marginTop     = (w-(img_width+border_width*2))/2+'px';
      document.getElementById("headline"          ).style.marginBottom  = (w-(img_width+border_width*2))/2+'px';
      document.getElementById("headline"          ).style.width         = (img_width+border_width*2) + 'px';
      document.getElementById("selected_photo"    ).style.border        = border_width+'px solid white';
      document.getElementById("selected_photo"    ).style.width         = img_width+'px';
      document.getElementById("selected_photo"    ).style.boxShadow     = shadow_size+'px '+shadow_size+'px '+shadow_size+'px rgba(0,0,0,.1)';
      document.getElementById("caption_title"     ).style.fontSize      = text_size+'px';
      document.getElementById("caption_title"     ).style.height        = ((w-(img_width+border_width*2))*1.5)+'px';
      document.getElementById("iptc_caption_field").style.fontSize      = text_size+'px';
      document.getElementById("iptc_caption_field").style.width         = (img_width + border_width*2) + 'px';
      document.getElementById("iptc_caption_field").style.marginBottom  = (border_width) + 'px';
      document.getElementById("iptc_caption_field").style.padding       = (border_width*2) + 'px';
      document.getElementById("submit_button"     ).style.width         = (img_width + border_width*2) +'px';
      document.getElementById("iptc_caption_field").style.height        = (text_size*5) + 'px';
      document.getElementById("submit_button"     ).style.fontSize      = text_size+'px';
      document.getElementById("submit_button"     ).style.height        = (text_size*3) + 'px';
      document.getElementById("submit_button"     ).style.marginBottom  = ((w-(img_width+border_width*2))*1.5)+'px';
      document.getElementById("submit_button"     ).style.boxShadow     = shadow_size+'px '+shadow_size+'px '+shadow_size+'px rgba(0,0,0,.1)';
      document.getElementById("link2"             ).style.boxShadow     = shadow_size+'px '+shadow_size+'px '+shadow_size+'px rgba(0,0,0,.1)';
      document.getElementById("link2"             ).style.marginBottom  = (border_width*2) + 'px';
      document.getElementById("link2"             ).style.height        = (text_size*3) + 'px';
      document.getElementById("link2"             ).style.width         = (img_width + border_width*2) +'px';
    }
  }
  document.getElementById("all"                   ).style.opacity       = 1; // fade in

}

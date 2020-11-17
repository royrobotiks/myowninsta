<?php

// updates IPTC metadata in image files

//////////////////////////////////////////////////////////////////////////////// Handling URL GET request
$photo_id       = $_GET['photo_id'];                   // get photo ID from URL GET
$item           = $_GET['item'];
$iptc_caption   = $_GET['iptc_caption'];           // get exif description URL GET
$iptc_copyright = '';
$iptc_copyright = $_GET['iptc_copyright'];

//////////////////////////////////////////////////////////////////////////////// Sanitize
$iptc_caption = str_replace("<", "-", $iptc_caption );
$iptc_caption = str_replace(">", "-", $iptc_caption );

//////////////////////////////////////////////////////////////////////////////// Read settings ------------> settings.json
$settings_file     = file_get_contents("../myowninsta.json");
$photo_file_name   = json_decode($settings_file, true)['photo_file_name'];
$version           = json_decode($settings_file, true)['version'];
$foreground_color  = json_decode($settings_file, true)['foreground_color'];
$foreground_hover  = json_decode($settings_file, true)['foreground_hover'];
$background_color  = json_decode($settings_file, true)['background_color'];

//image path
$upload_folder = '../';   //upload folder
$sub_folder = intval(intval($photo_id)/100).'/';
$hires_image_path = $upload_folder.$sub_folder.$photo_file_name.'_'.$photo_id.'.jpg';
$lores_image_path = $upload_folder.$sub_folder.$photo_file_name.'_Lores_'.$photo_id.'.jpg';
$thumb_image_path = $upload_folder.$sub_folder.$photo_file_name.'_Lores_Thumb_'.$photo_id.'.jpg';

// Set the IPTC tags
$iptc = array(
    '2#120' => $iptc_caption,
    '2#116' => $iptc_copyright
);

// Convert the IPTC tags into binary code
$data = '';

foreach($iptc as $tag => $string)
{
    $tag = substr($tag, 2);
    $data .= iptc_make_tag(2, $tag, $string);
}

// Embed the IPTC data
$content_thumb = iptcembed($data, $thumb_image_path);
$content_lores = iptcembed($data, $lores_image_path);
$content_hires = iptcembed($data, $hires_image_path);

// Write the new image data out to the files
$fp = fopen($thumb_image_path, "wb");
fwrite($fp, $content_thumb);
fclose($fp);
$fp = fopen($lores_image_path, "wb");
fwrite($fp, $content_lores);
fclose($fp);
$fp = fopen($hires_image_path, "wb");
fwrite($fp, $content_hires);
fclose($fp);

//////////////////////////////////////////////////////////////////////////////// Make HTML
echo '
<!DOCTYPE html>
<head>
  <title>IPTC / EXIF update</title>
  <meta name="theme-color" content="#ccc">
  <meta http-equiv="refresh" content="2; URL=index.php?item='.$item.'">
  <script>
  function init(){
    //measure width of viewport with the help of 100% wide div
    w =  document.getElementById("w100p").getBoundingClientRect().width ;
    if (w<340){w=340;}
    h = window.innerHeight
    || document.documentElement.clientHeight
    || document.body.clientHeight;
    var s = Math.min(w,h); // s: find shorter measurement w/h?
    //calculate width of images and border thickness
    img_width = h*(3/4)*.9;
    if (h>w){
      img_width = w*.9;
    }
    border_width = s/150;
    // calculate font sizes
    headline_size = img_width/16;
    document.getElementById("info").style.fontSize=headline_size+"px";
  }
  </script>
  <style>
    html, body {margin: 0; height: 100%; overflow: hidden}
  </style>
</head>
<html>
  <body style="background: #ccc;" onload="init()">
    <div id="w100p" style="height:0px">   <!--    invisible div for measuring screen width     --></div>
    <div id="info" style="font-style:italic;color:#222;width:100vw;height:90vh;padding:0px;margin:0px;background:#ccc;display: flex;align-items: center;justify-content: center;">
      Updating metadata ...
    </div>
  </body>
</html>';

////////////////////////////////////////////////////////////////////////////////  iptc_make_tag() function by Thies C. Arntzen
function iptc_make_tag($rec, $data, $value)
{
    $length = strlen($value);
    $retval = chr(0x1C) . chr($rec) . chr($data);
    if($length < 0x8000)
    {
        $retval .= chr($length >> 8) .  chr($length & 0xFF);
    }
    else
    {
        $retval .= chr(0x80) .
                   chr(0x04) .
                   chr(($length >> 24) & 0xFF) .
                   chr(($length >> 16) & 0xFF) .
                   chr(($length >> 8) & 0xFF) .
                   chr($length & 0xFF);
    }
    return $retval . $value;
}

<?php

// deletes a photo and its lores copy with the item number that was received by GET

$item_to_delete = $_GET['item'];
$upload_folder = '../'; //upload folder

//////////////////////////////////////////////////////////////////////////////// Read settings ------------> settings.json
$settings_file     = file_get_contents("../myowninsta.json");
$photo_file_name   = json_decode($settings_file, true)['photo_file_name'];
$version           = json_decode($settings_file, true)['version'];
$foreground_color  = json_decode($settings_file, true)['foreground_color'];
$foreground_hover  = json_decode($settings_file, true)['foreground_hover'];
$background_color  = json_decode($settings_file, true)['background_color'];

//////////////////////////////////////////////////////////////////////////////// read file ------------> entries.json
$amount_of_entries_file_content = file_get_contents("../myowninsta.json");
$photo_array           = json_decode($amount_of_entries_file_content, true)['entries'];
$amount_of_entries     = count($photo_array);          // $amount_of_entries: amount of entries
$photo_to_delete       = $photo_array[$amount_of_entries-$item_to_delete];

////////////////////////////////////////////////////////////////////////////////image paths to be deleted
$sub_folder = intval(intval($photo_to_delete)/100).'/';
$thumb_photo_path = $upload_folder.$sub_folder.$photo_file_name.'_Lores_Thumb_'.$photo_to_delete.'.jpg';
$lores_photo_path = $upload_folder.$sub_folder.$photo_file_name.'_Lores_'.$photo_to_delete.'.jpg';
$hires_photo_path = $upload_folder.$sub_folder.$photo_file_name.'_'.$photo_to_delete.'.jpg';

//delete lores and hires images on server
unlink($thumb_photo_path);
unlink($lores_photo_path);
unlink($hires_photo_path);


//delete  entry in entries.json -- attention: the array index numbering is reverse to the item index numbering system!
array_splice($photo_array, $amount_of_entries-$item_to_delete, 1);



// write array in file ------------> myowninsta.json
$entries_json =json_encode($photo_array,true);
$fp = fopen('../myowninsta.json', 'w');
fwrite($fp, '{
  "version"          : "'.$version.'",
  "photo_file_name"  : "'.$photo_file_name.'",
  "foreground_color" : "'.$foreground_color.'",
  "foreground_hover" : "'.$foreground_hover.'",
  "background_color" : "'.$background_color.'",
  "entries": '.$entries_json.'
}');
fclose($fp);

echo'<!DOCTYPE html>
<head>
  <title>Delete photo</title>
  <meta name="theme-color" content="#ccc">
  <meta http-equiv="Expires" content="-1">
  <meta http-equiv="refresh" content="1; URL=index.php">
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
      Deleting photo ...
    </div>
  </body>
</html>';

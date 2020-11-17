<?php
/*
Sort all photos by exif date
Not the most efficient / fast sorting algorithm - but it works :)
*/
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
      Sorting ';



      //////////////////////////////////////////////////////////////////////////////// Read settings ------------> settings.json
      $settings_file     = file_get_contents("../myowninsta.json");
      $photo_file_name   = json_decode($settings_file, true)['photo_file_name'];
      $version           = json_decode($settings_file, true)['version'];
      $foreground_color  = json_decode($settings_file, true)['foreground_color'];
      $foreground_hover  = json_decode($settings_file, true)['foreground_hover'];
      $background_color  = json_decode($settings_file, true)['background_color'];



      //////////////////////////////////////////////////////////////////////////////// Read entries -------------> myowninsta.json

      $json_file = file_get_contents("../myowninsta.json");
      $photo_array=json_decode($json_file, true)['entries'];
      $entries = count($photo_array);          // $entries: amount of entries
    /*  echo 'reading json:<br>
        entries:'.$entries.'<br>
        array:'.$photo_array.'<br>
        entry[0]:'.$photo_array[0].'<br>
        file name:'.$photo_file_name.'<hr>
      ';*/

      echo      $entries.' entries ...
          </div>
        </body>
      </html>';

      $index=0;
      // go through all images starting from the end of the list
      while ($index<$entries-2){
      echo '<br>['.$index.']:'.$photo_array[$index].' - ['.($index+1).']:'.$photo_array[$index+1].'  ';

        // get paths of 2 subsequent images
        $image_path_a = '../'.intval(intval($photo_array[intval($index)])/100).'/'.$photo_file_name.'_Lores_'.$photo_array[intval($index)].'.jpg';
        $image_path_b = '../'.intval(intval($photo_array[intval($index)+1])/100).'/'.$photo_file_name.'_Lores_'.$photo_array[intval($index)+1].'.jpg';

        // get dates of images
        $exif_data_a = exif_read_data ($image_path_a);
        $timestamp_a = '';
        if (!empty($exif_data_a['DateTimeOriginal'])) {
            $timestamp_a =str_replace(array(" ", ":"), "", $exif_data_a['DateTimeOriginal']);
        }
        $exif_data_b = exif_read_data ($image_path_b);
        $timestamp_b = '';
        if (!empty($exif_data_b['DateTimeOriginal'])) {
            $timestamp_b =str_replace(array(" ", ":"), "", $exif_data_b['DateTimeOriginal']);
        }
        // check if pic with higher number is older > then swap those two array elements!
        if($timestamp_a < $timestamp_b){
          $tmp_index             = $photo_array[$index];
          $photo_array[$index]   = $photo_array[$index+1];
          $photo_array[$index+1] = $tmp_index;
          if ($index>0){$index--;}else{$index++;}
        }else{
          $index++;
        }
      }

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
/*
      echo 'writing json:
      {
        "version"          : "'.$version.'",
        "photo_file_name"  : "'.$photo_file_name.'",
        "foreground_color" : "'.$foreground_color.'",
        "foreground_hover" : "'.$foreground_hover.'",
        "background_color" : "'.$background_color.'",
        "entries": '.$entries_json.'
      }';*/

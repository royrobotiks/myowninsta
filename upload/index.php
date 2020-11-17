<?php

// upload jpegs & enter metadata

$error_message = '';
$entries       = -1;
$selected_item = -1;
$item_type     = '';

//////////////////////////////////////////////////////////////////////////////// Read settings ------------> myowninsta.json
$settings_file     = file_get_contents("../myowninsta.json");
$photo_file_name   = json_decode($settings_file, true)['photo_file_name'];
$version           = json_decode($settings_file, true)['version'];
$foreground_color  = json_decode($settings_file, true)['foreground_color'];
$foreground_hover  = json_decode($settings_file, true)['foreground_hover'];
$background_color  = json_decode($settings_file, true)['background_color'];
$image_received    = ''; //SELECTED,  UPLOAD, ERROR, LATEST, EMPTY, NONE,

//////////////////////////////////////////////////////////////////////////////// Read entries -------------> myowninsta.json
$json_file = file_get_contents("../myowninsta.json");
$photo_array=json_decode($json_file, true)['entries'];
$entries = count($photo_array);          // $entries: amount of entries
//////////////////////////////////////////////////////////////////////////////// Handling URL GET request
$get_item = $_GET['item']; // get variable from URL GET
$upload_folder = '../';   //upload folder

// receive item via GET, receive picture via UPLOAD, receive no picture/item
if ($get_item>0){         // item number received via GET
  $image_received = 'SELECTED';
  $selected_item = $get_item;
  $item_type = 'Selected';
}else{
  $image_received = 'UPLOAD';
//////////////////////////////////////////////////////////////////////////////// Handling uploaded jpg
  $filename  = pathinfo($_FILES['uploaded_image_file']['name'], PATHINFO_FILENAME);
  $extension = strtolower(pathinfo($_FILES['uploaded_image_file']['name'], PATHINFO_EXTENSION));
  $got_image = 1;

  if (!$filename){
    $got_image = 0;
  }

  //Check file extension
  $allowed_extensions = array('jpg');
  if(!in_array($extension, $allowed_extensions) && $got_image==1) {
   $error_message= "File extension is not .jpg!<br>";
   $image_received = 'ERROR';
   $got_image = 0;
  }
  $extension = 'jpg';

  //check file size
  $max_size = 64000*1024; //64MB
  if($_FILES['uploaded_image_file']['size'] > $max_size && $got_image==1) {
    $error_message= "File too big! <br>";
    $image_received = 'ERROR';
    $got_image = 0;
  }

  //check image file
  if(function_exists('exif_imagetype') && $got_image==1) {
   $allowed_types = array(IMAGETYPE_JPEG, );//IMAGETYPE_PNG, IMAGETYPE_GIF);
   $detected_type = exif_imagetype($_FILES['uploaded_image_file']['tmp_name']);
   if(!in_array($detected_type, $allowed_types)) {
     $error_message= "Filetype is not jpg! <br>";
     $image_received = 'ERROR';
     $got_image = 0;
   }
  }

  if ($got_image==1){
    // jpg image received!

    $selected_item = $entries + 1;           // this new item is now the selected item
    $item_type = 'Uploaded';

    $photo_id = max ($photo_array)+1;        // (highest photo id in array +1) is the new for the uploaded photo id
    array_unshift($photo_array, $photo_id);  // add new image number at beginning of array (has to be 1 higher than highest ID in array)

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

    //complete upload path
    $sub_folder = intval(intval($photo_id)/100).'/';
    $hires_image_path = $upload_folder.$sub_folder.$photo_file_name.'_'.$photo_id.'.jpg';
    mkdir( $upload_folder.$sub_folder);

    // change orientation
    $image = imagecreatefromstring(file_get_contents($_FILES['uploaded_image_file']['tmp_name']));
    $exif = exif_read_data($_FILES['uploaded_image_file']['tmp_name']);
    if(!empty($exif['Orientation'])) {
     switch($exif['Orientation']) {
      case 8:
       $image = imagerotate($image,90,0);
       break;
      case 3:
       $image = imagerotate($image,180,0);
       break;
      case 6:
       $image = imagerotate($image,-90,0);
       break;
      }
    }

    //move hires file to new path
    move_uploaded_file($_FILES['uploaded_image_file']['tmp_name'], $hires_image_path);

    // resize image
    $hires_image = imagecreatefromjpeg($hires_image_path);  // load hires image file
    $lores_image = imagescale( $hires_image,1024,-1);       // scale the image
    $thumb_image = imagescale( $hires_image,512,-1);       // scale the image

    $lores_image_path = $upload_folder.$sub_folder.$photo_file_name.'_Lores_'.$photo_id.'.jpg';
    imagejpeg( $lores_image,$lores_image_path ); // adjust format as needed
    imagedestroy( $lores_image );
    transferIptcExif2File($hires_image_path, $lores_image_path); // copy exif data

    $thumb_image_path = $upload_folder.$sub_folder.$photo_file_name.'_Lores_Thumb_'.$photo_id.'.jpg';
    imagejpeg( $thumb_image,$thumb_image_path ); // adjust format as needed
    imagedestroy( $thumb_image );
    transferIptcExif2File($hires_image_path, $thumb_image_path); // copy exif data

  }else{
    // no image has been uploaded, no item specified via GET ->
    $selected_item = count($photo_array);
    $item_type = 'Latest';
    $image_received ='LATEST';
    if ($selected_item==0) { // if there are no pictures uploaded yet
      $image_received='EMPTY';
      $error_message = 'No picture selected';
    }
  }
}

//////////////////////////////////////////////////////////////////////////////// Show either latest uploaded image or selected item

//$image_received    = ''; //SELECTED,  UPLOAD, ERROR, LATEST, EMPTY
if($image_received=='SELECTED'){
  $photo_id = $photo_array[count($photo_array)-$selected_item];
  $error_message = '';
}
if($image_received=='LATEST' or $image_received=='UPLOAD'){ // latest uploaded item
  $photo_id = $photo_array[0]; // get first entry in entries[]
  $error_message = '';
}
if($image_received=='ERROR'){}
if($image_received=='EMPTY'){
  $error_message = 'No image available';
}

$sub_folder = intval(intval($photo_id)/100).'/';
$lores_image_path = $upload_folder.$sub_folder.$photo_file_name.'_Lores_'.$photo_id.'.jpg';
$hires_image_path = $upload_folder.$sub_folder.$photo_file_name.'_'.$photo_id.'.jpg';


//////////////////////////////////////////////////////////////////////////////// Get IPTC metadata from image
if ($image_selected == 'SELECTED' || $image_selected == 'LATEST' )
$info = [];
$caption  ='';
$size = getimagesize($lores_image_path, $info); // read metadata
$iptc = iptcparse($info['APP13']); // if available, read IPTC tags
if (is_array($iptc)) {
  $caption              = $iptc["2#120"][0];
}

//////////////////////////////////////////////////////////////////////////////// Make HTML
echo '
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Photo upload</title>
    <meta name="theme-color" content="#ccc">
    <meta http-equiv="Expires" content="-1">
    <link rel="stylesheet" type="text/css" href="upload.css">
    <script src="upload.js"></script>
  </head>
  <body onload="init()">
    <div id="w100p">   <!--    invisible div for measuring screen width     --></div>
    <div id="all">
      <div id="image_block">';
if ($error_message!=''){ // if there's an error: show error message
  echo('<div id="error">ERROR:<br>'.$error_message.'</div>');
}else{                   // if there's no error: show jpg
  echo '
        <a href="'.$hires_image_path.'" target="_blank" style="background:#ccc;"><img src="'.$lores_image_path.'" id="selected_photo" alt="'.$item_type.' photo"></a>
      </div>
      <div id="headline">
        '.$item_type.' &nbsp;entry:&nbsp;#'.$selected_item.'<br>photo&nbsp;ID&nbsp;=&nbsp;'.$photo_id;
}
echo '
      </div>
      <div id="menu_block">

        <form action="index.php" method="post" enctype="multipart/form-data" id="upload_form" name="upload_form">
          <input type ="file" name="uploaded_image_file" id="file" onchange=file_selected()>
          <label for="file" id="upload_label">Upload new .jpg</label>
        </form>';
if ($error_message==''){ // show caption form if there's no error
  echo '
        <form id="caption_form" action="meta_update.php" method="get">
          <div id="caption_title">IPTC Caption:</div>
          <div>
              <textarea id="iptc_caption_field" name="iptc_caption" cols="35" rows="4"
              placeholder="Enter caption ..." maxlength="300">'.$caption.'</textarea>
              <input type="hidden" name="photo_id" value="'.$photo_id.'">
              <input type="hidden" name="t" value="'.time().'">
              <input type="hidden" name="item" value="'.$selected_item.'"><br>
              <input id="submit_button" type="submit" value="Save caption" />
           </div>
        </form>';
      }

echo'
        <div id="links">';

// show delete button if there's no error
if ($error_message==''){ echo'<a id="link2" href="delete.php?item='.$selected_item.'&t='.time().'">Delete this photo</a>';}
if ($entries>0){ echo'<a id="link1" href="gallery.html?t='.time().'">Gallery overview / select</a>';}
if ($entries>1){ echo'<a id="link3" href="sort.php?t='.time().'">Sort photos by date</a>';}

   echo'  <a id="link4" href="../index.html?t='.time().'">my own insta ;)</a>
        </div>
      </div>
    </div>
  </body>
</html>';




































//////////////////////////////////////////////////////////////////////////////// transfer exif function

function transferIptcExif2File($srcfile, $destfile) {
    // Function transfers EXIF (APP1) and IPTC (APP13) from $srcfile and adds it to $destfile
    // JPEG file has format 0xFFD8 + [APP0] + [APP1] + ... [APP15] + <image data> where [APPi] are optional
    // Segment APPi (where i=0x0 to 0xF) has format 0xFFEi + 0xMM + 0xLL + <data> (where 0xMM is
    //   most significant 8 bits of (strlen(<data>) + 2) and 0xLL is the least significant 8 bits
    //   of (strlen(<data>) + 2)

    if (file_exists($srcfile) && file_exists($destfile)) {
        $srcsize = @getimagesize($srcfile, $imageinfo);
        // Prepare EXIF data bytes from source file
        $exifdata = (is_array($imageinfo) && key_exists("APP1", $imageinfo)) ? $imageinfo['APP1'] : null;
        if ($exifdata) {
            $exiflength = strlen($exifdata) + 2;
            if ($exiflength > 0xFFFF) return false;
            // Construct EXIF segment
            $exifdata = chr(0xFF) . chr(0xE1) . chr(($exiflength >> 8) & 0xFF) . chr($exiflength & 0xFF) . $exifdata;
        }
        // Prepare IPTC data bytes from source file
        $iptcdata = (is_array($imageinfo) && key_exists("APP13", $imageinfo)) ? $imageinfo['APP13'] : null;
        if ($iptcdata) {
            $iptclength = strlen($iptcdata) + 2;
            if ($iptclength > 0xFFFF) return false;
            // Construct IPTC segment
            $iptcdata = chr(0xFF) . chr(0xED) . chr(($iptclength >> 8) & 0xFF) . chr($iptclength & 0xFF) . $iptcdata;
        }
        $destfilecontent = @file_get_contents($destfile);
        if (!$destfilecontent) return false;
        if (strlen($destfilecontent) > 0) {
            $destfilecontent = substr($destfilecontent, 2);
            $portiontoadd = chr(0xFF) . chr(0xD8);          // Variable accumulates new & original IPTC application segments
            $exifadded = !$exifdata;
            $iptcadded = !$iptcdata;

            while ((substr($destfilecontent, 0, 2) & 0xFFF0) === 0xFFE0) {
                $segmentlen = (substr($destfilecontent, 2, 2) & 0xFFFF);
                $iptcsegmentnumber = (substr($destfilecontent, 1, 1) & 0x0F);   // Last 4 bits of second byte is IPTC segment #
                if ($segmentlen <= 2) return false;
                $thisexistingsegment = substr($destfilecontent, 0, $segmentlen + 2);
                if ((1 <= $iptcsegmentnumber) && (!$exifadded)) {
                    $portiontoadd .= $exifdata;
                    $exifadded = true;
                    if (1 === $iptcsegmentnumber) $thisexistingsegment = '';
                }
                if ((13 <= $iptcsegmentnumber) && (!$iptcadded)) {
                    $portiontoadd .= $iptcdata;
                    $iptcadded = true;
                    if (13 === $iptcsegmentnumber) $thisexistingsegment = '';
                }
                $portiontoadd .= $thisexistingsegment;
                $destfilecontent = substr($destfilecontent, $segmentlen + 2);
            }
            if (!$exifadded) $portiontoadd .= $exifdata;  //  Add EXIF data if not added already
            if (!$iptcadded) $portiontoadd .= $iptcdata;  //  Add IPTC data if not added already
            $outputfile = fopen($destfile, 'w');
            if ($outputfile) return fwrite($outputfile, $portiontoadd . $destfilecontent); else return false;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

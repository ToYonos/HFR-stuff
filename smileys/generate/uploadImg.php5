<?php

function image_upload($name, $path)
{
    if (!isset($_FILES[$name]))
      return false;

    $newname = sha1(microtime(true));
	//$newname = $newname[0].'/'.$newname[1].'/'.$newname;

    if ($_FILES[$name]['error'] != 0)
      return false;

    $dir = dirname($path . $newname);

    if (!file_exists($dir))
      mkdir($dir, 0777, true);

    @move_uploaded_file($_FILES[$name]['tmp_name'], $path . $newname);

    if (!file_exists($path . $newname))
      return false;

    $img_info = @getimagesize($path . $newname);

    if (!$img_info)
    {
      @unlink($path . $newname);
      return false;
    }

    $img_types = array(IMAGETYPE_GIF, IMAGETYPE_JPEG, IMAGETYPE_PNG);
    $exts = array(
      IMAGETYPE_GIF   => 'gif',
	  IMAGETYPE_JPEG  => 'jpg',
      IMAGETYPE_PNG   => 'png'
    );

    if (!in_array($img_info[2], $img_types))
    {
      @unlink($path . $newname);
      return false;    
    }

    rename($path . $newname, $path . $newname . '.' . $exts[$img_info[2]]);

    return $path . $newname . '.' . $exts[$img_info[2]];
}

echo ($path = image_upload('tmpImg', './tmp/')) ? $path : '';

?>
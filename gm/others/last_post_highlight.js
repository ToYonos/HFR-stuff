var led_green="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAkFJREFUOMudk71rU1EYxn/35KZ5c5Pg7Yd6xVqiaLngErfSIZQ6pEN1aru6SEHyr7h26ezUycGhdxBCBil0CeJwxQ8i2HAjNj20SXrKzYdDGlpIJ8/4npff+57nPI9FFGSolgz/eSz2SExUi8iN3VUMwPbWttrd2x3cDJjB5ZOfJwp9bFwGGB6ieUJYXiHa2Udfb7cnJm+xhhWukCGPC2SRzA9M54ja+z9UWKcy3gQgwSYqKCLvPpLlLa+5YIPbcGuVMP2cevIptF2yzhT+RYNCfEK9/AJ9+H0EsQFKAJ9ZossSHnr2FRW1julZeJkm0p/BdbpgNRH7iLWdkAhGT1EUERyEFitM486+oZJYR4uFn+pQOAV/OI83XMQdPkPkHv6drxTGQo80+Img8JjDJFbRPQtPxeTjNv4whUcOBiDZHKZ1FzoR7lgDFQDLxwhpJPsIE1+Qj9sUTlv4gxSe5JCUjSs2MkwiZIA+glMebVCqYljE5BxMPyYfH1EYzOGlFB5pBBssMAZMIom2Bhjcq69UAHjoszlqxDAIyQ8beKQBgSEIYBRodYK2Gmgc6nRfmitAFcNjDrrnhEQY6xStbLQFWkGkQJsO9e43dLJLyAPqY/sn2LyEbJTb9+uH7bjBPH16U9BTFtqcE/VaROqAv8ljviws86Hp8Jtf9CatXEQW9llqNynELoWzHORmgQ7mLEOFaWrBAvXSNSdOZCEoIiUHoYnLFELSF2ZCjSYaWzgoImPIzWmcSGTA9cgHl3elKuYfDVDd4qsA3AcAAAAASUVORK5CYII="

var led_gray="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAAAXNSR0IArs4c6QAAAZFJREFUKM99kT9v01AUxY/fc5Kb2KKvosMTLZIlBjxkMGVol0gdWikTDGFl41PwAfgizJ5ATCCZCQaGCHloy4CldHATt7ppTLghjsNAS5k44+/8WY7zxvsk+I/cW7tLtzgV4LV6XgPOS/0H+eY0KEJtarF87/gof8fXCzftV33ngAIPbTqXi+E8eZSkAgC6pwb0wY9fLJ9tYPd4NwvQ9pthEV1lT/ibAC5wgu/7i/1N7id7Ajsl3yzBNOl/ycGA6lKLZge+eZrssQoX0SrcstvmAW2F51GXABfIybF3JGLYZfAzdG0HDvkyRmEAQD3Emlq0Lb+CeTQNXeuRaxqkiVDTBgEqFkc6UtlJtAq0bZEGpBbFa/EZABSwyd5whVFwaZtoAARxuOQLbmW1ALqnxlUDlztt41V3oSuUTjnPRjwd3v/8tQB0TwGH5aQsdurKqRRLfpWfFLM0eqvOxtV1YCSPzxYFy4wmLOWY3fcmibKPAvzzxYAyYuNSkzr8I08FGFAsf78AYoF0BVhDIZWbUiy/AULgryqfAtSeAAAAAElFTkSuQmCC"

var lastPost=window.location.href.match(/^.*#(t[0-9]+)$/);
if(lastPost != null) {
  lastPost=lastPost.pop();

  var posts=document.evaluate(".//tr[starts-with(@class, 'message cBackCouleurTab')]", 
                              document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
  var i=0;
  while(post=posts.snapshotItem(i)) {
    var postNumber=post.cells[0].firstElementChild.name;
    var newDiv=document.createElement("div");
		newDiv.setAttribute("class", "left");
    var ledImage=document.createElement("img");
    if(postNumber.localeCompare(lastPost) <= 0)
      ledImage.setAttribute("src", led_green);
    else
      ledImage.setAttribute("src", led_gray);
    newDiv.appendChild(ledImage);
    post.cells[1].firstElementChild.insertBefore(
       newDiv, 
       post.cells[1].firstElementChild.firstElementChild);
    ++i;
  }
}

if(document.getElementById("sujetrelatif"))
  document.getElementById("sujetrelatif").style.display="none";
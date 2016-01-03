(function() {
  'use strict';

  $.ajax({
    url: './lists',
    success: function(res) {

      loop(res);
    }
  });

  let forPaused = false,
    lastIndex, hasListener = false;
  const time = document.querySelector("#time"),
    music = document.querySelector("#music");

  function loop(arrayMusic) {
    let tableString = "";
    for (let i = 0; i < arrayMusic.length; i++) {
      tableString += '<tr><td>';
      tableString += arrayMusic[i];
      tableString += '</td></tr>';
    }
    document.querySelector("#list").innerHTML = tableString;
    let items = document.querySelectorAll("#list td");
    [].forEach.call(items, click);
  }

  function click(element, index, array) {
    element.addEventListener("click", function(event) {
      if (forPaused === true && lastIndex === this) {
        pause();
      } else {
        play(this.textContent || this.innerText, this);
      }
    });
  }

  function play(asset, elem) {
    killClass(["activeMusicListItem", "progress"]);
    changeClass(elem, "progress");
    document.querySelector("h1").innerHTML = asset;

    if (lastIndex != elem) {
      let link = './music/' + asset + '.mp3';
      document.querySelector('#music').src = link;
      lastIndex = elem;
    }

    document.querySelector('#music').oncanplaythrough = function() {
      hasListener = true;
      playing(elem);
    };
    if (hasListener) {
      playing(elem);
    }
  }

  function playing(elem) {
  music.play();
    changeClass(elem, "activeMusicListItem");
    forPaused = true;
  }

  function pause() {
    killClass("activeMusicListItem");
  music.pause();
    forPaused = false;
  }

  function changeClass(elem, applyClass) {
    elem.setAttribute("class", applyClass);
  }

  function killClass(findClasses) {
    if (typeof findClasses === 'string') {
      findClasses = [findClasses];
    }

    for (let i = 0; i < findClasses.length; i++) {
      let set = document.querySelectorAll("." + findClasses[i]);
      [].forEach.call(set, function(item) {
        item.setAttribute("class", "");
      });
    }
  }

  function streamTime() {
    time.innerHTML = Math.floor(mus.currentTime * 1000) / 1000;
  }
  music.ontimeupdate = streamTime;
})();

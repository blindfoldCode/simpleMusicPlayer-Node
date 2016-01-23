window.onload = function() {
  'use strict';


  getAsset(`./lists`)
    .then(loop)
    .then(fetchImage)
    .then(attachImage);

  let forPaused = false,
    lastIndex, element;
  const music = document.querySelector("#music");

  function loop(arrayMusic) {
    let tableString = "";
    for (let mp3 of arrayMusic) {
      tableString += `<tr><td class="title" name="${mp3}">${mp3}</td><td class="time">00:00</td></tr>`;
    }
    document.querySelector("#list").innerHTML = tableString;
    let items = document.querySelectorAll("#list .title");
    //refactor --  move clicks to new promise
    [].forEach.call(items, click);
    return arrayMusic;
  }

  function click(elements, index, array) {
    elements.addEventListener("click", function(event) {
      if (forPaused === true && lastIndex === this) {
        pause();
      } else {
        loadPlay(this.textContent || this.innerText, this);
      }
    });
  }

  /**-----Promises-------**/
  function fetchImage(arrayMusic) {
    let generate = generateReqFromArray(arrayMusic),
      assets = [],
      done = false;
    const buildReturn = (data) => {
      return data;
    };
    while (!done) {
      let gen = generate.next();
      done = gen.done;
      if (!done) assets.push(gen.value);
    }
    return Promise.all(assets).then(buildReturn);

  }

  function attachImage(assetsArray) {
    for (let asset of assetsArray) {
      asset.id = document.querySelector(`td[name="${asset.id}"]`);
      const parent = asset.id.parentNode;
      let img = document.createElement('td')
        .appendChild(document.createElement("img"));
        img.src =`data:image/${asset.type};base64, ${asset.data}`;
        img.width = 50;
        img.height = 50;
        parent.insertBefore(img.parentNode, asset.id);
    }

  }

  function* generateReqFromArray(array) {
    for (let i = 0; i < array.length; i++) {
      yield getAsset(`./metaData/${array[i]}`);
    }
  }

  function getAsset(url) {
    return new Promise((resolve, reject) => {
      let request = new XMLHttpRequest();
      request.open("GET", url);
      request.onload = () => {
        if (request.status === 200) {
          const data = JSON.parse(request.response);
          resolve(data);

        } else {
          reject(Error(`error code: ${request.statusText}`));
        }
      };
      request.onerror = () => {
        reject(Error('There was a network error.'));
      };
      request.send();
    });
  }
  ///-------------------------------------
  function loadPlay(asset, elem) {
    killClass(["activeMusicListItem", "progress"]);
    changeClass(elem, "progress");
    document.querySelector("h1").innerHTML = asset;
    if (lastIndex != elem) {
      let link = `./music/${asset}.mp3`;
      music.src = link;
      lastIndex = elem;
    }
    if (lastIndex === elem) {
      play(elem);
    } else {
      music.oncanplaythrough = function() {
        play(elem);
      };
    }
  }

  function play(elem) {
    if (element) {
      element.nextSibling.innerHTML = `00:00`;
    }
    element = elem;
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
    let elems = [];
    if (typeof findClasses === 'string') {
      elems.push(findClasses);
    } else {
      for (let elem of findClasses) {
        elems.push(elem);
      }
    }
    [].forEach.call(elems, function(item) {
      if (document.querySelector(`.${item}`)) {
        document.querySelector(`.${item}`).setAttribute("class", "");
      }
    });
  }
  const lead0 = (t) => {
    if (t < 10) {
      return "0" + t;
    }
    return t;
  };

  function streamTime() {
    let m = Math.floor(music.currentTime / 60),
      s = Math.floor(music.currentTime - m * 60);
    element.nextSibling.innerHTML = `${lead0(m)}:${lead0(s)}`;
  }

  music.ontimeupdate = streamTime;
  /*
   $.ajax({
    url: './metaData/Kalimba',
    success: function(res) {
     $('<img/>').appendTo($('.col-md-12:eq(0)')).attr("src", `data:image/${res.type};base64,${res.data}`);

    }
  });*/
};

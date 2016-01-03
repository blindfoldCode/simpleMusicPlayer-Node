$.ajax({
    url: './lists',
    success: function (res) {

        loop(res);
    }
});
var forPaused = false,
    lastIndex, hasListener = false,
    time = document.querySelector("#time");

function loop(arrayMusic) {
    var tableString = "";
    for (var i = 0; i < arrayMusic.length; i++) {
        tableString += '<tr><td>';
        tableString += arrayMusic[i];
        tableString += '</td></tr>';
    }
    document.querySelector("#list").innerHTML = tableString;
    var items = document.querySelectorAll("#list td");
      [].forEach.call(items, click);
}

function click(element, index, array) {
    element.addEventListener("click", function (event) {
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
        var link = './music/' + asset + '.mp3';
        document.querySelector('#music').src = link;
        lastIndex = elem;
    }

    document.querySelector('#music').oncanplaythrough = function () {
        hasListener = true;
        playing(elem);
    };
    if (hasListener) {
        playing(elem);
    }
}

function playing(elem) {
    document.querySelector("#music").play();
    changeClass(elem, "activeMusicListItem");
    forPaused = true;
}

function pause() {
    killClass("activeMusicListItem");
    document.querySelector("#music").pause();
    forPaused = false;
}
function changeClass(elem, applyClass) {
    elem.setAttribute("class", applyClass);
}
function killClass(findClasses) {
    if (typeof findClasses === 'string') {
        findClasses = [findClasses];
    }

    for (var i = 0; i < findClasses.length; i++) {
        var set = document.querySelectorAll("." + findClasses[i]);
            [].forEach.call(set, function (item) {
            item.setAttribute("class", "");
        });
    }
}

function streamTime() {
  time.innerHTML =Math.floor(this.currentTime*10) /10 ;

}
document.querySelector("#music").ontimeupdate = streamTime;

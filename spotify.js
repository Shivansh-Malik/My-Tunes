const playbar = document.querySelector(".playbar");
let interval; // Store the background change interval

async function getsongs() {
    let a = await fetch("http://127.0.0.1:5500/songs/");
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    let songs = [];

    for (let i = 0; i < as.length; i++) {
        const element = as[i];
        if (element.href.endsWith(".mp3")) {
            let filename = decodeURIComponent(element.href.split("/").pop());
            songs.push(filename);
        }
    }
    return songs;
}

function formatTime(seconds) {
    seconds = Math.floor(seconds);
    let mins = Math.floor(seconds / 60);
    let secs = seconds % 60;
    
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

let currentAudio = null;
let songs = [];
let currentSongIndex = 0;

const playmusic = (trackIndex) => {
    if (songs.length === 0) return;

    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }

    currentSongIndex = trackIndex % songs.length;
    if (currentSongIndex < 0) currentSongIndex = songs.length - 1;

    currentAudio = new Audio("/songs/" + songs[currentSongIndex]);
    currentAudio.play();
    play.src = "svg/pause.svg";

    playbar.classList.add("animated-bg");
    startBackgroundAnimation();

    currentAudio.addEventListener("ended", playNextSong);
    document.querySelector(".songinfo").innerHTML = songs[currentSongIndex];
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";

    currentAudio.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${formatTime(currentAudio.currentTime)} / ${formatTime(currentAudio.duration)}`;
        document.querySelector(".circle").style.left = (currentAudio.currentTime / currentAudio.duration) * 100 + "%";
    });

    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentAudio.currentTime = ((currentAudio.duration) * percent) / 100;
    });
};

function startBackgroundAnimation() {
    clearInterval(interval);
    interval = setInterval(() => {
        const colors = [
            "linear-gradient(135deg, #ff4e50, #a76d3e)",
            "linear-gradient(135deg, #ec9c07, #78ffd6)",
            "linear-gradient(135deg, #634d46, #ff0844)",
            "linear-gradient(135deg, #12c2e9, #a208f0)",
            "linear-gradient(135deg, #abf105, #4a7650)"
        ];
        playbar.style.background = colors[Math.floor(Math.random() * colors.length)];
    }, 5000);
}

function stopBackgroundAnimation() {
    clearInterval(interval);
    playbar.style.background = ""; 
    playbar.classList.remove("animated-bg");
}

const playNextSong = () => {
    playmusic((currentSongIndex + 1) % songs.length);
};

const playPreviousSong = () => {
    playmusic((currentSongIndex - 1 + songs.length) % songs.length);
};

async function main() {
    songs = await getsongs();
    let songUL = document.querySelector(".songlist ul");
    songUL.innerHTML = "";

    for (const song of songs) {
        let songName = song.replace(".mp3", "");
        let li = document.createElement("li"); 
        li.setAttribute("data-url", song);
        li.innerHTML = `
            <img class="invert" src="svg/music.svg" alt="">
            <div class="info">
                <div>${songName}</div>
                <div>Song Artist</div>
            </div>
            <div class="playnow">
                <img class="invert" src="play.svg" alt="">
            </div>
        `;

        li.addEventListener("click", () => {
            let track = songs.indexOf(song);
            playmusic(track);
        });

        songUL.appendChild(li);
    }

    let el1 = document.getElementById("play");
    el1.addEventListener("click", () => {
        if (!currentAudio) return;

        if (currentAudio.paused) {
            currentAudio.play();
            play.src = "svg/pause.svg";
            playbar.classList.add("animated-bg");
            startBackgroundAnimation();
        } else {
            currentAudio.pause();
            play.src = "svg/play.svg";
            stopBackgroundAnimation();
        }
    });

    document.getElementById("next").addEventListener("click", playNextSong);
    document.getElementById("previous").addEventListener("click", playPreviousSong);

    currentAudio.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${formatTime(currentAudio.currentTime)}:${formatTime(currentAudio.duration)}`;
    });
}
main();

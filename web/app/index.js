document.getElementById('searchBar').addEventListener('input', function (event) {
    const searchText = event.target.value;
    if (searchText != "") {
        if (this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            fetch(`https://api.wireway.ch/wave/ytmusicsearch?q=${encodeURIComponent(searchText)}`)
                .then(response => response.json())
                .then(data => {
                    const musicList = document.querySelector('.music-list');
                    musicList.innerHTML = '';
                    data.items.forEach(music => {
                        const musicItem = document.createElement('li');
                        musicItem.className = 'music-item';
                        const thumbnailUrl = `https://api.wireway.ch/wave/thumbnail/${music.id}`;
                        musicItem.innerHTML = `
                        <img src="${thumbnailUrl}" alt="Thumbnail">
                        <div class="music-info">
                            <strong>${music.title}</strong>
                            <span>by <a class="linkElement artistHover" href="https://youtube.com${music.uploaderUrl}" target="_blank">${music.uploaderName}</a></span>
                            <span>${Math.floor(music.duration / 60)}:${String(music.duration % 60).padStart(2, '0')}</span>
                        </div>
                    `;
                        musicItem.addEventListener('click', function () {
                            playFromUrl(music.title, music.id);
                        });
                        musicList.appendChild(musicItem);

                    });
                })
                .catch(error => console.error('Error fetching music:', error));
        }, 300);
    } else {
        const musicList = document.querySelector('.music-list');

        musicList.innerHTML = '';
    }
});


document.addEventListener('keydown', function (event) {
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        document.getElementById('searchBar').focus();
    }
});


const playBar = document.querySelector('.playBar');
const progressBarContent = playBar.querySelector('.progressBarContent');
const progressBarBg = playBar.querySelector('.progressBarBg');
const progressBar = playBar.querySelector('.progressBar');

let isMouseDown = false;

progressBarContent.addEventListener('mousedown', function (event) {
    isMouseDown = true;
    updateProgressBar(event);
});

document.addEventListener('mouseup', function () {
    isMouseDown = false;
});

document.addEventListener('mousemove', function (event) {
    if (isMouseDown) {
        updateProgressBar(event);
    }
});

function updateProgressBar(event) {
    const rect = progressBarContent.getBoundingClientRect();
    const offsetX = Math.min(Math.max(event.clientX - rect.left, 0), rect.width);
    const percentage = (offsetX / rect.width) * 100 / 2;
    progressBar.style.width = `${percentage}%`;
    const songProgess = (offsetX / rect.width) * 100
    audioPlayer.currentTime = (songProgess / 100) * audioPlayer.duration;
    console.log(`Progress: ${songProgess}%`);
}

document.querySelector('.playButton').addEventListener('click', function () {
    const playButton = document.querySelector('.playButton');
    if(audioPlayer.paused) {
        audioPlayer.play();
        playButton.style.textDecoration = 'underline'
    } else {
        audioPlayer.pause();
        playButton.style.textDecoration = 'none'
    }
});


const audioPlayer = new Audio();

audioPlayer.addEventListener('timeupdate', function () {
    const percentage = (audioPlayer.currentTime / audioPlayer.duration) * 100 / 2;
    progressBar.style.width = `${percentage}%`;
});


function playFromUrl(title, id) {
    const thumbnailUrl = `https://api.wireway.ch/wave/thumbnail/${id}`;
    const streamUrl = `https://api.wireway.ch/wave/audioStreamMp3/${id}`
    audioPlayer.src = streamUrl;
    audioPlayer.play();
    document.getElementById("playBarTitle").innerText = title;
    document.getElementById("playBarCoverImage").src = thumbnailUrl;
    const playButton = document.querySelector('.playButton');
    playButton.style.textDecoration = 'underline'
}
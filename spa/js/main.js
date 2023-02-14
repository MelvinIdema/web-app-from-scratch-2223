import {login, logout, isAuthenticated} from "./utils/auth.js";
import {search, getSongById} from "./utils/api.js";

const controls = document.getElementById("controls");

if (isAuthenticated()) {
    const btn = document.createElement("button");
    btn.id = "logout";
    btn.textContent = "Log out";
    btn.onclick = logout;
    controls.appendChild(btn);
}

if (!isAuthenticated()) {
    const btn = document.createElement("button");
    btn.id = "login";
    btn.onclick = login;
    btn.textContent = "Log in";
    controls.appendChild(btn);
}

async function fetchLyrics(path) {
    const response = await fetch(`https://serverless-shit.ikbenmel.vin/api/scrapeLyrics?url=${path}`);
    const data = await response.json();
    return data.res;
}

const searchForm = document.getElementById("search");
const songTitleEl = document.getElementById("songTitleEl");
const songLyricsEl = document.getElementById("songLyricsEl");

searchForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const searchQuery = searchForm.elements['searchField'].value;
    const response = await search(searchQuery);
    const firstSong = response.response.hits[0];

    if(firstSong.result["lyrics_state"] === "unreleased") {
        songLyricsEl.textContent = "Lyrics for this song is yet to be released. :("
    } else if(firstSong.result["lyrics_state"] === "complete") {
        const song = await getSongById(firstSong.result.id);
        const title = song.response.song["full_title"];
        const path = song.response.song["path"];
        const lyrics = await fetchLyrics(path);

        songTitleEl.textContent = title;
        songLyricsEl.outerHTML = lyrics;
    }
});

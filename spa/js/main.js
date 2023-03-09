import initRouter, { render, redirect, showLoader, hideLoader } from "./utils/router.js";
import { isAuthenticated, redirectToAPIAuthorization, logout } from "./utils/auth.js";
import {fetchLyrics, fetchSentiment, getSongById, search} from "./utils/api.js";

async function RedirectToAuth() {
    await redirectToAPIAuthorization();
    return await render('auth.html', {});
}

async function Login() {
    if(isAuthenticated()) redirect('/');
    return await render('login.html', {});
}

async function Logout() {
    if(!isAuthenticated()) return redirect('/auth/login');

    logout();
    return redirect('/');
}

async function Home() {
    if(!isAuthenticated()) return redirect('/auth/login');

    function afterRender() {
        const searchLyricsForm = document.querySelector("#searchLyrics");

        searchLyricsForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            const query = event.target['songName'].value;
            return redirect(`/search/${query}`);
        });
    }

    return await render(
        'home.html',
        { AppName: "LyrIQ"},
        afterRender
    );
}

async function Search(query) {
    if(!isAuthenticated()) return redirect('/auth/login');

    let theSearch;
    const cachedQuery = localStorage.getItem(query);

    if(!cachedQuery) {
        theSearch = await search(query);
        localStorage.setItem(query, JSON.stringify(theSearch));
    } else {
        theSearch = JSON.parse(cachedQuery);
    }

    const hits = theSearch.response.hits;

    function afterRender() {
        const searchResultsContainer = document.querySelector("#searchResultsContainer");
        let html = ``;

        hits.forEach(hit => {
            const hitElement = `
                <a href="/#/lyrics/${hit.result.id}">
                    <article>    
                        <div class="thumbnail">
                          <img src="${hit.result["song_art_image_thumbnail_url"]}" alt="">
                        </div>
                        <div class="content">
                              <h1>${hit.result["title"]}</h1>
                              <h2>${hit.result["artist_names"]}</h2>
                        </div>
                    </article>
                </a>
            `;
            html += hitElement;
        })

        searchResultsContainer.innerHTML = html;
    }

    return await render('search.html', {
        query: query,
    }, afterRender);
}

async function Lyrics(songId) {
    if(!isAuthenticated()) return redirect('/auth/login');
    if(!songId) return redirect('/');

    let lyrics;
    let sentiment;
    let song;

    const cachedLyrics = localStorage.getItem(songId);
    const cachedSentiment = localStorage.getItem(`sent-${songId}`);
    const cachedSong = localStorage.getItem(`song-${songId}`);

    showLoader();

    if(!cachedSong) {
        song = await getSongById(songId);
        localStorage.setItem(`song-${songId}`, JSON.stringify(song));
    } else {
        song = JSON.parse(cachedSong);
    }

    const songInfo = song.response.song;
    const query = songInfo.path;

    if(!cachedLyrics) {
        lyrics = await fetchLyrics(query);
        localStorage.setItem(songId, lyrics);
    } else {
        lyrics = cachedLyrics;
    }

    if(!cachedSentiment) {
        sentiment = await fetchSentiment(lyrics);
        localStorage.setItem(`sent-${songId}`, JSON.stringify(sentiment));
    } else {
        sentiment = JSON.parse(cachedSentiment);
    }

    hideLoader();

    return await render('lyric.html', {
        title: songInfo.title,
        artist: songInfo["artist_names"],
        lyrics: lyrics,
        sentiment: sentiment.score <= 0 ? "😡" : "😁"
    });
}

async function NotFound() {
    return await render('404.html', {});
}

const routes = {
    '/': Home,
    '/search/:query': Search,
    '/lyrics/:song': Lyrics,
    '/auth': RedirectToAuth,
    '/auth/login': Login,
    '/auth/logout': Logout,
    '/404': NotFound,
}

initRouter(routes);
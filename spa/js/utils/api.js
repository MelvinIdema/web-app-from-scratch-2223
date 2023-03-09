import {retrieveBearerToken} from "./auth.js";

async function search(query) {
    const token = retrieveBearerToken();
    const apiUrl = `https://api.genius.com/search?q=${query}&access_token=${token}`;
    const response = await fetch(apiUrl, {
        method: 'GET'
    });
    return response.json();
}

async function getSongById(id) {
    const token = retrieveBearerToken();
    const apiUrl = `https://api.genius.com/songs/${id}?access_token=${token}`;
    const response = await fetch(apiUrl, {
        method: 'GET'
    });
    return response.json();
}

async function fetchLyrics(path) {
    const response = await fetch(`https://serverless-shit.ikbenmel.vin/api/scrapeLyrics?url=${path}`);
    const data = await response.json();
    return data.res;
}

async function fetchSentiment(lyricsInHtml) {
    const response = await fetch('https://serverless-shit.ikbenmel.vin/api/analyseSentiment', {
        method: 'POST',
        body: JSON.stringify({
            text: lyricsInHtml,
            type: 'HTML'
        }),
        headers: {'Content-Type': 'application/json'}
    });
    return await response.json();
}

export {search, getSongById, fetchLyrics, fetchSentiment};


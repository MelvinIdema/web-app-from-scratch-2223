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

export {search, getSongById};


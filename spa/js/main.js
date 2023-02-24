import initRouter, { render, redirect } from "./utils/router.js";
import { isAuthenticated, redirectToAPIAuthorization, logout } from "./utils/auth.js";

async function RedirectToAuth() {
    await redirectToAPIAuthorization();
    return await render('auth.html', {});
}

async function Login() {
    if(isAuthenticated()) redirect('/');
    return await render('login.html', {});
}

async function Logout() {
    logout();
    return redirect('/');
}

async function Home() {
    if(!isAuthenticated()) return redirect('/auth/login');

    function afterRender() {
        const searchLyricsForm = document.querySelector("#searchLyrics");

        searchLyricsForm.addEventListener("submit", (event) => {
            event.preventDefault();
            const songName = event.target['songName'].value;
            console.log(songName);
        });
    }

    return await render('search.html', {}, afterRender);
}

async function Search(query) {
    if(!query) return redirect('/');

    return await render('lyric.html', {});
}

async function NotFound() {
    return await render('404.html', {});
}

const routes = {
    '/': Home,
    '/search/:song': Search,
    '/auth': RedirectToAuth,
    '/auth/login': Login,
    '/auth/logout': Logout,
    '/404': NotFound,
}

initRouter(routes);
const cachedHtml = {};

const parseLocation = () => location.hash.slice(1).toLowerCase() || '/';

async function Home() {
    /** Do some cool Javascript like fetching an API or check if user is authenticated **/

    const params = {
        appName: "LyrIQ",
        appDescription: "LyrIQ for all your intelligent lyric analysing"
    }
    return await hydrate('home.html', params);
}

async function hydrate(view, params) {
    let html = await loadHtml(view);
    const matches = [...html.matchAll(/{{(.+)}}/gm)];
    if(matches.length === 0) return html;

    matches.forEach(match => {
        if(params[match[1]]) {
            html = html.replace(`${match[0]}`, `${params[match[1]]}`);
        }
    });

    return html;
}

async function loadHtml(view) {
    if(cachedHtml[view]) return cachedHtml[view];

    const res = await fetch(`/views/${view}`);
    const html = res.text();
    cachedHtml[view] = html;

    return html;
}

async function getRoute(path) {
    switch(path) {
        case '/': return Home();
        case '/about': return loadHtml('about.html');
        default: return loadHtml('404.html');
    }
}

async function router() {
    const app = document.getElementById("app");
    const path = parseLocation();
    app.innerHTML = await getRoute(path);
}

window.addEventListener('load', router);
window.addEventListener('hashchange', router);
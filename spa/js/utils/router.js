const cachedHtml = {};

/**
 * Parses the location by removing the /#
 * @returns {string|string}
 */
const parseLocation = () => location.hash.slice(1).toLowerCase() || "/";
const redirect = (path) => window.location.hash = path;
/**
 * Checks the HTML for templating
 * If templating is found it'll loop over each variable and
 * replaces it with the corresponding param. Only works with Strings.
 * Returns the HTML as a string.
 * @param view
 * @param params
 * @param callback
 * @returns {Promise<*|string>}
 */
async function render(view, params, callback = () => null) {
    let html = await loadHtml(view);

    const matches = [...html.matchAll(/{{(.+)}}/gm)];
    if(matches.length === 0) return [html, callback];

    matches.forEach(match => {
        if(params[match[1]]) {
            html = html.replace(`${match[0]}`, `${params[match[1]]}`);
        }
    });

    return [html, callback];
}

/**
 * Fetches the HTML from a given view and returns the content as a String.
 * Caches the HTML in a global cachedHtml object so that
 * the application does not make unnecessary requests.
 * @param view
 * @returns {Promise<string|*>}
 */
async function loadHtml(view) {
    if(cachedHtml[view]) return cachedHtml[view];

    const res = await fetch(`/views/${view}`);
    const html = res.text();
    cachedHtml[view] = html;

    return html;
}

/**
 * Checks the routes object for a matching route
 * If no matching route is found it redirects the user to the 404 location.
 * If the SPA is visited without the hash identifier the app will redirect
 * with a /#/ in the URL.
 * @param routes
 * @returns {Promise<string>}
 */
async function router(routes) {
    const app = document.getElementById("app");
    const path = parseLocation();
    if(path === "/") window.location.hash = "/";

    // If the route does not match any routes
    if(!routes[path]) {
        // Check if the first part of the route matches any route
        const splitted = path.split('/').slice(1);
        const routeNames = [...Object.keys(routes)];
        const regex = new RegExp(`^\/${splitted[0]}\/:(.+)`, 'gi');
        const matched = routeNames.filter(routeName => !!routeName.match(regex))[0];

        // If not, redirect to 404
        if(!matched) return window.location.hash = "/404";

        // if the first part matches any routes; we probably want a query.
        // So treat second part of route as query
        const query = splitted[1];
        const [html, callback] = await routes[`${matched}`](query);
        app.innerHTML = html;
        if(callback !== null) callback();
        return "";
    }

    const [html, callback] = await routes[path]();
    app.innerHTML = html;
    if(callback !== null) callback();
}

/**
 * Initializes the router by attaching two eventListeners to the window.
 * @param routes
 */
function initRouter(routes) {
    window.addEventListener('load', () => router(routes));
    window.addEventListener('hashchange', () => router(routes));
}

export default initRouter;
export { render, redirect }
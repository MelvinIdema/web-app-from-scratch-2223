import {isAuthenticated, redirectToAPIAuthorization, storeBearerToken, host} from "./utils/auth.js";

// https://stackoverflow.com/questions/298503/how-can-you-check-for-a-hash-in-a-url-using-javascript
function getAccessTokenFromUrl() {
    const hash = window.location.hash.substr(1);

    const result = hash.split('&').reduce(function (res, item) {
        const parts = item.split('=');
        res[parts[0]] = parts[1];
        return res;
    }, {});

    return result['access_token']
}
const tokenInUrl = () => !!getAccessTokenFromUrl();

function check() {
    // If authenticated: redirect to home
    if (isAuthenticated()) return window.location.replace(host);
    // If no access_token in URL: redirect to API Authentication Page
    if (!tokenInUrl()) return redirectToAPIAuthorization();
    // If access_token in URL: Store Token & Redirect to Home
    const token = getAccessTokenFromUrl();
    storeBearerToken(token);
    window.location.replace(host);
}

check();
const host = "http://localhost:63342/web-app-from-scratch-2223/spa/";

function storeBearerToken(bearerToken) { sessionStorage.setItem("bearerToken", bearerToken); }
function retrieveBearerToken() { return sessionStorage.getItem("bearerToken"); }
function removeBearerToken() { sessionStorage.removeItem("bearerToken"); }

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

const isAuthenticated = () => !!retrieveBearerToken();
const tokenInUrl = () => !!getAccessTokenFromUrl();

function generateAuthorizationURL() {
    const clientId = "lbPrqkICyqfOhIehuKWMUyZfDJvGlqDNW_Yig-4yFDWsoTNNfeq2ZxCTywOFWLja";
    const redirectUri = host + "auth.html";
    const scope = "me";
    const state = "test";
    const responseType = "token";

    const authorizationUrl = new URL("https://api.genius.com/oauth/authorize");
    authorizationUrl.searchParams.append("client_id", clientId);
    authorizationUrl.searchParams.append("redirect_uri", redirectUri);
    authorizationUrl.searchParams.append("scope", scope);
    authorizationUrl.searchParams.append("state", state);
    authorizationUrl.searchParams.append("response_type", responseType);


    return authorizationUrl.toString();
}

function check() {
    if(tokenInUrl()) {
        const accessToken = getAccessTokenFromUrl();
        storeBearerToken(accessToken);
        return window.location.replace(host);
    }
    return window.location.replace(host);
}

function login() {
    if(!isAuthenticated()) {
        const authUrl = generateAuthorizationURL();
        window.location.replace(authUrl);
    }
}

function logout() {
    if(!isAuthenticated()) return;
    removeBearerToken();
}

export { login, logout, isAuthenticated }
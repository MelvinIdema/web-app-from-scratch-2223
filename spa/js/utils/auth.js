const host = "http://localhost:63342/web-app-from-scratch-2223/spa/";

function storeBearerToken(bearerToken) {
    sessionStorage.setItem("bearerToken", bearerToken);
}

function retrieveBearerToken() {
    return sessionStorage.getItem("bearerToken");
}

function removeBearerToken() {
    sessionStorage.removeItem("bearerToken");
}

const isAuthenticated = () => !!retrieveBearerToken();

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

function redirectToAPIAuthorization() {
    const authUrl = generateAuthorizationURL();
    window.location.replace(authUrl);
}

const login = () => {
    if (!isAuthenticated()) redirectToAPIAuthorization();
}

function logout() {
    if (!isAuthenticated()) return;
    removeBearerToken();
}

export {login, logout, isAuthenticated, storeBearerToken, retrieveBearerToken, redirectToAPIAuthorization, host}
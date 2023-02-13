import { login, logout, isAuthenticated } from "./utils/auth.js";

const controls = document.getElementById("controls");

function generateButton() {
    return document.createElement("button");
}

if(isAuthenticated()) {
    const btn = generateButton();
    btn.id = "logout";
    btn.textContent = "Log out";
    controls.appendChild(btn);
}

if(!isAuthenticated()) {
    const btn = generateButton();
    btn.id = "login";
    btn.textContent = "Log in";
    controls.appendChild(btn);
}

window.addEventListener("load", () => {
    document.getElementById("login").addEventListener("click", () => {
        login();
    });

    document.getElementById("logout").addEventListener("click", () => {
        logout();
    });
})


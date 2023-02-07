async function fetchMemberData(member) {
    const res = await fetch(`https://serverless-shit.ikbenmel.vin/api/findMemberByName?name=${member}`);
    const data = await res.json();
    return data.member[0];
}

async function hydrate({fullName, bio, avatar}) {
    const memberData = await fetchMemberData("Melvin");
    fullName.innerHTML = `${memberData.name} ${memberData.surname}`;
    bio.innerHTML = `${memberData.bio.html}`;
    avatar.src = memberData.avatar;
}

window.onload = async (ma) => {
    const card = document.querySelector("section");
    const fullName = document.querySelector(".full-name");
    const bio = document.querySelector(".bio");
    const avatar = document.querySelector(".avatar img");

    const map = {
        fullName,
        bio,
        avatar
    }

    await hydrate(map);

    card.addEventListener('click', () => {
        card.classList.add("flip");
        setTimeout(() => {
            card.classList.remove("flip");
        }, 1000)
    });
}
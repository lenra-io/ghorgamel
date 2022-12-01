(() => {
    const script = document.currentScript;
    switch (script.dataset.type) {
        case "stargazers":
            integrateStargazers();
            break;
        case "contributors":
            integrateContributors();
            break;
    }

    async function integrateStargazers() {
        // Creating skeleton
        const span = document.createElement("span");
        span.classList.add("stargazers", "loading");
        script.parentElement.insertBefore(span, script);

        // Loading data
        const stargazers = await fetch('stargazers').then(resp => resp.json());

        // Filling skeleton
        span.innerText = stargazers.stars;
        span.classList.remove("loading");

        // Remove script
        script.remove();
    }

    async function integrateContributors() {
        // Creating skeleton
        const size = script.dataset.size || 10;
        const nav = document.createElement("nav");
        nav.classList.add("contributors", "loading");
        for (let i = 0; i < size; i++) {
            const a = document.createElement("a");
            a.innerHTML = `<figure><img alt="Loading content"/><figcaption>Loading content</figcaption></figure>`;
            nav.append(a);
        }
        script.parentElement.insertBefore(nav, script);

        // Loading data
        const contributors = await fetch(`contributors?size=${size}`).then(resp => resp.json());

        // Filling skeleton
        contributors.forEach((contributor, i) => {
            const link = nav.children[i];
            const img = link.querySelector("img");
            const figcaption = link.querySelector("figcaption");
            link.href = contributor.url;
            img.src = contributor.avatar_url;
            img.alt = `${contributor.login}'${contributor.login.endsWith('s') ? '' : 's'} GitHub avatar`;
            figcaption.innerText = contributor.login;
        });
        nav.classList.remove("loading");

        // Remove script
        script.remove();
    }
})();
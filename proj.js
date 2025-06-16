const apiKey = "2276d0c0";
let currentSearch = "";
let currentPage = 1;

document.getElementById("themeToggle").addEventListener("change", () => {
    document.body.classList.toggle("light-theme");
});

function searchMovies(page = 1) {
    const query = document.getElementById("searchInput").value.trim();
    if (!query) return;

    currentSearch = query;
    currentPage = page;

    const loader = document.getElementById("loader");
    const resultsList = document.getElementById("resultsList");
    const pagination = document.getElementById("pagination");

    resultsList.innerHTML = "";
    pagination.innerHTML = "";
    loader.style.display = "block";

    fetch(`https://www.omdbapi.com/?apikey=${apiKey}&s=${encodeURIComponent(query)}&page=${page}`)
        .then(res => res.json())
        .then(data => {
            loader.style.display = "none";
            if (data.Response === "True") {
                data.Search.forEach(movie => {
                    const div = document.createElement("div");
                    div.className = "result-item";
                    div.innerHTML = `
            <img src="${movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/150"}" />
            <h4>${movie.Title}</h4>
            <button onclick="bookmarkMovie('${movie.imdbID}', '${movie.Title}', '${movie.Poster}')">⭐</button>
          `;
                    resultsList.appendChild(div);
                });

                const totalPages = Math.ceil(data.totalResults / 10);
                for (let i = 1; i <= totalPages && i <= 5; i++) {
                    const btn = document.createElement("button");
                    btn.className = "page-btn";
                    btn.innerText = i;
                    btn.onclick = () => searchMovies(i);
                    pagination.appendChild(btn);
                }
            } else {
                resultsList.innerHTML = `<p>No results found.</p>`;
            }
        });
}

function bookmarkMovie(id, title, poster) {
    const stored = JSON.parse(localStorage.getItem("favorites") || "[]");
    if (!stored.find(m => m.id === id)) {
        stored.push({
            id,
            title,
            poster
        });
        localStorage.setItem("favorites", JSON.stringify(stored));
        showFavorites();
    }
}

function showFavorites() {
    const favs = JSON.parse(localStorage.getItem("favorites") || "[]");
    const container = document.getElementById("favorites");
    container.innerHTML = "";

    favs.forEach(m => {
        const div = document.createElement("div");
        div.className = "favorite-item";
        div.innerHTML = `
      <img src="${m.poster !== "N/A" ? m.poster : "https://via.placeholder.com/150"}" />
      <p>${m.title}</p>
    `;
        container.appendChild(div);
    });
}

window.onload = showFavorites;

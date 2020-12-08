const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
const BASE_URL = "https://www.baixarfilmetorrent.net/?s=";

function createFilmItem(title, img, audio, ano, nota_imdb, link) {
	let film_item = `
		<div class="card mt-3" onclick="loadFilm('${link}')">
			<card className="content">
				<img class="mt-3" src="${img}" alt="item-film">
				<p class="title is-4">${title}</p>
				<p class="subtitle is-6">${audio} - ${ano}</p>
				<span is-6>${audio}</span>
				<span class="tag is-dark">IMDB</span>
				<span class="mb-3 tag is-success">${nota_imdb}</span>
			</card>
		</div>
	`;
	return film_item;
}

function loadFilms(s) {
	const url = BASE_URL+s;
	fetch(proxyUrl+url)
	  .then(response => response.text())
	  .then(html => {

	  	const doc = new DOMParser().parseFromString(html, "text/html");
	  	const films = doc.querySelectorAll('.listagem .item');

	  	let list_films = "";

	  	films.forEach((film, i)=>{

	  		let film_title = film.querySelector('.item-titulo').innerText;
	  		let film_img = film.querySelector('img').src;
	  		let film_audio = film.querySelector('.tag-audio').innerText;
	  		let film_ano = film.querySelector('.tag-ano').innerText;
	  		let film_imdb = film.querySelector('.nota-imdb').innerText;
	  		let film_link = film.querySelector('a').href;

	  		list_films += createFilmItem(film_title, film_img, film_audio, film_ano, film_imdb, film_link);

	  	});
	  	if (list_films.length === 0) {
			list_films = `
				<p class="title is-4 mt-3">Nenhum resultado encontrado :(</p>
			`;
	  	}
	  	document.getElementById('list_films').innerHTML = list_films;
	  	document.getElementById("div-search").classList.remove("is-loading");
	  })
	  .catch(error => console.log('error', error));
}

function searchFilm() {
	let search_value = document.getElementById("input-search").value;

	document.getElementById("div-search").classList.add("is-loading");
	loadFilms(search_value);
}

document.getElementById("input-search")
	.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
  	search_film();
  }
});

// DETAILS
function createFilmDetails(title, img, sinopse, links) {
	let torrent_items = '';
	links.forEach((link, i)=>{
		let link_res = link.querySelector('.td-mv-res').innerText;
		let link_quality = link.querySelector('.td-mv-qua').innerText;
		let link_tam = link.querySelector('.td-mv-tam').innerText;
		let link_format = link.querySelector('.td-mv-for').innerText;
		let link_download = link.querySelector('a').href;
		
		torrent_items += `
            <a href="${link_download}" class="column">
	            <span>
					<p>${link_res} - ${link_quality} - ${link_tam} - ${link_format}</p>
	            </span>
			</a>
		`;

	});

	let film_details = `
		<div class="card mt-3">
		  <div class="card-content">
		    <div class="columns is-tablet">
		      <div class="column">
		        <figure class="image is-180x240">
		          <img src="${img}" alt="Placeholder image">
		        </figure>
		      </div>
		      <div class="column">
		        <p class="title is-4 mt-2">${title}</p>
		        <p class="subtitle is-6 mt-2">${sinopse}</p>

		        <div class="columns is-desktop">
					${torrent_items}
		        </div>

		      </div>
		    </div>
		  </div>
		</div>
	`;

	return film_details;
}

function loadFilm(url) {
	const list_films = document.getElementById('list_films');
	list_films.innerHTML = `
		<progress class="progress is-small is-primary mt-5" max="100">15%</progress>
	`;

	fetch(proxyUrl+url)
	  .then(response => response.text())
	  .then(html => {

	  	const doc = new DOMParser().parseFromString(html, "text/html");
	  	const film = doc.querySelector('.post');

  		let film_title = film.querySelector('.entry-title').innerText;
	  	let film_img = film.querySelector('img').src;
	  	let film_sinopse = film.querySelectorAll('p')[7].innerText;
	  	let film_links = film.querySelectorAll('.tr-mv-list');

	  	let details_film = createFilmDetails(film_title, film_img, film_sinopse, film_links);
	  	
	  	list_films.innerHTML = details_film;
	  })
	  .catch(error => console.log('error', error));
}

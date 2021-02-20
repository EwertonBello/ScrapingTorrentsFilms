const proxyUrl = '';
const BASE_URL = "https://www.baixarfilmetorrent.net/?s=";

function create_film_item(title, img, audio, ano, nota_imdb, link) {
	let film_item = `
		<div class="card mt-3" onclick="load_film('${link}')">
		  <div class="card-content">
		    <div class="media tile is-ancestor">

			<div class="tile is-parent">
			    <figure class="image is-180x240">
			    	<img src="${img}" alt="Placeholder image">
			    </figure>
			</div>

			<div class="tile is-parent is-9">
		      <div class="media-content">
		        <p class="title is-4">${title}</p>
		        <p class="subtitle is-6">${audio} - ${ano}</p>

				<div class="control">
					<div class="tags has-addons is-centered">
						<span class="tag is-dark">IMDB</span>
						<span class="tag is-success">${nota_imdb}</span>
					</div>
				</div>
		      </div>
			</div>

		    </div>
		  </div>
		</div>
	`;

	return film_item;
}

let list_films = "";
function load_films(s) {
	const myHeaders = new Headers();
	myHeaders.append("Cookie", "__cfduid=d42912c3d7fab88a405b6af8f5e2af1591613837830");
	const requestOptions = {
		method: 'GET',
		headers: myHeaders,
		redirect: 'follow'
	};
	const url = BASE_URL+s;
	fetch(proxyUrl+url, requestOptions)
	  .then(response => response.text())
	  .then(html => {

	  	const doc = new DOMParser().parseFromString(html, "text/html");
	  	const films = doc.querySelectorAll('.listagem .item');

	  	// clear list
	  	list_films = "";

	  	films.forEach((film, i)=>{

	  		let film_title = film.querySelector('.item-titulo').innerText;
	  		let film_img = film.querySelector('img').src;
	  		let film_audio = film.querySelector('.tag-audio').innerText;
	  		let film_ano = film.querySelector('.tag-ano').innerText;
	  		let film_imdb = film.querySelector('.nota-imdb').innerText;
	  		let film_link = film.querySelector('a').href;

	  		list_films += create_film_item(film_title, film_img, film_audio, film_ano, film_imdb, film_link);

	  	});
	  	if (list_films.length === 0) {
			list_films = `
				<p class="title is-4 mt-3">Nenhum resultado encontrado :(</p>
			`;
	  	}
	  	document.getElementById('list_films').innerHTML = list_films;
	  	document.getElementById("div-search").classList.remove("is-loading");
	  	document.getElementById("input-search").disabled = false;
	  	document.getElementById("btn-search").removeAttribute('disabled');
	  })
	  .catch(error => console.log('error', error));
}

function search_film() {
	const search_input = document.getElementById("input-search");
	let search_value = search_input.value;

	search_input.disabled = true;
	document.getElementById("btn-search").setAttribute('disabled', true);

	document.getElementById("div-search").classList.add("is-loading");
	load_films(search_value);
}

function back_list() {
	document.getElementById('list_films').innerHTML = list_films;
}

document.getElementById("input-search")
	.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
  	search_film();
  }
});

// ########## DETAILS ##########
function create_torrent_item(tbl_links, tipo) {
	let torrent_items = '';

	tbl_links.forEach((tbl, i) => {
		let links = tbl.querySelectorAll('.tr-'+tipo+'-list');

		let audio = tbl.querySelector('.tbl-'+tipo+'-tit strong').innerText;

		links.forEach((link, i) => {
			let link_extra = '';
			let link_res = '';
			let link_quality = '';
			let link_tam = '';
			let link_format = '';

			if (tipo === "ep") {
				link_extra = '<td>'+link.querySelector('.td-ep-eps').innerText+'</td>';
			} else if (tipo === "tp") {
				link_extra = '<td>'+link.querySelector('.td-tp-aud').innerText+'</td>';
			}

			link_res = link.querySelector('.td-'+tipo+'-res').innerText;
			link_quality = link.querySelector('.td-'+tipo+'-qua').innerText;
			link_tam = link.querySelector('.td-'+tipo+'-tam').innerText;
			link_format = link.querySelector('.td-'+tipo+'-for').innerText;

			let link_download = link.querySelector('a').href;

			torrent_items += `
				<tr>
					<td>${audio}</td>
					${link_extra}
					<td>${link_res}</td>
					<td>${link_quality}</td>
					<td>${link_tam}</td>
					<td>${link_format}</td>
					<td><a href="${link_download}">Link</a></td>
			    </tr>
			`;
		});
	});

	return torrent_items;
}

function create_film_details(title, img, sinopse, tbl_links, tipo) {
	let torrent_items = create_torrent_item(tbl_links, tipo);

	let film_details = `
		<div class="card mt-3">
		  <header class="card-header">
			<a onclick="back_list()" class="card-header-icon">
				<span class="icon is-small">
			    	<i class="fas fa-arrow-left"></i>
			    </span>
			</a>
		    <p class="card-header-title">
		      Detalhes
		    </p>
		  </header>
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

		        <div class="table-container">
			        <table class="table">
						${torrent_items}
			        </table>
				</div>

		      </div>
		    </div>
		  </div>
		</div>
	`;

	return film_details;
}

function load_film(url) {
	const div_list_films = document.getElementById('list_films');
	div_list_films.innerHTML = `
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
	  	let film_links = film.querySelectorAll('.tbl-mv-list');
	  	let tipo = "mv";

	  	if (film.querySelectorAll('.tbl-ep-list').length > 0) {
		  	film_links = film.querySelectorAll('.tbl-ep-list');
		  	tipo = "ep";
	  	} else if (film.querySelectorAll('.tbl-tp-list').length > 0) {
		  	film_links = film.querySelectorAll('.tbl-tp-list');
		  	tipo = "tp";
	  	}

	  	let details_film = create_film_details(film_title, film_img, film_sinopse, film_links, tipo);
	  	
	  	div_list_films.innerHTML = details_film;
	  })
	  .catch(error => console.log('error', error));
}

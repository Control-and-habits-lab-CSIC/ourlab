/*!
* Start Bootstrap - Grayscale v7.0.6 (https://startbootstrap.com/theme/grayscale)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-grayscale/blob/master/LICENSE)
*/
//
// Scripts
// 



// Swup setup
const swup = new Swup();

window.addEventListener('DOMContentLoaded', event => {

    // Navbar shrink function
    var navbarShrink = function () {
        const navbarCollapsible = document.body.querySelector('#mainNav');
        const page = window.location.pathname.split("/").pop();
        if (!navbarCollapsible) {
            return;
        }
        if (window.scrollY === 0 && page === "index.html") {
            navbarCollapsible.classList.remove('navbar-shrink')
        } else {
            navbarCollapsible.classList.add('navbar-shrink')
        }

    };

    // Shrink the navbar 
    navbarShrink();

    // Shrink the navbar when page is scrolled
    document.addEventListener('scroll', navbarShrink);

    swup.hooks.on('page:view', () => {
        navbarShrink();
    });
    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            rootMargin: '0px 0px -40%',
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

});



function carousel() {
    // Get the carousel element
    const carousel = document.getElementById('carouselExampleSlidesOnly');

    if (carousel) {
        // Listen for the slide event in Bootstrap's carousel
        carousel.addEventListener('slide.bs.carousel', function (event) {
            // The upcoming slide that will become active
            const nextSlide = event.relatedTarget;
            const videos = nextSlide.querySelectorAll('video');

            videos.forEach(video => {
                video.currentTime = 0; // restart from the beginning
                video.play();          // play automatically
            });
        });

        // Optionally, initialize the carousel itself if it's not already initialized
        // You can use Bootstrap's JavaScript API if needed, but Bootstrap 5 can auto-initialize the carousel
        if (!carousel.classList.contains('carousel-slide')) {
            // Initialize the carousel if not already initialized (in case of Bootstrap 4 or earlier)
            new bootstrap.Carousel(carousel, {
                interval: 5000, // Set the interval for automatic sliding
                ride: 'carousel'
            });
        }
    }
}


function initMap() {
    const mapEl = document.getElementById('map');
    if (!mapEl) return;

    var map = L.map('map', { zoomControl: false })
        .setView([40.4393, -3.5428], 10);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);





    map.dragging.disable();
    map.scrollWheelZoom.disable();
    map.touchZoom.disable();
    map.doubleClickZoom.disable();

    var marker = L.marker([40.5146377, -3.348626]).addTo(map);
    marker.bindPopup(`
  <div>
    <a href="https://maps.app.goo.gl/c9ptbQacejjXwvWh8" target="_blank" rel="noopener noreferrer">
      Find us on Maps
    </a>
  </div>
`).openPopup();

    // Force Leaflet to recalc container size
    setTimeout(() => map.invalidateSize(), 50);
}

function equipoLoad() {
    fetch('team.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load team data');
            }
            return response.json();
        })
        .then(team => {
            const container = document.getElementById('team-container');

            team.forEach(member => {
                const card = document.createElement('div');
                card.className = 'team-member row py-2';
                const cardInfo = document.createElement('div');
                cardInfo.className = 'team-member-info col-12 col-md-6 col-lg-8 ';

                const cardPic = document.createElement('div');
                cardPic.className = "col-12 col-md-6 col-lg-4";

                const img = document.createElement('img');
                img.className = "img-fluid px-5";
                img.src = `/${member.image || 'placeholder.jpg'}`;
                img.alt = member.name || 'Team member';
                img.loading = 'lazy';

                const name = document.createElement('h3');
                name.textContent = member.name || 'Unnamed';

                const position = document.createElement('p');
                position.className = 'position';
                position.textContent = member.position || '';

                const desc = document.createElement('p');
                desc.className = 'description';
                desc.textContent = member.description || '';

                const info = document.createElement('p');
                info.className = 'link';

                card.append(cardPic);
                cardPic.append(img);
                container.appendChild(card);
                cardInfo.append(name, position, desc,info);
                card.append(cardInfo);

                if (member.info) {
    member.info.forEach(link => {
        const p = document.createElement('span');
        p.className = "link";

        const a = document.createElement('a');
        a.href = link.url;
        a.textContent =  " | " + link.label ;
        a.target = "_blank";
        a.className = "text-decoration-none";

        p.appendChild(a);
        cardInfo.appendChild(p);
    });
}
            });
        })
        .catch(err => {
            console.error(err);
            document.getElementById('team-container').innerHTML =
                '<p>Team information is currently unavailable.</p>';
        });


};

// Función para procesar el contenido del archivo de texto
function parseEquipo(texto) {
    const lines = texto.trim().split('\n');
    let equipoData = [];
    let currentMember = {};

    lines.forEach(line => {
        if (line.startsWith('Posición:')) {
            currentMember.posicion = line.replace('Posición:', '').trim();
        } else if (line.startsWith('Foto:')) {
            currentMember.foto = line.replace('Foto:', '').trim();
        } else if (line.startsWith('Descripción:')) {
            currentMember.descripcion = line.replace('Descripción:', '').trim();
        } else {
            // Assume que la línea que no empieza con una de las etiquetas es el nombre
            if (currentMember.nombre) {
                equipoData.push(currentMember);
            }
            currentMember = { nombre: line.trim() }; // Agregar nombre del miembro
        }
    });

    // Asegurarse de agregar el último miembro al array
    if (currentMember.nombre) {
        equipoData.push(currentMember);
    }

    return equipoData;
}



function papersLoad() {
    fetch("papers.txt")
        .then(res => res.text())
        .then(text => {
            const formatted = text
                // make lines that are exactly 4-digit years bold
                .replace(/^(19|20)\d{2}$/gm, "<strong>$&</strong>")
                .replace(/(https:\/\S+)/gm,
                    '<a href="$1" target="_blank">link</a>'
                );

            document.getElementById("publications").innerHTML =
                formatted;
        });

};

function alumniLoad() {
    fetch("alumni.txt")
        .then(res => res.text())
        .then(text => {

            document.getElementById("alumni").innerHTML =
                text;
        });

};


// Run after each Swup page load
swup.hooks.on("page:view", () => {
    console.log("Page view hook triggered");
    setTimeout(() => {
        console.log("Initializing map and carousel");
        initMap();
        carousel();
        papersLoad();
        equipoLoad();
        alumniLoad();
    }, 150);
});




// Also run on first normal page load
document.addEventListener("DOMContentLoaded", initMap);
document.addEventListener("DOMContentLoaded", carousel);
document.addEventListener("DOMContentLoaded", papersLoad);
document.addEventListener("DOMContentLoaded", equipoLoad);
document.addEventListener("DOMContentLoaded", alumniLoad);


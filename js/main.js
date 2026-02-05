// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Language Switcher
const langSwitcher = document.getElementById('langSwitcher');
if (langSwitcher) {
    let currentLang = 'en';
    langSwitcher.addEventListener('click', function() {
        if (currentLang === 'en') {
            this.querySelector('.lang-text').textContent = '日本語';
            currentLang = 'ja';
            // Here you would implement actual language switching logic
        } else {
            this.querySelector('.lang-text').textContent = 'English';
            currentLang = 'en';
        }
    });
}

// Aircraft Search Functionality
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const searchResults = document.getElementById('searchResults');

// Aircraft database for search
const aircraftDatabase = [
    { name: 'Gulfstream G550', type: 'Large Business Jet', url: 'Gulfstream/GulfstreamG550.html' },
    { name: 'Gulfstream G650', type: 'Ultra Long-Range Business Jet', url: 'Gulfstream/GulfstreamG650.html' },
    { name: 'Gulfstream G650ER', type: 'Ultra Long-Range Business Jet', url: '#' },
    { name: 'Gulfstream G700', type: 'Ultra Long-Range Business Jet', url: '#' },
    { name: 'Gulfstream G500', type: 'Large Business Jet', url: '#' },
    { name: 'Gulfstream G600', type: 'Large Business Jet', url: '#' },
    { name: 'HondaJet HA-420', type: 'Light Business Jet', url: '#' },
    { name: 'Citation M2', type: 'Light Business Jet', url: '#' },
    { name: 'Phenom 100', type: 'Light Business Jet', url: '#' },
    { name: 'Citation Latitude', type: 'Midsize Business Jet', url: '#' },
    { name: 'Learjet 75', type: 'Midsize Business Jet', url: '#' },
    { name: 'Challenger 350', type: 'Super Midsize Business Jet', url: '#' },
    { name: 'Citation Longitude', type: 'Super Midsize Business Jet', url: '#' },
    { name: 'Global 5500', type: 'Large Business Jet', url: '#' },
    { name: 'Global 7500', type: 'Ultra Long-Range Business Jet', url: '#' }
];

function performSearch(query) {
    if (!query || query.trim() === '') {
        searchResults.classList.remove('active');
        return;
    }

    const lowerQuery = query.toLowerCase();
    const matches = aircraftDatabase.filter(aircraft => 
        aircraft.name.toLowerCase().includes(lowerQuery) ||
        aircraft.type.toLowerCase().includes(lowerQuery)
    );

    if (matches.length === 0) {
        searchResults.innerHTML = '<div class="search-no-results">No aircraft found</div>';
        searchResults.classList.add('active');
        return;
    }

    searchResults.innerHTML = matches.map(aircraft => `
        <a href="${aircraft.url}" class="search-result-item">
            <div class="search-result-title">${aircraft.name}</div>
            <div class="search-result-type">${aircraft.type}</div>
        </a>
    `).join('');
    searchResults.classList.add('active');
}

if (searchInput) {
    searchInput.addEventListener('input', function(e) {
        performSearch(e.target.value);
    });

    searchInput.addEventListener('focus', function() {
        if (this.value.trim() !== '') {
            performSearch(this.value);
        }
    });
}

if (searchButton) {
    searchButton.addEventListener('click', function() {
        performSearch(searchInput.value);
    });
}

// Close search results when clicking outside
document.addEventListener('click', function(e) {
    if (searchResults && !searchResults.contains(e.target) && 
        e.target !== searchInput && e.target !== searchButton) {
        searchResults.classList.remove('active');
    }
});

// Add animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards for animation
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.aircraft-type-card, .feature-card, .aircraft-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `all 0.5s ease ${index * 0.1}s`;
        observer.observe(card);
    });
});

// Active nav link highlight on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-menu a');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
        if (current === '' && link.getAttribute('href') === 'Home.html') {
            link.classList.add('active');
        }
    });
});

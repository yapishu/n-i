document.addEventListener('DOMContentLoaded', function() {
    loadSiteContent();
    
    setupNavigation();
});

async function loadSiteContent() {
    try {
        const booksResponse = await fetch('data/books.json');
        const booksData = await booksResponse.json();
        
        const featuredResponse = await fetch('data/featured-books.json');
        const featuredBooksData = await featuredResponse.json();
        
        const contentResponse = await fetch('data/content.json');
        const contentData = await contentResponse.json();
        
        populateFeaturedBooks(featuredBooksData);
        populateBooks(booksData);
        populateSiteContent(contentData);
        
    } catch (error) {
        console.error('Error loading content:', error);
    }
}

function populateFeaturedBooks(featuredBooksData) {
    const featuredBooksContainer = document.getElementById('featuredBooks');
    
    featuredBooksContainer.innerHTML = '';
    featuredBooksData.forEach(book => {
        featuredBooksContainer.appendChild(createBookCard(book));
    });
}

function populateBooks(booksData) {
    const allBooksContainer = document.getElementById('allBooks');
    
    allBooksContainer.innerHTML = '';
    booksData.forEach(book => {
        allBooksContainer.appendChild(createBookCard(book));
    });
}

function createBookCard(book) {
    const bookCard = document.createElement('div');
    bookCard.className = 'book-card';
    
    const coverImage = book.coverImage || 'images/book-placeholder.jpg';
    
    bookCard.innerHTML = `
        <div class="book-image">
            <img src="${coverImage}" alt="${book.title} cover">
        </div>
        <div class="book-info">
            <h3 class="book-title">${book.title}</h3>
            <h5 class="book-author">${book.author}</h3>
            <p>${book.description}</p>
            <div class="book-actions">
                ${book.buyLink ? `<a href="${book.buyLink}" class="btn" target="_blank">Buy</a>` : ''}
                ${book.ebookLink ? `<a href="${book.ebookLink}" class="btn btn-outline" target="_blank">eBook</a>` : ''}
            </div>
        </div>
    `;
    
    return bookCard;
}

function populateSiteContent(contentData) {
    if (contentData.main) {
        if (contentData.main.heroTitle) {
            document.querySelector('#home .hero h1').textContent = contentData.main.heroTitle;
        }
        if (contentData.main.heroText) {
            document.getElementById('heroText').textContent = contentData.main.heroText;
        }
    }
    
    if (contentData.about) {
        const aboutContainer = document.getElementById('aboutText');
        aboutContainer.innerHTML = '';
        
        contentData.about.forEach(paragraph => {
            const p = document.createElement('p');
            p.textContent = paragraph;
            aboutContainer.appendChild(p);
        });
    }
    
    if (contentData.contact) {
        const contactContainer = document.getElementById('contactInfo');
        contactContainer.innerHTML = '';
        
        contentData.contact.forEach(item => {
            const contactItem = document.createElement('div');
            contactItem.className = 'contact-item';
            
            let valueHtml = item.value;

            if (item.type.toLowerCase() === 'email') {
                valueHtml = `<a href="mailto:${item.value}">${item.value}</a>`;
            } else if (item.type.toLowerCase() === 'x') {
                const handle = item.value.startsWith('@') ? item.value.slice(1) : item.value;
                valueHtml = `<a href="https://twitter.com/${handle}" target="_blank">@${handle}</a>`;
            }
            
            contactItem.innerHTML = `
                <h3>${item.type}</h3>
                <p>${valueHtml}</p>
            `;
            
            contactContainer.appendChild(contactItem);
        });
    }
}

function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link, .logo, .btn[data-page]');
    const sections = document.querySelectorAll('.section');
    function showSection(page) {
        document.querySelectorAll('.nav-link').forEach(navLink => {
            navLink.classList.toggle('active', navLink.getAttribute('data-page') === page);
        });
        sections.forEach(section => {
            section.classList.toggle('active', section.id === page);
        });
    }
    function navigateTo(page, push = true) {
        showSection(page);
        if (push) {
            history.pushState({ page }, '', `#${page}`);
        }
    }
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            navigateTo(page);
        });
    });
    window.addEventListener('popstate', (event) => {
        const page = (event.state && event.state.page) || location.hash.replace('#', '') || 'home';
        showSection(page);
    });
    const initialPage = location.hash.replace('#', '') || 'home';
    navigateTo(initialPage, false);
}

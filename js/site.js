document.addEventListener('DOMContentLoaded', function() {
    loadSiteContent();
    
    setupNavigation();
});

async function loadSiteContent() {
    try {
        const booksResponse = await fetch('data/books.json');
        const booksData = await booksResponse.json();
        
        const contentResponse = await fetch('data/content.json');
        const contentData = await contentResponse.json();
        
        populateBooks(booksData);
        populateSiteContent(contentData);
        
    } catch (error) {
        console.error('Error loading content:', error);
    }
}

function populateBooks(booksData) {
    const featuredBooksContainer = document.getElementById('featuredBooks');
    const featuredBooks = booksData;
    
    featuredBooksContainer.innerHTML = '';
    featuredBooks.forEach(book => {
        featuredBooksContainer.appendChild(createBookCard(book));
    });
    
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
    if (contentData.heroText) {
        document.getElementById('heroText').textContent = contentData.heroText;
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
            
            contactItem.innerHTML = `
                <h3>${item.type}</h3>
                <p>${item.value}</p>
            `;
            
            contactContainer.appendChild(contactItem);
        });
    }
    
    if (contentData.footerText) {
        document.getElementById('footerText').textContent = contentData.footerText;
    }
}

function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link, .logo, .btn[data-page]');
    const sections = document.querySelectorAll('.section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const page = this.getAttribute('data-page');
            
            document.querySelectorAll('.nav-link').forEach(navLink => {
                navLink.classList.remove('active');
                if (navLink.getAttribute('data-page') === page) {
                    navLink.classList.add('active');
                }
            });
            
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === page) {
                    section.classList.add('active');
                    window.scrollTo(0, 0);
                }
            });
        });
    });
}
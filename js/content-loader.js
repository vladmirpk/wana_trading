/**
 * Content Loader for Wana Trading
 * This script dynamically loads content from JSON files and renders it on the page
 * Now supports localStorage for cross-page data sharing (no server required)
 */

class ContentLoader {
    constructor() {
        this.siteConfig = null;
        this.carouselSlides = null;
        this.products = null;
        this.useEmbeddedData = false;
        this.useLocalStorage = false;
    }

    // Load all content data
    async loadAllContent() {
        try {
            // First, try to use localStorage data (from admin tools)
            if (this.loadFromLocalStorage()) {
                console.log('✅ Using localStorage data (no server required)');
                this.useLocalStorage = true;
                this.renderAllContent();
                return;
            }

            // Second, try to use embedded data if available (from admin tools)
            if (window.embeddedSiteConfig && window.embeddedCarouselSlides && window.embeddedProducts) {
                console.log('✅ Using embedded data (no server required)');
                this.useEmbeddedData = true;
                this.siteConfig = window.embeddedSiteConfig;
                this.carouselSlides = window.embeddedCarouselSlides;
                this.products = window.embeddedProducts;
                this.renderAllContent();
                return;
            }

            // Fallback to external JSON files
            console.log('📡 Loading from external JSON files');
            const [siteConfig, carouselData, productsData] = await Promise.all([
                this.fetchJSON('data/site-config.json'),
                this.fetchJSON('data/carousel-slides.json'),
                this.fetchJSON('data/products.json')
            ]);

            this.siteConfig = siteConfig;
            this.carouselSlides = carouselData.slides;
            this.products = productsData.products;

            this.renderAllContent();
        } catch (error) {
            console.error('❌ Error loading content:', error);
            this.showFallbackContent();
        }
    }

    // Load data from localStorage
    loadFromLocalStorage() {
        try {
            const storedSiteConfig = localStorage.getItem('wanaTrading_siteConfig');
            const storedCarouselSlides = localStorage.getItem('wanaTrading_carouselSlides');
            const storedProducts = localStorage.getItem('wanaTrading_products');

            if (storedSiteConfig && storedCarouselSlides && storedProducts) {
                this.siteConfig = JSON.parse(storedSiteConfig);
                this.carouselSlides = JSON.parse(storedCarouselSlides);
                this.products = JSON.parse(storedProducts);
                return true;
            }
        } catch (error) {
            console.error('Error loading from localStorage:', error);
        }
        return false;
    }

    // Save data to localStorage
    saveToLocalStorage() {
        try {
            if (this.siteConfig) {
                localStorage.setItem('wanaTrading_siteConfig', JSON.stringify(this.siteConfig));
            }
            if (this.carouselSlides) {
                localStorage.setItem('wanaTrading_carouselSlides', JSON.stringify(this.carouselSlides));
            }
            if (this.products) {
                localStorage.setItem('wanaTrading_products', JSON.stringify(this.products));
            }
            console.log('💾 Data saved to localStorage');
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    }

    // Fetch JSON data
    async fetchJSON(url) {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    }

    // Render all content
    renderAllContent() {
        this.renderCarousel();
        this.renderProducts();
        this.renderNavigation();
        this.renderFooter();
        this.updatePageTitle();
        
        console.log('🎨 Content rendered successfully');
        if (this.useLocalStorage) {
            console.log('💡 Tip: Using localStorage data. Changes from admin tools will be reflected here!');
        } else if (this.useEmbeddedData) {
            console.log('💡 Tip: Using embedded data. For live updates, replace JSON files in data/ folder');
        }
    }

    // Render carousel slides
    renderCarousel() {
        const carouselInner = document.querySelector('#carouselInner');
        if (!carouselInner || !this.carouselSlides) return;

        carouselInner.innerHTML = '';
        
        this.carouselSlides.forEach((slide, index) => {
            const isActive = index === 0 ? 'active' : '';
            const layout = slide.layout === 'right' ? 'order-md-2' : '';
            const imageLayout = slide.layout === 'right' ? 'order-md-1' : '';
            
            const slideHTML = `
                <div class="carousel-item ${isActive} h-100" data-bgcolor="${slide.backgroundColor}">
                    <div class="container h-100">
                        <div class="row h-100 align-items-center">
                            <div class="col-md-6 ${layout}">
                                <div class="slider_item-detail">
                                    <h1>${slide.title}</h1>
                                    <p>${slide.description}</p>
                                    <a href="${slide.buttonLink}" class="btn btn-warning">${slide.buttonText}</a>
                                </div>
                            </div>
                            <div class="col-md-6 ${imageLayout} text-center">
                                <div class="slider_img-box">
                                    <img src="${slide.image}" alt="${slide.imageAlt}" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            carouselInner.innerHTML += slideHTML;
        });

        // Reinitialize carousel if Bootstrap is available
        if (typeof $ !== 'undefined' && $.fn.carousel) {
            $('#heroCarousel').carousel({
                interval: 7000,
                pause: false
            });

            // Initialize first slide animations
            const $firstSlide = $('.carousel-item.active');
            if ($firstSlide.length) {
                // Trigger animation after a short delay
                setTimeout(() => {
                    if (window.animateSlide) window.animateSlide($firstSlide);
                    if (window.updateBg) window.updateBg($firstSlide);
                }, 100);
            }

            // Handle slide changes
            $('#heroCarousel').off('slid.bs.carousel').on('slid.bs.carousel', (e) => {
                const $current = $(e.relatedTarget);
                if (window.animateSlide) window.animateSlide($current);
                if (window.updateBg) window.updateBg($current);
            });
        }
    }

    // Render products section
    renderProducts() {
        const productsContainer = document.querySelector('#productsRow');
        if (!productsContainer || !this.products) return;

        productsContainer.innerHTML = '';

        this.products.forEach(product => {
            const productHTML = `
                <div class="col-lg-4 col-md-6 mb-4">
                    <div class="card product-card h-100">
                        <div class="card-img-wrapper">
                            <img src="${product.image}" class="card-img-top" alt="${product.imageAlt}">
                            <div class="card-overlay">
                                <a href="#" class="btn btn-light btn-sm">Learn More</a>
                            </div>
                        </div>
                        <div class="card-body text-center p-4">
                            <h5 class="card-title font-weight-bold mb-2" style="color: #333; font-size: 1.1rem;">${product.title}</h5>
                            <p class="card-text text-muted" style="font-size: 0.9rem;">${product.description}</p>
                            <div class="mt-3">
                                <span class="badge badge-${product.badgeColor} px-3 py-2" style="background: ${product.badgeGradient}; color: white; font-weight: 600;">${product.category}</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            productsContainer.innerHTML += productHTML;
        });
    }

    // Render navigation
    renderNavigation() {
        if (!this.siteConfig) return;

        // Update navbar brand
        const navbarBrand = document.querySelector('#navbarBrand');
        if (navbarBrand) {
            navbarBrand.innerHTML = `
                <img src="${this.siteConfig.company.logo}" alt="${this.siteConfig.company.logoAlt}" height="40" class="d-inline-block align-top mr-2">
                ${this.siteConfig.company.name}
            `;
        }

        // Update navigation links
        const navLinks = document.querySelector('#navbarNav');
        if (navLinks) {
            navLinks.innerHTML = '';
            this.siteConfig.navigation.forEach(navItem => {
                const li = document.createElement('li');
                li.className = 'nav-item';
                li.innerHTML = `<a class="nav-link" href="${navItem.link}">${navItem.text}</a>`;
                navLinks.appendChild(li);
            });
        }

        // Update page title
        if (this.siteConfig.company.name) {
            document.title = `${this.siteConfig.company.name} - Showcase`;
        }
    }

    // Render footer
    renderFooter() {
        if (!this.siteConfig) return;

        // Update company info
        const companyLogoSection = document.querySelector('.d-flex.align-items-center');
        if (companyLogoSection) {
            companyLogoSection.innerHTML = `
                <img src="${this.siteConfig.company.logo}" alt="${this.siteConfig.company.logoAlt}" height="40" class="mr-2">
                <h6 class="mb-0 font-weight-bold" style="background: linear-gradient(135deg, #ffd700, #ffed4e); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-size: 1.1rem;">${this.siteConfig.company.name}</h6>
            `;
        }

        const companyTagline = document.getElementById('companyTagline');
        if (companyTagline) {
            companyTagline.textContent = this.siteConfig.company.tagline;
        }

        // Update quick links
        const quickLinks = document.getElementById('footerQuickLinks');
        if (quickLinks) {
            quickLinks.innerHTML = '';
            this.siteConfig.footer.quickLinks.forEach(link => {
                const li = document.createElement('li');
                li.innerHTML = `<a href="${link.link}" class="text-muted text-decoration-none" style="font-size: 0.8rem; transition: color 0.3s ease;">${link.text}</a>`;
                quickLinks.appendChild(li);
            });
        }

        // Update services
        const services = document.getElementById('footerServices');
        if (services) {
            services.innerHTML = '';
            this.siteConfig.footer.services.forEach(service => {
                const li = document.createElement('li');
                li.innerHTML = `<a href="${service.link}" class="text-muted text-decoration-none" style="font-size: 0.8rem; transition: color 0.3s ease;">${service.text}</a>`;
                services.appendChild(li);
            });
        }

        // Update contact info
        const contactInfo = document.getElementById('footerContactInfo');
        if (contactInfo) {
            contactInfo.innerHTML = '';
            this.siteConfig.contact.phones.forEach(phone => {
                contactInfo.innerHTML += `<p class="mb-1 text-muted" style="font-size: 0.8rem;"><i class="fas fa-phone mr-2" style="color: #ffd700; font-size: 0.7rem;"></i>${phone}</p>`;
            });
            contactInfo.innerHTML += `
                <p class="mb-1 text-muted" style="font-size: 0.8rem;"><i class="fas fa-envelope mr-2" style="color: #ffd700; font-size: 0.7rem;"></i>${this.siteConfig.contact.email}</p>
                <p class="mb-0 text-muted" style="font-size: 0.8rem;"><i class="fas fa-map-marker-alt mr-2" style="color: #ffd700; font-size: 0.7rem;"></i>${this.siteConfig.contact.address}</p>
            `;
        }

        // Update copyright
        const copyrightText = document.getElementById('copyrightText');
        const designerText = document.getElementById('designerText');
        
        if (copyrightText) {
            copyrightText.textContent = this.siteConfig.copyright.text;
        }
        if (designerText) {
            designerText.innerHTML = this.siteConfig.copyright.designer;
        }
    }

    // Update page title
    updatePageTitle() {
        if (this.siteConfig) {
            document.title = `${this.siteConfig.company.name} - Showcase`;
        }
    }

    // Show fallback content if JSON loading fails
    showFallbackContent() {
        console.log('⚠️ Using fallback content - JSON files not available');
        // The original HTML content will remain if JSON loading fails
    }

    // Update methods for real-time updates
    updateCarouselSlide(slideId, newData) {
        const slideIndex = this.carouselSlides.findIndex(slide => slide.id === slideId);
        if (slideIndex !== -1) {
            this.carouselSlides[slideIndex] = { ...this.carouselSlides[slideIndex], ...newData };
            this.saveToLocalStorage();
            this.renderCarousel();
        }
    }

    updateProduct(productId, newData) {
        const productIndex = this.products.findIndex(product => product.id === productId);
        if (productIndex !== -1) {
            this.products[productIndex] = { ...this.products[productIndex], ...newData };
            this.saveToLocalStorage();
            this.renderProducts();
        }
    }

    updateSiteConfig(newConfig) {
        this.siteConfig = { ...this.siteConfig, ...newConfig };
        this.saveToLocalStorage();
        this.renderNavigation();
        this.renderFooter();
        this.updatePageTitle();
    }
}

// Initialize content loader when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    const contentLoader = new ContentLoader();
    contentLoader.loadAllContent();
    
    // Make it globally available for admin tools
    window.contentLoader = contentLoader;
    
    // Listen for storage changes (for cross-tab updates)
    window.addEventListener('storage', function(e) {
        if (e.key && e.key.startsWith('wanaTrading_')) {
            console.log('🔄 Storage change detected, reloading content...');
            contentLoader.loadAllContent();
        }
    });
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ContentLoader;
} 
/**
 * Auto Updater for Wana Trading
 * This script automatically saves changes to JSON files
 */

class AutoUpdater {
    constructor() {
        this.siteConfig = null;
        this.products = null;
        this.carouselSlides = null;
        this.autoSaveEnabled = true;
        this.autoSaveInterval = 30000; // 30 seconds
    }

    // Initialize auto updater
    async init() {
        await this.loadData();
        this.startAutoSave();
        this.setupEventListeners();
    }

    // Load all data
    async loadData() {
        try {
            const [siteConfig, carouselData, productsData] = await Promise.all([
                this.fetchJSON('data/site-config.json'),
                this.fetchJSON('data/carousel-slides.json'),
                this.fetchJSON('data/products.json')
            ]);

            this.siteConfig = siteConfig;
            this.carouselSlides = carouselData.slides;
            this.products = productsData.products;

            console.log('✅ Data loaded successfully');
        } catch (error) {
            console.error('❌ Error loading data:', error);
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

    // Start auto save
    startAutoSave() {
        if (this.autoSaveEnabled) {
            setInterval(() => {
                this.autoSave();
            }, this.autoSaveInterval);
            console.log('🔄 Auto-save enabled (every 30 seconds)');
        }
    }

    // Auto save function
    async autoSave() {
        try {
            // In a real implementation, this would save to the server
            // For now, we'll just log the changes
            console.log('💾 Auto-saving changes...');
            
            // You could implement server-side saving here
            // await this.saveToServer();
            
        } catch (error) {
            console.error('❌ Auto-save failed:', error);
        }
    }

    // Setup event listeners for form changes
    setupEventListeners() {
        // Listen for form changes
        document.addEventListener('input', (e) => {
            if (e.target.closest('form')) {
                this.markAsChanged();
            }
        });

        // Listen for form submissions
        document.addEventListener('submit', (e) => {
            if (e.target.closest('form')) {
                this.handleFormSubmit(e);
            }
        });
    }

    // Mark data as changed
    markAsChanged() {
        // Add visual indicator that changes are pending
        const saveIndicator = document.getElementById('saveIndicator');
        if (saveIndicator) {
            saveIndicator.style.display = 'block';
            saveIndicator.textContent = '💾 Changes pending...';
        }
    }

    // Handle form submission
    async handleFormSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const formId = form.id;

        try {
            if (formId === 'contactForm') {
                await this.updateContactInfo(form);
            } else if (formId === 'productForm') {
                await this.addProduct(form);
            } else if (formId === 'slideForm') {
                await this.addSlide(form);
            }

            this.showSuccess('✅ Changes saved successfully!');
        } catch (error) {
            this.showError('❌ Error saving changes: ' + error.message);
        }
    }

    // Update contact information
    async updateContactInfo(form) {
        this.siteConfig.contact.phones = [
            form.querySelector('#phone1').value,
            form.querySelector('#phone2').value
        ].filter(phone => phone.trim());
        
        this.siteConfig.contact.email = form.querySelector('#email').value;
        this.siteConfig.contact.address = form.querySelector('#address').value;

        await this.saveSiteConfig();
    }

    // Add new product
    async addProduct(form) {
        const newProduct = {
            id: this.products.length + 1,
            title: form.querySelector('#productName').value,
            description: form.querySelector('#productDescription').value,
            image: form.querySelector('#productImage').value,
            imageAlt: form.querySelector('#productName').value,
            category: form.querySelector('#productCategory').value,
            badgeColor: form.querySelector('#productBadgeColor').value,
            badgeGradient: this.getBadgeGradient(form.querySelector('#productBadgeColor').value)
        };

        this.products.push(newProduct);
        await this.saveProducts();
        
        // Reset form
        form.reset();
    }

    // Add new slide
    async addSlide(form) {
        const newSlide = {
            id: this.carouselSlides.length + 1,
            title: form.querySelector('#slideTitle').value,
            description: form.querySelector('#slideDescription').value,
            buttonText: form.querySelector('#slideButtonText').value,
            buttonLink: "products.html",
            image: form.querySelector('#slideImage').value,
            imageAlt: form.querySelector('#slideTitle').value,
            backgroundColor: form.querySelector('#slideBackgroundColor').value,
            layout: form.querySelector('#slideLayout').value
        };

        this.carouselSlides.push(newSlide);
        await this.saveCarousel();
        
        // Reset form
        form.reset();
    }

    // Save site config
    async saveSiteConfig() {
        // In a real implementation, this would save to the server
        console.log('💾 Saving site config...', this.siteConfig);
        
        // For demo purposes, trigger download
        this.downloadFile('site-config.json', this.siteConfig);
    }

    // Save products
    async saveProducts() {
        console.log('💾 Saving products...', this.products);
        this.downloadFile('products.json', { products: this.products });
    }

    // Save carousel
    async saveCarousel() {
        console.log('💾 Saving carousel...', this.carouselSlides);
        this.downloadFile('carousel-slides.json', { slides: this.carouselSlides });
    }

    // Download file
    downloadFile(filename, data) {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }

    // Get badge gradient
    getBadgeGradient(color) {
        const gradients = {
            'primary': 'linear-gradient(135deg, #667eea, #764ba2)',
            'success': 'linear-gradient(135deg, #28a745, #20c997)',
            'info': 'linear-gradient(135deg, #17a2b8, #6f42c1)',
            'warning': 'linear-gradient(135deg, #ffd700, #ffed4e)',
            'danger': 'linear-gradient(135deg, #dc3545, #fd7e14)',
            'secondary': 'linear-gradient(135deg, #6c757d, #495057)'
        };
        return gradients[color] || gradients['primary'];
    }

    // Show success message
    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    // Show error message
    showError(message) {
        this.showNotification(message, 'error');
    }

    // Show notification
    showNotification(message, type) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 10px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            animation: slideIn 0.3s ease;
            background: ${type === 'success' ? 'linear-gradient(135deg, #28a745, #20c997)' : 'linear-gradient(135deg, #dc3545, #fd7e14)'};
        `;
        notification.textContent = message;

        // Add animation styles
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);

        // Add to page
        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Toggle auto-save
    toggleAutoSave() {
        this.autoSaveEnabled = !this.autoSaveEnabled;
        if (this.autoSaveEnabled) {
            this.startAutoSave();
        }
        console.log(`🔄 Auto-save ${this.autoSaveEnabled ? 'enabled' : 'disabled'}`);
    }

    // Get current data
    getCurrentData() {
        return {
            siteConfig: this.siteConfig,
            products: this.products,
            carouselSlides: this.carouselSlides
        };
    }

    // Update specific item
    updateItem(type, id, newData) {
        switch (type) {
            case 'product':
                const productIndex = this.products.findIndex(p => p.id === id);
                if (productIndex !== -1) {
                    this.products[productIndex] = { ...this.products[productIndex], ...newData };
                    this.saveProducts();
                }
                break;
            case 'slide':
                const slideIndex = this.carouselSlides.findIndex(s => s.id === id);
                if (slideIndex !== -1) {
                    this.carouselSlides[slideIndex] = { ...this.carouselSlides[slideIndex], ...newData };
                    this.saveCarousel();
                }
                break;
            case 'config':
                this.siteConfig = { ...this.siteConfig, ...newData };
                this.saveSiteConfig();
                break;
        }
    }
}

// Initialize auto updater when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    window.autoUpdater = new AutoUpdater();
    window.autoUpdater.init();
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AutoUpdater;
} 
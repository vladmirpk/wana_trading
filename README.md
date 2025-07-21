# Wana Trading - Content Management System

This website now includes a content management system that makes it easy to update content without editing HTML files directly.

## Quick Start

### Option 1: Use the Admin Interface (Recommended)

1. Open `admin.html` in your web browser
2. Use the intuitive interface to edit:
   - Site configuration (company info, contact details)
   - Carousel slides
   - Products
3. Download the updated JSON files
4. Replace the files in the `data/` folder with the new ones

### Option 2: Edit JSON Files Directly

All content is stored in JSON files in the `data/` folder:

- `data/site-config.json` - Company info, contact details, navigation
- `data/carousel-slides.json` - Hero carousel slides
- `data/products.json` - Product catalog

## File Structure

```
wana_trading/
├── index.html          # Main homepage (now uses dynamic content)
├── admin.html          # Content management interface
├── data/               # Content data files
│   ├── site-config.json
│   ├── carousel-slides.json
│   └── products.json
├── js/
│   └── content-loader.js  # Dynamic content loader
├── css/                # Stylesheets
├── images/             # Image assets
└── README.md           # This file
```

## How It Works

1. **Content Separation**: All content is separated from HTML into JSON files
2. **Dynamic Loading**: JavaScript loads content from JSON files when the page loads
3. **Fallback Support**: If JSON files fail to load, the original HTML content is used
4. **Easy Updates**: Change content by editing JSON files or using the admin interface

## Content Management

### Site Configuration (`site-config.json`)

```json
{
  "company": {
    "name": "Wana Trading",
    "tagline": "Your one-stop destination...",
    "logo": "images/wana_trader.png"
  },
  "contact": {
    "phones": ["+263 782 712 390", "+263 786 607 329"],
    "email": "info@wanatrading.com",
    "address": "Shop 19, Eastgate Mall, Harare"
  }
}
```

### Carousel Slides (`carousel-slides.json`)

```json
{
  "slides": [
    {
      "id": 1,
      "title": "Welcome to Wana Trading",
      "description": "Where technology meets imagination...",
      "buttonText": "Explore Now",
      "buttonLink": "products.html",
      "image": "images/wana_trader.png",
      "backgroundColor": "#111827",
      "layout": "left"
    }
  ]
}
```

### Products (`products.json`)

```json
{
  "products": [
    {
      "id": 1,
      "title": "Premium Headphones",
      "description": "Feel every beat...",
      "image": "images/headphone.jpg",
      "category": "Audio",
      "badgeColor": "primary"
    }
  ]
}
```

## Benefits

### ✅ Easy Content Updates
- No need to edit HTML files
- Non-technical users can update content
- Visual admin interface available

### ✅ Maintainable Code
- Content separated from presentation
- Consistent data structure
- Easy to add new content types

### ✅ Flexible
- Add/remove slides and products easily
- Change contact information quickly
- Update company details without touching code

### ✅ Reliable
- Fallback to original HTML if JSON fails
- No breaking changes to existing functionality
- Backward compatible

## Usage Examples

### Adding a New Product

1. Open `admin.html`
2. Go to "Products" tab
3. Click "Add Product"
4. Fill in the details
5. Download the updated JSON file
6. Replace `data/products.json`

### Changing Contact Information

1. Open `admin.html`
2. Go to "Site Config" tab
3. Update phone numbers, email, or address
4. Click "Save Configuration"
5. Download the updated JSON file
6. Replace `data/site-config.json`

### Adding a New Carousel Slide

1. Open `admin.html`
2. Go to "Carousel Slides" tab
3. Click "Add Slide"
4. Fill in title, description, image path, etc.
5. Download the updated JSON file
6. Replace `data/carousel-slides.json`

## Technical Details

### Content Loader Features

- **Async Loading**: Content loads asynchronously for better performance
- **Error Handling**: Graceful fallback if JSON files are missing
- **Dynamic Rendering**: Content is rendered dynamically based on JSON data
- **Bootstrap Integration**: Works seamlessly with existing Bootstrap carousel

### Browser Compatibility

- Modern browsers with ES6+ support
- Fallback support for older browsers
- No server-side requirements (works with static hosting)

### Performance

- JSON files are cached by the browser
- Minimal impact on page load time
- Efficient DOM manipulation

## Troubleshooting

### Content Not Loading
- Check that JSON files exist in the `data/` folder
- Verify JSON syntax is valid
- Check browser console for errors

### Admin Interface Not Working
- Ensure you're opening `admin.html` in a web browser
- Check that all required files are present
- Verify internet connection for CDN resources

### Images Not Displaying
- Verify image paths in JSON files are correct
- Ensure images exist in the `images/` folder
- Check file permissions

## Future Enhancements

Potential improvements for the content management system:

- [ ] Server-side content management
- [ ] Image upload functionality
- [ ] User authentication for admin access
- [ ] Content versioning
- [ ] SEO optimization tools
- [ ] Analytics integration
- [ ] Multi-language support

## Support

For technical support or questions about the content management system, please refer to the documentation or contact the development team. 
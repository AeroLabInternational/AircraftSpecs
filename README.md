# Aircraft Specifications Website

A modern, interactive website for browsing aircraft specifications with charts, graphs, and detailed technical information.

## Features

- 🏠 **Home Page**: Overview of all aircraft manufacturers
- 📋 **Brand Pages**: Lists of aircraft by manufacturer
- ✈️ **Aircraft Detail Pages**: Comprehensive specifications with interactive charts
- 📊 **Interactive Charts**: Performance comparisons, range analysis, and fuel consumption graphs using Chart.js
- 📱 **Responsive Design**: Works beautifully on desktop, tablet, and mobile devices
- 🎨 **Modern UI**: Clean, professional design with smooth animations

## Project Structure

```
aircraft-specs-site/
├── index.html              # Home page
├── brands/                 # Brand/manufacturer pages
│   └── boeing.html         # Boeing aircraft listing
├── aircraft/               # Individual aircraft detail pages
│   └── boeing-737.html     # Boeing 737 specifications
├── css/
│   └── styles.css          # All styles for the website
├── js/
│   ├── main.js            # Main JavaScript functionality
│   └── charts.js          # Chart.js utilities and configurations
└── images/                # Placeholder for aircraft images
```

## Getting Started

1. **Open the website**: Simply open `index.html` in your web browser
2. **Add more brands**: Create new HTML files in the `brands/` folder following the `boeing.html` template
3. **Add more aircraft**: Create new HTML files in the `aircraft/` folder following the `boeing-737.html` template
4. **Customize styles**: Edit `css/styles.css` to match your preferred design

## Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with CSS Grid and Flexbox
- **JavaScript**: Interactive features and animations
- **Chart.js**: Interactive charts and graphs (loaded via CDN)
- **Google Fonts**: Inter font family

## Adding New Aircraft

To add a new aircraft:

1. Copy `aircraft/boeing-737.html` as a template
2. Update the specifications in the HTML
3. Customize the charts with your data
4. Add a link to the aircraft from the appropriate brand page

## Adding New Manufacturers

To add a new manufacturer:

1. Copy `brands/boeing.html` as a template
2. Update the brand information and aircraft list
3. Add a card for the brand on the home page (`index.html`)
4. Create individual aircraft pages as needed

## Charts & Data Visualization

The website uses Chart.js to create:
- **Radar Charts**: Performance comparisons across multiple metrics
- **Line Charts**: Range vs payload, altitude performance
- **Bar Charts**: Fuel consumption, specifications comparison

You can customize charts by editing the JavaScript in each aircraft detail page.

## Customization

### Colors
Edit the CSS variables in `css/styles.css`:
```css
:root {
    --primary-color: #0066cc;
    --secondary-color: #004999;
    --accent-color: #ff6b35;
    /* ... more colors ... */
}
```

### Fonts
Change the Google Fonts import in the `<head>` section of HTML files.

### Images
Add actual aircraft images to the `images/` folder and update the image placeholders in the HTML files.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Future Enhancements

- Search functionality
- Filter/sort aircraft by specifications
- Comparison tool (side-by-side aircraft comparison)
- User favorites/bookmarks
- Dark mode toggle
- Aircraft 3D models
- Historical data and variants
- Performance calculators

## License

Free to use and modify for your projects.

## Credits

Data compiled from official manufacturer specifications and aviation databases.

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Testing
- **Run Playwright tests**: `npm test`
- **Run tests in headed mode**: `npm run test:headed`
- **Debug tests**: `npm run test:debug`

### No build/lint commands available
This is a static HTML website project with no build process or linting configured.

## Project Architecture

### Technology Stack
- **Frontend**: Static HTML website using Webflow-generated structure
- **Styling**: Webflow CSS + custom CSS modules
- **JavaScript**: Vanilla JavaScript modules with jQuery for AJAX
- **Testing**: Playwright for end-to-end testing
- **External Dependencies**: 
  - Google Forms API (custom integration)
  - Flatpickr (date picker)
  - jQuery (AJAX requests)

### Directory Structure
```
hong-nan/
├── css/                    # Stylesheets
│   ├── webflow.css        # Auto-generated Webflow styles
│   ├── custom.css         # Custom modal and component styles
│   ├── house-modal.css    # House modal specific styles
│   └── indoor.css         # Indoor display styles
├── js/                     # JavaScript modules
│   ├── custom-googgle-form.js  # Google Forms integration
│   ├── house-modal.js     # Interactive house modal functionality
│   ├── indoor.js          # Indoor exhibition features
│   ├── sidebar-nav.js     # Navigation sidebar with scroll detection
│   └── webflow.js         # Webflow framework scripts
├── images/                 # Static assets and responsive images
├── project_doc/           # Documentation
│   └── google_form_custom.md  # Google Forms integration guide
└── *.html                 # Main pages (index, exhibition, reservation)
```

### Key Features
1. **Google Forms Integration**: Custom AJAX-based form submission with modal confirmation
2. **Interactive House Modal**: Click-to-explore indoor layouts with responsive image maps
3. **Responsive Image Gallery**: Multiple breakpoint images for performance
4. **Sidebar Navigation**: Scroll-based active section detection
5. **Date/Time Picker**: Flatpickr integration for reservation system

### Architecture Patterns
- **Modular JavaScript**: Each feature isolated in separate JS files using IIFE pattern
- **Event-driven**: Heavy use of DOM event listeners for interactions
- **Progressive Enhancement**: Base HTML works without JavaScript
- **Responsive Design**: Webflow's responsive grid system with custom enhancements

### Google Forms Integration Notes
- Form uses custom JSONP requests to bypass CORS restrictions
- Entry IDs mapped to form fields in `custom-googgle-form.js:142-151`
- Date fields require year/month/day separation for Google Forms API
- Validation includes required field checking and format validation
- Modal confirmation flow before actual submission

### Testing Strategy
- End-to-end testing with Playwright
- Focus on user interaction flows (form submission, modals, navigation)
- Test responsive behavior across different viewport sizes

### Development Workflow
1. Modify HTML structure or content in respective `.html` files
2. Update styles in `css/custom.css` (avoid modifying Webflow CSS)
3. Enhance JavaScript functionality in modular `js/` files
4. Test changes with Playwright test suite
5. No build step required - direct file editing

### Important Files to Review Before Changes
- `project_doc/google_form_custom.md`: Complete Google Forms integration documentation
- `js/custom-googgle-form.js`: Form submission logic and field mappings
- `tmp.http`: Contains working API request examples for debugging
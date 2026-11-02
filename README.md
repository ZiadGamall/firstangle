# First Angle Group Website

A responsive, multi-page website developed for **First Angle Group**, a surveying and technical support company based in Egypt.

**Live Website:** [firstanglegroup.com](https://firstanglegroup.com/)

## Overview

This project is a complete business website built to present First Angle Group's services, showcase its projects, introduce its clients, and make it easier for potential customers to get in touch.

The client provided the website content and business information. I independently handled the website's design implementation, development, and functionality.

## Features

- **Multi-page website:** Eight pages covering the company's services, projects, clients, and contact information.
- **Responsive design:** Layouts adapted for desktop, tablet, and mobile screens.
- **Dynamic project directory:** Project listings generated from JSON data, with category filtering, search, and pagination.
- **Project detail pages:** Individual project pages displaying relevant information, images, and related projects.
- **Client directory:** Searchable and paginated client listings, with individual client detail pages.
- **Interactive project map:** Embedded Google My Maps integration to display project locations across Egypt.
- **Interactive UI elements:** FAQ accordion, animated statistics, client-logo carousel, and responsive mobile navigation.
- **Contact options:** Contact form, email, phone, and WhatsApp links.

## Technologies Used

- **HTML5** — Page structure and content.
- **CSS3** — Styling, responsive layouts, custom properties, and media queries.
- **JavaScript (ES6+)** — Dynamic content, interactivity, search, filtering, and pagination.
- **JSON** — Project and client data.
- **Fetch API** — Loading structured data.
- **Google My Maps** — Project location map.
- **FormSubmit** — Contact form handling.
- **Google Fonts** — Playfair Display and Inter.

No frontend framework or build tool was used. The website is built with vanilla HTML, CSS, and JavaScript.

## Project Structure

```text
first-angle-group/
├── index.html
├── about.html
├── services.html
├── projects.html
├── project-details.html
├── clients.html
├── client-details.html
├── contact.html
│
├── css/
│   ├── base.css
│   ├── components.css
│   └── pages/
│
├── js/
│   ├── include.js
│   ├── listing-page.js
│   └── ...
│
├── data/
│   ├── projects.json
│   └── clients.json
│
└── images/
```

## Running Locally

Since this is a static website, you can run it using any local HTTP server.

For example, with Python:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

Opening the HTML files directly with `file://` is not recommended because the project uses the Fetch API to load JSON data.

---

**Live Website:** [https://firstanglegroup.com/](https://firstanglegroup.com/)
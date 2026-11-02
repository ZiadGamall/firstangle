class ClientsCarousel {
  constructor() {
    this.track = document.querySelector(".carousel-track");
    this.container = document.querySelector(".carousel-container");

    if (!this.track || !this.container) return;

    this.pngLogos = new Set([42, 44, 45, 46, 47, 48]);

    this.originalLogos = [];
    this.visibleCount = this.getVisibleCount();
    this.currentIndex = 0;
    this.autoSlide = null;
    this.slideDuration = 800;
    this.isAnimating = false;

    this.init();
  }

  async buildLogoList() {
    try {
      const response = await fetch("./data/clients.json");
      const clients = await response.json();

      return clients
        .filter((client) => client.logoNumber) // only clients with logos
        .sort((a, b) => (a.websiteOrder || 0) - (b.websiteOrder || 0))
        .map((client) => {
          const logoNumber = Number(client.logoNumber);
          const extension = this.pngLogos.has(logoNumber) ? "png" : "webp";

          return {
            src: `assets/images/Logo/${logoNumber}.${extension}`,
            alt: client.name,
            url: `./pages/client.html?id=${client.id}`,
          };
        });
    } catch (error) {
      console.error("Failed to load clients:", error);
      return [];
    }
  }

  getVisibleCount() {
    if (window.innerWidth <= 767) return 2;
    if (window.innerWidth <= 991) return 4;
    return 6;
  }

  createLogoElement(logo) {
    const item = document.createElement("div");
    item.className = "client-logo";

    const link = document.createElement("a");
    link.href = logo.url;

    const img = document.createElement("img");
    img.src = logo.src;
    img.alt = logo.alt;
    img.loading = "lazy";

    // fallback if missing logo
    img.onerror = function () {
      this.src = "assets/images/clients/client-placeholder.png";
    };

    link.appendChild(img);
    item.appendChild(link);

    return item;
  }

  render() {
    this.track.innerHTML = "";

    this.visibleCount = this.getVisibleCount();

    const extendedLogos = [
      ...this.originalLogos,
      ...this.originalLogos.slice(0, this.visibleCount),
    ];

    extendedLogos.forEach((logo) => {
      this.track.appendChild(this.createLogoElement(logo));
    });

    this.currentIndex = 0;
    this.setTranslate(false);
  }

  getItemWidth() {
    const firstItem = this.track.querySelector(".client-logo");
    if (!firstItem) return 0;

    const itemWidth = firstItem.offsetWidth;
    const trackStyle = window.getComputedStyle(this.track);
    const gap = parseFloat(trackStyle.columnGap || trackStyle.gap || 0);

    return itemWidth + gap;
  }

  setTranslate(animated = true) {
    const distance = this.getItemWidth() * this.currentIndex;

    this.track.style.transition = animated
      ? `transform ${this.slideDuration}ms ease-in-out`
      : "none";

    this.track.style.transform = `translateX(-${distance}px)`;
  }

  next() {
    if (this.isAnimating) return;

    this.isAnimating = true;
    this.currentIndex += 1;
    this.setTranslate(true);

    setTimeout(() => {
      if (this.currentIndex >= this.originalLogos.length) {
        this.track.style.transition = "none";
        this.currentIndex = 0;
        this.setTranslate(false);

        this.track.offsetHeight;
      }

      this.isAnimating = false;
    }, this.slideDuration);
  }

  startAutoSlide() {
    this.stopAutoSlide();
    this.autoSlide = setInterval(() => {
      this.next();
    }, 3000);
  }

  stopAutoSlide() {
    if (this.autoSlide) {
      clearInterval(this.autoSlide);
      this.autoSlide = null;
    }
  }

  handleResize() {
    const oldVisible = this.visibleCount;
    const newVisible = this.getVisibleCount();

    if (oldVisible !== newVisible) {
      this.render();
    } else {
      this.setTranslate(false);
    }
  }

  async init() {
    this.originalLogos = await this.buildLogoList();

    if (!this.originalLogos.length) return;

    this.render();

    requestAnimationFrame(() => {
      this.setTranslate(false);
      this.startAutoSlide();
    });

    window.addEventListener("resize", () => this.handleResize());

    this.container.addEventListener("mouseenter", () => this.stopAutoSlide());
    this.container.addEventListener("mouseleave", () => this.startAutoSlide());
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new ClientsCarousel();
});
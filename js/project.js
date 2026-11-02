function truncateText(text, wordLimit = 20) {
  if (!text) return "";

  const words = String(text).trim().split(/\s+/);
  if (words.length <= wordLimit) return text;

  return words.slice(0, wordLimit).join(" ") + "...";
}

class ProjectGalleryCarousel {
  constructor(track, dotsContainer, imagePaths) {
    this.track = track;
    this.dotsContainer = dotsContainer;
    this.imagePaths = imagePaths;
    this.currentIndex = 0;
    this.autoSlide = null;
    this.slideDuration = 5000;

    if (!this.track || !this.imagePaths.length) return;

    this.init();
  }

  renderSlides() {
    this.track.innerHTML = this.imagePaths
      .map(
        (src, index) => `
          
            <img
              src="${src}"
              alt="Project gallery image ${index + 1}"
              loading="lazy"
              class="project-gallery-slide"
            />

        `,
      )
      .join("");
  }

  renderDots() {
    if (!this.dotsContainer) return;

    this.dotsContainer.innerHTML = this.imagePaths
      .map(
        (_, index) => `
          <button
            type="button"
            class="project-gallery-dot ${index === 0 ? "is-active" : ""}"
            data-index="${index}"
            aria-label="Go to gallery image ${index + 1}"
          ></button>
        `,
      )
      .join("");

    this.dotsContainer
      .querySelectorAll(".project-gallery-dot")
      .forEach((dot) => {
        dot.addEventListener("click", () => {
          this.currentIndex = Number(dot.dataset.index);
          this.update();
          this.restartAutoSlide();
        });
      });
  }

  update() {
    const slides = this.track.querySelectorAll(".project-gallery-slide");
    if (!slides.length) return;

    const slide = slides[0];
    const slideWidth = slide.offsetWidth;
    const trackStyle = window.getComputedStyle(this.track);
    const gap = parseFloat(trackStyle.gap || 0);

    const container = this.track.closest(".project-gallery-container");
    const containerWidth = container ? container.offsetWidth : 0;

    const offset = this.currentIndex * (slideWidth + gap);
    const centeredOffset = offset - (containerWidth - slideWidth) / 2;

    this.track.style.transform = `translateX(-${Math.max(centeredOffset, 0)}px)`;

    if (this.dotsContainer) {
      this.dotsContainer
        .querySelectorAll(".project-gallery-dot")
        .forEach((dot, index) => {
          dot.classList.toggle("is-active", index === this.currentIndex);
        });
    }
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.imagePaths.length;
    this.update();
  }

  startAutoSlide() {
    if (this.imagePaths.length <= 1) return;

    this.stopAutoSlide();
    this.autoSlide = setInterval(() => {
      this.next();
    }, this.slideDuration);
  }

  stopAutoSlide() {
    if (this.autoSlide) {
      clearInterval(this.autoSlide);
      this.autoSlide = null;
    }
  }

  restartAutoSlide() {
    this.startAutoSlide();
  }

  init() {
    this.renderSlides();
    this.renderDots();

    requestAnimationFrame(() => {
      this.update();
      this.startAutoSlide();
    });

    const container = this.track.closest(".project-gallery-container");
    if (container) {
      container.addEventListener("mouseenter", () => this.stopAutoSlide());
      container.addEventListener("mouseleave", () => this.startAutoSlide());
    }

    window.addEventListener("resize", () => this.update());
  }
}

function getProjectImagePath(projectId, fileName) {
  return `../assets/images/projects/${projectId}/${fileName}`;
}

createDetailPage({
  dataPath: "../data/projects.json",
  notFoundMessage: "Project not found.",
  render(project, allProjects) {
    const heroImage = document.getElementById("project-hero-image");
    const title = document.getElementById("project-title");
    const meta = document.getElementById("project-meta");
    const description = document.getElementById("project-description");
    const detailsGrid = document.getElementById("project-details-grid");
    const gallerySection = document.getElementById("project-gallery-section");
    const galleryTrack = document.getElementById("project-gallery-track");
    const galleryDots = document.getElementById("project-gallery-dots");
    const relatedGrid = document.getElementById("related-projects-grid");

    const galleryFiles = Array.isArray(project.gallery) ? project.gallery : [];
    const heroFile = galleryFiles[0];
    const galleryOnlyFiles = galleryFiles.slice(1);

    /* =========================
       HERO IMAGE
    ========================= */
    if (heroImage) {
      heroImage.alt = project.title || "Project image";
      heroImage.src = heroFile
        ? getProjectImagePath(project.id, heroFile)
        : project.heroImage ||
          project.image ||
          "../assets/images/projects/project-hero-placeholder.png";

      heroImage.onerror = function () {
        this.src =
          project.heroImage ||
          project.image ||
          "../assets/images/projects/project-hero-placeholder.png";
      };
    }

    /* =========================
       TITLE
    ========================= */
    if (title) {
      title.textContent = project.title || "Project";
      document.title = `${project.title || "Project"} - First Angle`;
    }

    /* =========================
       META
    ========================= */
    if (meta) {
      meta.textContent = [
        project.client,
        project.location,
        project.category,
        project.type,
      ]
        .filter(Boolean)
        .join(" • ");
    }

    /* =========================
       DESCRIPTION
    ========================= */
    if (description) {
      description.textContent = project.description || "";
    }

    /* =========================
       DETAIL CARDS
    ========================= */
    if (detailsGrid) {
      if (Array.isArray(project.details) && project.details.length) {
        detailsGrid.innerHTML = project.details
          .map(
            (detail) => `
              <article class="project-detail-card">
                <span class="project-detail-card__dot"></span>
                <div class="project-detail-card__content">
                  <p class="project-detail-card__label">${detail.label || ""}</p>
                  <p class="project-detail-card__value">${detail.value || ""}</p>
                </div>
              </article>
            `,
          )
          .join("");
      } else {
        detailsGrid.innerHTML = `
          <p class="listing-page__empty">No project details available.</p>
        `;
      }
    }

    /* =========================
       PROJECT GALLERY CAROUSEL
    ========================= */
    if (galleryTrack && gallerySection) {
      if (!galleryOnlyFiles.length) {
        gallerySection.style.display = "none";
      } else {
        gallerySection.style.display = "";

        const galleryPaths = galleryOnlyFiles.map((fileName) =>
          getProjectImagePath(project.id, fileName),
        );

        new ProjectGalleryCarousel(galleryTrack, galleryDots, galleryPaths);
      }
    }

    /* =========================
       RELATED PROJECTS
    ========================= */
    if (relatedGrid) {
      const relatedProjects = allProjects
        .filter((item) => item.id !== project.id)
        .filter(
          (item) =>
            item.category === project.category ||
            item.client === project.client,
        )
        .slice(0, 3);

      if (!relatedProjects.length) {
        relatedGrid.innerHTML = `
          <p class="listing-page__empty">No related projects found.</p>
        `;
        return;
      }

      relatedGrid.innerHTML = relatedProjects
        .map(
          (item) => `
            <article class="project-card">
              <figure class="project-card__media">
                <img
                  class="project-card__image"
                  src="${item.image || ""}"
                  alt="${item.title || "Project"}"
                >
              </figure>
              <div class="project-card__content">
                <h3 class="project-card__title">${item.title || ""}</h3>
                <div class="project-card__meta">
                  <span class="project-card__category">${item.category || ""}</span>
                  <span class="project-card__location">${item.location || ""}</span>
                </div>
                <p class="project-card__description">
                  ${truncateText(item.description, 20)}
                </p>
                <a class="project-card__btn" href="./project.html?id=${item.id}">
                  View Project
                </a>
              </div>
            </article>
          `,
        )
        .join("");
    }
  },
});

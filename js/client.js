function getClientLogo(logoNumber) {
  if (!logoNumber) {
    return "../assets/images/clients/client-placeholder.png";
  }

  const pngLogos = new Set([42, 44, 45, 46, 47, 48]);
  const extension = pngLogos.has(Number(logoNumber)) ? "png" : "webp";

  return `../assets/images/Logo/${logoNumber}.${extension}`;
}

createDetailPage({
  dataPath: "../data/clients.json",
  notFoundMessage: "Client not found.",
  async render(client) {
    const heroImage = document.getElementById("client-hero-image");
    const title = document.getElementById("client-title");
    const meta = document.getElementById("client-meta");
    const description = document.getElementById("client-description");
    const featuredGrid = document.getElementById("featured-projects-grid");

    if (heroImage) {
      const logoSrc = getClientLogo(client.logoNumber);

      heroImage.alt = client.name || "Client image";

      if (logoSrc) {
        heroImage.src = logoSrc;
      } else {
        heroImage.src =
          client.heroImage ||
          client.image ||
          "../assets/images/clients/client-hero-placeholder.png";
      }

      heroImage.onerror = function () {
        this.src =
          client.heroImage ||
          client.image ||
          "../assets/images/clients/client-hero-placeholder.png";
      };
    }

    if (title) {
      title.textContent = client.name || "Client";
      document.title = `${client.name || "Client"} - First Angle`;
    }

    if (meta) {
      meta.textContent = [client.type, client.location]
        .filter(Boolean)
        .join(" • ");
    }

    if (description) {
      description.textContent = client.description || "";
    }

    if (featuredGrid) {
      try {
        const response = await fetch("../data/projects.json");

        if (!response.ok) {
          throw new Error("Failed to fetch projects JSON.");
        }

        const allProjects = await response.json();

        const matchedProjects = allProjects
          .filter(
            (project) =>
              String(project.client || "")
                .trim()
                .toLowerCase() ===
              String(client.name || "")
                .trim()
                .toLowerCase(),
          )
          .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
          .slice(0, 3);

        if (!matchedProjects.length) {
          featuredGrid.innerHTML = `
            <p class="listing-page__empty">No featured projects found.</p>
          `;
          return;
        }

        featuredGrid.innerHTML = matchedProjects
          .map(
            (project) => `
              <article class="project-card">
                <figure class="project-card__media">
                  <img class="project-card__image" src="${project.image || ""}" alt="${project.title || "Project"}">
                </figure>
                <div class="project-card__content">
                  <h3 class="project-card__title">${project.title || ""}</h3>
                  <div class="project-card__meta">
                    <span class="project-card__category">${project.category || ""}</span>
                    <span class="project-card__location">${project.location || ""}</span>
                  </div>
                  <p class="project-card__description">${project.descriptionSummary || project.description || ""}</p>
                  <a class="project-card__btn" href="./project.html?id=${project.id}">View Project</a>
                </div>
              </article>
            `,
          )
          .join("");
      } catch (error) {
        console.error("Client featured projects error:", error);
        featuredGrid.innerHTML = `
          <p class="listing-page__empty">No featured projects found.</p>
        `;
      }
    }
  },
});

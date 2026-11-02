createListingPage({
  cardPartialPath: "../partials/project-card.html",
  dataPath: "../data/projects.json",
  itemsPerPage: 9,
  gridSelector: "#projects-grid",
  paginationSelector: "#projects-pagination",
  searchInputSelector: "#projects-search-input",
  searchFormSelector: "#projects-search-form",
  emptyMessage: "No projects found.",
  errorMessage: "Failed to load projects.",
  searchFields: ["title", "category", "location", "description"],
  buildItem(project) {
    return {
      ...project,
      url: `./project.html?id=${project.id}`,
    };
  },
  createCard(project, template) {
    const fragment = template.content.cloneNode(true);

    const card = fragment.querySelector(".project-card");
    const image = fragment.querySelector(".project-card__image");
    const title = fragment.querySelector(".project-card__title");
    const category = fragment.querySelector(".project-card__category");
    const location = fragment.querySelector(".project-card__location");
    const description = fragment.querySelector(".project-card__description");
    const button = fragment.querySelector(".project-card__btn");

    title.textContent = project.title;
    category.textContent = project.category;
    location.textContent = project.location;
    description.textContent =
      project.descriptionSummary || project.description || "";

    if (Array.isArray(project.gallery) && project.gallery.length > 0) {
      image.src = `../assets/images/projects/${project.id}/${project.gallery[0]}`;
    } else {
      image.src =
        project.image || "../assets/images/projects/project-placeholder.png";
    }
    image.alt = project.title;
    image.onerror = function () {
      this.src = "../assets/images/projects/project-placeholder.png";
    };

    button.href = project.url;

    card.dataset.projectId = project.id;
    card.dataset.projectTitle = project.title.toLowerCase();

    return fragment;
  },
});

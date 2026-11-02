function getClientLogo(logoNumber) {
  if (!logoNumber) {
    return "../assets/images/clients/client-placeholder.png";
  }

  const pngLogos = new Set([42, 44, 45, 46, 47, 48]);

  const extension = pngLogos.has(Number(logoNumber)) ? "png" : "webp";

  return `../assets/images/Logo/${logoNumber}.${extension}`;
}

createListingPage({
  cardPartialPath: "../partials/client-card.html",
  dataPath: "../data/clients.json",
  itemsPerPage: 12,
  gridSelector: "#clients-grid",
  paginationSelector: "#clients-pagination",
  searchInputSelector: "#clients-search-input",
  searchFormSelector: "#clients-search-form",
  emptyMessage: "No clients found.",
  errorMessage: "Failed to load clients.",
  searchFields: ["name", "type"],
  buildItem(client) {
    return {
      ...client,
      url: `./client.html?id=${client.id}`,
    };
  },
  createCard(client, template) {
    const fragment = template.content.cloneNode(true);

    const card = fragment.querySelector(".client-card");
    const image = fragment.querySelector(".client-card__image");
    const title = fragment.querySelector(".client-card__title");
    const meta = fragment.querySelector(".client-card__meta");
    const button = fragment.querySelector(".client-card__btn");

    title.textContent = client.name;
    meta.textContent = client.type;

    image.src = getClientLogo(client.logoNumber);

    image.onerror = function () {
      this.src = "../assets/images/clients/client-placeholder.png";
    };
    image.alt = client.name;

    button.href = client.url;

    card.dataset.clientId = client.id;
    card.dataset.clientName = client.name.toLowerCase();

    return fragment;
  },
});

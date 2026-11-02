function createDetailPage(config) {
  const {
    dataPath,
    idParam = "id",
    buildItem = (item) => item,
    render,
    notFoundMessage = "Item not found.",
  } = config;

  function getIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get(idParam);
  }

  async function fetchItems() {
    const response = await fetch(dataPath);

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${dataPath}`);
    }

    return await response.json();
  }

  async function init() {
    try {
      const id = getIdFromUrl();

      if (!id) {
        throw new Error("Missing item id in URL.");
      }

      const items = await fetchItems();
      const normalizedItems = items.map(buildItem);

      const item = normalizedItems.find(
        (entry) => String(entry.id) === String(id)
      );

      if (!item) {
        throw new Error(notFoundMessage);
      }

      render(item, normalizedItems);
    } catch (error) {
      console.error("Detail page error:", error);

      document.title = "Not Found - First Angle";

      const fallback = document.getElementById("detail-page-content");
      if (fallback) {
        fallback.innerHTML = `
          <section class="detail-page__error-wrap">
            <div class="container">
              <div class="detail-page__error">
                <h1>Not Found</h1>
                <p>${error.message}</p>
                <a class="detail-section__cta" href="./projects.html">Back to Projects</a>
              </div>
            </div>
          </section>
        `;
      }
    }
  }

  document.addEventListener("DOMContentLoaded", init);
}
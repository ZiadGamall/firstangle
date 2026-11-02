function truncateText(text, wordLimit = 20) {
  if (!text) return "";

  const words = String(text).trim().split(/\s+/);
  if (words.length <= wordLimit) return text;

  return words.slice(0, wordLimit).join(" ") + "...";
}

function getTypeFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("type");
}

function normalizeType(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");
}

function createListingPage(config) {
  const {
    cardPartialPath,
    dataPath,
    itemsPerPage,
    gridSelector,
    paginationSelector,
    searchInputSelector,
    searchFormSelector,
    emptyMessage,
    errorMessage,
    searchFields,
    buildItem,
    createCard,
    scrollOffset = 40,
  } = config;

  let allItems = [];
  let filteredItems = [];
  let currentPage = 1;
  let cardTemplate = null;

  const selectedType = getTypeFromUrl();

  const grid = document.querySelector(gridSelector);
  const paginationContainer = document.querySelector(paginationSelector);
  const searchInput = document.querySelector(searchInputSelector);
  const searchForm = document.querySelector(searchFormSelector);

  async function loadTemplate() {
    const response = await fetch(cardPartialPath);

    if (!response.ok) {
      throw new Error(`Failed to load card partial: ${cardPartialPath}`);
    }

    const html = await response.text();
    const template = document.createElement("template");
    template.innerHTML = html.trim();
    return template;
  }

  async function fetchItems() {
    const response = await fetch(dataPath);

    if (!response.ok) {
      throw new Error(`Failed to fetch data JSON: ${dataPath}`);
    }

    return await response.json();
  }

  function getPaginatedItems() {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredItems.slice(start, end);
  }

  function renderItems() {
    if (!grid) return;

    grid.innerHTML = "";

    const itemsToRender = getPaginatedItems();

    if (!itemsToRender.length) {
      grid.innerHTML = `<p class="listing-page__empty">${emptyMessage}</p>`;
      return;
    }

    itemsToRender.forEach((item) => {
      grid.appendChild(createCard(item, cardTemplate));
    });
  }

  function renderPagination() {
    if (!paginationContainer) return;

    paginationContainer.innerHTML = "";

    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

    if (totalPages <= 1) return;

    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    function createPageButton(pageNumber, label = pageNumber) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "listing-pagination__btn";
      btn.textContent = label;

      if (pageNumber === currentPage) {
        btn.classList.add("is-active");
        btn.setAttribute("aria-current", "page");
      }

      btn.addEventListener("click", () => {
        currentPage = pageNumber;
        renderItems();
        renderPagination();
        scrollToGrid();
      });

      return btn;
    }

    function createEllipsis() {
      const span = document.createElement("span");
      span.className = "listing-pagination__ellipsis";
      span.textContent = "...";
      return span;
    }

    if (currentPage > 1) {
      const prevBtn = document.createElement("button");
      prevBtn.type = "button";
      prevBtn.className =
        "listing-pagination__btn listing-pagination__btn--next";
      prevBtn.textContent = "Prev";

      prevBtn.addEventListener("click", () => {
        currentPage -= 1;
        renderItems();
        renderPagination();
        scrollToGrid();
      });

      paginationContainer.appendChild(prevBtn);
    }

    if (startPage > 1) {
      paginationContainer.appendChild(createPageButton(1));

      if (startPage > 2) {
        paginationContainer.appendChild(createEllipsis());
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      paginationContainer.appendChild(createPageButton(i));
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        paginationContainer.appendChild(createEllipsis());
      }

      paginationContainer.appendChild(createPageButton(totalPages));
    }

    if (currentPage < totalPages) {
      const nextBtn = document.createElement("button");
      nextBtn.type = "button";
      nextBtn.className =
        "listing-pagination__btn listing-pagination__btn--next";
      nextBtn.textContent = "Next";

      nextBtn.addEventListener("click", () => {
        currentPage += 1;
        renderItems();
        renderPagination();
        scrollToGrid();
      });

      paginationContainer.appendChild(nextBtn);
    }
  }

  function filterItems(value) {
    const query = value.trim().toLowerCase();

    filteredItems = allItems.filter((item) => {
      const matchesType = selectedType
        ? normalizeType(item.type) === selectedType
        : true;

      if (!matchesType) return false;

      if (!query) return true;

      return searchFields.some((field) => {
        const fieldValue = item[field];
        return String(fieldValue || "")
          .toLowerCase()
          .includes(query);
      });
    });

    currentPage = 1;
    renderItems();
    renderPagination();
  }

  function scrollToGrid() {
    if (!grid) return;

    window.scrollTo({
      top: grid.offsetTop - scrollOffset,
      behavior: "smooth",
    });
  }

  async function init() {
    try {
      if (!grid) return;

      cardTemplate = await loadTemplate();

      const items = await fetchItems();
      allItems = items.map((item) => {
        const builtItem = buildItem(item);

        return {
          ...builtItem,
          descriptionSummary: truncateText(builtItem.description, 20),
        };
      });

      filteredItems = allItems.filter((item) => {
        return selectedType ? normalizeType(item.type) === selectedType : true;
      });

      renderItems();
      renderPagination();

      if (searchForm) {
        searchForm.addEventListener("submit", (e) => {
          e.preventDefault();
          filterItems(searchInput ? searchInput.value : "");
        });
      }

      if (searchInput) {
        searchInput.addEventListener("input", (e) => {
          filterItems(e.target.value);
        });
      }
    } catch (error) {
      console.error("Listing page error:", error);

      if (grid) {
        grid.innerHTML = `<p class="listing-page__empty">${errorMessage}</p>`;
      }
    }
  }

  document.addEventListener("DOMContentLoaded", init);
}

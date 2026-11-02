(() => {
  const loadComponents = async () => {
    try {
      const [navbarData, footerData] = await Promise.all([
        fetch("/partials/navbar.html").then(res => {
          if (!res.ok) throw new Error(`Navbar fetch failed: ${res.status}`);
          return res.text();
        }),
        fetch("/partials/footer.html").then(res => {
          if (!res.ok) throw new Error(`Footer fetch failed: ${res.status}`);
          return res.text();
        })
      ]);

      document.querySelector("body").insertAdjacentHTML("afterbegin", navbarData);
      document.querySelector("body").insertAdjacentHTML("beforeend", footerData);

      initializeNavigation();
    } catch (error) {
      handleLoadError(error);
    }
  };

  const handleLoadError = (error) => {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = 'position:fixed;top:20px;right:20px;background:#ff4444;color:white;padding:10px;border-radius:5px;z-index:9999;';
    errorDiv.textContent = 'Some components failed to load. Please refresh page.';
    document.body.appendChild(errorDiv);
    setTimeout(() => errorDiv.remove(), 5000);
  };

  const initializeNavigation = () => {
    const links = document.querySelectorAll(".nav__link");
    const mobileLinks = document.querySelectorAll(".nav__link__mobile");
    const hamMenu = document.querySelector(".ham-menu");
    const navMobile = document.querySelector(".nav__mobile");
    const overlay = document.querySelector(".nav__overlay");

    if (!links || !mobileLinks || !hamMenu || !navMobile || !overlay) return;

    const current = getCurrentPage();
    setActiveLinks([...links], current);
    setActiveLinks([...mobileLinks], current);

    const closeMenu = () => {
      hamMenu.classList.remove("is-active");
      navMobile.classList.remove("is-open");
      overlay.classList.remove("is-open");
      hamMenu.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    };

    hamMenu.addEventListener("click", () => {
      const open = hamMenu.classList.toggle("is-active");
      navMobile.classList.toggle("is-open");
      overlay.classList.toggle("is-open");
      hamMenu.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.style.overflow = open ? "hidden" : "";
    });

    overlay.addEventListener("click", closeMenu);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });
  };

  const getCurrentPage = () => {
    let current = window.location.pathname.split("/").pop();
    if (current === "") current = "index.html";
    return current.split("?")[0].split("#")[0];
  };

  const setActiveLinks = (links, current) => {
    links.forEach((link) => {
      if (link.getAttribute("href").split("/").pop() === current) {
        link.classList.add("active");
      }
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadComponents);
  } else {
    loadComponents();
  }
})();

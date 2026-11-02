(() => {
  const DURATION = 3000; // all finish together (ms)

  // Extract number + suffix from something like "700+", "72Mil", "48"
  const parse = (text) => {
    const match = text.trim().match(/^([\d,.]+)\s*(.*)$/);
    if (!match) return { number: 0, suffix: "" };

    const number = parseFloat(match[1].replace(/,/g, ""));
    const suffix = match[2] || "";
    return { number, suffix };
  };

  // Simple ease-out (fast start, smooth end)
  const easeOut = (t) => 1 - Math.pow(1 - t, 5);

  const animateAll = (items) => {
    const targets = items.map((el) => {
      const { number, suffix } = parse(el.textContent);
      el.textContent = "0" + suffix; // start state
      return { el, number: Math.round(number), suffix };
    });

    const start = performance.now();

    const tick = (now) => {
      const t = Math.min(1, (now - start) / DURATION);
      const eased = easeOut(t);

      targets.forEach(({ el, number, suffix }) => {
        const value = Math.round(number * eased);
        el.textContent = value + suffix;
      });

      if (t < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  const startWhenVisible = () => {
    const section = document.querySelector(".metrics--animated");
    const items = document.querySelectorAll(
      ".metrics--animated .metrics .metric__item h3",
    );
    if (!section || !items.length) return;

    const io = new IntersectionObserver(
      (entries, obs) => {
        if (entries[0].isIntersecting) {
          animateAll([...items]);
          obs.disconnect(); // run once
        }
      },
      { threshold: 0.35 },
    );

    io.observe(section);
  };

  // Run after DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startWhenVisible);
  } else {
    startWhenVisible();
  }
})();

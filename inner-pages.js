/* Inner pages: header scroll, dropdowns, FAQ accordion */
document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("main-header");
  const menuToggle = document.getElementById("menu-toggle");
  const headerNav = document.getElementById("header-nav");

  if (header) {
    window.addEventListener("scroll", () => {
      header.classList.toggle("scrolled", window.scrollY > 50);
    }, { passive: true });
  }

  menuToggle?.addEventListener("click", () => {
    menuToggle.classList.toggle("active");
    headerNav?.classList.toggle("active");
    header?.classList.toggle("menu-active");
  });

  document.querySelectorAll(".nav-dropdown-toggle").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      if (window.innerWidth > 1024) return;
      e.preventDefault();
      const parent = btn.closest(".nav-dropdown");
      parent?.classList.toggle("is-open");
    });
  });

  document.querySelectorAll(".inner-faq-q").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".inner-faq-item");
      const wasOpen = item?.classList.contains("is-open");
      document.querySelectorAll(".inner-faq-item").forEach((el) => el.classList.remove("is-open"));
      if (!wasOpen) item?.classList.add("is-open");
    });
  });

  document.querySelectorAll(".nri-accordion-q").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".nri-accordion-item");
      const icon = btn.querySelector("span");
      const isOpen = item?.classList.toggle("is-open");
      if (icon) icon.textContent = isOpen ? "−" : "+";
    });
  });

  const pageId = document.body.dataset.page;
  if (pageId) {
    document.querySelectorAll(`.inner-subnav a[data-page="${pageId}"]`).forEach((a) => {
      a.classList.add("is-active");
    });
    document.querySelectorAll(`.nri-subnav a[data-page="${pageId}"]`).forEach((a) => {
      a.classList.add("is-active");
    });
    document.querySelectorAll(`.about-hero-nav-links a[href*="${pageId}"]`).forEach((a) => {
      a.classList.add("is-active");
    });
  }

  document.querySelectorAll(".leader-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.leaderTab;
      document.querySelectorAll(".leader-tab").forEach((t) => {
        const active = t.dataset.leaderTab === target;
        t.classList.toggle("is-active", active);
        t.setAttribute("aria-selected", active ? "true" : "false");
      });
      document.querySelectorAll(".leader-panel").forEach((panel) => {
        const active = panel.dataset.leaderPanel === target;
        panel.classList.toggle("is-active", active);
        if (active) {
          panel.removeAttribute("hidden");
          if (target === "committees") {
            panel.querySelector(".leader-committees-intro")?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
        } else {
          panel.setAttribute("hidden", "");
        }
      });
    });
  });

  const initRefSlider = ({
    trackId,
    dotsId,
    prevId,
    nextId,
    cardSelector = ".about-ref-card",
    dotClass = "about-ref-dot",
  }) => {
    const track = document.getElementById(trackId);
    const dotsWrap = document.getElementById(dotsId);
    const btnPrev = document.getElementById(prevId);
    const btnNext = document.getElementById(nextId);
    const container = track?.parentElement;

    if (!track || !container) return;

    const cards = track.querySelectorAll(cardSelector);
    if (!cards.length) return;

    let currentIndex = 0;

    const getVisibleCount = () => {
      if (window.innerWidth <= 768) return 1;
      if (window.innerWidth <= 1024) return 2;
      return 3;
    };

    const getMaxIndex = () => Math.max(0, cards.length - getVisibleCount());

    const buildDots = () => {
      if (!dotsWrap) return;
      dotsWrap.innerHTML = "";
      const maxIndex = getMaxIndex();
      for (let i = 0; i <= maxIndex; i += 1) {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = `${dotClass}${i === currentIndex ? " active" : ""}`;
        dot.setAttribute("aria-label", `Show slide ${i + 1}`);
        dot.addEventListener("click", () => {
          currentIndex = i;
          updateSlider();
        });
        dotsWrap.appendChild(dot);
      }
    };

    const updateSlider = () => {
      const gap = parseFloat(getComputedStyle(track).gap) || 20;
      const cardWidth = cards[0].offsetWidth + gap;
      const maxIndex = getMaxIndex();
      if (currentIndex > maxIndex) currentIndex = maxIndex;
      track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
      dotsWrap?.querySelectorAll(`.${dotClass}`).forEach((dot, index) => {
        dot.classList.toggle("active", index === currentIndex);
      });
    };

    btnNext?.addEventListener("click", () => {
      const maxIndex = getMaxIndex();
      currentIndex = currentIndex < maxIndex ? currentIndex + 1 : 0;
      updateSlider();
    });

    btnPrev?.addEventListener("click", () => {
      const maxIndex = getMaxIndex();
      currentIndex = currentIndex > 0 ? currentIndex - 1 : maxIndex;
      updateSlider();
    });

    window.addEventListener("resize", () => {
      buildDots();
      updateSlider();
    });

    buildDots();
    updateSlider();
  };

  const initSustainEsgSlider = () => {
    const track = document.getElementById("sustain-esg-track");
    const dotsWrap = document.getElementById("sustain-esg-dots");
    const btnPrev = document.getElementById("sustain-esg-prev");
    const btnNext = document.getElementById("sustain-esg-next");

    if (!track) return;

    const slides = track.querySelectorAll(".sustain-leadership-slide");
    if (!slides.length) return;

    let currentIndex = 0;

    const updateSlides = () => {
      slides.forEach((slide, index) => {
        slide.classList.toggle("is-active", index === currentIndex);
      });
      dotsWrap?.querySelectorAll(".sustain-leadership-dot").forEach((dot, index) => {
        dot.classList.toggle("active", index === currentIndex);
      });
    };

    const buildDots = () => {
      if (!dotsWrap) return;
      dotsWrap.innerHTML = "";
      slides.forEach((_, index) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = `sustain-leadership-dot${index === currentIndex ? " active" : ""}`;
        dot.setAttribute("aria-label", `Show highlight ${index + 1}`);
        dot.addEventListener("click", () => {
          currentIndex = index;
          updateSlides();
        });
        dotsWrap.appendChild(dot);
      });
    };

    btnNext?.addEventListener("click", () => {
      currentIndex = (currentIndex + 1) % slides.length;
      updateSlides();
    });

    btnPrev?.addEventListener("click", () => {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      updateSlides();
    });

    buildDots();
    updateSlides();
  };

  const initSustainReportsToggle = () => {
    const btn = document.getElementById("sustain-show-more");
    const extra = document.getElementById("sustain-reports-extra");
    if (!btn || !extra) return;

    btn.addEventListener("click", () => {
      const isOpen = btn.classList.toggle("is-open");
      extra.hidden = !isOpen;
      btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
      const label = btn.querySelector("span");
      if (label) label.textContent = isOpen ? "View Less" : "View More";
    });
  };

  const initResidentialPage = () => {
    const grid = document.getElementById("residential-grid");
    if (!grid) return;

    const PER_PAGE = 9;
    const TOTAL_PAGES = 14;

    const projects = [
      { name: "Crown Residences at Godrej Golf Links", location: "Greater Noida, Noida", city: "noida", type: "apartment", status: "new-launch", budget: "premium", ready: false, price: "INR 2.85 Cr. onwards", possession: "Feb 2031", bhk: "3 & 4 BHK", badge: "New Launch", img: "../images/godrej-golf-link.webp" },
      { name: "Godrej Astra", location: "Sector 54, Gurugram", city: "gurgaon", type: "apartment", status: "new-launch", budget: "luxury", ready: false, price: "INR 10.34 Cr. onwards", possession: "Jan 2031", bhk: "3 & 4 BHK", badge: "New Launch", img: "../images/e5aa86f4-f70f-46af-b39d-4bd91de720e2.webp" },
      { name: "Godrej Vanantara", location: "Bannerghatta, Bengaluru", city: "bangalore", type: "apartment", status: "new-launch", budget: "mid", ready: false, price: "INR 1.28 Cr. onwards", possession: "Dec 2030", bhk: "2, 3 & 4.5 BHK", badge: "New Launch", img: "../images/banner-section-550x550-cml7n8sp3000axbor6qdx1rzq-cmlj2m3km000zt5ph8d0j1m7v.webp" },
      { name: "Godrej Meridien", location: "Sector 106, Gurugram", city: "gurgaon", type: "apartment", status: "under-construction", budget: "mid", ready: false, price: "INR 1.62 Cr. onwards", possession: "Jan 2025", bhk: "1, 2 & 3 BHK", badge: "Under Construction", img: "../images/44ab5a60-484f-4845-89fb-7a894292b8db.webp" },
      { name: "Godrej Altus", location: "Vastrapur, Ahmedabad", city: "ahmedabad", type: "apartment", status: "new-launch", budget: "premium", ready: false, price: "Available on Request", possession: "Oct 2031", bhk: "3 & 4 BHK", badge: "New Launch", img: "../images/ahemdabad.webp" },
      { name: "Godrej Aveline", location: "Yelahanka, Bengaluru", city: "bangalore", type: "apartment", status: "new-launch", budget: "mid", ready: false, price: "INR 2.53 Cr. onwards", possession: "Mar 2031", bhk: "3, 3.5 & 4.5 BHK", badge: "New Launch", img: "../images/aveline-landing-page-final-550-x-550-project-thumbnail-image-cmmoklhge000qv9phgsrt26nt.webp" },
      { name: "Godrej Ivara", location: "Kharadi, Pune", city: "pune", type: "apartment", status: "new-launch", budget: "mid", ready: false, price: "INR 1.25 Cr. onwards", possession: "Jul 2032", bhk: "2, 3 & 4 BHK", badge: "New Launch", img: "../images/1-elevation-view-cmlz308qv000i0wor1ftgevmg-cmmd38ceg0040cdph88ddfxy8.webp" },
      { name: "Godrej Horizon", location: "Dadar - Wadala, Mumbai", city: "mumbai", type: "apartment", status: "under-construction", budget: "premium", ready: false, price: "INR 5.67 Cr. onwards", possession: "Jun 2027", bhk: "3 BHK", badge: "Under Construction", img: "../images/740b4f4c-2297-4f33-87a2-3eda7af4711d.webp" },
      { name: "Godrej Parkshire", location: "Whitefield-Hoskote, Bengaluru", city: "bangalore", type: "apartment", status: "new-launch", budget: "mid", ready: false, price: "INR 1.18 Cr. onwards", possession: "Nov 2030", bhk: "2 & 3 BHK", badge: "New Launch", img: "../images/banner-section-550x550-cml7n8sp3000axbor6qdx1rzq-cmlj2m3km000zt5ph8d0j1m7v.webp" },
      { name: "Godrej Connaught One", location: "Connaught Place, New Delhi", city: "delhi", type: "apartment", status: "under-construction", budget: "luxury", ready: false, price: "INR 18.61 Cr. onwards", possession: "May 2025", bhk: "3 BHK", badge: "Under Construction", img: "../images/a40702e6-3019-4e58-86d9-a854eceb6590.webp" },
      { name: "Godrej Regal Pavilion", location: "Rajendra Nagar, Hyderabad", city: "hyderabad", type: "apartment", status: "new-launch", budget: "mid", ready: false, price: "INR 1.99 Cr. onwards", possession: "Jul 2030", bhk: "3 & 4 BHK", badge: "New Launch", img: "../images/thumbnail-image-550-x-550-cmeb44mnj0015c8ph41rz3y75.webp" },
      { name: "Godrej Arden", location: "Sigma III, Noida", city: "noida", type: "apartment", status: "new-launch", budget: "premium", ready: false, price: "INR 3.46 Cr. onwards", possession: "May 2030", bhk: "3 & 4 BHK", badge: "New Launch", img: "../images/550-x550pxl-01-cmli0rqmq000mt5ph32qt71fa.webp" },
      { name: "Godrej Vrikshya", location: "Sector 103, Gurgaon", city: "gurgaon", type: "apartment", status: "new-launch", budget: "premium", ready: false, price: "INR 3.81 Cr. onwards", possession: "Jun 2031", bhk: "3 & 4 BHK", badge: "New Launch", img: "../images/bd519108-63a0-431c-9a3a-468ca7d6f366.webp" },
      { name: "Godrej Rejuve", location: "Keshavnagar, Pune", city: "pune", type: "apartment", status: "ready", budget: "affordable", ready: true, price: "INR 65.74 L. onwards", possession: "Jan 2023", bhk: "2 BHK", badge: "Possession Ready", img: "../images/rejuve.webp" },
      { name: "Godrej Blue", location: "New Alipore, Kolkata", city: "kolkata", type: "apartment", status: "new-launch", budget: "mid", ready: false, price: "INR 2.49 Cr. onwards", possession: "Sep 2029", bhk: "3 & 4 BHK", badge: "New Launch", img: "../images/d2c408b7-90d4-467c-9cad-a6affd72e95a.webp" },
      { name: "Godrej South Estate", location: "Okhla, New Delhi", city: "delhi", type: "apartment", status: "under-construction", budget: "luxury", ready: false, price: "INR 6.14 Cr. onwards", possession: "May 2026", bhk: "3 & 4 BHK", badge: "Under Construction", img: "../images/977a1e4f-349f-43d9-8aaf-836f73d5e4ff.webp" },
      { name: "Godrej Tiara", location: "Yeshwanthpur, Bengaluru", city: "bangalore", type: "apartment", status: "new-launch", budget: "luxury", ready: false, price: "INR 5.99 Cr. onwards", possession: "May 2030", bhk: "4.5 BHK", badge: "New Launch", img: "../images/6b5d387b-d3e0-440d-8ffa-2ea54780551f.webp" },
      { name: "Godrej Exquisite", location: "Thane, Mumbai", city: "mumbai", type: "apartment", status: "under-construction", budget: "mid", ready: false, price: "INR 2.35 Cr. onwards", possession: "Sep 2026", bhk: "3 BHK", badge: "Under Construction", img: "../images/9142c7e4-3c14-4d83-ac9b-d18aa9717839.webp" },
    ];

    const searchInput = document.getElementById("residential-search");
    const filterForm = document.getElementById("residential-filters");
    const filterCity = document.getElementById("filter-city");
    const filterType = document.getElementById("filter-type");
    const filterBhk = document.getElementById("filter-bhk");
    const filterStatus = document.getElementById("filter-status");
    const filterBudget = document.getElementById("filter-budget");
    const filterReady = document.getElementById("filter-ready");
    const emptyMsg = document.getElementById("residential-empty");
    const pagination = document.getElementById("residential-pagination");
    const listPanel = document.getElementById("residential-list-panel");
    const mapPanel = document.getElementById("residential-map-panel");
    const viewBtns = document.querySelectorAll(".residential-view-btn");
    const contactForm = document.getElementById("residential-contact-form");
    const contactFeedback = document.getElementById("residential-contact-feedback");

    let currentPage = 1;
    let filtered = [...projects];

    const matchesBhk = (project, value) => {
      if (!value) return true;
      if (value === "plots") return /plot/i.test(project.bhk);
      return project.bhk.includes(value);
    };

    const applyFilters = () => {
      const query = (searchInput?.value || "").trim().toLowerCase();
      filtered = projects.filter((project) => {
        if (query && !project.name.toLowerCase().includes(query)) return false;
        if (filterCity?.value && project.city !== filterCity.value) return false;
        if (filterType?.value && project.type !== filterType.value) return false;
        if (filterBhk?.value && !matchesBhk(project, filterBhk.value)) return false;
        if (filterStatus?.value && project.status !== filterStatus.value) return false;
        if (filterBudget?.value && project.budget !== filterBudget.value) return false;
        if (filterReady?.checked && !project.ready) return false;
        return true;
      });
      currentPage = 1;
      render();
    };

    const renderCard = (project) => `
      <article class="listing-card" data-project="${project.name}">
        <div class="listing-img-wrap">
          <img src="${project.img}" alt="${project.name}" class="listing-img" loading="lazy" decoding="async">
          <div class="listing-img-overlay">
            <span class="listing-location">${project.location}</span>
            <button type="button" class="listing-plus-btn" title="Enquire about ${project.name}" aria-label="Enquire about ${project.name}">+</button>
          </div>
        </div>
        <div class="listing-info">
          <h3 class="listing-name">${project.name}</h3>
          <div class="listing-badge"><span class="badge-dot"></span>${project.badge}</div>
          <div class="listing-meta">
            <span class="listing-price">${project.price}</span>
            <span class="listing-divider">|</span>
            <span class="listing-possession"><strong>Possession Date</strong> ${project.possession}</span>
          </div>
          <p class="listing-bhk">${project.bhk}</p>
        </div>
      </article>
    `;

    const getPageItems = () => {
      const start = (currentPage - 1) * PER_PAGE;
      return filtered.slice(start, start + PER_PAGE);
    };

    const renderPagination = () => {
      if (!pagination) return;
      const totalFilteredPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
      const displayTotal = Math.min(TOTAL_PAGES, totalFilteredPages);
      const pages = [];

      for (let i = 1; i <= Math.min(5, displayTotal); i += 1) pages.push(i);
      if (displayTotal > 5) {
        pages.push("ellipsis");
        pages.push(displayTotal);
      }

      pagination.innerHTML = "";

      pages.forEach((page) => {
        if (page === "ellipsis") {
          const span = document.createElement("span");
          span.className = "residential-page-ellipsis";
          span.textContent = "...";
          pagination.appendChild(span);
          return;
        }

        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = `residential-page-btn${page === currentPage ? " is-active" : ""}`;
        btn.textContent = String(page);
        btn.addEventListener("click", () => {
          currentPage = page;
          render();
          listPanel?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
        pagination.appendChild(btn);
      });

      const nextBtn = document.createElement("button");
      nextBtn.type = "button";
      nextBtn.className = "residential-page-btn";
      nextBtn.innerHTML = "&rsaquo;";
      nextBtn.setAttribute("aria-label", "Next page");
      nextBtn.disabled = currentPage >= displayTotal;
      nextBtn.addEventListener("click", () => {
        if (currentPage < displayTotal) {
          currentPage += 1;
          render();
          listPanel?.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
      pagination.appendChild(nextBtn);
    };

    const render = () => {
      const items = getPageItems();
      grid.innerHTML = items.map(renderCard).join("");
      if (emptyMsg) emptyMsg.hidden = items.length > 0;
      grid.hidden = items.length === 0;
      renderPagination();
    };

    grid.addEventListener("click", (e) => {
      const card = e.target.closest(".listing-card");
      if (!card) return;
      if (typeof window.openVipModal === "function") window.openVipModal();
    });

    searchInput?.addEventListener("input", applyFilters);
    filterForm?.addEventListener("change", applyFilters);
    filterReady?.addEventListener("change", applyFilters);
    filterForm?.addEventListener("reset", () => {
      setTimeout(applyFilters, 0);
    });

    viewBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const view = btn.dataset.view;
        viewBtns.forEach((b) => {
          const active = b.dataset.view === view;
          b.classList.toggle("is-active", active);
          b.setAttribute("aria-selected", active ? "true" : "false");
        });
        if (listPanel) listPanel.hidden = view === "map";
        if (mapPanel) mapPanel.hidden = view !== "map";
      });
    });

    contactForm?.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("res-contact-name");
      const mobile = document.getElementById("res-contact-mobile");
      const email = document.getElementById("res-contact-email");
      if (!name?.value.trim() || !mobile?.value.trim() || !email?.value.trim()) {
        if (contactFeedback) {
          contactFeedback.hidden = false;
          contactFeedback.textContent = "Please fill in all required fields.";
        }
        return;
      }
      if (contactFeedback) {
        contactFeedback.hidden = false;
        contactFeedback.textContent = "Thank you! Our representative will contact you shortly.";
      }
      contactForm.reset();
      if (typeof window.openVipModal === "function") window.openVipModal();
    });

    render();
  };

  initRefSlider({
    trackId: "about-ref-track",
    dotsId: "about-ref-dots",
    prevId: "about-ref-prev",
    nextId: "about-ref-next",
  });

  initRefSlider({
    trackId: "sustain-ref-track",
    dotsId: "sustain-ref-dots",
    prevId: "sustain-ref-prev",
    nextId: "sustain-ref-next",
  });

  initRefSlider({
    trackId: "design-ref-track",
    dotsId: "design-ref-dots",
    prevId: "design-ref-prev",
    nextId: "design-ref-next",
  });

  initSustainEsgSlider();
  initSustainReportsToggle();
  initResidentialPage();

  const initCommercialPage = () => {
    const grid = document.getElementById("commercial-grid");
    if (!grid) return;

    const projects = [
      { name: "Nexspace", slug: "commercial-nexspace", location: "Panvel, Mumbai", city: "mumbai", type: "office", status: "ready", budget: "premium", img: "https://images.unsplash.com/photo-1486406146926-c627a92fd1f2?w=600&q=85" },
      { name: "Godrej Carnival", slug: "commercial-nexspace", location: "Mumbai-Pune Expressway, Pune", city: "pune", type: "mixed", status: "under-construction", budget: "mid", img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=85" },
      { name: "Godrej Avenue 11", slug: "commercial-nexspace", location: "Sector 27, Noida", city: "noida", type: "office", status: "new-launch", budget: "premium", img: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=85" },
      { name: "Godrej Square", slug: "commercial-nexspace", location: "LBS Marg, Mumbai", city: "mumbai", type: "retail", status: "ready", budget: "luxury", img: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&q=85" },
      { name: "Godrej One", slug: "commercial-nexspace", location: "Vikhroli, Mumbai", city: "mumbai", type: "office", status: "ready", budget: "luxury", img: "https://images.unsplash.com/photo-1554464037-db9368459810?w=600&q=85" },
      { name: "Godrej BKC", slug: "commercial-nexspace", location: "Bandra, Mumbai", city: "mumbai", type: "office", status: "under-construction", budget: "luxury", img: "https://images.unsplash.com/photo-1577495501747-42542e815591?w=600&q=85" },
      { name: "Godrej Eternia", slug: "commercial-nexspace", location: "Chandigarh, Chandigarh", city: "chandigarh", type: "retail", status: "ready", budget: "mid", img: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=85" },
    ];

    const searchInput = document.getElementById("commercial-search");
    const filterForm = document.getElementById("commercial-filters");
    const filterCity = document.getElementById("commercial-filter-city");
    const filterType = document.getElementById("commercial-filter-type");
    const filterStatus = document.getElementById("commercial-filter-status");
    const filterBudget = document.getElementById("commercial-filter-budget");
    const emptyMsg = document.getElementById("commercial-empty");

    let filtered = [...projects];

    const applyFilters = () => {
      const query = (searchInput?.value || "").trim().toLowerCase();
      filtered = projects.filter((project) => {
        if (query && !project.name.toLowerCase().includes(query)) return false;
        if (filterCity?.value && project.city !== filterCity.value) return false;
        if (filterType?.value && project.type !== filterType.value) return false;
        if (filterStatus?.value && project.status !== filterStatus.value) return false;
        if (filterBudget?.value && project.budget !== filterBudget.value) return false;
        return true;
      });
      render();
    };

    const renderCard = (project) => `
      <a href="${project.slug}.html" class="commercial-card-link">
        <article class="commercial-card" data-project="${project.name}">
          <div class="commercial-card-media">
            <img src="${project.img}" alt="${project.name}" loading="lazy" decoding="async">
          </div>
          <div class="commercial-card-body">
            <p class="commercial-card-location">${project.location}</p>
            <h3 class="commercial-card-name">${project.name}</h3>
          </div>
        </article>
      </a>
    `;

    const render = () => {
      grid.innerHTML = filtered.map(renderCard).join("");
      if (emptyMsg) emptyMsg.hidden = filtered.length > 0;
      grid.hidden = filtered.length === 0;
    };

    searchInput?.addEventListener("input", applyFilters);
    filterForm?.addEventListener("change", applyFilters);
    filterForm?.addEventListener("reset", () => {
      setTimeout(applyFilters, 0);
    });

    render();
  };

  initCommercialPage();

  const initPlottedPage = () => {
    const grid = document.getElementById("plotted-grid");
    if (!grid) return;

    const PER_PAGE = 9;
    const TOTAL_PAGES = 2;

    const projects = [
      { name: "Godrej Woodside Estate", location: "Hinjewadi, Pune", city: "pune", state: "maharashtra", status: "new-launch", budget: "mid", price: "INR 1.25 Cr. onwards", possession: "Dec 2026", typeLabel: "Plots", badge: "New Launch", badgeClass: "", img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=85" },
      { name: "Godrej Woodscapes", location: "Devanahalli, Bengaluru", city: "bangalore", state: "karnataka", status: "new-launch", budget: "mid", price: "INR 1.60 Cr. onwards", possession: "Oct 2028", typeLabel: "Plots", badge: "New Launch", badgeClass: "", img: "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=600&q=85" },
      { name: "Godrej Reserve", location: "Devanahalli, Bengaluru", city: "bangalore", state: "karnataka", status: "new-launch", budget: "mid", price: "INR 1.80 Cr. onwards", possession: "Dec 2028", typeLabel: "Plots", badge: "New Launch", badgeClass: "", img: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&q=85" },
      { name: "Godrej Golf Links", location: "Greater Noida, Noida", city: "noida", state: "uttar-pradesh", status: "under-construction", budget: "mid", price: "INR 1.70 Cr. onwards", possession: "Mar 2031", typeLabel: "Plots", badge: "Under Construction", badgeClass: "badge-dot--construction", img: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cd7a?w=600&q=85" },
      { name: "Godrej Courtyard Shopense", location: "Sanand, Ahmedabad", city: "ahmedabad", state: "gujarat", status: "under-construction", budget: "affordable", price: "INR 16.99 Lac onwards", possession: "Mar 2031", typeLabel: "Project", badge: "Under Construction", badgeClass: "badge-dot--construction", img: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600&q=85" },
      { name: "Godrej Shantivan Eden Phase II (Pali)", location: "Pali, Mumbai", city: "mumbai", state: "maharashtra", status: "under-construction", budget: "mid", price: "INR 1.18 Cr. onwards", possession: "Jan 2025", typeLabel: "Plots", badge: "Under Construction", badgeClass: "badge-dot--construction", img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=85" },
      { name: "Godrej Golf Hills", location: "Sector 27, Gurugram", city: "gurgaon", state: "haryana", status: "new-launch", budget: "premium", price: "INR 4.75 Cr. onwards", possession: "Dec 2028", typeLabel: "Plots", badge: "New Launch", badgeClass: "", img: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=600&q=85" },
      { name: "Godrej Highland", location: "Devanahalli, Bengaluru", city: "bangalore", state: "karnataka", status: "under-construction", budget: "premium", price: "INR 3.82 Cr. onwards", possession: "Dec 2033", typeLabel: "Plots", badge: "Under Construction", badgeClass: "badge-dot--construction", img: "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=600&q=85" },
      { name: "Godrej MSR City", location: "Shettigere, Bengaluru", city: "bangalore", state: "karnataka", status: "new-launch", budget: "affordable", price: "INR 79.56 Lac onwards", possession: "Dec 2026", typeLabel: "Plots", badge: "New Launch", badgeClass: "", img: "https://images.unsplash.com/photo-1600585152915-d208bec867a1?w=600&q=85" },
      { name: "Godrej Green Cove", location: "Talegaon, Pune", city: "pune", state: "maharashtra", status: "new-launch", budget: "affordable", price: "INR 55 Lac onwards", possession: "Jun 2027", typeLabel: "Plots", badge: "New Launch", badgeClass: "", img: "https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=600&q=85" },
      { name: "Godrej Palm Retreat", location: "Sector 150, Noida", city: "noida", state: "uttar-pradesh", status: "new-launch", budget: "mid", price: "INR 1.45 Cr. onwards", possession: "Sep 2028", typeLabel: "Plots", badge: "New Launch", badgeClass: "", img: "https://images.unsplash.com/photo-1600210492486-724fe41c1d4a?w=600&q=85" },
    ];

    const searchInput = document.getElementById("plotted-search");
    const filterForm = document.getElementById("plotted-filters");
    const filterCity = document.getElementById("plotted-filter-city");
    const filterState = document.getElementById("plotted-filter-state");
    const filterBudget = document.getElementById("plotted-filter-budget");
    const filterNew = document.getElementById("plotted-filter-new");
    const emptyMsg = document.getElementById("plotted-empty");
    const pagination = document.getElementById("plotted-pagination");
    const listPanel = document.getElementById("plotted-list-panel");
    const mapPanel = document.getElementById("plotted-map-panel");
    const viewBtns = document.querySelectorAll(".plotted-page .residential-view-btn");
    const contactForm = document.getElementById("plotted-contact-form");
    const contactFeedback = document.getElementById("plotted-contact-feedback");
    const nextBtn = contactForm?.querySelector(".residential-contact-send--next");

    let currentPage = 1;
    let filtered = [...projects];

    const applyFilters = () => {
      const query = (searchInput?.value || "").trim().toLowerCase();
      filtered = projects.filter((project) => {
        if (query && !project.name.toLowerCase().includes(query)) return false;
        if (filterCity?.value && project.city !== filterCity.value) return false;
        if (filterState?.value && project.state !== filterState.value) return false;
        if (filterBudget?.value && project.budget !== filterBudget.value) return false;
        if (filterNew?.checked && project.status !== "new-launch") return false;
        return true;
      });
      currentPage = 1;
      render();
    };

    const renderCard = (project) => `
      <article class="listing-card" data-project="${project.name}">
        <div class="listing-img-wrap">
          <img src="${project.img}" alt="${project.name}" class="listing-img" loading="lazy" decoding="async">
          <div class="listing-img-overlay">
            <span class="listing-location">${project.location} | Plotted</span>
            <button type="button" class="listing-plus-btn" title="Enquire about ${project.name}" aria-label="Enquire about ${project.name}">+</button>
          </div>
        </div>
        <div class="listing-info">
          <h3 class="listing-name">${project.name}</h3>
          <div class="listing-badge"><span class="badge-dot ${project.badgeClass}"></span>${project.badge}</div>
          <div class="listing-meta">
            <span class="listing-price">${project.price}</span>
            <span class="listing-divider">|</span>
            <span class="listing-possession"><strong>Possession</strong> ${project.possession}</span>
          </div>
          <p class="listing-bhk">${project.typeLabel}</p>
        </div>
      </article>
    `;

    const getPageItems = () => {
      const start = (currentPage - 1) * PER_PAGE;
      return filtered.slice(start, start + PER_PAGE);
    };

    const renderPagination = () => {
      if (!pagination) return;
      const totalFilteredPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
      const displayTotal = Math.min(TOTAL_PAGES, totalFilteredPages);

      pagination.innerHTML = "";

      const prevBtn = document.createElement("button");
      prevBtn.type = "button";
      prevBtn.className = "residential-page-btn";
      prevBtn.innerHTML = "&lsaquo;";
      prevBtn.setAttribute("aria-label", "Previous page");
      prevBtn.disabled = currentPage <= 1;
      prevBtn.addEventListener("click", () => {
        if (currentPage > 1) {
          currentPage -= 1;
          render();
          listPanel?.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
      pagination.appendChild(prevBtn);

      for (let page = 1; page <= displayTotal; page += 1) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = `residential-page-btn${page === currentPage ? " is-active" : ""}`;
        btn.textContent = String(page);
        btn.addEventListener("click", () => {
          currentPage = page;
          render();
          listPanel?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
        pagination.appendChild(btn);
      }

      const nextBtn = document.createElement("button");
      nextBtn.type = "button";
      nextBtn.className = "residential-page-btn";
      nextBtn.innerHTML = "&rsaquo;";
      nextBtn.setAttribute("aria-label", "Next page");
      nextBtn.disabled = currentPage >= displayTotal;
      nextBtn.addEventListener("click", () => {
        if (currentPage < displayTotal) {
          currentPage += 1;
          render();
          listPanel?.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
      pagination.appendChild(nextBtn);
    };

    const render = () => {
      const items = getPageItems();
      grid.innerHTML = items.map(renderCard).join("");
      if (emptyMsg) emptyMsg.hidden = items.length > 0;
      grid.hidden = items.length === 0;
      renderPagination();
    };

    grid.addEventListener("click", (e) => {
      const card = e.target.closest(".listing-card");
      if (!card) return;
      if (typeof window.openVipModal === "function") window.openVipModal();
    });

    searchInput?.addEventListener("input", applyFilters);
    filterForm?.addEventListener("change", applyFilters);
    filterNew?.addEventListener("change", applyFilters);
    filterForm?.addEventListener("reset", () => {
      setTimeout(applyFilters, 0);
    });

    viewBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const view = btn.dataset.view;
        viewBtns.forEach((b) => {
          const active = b.dataset.view === view;
          b.classList.toggle("is-active", active);
          b.setAttribute("aria-selected", active ? "true" : "false");
        });
        if (listPanel) listPanel.hidden = view === "map";
        if (mapPanel) mapPanel.hidden = view !== "map";
      });
    });

    const updateNextBtn = () => {
      if (!nextBtn || !contactForm) return;
      const name = document.getElementById("plotted-contact-name");
      const mobile = document.getElementById("plotted-contact-mobile");
      const email = document.getElementById("plotted-contact-email");
      const ready = name?.value.trim() && mobile?.value.trim() && email?.value.trim();
      nextBtn.classList.toggle("is-ready", Boolean(ready));
    };

    contactForm?.addEventListener("input", updateNextBtn);
    contactForm?.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("plotted-contact-name");
      const mobile = document.getElementById("plotted-contact-mobile");
      const email = document.getElementById("plotted-contact-email");
      if (!name?.value.trim() || !mobile?.value.trim() || !email?.value.trim()) {
        if (contactFeedback) {
          contactFeedback.hidden = false;
          contactFeedback.textContent = "Please fill in all required fields.";
        }
        return;
      }
      if (contactFeedback) {
        contactFeedback.hidden = false;
        contactFeedback.textContent = "Thank you! Our representative will get in touch with you shortly.";
      }
      contactForm.reset();
      updateNextBtn();
      if (typeof window.openVipModal === "function") window.openVipModal();
    });

    render();
    updateNextBtn();
  };

  initPlottedPage();

  const initProjectDetailPage = () => {
    const subnav = document.querySelector(".project-detail-tabs, .project-detail-subnav");
    if (!subnav) return;

    const links = subnav.querySelectorAll("a[href^='#']");
    const sections = [...links].map((link) => document.querySelector(link.getAttribute("href"))).filter(Boolean);

    const setActive = (id) => {
      links.forEach((link) => {
        link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
      });
    };

    links.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute("href"));
        target?.scrollIntoView({ behavior: "smooth", block: "start" });
        setActive(link.getAttribute("href").slice(1));
      });
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));

    document.querySelector(".project-detail-enquire-btn, .project-detail-add-btn")?.addEventListener("click", () => {
      if (typeof window.openVipModal === "function") window.openVipModal();
    });

    const contactForm = document.getElementById("project-detail-contact-form");
    const contactFeedback = document.getElementById("project-detail-contact-feedback");
    contactForm?.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("pd-contact-name");
      const mobile = document.getElementById("pd-contact-mobile");
      if (!name?.value.trim() || !mobile?.value.trim()) {
        if (contactFeedback) {
          contactFeedback.hidden = false;
          contactFeedback.textContent = "Please fill in all required fields.";
        }
        return;
      }
      if (contactFeedback) {
        contactFeedback.hidden = false;
        contactFeedback.textContent = "Thank you! Our team will contact you shortly.";
      }
      contactForm.reset();
    });
  };

  initProjectDetailPage();

  const initNriEnquireForm = () => {
    const form = document.getElementById("nri-enquire-form");
    const feedback = document.getElementById("nri-enquire-feedback");
    const countrySelect = document.getElementById("nri-enq-country-code");
    const countryFlag = document.getElementById("nri-enq-flag");
    const countryDial = document.getElementById("nri-enq-dial");

    const updateCountryDisplay = () => {
      if (!countrySelect || !countryFlag || !countryDial) return;
      const option = countrySelect.selectedOptions[0];
      const flag = option?.dataset.flag || "in";
      const dial = option?.value || "+91";
      countryFlag.src = `https://flagcdn.com/w40/${flag}.png`;
      countryFlag.alt = option?.textContent?.split("(")[0]?.trim() || "Country flag";
      countryDial.textContent = dial;
    };

    countrySelect?.addEventListener("change", updateCountryDisplay);
    updateCountryDisplay();

    if (!form) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const fname = document.getElementById("nri-enq-fname");
      const lname = document.getElementById("nri-enq-lname");
      const email = document.getElementById("nri-enq-email");
      const phone = document.getElementById("nri-enq-phone");
      const project = document.getElementById("nri-enq-project");
      if (!fname?.value.trim() || !lname?.value.trim() || !email?.value.trim() || !phone?.value.trim() || !project?.value) {
        if (feedback) {
          feedback.hidden = false;
          feedback.textContent = "Please fill in all required fields.";
        }
        return;
      }
      if (feedback) {
        feedback.hidden = false;
        feedback.textContent = "Thank you! Our NRI desk will contact you shortly.";
      }
      form.reset();
      updateCountryDisplay();
    });
  };

  initNriEnquireForm();

  const initNriFestForm = () => {
    const form = document.getElementById("nri-fest-form");
    const feedback = document.getElementById("nri-fest-feedback");
    const countrySelect = document.getElementById("nri-fest-country-code");
    const countryFlag = document.getElementById("nri-fest-flag");
    const countryDial = document.getElementById("nri-fest-dial");

    const updateCountryDisplay = () => {
      if (!countrySelect || !countryFlag || !countryDial) return;
      const option = countrySelect.selectedOptions[0];
      const flag = option?.dataset.flag || "in";
      const dial = option?.value || "+91";
      countryFlag.src = `https://flagcdn.com/w40/${flag}.png`;
      countryFlag.alt = option?.textContent?.split("(")[0]?.trim() || "Country flag";
      countryDial.textContent = dial;
    };

    countrySelect?.addEventListener("change", updateCountryDisplay);
    updateCountryDisplay();

    if (!form) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const fname = document.getElementById("nri-fest-fname");
      const lname = document.getElementById("nri-fest-lname");
      const email = document.getElementById("nri-fest-email");
      const phone = document.getElementById("nri-fest-phone");
      const resCountry = document.getElementById("nri-fest-res-country");
      const city = document.getElementById("nri-fest-city");
      const project = document.getElementById("nri-fest-project");
      const event = document.getElementById("nri-fest-event");
      if (!fname?.value.trim() || !lname?.value.trim() || !email?.value.trim() || !phone?.value.trim() || !resCountry?.value || !city?.value || !project?.value || !event?.value) {
        if (feedback) {
          feedback.hidden = false;
          feedback.textContent = "Please fill in all required fields.";
        }
        return;
      }
      if (feedback) {
        feedback.hidden = false;
        feedback.textContent = "Thank you for registering! Our team will contact you shortly.";
      }
      form.reset();
      updateCountryDisplay();
    });
  };

  initNriFestForm();

  const initBlogPage = () => {
    const slides = document.querySelectorAll(".blog-hero-slide");
    const dots = document.querySelectorAll(".blog-hero-dots button");
    const prevBtn = document.getElementById("blog-hero-prev");
    const nextBtn = document.getElementById("blog-hero-next");
    const filter = document.getElementById("blog-category-filter");
    let current = 0;
    let timer;

    const goToSlide = (index) => {
      if (!slides.length) return;
      current = (index + slides.length) % slides.length;
      slides.forEach((slide, i) => slide.classList.toggle("is-active", i === current));
      dots.forEach((dot, i) => {
        dot.classList.toggle("is-active", i === current);
        dot.setAttribute("aria-selected", i === current ? "true" : "false");
      });
    };

    const startAutoplay = () => {
      clearInterval(timer);
      timer = setInterval(() => goToSlide(current + 1), 6000);
    };

    if (slides.length) {
      prevBtn?.addEventListener("click", () => { goToSlide(current - 1); startAutoplay(); });
      nextBtn?.addEventListener("click", () => { goToSlide(current + 1); startAutoplay(); });
      dots.forEach((dot) => {
        dot.addEventListener("click", () => {
          goToSlide(Number(dot.dataset.slide) || 0);
          startAutoplay();
        });
      });
      startAutoplay();
    }

    filter?.addEventListener("change", () => {
      const value = filter.value;
      document.querySelectorAll("[data-category]").forEach((card) => {
        const match = value === "all" || card.dataset.category === value;
        card.classList.toggle("is-hidden", !match);
      });
    });
  };

  initBlogPage();

  const initBlogDetailPage = () => {
    const pageUrl = encodeURIComponent(window.location.href);
    const pageTitle = encodeURIComponent(document.title);

    document.querySelectorAll("[data-share]").forEach((link) => {
      const type = link.dataset.share;
      if (type === "facebook") link.href += pageUrl;
      else if (type === "twitter") link.href += `${pageUrl}&text=${pageTitle}`;
      else if (type === "linkedin") link.href += pageUrl;
      else if (type === "whatsapp") link.href += `${pageTitle}%20${pageUrl}`;
    });

    const copyBtn = document.getElementById("blog-copy-link");
    copyBtn?.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(window.location.href);
        copyBtn.classList.add("is-copied");
        setTimeout(() => copyBtn.classList.remove("is-copied"), 2000);
      } catch {
        /* clipboard unavailable */
      }
    });

    document.querySelectorAll(".blog-detail-faq-q").forEach((btn) => {
      btn.addEventListener("click", () => {
        const item = btn.closest(".blog-detail-faq-item");
        const isOpen = item?.classList.contains("is-open");
        document.querySelectorAll(".blog-detail-faq-item").forEach((el) => {
          el.classList.remove("is-open");
          el.querySelector(".blog-detail-faq-q")?.setAttribute("aria-expanded", "false");
        });
        if (!isOpen && item) {
          item.classList.add("is-open");
          btn.setAttribute("aria-expanded", "true");
        }
      });
    });

    document.getElementById("blog-sidebar-search")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const query = document.getElementById("blog-search-input")?.value.trim();
      if (query) window.location.href = `blog.html?q=${encodeURIComponent(query)}`;
      else window.location.href = "blog.html";
    });
  };

  if (document.body.dataset.page === "blog-detail") initBlogDetailPage();

  const initReachUsPage = () => {
    const officeData = {
      ahmedabad: "Godrej Garden City, Jagatpur Road, Ahmedabad – 382470",
      mumbai: "Godrej One, Pirojshanagar, Vikhroli East, Mumbai – 400 079",
      delhi: "Godrej South Estate, Okhla, New Delhi – 110020",
      bengaluru: "Godrej Woodsman Estate, Hebbal, Bengaluru – 560024",
      hyderabad: "Godrej Regal Pavilion, Kokapet, Hyderabad – 500075",
      pune: "Godrej Infinity, Keshav Nagar, Pune – 411036",
      kolkata: "Godrej Waterside, Sector V, Salt Lake, Kolkata – 700091",
      gurugram: "Godrej Meridien, Sector 104, Gurugram – 122006",
      noida: "Godrej Golf Links, Sector 27, Greater Noida – 201310",
    };

    const indiaCityData = {
      ahmedabad: { phone: "1800 102 5601", tel: "18001025601", hours: "9:30 am to 6:30 pm" },
      mumbai: { phone: "1800 102 5601", tel: "18001025601", hours: "9:30 am to 6:30 pm" },
      delhi: { phone: "1800 102 5601", tel: "18001025601", hours: "9:30 am to 6:30 pm" },
      bengaluru: { phone: "1800 102 5601", tel: "18001025601", hours: "9:30 am to 6:30 pm" },
      hyderabad: { phone: "1800 102 5601", tel: "18001025601", hours: "9:30 am to 6:30 pm" },
      pune: { phone: "1800 102 5601", tel: "18001025601", hours: "9:30 am to 6:30 pm" },
      kolkata: { phone: "1800 102 5601", tel: "18001025601", hours: "9:30 am to 6:30 pm" },
      gurugram: { phone: "1800 102 5601", tel: "18001025601", hours: "9:30 am to 6:30 pm" },
      noida: { phone: "1800 102 5601", tel: "18001025601", hours: "9:30 am to 6:30 pm" },
      chennai: { phone: "1800 102 5601", tel: "18001025601", hours: "9:30 am to 6:30 pm" },
    };

    const officeSelect = document.getElementById("reach-office-select");
    const officeInfo = document.getElementById("reach-office-info");
    officeSelect?.addEventListener("change", () => {
      if (officeInfo && officeData[officeSelect.value]) {
        officeInfo.textContent = officeData[officeSelect.value];
      }
    });

    const indiaCity = document.getElementById("reach-india-city");
    const indiaPhone = document.getElementById("reach-india-phone");
    const indiaHours = document.getElementById("reach-india-hours");
    indiaCity?.addEventListener("change", () => {
      const data = indiaCityData[indiaCity.value];
      if (!data) return;
      if (indiaPhone) {
        indiaPhone.textContent = data.phone;
        indiaPhone.href = `tel:${data.tel}`;
      }
      if (indiaHours) indiaHours.textContent = data.hours;
    });
  };

  if (document.body.dataset.page === "reach-us") initReachUsPage();
});

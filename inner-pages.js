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
    const navPageId = pageId === "nri-expo" ? "nri-home-fest" : pageId;
    document.querySelectorAll(`.inner-subnav a[data-page="${navPageId}"]`).forEach((a) => {
      a.classList.add("is-active");
    });
    document.querySelectorAll(`.nri-subnav a[data-page="${navPageId}"]`).forEach((a) => {
      a.classList.add("is-active");
    });
    document.querySelectorAll(`.about-hero-nav-links a[href*="${navPageId}"], .about-creative-subnav a[href*="${navPageId}"], .projects-subnav a[data-page="${navPageId}"]`).forEach((a) => {
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

  const updateProjectsResultCount = (el, count) => {
    if (!el) return;
    el.textContent = count === 0 ? "No projects match your filters" : `${count} project${count === 1 ? "" : "s"} found`;
  };

  const PROJECT_DETAIL_PAGE = "commercial-nexspace.html";

  const initProjectsCreativePage = () => {
    const page = document.querySelector(".projects-page--creative");
    if (!page) return;

    const revealEls = page.querySelectorAll(
      ".projects-hero-band, .projects-head-panel, .projects-listings-panel, .projects-contact--creative, .listing-card, .commercial-card"
    );
    revealEls.forEach((el) => el.classList.add("projects-reveal"));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -30px 0px" }
    );

    revealEls.forEach((el) => observer.observe(el));
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
    const resultCount = document.getElementById("residential-result-count");
    const pagination = document.getElementById("residential-pagination");
    const listPanel = document.getElementById("residential-list-panel");
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
        if (filterReady?.checked && project.status !== "new-launch") return false;
        return true;
      });
      currentPage = 1;
      render();
    };

    const renderCard = (project) => `
      <a href="${PROJECT_DETAIL_PAGE}" class="listing-card-link">
      <article class="listing-card" data-project="${project.name}">
        <div class="listing-img-wrap">
          <img src="${project.img}" alt="${project.name}" class="listing-img" loading="lazy" decoding="async" width="900" height="675">
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
      </a>
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
      updateProjectsResultCount(resultCount, filtered.length);
      renderPagination();
    };

    grid.addEventListener("click", (e) => {
      if (e.target.closest(".listing-plus-btn")) {
        e.preventDefault();
        e.stopPropagation();
        if (typeof window.openVipModal === "function") window.openVipModal();
      }
    });

    searchInput?.addEventListener("input", applyFilters);
    filterForm?.addEventListener("change", applyFilters);
    filterReady?.addEventListener("change", applyFilters);
    filterForm?.addEventListener("reset", () => {
      setTimeout(applyFilters, 0);
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

  const initAboutPage = () => {
    const page = document.querySelector(".about-page--creative");
    if (!page) return;

    const revealEls = page.querySelectorAll(
      ".about-story--pro, .about-purpose-band, .about-values, .about-footprint, .about-milestones, .about-recognized--creative, .about-cta-band, .about-value-card, .about-heritage-bar"
    );
    revealEls.forEach((el) => el.classList.add("about-reveal"));

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -30px 0px" }
    );

    revealEls.forEach((el) => revealObserver.observe(el));
  };

  if (document.body.dataset.page === "about") initAboutPage();

  const initNriCreativePage = () => {
    const page = document.querySelector(".nri-page--creative");
    if (!page) return;

    const revealEls = page.querySelectorAll(
      ".nri-page-body, .nri-contact-bar, .nri-hub-card, .nri-office-card, .nri-legal-card, .nri-enquire-layout, .inner-cta-band, .nri-fest-why, .nri-fest-vip, .nri-fest-vip-card, .nri-fest-past-expos, .nri-fest-drag, .nri-fest-upcoming, .nri-fest-countdown, .nri-fest-register-stage, .nri-fest-why-item, .nri-fest-expo-card, .nri-fest-ticket"
    );
    revealEls.forEach((el) => el.classList.add("nri-reveal"));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -30px 0px" }
    );

    revealEls.forEach((el) => observer.observe(el));
  };

  const nriPages = ["nri-legal", "nri-loan", "nri-faqs", "international-offices", "nri-enquire", "nri-home-fest", "nri-corner", "nri-expo"];
  if (nriPages.includes(document.body.dataset.page)) initNriCreativePage();

  const nriFestExpoSlug = (city, date, month) =>
    `${city}-${date}-${month}`
      .toLowerCase()
      .replace(/[–—]/g, "-")
      .replace(/&amp;/g, "and")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const NRI_FEST_EXPO_IMAGES = {
    default: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1400&q=80&auto=format&fit=crop",
    Singapore: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1400&q=80&auto=format&fit=crop",
    Dubai: "../images/past-expos/dubai.jpg",
    Sydney: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=1400&q=80&auto=format&fit=crop",
    Lagos: "../images/past-expos/lagos.jpg",
    London: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1400&q=80&auto=format&fit=crop",
    Tokyo: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1400&q=80&auto=format&fit=crop",
    Amsterdam: "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=1400&q=80&auto=format&fit=crop",
    Atlanta: "https://images.unsplash.com/photo-1575936123452-b67c3203c357?w=1400&q=80&auto=format&fit=crop",
    Chicago: "https://images.unsplash.com/photo-1494522855154-9297ac14b55f?w=1400&q=80&auto=format&fit=crop",
    Austin: "https://images.unsplash.com/photo-1531218150217-54595bc2b934?w=1400&q=80&auto=format&fit=crop",
    Perth: "../images/past-expos/perth.jpg",
    Leicester: "../images/past-expos/leicester.jpg"
  };

  const buildNriFestExpo = (partial) => {
    const venueMap = {
      Singapore: "Marina Bay Convention District",
      Dubai: "Downtown Dubai Expo Hall",
      Sydney: "Darling Harbour Exhibition Centre",
      Manama: "Bahrain International Exhibition Centre",
      Brisbane: "Brisbane Convention & Exhibition Centre",
      Doha: "DECC Exhibition Hall",
      Lagos: "Eko Convention Centre",
      Atlanta: "Atlanta Metro Convention Venue",
      Vancouver: "Vancouver Convention Centre",
      "Ho Chi Minh City": "Saigon Exhibition & Convention Centre",
      Amsterdam: "RAI Amsterdam",
      Chicago: "McCormick Place District",
      Jakarta: "Jakarta Convention Center",
      "Kuwait City": "Kuwait International Fairground",
      Munich: "Messe München",
      Frankfurt: "Messe Frankfurt",
      Tokyo: "Tokyo International Forum",
      Dublin: "RDS Convention Centre",
      "New Jersey": "Meadowlands Expo Venue",
      "Kuala Lumpur": "KL Convention Centre",
      London: "ExCeL London",
      Riyadh: "Riyadh Front Exhibition & Conference Center",
      Austin: "Austin Convention Center"
    };

    const image = NRI_FEST_EXPO_IMAGES[partial.city] || NRI_FEST_EXPO_IMAGES.default;
    const exclusive = !!partial.exclusive;
    return {
      ...partial,
      id: nriFestExpoSlug(partial.city, partial.date, partial.month),
      year: "2026",
      venue: venueMap[partial.city] || `${partial.city} Convention Venue`,
      image,
      access: exclusive ? "Exclusive VIP Access" : "Open Registration",
      about: `Join Godrej Properties in ${partial.city} for ${partial.title}. Discover premium Indian homes, meet on-ground experts and unlock NRI-focused pricing, loan guidance and legal support at this ${partial.region} stop.`,
      highlights: [
        "Portfolio walkthrough of residential & commercial launches",
        exclusive ? "Priority VIP lounge and private consultations" : "One-on-one project consultations",
        "Home loan desk with partner bank specialists",
        "Legal, tax and repatriation guidance for NRIs"
      ]
    };
  };

  const NRI_FEST_EXPOS = [
    buildNriFestExpo({ city: "Singapore", country: "Singapore", region: "APAC", date: "18–19", month: "Jul", title: "Investor Meetings", exclusive: true }),
    buildNriFestExpo({ city: "Dubai", country: "UAE", region: "GCC", date: "25", month: "Jul", title: "Office Investor Event", exclusive: true }),
    buildNriFestExpo({ city: "Singapore", country: "Singapore", region: "APAC", date: "25–26", month: "Jul", title: "Godrej Property Expo", exclusive: true }),
    buildNriFestExpo({ city: "Sydney", country: "Australia", region: "APAC", date: "8–9", month: "Aug", title: "Godrej Property Expo" }),
    buildNriFestExpo({ city: "Manama", country: "Bahrain", region: "GCC", date: "14–15", month: "Aug", title: "Godrej Property Expo" }),
    buildNriFestExpo({ city: "Dubai", country: "UAE", region: "GCC", date: "15–16", month: "Aug", title: "Dubai Real Estate Expo — Sobha", exclusive: true }),
    buildNriFestExpo({ city: "Brisbane", country: "Australia", region: "APAC", date: "15–16", month: "Aug", title: "Godrej Property Expo" }),
    buildNriFestExpo({ city: "Doha", country: "Qatar", region: "GCC", date: "21–22", month: "Aug", title: "Godrej Property Expo" }),
    buildNriFestExpo({ city: "Lagos", country: "Nigeria", region: "Africa", date: "22–23", month: "Aug", title: "Godrej Property Expo", exclusive: true }),
    buildNriFestExpo({ city: "Atlanta", country: "USA", region: "NA", date: "22–23", month: "Aug", title: "Godrej Property Expo" }),
    buildNriFestExpo({ city: "Vancouver", country: "Canada", region: "NA", date: "22–23", month: "Aug", title: "Godrej Property Expo" }),
    buildNriFestExpo({ city: "Ho Chi Minh City", country: "Vietnam", region: "APAC", date: "22–23", month: "Aug", title: "Godrej Property Expo" }),
    buildNriFestExpo({ city: "Amsterdam", country: "Netherlands", region: "Europe", date: "29–30", month: "Aug", title: "Godrej Property Expo", exclusive: true }),
    buildNriFestExpo({ city: "Chicago", country: "USA", region: "NA", date: "29–30", month: "Aug", title: "Godrej Property Expo" }),
    buildNriFestExpo({ city: "Jakarta", country: "Indonesia", region: "APAC", date: "29–30", month: "Aug", title: "Godrej Property Expo", exclusive: true }),
    buildNriFestExpo({ city: "Kuwait City", country: "Kuwait", region: "GCC", date: "4–5", month: "Sep", title: "Godrej Property Expo" }),
    buildNriFestExpo({ city: "Munich", country: "Germany", region: "Europe", date: "5–6", month: "Sep", title: "Godrej Property Expo", exclusive: true }),
    buildNriFestExpo({ city: "Frankfurt", country: "Germany", region: "Europe", date: "5–6", month: "Sep", title: "Financial Hub Investor Networking", exclusive: true }),
    buildNriFestExpo({ city: "Tokyo", country: "Japan", region: "APAC", date: "5–6", month: "Sep", title: "Godrej Property Expo", exclusive: true }),
    buildNriFestExpo({ city: "Dublin", country: "Ireland", region: "UK & Ireland", date: "5–6", month: "Sep", title: "Godrej Property Expo" }),
    buildNriFestExpo({ city: "New Jersey", country: "USA", region: "NA", date: "12–13", month: "Sep", title: "Godrej Property Expo", exclusive: true }),
    buildNriFestExpo({ city: "Kuala Lumpur", country: "Malaysia", region: "APAC", date: "12–13", month: "Sep", title: "Godrej Property Expo", exclusive: true }),
    buildNriFestExpo({ city: "London", country: "United Kingdom", region: "UK", date: "12–13", month: "Sep", title: "Godrej Property Expo" }),
    buildNriFestExpo({ city: "Riyadh", country: "Saudi Arabia", region: "GCC", date: "18–19", month: "Sep", title: "Godrej Property Expo" }),
    buildNriFestExpo({ city: "Austin", country: "USA", region: "NA", date: "18–19", month: "Sep", title: "Godrej Property Expo", exclusive: true })
  ];

  const findNriFestExpo = (id) => NRI_FEST_EXPOS.find((expo) => expo.id === id) || NRI_FEST_EXPOS[0];

  const initUpcomingExpoBoard = () => {
    const board = document.querySelector("[data-upcoming-board]");
    if (!board) return;

    const tabs = [...board.querySelectorAll(".nri-fest-upcoming-tab")];
    const panels = [...board.querySelectorAll(".nri-fest-upcoming-panel")];
    if (!tabs.length || !panels.length) return;

    const activate = (month) => {
      tabs.forEach((tab) => {
        const active = tab.dataset.month === month;
        tab.classList.toggle("is-active", active);
        tab.setAttribute("aria-selected", active ? "true" : "false");
      });

      panels.forEach((panel) => {
        const active = panel.dataset.panel === month;
        panel.classList.toggle("is-active", active);
        if (active) panel.removeAttribute("hidden");
        else panel.setAttribute("hidden", "");
      });
    };

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => activate(tab.dataset.month));
    });

    board.querySelectorAll(".nri-fest-ticket").forEach((ticket) => {
      const city = ticket.querySelector("h3")?.textContent?.trim() || "";
      const date = ticket.querySelector(".nri-fest-ticket-date strong")?.textContent?.trim() || "";
      const month = ticket.querySelector(".nri-fest-ticket-date span")?.textContent?.trim() || "";
      const id = nriFestExpoSlug(city, date, month);
      ticket.classList.add("nri-fest-ticket--link");
      ticket.setAttribute("role", "link");
      ticket.tabIndex = 0;
      ticket.setAttribute("aria-label", `View ${city} expo details`);
      const openExpo = () => {
        window.location.href = `nri-expo.html?id=${encodeURIComponent(id)}`;
      };
      ticket.addEventListener("click", openExpo);
      ticket.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openExpo();
        }
      });
    });
  };

  initUpcomingExpoBoard();

  const initNriExpoDetailPage = () => {
    const root = document.querySelector("[data-expo-detail]");
    if (!root) return;

    const params = new URLSearchParams(window.location.search);
    const expo = findNriFestExpo(params.get("id") || "");
    const dateLabel = `${expo.date} ${expo.month} ${expo.year}`;
    const icons = [
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M3 21h18"/><path d="M5 21V8l7-4 7 4v13"/><path d="M9 21v-6h6v6"/></svg>',
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 3l7 4v5c0 5-3 8-7 9-4-1-7-4-7-9V7l7-4z"/></svg>',
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 1v22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>'
    ];

    root.querySelectorAll("[data-expo-city]").forEach((el) => {
      el.textContent = expo.city;
    });
    root.querySelectorAll("[data-expo-city-inline]").forEach((el) => {
      el.textContent = expo.city;
    });
    root.querySelectorAll("[data-expo-country]").forEach((el) => {
      el.textContent = expo.country;
    });
    root.querySelectorAll("[data-expo-region]").forEach((el) => {
      el.textContent = expo.region;
    });
    root.querySelectorAll("[data-expo-event]").forEach((el) => {
      el.textContent = expo.title;
    });
    root.querySelectorAll("[data-expo-date]").forEach((el) => {
      el.textContent = dateLabel;
    });
    root.querySelectorAll("[data-expo-venue]").forEach((el) => {
      el.textContent = expo.venue;
    });
    root.querySelectorAll("[data-expo-access]").forEach((el) => {
      el.textContent = expo.access;
    });
    root.querySelectorAll("[data-expo-about]").forEach((el) => {
      el.textContent = expo.about;
    });
    root.querySelectorAll("[data-expo-month]").forEach((el) => {
      el.textContent = expo.month.toUpperCase();
    });
    root.querySelectorAll("[data-expo-day]").forEach((el) => {
      el.textContent = expo.date;
    });
    root.querySelectorAll("[data-expo-year]").forEach((el) => {
      el.textContent = expo.year;
    });
    root.querySelectorAll("[data-expo-city-mark]").forEach((el) => {
      el.textContent = expo.city.toUpperCase();
    });

    const exclusiveChip = root.querySelector("[data-expo-exclusive]");
    if (exclusiveChip) {
      exclusiveChip.hidden = !expo.exclusive;
    }

    const imageEl = root.querySelector("[data-expo-image]");
    if (imageEl) imageEl.style.backgroundImage = `url("${expo.image}")`;

    const list = root.querySelector("[data-expo-highlights]");
    if (list) {
      list.innerHTML = expo.highlights
        .map(
          (item, i) => `
        <article class="nri-expo-exp-card" data-index="${String(i + 1).padStart(2, "0")}">
          <span class="nri-expo-exp-icon" aria-hidden="true">${icons[i % icons.length]}</span>
          <p>${item}</p>
        </article>`
        )
        .join("");
    }

    const related = root.querySelector("[data-expo-related]");
    if (related) {
      const others = NRI_FEST_EXPOS.filter((item) => item.id !== expo.id).slice(0, 3);
      related.innerHTML = others
        .map(
          (item) => `
        <a class="nri-expo-related-card" href="nri-expo.html?id=${encodeURIComponent(item.id)}" style="background-image:url('${item.image}')">
          <span>${item.date} ${item.month}</span>
          <strong>${item.city}</strong>
          <em>${item.country} · ${item.region}</em>
        </a>`
        )
        .join("");
    }

    document.title = `${expo.city} Expo | NRI Home Fest | Godrej Properties`;
  };

  initNriExpoDetailPage();

  const initFestCountdown = () => {
    const section = document.getElementById("nri-fest-countdown");
    if (!section) return;

    const targetRaw = section.getAttribute("data-countdown-to");
    const target = targetRaw ? new Date(targetRaw).getTime() : NaN;
    if (Number.isNaN(target)) return;

    const daysEl = section.querySelector('[data-unit="days"]');
    const hoursEl = section.querySelector('[data-unit="hours"]');
    const minsEl = section.querySelector('[data-unit="minutes"]');
    const secsEl = section.querySelector('[data-unit="seconds"]');
    const leadEl = section.querySelector(".nri-fest-countdown-lead");
    if (!daysEl || !hoursEl || !minsEl || !secsEl) return;

    const pad = (n) => String(Math.max(0, n)).padStart(2, "0");

    const tick = () => {
      const diff = target - Date.now();
      if (diff <= 0) {
        daysEl.textContent = "00";
        hoursEl.textContent = "00";
        minsEl.textContent = "00";
        secsEl.textContent = "00";
        section.classList.add("is-ended");
        if (leadEl) leadEl.textContent = "Registration is open — secure your VIP access now.";
        return false;
      }

      const totalSec = Math.floor(diff / 1000);
      const days = Math.floor(totalSec / 86400);
      const hours = Math.floor((totalSec % 86400) / 3600);
      const minutes = Math.floor((totalSec % 3600) / 60);
      const seconds = totalSec % 60;

      daysEl.textContent = pad(days);
      hoursEl.textContent = pad(hours);
      minsEl.textContent = pad(minutes);
      secsEl.textContent = pad(seconds);
      return true;
    };

    if (!tick()) return;
    const id = window.setInterval(() => {
      if (!tick()) window.clearInterval(id);
    }, 1000);
  };

  initFestCountdown();

  const initNriFestRegisterModal = () => {
    const modal = document.getElementById("nri-fest-register-modal");
    if (!modal) return;

    const dialog = modal.querySelector(".nri-fest-register-modal-dialog");
    let lastFocus = null;

    const openModal = () => {
      lastFocus = document.activeElement;
      modal.hidden = false;
      modal.setAttribute("aria-hidden", "false");
      requestAnimationFrame(() => modal.classList.add("is-open"));
      document.body.classList.add("nri-fest-register-open");
      const focusTarget =
        modal.querySelector("#nri-fest-fname") ||
        modal.querySelector(".nri-fest-register-modal-close");
      focusTarget?.focus?.();
    };

    const closeModal = () => {
      modal.classList.remove("is-open");
      document.body.classList.remove("nri-fest-register-open");
      modal.setAttribute("aria-hidden", "true");
      window.setTimeout(() => {
        if (!modal.classList.contains("is-open")) modal.hidden = true;
      }, 280);
      if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
    };

    document.addEventListener("click", (e) => {
      const trigger = e.target.closest('a[href="#nri-fest-form"], a[href="#nri-fest-form-stage"], [data-open-register]');
      if (!trigger) return;
      e.preventDefault();
      openModal();
    });

    modal.querySelectorAll("[data-close-register]").forEach((el) => {
      el.addEventListener("click", closeModal);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("is-open")) closeModal();
    });

    dialog?.addEventListener("click", (e) => e.stopPropagation());

    if (window.location.hash === "#nri-fest-form" || window.location.hash === "#nri-fest-form-stage") {
      openModal();
    }

    window.openNriFestRegister = openModal;
    window.closeNriFestRegister = closeModal;
  };

  initNriFestRegisterModal();

  const initNriFestHeroLights = () => {
    const mosaic = document.querySelector("[data-hero-mosaic]");
    if (!mosaic) return;

    const images = [
      "../images/past-expos/dubai.jpg",
      "../images/past-expos/perth.jpg",
      "../images/past-expos/leicester.jpg",
      "../images/past-expos/lagos.jpg",
      "../images/past-expos/dubai-invite.png",
      "../images/past-expos/perth-invite.png",
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&q=70&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&q=70&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&q=70&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=400&q=70&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400&q=70&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=400&q=70&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&q=70&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&q=70&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&q=70&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=70&auto=format&fit=crop"
    ];

    const tileCount = window.innerWidth < 640 ? 24 : window.innerWidth < 900 ? 36 : 48;
    const frag = document.createDocumentFragment();

    for (let i = 0; i < tileCount; i += 1) {
      const tile = document.createElement("div");
      tile.className = "nri-fest-hero-tile";
      tile.style.animationDelay = `${(i % 12) * 0.35}s`;
      const img = document.createElement("img");
      img.src = images[i % images.length];
      img.alt = "";
      img.loading = i < 12 ? "eager" : "lazy";
      img.decoding = "async";
      tile.appendChild(img);
      frag.appendChild(tile);
    }

    mosaic.appendChild(frag);

    const tiles = [...mosaic.querySelectorAll(".nri-fest-hero-tile")];
    if (!tiles.length || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let lit = 0;
    window.setInterval(() => {
      tiles.forEach((t) => t.classList.remove("is-lit"));
      for (let n = 0; n < 6; n += 1) {
        const idx = (lit + n * 7) % tiles.length;
        tiles[idx].classList.add("is-lit");
      }
      lit = (lit + 1) % tiles.length;
    }, 900);
  };

  initNriFestHeroLights();

  const initNriFestDragGallery = () => {
    const section = document.querySelector("[data-drag-gallery]");
    const viewport = document.getElementById("nri-fest-drag-viewport");
    const canvas = document.getElementById("nri-fest-drag-canvas");
    const overlay = document.getElementById("nri-fest-drag-overlay");
    if (!section || !viewport || !canvas || typeof gsap === "undefined") return;

    const imageUrls = [
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cd00?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80&auto=format&fit=crop"
    ];

    const settings = {
      baseWidth: 280,
      smallHeight: 220,
      largeHeight: 340,
      itemGap: 28,
      dragEase: 0.08,
      momentumFactor: 180,
      bufferZone: 2.2,
      expandedScale: 0.42,
      zoomDuration: 0.55,
      overlayOpacity: 0.86
    };

    let itemSizes = [
      { width: settings.baseWidth, height: settings.smallHeight },
      { width: settings.baseWidth, height: settings.largeHeight }
    ];
    const columns = 4;
    const itemCount = imageUrls.length;
    let cellWidth = settings.baseWidth + settings.itemGap;
    let cellHeight = Math.max(settings.smallHeight, settings.largeHeight) + settings.itemGap;

    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let dragVelocityX = 0;
    let dragVelocityY = 0;
    let lastDragTime = 0;
    let mouseHasMoved = false;
    let visibleItems = new Set();
    let lastUpdateTime = 0;
    let lastX = 0;
    let lastY = 0;
    let isExpanded = false;
    let activeItem = null;
    let activeItemId = null;
    let canDrag = true;
    let originalPosition = null;
    let expandedItem = null;
    let overlayTween = null;

    const getItemSize = (row, col) => itemSizes[Math.abs((row * columns + col) % itemSizes.length)];
    const getItemId = (col, row) => `${col},${row}`;
    const getItemPosition = (col, row) => ({ x: col * cellWidth, y: row * cellHeight });

    const updateVisibleItems = () => {
      const buffer = settings.bufferZone;
      const viewWidth = viewport.clientWidth * (1 + buffer);
      const viewHeight = viewport.clientHeight * (1 + buffer);
      const startCol = Math.floor((-currentX - viewWidth / 2) / cellWidth);
      const endCol = Math.ceil((-currentX + viewWidth * 1.5) / cellWidth);
      const startRow = Math.floor((-currentY - viewHeight / 2) / cellHeight);
      const endRow = Math.ceil((-currentY + viewHeight * 1.5) / cellHeight);
      const currentItems = new Set();

      for (let row = startRow; row <= endRow; row += 1) {
        for (let col = startCol; col <= endCol; col += 1) {
          const itemId = getItemId(col, row);
          currentItems.add(itemId);
          if (visibleItems.has(itemId)) continue;
          if (activeItemId === itemId && isExpanded) continue;

          const itemSize = getItemSize(row, col);
          const position = getItemPosition(col, row);
          const itemNum = Math.abs((row * columns + col) % itemCount);

          const item = document.createElement("div");
          item.className = "nri-fest-drag-item";
          item.id = `drag-${itemId}`;
          item.style.width = `${itemSize.width}px`;
          item.style.height = `${itemSize.height}px`;
          item.style.left = `${position.x}px`;
          item.style.top = `${position.y}px`;
          item.dataset.col = String(col);
          item.dataset.row = String(row);
          item.dataset.width = String(itemSize.width);
          item.dataset.height = String(itemSize.height);
          item.dataset.itemId = itemId;

          const media = document.createElement("div");
          media.className = "nri-fest-drag-item-media";
          const img = document.createElement("img");
          img.src = imageUrls[itemNum % imageUrls.length];
          img.alt = "";
          img.draggable = false;
          img.loading = "lazy";
          img.decoding = "async";
          media.appendChild(img);
          item.appendChild(media);

          item.addEventListener("click", () => {
            if (mouseHasMoved || isDragging) return;
            if (isExpanded) closeExpandedItem();
            else expandItem(item);
          });

          canvas.appendChild(item);
          visibleItems.add(itemId);
        }
      }

      visibleItems.forEach((itemId) => {
        if (!currentItems.has(itemId) || (activeItemId === itemId && isExpanded)) {
          const el = document.getElementById(`drag-${itemId}`);
          if (el && el.parentNode === canvas) canvas.removeChild(el);
          visibleItems.delete(itemId);
        }
      });
    };

    const animateOverlay = (opacity) => {
      if (overlayTween) overlayTween.kill();
      overlayTween = gsap.to(overlay, {
        opacity,
        duration: 0.55,
        ease: "power2.inOut",
        overwrite: true
      });
    };

    const expandItem = (item) => {
      isExpanded = true;
      activeItem = item;
      activeItemId = item.dataset.itemId;
      canDrag = false;
      viewport.classList.remove("is-grabbing");

      const imgSrc = item.querySelector("img").src;
      const itemWidth = Number(item.dataset.width);
      const itemHeight = Number(item.dataset.height);
      const rect = item.getBoundingClientRect();

      originalPosition = {
        id: activeItemId,
        rect,
        width: itemWidth,
        height: itemHeight
      };

      overlay.classList.add("is-active");
      animateOverlay(settings.overlayOpacity);

      expandedItem = document.createElement("div");
      expandedItem.className = "nri-fest-drag-expanded";
      expandedItem.style.width = `${itemWidth}px`;
      expandedItem.style.height = `${itemHeight}px`;
      const img = document.createElement("img");
      img.src = imgSrc;
      img.alt = "";
      expandedItem.appendChild(img);
      expandedItem.addEventListener("click", closeExpandedItem);
      document.body.appendChild(expandedItem);

      canvas.querySelectorAll(".nri-fest-drag-item").forEach((el) => {
        if (el !== activeItem) gsap.to(el, { opacity: 0, duration: 0.45, ease: "power2.inOut" });
      });

      const targetWidth = Math.min(window.innerWidth * settings.expandedScale, 560);
      const targetHeight = targetWidth * (itemHeight / itemWidth);

      gsap.fromTo(
        expandedItem,
        {
          width: itemWidth,
          height: itemHeight,
          xPercent: -50,
          yPercent: -50,
          x: rect.left + itemWidth / 2 - window.innerWidth / 2,
          y: rect.top + itemHeight / 2 - window.innerHeight / 2
        },
        {
          width: targetWidth,
          height: targetHeight,
          xPercent: -50,
          yPercent: -50,
          x: 0,
          y: 0,
          duration: settings.zoomDuration,
          ease: "power3.inOut"
        }
      );
    };

    const closeExpandedItem = () => {
      if (!expandedItem || !originalPosition) return;

      animateOverlay(0);

      canvas.querySelectorAll(".nri-fest-drag-item").forEach((el) => {
        if (el.dataset.itemId !== activeItemId) {
          gsap.to(el, { opacity: 1, duration: 0.45, delay: 0.2, ease: "power2.inOut" });
        }
      });

      const originalRect = originalPosition.rect;
      gsap.to(expandedItem, {
        width: originalPosition.width,
        height: originalPosition.height,
        xPercent: -50,
        yPercent: -50,
        x: originalRect.left + originalPosition.width / 2 - window.innerWidth / 2,
        y: originalRect.top + originalPosition.height / 2 - window.innerHeight / 2,
        duration: settings.zoomDuration,
        ease: "power3.inOut",
        onComplete: () => {
          expandedItem?.remove();
          expandedItem = null;
          isExpanded = false;
          activeItem = null;
          activeItemId = null;
          originalPosition = null;
          canDrag = true;
          overlay.classList.remove("is-active");
          updateVisibleItems();
        }
      });
    };

    const animate = () => {
      if (canDrag) {
        const ease = settings.dragEase;
        currentX += (targetX - currentX) * ease;
        currentY += (targetY - currentY) * ease;
        canvas.style.transform = `translate(${currentX}px, ${currentY}px)`;

        const now = Date.now();
        const distMoved = Math.hypot(currentX - lastX, currentY - lastY);
        if (distMoved > 80 || now - lastUpdateTime > 120) {
          updateVisibleItems();
          lastX = currentX;
          lastY = currentY;
          lastUpdateTime = now;
        }
      }
      requestAnimationFrame(animate);
    };

    const onPointerDown = (clientX, clientY) => {
      if (!canDrag) return;
      isDragging = true;
      mouseHasMoved = false;
      startX = clientX;
      startY = clientY;
      lastDragTime = Date.now();
      viewport.classList.add("is-grabbing");
    };

    const onPointerMove = (clientX, clientY) => {
      if (!isDragging || !canDrag) return;
      const dx = clientX - startX;
      const dy = clientY - startY;
      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
        mouseHasMoved = true;
        viewport.classList.add("has-moved");
      }
      const now = Date.now();
      const dt = Math.max(10, now - lastDragTime);
      lastDragTime = now;
      dragVelocityX = dx / dt;
      dragVelocityY = dy / dt;
      targetX += dx;
      targetY += dy;
      startX = clientX;
      startY = clientY;
    };

    const onPointerUp = () => {
      if (!isDragging) return;
      isDragging = false;
      viewport.classList.remove("is-grabbing");
      if (canDrag && (Math.abs(dragVelocityX) > 0.1 || Math.abs(dragVelocityY) > 0.1)) {
        targetX += dragVelocityX * settings.momentumFactor;
        targetY += dragVelocityY * settings.momentumFactor;
      }
    };

    viewport.addEventListener("mousedown", (e) => onPointerDown(e.clientX, e.clientY));
    window.addEventListener("mousemove", (e) => onPointerMove(e.clientX, e.clientY));
    window.addEventListener("mouseup", onPointerUp);

    viewport.addEventListener("touchstart", (e) => {
      if (!e.touches[0]) return;
      onPointerDown(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });

    window.addEventListener("touchmove", (e) => {
      if (!e.touches[0] || !isDragging) return;
      onPointerMove(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });

    window.addEventListener("touchend", onPointerUp);

    overlay.addEventListener("click", () => {
      if (isExpanded) closeExpandedItem();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && isExpanded) closeExpandedItem();
    });

    // Center the first view a bit
    targetX = viewport.clientWidth * 0.2;
    targetY = viewport.clientHeight * 0.15;
    currentX = targetX;
    currentY = targetY;
    updateVisibleItems();
    animate();
  };

  initNriFestDragGallery();

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
      { name: "Nexspace", slug: "commercial-nexspace", location: "Panvel, Mumbai", city: "mumbai", type: "office", status: "ready", budget: "premium", img: "https://images.unsplash.com/photo-1486406146926-c627a92fd1f2?w=900&q=90" },
      { name: "Godrej Carnival", slug: "commercial-nexspace", location: "Mumbai-Pune Expressway, Pune", city: "pune", type: "mixed", status: "under-construction", budget: "mid", img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=900&q=90" },
      { name: "Godrej Avenue 11", slug: "commercial-nexspace", location: "Sector 27, Noida", city: "noida", type: "office", status: "new-launch", budget: "premium", img: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&q=90" },
      { name: "Godrej Square", slug: "commercial-nexspace", location: "LBS Marg, Mumbai", city: "mumbai", type: "retail", status: "ready", budget: "luxury", img: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=900&q=90" },
      { name: "Godrej One", slug: "commercial-nexspace", location: "Vikhroli, Mumbai", city: "mumbai", type: "office", status: "ready", budget: "luxury", img: "https://images.unsplash.com/photo-1554464037-db9368459810?w=900&q=90" },
      { name: "Godrej BKC", slug: "commercial-nexspace", location: "Bandra, Mumbai", city: "mumbai", type: "office", status: "under-construction", budget: "luxury", img: "https://images.unsplash.com/photo-1577495501747-42542e815591?w=900&q=90" },
      { name: "Godrej Eternia", slug: "commercial-nexspace", location: "Chandigarh, Chandigarh", city: "chandigarh", type: "retail", status: "ready", budget: "mid", img: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=900&q=90" },
    ];

    const searchInput = document.getElementById("commercial-search");
    const filterForm = document.getElementById("commercial-filters");
    const filterCity = document.getElementById("commercial-filter-city");
    const filterType = document.getElementById("commercial-filter-type");
    const filterStatus = document.getElementById("commercial-filter-status");
    const filterBudget = document.getElementById("commercial-filter-budget");
    const filterNew = document.getElementById("commercial-filter-new");
    const emptyMsg = document.getElementById("commercial-empty");
    const resultCount = document.getElementById("commercial-result-count");

    let filtered = [...projects];

    const applyFilters = () => {
      const query = (searchInput?.value || "").trim().toLowerCase();
      filtered = projects.filter((project) => {
        if (query && !project.name.toLowerCase().includes(query)) return false;
        if (filterCity?.value && project.city !== filterCity.value) return false;
        if (filterType?.value && project.type !== filterType.value) return false;
        if (filterStatus?.value && project.status !== filterStatus.value) return false;
        if (filterBudget?.value && project.budget !== filterBudget.value) return false;
        if (filterNew?.checked && project.status !== "new-launch") return false;
        return true;
      });
      render();
    };

    const renderCard = (project) => `
      <a href="${PROJECT_DETAIL_PAGE}" class="commercial-card-link">
        <article class="commercial-card" data-project="${project.name}">
          <div class="commercial-card-media">
            <img src="${project.img}" alt="${project.name}" loading="lazy" decoding="async" width="900" height="675">
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
      updateProjectsResultCount(resultCount, filtered.length);
    };

    searchInput?.addEventListener("input", applyFilters);
    filterForm?.addEventListener("change", applyFilters);
    filterNew?.addEventListener("change", applyFilters);
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
      { name: "Godrej Woodside Estate", location: "Hinjewadi, Pune", city: "pune", state: "maharashtra", status: "new-launch", budget: "mid", price: "INR 1.25 Cr. onwards", possession: "Dec 2026", typeLabel: "Plots", badge: "New Launch", badgeClass: "", img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=90" },
      { name: "Godrej Woodscapes", location: "Devanahalli, Bengaluru", city: "bangalore", state: "karnataka", status: "new-launch", budget: "mid", price: "INR 1.60 Cr. onwards", possession: "Oct 2028", typeLabel: "Plots", badge: "New Launch", badgeClass: "", img: "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=900&q=90" },
      { name: "Godrej Reserve", location: "Devanahalli, Bengaluru", city: "bangalore", state: "karnataka", status: "new-launch", budget: "mid", price: "INR 1.80 Cr. onwards", possession: "Dec 2028", typeLabel: "Plots", badge: "New Launch", badgeClass: "", img: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=900&q=90" },
      { name: "Godrej Golf Links", location: "Greater Noida, Noida", city: "noida", state: "uttar-pradesh", status: "under-construction", budget: "mid", price: "INR 1.70 Cr. onwards", possession: "Mar 2031", typeLabel: "Plots", badge: "Under Construction", badgeClass: "badge-dot--construction", img: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cd7a?w=900&q=90" },
      { name: "Godrej Courtyard Shopense", location: "Sanand, Ahmedabad", city: "ahmedabad", state: "gujarat", status: "under-construction", budget: "affordable", price: "INR 16.99 Lac onwards", possession: "Mar 2031", typeLabel: "Project", badge: "Under Construction", badgeClass: "badge-dot--construction", img: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=900&q=90" },
      { name: "Godrej Shantivan Eden Phase II (Pali)", location: "Pali, Mumbai", city: "mumbai", state: "maharashtra", status: "under-construction", budget: "mid", price: "INR 1.18 Cr. onwards", possession: "Jan 2025", typeLabel: "Plots", badge: "Under Construction", badgeClass: "badge-dot--construction", img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900&q=90" },
      { name: "Godrej Golf Hills", location: "Sector 27, Gurugram", city: "gurgaon", state: "haryana", status: "new-launch", budget: "premium", price: "INR 4.75 Cr. onwards", possession: "Dec 2028", typeLabel: "Plots", badge: "New Launch", badgeClass: "", img: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=900&q=90" },
      { name: "Godrej Highland", location: "Devanahalli, Bengaluru", city: "bangalore", state: "karnataka", status: "under-construction", budget: "premium", price: "INR 3.82 Cr. onwards", possession: "Dec 2033", typeLabel: "Plots", badge: "Under Construction", badgeClass: "badge-dot--construction", img: "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=900&q=90" },
      { name: "Godrej MSR City", location: "Shettigere, Bengaluru", city: "bangalore", state: "karnataka", status: "new-launch", budget: "affordable", price: "INR 79.56 Lac onwards", possession: "Dec 2026", typeLabel: "Plots", badge: "New Launch", badgeClass: "", img: "https://images.unsplash.com/photo-1600585152915-d208bec867a1?w=900&q=90" },
      { name: "Godrej Green Cove", location: "Talegaon, Pune", city: "pune", state: "maharashtra", status: "new-launch", budget: "affordable", price: "INR 55 Lac onwards", possession: "Jun 2027", typeLabel: "Plots", badge: "New Launch", badgeClass: "", img: "https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=900&q=90" },
      { name: "Godrej Palm Retreat", location: "Sector 150, Noida", city: "noida", state: "uttar-pradesh", status: "new-launch", budget: "mid", price: "INR 1.45 Cr. onwards", possession: "Sep 2028", typeLabel: "Plots", badge: "New Launch", badgeClass: "", img: "https://images.unsplash.com/photo-1600210492486-724fe41c1d4a?w=900&q=90" },
    ];

    const searchInput = document.getElementById("plotted-search");
    const filterForm = document.getElementById("plotted-filters");
    const filterCity = document.getElementById("plotted-filter-city");
    const filterState = document.getElementById("plotted-filter-state");
    const filterBudget = document.getElementById("plotted-filter-budget");
    const filterNew = document.getElementById("plotted-filter-new");
    const emptyMsg = document.getElementById("plotted-empty");
    const resultCount = document.getElementById("plotted-result-count");
    const pagination = document.getElementById("plotted-pagination");
    const listPanel = document.getElementById("plotted-list-panel");
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
      <a href="${PROJECT_DETAIL_PAGE}" class="listing-card-link">
      <article class="listing-card" data-project="${project.name}">
        <div class="listing-img-wrap">
          <img src="${project.img}" alt="${project.name}" class="listing-img" loading="lazy" decoding="async" width="900" height="675">
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
      </a>
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
      updateProjectsResultCount(resultCount, filtered.length);
      renderPagination();
    };

    grid.addEventListener("click", (e) => {
      if (e.target.closest(".listing-plus-btn")) {
        e.preventDefault();
        e.stopPropagation();
        if (typeof window.openVipModal === "function") window.openVipModal();
      }
    });

    searchInput?.addEventListener("input", applyFilters);
    filterForm?.addEventListener("change", applyFilters);
    filterNew?.addEventListener("change", applyFilters);
    filterForm?.addEventListener("reset", () => {
      setTimeout(applyFilters, 0);
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
  initProjectsCreativePage();

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

  const initNexspacePage = () => {
    const page = document.querySelector(".nexspace-page");
    if (!page) return;

    const revealEls = page.querySelectorAll(
      ".nx-section, .nx-stats-strip, .nx-vision-band, .nx-stat, .nx-highlight-card, .nx-connect-card, .nx-fact"
    );
    revealEls.forEach((el) => el.classList.add("nx-reveal"));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    revealEls.forEach((el) => observer.observe(el));

    page.querySelector(".nx-amenity-showcase-btn")?.addEventListener("click", () => {
      if (typeof window.openVipModal === "function") window.openVipModal();
    });
  };

  initNexspacePage();

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
    const page = document.querySelector(".blog-page");
    if (!page) return;

    const slides = document.querySelectorAll(".blog-hero-slide");
    const dots = document.querySelectorAll(".blog-hero-dots button");
    const prevBtn = document.getElementById("blog-hero-prev");
    const nextBtn = document.getElementById("blog-hero-next");
    const progressBar = document.getElementById("blog-hero-progress");
    const filterPills = document.querySelectorAll(".blog-filter-pill");
    const searchInput = document.getElementById("blog-search-inline");
    const newsletterForm = document.getElementById("blog-newsletter-form");
    const newsletterFeedback = document.getElementById("blog-newsletter-feedback");
    let current = 0;
    let timer;
    let progressTimer;
    const autoplayMs = 6000;

    const goToSlide = (index) => {
      if (!slides.length) return;
      current = (index + slides.length) % slides.length;
      slides.forEach((slide, i) => slide.classList.toggle("is-active", i === current));
      dots.forEach((dot, i) => {
        dot.classList.toggle("is-active", i === current);
        dot.setAttribute("aria-selected", i === current ? "true" : "false");
      });
      resetProgress();
    };

    const resetProgress = () => {
      if (!progressBar) return;
      clearInterval(progressTimer);
      progressBar.style.width = "0%";
      const start = Date.now();
      progressTimer = setInterval(() => {
        const pct = Math.min(((Date.now() - start) / autoplayMs) * 100, 100);
        progressBar.style.width = `${pct}%`;
        if (pct >= 100) clearInterval(progressTimer);
      }, 50);
    };

    const startAutoplay = () => {
      clearInterval(timer);
      timer = setInterval(() => goToSlide(current + 1), autoplayMs);
      resetProgress();
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

    const applyFilters = () => {
      const activePill = document.querySelector(".blog-filter-pill.is-active");
      const category = activePill?.dataset.filter || "all";
      const query = (searchInput?.value || "").trim().toLowerCase();

      document.querySelectorAll("[data-category]").forEach((card) => {
        const matchCategory = category === "all" || card.dataset.category === category;
        const title = card.querySelector(".blog-card-title a, .blog-featured-title a")?.textContent.toLowerCase() || "";
        const excerpt = card.querySelector(".blog-text-excerpt, .blog-featured-excerpt")?.textContent.toLowerCase() || "";
        const matchSearch = !query || title.includes(query) || excerpt.includes(query);
        card.classList.toggle("is-hidden", !(matchCategory && matchSearch));
      });
    };

    filterPills.forEach((pill) => {
      pill.addEventListener("click", () => {
        filterPills.forEach((p) => p.classList.toggle("is-active", p === pill));
        applyFilters();
      });
    });

    searchInput?.addEventListener("input", applyFilters);

    newsletterForm?.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("blog-newsletter-email");
      if (!email?.value.trim() || !email.validity.valid) {
        if (newsletterFeedback) {
          newsletterFeedback.hidden = false;
          newsletterFeedback.textContent = "Please enter a valid email address.";
        }
        return;
      }
      if (newsletterFeedback) {
        newsletterFeedback.hidden = false;
        newsletterFeedback.textContent = "Thank you for subscribing!";
      }
      newsletterForm.reset();
    });

    if (page.classList.contains("blog-page--creative")) {
      const revealEls = page.querySelectorAll(
        ".blog-featured-wrap, .blog-grid-section, .blog-quote, .blog-text-section, .blog-card, .blog-text-card, .blog-newsletter"
      );
      revealEls.forEach((el) => el.classList.add("blog-reveal"));

      const revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              revealObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1, rootMargin: "0px 0px -30px 0px" }
      );

      revealEls.forEach((el) => revealObserver.observe(el));
    }
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
    const page = document.querySelector(".reach-us-page");
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

    if (page?.classList.contains("reach-us-page--creative")) {
      const revealEls = page.querySelectorAll(
        ".reach-offices, .reach-support, .reach-inquiry-card, .reach-helpline, .reach-cta-band, .reach-office-card, .reach-support-card"
      );
      revealEls.forEach((el) => el.classList.add("reach-reveal"));

      const revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              revealObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1, rootMargin: "0px 0px -30px 0px" }
      );

      revealEls.forEach((el) => revealObserver.observe(el));
    }
  };

  if (document.body.dataset.page === "reach-us") initReachUsPage();

  const initMediaGallery = () => {
    const grid = document.getElementById("media-gallery-grid");
    const filters = document.querySelectorAll(".media-gallery-filter");
    const modal = document.getElementById("media-video-modal");
    const iframe = document.getElementById("media-video-iframe");
    const modalTitle = document.getElementById("media-video-title");
    const modalClose = document.getElementById("media-video-close");
    const modalBackdrop = document.getElementById("media-video-backdrop");
    const emptyState = document.getElementById("media-gallery-empty");
    if (!grid || !filters.length) return;

    const items = [
      { title: "Bloomberg UTV Final Word 22 March 2012 Mr Pirojsha Godrej MD & CEO, Godrej Properties", link: "https://www.youtube.com/watch?v=7jvwEVMNi1w", filter: "in-the-news", date: "2012-03-22" },
      { title: "38th Annual General Meeting of Godrej Properties Limited", link: "https://youtu.be/eqLBx_-QiXo", filter: "properties", date: "2023-08-02" },
      { title: "ET Now Earnings with Pirojsha Godrej Executive Chairperson, Godrej Properties, 4 May, 2023", link: "https://youtu.be/K8dk1XjoA2I", filter: "in-the-news", date: "2023-05-03" },
      { title: "Godrej Properties raises INR 475 Cr", link: "https://youtu.be/7jvwEVMNi1w", filter: "in-the-news", date: "2012-03-22" },
      { title: "Godrej Properties: INR 475 Cr IPP", link: "https://youtu.be/DtuLXDxsn3Q", filter: "in-the-news", date: "2012-03-22" },
      { title: "Godrej Properties IPP Successful", link: "https://youtu.be/aCUXZkbzURw", filter: "in-the-news", date: "2012-03-22" },
      { title: "To use IPP proceeds for growth, debt repayment", link: "https://youtu.be/e7svwuTli7M", filter: "in-the-news", date: "2012-03-22" },
      { title: "CNBC TV18 - Godrej Properties Q4 earnings", link: "https://youtu.be/nn9FQ8VMl7s", filter: "in-the-news", date: "2012-05-04" },
      { title: "ZEE Business - Godrej Properties Q4 Mr Adi Godrej", link: "https://youtu.be/KaeJxb8PBEQ", filter: "in-the-news", date: "2012-05-04" },
      { title: "NDTV Profit - Godrej Properties Q4 Review Mr Pirojsha", link: "https://youtu.be/WdGGea5sv6s", filter: "in-the-news", date: "2012-05-04" },
      { title: "CNBC AWAAZ - Mr Adi Godrej & Mr Pirojsha Godrej", link: "https://youtu.be/-ADs4zLAlBg", filter: "in-the-news", date: "2012-05-04" },
      { title: "CNBC TV18 - Markets & Macros", link: "https://youtu.be/blUqxHcwmi0", filter: "in-the-news", date: "2012-07-02" },
      { title: "ET Now Business Day 11 Sept 2012", link: "https://youtu.be/1PJloDPK8c8", filter: "in-the-news", date: "2012-09-10" },
      { title: "NDTV Profit - Launch of Godrej Summit, Gurgaon", link: "https://youtu.be/65qBrh5uIsw", filter: "in-the-news", date: "2012-09-13" },
      { title: "ET Now Business Today 11 Sept 2012", link: "https://youtu.be/bdt1jGFt2_k", filter: "in-the-news", date: "2011-09-10" },
      { title: "Zee Business - Godrej launches 2nd project in Gurgaon", link: "https://youtu.be/S9B_daxaDO8", filter: "in-the-news", date: "2012-09-13" },
      { title: "Bloomberg TV - Godrej Summit Phase 1 sold out", link: "https://youtu.be/6AmkTcxWH_U", filter: "in-the-news", date: "2012-09-13" },
      { title: "40th Annual General Meeting of the Godrej Properties Limited", link: "https://youtu.be/4-CD5H1DgUc", filter: "properties", date: "2025-08-07" },
    ];

    const youtubeId = (url) => {
      const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^&?#]+)/);
      return match ? match[1] : "";
    };

    const formatDate = (iso) => new Date(iso).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    const filterLabel = (filter) => (filter === "properties" ? "Properties" : "In the News");

    const playIcon = `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><polygon points="8 5 19 12 8 19 8 5"></polygon></svg>`;

    grid.innerHTML = items.map((item) => {
      const id = youtubeId(item.link);
      const thumb = id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : "";
      return `
        <article class="media-gallery-card" role="listitem" data-filter="${item.filter}" data-video-id="${id}" data-title="${item.title.replace(/"/g, "&quot;")}">
          <button type="button" class="media-gallery-thumb" aria-label="Play: ${item.title.replace(/"/g, "&quot;")}">
            <img src="${thumb}" alt="" width="480" height="270" loading="lazy" decoding="async">
            <span class="media-gallery-play"><span>${playIcon}</span></span>
          </button>
          <div class="media-gallery-body">
            <span class="media-gallery-tag">${filterLabel(item.filter)}</span>
            <h3>${item.title}</h3>
            <time class="media-gallery-date" datetime="${item.date}">${formatDate(item.date)}</time>
          </div>
        </article>
      `;
    }).join("");

    const cards = grid.querySelectorAll(".media-gallery-card");
    let activeFilter = "all";

    const applyFilter = (filter) => {
      activeFilter = filter;
      let visible = 0;
      cards.forEach((card) => {
        const show = filter === "all" || card.dataset.filter === filter;
        card.classList.toggle("is-hidden", !show);
        if (show) visible += 1;
      });
      if (emptyState) emptyState.hidden = visible > 0;
    };

    filters.forEach((btn) => {
      btn.addEventListener("click", () => {
        const filter = btn.dataset.filter || "all";
        filters.forEach((el) => {
          const active = el === btn;
          el.classList.toggle("is-active", active);
          el.setAttribute("aria-selected", active ? "true" : "false");
        });
        applyFilter(filter);
      });
    });

    const closeModal = () => {
      if (!modal || !iframe) return;
      modal.hidden = true;
      modal.setAttribute("aria-hidden", "true");
      iframe.src = "";
      document.body.style.overflow = "";
    };

    const openModal = (videoId, title) => {
      if (!modal || !iframe || !videoId) return;
      if (modalTitle) modalTitle.textContent = title;
      iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
      modal.hidden = false;
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      modalClose?.focus();
    };

    grid.addEventListener("click", (e) => {
      const card = e.target.closest(".media-gallery-card");
      if (!card || card.classList.contains("is-hidden")) return;
      const btn = e.target.closest(".media-gallery-thumb");
      if (!btn) return;
      openModal(card.dataset.videoId, card.dataset.title || "");
    });

    modalClose?.addEventListener("click", closeModal);
    modalBackdrop?.addEventListener("click", closeModal);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal && !modal.hidden) closeModal();
    });

    applyFilter(activeFilter);
  };

  if (document.body.dataset.page === "media-gallery") initMediaGallery();

  const initLegalPage = () => {
    const tabs = document.querySelectorAll(".legal-subnav-btn");
    const panels = document.querySelectorAll(".legal-panel");
    if (!tabs.length || !panels.length) return;

    const activate = (id) => {
      tabs.forEach((tab) => {
        const active = tab.dataset.legalTab === id;
        tab.classList.toggle("is-active", active);
        tab.setAttribute("aria-selected", active ? "true" : "false");
      });
      panels.forEach((panel) => {
        const active = panel.dataset.legalPanel === id;
        panel.classList.toggle("is-active", active);
        if (active) {
          panel.removeAttribute("hidden");
        } else {
          panel.setAttribute("hidden", "");
        }
      });
      if (history.replaceState) {
        history.replaceState(null, "", id === "disclaimer" ? "disclaimer.html" : `disclaimer.html#${id}`);
      }
    };

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => activate(tab.dataset.legalTab || "disclaimer"));
    });

    const hash = window.location.hash.replace("#", "");
    if (hash === "terms" || hash === "privacy") activate(hash);
  };

  if (document.body.dataset.page === "disclaimer") initLegalPage();
});

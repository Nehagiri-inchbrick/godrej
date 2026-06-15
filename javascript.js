document.addEventListener("DOMContentLoaded", () => {
  // --- Setup & Constants ---
  const scrollHint = document.querySelector(".scroll-hint"),
    navScroll = document.querySelector(".nav-scroll"),
    header = document.getElementById("main-header"),
    snapContainer = document.querySelector(".snap-container"),
    menuToggle = document.getElementById("menu-toggle"),
    headerNav = document.querySelector(".header-nav");

  const isHomePage = !!snapContainer;

  // --- Optimized Scroll Handling (Window Scroll) ---
  let isTicking = false;
  window.addEventListener("scroll", () => {
    if (!isTicking) {
      window.requestAnimationFrame(() => {
        const y = window.scrollY;

        // Header & UI States
        if (scrollHint) {
          scrollHint.style.opacity = y > 100 ? '0' : '1';
          scrollHint.style.pointerEvents = y > 100 ? 'none' : 'auto';
        }
        if (navScroll) navScroll.classList.toggle("visible", y > 50);
        if (header) header.classList.toggle("scrolled", y > 50);

        isTicking = false;
      });
      isTicking = true;
    }
  }, { passive: true });



  if (isHomePage) {
    header?.addEventListener("click", (e) => {
      if (e.target.classList.contains("header-logo")) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      if (!e.target.matches("a.nav-link")) return;

      const targetId = e.target.getAttribute("href");
      if (!targetId || !targetId.startsWith("#")) return;

      e.preventDefault();
      menuToggle?.classList.remove("active");
      headerNav?.classList.remove("active");
      header?.classList.remove("menu-active");

      if (targetId === "#listings" && typeof window.scrollToListings === "function") {
        window.scrollToListings("mumbai");
        return;
      }
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        window.scrollTo({ top: targetEl.offsetTop, behavior: "smooth" });
      }
    });
  }

  // --- VIP Modal Logic ---
  const vipModal = document.getElementById("vip-modal");
  const vipClose = document.getElementById("vip-close");
  const vipForm = document.getElementById("vip-form");
  const vipFormFeedback = document.getElementById("vip-form-feedback");
  const vipSubmitBtn = vipForm?.querySelector('button[type="submit"]');
  const vipAgentSelect = document.getElementById("vip-agent");
  const vipDateSelect = document.getElementById("vip-date");
  const vipSlotSelect = document.getElementById("vip-slot");
  const vipCitySelect = document.getElementById("vip-city");
  const vipUserCityInput = document.getElementById("vip-user-city");
  const vipModalDateBadge = document.getElementById("vip-modal-date-badge");
  const vipModalSubtitle = document.getElementById("vip-modal-subtitle");
  const LEAD_API_URL = "https://admin.inchbrick.com/api/expo";
  const AGENT_API_URL = "https://admin.inchbrick.com/api/admin-register?status=1&is_agent=1&columns=firstName,lastName,userCode,designation";
  const INCHBRICK_AGENT = { code: "Inchbrick", name: "Inchbrick" };
  const VIP_THANK_YOU_PERTH = "thank-you-perth.html";
  const VIP_THANK_YOU_DUBAI = "thank-you-dubai.html";
  const VIP_THANK_YOU_SINGAPORE = "thank-you-singapore.html";
  const VIP_THANK_YOU_LAGOS = "thank-you-lagos.html";
  const VIP_THANK_YOU_LEICESTER = "thank-you-leicester.html";

  const EXPO_THANK_YOU_PAGE = {
    australia: VIP_THANK_YOU_PERTH,
    dubai: VIP_THANK_YOU_DUBAI,
    singapore: VIP_THANK_YOU_SINGAPORE,
    lagos: VIP_THANK_YOU_LAGOS,
    leicester: VIP_THANK_YOU_LEICESTER
  };

  const EXPO_THANK_YOU_SLUG = {
    australia: "perth",
    dubai: "dubai",
    singapore: "singapore",
    lagos: "lagos",
    leicester: "leicester"
  };

  const COMING_SOON_DATES = [{ value: "TBA", label: "Coming Soon" }];
  const COMING_SOON_SLOTS = [{ value: "Coming Soon", label: "Coming Soon" }];

  const warmVipBackendConnections = () => {
    if (window.__vipBackendWarmed) return;
    window.__vipBackendWarmed = true;
    fetch(LEAD_API_URL, { method: "HEAD", mode: "cors", cache: "no-store", priority: "low" }).catch(
      () => { }
    );
  };

  const prefetchVipThankYouPages = () => {
    if (window.__vipThanksPrefetched) return;
    window.__vipThanksPrefetched = true;
    [
      VIP_THANK_YOU_PERTH,
      VIP_THANK_YOU_DUBAI,
      VIP_THANK_YOU_SINGAPORE,
      VIP_THANK_YOU_LAGOS,
      VIP_THANK_YOU_LEICESTER
    ].forEach((href) => {
      const link = document.createElement("link");
      link.rel = "prefetch";
      link.href = href;
      link.as = "document";
      document.head.appendChild(link);
    });
  };

  const EXPO_BY_KEY = {
    australia: {
      eventValue: "Australia Expo 2026",
      visitcountry: "Australia",
      dateBanner: "16th - 17th MAY 2026",
      venue: "Perth, Australia",
      subtitle: "Experience luxury Indian living at the Perth Property Expo.",
      dates: [
        { value: "16th May", label: "16th May" },
        { value: "17th May", label: "17th May" }
      ]
    },
    dubai: {
      eventValue: "Dubai Expo 2026 (Godrej)",
      visitcountry: "UAE",
      dateBanner: "16th - 17th MAY 2026",
      venue: "Dubai, UAE",
      subtitle: "Discover premium investment opportunities at the Dubai Property Expo.",
      dates: [
        { value: "16th May", label: "16th May" },
        { value: "17th May", label: "17th May" }
      ]
    },
    singapore: {
      eventValue: "Singapore Expo 2026 (Godrej)",
      visitcountry: "Singapore",
      dateBanner: "23rd - 24th MAY 2026",
      venue: "Singapore",
      subtitle: "Join the elite investors circle at the Singapore Property Expo. Book your slot between 10 AM and 6 PM.",
      dates: [
        { value: "23rd May", label: "23rd May 2026" },
        { value: "24th May", label: "24th May 2026" }
      ]
    },
    lagos: {
      comingSoon: true,
      eventValue: "Lagos Expo 2026",
      visitcountry: "Nigeria",
      dateBanner: "6th - 7th JUNE 2026",
      venue: "Lagos, Nigeria",
      subtitle: "Explore high-growth Indian real estate in Lagos, Nigeria. VIP registrations opening soon.",
      dates: COMING_SOON_DATES
    },
    leicester: {
      comingSoon: true,
      eventValue: "Leicester Expo 2026",
      visitcountry: "United Kingdom",
      dateBanner: "30th MAY 2026",
      venue: "Leicester, United Kingdom",
      subtitle: "India’s finest properties, now in Leicester, UK. VIP registrations opening soon.",
      dates: COMING_SOON_DATES
    }
  };

  const HERO_EXPO_KEYS = ["australia", "dubai", "singapore", "leicester", "lagos"];

  const SHARED_VIP_DATES = EXPO_BY_KEY.australia.dates;

  const resolveExpoKeyFromEventValue = (eventValue) => {
    const v = (eventValue || "").trim().toLowerCase();
    if (!v) return "";
    if (v.includes("dubai")) return "dubai";
    if (v.includes("singapore")) return "singapore";
    if (v.includes("lagos")) return "lagos";
    if (v.includes("leicester") || v.includes("hong kong")) return "leicester";
    if (v.includes("australia") || v.includes("perth")) return "australia";
    return "";
  };

  const EXPO_DATE_MAP = (() => {
    const map = {
      "16th May": "2026-05-16",
      "17th May": "2026-05-17",
      "23rd May": "2026-05-23",
      "24th May": "2026-05-24",
      "6th June": "2026-06-06",
      "7th June": "2026-06-07"
    };
    Object.values(EXPO_BY_KEY).forEach((cfg) => {
      cfg.dates.forEach((d) => {
        if (map[d.value]) return;
        const match = d.value.match(/^(\d{1,2})(?:st|nd|rd|th)\s+(\w+)/i);
        if (!match) return;
        const months = {
          january: "01", february: "02", march: "03", april: "04", may: "05", june: "06",
          july: "07", august: "08", september: "09", october: "10", november: "11", december: "12"
        };
        const monthKey = match[2].toLowerCase();
        const month = months[monthKey] || months[monthKey.slice(0, 3)];
        if (!month) return;
        const day = String(parseInt(match[1], 10)).padStart(2, "0");
        map[d.value] = `2026-${month}-${day}`;
      });
    });
    return map;
  })();

  const GENERIC_VIP = {
    dateBanner: "Select your expo city",
    subtitle:
      "Singapore: 23rd–24th May 2026 · United Kingdom: 30th May 2026 · Lagos, Nigeria: 6th–7th June 2026. Choose your expo city below & book your VIP slots."
  };

  const rebuildVipDateOptions = (dates) => {
    if (!vipDateSelect) return;
    const preserved = vipDateSelect.value;
    vipDateSelect.innerHTML = '<option value="" disabled selected>Preferred Date</option>';
    dates.forEach((d) => {
      const opt = document.createElement("option");
      opt.value = d.value;
      opt.textContent = d.label;
      vipDateSelect.appendChild(opt);
    });
    if (dates.some((d) => d.value === preserved)) {
      vipDateSelect.value = preserved;
    } else if (dates.length === 1) {
      vipDateSelect.value = dates[0].value;
    }
  };

  const vipEventSelect = document.getElementById("vip-event");
  let activeExpoKey = "";

  const rebuildVipSlotOptions = (slots) => {
    if (!vipSlotSelect) return;
    const preserved = vipSlotSelect.value;
    vipSlotSelect.innerHTML = '<option value="" disabled selected>Preferred Slot</option>';
    slots.forEach((s) => {
      const opt = document.createElement("option");
      opt.value = s.value;
      opt.textContent = s.label;
      vipSlotSelect.appendChild(opt);
    });
    if (slots.some((s) => s.value === preserved)) {
      vipSlotSelect.value = preserved;
    } else if (slots.length === 1) {
      vipSlotSelect.value = slots[0].value;
    }
  };

  const clearDynamicEventOptions = () => {
    if (!vipEventSelect) return;
    Array.from(vipEventSelect.querySelectorAll('[data-dynamic-expo="1"]')).forEach((opt) => opt.remove());
  };

  const syncEventSelectForExpo = (cfg) => {
    if (!vipEventSelect || !cfg?.eventValue) return;
    clearDynamicEventOptions();
    const hasOption = Array.from(vipEventSelect.options).some((o) => o.value === cfg.eventValue);
    if (!hasOption) {
      const opt = document.createElement("option");
      opt.value = cfg.eventValue;
      opt.textContent = cfg.comingSoon ? `${cfg.eventValue} — Coming Soon` : cfg.eventValue;
      opt.dataset.dynamicExpo = "1";
      vipEventSelect.appendChild(opt);
    }
    vipEventSelect.value = cfg.eventValue;
    vipEventSelect.disabled = !!cfg.comingSoon;
  };

  const setVipFormComingSoon = (isComingSoon) => {
    if (vipDateSelect) vipDateSelect.disabled = isComingSoon;
    if (vipSlotSelect) vipSlotSelect.disabled = isComingSoon;
    if (vipSubmitBtn) {
      vipSubmitBtn.disabled = isComingSoon;
      vipSubmitBtn.textContent = isComingSoon ? "Coming Soon" : "Claim VIP Pass";
    }
    if (isComingSoon) {
      setFormFeedback("Registrations for this expo are coming soon. Please choose Perth, Dubai, or Singapore.", "info");
    } else {
      clearFormFeedback();
    }
  };

  const updateVipSlots = () => {
    if (!vipEventSelect || !vipSlotSelect) return;
    const isDubai = vipEventSelect.value.includes("Dubai");

    const baseSlots = [
      "10 AM - 12 PM",
      "12 PM - 2 PM",
      "2 PM - 4 PM",
      "4 PM - 6 PM"
    ];
    const extraDubaiSlots = ["6 PM - 8 PM", "8 PM - 10 PM"];
    const finalSlots = isDubai ? [...baseSlots, ...extraDubaiSlots] : baseSlots;

    const currentValue = vipSlotSelect.value;
    vipSlotSelect.innerHTML = '<option value="" disabled selected>Preferred Slot</option>';

    finalSlots.forEach((slot) => {
      const opt = document.createElement("option");
      opt.value = slot;
      opt.textContent = slot;
      vipSlotSelect.appendChild(opt);
    });

    if (finalSlots.includes(currentValue)) {
      vipSlotSelect.value = currentValue;
    }
  };

  const applyExpoToForm = (expoKey) => {
    const cfg = EXPO_BY_KEY[expoKey] || EXPO_BY_KEY.australia;
    activeExpoKey = expoKey;
    syncEventSelectForExpo(cfg);
    if (vipModalDateBadge) vipModalDateBadge.textContent = cfg.dateBanner;
    if (vipModalSubtitle) vipModalSubtitle.textContent = cfg.subtitle;
    rebuildVipDateOptions(cfg.dates);
    if (cfg.comingSoon) {
      rebuildVipSlotOptions(COMING_SOON_SLOTS);
      setVipFormComingSoon(true);
    } else {
      setVipFormComingSoon(false);
      updateVipSlots();
    }
  };

  const applyGenericVipModal = () => {
    activeExpoKey = "";
    clearDynamicEventOptions();
    if (vipEventSelect) {
      vipEventSelect.disabled = false;
      vipEventSelect.value = "";
    }
    if (vipModalDateBadge) vipModalDateBadge.textContent = GENERIC_VIP.dateBanner;
    if (vipModalSubtitle) vipModalSubtitle.textContent = GENERIC_VIP.subtitle;
    rebuildVipDateOptions(SHARED_VIP_DATES);
    setVipFormComingSoon(false);
    updateVipSlots();
  };

  const openVipModal = (maybeKey) => {
    warmVipBackendConnections();
    prefetchVipThankYouPages();
    if (maybeKey && EXPO_BY_KEY[maybeKey]) {
      applyExpoToForm(maybeKey);
    } else {
      applyGenericVipModal();
    }
    if (vipModal) vipModal.classList.add("active");
  };

  window.openVipModal = openVipModal;

  const closeVipModal = () => {
    if (vipModal) vipModal.classList.remove("active");
  };

  vipClose?.addEventListener("click", closeVipModal);
  vipModal?.addEventListener("click", (e) => {
    if (e.target === vipModal) closeVipModal();
  });

  const setFormFeedback = (message, type = "error") => {
    if (!vipFormFeedback) return;
    vipFormFeedback.style.display = "block";
    vipFormFeedback.textContent = message;
    if (type === "success") vipFormFeedback.style.color = "#32d27e";
    else if (type === "info") vipFormFeedback.style.color = "#c99c56";
    else vipFormFeedback.style.color = "#ff8e8e";
  };

  const clearFormFeedback = () => {
    if (!vipFormFeedback) return;
    vipFormFeedback.style.display = "none";
    vipFormFeedback.textContent = "";
  };

  vipEventSelect?.addEventListener("change", () => {
    const v = vipEventSelect.value?.trim() || "";
    if (!v) {
      applyGenericVipModal();
      return;
    }
    const expoKey = resolveExpoKeyFromEventValue(v);
    if (expoKey) {
      applyExpoToForm(expoKey);
    } else {
      applyGenericVipModal();
    }
  });
  applyGenericVipModal();

  const normalizeExpoDate = (rawDate) => {
    if (!rawDate) return "";
    if (/^\d{4}-\d{2}-\d{2}$/.test(rawDate)) return rawDate;

    if (EXPO_DATE_MAP[rawDate]) return EXPO_DATE_MAP[rawDate];

    const parsed = new Date(rawDate);
    if (Number.isNaN(parsed.getTime())) return "";
    const yyyy = parsed.getFullYear();
    const mm = String(parsed.getMonth() + 1).padStart(2, "0");
    const dd = String(parsed.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const validateVipPayload = ({ name, email, mobile, city, agent, slot, expodate }) => {
    if (!name || name.length < 2) return "Please enter your full name (minimum 2 characters).";
    if (!/^[A-Za-z][A-Za-z\s.'-]{1,79}$/.test(name)) return "Please enter a valid full name.";
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return "Please enter a valid email address.";
    if (!mobile || !/^\+?[0-9][0-9\s\-()]{7,19}$/.test(mobile)) return "Please enter a valid mobile number.";
    if (!city || city.length < 2) return "Please enter your city.";
    if (!slot) return "Please select slot.";
    if (!/^\d{4}-\d{2}-\d{2}$/.test(expodate)) return "Please select a valid preferred date.";
    return "";
  };

  const appendNoneOfTheAboveAgentOption = () => {
    if (!vipAgentSelect) return;
    const alreadyAdded = Array.from(vipAgentSelect.options).some(
      (opt) => opt.dataset.noneOfTheAbove === "1"
    );
    if (alreadyAdded) return;

    const option = document.createElement("option");
    option.value = INCHBRICK_AGENT.code;
    option.textContent = "None of the above";
    option.dataset.noneOfTheAbove = "1";
    vipAgentSelect.appendChild(option);
  };

  const resolveSelectedAgent = () => {
    const rawValue = vipAgentSelect?.value?.trim() || "";
    const selectedOption = vipAgentSelect?.selectedOptions?.[0];
    const useDefaultAgent =
      !rawValue || selectedOption?.dataset?.noneOfTheAbove === "1";

    if (useDefaultAgent) {
      return { code: INCHBRICK_AGENT.code, name: "" };
    }

    return {
      code: rawValue,
      name: selectedOption?.dataset?.agentName || ""
    };
  };

  const populateAgentDropdown = async () => {
    if (!vipAgentSelect) return;

    vipAgentSelect.innerHTML = '<option value="">Loading agents...</option>';
    vipAgentSelect.disabled = true;

    try {
      const response = await fetch(AGENT_API_URL, {
        method: "GET",
        headers: { Accept: "application/json" }
      });

      if (!response.ok) throw new Error(`API ${response.status}`);

      const raw = await response.json();
      const agents = Array.isArray(raw?.data) ? raw.data : Array.isArray(raw) ? raw : [];

      vipAgentSelect.innerHTML = '<option value="" disabled selected>Select Portfolio Manager</option>';

      agents
        .filter((agent) => agent?.userCode)
        .filter((agent) => {
          const fullName = `${agent.firstName || ""} ${agent.lastName || ""}`.trim().toLowerCase();
          return !fullName.includes("richa jain") && !fullName.includes("chubasangla");
        })
        .forEach((agent) => {
          const fullName = `${agent.firstName || ""} ${agent.lastName || ""}`.trim() || String(agent.userCode).trim();
          const option = document.createElement("option");
          option.value = String(agent.userCode).trim();
          option.textContent = fullName;
          option.dataset.agentName = fullName;
          vipAgentSelect.appendChild(option);
        });

      appendNoneOfTheAboveAgentOption();

      if (vipAgentSelect.options.length <= 1) {
        throw new Error("No agent records");
      }
    } catch (error) {
      console.error("Failed to fetch agents", error);
      vipAgentSelect.innerHTML =
        '<option value="" disabled selected>Select Portfolio Manager</option>';
      appendNoneOfTheAboveAgentOption();
    } finally {
      vipAgentSelect.disabled = false;
    }
  };

  const PASS_CDN_BASE = "https://cdn.inchbrick.com";

  const normalizePossibleUrl = (value) => {
    if (typeof value !== "string") return "";
    const trimmed = value.trim();
    if (!trimmed) return "";
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    if (trimmed.startsWith("/")) return `${PASS_CDN_BASE}${trimmed}`;
    return "";
  };

  const sanitizePassPath = (pathValue) => {
    if (typeof pathValue !== "string") return "";
    let path = pathValue.trim();
    if (!path) return "";
    if (!path.startsWith("/")) path = `/${path}`;
    path = path.replace("/expo_pass/", "/expo-pass/");
    path = path.replace(/\s+/g, "-");
    return path;
  };

  const buildPassUrl = (passPathOrUrl, passNo) => {
    const normalized = normalizePossibleUrl(passPathOrUrl);
    if (normalized) {
      return normalized.replace("/expo_pass/", "/expo-pass/").replace(/\s+/g, "-");
    }

    const sanitizedPath = sanitizePassPath(passPathOrUrl);
    if (sanitizedPath) return `${PASS_CDN_BASE}${sanitizedPath}`;

    if (passNo) {
      const safePassNo = String(passNo).trim().replace(/\s+/g, "-");
      return `${PASS_CDN_BASE}/expo-pass/${safePassNo}.jpg`;
    }
    return "";
  };

  const findFirstPassLikeUrl = (node, visited = new Set()) => {
    if (!node || typeof node !== "object") return "";
    if (visited.has(node)) return "";
    visited.add(node);

    const urlHintRegex = /(pass|ticket|download|pdf|invite|invitation|file)/i;
    const fileHintRegex = /\.(pdf|png|jpg|jpeg|webp)(\?|$)/i;

    for (const [key, value] of Object.entries(node)) {
      if (typeof value === "string") {
        const normalized = normalizePossibleUrl(value);
        if (normalized && (urlHintRegex.test(key) || fileHintRegex.test(normalized) || urlHintRegex.test(normalized))) {
          return normalized;
        }
      }
    }

    for (const value of Object.values(node)) {
      if (typeof value === "object" && value !== null) {
        const nested = findFirstPassLikeUrl(value, visited);
        if (nested) return nested;
      }
    }

    return "";
  };

  const getPassUrlFromResponse = (responseData) => {
    const passOnly = buildPassUrl(
      responseData?.data?.pass || responseData?.pass,
      responseData?.data?.passno || responseData?.passno
    );
    if (passOnly) return passOnly;

    const directCandidates = [
      responseData?.data?.downloadUrl,
      responseData?.data?.download_url,
      responseData?.data?.pdf,
      responseData?.data?.pdfUrl,
      responseData?.data?.file,
      responseData?.data?.ticketUrl,
      responseData?.data?.ticket_url,
      responseData?.data?.pass,
      responseData?.downloadUrl
    ];

    for (const candidate of directCandidates) {
      const normalized = buildPassUrl(candidate, responseData?.data?.passno || responseData?.passno);
      if (normalized) return normalized;
    }

    const discovered = findFirstPassLikeUrl(responseData);
    if (discovered) return buildPassUrl(discovered, responseData?.data?.passno || responseData?.passno);

    return buildPassUrl("", responseData?.data?.passno || responseData?.passno);
  };

  const VIP_SUBMIT_STATUS_MS = 3200;
  const VIP_SUBMIT_MESSAGES = [
    "Submitting…",
    "Creating your VIP pass…",
    "Still working — please wait…",
    "Almost there…"
  ];
  let vipSubmitStatusTimerId = null;
  const clearVipSubmitStatusRotation = () => {
    if (vipSubmitStatusTimerId !== null) {
      clearInterval(vipSubmitStatusTimerId);
      vipSubmitStatusTimerId = null;
    }
  };
  const startVipSubmitStatusRotation = () => {
    clearVipSubmitStatusRotation();
    let idx = 0;
    if (vipSubmitBtn) vipSubmitBtn.textContent = VIP_SUBMIT_MESSAGES[0];
    vipSubmitStatusTimerId = window.setInterval(() => {
      idx = Math.min(idx + 1, VIP_SUBMIT_MESSAGES.length - 1);
      if (vipSubmitBtn) vipSubmitBtn.textContent = VIP_SUBMIT_MESSAGES[idx];
    }, VIP_SUBMIT_STATUS_MS);
  };

  vipForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearFormFeedback();

    const { code: selectedAgent, name: selectedAgentName } = resolveSelectedAgent();
    const selectedDate = normalizeExpoDate(vipDateSelect?.value || "");
    const selectedSlot = vipSlotSelect?.value || "";
    const selectedCity = vipCitySelect?.value || "";
    const selectedUserCity = vipUserCityInput?.value?.trim() || "";
    const eventValue = vipEventSelect?.value?.trim() || "";
    const expoKey =
      activeExpoKey || resolveExpoKeyFromEventValue(eventValue) || "";
    const expoCfg = expoKey ? EXPO_BY_KEY[expoKey] : null;

    if (!eventValue && !expoCfg) {
      setFormFeedback("Please select your expo city.");
      return;
    }
    if (expoCfg?.comingSoon) {
      setFormFeedback("Registrations for this expo are coming soon. Please choose Perth, Dubai, or Singapore.", "info");
      return;
    }

    const resolvedKey = expoKey || "australia";
    const activeCfg = EXPO_BY_KEY[resolvedKey] || EXPO_BY_KEY.australia;
    const visitcountry = activeCfg.visitcountry;

    const payload = {
      name: vipForm.name.value.trim(),
      email: vipForm.email.value.trim().toLowerCase(),
      mobile: vipForm.phone.value.trim(),
      city: selectedUserCity,
      expodate: selectedDate,
      slot: selectedSlot,
      last_investment: selectedUserCity,
      agent: selectedAgent,
      agent_name: selectedAgentName,
      assigned_agent: selectedAgent,
      visitcountry,
      occupation: "Self-Employed",
      interest: selectedCity,
      refer: "",
      eventName: eventValue || activeCfg.eventValue,
      event_name: eventValue || activeCfg.eventValue
    };

    const validationError = validateVipPayload(payload);
    if (validationError) {
      setFormFeedback(validationError);
      return;
    }

    if (vipSubmitBtn) {
      vipSubmitBtn.disabled = true;
    }
    startVipSubmitStatusRotation();

    let navigatingAway = false;
    try {
      const response = await fetch(LEAD_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(payload),
        priority: "high"
      });

      let responseData = null;
      let rawResponseText = "";
      try {
        rawResponseText = await response.text();
        responseData = rawResponseText ? JSON.parse(rawResponseText) : null;
      } catch (parseError) {
        responseData = null;
      }

      if (!response.ok) {
        const apiMessage = responseData?.message || responseData?.error || rawResponseText || "Lead submission failed.";
        throw new Error(`API ${response.status}: ${apiMessage}`);
      }

      const isSuccess = typeof responseData?.status === "boolean" ? responseData.status : true;
      if (!isSuccess) {
        throw new Error(responseData?.message || "Registration failed.");
      }

      const passNo = responseData?.data?.passno || "";
      const passUrl = getPassUrlFromResponse(responseData);
      const thankYouPage = EXPO_THANK_YOU_PAGE[resolvedKey] || VIP_THANK_YOU_PERTH;
      const thankYouPayload = {
        passNo: String(passNo || "").trim(),
        passUrl: String(passUrl || "").trim(),
        expo: EXPO_THANK_YOU_SLUG[resolvedKey] || "perth"
      };

      /* Keep sessionStorage as backup; always put data in the URL so www/apex
         mismatches and strict storage do not drop the pass link. */
      try {
        sessionStorage.setItem("vipThankYou", JSON.stringify(thankYouPayload));
      } catch (storageErr) {
        /* ignore */
      }

      const dest = new URL(thankYouPage, window.location.href);
      dest.searchParams.set("expo", thankYouPayload.expo);
      if (thankYouPayload.passNo) dest.searchParams.set("no", thankYouPayload.passNo);
      const dl = thankYouPayload.passUrl;
      const MAX_DL_IN_QUERY = 1600;
      if (dl && dl.length <= MAX_DL_IN_QUERY) {
        dest.searchParams.set("dl", dl);
      }
      navigatingAway = true;
      window.location.assign(dest.href);
    } catch (error) {
      const message = error?.message || "Something went wrong. Please try again.";
      setFormFeedback(message);
      console.error("VIP lead submission error", {
        endpoint: LEAD_API_URL,
        payload,
        error
      });
    } finally {
      clearVipSubmitStatusRotation();
      if (!navigatingAway && vipSubmitBtn) {
        vipSubmitBtn.disabled = false;
        vipSubmitBtn.textContent = "Claim VIP Pass";
      }
    }
  });

  populateAgentDropdown();

  // --- Hero Slider & Listings Logic ---
  const heroSlides = document.querySelectorAll(".hero-slide");
  const btnPrev = document.getElementById("hero-prev");
  const btnNext = document.getElementById("hero-next");
  const heroExploreBtn = document.getElementById("hero-explore-btn");
  const heroSlideLabel = document.getElementById("hero-slide-label");
  const heroSlideTitle = document.getElementById("hero-slide-title");
  const heroSlideDesc = document.getElementById("hero-slide-desc");
  const heroSlideCount = document.getElementById("hero-slide-count");
  const heroProgressFill = document.getElementById("hero-progress-fill");

  const listingsSection = document.getElementById("listings");
  const listingsGrid = document.getElementById("listings-grid");
  const listingsTitle = document.getElementById("listings-title");

  const openListingsSection = () => {
    if (!listingsSection) return;
    if (listingsSection.classList.contains("is-open")) return;
    listingsSection.removeAttribute("hidden");
    requestAnimationFrame(() => {
      listingsSection.classList.add("is-open");
    });
  };

  let currentSlide = 0;
  let slideInterval;

  const propertyData = {
    delhi: [
      { name: "Godrej South Estate", location: "Okhla, New Delhi", price: "INR 6.14 Cr. onwards", possession: "May 2026", bhk: "3 & 4 BHK", badge: "Under Construction", img: "images/977a1e4f-349f-43d9-8aaf-836f73d5e4ff.webp" },
      { name: "Godrej Connaught One", location: "Connaught Place, New Delhi", price: "INR 18.61 Cr. onwards", possession: "May 2025", bhk: "3 BHK", badge: "Under Construction", img: "images/a40702e6-3019-4e58-86d9-a854eceb6590.webp" },
      { name: "Godrej Prima", location: "Okhla, New Delhi", price: "INR 6.14 Cr. onwards", possession: "Jun 2025", bhk: "3 & 4 BHK", badge: "Under Construction", img: "images/Pool-Pan-Cam_1ad984ed8-22a0-4cf6-9fc2-f8e5aa6d4159.webp" },

    ],
    gurgaon: [
      { name: "Godrej Zenith", location: "Sector 89, Gurgaon", price: "INR 5.88 Cr. onwards", possession: "Dec 2030", bhk: "4+ Utility BHK", badge: "Under Construction", img: "images/c0e0f519-f787-48aa-88c9-e5c62dae623b.webp" },
      { name: "Godrej Astra", location: "Sector 54, Gurugram", price: "INR 10.34 Cr. onwards", possession: "Jan 2031", bhk: "3 & 4 BHK", badge: "New Launch", img: "images/e5aa86f4-f70f-46af-b39d-4bd91de720e2.webp" },
      { name: "Godrej Meridien", location: "Sector 106, Gurugram", price: "INR 1.62 Cr. onwards", possession: "Jan 2025", bhk: "1,2 & 3 BHK", badge: "Under Construction", img: "images/44ab5a60-484f-4845-89fb-7a894292b8db.webp" },
      { name: "Godrej Vrikshya", location: "Sector 103, Gurgaon", price: "INR 3.81 Cr. onwards", possession: "Jun 2031", bhk: "3 & 4 BHK", badge: "New Launch", img: "images/bd519108-63a0-431c-9a3a-468ca7d6f366.webp" }
    ],
    noida: [
      { name: "Godrej Arden", location: "Sigma III, Noida", price: "INR 3.46 Cr. onwards", possession: "May 2030", bhk: "3 & 4 BHK", badge: "New Launch", img: "images/550-x550pxl-01-cmli0rqmq000mt5ph32qt71fa.webp" },
      { name: "Godrej Majesty", location: "Sector 12, Noida", price: "INR 3.74 Cr. onwards", possession: "Jan 2030", bhk: "3 & 4 BHK", badge: "New Launch", img: "images/5b5f0906-017d-49ff-8ff1-d9f26655bde8.webp" },
      { name: "Godrej Golf Links", location: "Greater Noida, Noida", price: "INR 4.5 Cr. onwards", possession: "Mar 2024", bhk: "3, 3.5, & 4 BHK", badge: "Under Construction", img: "images/godrej-golf-link.webp" },
      { name: "Godrej Nest", location: "Sector 150, Noida", price: "INR 2.90 Cr. onwards", possession: "Sept 2024", bhk: "3 & 4 BHK", badge: "Under Construction", img: "images/d7bda4d4-2307-4594-86ef-f0d50d8d9048.webp" }
    ],
    mumbai: [
      { name: "Godrej Avenue Eleven", location: "Mahalaxmi, Mumbai", price: "Available on Request", possession: "Dec 2028", bhk: "4 BHK", badge: "Under Construction", img: "images/gallery-01-thumb-cmgqga8n1000a4dph1q8v1zi2.webp" },
      { name: "Godrej Five Garden", location: "Matunga, Mumbai", price: "Available on Request", possession: "Dec 2028", bhk: "3 BHK", badge: "Under Construction", img: "images/matunga-thumbnail-550x550-cmf6iixr70009h3phbiv0dwig.webp" },
      { name: "Godrej Exquisite", location: "Thane , Mumbai", price: "INR 2.35 Cr. onwards", possession: "Sep 2026", bhk: "3 BHK", badge: "Under Construction", img: "images/9142c7e4-3c14-4d83-ac9b-d18aa9717839.webp" },
      { name: "Godrej Horizon", location: "Dadar - Wadala, Mumbai", price: "INR 5.67 Cr. onwards", possession: "june 2027", bhk: "3 BHK", badge: "Under Construction", img: "images/740b4f4c-2297-4f33-87a2-3eda7af4711d.webp" }
    ],
    hyderabad: [
      { name: "Godrej Regal Pavilion", location: "Rajendra Nagar, Hyderabad", price: "INR 1.99 Cr. onwards", possession: "July 2030", bhk: "3 & 4 BHK", badge: "New Launch", img: "images/thumbnail-image-550-x-550-cmeb44mnj0015c8ph41rz3y75.webp" },
      { name: "Godrej Madison Avenue", location: "Kokapet, Hyderabad", price: "INR 2.99 Cr. onwards", possession: "Dec, 2029", bhk: "3 & 4+ BHK", badge: "Under Construction", img: "images/78ec9673-b486-41d2-821c-aaf9db9068b6.webp" },

    ],
    bangalore: [
      { name: "Godrej Aveline", location: "Yelahanka, Bengaluru", price: "INR 2.53 Cr. onwards", possession: "March 2031", bhk: "3, 3.5 & 4.5 BHK", badge: "New Launch", img: "images/aveline-landing-page-final-550-x-550-project-thumbnail-image-cmmoklhge000qv9phgsrt26nt.webp" },
      { name: "Godrej Parkshire", location: "Whitefield- Hoskote​, Bengaluru", price: "INR 1.18 Cr. onwards", possession: "Dec 2030", bhk: "2 & 3 BHK", badge: "New Launch", img: "images/banner-section-550x550-cml7n8sp3000axbor6qdx1rzq-cmlj2m3km000zt5ph8d0j1m7v.webp" },
      { name: "Godrej Woods", location: "THANISANDRA, Bengaluru", price: "INR 1.60 Cr. onwards", possession: "Nov 2030", bhk: "2 & 3 BHK", badge: "New Launch", img: "images/5-cmhlt0fcs0029g3j5f6ji4f9x-cmimy7o9j000gnaph6e3ceksv.webp" },
      { name: "Godrej Tiara", location: "Yeshwanthpur, Bangalore", price: "INR 5.99 Cr. onwards", possession: "May 2030", bhk: "4.5 BHK", badge: "New Launch", img: "images/6b5d387b-d3e0-440d-8ffa-2ea54780551f.webp" }
    ],
    ahmedabad: [
      { name: "Celeste At Godrej Garden City", location: "Godrej Garden City, Ahmedabad", price: "INR 61 L. onwards", possession: "March 2027", bhk: "2 & 3 BHK", badge: "Under Construction", img: "images/ahemdabad.webp" },

    ],
    pune: [
      { name: "Godrej Rejuve", location: "Keshavnagar, Pune", price: "INR 65.74 L. onwards", possession: "Jan 2023", bhk: "2 BHK", badge: "Possession Ready", img: "images/rejuve.webp" },
      { name: "The Gale at Godrej Park World", location: "Hinjawadi Phase 1, Pune", price: "INR 1.09 Cr. onwards", possession: "Mar 2029", bhk: "2 & 3 BHK", badge: "New Launch", img: "images/26c9eaa7-ea55-4cac-8865-090f481a36c3.webp" },
      { name: "Godrej Ivara", location: "Kharadi, Pune", price: "INR 1.25 cr. onwards", possession: "Aug 2032", bhk: "2, 3 & 4 BHK", badge: "New Launch", img: "images/1-elevation-view-cmlz308qv000i0wor1ftgevmg-cmmd38ceg0040cdph88ddfxy8.webp" },
      { name: "Godrej Evergreen Square", location: "Hinjawadi Phase 3, Pune", price: "INR 89.99 L. onwards", possession: "Oct 2030", bhk: "2 & 3 BHK", badge: "New Launch", img: "images/3a5b0678-6b91-46c0-adbb-843aa60303f3.webp" }
    ],
    kolkata: [
      { name: "Godrej Zen Estate", location: "Off-Diamond Harbour Road, Kolkata", price: "INR 45 L. onwards", possession: "Jun 2027", bhk: "Plots", badge: "New Launch", img: "images/fcd3a1a4-2918-463a-8141-bff4fa4a4a24.webp" },
      { name: "Godrej Prakriti", location: "Sodepur, Kolkata", price: "INR 59 L. onwards", possession: "Jan 2026", bhk: "2 & 3 BHK", badge: "Under Construction", img: "images/e7c1a4f6-9187-42b7-a866-d5d8540561ae.webp" },
      { name: "Godrej Blue", location: "BL Saha Road, New Alipore, Kolkata", price: "INR 2.49 cr. onwards", possession: "Sep 2029", bhk: "3 & 4 BHK", badge: "New Launch", img: "images/d2c408b7-90d4-467c-9cad-a6affd72e95a.webp" },
      { name: "Elevate at Godrej Se7en", location: "Joka, Kolkata", price: "INR 56 L. onwards", possession: "Dec 2028", bhk: "2 & 3 BHK", badge: "Under Construction", img: "images/dc0204a4-87cc-43b1-a775-b2b352433436.webp" }
    ]
  };

  // City display names mapping
  const cityNames = { delhi: "Delhi", gurgaon: "Gurgaon", noida: "Noida", mumbai: "Mumbai", hyderabad: "Hyderabad", bangalore: "Bangalore", ahmedabad: "Ahmedabad", pune: "Pune", kolkata: "Kolkata" };

  const populateListings = (city) => {
    if (!listingsGrid || !listingsTitle) return;
    const data = propertyData[city] || [];
    listingsTitle.textContent = `${cityNames[city]} Properties`;

    listingsGrid.innerHTML = data.map(prop => `
      <div class="listing-card">
        <div class="listing-img-wrap">
          <img src="${prop.img}" alt="${prop.name}" class="listing-img">
          <div class="listing-img-overlay">
            <span class="listing-location">${prop.location}</span>
            <button class="listing-plus-btn nri-trigger" title="NRI Exclusive Payment Plan">+</button>
          </div>
        </div>
        <div class="listing-info">
          <h3 class="listing-name">${prop.name}</h3>
          <div class="listing-badge">
            <span class="badge-dot"></span>
            ${prop.badge}
          </div>
          <div class="listing-meta">
            <span class="listing-price">${prop.price}</span>
            <span class="listing-divider">|</span>
            <span class="listing-possession"><strong>Possession Date</strong> ${prop.possession}</span>
          </div>
          <p class="listing-bhk">${prop.bhk}</p>
        </div>
      </div>
    `).join('');

    document.querySelectorAll('.nri-trigger').forEach(btn => {
      btn.addEventListener('click', openVipModal);
    });
  };

  const scrollToListings = (city) => {
    const wasOpen = listingsSection?.classList.contains("is-open");
    openListingsSection();
    if (city) populateListings(city);
    if (listingsSection) {
      const scroll = () => {
        const headerOffset = 80;
        const top = listingsSection.getBoundingClientRect().top + window.scrollY - headerOffset;
        window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
      };
      if (wasOpen) scroll();
      else requestAnimationFrame(() => requestAnimationFrame(scroll));
    }
  };

  window.scrollToListings = scrollToListings;

  const updateHeroBanner = (index) => {
    const slide = heroSlides[index];
    if (!slide) return;
    const project = slide.dataset.project || "";
    const cityName = slide.dataset.cityName || "";
    const city = slide.dataset.city || "";
    const desc = slide.dataset.desc || "";
    if (heroSlideLabel) heroSlideLabel.textContent = cityName;
    if (heroSlideTitle) heroSlideTitle.textContent = project;
    if (heroSlideDesc) heroSlideDesc.textContent = desc;
    if (heroExploreBtn) {
      heroExploreBtn.innerHTML = `Explore ${cityName} <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>`;
    }
    if (heroSlideCount) {
      const total = String(heroSlides.length).padStart(2, "0");
      const current = String(index + 1).padStart(2, "0");
      heroSlideCount.textContent = `${current} / ${total}`;
    }
    if (heroProgressFill && heroSlides.length) {
      heroProgressFill.style.width = `${((index + 1) / heroSlides.length) * 100}%`;
    }
  };

  const goToSlide = (index) => {
    heroSlides.forEach(s => s.classList.remove("active"));

    currentSlide = index;
    if (heroSlides[currentSlide]) heroSlides[currentSlide].classList.add("active");
    updateHeroBanner(currentSlide);
  };

  const nextSlide = () => {
    let next = currentSlide + 1;
    if (next >= heroSlides.length) next = 0;
    goToSlide(next);
  };

  const prevSlide = () => {
    let prev = currentSlide - 1;
    if (prev < 0) prev = heroSlides.length - 1;
    goToSlide(prev);
  };

  const startAutoPlay = () => {
    slideInterval = setInterval(nextSlide, 6000);
  };

  const resetAutoPlay = () => {
    clearInterval(slideInterval);
    startAutoPlay();
  };

  btnNext?.addEventListener("click", () => { nextSlide(); resetAutoPlay(); });
  btnPrev?.addEventListener("click", () => { prevSlide(); resetAutoPlay(); });

  heroExploreBtn?.addEventListener("click", () => {
    const city = heroSlides[currentSlide]?.dataset.city;
    scrollToListings(city);
  });

  const initHeroExpos = () => {
    const track = document.getElementById("hero-expos-track");
    const dotsWrap = document.getElementById("hero-expos-dots");
    const btnPrev = document.getElementById("hero-expo-prev");
    const btnNext = document.getElementById("hero-expo-next");

    if (!track) return;

    track.innerHTML = HERO_EXPO_KEYS.map((key) => {
      const expo = EXPO_BY_KEY[key];
      if (!expo) return "";

      const ctaLabel = expo.comingSoon ? "Coming Soon" : "Book VIP Pass";

      return `
        <article class="hero-expo-card${expo.comingSoon ? " is-soon" : ""}" data-expo="${key}">
          <span class="hero-expo-tag">${expo.visitcountry}</span>
          <h3 class="hero-expo-title">${expo.eventValue.replace(" (Godrej)", "")}</h3>
          <ul class="hero-expo-meta">
            <li class="hero-expo-date">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              ${expo.dateBanner}
            </li>
            <li class="hero-expo-venue">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              ${expo.venue}
            </li>
          </ul>
          <button type="button" class="hero-expo-cta" data-expo="${key}">${ctaLabel}</button>
        </article>
      `;
    }).join("");

    const cards = track.querySelectorAll(".hero-expo-card");
    let currentIndex = 0;

    const buildDots = () => {
      if (!dotsWrap) return;
      dotsWrap.innerHTML = "";
      cards.forEach((_, index) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = `hero-expo-dot${index === currentIndex ? " active" : ""}`;
        dot.setAttribute("aria-label", `Show expo ${index + 1}`);
        dot.addEventListener("click", () => {
          currentIndex = index;
          updateSlider();
        });
        dotsWrap.appendChild(dot);
      });
    };

    const updateSlider = () => {
      const gap = parseFloat(getComputedStyle(track).gap) || 12;
      const cardWidth = cards[0]?.offsetWidth + gap || 0;
      track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
      btnPrev?.toggleAttribute("disabled", currentIndex === 0);
      btnNext?.toggleAttribute("disabled", currentIndex >= cards.length - 1);
      dotsWrap?.querySelectorAll(".hero-expo-dot").forEach((dot, index) => {
        dot.classList.toggle("active", index === currentIndex);
      });
    };

    btnPrev?.addEventListener("click", () => {
      if (currentIndex > 0) {
        currentIndex -= 1;
        updateSlider();
      }
    });

    btnNext?.addEventListener("click", () => {
      if (currentIndex < cards.length - 1) {
        currentIndex += 1;
        updateSlider();
      }
    });

    track.querySelectorAll(".hero-expo-cta").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        openVipModal(btn.dataset.expo);
      });
    });

    window.addEventListener("resize", updateSlider);
    buildDots();
    updateSlider();

    let expoInterval = setInterval(() => {
      currentIndex = currentIndex < cards.length - 1 ? currentIndex + 1 : 0;
      updateSlider();
    }, 7000);

    track.addEventListener("mouseenter", () => clearInterval(expoInterval));
    track.addEventListener("mouseleave", () => {
      expoInterval = setInterval(() => {
        currentIndex = currentIndex < cards.length - 1 ? currentIndex + 1 : 0;
        updateSlider();
      }, 7000);
    });
  };

  initHeroExpos();

  // Init
  if (heroSlides.length > 0) {
    updateHeroBanner(currentSlide);
    window.addEventListener('load', function () {
      setTimeout(startAutoPlay, 2000);
    });

  }

  // --- Featured Destinations ---
  const fdTrackWrap = document.querySelector(".fd-track-wrap");
  const fdTrack = document.getElementById("fd-track");
  const fdCards = document.querySelectorAll(".fd-card");
  const fdPrev = document.getElementById("fd-prev");
  const fdNext = document.getElementById("fd-next");

  const fillDestinationMedia = () => {
    document.querySelectorAll(".fd-thumb-row").forEach((row) => {
      const city = row.dataset.city;
      const projects = (propertyData[city] || []).slice(0, 3);
      row.innerHTML = projects.map((p) =>
        `<img src="${p.img}" alt="" class="fd-thumb" loading="lazy">`
      ).join("") + `<button type="button" class="fd-thumb-more" data-city="${city}" aria-label="View more">+</button>`;
    });

    document.querySelectorAll(".fd-highlight-grid").forEach((grid) => {
      const city = grid.dataset.city;
      const projects = (propertyData[city] || []).slice(0, 3);
      grid.innerHTML = projects.map((p) => `
        <div class="fd-highlight-item">
          <img src="${p.img}" alt="${p.name}" loading="lazy">
          <span class="fd-highlight-name">${p.name}</span>
          <span class="fd-highlight-loc">${p.location}</span>
        </div>
      `).join("");
    });
  };

  const scrollFdToCard = (card, smooth = true) => {
    if (!fdTrackWrap || !card) return;
    const wrapRect = fdTrackWrap.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();
    const target = fdTrackWrap.scrollLeft + (cardRect.left - wrapRect.left) - (wrapRect.width - cardRect.width) / 2;
    fdTrackWrap.scrollTo({ left: Math.max(0, target), behavior: smooth ? "smooth" : "auto" });
  };

  const setActiveDestination = (card, smooth = true) => {
    if (!card) return;
    fdCards.forEach((c) => c.classList.toggle("is-active", c === card));
    scrollFdToCard(card, smooth);
  };

  const getFdCardIndex = () => {
    const active = fdTrack?.querySelector(".fd-card.is-active");
    return active ? [...fdCards].indexOf(active) : 0;
  };

  const syncActiveFromScroll = () => {
    if (!fdTrackWrap || !fdCards.length) return;
    const center = fdTrackWrap.scrollLeft + fdTrackWrap.clientWidth / 2;
    let closest = fdCards[0];
    let minDist = Infinity;

    fdCards.forEach((card) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const dist = Math.abs(center - cardCenter);
      if (dist < minDist) {
        minDist = dist;
        closest = card;
      }
    });

    fdCards.forEach((c) => c.classList.toggle("is-active", c === closest));
  };

  let fdTouchStartX = 0;
  let fdTouchStartY = 0;
  let fdDidSwipe = false;
  let fdScrollSyncTimer;

  fdTrackWrap?.addEventListener("touchstart", (e) => {
    fdTouchStartX = e.touches[0].clientX;
    fdTouchStartY = e.touches[0].clientY;
    fdDidSwipe = false;
  }, { passive: true });

  fdTrackWrap?.addEventListener("touchmove", (e) => {
    const dx = Math.abs(e.touches[0].clientX - fdTouchStartX);
    const dy = Math.abs(e.touches[0].clientY - fdTouchStartY);
    if (dx > dy && dx > 8) fdDidSwipe = true;
  }, { passive: true });

  fdTrackWrap?.addEventListener("scroll", () => {
    clearTimeout(fdScrollSyncTimer);
    fdScrollSyncTimer = setTimeout(syncActiveFromScroll, 100);
  }, { passive: true });

  let fdDragPointerId = null;
  let fdDragStartX = 0;
  let fdDragScrollLeft = 0;

  fdTrackWrap?.addEventListener("pointerdown", (e) => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    if (e.target.closest(".fd-explore-mini, .fd-explore-all, .fd-thumb-more")) return;
    fdDragPointerId = e.pointerId;
    fdDragStartX = e.clientX;
    fdDragScrollLeft = fdTrackWrap.scrollLeft;
    fdTrackWrap.classList.add("is-dragging");
    fdTrackWrap.setPointerCapture?.(e.pointerId);
  });

  fdTrackWrap?.addEventListener("pointermove", (e) => {
    if (e.pointerType !== "mouse" || fdDragPointerId !== e.pointerId) return;
    const dx = e.clientX - fdDragStartX;
    if (Math.abs(dx) > 5) fdDidSwipe = true;
    fdTrackWrap.scrollLeft = fdDragScrollLeft - dx;
  });

  const endFdDrag = (e) => {
    if (e.pointerType !== "mouse" || fdDragPointerId !== e.pointerId) return;
    fdDragPointerId = null;
    fdTrackWrap.classList.remove("is-dragging");
    fdTrackWrap.releasePointerCapture?.(e.pointerId);
    syncActiveFromScroll();
    scrollFdToCard(fdTrack?.querySelector(".fd-card.is-active"), true);
  };

  fdTrackWrap?.addEventListener("pointerup", endFdDrag);
  fdTrackWrap?.addEventListener("pointercancel", endFdDrag);

  fdCards.forEach((card) => {
    card.addEventListener("click", (e) => {
      if (fdDidSwipe) {
        fdDidSwipe = false;
        return;
      }
      if (e.target.closest(".fd-explore-mini, .fd-explore-all, .fd-thumb-more")) return;
      setActiveDestination(card);
    });
  });

  document.querySelectorAll(".fd-explore-mini, .fd-explore-all").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      scrollToListings(btn.dataset.city);
    });
  });

  fdTrack?.addEventListener("click", (e) => {
    const more = e.target.closest(".fd-thumb-more");
    if (more) {
      e.stopPropagation();
      scrollToListings(more.dataset.city);
    }
  });

  fdPrev?.addEventListener("click", () => {
    const idx = getFdCardIndex();
    const prevIdx = idx > 0 ? idx - 1 : fdCards.length - 1;
    setActiveDestination(fdCards[prevIdx]);
  });

  fdNext?.addEventListener("click", () => {
    const idx = getFdCardIndex();
    const nextIdx = idx < fdCards.length - 1 ? idx + 1 : 0;
    setActiveDestination(fdCards[nextIdx]);
  });

  if (fdCards.length) {
    fillDestinationMedia();
    requestAnimationFrame(() => {
      const active = fdTrack?.querySelector(".fd-card.is-active");
      if (active) scrollFdToCard(active, false);
    });
  }

  // --- Awards Slider ---
  const initAwardsSlider = () => {
    const track = document.getElementById("awards-track");
    const cards = document.querySelectorAll(".award-card");
    const dots = document.querySelectorAll(".award-dot");
    const btnPrev = document.getElementById("awards-prev");
    const btnNext = document.getElementById("awards-next");
    const container = document.querySelector(".awards-track-container");

    if (!track || !cards.length || !container) return;

    let currentIndex = 0;

    const getVisibleCount = () => {
      if (window.innerWidth <= 768) return 1;
      if (window.innerWidth <= 1024) return 2;
      return 3;
    };

    const getMaxIndex = () => Math.max(0, cards.length - getVisibleCount());

    const updateSlider = () => {
      const gap = parseFloat(getComputedStyle(track).gap) || 20;
      const cardWidth = cards[0].offsetWidth + gap;
      const maxIndex = getMaxIndex();
      if (currentIndex > maxIndex) currentIndex = maxIndex;
      track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;

      dots.forEach((dot, index) => {
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

    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        currentIndex = Math.min(index, getMaxIndex());
        updateSlider();
      });
    });

    window.addEventListener("resize", updateSlider);
    updateSlider();
  };
  initAwardsSlider();

  // --- Featured Projects Showcase ---
  const initFeaturedProjects = () => {
    const mediaCurrent = document.getElementById("fp-media-current");
    const mediaNext = document.getElementById("fp-media-next");
    const captionEl = document.getElementById("fp-caption");
    const dotsEl = document.getElementById("fp-dots");
    const counterEl = document.getElementById("fp-pager-count");
    const btnPrev = document.getElementById("featured-prev");
    const btnNext = document.getElementById("featured-next");

    if (!mediaCurrent || !mediaNext || !captionEl) return;

    const projects = [
      {
        name: "Godrej Aveline",
        location: "Bengaluru",
        cityKey: "bangalore",
        heroImg: "images/2026-01-30.webp",
        chip: "3 & 4 BHK"
      },
      {
        name: "Godrej Trilogy",
        location: "Worli, Mumbai",
        cityKey: "mumbai",
        heroImg: "images/worli-banner-desktop-v1-cmhx0xuc90000j2phgabi18bx.webp",
        chip: "Sea-facing residences"
      },
      {
        name: "Godrej Connaught One",
        location: "Connaught Place, Delhi",
        cityKey: "delhi",
        heroImg: "images/5436aa76-67c7-4e2d-afb8-8fe3a667a370.webp",
        chip: "3 BHK"
      },
      {
        name: "Godrej Regal Pavilion",
        location: "Hyderabad",
        cityKey: "hyderabad",
        heroImg: "images/desktop-banner-image-cmeb411vn0011c8ph267tajv0.webp",
        chip: "3 & 4 BHK"
      }
    ];

    let fpIndex = 0;
    let isAnimating = false;

    const setMediaLayer = (layer, img) => {
      layer.style.backgroundImage = `url('${img}')`;
    };

    const renderCaption = (p) => {
      captionEl.innerHTML = `
        <span class="fp-caption-index" aria-hidden="true">${String(fpIndex + 1).padStart(2, "0")}</span>
        <div class="fp-caption-body">
          <h3 class="fp-caption-name">${p.name}</h3>
          <p class="fp-caption-loc">${p.location}</p>
          <span class="fp-caption-chip">${p.chip}</span>
        </div>
        <button type="button" class="fp-caption-explore" data-city="${p.cityKey}">
          Explore
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
        </button>
      `;

      captionEl.querySelector(".fp-caption-explore")?.addEventListener("click", () => {
        scrollToListings(p.cityKey);
      });
    };

    const updateDots = () => {
      if (!dotsEl) return;
      dotsEl.innerHTML = projects.map((_, i) => `
        <button type="button" class="fp-dot${i === fpIndex ? " is-active" : ""}" data-index="${i}" role="tab" aria-selected="${i === fpIndex}" aria-label="Project ${i + 1}"></button>
      `).join("");

      dotsEl.querySelectorAll(".fp-dot").forEach((dot) => {
        dot.addEventListener("click", () => {
          const idx = Number(dot.dataset.index);
          if (!Number.isNaN(idx) && idx !== fpIndex) goToProject(idx);
        });
      });
    };

    const updateCounter = () => {
      if (!counterEl) return;
      const total = String(projects.length).padStart(2, "0");
      const current = String(fpIndex + 1).padStart(2, "0");
      counterEl.textContent = `${current} / ${total}`;
    };

    const goToProject = (index) => {
      if (isAnimating || index === fpIndex) return;
      isAnimating = true;

      const nextProject = projects[index];
      setMediaLayer(mediaNext, nextProject.heroImg);
      mediaNext.classList.add("is-entering");
      captionEl.classList.remove("is-visible");

      window.setTimeout(() => {
        setMediaLayer(mediaCurrent, nextProject.heroImg);
        mediaNext.classList.remove("is-entering");
        mediaCurrent.classList.remove("fp-media-layer--current");
        void mediaCurrent.offsetWidth;
        mediaCurrent.classList.add("fp-media-layer--current");
        fpIndex = index;
        renderCaption(nextProject);
        updateCounter();
        updateDots();
        captionEl.classList.add("is-visible");
        isAnimating = false;
      }, 650);
    };

    const stepProject = (dir) => {
      goToProject((fpIndex + dir + projects.length) % projects.length);
    };

    btnNext?.addEventListener("click", () => stepProject(1));
    btnPrev?.addEventListener("click", () => stepProject(-1));

    setMediaLayer(mediaCurrent, projects[0].heroImg);
    renderCaption(projects[0]);
    updateCounter();
    updateDots();
    requestAnimationFrame(() => captionEl.classList.add("is-visible"));
  };

  initFeaturedProjects();

  // --- Lifestyle Explorer ---
  const initLifestyleSection = () => {
    const prefs = document.querySelectorAll(".lifestyle-pref");
    const countEl = document.getElementById("lifestyle-pref-count");
    const subEl = document.getElementById("lifestyle-pref-sub");
    const exploreBtn = document.getElementById("lifestyle-explore-btn");

    if (!prefs.length) return;

    const prefCityMap = {
      "green-spaces": "bangalore",
      "work-hubs": "mumbai",
      connectivity: "pune",
      education: "delhi",
      retail: "hyderabad",
      healthcare: "gurgaon"
    };

    const updateStatus = () => {
      const selected = [...prefs].filter((btn) => btn.classList.contains("is-selected"));
      const count = selected.length;
      const badgeCount = document.getElementById("lifestyle-badge-count");

      if (badgeCount) badgeCount.textContent = String(count);

      if (countEl) {
        countEl.textContent = count === 0
          ? "No Preferences Selected"
          : `${count} Preference${count !== 1 ? "s" : ""} Selected`;
      }

      if (subEl) {
        subEl.textContent = count === 0
          ? "Select preferences to find matching homes"
          : "Showing homes that match your lifestyle";
      }
    };

    prefs.forEach((btn) => {
      btn.addEventListener("click", () => {
        const isSelected = btn.classList.toggle("is-selected");
        btn.setAttribute("aria-pressed", isSelected ? "true" : "false");
        updateStatus();
      });
    });

    exploreBtn?.addEventListener("click", () => {
      const selected = [...prefs].filter((btn) => btn.classList.contains("is-selected"));
      const cityKey = selected.length
        ? prefCityMap[selected[0].dataset.pref] || "mumbai"
        : "mumbai";

      scrollToListings(cityKey);
    });

    updateStatus();
  };

  initLifestyleSection();

  // --- The Journey Ahead ---
  const initJourneyAhead = () => {
    const years = document.querySelectorAll(".journey-year");
    const cards = document.querySelectorAll(".journey-card");
    const columnsWrap = document.getElementById("journey-columns-wrap");
    const fill = document.getElementById("journey-timeline-fill");
    if (!years.length || !cards.length) return;

    const isMobileCarousel = () => window.matchMedia("(max-width: 1024px)").matches;

    const scrollToYearCard = (year, smooth = true) => {
      if (!columnsWrap || !isMobileCarousel()) return;
      const card = columnsWrap.querySelector(`.journey-card[data-year="${year}"]`);
      if (!card) return;
      const wrapRect = columnsWrap.getBoundingClientRect();
      const cardRect = card.getBoundingClientRect();
      const target = columnsWrap.scrollLeft + (cardRect.left - wrapRect.left) - (wrapRect.width - cardRect.width) / 2;
      columnsWrap.scrollTo({ left: Math.max(0, target), behavior: smooth ? "smooth" : "auto" });
    };

    const setYear = (year, { smooth = true, scroll = true } = {}) => {
      years.forEach((btn, i) => {
        const isActive = btn.dataset.year === year;
        btn.classList.toggle("is-active", isActive);
        btn.setAttribute("aria-selected", isActive ? "true" : "false");
        if (isActive && fill) fill.style.width = `${((i + 1) / years.length) * 100}%`;
      });
      cards.forEach((card) => {
        card.classList.toggle("is-active", card.dataset.year === year);
      });
      if (scroll) scrollToYearCard(year, smooth);
    };

    const syncYearFromScroll = () => {
      if (!columnsWrap || !isMobileCarousel()) return;
      const center = columnsWrap.scrollLeft + columnsWrap.clientWidth / 2;
      let closest = cards[0];
      let minDist = Infinity;

      cards.forEach((card) => {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const dist = Math.abs(center - cardCenter);
        if (dist < minDist) {
          minDist = dist;
          closest = card;
        }
      });

      if (closest?.dataset.year) {
        setYear(closest.dataset.year, { smooth: false, scroll: false });
      }
    };

    let journeyScrollTimer;
    columnsWrap?.addEventListener("scroll", () => {
      clearTimeout(journeyScrollTimer);
      journeyScrollTimer = setTimeout(syncYearFromScroll, 100);
    }, { passive: true });

    years.forEach((btn) => {
      btn.addEventListener("click", () => setYear(btn.dataset.year));
    });

    requestAnimationFrame(() => {
      const active = document.querySelector(".journey-year.is-active");
      if (active) scrollToYearCard(active.dataset.year, false);
    });
  };

  initJourneyAhead();

  const initOurValues = () => {
    const section = document.querySelector(".values-creative");
    if (!section) return;

    const reveal = () => section.classList.add("is-visible");

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              reveal();
              observer.disconnect();
            }
          });
        },
        { threshold: 0.08, rootMargin: "0px 0px -20px 0px" }
      );
      observer.observe(section);
      if (section.getBoundingClientRect().top < window.innerHeight) reveal();
    } else {
      reveal();
    }
  };

  initOurValues();

  // --- Why Invest With Us ---
  const initWhyInvest = () => {
    const section = document.querySelector(".why-invest");
    if (!section) return;

    const reveal = () => section.classList.add("is-visible");

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              reveal();
              observer.disconnect();
            }
          });
        },
        { threshold: 0.15 }
      );
      observer.observe(section);
    } else {
      reveal();
    }
  };

  initWhyInvest();

  // --- Home Blog Journal ---
  const initHomeBlogJournal = () => {
    const section = document.querySelector(".home-blog-journal");
    const filters = document.querySelectorAll(".hbj-filter");
    const cards = document.querySelectorAll(".hbj-card[data-category]");
    if (!section || !filters.length) return;

    const setFilter = (filter) => {
      filters.forEach((btn) => {
        const isActive = btn.dataset.filter === filter;
        btn.classList.toggle("is-active", isActive);
        btn.setAttribute("aria-selected", isActive ? "true" : "false");
      });

      cards.forEach((card) => {
        const cat = card.dataset.category;
        const show = filter === "all" || cat === filter || cat === "all";
        card.classList.toggle("is-hidden", !show);
      });
    };

    filters.forEach((btn) => {
      btn.addEventListener("click", () => setFilter(btn.dataset.filter || "all"));
    });

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              section.classList.add("is-visible");
              observer.disconnect();
            }
          });
        },
        { threshold: 0.08 }
      );
      observer.observe(section);
    }
  };

  initHomeBlogJournal();

  // --- Footer SEO & city links ---
  const initFooterLinks = () => {
    const onHomePage = !!document.querySelector(".snap-container");

    const goToListings = (city) => {
      if (onHomePage) {
        scrollToListings(city || "mumbai");
        return;
      }
      if (city) sessionStorage.setItem("gp-footer-city", city);
      const base = window.location.pathname.includes("/pages/") ? "../index.html" : "index.html";
      window.location.href = `${base}#listings`;
    };

    document.querySelectorAll("[data-footer-city]").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        goToListings(link.dataset.footerCity);
      });
    });

    document.querySelectorAll('a[href$="#listings"]:not([data-footer-city])').forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        goToListings("mumbai");
      });
    });

    if (onHomePage) {
      const savedCity = sessionStorage.getItem("gp-footer-city");
      if (savedCity && window.location.hash === "#listings") {
        sessionStorage.removeItem("gp-footer-city");
        requestAnimationFrame(() => scrollToListings(savedCity));
      }
    }
  };

  initFooterLinks();

  // --- Countdown Timer Logic (only if section exists) ---
  const daysEl = document.getElementById("days");
  if (daysEl) {
    const targetDate = new Date("May 23, 2026 10:00:00").getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(countdownInterval);
        const timerEl = document.getElementById("expo-countdown");
        if (timerEl) timerEl.innerHTML = "<div class='timer-value'>Event Live!</div>";
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      daysEl.textContent = days.toString().padStart(2, "0");
      document.getElementById("hours").textContent = hours.toString().padStart(2, "0");
      document.getElementById("minutes").textContent = minutes.toString().padStart(2, "0");
      document.getElementById("seconds").textContent = seconds.toString().padStart(2, "0");
    };

    const countdownInterval = setInterval(updateCountdown, 1000);
    updateCountdown();
  }

  // --- Premium Invitation Full Container Slider ---
  // --- Independent Dual Slider System ---
  const initIndependentSliders = () => {
    const invTrack = document.getElementById("invitation-track"),
      invSlides = document.querySelectorAll(".invitation-slide"),
      invPrev = document.getElementById("invitation-prev"),
      invNext = document.getElementById("invitation-next");

    const vipTrack = document.getElementById("vip-track"),
      vipSlides = document.querySelectorAll(".vip-slide"),
      vipPrev = document.getElementById("vip-prev"),
      vipNext = document.getElementById("vip-next");

    const tabs = document.querySelectorAll(".city-tab");

    let invIndex = 0;
    let vipIndex = 0;

    const updateTabs = (index) => {
      tabs.forEach((tab, i) => {
        tab.classList.toggle("active", i === index);
      });
    };

    const updateInv = (index) => {
      invIndex = index;
      if (invTrack) invTrack.style.transform = `translateX(-${invIndex * 100}%)`;
      // When invitation moves, optionally sync VIP or just highlight tab
      updateTabs(invIndex);
    };

    const updateVip = (index) => {
      vipIndex = index;
      if (vipTrack) vipTrack.style.transform = `translateX(-${vipIndex * 100}%)`;
      updateTabs(vipIndex);
    };

    const syncBoth = (index) => {
      updateInv(index);
      updateVip(index);
    };

    // Tab Clicks
    tabs.forEach((tab, i) => {
      tab.addEventListener("click", () => syncBoth(i));
    });

    // Invitation Nav
    invNext?.addEventListener("click", () => {
      let next = (invIndex < invSlides.length - 1) ? invIndex + 1 : 0;
      updateInv(next);
    });

    invPrev?.addEventListener("click", () => {
      let prev = (invIndex > 0) ? invIndex - 1 : invSlides.length - 1;
      updateInv(prev);
    });

    // VIP Nav
    vipNext?.addEventListener("click", () => {
      let next = (vipIndex < vipSlides.length - 1) ? vipIndex + 1 : 0;
      updateVip(next);
    });

    vipPrev?.addEventListener("click", () => {
      let prev = (vipIndex > 0) ? vipIndex - 1 : vipSlides.length - 1;
      updateVip(prev);
    });

    // Auto-slide invitations only
    // setInterval(() => {
    //   let next = (invIndex < invSlides.length - 1) ? invIndex + 1 : 0;
    //   updateInv(next);
    // }, 12000);
  };

  // initIndependentSliders();

});

// --- Lightbox Functionality ---
function openLightbox(src) {
  const modal = document.getElementById('image-modal');
  const img = document.getElementById('lightbox-img');
  if (modal && img) {
    img.src = src;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scroll
  }
}

// Global close function
function closeLightbox() {
  const modal = document.getElementById('image-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = ''; // Restore scroll
  }
}

// Close on background click or close button
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('image-modal');
  const closeBtn = document.querySelector('.image-modal-close');

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.classList.contains('image-modal-close')) {
        closeLightbox();
      }
    });
  }

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeLightbox();
      closeEnquireModal();
      closeScheduleTourModal();
    }
  });

  // --- Enquire Now Modal ---
  const enquireModal = document.getElementById("enquire-modal");
  const enquireClose = document.getElementById("enquire-modal-close");
  const enquireForm = document.getElementById("enquire-modal-form");
  const enquireFeedback = document.getElementById("enquire-modal-feedback");
  const enquireCountry = document.getElementById("enquire-country");
  const enquireCountryFlag = document.getElementById("enquire-country-flag");
  const enquirePhoneCode = document.getElementById("enquire-phone-code");
  const enquirePhoneFlag = document.getElementById("enquire-phone-flag");

  const updateEnquireCountryFlag = () => {
    if (!enquireCountry || !enquireCountryFlag) return;
    const flag = enquireCountry.selectedOptions[0]?.dataset.flag || "in";
    enquireCountryFlag.src = `https://flagcdn.com/w40/${flag}.png`;
    enquireCountryFlag.alt = enquireCountry.value;
  };

  const updateEnquirePhoneFlag = () => {
    if (!enquirePhoneCode || !enquirePhoneFlag) return;
    const flag = enquirePhoneCode.selectedOptions[0]?.dataset.flag || "in";
    enquirePhoneFlag.src = `https://flagcdn.com/w40/${flag}.png`;
    enquirePhoneFlag.alt = enquirePhoneCode.selectedOptions[0]?.textContent || "";
  };

  enquireCountry?.addEventListener("change", updateEnquireCountryFlag);
  enquirePhoneCode?.addEventListener("change", updateEnquirePhoneFlag);

  const openEnquireModal = () => {
    if (!enquireModal) return;
    enquireModal.classList.add("active");
    enquireModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  const closeEnquireModal = () => {
    if (!enquireModal) return;
    enquireModal.classList.remove("active");
    enquireModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  window.openEnquireModal = openEnquireModal;

  enquireClose?.addEventListener("click", closeEnquireModal);
  enquireModal?.addEventListener("click", (e) => {
    if (e.target === enquireModal) closeEnquireModal();
  });

  enquireForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const fname = document.getElementById("enquire-fname");
    const lname = document.getElementById("enquire-lname");
    const email = document.getElementById("enquire-email");
    const city = document.getElementById("enquire-city");
    const phone = document.getElementById("enquire-phone");
    const project = document.getElementById("enquire-project");

    if (!fname?.value.trim() || !lname?.value.trim() || !email?.value.trim() || !enquireCountry?.value || !city?.value.trim() || !phone?.value.trim() || !project?.value) {
      if (enquireFeedback) {
        enquireFeedback.hidden = false;
        enquireFeedback.textContent = "Please fill in all required fields.";
      }
      return;
    }

    if (enquireFeedback) {
      enquireFeedback.hidden = false;
      enquireFeedback.textContent = "Thank you! We will get back to you shortly.";
    }
    enquireForm.reset();
    if (document.getElementById("enquire-consent")) {
      document.getElementById("enquire-consent").checked = true;
    }
    updateEnquireCountryFlag();
    updateEnquirePhoneFlag();
    setTimeout(closeEnquireModal, 1800);
  });

  updateEnquireCountryFlag();
  updateEnquirePhoneFlag();

  // --- Schedule a Tour Modal ---
  const scheduleTourModal = document.getElementById("schedule-tour-modal");
  const scheduleTourClose = document.getElementById("schedule-tour-modal-close");
  const scheduleTourForm = document.getElementById("schedule-tour-modal-form");
  const scheduleTourFeedback = document.getElementById("schedule-tour-modal-feedback");
  const scheduleTourPhoneCode = document.getElementById("schedule-tour-phone-code");
  const scheduleTourPhoneFlag = document.getElementById("schedule-tour-phone-flag");
  const scheduleTourDate = document.getElementById("schedule-tour-date");

  const updateScheduleTourPhoneFlag = () => {
    if (!scheduleTourPhoneCode || !scheduleTourPhoneFlag) return;
    const flag = scheduleTourPhoneCode.selectedOptions[0]?.dataset.flag || "in";
    scheduleTourPhoneFlag.src = `https://flagcdn.com/w40/${flag}.png`;
    scheduleTourPhoneFlag.alt = scheduleTourPhoneCode.selectedOptions[0]?.textContent || "";
  };

  scheduleTourPhoneCode?.addEventListener("change", updateScheduleTourPhoneFlag);

  const setDefaultScheduleTourDate = () => {
    if (!scheduleTourDate) return;
    const today = new Date();
    today.setDate(today.getDate() + 1);
    scheduleTourDate.min = today.toISOString().split("T")[0];
    if (!scheduleTourDate.value) {
      scheduleTourDate.value = scheduleTourDate.min;
    }
  };

  const openScheduleTourModal = () => {
    if (!scheduleTourModal) return;
    setDefaultScheduleTourDate();
    scheduleTourModal.classList.add("active");
    scheduleTourModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  const closeScheduleTourModal = () => {
    if (!scheduleTourModal) return;
    scheduleTourModal.classList.remove("active");
    scheduleTourModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  window.openScheduleTourModal = openScheduleTourModal;

  scheduleTourClose?.addEventListener("click", closeScheduleTourModal);
  scheduleTourModal?.addEventListener("click", (e) => {
    if (e.target === scheduleTourModal) closeScheduleTourModal();
  });

  scheduleTourForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const fname = document.getElementById("schedule-tour-fname");
    const lname = document.getElementById("schedule-tour-lname");
    const email = document.getElementById("schedule-tour-email");
    const phone = document.getElementById("schedule-tour-phone");
    const project = document.getElementById("schedule-tour-project");

    if (!fname?.value.trim() || !lname?.value.trim() || !email?.value.trim() || !phone?.value.trim() || !project?.value) {
      if (scheduleTourFeedback) {
        scheduleTourFeedback.hidden = false;
        scheduleTourFeedback.textContent = "Please fill in all required fields.";
      }
      return;
    }

    if (scheduleTourFeedback) {
      scheduleTourFeedback.hidden = false;
      scheduleTourFeedback.textContent = "Thank you! Your site visit has been scheduled. We will get back to you shortly.";
    }
    scheduleTourForm.reset();
    if (document.getElementById("schedule-tour-consent")) {
      document.getElementById("schedule-tour-consent").checked = true;
    }
    updateScheduleTourPhoneFlag();
    setDefaultScheduleTourDate();
    setTimeout(closeScheduleTourModal, 1800);
  });

  updateScheduleTourPhoneFlag();
  setDefaultScheduleTourDate();
});


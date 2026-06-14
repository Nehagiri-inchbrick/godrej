const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Fix action section
html = html.replace(
`      <div class="premium-main-dots"></div>
    </div>
  </section>

  <section class="awards-section" id="awards">
    <div class="awards-container">
      <div class="action-header">`,
`      <div class="action-overlay"></div>
    </div>

    <div class="action-container">
      <div class="action-header">`
);

// Define the split layout HTML
const splitLayout = `    <div class="invitation-split-layout">
      <!-- Left Side: Invitation -->
      <div class="invitation-half">
        <h3 class="half-title">Invitation</h3>
        <div class="half-tabs-container">
          <div class="invitation-tabs">
            <button class="invitation-tab half-tab-invitation active" data-index="0">Australia</button>
            <button class="invitation-tab half-tab-invitation" data-index="1">Dubai</button>
          </div>
        </div>

        <div class="premium-main-slider-wrap">
          <div class="premium-main-track" id="track-invitation">
            <!-- Slide 0: Australia Invitation -->
            <div class="premium-main-slide">
              <div class="premium-container single-card-container">
                <div class="premium-card general">
                  <div class="premium-card-header">
                    <div class="label-with-stars">
                      <span class="star">✦</span>
                      <span class="card-label">VIP INVITATION - PERTH</span>
                      <span class="star">✦</span>
                    </div>
                    <p class="card-subtitle">We cordially invite you to the India Property Expo in Perth, Australia.
                      Experience exclusive real estate opportunities.</p>
                    <div class="date-capsule">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                      <span>16th & 17th May, 2026</span>
                    </div>
                  </div>
                  <div class="premium-card-body">
                    <div class="podium-view" onclick="openLightbox('invitation card Australia.png')">
                      <div class="podium-base"></div>
                      <div class="podium-glow"></div>
                      <img src="invitation card Australia.png" loading="lazy" decoding="async" width="600" height="400"
                        alt="Godrej Properties Expo Perth 2026 VIP Invitation" class="floating-pass">
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Slide 1: Dubai Invitation -->
            <div class="premium-main-slide">
              <div class="premium-container single-card-container">
                <div class="premium-card general">
                  <div class="premium-card-header">
                    <div class="label-with-stars">
                      <span class="star">✦</span>
                      <span class="card-label">VIP INVITATION - DUBAI</span>
                      <span class="star">✦</span>
                    </div>
                    <p class="card-subtitle">We cordially invite you to the India Property Expo in Dubai, UAE. Discover
                      premium investment opportunities across India.</p>
                    <div class="date-capsule">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                      <span>23rd & 24th May, 2026</span>
                    </div>
                  </div>
                  <div class="premium-card-body">
                    <div class="podium-view" onclick="openLightbox('images/invitation card Dubai.png')">
                      <div class="podium-base"></div>
                      <div class="podium-glow"></div>
                      <img src="images/invitation card Dubai.png" loading="lazy" decoding="async" width="600" height="400"
                        alt="Godrej Properties Expo Dubai 2026 VIP Invitation" class="floating-pass">
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Side: VIP Pass -->
      <div class="invitation-half">
        <h3 class="half-title">VIP Pass</h3>
        <div class="half-tabs-container">
          <div class="invitation-tabs">
            <button class="invitation-tab half-tab-vip active" data-index="0">Australia</button>
            <button class="invitation-tab half-tab-vip" data-index="1">Dubai</button>
          </div>
        </div>

        <div class="premium-main-slider-wrap">
          <div class="premium-main-track" id="track-vip">
            <!-- Slide 0: Australia VIP -->
            <div class="premium-main-slide">
              <div class="premium-container single-card-container">
                <div class="premium-card vip">
                  <div class="premium-card-header">
                    <div class="label-with-stars">
                      <span class="star">✦</span>
                      <span class="card-label gold">PREMIUM ACCESS</span>
                      <span class="star">✦</span>
                    </div>
                    <h2 class="card-main-title">Exclusive VIP Entry</h2>
                    <div class="title-divider">
                      <span class="divider-line"></span>
                      <span class="divider-icon gold">❦</span>
                      <span class="divider-line"></span>
                    </div>
                    <p class="card-subtitle">Reserved for qualified buyers in Perth. Explore the finest real estate with
                      expert assistance and high-growth potential.</p>
                    <div class="icon-highlights">
                      <div class="highlight-item">
                        <div class="highlight-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4H6z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg></div>
                        <span>EXCLUSIVE</span>
                      </div>
                      <div class="highlight-item">
                        <div class="highlight-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg></div>
                        <span>ADVISORY</span>
                      </div>
                      <div class="highlight-item">
                        <div class="highlight-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg></div>
                        <span>FLEXIBLE</span>
                      </div>
                      <div class="highlight-item">
                        <div class="highlight-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg></div>
                        <span>GROWTH</span>
                      </div>
                    </div>
                  </div>
                  <div class="premium-card-body">
                    <div class="podium-view" onclick="openLightbox('VIP PASS 2026 Australia.png')">
                      <div class="podium-base"></div>
                      <div class="podium-glow gold"></div>
                      <img src="VIP PASS 2026 Australia.png" loading="lazy" decoding="async" width="600" height="400"
                        alt="Godrej Properties Perth VIP Pass 2026" class="floating-pass horizontal">
                    </div>
                  </div>
                  <div class="premium-card-footer">
                    <button class="register-cta" onclick="document.getElementById('vip-modal').classList.add('active')">
                      DOWNLOAD PERTH VIP PASS &rarr;
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Slide 1: Dubai VIP -->
            <div class="premium-main-slide">
              <div class="premium-container single-card-container">
                <div class="premium-card vip">
                  <div class="premium-card-header">
                    <div class="label-with-stars">
                      <span class="star">✦</span>
                      <span class="card-label gold">PREMIUM ACCESS</span>
                      <span class="star">✦</span>
                    </div>
                    <h2 class="card-main-title">Exclusive VIP Entry</h2>
                    <div class="title-divider">
                      <span class="divider-line"></span>
                      <span class="divider-icon gold">❦</span>
                      <span class="divider-line"></span>
                    </div>
                    <p class="card-subtitle">Reserved for qualified buyers in Dubai. Explore the finest real estate with
                      expert assistance and high-growth potential.</p>
                    <div class="icon-highlights">
                      <div class="highlight-item">
                        <div class="highlight-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4H6z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg></div>
                        <span>EXCLUSIVE</span>
                      </div>
                      <div class="highlight-item">
                        <div class="highlight-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg></div>
                        <span>ADVISORY</span>
                      </div>
                      <div class="highlight-item">
                        <div class="highlight-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg></div>
                        <span>FLEXIBLE</span>
                      </div>
                      <div class="highlight-item">
                        <div class="highlight-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg></div>
                        <span>GROWTH</span>
                      </div>
                    </div>
                  </div>
                  <div class="premium-card-body">
                    <div class="podium-view" onclick="openLightbox('VIP PASS 2026 Dubai.png')">
                      <div class="podium-base"></div>
                      <div class="podium-glow gold"></div>
                      <img src="images/VIP PASS 2026 Dubai With logo.png" loading="lazy" decoding="async" width="600"
                        height="400" alt="Godrej Properties Dubai VIP Pass 2026" class="floating-pass horizontal">
                    </div>
                  </div>
                  <div class="premium-card-footer">
                    <button class="register-cta" onclick="document.getElementById('vip-modal').classList.add('active')">
                      DOWNLOAD DUBAI VIP PASS &rarr;
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="awards-section" id="awards">`;

// Insert the split layout after invitation-header-divider and before awards-container
html = html.replace(
`      <div class="invitation-header-divider"></div>
    </div>

    <div class="awards-container">`,
`      <div class="invitation-header-divider"></div>
    </div>

${splitLayout}
    <div class="awards-container">`
);

fs.writeFileSync('index.html', html);
console.log('Fixed index.html');

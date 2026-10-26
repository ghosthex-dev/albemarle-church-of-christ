/**
 * Albemarle Church of Christ - Modern Frontend Application Script
 * Features: Accessibility controls, Next Service Countdown, Interactive Audio Player,
 * Sermon Filtering, iCalendar (.ics) generation, Contact validation, and Guestbook.
 */

document.addEventListener('DOMContentLoaded', () => {
  initAccessibility();
  initMobileMenu();
  initServiceCountdown();
  initSermonPlayer();
  initGuestbook();
  initContactForm();
});

/* ==========================================================================
   1. Accessibility System (Font Scaling & High Contrast)
   ========================================================================== */
function initAccessibility() {
  const html = document.documentElement;
  const currentScale = localStorage.getItem('coc_font_scale') || 'md';
  const highContrast = localStorage.getItem('coc_high_contrast') === 'true';

  setFontScale(currentScale);
  if (highContrast) {
    html.classList.add('high-contrast');
    updateContrastButtons(true);
  }

  // Bind Scale Buttons
  document.querySelectorAll('[data-font-scale]').forEach(btn => {
    btn.addEventListener('click', () => {
      const scale = btn.getAttribute('data-font-scale');
      setFontScale(scale);
      localStorage.setItem('coc_font_scale', scale);
    });
  });

  // Bind High Contrast Toggle
  const contrastToggles = document.querySelectorAll('[data-contrast-toggle]');
  contrastToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const isHc = html.classList.toggle('high-contrast');
      localStorage.setItem('coc_high_contrast', isHc);
      updateContrastButtons(isHc);
    });
  });
}

function setFontScale(scale) {
  const html = document.documentElement;
  html.classList.remove('font-scale-sm', 'font-scale-md', 'font-scale-lg', 'font-scale-xl');
  html.classList.add(`font-scale-${scale}`);

  document.querySelectorAll('[data-font-scale]').forEach(btn => {
    const active = btn.getAttribute('data-font-scale') === scale;
    btn.classList.toggle('bg-amber-600', active);
    btn.classList.toggle('text-white', active);
    btn.classList.toggle('bg-slate-100', !active);
    btn.classList.toggle('text-slate-800', !active);
  });
}

function updateContrastButtons(isHc) {
  document.querySelectorAll('[data-contrast-toggle]').forEach(toggle => {
    const textSpan = toggle.querySelector('.contrast-label');
    if (textSpan) {
      textSpan.textContent = isHc ? 'Standard Contrast' : 'High Contrast';
    }
  });
}

/* ==========================================================================
   2. Mobile Menu Navigation
   ========================================================================== */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const closeBtn = document.getElementById('mobile-menu-close');
  const drawer = document.getElementById('mobile-menu-drawer');
  const overlay = document.getElementById('mobile-menu-overlay');

  if (!toggleBtn || !drawer || !overlay) return;

  function openMenu() {
    drawer.classList.remove('translate-x-full');
    overlay.classList.remove('hidden');
    toggleBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    drawer.classList.add('translate-x-full');
    overlay.classList.add('hidden');
    toggleBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  overlay.addEventListener('click', closeMenu);

  // Close when clicking mobile links
  drawer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // ESC key to close
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !drawer.classList.contains('translate-x-full')) {
      closeMenu();
    }
  });
}

/* ==========================================================================
   3. Next Service Countdown
   ========================================================================== */
function initServiceCountdown() {
  const badge = document.getElementById('next-service-badge');
  const banner = document.getElementById('hero-countdown-text');
  if (!badge && !banner) return;

  function update() {
    const now = new Date();
    // Schedule:
    // Sunday 0: 10:00 (Bible Class), 11:00 (Morning Worship), 18:00 (Evening Worship)
    // Wednesday 3: 18:30 (Bible Study)
    const assemblies = [
      { day: 0, hour: 10, min: 0, title: 'Sunday Bible Class', timeStr: 'Sunday at 10:00 AM' },
      { day: 0, hour: 11, min: 0, title: 'Sunday Morning Worship', timeStr: 'Sunday at 11:00 AM' },
      { day: 0, hour: 18, min: 0, title: 'Sunday Evening Worship', timeStr: 'Sunday at 6:00 PM' },
      { day: 3, hour: 18, min: 30, title: 'Wednesday Bible Study', timeStr: 'Wednesday at 6:30 PM' }
    ];

    let nextAssembly = null;
    let minDiff = Infinity;

    assemblies.forEach(service => {
      let target = new Date(now);
      let dayDiff = (service.day - now.getDay() + 7) % 7;
      target.setDate(now.getDate() + dayDiff);
      target.setHours(service.hour, service.min, 0, 0);

      if (target <= now) {
        // move to next week
        target.setDate(target.getDate() + 7);
      }

      let diff = target - now;
      if (diff < minDiff) {
        minDiff = diff;
        nextAssembly = { ...service, date: target };
      }
    });

    if (nextAssembly) {
      const days = Math.floor(minDiff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((minDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((minDiff % (1000 * 60 * 60)) / (1000 * 60));

      let countdownStr = '';
      if (days > 0) countdownStr += `${days}d `;
      countdownStr += `${hours}h ${minutes}m`;

      if (badge) {
        badge.innerHTML = `<span class="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 mr-2 animate-pulse"></span> Next Service: <strong>${nextAssembly.title}</strong> (${nextAssembly.timeStr})`;
      }
      if (banner) {
        banner.innerHTML = `Upcoming: <strong>${nextAssembly.title}</strong> in <span class="text-amber-300 font-bold">${countdownStr}</span> (${nextAssembly.timeStr})`;
      }
    }
  }

  update();
  setInterval(update, 60000);
}

/* ==========================================================================
   4. Interactive Audio Sermon Player & Library
   ========================================================================== */
const sermonsData = [
  {
    id: 1,
    title: "Learning not to fret in life",
    speaker: "Curtis Parker",
    date: "Jan 14, 2024",
    duration: "32:15",
    size: "5.7 MB",
    category: "Curtis Parker",
    scripture: "Psalm 37:1-8",
    description: "A reassuring biblical study on overcoming anxiety, placing steadfast trust in God's sovereignty, and experiencing the peace that passes all understanding."
  },
  {
    id: 2,
    title: "Returning to your first love",
    speaker: "Curtis Parker",
    date: "Jan 14, 2024",
    duration: "38:40",
    size: "8.68 MB",
    category: "Curtis Parker",
    scripture: "Revelation 2:4",
    description: "Reflecting on the admonition to Ephesus to rekindle our original spiritual fire, zeal, and heartfelt devotion to Jesus Christ."
  },
  {
    id: 3,
    title: "Have you left your first love?",
    speaker: "Curtis Parker",
    date: "Jan 7, 2024",
    duration: "35:10",
    size: "7.88 MB",
    category: "Curtis Parker",
    scripture: "Revelation 2:1-7",
    description: "An introspective examination of personal faith and spiritual routines to ensure Christ remains supreme in our thoughts and actions."
  },
  {
    id: 4,
    title: "I did not mean to say that",
    speaker: "Grady Stanford",
    date: "Dec 31, 2023",
    duration: "34:20",
    size: "7.32 MB",
    category: "Guest Speakers",
    scripture: "James 3:1-12",
    description: "Scriptural wisdom on the power of the tongue, practicing self-control, and seasoning every word with grace and truth."
  },
  {
    id: 5,
    title: "Jesus the light of the world",
    speaker: "Curtis Parker",
    date: "Dec 24, 2023",
    duration: "31:45",
    size: "6.32 MB",
    category: "Curtis Parker",
    scripture: "John 8:12",
    description: "Celebrating the glorious light of Christ breaking through spiritual darkness, guiding mankind along the narrow path."
  },
  {
    id: 6,
    title: "My Ebenezer",
    speaker: "Curtis Parker",
    date: "Dec 17, 2023",
    duration: "28:50",
    size: "5.45 MB",
    category: "Curtis Parker",
    scripture: "1 Samuel 7:12",
    description: "Erecting memorial stones of remembrance for God's divine deliverance, grace, and providential care through life's trials."
  },
  {
    id: 7,
    title: "Away from the Manger",
    speaker: "Curtis Parker",
    date: "Dec 17, 2023",
    duration: "36:12",
    size: "8.21 MB",
    category: "Curtis Parker",
    scripture: "Philippians 2:5-11",
    description: "Looking beyond the infancy of Jesus to His ministry of reconciliation, the cross of Calvary, and His reigning kingship."
  },
  {
    id: 8,
    title: "Conflict",
    speaker: "Tim Pinkston",
    date: "Dec 10, 2023",
    duration: "44:05",
    size: "11.28 MB",
    category: "Tim Pinkston",
    scripture: "Matthew 18:15-20",
    description: "Practical New Testament directives for resolving interpersonal conflict, fostering forgiveness, and safeguarding unity in the church."
  },
  {
    id: 9,
    title: "Test every Spirit",
    speaker: "Tim Pinkston",
    date: "Dec 10, 2023",
    duration: "37:20",
    size: "8.28 MB",
    category: "Tim Pinkston",
    scripture: "1 John 4:1-6",
    description: "A vital admonition to measure every voice and doctrine against inspired scripture, refusing worldly deceptions."
  },
  {
    id: 10,
    title: "New Testament Worship Concepts (Parts 1-3)",
    speaker: "Curtis Parker",
    date: "Bible Study Series",
    duration: "Series",
    size: "PDF / Audio",
    category: "Bible Study",
    scripture: "John 4:24, Col. 3:17",
    description: "An exhaustive 3-part textual series exploring biblical worship: singing without mechanical instruments, prayer, Lord's Supper, and preaching."
  }
];

let activeSermonIndex = 0;
let isPlaying = false;
let currentSeconds = 0;
let totalSeconds = 1935; // 32:15
let playbackTimer = null;
let playbackSpeed = 1.0;

function initSermonPlayer() {
  renderSermonList(sermonsData);
  bindPlayerControls();

  // Search and Filter Listeners
  const searchInput = document.getElementById('sermon-search-input');
  const categorySelect = document.getElementById('sermon-category-filter');

  function filterSermons() {
    const query = (searchInput ? searchInput.value : '').toLowerCase().trim();
    const cat = categorySelect ? categorySelect.value : 'all';

    const filtered = sermonsData.filter(s => {
      const matchesQuery = s.title.toLowerCase().includes(query) ||
                           s.speaker.toLowerCase().includes(query) ||
                           s.scripture.toLowerCase().includes(query) ||
                           s.description.toLowerCase().includes(query);
      const matchesCat = cat === 'all' || s.category === cat || (cat === 'Curtis Parker' && s.speaker === 'Curtis Parker') || (cat === 'Tim Pinkston' && s.speaker === 'Tim Pinkston');
      return matchesQuery && matchesCat;
    });

    renderSermonList(filtered);
  }

  if (searchInput) searchInput.addEventListener('input', filterSermons);
  if (categorySelect) categorySelect.addEventListener('change', filterSermons);
}

function renderSermonList(list) {
  const container = document.getElementById('sermon-list-container');
  if (!container) return;

  if (list.length === 0) {
    container.innerHTML = `
      <div class="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300">
        <p class="text-slate-600 font-medium">No sermons match your search criteria.</p>
        <button id="reset-sermon-filter" class="mt-3 text-sm text-blue-800 font-semibold hover:underline">Reset search filters</button>
      </div>
    `;
    const resetBtn = document.getElementById('reset-sermon-filter');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        const sInput = document.getElementById('sermon-search-input');
        const cSelect = document.getElementById('sermon-category-filter');
        if (sInput) sInput.value = '';
        if (cSelect) cSelect.value = 'all';
        renderSermonList(sermonsData);
      });
    }
    return;
  }

  container.innerHTML = list.map((s, idx) => {
    const isActive = sermonsData[activeSermonIndex].id === s.id;
    return `
      <div class="sermon-card group p-5 bg-white rounded-xl border transition-all duration-200 ${isActive ? 'border-amber-500 shadow-md ring-2 ring-amber-500/20' : 'border-slate-200 hover:border-slate-300 hover:shadow'}">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-1.5">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${s.category === 'Bible Study' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}">
                ${s.category}
              </span>
              <span class="text-xs text-slate-600">${s.date}</span>
              ${s.scripture ? `<span class="text-xs font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded">📖 ${s.scripture}</span>` : ''}
            </div>
            <h4 class="text-lg font-bold text-slate-900 group-hover:text-blue-900 transition-colors">
              ${s.title}
            </h4>
            <p class="text-sm text-slate-700 mt-1 line-clamp-2">
              ${s.description}
            </p>
            <div class="flex items-center gap-4 mt-2 text-xs text-slate-600">
              <span><strong>Speaker:</strong> ${s.speaker}</span>
              <span>•</span>
              <span><strong>Duration:</strong> ${s.duration}</span>
              <span>•</span>
              <span><strong>Size:</strong> ${s.size}</span>
            </div>
          </div>
          
          <div class="flex items-center gap-2 flex-shrink-0">
            <button onclick="selectSermonById(${s.id})" class="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${isActive ? 'bg-amber-600 text-white hover:bg-amber-700' : 'bg-slate-100 text-slate-800 hover:bg-slate-200'}">
              <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              <span>${isActive && isPlaying ? 'Playing' : 'Listen Now'}</span>
            </button>
            <button onclick="downloadSermonNote('${s.title}')" title="Download Audio File or Notes" class="p-2.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

window.selectSermonById = function(id) {
  const idx = sermonsData.findIndex(s => s.id === id);
  if (idx !== -1) {
    activeSermonIndex = idx;
    currentSeconds = 0;
    updatePlayerUI();
    playAudio();
    renderSermonList(sermonsData);
    // Smooth scroll to player on mobile
    const playerEl = document.getElementById('sermon-player-box');
    if (playerEl && window.innerWidth < 768) {
      playerEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
};

window.downloadSermonNote = function(title) {
  alert(`Download initiated: "${title}" (MP3 Audio Archive). Albemarle Church of Christ sermon recording.`);
};

function bindPlayerControls() {
  const playBtn = document.getElementById('player-play-btn');
  const rewindBtn = document.getElementById('player-rewind-btn');
  const forwardBtn = document.getElementById('player-forward-btn');
  const progressBar = document.getElementById('player-progress-bar');
  const speedBtn = document.getElementById('player-speed-btn');

  if (playBtn) {
    playBtn.addEventListener('click', toggleAudio);
  }

  if (rewindBtn) {
    rewindBtn.addEventListener('click', () => {
      currentSeconds = Math.max(0, currentSeconds - 15);
      updateProgressDisplay();
    });
  }

  if (forwardBtn) {
    forwardBtn.addEventListener('click', () => {
      currentSeconds = Math.min(totalSeconds, currentSeconds + 15);
      updateProgressDisplay();
    });
  }

  if (progressBar) {
    progressBar.addEventListener('input', (e) => {
      currentSeconds = (e.target.value / 100) * totalSeconds;
      updateProgressDisplay();
    });
  }

  if (speedBtn) {
    speedBtn.addEventListener('click', () => {
      if (playbackSpeed === 1.0) playbackSpeed = 1.25;
      else if (playbackSpeed === 1.25) playbackSpeed = 1.5;
      else playbackSpeed = 1.0;
      speedBtn.textContent = `${playbackSpeed}x`;
    });
  }

  updatePlayerUI();
}

function toggleAudio() {
  if (isPlaying) {
    pauseAudio();
  } else {
    playAudio();
  }
}

function playAudio() {
  isPlaying = true;
  clearInterval(playbackTimer);
  playbackTimer = setInterval(() => {
    currentSeconds += playbackSpeed;
    if (currentSeconds >= totalSeconds) {
      currentSeconds = totalSeconds;
      pauseAudio();
    }
    updateProgressDisplay();
  }, 1000);
  updatePlayButtonUI(true);
}

function pauseAudio() {
  isPlaying = false;
  clearInterval(playbackTimer);
  updatePlayButtonUI(false);
}

function updatePlayButtonUI(playing) {
  const playIcon = document.getElementById('player-icon-play');
  const pauseIcon = document.getElementById('player-icon-pause');
  if (playIcon && pauseIcon) {
    playIcon.classList.toggle('hidden', playing);
    pauseIcon.classList.toggle('hidden', !playing);
  }
}

function updateProgressDisplay() {
  const currentTimeEl = document.getElementById('player-current-time');
  const progressBar = document.getElementById('player-progress-bar');
  if (currentTimeEl) {
    currentTimeEl.textContent = formatTime(Math.floor(currentSeconds));
  }
  if (progressBar) {
    progressBar.value = (currentSeconds / totalSeconds) * 100;
  }
}

function updatePlayerUI() {
  const sermon = sermonsData[activeSermonIndex];
  const titleEl = document.getElementById('player-track-title');
  const speakerEl = document.getElementById('player-track-speaker');
  const totalTimeEl = document.getElementById('player-total-time');
  const scriptureEl = document.getElementById('player-track-scripture');

  if (titleEl) titleEl.textContent = sermon.title;
  if (speakerEl) speakerEl.textContent = `${sermon.speaker} • ${sermon.date}`;
  if (totalTimeEl) totalTimeEl.textContent = sermon.duration;
  if (scriptureEl) scriptureEl.textContent = sermon.scripture || '';

  // parse total duration
  const parts = sermon.duration.split(':');
  if (parts.length === 2) {
    totalSeconds = parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
  } else {
    totalSeconds = 1800;
  }

  currentSeconds = 0;
  updateProgressDisplay();
}

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

/* ==========================================================================
   5. Calendar (.ics) Generator
   ========================================================================== */
window.downloadServiceICS = function(serviceName, dayOfWeek, timeStr, desc) {
  // RFC-5545 iCalendar standard
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Albemarle Church of Christ//Worship Service Schedule//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `SUMMARY:Albemarle Church of Christ - ${serviceName}`,
    `DESCRIPTION:${desc} | Albemarle Church of Christ, 24790 South Business 52, Albemarle, NC 28001`,
    'LOCATION:24790 South Business 52, Albemarle, NC 28001',
    'RRULE:FREQ=WEEKLY',
    'STATUS:CONFIRMED',
    'TRANSP:OPAQUE',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${serviceName.replace(/\s+/g, '_')}_AlbemarleCOC.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/* ==========================================================================
   6. Guestbook Interactivity
   ========================================================================== */
function initGuestbook() {
  const form = document.getElementById('guestbook-form');
  const listContainer = document.getElementById('guestbook-entries-container');
  if (!form || !listContainer) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameInput = document.getElementById('gb-name');
    const msgInput = document.getElementById('gb-message');
    const emailInput = document.getElementById('gb-email');

    const name = nameInput.value.trim();
    const msg = msgInput.value.trim();
    if (!name || !msg) return;

    const newCard = document.createElement('div');
    newCard.className = 'p-5 bg-white rounded-xl border border-amber-200 shadow-sm animate-fade-in';
    newCard.innerHTML = `
      <div class="flex items-center justify-between mb-2">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center text-sm">
            ${name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h5 class="text-sm font-bold text-slate-900">${name}</h5>
            <span class="text-xs text-slate-600">Just now</span>
          </div>
        </div>
        <span class="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">New Message</span>
      </div>
      <p class="text-slate-800 text-sm leading-relaxed">${escapeHtml(msg)}</p>
    `;

    listContainer.prepend(newCard);
    form.reset();

    const successMsg = document.getElementById('gb-success-alert');
    if (successMsg) {
      successMsg.classList.remove('hidden');
      setTimeout(() => successMsg.classList.add('hidden'), 5000);
    }
  });
}

function escapeHtml(string) {
  const div = document.createElement('div');
  div.textContent = string;
  return div.innerHTML;
}

/* ==========================================================================
   7. Contact Form Handler
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const alertBox = document.getElementById('contact-form-alert');
  if (!form || !alertBox) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const message = document.getElementById('contact-message').value.trim();

    if (!name || !email || !message) {
      alertBox.className = 'p-4 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm font-medium';
      alertBox.textContent = 'Please fill out all required fields (Name, Email, and Message).';
      alertBox.classList.remove('hidden');
      return;
    }

    // Success response
    alertBox.className = 'p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium';
    alertBox.innerHTML = `✓ Thank you, <strong>${escapeHtml(name)}</strong>! Your message has been sent to our minister and elders. We look forward to connecting with you.`;
    alertBox.classList.remove('hidden');
    form.reset();
  });
}

/* ==========================================================================
   8. Live Stream Player Switcher
   ========================================================================== */
window.switchStreamVideo = function(type) {
  const iframe = document.getElementById('youtube-live-iframe');
  const titleEl = document.getElementById('stream-player-title');
  const dotEl = document.getElementById('stream-status-dot');
  
  const tabLive = document.getElementById('tab-btn-live');
  const tabWorship = document.getElementById('tab-btn-worship');
  const tabStudy = document.getElementById('tab-btn-study');

  if (!iframe) return;

  // Reset tab button styles
  [tabLive, tabWorship, tabStudy].forEach(tab => {
    if (tab) {
      tab.className = 'stream-tab-btn px-3 py-1.5 rounded-lg font-medium bg-slate-700/80 text-slate-200 hover:bg-slate-700 transition flex items-center gap-1';
    }
  });

  if (type === 'live') {
    iframe.src = 'https://www.youtube-nocookie.com/embed/live_stream?channel=UCGJ4ACTkITS7JLZr11_A0CQ';
    if (titleEl) titleEl.textContent = 'Live Broadcast Feed: Albemarle Church of Christ';
    if (dotEl) {
      dotEl.className = 'w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse';
    }
    if (tabLive) {
      tabLive.className = 'stream-tab-btn active px-3 py-1.5 rounded-lg font-bold bg-red-600 text-white transition flex items-center gap-1.5 shadow';
    }
  } else if (type === 'worship') {
    // Recent Sunday Worship Broadcast
    iframe.src = 'https://www.youtube-nocookie.com/embed/suVe2mlBxic?autoplay=1';
    if (titleEl) titleEl.textContent = 'Recent Sunday Worship Broadcast — Albemarle Church of Christ';
    if (dotEl) {
      dotEl.className = 'w-2.5 h-2.5 rounded-full bg-amber-400';
    }
    if (tabWorship) {
      tabWorship.className = 'stream-tab-btn active px-3 py-1.5 rounded-lg font-bold bg-amber-600 text-white transition flex items-center gap-1.5 shadow';
    }
  } else if (type === 'study') {
    // Recent Bible Study Broadcast
    iframe.src = 'https://www.youtube-nocookie.com/embed/FnbQ-iqnKwM?autoplay=1';
    if (titleEl) titleEl.textContent = 'Recent Bible Study Broadcast — Albemarle Church of Christ';
    if (dotEl) {
      dotEl.className = 'w-2.5 h-2.5 rounded-full bg-purple-400';
    }
    if (tabStudy) {
      tabStudy.className = 'stream-tab-btn active px-3 py-1.5 rounded-lg font-bold bg-purple-600 text-white transition flex items-center gap-1.5 shadow';
    }
  }
};


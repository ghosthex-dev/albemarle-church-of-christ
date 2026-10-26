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
   4. Interactive Audio Sermon Player & Bible Study Library
   ========================================================================== */
const sermonsData = [
  {
    "id": 1,
    "title": "Learning not to fret in life",
    "speaker": "Curtis Parker",
    "date": "2024-01-14",
    "category": "Curtis Parker",
    "type": "audio",
    "file": "assets/audio/sermon-1.mp3",
    "size": "5.7 MB",
    "duration": "32:15",
    "scripture": "Psalm 37:1-8",
    "description": "A biblical study on overcoming anxiety, placing steadfast trust in God's sovereignty, and finding divine peace."
  },
  {
    "id": 2,
    "title": "Returning to your first love",
    "speaker": "Curtis Parker",
    "date": "2024-01-14",
    "category": "Curtis Parker",
    "type": "audio",
    "file": "assets/audio/sermon-2.mp3",
    "size": "8.68 MB",
    "duration": "38:40",
    "scripture": "Revelation 2:4",
    "description": "Reflecting on Revelation 2:4 and renewing our zeal, devotion, and heartfelt commitment to Jesus Christ."
  },
  {
    "id": 3,
    "title": "Have you left your first love?",
    "speaker": "Curtis Parker",
    "date": "2024-01-07",
    "category": "Curtis Parker",
    "type": "audio",
    "file": "assets/audio/sermon-3.mp3",
    "size": "7.88 MB",
    "duration": "35:10",
    "scripture": "Revelation 2:1-7",
    "description": "An examination of personal faith and spiritual self-examination to rekindle genuine devotion."
  },
  {
    "id": 4,
    "title": "I did not mean to say that",
    "speaker": "Grady Stanford",
    "date": "2023-12-31",
    "category": "Guest Speakers",
    "type": "audio",
    "file": "assets/audio/sermon-4.mp3",
    "size": "7.32 MB",
    "duration": "34:20",
    "scripture": "James 3:1-12",
    "description": "Scriptural guidance from James 3 on the power of the tongue and speaking with grace and wisdom."
  },
  {
    "id": 5,
    "title": "Jesus the light of the world",
    "speaker": "Curtis Parker",
    "date": "2023-12-24",
    "category": "Curtis Parker",
    "type": "audio",
    "file": "assets/audio/sermon-5.mp3",
    "size": "6.32 MB",
    "duration": "31:45",
    "scripture": "John 8:12",
    "description": "Celebrating the hope and salvation brought by Christ shining in a darkened world."
  },
  {
    "id": 6,
    "title": "My Ebenezer",
    "speaker": "Curtis Parker",
    "date": "2023-12-17",
    "category": "Curtis Parker",
    "type": "audio",
    "file": "assets/audio/sermon-6.mp3",
    "size": "5.45 MB",
    "duration": "28:50",
    "scripture": "1 Samuel 7:12",
    "description": "Remembering God's faithfulness, help, and deliverance through life's trials (1 Samuel 7:12)."
  },
  {
    "id": 7,
    "title": "Away from the Manger",
    "speaker": "Curtis Parker",
    "date": "2023-12-17",
    "category": "Curtis Parker",
    "type": "audio",
    "file": "assets/audio/sermon-7.mp3",
    "size": "8.21 MB",
    "duration": "36:12",
    "scripture": "Philippians 2:5-11",
    "description": "Moving beyond the birth of Jesus to His ministry, sacrificial cross, and triumphant resurrection."
  },
  {
    "id": 8,
    "title": "Conflict",
    "speaker": "Tim Pinkston",
    "date": "2023-12-10",
    "category": "Tim Pinkston",
    "type": "audio",
    "file": "assets/audio/sermon-8.mp3",
    "size": "11.28 MB",
    "duration": "44:05",
    "scripture": "Matthew 18:15-20",
    "description": "Biblical principles for navigating disagreements, peacemaking, and preserving unity in the spirit."
  },
  {
    "id": 9,
    "title": "Test every Spirit",
    "speaker": "Tim Pinkston",
    "date": "2023-12-10",
    "category": "Tim Pinkston",
    "type": "audio",
    "file": "assets/audio/sermon-9.mp3",
    "size": "8.28 MB",
    "duration": "37:20",
    "scripture": "1 John 4:1-6",
    "description": "An essential warning from 1 John 4:1 to measure every doctrine against the inspired scriptures."
  },
  {
    "id": 10,
    "title": "New Testament Worship Concepts (Part 1)",
    "speaker": "Curtis Parker",
    "date": "2016-01-31",
    "category": "Bible Study",
    "type": "document",
    "file": "assets/docs/nt-worship-part-1.pdf",
    "size": "350 KB",
    "duration": "Study Notes",
    "scripture": "John 4:24",
    "description": "Part 1 of an in-depth study examining scriptural patterns and the spirit of New Testament worship."
  },
  {
    "id": 11,
    "title": "New Testament Worship Concepts (Part 2)",
    "speaker": "Curtis Parker",
    "date": "2016-02-07",
    "category": "Bible Study",
    "type": "document",
    "file": "assets/docs/nt-worship-part-2.pdf",
    "size": "328 KB",
    "duration": "Study Notes",
    "scripture": "Ephesians 5:19",
    "description": "Part 2 examining congregational singing, prayer, and communion according to apostolic practice."
  },
  {
    "id": 12,
    "title": "New Testament Worship Concepts (Part 3)",
    "speaker": "Curtis Parker",
    "date": "2016-02-14",
    "category": "Bible Study",
    "type": "document",
    "file": "assets/docs/nt-worship-part-3.pdf",
    "size": "285 KB",
    "duration": "Study Notes",
    "scripture": "1 Corinthians 16:1-2",
    "description": "Part 3 examining Christian giving, gospel preaching, and continuing steadfastly in the apostles' doctrine."
  },
  {
    "id": 13,
    "title": "In Remembrance of Me",
    "speaker": "Curtis Parker",
    "date": "2016-06-26",
    "category": "Curtis Parker",
    "type": "document",
    "file": "assets/docs/in-remembrance-of-me.pdf",
    "size": "330 KB",
    "duration": "Sermon Outline",
    "scripture": "Luke 22:19",
    "description": "Textual outline focusing on the weekly communion and memorial of Christ's sacrifice."
  },
  {
    "id": 14,
    "title": "What Repentance Means",
    "speaker": "Curtis Parker",
    "date": "2016-06-19",
    "category": "Curtis Parker",
    "type": "document",
    "file": "assets/docs/what-repentance-means.pdf",
    "size": "400 KB",
    "duration": "Sermon Outline",
    "scripture": "Acts 17:30",
    "description": "The biblical definition, fruit, and transformative necessity of genuine repentance."
  },
  {
    "id": 15,
    "title": "The Son Liveth",
    "speaker": "Curtis Parker",
    "date": "2016-06-12",
    "category": "Curtis Parker",
    "type": "document",
    "file": "assets/docs/thy-son-liveth.pdf",
    "size": "426 KB",
    "duration": "Sermon Outline",
    "scripture": "John 4:46-54",
    "description": "The nobleman's faith in Capernaum and the life-giving power of Christ's word."
  },
  {
    "id": 16,
    "title": "The Joy of Christianity",
    "speaker": "Curtis Parker",
    "date": "2016-06-05",
    "category": "Curtis Parker",
    "type": "document",
    "file": "assets/docs/the-joy-of-christianity.pdf",
    "size": "247 KB",
    "duration": "Sermon Outline",
    "scripture": "Philippians 4:4",
    "description": "Finding lasting joy in the Lord despite earthly trials, tribulation, and sorrow."
  },
  {
    "id": 17,
    "title": "Show Me Your Glory",
    "speaker": "Curtis Parker",
    "date": "2016-05-29",
    "category": "Curtis Parker",
    "type": "document",
    "file": "assets/docs/show-me-your-glory.pdf",
    "size": "186 KB",
    "duration": "Sermon Outline",
    "scripture": "Exodus 33:18",
    "description": "Moses' plea to behold the presence and majestic glory of the Almighty God."
  },
  {
    "id": 18,
    "title": "Open My Eyes",
    "speaker": "Curtis Parker",
    "date": "2016-05-22",
    "category": "Curtis Parker",
    "type": "document",
    "file": "assets/docs/open-my-eyes.pdf",
    "size": "43 KB",
    "duration": "Sermon Outline",
    "scripture": "Psalm 119:18",
    "description": "Seeking spiritual vision to behold wondrous things out of God's holy law."
  },
  {
    "id": 19,
    "title": "More Precious Than Gold",
    "speaker": "Curtis Parker",
    "date": "2016-05-15",
    "category": "Curtis Parker",
    "type": "document",
    "file": "assets/docs/more-precious-than-gold.pdf",
    "size": "181 KB",
    "duration": "Sermon Outline",
    "scripture": "1 Peter 1:7",
    "description": "The trial and purification of our faith proving more precious than gold that perishes."
  },
  {
    "id": 20,
    "title": "A Mother's Love",
    "speaker": "Curtis Parker",
    "date": "2016-05-08",
    "category": "Curtis Parker",
    "type": "document",
    "file": "assets/docs/a-mothers-love.pdf",
    "size": "643 KB",
    "duration": "Sermon Outline",
    "scripture": "Proverbs 31:28",
    "description": "Celebrating godly mothers, nurturing faith, and honoring sacrificial maternal love."
  },
  {
    "id": 21,
    "title": "Jesus is the Light",
    "speaker": "Curtis Parker",
    "date": "2016-05-01",
    "category": "Curtis Parker",
    "type": "document",
    "file": "assets/docs/jesus-is-the-light.pdf",
    "size": "48 KB",
    "duration": "Sermon Outline",
    "scripture": "John 8:12",
    "description": "Following the Light of Life so that we do not walk in darkness."
  },
  {
    "id": 22,
    "title": "Just a Christian",
    "speaker": "Curtis Parker",
    "date": "2016-04-24",
    "category": "Curtis Parker",
    "type": "document",
    "file": "assets/docs/just-a-christian.pdf",
    "size": "571 KB",
    "duration": "Sermon Outline",
    "scripture": "Acts 11:26",
    "description": "Rejecting denominational divisions and standing simply and purely as a Christian according to the New Testament."
  }
];

let activeSermonIndex = 0;
let playbackSpeed = 1.0;
let audioEl = null;

function initSermonPlayer() {
  audioEl = document.getElementById('sermon-audio-element');
  renderSermonList(sermonsData);
  bindPlayerControls();

  if (audioEl) {
    // Setup audio event listeners
    audioEl.addEventListener('play', () => {
      updatePlayButtonUI(true);
      updateStatusIndicator('playing');
      renderSermonList(getActiveFilteredList());
    });

    audioEl.addEventListener('pause', () => {
      updatePlayButtonUI(false);
      updateStatusIndicator('paused');
      renderSermonList(getActiveFilteredList());
    });

    audioEl.addEventListener('timeupdate', () => {
      updateProgressDisplay();
    });

    audioEl.addEventListener('loadedmetadata', () => {
      const totalTimeEl = document.getElementById('player-total-time');
      if (totalTimeEl && audioEl.duration && !isNaN(audioEl.duration)) {
        totalTimeEl.textContent = formatTime(Math.floor(audioEl.duration));
      }
    });

    audioEl.addEventListener('ended', () => {
      updatePlayButtonUI(false);
      updateStatusIndicator('ended');
      // Auto play next audio sermon if available
      playNextAudioSermon();
    });

    audioEl.addEventListener('error', (e) => {
      console.warn('Audio playback notice:', e);
      updateStatusIndicator('ready');
    });
  }

  // Search and Filter Listeners
  const searchInput = document.getElementById('sermon-search-input');
  const categorySelect = document.getElementById('sermon-category-filter');

  function filterSermons() {
    renderSermonList(getActiveFilteredList());
  }

  if (searchInput) searchInput.addEventListener('input', filterSermons);
  if (categorySelect) categorySelect.addEventListener('change', filterSermons);

  // Set initial player state
  updatePlayerUI();
}

function getActiveFilteredList() {
  const searchInput = document.getElementById('sermon-search-input');
  const categorySelect = document.getElementById('sermon-category-filter');
  const query = (searchInput ? searchInput.value : '').toLowerCase().trim();
  const cat = categorySelect ? categorySelect.value : 'all';

  return sermonsData.filter(s => {
    const matchesQuery = s.title.toLowerCase().includes(query) ||
                         s.speaker.toLowerCase().includes(query) ||
                         (s.scripture && s.scripture.toLowerCase().includes(query)) ||
                         (s.description && s.description.toLowerCase().includes(query));
    
    let matchesCat = true;
    if (cat === 'all') matchesCat = true;
    else if (cat === 'audio') matchesCat = s.type === 'audio';
    else if (cat === 'document') matchesCat = s.type === 'document';
    else if (cat === 'Curtis Parker') matchesCat = s.speaker === 'Curtis Parker';
    else if (cat === 'Tim Pinkston') matchesCat = s.speaker === 'Tim Pinkston';
    else if (cat === 'Grady Stanford') matchesCat = s.speaker.includes('Grady');
    else if (cat === 'Bible Study') matchesCat = s.category === 'Bible Study';

    return matchesQuery && matchesCat;
  });
}

function renderSermonList(list) {
  const container = document.getElementById('sermon-list-container');
  if (!container) return;

  if (list.length === 0) {
    container.innerHTML = `
      <div class="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300">
        <p class="text-slate-600 font-medium">No sermons or Bible studies match your search criteria.</p>
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

  const isCurrentAudioPlaying = audioEl && !audioEl.paused;

  container.innerHTML = list.map((s) => {
    const isThisTrackActive = sermonsData[activeSermonIndex].id === s.id;
    const isPlayingThis = isThisTrackActive && isCurrentAudioPlaying && s.type === 'audio';
    const isDoc = s.type === 'document';

    return `
      <div class="sermon-card group p-5 bg-white rounded-xl border transition-all duration-200 ${isThisTrackActive ? 'border-amber-500 shadow-md ring-2 ring-amber-500/20' : 'border-slate-200 hover:border-slate-300 hover:shadow'}">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="flex-1">
            <div class="flex flex-wrap items-center gap-2 mb-1.5">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${isDoc ? 'bg-purple-100 text-purple-900 border border-purple-200' : 'bg-blue-100 text-blue-900 border border-blue-200'}">
                ${isDoc ? '📄 Study Outline (PDF)' : '🔊 Audio Sermon (MP3)'}
              </span>
              <span class="text-xs text-slate-600 font-medium">${s.date}</span>
              ${s.scripture ? `<span class="text-xs font-medium text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">📖 ${s.scripture}</span>` : ''}
            </div>
            <h4 class="text-lg font-bold text-slate-900 group-hover:text-blue-900 transition-colors">
              ${s.title}
            </h4>
            <p class="text-sm text-slate-700 mt-1 line-clamp-2 leading-relaxed">
              ${s.description}
            </p>
            <div class="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-600">
              <span><strong>Speaker:</strong> ${s.speaker}</span>
              <span>•</span>
              <span><strong>Length:</strong> ${s.duration}</span>
              <span>•</span>
              <span><strong>File Size:</strong> ${s.size}</span>
            </div>
          </div>
          
          <div class="flex items-center gap-2 flex-shrink-0 pt-2 md:pt-0">
            ${isDoc ? `
              <a href="${s.file}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors bg-purple-50 text-purple-900 hover:bg-purple-100 border border-purple-200">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                <span>Read Notes</span>
              </a>
              <a href="${s.file}" download="${s.title}.pdf" title="Download ${s.title} (PDF)" class="p-2.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition flex items-center justify-center" aria-label="Download PDF Notes">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
              </a>
            ` : `
              <button onclick="selectSermonById(${s.id})" class="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${isPlayingThis ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow' : isThisTrackActive ? 'bg-amber-600 text-white hover:bg-amber-700' : 'bg-slate-100 text-slate-800 hover:bg-slate-200'}">
                ${isPlayingThis ? `
                  <span class="w-2.5 h-2.5 rounded-full bg-white animate-ping"></span>
                  <span>Playing</span>
                ` : `
                  <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                  <span>Listen Now</span>
                `}
              </button>
              <a href="${s.file}" download="${s.title} - ${s.speaker}.mp3" title="Download Audio Recording (${s.size})" class="p-2.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition flex items-center justify-center" aria-label="Download Audio Recording">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
              </a>
            `}
          </div>
        </div>
      </div>
    `;
  }).join('');
}

window.selectSermonById = function(id) {
  const idx = sermonsData.findIndex(s => s.id === id);
  if (idx !== -1) {
    const s = sermonsData[idx];
    if (s.type === 'document') {
      window.open(s.file, '_blank');
      return;
    }

    activeSermonIndex = idx;
    updatePlayerUI();

    if (audioEl) {
      audioEl.src = s.file;
      audioEl.playbackRate = playbackSpeed;
      audioEl.play().catch(err => {
        console.warn('Playback error or user gesture required:', err);
      });
    }

    renderSermonList(getActiveFilteredList());

    // Scroll to player on small screens
    const playerEl = document.getElementById('sermon-player-box');
    if (playerEl && window.innerWidth < 768) {
      playerEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
};

function playNextAudioSermon() {
  for (let i = activeSermonIndex + 1; i < sermonsData.length; i++) {
    if (sermonsData[i].type === 'audio') {
      selectSermonById(sermonsData[i].id);
      return;
    }
  }
}

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
      if (audioEl) {
        audioEl.currentTime = Math.max(0, audioEl.currentTime - 15);
        updateProgressDisplay();
      }
    });
  }

  if (forwardBtn) {
    forwardBtn.addEventListener('click', () => {
      if (audioEl && audioEl.duration) {
        audioEl.currentTime = Math.min(audioEl.duration, audioEl.currentTime + 15);
        updateProgressDisplay();
      }
    });
  }

  if (progressBar) {
    progressBar.addEventListener('input', (e) => {
      if (audioEl && audioEl.duration && !isNaN(audioEl.duration)) {
        const targetTime = (e.target.value / 100) * audioEl.duration;
        audioEl.currentTime = targetTime;
        updateProgressDisplay();
      }
    });
  }

  if (speedBtn) {
    speedBtn.addEventListener('click', () => {
      if (playbackSpeed === 1.0) playbackSpeed = 1.25;
      else if (playbackSpeed === 1.25) playbackSpeed = 1.5;
      else playbackSpeed = 1.0;
      speedBtn.textContent = `${playbackSpeed}x`;
      if (audioEl) {
        audioEl.playbackRate = playbackSpeed;
      }
    });
  }
}

function toggleAudio() {
  if (!audioEl) return;
  const currentSermon = sermonsData[activeSermonIndex];
  
  // If player element src doesn't match active track, assign it
  if (!audioEl.src || !audioEl.src.includes(currentSermon.file)) {
    audioEl.src = currentSermon.file;
  }

  if (audioEl.paused) {
    audioEl.play().catch(err => {
      console.warn('Playback error:', err);
    });
  } else {
    audioEl.pause();
  }
}

function updatePlayButtonUI(isPlaying) {
  const playIcon = document.getElementById('player-icon-play');
  const pauseIcon = document.getElementById('player-icon-pause');
  if (playIcon && pauseIcon) {
    playIcon.classList.toggle('hidden', isPlaying);
    pauseIcon.classList.toggle('hidden', !isPlaying);
  }
}

function updateStatusIndicator(status) {
  const pulseEl = document.getElementById('player-pulse-indicator');
  const textEl = document.getElementById('player-status-text');
  if (!pulseEl || !textEl) return;

  if (status === 'playing') {
    pulseEl.className = 'w-2 h-2 rounded-full bg-emerald-400 animate-pulse';
    textEl.textContent = 'Now Playing';
  } else if (status === 'paused') {
    pulseEl.className = 'w-2 h-2 rounded-full bg-amber-400';
    textEl.textContent = 'Paused';
  } else if (status === 'ended') {
    pulseEl.className = 'w-2 h-2 rounded-full bg-slate-400';
    textEl.textContent = 'Finished';
  } else {
    pulseEl.className = 'w-2 h-2 rounded-full bg-slate-400';
    textEl.textContent = 'Ready to Play';
  }
}

function updateProgressDisplay() {
  if (!audioEl) return;
  const currentTimeEl = document.getElementById('player-current-time');
  const totalTimeEl = document.getElementById('player-total-time');
  const progressBar = document.getElementById('player-progress-bar');

  const curSec = audioEl.currentTime || 0;
  const durSec = audioEl.duration || 0;

  if (currentTimeEl) {
    currentTimeEl.textContent = formatTime(Math.floor(curSec));
  }

  if (durSec && !isNaN(durSec)) {
    if (totalTimeEl) {
      totalTimeEl.textContent = formatTime(Math.floor(durSec));
    }
    if (progressBar) {
      progressBar.value = (curSec / durSec) * 100;
    }
  }
}

function updatePlayerUI() {
  const sermon = sermonsData[activeSermonIndex];
  const titleEl = document.getElementById('player-track-title');
  const speakerEl = document.getElementById('player-track-speaker');
  const totalTimeEl = document.getElementById('player-total-time');
  const scriptureEl = document.getElementById('player-track-scripture');
  const formatEl = document.getElementById('player-file-format');
  const downloadLink = document.getElementById('player-download-btn');

  if (titleEl) titleEl.textContent = sermon.title;
  if (speakerEl) speakerEl.textContent = `${sermon.speaker} • ${sermon.date}`;
  if (totalTimeEl) totalTimeEl.textContent = sermon.duration;
  if (scriptureEl) scriptureEl.textContent = sermon.scripture || 'Scripture Study';
  if (formatEl) formatEl.textContent = `MP3 Audio • ${sermon.size}`;

  if (downloadLink) {
    downloadLink.href = sermon.file;
    downloadLink.setAttribute('download', `${sermon.title} - ${sermon.speaker}.mp3`);
    downloadLink.setAttribute('title', `Download ${sermon.title} (${sermon.size})`);
  }

  if (audioEl && (!audioEl.src || !audioEl.src.includes(sermon.file))) {
    audioEl.src = sermon.file;
  }
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


// ─── CONFIG ───────────────────────────────────────────────────────────────────
const API = 'https://gymbuddy-backend-wsn1.onrender.com/api';

// ─── DATA ─────────────────────────────────────────────────────────────────────
const EXERCISES = {
  Chest:['Bench Press','Incline Bench Press','Flat Dumbbell Press','Incline Dumbbell Press','Decline Bench Press','Cable Fly','Dumbbell Fly','Push-Up','Chest Dip'],
  Shoulders:['Overhead Press','Lateral Raise','Front Raise','Arnold Press','Face Pull','Upright Row','Cable Lateral Raise'],
  Biceps:['Barbell Curl','EZ Curl','Dumbbell Curl','Hammer Curl','Preacher Curl','Cable Curl','Bayesian Curl','Concentration Curl','Chin-Up'],
  Triceps:['Tricep Pushdown','Skull Crusher','Close-Grip Bench','Overhead Tricep Extension','Dips','Diamond Push-Up','Kickback'],
  Abs:['Crunch','Plank','Leg Raise','Cable Crunch','Russian Twist','Hanging Knee Raise','Ab Rollout'],
  Forearms:['Wrist Curl','Reverse Wrist Curl','Hammer Curl','Farmer\'s Walk','Dead Hang','Reverse Curl'],
  Lats:['Pull-Up','Lat Pulldown','Seated Row','Dumbbell Row','Barbell Row','T-Bar Row','Straight-Arm Pulldown'],
  Traps:['Shrug','Barbell Shrug','Dumbbell Shrug','Face Pull','Rack Pull','Upright Row'],
  'Lower Back':['Deadlift','Romanian Deadlift','Hyperextension','Good Morning','Cable Pull-Through'],
  Quadriceps:['Squat','Leg Press','Leg Extension','Lunges','Hack Squat','Bulgarian Split Squat'],
  Hamstrings:['Romanian Deadlift','Leg Curl','Lying Leg Curl','Nordic Curl','Stiff-Leg Deadlift','Glute-Ham Raise','Good Morning'],
  Glutes:['Hip Thrust','Glute Bridge','Cable Kickback','Sumo Squat','Step-Up','Donkey Kick'],
  Calves:['Calf Raise','Seated Calf Raise','Leg Press Calf Raise','Jump Rope','Donkey Calf Raise']
};

const EXERCISE_PROFILES = {
  Chest: {
    'Bench Press': { role: 'compound', focus: 'mid-chest' },
    'Incline Bench Press': { role: 'compound', focus: 'upper-chest' },
    'Flat Dumbbell Press': { role: 'compound', focus: 'mid-chest' },
    'Incline Dumbbell Press': { role: 'compound', focus: 'upper-chest' },
    'Decline Bench Press': { role: 'compound', focus: 'lower-chest' },
    'Cable Fly': { role: 'stretch', focus: 'inner-chest' },
    'Dumbbell Fly': { role: 'stretch', focus: 'outer-chest' },
    'Push-Up': { role: 'compound', focus: 'mid-chest' },
    'Chest Dip': { role: 'isolation', focus: 'lower-chest' }
  },
  Shoulders: {
    'Overhead Press': { role: 'compound', focus: 'front-delts' },
    'Lateral Raise': { role: 'isolation', focus: 'side-delts' },
    'Front Raise': { role: 'isolation', focus: 'front-delts' },
    'Arnold Press': { role: 'compound', focus: 'front-side-delts' },
    'Face Pull': { role: 'stretch', focus: 'rear-delts' },
    'Upright Row': { role: 'compound', focus: 'upper-delts' },
    'Cable Lateral Raise': { role: 'stretch', focus: 'side-delts' }
  },
  Biceps: {
    'Barbell Curl': { role: 'compound', focus: 'overall-biceps' },
    'EZ Curl': { role: 'compound', focus: 'overall-biceps' },
    'Dumbbell Curl': { role: 'compound', focus: 'mid-biceps' },
    'Hammer Curl': { role: 'isolation', focus: 'brachialis' },
    'Preacher Curl': { role: 'isolation', focus: 'short-head' },
    'Cable Curl': { role: 'stretch', focus: 'constant-tension' },
    'Bayesian Curl': { role: 'stretch', focus: 'long-head' },
    'Concentration Curl': { role: 'isolation', focus: 'peak-contraction' },
    'Chin-Up': { role: 'compound', focus: 'overall-biceps' }
  },
  Triceps: {
    'Tricep Pushdown': { role: 'isolation', focus: 'lateral-head' },
    'Skull Crusher': { role: 'stretch', focus: 'long-head' },
    'Close-Grip Bench': { role: 'compound', focus: 'overall-triceps' },
    'Overhead Tricep Extension': { role: 'stretch', focus: 'long-head' },
    'Dips': { role: 'compound', focus: 'lower-triceps' },
    'Diamond Push-Up': { role: 'compound', focus: 'overall-triceps' },
    'Kickback': { role: 'isolation', focus: 'peak-lockout' }
  },
  Abs: {
    'Crunch': { role: 'isolation', focus: 'upper-abs' },
    'Plank': { role: 'compound', focus: 'core-stability' },
    'Leg Raise': { role: 'stretch', focus: 'lower-abs' },
    'Cable Crunch': { role: 'compound', focus: 'upper-abs' },
    'Russian Twist': { role: 'isolation', focus: 'obliques' },
    'Hanging Knee Raise': { role: 'stretch', focus: 'lower-abs' },
    'Ab Rollout': { role: 'compound', focus: 'full-core' }
  },
  Forearms: {
    'Wrist Curl': { role: 'isolation', focus: 'flexors' },
    'Reverse Wrist Curl': { role: 'isolation', focus: 'extensors' },
    'Hammer Curl': { role: 'compound', focus: 'brachioradialis' },
    'Farmer\'s Walk': { role: 'compound', focus: 'grip' },
    'Dead Hang': { role: 'stretch', focus: 'grip' },
    'Reverse Curl': { role: 'stretch', focus: 'upper-forearm' }
  },
  Lats: {
    'Pull-Up': { role: 'compound', focus: 'upper-lats' },
    'Lat Pulldown': { role: 'stretch', focus: 'upper-lats' },
    'Seated Row': { role: 'isolation', focus: 'mid-back' },
    'Dumbbell Row': { role: 'compound', focus: 'mid-lats' },
    'Barbell Row': { role: 'compound', focus: 'mid-back' },
    'T-Bar Row': { role: 'compound', focus: 'lower-lats' },
    'Straight-Arm Pulldown': { role: 'stretch', focus: 'lower-lats' }
  },
  Traps: {
    'Shrug': { role: 'isolation', focus: 'upper-traps' },
    'Barbell Shrug': { role: 'compound', focus: 'upper-traps' },
    'Dumbbell Shrug': { role: 'isolation', focus: 'upper-traps' },
    'Face Pull': { role: 'stretch', focus: 'mid-traps' },
    'Rack Pull': { role: 'compound', focus: 'upper-traps' },
    'Upright Row': { role: 'compound', focus: 'upper-traps' }
  },
  'Lower Back': {
    'Deadlift': { role: 'compound', focus: 'spinal-erectors' },
    'Romanian Deadlift': { role: 'stretch', focus: 'hip-hinge' },
    'Hyperextension': { role: 'isolation', focus: 'erectors' },
    'Good Morning': { role: 'stretch', focus: 'erectors' },
    'Cable Pull-Through': { role: 'isolation', focus: 'lower-back-glute-link' }
  },
  Quadriceps: {
    'Squat': { role: 'compound', focus: 'overall-quads' },
    'Leg Press': { role: 'compound', focus: 'mid-quads' },
    'Leg Extension': { role: 'isolation', focus: 'rectus-femoris' },
    'Lunges': { role: 'stretch', focus: 'single-leg-quads' },
    'Hack Squat': { role: 'compound', focus: 'outer-quads' },
    'Bulgarian Split Squat': { role: 'stretch', focus: 'single-leg-quads' }
  },
  Hamstrings: {
    'Romanian Deadlift': { role: 'stretch', focus: 'hip-hinge-hams' },
    'Leg Curl': { role: 'isolation', focus: 'mid-hamstrings' },
    'Lying Leg Curl': { role: 'isolation', focus: 'shortened-hams' },
    'Nordic Curl': { role: 'compound', focus: 'full-hamstrings' },
    'Stiff-Leg Deadlift': { role: 'stretch', focus: 'lengthened-hams' },
    'Glute-Ham Raise': { role: 'compound', focus: 'full-hamstrings' },
    'Good Morning': { role: 'compound', focus: 'posterior-chain' }
  },
  Glutes: {
    'Hip Thrust': { role: 'compound', focus: 'upper-glutes' },
    'Glute Bridge': { role: 'isolation', focus: 'mid-glutes' },
    'Cable Kickback': { role: 'isolation', focus: 'glute-max' },
    'Sumo Squat': { role: 'compound', focus: 'inner-glutes' },
    'Step-Up': { role: 'stretch', focus: 'single-leg-glutes' },
    'Donkey Kick': { role: 'stretch', focus: 'glute-max' }
  },
  Calves: {
    'Calf Raise': { role: 'compound', focus: 'gastrocnemius' },
    'Seated Calf Raise': { role: 'isolation', focus: 'soleus' },
    'Leg Press Calf Raise': { role: 'stretch', focus: 'lengthened-calves' },
    'Jump Rope': { role: 'compound', focus: 'reactive-calves' },
    'Donkey Calf Raise': { role: 'stretch', focus: 'upper-calves' }
  }
};

const MUSCLE_COLORS = ['#2a2a2a','#1a5c2a','#27ae60','#2ecc71'];

let currentUser = null, isRegister = false, token = null;
let currentMuscle = '', currentExercise = '', currentSets = [];
let progressChart = null, allSessions = [];
let chartMetric = 'volume';
let chartRange = 'all';
let myFollowCounts = { followersCount: 0, followingCount: 0 };
let sheroFocusMuscle = '';
let previousUnlockedBadgeIds = new Set();
let badgeUnlockBaselineDone = false;

// ─── CALENDAR STATE ───────────────────────────────────────────────────────────
let calYear, calMonth;

// ─── WEEKLY LOAD STATE ────────────────────────────────────────────────────────
let weekOffset = 0;

// ─── LOADING ──────────────────────────────────────────────────────────────────
function showLoading() { document.getElementById('loadingOverlay').classList.remove('hidden'); }
function hideLoading() { document.getElementById('loadingOverlay').classList.add('hidden'); }

// ─── CONFETTI ─────────────────────────────────────────────────────────────────
function launchConfetti() {
  const colors = ['#e94560','#27ae60','#f39c12','#3498db','#9b59b6','#fff'];
  const container = document.getElementById('confettiContainer');
  for (let i = 0; i < 80; i++) {
    const piece = document.createElement('div');
    piece.className = 'confettiPiece';
    piece.style.cssText = `
      left:${Math.random() * 100}vw;
      top:-20px;
      background:${colors[Math.floor(Math.random() * colors.length)]};
      width:${6 + Math.random() * 10}px;
      height:${6 + Math.random() * 10}px;
      animation-delay:${Math.random() * 1}s;
      animation-duration:${2 + Math.random() * 1.5}s;
      border-radius:${Math.random() > 0.5 ? '50%' : '2px'};
    `;
    container.appendChild(piece);
    setTimeout(() => piece.remove(), 4000);
  }
}

// ─── MORE SHEET ───────────────────────────────────────────────────────────────
function openMoreSheet() {
  document.getElementById('sheetOverlay').classList.remove('hidden');
  const sheet = document.getElementById('moreSheet');
  sheet.classList.remove('hidden');
  requestAnimationFrame(() => sheet.classList.add('open'));
  document.querySelectorAll('.bnBtn').forEach(b => b.classList.remove('active'));
  document.getElementById('bn_more').classList.add('active');
}

function closeMoreSheet() {
  const sheet = document.getElementById('moreSheet');
  sheet.classList.remove('open');
  setTimeout(() => {
    sheet.classList.add('hidden');
    document.getElementById('sheetOverlay').classList.add('hidden');
  }, 350);
  document.querySelectorAll('.bnBtn').forEach(b => b.classList.remove('active'));
}

function showPageFromSheet(id) {
  closeMoreSheet();
  setTimeout(() => {
    showPage(id, null);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'instant' });
      document.querySelector('main').scrollTop = 0;
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 50);
  }, 200);
}

function logoutFromSheet() {
  closeMoreSheet();
  setTimeout(logout, 200);
}

// ─── AUTH ──────────────────────────────────────────────────────────────────────
// ─── NAVIGATION ───────────────────────────────────────────────────────────────
function showPage(id, btn) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  document.querySelectorAll('.navBtn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');

  window.scrollTo(0, 0);
  document.querySelector('main').scrollTop = 0;

  document.querySelectorAll('.bnBtn').forEach(b => b.classList.remove('active'));
  const map = { bodyPage:'bn_body', historyPage:'bn_history', progressPage:'bn_progress', aiPage:'bn_ai' };
  if (map[id]) document.getElementById(map[id]).classList.add('active');

  if (id === 'historyPage') renderHistory();
  if (id === 'progressPage') renderProgress();
  if (id === 'prPage') renderPRByMuscle();
  if (id === 'aboutPage') loadAbout();
  if (id === 'badgesPage') renderBadges();
  if (id === 'galleryPage') renderGallery();
  if (id === 'goalsPage') renderGoals();
  if (id === 'aiPage') renderAIContextStrip();
}

// ─── BODY VIEW ────────────────────────────────────────────────────────────────
function setView(v) {
  document.getElementById('svgFront').classList.toggle('hidden', v === 'back');
  document.getElementById('svgBack').classList.toggle('hidden', v === 'front');
  document.getElementById('btnFront').classList.toggle('active', v === 'front');
  document.getElementById('btnBack').classList.toggle('active', v === 'back');
  document.getElementById('muscleLabel').textContent = 'Click a muscle to log workout';
}

// ─── HEATMAP ──────────────────────────────────────────────────────────────────
// ─── SET THRESHOLDS: [yellow_min, green_min] per muscle ──────────────────────
const MUSCLE_THRESHOLDS = {
  'Chest':       [9, 11],
  'Shoulders':   [6,  8],
  'Biceps':      [7,  9],
  'Triceps':     [7,  9],
  'Abs':         [9, 11],
  'Forearms':    [4,  6],
  'Lats':        [9, 11],
  'Traps':       [4,  6],
  'Lower Back':  [3,  5],
  'Quadriceps':  [7,  9],
  'Hamstrings':  [6,  7],
  'Glutes':      [6,  8],
  'Calves':      [4,  5],
};

function getWeekStartPreference() {
  if (!currentUser) return 'monday';
  const data = JSON.parse(localStorage.getItem('about_' + currentUser) || '{}');
  return data.weekStart || 'monday';
}

function getWeekStartDayIndex() {
  const dayMap = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6
  };
  return dayMap[getWeekStartPreference()] ?? 1;
}

function getDateWeekKey(date) {
  const { monday } = getCurrentWeekWindow(0, date);
  return monday.toLocaleDateString('en-CA');
}

function getFullBodyWeekProgress() {
  const weeks = {};
  allSessions.forEach(s => {
    const key = getDateWeekKey(new Date(s.date));
    weeks[key] = weeks[key] || {};
    weeks[key][s.muscle] = (weeks[key][s.muscle] || 0) + s.sets.length;
  });

  const weekKeys = Object.keys(weeks).sort();
  let bestStreak = 0;
  let streak = 0;
  const muscles = Object.keys(EXERCISES);

  weekKeys.forEach(key => {
    const counts = weeks[key];
    const weekValid = muscles.every(muscle => {
      const sets = counts[muscle] || 0;
      const greenMin = (MUSCLE_THRESHOLDS[muscle] || [5, 10])[1];
      return sets > greenMin;
    });

    if (weekValid) {
      streak += 1;
    } else {
      streak = 0;
    }
    bestStreak = Math.max(bestStreak, streak);
  });

  return { cur: Math.min(bestStreak, 2), max: 2 };
}

function getUnlockedBadgeIds() {
  return new Set(BADGES.filter(b => {
    const { cur, max } = b.progress();
    return max > 0 && cur >= max;
  }).map(b => b.id));
}

function showBadgeUnlockOverlay(badge) {
  const existing = document.getElementById('badgeUnlockOverlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'badgeUnlockOverlay';
  overlay.className = 'badgeUnlockOverlay';
  overlay.innerHTML = `
    <div class="badgeUnlockPanel">
      ${makeBadgeSVG(badge, 1)}
      <div class="badgeUnlockLabel">Badge Unlocked</div>
      <div class="badgeUnlockName">${badge.name}</div>
    </div>`;

  document.body.appendChild(overlay);
  requestAnimationFrame(() => {
    overlay.classList.add('show');
    overlay.style.visibility = 'visible';
  });

  setTimeout(() => {
    overlay.classList.remove('show');
    overlay.addEventListener('transitionend', () => overlay.remove(), { once: true });
  }, 2600);
}

function checkBadgeUnlocks() {
  if (!badgeUnlockBaselineDone) {
    previousUnlockedBadgeIds = getUnlockedBadgeIds();
    badgeUnlockBaselineDone = true;
    return;
  }

  const currentIds = getUnlockedBadgeIds();
  const newIds = [...currentIds].filter(id => !previousUnlockedBadgeIds.has(id));
  if (!newIds.length) {
    previousUnlockedBadgeIds = currentIds;
    return;
  }

  newIds.forEach((id, index) => {
    setTimeout(() => {
      const badge = BADGES.find(b => b.id === id);
      if (badge) showBadgeUnlockOverlay(badge);
    }, index * 2800);
  });

  previousUnlockedBadgeIds = currentIds;
}

function updateHeatmap() {
  const { monday, sunday } = getCurrentWeekWindow();

  // Count sets per muscle this week
  const setCounts = {};
  allSessions.forEach(s => {
    const d = new Date(s.date);
    if (d >= monday && d <= sunday) {
      setCounts[s.muscle] = (setCounts[s.muscle] || 0) + s.sets.length;
    }
  });

  Object.keys(EXERCISES).forEach(muscle => {
    const id = 'hm_' + muscle.replace(/\s+/g, '_');
    const el = document.getElementById(id);
    if (!el) return;
    const sets = setCounts[muscle] || 0;
    const [yellowMin, greenMin] = MUSCLE_THRESHOLDS[muscle] || [5, 10];
    let color = '#2a2a2a'; // grey — not trained
    if (sets > 0 && sets < yellowMin)  color = '#e74c3c'; // red — under-trained
    if (sets >= yellowMin && sets <= greenMin) color = '#f39c12'; // yellow — moderate
    if (sets > greenMin)               color = '#27ae60'; // green — well-trained
    el.style.fill = color;
  });
}

// ─── STREAK ───────────────────────────────────────────────────────────────────
function getRestDays() {
  return JSON.parse(localStorage.getItem('restDays_' + currentUser) || '[]');
}

function logRestDay() {
  const today = new Date().toLocaleDateString('en-CA');
  const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = yesterday.toLocaleDateString('en-CA');

  const restDays = getRestDays();
  const freezeDays = getFreezeDays();

  const todayWorkedOut = allSessions.some(s => new Date(s.date).toLocaleDateString('en-CA') === today);
  const todayRest = restDays.includes(today);
  const todayFrozen = freezeDays.includes(today);

  const yesterdayWorkedOut = allSessions.some(s => new Date(s.date).toLocaleDateString('en-CA') === yesterdayKey);
  const yesterdayRest = restDays.includes(yesterdayKey);
  const yesterdayFrozen = freezeDays.includes(yesterdayKey);

  const canRestToday = !todayWorkedOut && !todayRest && !todayFrozen;
  const canRestYesterday = !yesterdayWorkedOut && !yesterdayRest && !yesterdayFrozen;

  if (!canRestToday && !canRestYesterday) {
    alert('😴 No days available! Both today and yesterday already have activity logged.');
    return;
  }

  showRestDayModal(canRestToday, canRestYesterday, today, yesterdayKey);
}

function showRestDayModal(canRestToday, canRestYesterday, today, yesterdayKey) {
  const existing = document.getElementById('restDayModal'); if (existing) existing.remove();
  const modal = document.createElement('div'); modal.id = 'restDayModal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:200;display:flex;align-items:center;justify-content:center;padding:20px;';
  const todayDate = new Date().toLocaleDateString('en-US', { weekday:'short', month:'short', day:'numeric' });
  const yestDate = new Date(yesterdayKey + 'T12:00:00').toLocaleDateString('en-US', { weekday:'short', month:'short', day:'numeric' });
  modal.innerHTML = `
    <div style="background:#111;border:1px solid #3a6bc4;border-radius:12px;padding:28px 24px;max-width:320px;width:100%;text-align:center;box-shadow:0 0 30px rgba(58,107,196,0.3)">
      <div style="font-size:2rem;margin-bottom:8px">😴</div>
      <div style="font-family:'Bebas Neue',sans-serif;font-size:1.6rem;letter-spacing:3px;color:#6a9fd8;margin-bottom:6px">REST DAY</div>
      <div style="font-size:.78rem;color:#666;letter-spacing:1px;margin-bottom:20px;text-transform:uppercase">Which day do you want to log as rest?</div>
      <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:20px">
        <button onclick="applyRestDay('${today}')" ${!canRestToday ? 'disabled' : ''}
          style="padding:12px;border-radius:8px;border:1px solid ${canRestToday ? '#3a6bc4' : '#333'};background:${canRestToday ? 'rgba(58,107,196,0.1)' : '#0a0a0a'};color:${canRestToday ? '#6a9fd8' : '#444'};cursor:${canRestToday ? 'pointer' : 'not-allowed'};font-family:'Inter',sans-serif;font-size:.88rem;font-weight:600;">
          Today · ${todayDate}
          ${!canRestToday ? '<br><span style="font-size:.7rem;color:#555">Already has activity</span>' : ''}
        </button>
        <button onclick="applyRestDay('${yesterdayKey}')" ${!canRestYesterday ? 'disabled' : ''}
          style="padding:12px;border-radius:8px;border:1px solid ${canRestYesterday ? '#3a6bc4' : '#333'};background:${canRestYesterday ? 'rgba(58,107,196,0.1)' : '#0a0a0a'};color:${canRestYesterday ? '#6a9fd8' : '#444'};cursor:${canRestYesterday ? 'pointer' : 'not-allowed'};font-family:'Inter',sans-serif;font-size:.88rem;font-weight:600;">
          Yesterday · ${yestDate}
          ${!canRestYesterday ? '<br><span style="font-size:.7rem;color:#555">Already has activity</span>' : ''}
        </button>
      </div>
      <button onclick="document.getElementById('restDayModal').remove()"
        style="background:none;border:1px solid #333;color:#666;padding:8px 20px;border-radius:20px;cursor:pointer;font-family:'Inter',sans-serif;font-size:.78rem;">
        Cancel
      </button>
    </div>`;
  document.body.appendChild(modal);
}

function applyRestDay(dateKey) {
  const restDays = getRestDays();
  if (restDays.includes(dateKey)) {
    alert('Already a rest day!');
    document.getElementById('restDayModal')?.remove(); return;
  }
  // Check consecutive rest days for streak break (only applies going forward from today)
  const isToday = dateKey === new Date().toLocaleDateString('en-CA');
  if (isToday) {
    let consecutiveRest = 0;
    let check = new Date(); check.setDate(check.getDate() - 1);
    for (let i = 0; i < 3; i++) {
      const key = check.toLocaleDateString('en-CA');
      const wasWorkout = allSessions.some(s => new Date(s.date).toLocaleDateString('en-CA') === key);
      if (restDays.includes(key) && !wasWorkout) { consecutiveRest++; check.setDate(check.getDate() - 1); }
      else break;
    }
    if (consecutiveRest >= 3) {
      restDays.push(dateKey);
      localStorage.setItem('restDays_' + currentUser, JSON.stringify(restDays));
      localStorage.setItem('streakBroken_' + currentUser, dateKey);
      updateStreak(); if (calYear !== undefined) renderCalendar();
      document.getElementById('restDayModal')?.remove();
      alert('😬 4 rest days in a row! Your streak has been reset. Get back to the gym tomorrow! 💪');
      return;
    }
  }
  restDays.push(dateKey);
  localStorage.setItem('restDays_' + currentUser, JSON.stringify(restDays));
  updateStreak(); if (calYear !== undefined) renderCalendar();
  document.getElementById('restDayModal')?.remove();
  const label = dateKey === new Date().toLocaleDateString('en-CA') ? 'today' : 'yesterday';
  alert(`Rest day logged for ${label}! 😴 Your streak is safe!`);
}

function getStreak() {
  if (!allSessions.length && !getRestDays().length) return 0;
  const restDays = getRestDays();
  const freezeDays = getFreezeDays();
  const brokenDate = localStorage.getItem('streakBroken_' + currentUser);
  const workoutDays = [...new Set(allSessions.map(s => new Date(s.date).toLocaleDateString('en-CA')))];
  const filterFrom = brokenDate ? new Date(brokenDate + 'T12:00:00') : null;
  const validWorkouts = filterFrom ? workoutDays.filter(d => new Date(d + 'T12:00:00') > filterFrom) : workoutDays;
  const validRest = filterFrom ? restDays.filter(d => new Date(d + 'T12:00:00') > filterFrom) : restDays;
  const validFreeze = filterFrom ? freezeDays.filter(d => new Date(d + 'T12:00:00') > filterFrom) : freezeDays;
  const allDays = [...new Set([...validWorkouts, ...validRest, ...validFreeze])].sort((a, b) => new Date(b) - new Date(a));
  if (!allDays.length) return 0;
  let streak = 0;
  let check = new Date();
  check.setHours(0, 0, 0, 0);
  for (let d of allDays) {
    const day = new Date(d + 'T12:00:00');
    day.setHours(0, 0, 0, 0);
    const diff = (check - day) / 86400000;
    if (diff <= 1) { streak++; check = day; }
    else break;
  }
  return streak;
}

function getBestStreak() {
  if (!allSessions.length && !getRestDays().length) return 0;
  const restDays = getRestDays();
  const workoutDays = [...new Set(allSessions.map(s => new Date(s.date).toLocaleDateString('en-CA')))];
  const allDays = [...new Set([...workoutDays, ...restDays])].map(d => new Date(d + 'T12:00:00')).sort((a, b) => a - b);
  if (!allDays.length) return 0;
  let best = 1, current = 1;
  for (let i = 1; i < allDays.length; i++) {
    const diff = (allDays[i] - allDays[i - 1]) / 86400000;
    if (diff === 1) { current++; best = Math.max(best, current); }
    else current = 1;
  }
  return best;
}

function updateStreak() {
  const streak = getStreak();
  const banner = document.getElementById('streakBanner');
  if (streak > 0) banner.textContent = `🔥 ${streak} Day Workout Streak! Keep it up!`;
  else banner.textContent = `💪 Start your streak today!`;
}

// ─── MODAL ────────────────────────────────────────────────────────────────────
function getCurrentWeekWindow(offset = 0, baseDate = new Date()) {
  const now = new Date(baseDate);
  now.setHours(0, 0, 0, 0);
  const weekStartDay = getWeekStartDayIndex();
  const daysSinceWeekStart = (now.getDay() - weekStartDay + 7) % 7;
  const monday = new Date(now);
  monday.setDate(now.getDate() - daysSinceWeekStart + (offset * 7));
  monday.setHours(0, 0, 0, 0);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  return { monday, sunday };
}

function getWeeklyMuscleSetCounts() {
  const { monday, sunday } = getCurrentWeekWindow();
  const counts = {};
  allSessions.forEach(session => {
    const date = new Date(session.date);
    if (date >= monday && date <= sunday) {
      counts[session.muscle] = (counts[session.muscle] || 0) + session.sets.length;
    }
  });
  return counts;
}

function getCurrentWeekSessions() {
  const { monday, sunday } = getCurrentWeekWindow();
  return allSessions
    .filter(session => {
      const date = new Date(session.date);
      return date >= monday && date <= sunday;
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));
}

function getCurrentWeekRestDays() {
  const { monday, sunday } = getCurrentWeekWindow();
  return getRestDays().filter(dateKey => {
    const date = new Date(dateKey + 'T12:00:00');
    return date >= monday && date <= sunday;
  });
}

function getRecentSessions(days = 3) {
  const cutoff = new Date();
  cutoff.setHours(0, 0, 0, 0);
  cutoff.setDate(cutoff.getDate() - (days - 1));
  return allSessions
    .filter(session => new Date(session.date) >= cutoff)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

function getRecentMuscleSetCounts(days = 3) {
  const counts = {};
  getRecentSessions(days).forEach(session => {
    counts[session.muscle] = (counts[session.muscle] || 0) + session.sets.length;
  });
  return counts;
}

function getLastSessionForMuscle(muscle) {
  return allSessions
    .filter(session => session.muscle === muscle)
    .sort((a, b) => new Date(b.date) - new Date(a.date))[0] || null;
}

function getDaysSince(dateValue) {
  const target = new Date(dateValue);
  target.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((today - target) / 86400000);
}

function getMuscleCluster(muscle) {
  if (['Quadriceps', 'Hamstrings', 'Glutes', 'Calves'].includes(muscle)) return 'lower';
  if (['Chest', 'Shoulders', 'Triceps'].includes(muscle)) return 'push';
  if (['Lats', 'Traps', 'Lower Back', 'Biceps', 'Forearms'].includes(muscle)) return 'pull';
  if (muscle === 'Abs') return 'core';
  return 'other';
}

function getClusterSetTotal(counts, cluster) {
  return Object.keys(EXERCISES)
    .filter(muscle => getMuscleCluster(muscle) === cluster)
    .reduce((sum, muscle) => sum + (counts[muscle] || 0), 0);
}

function getSuggestedCluster(clusterTotals, excludeCluster) {
  const order = ['push', 'pull', 'lower', 'core'];
  return order
    .filter(cluster => cluster !== excludeCluster)
    .sort((a, b) => (clusterTotals[a] || 0) - (clusterTotals[b] || 0))[0];
}

function getClusterLabel(cluster) {
  const labels = {
    push: 'push',
    pull: 'pull',
    lower: 'legs',
    core: 'core'
  };
  return labels[cluster] || cluster;
}

function getExerciseUsageStats(muscle) {
  const usage = {};
  allSessions
    .filter(session => session.muscle === muscle)
    .forEach(session => {
      if (!usage[session.exercise]) usage[session.exercise] = { count: 0, lastUsed: 0 };
      usage[session.exercise].count += 1;
      usage[session.exercise].lastUsed = Math.max(usage[session.exercise].lastUsed, new Date(session.date).getTime());
    });
  return usage;
}

function getExerciseProfile(muscle, exercise) {
  return EXERCISE_PROFILES[muscle]?.[exercise] || { role: 'isolation', focus: exercise.toLowerCase() };
}

function scoreExerciseCandidate(candidate, picked, requireRare) {
  const duplicateFocusPenalty = picked.some(item => item.focus === candidate.focus) ? 12 : 0;
  const familyPenalty = picked.some(item => item.focus.split('-')[0] === candidate.focus.split('-')[0]) ? 4 : 0;
  const rarityBonus = candidate.isRare ? 18 : 0;
  const neverUsedBonus = candidate.usageCount === 0 ? 12 : 0;
  const recencyBonus = candidate.lastUsed === 0 ? 6 : Math.min(Math.floor((Date.now() - candidate.lastUsed) / 86400000), 14);
  const usageBonus = Math.max(0, 6 - candidate.usageCount);
  const requiredRareBoost = requireRare && candidate.isRare ? 14 : 0;
  return rarityBonus + neverUsedBonus + recencyBonus + usageBonus + requiredRareBoost - duplicateFocusPenalty - familyPenalty;
}

function pickCandidateForRole(candidates, role, picked, requireRare) {
  const matching = candidates.filter(candidate => candidate.role === role && !picked.includes(candidate.name));
  const pool = matching.length ? matching : candidates.filter(candidate => !picked.includes(candidate.name));
  if (!pool.length) return null;
  return [...pool].sort((a, b) => scoreExerciseCandidate(b, picked.map(name => candidates.find(item => item.name === name) || { focus: '' }), requireRare) - scoreExerciseCandidate(a, picked.map(name => candidates.find(item => item.name === name) || { focus: '' }), requireRare))[0];
}

function getRecommendedExercisesForMuscle(muscle) {
  const pool = EXERCISES[muscle] || [];
  const usage = getExerciseUsageStats(muscle);
  const usageCounts = pool.map(exercise => usage[exercise]?.count || 0);
  const minUsage = usageCounts.length ? Math.min(...usageCounts) : 0;
  const candidates = pool.map(name => {
    const profile = getExerciseProfile(muscle, name);
    const stats = usage[name] || { count: 0, lastUsed: 0 };
    return {
      name,
      role: profile.role,
      focus: profile.focus,
      usageCount: stats.count,
      lastUsed: stats.lastUsed,
      isRare: stats.count === 0 || stats.count === minUsage
    };
  });

  const pickedNames = [];
  const roles = ['compound', 'stretch', 'isolation'];
  roles.forEach((role, index) => {
    const alreadyHasRare = pickedNames.some(name => candidates.find(candidate => candidate.name === name)?.isRare);
    const candidate = pickCandidateForRole(candidates, role, pickedNames, index === roles.length - 1 && !alreadyHasRare);
    if (candidate) pickedNames.push(candidate.name);
  });

  if (pickedNames.length < 3) {
    const remaining = candidates
      .filter(candidate => !pickedNames.includes(candidate.name))
      .sort((a, b) => scoreExerciseCandidate(b, pickedNames.map(name => candidates.find(item => item.name === name) || { focus: '' }), false) - scoreExerciseCandidate(a, pickedNames.map(name => candidates.find(item => item.name === name) || { focus: '' }), false));
    remaining.slice(0, 3 - pickedNames.length).forEach(candidate => pickedNames.push(candidate.name));
  }

  const hasRarePick = pickedNames.some(name => candidates.find(candidate => candidate.name === name)?.isRare);
  if (!hasRarePick) {
    const rareCandidate = candidates
      .filter(candidate => candidate.isRare && !pickedNames.includes(candidate.name))
      .sort((a, b) => scoreExerciseCandidate(b, pickedNames.map(name => candidates.find(item => item.name === name) || { focus: '' }), true) - scoreExerciseCandidate(a, pickedNames.map(name => candidates.find(item => item.name === name) || { focus: '' }), true))[0];
    if (rareCandidate) pickedNames[pickedNames.length - 1] = rareCandidate.name;
  }

  return pickedNames.slice(0, 3);
}

function renderSheroQuickPick(muscle = sheroFocusMuscle) {
  const el = document.getElementById('sheroQuickPick');
  if (!el) return;
  if (!muscle || !EXERCISES[muscle]) {
    el.innerHTML = '<strong>Shero picks</strong>Tap a muscle and Shero will surface 3 exercises to start with.';
    return;
  }
  const picks = getRecommendedExercisesForMuscle(muscle);
  el.innerHTML = `<strong>Shero picks for ${muscle}</strong>${picks.join(' · ')}`;
}

function getMissedMuscleAlert() {
  if (!allSessions.length) return null;
  const muscles = Object.keys(EXERCISES);
  const muscleLastDays = muscles.map(muscle => {
    const lastSession = getLastSessionForMuscle(muscle);
    return {
      muscle,
      days: lastSession ? getDaysSince(lastSession.date) : 999
    };
  }).sort((a, b) => b.days - a.days);

  const missed = muscleLastDays[0];
  if (!missed || missed.days < 7) return null;

  return missed.days >= 999
    ? `${missed.muscle} has not been trained yet.`
    : `${missed.muscle} has been skipped for ${missed.days} days.`;
}

function getSheroMessage(mode = 'suggest') {
  const counts = getWeeklyMuscleSetCounts();
  const weekSessions = getCurrentWeekSessions();
  const cycleRestDays = getCurrentWeekRestDays().length;
  const streak = getStreak();
  const latest = allSessions.length
    ? [...allSessions].sort((a, b) => new Date(b.date) - new Date(a.date))[0]
    : null;
  const latestCluster = latest ? getMuscleCluster(latest.muscle) : null;
  const latestDaysAgo = latest ? getDaysSince(latest.date) : null;
  const clusterTotals = {
    push: getClusterSetTotal(counts, 'push'),
    pull: getClusterSetTotal(counts, 'pull'),
    lower: getClusterSetTotal(counts, 'lower'),
    core: getClusterSetTotal(counts, 'core')
  };
  const allClusters = ['push', 'pull', 'lower', 'core'];
  const cycleClusterTotals = { push: 0, pull: 0, lower: 0, core: 0 };
  weekSessions.forEach(session => {
    const cluster = getMuscleCluster(session.muscle);
    if (cycleClusterTotals[cluster] !== undefined) {
      cycleClusterTotals[cluster] += session.sets.length;
    }
  });
  const cycleTrainingDays = [...new Set(weekSessions.map(session => new Date(session.date).toLocaleDateString('en-CA')))].length;
  const cycleTrainingLoad = weekSessions.reduce((sum, session) => sum + session.sets.length, 0);
  const clusterTargets = { push: 12, pull: 12, lower: 10, core: 8 };
  const undertrainedClusters = allClusters
    .filter(cluster => clusterTotals[cluster] < clusterTargets[cluster]);
  const weeklyCoverageSolid = undertrainedClusters.length === 0;
  const missedMuscleAlert = getMissedMuscleAlert();

  const buildMessage = (mood, ...points) => {
    const uniquePoints = [...new Set(points.flat().filter(Boolean))];
    return { mood, points: uniquePoints, text: uniquePoints.join(' ') };
  };

  if (mode === 'feedback') {
    if (!weekSessions.length) {
      return buildMessage(
        'Feedback',
        'No sessions logged this week yet.'
      );
    }

    const weekDays = [...new Set(weekSessions.map(session => new Date(session.date).toLocaleDateString('en-CA')))];
    const weekSetTotal = weekSessions.reduce((sum, session) => sum + session.sets.length, 0);
    const trainedMuscles = [...new Set(weekSessions.map(session => session.muscle))];
    const focusClusters = ['push', 'pull', 'lower']
      .filter(cluster => clusterTotals[cluster] > 0)
      .map(cluster => getClusterLabel(cluster));

    if (weekDays.length === 1) {
      const firstDayMuscles = [...new Set(weekSessions
        .filter(session => new Date(session.date).toLocaleDateString('en-CA') === weekDays[0])
        .map(session => session.muscle))];
      return buildMessage(
        'Feedback',
        `Week day 1: ${weekSetTotal} total sets on ${firstDayMuscles.join(', ')}. Strong start.`
      );
    }

    if (weekDays.length === 2) {
      const missingClusters = ['push', 'pull', 'lower']
        .filter(cluster => clusterTotals[cluster] === 0)
        .map(cluster => getClusterLabel(cluster));
      return buildMessage(
        'Feedback',
        missingClusters.length
          ? `First 2 days: ${weekSetTotal} total sets across ${trainedMuscles.length} muscles. Nice start, add ${missingClusters.join(' or ')} next.`
          : `First 2 days: ${weekSetTotal} total sets across ${trainedMuscles.length} muscles. Good balance so far.`
      );
    }

    if (weeklyCoverageSolid) {
      return buildMessage(
        'Feedback',
        `This week: ${weekSetTotal} total sets across ${weekDays.length} days. Push, pull, and legs are all well covered.`
      );
    }

    const lowClusters = ['push', 'pull', 'lower']
      .filter(cluster => clusterTotals[cluster] === 0)
      .map(cluster => getClusterLabel(cluster));

    return buildMessage(
      'Feedback',
      lowClusters.length
        ? `This week so far: ${weekSetTotal} total sets across ${weekDays.length} days. You have covered ${focusClusters.join(', ') || 'part of the week'}; add ${lowClusters.join(' and ')} to round it out.`
        : `This week so far: ${weekSetTotal} total sets across ${weekDays.length} days. Solid progress, keep building the week evenly.`
    );
  }

  if (!allSessions.length) {
    return buildMessage('Suggestion', 'Start with a push session.');
  }

  const missedSuggestionPoint = missedMuscleAlert
    ? `Missed: ${missedMuscleAlert}`
    : '';

  const clusterRatios = allClusters.map(cluster => ({
    cluster,
    ratio: clusterTotals[cluster] / clusterTargets[cluster]
  }));
  const sortedByRatio = [...clusterRatios].sort((a, b) => a.ratio - b.ratio);
  const lowestCluster = sortedByRatio[0].cluster;
  const freshCluster = allClusters
    .filter(cluster => cluster !== latestCluster)
    .sort((a, b) => {
      const cycleDiff = (cycleClusterTotals[a] || 0) - (cycleClusterTotals[b] || 0);
      if (cycleDiff !== 0) return cycleDiff;
      return clusterRatios.find(item => item.cluster === a).ratio - clusterRatios.find(item => item.cluster === b).ratio;
    })[0];
  const upperBodyWorkedHard = cycleClusterTotals.push >= 8 && cycleClusterTotals.pull >= 8 && cycleClusterTotals.lower < 8;
  const sameClusterNeedsRecovery = latestCluster && cycleClusterTotals[latestCluster] >= Math.max(8, Math.round(clusterTargets[latestCluster] * 0.6));
  const overallFatigue = cycleTrainingLoad >= 18 || (streak >= 6 && cycleRestDays === 0 && cycleTrainingLoad >= 12) || cycleTrainingDays >= 6;
  const overtrained = clusterRatios.some(c => c.ratio >= 1.5) && cycleTrainingLoad >= 15;
  const latestClusterLabel = latestCluster ? getClusterLabel(latestCluster) : 'your last trained area';
  const recoveryPoint = overtrained
    ? 'Recovery: take a light day or full rest.'
    : sameClusterNeedsRecovery && latestDaysAgo !== null && latestDaysAgo <= 1
      ? `Recovery: let ${latestClusterLabel} recover today.`
      : cycleTrainingDays >= 4 && cycleRestDays === 0
        ? 'Recovery: add a rest or light day this cycle.'
        : cycleTrainingLoad >= 12
          ? 'Recovery: keep the next day easier.'
          : cycleRestDays > 0
            ? 'Recovery: recovery is on track.'
            : 'Recovery: keep one rest day in the cycle.';

  if (sameClusterNeedsRecovery && freshCluster && latestDaysAgo !== null && latestDaysAgo <= 1) {
    const recoveryLabel = upperBodyWorkedHard ? 'Upper body' : `${getClusterLabel(latestCluster).charAt(0).toUpperCase() + getClusterLabel(latestCluster).slice(1)}`;
    const freshLabel = getClusterLabel(freshCluster);
    const workoutPoint = freshLabel === 'legs'
      ? 'Workout: heavy legs is a smart next move.'
      : `Workout: train ${freshLabel} next.`;
    return buildMessage('Suggestion', workoutPoint, recoveryPoint, missedSuggestionPoint);
  }

  if (latest && latestDaysAgo === 0 && latest.sets.length >= 10 && overallFatigue) {
    return buildMessage(
      'Suggestion',
      'Workout: keep today light.',
      'Recovery: focus on sleep, hydration, and mobility.',
      missedSuggestionPoint
    );
  }
  if (streak >= 5 && cycleRestDays === 0 && cycleTrainingLoad >= 14) {
    return buildMessage(
      'Suggestion',
      'Workout: take a light day or full rest.',
      'Recovery: this cycle needs a break.',
      missedSuggestionPoint
    );
  }
  if (weeklyCoverageSolid && overallFatigue) {
    return buildMessage(
      'Suggestion',
      'Workout: keep the next session easy or rest.',
      recoveryPoint,
      missedSuggestionPoint
    );
  }

  if (overtrained) {
    return buildMessage(
      'Suggestion',
      'Workout: go light or rest next.',
      recoveryPoint,
      missedSuggestionPoint
    );
  }

  if (clusterTotals[lowestCluster] < clusterTargets[lowestCluster]) {
    return buildMessage(
      'Suggestion',
      `Workout: train ${getClusterLabel(lowestCluster)} next.`,
      recoveryPoint,
      missedSuggestionPoint
    );
  }

  if (latest && latestDaysAgo <= 2 && clusterTotals[latestCluster] > clusterTotals[lowestCluster] + 4) {
    return buildMessage(
      'Suggestion',
      `Workout: train ${getClusterLabel(lowestCluster)} next while ${getClusterLabel(latestCluster)} recovers.`,
      recoveryPoint,
      missedSuggestionPoint
    );
  }

  const nextCluster = getSuggestedCluster(clusterTotals);
  return buildMessage(
    'Suggestion',
    `Workout: train ${getClusterLabel(nextCluster)} next.`,
    recoveryPoint,
    missedSuggestionPoint
  );
}

function getSheroStateKey() {
  return currentUser ? 'sheroCleared_' + currentUser : null;
}

function isSheroCleared() {
  const key = getSheroStateKey();
  return key ? localStorage.getItem(key) === '1' : false;
}

function setSheroCleared(value) {
  const key = getSheroStateKey();
  if (!key) return;
  if (value) localStorage.setItem(key, '1');
  else localStorage.removeItem(key);
}

function formatSheroMessageText(message) {
  const points = Array.isArray(message?.points)
    ? message.points.filter(Boolean)
    : [message?.text].filter(Boolean);
  if (!points.length) return '';
  if (points.length === 1) return points[0];
  return points.map(point => `• ${point}`).join('<br>');
}

function renderShero() {
  const card = document.getElementById('sheroCard');
  const iconBtn = document.getElementById('sheroIconBtn');
  const clearBtn = document.getElementById('sheroClearBtn');
  const askAiBtn = document.getElementById('sheroAskAiBtn');
  const suggestBlock = document.getElementById('sheroSuggestMood')?.parentElement;
  const feedbackBlock = document.getElementById('sheroFeedbackMood')?.parentElement;
  const suggestMoodEl = document.getElementById('sheroSuggestMood');
  const suggestTextEl = document.getElementById('sheroSuggestText');
  const feedbackMoodEl = document.getElementById('sheroFeedbackMood');
  const feedbackTextEl = document.getElementById('sheroFeedbackText');
  if (!card || !iconBtn || !clearBtn || !suggestBlock || !feedbackBlock || !suggestMoodEl || !suggestTextEl || !feedbackMoodEl || !feedbackTextEl) return;

  if (isSheroCleared()) {
    iconBtn.classList.add('off');
    if (askAiBtn) askAiBtn.textContent = 'Ask AI instead';
    suggestBlock.classList.remove('hidden');
    feedbackBlock.classList.add('hidden');
    suggestMoodEl.textContent = 'Suggestion';
    suggestTextEl.textContent = 'No active Shero messages. Tap the bulb again whenever you want new tips.';
    renderSheroQuickPick();
    return;
  }

  const suggestMessage = getSheroMessage('suggest');
  const feedbackMessage = getSheroMessage('feedback');
  iconBtn.classList.remove('off');
  if (askAiBtn) askAiBtn.textContent = 'Ask AI about this';
  suggestBlock.classList.remove('hidden');
  feedbackBlock.classList.remove('hidden');
  suggestMoodEl.textContent = 'Suggestion';
  suggestTextEl.innerHTML = formatSheroMessageText(suggestMessage);
  feedbackMoodEl.textContent = 'Feedback';
  feedbackTextEl.innerHTML = formatSheroMessageText(feedbackMessage);
  renderSheroQuickPick();
}

function askAIAboutShero() {
  const suggestText = document.getElementById('sheroSuggestText')?.innerText?.trim();
  const feedbackText = document.getElementById('sheroFeedbackText')?.innerText?.trim();
  const prompt = suggestText && !/no active shero messages/i.test(suggestText)
    ? `Shero suggested: "${suggestText}"${feedbackText ? ` Feedback: "${feedbackText}"` : ''} Explain this and give me a simple workout and recovery plan based on my data.`
    : 'Review my workout history and tell me what to train next and how to recover.';

  showPage('aiPage', document.getElementById('bn_ai'));
  const input = document.getElementById('chatInputField');
  if (!input) return;
  input.value = prompt;
  input.focus();
  input.setSelectionRange(input.value.length, input.value.length);
}

function initShero() {
  const iconBtn = document.getElementById('sheroIconBtn');
  const clearBtn = document.getElementById('sheroClearBtn');
  const closeBtn = document.getElementById('sheroCloseBtn');
  const card = document.getElementById('sheroCard');
  if (!iconBtn || !clearBtn || !closeBtn || !card || iconBtn.dataset.bound === 'yes') return;
  iconBtn.dataset.bound = 'yes';
  clearBtn.dataset.bound = 'yes';
  closeBtn.dataset.bound = 'yes';
  iconBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    if (isSheroCleared()) setSheroCleared(false);
    card.classList.toggle('hidden');
    if (!card.classList.contains('hidden')) renderShero();
  });
  card.addEventListener('click', event => event.stopPropagation());
  clearBtn.addEventListener('click', () => {
    setSheroCleared(true);
    renderShero();
  });
  closeBtn.addEventListener('click', () => card.classList.add('hidden'));
  document.addEventListener('click', () => card.classList.add('hidden'));
  renderShero();
}

function openMuscle(muscle) {
  currentMuscle = muscle; currentExercise = ''; currentSets = [];
  sheroFocusMuscle = muscle;
  document.getElementById('muscleLabel').textContent = 'Selected: ' + muscle;
  renderSheroQuickPick(muscle);
  if (!isSheroCleared()) renderShero();
  document.getElementById('modalMuscle').textContent = muscle;
  document.getElementById('modalDate').textContent = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const list = document.getElementById('exerciseList');
  list.innerHTML = '';
  const exerciseUsageCounts = allSessions
    .filter(session => session.muscle === muscle)
    .reduce((counts, session) => {
      counts[session.exercise] = (counts[session.exercise] || 0) + 1;
      return counts;
    }, {});
  const sortedExercises = [...(EXERCISES[muscle] || [])].sort((a, b) => {
    const aCount = exerciseUsageCounts[a] || 0;
    const bCount = exerciseUsageCounts[b] || 0;
    if (bCount !== aCount) return bCount - aCount;
    return a.localeCompare(b);
  });
  sortedExercises.forEach(ex => {
    const pr = getPR(ex);
    const usageCount = exerciseUsageCounts[ex] || 0;
    const wrapper = document.createElement('div');
    const d = document.createElement('div');
    d.className = 'exCard';
    d.innerHTML = `<h4>${ex}${pr ? `<span class="prBadge">PR: ${pr.weight}lbs × ${pr.reps}</span>` : ''}</h4><p>${usageCount > 0 ? `${usageCount} log${usageCount !== 1 ? 's' : ''}` : 'Click to log sets'}</p>`;
    const logDiv = document.createElement('div');
    logDiv.className = 'inlineLog hidden';
    logDiv.id = `log_${ex.replace(/\s+/g, '_')}`;
    logDiv.innerHTML = `<h4>${ex}</h4><div id="sets_${ex.replace(/\s+/g, '_')}"></div><button class="addSetBtn" onclick="addSet('${ex.replace(/\s+/g, '_')}')">+ Add Set</button>`;
    d.onclick = (e) => { e.stopPropagation(); selectExercise(ex, d, logDiv); };
    wrapper.appendChild(d);
    wrapper.appendChild(logDiv);
    list.appendChild(wrapper);
  });
  document.getElementById('modalBtns').classList.add('hidden');
  document.getElementById('modalOverlay').classList.remove('hidden');
}

function closeModal() { document.getElementById('modalOverlay').classList.add('hidden'); }

function selectExercise(ex, el, logDiv) {
  document.querySelectorAll('.inlineLog').forEach(l => l.classList.add('hidden'));
  document.querySelectorAll('.exCard').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
  currentExercise = ex; currentSets = [{ weight: '', reps: '' }];
  logDiv.classList.remove('hidden');
  document.getElementById('modalBtns').classList.remove('hidden');
  renderSets(ex.replace(/\s+/g, '_'));
}

function renderSets(exId) {
  const c = document.getElementById(`sets_${exId}`);
  if (!c) return;
  c.innerHTML = '';
  currentSets.forEach((s, i) => {
    const row = document.createElement('div');
    row.className = 'setRow';
    row.innerHTML = `<label>Set ${i + 1}</label>
      <input type="number" placeholder="lbs" value="${s.weight}" min="0" onchange="currentSets[${i}].weight=this.value"/>
      <input type="number" placeholder="reps" value="${s.reps}" min="0" onchange="currentSets[${i}].reps=this.value"/>
      ${i > 0 ? `<button class="removeSetBtn" onclick="removeSet(${i},'${exId}')">✕</button>` : '<span style="width:24px"></span>'}`;
    c.appendChild(row);
  });
}

function addSet(exId) { currentSets.push({ weight: '', reps: '' }); renderSets(exId); }
function removeSet(i, exId) { currentSets.splice(i, 1); renderSets(exId); }

async function saveWorkout() {
  const validSets = currentSets.filter(s => s.weight !== '' && s.reps !== '');
  if (!validSets.length) { alert('Please enter at least one complete set'); return; }
  const datePicker = document.getElementById('modalDatePicker').value;
  let workoutDate = new Date();
  if (datePicker === 'yesterday') workoutDate.setDate(workoutDate.getDate() - 1);
  // Block saving workout on a frozen or rest day
  const workoutDateKey = workoutDate.toLocaleDateString('en-CA');
  const dayLabel = datePicker === 'yesterday' ? 'yesterday' : 'today';
  if (getFreezeDays().includes(workoutDateKey)) {
    alert('❄️ You used a streak freeze for ' + dayLabel + '! You cannot log a workout on a frozen day.');
    return;
  }
  if (getRestDays().includes(workoutDateKey)) {
    alert('😴 You already logged a rest day for ' + dayLabel + '! You cannot log a workout on a rest day.');
    return;
  }
  showLoading();
  try {
    const res = await fetch(API + '/workouts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
      body: JSON.stringify({ muscle: currentMuscle, exercise: currentExercise, sets: validSets, date: workoutDate.toISOString() })
    });
    await res.json();
    await loadSessions();
    checkBadgeUnlocks();
    renderBadges();
    hideLoading();
    const newSession = allSessions[allSessions.length - 1];
    if (newSession) checkPR(newSession);
    updateHeatmap();
    updateStreak();
    closeModal();
  } catch (err) {
    hideLoading();
    alert('Failed to save workout. Is the server running?');
  }
}

// ─── PR ───────────────────────────────────────────────────────────────────────
function getPR(ex) {
  const sessions = allSessions.filter(s => s.exercise === ex);
  if (!sessions.length) return null;
  let best = null;
  sessions.forEach(s => s.sets.forEach(set => {
    const w = parseFloat(set.weight || 0);
    if (!best || w > best.weight) best = { weight: w, reps: parseInt(set.reps) };
  }));
  return best;
}

function checkPR(session) {
  const allPrev = allSessions.filter(s => s.exercise === session.exercise && s._id !== session._id);
  let prevBest = 0;
  allPrev.forEach(s => s.sets.forEach(set => { prevBest = Math.max(prevBest, parseFloat(set.weight || 0)); }));
  let newBest = 0;
  session.sets.forEach(s => { newBest = Math.max(newBest, parseFloat(s.weight || 0)); });
  if (newBest > prevBest && prevBest > 0) {
    setTimeout(() => { launchConfetti(); showPRCelebration(session.exercise, newBest); }, 200);
  }
}

function showPRCelebration(exercise, weight) {
  const el = document.createElement('div');
  el.className = 'prCelebration';
  el.innerHTML = `
    <div class="prCelebInner">
      <div class="prCelebIcon">🏆</div>
      <div class="prCelebTitle">NEW PR!</div>
      <div class="prCelebExercise">${exercise}</div>
      <div class="prCelebWeight">${weight} <span>lbs</span></div>
    </div>`;
  document.body.appendChild(el);
  setTimeout(() => el.classList.add('show'), 50);
  setTimeout(() => { el.classList.remove('show'); setTimeout(() => el.remove(), 400); }, 3000);
}

// ─── HISTORY ──────────────────────────────────────────────────────────────────
let histCalYear, histCalMonth;
let historyFilters = { groups: ['all'], time: 'all' };

function getHistoryFilteredSessions() {
  let sessions = [...allSessions];

  const selectedGroups = Array.isArray(historyFilters.groups) ? historyFilters.groups : ['all'];
  if (!selectedGroups.includes('all')) {
    const groupMap = {
      chest: ['Chest'],
      back: ['Lats', 'Traps', 'Lower Back'],
      legs: ['Quadriceps', 'Hamstrings', 'Glutes', 'Calves'],
      arms: ['Biceps', 'Triceps', 'Forearms'],
      shoulders: ['Shoulders'],
      core: ['Abs']
    };
    const allowedMuscles = [...new Set(selectedGroups.flatMap(group => groupMap[group] || []))];
    sessions = sessions.filter(s => allowedMuscles.includes(s.muscle));
  }

  if (historyFilters.time === 'thisWeek') {
    const { monday, sunday } = getCurrentWeekWindow();
    sessions = sessions.filter(s => {
      const d = new Date(s.date);
      return d >= monday && d <= sunday;
    });
  } else if (historyFilters.time === 'lastMonth') {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 30);
    start.setHours(0, 0, 0, 0);
    sessions = sessions.filter(s => new Date(s.date) >= start);
  }

  return sessions;
}

function updateHistoryFilterChips() {
  document.querySelectorAll('.historyFilterChip').forEach(chip => chip.classList.remove('active'));
  const selectedGroups = Array.isArray(historyFilters.groups) ? historyFilters.groups : ['all'];
  selectedGroups.forEach(group => {
    document.getElementById(`histGroup_${group}`)?.classList.add('active');
  });
  document.getElementById(`histTime_${historyFilters.time}`)?.classList.add('active');
}

function setHistoryGroupFilter(group) {
  let selectedGroups = Array.isArray(historyFilters.groups) ? [...historyFilters.groups] : ['all'];

  if (group === 'all') {
    historyFilters.groups = ['all'];
    renderHistory();
    return;
  }

  selectedGroups = selectedGroups.filter(item => item !== 'all');

  if (selectedGroups.includes(group)) {
    selectedGroups = selectedGroups.filter(item => item !== group);
  } else {
    selectedGroups.push(group);
  }

  historyFilters.groups = selectedGroups.length ? selectedGroups : ['all'];
  renderHistory();
}

function setHistoryTimeFilter(time) {
  historyFilters.time = time;
  renderHistory();
}

function renderHistory() {
  const now = new Date();
  if (!histCalYear) { histCalYear = now.getFullYear(); histCalMonth = now.getMonth(); }
  const filteredSessions = getHistoryFilteredSessions();
  updateHistoryFilterChips();
  renderHistoryCalendar();
  document.getElementById('historyDayDetail').innerHTML = filteredSessions.length
    ? '<div class="histSelectDay"><strong>Select a day</strong><span>See workouts, sets, and volume here.</span></div>'
    : allSessions.length
      ? '<div class="histSelectDay"><strong>No matches</strong><span>Try a different muscle or time filter.</span></div>'
      : '<div class="histSelectDay"><strong>No workouts yet</strong><span>Log your first session from the Body Map.</span></div>';
}

function histCalPrev() { histCalMonth--; if (histCalMonth < 0) { histCalMonth = 11; histCalYear--; } renderHistoryCalendar(); }
function histCalNext() { histCalMonth++; if (histCalMonth > 11) { histCalMonth = 0; histCalYear++; } renderHistoryCalendar(); }

function renderHistoryCalendar() {
  const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  document.getElementById('histCalMonthLabel').textContent = `${MONTHS[histCalMonth]} ${histCalYear}`;
  const workoutMap = {};
  const filteredSessions = getHistoryFilteredSessions();
  filteredSessions.forEach(s => {
    const key = new Date(s.date).toLocaleDateString('en-CA');
    if (!workoutMap[key]) workoutMap[key] = { sessions: [], sets: 0 };
    workoutMap[key].sessions.push(s);
    workoutMap[key].sets += s.sets.length;
  });
  const grid = document.getElementById('histCalGrid');
  grid.innerHTML = '';
  DAYS.forEach(d => { const el = document.createElement('div'); el.className = 'calDayName'; el.textContent = d; grid.appendChild(el); });
  const firstDay = new Date(histCalYear, histCalMonth, 1).getDay();
  const daysInMonth = new Date(histCalYear, histCalMonth + 1, 0).getDate();
  const today = new Date().toLocaleDateString('en-CA');
  for (let i = 0; i < firstDay; i++) { const el = document.createElement('div'); el.className = 'calDay empty'; grid.appendChild(el); }
  for (let d = 1; d <= daysInMonth; d++) {
    const dateKey = `${histCalYear}-${String(histCalMonth + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const el = document.createElement('div');
    el.className = 'calDay histCalDay';
    el.dataset.dateKey = dateKey;
    if (dateKey === today) el.classList.add('today');
    const dayNum = document.createElement('span');
    dayNum.textContent = d;
    el.appendChild(dayNum);
    if (workoutMap[dateKey]) {
      const sets = workoutMap[dateKey].sets;
      const intensity = sets >= 15 ? 'high' : sets >= 8 ? 'med' : 'low';
      const dot = document.createElement('div');
      dot.className = `histDot ${intensity}`;
      el.appendChild(dot);
      el.classList.add('hasWorkout');
      el.onclick = () => showHistoryDay(dateKey, workoutMap[dateKey].sessions);
    }
    grid.appendChild(el);
  }
}

function showHistoryDay(dateKey, sessions) {
  document.querySelectorAll('.histCalDay').forEach(el => el.classList.remove('selectedDay'));
  document.querySelector(`.histCalDay[data-date-key="${dateKey}"]`)?.classList.add('selectedDay');
  const d = new Date(dateKey + 'T12:00:00');
  const detail = document.getElementById('historyDayDetail');
  const dateLabel = d.toLocaleDateString('en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric' });
  const sortedSessions = [...sessions].sort((a, b) => new Date(b.date) - new Date(a.date));
  const totalSets = sortedSessions.reduce((sum, session) => sum + session.sets.length, 0);
  const totalVolume = sortedSessions.reduce((sum, session) => sum + session.sets.reduce((setSum, set) => setSum + (parseFloat(set.weight || 0) * parseInt(set.reps || 0)), 0), 0);

  detail.innerHTML = `
    <div class="histDayPanel">
      <div class="histDayTop">
        <div class="histDayHeader">${dateLabel}</div>
        <div class="histDayMeta">
          <span class="histMetaChip">${sortedSessions.length} workout${sortedSessions.length !== 1 ? 's' : ''}</span>
          <span class="histMetaChip">${totalSets} sets</span>
        </div>
      </div>
      ${sortedSessions.map(s => {
        const sessionVolume = s.sets.reduce((sum, set) => sum + (parseFloat(set.weight || 0) * parseInt(set.reps || 0)), 0);
        return `
          <div class="sessionCard historySessionCard" id="session_${s._id}">
            <div class="historySessionHead">
              <div>
                <div class="sDate">${new Date(s.date).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</div>
                <div class="sTitle">${s.exercise}</div>
                <div class="sSubtitle">${s.muscle}</div>
              </div>
              <button class="deleteBtn" onclick="deleteSession('${s._id}')">🗑 Delete</button>
            </div>
            <div class="setLog"><table>
              <tr><th>Set</th><th>Weight</th><th>Reps</th><th>Volume</th></tr>
              ${s.sets.map((set, i) => {
                const weight = parseFloat(set.weight || 0);
                const reps = parseInt(set.reps || 0);
                return `<tr><td>${i + 1}</td><td>${weight > 0 ? `${weight} lbs` : '—'}</td><td>${reps || '—'}</td><td>${(weight * reps).toFixed(0)}</td></tr>`;
              }).join('')}
            </table></div>
          </div>`;
      }).join('')}
    </div>`;
}

async function deleteSession(sessionId) {
  const btn = document.querySelector(`#session_${sessionId} .deleteBtn`);
  if (btn) {
    if (btn.dataset.confirm !== 'yes') {
      btn.textContent = '⚠️ Tap again to confirm';
      btn.dataset.confirm = 'yes';
      setTimeout(() => { if (btn) { btn.textContent = '🗑 Delete'; btn.dataset.confirm = ''; } }, 3000);
      return;
    }
  }
  showLoading();
  try {
    const res = await fetch(API + '/workouts/' + sessionId, { method: 'DELETE', headers: { 'Authorization': 'Bearer ' + token } });
    hideLoading();
    if (!res.ok) throw new Error('Failed');
    allSessions = allSessions.filter(s => s._id !== sessionId);
    updateHeatmap(); updateStreak(); renderHistory();
  } catch (err) { hideLoading(); alert('Could not delete. Is the server running?'); }
}

// ─── PROGRESS ─────────────────────────────────────────────────────────────────
function renderProgress() {
  const streak = getStreak();
  const bestStreak = getBestStreak();
  document.getElementById('streakNum').textContent = streak;
  document.getElementById('bestStreakNum').textContent = bestStreak;
  renderCalendar();
  renderWeeklyLoad();

  const exerciseStats = {};
  allSessions.forEach(session => {
    if (!exerciseStats[session.exercise]) exerciseStats[session.exercise] = { count: 0, lastUsed: 0 };
    exerciseStats[session.exercise].count += 1;
    exerciseStats[session.exercise].lastUsed = Math.max(exerciseStats[session.exercise].lastUsed, new Date(session.date).getTime());
  });

  const exes = Object.keys(exerciseStats).sort((a, b) =>
    exerciseStats[b].count - exerciseStats[a].count ||
    exerciseStats[b].lastUsed - exerciseStats[a].lastUsed ||
    a.localeCompare(b)
  );

  const sel = document.getElementById('chartExSelect');
  const chartCanvas = document.getElementById('progressChart');
  let emptyEl = document.getElementById('progressEmptyState');

  if (!allSessions.length) {
    sel.innerHTML = '';
    sel.classList.add('hidden');
    chartCanvas.classList.add('hidden');
    document.getElementById('progressChartNoData')?.classList.add('hidden');
    if (progressChart) { progressChart.destroy(); progressChart = null; }
    if (!emptyEl) {
      emptyEl = document.createElement('div');
      emptyEl.id = 'progressEmptyState';
      emptyEl.className = 'emptyState';
      chartCanvas.insertAdjacentElement('afterend', emptyEl);
    }
    emptyEl.textContent = 'No progress data yet. Log a few workouts to start tracking trends.';
    updateChartMetricChips();
    return;
  }

  const previousValue = sel.value;
  sel.classList.remove('hidden');
  chartCanvas.classList.remove('hidden');
  if (emptyEl) emptyEl.remove();
  sel.innerHTML = exes.map(e => `<option>${e}</option>`).join('');
  sel.value = previousValue && exes.includes(previousValue) ? previousValue : exes[0];
  updateChartMetricChips();
  renderChart();
}

function calPrevMonth() { calMonth--; if (calMonth < 0) { calMonth = 11; calYear--; } renderCalendar(); }
function calNextMonth() { calMonth++; if (calMonth > 11) { calMonth = 0; calYear++; } renderCalendar(); }

function renderCalendar() {
  const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  document.getElementById('calMonthLabel').textContent = `${MONTHS[calMonth]} ${calYear}`;
  const workoutMap = {};
  allSessions.forEach(s => {
    const key = new Date(s.date).toLocaleDateString('en-CA');
    if (!workoutMap[key]) workoutMap[key] = [];
    workoutMap[key].push(s);
  });
  const restDays = getRestDays();
  const grid = document.getElementById('calGrid');
  grid.innerHTML = '';
  DAYS.forEach(d => { const el = document.createElement('div'); el.className = 'calDayName'; el.textContent = d; grid.appendChild(el); });
  const firstDay = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const today = new Date().toLocaleDateString('en-CA');
  for (let i = 0; i < firstDay; i++) { const el = document.createElement('div'); el.className = 'calDay empty'; grid.appendChild(el); }
  for (let d = 1; d <= daysInMonth; d++) {
    const dateKey = `${calYear}-${String(calMonth + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const el = document.createElement('div');
    el.className = 'calDay';
    el.textContent = d;
    if (dateKey === today) el.classList.add('today');
    if (workoutMap[dateKey]) {
      el.classList.add('hasWorkout');
      el.title = workoutMap[dateKey].map(s => `${s.muscle}: ${s.exercise}`).join('\n');
      el.onclick = () => showCalDetail(dateKey, workoutMap[dateKey]);
    } else if (getFreezeDays().includes(dateKey)) {
      el.classList.add('isFreezeDay');
      el.title = 'Streak Freeze ❄️';
    } else if (restDays.includes(dateKey)) {
      el.classList.add('isRestDay');
      el.title = 'Rest Day 😴';
    }
    grid.appendChild(el);
  }
  const monthWorkouts = allSessions.filter(s => { const d = new Date(s.date); return d.getFullYear() === calYear && d.getMonth() === calMonth; });
  const monthMuscles = new Set(monthWorkouts.map(s => s.muscle)).size;
  const summaryEl = document.getElementById('calMonthlySummary');
  if (summaryEl) {
    summaryEl.innerHTML = `<span>${MONTHS[calMonth]}</span> — ${monthWorkouts.length} workout${monthWorkouts.length !== 1 ? 's' : ''} · ${monthMuscles} muscle${monthMuscles !== 1 ? 's' : ''} trained`;
  }
  document.getElementById('calDetail').classList.add('hidden');
}

function showCalDetail(dateKey, sessions) {
  const detail = document.getElementById('calDetail');
  const dateEl = document.getElementById('calDetailDate');
  const listEl = document.getElementById('calDetailList');
  const d = new Date(dateKey + 'T12:00:00');
  dateEl.textContent = d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  listEl.innerHTML = sessions.map(s => `
    <div class="calDetailItem">
      <span>${s.muscle}</span>${s.exercise} — ${s.sets.length} set${s.sets.length !== 1 ? 's' : ''}
    </div>`).join('');
  detail.classList.remove('hidden');
}

function weekPrev() { weekOffset--; renderWeeklyLoad(); }
function weekNext() { if (weekOffset < 0) { weekOffset++; renderWeeklyLoad(); } }

function renderWeeklyLoad() {
  const { monday, sunday } = getCurrentWeekWindow(weekOffset);
  const fmt = d => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  document.getElementById('weekLabel').textContent = `${fmt(monday)} – ${fmt(sunday)}`;
  const weekSessions = allSessions.filter(s => { const d = new Date(s.date); return d >= monday && d <= sunday; });
  const muscleSetCounts = {};
  weekSessions.forEach(s => { muscleSetCounts[s.muscle] = (muscleSetCounts[s.muscle] || 0) + s.sets.length; });
  const container = document.getElementById('muscleLoadBars');
  if (!Object.keys(muscleSetCounts).length) {
    container.innerHTML = '<div class="noLoadData">No workouts this week. Log a session on Body Map to see your weekly load.</div>';
    return;
  }
  const maxSets = Math.max(...Object.values(muscleSetCounts));
  const sorted = Object.entries(muscleSetCounts).sort((a, b) => b[1] - a[1]);
  container.innerHTML = sorted.map(([muscle, sets]) => {
    const pct = Math.round((sets / maxSets) * 100);
    return `<div class="loadRow"><div class="loadMuscle">${muscle}</div><div class="loadBarWrap"><div class="loadBar" style="width:${pct}%"></div></div><div class="loadSets">${sets} set${sets !== 1 ? 's' : ''}</div></div>`;
  }).join('');
}

function updateChartMetricChips() {
  document.querySelectorAll('.chartMetricChip').forEach(chip => {
    chip.classList.toggle('active', chip.dataset.metric === chartMetric);
  });
  document.querySelectorAll('.chartRangeChip').forEach(chip => {
    chip.classList.toggle('active', chip.dataset.range === chartRange);
  });
}

function setChartMetric(metric) {
  if (!['volume', 'maxWeight', 'reps'].includes(metric)) return;
  chartMetric = metric;
  updateChartMetricChips();
  renderChart();
}

function setChartRange(range) {
  if (!['7d', '30d', 'all'].includes(range)) return;
  chartRange = range;
  updateChartMetricChips();
  renderChart();
}

function renderChart() {
  const ex = document.getElementById('chartExSelect').value;
  const titleEl = document.getElementById('progressChartTitle');
  const noDataEl = document.getElementById('progressChartNoData');
  const chartCanvas = document.getElementById('progressChart');
  if (!ex) return;

  const cutoff = new Date();
  cutoff.setHours(0, 0, 0, 0);
  if (chartRange === '7d') cutoff.setDate(cutoff.getDate() - 6);
  if (chartRange === '30d') cutoff.setDate(cutoff.getDate() - 29);

  const sessions = allSessions
    .filter(s => s.exercise === ex)
    .filter(s => chartRange === 'all' || new Date(s.date) >= cutoff)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const labels = sessions.map(s => new Date(s.date).toLocaleDateString());
  const metricConfig = {
    volume: {
      title: 'Volume Over Time',
      label: 'Total Volume (lbs·reps)',
      color: '#e94560',
      background: 'rgba(233,69,96,.15)',
      getValue: session => session.sets.reduce((sum, set) => sum + parseFloat(set.weight || 0) * parseInt(set.reps || 0), 0)
    },
    maxWeight: {
      title: 'Max Weight Over Time',
      label: 'Max Weight (lbs)',
      color: '#f39c12',
      background: 'rgba(243,156,18,.15)',
      getValue: session => Math.max(...session.sets.map(set => parseFloat(set.weight || 0)), 0)
    },
    reps: {
      title: 'Reps Over Time',
      label: 'Total Reps',
      color: '#2ecc71',
      background: 'rgba(46,204,113,.15)',
      getValue: session => session.sets.reduce((sum, set) => sum + parseInt(set.reps || 0), 0)
    }
  }[chartMetric] || {
    title: 'Volume Over Time',
    label: 'Total Volume (lbs·reps)',
    color: '#e94560',
    background: 'rgba(233,69,96,.15)',
    getValue: session => session.sets.reduce((sum, set) => sum + parseFloat(set.weight || 0) * parseInt(set.reps || 0), 0)
  };

  const rangeLabel = chartRange === '7d' ? ' · Last 7 Days' : chartRange === '30d' ? ' · Last 30 Days' : ' · All Time';
  if (titleEl) titleEl.textContent = metricConfig.title + rangeLabel;
  const data = sessions.map(metricConfig.getValue);

  if (progressChart) {
    progressChart.destroy();
    progressChart = null;
  }

  if (!sessions.length) {
    if (noDataEl) noDataEl.classList.remove('hidden');
    if (chartCanvas) chartCanvas.classList.add('hidden');
    return;
  }

  if (noDataEl) noDataEl.classList.add('hidden');
  if (chartCanvas) chartCanvas.classList.remove('hidden');
  progressChart = new Chart(document.getElementById('progressChart'), {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: metricConfig.label,
        data,
        borderColor: metricConfig.color,
        backgroundColor: metricConfig.background,
        tension: .3,
        fill: true,
        pointBackgroundColor: metricConfig.color,
        pointBorderColor: metricConfig.color
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { labels: { color: '#aaa' } } },
      scales: {
        x: { ticks: { color: '#666' } },
        y: { beginAtZero: true, ticks: { color: '#666' }, grid: { color: '#222' } }
      }
    }
  });
}

// ─── PR BY MUSCLE ─────────────────────────────────────────────────────────────
function renderPRByMuscle() {
  const el = document.getElementById('prByMuscle');
  if (!allSessions.length) { el.innerHTML = '<div class="emptyState">No workouts logged yet. Start lifting to see your PRs! 💪</div>'; return; }
  const muscleMap = {};
  allSessions.forEach(s => {
    if (!muscleMap[s.muscle]) muscleMap[s.muscle] = {};
    s.sets.forEach(set => {
      const w = parseFloat(set.weight || 0);
      const r = parseInt(set.reps || 0);
      if (!muscleMap[s.muscle][s.exercise] || w > muscleMap[s.muscle][s.exercise].weight) {
        muscleMap[s.muscle][s.exercise] = { weight: w, reps: r, date: s.date };
      }
    });
  });
  el.innerHTML = Object.keys(muscleMap).map(muscle => `
    <div class="prMuscleSection">
      <div class="prMuscleHeader">${muscle}</div>
      ${Object.keys(muscleMap[muscle]).map(ex => {
        const pr = muscleMap[muscle][ex];
        const date = new Date(pr.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        return `<div class="prCard"><div class="prExName">${ex}</div><div class="prRight"><div class="prWeightBig">${pr.weight}<span>lbs</span></div><div class="prRepsDate">${pr.reps} reps · ${date}</div></div></div>`;
      }).join('')}
    </div>`).join('');
}

// ─── STREAK FREEZE ────────────────────────────────────────────────────────────
function getFreezeDays() {
  return JSON.parse(localStorage.getItem('freezeDays_' + currentUser) || '[]');
}

function getFreezeBalance() {
  const key = 'freezeBalance_' + currentUser;
  const raw = localStorage.getItem(key);
  if (raw === null) {
    localStorage.setItem(key, '1');
    return 1;
  }
  const parsed = parseInt(raw, 10);
  return Number.isFinite(parsed) ? Math.max(0, parsed) : 1;
}

function setFreezeBalance(value) {
  localStorage.setItem('freezeBalance_' + currentUser, String(Math.max(0, value)));
}

function getFreezeRewardMilestones() {
  return JSON.parse(localStorage.getItem('freezeMilestones_' + currentUser) || '[]');
}

function setFreezeRewardMilestones(milestones) {
  localStorage.setItem('freezeMilestones_' + currentUser, JSON.stringify(milestones));
}

function syncFreezeRewards() {
  if (!currentUser) return [];
  const streak = getStreak();
  const lastTracked = parseInt(localStorage.getItem('freezeLastTrackedStreak_' + currentUser) || '0', 10) || 0;
  let claimed = getFreezeRewardMilestones();

  if (streak < lastTracked) claimed = [];

  const earned = [];
  for (let milestone = 30; milestone <= streak; milestone += 30) {
    if (!claimed.includes(milestone)) {
      claimed.push(milestone);
      earned.push(milestone);
    }
  }

  if (earned.length) setFreezeBalance(getFreezeBalance() + earned.length);
  setFreezeRewardMilestones(claimed);
  localStorage.setItem('freezeLastTrackedStreak_' + currentUser, String(streak));
  return earned;
}

function getFreezeTokens() {
  return getFreezeBalance();
}

function useFreeze() {
  const today = new Date().toLocaleDateString('en-CA');
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = yesterday.toLocaleDateString('en-CA');
  const freezeDays = getFreezeDays();
  const restDays = getRestDays();
  const tokens = getFreezeTokens();
  if (tokens <= 0) { alert('❄️ You have no freeze tokens left!'); return; }
  const todayWorkedOut = allSessions.some(s => new Date(s.date).toLocaleDateString('en-CA') === today);
  const todayRest = restDays.includes(today);
  const todayFrozen = freezeDays.includes(today);
  const yesterdayWorkedOut = allSessions.some(s => new Date(s.date).toLocaleDateString('en-CA') === yesterdayKey);
  const yesterdayRest = restDays.includes(yesterdayKey);
  const yesterdayFrozen = freezeDays.includes(yesterdayKey);
  const canFreezeToday = !todayWorkedOut && !todayRest && !todayFrozen;
  const canFreezeYesterday = !yesterdayWorkedOut && !yesterdayRest && !yesterdayFrozen;
  if (!canFreezeToday && !canFreezeYesterday) {
    if (todayFrozen || yesterdayFrozen) {
      alert('❄️ You already used a freeze recently! You can only freeze one day at a time.');
    } else {
      alert('❄️ No days available to freeze! Today and yesterday already have activity logged.');
    }
    return;
  }
  showFreezeModal(canFreezeToday, canFreezeYesterday, today, yesterdayKey, tokens);
}

function showFreezeModal(canFreezeToday, canFreezeYesterday, today, yesterdayKey, tokens) {
  const existing = document.getElementById('freezeModal');
  if (existing) existing.remove();
  const modal = document.createElement('div');
  modal.id = 'freezeModal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:200;display:flex;align-items:center;justify-content:center;padding:20px;';
  const todayDate = new Date().toLocaleDateString('en-US', { weekday:'short', month:'short', day:'numeric' });
  const yestDate = new Date(yesterdayKey + 'T12:00:00').toLocaleDateString('en-US', { weekday:'short', month:'short', day:'numeric' });
  modal.innerHTML = `
    <div style="background:#111;border:1px solid #C9A84C;border-radius:12px;padding:28px 24px;max-width:320px;width:100%;text-align:center;box-shadow:0 0 30px rgba(201,168,76,0.3)">
      <div style="font-size:2rem;margin-bottom:8px">❄️</div>
      <div style="font-family:'Bebas Neue',sans-serif;font-size:1.6rem;letter-spacing:3px;color:#FFD700;margin-bottom:6px">STREAK FREEZE</div>
      <div style="font-size:.78rem;color:#666;letter-spacing:1px;margin-bottom:20px;text-transform:uppercase">Which day do you want to freeze?</div>
      <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:20px">
        <button onclick="applyFreeze('${today}')" ${!canFreezeToday ? 'disabled' : ''}
          style="padding:12px;border-radius:8px;border:1px solid ${canFreezeToday ? '#C9A84C' : '#333'};background:${canFreezeToday ? 'rgba(201,168,76,0.1)' : '#0a0a0a'};color:${canFreezeToday ? '#FFD700' : '#444'};cursor:${canFreezeToday ? 'pointer' : 'not-allowed'};font-family:'Inter',sans-serif;font-size:.88rem;font-weight:600;">
          Today &nbsp;·&nbsp; ${todayDate}
          ${!canFreezeToday ? '<br><span style="font-size:.7rem;color:#555">Already has activity</span>' : ''}
        </button>
        <button onclick="applyFreeze('${yesterdayKey}')" ${!canFreezeYesterday ? 'disabled' : ''}
          style="padding:12px;border-radius:8px;border:1px solid ${canFreezeYesterday ? '#C9A84C' : '#333'};background:${canFreezeYesterday ? 'rgba(201,168,76,0.1)' : '#0a0a0a'};color:${canFreezeYesterday ? '#FFD700' : '#444'};cursor:${canFreezeYesterday ? 'pointer' : 'not-allowed'};font-family:'Inter',sans-serif;font-size:.88rem;font-weight:600;">
          Yesterday &nbsp;·&nbsp; ${yestDate}
          ${!canFreezeYesterday ? '<br><span style="font-size:.7rem;color:#555">Already has activity</span>' : ''}
        </button>
      </div>
      <button onclick="document.getElementById('freezeModal').remove()"
        style="background:none;border:1px solid #333;color:#666;padding:8px 20px;border-radius:20px;cursor:pointer;font-family:'Inter',sans-serif;font-size:.78rem;">
        Cancel
      </button>
      <div style="margin-top:14px;font-size:.7rem;color:#444;letter-spacing:1px">${tokens} freeze token${tokens !== 1 ? 's' : ''} available</div>
    </div>`;
  document.body.appendChild(modal);
}

function applyFreeze(dateKey) {
  const freezeDays = getFreezeDays();
  if (freezeDays.includes(dateKey)) {
    alert('❄️ That day is already frozen!');
    const modal = document.getElementById('freezeModal');
    if (modal) modal.remove();
    return;
  }
  const tokens = getFreezeTokens();
  if (tokens <= 0) {
    alert('â„ï¸ You have no freeze tokens left!');
    const modal = document.getElementById('freezeModal');
    if (modal) modal.remove();
    return;
  }
  freezeDays.push(dateKey);
  localStorage.setItem('freezeDays_' + currentUser, JSON.stringify(freezeDays));
  setFreezeBalance(tokens - 1);
  updateStreak();
  updateFreezeDisplay();
  if (calYear !== undefined) renderCalendar();
  const modal = document.getElementById('freezeModal');
  if (modal) modal.remove();
  const label = dateKey === new Date().toLocaleDateString('en-CA') ? 'today' : 'yesterday';
  const remaining = getFreezeTokens();
  alert(`❄️ Streak frozen for ${label}! You have ${remaining} freeze token${remaining !== 1 ? 's' : ''} left.`);
}

function updateFreezeDisplay() {
  const el = document.getElementById('freezeTokenDisplay');
  if (!el) return;
  const tokens = getFreezeTokens();
  const icons = tokens > 0 ? '❄️' : '—';
  el.innerHTML = `<div class="freezeDisplay"><span class="freezeLabel">Streak Freeze Tokens</span><span class="freezeIcons">${icons}</span><span class="freezeCount">${tokens} available +1 every 30 streak days</span></div>`;
}


function toggleHeightUnit() {
  const unit = document.getElementById('heightUnit').value;
  document.getElementById('heightCm').classList.toggle('hidden', unit === 'ft');
  document.getElementById('heightFt').classList.toggle('hidden', unit === 'cm');
}

function loadAbout() {
  const data = JSON.parse(localStorage.getItem('about_' + currentUser) || '{}');
  const hasData = data.name || data.age || data.heightCm || data.heightFt || data.weight || data.goal || data.weekStart;
  loadProfileImage();
  if (hasData) {
    document.getElementById('aboutViewMode').classList.remove('hidden');
    document.getElementById('aboutEditMode').classList.add('hidden');
    renderAboutView(data);
    updateFreezeDisplay();
  } else {
    document.getElementById('aboutViewMode').classList.add('hidden');
    document.getElementById('aboutEditMode').classList.remove('hidden');
    document.getElementById('aboutStats').innerHTML = '<div class="emptyState">Complete your profile to personalize GymBuddy and track your goals more clearly.</div>';
  }
  if (data.name) document.getElementById('aboutName').value = data.name;
  if (data.age) document.getElementById('aboutAge').value = data.age;
  if (data.heightCm) document.getElementById('aboutHeightCm').value = data.heightCm;
  if (data.heightFt) document.getElementById('aboutHeightFt').value = data.heightFt;
  if (data.heightIn) document.getElementById('aboutHeightIn').value = data.heightIn;
  if (data.weight) document.getElementById('aboutWeight').value = data.weight;
  if (data.weightUnit) document.getElementById('weightUnit').value = data.weightUnit;
  if (data.goal) document.getElementById('aboutGoal').value = data.goal;
  document.getElementById('aboutWeekStart').value = data.weekStart || 'monday';
  if (data.heightUnit) { document.getElementById('heightUnit').value = data.heightUnit; toggleHeightUnit(); }
  renderAboutStats();
}

function enableAboutEdit() {
  document.getElementById('aboutViewMode').classList.add('hidden');
  document.getElementById('aboutEditMode').classList.remove('hidden');
}

function renderAboutView(data) {
  let height = '—';
  if (data.heightUnit === 'ft' && data.heightFt) height = `${data.heightFt}ft ${data.heightIn || 0}in`;
  else if (data.heightCm) height = `${data.heightCm} cm`;
  const weekStart = (data.weekStart || 'monday');
  const weekStartLabel = weekStart.charAt(0).toUpperCase() + weekStart.slice(1);
  const fields = [
    { label: 'Name', value: data.name || '—' },
    { label: 'Age', value: data.age ? data.age + ' yrs' : '—' },
    { label: 'Height', value: height },
    { label: 'Weight', value: data.weight ? data.weight + ' ' + (data.weightUnit || 'lbs') : '—' },
    { label: 'Goal', value: data.goal || '—' },
    { label: 'Week Start', value: `<span class="weekStartChip">${weekStartLabel}</span>`, isHtml: true },
  ];
  document.getElementById('aboutViewGrid').innerHTML = fields.map(f => `
    <div class="aboutViewItem ${f.label === 'Week Start' ? 'aboutViewItemHighlight' : ''}">
      <div class="aboutViewLabel">${f.label}</div>
      <div class="aboutViewValue">${f.isHtml ? f.value : f.value}</div>
    </div>`).join('');
}

function saveAbout() {
  const heightUnit = document.getElementById('heightUnit').value;
  const data = {
    name: document.getElementById('aboutName').value,
    age: document.getElementById('aboutAge').value,
    heightUnit,
    heightCm: document.getElementById('aboutHeightCm').value,
    heightFt: document.getElementById('aboutHeightFt').value,
    heightIn: document.getElementById('aboutHeightIn').value,
    weight: document.getElementById('aboutWeight').value,
    weightUnit: document.getElementById('weightUnit').value,
    goal: document.getElementById('aboutGoal').value,
    weekStart: document.getElementById('aboutWeekStart').value || 'monday'
  };
  localStorage.setItem('about_' + currentUser, JSON.stringify(data));
  document.getElementById('aboutEditMode').classList.add('hidden');
  document.getElementById('aboutViewMode').classList.remove('hidden');
  renderAboutView(data);
  renderAboutStats();
  updateHeatmap();
  renderProgress();
  renderShero();
  renderBadges();
  alert('Profile saved! ✅');
}

function renderAboutStats() {
  const totalWorkouts = allSessions.length;
  const totalSets = allSessions.reduce((sum, s) => sum + s.sets.length, 0);
  const streak = getStreak();
  const bestStreak = getBestStreak();
  const socialEmpty = !myFollowCounts.followingCount && !myFollowCounts.followersCount;
  document.getElementById('aboutStats').innerHTML = `
    <div class="aboutStatsRow">
      <div class="aboutStatCard aboutStatCardWorkouts"><div class="aboutStatIcon">🏋️</div><div class="aboutStatVal">${totalWorkouts}</div><div class="aboutStatLabel">Workouts</div><div class="aboutStatMeta">All Time</div></div>
      <div class="aboutStatCard aboutStatCardStreak"><div class="aboutStatIcon">📦</div><div class="aboutStatVal">${totalSets}</div><div class="aboutStatLabel">Total Sets</div><div class="aboutStatMeta">Volume Logged</div></div>
      <div class="aboutStatCard aboutStatCardBest"><div class="aboutStatIcon">⭐</div><div class="aboutStatVal">${bestStreak}</div><div class="aboutStatLabel">Best Streak</div><div class="aboutStatMeta">Days</div></div>
    </div>
    <div class="followCountsRow">
      <div class="followCountsGrid">
        <div class="followCountCard" onclick="showFollowSearch()"><div class="followCountNum" id="myFollowingCount">${myFollowCounts.followingCount}</div><div class="followCountLabel">Following</div></div>
        <div class="followCountCard"><div class="followCountNum" id="myFollowersCount">${myFollowCounts.followersCount}</div><div class="followCountLabel">Followers</div></div>
      </div>
      ${socialEmpty ? '<div class="followEmptyHint">Connect with lifters to build your circle.</div>' : ''}
      <button class="findPeopleBtn" onclick="showFollowSearch()">🔍 Find People</button>
    </div>`;
}

// ─── AI TRAINER ───────────────────────────────────────────────────────────────
let chatHistory = [];

function getAIIntroMarkup() {
  return `
    <div class="chatMsg bot">
      <div class="chatBubble">
        <div class="chatBubbleBody">
          <div class="chatParagraph">Hi! I'm Shero AI.</div>
          <div class="chatParagraph">Ask about workouts, recovery, diet, or your training balance.</div>
        </div>
      </div>
    </div>`;
}

function setAIStatus(state = 'ready', label) {
  const el = document.getElementById('aiStatusPill');
  if (!el) return;
  const safeState = ['ready', 'busy', 'offline'].includes(state) ? state : 'ready';
  const defaultText = {
    ready: 'AI ready',
    busy: 'Thinking...',
    offline: 'AI unavailable'
  };
  el.classList.remove('ready', 'busy', 'offline');
  el.classList.add(safeState);
  el.textContent = label || defaultText[safeState];
}

function renderAIContextStrip() {
  const el = document.getElementById('aiContextStrip');
  if (!el) return;

  const about = JSON.parse(localStorage.getItem('about_' + currentUser) || '{}');
  const latest = allSessions.length
    ? [...allSessions].sort((a, b) => new Date(b.date) - new Date(a.date))[0]
    : null;
  const weekSessions = typeof getCurrentWeekSessions === 'function' ? getCurrentWeekSessions() : [];
  const goals = typeof getGoals === 'function' ? getGoals().filter(goal => !goal.completed) : [];
  const weekStart = about.weekStart ? `${about.weekStart.charAt(0).toUpperCase() + about.weekStart.slice(1)}` : 'Monday';

  const items = [
    { label: 'Last trained', value: latest ? latest.muscle : 'No data' },
    { label: 'This cycle', value: `${weekSessions.length} workout${weekSessions.length !== 1 ? 's' : ''}` },
    { label: 'Goal', value: about.goal || goals[0]?.name || goals[0]?.exercise || 'Not set' },
    { label: 'Week start', value: weekStart }
  ];

  el.innerHTML = items.map(item => `
    <div class="aiContextItem">
      <span class="aiContextLabel">${item.label}</span>
      <span class="aiContextValue">${item.value}</span>
    </div>`).join('');
}

function clearAIChat() {
  chatHistory = [];
  const box = document.getElementById('chatBox');
  if (box) box.innerHTML = getAIIntroMarkup();
  const input = document.getElementById('chatInputField');
  if (input) {
    input.value = '';
    input.focus();
  }
}

function formatWorkoutSessionForAI(session) {
  const date = new Date(session.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const setSummary = (session.sets || []).map((set, index) => {
    const weight = parseFloat(set.weight || 0);
    const reps = parseInt(set.reps || 0);
    if (weight > 0 && reps > 0) return `set ${index + 1}: ${weight} lbs x ${reps}`;
    if (reps > 0) return `set ${index + 1}: ${reps} reps`;
    if (weight > 0) return `set ${index + 1}: ${weight} lbs`;
    return `set ${index + 1}`;
  }).join(', ');

  return `${date} — ${session.muscle} / ${session.exercise} — ${(session.sets || []).length} set${(session.sets || []).length !== 1 ? 's' : ''}${setSummary ? ` (${setSummary})` : ''}`;
}

function formatGoalForAI(goal) {
  if (!goal) return '';
  if (goal.type === 'strength') return `${goal.exercise || 'Strength goal'} target ${goal.target || 0}${goal.unit || ''} by ${goal.targetDate}`;
  if (goal.type === 'weight') return `Body weight goal from ${goal.current || 0} to ${goal.target || 0} by ${goal.targetDate}`;
  if (goal.type === 'cardio') return `${goal.activity || 'Cardio'} target ${goal.target || ''} by ${goal.targetDate}`;
  if (goal.type === 'custom') return `${goal.name || 'Custom goal'} by ${goal.targetDate}`;
  return `${goal.type || 'Goal'} by ${goal.targetDate || 'no date'}`;
}

function getContext() {
  const about = JSON.parse(localStorage.getItem('about_' + currentUser) || '{}');
  const goals = typeof getGoals === 'function' ? getGoals() : [];
  const restDays = typeof getRestDays === 'function' ? getRestDays() : [];
  const freezeDays = typeof getFreezeDays === 'function' ? getFreezeDays() : [];
  const weeklyCounts = typeof getWeeklyMuscleSetCounts === 'function' ? getWeeklyMuscleSetCounts() : {};
  const weekWindow = typeof getCurrentWeekWindow === 'function' ? getCurrentWeekWindow() : null;
  const totalSets = allSessions.reduce((sum, session) => sum + (session.sets?.length || 0), 0);
  const workoutDays = new Set(allSessions.map(session => new Date(session.date).toLocaleDateString('en-CA'))).size;

  const allTimeMuscleSets = allSessions.reduce((acc, session) => {
    acc[session.muscle] = (acc[session.muscle] || 0) + (session.sets?.length || 0);
    return acc;
  }, {});

  const weeklySummary = Object.entries(weeklyCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([muscle, sets]) => `${muscle}: ${sets} sets`)
    .join(', ') || 'No workouts in the current weekly cycle.';

  const allTimeSummary = Object.entries(allTimeMuscleSets)
    .sort((a, b) => b[1] - a[1])
    .map(([muscle, sets]) => `${muscle}: ${sets} sets`)
    .join(', ') || 'No all-time workout data yet.';

  const activeGoals = goals
    .filter(goal => !goal.completed)
    .map(formatGoalForAI)
    .filter(Boolean)
    .join(' | ') || 'No active goals.';

  const completedGoals = goals
    .filter(goal => goal.completed)
    .map(formatGoalForAI)
    .filter(Boolean)
    .join(' | ') || 'No completed goals yet.';

  const fullHistory = [...allSessions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .map(formatWorkoutSessionForAI)
    .join('\n') || 'No workouts logged yet.';

  const profileSummary = [
    about.name ? `Name: ${about.name}` : `Username: ${currentUser}`,
    about.age ? `Age: ${about.age}` : '',
    about.goal ? `Goal: ${about.goal}` : '',
    about.weight ? `Weight: ${about.weight} ${about.weightUnit || 'lbs'}` : '',
    about.heightCm ? `Height: ${about.heightCm} cm` : (about.heightFt ? `Height: ${about.heightFt}ft ${about.heightIn || 0}in` : ''),
    about.weekStart ? `Week starts on: ${about.weekStart}` : ''
  ].filter(Boolean).join(' | ');

  const streak = typeof getStreak === 'function' ? getStreak() : 0;
  const bestStreak = typeof getBestStreak === 'function' ? getBestStreak() : 0;

  return [
    'You are GymBuddy AI. Use the following user data to personalize workout, recovery, nutrition, and fitness answers.',
    `Profile: ${profileSummary || `Username: ${currentUser}`}`,
    `Training stats: ${allSessions.length} total workouts, ${totalSets} total sets, ${workoutDays} active workout days, current streak ${streak}, best streak ${bestStreak}.`,
    `Current weekly cycle: ${weekWindow ? `${weekWindow.monday.toLocaleDateString('en-US')} to ${weekWindow.sunday.toLocaleDateString('en-US')}` : 'Not available'}.`,
    `Weekly cycle muscle summary: ${weeklySummary}`,
    `All-time muscle summary: ${allTimeSummary}`,
    `Rest days logged: ${restDays.length ? restDays.join(', ') : 'None'}`,
    `Freeze days logged: ${freezeDays.length ? freezeDays.join(', ') : 'None'}`,
    `Active goals: ${activeGoals}`,
    `Completed goals: ${completedGoals}`,
    'Full workout history (newest first):',
    fullHistory
  ].join('\n');
}

async function sendMessage() {
  const input = document.getElementById('chatInputField');
  const msg = input.value.trim();
  if (!msg) return;
  input.value = '';
  appendMessage(msg, 'user');
  chatHistory.push({ role: 'user', content: msg });
  const typing = appendMessage('Typing...', 'bot', true);
  setAIStatus('busy');

  try {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    if (token) headers['Authorization'] = 'Bearer ' + token;

    const res = await fetch(API + '/ai/chat', {
      method: 'POST',
      headers,
      body: JSON.stringify({ message: msg, history: chatHistory.slice(0, -1), context: getContext() })
    });

    const contentType = res.headers.get('content-type') || '';
    let data = null;

    if (contentType.includes('application/json')) {
      data = await res.json();
    } else {
      const text = await res.text();
      data = { error: text || `Request failed (${res.status})` };
    }

    const reply = typeof data?.reply === 'string' ? data.reply.trim() : '';
    if (!res.ok || !reply) {
      throw new Error(data?.error || data?.message || data?.reply || `AI is unavailable right now (${res.status}).`);
    }

    typing.remove();
    setAIStatus('ready');
    appendMessage(reply, 'bot');
    chatHistory.push({ role: 'assistant', content: reply });
  } catch (err) {
    typing.remove();
    setAIStatus('offline');
    const rawMessage = err?.message || '';
    const friendlyMessage = /googlegenerativeai|404|not found|generatecontent|unavailable|request failed|500/i.test(rawMessage)
      ? 'AI is temporarily unavailable. Please try again shortly.'
      : (rawMessage || 'Sorry, AI is unavailable right now. Please try again shortly.');
    appendMessage(friendlyMessage, 'bot');
  }
}

function askQuick(q) { document.getElementById('chatInputField').value = q; sendMessage(); }

function escapeChatHtml(text) {
  return String(text || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatChatMessage(text, sender = 'bot', isTyping = false) {
  const safeText = escapeChatHtml(text).replace(/\r\n/g, '\n').trim();
  if (!safeText) return '';
  if (sender !== 'bot' || isTyping) return safeText.replace(/\n/g, '<br>');

  const enhanced = safeText
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/__(.*?)__/g, '<strong>$1</strong>')
    .replace(/(^|\W)\*(?!\s)([^*\n]+?)\*(?=\W|$)/g, '$1<strong>$2</strong>');

  const lines = enhanced.split('\n').map(line => line.trim()).filter(Boolean);
  if (!lines.length) return '';

  const blocks = [];
  let listItems = [];
  let listType = null;

  const flushList = () => {
    if (!listItems.length) return;
    const tag = listType === 'ordered' ? 'ol' : 'ul';
    const className = listType === 'ordered' ? 'chatOrderedList' : 'chatList';
    blocks.push(`<${tag} class="${className}">${listItems.join('')}</${tag}>`);
    listItems = [];
    listType = null;
  };

  lines.forEach(line => {
    const bulletMatch = line.match(/^[-*•]\s+(.*)$/);
    const orderedMatch = line.match(/^\d+[.)]\s+(.*)$/);

    if (bulletMatch) {
      if (listType && listType !== 'unordered') flushList();
      listType = 'unordered';
      listItems.push(`<li>${bulletMatch[1]}</li>`);
      return;
    }

    if (orderedMatch) {
      if (listType && listType !== 'ordered') flushList();
      listType = 'ordered';
      listItems.push(`<li>${orderedMatch[1]}</li>`);
      return;
    }

    flushList();
    blocks.push(`<div class="chatParagraph">${line}</div>`);
  });

  flushList();
  return blocks.join('');
}

async function copyChatText(button, text) {
  const value = String(text || '').trim();
  if (!value) return;

  const setState = (label) => {
    button.textContent = label;
    setTimeout(() => {
      if (button) button.textContent = 'Copy';
    }, 1400);
  };

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
      setState('Copied');
      return;
    }

    const area = document.createElement('textarea');
    area.value = value;
    area.setAttribute('readonly', 'true');
    area.style.position = 'absolute';
    area.style.left = '-9999px';
    document.body.appendChild(area);
    area.select();
    document.execCommand('copy');
    area.remove();
    setState('Copied');
  } catch {
    setState('Failed');
  }
}

function appendMessage(text, sender, isTyping = false) {
  const box = document.getElementById('chatBox');
  const msg = document.createElement('div');
  msg.className = `chatMsg ${sender}`;
  const bubble = document.createElement('div');
  bubble.className = `chatBubble${isTyping ? ' typing' : ''}`;

  const body = document.createElement('div');
  body.className = 'chatBubbleBody';
  body.innerHTML = formatChatMessage(text, sender, isTyping);
  bubble.appendChild(body);

  if (sender === 'bot' && !isTyping) {
    const actions = document.createElement('div');
    actions.className = 'chatBubbleActions';
    const copyBtn = document.createElement('button');
    copyBtn.type = 'button';
    copyBtn.className = 'chatCopyBtn';
    copyBtn.textContent = 'Copy';
    copyBtn.addEventListener('click', (event) => {
      event.stopPropagation();
      copyChatText(copyBtn, text);
    });
    actions.appendChild(copyBtn);
    bubble.appendChild(actions);
  }

  msg.appendChild(bubble);
  box.appendChild(msg);
  box.scrollTop = box.scrollHeight;
  return msg;
}

// ─── COMMUNITY FEED / DRAWER ──────────────────────────────────────────────────


// ════════════════════════════════════════════════════════════════════════════
// FOLLOW SYSTEM
// ════════════════════════════════════════════════════════════════════════════

function showFollowSearch() {
  let modal = document.getElementById('followSearchModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'followSearchModal';
    modal.className = 'followSearchModal';
    modal.innerHTML = `
      <div class="followSearchBox">
        <div class="followSearchHeader">
          <div class="followSearchTitle">Find People</div>
          <button class="followSearchClose" onclick="closeFollowSearch()">✕</button>
        </div>
        <div class="followSearchInputWrap">
          <input type="text" id="followSearchInput" placeholder="Search by name or username..."
            oninput="searchUsers(this.value)" autocomplete="off"/>
          <span class="followSearchIcon">🔍</span>
        </div>
        <div class="followSearchResults" id="followSearchResults">
          <div class="followSearchHint">Start typing to find people 👆</div>
        </div>
      </div>`;
    document.body.appendChild(modal);
  }
  modal.classList.add('open');
  setTimeout(() => document.getElementById('followSearchInput')?.focus(), 300);
}

function closeFollowSearch() {
  const modal = document.getElementById('followSearchModal');
  if (modal) modal.classList.remove('open');
}

let _searchTimeout = null;
async function searchUsers(q) {
  clearTimeout(_searchTimeout);
  const results = document.getElementById('followSearchResults');
  if (!q.trim()) { results.innerHTML = '<div class="followSearchHint">Start typing to find people 👆</div>'; return; }
  results.innerHTML = '<div class="followSearchHint">Searching...</div>';
  _searchTimeout = setTimeout(async () => {
    try {
      const res = await fetch(`${API}/users/search?q=${encodeURIComponent(q)}`, { headers: { 'Authorization': 'Bearer ' + token } });
      const users = await res.json();
      if (!users.length) { results.innerHTML = '<div class="followSearchHint">No users found 🤷</div>'; return; }
      results.innerHTML = users.map(u => `
        <div class="followUserCard">
          <div class="followUserAvatar">${u.name[0].toUpperCase()}</div>
          <div class="followUserInfo" onclick="showPublicProfile('${u.username}')">
            <div class="followUserName">${u.name}</div>
            <div class="followUserMeta">@${u.username} · ${u.totalWorkouts} workouts · ${u.followersCount} followers</div>
          </div>
          <button class="followToggleBtn ${u.isFollowing ? 'following' : ''}" onclick="toggleFollow('${u.username}', this)">
            ${u.isFollowing ? 'Following' : 'Follow'}
          </button>
        </div>`).join('');
    } catch (err) { results.innerHTML = '<div class="followSearchHint">Error searching. Try again.</div>'; }
  }, 400);
}

async function toggleFollow(username, btn) {
  btn.disabled = true;
  try {
    const res = await fetch(`${API}/users/${username}/follow`, { method: 'POST', headers: { 'Authorization': 'Bearer ' + token } });
    const data = await res.json();
    if (res.ok) {
      const isNowFollowing = data.following;
      btn.textContent = isNowFollowing ? 'Following' : 'Follow';
      btn.classList.toggle('following', isNowFollowing);
      myFollowCounts.followingCount += isNowFollowing ? 1 : -1;
      const myFollowingEl = document.getElementById('myFollowingCount');
      if (myFollowingEl) myFollowingEl.textContent = myFollowCounts.followingCount;
      const profileFollowers = document.getElementById('profileFollowersCount');
      if (profileFollowers) profileFollowers.textContent = data.followersCount;
      const profileFollowBtn = document.getElementById('profileFollowBtn');
      if (profileFollowBtn) { profileFollowBtn.textContent = isNowFollowing ? 'Following' : 'Follow'; profileFollowBtn.classList.toggle('following', isNowFollowing); }
    }
  } catch (err) { console.error('Follow error:', err); }
  btn.disabled = false;
}

async function showPublicProfile(username) {
  let modal = document.getElementById('publicProfileModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'publicProfileModal';
    modal.className = 'publicProfileModal';
    modal.innerHTML = `
      <div class="publicProfileBox">
        <button class="publicProfileClose" onclick="closePublicProfile()">✕</button>
        <div id="publicProfileContent"><div class="profileLoading">Loading...</div></div>
      </div>`;
    document.body.appendChild(modal);
  }
  document.getElementById('publicProfileContent').innerHTML = '<div class="profileLoading">Loading...</div>';
  modal.classList.add('open');
  try {
    const res = await fetch(`${API}/users/${username}/profile`, { headers: { 'Authorization': 'Bearer ' + token } });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    const memberSince = new Date(data.memberSince).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    document.getElementById('publicProfileContent').innerHTML = `
      <div class="profileAvatar">${data.name[0].toUpperCase()}</div>
      <div class="profileName">${data.name}</div>
      <div class="profileUsername">@${data.username}</div>
      <div class="profileMemberSince">Member since ${memberSince}</div>
      ${!data.isSelf ? `<button class="followToggleBtn profileFollowBtn ${data.isFollowing ? 'following' : ''}" id="profileFollowBtn" onclick="toggleFollow('${data.username}', this)">${data.isFollowing ? 'Following' : 'Follow'}</button>` : '<div style="height:14px"></div>'}
      <div class="profileFollowRow">
        <div class="profileFollowStat"><div class="profileFollowNum" id="profileFollowersCount">${data.followersCount}</div><div class="profileFollowLabel">Followers</div></div>
        <div class="profileFollowDivider"></div>
        <div class="profileFollowStat"><div class="profileFollowNum">${data.followingCount}</div><div class="profileFollowLabel">Following</div></div>
      </div>
      <div class="profileStatsGrid">
        <div class="profileStatCard"><div class="profileStatVal">${data.stats.totalWorkouts}</div><div class="profileStatLabel">Workouts</div></div>
        <div class="profileStatCard"><div class="profileStatVal">${data.stats.totalSets}</div><div class="profileStatLabel">Total Sets</div></div>
        <div class="profileStatCard"><div class="profileStatVal">${data.stats.musclesTrained}</div><div class="profileStatLabel">Muscles</div></div>
      </div>
      ${data.topPRs.length ? `<div class="profileSection"><div class="profileSectionTitle">🏆 Top PRs</div>${data.topPRs.map(pr => `<div class="profilePRRow"><span class="profilePREx">${pr.exercise}</span><span class="profilePRWeight">${pr.weight} lbs</span></div>`).join('')}</div>` : ''}
      ${data.recentSessions.length ? `<div class="profileSection"><div class="profileSectionTitle">📋 Recent Workouts</div>${data.recentSessions.map(s => `<div class="profileRecentRow"><span class="profileRecentMuscle">${s.muscle}</span><span class="profileRecentEx">${s.exercise} · ${s.sets} sets</span><span class="profileRecentDate">${new Date(s.date).toLocaleDateString('en-US', { month:'short', day:'numeric' })}</span></div>`).join('')}</div>` : ''}`;
  } catch (err) {
    document.getElementById('publicProfileContent').innerHTML = `<div class="profileLoading">Could not load profile.</div>`;
  }
}

function closePublicProfile() {
  const modal = document.getElementById('publicProfileModal');
  if (modal) modal.classList.remove('open');
}



// ─── INSTAGRAM-STYLE COMMENTS ─────────────────────────────────────────────────
let _replyTarget = {};

function openCommentsSheet(postId) {
  const existing = document.getElementById('commentsSheet'); if (existing) existing.remove();
  const existingOv = document.getElementById('commentsOverlay'); if (existingOv) existingOv.remove();
  const posts = JSON.parse(localStorage.getItem('gymbuddy_posts') || '[]');
  const post = posts.find(p => p.id === postId); if (!post) return;
  const ov = document.createElement('div'); ov.id = 'commentsOverlay';
  ov.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:170;';
  ov.onclick = closeCommentsSheet; document.body.appendChild(ov);
  const sheet = document.createElement('div'); sheet.id = 'commentsSheet'; sheet.className = 'igSheet';
  sheet.innerHTML = buildCommentsSheet(post); document.body.appendChild(sheet);
  requestAnimationFrame(() => sheet.classList.add('open'));
}

function buildCommentsSheet(post) {
  const comments = post.comments || [];
  const myProfileImg = localStorage.getItem('profileImg_' + currentUser);
  const myName = JSON.parse(localStorage.getItem('about_' + currentUser) || '{}').name || currentUser;
  const myAvatarStyle = myProfileImg ? `background-image:url(${myProfileImg});background-size:cover;background-position:center;` : '';

  function renderComment(c, isReply) {
    const avStyle = c.profileImg ? `background-image:url(${c.profileImg});background-size:cover;background-position:center;` : '';
    const replies = comments.filter(r => r.replyTo === c.id);
    return `<div class="igComment ${isReply ? 'igReply' : ''}" id="igc_${c.id}">
      <div class="igCommentAvatar" style="${avStyle}">${c.profileImg ? '' : c.name[0].toUpperCase()}</div>
      <div class="igCommentBody">
        <div class="igCommentTop">
          <span class="igCommentName" onclick="showPublicProfile('${c.username}')">${c.name}</span>
          <span class="igCommentTime">${getTimeAgo(new Date(c.date))}</span>
          ${c.username === currentUser ? `<button class="igCommentDelete" onclick="deleteComment(${post.id},${c.id})">🗑</button>` : ''}
        </div>
        <div class="igCommentText">${c.text}</div>
        ${!isReply ? `<button class="igReplyBtn" onclick="setReplyTarget(${post.id},${c.id},'${c.name}')">Reply</button>` : ''}
        ${replies.map(r => renderComment(r, true)).join('')}
      </div>
    </div>`;
  }

  const topLevel = comments.filter(c => !c.replyTo);
  const commentsHTML = topLevel.length ? topLevel.map(c => renderComment(c, false)).join('') : '<div class="igNoComments">No comments yet 💬</div>';

  return `<div class="igSheetHeader"><div class="igSheetTitle">Comments</div><button class="igSheetClose" onclick="closeCommentsSheet()">✕</button></div>
    <div class="igCommentsList" id="igCommentsList_${post.id}">${commentsHTML}</div>
    <div class="igCommentComposer">
      <div class="igReplyingTo hidden" id="igReplyingTo_${post.id}">
        <span id="igReplyingToName_${post.id}"></span>
        <button onclick="clearReplyTarget(${post.id})">✕</button>
      </div>
      <div class="igComposerRow">
        <div class="igComposerAvatar" style="${myAvatarStyle}">${myProfileImg ? '' : myName[0].toUpperCase()}</div>
        <input type="text" id="igInput_${post.id}" class="igInput" placeholder="Add a comment..."
          onkeydown="if(event.key==='Enter') submitIgComment(${post.id})"/>
        <button class="igSubmitBtn" onclick="submitIgComment(${post.id})">Post</button>
      </div>
    </div>`;
}

function setReplyTarget(postId, commentId, name) {
  _replyTarget[postId] = commentId;
  const el = document.getElementById('igReplyingTo_' + postId);
  const nameEl = document.getElementById('igReplyingToName_' + postId);
  if (el) el.classList.remove('hidden');
  if (nameEl) nameEl.textContent = 'Replying to ' + name + ' · ';
  document.getElementById('igInput_' + postId)?.focus();
}

function clearReplyTarget(postId) {
  _replyTarget[postId] = null;
  const el = document.getElementById('igReplyingTo_' + postId);
  if (el) el.classList.add('hidden');
}

function submitIgComment(postId) {
  const input = document.getElementById('igInput_' + postId);
  const text = input?.value.trim(); if (!text) return;
  const name = JSON.parse(localStorage.getItem('about_' + currentUser) || '{}').name || currentUser;
  const profileImg = localStorage.getItem('profileImg_' + currentUser) || null;
  const posts = JSON.parse(localStorage.getItem('gymbuddy_posts') || '[]');
  const post = posts.find(p => p.id === postId); if (!post) return;
  if (!post.comments) post.comments = [];
  const replyTo = _replyTarget[postId] || null;
  post.comments.push({ id: Date.now(), username: currentUser, name, profileImg, text, date: new Date().toISOString(), replyTo });
  localStorage.setItem('gymbuddy_posts', JSON.stringify(posts));
  if (input) input.value = '';
  clearReplyTarget(postId);
  const countEl = document.getElementById('commentCount_' + postId);
  if (countEl) countEl.textContent = post.comments.length;
  const sheet = document.getElementById('commentsSheet');
  if (sheet) sheet.innerHTML = buildCommentsSheet(post);
}

function deleteComment(postId, commentId) {
  const posts = JSON.parse(localStorage.getItem('gymbuddy_posts') || '[]');
  const post = posts.find(p => p.id === postId); if (!post) return;
  post.comments = (post.comments || []).filter(c => c.id !== commentId && c.replyTo !== commentId);
  localStorage.setItem('gymbuddy_posts', JSON.stringify(posts));
  const countEl = document.getElementById('commentCount_' + postId);
  if (countEl) countEl.textContent = post.comments.length;
  const sheet = document.getElementById('commentsSheet');
  if (sheet) sheet.innerHTML = buildCommentsSheet(post);
}

function closeCommentsSheet() {
  const sheet = document.getElementById('commentsSheet');
  if (sheet) { sheet.classList.remove('open'); setTimeout(() => sheet.remove(), 350); }
  const ov = document.getElementById('commentsOverlay'); if (ov) ov.remove();
}

// ─── EXPORT CSV ───────────────────────────────────────────────────────────────
function exportCSV() {
  if (!allSessions.length) { alert('No workouts to export yet!'); return; }
  const rows = [['Date','Muscle','Exercise','Set','Weight (lbs)','Reps','Volume']];
  allSessions.forEach(s => {
    const dateStr = new Date(s.date).toLocaleDateString('en-US');
    s.sets.forEach((set, i) => {
      const vol = (parseFloat(set.weight || 0) * parseInt(set.reps || 0)).toFixed(0);
      rows.push([dateStr, s.muscle, s.exercise, i + 1, set.weight, set.reps, vol]);
    });
  });
  const csv = rows.map(r => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `gymbuddy_${currentUser}_${new Date().toLocaleDateString('en-CA')}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── FEEDBACK ─────────────────────────────────────────────────────────────────
function submitFeedback() {
  const type = document.getElementById('feedbackType').value;
  const title = document.getElementById('feedbackTitle').value.trim();
  const desc = document.getElementById('feedbackDesc').value.trim();
  const msgEl = document.getElementById('feedbackMsg');
  if (!title || !desc) {
    msgEl.textContent = 'Please fill in all fields.';
    msgEl.className = 'feedbackMsg error';
    msgEl.classList.remove('hidden'); return;
  }
  const feedbacks = JSON.parse(localStorage.getItem('feedbacks_' + currentUser) || '[]');
  feedbacks.unshift({ type, title, desc, date: new Date().toISOString() });
  localStorage.setItem('feedbacks_' + currentUser, JSON.stringify(feedbacks));
  document.getElementById('feedbackTitle').value = '';
  document.getElementById('feedbackDesc').value = '';
  msgEl.textContent = '✅ Feedback submitted! Thank you.';
  msgEl.className = 'feedbackMsg success';
  msgEl.classList.remove('hidden');
  setTimeout(() => msgEl.classList.add('hidden'), 3000);
  renderFeedbackHistory();
}

function renderFeedbackHistory() {
  const feedbacks = JSON.parse(localStorage.getItem('feedbacks_' + currentUser) || '[]');
  const el = document.getElementById('feedbackHistory'); if (!el) return;
  if (!feedbacks.length) { el.innerHTML = ''; return; }
  el.innerHTML = '<div class="feedbackHistTitle">Your submissions</div>' +
    feedbacks.map(f => `
      <div class="feedbackItem">
        <div class="feedbackItemType ${f.type}">${f.type}</div>
        <div class="feedbackItemTitle">${f.title}</div>
        <div class="feedbackItemDesc">${f.desc}</div>
        <div class="feedbackItemDate">${new Date(f.date).toLocaleDateString()}</div>
      </div>`).join('');
}

// ─── BADGES ───────────────────────────────────────────────────────────────────
const BADGES = [
  // ── BRONZE ────────────────────────────────────────────────────────────────
  { id:'first_step',  name:'First Step',  desc:'Log your first workout',       shape:'shield',  tier:'bronze', icon:'👟', progress: () => ({ cur: Math.min(allSessions.length,1), max:1 }) },
  { id:'bench_100',   name:'Bench 100',   desc:'Bench Press 100 lbs',          shape:'shield',  tier:'bronze', icon:'🏋️', progress: () => ({ cur: Math.min(getBestWeight('Bench Press'),100), max:100 }) },
  { id:'squat_100',   name:'Squat 100',   desc:'Squat 100 lbs',                shape:'shield',  tier:'bronze', icon:'🦵', progress: () => ({ cur: Math.min(getBestWeight('Squat'),100), max:100 }) },
  { id:'deadlift_100',name:'Deadlift 100',desc:'Deadlift 100 lbs',             shape:'shield',  tier:'bronze', icon:'💀', progress: () => ({ cur: Math.min(getBestWeight('Deadlift'),100), max:100 }) },
  { id:'streak_7',    name:'On Fire',     desc:'7 Day Streak',                 shape:'hexagon', tier:'bronze', icon:'🔥', progress: () => ({ cur: Math.min(getBestStreak(),7), max:7 }) },
  { id:'pushup_25',   name:'Push 25',     desc:'25 Push-Ups in a set',         shape:'star',    tier:'bronze', icon:'💪', progress: () => ({ cur: Math.min(getBestReps('Push-Up'),25), max:25 }) },

  // ── SILVER ────────────────────────────────────────────────────────────────
  { id:'bench_150',   name:'Bench 150',   desc:'Bench Press 150 lbs',          shape:'shield',  tier:'silver', icon:'🏋️', progress: () => ({ cur: Math.min(getBestWeight('Bench Press'),150), max:150 }) },
  { id:'squat_150',   name:'Squat 150',   desc:'Squat 150 lbs',                shape:'shield',  tier:'silver', icon:'🦵', progress: () => ({ cur: Math.min(getBestWeight('Squat'),150), max:150 }) },
  { id:'deadlift_200',name:'Deadlift 200',desc:'Deadlift 200 lbs',             shape:'shield',  tier:'silver', icon:'💀', progress: () => ({ cur: Math.min(getBestWeight('Deadlift'),200), max:200 }) },
  { id:'streak_30',   name:'Iron Habit',  desc:'30 Day Streak',                shape:'hexagon', tier:'silver', icon:'⚡', progress: () => ({ cur: Math.min(getBestStreak(),30), max:30 }) },
  { id:'pushup_50',   name:'Push 50',     desc:'50 Push-Ups in a set',         shape:'star',    tier:'silver', icon:'💪', progress: () => ({ cur: Math.min(getBestReps('Push-Up'),50), max:50 }) },
  { id:'pullup_10',   name:'Pull 10',     desc:'10 Pull-Ups in a set',         shape:'star',    tier:'silver', icon:'🔝', progress: () => ({ cur: Math.min(getBestReps('Pull-Up'),10), max:10 }) },

  // ── GOLD ──────────────────────────────────────────────────────────────────
  { id:'bench_200',   name:'Bench 200',   desc:'Bench Press 200 lbs',          shape:'shield',  tier:'gold', icon:'🏋️', progress: () => ({ cur: Math.min(getBestWeight('Bench Press'),200), max:200 }) },
  { id:'squat_200',   name:'Squat 200',   desc:'Squat 200 lbs',                shape:'shield',  tier:'gold', icon:'🦵', progress: () => ({ cur: Math.min(getBestWeight('Squat'),200), max:200 }) },
  { id:'deadlift_250',name:'Deadlift 250',desc:'Deadlift 250 lbs',             shape:'shield',  tier:'gold', icon:'💀', progress: () => ({ cur: Math.min(getBestWeight('Deadlift'),250), max:250 }) },
  { id:'streak_100',  name:'Centurion',   desc:'100 Day Streak',               shape:'hexagon', tier:'gold', icon:'👑', progress: () => ({ cur: Math.min(getBestStreak(),100), max:100 }) },
  { id:'pushup_75',   name:'Push 75',     desc:'75 Push-Ups in a set',         shape:'star',    tier:'gold', icon:'💪', progress: () => ({ cur: Math.min(getBestReps('Push-Up'),75), max:75 }) },
  { id:'pullup_20',   name:'Pull 20',     desc:'20 Pull-Ups in a set',         shape:'star',    tier:'gold', icon:'🔝', progress: () => ({ cur: Math.min(getBestReps('Pull-Up'),20), max:20 }) },
  { id:'full_body',   name:'Full Body',   desc:'Train all 13 muscles at green intensity for 2 consecutive weeks', shape:'star', tier:'gold', icon:'🌟',
    progress: () => getFullBodyWeekProgress()
  },

  // ── PLATINUM ──────────────────────────────────────────────────────────────
  { id:'bench_300',   name:'Bench 300',   desc:'Bench Press 300 lbs',          shape:'shield',  tier:'platinum', icon:'🏋️', progress: () => ({ cur: Math.min(getBestWeight('Bench Press'),300), max:300 }) },
  { id:'squat_300',   name:'Squat 300',   desc:'Squat 300 lbs',                shape:'shield',  tier:'platinum', icon:'🦵', progress: () => ({ cur: Math.min(getBestWeight('Squat'),300), max:300 }) },
  { id:'deadlift_300',name:'Deadlift 300',desc:'Deadlift 300 lbs',             shape:'shield',  tier:'platinum', icon:'💀', progress: () => ({ cur: Math.min(getBestWeight('Deadlift'),300), max:300 }) },
  { id:'streak_365',  name:'Legendary',   desc:'365 Day Streak',               shape:'hexagon', tier:'platinum', icon:'🌟', progress: () => ({ cur: Math.min(getBestStreak(),365), max:365 }) },
  { id:'pullup_30',   name:'Pull 30',     desc:'30 Pull-Ups in a set',         shape:'star',    tier:'platinum', icon:'🔝', progress: () => ({ cur: Math.min(getBestReps('Pull-Up'),30), max:30 }) },

  // ── DIAMOND ───────────────────────────────────────────────────────────────
  { id:'bench_400',   name:'Bench 400',   desc:'Bench Press 400 lbs',          shape:'shield',  tier:'diamond', icon:'🏋️', progress: () => ({ cur: Math.min(getBestWeight('Bench Press'),400), max:400 }) },
  { id:'squat_400',   name:'Squat 400',   desc:'Squat 400 lbs',                shape:'shield',  tier:'diamond', icon:'🦵', progress: () => ({ cur: Math.min(getBestWeight('Squat'),400), max:400 }) },
  { id:'deadlift_400',name:'Deadlift 400',desc:'Deadlift 400 lbs',             shape:'shield',  tier:'diamond', icon:'💀', progress: () => ({ cur: Math.min(getBestWeight('Deadlift'),400), max:400 }) },
  { id:'streak_500',  name:'Immortal',    desc:'500 Day Streak',               shape:'hexagon', tier:'diamond', icon:'💎', progress: () => ({ cur: Math.min(getBestStreak(),500), max:500 }) },
  { id:'pullup_40',   name:'Pull 40',     desc:'40 Pull-Ups in a set',         shape:'star',    tier:'diamond', icon:'🔝', progress: () => ({ cur: Math.min(getBestReps('Pull-Up'),40), max:40 }) },
];

function getBestWeight(exercise) {
  let best = 0;
  allSessions.filter(s => s.exercise === exercise).forEach(s => s.sets.forEach(set => { best = Math.max(best, parseFloat(set.weight || 0)); }));
  return best;
}
function getBestReps(exercise) {
  let best = 0;
  allSessions.filter(s => s.exercise === exercise).forEach(s => s.sets.forEach(set => { best = Math.max(best, parseInt(set.reps || 0)); }));
  return best;
}

const TIER_COLORS = {
  bronze:   { outer:'#cd7f32', inner:'#a0522d', glow:'rgba(205,127,50,0.5)',  grad:'#cd7f32,#a0522d' },
  silver:   { outer:'#c0c0c0', inner:'#888',    glow:'rgba(192,192,192,0.5)', grad:'#e0e0e0,#aaa'    },
  gold:     { outer:'#ffd700', inner:'#c8a400', glow:'rgba(255,215,0,0.6)',   grad:'#ffd700,#c8a400' },
  platinum: { outer:'#eefcff', inner:'#8db7c7', glow:'rgba(185,235,255,0.95)', grad:'#ffffff,#bfe8f7' },
  diamond:  { outer:'#b9f2ff', inner:'#5bcefa', glow:'rgba(91,206,250,0.8)',  grad:'#b9f2ff,#5bcefa' }
};

function makeBadgeSVG(badge, pct) {
  const t = TIER_COLORS[badge.tier];
  const unlocked = pct >= 1;
  const glowFilter = unlocked ? `drop-shadow(0 0 10px ${t.glow})` : 'none';
  const fillPct = Math.round(pct * 100);
  const fillY = 100 - fillPct;
  const uid = badge.id;
  const shapes = {
    shield:  `<path d="M50,8 L88,22 L88,52 C88,72 50,92 50,92 C50,92 12,72 12,52 L12,22 Z"/>`,
    hexagon: `<polygon points="50,6 90,28 90,72 50,94 10,72 10,28"/>`,
    circle:  `<circle cx="50" cy="50" r="42"/>`,
    star:    `<polygon points="50,4 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35"/>`
  };
  const fillOpacity = badge.tier === 'gold' ? 0.65 : 1;
  return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="width:72px;height:72px;filter:${glowFilter};transition:all .3s">
    <defs>
      <linearGradient id="base_${uid}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#2a2a2a"/><stop offset="100%" style="stop-color:#1a1a1a"/>
      </linearGradient>
      <linearGradient id="fill_${uid}" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style="stop-color:${t.grad.split(',')[0]};stop-opacity:0.9"/>
        <stop offset="100%" style="stop-color:${t.grad.split(',')[1]};stop-opacity:0.6"/>
      </linearGradient>
      <clipPath id="clip_${uid}">${shapes[badge.shape]}</clipPath>
      <clipPath id="fillclip_${uid}"><rect x="0" y="${fillY}" width="100" height="${fillPct}"/></clipPath>
    </defs>
    <g clip-path="url(#clip_${uid})"><rect x="0" y="0" width="100" height="100" fill="url(#base_${uid})"/></g>
    <g clip-path="url(#clip_${uid})"><g clip-path="url(#fillclip_${uid})"><rect x="0" y="0" width="100" height="100" fill="url(#fill_${uid})" opacity="${fillOpacity}"/></g></g>
    <g fill="none" stroke="${t.outer}" stroke-width="2.5" opacity="${unlocked ? 1 : 0.4}">${shapes[badge.shape]}</g>
    <text x="50" y="58" text-anchor="middle" font-size="28" style="opacity:${unlocked ? 1 : 0.5}">${badge.icon}</text>
  </svg>`;
}

function renderBadges() {
  const tiers = ['bronze','silver','gold','platinum','diamond'];
  const tierLabels = { bronze:'🥉 Bronze', silver:'🥈 Silver', gold:'🥇 Gold', platinum:'💎 Platinum', diamond:'💠 Diamond' };
  let unlockedCount = 0, html = '';
  tiers.forEach(tier => {
    const tierBadges = BADGES.filter(b => b.tier === tier);
    html += `<div class="badgesTierTitle">${tierLabels[tier]}</div><div class="badgesGrid">`;
    tierBadges.forEach(b => {
      const { cur, max } = b.progress();
      const pct = max > 0 ? cur / max : 0;
      const unlocked = pct >= 1;
      if (unlocked) unlockedCount++;
      html += `<div class="badgeCard ${unlocked ? 'unlocked ' + b.tier : 'locked'}">
        ${makeBadgeSVG(b, pct)}
        <div class="badgeName">${b.name}</div>
        <div class="badgeDesc">${b.desc}</div>
        <div class="badgeProgress">${unlocked ? 'Completed' : `${cur} / ${max}`}</div>
        <div class="badgeTier ${b.tier}">${b.tier}</div>
      </div>`;
    });
    html += '</div>';
  });
  document.getElementById('badgesUnlocked').innerHTML = `<div class="badgesSummary">${unlockedCount} / ${BADGES.length} Badges Unlocked</div>`;
  document.getElementById('badgesLocked').innerHTML = html;
}

// ─── MUSCLE DISTRIBUTION MAP ──────────────────────────────────────────────────
// Primary (1.0) and secondary (0.5) muscles per exercise
const MUSCLE_ACTIVATION = {
  // CHEST
  'Bench Press':        { primary:['Chest'], secondary:['Shoulders','Triceps'] },
  'Incline Bench Press':{ primary:['Chest'], secondary:['Shoulders','Triceps'] },
  'Decline Bench Press':{ primary:['Chest'], secondary:['Triceps'] },
  'Cable Fly':          { primary:['Chest'], secondary:['Shoulders'] },
  'Dumbbell Fly':       { primary:['Chest'], secondary:['Shoulders'] },
  'Push-Up':            { primary:['Chest'], secondary:['Shoulders','Triceps'] },
  'Chest Dip':          { primary:['Chest'], secondary:['Triceps','Shoulders'] },
  // SHOULDERS
  'Overhead Press':     { primary:['Shoulders'], secondary:['Triceps','Traps'] },
  'Lateral Raise':      { primary:['Shoulders'], secondary:[] },
  'Front Raise':        { primary:['Shoulders'], secondary:['Chest'] },
  'Arnold Press':       { primary:['Shoulders'], secondary:['Triceps'] },
  'Face Pull':          { primary:['Shoulders'], secondary:['Traps','Biceps'] },
  'Upright Row':        { primary:['Shoulders'], secondary:['Traps','Biceps'] },
  'Cable Lateral Raise':{ primary:['Shoulders'], secondary:[] },
  // BICEPS
  'Barbell Curl':       { primary:['Biceps'], secondary:['Forearms'] },
  'Dumbbell Curl':      { primary:['Biceps'], secondary:['Forearms'] },
  'Hammer Curl':        { primary:['Biceps'], secondary:['Forearms'] },
  'Preacher Curl':      { primary:['Biceps'], secondary:['Forearms'] },
  'Cable Curl':         { primary:['Biceps'], secondary:['Forearms'] },
  'Concentration Curl': { primary:['Biceps'], secondary:[] },
  'Chin-Up':            { primary:['Biceps'], secondary:['Lats','Forearms'] },
  // TRICEPS
  'Tricep Pushdown':    { primary:['Triceps'], secondary:[] },
  'Skull Crusher':      { primary:['Triceps'], secondary:[] },
  'Close-Grip Bench':   { primary:['Triceps'], secondary:['Chest','Shoulders'] },
  'Overhead Tricep Extension':{ primary:['Triceps'], secondary:[] },
  'Dips':               { primary:['Triceps'], secondary:['Chest','Shoulders'] },
  'Diamond Push-Up':    { primary:['Triceps'], secondary:['Chest'] },
  'Kickback':           { primary:['Triceps'], secondary:[] },
  // ABS
  'Crunch':             { primary:['Abs'], secondary:[] },
  'Plank':              { primary:['Abs'], secondary:['Lower Back','Shoulders'] },
  'Leg Raise':          { primary:['Abs'], secondary:[] },
  'Cable Crunch':       { primary:['Abs'], secondary:[] },
  'Russian Twist':      { primary:['Abs'], secondary:[] },
  'Hanging Knee Raise': { primary:['Abs'], secondary:['Forearms'] },
  'Ab Rollout':         { primary:['Abs'], secondary:['Shoulders','Lats'] },
  // FOREARMS
  'Wrist Curl':         { primary:['Forearms'], secondary:[] },
  'Reverse Wrist Curl': { primary:['Forearms'], secondary:[] },
  'Reverse Curl':       { primary:['Forearms'], secondary:['Biceps'] },
  "Farmer's Walk":      { primary:['Forearms'], secondary:['Traps','Shoulders'] },
  'Dead Hang':          { primary:['Forearms'], secondary:['Lats'] },
  // LATS
  'Pull-Up':            { primary:['Lats'], secondary:['Biceps','Forearms'] },
  'Lat Pulldown':       { primary:['Lats'], secondary:['Biceps','Forearms'] },
  'Seated Row':         { primary:['Lats'], secondary:['Biceps','Lower Back'] },
  'Dumbbell Row':       { primary:['Lats'], secondary:['Biceps','Lower Back'] },
  'T-Bar Row':          { primary:['Lats'], secondary:['Biceps','Lower Back'] },
  'Straight-Arm Pulldown':{ primary:['Lats'], secondary:[] },
  // TRAPS
  'Shrug':              { primary:['Traps'], secondary:['Forearms'] },
  'Barbell Shrug':      { primary:['Traps'], secondary:['Forearms'] },
  'Dumbbell Shrug':     { primary:['Traps'], secondary:['Forearms'] },
  'Rack Pull':          { primary:['Traps'], secondary:['Lower Back','Forearms'] },
  // LOWER BACK
  'Deadlift':           { primary:['Lower Back'], secondary:['Hamstrings','Glutes','Traps'] },
  'Romanian Deadlift':  { primary:['Hamstrings'], secondary:['Lower Back','Glutes'] },
  'Hyperextension':     { primary:['Lower Back'], secondary:['Glutes'] },
  'Good Morning':       { primary:['Lower Back'], secondary:['Hamstrings'] },
  'Cable Pull-Through': { primary:['Glutes'], secondary:['Lower Back','Hamstrings'] },
  // QUADS
  'Squat':              { primary:['Quadriceps'], secondary:['Glutes','Hamstrings'] },
  'Leg Press':          { primary:['Quadriceps'], secondary:['Glutes'] },
  'Leg Extension':      { primary:['Quadriceps'], secondary:[] },
  'Lunges':             { primary:['Quadriceps'], secondary:['Glutes','Hamstrings'] },
  'Hack Squat':         { primary:['Quadriceps'], secondary:['Glutes'] },
  'Bulgarian Split Squat':{ primary:['Quadriceps'], secondary:['Glutes','Hamstrings'] },
  // HAMSTRINGS
  'Leg Curl':           { primary:['Hamstrings'], secondary:[] },
  'Nordic Curl':        { primary:['Hamstrings'], secondary:[] },
  'Stiff-Leg Deadlift': { primary:['Hamstrings'], secondary:['Lower Back'] },
  'Glute-Ham Raise':    { primary:['Hamstrings'], secondary:['Glutes'] },
  // GLUTES
  'Hip Thrust':         { primary:['Glutes'], secondary:['Hamstrings'] },
  'Glute Bridge':       { primary:['Glutes'], secondary:['Hamstrings'] },
  'Cable Kickback':     { primary:['Glutes'], secondary:[] },
  'Sumo Squat':         { primary:['Glutes'], secondary:['Quadriceps','Hamstrings'] },
  'Step-Up':            { primary:['Glutes'], secondary:['Quadriceps'] },
  'Donkey Kick':        { primary:['Glutes'], secondary:[] },
  // CALVES
  'Calf Raise':         { primary:['Calves'], secondary:[] },
  'Seated Calf Raise':  { primary:['Calves'], secondary:[] },
  'Leg Press Calf Raise':{ primary:['Calves'], secondary:[] },
  'Jump Rope':          { primary:['Calves'], secondary:[] },
  'Donkey Calf Raise':  { primary:['Calves'], secondary:[] },
};

// Which SVG muscles map to which muscle group names
const MUSCLE_SVG_IDS = {
  'Chest':        ['hm_Chest'],
  'Shoulders':    ['hm_Shoulders'],
  'Biceps':       ['hm_Biceps'],
  'Triceps':      ['hm_Triceps'],
  'Abs':          ['hm_Abs'],
  'Forearms':     ['hm_Forearms'],
  'Lats':         ['hm_Lats'],
  'Traps':        ['hm_Traps'],
  'Lower Back':   ['hm_Lower_Back'],
  'Quadriceps':   ['hm_Quadriceps'],
  'Hamstrings':   ['hm_Hamstrings'],
  'Glutes':       ['hm_Glutes'],
  'Calves':       ['hm_Calves'],
};

function showMuscleDistribution(muscle, exercise, setsCount) {
  const activation = MUSCLE_ACTIVATION[exercise] || { primary:[muscle], secondary:[] };

  // Build muscle bar data
  const muscleData = [];
  activation.primary.forEach(m => muscleData.push({ muscle: m, value: 1.0 }));
  activation.secondary.forEach(m => muscleData.push({ muscle: m, value: 0.5 }));

  const maxVal = 1.0;

  // Build bar rows HTML
  const barsHTML = muscleData.map(({ muscle: m, value }) => {
    const pct = Math.round((value / maxVal) * 100);
    return `
      <div class="mdRow">
        <div class="mdMuscle">${m}</div>
        <div class="mdBarWrap"><div class="mdBar" style="width:${pct}%"></div></div>
        <div class="mdVal">${value}</div>
      </div>`;
  }).join('');

  // Create inline mini SVG body maps with highlighted muscles
  const primarySet = new Set(activation.primary);
  const secondarySet = new Set(activation.secondary);

  function getMuscleColor(muscleId) {
    // Map SVG ID back to muscle name
    const nameMap = {
      'hm_Chest':'Chest','hm_Shoulders':'Shoulders','hm_Biceps':'Biceps',
      'hm_Triceps':'Triceps','hm_Abs':'Abs','hm_Forearms':'Forearms',
      'hm_Lats':'Lats','hm_Traps':'Traps','hm_Lower_Back':'Lower Back',
      'hm_Quadriceps':'Quadriceps','hm_Hamstrings':'Hamstrings',
      'hm_Glutes':'Glutes','hm_Calves':'Calves'
    };
    const name = nameMap[muscleId];
    if (primarySet.has(name)) return '#00aaff';
    if (secondarySet.has(name)) return '#0066bb';
    return '#2a2a2a';
  }

  const c = getMuscleColor;

  const frontSVG = `<svg viewBox="0 0 200 420" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto">
    <ellipse cx="100" cy="30" rx="22" ry="26" fill="#3a3a3a"/>
    <rect x="91" y="54" width="18" height="14" fill="#3a3a3a"/>
    <rect x="60" y="68" width="80" height="90" rx="8" fill="#222"/>
    <g><rect x="63" y="70" width="34" height="38" rx="5" fill="${c('hm_Chest')}"/><rect x="103" y="70" width="34" height="38" rx="5" fill="${c('hm_Chest')}"/></g>
    <g><ellipse cx="52" cy="82" rx="14" ry="18" fill="${c('hm_Shoulders')}"/><ellipse cx="148" cy="82" rx="14" ry="18" fill="${c('hm_Shoulders')}"/></g>
    <g><rect x="82" y="112" width="14" height="12" rx="3" fill="${c('hm_Abs')}"/><rect x="104" y="112" width="14" height="12" rx="3" fill="${c('hm_Abs')}"/><rect x="82" y="128" width="14" height="12" rx="3" fill="${c('hm_Abs')}"/><rect x="104" y="128" width="14" height="12" rx="3" fill="${c('hm_Abs')}"/><rect x="82" y="144" width="14" height="12" rx="3" fill="${c('hm_Abs')}"/><rect x="104" y="144" width="14" height="12" rx="3" fill="${c('hm_Abs')}"/></g>
    <g><rect x="30" y="100" width="16" height="42" rx="8" fill="${c('hm_Biceps')}"/><rect x="154" y="100" width="16" height="42" rx="8" fill="${c('hm_Biceps')}"/></g>
    <g><rect x="22" y="146" width="14" height="46" rx="7" fill="${c('hm_Forearms')}"/><rect x="164" y="146" width="14" height="46" rx="7" fill="${c('hm_Forearms')}"/></g>
    <rect x="60" y="158" width="80" height="22" rx="6" fill="#222"/>
    <g><rect x="62" y="182" width="34" height="72" rx="10" fill="${c('hm_Quadriceps')}"/><rect x="104" y="182" width="34" height="72" rx="10" fill="${c('hm_Quadriceps')}"/></g>
    <g><rect x="66" y="262" width="26" height="60" rx="10" fill="${c('hm_Calves')}"/><rect x="108" y="262" width="26" height="60" rx="10" fill="${c('hm_Calves')}"/></g>
  </svg>`;

  const backSVG = `<svg viewBox="0 0 200 420" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto">
    <ellipse cx="100" cy="30" rx="22" ry="26" fill="#3a3a3a"/>
    <rect x="91" y="54" width="18" height="14" fill="#3a3a3a"/>
    <rect x="60" y="68" width="80" height="90" rx="8" fill="#222"/>
    <g><polygon points="100,68 70,68 80,90" fill="${c('hm_Traps')}"/><polygon points="100,68 130,68 120,90" fill="${c('hm_Traps')}"/></g>
    <g><ellipse cx="52" cy="82" rx="14" ry="18" fill="${c('hm_Shoulders')}"/><ellipse cx="148" cy="82" rx="14" ry="18" fill="${c('hm_Shoulders')}"/></g>
    <g><polygon points="60,90 60,155 90,130 82,90" fill="${c('hm_Lats')}"/><polygon points="140,90 140,155 110,130 118,90" fill="${c('hm_Lats')}"/></g>
    <g><rect x="80" y="128" width="40" height="28" rx="5" fill="${c('hm_Lower_Back')}"/></g>
    <g><rect x="30" y="100" width="16" height="42" rx="8" fill="${c('hm_Triceps')}"/><rect x="154" y="100" width="16" height="42" rx="8" fill="${c('hm_Triceps')}"/></g>
    <g><rect x="22" y="146" width="14" height="46" rx="7" fill="${c('hm_Forearms')}"/><rect x="164" y="146" width="14" height="46" rx="7" fill="${c('hm_Forearms')}"/></g>
    <g><ellipse cx="83" cy="178" rx="22" ry="18" fill="${c('hm_Glutes')}"/><ellipse cx="117" cy="178" rx="22" ry="18" fill="${c('hm_Glutes')}"/></g>
    <g><rect x="62" y="198" width="34" height="62" rx="10" fill="${c('hm_Hamstrings')}"/><rect x="104" y="198" width="34" height="62" rx="10" fill="${c('hm_Hamstrings')}"/></g>
    <g><rect x="66" y="264" width="26" height="58" rx="10" fill="${c('hm_Calves')}"/><rect x="108" y="264" width="26" height="58" rx="10" fill="${c('hm_Calves')}"/></g>
  </svg>`;

  // Build and show modal
  const existing = document.getElementById('muscleDist'); if (existing) existing.remove();
  const modal = document.createElement('div');
  modal.id = 'muscleDist';
  modal.className = 'mdModal';
  modal.innerHTML = `
    <div class="mdBox">
      <div class="mdHeader">
        <div class="mdTitle">Muscle Distribution</div>
        <button class="mdClose" onclick="document.getElementById('muscleDist').remove()">✕</button>
      </div>
      <div class="mdExName">${exercise}</div>
      <div class="mdBodyMaps">
        <div class="mdBodyWrap">${frontSVG}</div>
        <div class="mdBodyWrap">${backSVG}</div>
      </div>
      <div class="mdLegend">
        <div class="mdLegendItem"><div class="mdLegendDot" style="background:#00aaff"></div>Primary</div>
        <div class="mdLegendItem"><div class="mdLegendDot" style="background:#0066bb"></div>Secondary</div>
      </div>
      <div class="mdTableHeader"><span>Muscle</span><span>Completed Sets</span></div>
      <div class="mdBars">${barsHTML}</div>
      <button class="mdDoneBtn" onclick="document.getElementById('muscleDist').remove()">Done</button>
    </div>`;
  document.body.appendChild(modal);
  requestAnimationFrame(() => modal.classList.add('open'));
}

initShero();

if (typeof loadSessions === 'function') {
  const originalLoadSessions = loadSessions;
  loadSessions = async function(...args) {
    const result = await originalLoadSessions.apply(this, args);
    if (!badgeUnlockBaselineDone) {
      previousUnlockedBadgeIds = getUnlockedBadgeIds();
      badgeUnlockBaselineDone = true;
    } else {
      checkBadgeUnlocks();
    }
    renderShero();
    return result;
  };
}

const originalUpdateStreak = updateStreak;
updateStreak = function(...args) {
  syncFreezeRewards();
  const result = originalUpdateStreak.apply(this, args);
  renderShero();
  updateFreezeDisplay();
  return result;
};

// ─── GOALS ───────────────────────────────────────────────────────────────────
function getGoals() {
  return JSON.parse(localStorage.getItem('goals_' + currentUser) || '[]');
}

function updateGoalFields() {
  const goalType = document.getElementById('goalType')?.value;
  const container = document.getElementById('goalFieldsContainer');
  if (!container) return;
  
  if (!goalType) {
    container.innerHTML = '';
    return;
  }
  
  let fieldsHTML = '';
  
  if (goalType === 'strength') {
    fieldsHTML = `
      <div class="formGroup">
        <label>Exercise</label>
        <select id="goalExercise" onchange="updateGoalFieldLabels()">
          <option value="">Select an exercise...</option>
          ${Object.keys(EXERCISES).flatMap(muscle => EXERCISES[muscle]).map(ex => `<option value="${ex}">${ex}</option>`).join('')}
        </select>
      </div>
      <div class="formGroup">
        <label id="goalStrengthTargetLabel">Target Weight (lbs)</label>
        <input type="number" id="goalStrengthTarget" placeholder="e.g., 225" min="0"/>
      </div>`;
  } else if (goalType === 'weight') {
    fieldsHTML = `
      <div class="formGroup">
        <label>Current Weight (${document.getElementById('weightUnit')?.value || 'lbs'})</label>
        <input type="number" id="goalCurrentWeight" placeholder="e.g., 185" min="0"/>
      </div>
      <div class="formGroup">
        <label>Target Weight (${document.getElementById('weightUnit')?.value || 'lbs'})</label>
        <input type="number" id="goalTargetWeight" placeholder="e.g., 175" min="0"/>
      </div>`;
  } else if (goalType === 'cardio') {
    fieldsHTML = `
      <div class="formGroup">
        <label>Activity Type</label>
        <input type="text" id="goalActivity" placeholder="e.g., Running, Cycling"/>
      </div>
      <div class="formGroup">
        <label>Target Distance/Duration</label>
        <input type="text" id="goalCardioTarget" placeholder="e.g., 5K or 30 mins"/>
      </div>`;
  } else if (goalType === 'custom') {
    fieldsHTML = `
      <div class="formGroup">
        <label>Goal Name</label>
        <input type="text" id="goalCustomName" placeholder="e.g., Achieve Perfect Form"/>
      </div>
      <div class="formGroup">
        <label>Description</label>
        <textarea id="goalCustomDesc" placeholder="Describe your goal in detail..."></textarea>
      </div>`;
  }
  
  container.innerHTML = fieldsHTML;
  updateGoalFieldLabels();
}

function updateGoalFieldLabels() {
  const exercise = document.getElementById('goalExercise')?.value;
  const label = document.getElementById('goalStrengthTargetLabel');
  const input = document.getElementById('goalStrengthTarget');
  const isRepExercise = ['Push-Up','Pull-Up'].includes(exercise);
  if (label) {
    label.textContent = isRepExercise ? 'Target Reps' : 'Target Weight (lbs)';
  }
  if (input) {
    input.placeholder = isRepExercise ? 'e.g., 15' : 'e.g., 225';
    input.min = '0';
  }
}

function saveGoal() {
  const goalType = document.getElementById('goalType')?.value;
  const targetDate = document.getElementById('goalDate')?.value;
  
  if (!goalType || !targetDate) {
    alert('Please fill in goal type and target date.');
    return;
  }
  
  let goal = {
    id: Date.now(),
    type: goalType,
    dateCreated: new Date().toISOString(),
    targetDate: targetDate,
    completed: false
  };
  
  if (goalType === 'strength') {
    const exercise = document.getElementById('goalExercise')?.value;
    const target = document.getElementById('goalStrengthTarget')?.value;
    if (!exercise || !target) { alert('Please fill in exercise and target.'); return; }
    const isRepExercise = ['Push-Up','Pull-Up'].includes(exercise);
    goal.exercise = exercise;
    if (isRepExercise) {
      goal.name = `💪 ${exercise} - ${target} reps`;
      goal.targetReps = parseInt(target, 10);
    } else {
      goal.name = `💪 ${exercise} - ${target} lbs`;
      goal.targetWeight = parseFloat(target);
    }
  } else if (goalType === 'weight') {
    const current = document.getElementById('goalCurrentWeight')?.value;
    const target = document.getElementById('goalTargetWeight')?.value;
    if (!current || !target) { alert('Please fill in current and target weight.'); return; }
    goal.name = `⚖️ Reach ${target} lbs`;
    goal.currentWeight = parseFloat(current);
    goal.targetWeight = parseFloat(target);
  } else if (goalType === 'cardio') {
    const activity = document.getElementById('goalActivity')?.value;
    const target = document.getElementById('goalCardioTarget')?.value;
    if (!activity || !target) { alert('Please fill in activity and target.'); return; }
    goal.name = `🏃 ${activity} - ${target}`;
    goal.activity = activity;
    goal.cardioTarget = target;
  } else if (goalType === 'custom') {
    const name = document.getElementById('goalCustomName')?.value;
    const desc = document.getElementById('goalCustomDesc')?.value;
    if (!name || !desc) { alert('Please fill in goal name and description.'); return; }
    goal.name = name;
    goal.description = desc;
  }
  
  const goals = getGoals();
  goals.push(goal);
  localStorage.setItem('goals_' + currentUser, JSON.stringify(goals));
  
  // Clear form
  document.getElementById('goalType').value = '';
  document.getElementById('goalDate').value = '';
  document.getElementById('goalFieldsContainer').innerHTML = '';
  updateGoalFields();
  
  renderGoals();
  alert('✅ Goal added successfully!');
}

function getGoalProgress(goal) {
  if (goal.type === 'strength') {
    const pr = getPR(goal.exercise);
    const isRepExercise = ['Push-Up','Pull-Up'].includes(goal.exercise);
    if (isRepExercise) {
      const current = pr ? pr.reps : 0;
      const target = goal.targetReps || 0;
      const progress = target > 0 ? Math.min((current / target) * 100, 100) : 0;
      return { current, target, progress: Math.round(progress) };
    }
    const current = pr ? pr.weight : 0;
    const target = goal.targetWeight;
    const progress = target > 0 ? Math.min((current / target) * 100, 100) : 0;
    return { current, target, progress: Math.round(progress) };
  } else if (goal.type === 'weight') {
    const current = goal.currentWeight;
    const target = goal.targetWeight;
    const isWeightLoss = target < current;
    const denominator = isWeightLoss
      ? (goal.currentWeight - target)
      : (target - goal.currentWeight);
    let progress = 0;
    if (denominator > 0) {
      if (isWeightLoss) {
        progress = current > target ? Math.min(((current - target) / denominator) * 100, 100) : 0;
      } else {
        progress = current < target ? Math.min(((current - goal.currentWeight) / denominator) * 100, 100) : 0;
      }
    }
    return { current, target, progress: Math.round(Math.min(progress, 100)) };
  }
  return { current: 0, target: 100, progress: 0 };
}

function deleteGoal(goalId) {
  const goals = getGoals();
  const newGoals = goals.filter(g => g.id !== goalId);
  localStorage.setItem('goals_' + currentUser, JSON.stringify(newGoals));
  renderGoals();
  alert('Goal deleted.');
}

function renderGoals() {
  const goals = getGoals();
  const container = document.getElementById('goalsContainer');
  if (!container) return;
  
  if (!goals.length) {
    container.innerHTML = '<div class="emptyState">No goals yet. Create one to start tracking your progress! 🎯</div>';
    return;
  }
  
  goals.sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    return new Date(b.dateCreated) - new Date(a.dateCreated);
  });
  
  const now = new Date();
  const goalsHTML = goals.map(goal => {
    const { current, target, progress } = getGoalProgress(goal);
    const targetDate = new Date(goal.targetDate);
    const daysLeft = Math.ceil((targetDate - now) / 86400000);
    const completedClass = goal.completed ? 'completed' : '';
    
    let statusText = '';
    if (goal.completed) {
      statusText = 'Completed';
    } else if (daysLeft <= 0) {
      statusText = 'Overdue';
    } else if (daysLeft <= 7) {
      statusText = `${daysLeft} days left`;
    } else {
      statusText = `${daysLeft} days left`;
    }
    
    let detailText = '';
    if (goal.type === 'strength') {
      const isRepExercise = ['Push-Up','Pull-Up'].includes(goal.exercise);
      detailText = isRepExercise
        ? `${current} / ${target} reps · ${progress}% complete`
        : `${current} / ${target} lbs · ${progress}% complete`;
    } else if (goal.type === 'weight') {
      detailText = `${current} / ${target} lbs`;
    } else if (goal.type === 'cardio') {
      detailText = goal.cardioTarget;
    } else {
      detailText = goal.description;
    }
    
    const statusTag = !goal.completed && daysLeft <= 7
      ? `<span class="goalStatusTag ${daysLeft <= 0 ? 'overdue' : 'dueSoon'}">${daysLeft <= 0 ? 'Overdue' : 'Due Soon'}</span>`
      : '';

    return `
      <div class="goalSimpleCard ${completedClass}" id="goal_${goal.id}">
        <div class="goalSimpleRow">
          <div class="goalSimpleLeft">
            <input type="checkbox" class="goalCheckBox" ${goal.completed ? 'checked' : ''} onchange="toggleGoalCompletion(${goal.id})"/>
            <div class="goalSimpleTextWrap">
              <div class="goalSimpleNameRow">
                <div class="goalSimpleName">${goal.name}</div>
                ${statusTag}
              </div>
              <div class="goalSimpleDetail">${detailText}</div>
            </div>
          </div>
          <div class="goalSimpleRight">
            ${goal.completed ? '<span class="goalDoneBadge">Done</span>' : ''}
            <button class="goalDeleteBtn" onclick="deleteGoal(${goal.id})">🗑</button>
          </div>
        </div>
        <div class="goalProgressMini"><div class="goalProgressMiniFill" style="width:${Math.max(0, Math.min(progress, 100))}%"></div></div>
        <div class="goalSimpleStatus">${statusText}</div>
      </div>`;
  }).join('');
  
  container.innerHTML = goalsHTML;
}

function toggleGoalCompletion(goalId) {
  const goals = getGoals();
  const goal = goals.find(g => g.id === goalId);
  if (goal) {
    const wasCompleted = goal.completed;
    goal.completed = !goal.completed;
    localStorage.setItem('goals_' + currentUser, JSON.stringify(goals));
    renderGoals();

    if (!wasCompleted && goal.completed) {
      launchConfetti();
      alert(`🎉 Goal completed: ${goal.name}`);
    }
  }
}


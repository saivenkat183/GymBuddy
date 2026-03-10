// ─── CONFIG ───────────────────────────────────────────────────────────────────
const API = 'https://gymbuddy-backend-wsn1.onrender.com/api';

// ─── DATA ─────────────────────────────────────────────────────────────────────
const EXERCISES = {
  Chest:['Bench Press','Incline Bench Press','Decline Bench Press','Cable Fly','Dumbbell Fly','Push-Up','Chest Dip'],
  Shoulders:['Overhead Press','Lateral Raise','Front Raise','Arnold Press','Face Pull','Upright Row','Cable Lateral Raise'],
  Biceps:['Barbell Curl','Dumbbell Curl','Hammer Curl','Preacher Curl','Cable Curl','Concentration Curl','Chin-Up'],
  Triceps:['Tricep Pushdown','Skull Crusher','Close-Grip Bench','Overhead Tricep Extension','Dips','Diamond Push-Up','Kickback'],
  Abs:['Crunch','Plank','Leg Raise','Cable Crunch','Russian Twist','Hanging Knee Raise','Ab Rollout'],
  Forearms:['Wrist Curl','Reverse Wrist Curl','Hammer Curl','Farmer\'s Walk','Dead Hang','Reverse Curl'],
  Lats:['Pull-Up','Lat Pulldown','Seated Row','Dumbbell Row','T-Bar Row','Straight-Arm Pulldown'],
  Traps:['Shrug','Barbell Shrug','Dumbbell Shrug','Face Pull','Rack Pull','Upright Row'],
  'Lower Back':['Deadlift','Romanian Deadlift','Hyperextension','Good Morning','Cable Pull-Through'],
  Quadriceps:['Squat','Leg Press','Leg Extension','Lunges','Hack Squat','Bulgarian Split Squat'],
  Hamstrings:['Romanian Deadlift','Leg Curl','Nordic Curl','Stiff-Leg Deadlift','Glute-Ham Raise','Good Morning'],
  Glutes:['Hip Thrust','Glute Bridge','Cable Kickback','Sumo Squat','Step-Up','Donkey Kick'],
  Calves:['Calf Raise','Seated Calf Raise','Leg Press Calf Raise','Jump Rope','Donkey Calf Raise']
};

const MUSCLE_COLORS = ['#2a2a2a','#1a5c2a','#27ae60','#2ecc71'];

let currentUser = null, isRegister = false, token = null;
let currentMuscle = '', currentExercise = '', currentSets = [];
let progressChart = null, allSessions = [];

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
    // Force scroll to absolute top after page renders
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
function toggleAuthMode() {
  isRegister = !isRegister;
  document.getElementById('authNameWrap').classList.toggle('hidden', !isRegister);
  document.querySelector('#authScreen .btn').textContent = isRegister ? 'Register' : 'Login';
  document.querySelector('#authScreen .btn.sec').textContent = isRegister ? 'Already have an account? Login' : 'Don\'t have an account? Register';
  document.getElementById('authMsg').classList.add('hidden');
}

function showAuthMsg(m) {
  const el = document.getElementById('authMsg');
  el.textContent = m;
  el.classList.remove('hidden');
}

async function doAuth() {
  const username = document.getElementById('authUser').value.trim();
  const password = document.getElementById('authPass').value;
  if (!username || !password) { showAuthMsg('Please fill all fields'); return; }
  const endpoint = isRegister ? '/auth/register' : '/auth/login';
  const body = isRegister
    ? { username, password, name: document.getElementById('authName').value.trim() || username }
    : { username, password };
  showLoading();
  try {
    const res = await fetch(API + endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const data = await res.json();
    hideLoading();
    if (!res.ok) { showAuthMsg(data.message); return; }
    token = data.token; currentUser = data.username;
    document.getElementById('authScreen').style.display = 'none';
    document.getElementById('appScreen').style.display = 'flex';
    document.getElementById('bottomNav').style.display = 'flex';
    document.getElementById('navUser').textContent = 'Hey, ' + data.name + '!';
    document.getElementById('avatarInitial').textContent = data.name[0].toUpperCase();
    document.getElementById('navAvatarInitial').textContent = data.name[0].toUpperCase();
    await loadSessions();
    updateStreak();
    updateHeatmap();
    loadProfileImage();
    const now = new Date();
    calYear = now.getFullYear();
    calMonth = now.getMonth();
  } catch (err) { hideLoading(); showAuthMsg('Cannot connect to server. Is it running?'); }
}

function logout() {
  currentUser = null; token = null; allSessions = [];
  document.getElementById('authScreen').style.display = 'flex';
  document.getElementById('appScreen').style.display = 'none';
  document.getElementById('bottomNav').style.display = 'none';
  document.getElementById('authUser').value = '';
  document.getElementById('authPass').value = '';
}

// ─── SESSIONS ─────────────────────────────────────────────────────────────────
async function loadSessions() {
  showLoading();
  try {
    const res = await fetch(API + '/workouts', { headers: { 'Authorization': 'Bearer ' + token } });
    allSessions = await res.json();
  } catch (err) { console.error('Failed to load sessions:', err); }
  hideLoading();
}

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
  if (id === 'leaderboardPage') renderLeaderboard();
  if (id === 'aboutPage') loadAbout();
  if (id === 'feedbackPage') renderFeedbackHistory();
  if (id === 'badgesPage') renderBadges();
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
function updateHeatmap() {
  const counts = {};
  allSessions.forEach(s => { counts[s.muscle] = (counts[s.muscle] || 0) + 1; });
  const max = Math.max(...Object.values(counts), 1);
  Object.keys(EXERCISES).forEach(muscle => {
    const id = 'hm_' + muscle.replace(/\s+/g, '_');
    const el = document.getElementById(id);
    if (!el) return;
    const count = counts[muscle] || 0;
    const intensity = Math.min(Math.floor((count / max) * 3), 3);
    el.style.fill = MUSCLE_COLORS[intensity];
  });
}

// ─── STREAK ───────────────────────────────────────────────────────────────────
function getRestDays() {
  return JSON.parse(localStorage.getItem('restDays_' + currentUser) || '[]');
}

function logRestDay() {
  const today = new Date().toLocaleDateString('en-CA');
  const restDays = getRestDays();

  // Already logged today
  if (restDays.includes(today)) {
    alert('You already logged a rest day today! 😴');
    return;
  }

  // Worked out today
  const workedOutToday = allSessions.some(s =>
    new Date(s.date).toLocaleDateString('en-CA') === today
  );
  if (workedOutToday) {
    alert('You already logged a workout today! 💪');
    return;
  }

  // Count consecutive rest days going back from today
  let consecutiveRest = 0;
  let check = new Date();
  check.setDate(check.getDate() - 1); // start from yesterday
  for (let i = 0; i < 3; i++) {
    const key = check.toLocaleDateString('en-CA');
    const wasWorkout = allSessions.some(s => new Date(s.date).toLocaleDateString('en-CA') === key);
    if (restDays.includes(key) && !wasWorkout) {
      consecutiveRest++;
      check.setDate(check.getDate() - 1);
    } else break;
  }

  // 3 rest days in a row already — 4th resets streak
  if (consecutiveRest >= 3) {
    restDays.push(today);
    localStorage.setItem('restDays_' + currentUser, JSON.stringify(restDays));
    // Clear streak by wiping rest days except today (streak calc will find no workout days)
    localStorage.setItem('streakBroken_' + currentUser, today);
    updateStreak();
    renderCalendar();
    alert('😬 4 rest days in a row! Your streak has been reset. Get back to the gym tomorrow! 💪');
    return;
  }

  restDays.push(today);
  localStorage.setItem('restDays_' + currentUser, JSON.stringify(restDays));
  updateStreak();
  if (calYear !== undefined) renderCalendar();
  alert(`Rest day logged! 😴 Your streak is safe! (${consecutiveRest + 1}/3 rest days in a row)`);
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
  const allDays = [...new Set([...workoutDays, ...restDays])]
    .map(d => new Date(d + 'T12:00:00'))
    .sort((a, b) => a - b);
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
function openMuscle(muscle) {
  currentMuscle = muscle; currentExercise = ''; currentSets = [];
  document.getElementById('muscleLabel').textContent = 'Selected: ' + muscle;
  document.getElementById('modalMuscle').textContent = muscle;
  document.getElementById('modalDate').textContent = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const list = document.getElementById('exerciseList');
  list.innerHTML = '';
  (EXERCISES[muscle] || []).forEach(ex => {
    const pr = getPR(ex);
    const wrapper = document.createElement('div');
    const d = document.createElement('div');
    d.className = 'exCard';
    d.innerHTML = `<h4>${ex}${pr ? `<span class="prBadge">PR: ${pr.weight}lbs × ${pr.reps}</span>` : ''}</h4><p>Click to log sets</p>`;
    const logDiv = document.createElement('div');
    logDiv.className = 'inlineLog hidden';
    logDiv.id = `log_${ex.replace(/\s+/g, '_')}`;
    logDiv.innerHTML = `<h4>${ex}</h4><div id="sets_${ex.replace(/\s+/g, '_')}"></div><button class="addSetBtn" onclick="addSet('${ex.replace(/\s+/g, '_')}')">+ Add Set</button>`;
    d.onclick = () => selectExercise(ex, d, logDiv);
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
  if (datePicker === 'yesterday') {
    workoutDate.setDate(workoutDate.getDate() - 1);
  }

  try {
    const res = await fetch(API + '/workouts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
      body: JSON.stringify({
        muscle: currentMuscle,
        exercise: currentExercise,
        sets: validSets,
        date: workoutDate.toISOString()
      })
    });
    const data = await res.json();
    allSessions.push(data.session);
    checkPR(data.session);
    updateHeatmap();
    updateStreak();
    closeModal();
  } catch (err) { alert('Failed to save workout. Is the server running?'); }
}

// ─── PR ───────────────────────────────────────────────────────────────────────
function getPR(ex) {
  const sessions = allSessions.filter(s => s.exercise === ex);
  if (!sessions.length) return null;
  let best = null;
  sessions.forEach(s => s.sets.forEach(set => {
    const v = parseFloat(set.weight) * parseInt(set.reps);
    if (!best || v > best.val) best = { val: v, weight: set.weight, reps: set.reps };
  }));
  return best;
}

function checkPR(session) {
  const allPrev = allSessions.filter(s => s.exercise === session.exercise && s._id !== session._id);
  let prevBest = 0;
  allPrev.forEach(s => s.sets.forEach(set => { prevBest = Math.max(prevBest, parseFloat(set.weight || 0) * parseInt(set.reps || 0)); }));
  let newBest = 0;
  session.sets.forEach(s => { newBest = Math.max(newBest, parseFloat(s.weight || 0) * parseInt(s.reps || 0)); });
  if (newBest > prevBest && prevBest > 0) {
    setTimeout(() => {
      launchConfetti();
      alert(`🏆 New PR on ${session.exercise}! ${newBest.toFixed(0)} lbs·reps`);
    }, 200);
  }
}

// ─── HISTORY ──────────────────────────────────────────────────────────────────
let histCalYear, histCalMonth;

function renderHistory() {
  const now = new Date();
  if (!histCalYear) { histCalYear = now.getFullYear(); histCalMonth = now.getMonth(); }
  renderHistoryCalendar();
  document.getElementById('historyDayDetail').innerHTML = '<div class="histSelectDay">Select a day to view workouts</div>';
}

function histCalPrev() { histCalMonth--; if (histCalMonth < 0) { histCalMonth = 11; histCalYear--; } renderHistoryCalendar(); }
function histCalNext() { histCalMonth++; if (histCalMonth > 11) { histCalMonth = 0; histCalYear++; } renderHistoryCalendar(); }

function renderHistoryCalendar() {
  const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  document.getElementById('histCalMonthLabel').textContent = `${MONTHS[histCalMonth]} ${histCalYear}`;

  // Build workout map with set counts for dot intensity
  const workoutMap = {};
  allSessions.forEach(s => {
    const key = new Date(s.date).toLocaleDateString('en-CA');
    if (!workoutMap[key]) workoutMap[key] = { sessions: [], sets: 0 };
    workoutMap[key].sessions.push(s);
    workoutMap[key].sets += s.sets.length;
  });

  const grid = document.getElementById('histCalGrid');
  grid.innerHTML = '';

  DAYS.forEach(d => {
    const el = document.createElement('div');
    el.className = 'calDayName';
    el.textContent = d;
    grid.appendChild(el);
  });

  const firstDay = new Date(histCalYear, histCalMonth, 1).getDay();
  const daysInMonth = new Date(histCalYear, histCalMonth + 1, 0).getDate();
  const today = new Date().toLocaleDateString('en-CA');

  for (let i = 0; i < firstDay; i++) {
    const el = document.createElement('div');
    el.className = 'calDay empty';
    grid.appendChild(el);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const dateKey = `${histCalYear}-${String(histCalMonth + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const el = document.createElement('div');
    el.className = 'calDay histCalDay';
    if (dateKey === today) el.classList.add('today');

    const dayNum = document.createElement('span');
    dayNum.textContent = d;
    el.appendChild(dayNum);

    if (workoutMap[dateKey]) {
      const sets = workoutMap[dateKey].sets;
      // dot intensity based on sets
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
  // Highlight selected day
  document.querySelectorAll('.histCalDay').forEach(el => el.classList.remove('selectedDay'));
  const d = new Date(dateKey + 'T12:00:00');
  const dayNum = d.getDate();
  const firstDay = new Date(histCalYear, histCalMonth, 1).getDay();
  const allDays = document.querySelectorAll('.histCalDay');
  if (allDays[dayNum - 1]) allDays[dayNum - 1].classList.add('selectedDay');

  const detail = document.getElementById('historyDayDetail');
  const dateLabel = d.toLocaleDateString('en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric' });

  detail.innerHTML = `
    <div class="histDayHeader">${dateLabel}</div>
    ${sessions.map(s => `
      <div class="sessionCard" id="session_${s._id}">
        <div class="sDateRow">
          <div class="sDate">${new Date(s.date).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</div>
          <button class="deleteBtn" onclick="deleteSession('${s._id}')">🗑 Delete</button>
        </div>
        <div class="sTitle">${s.muscle} — ${s.exercise}</div>
        <div class="setLog"><table>
          <tr><th>Set</th><th>Weight (lbs)</th><th>Reps</th><th>Volume</th></tr>
          ${s.sets.map((set, i) => `<tr><td>${i+1}</td><td>${set.weight} lbs</td><td>${set.reps}</td><td>${(parseFloat(set.weight||0)*parseInt(set.reps||0)).toFixed(0)}</td></tr>`).join('')}
        </table></div>
      </div>`).join('')}`;
}

// ─── DELETE SESSION ───────────────────────────────────────────────────────────
async function deleteSession(sessionId) {
  if (!confirm('Delete this workout? This cannot be undone.')) return;
  try {
    const res = await fetch(API + '/workouts/' + sessionId, {
      method: 'DELETE',
      headers: { 'Authorization': 'Bearer ' + token }
    });
    if (!res.ok) throw new Error('Failed');
    allSessions = allSessions.filter(s => s._id !== sessionId);
    updateHeatmap();
    updateStreak();
    renderHistoryCalendar();
    document.getElementById('historyDayDetail').innerHTML = '<div class="histSelectDay">Select a day to view workouts</div>';
  } catch (err) {
    alert('Could not delete. Is the server running?');
  }
}

// ─── PROGRESS ─────────────────────────────────────────────────────────────────
function renderProgress() {
  const streak = getStreak();
  const bestStreak = getBestStreak();
  document.getElementById('streakNum').textContent = streak;
  document.getElementById('bestStreakNum').textContent = bestStreak;

  renderCalendar();
  renderWeeklyLoad();

  const exMap = {};
  allSessions.forEach(s => {
    if (!exMap[s.exercise]) exMap[s.exercise] = { best: 0, bestSet: null, date: '' };
    s.sets.forEach(set => {
      const v = parseFloat(set.weight || 0) * parseInt(set.reps || 0);
      if (v > exMap[s.exercise].best) { exMap[s.exercise] = { best: v, bestSet: set, date: s.date }; }
    });
  });
  const exes = Object.keys(exMap);
  const sel = document.getElementById('chartExSelect');
  sel.innerHTML = exes.map(e => `<option>${e}</option>`).join('');
  renderChart();
}

// ─── CALENDAR ─────────────────────────────────────────────────────────────────
function calPrevMonth() {
  calMonth--;
  if (calMonth < 0) { calMonth = 11; calYear--; }
  renderCalendar();
}
function calNextMonth() {
  calMonth++;
  if (calMonth > 11) { calMonth = 0; calYear++; }
  renderCalendar();
}

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

  DAYS.forEach(d => {
    const el = document.createElement('div');
    el.className = 'calDayName';
    el.textContent = d;
    grid.appendChild(el);
  });

  const firstDay = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const today = new Date().toLocaleDateString('en-CA');

  for (let i = 0; i < firstDay; i++) {
    const el = document.createElement('div');
    el.className = 'calDay empty';
    grid.appendChild(el);
  }

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
    } else if (restDays.includes(dateKey)) {
      el.classList.add('isRestDay');
      el.title = 'Rest Day 😴';
    }
    grid.appendChild(el);
  }

  const monthWorkouts = allSessions.filter(s => {
    const d = new Date(s.date);
    return d.getFullYear() === calYear && d.getMonth() === calMonth;
  });
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
      <span>${s.muscle}</span>${s.exercise}
      — ${s.sets.length} set${s.sets.length !== 1 ? 's' : ''}
    </div>`).join('');

  detail.classList.remove('hidden');
}

// ─── WEEKLY MUSCLE LOAD ───────────────────────────────────────────────────────
function weekPrev() { weekOffset--; renderWeeklyLoad(); }
function weekNext() { if (weekOffset < 0) { weekOffset++; renderWeeklyLoad(); } }

function renderWeeklyLoad() {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((dayOfWeek + 6) % 7) + (weekOffset * 7));
  monday.setHours(0, 0, 0, 0);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  const fmt = d => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  document.getElementById('weekLabel').textContent = `${fmt(monday)} – ${fmt(sunday)}`;

  const weekSessions = allSessions.filter(s => {
    const d = new Date(s.date);
    return d >= monday && d <= sunday;
  });

  const muscleSetCounts = {};
  weekSessions.forEach(s => {
    muscleSetCounts[s.muscle] = (muscleSetCounts[s.muscle] || 0) + s.sets.length;
  });

  const container = document.getElementById('muscleLoadBars');

  if (!Object.keys(muscleSetCounts).length) {
    container.innerHTML = '<div class="noLoadData">No workouts this week</div>';
    return;
  }

  const maxSets = Math.max(...Object.values(muscleSetCounts));
  const sorted = Object.entries(muscleSetCounts).sort((a, b) => b[1] - a[1]);

  container.innerHTML = sorted.map(([muscle, sets]) => {
    const pct = Math.round((sets / maxSets) * 100);
    return `
      <div class="loadRow">
        <div class="loadMuscle">${muscle}</div>
        <div class="loadBarWrap">
          <div class="loadBar" style="width:${pct}%"></div>
        </div>
        <div class="loadSets">${sets} set${sets !== 1 ? 's' : ''}</div>
      </div>`;
  }).join('');
}

function renderChart() {
  const ex = document.getElementById('chartExSelect').value;
  if (!ex) return;
  const sessions = allSessions.filter(s => s.exercise === ex).sort((a, b) => new Date(a.date) - new Date(b.date));
  const labels = sessions.map(s => new Date(s.date).toLocaleDateString());
  const data = sessions.map(s => s.sets.reduce((sum, set) => sum + parseFloat(set.weight || 0) * parseInt(set.reps || 0), 0));
  if (progressChart) progressChart.destroy();
  progressChart = new Chart(document.getElementById('progressChart'), {
    type: 'line',
    data: { labels, datasets: [{ label: 'Total Volume (lbs·reps)', data, borderColor: '#e94560', backgroundColor: 'rgba(233,69,96,.15)', tension: .3, fill: true, pointBackgroundColor: '#e94560' }] },
    options: { responsive: true, plugins: { legend: { labels: { color: '#aaa' } } }, scales: { x: { ticks: { color: '#666' } }, y: { ticks: { color: '#666' }, grid: { color: '#222' } } } }
  });
}

// ─── PR BY MUSCLE ─────────────────────────────────────────────────────────────
function renderPRByMuscle() {
  const el = document.getElementById('prByMuscle');
  if (!allSessions.length) {
    el.innerHTML = '<div class="emptyState">No workouts logged yet. Start lifting to see your PRs! 💪</div>';
    return;
  }

  // Build best lift per exercise grouped by muscle
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
        return `
        <div class="prCard">
          <div class="prExName">${ex}</div>
          <div class="prRight">
            <div class="prWeightBig">${pr.weight}<span>lbs</span></div>
            <div class="prRepsDate">${pr.reps} reps · ${date}</div>
          </div>
        </div>`;
      }).join('')}
    </div>`).join('');
}

// ─── LEADERBOARD — UNDER CONSTRUCTION ────────────────────────────────────────
async function renderLeaderboard() {
  const el = document.getElementById('leaderboardList');
  el.innerHTML = `
    <div class="underConstruction">
      <div class="ucIcon">🚧</div>
      <div class="ucTitle">Under Construction</div>
      <div class="ucMsg">The Leaderboard is being built. Check back soon!</div>
    </div>`;
}

// ─── STREAK FREEZE ────────────────────────────────────────────────────────────
function getFreezeDays() {
  return JSON.parse(localStorage.getItem('freezeDays_' + currentUser) || '[]');
}

function getFreezeTokens() {
  const used = getFreezeDays().length;
  return Math.max(0, 2 - used);
}

function useFreeze() {
  const today = new Date().toLocaleDateString('en-CA');
  const freezeDays = getFreezeDays();
  const tokens = getFreezeTokens();

  if (tokens <= 0) {
    alert('❄️ You have no freeze tokens left!');
    return;
  }

  if (freezeDays.includes(today)) {
    alert('You already used a freeze today!');
    return;
  }

  // Check if worked out or rest day today
  const workedOut = allSessions.some(s => new Date(s.date).toLocaleDateString('en-CA') === today);
  const isRestDay = getRestDays().includes(today);
  if (workedOut || isRestDay) {
    alert('You already logged activity today — no need to freeze!');
    return;
  }

  // No 2 consecutive freezes
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = yesterday.toLocaleDateString('en-CA');
  if (freezeDays.includes(yesterdayKey)) {
    alert('❄️ You can\'t use freeze 2 days in a row! Log a workout or rest day first.');
    return;
  }

  freezeDays.push(today);
  localStorage.setItem('freezeDays_' + currentUser, JSON.stringify(freezeDays));
  updateStreak();
  updateFreezeDisplay();
  alert(`❄️ Streak frozen! You have ${tokens - 1} freeze token${tokens - 1 !== 1 ? 's' : ''} left.`);
}

function updateFreezeDisplay() {
  const el = document.getElementById('freezeTokenDisplay');
  if (!el) return;
  const tokens = getFreezeTokens();
  const icons = '❄️'.repeat(tokens);
  el.innerHTML = `<div class="freezeDisplay"><span class="freezeLabel">Streak Freeze Tokens</span><span class="freezeIcons">${icons}</span><span class="freezeCount">${tokens} / 2 remaining</span></div>`;
}

// ─── PROFILE IMAGE ────────────────────────────────────────────────────────────
function handleProfileImage(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    const base64 = e.target.result;
    localStorage.setItem('profileImg_' + currentUser, base64);
    updateAllAvatars(base64);
  };
  reader.readAsDataURL(file);
}

function updateAllAvatars(base64) {
  // Main about page avatar
  const avatarEl = document.getElementById('avatarInitial');
  if (base64) {
    avatarEl.style.backgroundImage = `url(${base64})`;
    avatarEl.style.backgroundSize = 'cover';
    avatarEl.style.backgroundPosition = 'center';
    avatarEl.textContent = '';
  }
  // Nav avatar
  const navAvatar = document.getElementById('navAvatarInitial');
  if (base64) {
    navAvatar.style.backgroundImage = `url(${base64})`;
    navAvatar.style.backgroundSize = 'cover';
    navAvatar.style.backgroundPosition = 'center';
    navAvatar.textContent = '';
  }
  // Composer avatar in feed
  const composerAvatar = document.getElementById('composerAvatar');
  if (composerAvatar && base64) {
    composerAvatar.style.backgroundImage = `url(${base64})`;
    composerAvatar.style.backgroundSize = 'cover';
    composerAvatar.style.backgroundPosition = 'center';
    composerAvatar.textContent = '';
  }
}

function loadProfileImage() {
  const base64 = localStorage.getItem('profileImg_' + currentUser);
  if (base64) updateAllAvatars(base64);
}


function toggleHeightUnit() {
  const unit = document.getElementById('heightUnit').value;
  document.getElementById('heightCm').classList.toggle('hidden', unit === 'ft');
  document.getElementById('heightFt').classList.toggle('hidden', unit === 'cm');
}

function loadAbout() {
  const data = JSON.parse(localStorage.getItem('about_' + currentUser) || '{}');
  const hasData = data.name || data.age || data.heightCm || data.heightFt || data.weight || data.goal;
  loadProfileImage();

  if (hasData) {
    document.getElementById('aboutViewMode').classList.remove('hidden');
    document.getElementById('aboutEditMode').classList.add('hidden');
    renderAboutView(data);
    updateFreezeDisplay();
  } else {
    // First time — show edit mode
    document.getElementById('aboutViewMode').classList.add('hidden');
    document.getElementById('aboutEditMode').classList.remove('hidden');
  }

  // Populate fields anyway for editing later
  if (data.name) document.getElementById('aboutName').value = data.name;
  if (data.age) document.getElementById('aboutAge').value = data.age;
  if (data.heightCm) document.getElementById('aboutHeightCm').value = data.heightCm;
  if (data.heightFt) document.getElementById('aboutHeightFt').value = data.heightFt;
  if (data.heightIn) document.getElementById('aboutHeightIn').value = data.heightIn;
  if (data.weight) document.getElementById('aboutWeight').value = data.weight;
  if (data.weightUnit) document.getElementById('weightUnit').value = data.weightUnit;
  if (data.goal) document.getElementById('aboutGoal').value = data.goal;
  if (data.heightUnit) { document.getElementById('heightUnit').value = data.heightUnit; toggleHeightUnit(); }

  renderAboutStats(data);
}

function enableAboutEdit() {
  document.getElementById('aboutViewMode').classList.add('hidden');
  document.getElementById('aboutEditMode').classList.remove('hidden');
}

function renderAboutView(data) {
  let height = '—';
  if (data.heightUnit === 'ft' && data.heightFt) height = `${data.heightFt}ft ${data.heightIn || 0}in`;
  else if (data.heightCm) height = `${data.heightCm} cm`;

  const fields = [
    { label: 'Name', value: data.name || '—' },
    { label: 'Age', value: data.age ? data.age + ' yrs' : '—' },
    { label: 'Height', value: height },
    { label: 'Weight', value: data.weight ? data.weight + ' ' + (data.weightUnit || 'lbs') : '—' },
    { label: 'Goal', value: data.goal || '—' },
  ];

  document.getElementById('aboutViewGrid').innerHTML = fields.map(f => `
    <div class="aboutViewItem">
      <div class="aboutViewLabel">${f.label}</div>
      <div class="aboutViewValue">${f.value}</div>
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
    goal: document.getElementById('aboutGoal').value
  };
  localStorage.setItem('about_' + currentUser, JSON.stringify(data));

  // Switch back to view mode
  document.getElementById('aboutEditMode').classList.add('hidden');
  document.getElementById('aboutViewMode').classList.remove('hidden');
  renderAboutView(data);
  renderAboutStats(data);
  alert('Profile saved! ✅');
}

function renderAboutStats(data) {
  document.getElementById('aboutStats').innerHTML = '';
}

// ─── AI TRAINER ───────────────────────────────────────────────────────────────
let chatHistory = [];

function getContext() {
  const recent = allSessions.slice(-5).map(s => `${s.muscle} - ${s.exercise}`).join(', ');
  return `The user's name is ${currentUser}. Their recent workouts: ${recent || 'No workouts logged yet'}.`;
}

async function sendMessage() {
  const input = document.getElementById('chatInputField');
  const msg = input.value.trim();
  if (!msg) return;
  input.value = '';
  appendMessage(msg, 'user');
  chatHistory.push({ role: 'user', content: msg });
  const typing = appendMessage('Typing...', 'bot', true);
  try {
    const res = await fetch(API + '/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: msg, history: chatHistory.slice(0, -1), context: getContext() })
    });
    const data = await res.json();
    typing.remove();
    appendMessage(data.reply, 'bot');
    chatHistory.push({ role: 'assistant', content: data.reply });
  } catch (err) {
    typing.remove();
    appendMessage('Sorry I could not connect. Is the server running?', 'bot');
  }
}

function askQuick(q) { document.getElementById('chatInputField').value = q; sendMessage(); }

function appendMessage(text, sender, isTyping = false) {
  const box = document.getElementById('chatBox');
  const msg = document.createElement('div');
  msg.className = `chatMsg ${sender}`;
  const bubble = document.createElement('div');
  bubble.className = `chatBubble${isTyping ? ' typing' : ''}`;
  bubble.textContent = text;
  msg.appendChild(bubble);
  box.appendChild(msg);
  box.scrollTop = box.scrollHeight;
  return msg;
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
    msgEl.classList.remove('hidden');
    return;
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
  const el = document.getElementById('feedbackHistory');
  if (!feedbacks.length) { el.innerHTML = ''; return; }
  const typeLabel = { bug: '🐛 Bug Report', feature: '✨ Feature Request', other: '💡 Other' };
  el.innerHTML = `<h3>Your Previous Feedback</h3>` + feedbacks.map(f => `
    <div class="feedbackItem">
      <div class="fiType">${typeLabel[f.type] || f.type}</div>
      <div class="fiTitle">${f.title}</div>
      <div class="fiDesc">${f.desc}</div>
      <div class="fiDate">${new Date(f.date).toLocaleString()}</div>
    </div>`).join('');
}

// ─── COMMUNITY FEED / DRAWER ──────────────────────────────────────────────────
function openDrawer() {
  document.getElementById('drawerOverlay').classList.remove('hidden');
  const drawer = document.getElementById('drawer');
  drawer.classList.remove('hidden');
  requestAnimationFrame(() => drawer.classList.add('open'));
  // Set composer avatar
  if (currentUser) {
    const name = JSON.parse(localStorage.getItem('about_' + currentUser) || '{}').name || currentUser;
    const profileImg = localStorage.getItem('profileImg_' + currentUser);
    const composerAvatar = document.getElementById('composerAvatar');
    if (profileImg) {
      composerAvatar.style.backgroundImage = `url(${profileImg})`;
      composerAvatar.style.backgroundSize = 'cover';
      composerAvatar.style.backgroundPosition = 'center';
      composerAvatar.textContent = '';
    } else {
      composerAvatar.textContent = name[0].toUpperCase();
    }
  }
  renderFeed();
}

function closeDrawer() {
  const drawer = document.getElementById('drawer');
  drawer.classList.remove('open');
  setTimeout(() => {
    drawer.classList.add('hidden');
    document.getElementById('drawerOverlay').classList.add('hidden');
  }, 380);
}

let selectedImageBase64 = null;

function handleImageSelect(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    selectedImageBase64 = e.target.result;
    document.getElementById('imagePreview').src = selectedImageBase64;
    document.getElementById('imagePreviewWrap').classList.remove('hidden');
    document.getElementById('postCaption').placeholder = 'Add a caption...';
  };
  reader.readAsDataURL(file);
}

function removeImage() {
  selectedImageBase64 = null;
  document.getElementById('imagePreview').src = '';
  document.getElementById('imagePreviewWrap').classList.add('hidden');
  document.getElementById('postImageInput').value = '';
  document.getElementById('postCaption').placeholder = 'Your thoughts...';
}

function submitPost() {
  const caption = document.getElementById('postCaption').value.trim();
  if (!caption && !selectedImageBase64) return;
  const name = JSON.parse(localStorage.getItem('about_' + currentUser) || '{}').name || currentUser;
  const posts = JSON.parse(localStorage.getItem('gymbuddy_posts') || '[]');
  const profileImg = localStorage.getItem('profileImg_' + currentUser) || null;
  posts.unshift({
    id: Date.now(),
    username: currentUser,
    name,
    caption,
    image: selectedImageBase64 || null,
    profileImg,
    date: new Date().toISOString(),
    likes: []
  });
  localStorage.setItem('gymbuddy_posts', JSON.stringify(posts));
  document.getElementById('postCaption').value = '';
  removeImage();
  renderFeed();
}

function toggleLike(postId) {
  const posts = JSON.parse(localStorage.getItem('gymbuddy_posts') || '[]');
  const post = posts.find(p => p.id === postId);
  if (!post) return;
  const idx = post.likes.indexOf(currentUser);
  if (idx === -1) post.likes.push(currentUser);
  else post.likes.splice(idx, 1);
  localStorage.setItem('gymbuddy_posts', JSON.stringify(posts));
  renderFeed();
}

function deletePost(postId) {
  let posts = JSON.parse(localStorage.getItem('gymbuddy_posts') || '[]');
  posts = posts.filter(p => p.id !== postId);
  localStorage.setItem('gymbuddy_posts', JSON.stringify(posts));
  renderFeed();
}

function renderFeed() {
  const posts = JSON.parse(localStorage.getItem('gymbuddy_posts') || '[]');
  const feed = document.getElementById('drawerFeed');
  const typeLabel = { progress:'📈 Progress', workout:'🏋️ Workout', diet:'🥗 Diet', motivation:'💪 Motivation' };

  if (!posts.length) {
    feed.innerHTML = '<div class="feedEmpty">No posts yet. Be the first to share! 💪</div>';
    return;
  }

  feed.innerHTML = posts.map(p => {
    const liked = p.likes.includes(currentUser);
    const isOwner = p.username === currentUser;
    const timeAgo = getTimeAgo(new Date(p.date));
    return `
      <div class="feedCard">
        <div class="feedCardTop">
          <div class="feedAvatar" style="${p.profileImg ? `background-image:url(${p.profileImg});background-size:cover;background-position:center;` : ''}">${p.profileImg ? '' : p.name[0].toUpperCase()}</div>
          <div class="feedMeta">
            <div class="feedName">${p.name}</div>
            <div class="feedTime">${timeAgo}</div>
          </div>
          ${isOwner ? `<button class="feedDelete" onclick="deletePost(${p.id})">🗑</button>` : ''}
        </div>
        ${p.image ? `<img class="feedImage" src="${p.image}" alt="post"/>` : ''}
        ${p.caption ? `<div class="feedCaption">${p.caption}</div>` : ''}
        <div class="feedActions">
          <button class="feedLike ${liked ? 'liked' : ''}" onclick="toggleLike(${p.id})">
            ${liked ? '❤️' : '🤍'} ${p.likes.length}
          </button>
        </div>
      </div>`;
  }).join('');
}

function getTimeAgo(date) {
  const diff = Math.floor((Date.now() - date) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
  if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
  return Math.floor(diff / 86400) + 'd ago';
}

// ─── BADGES ───────────────────────────────────────────────────────────────────
// ─── BADGES ───────────────────────────────────────────────────────────────────
const BADGES = [
  // ── BRONZE ──────────────────────────────────────────────────────────────────
  {
    id:'first_step', name:'First Step', desc:'Log your first workout',
    shape:'shield', tier:'bronze', icon:'👟',
    progress: () => ({ cur: Math.min(allSessions.length, 1), max: 1 })
  },
  {
    id:'bench_100', name:'Bench 100', desc:'Bench Press 100 lbs',
    shape:'shield', tier:'bronze', icon:'🏋️',
    progress: () => {
      const best = getBestWeight('Bench Press');
      return { cur: Math.min(best, 100), max: 100 };
    }
  },
  {
    id:'squat_100', name:'Squat 100', desc:'Squat 100 lbs',
    shape:'shield', tier:'bronze', icon:'🦵',
    progress: () => ({ cur: Math.min(getBestWeight('Squat'), 100), max: 100 })
  },
  {
    id:'deadlift_100', name:'Deadlift 100', desc:'Deadlift 100 lbs',
    shape:'shield', tier:'bronze', icon:'💀',
    progress: () => ({ cur: Math.min(getBestWeight('Deadlift'), 100), max: 100 })
  },
  {
    id:'streak_7', name:'On Fire', desc:'7 Day Streak',
    shape:'hexagon', tier:'bronze', icon:'🔥',
    progress: () => ({ cur: Math.min(getBestStreak(), 7), max: 7 })
  },
  {
    id:'sets_75', name:'Volume 75', desc:'75 sets in a week',
    shape:'circle', tier:'bronze', icon:'📦',
    progress: () => ({ cur: Math.min(getWeeklySets(), 75), max: 75 })
  },
  {
    id:'pushup_25', name:'Push 25', desc:'25 Push-Ups in a single set',
    shape:'star', tier:'bronze', icon:'💪',
    progress: () => ({ cur: Math.min(getBestReps('Push-Up'), 25), max: 25 })
  },
  {
    id:'pullup_10', name:'Pull 10', desc:'10 Pull-Ups in a single set',
    shape:'star', tier:'bronze', icon:'🔝',
    progress: () => ({ cur: Math.min(getBestReps('Pull-Up'), 10), max: 10 })
  },

  // ── SILVER ──────────────────────────────────────────────────────────────────
  {
    id:'bench_150', name:'Bench 150', desc:'Bench Press 150 lbs',
    shape:'shield', tier:'silver', icon:'🏋️',
    progress: () => ({ cur: Math.min(getBestWeight('Bench Press'), 150), max: 150 })
  },
  {
    id:'squat_150', name:'Squat 150', desc:'Squat 150 lbs',
    shape:'shield', tier:'silver', icon:'🦵',
    progress: () => ({ cur: Math.min(getBestWeight('Squat'), 150), max: 150 })
  },
  {
    id:'deadlift_200', name:'Deadlift 200', desc:'Deadlift 200 lbs',
    shape:'shield', tier:'silver', icon:'💀',
    progress: () => ({ cur: Math.min(getBestWeight('Deadlift'), 200), max: 200 })
  },
  {
    id:'streak_30', name:'Iron Habit', desc:'30 Day Streak',
    shape:'hexagon', tier:'silver', icon:'⚡',
    progress: () => ({ cur: Math.min(getBestStreak(), 30), max: 30 })
  },
  {
    id:'sets_100', name:'Volume 100', desc:'100 sets in a week',
    shape:'circle', tier:'silver', icon:'📦',
    progress: () => ({ cur: Math.min(getWeeklySets(), 100), max: 100 })
  },
  {
    id:'pushup_50', name:'Push 50', desc:'50 Push-Ups in a single set',
    shape:'star', tier:'silver', icon:'💪',
    progress: () => ({ cur: Math.min(getBestReps('Push-Up'), 50), max: 50 })
  },
  {
    id:'pullup_20', name:'Pull 20', desc:'20 Pull-Ups in a single set',
    shape:'star', tier:'silver', icon:'🔝',
    progress: () => ({ cur: Math.min(getBestReps('Pull-Up'), 20), max: 20 })
  },

  // ── GOLD ────────────────────────────────────────────────────────────────────
  {
    id:'bench_200', name:'Bench 200', desc:'Bench Press 200 lbs',
    shape:'shield', tier:'gold', icon:'🏋️',
    progress: () => ({ cur: Math.min(getBestWeight('Bench Press'), 200), max: 200 })
  },
  {
    id:'squat_200', name:'Squat 200', desc:'Squat 200 lbs',
    shape:'shield', tier:'gold', icon:'🦵',
    progress: () => ({ cur: Math.min(getBestWeight('Squat'), 200), max: 200 })
  },
  {
    id:'deadlift_250', name:'Deadlift 250', desc:'Deadlift 250 lbs',
    shape:'shield', tier:'gold', icon:'💀',
    progress: () => ({ cur: Math.min(getBestWeight('Deadlift'), 250), max: 250 })
  },
  {
    id:'streak_100', name:'Centurion', desc:'100 Day Streak',
    shape:'hexagon', tier:'gold', icon:'👑',
    progress: () => ({ cur: Math.min(getBestStreak(), 100), max: 100 })
  },
  {
    id:'pushup_75', name:'Push 75', desc:'75 Push-Ups in a single set',
    shape:'star', tier:'gold', icon:'💪',
    progress: () => ({ cur: Math.min(getBestReps('Push-Up'), 75), max: 75 })
  },
  {
    id:'pullup_25', name:'Pull 25', desc:'25 Pull-Ups in a single set',
    shape:'star', tier:'gold', icon:'🔝',
    progress: () => ({ cur: Math.min(getBestReps('Pull-Up'), 25), max: 25 })
  },

  // ── PLATINUM ────────────────────────────────────────────────────────────────
  {
    id:'full_body', name:'Full Body', desc:'Train all 13 muscles in one week',
    shape:'star', tier:'gold', icon:'🌟',
    progress: () => {
      // Check each week in history
      const total = Object.keys(EXERCISES).length;
      let bestWeekCount = 0;

      // Group sessions by week
      const weekMap = {};
      allSessions.forEach(s => {
        const d = new Date(s.date);
        const monday = new Date(d);
        monday.setDate(d.getDate() - ((d.getDay() + 6) % 7));
        monday.setHours(0,0,0,0);
        const key = monday.toLocaleDateString('en-CA');
        if (!weekMap[key]) weekMap[key] = new Set();
        weekMap[key].add(s.muscle);
      });

      Object.values(weekMap).forEach(muscles => {
        bestWeekCount = Math.max(bestWeekCount, muscles.size);
      });

      return { cur: bestWeekCount, max: total };
    }
  },
  {
    id:'pushup_100', name:'Push 100', desc:'100 Push-Ups in a single set',
    shape:'star', tier:'platinum', icon:'💪',
    progress: () => ({ cur: Math.min(getBestReps('Push-Up'), 100), max: 100 })
  },
  {
    id:'deadlift_300', name:'Deadlift 300', desc:'Deadlift 300 lbs',
    shape:'shield', tier:'platinum', icon:'💀',
    progress: () => ({ cur: Math.min(getBestWeight('Deadlift'), 300), max: 300 })
  },
  {
    id:'streak_365', name:'Legendary', desc:'365 Day Streak',
    shape:'hexagon', tier:'platinum', icon:'🌟',
    progress: () => ({ cur: Math.min(getBestStreak(), 365), max: 365 })
  },

  // ── DIAMOND ─────────────────────────────────────────────────────────────────
  {
    id:'pushup_150', name:'Push 150', desc:'150 Push-Ups in a single set',
    shape:'star', tier:'diamond', icon:'💪',
    progress: () => ({ cur: Math.min(getBestReps('Push-Up'), 150), max: 150 })
  },
  {
    id:'deadlift_400', name:'Deadlift 400', desc:'Deadlift 400 lbs',
    shape:'shield', tier:'diamond', icon:'💀',
    progress: () => ({ cur: Math.min(getBestWeight('Deadlift'), 400), max: 400 })
  }
];

// ── BADGE HELPERS ─────────────────────────────────────────────────────────────
function getBestWeight(exercise) {
  let best = 0;
  allSessions.filter(s => s.exercise === exercise)
    .forEach(s => s.sets.forEach(set => { best = Math.max(best, parseFloat(set.weight||0)); }));
  return best;
}

function getBestReps(exercise) {
  let best = 0;
  allSessions.filter(s => s.exercise === exercise)
    .forEach(s => s.sets.forEach(set => { best = Math.max(best, parseInt(set.reps||0)); }));
  return best;
}

function getWeeklySets() {
  const now = new Date();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  monday.setHours(0,0,0,0);
  return allSessions
    .filter(s => new Date(s.date) >= monday)
    .reduce((sum, s) => sum + s.sets.length, 0);
}

// ── TIER COLORS ───────────────────────────────────────────────────────────────
const TIER_COLORS = {
  bronze:   { outer:'#cd7f32', inner:'#a0522d', glow:'rgba(205,127,50,0.5)',  grad:'#cd7f32,#a0522d', ring:'#cd7f32' },
  silver:   { outer:'#c0c0c0', inner:'#888',    glow:'rgba(192,192,192,0.5)', grad:'#e0e0e0,#aaa',    ring:'#c0c0c0' },
  gold:     { outer:'#ffd700', inner:'#c8a400', glow:'rgba(255,215,0,0.6)',   grad:'#ffd700,#c8a400', ring:'#ffd700' },
  platinum: { outer:'#e5e4e2', inner:'#a9a9a9', glow:'rgba(229,228,226,0.7)', grad:'#f0f0f0,#c0bebe', ring:'#e5e4e2' },
  diamond:  { outer:'#b9f2ff', inner:'#5bcefa', glow:'rgba(91,206,250,0.8)',  grad:'#b9f2ff,#5bcefa', ring:'#b9f2ff' }
};

// ── SVG BADGE WITH LIQUID FILL ────────────────────────────────────────────────
function makeBadgeSVG(badge, pct) {
  const t = TIER_COLORS[badge.tier];
  const unlocked = pct >= 1;
  const glowFilter = unlocked ? `drop-shadow(0 0 10px ${t.glow})` : 'none';
  const fillPct = Math.round(pct * 100);
  const fillY = 100 - fillPct; // top of fill in percentage

  const shapes = {
    shield:  `<path d="M50,8 L88,22 L88,52 C88,72 50,92 50,92 C50,92 12,72 12,52 L12,22 Z"/>`,
    hexagon: `<polygon points="50,6 90,28 90,72 50,94 10,72 10,28"/>`,
    circle:  `<circle cx="50" cy="50" r="42"/>`,
    star:    `<polygon points="50,4 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35"/>`
  };

  const uniqueId = badge.id;

  return `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"
         style="width:72px;height:72px;filter:${glowFilter};transition:all .3s">
      <defs>
        <!-- dark base gradient -->
        <linearGradient id="base_${uniqueId}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#2a2a2a"/>
          <stop offset="100%" style="stop-color:#1a1a1a"/>
        </linearGradient>
        <!-- fill color gradient -->
        <linearGradient id="fill_${uniqueId}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:${t.grad.split(',')[0]};stop-opacity:1"/>
          <stop offset="100%" style="stop-color:${t.grad.split(',')[1]};stop-opacity:0.8"/>
        </linearGradient>
        <!-- clip to badge shape -->
        <clipPath id="clip_${uniqueId}">
          ${shapes[badge.shape]}
        </clipPath>
        <!-- clip fill to only bottom portion based on progress -->
        <clipPath id="fillclip_${uniqueId}">
          <rect x="0" y="${fillY}" width="100" height="${fillPct}"/>
        </clipPath>
      </defs>

      <!-- dark background shape -->
      <g clip-path="url(#clip_${uniqueId})">
        <rect x="0" y="0" width="100" height="100" fill="url(#base_${uniqueId})"/>
      </g>

      <!-- liquid fill from bottom -->
      <g clip-path="url(#clip_${uniqueId})">
        <g clip-path="url(#fillclip_${uniqueId})">
          <rect x="0" y="0" width="100" height="100" fill="url(#fill_${uniqueId})"/>
        </g>
      </g>

      <!-- shape border -->
      <g fill="none" stroke="${t.outer}" stroke-width="2.5" opacity="${unlocked ? 1 : 0.4}">
        ${shapes[badge.shape]}
      </g>

      <!-- icon on top -->
      <text x="50" y="58" text-anchor="middle" font-size="28"
            style="opacity:${unlocked ? 1 : 0.5}">${badge.icon}</text>
    </svg>`;
}

function renderBadges() {
  const tiers = ['bronze','silver','gold','platinum','diamond'];
  const tierLabels = { bronze:'🥉 Bronze', silver:'🥈 Silver', gold:'🥇 Gold', platinum:'💎 Platinum', diamond:'💠 Diamond' };

  let unlockedCount = 0;
  let html = '';

  tiers.forEach(tier => {
    const tierBadges = BADGES.filter(b => b.tier === tier);
    html += `<div class="badgesTierTitle">${tierLabels[tier]}</div><div class="badgesGrid">`;
    tierBadges.forEach(b => {
      const { cur, max } = b.progress();
      const pct = max > 0 ? cur / max : 0;
      const unlocked = pct >= 1;
      if (unlocked) unlockedCount++;
      const pctLabel = unlocked ? 'Completed' : `${cur} / ${max}`;
      html += `
        <div class="badgeCard ${unlocked ? 'unlocked' : 'locked'}">
          ${makeBadgeSVG(b, pct)}
          <div class="badgeName">${b.name}</div>
          <div class="badgeDesc">${b.desc}</div>
          <div class="badgeProgress">${pctLabel}</div>
          <div class="badgeTier ${b.tier}">${b.tier}</div>
        </div>`;
    });
    html += '</div>';
  });

  document.getElementById('badgesUnlocked').innerHTML =
    `<div class="badgesSummary">${unlockedCount} / ${BADGES.length} Badges Unlocked</div>`;
  document.getElementById('badgesLocked').innerHTML = html;
}
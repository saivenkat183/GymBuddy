// ─── CONFIG ───────────────────────────────────────────────────────────────────
const API = 'http://localhost:5000/api';

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
    await loadSessions();
    updateStreak();
    updateHeatmap();
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
function getStreak() {
  if (!allSessions.length) return 0;
  const days = [...new Set(allSessions.map(s => new Date(s.date).toDateString()))].sort((a, b) => new Date(b) - new Date(a));
  let streak = 0;
  let check = new Date();
  check.setHours(0, 0, 0, 0);
  for (let d of days) {
    const day = new Date(d);
    day.setHours(0, 0, 0, 0);
    const diff = (check - day) / 86400000;
    if (diff <= 1) { streak++; check = day; }
    else break;
  }
  return streak;
}

function getBestStreak() {
  if (!allSessions.length) return 0;
  const days = [...new Set(allSessions.map(s => new Date(s.date).toDateString()))]
    .map(d => new Date(d))
    .sort((a, b) => a - b);
  let best = 1, current = 1;
  for (let i = 1; i < days.length; i++) {
    const diff = (days[i] - days[i-1]) / 86400000;
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
  try {
    const res = await fetch(API + '/workouts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
      body: JSON.stringify({ muscle: currentMuscle, exercise: currentExercise, sets: validSets })
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
function renderHistory() {
  const sessions = [...allSessions].reverse();
  const el = document.getElementById('historyList');
  if (!sessions.length) {
    el.innerHTML = '<div class="emptyState">No workouts logged yet. Hit the Body Map to start!</div>';
    return;
  }
  el.innerHTML = sessions.map(s => `
    <div class="sessionCard" id="session_${s._id}">
      <div class="sDateRow">
        <div class="sDate">${new Date(s.date).toLocaleString()}</div>
        <button class="deleteBtn" onclick="deleteSession('${s._id}')">🗑 Delete</button>
      </div>
      <div class="sTitle">${s.muscle} — ${s.exercise}</div>
      <div class="setLog"><table>
        <tr><th>Set</th><th>Weight (lbs)</th><th>Reps</th><th>Volume</th></tr>
        ${s.sets.map((set, i) => `<tr><td>${i + 1}</td><td>${set.weight} lbs</td><td>${set.reps}</td><td>${(parseFloat(set.weight || 0) * parseInt(set.reps || 0)).toFixed(0)}</td></tr>`).join('')}
      </table></div>
    </div>`).join('');
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
    renderHistory();
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

// ─── PR BY MUSCLE — UNDER CONSTRUCTION ───────────────────────────────────────
function renderPRByMuscle() {
  const el = document.getElementById('prByMuscle');
  el.innerHTML = `
    <div class="underConstruction">
      <div class="ucIcon">🚧</div>
      <div class="ucTitle">Under Construction</div>
      <div class="ucMsg">Personal Records feature is coming soon. Keep logging your workouts!</div>
    </div>`;
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

// ─── ABOUT ME ─────────────────────────────────────────────────────────────────
function toggleHeightUnit() {
  const unit = document.getElementById('heightUnit').value;
  document.getElementById('heightCm').classList.toggle('hidden', unit === 'ft');
  document.getElementById('heightFt').classList.toggle('hidden', unit === 'cm');
}

function loadAbout() {
  const data = JSON.parse(localStorage.getItem('about_' + currentUser) || '{}');
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
  renderAboutStats(data);
  alert('Profile saved! ✅');
}

function renderAboutStats(data) {
  const totalWorkouts = allSessions.length;
  const streak = getStreak();
  const totalSets = allSessions.reduce((sum, s) => sum + s.sets.length, 0);
  const muscles = [...new Set(allSessions.map(s => s.muscle))].length;
  let height = '—';
  if (data.heightUnit === 'ft' && data.heightFt) height = `${data.heightFt}ft ${data.heightIn || 0}in`;
  else if (data.heightCm) height = `${data.heightCm} cm`;
  document.getElementById('aboutStats').innerHTML = `
    <div class="statCard"><div class="statVal">${totalWorkouts}</div><div class="statLabel">Total Workouts</div></div>
    <div class="statCard"><div class="statVal">🔥 ${streak}</div><div class="statLabel">Day Streak</div></div>
    <div class="statCard"><div class="statVal">${totalSets}</div><div class="statLabel">Total Sets</div></div>
    <div class="statCard"><div class="statVal">${muscles}</div><div class="statLabel">Muscles Trained</div></div>
    <div class="statCard"><div class="statVal">${height}</div><div class="statLabel">Height</div></div>
    <div class="statCard"><div class="statVal">${data.weight ? data.weight + ' ' + (data.weightUnit || 'lbs') : '—'}</div><div class="statLabel">Weight</div></div>
    <div class="statCard"><div class="statVal" style="font-size:1rem">${data.goal || '—'}</div><div class="statLabel">Goal</div></div>
  `;
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
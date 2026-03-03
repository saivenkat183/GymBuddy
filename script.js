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
  
  let users = {}, currentUser = null, isRegister = false;
  let currentMuscle = '', currentExercise = '', currentSets = [];
  let progressChart = null;
  
  function save() { localStorage.setItem('gymbuddy_users', JSON.stringify(users)); }
  function load() { try { users = JSON.parse(localStorage.getItem('gymbuddy_users') || '{}'); } catch { users = {}; } }
  load();
  
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
  
  function doAuth() {
    const u = document.getElementById('authUser').value.trim();
    const p = document.getElementById('authPass').value;
    if (!u || !p) { showAuthMsg('Please fill all fields'); return; }
    if (isRegister) {
      if (users[u]) { showAuthMsg('Username already taken'); return; }
      const n = document.getElementById('authName').value.trim() || u;
      users[u] = { password: p, name: n, sessions: [] };
      save();
    } else {
      if (!users[u] || users[u].password !== p) { showAuthMsg('Invalid credentials'); return; }
    }
    currentUser = u;
    document.getElementById('authScreen').style.display = 'none';
    document.getElementById('appScreen').style.display = 'flex';
    document.getElementById('navUser').textContent = 'Hey, ' + users[u].name + '!';
  }
  
  function logout() {
    currentUser = null;
    document.getElementById('authScreen').style.display = 'flex';
    document.getElementById('appScreen').style.display = 'none';
    document.getElementById('authUser').value = '';
    document.getElementById('authPass').value = '';
  }
  
  // ─── NAVIGATION ───────────────────────────────────────────────────────────────
  function showPage(id, btn) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    document.querySelectorAll('.navBtn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    if (id === 'historyPage') renderHistory();
    if (id === 'progressPage') renderProgress();
  }
  
  // ─── BODY VIEW ────────────────────────────────────────────────────────────────
  function setView(v) {
    document.getElementById('svgFront').classList.toggle('hidden', v === 'back');
    document.getElementById('svgBack').classList.toggle('hidden', v === 'front');
    document.getElementById('btnFront').classList.toggle('active', v === 'front');
    document.getElementById('btnBack').classList.toggle('active', v === 'back');
    document.getElementById('muscleLabel').textContent = 'Click a muscle to log workout';
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
      const d = document.createElement('div');
      d.className = 'exCard';
      d.innerHTML = `<h4>${ex}${pr ? `<span class="prBadge">PR: ${pr.weight}kg × ${pr.reps}</span>` : ''}</h4><p>Click to log sets</p>`;
      d.onclick = () => selectExercise(ex, d);
      list.appendChild(d);
    });
    document.getElementById('logSection').classList.add('hidden');
    document.getElementById('saveBtn').style.display = 'none';
    document.getElementById('modalOverlay').classList.remove('hidden');
  }
  
  function closeModal() { document.getElementById('modalOverlay').classList.add('hidden'); }
  
  function selectExercise(ex, el) {
    document.querySelectorAll('.exCard').forEach(c => c.classList.remove('selected'));
    el.classList.add('selected');
    currentExercise = ex; currentSets = [{ weight: '', reps: '' }];
    document.getElementById('logExName').textContent = ex;
    document.getElementById('logSection').classList.remove('hidden');
    document.getElementById('saveBtn').style.display = 'block';
    renderSets();
  }
  
  function renderSets() {
    const c = document.getElementById('setsContainer');
    c.innerHTML = '';
    currentSets.forEach((s, i) => {
      const row = document.createElement('div');
      row.className = 'setRow';
      row.innerHTML = `<label>Set ${i + 1}</label>
        <input type="number" placeholder="kg" value="${s.weight}" min="0" onchange="currentSets[${i}].weight=this.value"/>
        <input type="number" placeholder="reps" value="${s.reps}" min="0" onchange="currentSets[${i}].reps=this.value"/>
        ${i > 0 ? `<button class="removeSetBtn" onclick="removeSet(${i})">✕</button>` : '<span style="width:24px"></span>'}`;
      c.appendChild(row);
    });
  }
  
  function addSet() { currentSets.push({ weight: '', reps: '' }); renderSets(); }
  function removeSet(i) { currentSets.splice(i, 1); renderSets(); }
  
  function saveWorkout() {
    const validSets = currentSets.filter(s => s.weight !== '' && s.reps !== '');
    if (!validSets.length) { alert('Please enter at least one complete set'); return; }
    const session = { id: Date.now(), date: new Date().toISOString(), muscle: currentMuscle, exercise: currentExercise, sets: validSets };
    users[currentUser].sessions.push(session);
    save();
    checkPR(session);
    closeModal();
  }
  
  // ─── PR ───────────────────────────────────────────────────────────────────────
  function getPR(ex) {
    const sessions = (users[currentUser]?.sessions || []).filter(s => s.exercise === ex);
    if (!sessions.length) return null;
    let best = null;
    sessions.forEach(s => s.sets.forEach(set => {
      const v = parseFloat(set.weight) * parseInt(set.reps);
      if (!best || v > best.val) best = { val: v, weight: set.weight, reps: set.reps };
    }));
    return best;
  }
  
  function checkPR(session) {
    const allPrev = (users[currentUser].sessions || []).filter(s => s.exercise === session.exercise && s.id !== session.id);
    let prevBest = 0;
    allPrev.forEach(s => s.sets.forEach(set => { prevBest = Math.max(prevBest, parseFloat(set.weight || 0) * parseInt(set.reps || 0)); }));
    let newBest = 0;
    session.sets.forEach(s => { newBest = Math.max(newBest, parseFloat(s.weight || 0) * parseInt(s.reps || 0)); });
    if (newBest > prevBest && prevBest > 0) setTimeout(() => alert(`🏆 New PR on ${session.exercise}! ${newBest.toFixed(0)} kg·reps`), 200);
  }
  
  // ─── HISTORY ──────────────────────────────────────────────────────────────────
  function renderHistory() {
    const sessions = [...(users[currentUser]?.sessions || [])].reverse();
    const el = document.getElementById('historyList');
    if (!sessions.length) { el.innerHTML = '<div class="emptyState">No workouts logged yet. Hit the Body Map to start!</div>'; return; }
    el.innerHTML = sessions.map(s => `
      <div class="sessionCard">
        <div class="sDate">${new Date(s.date).toLocaleString()}</div>
        <div class="sTitle">${s.muscle} — ${s.exercise}</div>
        <div class="setLog"><table>
          <tr><th>Set</th><th>Weight (kg)</th><th>Reps</th><th>Volume</th></tr>
          ${s.sets.map((set, i) => `<tr><td>${i + 1}</td><td>${set.weight}</td><td>${set.reps}</td><td>${(parseFloat(set.weight || 0) * parseInt(set.reps || 0)).toFixed(0)}</td></tr>`).join('')}
        </table></div>
      </div>`).join('');
  }
  
  // ─── PROGRESS ─────────────────────────────────────────────────────────────────
  function renderProgress() {
    const sessions = users[currentUser]?.sessions || [];
    const exMap = {};
    sessions.forEach(s => {
      if (!exMap[s.exercise]) exMap[s.exercise] = { best: 0, bestSet: null, date: '' };
      s.sets.forEach(set => {
        const v = parseFloat(set.weight || 0) * parseInt(set.reps || 0);
        if (v > exMap[s.exercise].best) { exMap[s.exercise] = { best: v, bestSet: set, date: s.date }; }
      });
    });
    const prGrid = document.getElementById('prGrid');
    const exes = Object.keys(exMap);
    if (!exes.length) { prGrid.innerHTML = '<div class="emptyState" style="grid-column:1/-1">No PRs yet!</div>'; }
    else {
      prGrid.innerHTML = exes.map(ex => `
        <div class="prCard">
          <div class="prEx">${ex}</div>
          <div class="prVal">${exMap[ex].bestSet.weight}kg × ${exMap[ex].bestSet.reps}</div>
          <div class="prDate">${new Date(exMap[ex].date).toLocaleDateString()}</div>
        </div>`).join('');
    }
    const sel = document.getElementById('chartExSelect');
    sel.innerHTML = exes.map(e => `<option>${e}</option>`).join('');
    renderChart();
  }
  
  function renderChart() {
    const ex = document.getElementById('chartExSelect').value;
    if (!ex) return;
    const sessions = (users[currentUser]?.sessions || []).filter(s => s.exercise === ex).sort((a, b) => new Date(a.date) - new Date(b.date));
    const labels = sessions.map(s => new Date(s.date).toLocaleDateString());
    const data = sessions.map(s => s.sets.reduce((sum, set) => sum + parseFloat(set.weight || 0) * parseInt(set.reps || 0), 0));
    if (progressChart) progressChart.destroy();
    progressChart = new Chart(document.getElementById('progressChart'), {
      type: 'line',
      data: { labels, datasets: [{ label: 'Total Volume (kg·reps)', data, borderColor: '#e94560', backgroundColor: 'rgba(233,69,96,.15)', tension: .3, fill: true, pointBackgroundColor: '#e94560' }] },
      options: { responsive: true, plugins: { legend: { labels: { color: '#aaa' } } }, scales: { x: { ticks: { color: '#666' } }, y: { ticks: { color: '#666' }, grid: { color: '#222' } } } }
    });
  }
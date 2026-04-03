function toggleAuthMode() {
  isRegister = !isRegister;
  byId('authNameWrap').classList.toggle('hidden', !isRegister);
  document.querySelector('#authScreen .btn').textContent = isRegister ? 'Register' : 'Login';
  document.querySelector('#authScreen .btn.sec').textContent = isRegister ? 'Already have an account? Login' : 'Don\'t have an account? Register';
  byId('authMsg').classList.add('hidden');
}

function showAuthMsg(message) {
  const el = byId('authMsg');
  el.textContent = message;
  el.classList.remove('hidden');
}

async function doAuth() {
  const username = byId('authUser').value.trim();
  const password = byId('authPass').value;
  if (!username || !password) {
    showAuthMsg('Please fill all fields');
    return;
  }

  const endpoint = isRegister ? '/auth/register' : '/auth/login';
  const body = isRegister
    ? { username, password, name: byId('authName').value.trim() || username }
    : { username, password };

  showLoading();
  try {
    const res = await fetch(API + endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    hideLoading();
    if (!res.ok) {
      showAuthMsg(data.message);
      return;
    }
    token = data.token;
    currentUser = data.username;
    byId('authScreen').style.display = 'none';
    byId('appScreen').style.display = 'flex';
    byId('bottomNav').style.display = 'flex';
    byId('navUser').textContent = 'Hey, ' + data.name + '!';
    byId('avatarInitial').textContent = data.name[0].toUpperCase();
    byId('navAvatarInitial').textContent = data.name[0].toUpperCase();
    await loadSessions();
    await loadMyFollowCounts();
    updateStreak();
    updateHeatmap();
    loadProfileImage();
    const now = new Date();
    calYear = now.getFullYear();
    calMonth = now.getMonth();
  } catch (err) {
    hideLoading();
    showAuthMsg('Cannot connect to server. Is it running?');
  }
}

function logout() {
  currentUser = null;
  token = null;
  allSessions = [];
  myFollowCounts = { followersCount: 0, followingCount: 0 };
  removeGalleryDraft();
  byId('authScreen').style.display = 'flex';
  byId('appScreen').style.display = 'none';
  byId('bottomNav').style.display = 'none';
  byId('authUser').value = '';
  byId('authPass').value = '';
}

async function loadSessions() {
  showLoading();
  try {
    const res = await fetch(API + '/workouts', {
      headers: { Authorization: 'Bearer ' + token }
    });
    allSessions = await res.json();
  } catch (err) {
    console.error('Failed to load sessions:', err);
  }
  hideLoading();
}

async function loadMyFollowCounts() {
  try {
    const res = await fetch(API + '/users/me/counts', {
      headers: { Authorization: 'Bearer ' + token }
    });
    if (res.ok) myFollowCounts = await res.json();
  } catch (err) {
    console.error('Failed to load follow counts:', err);
  }
}

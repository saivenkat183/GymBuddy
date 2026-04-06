function toggleAuthMode() {
  isRegister = !isRegister;
  document.getElementById('authNameWrap').classList.toggle('hidden', !isRegister);
  document.querySelector('#authScreen .btn').textContent = isRegister ? 'Register' : 'Login';
  document.querySelector('#authScreen .btn.sec').textContent = isRegister ? 'Already have an account? Login' : 'Don\'t have an account? Register';
  document.getElementById('authMsg').classList.add('hidden');
}

function showAuthMsg(message) {
  const el = document.getElementById('authMsg');
  el.textContent = message;
  el.classList.remove('hidden');
}

async function doAuth() {
  const username = document.getElementById('authUser').value.trim();
  const password = document.getElementById('authPass').value;
  if (!username || !password) {
    showAuthMsg('Please fill all fields');
    return;
  }

  const endpoint = isRegister ? '/auth/register' : '/auth/login';
  const body = isRegister
    ? { username, password, name: document.getElementById('authName').value.trim() || username }
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
    document.getElementById('authScreen').style.display = 'none';
    document.getElementById('appScreen').style.display = 'flex';
    document.getElementById('bottomNav').style.display = 'flex';
    document.getElementById('navUser').textContent = 'Hey, ' + data.name + '!';
    document.getElementById('avatarInitial').textContent = data.name[0].toUpperCase();
    document.getElementById('navAvatarInitial').textContent = data.name[0].toUpperCase();
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
  document.getElementById('authScreen').style.display = 'flex';
  document.getElementById('appScreen').style.display = 'none';
  document.getElementById('bottomNav').style.display = 'none';
  document.getElementById('authUser').value = '';
  document.getElementById('authPass').value = '';
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

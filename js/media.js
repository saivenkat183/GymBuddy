let selectedGalleryImageBase64 = null;
let selectedImageBase64 = null;

async function handleProfileImage(event) {
  const file = event.target.files[0];
  const error = validateImageFile(file);
  if (error) {
    alert(error);
    event.target.value = '';
    return;
  }
  try {
    const base64 = await readOptimizedImage(file, { maxWidth: 900, maxHeight: 900, quality: 0.8 });
    localStorage.setItem('profileImg_' + currentUser, base64);
    updateAllAvatars(base64);
  } catch (err) {
    alert('Could not update profile image. Please try another image.');
    console.error(err);
  }
}

function updateAllAvatars(base64) {
  const avatarEl = byId('avatarInitial');
  if (base64 && avatarEl) {
    avatarEl.style.backgroundImage = `url(${base64})`;
    avatarEl.style.backgroundSize = 'cover';
    avatarEl.style.backgroundPosition = 'center';
    avatarEl.textContent = '';
  }
  const navAvatar = byId('navAvatarInitial');
  if (base64 && navAvatar) {
    navAvatar.style.backgroundImage = `url(${base64})`;
    navAvatar.style.backgroundSize = 'cover';
    navAvatar.style.backgroundPosition = 'center';
    navAvatar.textContent = '';
  }
  const composerAvatar = byId('composerAvatar');
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

function openDrawer() {
  byId('drawerOverlay').classList.remove('hidden');
  const drawer = byId('drawer');
  drawer.classList.remove('hidden');
  requestAnimationFrame(() => drawer.classList.add('open'));
  if (currentUser) {
    const name = readJSONStorage('about_' + currentUser, {}).name || currentUser;
    const profileImg = localStorage.getItem('profileImg_' + currentUser);
    const composerAvatar = byId('composerAvatar');
    if (profileImg) {
      composerAvatar.style.backgroundImage = `url(${profileImg})`;
      composerAvatar.style.backgroundSize = 'cover';
      composerAvatar.style.backgroundPosition = 'center';
      composerAvatar.textContent = '';
    } else {
      composerAvatar.style.backgroundImage = '';
      composerAvatar.textContent = name[0].toUpperCase();
    }
  }
  renderFeed();
}

function closeDrawer() {
  const drawer = byId('drawer');
  drawer.classList.remove('open');
  setTimeout(() => {
    drawer.classList.add('hidden');
    byId('drawerOverlay').classList.add('hidden');
  }, 380);
}

async function handleImageSelect(event) {
  const file = event.target.files[0];
  const error = validateImageFile(file);
  if (error) {
    alert(error);
    event.target.value = '';
    return;
  }
  try {
    selectedImageBase64 = await readOptimizedImage(file, { maxWidth: 1280, maxHeight: 1280, quality: 0.8 });
    byId('imagePreview').src = selectedImageBase64;
    byId('imagePreviewWrap').classList.remove('hidden');
    byId('postCaption').placeholder = 'Add a caption...';
  } catch (err) {
    alert('Could not prepare that image. Please try another one.');
    console.error(err);
  }
}

function removeImage() {
  selectedImageBase64 = null;
  byId('imagePreview').src = '';
  byId('imagePreviewWrap').classList.add('hidden');
  byId('postImageInput').value = '';
  byId('postCaption').placeholder = 'Your thoughts...';
}

function getGalleryItems() {
  return readJSONStorage('gymbuddy_gallery', []);
}

function setGalleryItems(items) {
  writeJSONStorage('gymbuddy_gallery', items);
}

async function handleGalleryImageSelect(event) {
  const file = event.target.files[0];
  const error = validateImageFile(file);
  if (error) {
    alert(error);
    event.target.value = '';
    return;
  }
  try {
    selectedGalleryImageBase64 = await readOptimizedImage(file, { maxWidth: 1400, maxHeight: 1400, quality: 0.82 });
    byId('galleryPreview').src = selectedGalleryImageBase64;
    byId('galleryPreviewWrap').classList.remove('hidden');
    byId('galleryPostBtn').classList.remove('hidden');
    byId('galleryRemoveBtn').classList.remove('hidden');
  } catch (err) {
    alert('Could not prepare that gallery image. Please try another one.');
    console.error(err);
  }
}

function removeGalleryDraft() {
  selectedGalleryImageBase64 = null;
  const input = byId('galleryImageInput');
  const preview = byId('galleryPreview');
  const wrap = byId('galleryPreviewWrap');
  const postBtn = byId('galleryPostBtn');
  const removeBtn = byId('galleryRemoveBtn');
  if (input) input.value = '';
  if (preview) preview.src = '';
  if (wrap) wrap.classList.add('hidden');
  if (postBtn) postBtn.classList.add('hidden');
  if (removeBtn) removeBtn.classList.add('hidden');
}

function submitGalleryImage() {
  if (!selectedGalleryImageBase64 || !currentUser) {
    alert('Choose an image before posting to the gallery.');
    return;
  }
  const name = readJSONStorage('about_' + currentUser, {}).name || currentUser;
  const profileImg = localStorage.getItem('profileImg_' + currentUser) || null;
  const items = getGalleryItems();
  items.unshift({
    id: Date.now(),
    username: currentUser,
    name,
    profileImg,
    image: selectedGalleryImageBase64,
    date: new Date().toISOString()
  });
  setGalleryItems(items);
  removeGalleryDraft();
  renderGallery();
}

function deleteGalleryImage(imageId) {
  const items = getGalleryItems().filter(item => item.id !== imageId);
  setGalleryItems(items);
  renderGallery();
}

function openGalleryLightbox(imageSrc) {
  const lightbox = byId('galleryLightbox');
  const image = byId('galleryLightboxImage');
  if (!lightbox || !image) return;
  image.src = imageSrc;
  lightbox.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeGalleryLightbox(event) {
  if (event) event.stopPropagation();
  const lightbox = byId('galleryLightbox');
  const image = byId('galleryLightboxImage');
  if (!lightbox || !image) return;
  lightbox.classList.add('hidden');
  image.src = '';
  document.body.style.overflow = '';
}

function getTimeAgo(date) {
  const diff = Math.floor((Date.now() - date) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
  if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
  return Math.floor(diff / 86400) + 'd ago';
}

function formatMonthName(monthIndex) {
  return ['January','February','March','April','May','June','July','August','September','October','November','December'][monthIndex] || '';
}


function renderGallery() {
  const grid = byId('galleryGrid');
  if (!grid) return;
  const items = getGalleryItems();
  if (!items.length) {
    grid.innerHTML = '<div class="emptyState">No gallery images yet. Add the first one.</div>';
    return;
  }

  grid.innerHTML = items.map(item => {
    const canDelete = item.username === currentUser;
    return `
      <div class="galleryCard">
        <img class="galleryCardImage" src="${item.image}" alt="Gallery upload by ${item.name}" onclick="openGalleryLightbox('${item.image}')"/>
        <div class="galleryOverlay">
          <div class="galleryOverlayMeta">
            <span class="galleryName">${item.name}</span>
            <span class="galleryTime">${getTimeAgo(new Date(item.date))}</span>
          </div>
          ${canDelete ? `<button class="galleryDeleteBtn" onclick="deleteGalleryImage(${item.id})">Delete</button>` : ''}
        </div>
      </div>`;
  }).join('');
}

function toggleLike(postId) {
  const posts = readJSONStorage('gymbuddy_posts', []);
  const post = posts.find(p => p.id === postId);
  if (!post) return;
  const idx = post.likes.indexOf(currentUser);
  if (idx === -1) post.likes.push(currentUser);
  else post.likes.splice(idx, 1);
  writeJSONStorage('gymbuddy_posts', posts);
  const btn = byId('like_' + postId);
  if (btn) {
    const liked = post.likes.includes(currentUser);
    btn.className = 'feedLike' + (liked ? ' liked' : '');
    btn.innerHTML = (liked ? '❤' : '🤍') + ' ' + (post.likes.length || '');
  }
}

function deletePost(postId) {
  const posts = readJSONStorage('gymbuddy_posts', []).filter(p => p.id !== postId);
  writeJSONStorage('gymbuddy_posts', posts);
  renderFeed();
}

function submitPost() {
  const caption = byId('postCaption').value.trim();
  if (!caption && !selectedImageBase64) {
    alert('Add a caption or image before posting.');
    return;
  }
  const name = readJSONStorage('about_' + currentUser, {}).name || currentUser;
  const posts = readJSONStorage('gymbuddy_posts', []);
  const profileImg = localStorage.getItem('profileImg_' + currentUser) || null;
  posts.unshift({
    id: Date.now(),
    username: currentUser,
    name,
    caption,
    image: selectedImageBase64 || null,
    profileImg,
    date: new Date().toISOString(),
    likes: [],
    comments: []
  });
  writeJSONStorage('gymbuddy_posts', posts);
  byId('postCaption').value = '';
  removeImage();
  renderFeed();
}

function renderFeed() {
  const posts = readJSONStorage('gymbuddy_posts', []);
  const feed = byId('drawerFeed');
  if (!feed) return;
  if (!posts.length) {
    feed.innerHTML = '<div class="feedEmpty">No posts yet. Be the first to share! 💪</div>';
    return;
  }
  feed.innerHTML = posts.map(p => {
    const liked = p.likes.includes(currentUser);
    const isOwner = p.username === currentUser;
    const timeAgo = getTimeAgo(new Date(p.date));
    const commentCount = (p.comments || []).length;
    const avatarStyle = p.profileImg ? `background-image:url(${p.profileImg});background-size:cover;background-position:center;` : '';
    return `
      <div class="feedCard">
        <div class="feedCardTop">
          <div class="feedAvatar" style="${avatarStyle}">${p.profileImg ? '' : p.name[0].toUpperCase()}</div>
          <div class="feedMeta">
            <div class="feedName" onclick="showPublicProfile('${p.username}')">${p.name}</div>
            <div class="feedTime">${timeAgo}</div>
          </div>
          ${isOwner ? `<button class="feedDelete" onclick="deletePost(${p.id})">🗑</button>` : ''}
        </div>
        ${p.image ? `<img class="feedImage" src="${p.image}" alt="post"/>` : ''}
        ${p.caption ? `<div class="feedCaption">${p.caption}</div>` : ''}
        <div class="feedActions">
          <button class="feedLike${liked ? ' liked' : ''}" id="like_${p.id}" onclick="toggleLike(${p.id})">
            ${liked ? '❤' : '🤍'} ${p.likes.length || ''}
          </button>
          <button class="feedCommentBtn" onclick="openCommentsSheet(${p.id})">
            💬 <span id="commentCount_${p.id}">${commentCount || ''}</span>
          </button>
        </div>
      </div>`;
  }).join('');
}

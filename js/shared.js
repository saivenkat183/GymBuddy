function byId(id) {
  return document.getElementById(id);
}

function readJSONStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (err) {
    console.warn('Failed to parse localStorage key:', key, err);
    return fallback;
  }
}

function writeJSONStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function validateImageFile(file, maxBytes = 4 * 1024 * 1024) {
  if (!file) return 'No image selected.';
  if (!file.type || !file.type.startsWith('image/')) return 'Please choose a valid image file.';
  if (file.size > maxBytes) return 'Image is too large. Please use an image under 4MB.';
  return '';
}

async function readOptimizedImage(file, options = {}) {
  const {
    maxWidth = 1400,
    maxHeight = 1400,
    quality = 0.82
  } = options;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read image file.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Could not process image.'));
      img.onload = () => {
        let { width, height } = img;
        const scale = Math.min(1, maxWidth / width, maxHeight / height);
        width = Math.max(1, Math.round(width * scale));
        height = Math.max(1, Math.round(height * scale));

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not prepare image compression.'));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

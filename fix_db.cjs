const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'src', 'lib', 'db.json');
const publicDir = path.join(__dirname, 'public', 'uploads');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

let db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
let imgCount = 0;

function saveBase64(base64Str, prefix) {
  if (!base64Str || !base64Str.startsWith('data:image')) return base64Str;
  
  const matches = base64Str.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) return base64Str;
  
  const ext = matches[1].split('/')[1] || 'jpg';
  const data = Buffer.from(matches[2], 'base64');
  const filename = `${prefix}_${imgCount++}.${ext}`;
  
  fs.writeFileSync(path.join(publicDir, filename), data);
  return `/uploads/${filename}`;
}

if (db.projects) {
  db.projects.forEach((proj, idx) => {
    if (proj.coverImage && proj.coverImage.startsWith('data:image')) {
      proj.coverImage = saveBase64(proj.coverImage, `proj_${idx}_cover`);
    }
    if (proj.gallery && Array.isArray(proj.gallery)) {
      proj.gallery = proj.gallery.map((img, imgIdx) => {
        if (img.startsWith('data:image')) {
          return saveBase64(img, `proj_${idx}_gallery_${imgIdx}`);
        }
        return img;
      });
    }
  });
}

// Also check settings_branding just in case
if (db.settings_branding) {
  if (db.settings_branding.logoLight && db.settings_branding.logoLight.startsWith('data:image')) {
    db.settings_branding.logoLight = saveBase64(db.settings_branding.logoLight, 'logo_light');
  }
  if (db.settings_branding.logoDark && db.settings_branding.logoDark.startsWith('data:image')) {
    db.settings_branding.logoDark = saveBase64(db.settings_branding.logoDark, 'logo_dark');
  }
  if (db.settings_branding.favicon && db.settings_branding.favicon.startsWith('data:image')) {
    db.settings_branding.favicon = saveBase64(db.settings_branding.favicon, 'favicon');
  }
}

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
console.log(`Saved ${imgCount} images and updated db.json`);

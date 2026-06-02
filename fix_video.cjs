const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'src', 'lib', 'db.json');
const publicDir = path.join(__dirname, 'public', 'uploads');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

let db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

if (db.projects && db.projects.length > 5) {
  let proj = db.projects[5];
  if (proj.heroVideo && proj.heroVideo.startsWith('data:video')) {
    const matches = proj.heroVideo.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (matches && matches.length === 3) {
      const ext = matches[1].split('/')[1] || 'mp4';
      const data = Buffer.from(matches[2], 'base64');
      const filename = `hero_video_proj5.${ext}`;
      
      fs.writeFileSync(path.join(publicDir, filename), data);
      proj.heroVideo = `/uploads/${filename}`;
      console.log(`Saved video to ${filename}`);
    }
  }
}

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
console.log('Updated db.json');

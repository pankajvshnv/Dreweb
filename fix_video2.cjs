const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'src', 'lib', 'db.json');
const publicDir = path.join(__dirname, 'public', 'uploads');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

let db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

if (db.projects) {
  db.projects.forEach((proj, idx) => {
    if (proj.heroVideo && proj.heroVideo.startsWith('data:video/mp4;base64,')) {
      const dataStr = proj.heroVideo.split(';base64,')[1];
      const data = Buffer.from(dataStr, 'base64');
      const filename = `hero_video_proj${idx}.mp4`;
      
      fs.writeFileSync(path.join(publicDir, filename), data);
      proj.heroVideo = `/uploads/${filename}`;
      console.log(`Saved video to ${filename}`);
    }
  });
}

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
console.log('Updated db.json');

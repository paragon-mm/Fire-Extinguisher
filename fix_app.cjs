const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// replace the pulsing aura
content = content.replace(
  /from-slate-300 to-gray-400/,
  'from-red-300 to-rose-400'
);

// replace the button background
content = content.replace(
  /from-slate-200 via-gray-100 to-slate-300 border-2 border-slate-300/,
  'from-red-50 via-white to-red-100 border-2 border-red-200'
);

// replace shadow
content = content.replace(
  /shadow-\[0_0_25px_rgba\(203,213,225,0\.6\)\]/,
  'shadow-[0_0_25px_rgba(254,202,202,0.6)]'
);

// replace icon box
content = content.replace(
  /bg-slate-900 text-slate-200/,
  'bg-red-600 text-white'
);

// replace icon
content = content.replace(
  /<FileCheck className="w-6 h-6 sm:w-8 sm:h-8" \/>/,
  '<FireExtinguisher className="w-6 h-6 sm:w-8 sm:h-8" />'
);

// replace text color for "กดที่นี่เพื่อเริ่ม"
content = content.replace(
  /text-slate-800 uppercase flex items-center/,
  'text-red-800 uppercase flex items-center'
);

// replace text color for title
content = content.replace(
  /text-slate-950 tracking-wide drop-shadow-sm leading-tight/,
  'text-red-950 tracking-wide drop-shadow-sm leading-tight'
);

fs.writeFileSync('src/App.tsx', content);

const fs = require('fs');
let content = fs.readFileSync('src/components/Header.tsx', 'utf8');

content = content.replace(
  /<div className="bg-white p-1 rounded-xl shadow-md border border-slate-700 shrink-0">[\s\S]*?<\/div>/,
  `<div className="bg-white p-1.5 rounded-xl shadow-sm border border-red-100 shrink-0 flex flex-col items-center justify-center min-w-[3rem]">
              <div className="bg-red-50 p-1.5 rounded-full mb-1">
                <FireExtinguisher className="w-6 h-6 text-red-600" strokeWidth={2.5} />
              </div>
              <span className="text-[9px] font-bold text-red-700 leading-none">ถังดับเพลิง</span>
            </div>`
);

fs.writeFileSync('src/components/Header.tsx', content);

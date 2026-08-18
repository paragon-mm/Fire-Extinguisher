const fs = require('fs');
let content = fs.readFileSync('src/components/Header.tsx', 'utf8');

const targetStr = `<div className="bg-white p-1.5 rounded-xl shadow-sm border border-red-100 shrink-0 flex flex-col items-center justify-center min-w-[3rem]">
              <div className="bg-red-50 p-1.5 rounded-full mb-1">
                <FireExtinguisher className="w-6 h-6 text-red-600" strokeWidth={2.5} />
              </div>
              <span className="text-[9px] font-bold text-red-700 leading-none">ถังดับเพลิง</span>
            </div>`;

const replacement = `<div className="bg-white p-1 rounded-xl shadow-md border border-slate-700 shrink-0">
              <img 
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQl9kdS0IYKjYC-iIzRU0efSyXgWKzoV9oXH29cAcpQww&s" 
                alt="GCM PTA Logo" 
                className="h-10 w-auto object-contain rounded" 
                referrerPolicy="no-referrer"
              />
            </div>`;

content = content.replace(targetStr, replacement);
fs.writeFileSync('src/components/Header.tsx', content);

const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  /import \{ Printer, PlusCircle, ShieldCheck, FileCheck, CheckCircle2 \} from 'lucide-react';/,
  "import { Printer, PlusCircle, ShieldCheck, FileCheck, CheckCircle2, FireExtinguisher } from 'lucide-react';"
);

fs.writeFileSync('src/App.tsx', content);

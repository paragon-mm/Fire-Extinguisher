const fs = require('fs');
let content = fs.readFileSync('src/components/NiimbotPrintView.tsx', 'utf8');

content = content.replace(
  /<AutoFitText text=\{\`\$\{vh\.serialNumber\} \$\{vh\.location\}\`\} \/>/g,
  '<AutoFitText text={vh.serialNumber} />'
);

fs.writeFileSync('src/components/NiimbotPrintView.tsx', content);

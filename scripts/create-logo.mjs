import sharp from 'sharp';

const svgLogo = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
  <rect width="200" height="200" rx="40" fill="#2563EB"/>
  <text x="100" y="128" text-anchor="middle" font-family="Arial, sans-serif" font-size="100" font-weight="bold" fill="white">Q</text>
</svg>`;

await sharp(Buffer.from(svgLogo))
  .png()
  .toFile('C:/Users/MOVA/Desktop/quotebox/public/logo.png');

console.log('Logo created: public/logo.png');

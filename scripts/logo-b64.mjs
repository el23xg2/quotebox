import fs from 'fs';
const base64 = fs.readFileSync('C:/Users/MOVA/Desktop/quotebox/public/logo.png').toString('base64');
process.stdout.write('data:image/png;base64,' + base64);

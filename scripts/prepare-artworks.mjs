import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import sharp from 'sharp';
const records = JSON.parse(fs.readFileSync('assets/artwork-sources.json', 'utf8'));
const output = 'public/images/artworks';
fs.mkdirSync(output, { recursive: true });
const catalogue = [];
for (const record of records) {
  const source = path.resolve(record.source);
  const originalsRoot = path.resolve('assets/originals') + path.sep;
  if (!source.startsWith(originalsRoot)) throw new Error('Source must stay in originals.');
  const hash = () => crypto.createHash('sha256').update(fs.readFileSync(source)).digest('hex');
  if (hash() !== record.sha256) throw new Error('Original changed: ' + record.id);
  const fullName = record.id + '.webp';
  const thumbName = record.id + '-thumb.webp';
  await sharp(source).rotate().resize({width:1800,height:1800,fit:'inside',withoutEnlargement:true}).webp({quality:82,effort:6}).toFile(path.join(output,fullName));
  await sharp(source).rotate().resize({width:640,height:800,fit:'inside',withoutEnlargement:true}).webp({quality:74,effort:6}).toFile(path.join(output,thumbName));
  const full = await sharp(path.join(output,fullName)).metadata();
  const thumb = await sharp(path.join(output,thumbName)).metadata();
  const ratio = full.width / full.height;
  catalogue.push({id:record.id,catalogueNumber:record.catalogueNumber,category:record.category,title:record.title,description:record.description,credits:record.credits,temporary:false,format:ratio<0.85?'portrait':ratio>1.18?'landscape':'square',image:{src:'/images/artworks/'+fullName,thumbnail:'/images/artworks/'+thumbName,width:full.width,height:full.height,thumbnailWidth:thumb.width,thumbnailHeight:thumb.height,alt:record.alt}});
  if (hash() !== record.sha256) throw new Error('Original was modified: ' + record.id);
}
fs.writeFileSync('src/data/artwork-catalogue.json',JSON.stringify(catalogue,null,2)+'\n');
console.log('Prepared '+catalogue.length+' artworks; all original hashes unchanged.');

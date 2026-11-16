import sharp from "sharp";
import path from "node:path";
const dir = process.argv[2], out = process.argv[3];
const slugs = ["cleanse","hydrate","balance","restore","protect"];
const kinds = ["cutout","studio","ritual","texture"];
const w=280,h=350, comps=[];
for (const [r,s] of slugs.entries()) for (const [c,k] of kinds.entries()) {
  const buf = await sharp(path.join(dir,`${s}-${k}.webp`)).resize(w,h,{fit:"contain",background:"#888"}).png().toBuffer();
  comps.push({input:buf,left:c*w,top:r*h});
}
await sharp({create:{width:w*4,height:h*5,channels:3,background:"#888"}}).composite(comps).png().toFile(out);

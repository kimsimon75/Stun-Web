const fs=require('node:fs/promises');
const path=require('node:path');
async function main(){
    const out=path.resolve('.site-build');
    // Generated web-only output. Never publish the repository root or dist/.
    await fs.mkdir(out,{recursive:true});
    const files=['index.html','Stun.css','main.js','import.js','function.js','Various.js','Unit.js','stun.js','overlay.js','MoveSpeed.js','socket.js','UpdateWeb.js','plus.svg','minus.svg','plus.png','minus.png'];
    for(const file of files)await fs.copyFile(file,path.join(out,file));
    for(const dir of ['main','units','overlays','patchnotes'])await fs.cp(dir,path.join(out,dir),{recursive:true});
    console.log('Web-only output: .site-build');
}
main().catch(error=>{console.error(error);process.exitCode=1;});

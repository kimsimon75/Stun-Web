import { getStore } from '@netlify/blobs';
import { timingSafeEqual } from 'node:crypto';
import core from '../../unit-bridge/core.cjs';

export function createHandler({ token, store }) {
    return async request => {
        const json = (value, status=200) => Response.json(value, {status,headers:{'cache-control':'no-store'}});
        if(!token || !/^[a-f0-9]{64}$/.test(token)) return json({message:'Server token not configured'},503);
        const supplied=Buffer.from(request.headers.get('authorization')||''), expected=Buffer.from(`Bearer ${token}`);
        if(supplied.length!==expected.length || !timingSafeEqual(supplied,expected)) return json({message:'Unauthorized'},401);
        if(request.method==='GET') return json(await store().get('latest',{type:'json'}) || {units:[],total:0});
        if(request.method!=='POST') return json({message:'Method not allowed'},405);
        let data;
        try {
            const text=await request.text();
            if(Buffer.byteLength(text)>1048576) return json({message:'Too large'},413);
            data=core.identify(JSON.parse(text));
        } catch { return json({message:'Invalid snapshot'},400); }
        await store().setJSON('latest',{...data,receivedAt:new Date().toISOString()});
        return json({accepted:true,total:data.total});
    };
}
export default async request => {
    try { return await createHandler({token:process.env.UNIT_BRIDGE_TOKEN,store:()=>getStore({name:'stun-unit-snapshots',consistency:'strong'})})(request); }
    catch { return Response.json({message:'Storage failure'},{status:500}); }
};

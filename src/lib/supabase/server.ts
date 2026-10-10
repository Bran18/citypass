import 'server-only';
import type { Database } from './database.types';
import {createServerClient} from '@supabase/ssr';
import {cookies} from 'next/headers';
export const configured=()=>Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL&&process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
export async function createClient(){
 if(!configured()) throw new Error('not_configured');
 const store=await cookies();
 return createServerClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,{cookies:{getAll:()=>store.getAll(),setAll:(items)=>{try{items.forEach(({name,value,options})=>store.set(name,value,options));}catch{/* Server Components cannot write; proxy refreshes cookies. */}}}});
}
export async function session(){if(!configured())return null;const db=await createClient();const {data,error}=await db.auth.getUser();return error?null:data.user;}

import { createClient } from '@supabase/supabase-js'


const supabaseUrl = 'https://xyluegcbbuldazhanhnc.supabase.co' 


const supabaseKey = 'sb_publishable_Ug3xuVwdXoQKA9D3bzpmtg_dedIpzU4' 

export const supabase = createClient(supabaseUrl, supabaseKey)
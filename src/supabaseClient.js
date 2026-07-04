import { createClient } from '@supabase/supabase-js';

// These two values are safe to be public in this file \u2014 Row Level Security
// (set up by supabase-setup.sql) is what actually protects your data, not
// secrecy of this key. Never put your "service_role" key here or anywhere
// in this front-end project \u2014 only ever the "anon public" key.
const SUPABASE_URL = 'https://wxwdqqjzfrfddqcgkrfv.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_XOIjcIxkUTmnxUL1FbPA2w_TbZoD0hC';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

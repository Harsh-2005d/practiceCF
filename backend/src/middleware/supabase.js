import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config(); // loads .env before anything else

const supabaseUrl = 'https://pqufhjotnlmbptdooxlq.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY; // make sure this is defined!

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;

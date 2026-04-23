const SUPABASE_URL = "https://vgfyqhbyjnywurmnflua.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_AGzdD-xbwe643OXPg50uYw_gDCoLQvc";

console.log("[Supabase Config] Carregando config...");
console.log("[Supabase Config] URL:", SUPABASE_URL);
console.log("[Supabase Config] KEY existe?:", !!SUPABASE_ANON_KEY);

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log("[Supabase Config] Client criado com sucesso:", supabaseClient);
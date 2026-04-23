const SUPABASE_URL = "https://vgfyqhbyjnywurmnflua.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_AGzdD-xbwe643OXPg50uYw_gDCoLQvc";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkUser() {
  const { data } = await supabaseClient.auth.getUser();

  if (!data.user) {
    window.location.href = "login.html";
  }
}

checkUser();
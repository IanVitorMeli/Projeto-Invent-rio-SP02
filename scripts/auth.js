const form = document.getElementById("login-form");
const btn = document.getElementById("login-btn");
const message = document.getElementById("login-message");

console.log("[Auth] Script de login carregado.");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    console.log("[Auth] Tentando login:", email);

    message.textContent = "";
    message.className = "login-message";

    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Autenticando...';

    try {
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email,
            password
        });

        console.log("[Auth] DATA:", data);
        console.log("[Auth] ERROR:", error);

        if (error) {
            message.textContent = "Erro: " + error.message;
            message.classList.add("error");
            btn.disabled = false;
            btn.innerHTML = "Entrar no Sistema";
            return;
        }

        message.textContent = "Login realizado com sucesso!";
        message.classList.add("success");

        setTimeout(() => {
            window.location.href = "dashboard.html";
        }, 800);

    } catch (err) {
        console.error("[Auth] Erro inesperado:", err);
        message.textContent = "Erro inesperado: " + err.message;
        message.classList.add("error");
        btn.disabled = false;
        btn.innerHTML = "Entrar no Sistema";
    }
});
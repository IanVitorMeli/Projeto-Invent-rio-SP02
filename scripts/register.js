const form = document.getElementById("register-form");
const btn = document.getElementById("register-btn");
const message = document.getElementById("register-message");

console.log("[Register] Script de cadastro carregado.");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document.getElementById("confirm-password").value.trim();

    console.log("[Register] Tentando cadastro:", email);

    message.textContent = "";
    message.className = "login-message";

    if (!name || !email || !password || !confirmPassword) {
        message.textContent = "Preencha todos os campos.";
        message.classList.add("error");
        return;
    }

    if (password !== confirmPassword) {
        message.textContent = "As senhas não coincidem.";
        message.classList.add("error");
        return;
    }

    if (password.length < 6) {
        message.textContent = "A senha deve ter no mínimo 6 caracteres.";
        message.classList.add("error");
        return;
    }

    try {
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Criando...';

        const { data, error } = await supabaseClient.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name
                }
            }
        });

        console.log("[Register] DATA:", data);
        console.log("[Register] ERROR:", error);

        if (error) {
            message.textContent = "Erro: " + error.message;
            message.classList.add("error");
            btn.disabled = false;
            btn.innerHTML = "Criar Conta";
            return;
        }

        message.textContent = "Conta criada com sucesso!";
        message.classList.add("success");

        setTimeout(() => {
            window.location.href = "Login.html";
        }, 1200);

    } catch (err) {
        console.error("[Register] Erro inesperado:", err);
        message.textContent = "Erro inesperado: " + err.message;
        message.classList.add("error");
        btn.disabled = false;
        btn.innerHTML = "Criar Conta";
    }
});
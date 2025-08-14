const modal = document.getElementById("phoneModal");
const phoneInput = document.getElementById("phoneInput");
const confirmPhone = document.getElementById("confirmPhone");

confirmPhone.addEventListener("click", async () => {
  const numberPhone = phoneInput.value.trim();
  if (!numberPhone) {
    alert("Digite um número válido!");
    return;
  }

  try {
    const resp = await fetch(
      "http://srv714232.hstgr.cloud:5678/webhook/76843d88-a34c-463b-a1d6-97d7eb422ce6",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ numberPhone }),
      }
    );

    if (!resp.ok) throw new Error("Erro na requisição");

    const data = await resp.json();

    document.querySelector(".sidebar .text-user-name").textContent =
      numberPhone;
    document.getElementById("text-user-name").textContent = numberPhone;

    modal.style.display = "none";
    document.getElementById("chat").classList.remove("hidden");
    listMessages(data);
    scrollToBottom();
  } catch (err) {
    console.error(err);
    alert("Erro ao abrir o chat.");
  }
});

const WEBHOOK_URL =
    "http://srv714232.hstgr.cloud:5678/webhook/76843d88-a34c-463b-a1d6-97d7eb422ce6";

let formChat = document.getElementById("formChat");

const modal = document.getElementById("phoneModal");
const phoneInput = document.getElementById("phoneInput");
const confirmPhone = document.getElementById("confirmPhone");

window.addEventListener("DOMContentLoaded", () => {
    if (modal) modal.style.display = "flex";
});

function isHttpUrl(value) {
    try {
        const u = new URL(value);
        return u.protocol === "http:" || u.protocol === "https:";
    } catch {
        return false;
    }
}

function formatTimeFromString(dateTimeStr) {
    const parts = (dateTimeStr || "").replace(" ", "T");
    const dt = new Date(parts);
    if (Number.isNaN(dt.getTime())) return dateTimeStr || "";
    return dt.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
    });
}

function createMessageElement(message) {
    const wrap = document.createElement("div");
    const side = message.recived === 1 ? "received" : "sent";
    wrap.classList.add("message", side);
    wrap.style.cursor = "default";
    wrap.dataset.chatId = message.id;

    const content = document.createElement("div");
    content.classList.add("message-content");

    switch (message.tipo) {
        case "text": {
            const span = document.createElement("span");
            span.textContent = message.sendData ?? "";
            content.appendChild(span);
            break;
        }
        case "image": {
            const url = message.sendData;
            if (url && (isHttpUrl(url) || url.startsWith("data:"))) {
                const img = document.createElement("img");
                img.src = url;
                img.alt = "Imagem";
                img.loading = "lazy";
                img.decoding = "async";
                content.appendChild(img);
            } else {
                content.appendChild(
                    document.createTextNode("Imagem indisponível.")
                );
            }
            break;
        }
        case "audio": {
            const url = message.sendData;
            if (url && (isHttpUrl(url) || url.startsWith("data:"))) {
                const audio = document.createElement("audio");
                audio.controls = true;
                const source = document.createElement("source");
                source.src = url;
                audio.appendChild(source);
                content.appendChild(audio);
            } else {
                content.appendChild(
                    document.createTextNode("Áudio indisponível.")
                );
            }
            break;
        }
        case "video": {
            const url = message.sendData;
            if (url && (isHttpUrl(url) || url.startsWith("data:"))) {
                const video = document.createElement("video");
                video.controls = true;
                video.playsInline = true;
                const source = document.createElement("source");
                source.src = url;
                video.appendChild(source);
                content.appendChild(video);
            } else {
                content.appendChild(
                    document.createTextNode("Vídeo indisponível.")
                );
            }
            break;
        }
        default: {
            content.appendChild(
                document.createTextNode("[Mensagem não suportada]")
            );
            break;
        }
    }

    const footer = document.createElement("div");
    footer.classList.add("message-footer");

    const time = document.createElement("span");
    time.classList.add("text-time");
    time.textContent = formatTimeFromString(message.data);

    footer.appendChild(time);
    wrap.appendChild(content);
    wrap.appendChild(footer);
    return wrap;
}

function listMessages(messagesArray) {
    const container = document.getElementById("messages");
    container.innerHTML = "";
    messagesArray.forEach((m) =>
        container.appendChild(createMessageElement(m))
    );
}

function scrollToBottom() {
    const messagesDiv = document.getElementById("messages");
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

async function openChatByNumero(numero) {
    const resp = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ numero }),
    });
    if (!resp.ok) throw new Error("Falha ao consultar webhook");

    if (Array.isArray(data) && data.length > 0) {
        currentCliente = data[0].cliente || numero;
        currentZap = data[0].zapoficial || null;
    } else {
        currentCliente = numero;
        currentZap = null;
    }

    const sidebarSpan = document.getElementById("sidebar-number");
    const headerSpan = document.getElementById("header-number");
    if (sidebarSpan) sidebarSpan.textContent = currentCliente;
    if (headerSpan) headerSpan.textContent = currentCliente;

    document.getElementById("chat").classList.remove("hidden");
    lastMessages = Array.isArray(data) ? data : [];
    listMessages(lastMessages);
    scrollToBottom();
}

confirmPhone?.addEventListener("click", async () => {
    const numero = phoneInput.value.trim();
    if (!numero) {
        alert("Digite um número válido!");
        return;
    }
    try {
        await openChatByNumero(numero);
        if (modal) modal.style.display = "none";
    } catch (e) {
        console.error(e);
        alert("Erro ao abrir o chat.");
    }
});

async function handleSubmit(event) {
    event.preventDefault();
    const input = document.getElementById("message");
    const msg = input.value;
    if (!msg.trim()) return;

    if (!currentCliente) {
        alert("Abra um chat informando o número do cliente primeiro.");
        return;
    }

    try {
        const url = `https://wachatcenter20240403013545.azurewebsites.net/api/Front/SendMessageText?to=${encodeURIComponent(
            currentCliente
        )}&Message=${encodeURIComponent(msg)}${
            currentZap ? `&from=${encodeURIComponent(currentZap)}` : ""
        }`;

        const response = await fetch(url);
        const ok = await response.json();

        if (ok) {
            await openChatByNumero(currentCliente);
            input.value = "";
            scrollToBottom();
        } else {
            alert("Houve um erro inesperado no envio da mensagem!");
        }
    } catch (err) {
        console.error(err);
        alert("Erro ao enviar mensagem.");
    }
}

formChat?.addEventListener("submit", handleSubmit);

let formChat = document.getElementById("formChat");

function createMessageElement(message) {
  const conversationElement = document.createElement("div");
  const toClient = message.recived === 0 ? "sent" : "received";

  conversationElement.classList.add("message", toClient);
  conversationElement.style.cursor = "default";
  conversationElement.dataset.chatId = message.id;

  switch (message.tipo) {
    case "audio":
      conversationElement.innerHTML = `
        <audio controls>
          <source src="${message.sendData}" type="audio/mpeg">
        </audio>
      `;
      break;
    case "image":
      conversationElement.innerHTML = `
        <img src="${message.sendData}" alt="Imagem">
      `;
      break;
    case "video":
      conversationElement.innerHTML = `
        <video controls>
          <source src="${message.sendData}" type="video/mp4">
        </video>
      `;
      break;
    case "text":
      conversationElement.textContent = message.sendData;
      break;
    default:
      conversationElement.textContent = "Mensagem não suportada";
      break;
  }

  conversationElement.innerHTML += `
    <div class="message-footer">
      <span class="text-time">${formatUTCFromTime(message.data)}</span>
    </div>
  `;

  return conversationElement;
}

function listMessages(messagesArray) {
  const container = document.getElementById("messages");
  container.innerHTML = "";
  messagesArray.forEach((message) => {
    const messageElement = createMessageElement(message);
    container.appendChild(messageElement);
  });
}

async function getChatById(chatId) {
  const response = await fetch(
    `https://wachatcenter20240403013545.azurewebsites.net/api/Front/GetWABIMessagesById?id=${chatId}`
  );
  const data = await response.json();
  return data;
}

async function openChat(chatId) {
  const chat = document.getElementById("chat");
  const messages = await getChatById(chatId);
  if (messages) {
    chat.classList.remove("hidden");
    listMessages(messages);
    scrollToBottom();
  }
}

async function handleSubmit(event) {
  event.preventDefault();
  let message = document.getElementById("message").value;
  if (message.trim() === "") {
    return;
  }

  const response = await fetch(
    `https://wachatcenter20240403013545.azurewebsites.net/api/Front/SendMessageText?to=${phone_to}&Message=${message}&from=${phone_from}`
  );
  const data = await response.json();
  if (data) {
    openChat(id_chat);
    document.getElementById("message").value = "";
    scrollToBottom();
  } else {
    window.alert("Houve um erro inesperado no envio da mensagem!");
  }
}

function scrollToBottom() {
  let messagesDiv = document.getElementById("messages");
  let height = messagesDiv.scrollHeight;
  messagesDiv.scrollTop = height;
}

formChat.addEventListener("submit", async function (event) {
  event.preventDefault();
  await handleSubmit(event);
});

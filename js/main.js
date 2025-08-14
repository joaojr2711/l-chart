let phone_to = "";
let phone_from = "";
let id_chat = "";

function createChatElement(chat) {
    const conversationElement = document.createElement("div");
    conversationElement.classList.add("conversation");
    conversationElement.style.cssText = `cursor: pointer`;
    conversationElement.setAttribute("data-chat-id", chat.id_chat);

    let hasNewMessage = chat.has_new_message
        ? '<span class="message-badge">+1</span>'
        : "";

    conversationElement.innerHTML = `
      <img
        src="https://randomuser.me/api/portraits/men/3.jpg"
        alt="profile"
        class="photo-user"
      />
      <div class="conversation-info">
        <div class="user-time">
          <span class="text-user-name">${chat.to_number}</span>
          <span class="text-time">${formatTimeFromDate(
              chat.created_date
          )}</span>
        </div>
        <div class="last-message">

          <span class="text-last-message">
            <span style="margin-right: 5px;"><svg viewBox="0 0 18 18" height="18" width="18" preserveAspectRatio="xMidYMid meet" class="" version="1.1" x="0px" y="0px" enable-background="new 0 0 18 18"><title>status-dblcheck</title><path fill="currentColor" d="M17.394,5.035l-0.57-0.444c-0.188-0.147-0.462-0.113-0.609,0.076l-6.39,8.198 c-0.147,0.188-0.406,0.206-0.577,0.039l-0.427-0.388c-0.171-0.167-0.431-0.15-0.578,0.038L7.792,13.13 c-0.147,0.188-0.128,0.478,0.043,0.645l1.575,1.51c0.171,0.167,0.43,0.149,0.577-0.039l7.483-9.602 C17.616,5.456,17.582,5.182,17.394,5.035z M12.502,5.035l-0.57-0.444c-0.188-0.147-0.462-0.113-0.609,0.076l-6.39,8.198 c-0.147,0.188-0.406,0.206-0.577,0.039l-2.614-2.556c-0.171-0.167-0.447-0.164-0.614,0.007l-0.505,0.516 c-0.167,0.171-0.164,0.447,0.007,0.614l3.887,3.8c0.171,0.167,0.43,0.149,0.577-0.039l7.483-9.602 C12.724,5.456,12.69,5.182,12.502,5.035z"></path></svg></span>
            Última mensagem
          </span>
          ${hasNewMessage}
        </div>
      </div>
  `;

    conversationElement.addEventListener("click", function () {
        phone_to = chat.to_number;
        phone_from = chat.from_sender_number;
        id_chat = chat.id_chat;
        handleChatClick(chat.id_chat);
    });

    return conversationElement;
}

function handleChatClick(chatId) {
    const chat = document.querySelector(`[data-chat-id="${chatId}"]`);
    const phoneNumber = document.getElementById("text-user-name");
    if (chat) {
        phoneNumber.textContent = phone_to;
        openChat(chatId);
    }
}

function listChats(chatsArray) {
    const container = document.getElementById("conversation-list-chat");
    container.innerHTML = "";
    chatsArray.forEach((chat) => {
        const chatElement = createChatElement(chat);
        container.appendChild(chatElement);
    });
}

async function getChats() {
    const response = await fetch(
        "https://wachatcenter20240403013545.azurewebsites.net/api/Front/GetWABIChats"
    );
    const data = await response.json();
    return data;
}

async function main() {
    //   const chats = await getChats();
    //   if (chats) {
    //     listChats(chats);
    //   }
}

main();

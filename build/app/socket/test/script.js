"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
const url = "http://localhost:5000/api";
const socket = io("http://localhost:5000", {
  query: `token=${token}`,
});
var user;
var roomId;
const config = {
  headers: {
    authorization: token,
  },
};
const loadListRoom = () =>
  __awaiter(void 0, void 0, void 0, function* () {
    const listRoom = document.getElementById("list-rooms");
    const result = yield axios.get(`${url}/users/profile`, config);
    const data = result.data;
    user = data.user;
    const roomsElement = data.rooms.map((e) => {
      return `
    <div class="chat_list active_chat" onclick=loadMessage('${e._id}') >
        <div class="chat_people">
        <div class="chat_img"> <img src="${e.avatar}" alt="sunil"> </div>
        <div class="chat_ib">
            <h5>Sunil Rajput <span class="chat_date">Dec 25</span></h5>
            <p>Test, which is a new approach to have all solutions 
            astrology under one roof.</p>
        </div>
        </div>
    </div> 
    `;
    });
    listRoom.innerHTML = roomsElement.join();
  });
loadListRoom();
const loadMessage = (room) =>
  __awaiter(void 0, void 0, void 0, function* () {
    roomId = room;
    const messages = document.getElementById("messages");
    const result = yield axios.get(`${url}/rooms/${room}/messages`, config);
    const userID = user._id;
    const data = result.data;
    const messagesElement = data.map((e) => {
      // my message
      if (e.user._id == userID) {
        return elementMyMeesage(e.content);
      } else {
        return elementReciveMeesage(e.user.avatar, e.content);
      }
    });
    messages.innerHTML = messagesElement.join(" ");
  });
const elementReciveMeesage = (avatar, content) => {
  return `<div class="incoming_msg">
    <div class="incoming_msg_img"> <img src="${avatar}" alt="sunil"> </div>
    <div class="received_msg">
      <div class="received_withd_msg">
        <p>${content}</p>
        <span class="time_date"> 11:01 AM    |    June 9</span></div>
    </div>
    </div>
    `;
};
const elementMyMeesage = (content) => {
  return ` 
    <div class="outgoing_msg">
            <div class="sent_msg">
                <p>${content}</p>
                <span class="time_date"> 11:01 AM    |    June 9</span>
            </div>
    </div>
      `;
};
const send = () => {
  const content = document.getElementById("message").value;
  if (!content) return;
  const result = sendMessageSocket(roomId, content, "text");
  console.log(result);
};
// socket
const sendMessageSocket = (roomId, content, type) => {
  socket.emit("client-send-message", { token, roomId, content, type });
};
socket.on("server-send-message", (data) => {
  const messages = document.getElementById("messages");
  // my message
  var a = messages.innerHTML;
  if (data.message.user._id == user._id) {
    a += elementMyMeesage(data.message.content);
  } else {
    a += elementReciveMeesage(data.message.user.avatar, data.message.content);
  }
  messages.innerHTML = a;
});

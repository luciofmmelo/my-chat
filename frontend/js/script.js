// LOGIN ELEMENTS:

const login = document.querySelector('.login');
const loginForm = document.querySelector('.login-form');
const loginInput = document.querySelector('.login-input');
const loginButton = document.querySelector('.login-button');

// HEADER ELEMENTS:

const header = document.querySelector('.chat-header');
const nomePerfil = document.querySelector('.name-perfil');
const fotoPerfil = document.querySelector('.photo-perfil');

// CHAT ELEMENTS:

const chatMessages = document.querySelector('.chat-messages');

// FOOTER ELEMENTS:

const chatForm = document.querySelector('.chat-form');
const chatInput = document.querySelector('.chat-input');

// CONSTANTS, VARIABLES, ARRAYS AND OBJECTS:

const colors = [
    "cadetblue",
    "darkgoldenrod",
    "cornflowerblue",
    "darkkhaki",
    "hotpink",
    "gold"
]
const user = {
    id: "",
    name: "",
    color: ""
}
let webSocket;


// AUXILIAR FUNCTIONS:

const getHandleColor = () => {
    const randomIndex = Math.floor(Math.random() * colors.length);

    return colors[randomIndex];
}

const getCurrentTime = () => {
    const messageDate = new Date();
    const messageTime = messageDate.toLocaleTimeString('pt-BR');

    return messageTime;
}

const toggleClasse = () => {
    const chatInput = document.getElementById('chat-input');
    const sendIcon = document.getElementById('send-icon');
    const micIcon = document.getElementById('mic-icon');

    if (chatInput.value.trim() === '') {
        sendIcon.classList.add('ocultar');
        micIcon.classList.remove('ocultar');
    } else {
        sendIcon.classList.remove('ocultar');
        micIcon.classList.add('ocultar');
    }
}

// CONTROLLER FUNCTIONS:

const processMessage = ({ data }) => {
    const { userId, userName, userColor, content, messageTime } = JSON.parse(data);

    const element = createSelfMessage(userId, userName, userColor, content, messageTime);

    chatMessages.appendChild(element);
}

const handleLogin = (event) => {
    event.preventDefault();

    user.id = crypto.randomUUID();
    user.name = loginInput.value;
    user.color = getHandleColor();

    login.style.display = "none";

    nomePerfil.textContent = user.name;
    header.style.display = "flex";
    chatForm.style.display = "flex";

    webSocket = new WebSocket('ws://localhost:8080');
    webSocket.onmessage = processMessage;
}

const sendMessage = (event) => {
    event.preventDefault();

    const message = {
        userId: user.id,
        userName: user.name,
        userColor: user.color,
        content: chatInput.value,
        messageTime: getCurrentTime()
    }

    webSocket.send(JSON.stringify(message));

    chatInput.value = '';
}

const createSelfMessage = (userId, userName, userColor, content, messageTime) => {
    const selfMessage = document.createElement('div');
    selfMessage.classList.add('message');
    
    const otherMessageTime = document.createElement('span');
    otherMessageTime.classList.add('message-time');
    
    if (userName === user.name) {
        selfMessage.classList.add('message-self');
        
        otherMessageTime.classList.add('message-time-self');
    } else {
        selfMessage.classList.add('message-other');
        
        const otherUserName = document.createElement('span');
        otherUserName.classList.add('other-name');
        otherUserName.style.color = userColor;
        otherUserName.innerHTML = userName;
        selfMessage.appendChild(otherUserName);
        
        otherMessageTime.classList.add('message-time-other');    
    }

    selfMessage.innerHTML += content;
    console.log(messageTime)
    otherMessageTime.innerHTML = messageTime;
    selfMessage.appendChild(otherMessageTime);

    return selfMessage;
}


// EVENT LISTENERS:

loginForm.addEventListener('submit', handleLogin);
chatForm.addEventListener('submit', sendMessage);

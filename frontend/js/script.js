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
    
    webSocket.onopen = () => {
        webSocket.send(JSON.stringify({
            type: 'login',
            userName: user.name
        }));
    };

    webSocket.onmessage = processMessage;
}

const changePhoto = (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('uploadedImage').src = e.target.result;
        }
        reader.readAsDataURL(file);
    }
};

const processMessage = ({ data }) => {
    const parsedData = JSON.parse(data);
    let element;

    if (parsedData.type === 'welcome') {
        element = getWelcomeMessage(parsedData.message);
    } else if (parsedData.type === 'newUser') {
        element = getNewUserMessage(parsedData.message);
    } else if (parsedData.type === 'message') {
        element = createSelfMessage(parsedData.userId, parsedData.userName, parsedData.userColor, parsedData.content, parsedData.messageTime);
    }

    chatMessages.appendChild(element);
}

const sendMessageNewUser = () => {
    const newUserMessage = {
        userName: user.name,
        messageTime: getCurrentTime()
    }

    webSocket.send(JSON.stringify(newUserMessage));
}

const getWelcomeMessage = (message) => {
    const welcomeMessage = document.createElement('div');
    welcomeMessage.classList.add('new-user-message');
    welcomeMessage.textContent = message;
    return welcomeMessage;
};

const getNewUserMessage = (message) => {
    const newUserMessage = document.createElement('div');
    newUserMessage.classList.add('new-user-message');
    newUserMessage.textContent = message;
    return newUserMessage;
};

const sendMessage = (event) => {
    event.preventDefault();

    const message = {
        type: 'message',
        userId: user.id,
        userName: user.name,
        userColor: user.color,
        content: chatInput.value,
        messageTime: getCurrentTime()
    };

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
    otherMessageTime.innerHTML = messageTime;
    selfMessage.appendChild(otherMessageTime);

    return selfMessage;
}


// EVENT LISTENERS:

// fotoPerfil.addEventListener('change', changePhoto);
loginForm.addEventListener('submit', handleLogin);
chatForm.addEventListener('submit', sendMessage);
document.getElementById('image').addEventListener('click', function() {
    document.getElementById('image-input').click();
});

document.getElementById('image-input').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('upload-image').style.display = "flex";
            document.getElementById('upload-image').src = e.target.result;
        }
        reader.readAsDataURL(file);
    }
});

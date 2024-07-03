const socket = io()

const chatBox = document.getElementById('chatBox')
const messageLogs = document.getElementById('messageLogs')
let user;

Swal.fire({
    title: "Inicio de Sesion",
    input: "text",
    text: "Por favor ingrese su nombre de usuario para continuar",
    inputValidator: (valor) => {
        return !valor.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,15}$/) && 'Ingrese un valor valido';
    },
    allowOutsideClick: false
}).then(resultado => {
    user = resultado.value;
    console.log(user);
})

chatBox.addEventListener('change', (e) => {
    if (chatBox.value.trim().length > 0) {
        socket.emit('mensaje', { user: user, message: chatBox.value, hora: new Date().toLocaleString() })
        chatBox.value = "";
    }
})

socket.on('mensajeLogs', (info) => {
    messageLogs.innerHTML = "";
    info.forEach(mensaje => {
        messageLogs.innerHTML += `<p><b>${mensaje.user}</b>: ${mensaje.message}</p>`;
    })
})
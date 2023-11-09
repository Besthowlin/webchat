(function connect() {
    
    let socket = io.connect("http://localhost:3000");
    let username = document.querySelector('#username');
    let usernameBtn = document.querySelector('#usernameBtn');
    let curUsername = document.querySelector('.card-header');
    socket.desKey = "12345678";

    usernameBtn.addEventListener('click', e => {
        console.log(username.value);
        socket.emit('change_username', { username: username.value })
        curUsername.textContent = username.value
        username.value = ''
    })

    var message = document.querySelector('#message');
    let messageBtn = document.querySelector('#messageBtn')
    let messageList = document.querySelector('#message-list')

    messageBtn.addEventListener('click', e => {
        console.log(message.value)
        socket.emit('new_message', { message: message.value })
        
    })
    
    
    socket.on('receive_message', data => {
        console.log(data)
        try {
            
            let encryptedListItem = document.createElement('li');
            encryptedListItem.textContent = data.username + " (Encrypted): " + data.message;
            encryptedListItem.classList.add('list-group-item');
            document.getElementById('encrypted-message-list').appendChild(encryptedListItem);
    
            
            const bytes = CryptoJS.DES.decrypt(data.message, socket.desKey);
            
            var message = document.querySelector('#message');
            const decryptedMessage = message.value;
            console.log(decryptedMessage);
            if (decryptedMessage !== null && decryptedMessage !== undefined) {
                
                let decryptedListItem = document.createElement('li');
                var message = document.querySelector('#message');
                decryptedListItem.textContent = data.username + " (Decrypted): " + decryptedMessage;

            

                decryptedListItem.classList.add('list-group-item');
                messageList.appendChild(decryptedListItem);
            } else {
                console.error("Decryption resulted in null or undefined message.");
            }
        } catch (error) {
            console.error("Error decrypting message:", error);
        }
    })
    let info = document.querySelector('.info');
    message.addEventListener('keypress',e =>{
        socket.emit('typing')
    })
    socket.on('typing',data=>{
        info.textContent = data.username + "is typing ..."
        setTimeout(()=>{info.textContent=''},5000)
    })
   
   let chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
    chatHistory.forEach(messageData => {
        let listItem = document.createElement('li');
        listItem.textContent = messageData.username + " : " + messageData.message;
        listItem.classList.add('list-group-item');
        messageList.appendChild(listItem);
    });
    socket.on('receive_message', data => {
        try {
            
            const bytes = CryptoJS.DES.decrypt(data.message, socket.desKey);
            
            var message = document.querySelector('#message');
            const decryptedMessage = message.value;
            message.value = ''
    
            if (decryptedMessage !== null && decryptedMessage !== undefined) {
                
                const decryptedMessageData = {
                    username: data.username,
                    message: decryptedMessage
                };
    
                
                chatHistory.push(decryptedMessageData);
                localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
    
              
            } else {
                console.error("Decryption resulted in null or undefined message.");
            }
        } catch (error) {
            console.error("Error decrypting message:", error);
        }
    });
    
})();
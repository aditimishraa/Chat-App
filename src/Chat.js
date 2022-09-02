import React, { useEffect } from 'react';
import { createContext, useState} from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';

export const ThemeContext = createContext(null);

function Chat({ socket, username, room }) {
    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);
    
    const sendMessage = async () => {
        if(currentMessage !== ""){
            const messageData = {
                room: room,
                author: username,
                message: currentMessage,
                time: new Date(Date.now()).getHours() + 
                ":" +
                new Date(Date.now()).getMinutes(),

            };

            await socket.emit("send_message", messageData);
            setMessageList((list) => [...list, messageData]);
            setCurrentMessage("");
        }
    };

    useEffect(() => {
        socket.on("recieve_message", (data) => {
            console.log(data);
            setMessageList((list) => [...list, data]);
        });
    }, [socket]);


  return (
    <div className='chat-window' id='theme'>
        <div className='chat-header'>
            <p>Live Chat</p>
        </div>
        <div className='chat-body'>
            <ScrollToBottom className='message-container'>
            {messageList.map((messageContent) => {
                return (
                    <div className='message' 
                    id = {username === messageContent.author ? "other" : "you"}>
                        <div>
                            <div className='message-content'>
                                <p>{messageContent.message}</p>
                            </div>
                            <div className='message-meta'>
                                <p id="time">{messageContent.time}</p>
                                <p id="author">{messageContent.author}</p>
                            </div>
                        </div>
                        
                    </div>
                );
            })}
            </ScrollToBottom>
        </div>
        <div className='chat-footer'>
            <input type="text" 
                value={currentMessage}
                
                onChange={(event) => {
                    setCurrentMessage(event.target.value);
                }} 
                onKeyPress={(event) => {event.key === "Enter" && sendMessage()}}
            />
            <button onClick={sendMessage}>&#x27A4;</button>
        </div>
        
       

    </div>


  )
}

export default Chat;
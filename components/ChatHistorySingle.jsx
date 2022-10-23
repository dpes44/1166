import React from 'react';
import Avatar from './Avatar';


const ChatHistorySingle = ({photo, active, userName = 'User', lastMessage = 'No message found!', selected = false}) => {
    let containerClass = selected ? 'message-single active' : 'message-single';

    return (
        <div className={containerClass}>
            <Avatar profilePhoto={photo} active={active} />
            <div className="text-area">
                <div className="user-name">
                <p>{userName}</p>
                </div>
                <div className="message">
                <p>{lastMessage}</p>
                </div>
            </div>
        </div>
    )
}

export default ChatHistorySingle;
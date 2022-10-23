import React, {useState} from 'react'
import ChatHistorySingle from './ChatHistorySingle'

const dummyMessages = [
    {
        id: 1,
        userName: 'Rafaella Mendes Diniz',
        lastMessage: 'This is a new message',
        active: false,
        photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80'
    },
    {
        id: 2,
        userName: 'Rajendra Paudel',
        lastMessage: 'This is my message',
        active: true,
    },
    {
        id: 3,
        userName: 'Sudeep Gautam',
        lastMessage: 'This is an old message',
    }
]

const ChatHistory = () => {
    const [latestMessages, setLatestMessages] = useState(dummyMessages)

    return (
        <>
        {
            latestMessages.map((message) => <ChatHistorySingle {...message} />)
        }            
        </>
    )
}

export default ChatHistory
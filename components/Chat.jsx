import React, {useEffect} from 'react'
import { BoshClient } from "xmpp-bosh-client/browser"; 
import Avatar from './Avatar';
import ChatHistory from './ChatHistory';
import {client, xml} from '@xmpp/client'

//const sendTo = 'facillator1@chat.leanq.com.np';
const sendTo = 'rajendra15@chat.leanq.com.np';
const dummyMessages = [
  // {
  //   originId: "231423-42342-1231-324",
  //   isSender: true,
  //   message: 'Hello'
  // },
  // {
  //   originId: "42342-1231-324-234234",
  //   isSender: false,
  //   message: 'Hi'
  // }
]
let xmpp = {}

const Chat = () => {
    

    const [messages, setMessages] = React.useState(dummyMessages);

    const [senderMessage, setSenderMessage] = React.useState('');

    //const USERNAME = "rajendra11cls@chat.leanq.com.np";
   // const PASSWORD = "12345678";
    //const URL = "https://chat.leanq.com.np:5281/http-bind";
    
    //const client2 = new BoshClient(USERNAME, PASSWORD, URL);

    // useEffect(() => {
      let messageBody = document.querySelector('.chat-message-section')
      if(messageBody) {          
        messageBody.scrollTop = messageBody.scrollHeight     
      } 

      

      xmpp = client({
          service: 'wss://chat.leanq.com.np:5281/xmpp-websocket',
          domain: 'chat.leanq.com.np',
          resource: 'chat.leanq.com.np',
          username: 'rajendra15',
          password: '12345678',
        })
        
        //debug(xmpp, true)
        
        xmpp.on('error', err => {
          console.error(err)
        })
        
        xmpp.on('offline', () => {
          console.log('offline')
        })
        
        xmpp.on('stanza', async stanza => {
          //console.log('stanza')
          console.log(stanza.toString())
          if (stanza.is('message')) {
            //await xmpp.send(xml('presence', {type: 'available'}))
            //await xmpp.stop()
          }
        })
        
        
        xmpp.on('online', async address => {
          // Makes itself available
          await xmpp.send(xml('presence'))
          console.log('stanza')
          // Sends a chat message 
          const message_send = xml(
            'message',
            {type: 'chat', to: sendTo},
            xml('body', {}, messages)
          )
          await xmpp.send(message_send)
        })

        xmpp.start().catch(function() {
            
        });
    // }, [])

    

    
    const messege_box = document.querySelector('#msg-field');

    const sendMessage = async (message_send) => {
      console.log("sending message");
      if(!message_send) return;
      console.log('message_send', message_send);
      
      const message_xml = xml(
        'message',
        {type: 'chat', to: sendTo},
        xml('body', {}, message_send)
      )
      await xmpp.send(message_xml)

      console.log('message_xml', message_xml);
      
      let messageObj = {
        originId: messages.length + 1,
        isSender: true,
        message_send
      }
      setMessages(prevValue => [...prevValue, message_send])
      console.log("aall msg", messages)

      setSenderMessage('')

      //console.log(messageBody.scrollHeight)
      let messageBody = document.querySelector('.chat-message-section')
      const scrollBottomPosition = messageBody.scrollHeight
      
      setTimeout(
        () => messageBody.scrollTop = scrollBottomPosition,
        1
      )

      //console.log(messageBody.scrollTop)
    }

    return (

    <div id="app">
      <section height="100%" className="box__Box-sc-17sbq3p-0 gYLxQl adminjs_Box">
        
        <section className="box__Box-sc-17sbq3p-0 inuVkH adminjs_Box">
            
      
          <section>
            <div className="chat-container">
              <div className="chat-left-panel">
                <div className="left-header">
                  <div className="user-header">
                    <Avatar active={false}/>
                    <div className="text-area">
                      <div className="user-name">
                        <p>Facilitator One</p>
                      </div>
                      <div className="message">
                        <div className="dropdown-list">
                          <select name="status" id="status">
                            <option className="options" value="Active">Busy</option>
                            <option className="options" value="Active">
                              Active
                            </option>
                            <option className="options" value="Inactive">
                              Inactive
                            </option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <input
                    type="text"
                    className="chat-search"
                    id="text"
                    name="search"
                    placeholder="Search"
                  />
                </div>
                <div className="left-body">
                  <ChatHistory />                  
                </div>
              </div>
              <div className="chat-right-panel">
                <div className="right-header">
                  <div className="user-header">
                    <div className="profile-picture-right">
                      <img src="/images/avatar.png" />
                      <div className="status-circle"></div>
                    </div>
                    <div className="text-area">
                      <div className="user-name">
                        <p>User One</p>
                      </div>
                      <div className="message">
                        <p>Online</p>
                      </div>
                    </div>
                  </div>
                  <div className="icons">
                    <div className="icon-container">
                      <img src="/images/icons8-call-67 1.png" />
                    </div>
                    <div className="icon-container">
                      <img src="/images/icons8-info-50 1.png" />
                    </div>
                  </div>
                </div>
                <div className="chat-message-section">
                  <div className="message-body">                  
                  {
                   
                    messages.map(message => {
                      console.log("messages", message)
                      return <MessageSingle key={message.originId} isSender={message.isSender} message={message.message} />

                    })
                  }
                  </div>
                </div>
                <form className="right-footer">
                  <input
                    type="text"
                    className="message-field"
                    placeholder="Enter your message here."
                    name="message"
                    new_message="text"
                    id="msg-field"
                    value={senderMessage}
                    onChange={e => setSenderMessage(e.target.value)}
                  />
                  <div className="send-btn" onClick={e => sendMessage(senderMessage)}>
                    <button onClick={e => {e.preventDefault()}}>Send</button>
                  </div>
                </form>
              </div>
            </div>
          </section>

        </section>
      </section>
    </div>
    )
}

const MessageSingle = ({isSender, message}) => {
  console.log('message---------------->', message)
  let containerClass = (isSender ? 'out-message-container' : 'in-message-container') + ' msg-container';
  let messageClass = (isSender ? 'out-message' : 'in-message') + ' msg';

  return (
    <div className={containerClass}>
      <div className={messageClass}>
        <p>{message}</p>
      </div>
    </div>
  )
}

export default Chat
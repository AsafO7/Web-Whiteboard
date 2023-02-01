import { FC, useCallback, useEffect, useRef } from 'react';
import { useComponentsSizeToSubstractContext } from '../../../contexts/ComponentsSizeToSubstractProvider';
import { useRoomContext } from '../../../contexts/RoomProvider';
import { useUserContext } from '../../../contexts/UserProvider';
import { SocketRef } from '../../Lobby/Lobby'

const Chat: FC<SocketRef> = ({socket}) => {
  const { user } = useUserContext()
  const { room } = useRoomContext()
  const { chatWidth, setChatWidth } = useComponentsSizeToSubstractContext()
  const textRef = useRef<HTMLTextAreaElement>(null)
  const messagesRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleSizeChange = useCallback(() => {
    if(containerRef.current && chatWidth !== containerRef.current?.offsetWidth) {
      setChatWidth(containerRef.current?.offsetWidth)
    }
  },[chatWidth, setChatWidth])

  useEffect(() => {
    window.addEventListener("resize", handleSizeChange)
    
    return () => {
      window.removeEventListener("resize", handleSizeChange)
    }
  },[containerRef.current?.offsetWidth, handleSizeChange])

  
  function handleSubmit(e: { preventDefault: () => void; }) {
    e.preventDefault()
    if(textRef.current?.value) {
      socket.emit("send-message", textRef.current.value, user.name)
      displayMessage(textRef.current.value, user.name, "sent-msg")
      textRef.current.value = ""
    }
  }

  const displayMessage = useCallback((msg: string, user: String, msgClass: string) => {
    const msgDiv = document.createElement("div")
    msgDiv.textContent = `${user}: ${msg}`
    msgDiv.classList.add("message", msgClass)
    messagesRef.current?.append(msgDiv)
    msgDiv.scrollIntoView()
  },[])

  useEffect(() => {
    socket.on("receive-message", (msg, user) => {
      if(room.onlineUsers.find(usr => usr === user)) {
        displayMessage(msg, user, "received-msg")
      }
    })

    return(() => {
      socket.removeListener("receive-message")
    })
  })

  return (
    <div className='chat' ref={containerRef}>
      <div className='chat-page'>
        <div className='messages' ref={messagesRef}>{/* Where messages go */}</div>
      </div>
      <form id="chat-msg-form" onSubmit={handleSubmit}>
          <textarea required ref={textRef} className="text-area" form='chat-msg-form'></textarea>
          <button type='submit' className='send-msg-btn'>Send</button>
        </form>
    </div>
  )
}

export default Chat
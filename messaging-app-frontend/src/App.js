import React, { useEffect, useState } from 'react'
import Pusher from 'pusher-js'

import './App.css';
import Sidebar from './components/Sidebar'
import Chat from './components/Chat'

function App() {
  const [messages, setMessages] = useState([])

  useEffect(() => {
    const pusher = new Pusher('6e9871ac51ee4c39104a', {
      cluster: 'eu'
    })
    const channel = pusher.subscribe('messages')
    channel.bind('inserted', (data) => {
      setMessages([...messages, data])
    })
    return () => {
      channel.unbind_all()
      channel.unsubscribe()
    }
  }, [messages])
  console.log(messages)

  return (
    <div className="app">
      <div className="app__body">
        <Sidebar />
        <Chat />
      </div>
    </div>
  );
}

export default App;

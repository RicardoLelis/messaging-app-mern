import React, { useEffect, useState } from 'react'
import Pusher from 'pusher-js'

import './App.css';
import Sidebar from './components/Sidebar'
import Chat from './components/Chat'
import axios from './components/axios'
import Login from './components/Login'
import config from './config.js'


function App() {
  const [messages, setMessages] = useState([])
  const [user, setUser] = useState(null)

  useEffect(() => {
    axios.get("/messages/sync").then(res => {
      setMessages(res.data)
    })
  }, [])

  useEffect(() => {
    const pusher = new Pusher(config.key, {
      cluster: config.cluster
    });
    const channel = pusher.subscribe('messages');
    channel.bind('inserted', (data) => {
      setMessages([...messages, data])
    });
    return () => {
      channel.unbind_all()
      channel.unsubscribe()
    }
  }, [messages])
  console.log(messages)

  return (
    <div className="app">
      {!user ? <Login /> : (
        <div className="app__body">
          <Sidebar />
          <Chat messages={messages} />
        </div>
      )}
    </div>
  );
}

export default App;

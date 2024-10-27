import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import styles from '../styles/Chatbot.module.css';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [useKnowledgeBase, setUseKnowledgeBase] = useState(false);
  const [useInternet, setUseInternet] = useState(false);
  const [systemRole, setSystemRole] = useState('你是一位经验丰富的商业分析师。');

  const handleSendMessage = async () => {
    if (input.trim() === '') return;

    const newMessage: Message = { role: 'user', content: input };
    setMessages([...messages, newMessage]);
    setInput('');

    // TODO: 发送消息到后端 API 并获取响应
    // const response = await sendMessageToAPI(newMessage, useKnowledgeBase, useInternet, systemRole);
    // setMessages([...messages, newMessage, response]);
  };

  const startNewChat = () => {
    setMessages([]);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>AI Chatbot</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>AI Chatbot</h1>

        <div className={styles.chatContainer}>
          <div className={styles.messageList}>
            {messages.map((message, index) => (
              <div key={index} className={`${styles.message} ${styles[message.role]}`}>
                {message.content}
              </div>
            ))}
          </div>

          <div className={styles.inputContainer}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="输入您的消息..."
              className={styles.input}
            />
            <button onClick={handleSendMessage} className={styles.sendButton}>
              发送
            </button>
          </div>
        </div>

        <div className={styles.settings}>
          <label>
            <input
              type="checkbox"
              checked={useKnowledgeBase}
              onChange={(e) => setUseKnowledgeBase(e.target.checked)}
            />
            使用知识库
          </label>
          <label>
            <input
              type="checkbox"
              checked={useInternet}
              onChange={(e) => setUseInternet(e.target.checked)}
            />
            允许联网
          </label>
          <input
            type="text"
            value={systemRole}
            onChange={(e) => setSystemRole(e.target.value)}
            placeholder="设置系统角色"
            className={styles.systemRoleInput}
          />
          <button onClick={startNewChat} className={styles.newChatButton}>
            新建聊天
          </button>
        </div>
      </main>
    </div>
  );
};

export default Chatbot;

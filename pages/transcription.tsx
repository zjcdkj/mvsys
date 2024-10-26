import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { FaFileAudio, FaPlay, FaEdit, FaRobot, FaKeyboard, FaSave, FaPaperPlane } from 'react-icons/fa';

interface TranscriptionData {
  id: string;
  audioName: string;
  transcription: string;
  cleanedTranscription: string;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const TranscriptionPage: React.FC = () => {
  const [transcriptions, setTranscriptions] = useState<TranscriptionData[]>([]);
  const [selectedTranscription, setSelectedTranscription] = useState<TranscriptionData | null>(null);
  const [keywords, setKeywords] = useState<string>('');
  const [cleanedText, setCleanedText] = useState<string>('');
  const [cleaningMethod, setCleaningMethod] = useState<'manual' | 'ai'>('manual');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchTranscriptions();
  }, []);

  useEffect(() => {
    console.log('Selected transcription:', selectedTranscription);
    console.log('Cleaning method:', cleaningMethod);
    console.log('Keywords:', keywords);
    console.log('Cleaned text:', cleanedText);
  }, [selectedTranscription, cleaningMethod, keywords, cleanedText]);

  const fetchTranscriptions = async () => {
    try {
      const response = await axios.get('/api/transcriptions');
      setTranscriptions(response.data);
    } catch (error) {
      console.error('Error fetching transcriptions:', error);
      setErrorMessage('获取转录记录时出错，请重试。');
    }
  };

  const handleTranscriptionSelect = (transcription: TranscriptionData) => {
    setSelectedTranscription(transcription);
    setCleanedText(transcription.transcription);
  };

  const handleKeywordsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeywords(e.target.value);
  };

  const handleCleanText = useCallback(async () => {
    if (selectedTranscription) {
      if (cleaningMethod === 'manual') {
        let cleaned = selectedTranscription.transcription;
        const keywordList = keywords.split(',').map(k => k.trim());
        keywordList.forEach(keyword => {
          if (keyword) {  // 确保关键词不为空
            const regex = new RegExp(keyword, 'gi');
            cleaned = cleaned.replace(regex, '');
          }
        });
        setCleanedText(cleaned);
        console.log('Manual cleaning completed:', cleaned);  // 添加日志
      } else {
        setIsProcessing(true);
        try {
          // 立即更新聊天消息，显示用户输入
          setChatMessages(prevMessages => [
            ...prevMessages,
            { role: 'user', content: userInput }
          ]);
          setUserInput(''); // 清空输入框

          const response = await axios.post('/api/aiClean', {
            text: selectedTranscription.transcription,
            instruction: userInput,
            chatHistory: chatMessages
          });
          
          setCleanedText(response.data.cleanedText);
          setChatMessages(prevMessages => [
            ...prevMessages,
            { role: 'assistant', content: response.data.message }
          ]);
        } catch (error) {
          console.error('Error in AI cleaning:', error);
          setErrorMessage('AI 处理过程中出错，请重试。');
        } finally {
          setIsProcessing(false);
        }
      }
    } else {
      console.log('No transcription selected');  // 添加日志
    }
  }, [selectedTranscription, cleaningMethod, keywords, userInput, chatMessages]);

  const handleUserInput = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (userInput.trim() && !isProcessing) {
      await handleCleanText();
    }
  };

  const handleSaveCleanedText = async () => {
    if (selectedTranscription) {
      try {
        const fileName = selectedTranscription.audioName.replace(/\.[^/.]+$/, ""); // 移除文件扩展名
        const response = await axios.post('/api/saveKnowledge', {
          fileName: fileName,
          content: cleanedText
        });
        alert('文本已保存到知识库');
        router.push('/knowledge'); // 保存后跳转到知识库页面
      } catch (error) {
        console.error('Error saving to knowledge base:', error);
        setErrorMessage('保存到知识库失败，请重试');
      }
    }
  };

  const handleCleaningMethodChange = (method: 'manual' | 'ai') => {
    setCleaningMethod(method);
    if (method === 'ai' && chatMessages.length === 0) {
      // 添加简化的 AI 助手开场白
      setChatMessages([
        { 
          role: 'assistant', 
          content: "我是你的文字处理助手，有任何的文字处理内容我都可以帮你解决！"
        }
      ]);
    }
  };

  return (
    <div className="p-4" style={{ paddingLeft: '30px' }}>
      <h1 className="text-lg font-bold mb-6 text-blue-600 border-b pb-2">文本处理</h1>
      {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
      <div className="flex" style={{ gap: '50px', height: 'calc(100vh - 120px)' }}>
        {/* 左侧语音文件 */}
        <div className="w-[220px] flex flex-col">
          <h2 className="text-base font-semibold mb-2 text-blue-600">
            <FaFileAudio className="inline-block mr-2" />
             语音文件
          </h2>
          <div className="flex-grow overflow-y-auto">
            {transcriptions.map((item) => (
              <div 
                key={item.id} 
                className={`flex items-center p-2 cursor-pointer hover:bg-blue-50 border-b border-gray-200 ${selectedTranscription?.id === item.id ? 'bg-blue-100' : ''}`}
                onClick={() => handleTranscriptionSelect(item)}
              >
                <FaFileAudio className="text-blue-500 mr-2" />
                <span className="flex-grow truncate">{item.audioName}</span>
                <div className="flex space-x-2">
                  <FaPlay className="text-green-500 hover:text-green-600" />
                  <FaEdit className="text-blue-500 hover:text-blue-600" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 中间文字内容和右侧文字处理 */}
        <div className="flex-1 flex" style={{ gap: '50px' }}>
          {/* 中间文字内容 */}
          <div className="flex-1 flex flex-col">
            <h2 className="text-base font-semibold mb-2 text-blue-600">
              <FaEdit className="inline-block mr-2" />
              文字内容
            </h2>
            <textarea
              className="flex-grow p-2 border border-gray-300 rounded-lg"
              value={selectedTranscription?.transcription || ''}
              readOnly
            />
            <div className="mt-2 text-sm text-gray-600">
              <p>调试信息: {selectedTranscription ? '已选择转录文本' : '未选择转录文本'}</p>
              <p>转录ID: {selectedTranscription?.id || '无'}</p>
              <p>转录文本长度: {selectedTranscription?.transcription.length || 0}</p>
            </div>
          </div>

          {/* 右侧文字处理 */}
          <div className="flex-1 flex flex-col">
            <h2 className="text-base font-semibold mb-2 text-blue-600">
              <FaRobot className="inline-block mr-2" />
              文字处理
            </h2>
            <div className="flex-grow flex flex-col">
              <div className="mb-2 flex space-x-2">
                <button
                  className={`flex-1 px-4 py-2 rounded ${cleaningMethod === 'manual' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                  onClick={() => handleCleaningMethodChange('manual')}
                >
                  <FaKeyboard className="inline-block mr-2" />
                  手动处理
                </button>
                <button
                  className={`flex-1 px-4 py-2 rounded ${cleaningMethod === 'ai' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                  onClick={() => handleCleaningMethodChange('ai')}
                >
                  <FaRobot className="inline-block mr-2" />
                  AI智能处理
                </button>
              </div>
              
              <div className="flex-grow flex flex-col">
                {cleaningMethod === 'manual' ? (
                  <>
                    <input
                      type="text"
                      placeholder="输入关键词，用逗号分隔"
                      className="w-full p-2 border border-gray-300 rounded mb-2"
                      value={keywords}
                      onChange={handleKeywordsChange}
                    />
                    <button
                      className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-150 ease-in-out mb-2"
                      onClick={handleCleanText}
                    >
                      <FaEdit className="inline-block mr-2" />
                      处理文本
                    </button>
                  </>
                ) : (
                  <>
                    <div className="h-40 overflow-y-auto border border-gray-300 rounded p-2 mb-2">
                      {chatMessages.map((msg, index) => (
                        <div key={index} className={`mb-2 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                          <span className={`inline-block p-2 rounded ${msg.role === 'user' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                            {msg.role === 'user' ? <FaKeyboard className="inline-block mr-2" /> : <FaRobot className="inline-block mr-2" />}
                            {msg.content}
                          </span>
                        </div>
                      ))}
                    </div>
                    <form onSubmit={handleUserInput} className="flex space-x-2 mb-2">
                      <input
                        type="text"
                        placeholder="输入处理指令"
                        className="flex-1 p-2 border border-gray-300 rounded"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        disabled={isProcessing}
                      />
                      <button
                        type="submit"
                        className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-150 ease-in-out ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={isProcessing}
                      >
                        {isProcessing ? '处理中...' : <FaPaperPlane className="inline-block" />}
                      </button>
                    </form>
                  </>
                )}
                
                <textarea
                  className="flex-grow p-2 border border-gray-300 rounded-lg mb-2"
                  value={cleanedText}
                  onChange={(e) => setCleanedText(e.target.value)}
                />
              </div>
              
              <button
                className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-150 ease-in-out"
                onClick={handleSaveCleanedText}
              >
                <FaSave className="inline-block mr-2" />
                保存知识库
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TranscriptionPage;

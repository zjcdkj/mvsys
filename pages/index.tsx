import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { FaCloudUploadAlt, FaChartLine, FaPlay, FaPause } from 'react-icons/fa';

interface FileInfo {
  name: string;
  size: number;
  uploadedAt: string;
  audioFile?: string;
}

interface AudioInfo {
  id: string;
  name: string;
  size: number;
  createdAt: string;
  status: 'completed' | 'converting';
  progress?: number;
  duration?: number;
  transcriptionStatus: 'transcribing' | 'transcribed' | 'not_transcribed';
  transcriptionProgress?: number;
}

const Home: React.FC = () => {
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [audioFiles, setAudioFiles] = useState<AudioInfo[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [extractionProgress, setExtractionProgress] = useState<{ [key: string]: number }>({});
  const [editingAudioId, setEditingAudioId] = useState<number | null>(null);
  const [editingAudioName, setEditingAudioName] = useState('');
  const [processingFile, setProcessingFile] = useState<string | null>(null);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchUploadRecords();
    fetchAudioFiles();
  }, []);

  const fetchUploadRecords = async () => {
    try {
      const response = await axios.get('/api/files/list');
      console.log('Fetched records:', response.data);
      setFiles(response.data);
    } catch (error: any) {
      console.error('Error fetching upload records:', error);
      setErrorMessage('获取上传记录时出错，请重试。');
    }
  };

  const fetchAudioFiles = async () => {
    try {
      const response = await axios.get('/api/audio/list');
      setAudioFiles(response.data);
    } catch (error) {
      console.error('Error fetching audio files:', error);
      setErrorMessage('获取音频文件列表失败，请重试。');
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      if (file.type === 'video/mp4' || file.name.endsWith('.mp4')) {
        if (file.size <= 200 * 1024 * 1024) {
          setSelectedFile(file);
          setErrorMessage(null);
        } else {
          setSelectedFile(null);
          setErrorMessage('文件大小不能超过200MB');
        }
      } else {
        setSelectedFile(null);
        setErrorMessage('请上传MP4格式的视频文件');
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setErrorMessage('请先选择一个文件');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      setErrorMessage(null);
      setSuccessMessage(null);
      console.log('Starting file upload');
      const response = await axios.post('/api/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent: any) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
          console.log(`Upload progress: ${percentCompleted}%`);
        },
        timeout: 30000, // 设置30秒超时
      });
      console.log('Upload response:', response.data);
      setUploadProgress(0);
      setSelectedFile(null);
      fetchUploadRecords(); // 上传成功后重新获取文件列表
      setSuccessMessage('文件上传成功！');
    } catch (error: any) {
      console.error('Error uploading file:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        setErrorMessage(`上传文件时出错: ${error.response.data.error || '未知错误'}`);
      } else if (error.request) {
        console.error('No response received');
        setErrorMessage('服务器没有响应，请稍后重试。');
      } else {
        console.error('Error setting up request:', error.message);
        setErrorMessage('设置请求时出错。请重试。');
      }
      setUploadProgress(0);
    }
  };

  const handleExtractAudio = async (filename: string) => {
    try {
      setErrorMessage(null);
      setSuccessMessage(null);
      setExtractionProgress(prev => ({ ...prev, [filename]: 0 }));
      setProcessingFile(filename);
      console.log('Sending extract audio request for:', filename);
      
      setCurrentStep(2);
      
      const response = await axios.post('/api/files/extractAudio', { filename }, {
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setExtractionProgress(prev => ({ ...prev, [filename]: percentCompleted }));
          }
        },
      });

      console.log('Audio extraction completed:', response.data);
      setSuccessMessage('音频提取成功！');
      fetchUploadRecords();
      fetchAudioFiles(); // 确保这个函数被调用
    } catch (error: any) {
      console.error('Error extracting audio:', error);
      setErrorMessage('音频提取失败，请重试。');
    } finally {
      setExtractionProgress(prev => ({ ...prev, [filename]: 0 }));
      setProcessingFile(null);
    }
  };

  const handleDeleteFile = async (filename: string) => {
    try {
      setErrorMessage(null);
      setSuccessMessage(null);
      console.log('Sending delete request for:', filename);
      const response = await axios.delete(`/api/files/delete?filename=${encodeURIComponent(filename)}`);
      console.log('Delete response:', response.data);
      setSuccessMessage('文件删除成功！');
      fetchUploadRecords();
    } catch (error: any) {
      console.error('Error deleting file:', error);
      if (error.response) {
        setErrorMessage(`文件删除失败：${error.response.data.error}`);
      } else {
        setErrorMessage('文件除失败，请重试。');
      }
    }
  };

  const handleEditAudioName = (id: number, currentName: string) => {
    setEditingAudioId(id);
    setEditingAudioName(currentName);
  };

  const handleSaveAudioName = async (id: number) => {
    try {
      await axios.put(`/api/audio/rename/${id}`, { newName: editingAudioName });
      setEditingAudioId(null);
      fetchAudioFiles();
    } catch (error) {
      console.error('Error renaming audio file:', error);
      setErrorMessage('重命名音频文件失败，请重。');
    }
  };

  const handleDeleteAudio = async (audioId: string) => {
    try {
      const response = await axios.delete(`/api/audio/delete/${audioId}`);
      if (response.data.success) {
        setSuccessMessage('音频文件删除成功！');
        fetchAudioFiles(); // 重新获取音频文件列表
      } else {
        setErrorMessage('删除音频文件失败，请重试。');
      }
    } catch (error) {
      console.error('Error deleting audio file:', error);
      setErrorMessage('删除音频文件时出错，请重试。');
    }
  };

  const handleStepChange = (step: number) => {
    setCurrentStep(step);
  };

  const handlePlayAudio = (audioFileName: string) => {
    if (currentlyPlaying === audioFileName) {
      if (audioRef.current?.paused) {
        audioRef.current.play();
      } else {
        audioRef.current?.pause();
      }
    } else {
      setCurrentlyPlaying(audioFileName);
      if (audioRef.current) {
        audioRef.current.src = `/api/files/getAudio?filename=${encodeURIComponent(audioFileName)}`;
        audioRef.current.play();
      }
    }
  };

  const handleAudioClick = async (filename: string) => {
    try {
      if (currentlyPlaying === filename && audioRef.current) {
        if (audioRef.current.paused) {
          audioRef.current.play();
        } else {
          audioRef.current.pause();
        }
        return;
      }

      const response = await fetch(`/api/files/getAudioUrl?filename=${encodeURIComponent(filename)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Received audio URL:', data.url);
      if (!data.url) {
        throw new Error('No audio URL received');
      }
      setAudioSrc(data.url);
      setCurrentlyPlaying(filename);
      if (audioRef.current) {
        audioRef.current.src = data.url;
        audioRef.current.play().catch(e => {
          console.error('Error playing audio:', e);
          setErrorMessage('播放音频时出错，请重试。');
        });
      }
    } catch (error) {
      console.error('Error fetching or playing audio:', error);
      setErrorMessage(`获取或播放音频时出错：${error.message}`);
    }
  };

  const handleTranscribe = async (audioFileName: string) => {
    try {
      setErrorMessage(null);
      // 立即更新状态为 'transcribing'
      setAudioFiles(prevFiles => 
        prevFiles.map(file => 
          file.name === audioFileName 
            ? { ...file, transcriptionStatus: 'transcribing', transcriptionProgress: 0 } 
            : file
        )
      );

      const response = await axios.post('/api/transcribe', { filename: audioFileName });
      
      if (response.data.success) {
        setSuccessMessage('转录成功！');
        // 更新状态为 'transcribed'
        setAudioFiles(prevFiles => 
          prevFiles.map(file => 
            file.name === audioFileName 
              ? { ...file, transcriptionStatus: 'transcribed', transcriptionProgress: 100 } 
              : file
          )
        );
      } else {
        setErrorMessage('转录失败，请重试。');
        // 如果失败，将状态恢复为 'not_transcribed'
        setAudioFiles(prevFiles => 
          prevFiles.map(file => 
            file.name === audioFileName 
              ? { ...file, transcriptionStatus: 'not_transcribed', transcriptionProgress: 0 } 
              : file
          )
        );
      }
    } catch (error) {
      console.error('Error transcribing audio:', error);
      setErrorMessage('转录过程中出错，请重试。');
      // 如果出错，将状态恢复为 'not_transcribed'
      setAudioFiles(prevFiles => 
        prevFiles.map(file => 
          file.name === audioFileName 
            ? { ...file, transcriptionStatus: 'not_transcribed', transcriptionProgress: 0 } 
            : file
        )
      );
    }
  };

  function formatDuration(seconds: number | undefined): string {
    if (seconds === undefined) return 'N/A';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  return (
    <div className="container mx-auto" style={{ margin: '20px', paddingLeft: '0px', paddingRight: '0px' }}>
      <h1 className="text-lg font-bold mb-4 text-blue-600 border-b pb-2">文件管理</h1>
      
      {/* 切换按钮 */}
      <div className="flex mb-4">
        <button 
          className={`flex items-center mr-4 px-6 py-3 rounded-full transition-all duration-300 ${
            currentStep === 1 
              ? 'bg-blue-500 text-white shadow-lg transform hover:scale-105' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          onClick={() => handleStepChange(1)}
        >
          <FaCloudUploadAlt className="mr-2 text-2xl animate-bounce" />
          <span className="font-semibold">上传</span>
        </button>
        <button 
          className={`flex items-center px-6 py-3 rounded-full transition-all duration-300 ${
            currentStep === 2 
              ? 'bg-green-500 text-white shadow-lg transform hover:scale-105' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          onClick={() => handleStepChange(2)}
        >
          <FaChartLine className="mr-2 text-2xl animate-pulse" />
          <span className="font-semibold">数据处理</span>
        </button>
      </div>

      {currentStep === 1 ? (
        // 上传步骤
        <div className="mb-8">
          <h2 className="text-base font-semibold mb-2 text-blue-600">上传视频</h2>
          <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center">
            <input
              type="file"
              onChange={handleFileSelect}
              className="hidden"
              id="fileInput"
              accept="video/mp4"
            />
            <label htmlFor="fileInput" className="cursor-pointer">
              <svg className="mx-auto h-12 w-12 text-blue-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p className="mt-1 text-blue-600">击上传或拖拽视频到这里</p>
            </label>
            <p className="text-xs text-gray-500 mt-2">
              支持MP4格式，文件大小不过200MB
            </p>
            {selectedFile && (
              <div className="mt-4">
                <p className="text-blue-600">已选择文件: {selectedFile.name}</p>
                <button
                  onClick={handleUpload}
                  className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  确定
                </button>
              </div>
            )}
            {uploadProgress > 0 && (
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-blue-600 mt-1">{uploadProgress}% 已上传</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        // 数据处理步骤
        <div className="mb-8">
          <h2 className="text-base font-semibold mb-2 text-blue-600">数据处理</h2>
          <div className="border-2 border-blue-300 rounded-lg p-8">
            {processingFile ? (
              <div>
                <p className="text-blue-600">正在处理文件: {processingFile}</p>
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${extractionProgress[processingFile] || 0}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-blue-600 mt-1">
                    {extractionProgress[processingFile] || 0}% 已完成
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-blue-600">请选择一个视频文件进行处理</p>
            )}
          </div>
        </div>
      )}

      {/* 错误和成功消息 */}
      {errorMessage && (
        <p className="text-red-500 mt-2">{errorMessage}</p>
      )}
      {successMessage && (
        <p className="text-green-500 mt-2">{successMessage}</p>
      )}

      {/* 音频文件列表 */}
      <div className="mb-8">
        <h2 className="text-base font-semibold mb-2 text-left text-blue-600">音频文件</h2>
        <table className="w-full border-collapse border border-blue-300">
          <thead>
            <tr className="bg-blue-100">
              <th className="border border-blue-300 p-2 text-center">序号</th>
              <th className="border border-blue-300 p-2 text-center">播放</th>
              <th className="border border-blue-300 p-2 text-center">名称</th>
              <th className="border border-blue-300 p-2 text-center">大小</th>
              <th className="border border-blue-300 p-2 text-center">时长</th>
              <th className="border border-blue-300 p-2 text-center">生成时间</th>
              <th className="border border-blue-300 p-2 text-center">状态</th>
              <th className="border border-blue-300 p-2 text-center">操作</th>
            </tr>
          </thead>
          <tbody>
            {audioFiles.map((audio, index) => (
              <tr key={audio._id}>
                <td className="border border-blue-300 p-2 text-center">{index + 1}</td>
                <td className="border border-blue-300 p-2 text-center">
                  <button
                    onClick={() => handleAudioClick(audio.name)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    {currentlyPlaying === audio.name && audioRef.current && !audioRef.current.paused ? (
                      <FaPause className="inline-block" />
                    ) : (
                      <FaPlay className="inline-block" />
                    )}
                  </button>
                </td>
                <td className="border border-blue-300 p-2 text-left">{audio.name}</td>
                <td className="border border-blue-300 p-2 text-center">{(audio.size / 1024 / 1024).toFixed(2)} MB</td>
                <td className="border border-blue-300 p-2 text-center">{formatDuration(audio.duration)}</td>
                <td className="border border-blue-300 p-2 text-center">{new Date(audio.createdAt).toLocaleString()}</td>
                <td className="border border-blue-300 p-2 text-center">
                  {audio.transcriptionStatus === 'transcribing' ? (
                    <div>
                      转录中 - {audio.transcriptionProgress || 0}%
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full"
                          style={{ width: `${audio.transcriptionProgress || 0}%` }}
                        ></div>
                      </div>
                    </div>
                  ) : audio.transcriptionStatus === 'transcribed' ? (
                    '已转录'
                  ) : (
                    '未转录'
                  )}
                </td>
                <td className="border border-blue-300 p-2 text-center">
                  <button
                    onClick={() => handleTranscribe(audio.name)}
                    className={`bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 mr-2 ${
                      audio.transcriptionStatus === 'transcribing' ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    disabled={audio.transcriptionStatus === 'transcribing'}
                  >
                    {audio.transcriptionStatus === 'transcribed' ? '重新转录' : 
                     audio.transcriptionStatus === 'transcribing' ? '转录中' : '转录'}
                  </button>
                  <button
                    onClick={() => handleDeleteAudio(audio._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    删除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 音频播放器 */}
      <audio 
        ref={audioRef} 
        controls 
        className="w-full mt-4" 
        style={{display: audioSrc ? 'block' : 'none'}}
        onEnded={() => setCurrentlyPlaying(null)}
      />

      {/* 视频文件列表 */}
      <div>
        <h2 className="text-xl font-semibold mb-2 text-blue-600">视频文件</h2>
        <ul className="border border-blue-300 rounded-lg p-4">
          {files.map((file, index) => (
            <li key={index} className="mb-4 pb-4 border-b border-blue-200 last:border-b-0">
              <span className="font-semibold text-blue-600">{file.name}</span>
              <br />
              <span className="text-sm text-gray-500">
                大小: {(file.size / 1024 / 1024).toFixed(2)} MB
              </span>
              <br />
              <span className="text-sm text-gray-500">
                上传时间: {new Date(file.uploadedAt).toLocaleString()}
              </span>
              <br />
              {file.audioFile ? (
                <span className="text-sm text-green-500">音频已提取: {file.audioFile}</span>
              ) : (
                <>
                  <button
                    onClick={() => {
                      handleExtractAudio(file.name);
                      handleStepChange(2);  // 切换到数处理步骤
                    }}
                    className="mt-2 bg-blue-500 text-white px-2 py-1 rounded text-sm hover:bg-blue-600"
                    disabled={extractionProgress[file.name] > 0}
                  >
                    {extractionProgress[file.name] > 0 ? '提取...' : '提取音频'}
                  </button>
                  {extractionProgress[file.name] > 0 && (
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full"
                          style={{ width: `${extractionProgress[file.name]}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-blue-600 mt-1">{extractionProgress[file.name]}% 已完成</p>
                    </div>
                  )}
                </>
              )}
              <button
                onClick={() => handleDeleteFile(file.name)}
                className="mt-2 ml-2 bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
              >
                删除文件
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Home;

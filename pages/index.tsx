import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

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
}

export default function Home() {
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

  useEffect(() => {
    fetchUploadRecords();
    fetchAudioFiles();
  }, []);

  const fetchUploadRecords = async () => {
    try {
      const response = await axios.get('/api/files/list');
      console.log('Fetched records:', response.data); // 添加这行日志
      setFiles(response.data);
    } catch (error: any) {
      console.error('Error fetching upload records:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        setErrorMessage(`获取上传记录时出错: ${error.response.data.error || '未知错误'}`);
      } else if (error.request) {
        console.error('No response received');
        setErrorMessage('服务器没有响应，请稍后重试。');
      } else {
        console.error('Error setting up request:', error.message);
        setErrorMessage('设置请求时出错。请重试。');
      }
    }
  };

  const fetchAudioFiles = async () => {
    try {
      const response = await axios.get('/api/audio/list');
      setAudioFiles(response.data);
    } catch (error) {
      console.error('Error fetching audio files:', error);
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
      fetchUploadRecords();
      // 移除这行: setCurrentStep(2);
      setSuccessMessage('文件上传成功！');
    } catch (error: any) {
      console.error('Error uploading file:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        setErrorMessage(error.response.data.error || '上传文件时出错。请重试。');
      } else if (error.request) {
        console.error('No response received');
        setErrorMessage('服务器没有响应，���稍后重试。');
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
      
      const formData = new FormData();
      formData.append('filename', filename);

      const response = await axios.post('/api/files/extractAudio', formData, {
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setExtractionProgress(prev => ({ ...prev, [filename]: percentCompleted }));
          }
        },
        responseType: 'text',
        headers: {
          'Accept': 'text/event-stream',
        },
      });

      const lines = response.data.split('\n');
      for (const line of lines) {
        if (line.startsWith('data:')) {
          const data = JSON.parse(line.slice(5));
          if (data.progress) {
            setExtractionProgress(prev => ({ ...prev, [filename]: data.progress }));
          } else if (data.complete) {
            console.log('Audio extraction completed:', data.audioFile);
            setSuccessMessage('音频提取成功！');
            fetchUploadRecords();
            
            const newAudioFile: AudioInfo = {
              id: Date.now().toString(),
              name: data.audioFile,
              size: data.size,
              createdAt: new Date().toISOString(),
              status: 'completed',
              duration: data.duration
            };
            setAudioFiles(prev => [...prev, newAudioFile]);
          }
        }
      }
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
        setErrorMessage('文件删除失败，请重试。');
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
      setErrorMessage('重命名音频文件失败，请重试。');
    }
  };

  const handleDeleteAudio = async (id: number) => {
    try {
      await axios.delete(`/api/audio/delete/${id}`);
      fetchAudioFiles();
    } catch (error) {
      console.error('Error deleting audio file:', error);
      setErrorMessage('删除音频文件失败，请重试。');
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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">视频分析系统</h1>
      
      {/* 步骤指示器 */}
      <div className="flex mb-8">
        <div 
          className={`flex-1 text-center cursor-pointer ${currentStep === 1 ? 'text-blue-500 font-bold' : ''}`}
          onClick={() => handleStepChange(1)}
        >
          <span className={`inline-block w-8 h-8 rounded-full ${currentStep === 1 ? 'bg-blue-500 text-white' : 'bg-gray-300'} mr-2`}>1</span>
          上传
        </div>
        <div 
          className={`flex-1 text-center cursor-pointer ${currentStep === 2 ? 'text-blue-500 font-bold' : ''}`}
          onClick={() => handleStepChange(2)}
        >
          <span className={`inline-block w-8 h-8 rounded-full ${currentStep === 2 ? 'bg-blue-500 text-white' : 'bg-gray-300'} mr-2`}>2</span>
          数据处理
        </div>
      </div>

      {currentStep === 1 ? (
        // 上传步骤
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">上传视频</h2>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <input
              type="file"
              onChange={handleFileSelect}
              className="hidden"
              id="fileInput"
              accept="video/mp4"
            />
            <label htmlFor="fileInput" className="cursor-pointer">
              <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p className="mt-1">点击上传或拖拽视频到这里</p>
            </label>
            <p className="text-xs text-gray-500 mt-2">
              支持MP4格式，文件大小不超过200MB
            </p>
            {selectedFile && (
              <div className="mt-4">
                <p>已选择文件: {selectedFile.name}</p>
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
                <p className="text-sm text-gray-600 mt-1">{uploadProgress}% 已上传</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        // 数据处理步骤
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">数据处理</h2>
          <div className="border-2 border-gray-300 rounded-lg p-8">
            {processingFile ? (
              <div>
                <p>正在处理文件: {processingFile}</p>
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${extractionProgress[processingFile] || 0}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {extractionProgress[processingFile] || 0}% 已完成
                  </p>
                </div>
              </div>
            ) : (
              <p>请选择一个视频文件进行处理</p>
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
        <h2 className="text-xl font-semibold mb-2 text-center">音频文件</h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2 text-center">序号</th>
              <th className="border border-gray-300 p-2 text-center">名称</th>
              <th className="border border-gray-300 p-2 text-center">大小</th>
              <th className="border border-gray-300 p-2 text-center">时长</th>
              <th className="border border-gray-300 p-2 text-center">生成时间</th>
              <th className="border border-gray-300 p-2 text-center">状态</th>
              <th className="border border-gray-300 p-2 text-center">操作</th>
            </tr>
          </thead>
          <tbody>
            {audioFiles.map((audio, index) => (
              <tr key={audio.id}>
                <td className="border border-gray-300 p-2 text-center">{index + 1}</td>
                <td className="border border-gray-300 p-2 text-center">
                  <button
                    onClick={() => handlePlayAudio(audio.name)}
                    className="text-blue-500 hover:underline"
                  >
                    {audio.name}
                  </button>
                </td>
                <td className="border border-gray-300 p-2 text-center">{(audio.size / 1024 / 1024).toFixed(2)} MB</td>
                <td className="border border-gray-300 p-2 text-center">{audio.duration ? `${audio.duration.toFixed(2)}秒` : 'N/A'}</td>
                <td className="border border-gray-300 p-2 text-center">{new Date(audio.createdAt).toLocaleString()}</td>
                <td className="border border-gray-300 p-2 text-center">
                  {audio.status === 'completed' ? '已完成' : (
                    <div>
                      转换中 - {audio.progress}%
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full"
                          style={{ width: `${audio.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  <button
                    onClick={() => handleDeleteAudio(audio.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
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
      <audio ref={audioRef} className="hidden" controls />

      {/* 视频文件列表 */}
      <div>
        <h2 className="text-xl font-semibold mb-2">视频文件</h2>
        <ul className="border rounded-lg p-4">
          {files.map((file, index) => (
            <li key={index} className="mb-4 pb-4 border-b last:border-b-0">
              <span className="font-semibold">{file.name}</span>
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
                      handleStepChange(2);  // 切换到数据处理步骤
                    }}
                    className="mt-2 bg-blue-500 text-white px-2 py-1 rounded text-sm hover:bg-blue-600"
                    disabled={extractionProgress[file.name] > 0}
                  >
                    {extractionProgress[file.name] > 0 ? '提取中...' : '提取音频'}
                  </button>
                  {extractionProgress[file.name] > 0 && (
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full"
                          style={{ width: `${extractionProgress[file.name]}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{extractionProgress[file.name]}% 已完成</p>
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
}

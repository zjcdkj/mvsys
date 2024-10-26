import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaVideo, FaUpload, FaTrash, FaPlay, FaEdit } from 'react-icons/fa';

interface VideoFile {
  id: string;
  name: string;
  size: number;
  uploadDate: string;
}

const VideoFilesPage: React.FC = () => {
  const [videoFiles, setVideoFiles] = useState<VideoFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<VideoFile | null>(null);

  useEffect(() => {
    fetchVideoFiles();
  }, []);

  const fetchVideoFiles = async () => {
    try {
      const response = await axios.get('/api/videoFiles');
      setVideoFiles(response.data);
    } catch (error) {
      console.error('Error fetching video files:', error);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post('/api/uploadVideo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      fetchVideoFiles();
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (fileId: string) => {
    if (confirm('确定要删除这个视频吗？')) {
      try {
        await axios.delete(`/api/deleteVideo?id=${fileId}`);
        fetchVideoFiles();
        if (selectedFile?.id === fileId) {
          setSelectedFile(null);
        }
      } catch (error) {
        console.error('Error deleting video:', error);
      }
    }
  };

  const handleFileSelect = (file: VideoFile) => {
    setSelectedFile(file);
  };

  return (
    <div className="p-4" style={{ paddingLeft: '30px' }}>
      <h1 className="text-lg font-bold mb-6 text-blue-600 border-b pb-2">视频文件管理</h1>
      <div className="flex" style={{ gap: '10px', height: 'calc(100vh - 120px)' }}>
        {/* 左侧视频文件列表 */}
        <div className="w-[220px] flex flex-col">
          <h2 className="text-base font-semibold mb-2 text-blue-600">
            <FaVideo className="inline-block mr-2" />
            视频文件
          </h2>
          <div className="flex-grow overflow-y-auto border border-gray-200 rounded">
            {videoFiles.map((file) => (
              <div 
                key={file.id} 
                className={`flex items-center p-2 cursor-pointer hover:bg-blue-50 border-b border-gray-200 ${selectedFile?.id === file.id ? 'bg-blue-100' : ''}`}
                onClick={() => handleFileSelect(file)}
              >
                <FaVideo className="text-blue-500 mr-2" />
                <span className="flex-grow truncate">{file.name}</span>
                <div className="flex space-x-2">
                  <FaPlay className="text-green-500 hover:text-green-600" />
                  <FaEdit className="text-blue-500 hover:text-blue-600" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 右侧视频详情和操作 */}
        <div className="flex-1 flex flex-col">
          <h2 className="text-base font-semibold mb-2 text-blue-600">
            <FaEdit className="inline-block mr-2" />
            视频详情
          </h2>
          <div className="flex-grow border border-gray-300 rounded-lg p-4 mb-4 overflow-y-auto">
            {selectedFile ? (
              <>
                <h3 className="font-bold text-base mb-2">{selectedFile.name}</h3>
                <p className="text-sm text-gray-600">大小: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                <p className="text-sm text-gray-600">上传日期: {new Date(selectedFile.uploadDate).toLocaleString()}</p>
                <button
                  onClick={() => handleDelete(selectedFile.id)}
                  className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  <FaTrash className="inline-block mr-2" />
                  删除视频
                </button>
              </>
            ) : (
              <p className="text-gray-500">请选择一个视频文件查看详情</p>
            )}
          </div>
          <div className="mb-4">
            <label className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600 transition duration-300">
              <FaUpload className="inline-block mr-2" />
              上传视频
              <input
                type="file"
                className="hidden"
                accept="video/*"
                onChange={handleFileUpload}
                disabled={isUploading}
              />
            </label>
            {isUploading && <span className="ml-2">上传中...</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoFilesPage;

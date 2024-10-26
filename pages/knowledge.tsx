import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaFile, FaTrash, FaEdit, FaThLarge, FaList, FaChevronLeft, FaChevronRight, FaCut, FaCheck, FaSave, FaExpand, FaCompress, FaTimes, FaEye, FaDatabase, FaCog } from 'react-icons/fa';

interface KnowledgeFile {
  name: string;
  size: number;
  wordCount: number;
  createdAt: string;
  content: string;
  status: 'unprocessed' | 'processing' | 'processed';
  isVectorized: boolean;
}

interface SplitSettings {
  embeddingModel: string;
  chunkSize: number;
  overlap: number;
}

interface ChunkPreview {
  id: string;
  content: string;
}

const KnowledgePage: React.FC = () => {
  const [files, setFiles] = useState<KnowledgeFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<KnowledgeFile | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingFileName, setEditingFileName] = useState<string | null>(null);
  const [newFileName, setNewFileName] = useState('');
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
  const [currentPage, setCurrentPage] = useState(1);
  const [ITEMS_PER_PAGE] = useState(10);
  const [processingStatus, setProcessingStatus] = useState<{ [key: string]: 'unprocessed' | 'processing' | 'processed' }>({});
  const [showSplitSettings, setShowSplitSettings] = useState(false);
  const [splitSettings, setSplitSettings] = useState<SplitSettings>({
    embeddingModel: 'text-embedding-ada-002',
    chunkSize: 1000,
    overlap: 200,
  });
  const [selectedFileForSplit, setSelectedFileForSplit] = useState<KnowledgeFile | null>(null);
  const [chunks, setChunks] = useState<ChunkPreview[]>([]);
  const [showChunks, setShowChunks] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [editingChunkId, setEditingChunkId] = useState<string | null>(null);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const response = await axios.get('/api/getKnowledgeFiles');
      setFiles(response.data);
    } catch (error) {
      console.error('Error fetching knowledge files:', error);
    }
  };

  const handleFileSelect = async (file: KnowledgeFile) => {
    try {
      const response = await axios.get(`/api/getFileContent?fileName=${file.name}`);
      setSelectedFile({ ...file, content: response.data.content });
      setShowModal(true);
    } catch (error) {
      console.error('Error fetching file content:', error);
    }
  };

  const handleDelete = async (fileName: string) => {
    if (confirm('确定要删除这个文件吗？')) {
      try {
        await axios.delete(`/api/deleteKnowledgeFile?fileName=${fileName}`);
        fetchFiles();
        if (selectedFile?.name === fileName) {
          setSelectedFile(null);
          setShowModal(false);
        }
      } catch (error) {
        console.error('Error deleting file:', error);
      }
    }
  };

  const handleRename = async (oldName: string, newName: string) => {
    try {
      await axios.post('/api/renameKnowledgeFile', { oldName, newName });
      setEditingFileName(null);
      fetchFiles();
    } catch (error) {
      console.error('Error renaming file:', error);
    }
  };

  const handleSplitSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSplitSettings(prev => ({
      ...prev,
      [name]: name === 'embeddingModel' ? value : Number(value),
    }));
  };

  const handleOpenSplitSettings = (file: KnowledgeFile) => {
    setSelectedFileForSplit(file);
    setShowSplitSettings(true);
  };

  const handleSplitAndVectorize = async () => {
    if (selectedFileForSplit) {
      try {
        setProcessingStatus(prev => ({ ...prev, [selectedFileForSplit.name]: 'processing' }));
        const response = await axios.post('/api/splitAndVectorize', { 
          fileName: selectedFileForSplit.name,
          settings: splitSettings
        });
        if (response.data.success) {
          setProcessingStatus(prev => ({ ...prev, [selectedFileForSplit.name]: 'processed' }));
          setFiles(prevFiles => 
            prevFiles.map(file => 
              file.name === selectedFileForSplit.name ? { ...file, status: 'processed', isVectorized: true } : file
            )
          );
          alert(response.data.message);
        }
      } catch (error) {
        console.error('Error splitting and vectorizing file:', error);
        setProcessingStatus(prev => ({ ...prev, [selectedFileForSplit.name]: 'unprocessed' }));
        alert('处理文件时出错，请重试。');
      } finally {
        setShowSplitSettings(false);
        setSelectedFileForSplit(null);
      }
    }
  };

  const handleShowChunks = async (fileName: string) => {
    try {
      const chunksResponse = await axios.get(`/api/getChunks?fileName=${fileName}`);
      setChunks(chunksResponse.data);
      setShowChunks(true);
    } catch (error) {
      console.error('Error fetching chunks:', error);
    }
  };

  const handleChunkEdit = (chunkId: string, newContent: string) => {
    setChunks(chunks.map(chunk => 
      chunk.id === chunkId ? { ...chunk, content: newContent } : chunk
    ));
  };

  const handleSaveChunks = async () => {
    try {
      await axios.post('/api/saveChunks', { chunks });
      setShowChunks(false);
      alert('分块内容已保存');
    } catch (error) {
      console.error('Error saving chunks:', error);
      alert('保存分块内容时出错，请重试');
    }
  };

  const renderCardView = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {files.map((file) => (
        <div 
          key={file.name} 
          className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer hover:bg-blue-50 border border-gray-200 flex flex-col relative"
          style={{ width: '264px', height: '216px' }}
        >
          {file.isVectorized && (
            <div className="absolute top-2 right-2 text-green-500" title="已入库到向量数据库">
              <FaDatabase />
            </div>
          )}
          <div className="flex items-center mb-3">
            <FaFile className="text-blue-500 text-2xl mr-2" />
            {editingFileName === file.name ? (
              <form onSubmit={(e) => {
                e.preventDefault();
                handleRename(file.name, newFileName);
              }} className="flex-grow flex">
                <input
                  type="text"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  className="flex-grow border rounded px-2 py-1 text-sm"
                  autoFocus
                />
                <button type="submit" className="ml-2 text-green-500">
                  <FaSave />
                </button>
              </form>
            ) : (
              <h3 
                className="font-bold text-lg truncate flex-grow"
                onClick={() => {
                  setEditingFileName(file.name);
                  setNewFileName(file.name);
                }}
              >
                {file.name}
              </h3>
            )}
          </div>
          <p className="text-base text-gray-600 mb-2">大小: {file.size} 字节</p>
          <p className="text-base text-gray-600 mb-2">字数: {file.wordCount}</p>
          <p className="text-sm text-gray-500 mt-auto">
            创建时间: {new Date(file.createdAt).toLocaleString()}
          </p>
          <div className="mt-2 flex justify-between items-center">
            <button
              onClick={() => handleFileSelect(file)}
              className="text-blue-500 hover:text-blue-700 flex items-center"
            >
              <FaEye className="mr-1" />
              查看
            </button>
            {file.isVectorized ? (
              <button
                onClick={() => handleShowChunks(file.name)}
                className="text-green-500 flex items-center"
              >
                <FaEye className="mr-1" />
                预览分块
              </button>
            ) : (
              <button
                onClick={() => handleOpenSplitSettings(file)}
                className={`text-green-500 hover:text-green-700 flex items-center ${
                  processingStatus[file.name] === 'processing' ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={processingStatus[file.name] === 'processing'}
              >
                <FaCog className="mr-1" />
                分块设置
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  const renderListView = () => (
    <div className="bg-white rounded shadow">
      {files.map((file) => (
        <div key={file.name} className="flex items-center p-4 border-b hover:bg-gray-100">
          <FaFile className="text-blue-500 mr-4" />
          <div className="flex-grow">
            <h3 className="font-bold">{file.name}</h3>
            <p className="text-sm text-gray-600">大小: {file.size} 字节 | 字数: {file.wordCount}</p>
          </div>
          <p className="text-sm text-gray-600">{new Date(file.createdAt).toLocaleString()}</p>
          <button
            onClick={() => handleFileSelect(file)}
            className="ml-4 text-blue-500 hover:text-blue-700"
          >
            查看
          </button>
        </div>
      ))}
    </div>
  );

  return (
    <div className="p-4 flex flex-col" style={{ paddingLeft: '30px', height: 'calc(100vh - 64px)' }}>
      <h1 className="text-lg font-bold mb-6 text-blue-600 border-b pb-2">知识库</h1>
      <div className="mb-4 flex justify-between items-center">
        <div>
          <button
            className={`mr-2 p-2 rounded ${viewMode === 'card' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setViewMode('card')}
          >
            <FaThLarge />
          </button>
          <button
            className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setViewMode('list')}
          >
            <FaList />
          </button>
        </div>
      </div>
      <div className="flex-grow overflow-y-auto mb-4">
        {viewMode === 'card' ? renderCardView() : renderListView()}
      </div>
      <div className="flex justify-between items-center">
        <p>总计 {files.length} 个文件，当前显示 {(currentPage - 1) * ITEMS_PER_PAGE + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, files.length)}</p>
        <div className="flex space-x-2">
          <button
            className="px-3 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <FaChevronLeft />
          </button>
          <button
            className="px-3 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(files.length / ITEMS_PER_PAGE)))}
            disabled={currentPage === Math.ceil(files.length / ITEMS_PER_PAGE)}
          >
            <FaChevronRight />
          </button>
        </div>
      </div>

      {showModal && selectedFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className={`bg-white rounded-lg p-6 ${isMaximized ? 'w-full h-full' : 'w-full max-w-2xl max-h-[80vh]'} overflow-y-auto`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-base font-bold">{selectedFile.name}</h2>
              <div className="flex items-center">
                <button
                  className="text-gray-500 hover:text-gray-700 mr-2 p-1 rounded-full hover:bg-gray-200 transition-colors duration-200"
                  onClick={() => setIsMaximized(!isMaximized)}
                  style={{ width: '32px', height: '32px' }}
                >
                  {isMaximized ? <FaCompress size={20} /> : <FaExpand size={20} />}
                </button>
                <button
                  className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-200 transition-colors duration-200"
                  onClick={() => setShowModal(false)}
                  style={{ width: '32px', height: '32px' }}
                >
                  <FaTimes size={20} />
                </button>
              </div>
            </div>
            <p className="mb-2">大小: {selectedFile.size} 字节</p>
            <p className="mb-2">字数: {selectedFile.wordCount}</p>
            <p className="mb-4">创建时间: {new Date(selectedFile.createdAt).toLocaleString()}</p>
            <textarea
              className="w-full p-2 border rounded mb-4"
              style={{ height: isMaximized ? 'calc(100vh - 300px)' : '300px' }}
              value={selectedFile.content}
              readOnly
            ></textarea>
            <div className="flex justify-end">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                onClick={() => handleDelete(selectedFile.name)}
              >
                <FaTrash className="inline-block mr-2" />
                删除
              </button>
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={() => setShowModal(false)}
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {showSplitSettings && selectedFileForSplit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">分块设置 - {selectedFileForSplit.name}</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">嵌入模型</label>
              <select
                name="embeddingModel"
                value={splitSettings.embeddingModel}
                onChange={handleSplitSettingsChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="text-embedding-ada-002">text-embedding-ada-002</option>
                <option value="text-embedding-3-small">text-embedding-3-small</option>
                <option value="text-embedding-3-large">text-embedding-3-large</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">分块大小</label>
              <input
                type="number"
                name="chunkSize"
                value={splitSettings.chunkSize}
                onChange={handleSplitSettingsChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">重叠大小</label>
              <input
                type="number"
                name="overlap"
                value={splitSettings.overlap}
                onChange={handleSplitSettingsChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => {
                  setShowSplitSettings(false);
                  setSelectedFileForSplit(null);
                }}
                className="mr-2 bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
              >
                取消
              </button>
              <button
                onClick={handleSplitAndVectorize}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                确认分块
              </button>
            </div>
          </div>
        </div>
      )}

      {showChunks && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">分块预览</h2>
            {chunks.map((chunk, index) => (
              <div key={chunk.id} className="mb-4 p-2 border rounded">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold">Chunk {index + 1}</h3>
                  <button
                    onClick={() => setEditingChunkId(editingChunkId === chunk.id ? null : chunk.id)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <FaCut />
                  </button>
                </div>
                {editingChunkId === chunk.id ? (
                  <textarea
                    className="w-full p-2 border rounded"
                    value={chunk.content}
                    onChange={(e) => handleChunkEdit(chunk.id, e.target.value)}
                  />
                ) : (
                  <p>{chunk.content}</p>
                )}
              </div>
            ))}
            <div className="flex justify-end mt-4">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded mr-2 hover:bg-green-600"
                onClick={handleSaveChunks}
              >
                保存更改
              </button>
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                onClick={() => setShowChunks(false)}
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KnowledgePage;

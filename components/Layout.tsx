import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FaVideo, FaFileAlt, FaBook, FaRobot, FaPlayCircle } from 'react-icons/fa';

const navItems = [
  { name: '视频文件', path: '/', icon: FaVideo },
  { name: '文本处理', path: '/transcription', icon: FaFileAlt },
  { name: '知识库', path: '/knowledge', icon: FaBook },
  { name: 'Chatbot', path: '/chatbot', icon: FaRobot },
];

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <div className="flex h-screen bg-white">
      {/* 左侧导航栏 */}
      <nav className="w-[220px] bg-gradient-to-b from-blue-600 to-blue-800 shadow-lg">
        <div className="p-5 flex items-center">
          <FaPlayCircle className="text-3xl text-white mr-3 animate-pulse" />
          <h1 className="text-lg font-bold text-white" style={{ fontSize: '18px' }}>视频分析系统</h1>
        </div>
        <ul className="mt-6">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link href={item.path}
                className={`flex items-center py-3 px-5 text-base ${
                  router.pathname === item.path
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-300 hover:bg-blue-700'
                } ${
                  hoveredItem === item.name ? 'bg-blue-700' : ''
                } transition-all duration-300`}
                onMouseEnter={() => setHoveredItem(item.name)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <item.icon className="mr-3 text-lg" />
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* 主内容区 */}
      <main className="flex-1 overflow-y-auto bg-white">
        {children}
      </main>
    </div>
  );
};

export default Layout;

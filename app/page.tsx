'use client';

import { useState } from 'react';
import ImageCompress from '@/components/ImageCompress';
import RemoveBackground from '@/components/RemoveBackground';
import ImageRecognition from '@/components/ImageRecognition';
import AIGenerate from '@/components/AIGenerate';

type TabType = 'compress' | 'remove-bg' | 'recognize' | 'ai-generate';

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>('compress');

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <header className="text-center text-white mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 drop-shadow-lg">
            🖼️ 图片综合处理工具
          </h1>
          <p className="text-lg md:text-xl opacity-90">
            一站式图片处理解决方案
          </p>
        </header>

        {/* Tabs Navigation */}
        <nav className="flex flex-wrap justify-center gap-3 mb-6">
          <button
            onClick={() => setActiveTab('compress')}
            className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
              activeTab === 'compress'
                ? 'bg-white text-purple-700 shadow-lg scale-105'
                : 'bg-white/20 text-white border-2 border-white/30 hover:bg-white/30 backdrop-blur-sm'
            }`}
          >
            图片压缩
          </button>
          <button
            onClick={() => setActiveTab('remove-bg')}
            className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
              activeTab === 'remove-bg'
                ? 'bg-white text-purple-700 shadow-lg scale-105'
                : 'bg-white/20 text-white border-2 border-white/30 hover:bg-white/30 backdrop-blur-sm'
            }`}
          >
            抠图去背景
          </button>
          <button
            onClick={() => setActiveTab('recognize')}
            className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
              activeTab === 'recognize'
                ? 'bg-white text-purple-700 shadow-lg scale-105'
                : 'bg-white/20 text-white border-2 border-white/30 hover:bg-white/30 backdrop-blur-sm'
            }`}
          >
            图片识别
          </button>
          <button
            onClick={() => setActiveTab('ai-generate')}
            className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
              activeTab === 'ai-generate'
                ? 'bg-white text-purple-700 shadow-lg scale-105'
                : 'bg-white/20 text-white border-2 border-white/30 hover:bg-white/30 backdrop-blur-sm'
            }`}
          >
            AI 生图
          </button>
        </nav>

        {/* Tab Content */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
          {activeTab === 'compress' && <ImageCompress />}
          {activeTab === 'remove-bg' && <RemoveBackground />}
          {activeTab === 'recognize' && <ImageRecognition />}
          {activeTab === 'ai-generate' && <AIGenerate />}
        </div>

        {/* Footer */}
        <footer className="text-center text-white mt-8 opacity-90">
          <p>© 2025 图片综合处理工具 | 所有功能均在浏览器本地运行</p>
        </footer>
      </div>
    </div>
  );
}

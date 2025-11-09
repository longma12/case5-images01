'use client';

import { useState, ChangeEvent } from 'react';

type StyleType = 'realistic' | 'anime' | 'oil-painting' | 'watercolor' | '3d';
type SizeType = '512x512' | '768x768' | '1024x1024';

export default function AIGenerate() {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState<StyleType>('realistic');
  const [size, setSize] = useState<SizeType>('512x512');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      alert('请输入图片描述');
      return;
    }

    setIsGenerating(true);
    setGeneratedImage(null);

    // 模拟生成延迟
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const [width, height] = size.split('x').map(Number);
    const imageUrl = generateArtImage(prompt, style, width, height);
    setGeneratedImage(imageUrl);
    setIsGenerating(false);
  };

  const generateArtImage = (
    prompt: string,
    style: StyleType,
    width: number,
    height: number
  ): string => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    if (!ctx) return '';

    // 根据风格生成不同的图案
    switch (style) {
      case 'realistic':
        drawRealisticStyle(ctx, width, height);
        break;
      case 'anime':
        drawAnimeStyle(ctx, width, height);
        break;
      case 'oil-painting':
        drawOilPaintingStyle(ctx, width, height);
        break;
      case 'watercolor':
        drawWatercolorStyle(ctx, width, height);
        break;
      case '3d':
        draw3DStyle(ctx, width, height);
        break;
    }

    // 添加文字说明
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('AI 生成演示', width / 2, height - 40);
    ctx.font = '16px Arial';
    ctx.fillText(prompt.substring(0, 30), width / 2, height - 15);

    return canvas.toDataURL('image/png');
  };

  const drawRealisticStyle = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ) => {
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#1e3c72');
    gradient.addColorStop(1, '#2a5298');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < 20; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const radius = Math.random() * 100 + 50;
      const radialGradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      radialGradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
      radialGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = radialGradient;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const drawAnimeStyle = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ) => {
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#FFB6D9');
    gradient.addColorStop(0.5, '#D4A5FF');
    gradient.addColorStop(1, '#9BDBFF');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = 'white';
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = Math.random() * 3 + 1;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const drawOilPaintingStyle = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ) => {
    for (let i = 0; i < 500; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = Math.random() * 30 + 10;
      const hue = Math.random() * 360;
      ctx.fillStyle = `hsla(${hue}, 70%, 50%, 0.3)`;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const drawWatercolorStyle = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ) => {
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#E0F7FA');
    gradient.addColorStop(0.5, '#B2EBF2');
    gradient.addColorStop(1, '#80DEEA');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < 30; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const radius = Math.random() * 150 + 50;
      const hue = Math.random() * 60 + 180;
      const radialGradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      radialGradient.addColorStop(0, `hsla(${hue}, 60%, 70%, 0.3)`);
      radialGradient.addColorStop(1, `hsla(${hue}, 60%, 80%, 0)`);
      ctx.fillStyle = radialGradient;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const draw3DStyle = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ) => {
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#2C3E50');
    gradient.addColorStop(1, '#34495E');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < 15; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = Math.random() * 100 + 50;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(Math.random() * Math.PI * 2);

      const shapeGradient = ctx.createLinearGradient(
        -size / 2,
        -size / 2,
        size / 2,
        size / 2
      );
      shapeGradient.addColorStop(
        0,
        `hsla(${Math.random() * 360}, 70%, 60%, 0.4)`
      );
      shapeGradient.addColorStop(
        1,
        `hsla(${Math.random() * 360}, 70%, 40%, 0.2)`
      );
      ctx.fillStyle = shapeGradient;
      ctx.fillRect(-size / 2, -size / 2, size, size);
      ctx.restore();
    }
  };

  const downloadImage = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = 'ai-generated-image.png';
      link.click();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-purple-700 mb-2">AI 生图</h2>
        <p className="text-gray-600">根据描述生成精美图片</p>
      </div>

      {/* Form */}
      <div className="space-y-4">
        <div>
          <label className="block font-semibold text-purple-700 mb-2">
            描述你想生成的图片
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
            placeholder="例如：一只可爱的橘猫坐在窗台上，阳光洒在它身上，摄影风格"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none resize-none"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-purple-700 mb-2">
              图片风格
            </label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value as StyleType)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none"
            >
              <option value="realistic">写实风格</option>
              <option value="anime">动漫风格</option>
              <option value="oil-painting">油画风格</option>
              <option value="watercolor">水彩风格</option>
              <option value="3d">3D渲染</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-purple-700 mb-2">
              图片尺寸
            </label>
            <select
              value={size}
              onChange={(e) => setSize(e.target.value as SizeType)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none"
            >
              <option value="512x512">512×512</option>
              <option value="768x768">768×768</option>
              <option value="1024x1024">1024×1024</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isGenerating ? '生成中...' : '生成图片'}
        </button>
      </div>

      {/* Loading */}
      {isGenerating && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600 mb-4"></div>
          <p className="text-purple-700 font-semibold text-lg">
            AI 正在创作中，请稍候...
          </p>
        </div>
      )}

      {/* Result */}
      {generatedImage && !isGenerating && (
        <div className="border-2 border-gray-200 rounded-xl p-6 bg-gray-50">
          <h3 className="text-xl font-bold text-purple-700 mb-4">生成结果</h3>
          <img
            src={generatedImage}
            alt="Generated"
            className="w-full rounded-lg shadow-md mb-4"
          />
          <button
            onClick={downloadImage}
            className="w-full md:w-auto bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            下载图片
          </button>
        </div>
      )}
    </div>
  );
}

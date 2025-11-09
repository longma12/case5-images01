'use client';

import { useState, useRef, ChangeEvent } from 'react';

export default function RemoveBackground() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setOriginalImage(result);
        processImage(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = (imageSrc: string) => {
    setIsProcessing(true);
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // 简单的背景移除算法：移除与边缘颜色相近的像素
        const tolerance = 50;
        const bgColor = {
          r: data[0],
          g: data[1],
          b: data[2],
        };

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          const diff =
            Math.abs(r - bgColor.r) +
            Math.abs(g - bgColor.g) +
            Math.abs(b - bgColor.b);

          if (diff < tolerance) {
            data[i + 3] = 0; // 设置透明
          }
        }

        ctx.putImageData(imageData, 0, 0);
        setProcessedImage(canvas.toDataURL('image/png'));
        setIsProcessing(false);
      }
    };
    img.src = imageSrc;
  };

  const downloadImage = () => {
    if (processedImage) {
      const link = document.createElement('a');
      link.href = processedImage;
      link.download = 'no-background.png';
      link.click();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-purple-700 mb-2">抠图去背景</h2>
        <p className="text-gray-600">自动识别主体并移除背景</p>
      </div>

      {/* Upload Area */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-3 border-dashed border-purple-400 rounded-2xl p-12 text-center bg-purple-50 hover:bg-purple-100 transition-colors cursor-pointer"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
        <div className="text-6xl mb-4">📁</div>
        <p className="text-xl font-semibold text-purple-700 mb-2">
          点击或拖拽上传图片
        </p>
        <p className="text-gray-500">支持人像、产品、动物等</p>
      </div>

      {/* Loading */}
      {isProcessing && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600 mb-4"></div>
          <p className="text-purple-700 font-semibold text-lg">正在处理中...</p>
        </div>
      )}

      {/* Preview Area */}
      {originalImage && processedImage && !isProcessing && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="border-2 border-gray-200 rounded-xl p-6 bg-gray-50">
            <h3 className="text-xl font-bold text-purple-700 mb-4">原图</h3>
            <img
              src={originalImage}
              alt="Original"
              className="w-full rounded-lg shadow-md"
            />
          </div>
          <div className="border-2 border-gray-200 rounded-xl p-6 bg-gray-50">
            <h3 className="text-xl font-bold text-purple-700 mb-4">去背景后</h3>
            <div
              className="rounded-lg shadow-md p-4"
              style={{
                backgroundImage: `
                  linear-gradient(45deg, #ccc 25%, transparent 25%),
                  linear-gradient(-45deg, #ccc 25%, transparent 25%),
                  linear-gradient(45deg, transparent 75%, #ccc 75%),
                  linear-gradient(-45deg, transparent 75%, #ccc 75%)
                `,
                backgroundSize: '20px 20px',
                backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
              }}
            >
              <img
                src={processedImage}
                alt="Processed"
                className="w-full rounded-lg"
              />
            </div>
          </div>
        </div>
      )}

      {/* Hidden Canvas */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Download Button */}
      {processedImage && !isProcessing && (
        <button
          onClick={downloadImage}
          className="w-full md:w-auto mx-auto block bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          下载透明图片
        </button>
      )}
    </div>
  );
}

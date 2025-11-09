'use client';

import { useState, useRef, ChangeEvent } from 'react';

export default function ImageCompress() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [compressedImage, setCompressedImage] = useState<string | null>(null);
  const [quality, setQuality] = useState(80);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setOriginalSize(file.size);
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setOriginalImage(result);
        compressImage(result, quality);
      };
      reader.readAsDataURL(file);
    }
  };

  const compressImage = (imageSrc: string, quality: number) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              setCompressedSize(blob.size);
              setCompressedImage(URL.createObjectURL(blob));
            }
          },
          'image/jpeg',
          quality / 100
        );
      }
    };
    img.src = imageSrc;
  };

  const handleQualityChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newQuality = parseInt(e.target.value);
    setQuality(newQuality);
    if (originalImage) {
      compressImage(originalImage, newQuality);
    }
  };

  const downloadImage = () => {
    if (compressedImage) {
      const link = document.createElement('a');
      link.href = compressedImage;
      link.download = 'compressed-image.jpg';
      link.click();
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-purple-700 mb-2">图片压缩</h2>
        <p className="text-gray-600">减小图片文件大小，保持良好画质</p>
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
        <p className="text-gray-500">支持 JPG、PNG、WEBP 格式</p>
      </div>

      {/* Quality Slider */}
      {originalImage && (
        <div className="bg-purple-50 p-6 rounded-xl">
          <label className="block font-semibold text-purple-700 mb-3">
            压缩质量: <span className="text-2xl">{quality}%</span>
          </label>
          <input
            type="range"
            min="10"
            max="100"
            value={quality}
            onChange={handleQualityChange}
            className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-purple-600"
          />
        </div>
      )}

      {/* Preview Area */}
      {originalImage && compressedImage && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="border-2 border-gray-200 rounded-xl p-6 bg-gray-50">
            <h3 className="text-xl font-bold text-purple-700 mb-4">原图</h3>
            <img
              src={originalImage}
              alt="Original"
              className="w-full rounded-lg shadow-md mb-4"
            />
            <p className="text-gray-600">
              文件大小: <span className="font-semibold">{formatFileSize(originalSize)}</span>
            </p>
          </div>
          <div className="border-2 border-gray-200 rounded-xl p-6 bg-gray-50">
            <h3 className="text-xl font-bold text-purple-700 mb-4">压缩后</h3>
            <img
              src={compressedImage}
              alt="Compressed"
              className="w-full rounded-lg shadow-md mb-4"
            />
            <p className="text-gray-600">
              文件大小: <span className="font-semibold">{formatFileSize(compressedSize)}</span>
              <br />
              压缩比例: <span className="font-semibold text-green-600">
                {Math.round((1 - compressedSize / originalSize) * 100)}%
              </span>
            </p>
          </div>
        </div>
      )}

      {/* Download Button */}
      {compressedImage && (
        <button
          onClick={downloadImage}
          className="w-full md:w-auto mx-auto block bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          下载压缩图片
        </button>
      )}
    </div>
  );
}

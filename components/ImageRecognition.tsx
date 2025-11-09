'use client';

import { useState, useRef, ChangeEvent, useEffect } from 'react';

interface Prediction {
  class: string;
  score: number;
}

export default function ImageRecognition() {
  const [image, setImage] = useState<string | null>(null);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // 动态加载 TensorFlow.js 和 COCO-SSD
    const loadModel = async () => {
      if (typeof window !== 'undefined') {
        try {
          // 这里我们使用动态导入来加载模型
          // 实际使用时需要安装 @tensorflow/tfjs 和 @tensorflow-models/coco-ssd
          setModelLoaded(true);
        } catch (error) {
          console.error('模型加载失败:', error);
        }
      }
    };
    loadModel();
  }, []);

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setImage(result);
        recognizeImage();
      };
      reader.readAsDataURL(file);
    }
  };

  const recognizeImage = async () => {
    setIsLoading(true);
    setPredictions([]);

    // 模拟识别延迟
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // 模拟识别结果（实际应用中应该使用真实的 COCO-SSD 模型）
    const mockPredictions: Prediction[] = [
      { class: 'person', score: 0.95 },
      { class: 'chair', score: 0.82 },
      { class: 'laptop', score: 0.78 },
      { class: 'book', score: 0.65 },
    ];

    setPredictions(mockPredictions);
    setIsLoading(false);
  };

  const translateLabel = (label: string): string => {
    const translations: { [key: string]: string } = {
      person: '人',
      bicycle: '自行车',
      car: '汽车',
      motorcycle: '摩托车',
      airplane: '飞机',
      bus: '公交车',
      train: '火车',
      truck: '卡车',
      boat: '船',
      'traffic light': '红绿灯',
      cat: '猫',
      dog: '狗',
      horse: '马',
      sheep: '羊',
      cow: '牛',
      elephant: '大象',
      bear: '熊',
      zebra: '斑马',
      giraffe: '长颈鹿',
      backpack: '背包',
      umbrella: '雨伞',
      handbag: '手提包',
      tie: '领带',
      suitcase: '行李箱',
      bottle: '瓶子',
      'wine glass': '酒杯',
      cup: '杯子',
      fork: '叉子',
      knife: '刀',
      spoon: '勺子',
      bowl: '碗',
      banana: '香蕉',
      apple: '苹果',
      sandwich: '三明治',
      orange: '橙子',
      pizza: '披萨',
      donut: '甜甜圈',
      cake: '蛋糕',
      chair: '椅子',
      couch: '沙发',
      'potted plant': '盆栽',
      bed: '床',
      'dining table': '餐桌',
      toilet: '马桶',
      tv: '电视',
      laptop: '笔记本电脑',
      mouse: '鼠标',
      remote: '遥控器',
      keyboard: '键盘',
      'cell phone': '手机',
      microwave: '微波炉',
      oven: '烤箱',
      sink: '水槽',
      refrigerator: '冰箱',
      book: '书',
      clock: '时钟',
      vase: '花瓶',
      scissors: '剪刀',
      'teddy bear': '泰迪熊',
    };
    return translations[label] || label;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-purple-700 mb-2">图片识别</h2>
        <p className="text-gray-600">识别图片中的物体、场景和文字</p>
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
        <p className="text-gray-500">支持物体识别和文字识别</p>
      </div>

      {/* Preview Area */}
      {image && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="border-2 border-gray-200 rounded-xl p-6 bg-gray-50">
            <h3 className="text-xl font-bold text-purple-700 mb-4">原图</h3>
            <img
              ref={imageRef}
              src={image}
              alt="To recognize"
              className="w-full rounded-lg shadow-md"
            />
          </div>
          <div className="border-2 border-gray-200 rounded-xl p-6 bg-gray-50">
            <h3 className="text-xl font-bold text-purple-700 mb-4">识别结果</h3>
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-purple-600 mb-4"></div>
                <p className="text-purple-700 font-semibold">正在识别中...</p>
              </div>
            ) : predictions.length > 0 ? (
              <div className="space-y-3">
                {predictions.map((pred, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm"
                  >
                    <div className="flex-shrink-0 w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800 mb-2">
                        {translateLabel(pred.class)}
                      </div>
                      <div className="relative h-6 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-600 to-indigo-600 transition-all duration-500"
                          style={{ width: `${pred.score * 100}%` }}
                        />
                        <span className="absolute right-2 top-0 text-sm font-semibold text-white drop-shadow">
                          {Math.round(pred.score * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-12">
                等待识别结果...
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

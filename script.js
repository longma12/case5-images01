// 标签切换功能
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const tabName = btn.dataset.tab;

        // 更新按钮状态
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // 更新内容显示
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(tabName).classList.add('active');
    });
});

// ====== 1. 图片压缩功能 ======
const compressInput = document.getElementById('compress-input');
const qualitySlider = document.getElementById('quality-slider');
const qualityValue = document.getElementById('quality-value');
const compressPreview = document.getElementById('compress-preview');
const compressOriginal = document.getElementById('compress-original');
const compressResult = document.getElementById('compress-result');
const compressDownload = document.getElementById('compress-download');
const originalInfo = document.getElementById('original-info');
const compressedInfo = document.getElementById('compressed-info');

let originalFile = null;
let compressedBlob = null;

// 质量滑块
qualitySlider.addEventListener('input', (e) => {
    qualityValue.textContent = e.target.value;
    if (originalFile) {
        compressImage(originalFile, e.target.value / 100);
    }
});

// 文件上传
compressInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
        originalFile = file;
        handleCompressUpload(file);
    }
});

// 拖拽上传
setupDragDrop('compress-upload', compressInput);

function handleCompressUpload(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        compressOriginal.src = e.target.result;
        originalInfo.textContent = `文件大小: ${formatFileSize(file.size)}`;
        compressPreview.style.display = 'grid';
        compressImage(file, qualitySlider.value / 100);
    };
    reader.readAsDataURL(file);
}

function compressImage(file, quality) {
    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);

            canvas.toBlob((blob) => {
                compressedBlob = blob;
                compressResult.src = URL.createObjectURL(blob);
                compressedInfo.textContent = `文件大小: ${formatFileSize(blob.size)} (压缩 ${Math.round((1 - blob.size / file.size) * 100)}%)`;
                compressDownload.style.display = 'block';
            }, 'image/jpeg', quality);
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

compressDownload.addEventListener('click', () => {
    if (compressedBlob) {
        downloadBlob(compressedBlob, 'compressed-image.jpg');
    }
});

// ====== 2. 抠图去背景功能 ======
const removebgInput = document.getElementById('removebg-input');
const removebgOriginal = document.getElementById('removebg-original');
const removebgCanvas = document.getElementById('removebg-canvas');
const removebgPreview = document.getElementById('removebg-preview');
const removebgLoading = document.getElementById('removebg-loading');
const removebgDownload = document.getElementById('removebg-download');

let segmenter = null;

setupDragDrop('removebg-upload', removebgInput);

removebgInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
        handleRemoveBgUpload(file);
    }
});

async function handleRemoveBgUpload(file) {
    const reader = new FileReader();
    reader.onload = async (e) => {
        removebgOriginal.src = e.target.result;
        removebgPreview.style.display = 'grid';
        removebgLoading.style.display = 'flex';
        removebgDownload.style.display = 'none';

        const img = new Image();
        img.onload = async () => {
            await removeBackground(img);
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

async function removeBackground(img) {
    try {
        // 使用Canvas API实现简单的背景移除
        // 这里使用一个基于边缘检测的简化算法
        const canvas = removebgCanvas;
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');

        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // 简单的背景移除算法：移除与边缘颜色相近的像素
        const tolerance = 50;
        const bgColor = {
            r: data[0],
            g: data[1],
            b: data[2]
        };

        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            const diff = Math.abs(r - bgColor.r) + Math.abs(g - bgColor.g) + Math.abs(b - bgColor.b);

            if (diff < tolerance) {
                data[i + 3] = 0; // 设置透明
            }
        }

        ctx.putImageData(imageData, 0, 0);

        removebgLoading.style.display = 'none';
        removebgDownload.style.display = 'block';
    } catch (error) {
        console.error('背景移除失败:', error);
        alert('背景移除失败，请重试');
        removebgLoading.style.display = 'none';
    }
}

removebgDownload.addEventListener('click', () => {
    removebgCanvas.toBlob((blob) => {
        downloadBlob(blob, 'no-background.png');
    }, 'image/png');
});

// ====== 3. 图片识别功能 ======
const recognizeInput = document.getElementById('recognize-input');
const recognizeImage = document.getElementById('recognize-image');
const recognizePreview = document.getElementById('recognize-preview');
const recognizeResults = document.getElementById('recognize-results');
const recognizeLoading = document.getElementById('recognize-loading');

let cocoModel = null;

setupDragDrop('recognize-upload', recognizeInput);

recognizeInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
        handleRecognizeUpload(file);
    }
});

async function handleRecognizeUpload(file) {
    const reader = new FileReader();
    reader.onload = async (e) => {
        recognizeImage.src = e.target.result;
        recognizePreview.style.display = 'grid';
        recognizeLoading.style.display = 'flex';

        const img = new Image();
        img.onload = async () => {
            await recognizeImage2(img);
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

async function recognizeImage2(img) {
    try {
        // 加载 COCO-SSD 模型
        if (!cocoModel) {
            cocoModel = await cocoSsd.load();
        }

        const predictions = await cocoModel.detect(img);

        recognizeLoading.style.display = 'none';

        if (predictions.length === 0) {
            recognizeResults.innerHTML = '<p class="no-results">未识别到物体</p>';
            return;
        }

        let resultsHTML = '<div class="recognition-list">';
        predictions.forEach((prediction, index) => {
            const confidence = Math.round(prediction.score * 100);
            resultsHTML += `
                <div class="recognition-item">
                    <span class="item-number">${index + 1}</span>
                    <div class="item-content">
                        <div class="item-label">${translateLabel(prediction.class)}</div>
                        <div class="confidence-bar">
                            <div class="confidence-fill" style="width: ${confidence}%"></div>
                            <span class="confidence-text">${confidence}%</span>
                        </div>
                    </div>
                </div>
            `;
        });
        resultsHTML += '</div>';

        recognizeResults.innerHTML = resultsHTML;
    } catch (error) {
        console.error('识别失败:', error);
        recognizeLoading.style.display = 'none';
        recognizeResults.innerHTML = '<p class="error-message">识别失败，请重试</p>';
    }
}

// 翻译常见物体标签
function translateLabel(label) {
    const translations = {
        'person': '人',
        'bicycle': '自行车',
        'car': '汽车',
        'motorcycle': '摩托车',
        'airplane': '飞机',
        'bus': '公交车',
        'train': '火车',
        'truck': '卡车',
        'boat': '船',
        'traffic light': '红绿灯',
        'fire hydrant': '消防栓',
        'stop sign': '停止标志',
        'parking meter': '停车计时器',
        'bench': '长凳',
        'bird': '鸟',
        'cat': '猫',
        'dog': '狗',
        'horse': '马',
        'sheep': '羊',
        'cow': '牛',
        'elephant': '大象',
        'bear': '熊',
        'zebra': '斑马',
        'giraffe': '长颈鹿',
        'backpack': '背包',
        'umbrella': '雨伞',
        'handbag': '手提包',
        'tie': '领带',
        'suitcase': '行李箱',
        'frisbee': '飞盘',
        'skis': '滑雪板',
        'snowboard': '滑雪板',
        'sports ball': '球',
        'kite': '风筝',
        'baseball bat': '棒球棒',
        'baseball glove': '棒球手套',
        'skateboard': '滑板',
        'surfboard': '冲浪板',
        'tennis racket': '网球拍',
        'bottle': '瓶子',
        'wine glass': '酒杯',
        'cup': '杯子',
        'fork': '叉子',
        'knife': '刀',
        'spoon': '勺子',
        'bowl': '碗',
        'banana': '香蕉',
        'apple': '苹果',
        'sandwich': '三明治',
        'orange': '橙子',
        'broccoli': '西兰花',
        'carrot': '胡萝卜',
        'hot dog': '热狗',
        'pizza': '披萨',
        'donut': '甜甜圈',
        'cake': '蛋糕',
        'chair': '椅子',
        'couch': '沙发',
        'potted plant': '盆栽',
        'bed': '床',
        'dining table': '餐桌',
        'toilet': '马桶',
        'tv': '电视',
        'laptop': '笔记本电脑',
        'mouse': '鼠标',
        'remote': '遥控器',
        'keyboard': '键盘',
        'cell phone': '手机',
        'microwave': '微波炉',
        'oven': '烤箱',
        'toaster': '烤面包机',
        'sink': '水槽',
        'refrigerator': '冰箱',
        'book': '书',
        'clock': '时钟',
        'vase': '花瓶',
        'scissors': '剪刀',
        'teddy bear': '泰迪熊',
        'hair drier': '吹风机',
        'toothbrush': '牙刷'
    };
    return translations[label] || label;
}

// ====== 4. AI 生图功能 ======
const promptInput = document.getElementById('prompt-input');
const styleSelect = document.getElementById('style-select');
const sizeSelect = document.getElementById('size-select');
const generateBtn = document.getElementById('generate-btn');
const generateLoading = document.getElementById('generate-loading');
const generatePreview = document.getElementById('generate-preview');
const generatedImage = document.getElementById('generated-image');
const generateDownload = document.getElementById('generate-download');

generateBtn.addEventListener('click', async () => {
    const prompt = promptInput.value.trim();

    if (!prompt) {
        alert('请输入图片描述');
        return;
    }

    generateBtn.disabled = true;
    generateLoading.style.display = 'flex';
    generatePreview.style.display = 'none';

    try {
        // 这里演示使用程序生成的图案
        // 实际项目中可以接入 Stable Diffusion API 或其他 AI 生图服务
        const [width, height] = sizeSelect.value.split('x').map(Number);
        const style = styleSelect.value;

        const generatedImageUrl = await generateAIImage(prompt, style, width, height);

        generatedImage.src = generatedImageUrl;
        generateLoading.style.display = 'none';
        generatePreview.style.display = 'block';
    } catch (error) {
        console.error('生成失败:', error);
        alert('生成失败，请重试');
        generateLoading.style.display = 'none';
    } finally {
        generateBtn.disabled = false;
    }
});

async function generateAIImage(prompt, style, width, height) {
    // 模拟 AI 生成延迟
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 使用 Canvas 生成艺术图案作为演示
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    // 根据风格生成不同的图案
    switch (style) {
        case 'realistic':
            drawRealisticStyle(ctx, width, height, prompt);
            break;
        case 'anime':
            drawAnimeStyle(ctx, width, height, prompt);
            break;
        case 'oil-painting':
            drawOilPaintingStyle(ctx, width, height, prompt);
            break;
        case 'watercolor':
            drawWatercolorStyle(ctx, width, height, prompt);
            break;
        case '3d':
            draw3DStyle(ctx, width, height, prompt);
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
}

function drawRealisticStyle(ctx, width, height, prompt) {
    // 渐变背景
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#1e3c72');
    gradient.addColorStop(1, '#2a5298');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // 添加光影效果
    for (let i = 0; i < 20; i++) {
        ctx.beginPath();
        const x = Math.random() * width;
        const y = Math.random() * height;
        const radius = Math.random() * 100 + 50;
        const radialGradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        radialGradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
        radialGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = radialGradient;
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

function drawAnimeStyle(ctx, width, height, prompt) {
    // 明亮的动漫风格背景
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#FFB6D9');
    gradient.addColorStop(0.5, '#D4A5FF');
    gradient.addColorStop(1, '#9BDBFF');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // 添加星星效果
    ctx.fillStyle = 'white';
    for (let i = 0; i < 50; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const size = Math.random() * 3 + 1;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function drawOilPaintingStyle(ctx, width, height, prompt) {
    // 油画风格纹理
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
}

function drawWatercolorStyle(ctx, width, height, prompt) {
    // 水彩风格
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#E0F7FA');
    gradient.addColorStop(0.5, '#B2EBF2');
    gradient.addColorStop(1, '#80DEEA');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // 水彩渗透效果
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
}

function draw3DStyle(ctx, width, height, prompt) {
    // 3D 渲染风格
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#2C3E50');
    gradient.addColorStop(1, '#34495E');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // 添加几何形状
    const shapes = 15;
    for (let i = 0; i < shapes; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const size = Math.random() * 100 + 50;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(Math.random() * Math.PI * 2);

        const shapeGradient = ctx.createLinearGradient(-size/2, -size/2, size/2, size/2);
        shapeGradient.addColorStop(0, `hsla(${Math.random() * 360}, 70%, 60%, 0.4)`);
        shapeGradient.addColorStop(1, `hsla(${Math.random() * 360}, 70%, 40%, 0.2)`);
        ctx.fillStyle = shapeGradient;

        ctx.fillRect(-size/2, -size/2, size, size);
        ctx.restore();
    }
}

generateDownload.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'ai-generated-image.png';
    link.href = generatedImage.src;
    link.click();
});

// ====== 工具函数 ======
function setupDragDrop(areaId, inputElement) {
    const area = document.getElementById(areaId);

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        area.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        area.addEventListener(eventName, () => {
            area.classList.add('drag-over');
        });
    });

    ['dragleave', 'drop'].forEach(eventName => {
        area.addEventListener(eventName, () => {
            area.classList.remove('drag-over');
        });
    });

    area.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;
        inputElement.files = files;
        inputElement.dispatchEvent(new Event('change'));
    });
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

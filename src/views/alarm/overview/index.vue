<template>
    <div class="bg-gray-50 min-h-screen font-sans">
        <div class="container mx-auto px-4 py-8 max-w-7xl">
            <!-- 标题区域 -->
            <header class="mb-8 text-center">
                <h1 class="text-[clamp(1.8rem,4vw,2.5rem)] font-bold text-primary mb-3">紧急事件监控中心</h1>
                <p class="text-gray-600 text-lg">事件类型与分布实时监控 - 最小重叠优化</p>
            </header>

            <!-- 控制面板 -->
            <div class="bg-white rounded-xl shadow-md p-4 mb-8 flex flex-wrap items-center justify-between gap-4">
                <div class="flex items-center space-x-4">
                    <button id="refresh-btn" class="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg flex items-center transition-all duration-300" @click="fetchEventData(true)">
                        <i class="fa fa-refresh mr-2"></i>刷新数据
                    </button>
                    <div class="relative">
                        <select id="time-filter" class="appearance-none bg-gray-100 border border-gray-200 text-primary rounded-lg py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-primary/50" @change="fetchEventData">
                            <option value="all">所有事件</option>
                            <option value="24h" selected>过去24小时</option>
                            <option value="7d">过去7天</option>
                            <option value="30d">过去30天</option>
                        </select>
                        <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <i class="fa fa-chevron-down text-xs"></i>
                        </div>
                    </div>
                    <button id="rearrange-btn" class="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg flex items-center transition-all duration-300" @click="rearrangeBubbles">
                        <i class="fa fa-random mr-2"></i>重新排列
                    </button>
                </div>

                <div class="flex flex-wrap items-center gap-4">
                    <div class="flex items-center">
                        <span class="inline-block w-4 h-4 rounded-full bg-theft mr-2"></span>
                        <span class="text-sm">防盗报警</span>
                    </div>
                    <div class="flex items-center">
                        <span class="inline-block w-4 h-4 rounded-full bg-fire mr-2"></span>
                        <span class="text-sm">消防报警</span>
                    </div>
                    <div class="flex items-center">
                        <span class="inline-block w-4 h-4 rounded-full bg-flood mr-2"></span>
                        <span class="text-sm">山洪预警</span>
                    </div>
                    <div class="flex items-center">
                        <span class="inline-block w-4 h-4 rounded-full bg-landslide mr-2"></span>
                        <span class="text-sm">滑坡预警</span>
                    </div>
                </div>
            </div>

            <!-- 主要内容区域 -->
            <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <!-- 左侧统计面板 -->
                <div class="bg-white rounded-xl shadow-md p-5">
                    <h2 class="text-lg font-semibold mb-5 flex items-center">
                        <i class="fa fa-bar-chart text-primary mr-2"></i>事件统计
                    </h2>

                    <div class="space-y-5">
                        <div class="p-4 bg-orange-50 rounded-lg">
                            <div class="flex justify-between items-start">
                                <div>
                                    <p class="text-sm text-gray-500">防盗报警</p>
                                    <p class="text-2xl font-bold text-theft mt-1" id="theft-count">{{ theftCount }}</p>
                                </div>
                                <i class="fa fa-shield text-theft text-2xl"></i>
                            </div>
                            <div class="mt-3 flex items-center">
                <span class="text-xs font-medium bg-orange-100 text-theft px-2 py-1 rounded-full">
                  特大: <span id="theft-critical">{{ theftCritical }}</span>
                </span>
                            </div>
                        </div>

                        <div class="p-4 bg-red-50 rounded-lg">
                            <div class="flex justify-between items-start">
                                <div>
                                    <p class="text-sm text-gray-500">消防报警</p>
                                    <p class="text-2xl font-bold text-fire mt-1" id="fire-count">{{ fireCount }}</p>
                                </div>
                                <i class="fa fa-fire text-fire text-2xl"></i>
                            </div>
                            <div class="mt-3 flex items-center">
                <span class="text-xs font-medium bg-red-100 text-fire px-2 py-1 rounded-full">
                  特大: <span id="fire-critical">{{ fireCritical }}</span>
                </span>
                            </div>
                        </div>

                        <div class="p-4 bg-blue-50 rounded-lg">
                            <div class="flex justify-between items-start">
                                <div>
                                    <p class="text-sm text-gray-500">山洪预警</p>
                                    <p class="text-2xl font-bold text-flood mt-1" id="flood-count">{{ floodCount }}</p>
                                </div>
                                <i class="fa fa-tint text-flood text-2xl"></i>
                            </div>
                            <div class="mt-3 flex items-center">
                <span class="text-xs font-medium bg-blue-100 text-flood px-2 py-1 rounded-full">
                  特大: <span id="flood-critical">{{ floodCritical }}</span>
                </span>
                            </div>
                        </div>

                        <div class="p-4 bg-yellow-50 rounded-lg">
                            <div class="flex justify-between items-start">
                                <div>
                                    <p class="text-sm text-gray-500">滑坡预警</p>
                                    <p class="text-2xl font-bold text-landslide mt-1" id="landslide-count">{{ landslideCount }}</p>
                                </div>
                                <i class="fa fa-mountain text-landslide text-2xl"></i>
                            </div>
                            <div class="mt-3 flex items-center">
                <span class="text-xs font-medium bg-yellow-100 text-landslide px-2 py-1 rounded-full">
                  特大: <span id="landslide-critical">{{ landslideCritical }}</span>
                </span>
                            </div>
                        </div>
                    </div>

                    <div class="mt-6 pt-6 border-t border-gray-100">
                        <div class="flex justify-between items-center mb-3">
                            <h3 class="text-sm font-medium text-gray-500">总事件数</h3>
                            <span class="text-lg font-bold text-primary" id="total-events">{{ totalEvents }}</span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-2.5">
                            <div id="event-progress" class="bg-primary h-2.5 rounded-full" :style="{ width: eventProgress + '%' }"></div>
                        </div>
                        <p class="text-xs text-gray-500 mt-2 text-right">较昨日 <span id="change-rate" :class="changeRateClass">{{ changeRate }}%</span></p>
                    </div>
                </div>

                <!-- 右侧气泡图区域 -->
                <div class="lg:col-span-3">
                    <div class="bg-white rounded-xl shadow-md p-5 h-full">
                        <div class="flex justify-between items-center mb-4">
                            <h2 class="text-lg font-semibold flex items-center">
                                <i class="fa fa-circle-o text-primary mr-2"></i>动态告警气泡图
                            </h2>
                            <div class="text-sm text-gray-500" id="last-update">最后更新: {{ lastUpdate }}</div>
                        </div>

                        <div class="relative bg-gray-50 rounded-lg h-[550px] overflow-hidden border border-gray-200" id="bubble-container">
                            <!-- 气泡将通过JavaScript动态生成 -->
                            <div class="absolute inset-0 flex items-center justify-center text-gray-400" :class="{ hidden: !isLoading }" id="loading-indicator">
                                <i class="fa fa-spinner fa-spin text-2xl"></i>
                                <span class="ml-2">加载事件数据中...</span>
                            </div>

                            <!-- 简易地图背景 -->
                            <div class="absolute inset-0 opacity-10">
                                <svg width="100%" height="100%" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid meet">
                                    <!-- 简化的地图轮廓 -->
                                    <path d="M100,100 Q300,50 500,100 T900,100 L900,500 Q700,550 500,500 T100,500 Z" fill="#333" stroke="#666" stroke-width="2" />
                                    <!-- 主要道路 -->
                                    <line x1="100" y1="300" x2="900" y2="300" stroke="#666" stroke-width="2" stroke-dasharray="5,5" />
                                    <line x1="500" y1="100" x2="500" y2="500" stroke="#666" stroke-width="2" stroke-dasharray="5,5" />
                                    <!-- 城市标记 -->
                                    <circle cx="200" cy="200" r="5" fill="#666" />
                                    <circle cx="400" cy="400" r="5" fill="#666" />
                                    <circle cx="600" cy="200" r="5" fill="#666" />
                                    <circle cx="800" cy="400" r="5" fill="#666" />
                                    <circle cx="500" cy="300" r="8" fill="#666" />
                                </svg>
                            </div>
                        </div>

                        <div class="mt-4 text-sm text-gray-500 flex flex-wrap gap-2">
                            <p><i class="fa fa-info-circle mr-1"></i> 气泡大小表示事件紧急程度：特大 > 重大 > 一般</p>
                            <p><i class="fa fa-mouse-pointer mr-1"></i> 点击气泡可查看事件详情</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 事件详情模态框 -->
            <div id="event-modal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" :class="{ hidden: isModalHidden }">
                <div class="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 transform transition-all duration-300" :class="{ 'scale-95 opacity-0': isModalHidden, 'scale-100 opacity-100': !isModalHidden }" id="modal-content">
                    <div class="p-5 border-b border-gray-100">
                        <div class="flex justify-between items-center">
                            <h3 class="text-lg font-semibold" id="modal-title">{{ modalTitle }}</h3>
                            <button id="close-modal" class="text-gray-400 hover:text-gray-600 transition-colors" @click="closeModal">
                                <i class="fa fa-times"></i>
                            </button>
                        </div>
                    </div>

                    <div class="p-5 space-y-4" id="modal-body">
                        <!-- 详情内容将通过JavaScript动态生成 -->
                        <div class="flex flex-wrap gap-4">
                            <div class="flex-1 min-w-[120px]">
                                <p class="text-sm text-gray-500">事件类型</p>
                                <p class="font-medium flex items-center">
                                    <i :class="['fa', currentEvent?.icon, 'text-' + currentEvent?.type, 'mr-2']"></i>
                                    {{ currentEvent?.typeName }}
                                </p>
                            </div>
                            <div class="flex-1 min-w-[120px]">
                                <p class="text-sm text-gray-500">紧急程度</p>
                                <p :class="{ 'text-red-500': currentEvent?.urgency === 3, 'text-orange-500': currentEvent?.urgency === 2, 'text-yellow-500': currentEvent?.urgency === 1 }">
                                    {{ currentEvent?.urgencyText }}
                                </p>
                            </div>
                        </div>

                        <div>
                            <p class="text-sm text-gray-500">发生时间</p>
                            <p class="font-medium">{{ currentEvent?.time?.toLocaleString() }}</p>
                        </div>

                        <div>
                            <p class="text-sm text-gray-500">位置区域</p>
                            <p class="font-medium">{{ currentEvent?.location }}</p>
                        </div>

                        <div>
                            <p class="text-sm text-gray-500">详细地址</p>
                            <p class="font-medium">{{ currentEvent?.address }}</p>
                        </div>

                        <div>
                            <p class="text-sm text-gray-500">事件描述</p>
                            <p class="bg-gray-50 p-3 rounded-lg text-sm">{{ currentEvent?.description }}</p>
                        </div>

                        <div>
                            <p class="text-sm text-gray-500">处理状态</p>
                            <p :class="{ 'text-yellow-500': currentEvent?.status === 'pending', 'text-blue-500': currentEvent?.status === 'handling', 'text-green-500': currentEvent?.status === 'resolved' }">
                                {{ currentEvent?.status === 'pending' ? '待处理' : currentEvent?.status === 'handling' ? '处理中' : '已解决' }}
                            </p>
                        </div>
                    </div>

                    <div class="p-4 bg-gray-50 rounded-b-xl flex justify-end gap-3">
                        <button id="close-btn" class="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition-all" @click="closeModal">
                            关闭
                        </button>
                        <button id="handle-event" :class="{ 'opacity-70 cursor-not-allowed': currentEvent?.status === 'resolved' }" :disabled="currentEvent?.status === 'resolved'" @click="handleCurrentEvent" class="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg transition-all">
                            {{ handleEventText }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { ref, onMounted, onUnmounted } from 'vue';

    // Tailwind 配置
    const tailwindConfig = {
        theme: {
            extend: {
                colors: {
                    theft: '#FF7D00',     // 防盗报警 - 橙色
                    fire: '#F53F3F',      // 消防报警 - 红色
                    flood: '#165DFF',     // 山洪预警 - 蓝色
                    landslide: '#804000', // 滑坡预警 - 棕色
                    primary: '#1D2129',
                },
                fontFamily: {
                    sans: ['Inter', 'system-ui', 'sans-serif'],
                },
            }
        }
    };

    // 样式
    const styles = `
@layer utilities {
  .content-auto {
    content-visibility: auto;
  }
  .pulse-animation {
    animation: pulse 2s infinite;
  }
  .float-animation {
    animation: float 4s ease-in-out infinite;
  }
  .event-shadow {
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(245, 63, 63, 0.4);
  }
  70% {
    transform: scale(1.05);
    box-shadow: 0 0 0 10px rgba(245, 63, 63, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(245, 63, 63, 0);
  }
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
  100% { transform: translateY(0px); }
}
`;

    // 注入 Tailwind 和样式
    const injectDependencies = () => {
        if (!document.querySelector('script[src="https://cdn.tailwindcss.com"]')) {
            const tailwindScript = document.createElement('script');
            tailwindScript.src = 'https://cdn.tailwindcss.com';
            tailwindScript.onload = () => {
                const tailwindConfigScript = document.createElement('script');
                tailwindConfigScript.innerHTML = `tailwind.config = ${JSON.stringify(tailwindConfig)}`;
                document.head.appendChild(tailwindConfigScript);

                const styleElement = document.createElement('style');
                styleElement.type = 'text/tailwindcss';
                styleElement.innerHTML = styles;
                document.head.appendChild(styleElement);
            };
            document.head.appendChild(tailwindScript);
        } else {
            const tailwindConfigScript = document.createElement('script');
            tailwindConfigScript.innerHTML = `tailwind.config = ${JSON.stringify(tailwindConfig)}`;
            document.head.appendChild(tailwindConfigScript);

            const styleElement = document.createElement('style');
            styleElement.type = 'text/tailwindcss';
            styleElement.innerHTML = styles;
            document.head.appendChild(styleElement);
        }

        if (!document.querySelector('link[href="https://cdn.jsdelivr.net/npm/font-awesome@4.7.0/css/font-awesome.min.css"]')) {
            const fontAwesomeLink = document.createElement('link');
            fontAwesomeLink.href = 'https://cdn.jsdelivr.net/npm/font-awesome@4.7.0/css/font-awesome.min.css';
            fontAwesomeLink.rel = 'stylesheet';
            document.head.appendChild(fontAwesomeLink);
        }
    };

    export default {
        name: 'BubbleWarningWindow',
        setup() {
            const eventData = ref([]);
            const currentEventId = ref(null);
            const bubbleElements = ref([]);
            const containerBounds = ref({});
            const isLoading = ref(true);
            const isModalHidden = ref(true);
            const modalTitle = ref('事件详情');
            const currentEvent = ref(null);
            const handleEventText = ref('开始处理');

            // 统计数据
            const theftCount = ref(0);
            const fireCount = ref(0);
            const floodCount = ref(0);
            const landslideCount = ref(0);
            const theftCritical = ref(0);
            const fireCritical = ref(0);
            const floodCritical = ref(0);
            const landslideCritical = ref(0);
            const totalEvents = ref(0);
            const eventProgress = ref(0);
            const changeRate = ref(0);
            const changeRateClass = ref('text-green-500');
            const lastUpdate = ref('加载中...');

            // 更新容器边界信息
            const updateContainerBounds = () => {
                const container = document.getElementById('bubble-container');
                if (container) {
                    const rect = container.getBoundingClientRect();
                    containerBounds.value = {
                        width: rect.width,
                        height: rect.height,
                        left: 0,
                        top: 0,
                        right: rect.width,
                        bottom: rect.height
                    };
                }
            };

            // 设置事件监听器
            const setupEventListeners = () => {
                // 监听窗口大小变化，更新容器边界
                window.addEventListener('resize', () => {
                    updateContainerBounds();
                    if (bubbleElements.value.length > 0) {
                        rearrangeBubbles();
                    }
                });
            };

            // 获取事件数据
            const fetchEventData = (showLoading = false) => {
                // 显示加载状态
                if (showLoading) {
                    isLoading.value = true;
                }

                // 模拟API请求延迟
                setTimeout(() => {
                    // 根据时间筛选器生成不同的数据
                    const timeFilter = document.getElementById('time-filter').value;
                    eventData.value = generateMockEvents(timeFilter);

                    // 更新UI
                    updateBubbleChart();

                    // 更新统计数据
                    updateStatistics();

                    // 更新最后更新时间
                    const now = new Date();
                    lastUpdate.value = `最后更新: ${now.toLocaleString()}`;

                    // 隐藏加载状态
                    isLoading.value = false;
                }, 800);
            };

            // 生成模拟事件数据 - 限制数量以减少重叠
            const generateMockEvents = (timeFilter) => {
                // 事件类型配置
                const eventTypes = [
                    { type: 'theft', name: '防盗报警', icon: 'fa-shield' },
                    { type: 'fire', name: '消防报警', icon: 'fa-fire' },
                    { type: 'flood', name: '山洪预警', icon: 'fa-tint' },
                    { type: 'landslide', name: '滑坡预警', icon: 'fa-mountain' }
                ];

                // 位置数据 - 模拟不同区域
                const locations = [
                    '城东区域', '城西区域', '城南区域', '城北区域',
                    '市中心', '工业区', '居民区', '山区地带',
                    '河流沿岸', '低洼地区', '高层建筑区', '商业区'
                ];

                // 进一步限制事件总数，确保有足够空间展示
                let maxTotalEvents = 15;
                switch(timeFilter) {
                    case 'all': maxTotalEvents = 20; break;
                    case '30d': maxTotalEvents = 16; break;
                    case '7d': maxTotalEvents = 12; break;
                    case '24h': maxTotalEvents = 8; break;
                }

                const events = [];
                let totalEvents = 0;

                // 为每种事件类型生成数据，但不超过最大总数
                eventTypes.forEach(typeInfo => {
                    if (totalEvents >= maxTotalEvents) return;

                    // 每种类型的事件数量，确保不超过剩余配额
                    const remainingSlots = maxTotalEvents - totalEvents;
                    const maxForType = Math.floor(remainingSlots * 0.4); // 每种类型最多占40%
                    const typeCount = Math.max(1, Math.floor(Math.random() * maxForType) + 1);

                    for (let i = 0; i < typeCount && totalEvents < maxTotalEvents; i++) {
                        // 随机紧急程度 (1-3，3为最紧急)
                        const urgency = Math.floor(Math.random() * 3) + 1;

                        // 随机日期，根据时间范围调整
                        const now = new Date();
                        let hoursAgo;

                        switch(timeFilter) {
                            case 'all': hoursAgo = Math.floor(Math.random() * 30 * 24); break;
                            case '30d': hoursAgo = Math.floor(Math.random() * 30 * 24); break;
                            case '7d': hoursAgo = Math.floor(Math.random() * 7 * 24); break;
                            case '24h': hoursAgo = Math.floor(Math.random() * 24); break;
                        }

                        const eventTime = new Date(now);
                        eventTime.setHours(now.getHours() - hoursAgo);

                        // 根据紧急程度生成描述
                        let description, address;
                        const urgencyText = urgency === 3 ? '特大' : urgency === 2 ? '重大' : '一般';

                        switch(typeInfo.type) {
                            case 'theft':
                                description = `${urgencyText}盗窃事件，疑似有人员非法闯入`;
                                address = `${locations[Math.floor(Math.random() * locations.length)]}某建筑`;
                                break;
                            case 'fire':
                                description = `${urgencyText}火灾事件，${urgency === 3 ? '火势蔓延较快' : '火势可控'}`;
                                address = `${locations[Math.floor(Math.random() * locations.length)]}某建筑物`;
                                break;
                            case 'flood':
                                description = `${urgencyText}山洪预警，${urgency === 3 ? '需紧急疏散' : '请注意防范'}`;
                                address = `${locations[Math.floor(Math.random() * locations.length)]}沿河区域`;
                                break;
                            case 'landslide':
                                description = `${urgencyText}滑坡预警，${urgency === 3 ? '危险区域禁止进入' : '建议远离危险地带'}`;
                                address = `${locations[Math.floor(Math.random() * locations.length)]}山坡区域`;
                                break;
                        }

                        // 气泡大小基于紧急程度 (30-120px)
                        const size = 30 + (urgency * 30);

                        events.push({
                            id: `${typeInfo.type}-${Date.now()}-${i}`,
                            type: typeInfo.type,
                            typeName: typeInfo.name,
                            icon: typeInfo.icon,
                            urgency: urgency,
                            urgencyText: urgencyText,
                            location: locations[Math.floor(Math.random() * locations.length)],
                            address: address,
                            time: eventTime,
                            description: description,
                            status: 'pending', // pending, handling, resolved
                            size: size,
                            // 位置属性用于布局计算
                            x: 0,
                            y: 0,
                            vx: 0,
                            vy: 0
                        });

                        totalEvents++;
                    }
                });

                return events;
            };

            // 更新气泡图
            const updateBubbleChart = () => {
                const container = document.getElementById('bubble-container');
                if (!container) return;

                // 清空现有气泡
                bubbleElements.value = [];
                Array.from(container.children).forEach(child => {
                    if (!child.querySelector('svg')) { // 不是背景图
                        container.removeChild(child);
                    }
                });

                // 按大小排序，大的先放置（减少被小气泡遮挡）
                const sortedEvents = [...eventData.value].sort((a, b) => b.size - a.size);

                // 初始化气泡位置 - 采用网格布局作为基础，减少初始重叠
                const gridSize = 120; // 网格大小
                let gridX = 0;
                let gridY = 0;
                let maxRowHeight = 0;

                sortedEvents.forEach((event, index) => {
                    const halfSize = event.size / 2;

                    // 如果当前位置放不下，换行
                    if (gridX + event.size > containerBounds.value.width) {
                        gridX = 0;
                        gridY += maxRowHeight + 20; // 加20px间距
                        maxRowHeight = 0;
                    }

                    // 确保在容器内
                    if (gridY + event.size > containerBounds.value.height) {
                        gridY = 0;
                        gridX = 0;
                        maxRowHeight = 0;
                    }

                    // 设置初始位置
                    event.x = gridX + halfSize;
                    event.y = gridY + halfSize;

                    // 更新网格位置
                    gridX += event.size + 20; // 加20px间距
                    maxRowHeight = Math.max(maxRowHeight, event.size);

                    event.vx = 0;
                    event.vy = 0;
                });

                // 应用增强版力导向布局减少重叠并约束在容器内
                applyEnhancedForceLayout(sortedEvents);

                // 创建气泡元素
                sortedEvents.forEach(event => {
                    const bubble = document.createElement('div');

                    // 根据事件类型设置颜色
                    const bgColor = `bg-${event.type}`;

                    // 为最紧急事件添加脉冲动画
                    const pulseClass = event.urgency === 3 ? 'pulse-animation' : '';

                    // 随机浮动延迟，使动画更自然
                    const floatDelay = Math.random() * 3;

                    bubble.className = `absolute rounded-full ${bgColor} text-white flex items-center justify-center cursor-pointer event-shadow transition-all duration-300 hover:scale-110 z-10 float-animation ${pulseClass}`;
                    bubble.style.width = `${event.size}px`;
                    bubble.style.height = `${event.size}px`;
                    bubble.style.left = `${event.x - event.size/2}px`; // 调整为中心坐标
                    bubble.style.top = `${event.y - event.size/2}px`;
                    bubble.style.animationDelay = `${floatDelay}s`;
                    bubble.setAttribute('data-id', event.id);

                    // 气泡内容
                    bubble.innerHTML = `
          <div class="text-center px-1">
            <i class="fa ${event.icon}"></i>
            <div class="text-xs mt-1 font-medium">${event.typeName}</div>
          </div>
        `;

                    // 点击事件
                    bubble.addEventListener('click', () => {
                        openEventDetails(event.id);
                    });

                    container.appendChild(bubble);
                    bubbleElements.value.push({element: bubble, data: event});
                });
            };

            // 应用增强版力导向布局算法 - 大幅减少重叠
            const applyEnhancedForceLayout = (events) => {
                // 增加迭代次数，让布局更稳定
                const iterations = 120;

                // 力参数 - 增强排斥力
                const baseRepulsion = 1;
                const damping = 0.7; // 稍低的阻尼，允许更多调整
                const boundaryForce = 8; // 更强的边界约束力
                const boundaryDistance = 30; // 更早开始施加边界力

                for (let i = 0; i < iterations; i++) {
                    // 计算每个气泡受到的力
                    events.forEach(bubble => {
                        let fx = 0;
                        let fy = 0;
                        const halfSize = bubble.size / 2;

                        // 根据气泡大小和紧急程度调整排斥力 - 大气泡排斥力更强
                        const sizeFactor = (bubble.size / 100); // 标准化到0-1范围
                        const urgencyFactor = bubble.urgency / 3; // 紧急程度因子
                        const bubbleRepulsion = baseRepulsion * (1 + sizeFactor + urgencyFactor);

                        // 与其他气泡的排斥力
                        events.forEach(otherBubble => {
                            if (bubble.id === otherBubble.id) return;

                            // 计算距离
                            const dx = bubble.x - otherBubble.x;
                            const dy = bubble.y - otherBubble.y;
                            const distance = Math.sqrt(dx * dx + dy * dy);

                            // 最小距离 = 两个气泡半径之和 + 额外间距（基于气泡大小）
                            const minDistance = (halfSize + otherBubble.size / 2) * (1.5 + sizeFactor);

                            // 如果距离小于最小距离，应用排斥力
                            if (distance < minDistance && distance > 0) {
                                // 距离越近，排斥力越大，使用平方反比定律
                                const force = (minDistance / distance - 1) * bubbleRepulsion;
                                fx += (dx / distance) * force;
                                fy += (dy / distance) * force;
                            }
                        });

                        // 边界约束 - 更强的边界力确保气泡不会超出容器
                        // 左边界约束
                        const leftBoundary = halfSize + boundaryDistance;
                        if (bubble.x < leftBoundary) {
                            // 距离边界越近，力越大（平方关系）
                            const distance = leftBoundary - bubble.x;
                            fx += (distance * distance) * boundaryForce * 0.01;
                        }

                        // 右边界约束
                        const rightBoundary = containerBounds.value.width - halfSize - boundaryDistance;
                        if (bubble.x > rightBoundary) {
                            const distance = bubble.x - rightBoundary;
                            fx -= (distance * distance) * boundaryForce * 0.01;
                        }

                        // 上边界约束
                        const topBoundary = halfSize + boundaryDistance;
                        if (bubble.y < topBoundary) {
                            const distance = topBoundary - bubble.y;
                            fy += (distance * distance) * boundaryForce * 0.01;
                        }

                        // 下边界约束
                        const bottomBoundary = containerBounds.value.height - halfSize - boundaryDistance;
                        if (bubble.y > bottomBoundary) {
                            const distance = bubble.y - bottomBoundary;
                            fy -= (distance * distance) * boundaryForce * 0.01;
                        }

                        // 增加趋向中心的力，防止气泡聚集在边缘
                        const centerX = containerBounds.value.width / 2;
                        const centerY = containerBounds.value.height / 2;
                        const toCenterForce = 0.05;

                        fx += (centerX - bubble.x) * toCenterForce;
                        fy += (centerY - bubble.y) * toCenterForce;

                        // 更新速度
                        bubble.vx = (bubble.vx + fx) * damping;
                        bubble.vy = (bubble.vy + fy) * damping;
                    });

                    // 更新位置
                    events.forEach(bubble => {
                        // 先临时更新位置
                        let newX = bubble.x + bubble.vx;
                        let newY = bubble.y + bubble.vy;
                        const halfSize = bubble.size / 2;

                        // 强制约束在容器内（最终保障）
                        newX = Math.max(halfSize, Math.min(newX, containerBounds.value.width - halfSize));
                        newY = Math.max(halfSize, Math.min(newY, containerBounds.value.height - halfSize));

                        // 应用最终受约束的位置
                        bubble.x = newX;
                        bubble.y = newY;
                    });
                }
            };

            // 重新排列气泡
            const rearrangeBubbles = () => {
                // 按大小排序
                const sortedEvents = [...eventData.value].sort((a, b) => b.size - a.size);

                // 为每个气泡设置新的网格位置
                const gridSize = 120;
                let gridX = 0;
                let gridY = 0;
                let maxRowHeight = 0;

                sortedEvents.forEach(event => {
                    const halfSize = event.size / 2;

                    // 如果当前位置放不下，换行
                    if (gridX + event.size > containerBounds.value.width) {
                        gridX = 0;
                        gridY += maxRowHeight + 20;
                        maxRowHeight = 0;
                    }

                    // 确保在容器内
                    if (gridY + event.size > containerBounds.value.height) {
                        gridY = 0;
                        gridX = 0;
                        maxRowHeight = 0;
                    }

                    // 设置初始位置
                    event.x = gridX + halfSize;
                    event.y = gridY + halfSize;

                    // 更新网格位置
                    gridX += event.size + 20;
                    maxRowHeight = Math.max(maxRowHeight, event.size);

                    event.vx = 0;
                    event.vy = 0;
                });

                // 应用力导向布局
                applyEnhancedForceLayout(sortedEvents);

                // 更新气泡位置，添加动画过渡
                bubbleElements.value.forEach(item => {
                    const bubble = item.element;
                    const data = item.data;
                    const event = sortedEvents.find(e => e.id === data.id);

                    if (event) {
                        bubble.style.transition = 'left 0.8s ease, top 0.8s ease';
                        bubble.style.left = `${event.x - event.size/2}px`;
                        bubble.style.top = `${event.y - event.size/2}px`;

                        // 重置过渡效果
                        setTimeout(() => {
                            bubble.style.transition = '';
                        }, 800);
                    }
                });

                showNotification('气泡已重新排列', 'info');
            };

            // 更新统计数据
            const updateStatistics = () => {
                // 按类型统计事件数量
                theftCount.value = eventData.value.filter(e => e.type === 'theft').length;
                fireCount.value = eventData.value.filter(e => e.type === 'fire').length;
                floodCount.value = eventData.value.filter(e => e.type === 'flood').length;
                landslideCount.value = eventData.value.filter(e => e.type === 'landslide').length;

                // 统计特大事件数量
                theftCritical.value = eventData.value.filter(e => e.type === 'theft' && e.urgency === 3).length;
                fireCritical.value = eventData.value.filter(e => e.type === 'fire' && e.urgency === 3).length;
                floodCritical.value = eventData.value.filter(e => e.type === 'flood' && e.urgency === 3).length;
                landslideCritical.value = eventData.value.filter(e => e.type === 'landslide' && e.urgency === 3).length;

                // 总事件数
                totalEvents.value = eventData.value.length;

                // 进度条
                eventProgress.value = Math.min((totalEvents.value / 20) * 100, 100);

                // 模拟变化率
                changeRate.value = (Math.random() * 20 - 5).toFixed(1);
                changeRateClass.value = changeRate.value > 0 ? 'text-green-500' : 'text-red-500';
            };

            // 打开事件详情
            const openEventDetails = (eventId) => {
                const event = eventData.value.find(e => e.id === eventId);
                if (!event) return;

                currentEventId.value = eventId;
                currentEvent.value = event;

                // 设置模态框内容
                modalTitle.value = event.typeName;

                // 根据事件类型设置标题颜色
                document.getElementById('modal-title').className = `text-lg font-semibold text-${event.type}`;

                // 控制"处理事件"按钮文本
                if (event.status === 'resolved') {
                    handleEventText.value = '事件已解决';
                } else if (event.status === 'handling') {
                    handleEventText.value = '标记为已解决';
                } else {
                    handleEventText.value = '开始处理';
                }

                // 显示模态框并添加动画
                isModalHidden.value = false;
            };

            // 关闭模态框
            const closeModal = () => {
                isModalHidden.value = true;
                currentEventId.value = null;
                currentEvent.value = null;
            };

            // 处理当前事件
            const handleCurrentEvent = () => {
                if (!currentEventId.value) return;

                const eventIndex = eventData.value.findIndex(e => e.id === currentEventId.value);
                if (eventIndex !== -1) {
                    // 更新事件状态
                    if (eventData.value[eventIndex].status === 'pending') {
                        eventData.value[eventIndex].status = 'handling';
                        showNotification('事件已标记为处理中', 'success');
                    } else if (eventData.value[eventIndex].status === 'handling') {
                        eventData.value[eventIndex].status = 'resolved';
                        showNotification('事件已标记为已解决', 'success');
                    }

                    // 更新UI
                    updateBubbleChart();
                    updateStatistics();

                    // 更新模态框内容
                    openEventDetails(currentEventId.value);
                }
            };

            // 显示通知
            const showNotification = (message, type = 'info') => {
                // 创建通知元素
                const notification = document.createElement('div');
                notification.className = `fixed bottom-4 right-4 px-4 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300 translate-y-10 opacity-0`;

                // 设置样式
                let bgColor, icon;
                switch(type) {
                    case 'success':
                        bgColor = 'bg-green-500 text-white';
                        icon = 'fa-check-circle';
                        break;
                    case 'error':
                        bgColor = 'bg-red-500 text-white';
                        icon = 'fa-exclamation-circle';
                        break;
                    default:
                        bgColor = 'bg-blue-500 text-white';
                        icon = 'fa-info-circle';
                        break;
                }

                notification.classList.add(...bgColor.split(' '));
                notification.innerHTML = `<i class="fa ${icon} mr-2"></i>${message}`;

                // 添加到页面
                document.body.appendChild(notification);

                // 显示动画
                setTimeout(() => {
                    notification.classList.remove('translate-y-10', 'opacity-0');
                }, 10);

                // 3秒后隐藏
                setTimeout(() => {
                    notification.classList.add('translate-y-10', 'opacity-0');
                    setTimeout(() => {
                        document.body.removeChild(notification);
                    }, 300);
                }, 3000);
            };

            // 定时刷新数据
            const intervalId = ref(null);
            onMounted(() => {
                injectDependencies();
                updateContainerBounds();
                fetchEventData();
                setupEventListeners();

                intervalId.value = setInterval(() => {
                    // 随机决定是否刷新数据，增加真实感
                    if (Math.random() > 0.7) {
                        fetchEventData();
                    }
                }, 60000); // 每60秒检查一次
            });

            onUnmounted(() => {
                if (intervalId.value) {
                    clearInterval(intervalId.value);
                }
            });

            return {
                theftCount,
                fireCount,
                floodCount,
                landslideCount,
                theftCritical,
                fireCritical,
                floodCritical,
                landslideCritical,
                totalEvents,
                eventProgress,
                changeRate,
                changeRateClass,
                lastUpdate,
                isLoading,
                isModalHidden,
                modalTitle,
                currentEvent,
                handleEventText,
                fetchEventData,
                rearrangeBubbles,
                openEventDetails,
                closeModal,
                handleCurrentEvent
            };
        }
    };
</script>

<style scoped>
    /* 可以在这里添加组件作用域的样式 */
</style>

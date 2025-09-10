<template>
  <!-- 主内容区 -->
  <main class="container mx-auto px-4 pt-24 pb-12">
    <!-- 页面标题和日期 -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
      <div>
        <h2 class="text-[clamp(1.5rem,3vw,2rem)] font-bold text-dark">文物保护监测总览</h2>
        <p class="text-dark-2 mt-1">实时掌握文物保护状况与安全信息</p>
      </div>
      <div class="mt-4 md:mt-0 flex items-center space-x-2 bg-white rounded-lg px-4 py-2 shadow-sm">
        <i class="fa fa-calendar text-primary"></i>
        <span id="current-date" class="text-dark-2"></span>
      </div>
    </div>

    <!-- 状态概览卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
      <div class="bg-white rounded-xl p-6 card-shadow card-hover">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-dark-2 text-sm">在线设备</p>
            <h3 class="text-3xl font-bold mt-2">128</h3>
            <p class="text-success text-sm mt-3 flex items-center">
              <i class="fa fa-arrow-up mr-1"></i> 2.4% <span class="text-dark-2 ml-1">较昨日</span>
            </p>
          </div>
          <div class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <i class="fa fa-server text-primary text-xl"></i>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl p-6 card-shadow card-hover">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-dark-2 text-sm">今日警报</p>
            <h3 class="text-3xl font-bold mt-2">7</h3>
            <p class="text-danger text-sm mt-3 flex items-center">
              <i class="fa fa-arrow-up mr-1"></i> 16.7% <span class="text-dark-2 ml-1">较昨日</span>
            </p>
          </div>
          <div class="w-12 h-12 rounded-full bg-danger/10 flex items-center justify-center">
            <i class="fa fa-exclamation-triangle text-danger text-xl"></i>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl p-6 card-shadow card-hover">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-dark-2 text-sm">处理事件</p>
            <h3 class="text-3xl font-bold mt-2">5</h3>
            <p class="text-success text-sm mt-3 flex items-center">
              <i class="fa fa-check mr-1"></i> 100% <span class="text-dark-2 ml-1">已解决</span>
            </p>
          </div>
          <div class="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
            <i class="fa fa-tasks text-success text-xl"></i>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl p-6 card-shadow card-hover">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-dark-2 text-sm">参观人数</p>
            <h3 class="text-3xl font-bold mt-2">326</h3>
            <p class="text-warning text-sm mt-3 flex items-center">
              <i class="fa fa-arrow-down mr-1"></i> 5.3% <span class="text-dark-2 ml-1">较昨日</span>
            </p>
          </div>
          <div class="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center">
            <i class="fa fa-users text-warning text-xl"></i>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl p-6 card-shadow card-hover">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-dark-2 text-sm">巡查任务</p>
            <h3 class="text-3xl font-bold mt-2">8/12</h3>
            <p class="text-primary text-sm mt-3 flex items-center">
              <i class="fa fa-spinner mr-1"></i> 67% <span class="text-dark-2 ml-1">已完成</span>
            </p>
          </div>
          <div class="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
            <i class="fa fa-walking text-secondary text-xl"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- 主要内容区：左侧警报和设备概况，右侧事件和天气 -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- 左侧主要内容 -->
      <div class="lg:col-span-2 space-y-6">
        <!-- 警报数据 -->
        <div class="bg-white rounded-xl p-6 card-shadow">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-bold text-dark">警报数据统计</h3>
            <div class="flex space-x-2">
              <button class="px-3 py-1 text-sm bg-primary text-white rounded-lg">今日</button>
              <button class="px-3 py-1 text-sm bg-light-1 text-dark-2 rounded-lg hover:bg-light-2 transition-colors">本周</button>
              <button class="px-3 py-1 text-sm bg-light-1 text-dark-2 rounded-lg hover:bg-light-2 transition-colors">本月</button>
            </div>
          </div>

          <!-- 图表和数据 -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="md:col-span-2">
              <canvas id="alarmChart" height="250"></canvas>
            </div>

            <div class="space-y-4">
              <div class="flex items-center justify-between p-3 rounded-lg bg-danger/10">
                <div class="flex items-center">
                  <div class="w-3 h-3 rounded-full bg-danger mr-3"></div>
                  <span class="text-dark-2">防盗报警</span>
                </div>
                <span class="font-bold">3</span>
              </div>

              <div class="flex items-center justify-between p-3 rounded-lg bg-warning/10">
                <div class="flex items-center">
                  <div class="w-3 h-3 rounded-full bg-warning mr-3"></div>
                  <span class="text-dark-2">消防报警</span>
                </div>
                <span class="font-bold">1</span>
              </div>

              <div class="flex items-center justify-between p-3 rounded-lg bg-primary/10">
                <div class="flex items-center">
                  <div class="w-3 h-3 rounded-full bg-primary mr-3"></div>
                  <span class="text-dark-2">山洪预警</span>
                </div>
                <span class="font-bold">0</span>
              </div>

              <div class="flex items-center justify-between p-3 rounded-lg bg-secondary/10">
                <div class="flex items-center">
                  <div class="w-3 h-3 rounded-full bg-secondary mr-3"></div>
                  <span class="text-dark-2">滑坡预警</span>
                </div>
                <span class="font-bold">2</span>
              </div>

              <div class="flex items-center justify-between p-3 rounded-lg bg-purple-100">
                <div class="flex items-center">
                  <div class="w-3 h-3 rounded-full bg-purple-500 mr-3"></div>
                  <span class="text-dark-2">倾斜报警</span>
                </div>
                <span class="font-bold">0</span>
              </div>

              <div class="flex items-center justify-between p-3 rounded-lg bg-success/10">
                <div class="flex items-center">
                  <div class="w-3 h-3 rounded-full bg-success mr-3"></div>
                  <span class="text-dark-2">人流量报警</span>
                </div>
                <span class="font-bold">1</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 巡查任务处理情况 -->
        <div class="bg-white rounded-xl p-6 card-shadow">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-bold text-dark">巡查任务处理情况</h3>
            <div class="flex items-center space-x-4">
              <div class="flex space-x-2">
                <button class="px-3 py-1 text-sm bg-primary text-white rounded-lg">今日</button>
                <button class="px-3 py-1 text-sm bg-light-1 text-dark-2 rounded-lg hover:bg-light-2 transition-colors">本周</button>
                <button class="px-3 py-1 text-sm bg-light-1 text-dark-2 rounded-lg hover:bg-light-2 transition-colors">本月</button>
              </div>
              <button class="text-primary text-sm flex items-center hover:underline">
                查看全部 <i class="fa fa-angle-right ml-1"></i>
              </button>
            </div>
          </div>

          <!-- 任务进度概览 -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div class="bg-light-1 rounded-lg p-4">
              <p class="text-dark-2 text-sm">总任务数</p>
              <h4 class="text-2xl font-bold mt-1">12</h4>
            </div>
            <div class="bg-success/10 rounded-lg p-4">
              <p class="text-dark-2 text-sm">已完成</p>
              <h4 class="text-2xl font-bold mt-1 text-success">8</h4>
            </div>
            <div class="bg-warning/10 rounded-lg p-4">
              <p class="text-dark-2 text-sm">进行中</p>
              <h4 class="text-2xl font-bold mt-1 text-warning">3</h4>
            </div>
            <div class="bg-danger/10 rounded-lg p-4">
              <p class="text-dark-2 text-sm">未开始</p>
              <h4 class="text-2xl font-bold mt-1 text-danger">1</h4>
            </div>
          </div>

          <!-- 任务完成进度条 -->
          <div class="mb-8">
            <div class="flex justify-between items-center mb-2">
              <span class="text-dark-2 text-sm">总体完成进度</span>
              <span class="font-medium">67%</span>
            </div>
            <div class="progress-bar bg-light-2">
              <div class="progress-value bg-primary" style="width: 67%"></div>
            </div>
          </div>

          <!-- 任务列表 -->
          <div class="overflow-x-auto">
            <table class="w-full min-w-[640px]">
              <thead>
              <tr class="border-b border-light-2">
                <th class="text-left py-3 px-2 text-dark-2 font-medium">任务名称</th>
                <th class="text-left py-3 px-2 text-dark-2 font-medium">巡查区域</th>
                <th class="text-left py-3 px-2 text-dark-2 font-medium">负责人</th>
                <th class="text-left py-3 px-2 text-dark-2 font-medium">状态</th>
                <th class="text-left py-3 px-2 text-dark-2 font-medium">截止时间</th>
                <th class="text-left py-3 px-2 text-dark-2 font-medium">操作</th>
              </tr>
              </thead>
              <tbody>
              <tr class="border-b border-light-1 hover:bg-light-1/50 transition-colors">
                <td class="py-4 px-2">
                  <div class="flex items-center">
                    <i class="fa fa-check-circle text-success mr-3"></i>
                    <span>主殿文物状况检查</span>
                  </div>
                </td>
                <td class="py-4 px-2">主殿区域</td>
                <td class="py-4 px-2">
                  <div class="flex items-center">
                    <img src="https://picsum.photos/id/1012/30/30" alt="张明" class="w-6 h-6 rounded-full mr-2">
                    张明
                  </div>
                </td>
                <td class="py-4 px-2">
                  <span class="px-2 py-1 text-xs rounded-full bg-success/10 text-success">已完成</span>
                </td>
                <td class="py-4 px-2 text-dark-2">09:30</td>
                <td class="py-4 px-2">
                  <button class="text-primary hover:text-primary/80">
                    <i class="fa fa-eye"></i>
                  </button>
                </td>
              </tr>
              <tr class="border-b border-light-1 hover:bg-light-1/50 transition-colors">
                <td class="py-4 px-2">
                  <div class="flex items-center">
                    <i class="fa fa-check-circle text-success mr-3"></i>
                    <span>安防设备运行检查</span>
                  </div>
                </td>
                <td class="py-4 px-2">全区域</td>
                <td class="py-4 px-2">
                  <div class="flex items-center">
                    <img src="https://picsum.photos/id/1025/30/30" alt="李强" class="w-6 h-6 rounded-full mr-2">
                    李强
                  </div>
                </td>
                <td class="py-4 px-2">
                  <span class="px-2 py-1 text-xs rounded-full bg-success/10 text-success">已完成</span>
                </td>
                <td class="py-4 px-2 text-dark-2">10:00</td>
                <td class="py-4 px-2">
                  <button class="text-primary hover:text-primary/80">
                    <i class="fa fa-eye"></i>
                  </button>
                </td>
              </tr>
              <tr class="border-b border-light-1 hover:bg-light-1/50 transition-colors">
                <td class="py-4 px-2">
                  <div class="flex items-center">
                    <i class="fa fa-spinner text-warning mr-3"></i>
                    <span>壁画保存状况巡查</span>
                  </div>
                </td>
                <td class="py-4 px-2">东厢房</td>
                <td class="py-4 px-2">
                  <div class="flex items-center">
                    <img src="https://picsum.photos/id/1018/30/30" alt="王丽" class="w-6 h-6 rounded-full mr-2">
                    王丽
                  </div>
                </td>
                <td class="py-4 px-2">
                  <span class="px-2 py-1 text-xs rounded-full bg-warning/10 text-warning">进行中</span>
                </td>
                <td class="py-4 px-2 text-dark-2">14:00</td>
                <td class="py-4 px-2">
                  <button class="text-primary hover:text-primary/80">
                    <i class="fa fa-eye"></i>
                  </button>
                </td>
              </tr>
              <tr class="border-b border-light-1 hover:bg-light-1/50 transition-colors">
                <td class="py-4 px-2">
                  <div class="flex items-center">
                    <i class="fa fa-circle-o text-danger mr-3"></i>
                    <span>西厢房文物检查</span>
                  </div>
                </td>
                <td class="py-4 px-2">西厢房</td>
                <td class="py-4 px-2">
                  <div class="flex items-center">
                    <img src="https://picsum.photos/id/1015/30/30" alt="赵刚" class="w-6 h-6 rounded-full mr-2">
                    赵刚
                  </div>
                </td>
                <td class="py-4 px-2">
                  <span class="px-2 py-1 text-xs rounded-full bg-danger/10 text-danger">未开始</span>
                </td>
                <td class="py-4 px-2 text-dark-2">16:00</td>
                <td class="py-4 px-2">
                  <button class="text-primary hover:text-primary/80">
                    <i class="fa fa-eye"></i>
                  </button>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- 右侧事件和天气 -->
      <div class="space-y-6">
        <!-- 事件处理统计 -->
        <div class="bg-white rounded-xl p-6 card-shadow">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-bold text-dark">事件处理统计</h3>
            <button class="text-primary text-sm flex items-center hover:underline">
              查看全部 <i class="fa fa-angle-right ml-1"></i>
            </button>
          </div>

          <!-- 事件处理进度 -->
          <div class="space-y-4">
            <div>
              <div class="flex justify-between items-center mb-1">
                <span class="text-dark-2 text-sm">防盗报警</span>
                <span class="font-medium">3/3</span>
              </div>
              <div class="progress-bar bg-light-2">
                <div class="progress-value bg-danger" style="width: 100%"></div>
              </div>
            </div>
            <div>
              <div class="flex justify-between items-center mb-1">
                <span class="text-dark-2 text-sm">消防报警</span>
                <span class="font-medium">1/1</span>
              </div>
              <div class="progress-bar bg-light-2">
                <div class="progress-value bg-warning" style="width: 100%"></div>
              </div>
            </div>
            <div>
              <div class="flex justify-between items-center mb-1">
                <span class="text-dark-2 text-sm">山洪预警</span>
                <span class="font-medium">0/0</span>
              </div>
              <div class="progress-bar bg-light-2">
                <div class="progress-value bg-primary" style="width: 0%"></div>
              </div>
            </div>
            <div>
              <div class="flex justify-between items-center mb-1">
                <span class="text-dark-2 text-sm">滑坡预警</span>
                <span class="font-medium">2/2</span>
              </div>
              <div class="progress-bar bg-light-2">
                <div class="progress-value bg-secondary" style="width: 100%"></div>
              </div>
            </div>
            <div>
              <div class="flex justify-between items-center mb-1">
                <span class="text-dark-2 text-sm">倾斜报警</span>
                <span class="font-medium">0/0</span>
              </div>
              <div class="progress-bar bg-light-2">
                <div class="progress-value bg-purple-500" style="width: 0%"></div>
              </div>
            </div>
            <div>
              <div class="flex justify-between items-center mb-1">
                <span class="text-dark-2 text-sm">人流量报警</span>
                <span class="font-medium">1/1</span>
              </div>
              <div class="progress-bar bg-light-2">
                <div class="progress-value bg-success" style="width: 100%"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- 天气信息 -->
        <div class="bg-white rounded-xl p-6 card-shadow">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-bold text-dark">今日天气</h3>
            <button class="text-primary text-sm flex items-center hover:underline">
              查看更多 <i class="fa fa-angle-right ml-1"></i>
            </button>
          </div>

          <div class="flex items-center space-x-6">
            <div>
              <img src="https://picsum.photos/id/1004/100/100" alt="晴天" class="w-20 h-20">
              <p class="text-2xl font-bold text-dark mt-2">晴</p>
            </div>
            <div>
              <p class="text-dark-2">温度: 22℃ ~ 30℃</p>
              <p class="text-dark-2">湿度: 40% ~ 60%</p>
              <p class="text-dark-2">风力: 3 ~ 4级</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import Chart from 'chart.js/auto'
// 可按需添加 Vue 响应式逻辑和生命周期钩子
// 示例：获取当前日期
import { onMounted, ref } from 'vue'

const currentDate = ref('')

onMounted(() => {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  currentDate.value = `${year}-${month}-${day}`
})

// 图表初始化逻辑
onMounted(() => {
  const ctx = document.getElementById('alarmChart').getContext('2d')
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['防盗报警', '消防报警', '山洪预警', '滑坡预警', '倾斜报警', '人流量报警'],
      datasets: [{
        label: '报警数量',
        data: [3, 1, 0, 2, 0, 1],
        backgroundColor: [
          'rgba(245, 63, 63, 0.6)', // 防盗报警 - 红色
          'rgba(255, 125, 0, 0.6)', // 消防报警 - 橙色
          'rgba(22, 93, 255, 0.6)', // 山洪预警 - 蓝色
          'rgba(54, 191, 250, 0.6)', // 滑坡预警 - 浅蓝色
          'rgba(168, 85, 247, 0.6)', // 倾斜报警 - 紫色
          'rgba(0, 180, 42, 0.6)' // 人流量报警 - 绿色
        ],
        borderColor: [
          'rgba(245, 63, 63, 1)',
          'rgba(255, 125, 0, 1)',
          'rgba(22, 93, 255, 1)',
          'rgba(54, 191, 250, 1)',
          'rgba(168, 85, 247, 1)',
          'rgba(0, 180, 42, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  })
})
</script>

<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer utilities {
  .content-auto {
    content-visibility: auto;
  }
  .card-shadow {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  }
  .card-hover {
    transition: all 0.3s ease;
  }
  .card-hover:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  .gradient-bg {
    background: linear-gradient(135deg, #165DFF 0%, #36BFFA 100%);
  }
  .progress-bar {
    height: 6px;
    border-radius: 3px;
    overflow: hidden;
  }
  .progress-value {
    height: 100%;
    transition: width 0.6s ease;
  }
}
</style>

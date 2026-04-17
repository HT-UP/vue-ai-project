<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import * as echarts from 'echarts'

const projectTrendRef = ref<HTMLDivElement>()
const fundRef = ref<HTMLDivElement>()
const projectTypeRef = ref<HTMLDivElement>()
const achievementRef = ref<HTMLDivElement>()
const radarRef = ref<HTMLDivElement>()

let projectTrendChart: echarts.ECharts | null = null
let fundChart: echarts.ECharts | null = null
let projectTypeChart: echarts.ECharts | null = null
let achievementChart: echarts.ECharts | null = null
let radarChart: echarts.ECharts | null = null
let projectTrendObserver: ResizeObserver | null = null
let fundObserver: ResizeObserver | null = null
let projectTypeObserver: ResizeObserver | null = null
let achievementObserver: ResizeObserver | null = null
let radarObserver: ResizeObserver | null = null

const cards = [
  { label: '在研项目', value: 126, trend: '+12%', color: '#3b82f6' },
  { label: '本月立项', value: 18, trend: '+8%', color: '#10b981' },
  { label: '论文成果', value: 342, trend: '+15%', color: '#8b5cf6' },
  { label: '专利申请', value: 57, trend: '+6%', color: '#f59e0b' },
]

const renderCharts = () => {
  if (projectTrendRef.value && !projectTrendChart) {
    projectTrendChart = echarts.init(projectTrendRef.value)
  }
  if (fundRef.value && !fundChart) {
    fundChart = echarts.init(fundRef.value)
  }
  if (projectTypeRef.value && !projectTypeChart) {
    projectTypeChart = echarts.init(projectTypeRef.value)
  }
  if (achievementRef.value && !achievementChart) {
    achievementChart = echarts.init(achievementRef.value)
  }
  if (radarRef.value && !radarChart) {
    radarChart = echarts.init(radarRef.value)
  }

  projectTrendChart?.setOption({
    title: { text: '年度项目申报趋势', left: 'center', textStyle: { fontSize: 14 } },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月'],
      boundaryGap: false,
    },
    yAxis: { type: 'value' },
    series: [
      {
        name: '申报数量',
        type: 'line',
        smooth: true,
        data: [12, 18, 22, 26, 29, 34],
        areaStyle: { opacity: 0.15 },
      },
    ],
    color: ['#409eff'],
    grid: { left: 30, right: 20, bottom: 30, top: 60 },
  })

  projectTypeChart?.setOption({
    title: { text: '项目类型分布', left: 'center', textStyle: { fontSize: 14 } },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: ['基础研究', '应用研究', '技术开发', '软科学研究'],
      axisLabel: { rotate: 15 }
    },
    yAxis: { type: 'value' },
    series: [
      {
        name: '项目数量',
        type: 'bar',
        data: [45, 32, 28, 21],
        barWidth: '60%',
        itemStyle: {
          borderRadius: [4, 4, 0, 0]
        }
      }
    ],
    color: ['#3b82f6'],
    grid: { left: 30, right: 20, bottom: 40, top: 60 },
  })

  achievementChart?.setOption({
    title: { text: '成果类型分布', left: 'center', textStyle: { fontSize: 14 } },
    tooltip: { trigger: 'item' },
    legend: { orient: 'vertical', right: 10, top: 'center' },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['40%', '55%'],
        data: [
          { value: 156, name: '期刊论文' },
          { value: 89, name: '会议论文' },
          { value: 45, name: '专利' },
          { value: 23, name: '软件著作权' },
          { value: 12, name: '研究报告' },
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ],
    color: ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'],
  })

  radarChart?.setOption({
    title: { text: '科研能力雷达图', left: 'center', textStyle: { fontSize: 14 } },
    tooltip: {},
    radar: {
      indicator: [
        { name: '创新能力', max: 100 },
        { name: '研究能力', max: 100 },
        { name: '应用能力', max: 100 },
        { name: '转化能力', max: 100 },
        { name: '团队协作', max: 100 },
        { name: '经费管理', max: 100 }
      ],
      center: ['50%', '60%'],
      radius: '60%'
    },
    series: [
      {
        type: 'radar',
        areaStyle: {
          opacity: 0.3
        },
        data: [
          {
            value: [85, 92, 78, 88, 95, 80],
            name: '当前年度',
            lineStyle: {
              width: 2
            }
          },
          {
            value: [75, 85, 70, 82, 88, 75],
            name: '去年同期',
            lineStyle: {
              width: 2,
              type: 'dashed'
            }
          }
        ]
      }
    ]
  })

  fundChart?.setOption({
    title: { text: '科研经费分布', left: 'center', textStyle: { fontSize: 14 } },
    tooltip: { trigger: 'item' },
    legend: { orient: 'vertical', right: 10, top: 'center' },
    series: [
      {
        type: 'pie',
        radius: ['45%', '70%'],
        center: ['40%', '55%'],
        data: [
          { value: 420, name: '国家级项目' },
          { value: 300, name: '省部级项目' },
          { value: 180, name: '校级项目' },
          { value: 120, name: '企业合作项目' },
        ],
      },
    ],
    color: ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6'],
  })
}

const resizeCharts = () => {
  projectTrendChart?.resize()
  fundChart?.resize()
}

onMounted(() => {
  renderCharts()
  if (projectTrendRef.value) {
    projectTrendObserver = new ResizeObserver(() => {
      projectTrendChart?.resize()
    })
    projectTrendObserver.observe(projectTrendRef.value)
  }
  if (projectTypeRef.value) {
    projectTypeObserver = new ResizeObserver(() => {
      projectTypeChart?.resize()
    })
    projectTypeObserver.observe(projectTypeRef.value)
  }
  if (achievementRef.value) {
    achievementObserver = new ResizeObserver(() => {
      achievementChart?.resize()
    })
    achievementObserver.observe(achievementRef.value)
  }
  if (radarRef.value) {
    radarObserver = new ResizeObserver(() => {
      radarChart?.resize()
    })
    radarObserver.observe(radarRef.value)
  }
  if (fundRef.value) {
    fundObserver = new ResizeObserver(() => {
      fundChart?.resize()
    })
    fundObserver.observe(fundRef.value)
  }
  window.addEventListener('resize', resizeCharts)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeCharts)
  projectTrendObserver?.disconnect()
  projectTypeObserver?.disconnect()
  achievementObserver?.disconnect()
  radarObserver?.disconnect()
  fundObserver?.disconnect()
  projectTrendObserver = null
  projectTypeObserver = null
  achievementObserver = null
  radarObserver = null
  fundObserver = null
  projectTrendChart?.dispose()
  projectTypeChart?.dispose()
  achievementChart?.dispose()
  radarChart?.dispose()
  fundChart?.dispose()
  projectTrendChart = null
  projectTypeChart = null
  achievementChart = null
  radarChart = null
  fundChart = null
})
</script>

<template>
  <el-row :gutter="16">
    <el-col v-for="card in cards" :key="card.label" :xs="24" :sm="12" :md="6">
      <el-card shadow="hover" class="stat-card">
        <div class="stat-top">
          <span class="label">{{ card.label }}</span>
          <span class="trend" :style="{ color: card.color }">{{ card.trend }}</span>
        </div>
        <div class="value">{{ card.value }}</div>
      </el-card>
    </el-col>
  </el-row>

  <el-row :gutter="16" class="chart-row">
    <el-col :xs="24" :md="12">
      <el-card class="chart-card" shadow="never">
        <div ref="projectTrendRef" class="chart-box"></div>
      </el-card>
    </el-col>
    <el-col :xs="24" :md="12">
      <el-card class="chart-card" shadow="never">
        <div ref="fundRef" class="chart-box"></div>
      </el-card>
    </el-col>
  </el-row>

  <el-row :gutter="16" class="chart-row">
    <el-col :xs="24" :md="12">
      <el-card class="chart-card" shadow="never">
        <div ref="projectTypeRef" class="chart-box"></div>
      </el-card>
    </el-col>
    <el-col :xs="24" :md="12">
      <el-card class="chart-card" shadow="never">
        <div ref="radarRef" class="chart-box"></div>
      </el-card>
    </el-col>
  </el-row>

  <el-row :gutter="16" class="chart-row">
    <el-col :xs="24" :md="12">
      <el-card class="chart-card" shadow="never">
        <div ref="achievementRef" class="chart-box"></div>
      </el-card>
    </el-col>
    <el-col :xs="24" :md="12">
      <el-card class="chart-card" shadow="never">
        <div class="info-box">
          <h4>科研指标分析</h4>
          <div class="metric-item">
            <span class="metric-label">项目完成率</span>
            <el-progress type="line" :percentage="85" :color="'#10b981'" />
          </div>
          <div class="metric-item">
            <span class="metric-label">论文发表率</span>
            <el-progress type="line" :percentage="92" :color="'#3b82f6'" />
          </div>
          <div class="metric-item">
            <span class="metric-label">专利转化率</span>
            <el-progress type="line" :percentage="78" :color="'#f59e0b'" />
          </div>
          <div class="metric-item">
            <span class="metric-label">经费执行率</span>
            <el-progress type="line" :percentage="95" :color="'#8b5cf6'" />
          </div>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<style scoped lang="scss">
:deep(.admin-layout.dark-theme) {
  :deep(.stat-card),
  :deep(.chart-card) {
    background: #111827;
    border-color: #334155;
  }

  .stat-top {
    color: #94a3b8;
  }

  .value {
    color: #f8fafc;
  }
}

.stat-card {
  margin-bottom: 16px;
}

.stat-top {
  display: flex;
  justify-content: space-between;
  color: #64748b;
  font-size: 14px;
}

.value {
  margin-top: 8px;
  font-size: 30px;
  font-weight: 600;
  color: #0f172a;
}

.chart-row {
  margin-bottom: 16px;
}

.chart-card {
  :deep(.el-card__body) {
    padding: 16px;
    overflow: hidden;
  }
}

.chart-box {
  width: 100%;
  height: 340px;
  overflow: hidden;
}

.info-box {
  height: 340px;
  padding: 20px;
  display: flex;
  flex-direction: column;

  h4 {
    margin: 0;
    font-size: 14px;
    font-weight: 600;
    color: #1f2937;
    text-align: center;
    margin-bottom: 15px;
  }

  .metric-item {
    margin-bottom: 20px;

    &:last-child {
      margin-bottom: 0;
    }

    .metric-label {
      display: block;
      margin-bottom: 8px;
      font-size: 14px;
      color: #4b5563;
    }
  }
}

</style>

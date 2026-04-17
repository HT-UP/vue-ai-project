<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { DataAnalysis, Document, Files, Histogram, SetUp } from '@element-plus/icons-vue'

const props = defineProps<{
  isCollapse: boolean
  activeMenu: string
  menuOnTop: boolean
}>()

const router = useRouter()
const asideWidth = computed(() => (props.isCollapse ? '64px' : '220px'))

const handleSelect = (index: string) => {
  router.push(`/${index}`)
}
</script>

<template>
  <aside class="side-menu" :class="{ 'below-nav': !menuOnTop }" :style="{ width: asideWidth }">
    <div class="logo">
      <span class="logo-mark">R</span>
      <span v-if="!isCollapse">科研管理系统</span>
    </div>
    <el-menu
      :default-active="activeMenu"
      :collapse="isCollapse"
      class="menu-content"
      background-color="#0f172a"
      text-color="#cbd5e1"
      active-text-color="#60a5fa"
      @select="handleSelect"
    >
      <el-menu-item index="dashboard">
        <el-icon><DataAnalysis /></el-icon>
        <template #title>数据看板</template>
      </el-menu-item>
      <el-menu-item index="projects">
        <el-icon><Files /></el-icon>
        <template #title>项目管理</template>
      </el-menu-item>
      <el-menu-item index="results">
        <el-icon><Document /></el-icon>
        <template #title>成果管理</template>
      </el-menu-item>
      <el-menu-item index="reports">
        <el-icon><Histogram /></el-icon>
        <template #title>统计报表</template>
      </el-menu-item>
      <el-menu-item index="settings">
        <el-icon><SetUp /></el-icon>
        <template #title>系统设置</template>
      </el-menu-item>
    </el-menu>
  </aside>
</template>

<style scoped lang="scss">
.side-menu {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 1100;
  background: #0f172a;
  transition: width 0.25s ease;
  overflow: hidden;
}

.side-menu.below-nav {
  top: 60px;
  bottom: 0;
  z-index: 900;
}

.logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #f8fafc;
  font-size: 16px;
  font-weight: 600;
  border-bottom: 1px solid rgba(148, 163, 184, 0.2);
}

.logo-mark {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 700;
  color: #0f172a;
  background: linear-gradient(135deg, #93c5fd 0%, #34d399 100%);
  box-shadow: 0 2px 6px rgba(52, 211, 153, 0.35);
}

.below-nav .logo {
  display: none;
}

.menu-content {
  border-right: 0;
  height: 100%;
}
</style>

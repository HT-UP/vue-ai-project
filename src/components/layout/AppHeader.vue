<script setup lang="ts">
import { Expand, Fold, Bell } from '@element-plus/icons-vue'
import { useMessages } from '../../composables/useMessages'

defineProps<{
  isCollapse: boolean
  title: string
  userName: string
  avatarUrl?: string
}>()

const { unreadCount } = useMessages()

const emit = defineEmits<{
  (e: 'toggle-menu'): void
  (e: 'go-profile'): void
  (e: 'go-messages'): void
  (e: 'open-settings'): void
  (e: 'logout'): void
}>()
</script>

<template>
  <header class="top-nav">
    <div class="nav-left">
      <el-button text class="menu-toggle" @click="emit('toggle-menu')">
        <el-icon size="18">
          <Fold v-if="!isCollapse" />
          <Expand v-else />
        </el-icon>
      </el-button>
      <span class="title">{{ title }}</span>
    </div>
    <div class="nav-right">
      <el-badge :value="unreadCount" :hidden="unreadCount === 0">
        <el-button text @click="emit('go-messages')">
          <el-icon><Bell /></el-icon>
        </el-button>
      </el-badge>
      <el-dropdown>
        <span class="user-entry">
          <el-avatar :size="26" :src="avatarUrl">研</el-avatar>
          {{ userName }}
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="emit('go-profile')">个人中心</el-dropdown-item>
            <el-dropdown-item @click="emit('open-settings')">系统设置</el-dropdown-item>
            <el-dropdown-item @click="emit('logout')">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </header>
</template>

<style scoped lang="scss">
.top-nav {
  position: sticky;
  top: 0;
  z-index: 1000;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.title {
  font-size: 16px;
  color: #0f172a;
  font-weight: 600;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-entry {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  color: #334155;
}

@media (max-width: 992px) {
  .top-nav {
    padding: 0 12px;
  }
}
</style>

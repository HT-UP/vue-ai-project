<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppSidebar from './AppSidebar.vue'
import AppHeader from './AppHeader.vue'
import ProfileDialog from '../ProfileDialog.vue'

const route = useRoute()
const router = useRouter()

const isCollapse = ref(false)
const drawerVisible = ref(false)
const profileDialogVisible = ref(false)
const isDarkTheme = ref(false)
const menuOnTop = ref(true)
const userName = ref('科研管理员')
const avatarUrl = ref(
  localStorage.getItem('rms-avatar') ??
    'https://api.dicebear.com/9.x/initials/svg?seed=%E7%A7%91%E7%A0%94',
)

const asideWidth = computed(() => (isCollapse.value ? '64px' : '220px'))
const pageTitle = computed(() => (route.meta.title as string) || '科研管理系统')
const activeMenu = computed(() => (route.meta.activeMenu as string) || 'dashboard')

const toggleMenu = async () => {
  isCollapse.value = !isCollapse.value
  await nextTick()
}

const openSettings = () => {
  drawerVisible.value = true
}

const goProfile = () => {
  profileDialogVisible.value = true
}
const logout = () => router.push('/auth')

</script>

<template>
  <div class="admin-layout" :class="{ 'dark-theme': isDarkTheme }">
    <AppSidebar :is-collapse="isCollapse" :active-menu="activeMenu" :menu-on-top="menuOnTop" />

    <div class="main-area" :style="{ marginLeft: asideWidth }">
      <AppHeader
        :is-collapse="isCollapse"
        :title="pageTitle"
        :user-name="userName"
        :avatar-url="avatarUrl"
        @toggle-menu="toggleMenu"
        @go-profile="goProfile"
        @go-messages="router.push('/messages')"
        @open-settings="openSettings"
        @logout="logout"
      />

      <main class="content-area">
        <router-view />
      </main>
    </div>

    <el-drawer v-model="drawerVisible" title="系统设置" direction="rtl" size="320px">
      <div class="setting-item">
        <div class="setting-text">
          <h4>切换系统颜色主题</h4>
          <p>{{ isDarkTheme ? '当前深色主题' : '当前浅色主题' }}</p>
        </div>
        <el-switch v-model="isDarkTheme" inline-prompt active-text="深色" inactive-text="浅色" />
      </div>

    </el-drawer>

    <ProfileDialog
      v-model="profileDialogVisible"
      :user-name="userName"
      :avatar-url="avatarUrl"
      @update:user-name="userName = $event"
      @update:avatar-url="avatarUrl = $event"
    />
  </div>
</template>

<style scoped lang="scss">
.admin-layout {
  min-height: 100vh;
  background: #f1f5f9;
  overflow-x: hidden;
}

.main-area {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  transition: margin-left 0.25s ease;
}

.content-area {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 0;
  border-bottom: 1px solid #e2e8f0;
}

.setting-text h4 {
  margin: 0;
  font-size: 15px;
  color: #0f172a;
}

.setting-text p {
  margin: 6px 0 0;
  font-size: 13px;
  color: #64748b;
}

.admin-layout.dark-theme {
  background: #0f172a;

  .setting-item {
    border-bottom-color: #334155;
  }

  .setting-text h4 {
    color: #f8fafc;
  }

  .setting-text p {
    color: #94a3b8;
  }

  :deep(.top-nav) {
    background: #111827;
    border-bottom-color: #334155;
  }

  :deep(.title),
  :deep(.user-entry) {
    color: #e2e8f0;
  }

  :deep(.side-menu) {
    background: #020617;
  }

  :deep(.menu-content.el-menu) {
    background-color: #020617;
  }

  :deep(.menu-content .el-menu-item:hover) {
    background-color: rgba(37, 99, 235, 0.15);
  }
}

@media (max-width: 992px) {
  .content-area {
    padding: 12px;
  }
}
</style>

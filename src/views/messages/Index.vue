<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useMessages } from '../../composables/useMessages'
import { Check } from '@element-plus/icons-vue'

const { messages, unreadCount, markAsRead, markAllAsRead } = useMessages()
const activeTab = ref('all')
const currentPage = ref(1)
const pageSize = 8

const typeConfig: Record<string, { label: string; color: string }> = {
  approval: { label: '审批', color: '#3b82f6' },
  system: { label: '系统', color: '#8b5cf6' },
  review: { label: '审核', color: '#10b981' },
  fund: { label: '经费', color: '#f59e0b' },
  meeting: { label: '会议', color: '#ef4444' },
}

const filteredMessages = computed(() => {
  if (activeTab.value === 'unread') return messages.value.filter(m => !m.read)
  if (activeTab.value === 'read') return messages.value.filter(m => m.read)
  return messages.value
})

const pagedMessages = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredMessages.value.slice(start, start + pageSize)
})

const total = computed(() => filteredMessages.value.length)

const handleTabChange = () => {
  currentPage.value = 1
}

const handleMarkAsRead = (id: number) => {
  markAsRead(id)
}

const handleMarkAllAsRead = () => {
  markAllAsRead()
}

// 当筛选后总数变少，自动修正当前页
watch(total, (newTotal) => {
  const maxPage = Math.max(1, Math.ceil(newTotal / pageSize))
  if (currentPage.value > maxPage) {
    currentPage.value = maxPage
  }
})
</script>

<template>
  <div class="messages-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <h2 class="page-title">系统消息</h2>
        <p class="page-stats">
          共 <span class="count-total">{{ messages.length }}</span> 条消息，
          <span class="count-unread">{{ unreadCount }}</span> 条未读
        </p>
      </div>
      <el-button
        type="primary"
        plain
        :disabled="unreadCount === 0"
        @click="handleMarkAllAsRead"
      >
        全部已读
      </el-button>
    </div>

    <!-- 标签筛选 -->
    <el-tabs v-model="activeTab" class="msg-tabs" @tab-change="handleTabChange">
      <el-tab-pane label="全部" name="all" />
      <el-tab-pane name="unread">
        <template #label>
          未读<span v-if="unreadCount > 0" class="unread-tab-count">{{ unreadCount }}</span>
        </template>
      </el-tab-pane>
      <el-tab-pane label="已读" name="read" />
    </el-tabs>

    <!-- 消息列表 -->
    <div class="message-list">
      <div
        v-for="msg in pagedMessages"
        :key="msg.id"
        class="message-item"
        :class="{ unread: !msg.read }"
      >
        <div class="msg-indicator">
          <span v-if="!msg.read" class="unread-dot"></span>
        </div>

        <div class="msg-body">
          <div class="msg-header">
            <div class="msg-title-row">
              <span
                class="type-tag"
                :style="{ background: typeConfig[msg.type].color }"
              >{{ typeConfig[msg.type].label }}</span>
              <span class="msg-title" :class="{ 'is-unread': !msg.read }">{{ msg.title }}</span>
            </div>
            <span class="msg-date">{{ msg.date }}</span>
          </div>
          <p class="msg-content">{{ msg.content }}</p>
        </div>

        <div class="msg-action">
          <el-button
            v-if="!msg.read"
            text
            type="primary"
            size="small"
            @click="handleMarkAsRead(msg.id)"
          >
            <el-icon><Check /></el-icon>标记已读
          </el-button>
        </div>
      </div>

      <el-empty v-if="pagedMessages.length === 0" description="暂无消息" />
    </div>

    <!-- 分页 -->
    <div v-if="total > 0" class="pagination-wrap">
      <el-pagination
        v-model:current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        layout="prev, pager, next"
        background
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.messages-page {
  background: #fff;
  border-radius: 10px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

/* ---- 头部 ---- */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 4px;
}

.page-title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #0f172a;
}

.page-stats {
  margin: 6px 0 0;
  font-size: 13px;
  color: #94a3b8;
}

.count-total {
  color: #334155;
  font-weight: 500;
}

.count-unread {
  color: #3b82f6;
  font-weight: 600;
}

/* ---- 标签 ---- */
.msg-tabs {
  margin-bottom: 4px;
}

.unread-tab-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  margin-left: 4px;
  border-radius: 9px;
  background: #ef4444;
  color: #fff;
  font-size: 11px;
  line-height: 1;
  vertical-align: middle;
}

/* ---- 消息列表 ---- */
.message-list {
  min-height: 380px;
}

.message-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px 12px;
  border-bottom: 1px solid #f1f5f9;
  border-left: 3px solid transparent;
  border-radius: 6px;
  transition: background 0.25s, border-color 0.25s;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: #f8fafc;
  }

  &.unread {
    background: #eff6ff;
    border-left-color: #3b82f6;

    &:hover {
      background: #dbeafe;
    }
  }
}

.msg-indicator {
  width: 10px;
  padding-top: 6px;
  display: flex;
  justify-content: center;
  flex-shrink: 0;
}

.unread-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
  animation: pulse-dot 2s ease-in-out infinite;
}

@keyframes pulse-dot {
  0%, 100% { box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15); }
  50% { box-shadow: 0 0 0 6px rgba(59, 130, 246, 0.08); }
}

.msg-body {
  flex: 1;
  min-width: 0;
}

.msg-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.msg-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  flex: 1;
}

.type-tag {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 1px 8px;
  border-radius: 10px;
  color: #fff;
  font-size: 11px;
  font-weight: 500;
  line-height: 20px;
  letter-spacing: 0.5px;
}

.msg-title {
  font-size: 14px;
  color: #475569;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &.is-unread {
    font-weight: 600;
    color: #0f172a;
  }
}

.msg-date {
  flex-shrink: 0;
  font-size: 12px;
  color: #94a3b8;
  white-space: nowrap;
}

.msg-content {
  margin: 6px 0 0;
  font-size: 13px;
  color: #64748b;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.msg-action {
  flex-shrink: 0;
  padding-top: 2px;
}

/* ---- 分页 ---- */
.pagination-wrap {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #f1f5f9;
}

/* ---- 响应式 ---- */
@media (max-width: 768px) {
  .messages-page {
    padding: 16px;
    border-radius: 8px;
  }

  .message-item {
    flex-wrap: wrap;
    gap: 8px;
  }

  .msg-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }

  .msg-action {
    width: 100%;
    padding-top: 0;
  }
}
</style>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref } from 'vue'
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'

const props = defineProps<{
  modelValue: boolean
  userName: string
  avatarUrl: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void
  (e: 'update:userName', val: string): void
  (e: 'update:avatarUrl', val: string): void
}>()

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

/* ---- 头像裁剪 ---- */
const cropDialogVisible = ref(false)
const cropImageUrl = ref('')
const imageForCropRef = ref<HTMLImageElement>()
const fileInputRef = ref<HTMLInputElement>()
let cropper: Cropper | null = null

const openUpload = () => {
  fileInputRef.value?.click()
}

const handleFileChange = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  cropImageUrl.value = URL.createObjectURL(file)
  cropDialogVisible.value = true
  await nextTick()

  if (imageForCropRef.value) {
    cropper?.destroy()
    cropper = new Cropper(imageForCropRef.value, {
      aspectRatio: 1,
      viewMode: 1,
      dragMode: 'move',
      autoCropArea: 0.9,
      background: false,
    })
  }

  input.value = ''
}

const confirmCrop = () => {
  if (!cropper) return
  const base64 = cropper.getCroppedCanvas({ width: 240, height: 240 }).toDataURL('image/png')
  emit('update:avatarUrl', base64)
  localStorage.setItem('rms-avatar', base64)
  ElMessage.success('头像更新成功')
  closeCropDialog()
}

const closeCropDialog = () => {
  cropDialogVisible.value = false
  cropper?.destroy()
  cropper = null
  if (cropImageUrl.value) {
    URL.revokeObjectURL(cropImageUrl.value)
    cropImageUrl.value = ''
  }
}

/* ---- 用户名修改 ---- */
const localUserName = ref(props.userName)
const profileFormRef = ref<FormInstance>()

const saveProfile = async () => {
  if (!localUserName.value.trim()) {
    ElMessage.warning('用户名不能为空')
    return
  }
  emit('update:userName', localUserName.value.trim())
  ElMessage.success('用户名保存成功')
}

/* ---- 密码修改 ---- */
const passwordFormRef = ref<FormInstance>()
const passwordForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const passwordRules: FormRules = {
  oldPassword: [{ required: true, message: '请输入原密码', trigger: 'blur' }],
  newPassword: [{ required: true, message: '请输入新密码', trigger: 'blur' }],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    {
      validator: (_rule, value, callback) => {
        if (value !== passwordForm.value.newPassword) {
          callback(new Error('两次输入的新密码不一致'))
        } else {
          callback()
        }
      },
      trigger: ['blur', 'change'],
    },
  ],
}

const updatePassword = async () => {
  const valid = await passwordFormRef.value?.validate().catch(() => false)
  if (!valid) return
  ElMessage.success('密码修改成功')
  passwordForm.value = { oldPassword: '', newPassword: '', confirmPassword: '' }
}

onBeforeUnmount(() => {
  closeCropDialog()
})
</script>

<template>
  <el-dialog
    v-model="visible"
    title="个人中心"
    width="480px"
    :close-on-click-modal="false"
    destroy-on-close
    class="profile-dialog"
  >
    <div class="profile-body">
      <!-- 头像区域 -->
      <div class="avatar-section">
        <div class="avatar-wrapper">
          <el-avatar :size="80" :src="avatarUrl">研</el-avatar>
          <button class="avatar-edit-btn" title="更换头像" @click="openUpload">
            <el-icon size="14"><span class="edit-icon">✎</span></el-icon>
          </button>
        </div>
        <p class="avatar-hint">点击修改头像</p>
        <input
          ref="fileInputRef"
          class="hidden-input"
          type="file"
          accept="image/*"
          @change="handleFileChange"
        />
      </div>

      <!-- 用户名修改 -->
      <div class="section-card">
        <h4 class="section-title">账号信息</h4>
        <el-form ref="profileFormRef" :model="{ userName: localUserName }" label-position="top">
          <el-form-item label="用户名" prop="userName">
            <el-input v-model="localUserName" placeholder="请输入用户名" />
          </el-form-item>
          <el-button type="primary" @click="saveProfile">保存用户名</el-button>
        </el-form>
      </div>

      <!-- 密码修改 -->
      <div class="section-card">
        <h4 class="section-title">密码修改</h4>
        <el-form
          ref="passwordFormRef"
          :model="passwordForm"
          :rules="passwordRules"
          label-position="top"
        >
          <el-form-item label="原密码" prop="oldPassword">
            <el-input v-model="passwordForm.oldPassword" type="password" show-password />
          </el-form-item>
          <el-form-item label="新密码" prop="newPassword">
            <el-input v-model="passwordForm.newPassword" type="password" show-password />
          </el-form-item>
          <el-form-item label="确认新密码" prop="confirmPassword">
            <el-input v-model="passwordForm.confirmPassword" type="password" show-password />
          </el-form-item>
          <el-button type="success" @click="updatePassword">更新密码</el-button>
        </el-form>
      </div>
    </div>

    <!-- 头像裁剪弹框 -->
    <el-dialog
      v-model="cropDialogVisible"
      title="裁剪头像"
      width="520px"
      append-to-body
      destroy-on-close
      @closed="closeCropDialog"
    >
      <div class="crop-container">
        <img ref="imageForCropRef" :src="cropImageUrl" alt="待裁剪头像" />
      </div>
      <template #footer>
        <el-button @click="closeCropDialog">取消</el-button>
        <el-button type="primary" @click="confirmCrop">确认裁剪</el-button>
      </template>
    </el-dialog>
  </el-dialog>
</template>

<style scoped lang="scss">
.profile-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 8px 0;
}

/* ---- 头像区域 ---- */
.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.avatar-wrapper {
  position: relative;
  display: inline-block;

  .avatar-edit-btn {
    position: absolute;
    right: -2px;
    bottom: -2px;
    width: 26px;
    height: 26px;
    border-radius: 50%;
    border: 2px solid #fff;
    background: #409eff;
    color: #fff;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 6px rgba(64, 158, 255, 0.4);
    transition: transform 0.2s;

    &:hover {
      transform: scale(1.15);
    }

    .edit-icon {
      font-size: 12px;
      line-height: 1;
    }
  }
}

.avatar-hint {
  margin: 0;
  font-size: 12px;
  color: #94a3b8;
}

.hidden-input {
  display: none;
}

/* ---- 分区卡片 ---- */
.section-card {
  width: 100%;
  max-width: 400px;
  padding: 16px 20px;
  border-radius: 10px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
}

.section-title {
  margin: 0 0 14px;
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
  padding-bottom: 10px;
  border-bottom: 1px solid #e2e8f0;
}

.section-card {
  :deep(.el-form-item__label) {
    font-weight: 500;
  }

  :deep(.el-button) {
    width: 100%;
  }
}

/* ---- 裁剪弹框 ---- */
.crop-container {
  width: 100%;
  height: 360px;
  overflow: hidden;

  img {
    max-width: 100%;
    display: block;
  }
}
</style>

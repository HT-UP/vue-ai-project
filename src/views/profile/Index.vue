<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref } from 'vue'
import { useRouter } from 'vue-router'
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'

const router = useRouter()
const userName = ref('科研管理员')

const avatarUrl = ref(
  localStorage.getItem('rms-avatar') ??
    'https://api.dicebear.com/9.x/initials/svg?seed=%E7%A7%91%E7%A0%94',
)

const profileFormRef = ref<FormInstance>()
const passwordFormRef = ref<FormInstance>()

const profileForm = ref({
  userName: userName.value,
})

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

const cropDialogVisible = ref(false)
const cropImageUrl = ref('')
const imageForCropRef = ref<HTMLImageElement>()
const fileInputRef = ref<HTMLInputElement>()
let cropper: Cropper | null = null

const goDashboard = () => {
  router.push('/dashboard')
}

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
  avatarUrl.value = base64
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

const saveProfile = async () => {
  const valid = await profileFormRef.value?.validate().catch(() => false)
  if (!valid) return
  userName.value = profileForm.value.userName
  ElMessage.success('用户名保存成功')
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
  <el-card shadow="never" class="profile-card">
    <template #header>
      <div class="card-header">
        <span>账号信息</span>
        <el-button text type="primary" @click="goDashboard">返回首页</el-button>
      </div>
    </template>

    <div class="avatar-row">
      <el-avatar :size="84" :src="avatarUrl">研</el-avatar>
      <div class="avatar-actions">
        <el-button type="primary" plain @click="openUpload">更换头像</el-button>
        <p>支持 JPG / PNG，建议 1:1 比例</p>
      </div>
    </div>

    <input
      ref="fileInputRef"
      class="hidden-input"
      type="file"
      accept="image/*"
      @change="handleFileChange"
    />

    <el-form ref="profileFormRef" :model="profileForm" label-position="top">
      <el-form-item label="用户名" prop="userName">
        <el-input v-model="profileForm.userName" placeholder="请输入用户名" />
      </el-form-item>
      <el-button type="primary" @click="saveProfile">保存用户名</el-button>
    </el-form>
  </el-card>

  <el-card shadow="never" class="profile-card">
    <template #header>
      <span>密码修改</span>
    </template>
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
  </el-card>

  <el-dialog
    v-model="cropDialogVisible"
    title="裁剪头像"
    width="520px"
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
</template>

<style scoped lang="scss">
.profile-card {
  margin-bottom: 16px;

  :deep(.el-card__body) {
    max-width: 720px;
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.avatar-row {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.avatar-actions p {
  margin: 8px 0 0;
  font-size: 12px;
  color: #64748b;
}

.hidden-input {
  display: none;
}

.crop-container {
  width: 100%;
  height: 360px;
  overflow: hidden;

  img {
    max-width: 100%;
    display: block;
  }
}

@media (max-width: 992px) {
  .avatar-row {
    align-items: flex-start;
  }
}
</style>

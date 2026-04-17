<script setup lang="ts">
import { onBeforeUnmount, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { User, Lock, Iphone, Message } from '@element-plus/icons-vue'

type AuthTab = 'login' | 'register'
type LoginMode = 'password' | 'wechat' | 'sms'

const activeTab = ref<AuthTab>('login')
const loginMode = ref<LoginMode>('password')
const loginFormRef = ref<FormInstance>()
const smsFormRef = ref<FormInstance>()
const registerFormRef = ref<FormInstance>()
const countdown = ref(0)
let timer: number | null = null
const router = useRouter()

const loginForm = reactive({
  account: '',
  password: '',
})

const smsForm = reactive({
  phone: '',
  code: '',
})

const registerForm = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const loginRules: FormRules = {
  account: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}

const smsRules: FormRules = {
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1\d{10}$/, message: '请输入正确的11位手机号', trigger: ['blur', 'change'] },
  ],
  code: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
}

const registerRules: FormRules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: ['blur', 'change'] },
  ],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  confirmPassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    {
      validator: (_rule, value, callback) => {
        if (value !== registerForm.password) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: ['blur', 'change'],
    },
  ],
}

const startCountdown = () => {
  countdown.value = 60
  timer = window.setInterval(() => {
    countdown.value -= 1
    if (countdown.value <= 0 && timer !== null) {
      clearInterval(timer)
      timer = null
    }
  }, 1000)
}

const handleSendCode = async () => {
  const valid = await smsFormRef.value?.validateField('phone').catch(() => false)
  if (!valid) return
  if (countdown.value > 0) return
  ElMessage.success(`验证码已发送至 ${smsForm.phone}`)
  startCountdown()
}

const handleLogin = async () => {
  if (loginMode.value === 'password') {
    const valid = await loginFormRef.value?.validate().catch(() => false)
    if (!valid) return
    ElMessage.success(`欢迎回来，${loginForm.account}`)
    router.push('/dashboard')
    return
  }

  if (loginMode.value === 'sms') {
    const valid = await smsFormRef.value?.validate().catch(() => false)
    if (!valid) return
    ElMessage.success(`手机号 ${smsForm.phone} 登录成功`)
    router.push('/dashboard')
    return
  }

  ElMessage.success('微信扫码登录成功')
  router.push('/dashboard')
}

const handleRegister = async () => {
  const valid = await registerFormRef.value?.validate().catch(() => false)
  if (!valid) return
  ElMessage.success(`注册成功，欢迎你，${registerForm.name}`)
}

onBeforeUnmount(() => {
  if (timer !== null) {
    clearInterval(timer)
    timer = null
  }
})
</script>

<template>
  <div class="page">
    <el-card class="auth-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <div>
            <h2>科研管理系统</h2>
            <p>Research Management System</p>
          </div>
        </div>
      </template>

      <el-tabs v-model="activeTab" class="auth-tabs" stretch>
        <el-tab-pane label="登录" name="login">
          <el-segmented
            v-model="loginMode"
            class="login-mode-selector"
            :options="[
              { label: '账号密码', value: 'password' },
              { label: '微信二维码', value: 'wechat' },
              { label: '手机验证码', value: 'sms' },
            ]"
          />

          <el-form
            v-if="loginMode === 'password'"
            ref="loginFormRef"
            :model="loginForm"
            :rules="loginRules"
            label-position="top"
          >
            <el-form-item label="账号" prop="account">
              <el-input v-model="loginForm.account" placeholder="请输入账号" clearable>
                <template #prefix>
                  <el-icon><User /></el-icon>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input
                v-model="loginForm.password"
                type="password"
                show-password
                placeholder="请输入密码"
              >
                <template #prefix>
                  <el-icon><Lock /></el-icon>
                </template>
              </el-input>
            </el-form-item>
          </el-form>

          <div v-else-if="loginMode === 'wechat'" class="wechat-login-box">
            <div class="qr-wrapper">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=ResearchLogin" alt="微信登录二维码" />
            </div>
            <p>请使用微信扫码登录</p>
            <el-text type="info">扫码后请在手机端确认登录</el-text>
          </div>

          <el-form
            v-else
            ref="smsFormRef"
            :model="smsForm"
            :rules="smsRules"
            label-position="top"
          >
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="smsForm.phone" placeholder="请输入手机号" clearable>
                <template #prefix>
                  <el-icon><Iphone /></el-icon>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item label="验证码" prop="code">
              <el-input v-model="smsForm.code" placeholder="请输入验证码">
                <template #prefix>
                  <el-icon><Iphone /></el-icon>
                </template>
                <template #append>
                  <el-button :disabled="countdown > 0" @click="handleSendCode">
                    {{ countdown > 0 ? `${countdown}s 后重试` : '获取验证码' }}
                  </el-button>
                </template>
              </el-input>
            </el-form-item>
          </el-form>

          <el-button type="primary" class="submit-btn" @click="handleLogin">登录</el-button>
        </el-tab-pane>

        <el-tab-pane label="注册" name="register">
          <el-form
            ref="registerFormRef"
            :model="registerForm"
            :rules="registerRules"
            label-position="top"
          >
            <el-form-item label="姓名" prop="name">
              <el-input v-model="registerForm.name" placeholder="请输入姓名" clearable>
                <template #prefix>
                  <el-icon><User /></el-icon>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="registerForm.email" placeholder="请输入邮箱" clearable>
                <template #prefix>
                  <el-icon><Message /></el-icon>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input
                v-model="registerForm.password"
                type="password"
                show-password
                placeholder="请输入密码"
              >
                <template #prefix>
                  <el-icon><Lock /></el-icon>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="confirmPassword">
              <el-input
                v-model="registerForm.confirmPassword"
                type="password"
                show-password
                placeholder="请再次输入密码"
              >
                <template #prefix>
                  <el-icon><Lock /></el-icon>
                </template>
              </el-input>
            </el-form-item>
            <el-button type="success" class="submit-btn" @click="handleRegister">注册</el-button>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background:
    linear-gradient(rgba(8, 20, 45, 0.62), rgba(15, 23, 42, 0.52)),
    url('https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=2000&q=80')
      center / cover no-repeat;
}

.auth-card {
  width: 460px;
  max-width: 100%;
  border-radius: 12px;
}

:deep(.el-card) {
  .el-card__body {
    padding-top: 0;
  }
}

.card-header h2 {
  margin: 0;
  color: #1f2d3d;
  font-size: 24px;
}

.card-header p {
  margin: 6px 0 0;
  color: #6b7785;
  font-size: 13px;
}

.auth-tabs {
  margin-top: 4px;
}

.login-mode-selector {
  width: 100%;
  margin-bottom: 18px;
}

.wechat-login-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 8px 0 16px;

  p {
    margin: 0;
    font-size: 14px;
    color: #1f2d3d;
  }
}

.qr-wrapper {
  width: 220px;
  height: 220px;
  padding: 10px;
  border: 1px solid #dce3ee;
  border-radius: 10px;
  background: #fff;
  box-shadow: 0 6px 16px rgba(31, 45, 61, 0.08);

  img {
    width: 100%;
    height: 100%;
    display: block;
    border-radius: 6px;
  }
}

.submit-btn {
  width: 100%;
  margin-top: 8px;
}
</style>

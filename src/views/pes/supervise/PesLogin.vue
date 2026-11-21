<template>
  <div class="pes-login">
    <h1 class="sys-title">安徽省农药数字监督管理系统</h1>

    <div class="card">
      <div class="card-left">
        <img src="/pes/login-panel.png" alt="">
      </div>
      <div class="card-right">
        <el-form class="form" @submit.prevent="doLogin">
          <el-form-item>
            <el-input v-model="account" placeholder="请输入用户名">
              <template #prefix><el-icon><User /></el-icon></template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="password" type="password" show-password placeholder="请输入密码" @keyup.enter="doLogin">
              <template #prefix><el-icon><Lock /></el-icon></template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <div class="captcha-row">
              <el-input v-model="captcha" placeholder="请输入验证码" @keyup.enter="doLogin">
                <template #prefix><el-icon><Picture /></el-icon></template>
              </el-input>
              <button class="captcha-box" type="button" title="点击刷新" @click="refreshCaptcha">{{ captchaText }}</button>
            </div>
          </el-form-item>
          <div class="extra">
            <el-checkbox v-model="remember">记住密码</el-checkbox>
            <button class="forgot" type="button" @click="onForgot">找回登录名/密码</button>
          </div>
          <el-button class="login-btn" @click="doLogin" :loading="loading">登录</el-button>
        </el-form>
      </div>
    </div>
    <div class="tech">技术支持：信联信息发展股份有限公司 (配套代码300489)</div>
    <button class="producer-entry" type="button" @click="$router.push('/pes/producer/login')">生产单位填报入口（招标补齐）</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()
const account = ref('')
const password = ref('')
const captcha = ref('')
const captchaText = ref('')
const remember = ref(false)
const loading = ref(false)

function refreshCaptcha() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  captchaText.value = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}
refreshCaptcha()

function onForgot() {
  ElMessage.info('找回登录名/密码流程待观察')
}

const doLogin = () => {
  if (!account.value || !password.value) return ElMessage.warning('请输入用户名和密码')
  if (!captcha.value) return ElMessage.warning('请输入验证码')
  if (captcha.value.toUpperCase() !== captchaText.value) {
    ElMessage.warning('验证码不正确')
    refreshCaptcha()
    return
  }
  loading.value = true
  setTimeout(() => {
    userStore.login('province')
    loading.value = false
    router.push('/pes/home')
  }, 400)
}
</script>

<style lang="scss" scoped>
.pes-login {
  height: 100%;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #7eb8e8 url('/pes/login-bg.jpg') center / cover no-repeat;
}
.sys-title {
  position: relative;
  z-index: 1;
  margin: 0 0 22px;
  color: #fff;
  font-size: 32px;
  font-weight: 700;
  letter-spacing: 4px;
  text-shadow: 0 2px 8px rgba(20, 60, 90, 0.35);
}
.card {
  position: relative;
  z-index: 1;
  width: 750px;
  max-width: calc(100% - 40px);
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 10px 28px rgba(20, 50, 80, 0.16);
  display: flex;
  overflow: hidden;
  min-height: 374px;
}
.card-left {
  width: 50%;
  background: #2db354;
  display: flex;
  align-items: stretch;
  justify-content: stretch;
  overflow: hidden;
}
.card-left img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.card-right {
  flex: 1;
  padding: 36px 36px 28px;
  display: flex;
  align-items: center;
}
.form { width: 100%; }
.form :deep(.el-form-item) { margin-bottom: 18px; }
.form :deep(.el-input__wrapper) {
  box-shadow: none !important;
  border-radius: 0;
  background: transparent;
  border-bottom: 1px solid #E4E7ED;
  padding-left: 0;
}
.form :deep(.el-input__wrapper:hover),
.form :deep(.el-input__wrapper.is-focus) {
  box-shadow: none !important;
  border-bottom-color: #32900E;
}
.form :deep(.el-input__prefix) { color: #C0C4CC; }
.captcha-row { display: flex; gap: 12px; width: 100%; align-items: flex-end; }
.captcha-row :deep(.el-input) { flex: 1; }
.captcha-box {
  width: 108px;
  height: 36px;
  flex-shrink: 0;
  border: 1px solid #dcdfe6;
  border-radius: 2px;
  background: repeating-linear-gradient(135deg, #f6f8f6, #f6f8f6 8px, #e8eee8 8px, #e8eee8 16px);
  color: #32900E;
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 4px;
  cursor: pointer;
}
.extra {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 4px 0 22px;
}
.extra :deep(.el-checkbox__label) { color: #32900E; font-size: 13px; }
.extra :deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background: #32900E;
  border-color: #32900E;
}
.extra :deep(.el-checkbox__inner) { border-color: #32900E; }
.forgot {
  border: 0;
  background: none;
  color: #32900E;
  cursor: pointer;
  font-size: 13px;
}
.login-btn {
  width: 100%;
  height: 40px;
  background: #32900E !important;
  border-color: #32900E !important;
  color: #fff !important;
  border-radius: 20px;
  font-size: 15px;
  letter-spacing: 6px;
}
.login-btn:hover { background: #2b7d0c !important; border-color: #2b7d0c !important; }
.tech {
  position: relative;
  z-index: 1;
  margin-top: 16px;
  color: #fff;
  font-size: 12px;
  text-shadow: 0 1px 3px rgba(20, 50, 20, 0.45);
}
.producer-entry {
  position: relative;
  z-index: 1;
  margin-top: 10px;
  border: 0;
  background: none;
  color: #fff;
  cursor: pointer;
  font-size: 13px;
  text-decoration: underline;
  text-shadow: 0 1px 3px rgba(20, 50, 20, 0.45);
}
</style>

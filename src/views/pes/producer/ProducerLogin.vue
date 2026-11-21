<template>
  <div class="pes-login">
    <h1 class="sys-title">农药生产电子台账填报</h1>
    <p class="sys-sub">生产单位专用入口（演示）</p>

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
          <el-button class="login-btn" @click="doLogin" :loading="loading">登录</el-button>
          <button class="back-link" type="button" @click="$router.push('/pes/login')">返回监管端登录</button>
        </el-form>
      </div>
    </div>
    <div class="tech">演示环境：账号、密码、验证码任意填写即可</div>
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
const loading = ref(false)

function refreshCaptcha() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  captchaText.value = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}
refreshCaptcha()

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
    userStore.login('pes_producer')
    loading.value = false
    router.push('/pes/producer/ledger')
  }, 300)
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
  margin: 0;
  color: #fff;
  font-size: 32px;
  font-weight: 700;
  letter-spacing: 4px;
  text-shadow: 0 2px 8px rgba(20, 60, 90, 0.35);
}
.sys-sub {
  position: relative;
  z-index: 1;
  margin: 8px 0 22px;
  color: #f3fff3;
  font-size: 14px;
  letter-spacing: 1px;
  text-shadow: 0 1px 3px rgba(20, 50, 20, 0.45);
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
.back-link {
  display: block;
  width: 100%;
  margin-top: 14px;
  border: 0;
  background: none;
  color: #32900E;
  cursor: pointer;
  font-size: 13px;
}
.tech {
  position: relative;
  z-index: 1;
  margin-top: 16px;
  color: #fff;
  font-size: 12px;
  text-shadow: 0 1px 3px rgba(20, 50, 20, 0.45);
}
</style>

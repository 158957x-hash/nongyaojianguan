<template>
  <div class="retail-login">
    <div class="brand-block">
      <h1 class="brand">农资大掌柜</h1>
      <p class="sub"><i></i><span>安徽省农药经营电子台账系统</span><i></i></p>
    </div>

    <div class="stage">
      <div class="card">
        <h2>欢迎登录</h2>
        <input v-model="account" class="field" type="text" autocomplete="off" placeholder="输入登录名">
        <input v-model="password" class="field" type="password" autocomplete="off" placeholder="输入密码" @keyup.enter="enter">
        <div class="row">
          <label class="remember"><input v-model="remember" type="checkbox"> 记住密码</label>
          <button type="button" class="link-green" @click="openDemoFill('注册账号')">注册账号</button>
        </div>
        <button type="button" class="login" @click="enter">登录</button>
        <button type="button" class="forgot" @click="openDemoFill('找回登录名密码')">找回登录名密码 &gt;&gt;</button>
      </div>
      <button type="button" class="help" @click="openDemoFill('在线帮助')" title="在线帮助">
        <span class="wx" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="28" height="28">
            <path fill="#fff" d="M9.5 4.2c-3.9 0-7 2.8-7 6.2 0 1.9 1 3.6 2.6 4.8l-.6 2.3 2.5-1.3c.7.2 1.5.3 2.3.3.3 0 .6 0 .9-.1-.2-.6-.3-1.2-.3-1.8 0-3.5 3.3-6.3 7.3-6.3.3 0 .6 0 .9.1C16.9 6.2 13.5 4.2 9.5 4.2zm-1.8 3.6a.9.9 0 1 1 0 1.8.9.9 0 0 1 0-1.8zm4.4 0a.9.9 0 1 1 0 1.8.9.9 0 0 1 0-1.8z"/>
            <path fill="#fff" d="M21.4 14.6c0-2.8-2.7-5.1-6-5.1s-6 2.3-6 5.1 2.7 5.1 6 5.1c.6 0 1.2-.1 1.8-.2l2.1 1.1-.5-1.9c1.6-1 2.6-2.5 2.6-4.1zm-7.7-1.1a.7.7 0 1 1 0-1.4.7.7 0 0 1 0 1.4zm3.6 0a.7.7 0 1 1 0-1.4.7.7 0 0 1 0 1.4z"/>
          </svg>
        </span>
        <span>在线帮助</span>
      </button>
    </div>

    <p class="desk">将系统 <button type="button" class="desk-link" @click="openDemoFill('保存到电脑桌面')">保存到电脑桌面</button>，方便下次打开</p>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { openDemoFill } from '@/components/pes/pesActions'

const router = useRouter()
const userStore = useUserStore()
const account = ref('')
const password = ref('')
const remember = ref(false)


function enter() {
  if (typeof userStore.login === 'function') {
    try { userStore.login('pes_operator') } catch (e) { /* 演示进入 */ }
  }
  router.push('/pes/retail/cashier')
}
</script>
<style scoped>
.retail-login {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 16px 56px;
  background: #6aa43a url('/pes/retail-login-bg.jpg') center / cover no-repeat;
  position: relative;
  box-sizing: border-box;
}
.brand-block {
  text-align: center;
  color: #fff;
  margin-bottom: 22px;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
}
.brand {
  margin: 0;
  font-size: 72px;
  font-weight: 700;
  letter-spacing: 10px;
  line-height: 1.15;
  font-family: "Microsoft YaHei", "PingFang SC", "Noto Sans SC", sans-serif;
}
.sub {
  margin: 10px 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  font-size: 18px;
  letter-spacing: 2px;
  font-weight: 400;
}
.sub i {
  display: inline-block;
  width: 72px;
  height: 1px;
  background: rgba(255, 255, 255, 0.85);
}
.stage {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
.card {
  width: 420px;
  padding: 28px 36px 22px;
  border-radius: 6px;
  background: rgba(40, 55, 45, 0.42);
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.18);
  backdrop-filter: blur(2px);
  text-align: center;
}
.card h2 {
  margin: 0 0 18px;
  color: #fff;
  font-size: 22px;
  font-weight: 500;
  letter-spacing: 2px;
}
.field {
  display: block;
  width: 100%;
  height: 40px;
  margin: 0 0 14px;
  padding: 0 12px;
  border: 0;
  border-radius: 2px;
  background: #fff;
  font-size: 14px;
  color: #303133;
  box-sizing: border-box;
}
.field::placeholder { color: #C0C4CC; }
.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 2px 0 16px;
  font-size: 13px;
}
.remember {
  color: #fff;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  user-select: none;
}
.remember input { margin: 0; }
.link-green {
  border: 0;
  background: transparent;
  color: #7CFF9A;
  cursor: pointer;
  font-size: 13px;
  padding: 0;
}
.login {
  width: 100%;
  height: 42px;
  border: 0;
  border-radius: 3px;
  background: #31B854;
  color: #fff;
  font-size: 16px;
  letter-spacing: 4px;
  cursor: pointer;
}
.login:hover { background: #2aa64b; }
.forgot {
  display: block;
  margin: 16px auto 4px;
  border: 0;
  background: transparent;
  color: #F5C518;
  cursor: pointer;
  font-size: 13px;
}
.help {
  position: absolute;
  left: calc(100% + 18px);
  top: 50%;
  transform: translateY(-20%);
  width: 74px;
  border: 0;
  background: transparent;
  color: #fff;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  text-shadow: 0 1px 4px rgba(0,0,0,.3);
}
.wx {
  width: 52px;
  height: 52px;
  border-radius: 10px;
  background: #31B854;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0,0,0,.2);
}
.desk {
  margin: 18px 0 0;
  color: #fff;
  font-size: 14px;
  text-shadow: 0 1px 4px rgba(0,0,0,.35);
}
.desk-link {
  border: 0;
  background: transparent;
  color: #F5C518;
  cursor: pointer;
  font-size: 14px;
  padding: 0;
  text-decoration: underline;
}
</style>

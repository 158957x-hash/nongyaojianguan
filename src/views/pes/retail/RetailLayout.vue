<template>
  <div class="retail-app">
    <header class="top">
      <div class="left">
        <img class="logo" src="/pes/retail-logo.png" alt="">
        <nav class="nav">
          <router-link to="/pes/retail/businessOverview" class="item">
            经营概况 <sup class="badge">{{ badge }}</sup>
          </router-link>
          <router-link to="/pes/retail/cashier" class="item">收银台</router-link>
          <router-link to="/pes/retail/purchasing" class="item">采购入库</router-link>
          <router-link to="/pes/retail/productStorage" class="item">废弃物回收</router-link>
          <button type="button" class="item" @click="moreOpen = true">更多</button>
        </nav>
      </div>
      <div class="right">
        <button type="button" class="dl" @click="appOpen = true">下载手机版</button>
        <span class="store">{{ store }}</span>
        <button type="button" class="link" @click="openDemoFill('我要帮助')">我要帮助</button>
        <button type="button" class="link" @click="openDemoFill('修改密码', { kind: 'password' })">修改密码</button>
        <button type="button" class="link" @click="logout">退出系统</button>
      </div>
    </header>
    <main class="main">
      <router-view />
    </main>

    <el-dialog v-model="moreOpen" width="860px" append-to-body class="more-dlg" :show-close="false">
      <div class="more-head">
        <label class="auto"><input type="checkbox" v-model="autoPrint"> 自动打印小票</label>
        <el-button @click="moreOpen = false">关闭窗口</el-button>
      </div>
      <div class="cards">
        <button v-for="c in cards" :key="c.key" type="button" class="card" @click="go(c.to)">
          <h3>{{ c.title }}</h3>
          <p>{{ c.desc }}</p>
        </button>
      </div>
    </el-dialog>

    <el-dialog v-model="appOpen" title="下载手机版" width="480px" append-to-body>
      <p class="app-hint">原农资台账一体机上的功能已迁至皖政通和皖企通，可从这里进入演示页。</p>
      <div class="app-cards">
        <button type="button" class="app-card" @click="openApp('/mobile/wanzhengtong')">
          <h3>皖政通</h3>
          <p>先进入系统首页，再打开农药录入等功能</p>
        </button>
        <button type="button" class="app-card" @click="openApp('/mobile/wanqitong')">
          <h3>皖企通</h3>
          <p>先进入系统首页，再打开查真伪、入库和销售台账等功能</p>
        </button>
      </div>
    </el-dialog>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { openDemoFill } from '@/components/pes/pesActions'
import { DEMO_STORE, MORE_CARDS } from './retailData'

const router = useRouter()
const userStore = useUserStore()
const store = DEMO_STORE
const badge = 1
const moreOpen = ref(false)
const appOpen = ref(false)
const autoPrint = ref(false)
const cards = MORE_CARDS

function go(to) {
  moreOpen.value = false
  router.push(to)
}
function openApp(to) {
  appOpen.value = false
  router.push(to)
}
function logout() {
  if (typeof userStore.logout === 'function') userStore.logout()
  router.push('/pes/retail/login')
}
</script>
<style scoped>
.retail-app { min-height: 100vh; background: #F3F6F4; color: #303133; font-size: 13px; display: flex; flex-direction: column; }
.top {
  height: 64px;
  background: #31B854;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px 0 8px;
  color: #fff;
}
.left { display: flex; align-items: center; min-width: 0; height: 100%; }
.logo { height: 36px; width: auto; margin: 0 10px 0 6px; display: block; }
.nav { display: flex; align-items: center; height: 100%; gap: 8px; }
.item {
  color: #fff;
  text-decoration: none;
  padding: 0 16px;
  height: 40px;
  display: flex;
  align-items: center;
  position: relative;
  border: 0;
  background: #1CA43F;
  border-radius: 8px;
  cursor: pointer;
  font: inherit;
  font-size: 14px;
}
.item.router-link-active {
  background: #41D166;
  color: #fff;
  font-weight: 700;
}
.badge {
  position: absolute;
  top: 4px;
  right: 6px;
  min-width: 14px;
  height: 14px;
  background: #E31C23;
  color: #fff;
  border-radius: 8px;
  font-size: 10px;
  line-height: 14px;
  text-align: center;
}
.right { display: flex; align-items: center; gap: 10px; min-width: 0; }
.dl {
  background: #F5AC46;
  color: #fff;
  border: 0;
  border-radius: 4px;
  padding: 6px 10px;
  cursor: pointer;
  font-weight: 600;
}
.store { font-weight: 600; }
.link { border: 0; background: transparent; color: #fff; cursor: pointer; font: inherit; }
.main { flex: 1; padding: 12px; }
.more-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.auto { color: #303133; }
.cards { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.card {
  text-align: left;
  border: 1px solid #E5EAF0;
  background: #fff;
  padding: 16px 18px;
  cursor: pointer;
  border-radius: 4px;
}
.card h3 { margin: 0 0 6px; font-size: 15px; color: #16351E; }
.card p { margin: 0; color: #7A8594; line-height: 1.6; }

.app-hint { margin: 0 0 14px; color: #5a6d85; line-height: 1.6; }
.app-cards { display: grid; gap: 10px; }
.app-card {
  text-align: left;
  border: 1px solid #E5EAF0;
  background: #fff;
  padding: 14px 16px;
  cursor: pointer;
  border-radius: 4px;
}
.app-card:hover { border-color: #31B854; }
.app-card h3 { margin: 0 0 6px; font-size: 15px; color: #16351E; }
.app-card p { margin: 0; color: #7A8594; line-height: 1.6; }
</style>

<template>
  <div class="producer-shell">
    <header class="top">
      <div class="left">
        <div class="brand">
          <strong>农药生产电子台账</strong>
          <span>生产单位填报 · 招标补齐</span>
        </div>
        <nav class="nav">
          <router-link to="/pes/producer/profile" class="item">企业备案</router-link>
          <router-link to="/pes/producer/products" class="item">产品登记</router-link>
          <router-link to="/pes/producer/ledger" class="item">生产批次与台账</router-link>
        </nav>
      </div>
      <div class="user">
        <em>{{ loop.producer.name }}</em>
        <button class="link" type="button" @click="router.push('/pes/roles')">切换演示角色</button>
        <button class="link" type="button" @click="logout">退出系统</button>
      </div>
    </header>
    <main class="main">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { usePesLoopStore } from '@/stores/pesLoop'

const router = useRouter()
const userStore = useUserStore()
const loop = usePesLoopStore()

function logout() {
  userStore.logout()
  router.push('/pes/producer/login')
}
</script>

<style scoped>
.producer-shell {
  min-height: 100vh;
  background: #EEF2F6;
  color: #303133;
  font-size: 13px;
  display: flex;
  flex-direction: column;
}
.top {
  height: 64px;
  background: #31B854;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px 0 12px;
  gap: 24px;
}
.left {
  display: flex;
  align-items: center;
  min-width: 0;
  height: 100%;
  gap: 20px;
}
.brand {
  display: flex;
  flex-direction: column;
  line-height: 1.25;
  min-width: 168px;
}
.brand strong { font-size: 16px; font-weight: 700; letter-spacing: 0.2px; }
.brand span { font-size: 11px; opacity: 0.88; }
.nav { display: flex; align-items: center; height: 100%; gap: 8px; }
.item {
  color: #fff;
  text-decoration: none;
  padding: 0 16px;
  height: 40px;
  display: flex;
  align-items: center;
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
.user { display: flex; align-items: center; gap: 12px; font-size: 13px; flex-shrink: 0; }
.user em { font-style: normal; font-weight: 600; }
.link {
  border: 0;
  background: transparent;
  color: #fff;
  cursor: pointer;
  font: inherit;
}
.main { flex: 1; padding: 12px 16px 24px; }
</style>

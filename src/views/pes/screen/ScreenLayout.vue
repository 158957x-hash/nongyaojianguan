<template>
  <div class="screen">
    <header class="top">
      <div class="title">安徽省农药智慧数据管理大屏</div>
      <nav>
        <router-link v-for="p in pages" :key="p.to" :to="p.to" :class="{ on: isOn(p.to) }">{{ p.title }}</router-link>
        <el-dropdown trigger="click">
          <span class="more" :class="{ on: moreOn }">更多业务</span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="$router.push('/screen/supervisionLawEnforcement')">监管执法</el-dropdown-item>
              <el-dropdown-item @click="$router.push('/screen/seed')">种子监管</el-dropdown-item>
              <el-dropdown-item @click="$router.push('/screen/fertilizer')">肥料监管</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </nav>
    </header>
    <main class="body">
      <router-view />
    </main>
  </div>
</template>
<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const pages = [
  { title: '农药概览', to: '/screen/overview' },
  { title: '农药生产', to: '/screen/produce' },
  { title: '农药经营', to: '/screen/management' },
  { title: '农药使用', to: '/screen/pesticideUse' },
  { title: '废弃物回收', to: '/screen/recycle' }
]
const moreOn = computed(() => ['/screen/supervisionLawEnforcement', '/screen/seed', '/screen/fertilizer'].includes(route.path))
function isOn(to) { return route.path === to }
</script>
<style scoped>
.screen {
  min-height: 100vh;
  background: #071526;
  color: #D6E4F0;
  font-size: 13px;
  display: flex;
  flex-direction: column;
}
.top {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  background: linear-gradient(180deg, #0C2340, #071526);
  border-bottom: 1px solid #163154;
}
.title { font-size: 20px; font-weight: 700; letter-spacing: 1px; color: #E8F4FF; }
nav { display: flex; align-items: center; gap: 4px; }
nav a, .more {
  color: #9CB0C6;
  text-decoration: none;
  padding: 8px 14px;
  cursor: pointer;
  border-bottom: 2px solid transparent;
}
nav a.on, .more.on { color: #5FE08A; border-bottom-color: #5FE08A; }
.body { flex: 1; padding: 16px 20px 24px; }
</style>

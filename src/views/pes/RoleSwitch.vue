<template>
  <div class="page">
    <header class="bar">
      <div class="title">
        <b>账户分级与角色切换</b>
        <span>演示级分级账号，不假装已对接统一身份</span>
      </div>
      <button type="button" class="back" @click="goBack">返回刚才的页面</button>
    </header>
    <div class="body">
      <p class="note">评标时在这里切换省 / 市 / 县 / 生产企业 / 经营企业。真账户集成只在说明里交代。现网监管一级菜单不随角色增删。</p>
      <p class="current">当前身份：<b>{{ currentTitle }}</b> · {{ currentUnit }} · {{ currentRegion }}</p>
      <div class="grid">
        <button
          v-for="item in accounts"
          :key="item.code"
          type="button"
          class="card"
          :class="{ on: userStore.role?.code === item.code }"
          @click="onSwitch(item)"
        >
          <strong>{{ item.title }}</strong>
          <span>{{ item.unit }}</span>
          <em>{{ item.region }}</em>
          <p>{{ item.note }}</p>
        </button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { PES_DEMO_ACCOUNTS, pesDemoAccount } from './pesDemoRoles'

const router = useRouter()
const userStore = useUserStore()
const accounts = PES_DEMO_ACCOUNTS
const current = computed(() => pesDemoAccount(userStore.role?.code))
const currentTitle = computed(() => current.value?.title || userStore.role?.roleName || '未登录')
const currentUnit = computed(() => current.value?.unit || userStore.role?.unit || '—')
const currentRegion = computed(() => current.value?.region || userStore.role?.regionName || '—')

function goBack() {
  if (window.history.length > 1) router.back()
  else router.push(current.value?.home || '/pes/home')
}

function onSwitch(item) {
  const ok = userStore.switchRole(item.code)
  if (!ok) {
    ElMessage.error('角色切换失败')
    return
  }
  ElMessage.success(`已切换为${item.title}（演示）`)
  router.push(item.home)
}
</script>
<style scoped>
.page {
  min-height: 100vh;
  background: #EEF2F6;
  color: #303133;
  font-size: 13px;
}
.bar {
  height: 56px;
  background: #fff;
  border-bottom: 1px solid #E5EAF0;
  box-shadow: inset 0 2px 0 #31B854;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  gap: 16px;
}
.title { display: flex; align-items: baseline; gap: 10px; min-width: 0; }
.bar b {
  font-size: 16px;
  font-weight: 600;
  position: relative;
  padding-left: 10px;
}
.bar b::before {
  content: "";
  position: absolute;
  left: 0;
  top: 3px;
  bottom: 3px;
  width: 3px;
  background: #1F8A4C;
  border-radius: 1px;
}
.bar span, .note, .card p { color: #667085; }
.back {
  border: 1px solid #DCDFE6;
  background: #fff;
  color: #606266;
  height: 32px;
  padding: 0 12px;
  border-radius: 2px;
  cursor: pointer;
  font: inherit;
  flex-shrink: 0;
}
.back:hover { color: #1F8A4C; border-color: #1F8A4C; }
.body { padding: 16px 20px 32px; max-width: 1080px; }
.note { margin: 0 0 12px; line-height: 1.6; }
.current {
  margin: 0 0 16px;
  padding: 10px 14px;
  background: #fff;
  border: 1px solid #E5EAF0;
  border-radius: 2px;
}
.current b { color: #1F8A4C; font-weight: 600; }
.grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
.card {
  text-align: left;
  border: 1px solid #E5EAF0;
  background: #fff;
  padding: 16px 18px;
  cursor: pointer;
  border-radius: 2px;
  color: inherit;
  font: inherit;
}
.card:hover { border-color: #31B854; }
.card.on {
  border-color: #1F8A4C;
  background: #F3FBF6;
  box-shadow: inset 3px 0 0 #1F8A4C;
}
.card strong { display: block; font-size: 16px; font-weight: 600; color: #303133; }
.card span, .card em { display: block; margin-top: 4px; font-style: normal; color: #606266; }
.card p { margin: 10px 0 0; font-size: 12px; line-height: 1.5; }
@media (max-width: 900px) { .grid { grid-template-columns: 1fr; } }
</style>

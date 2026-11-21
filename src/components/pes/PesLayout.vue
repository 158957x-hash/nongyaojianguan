<template>
  <div class="pes-app">
    <PesSidebar :collapsed="collapsed" />
    <div class="pes-right">
      <header class="pes-top">
        <div class="top-left">
          <button class="icon-btn" type="button" @click="collapsed = !collapsed">☰</button>
          <template v-if="crumbSection && crumbSection !== '首页' && pageTitle !== '首页'">
            <span class="crumb">{{ crumbSection }}</span>
            <span class="crumb-sep">/</span>
            <span class="crumb-cur">{{ pageTitle }}</span>
          </template>
          <span v-else class="crumb" @click="$router.push('/pes/home')">首页</span>
        </div>
        <div class="top-right">
          <el-popover placement="bottom-end" :width="360" trigger="click">
            <template #reference>
              <span class="top-link warn">
                实时预警
                <sup class="badge">{{ alertTotal }}</sup>
              </span>
            </template>
            <div class="alert-menu">
              <div class="alert-item" @click="openReportAlert">
                <span>上报信息异常</span>
                <sup class="badge inline">{{ reportAlertCount }}</sup>
              </div>
              <div class="alert-item" @click="openFilingAlert">
                <span>备案信息异常</span>
                <sup class="badge inline">{{ filingAlertCount }}</sup>
              </div>
              <div class="alert-item" @click="licenseVisible = true">
                <span>经营许可证过期</span>
                <sup class="badge inline">{{ licenseAlertCount }}</sup>
              </div>
            </div>
          </el-popover>
          <span class="top-link" :class="{ mark: reportUnread }" @click="openMonthly">月报</span>
          <el-popover placement="bottom-end" :width="260" trigger="click">
            <template #reference>
              <span class="top-link">技术支持</span>
            </template>
            <div class="support-pop">
              <div class="qr-ph" aria-hidden="true" />
              <p>打开微信扫一扫</p>
              <p class="sub">添加微信时，请注明“监管区域+姓名”</p>
            </div>
          </el-popover>
          <el-dropdown>
            <span class="top-link user">您好，{{ roleLabel }}</span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item disabled>个人信息待观察</el-dropdown-item>
                <el-dropdown-item @click="$router.push('/pes/roles')">切换演示角色</el-dropdown-item>
                <el-dropdown-item @click="logout">退出</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <span class="top-link" @click="openDemoFill('修改密码', { kind: 'password' })">修改密码</span>
        </div>
      </header>
      <div class="pes-tabs">
        <div
          v-for="tab in tabs"
          :key="tab.path"
          class="tab"
          :class="{ active: tab.path === route.path }"
          @click="$router.push(tab.path)"
        >
          {{ tab.title }}
          <i v-if="tab.path !== '/pes/home'" class="tab-close" @click.stop="closeTab(tab.path)">×</i>
        </div>
        <button class="close-all" type="button" @click="closeAllTabs">关闭所有页面</button>
      </div>
      <main class="pes-main" :class="{ immersive, supplement }">
        <router-view />
      </main>
      <footer class="pes-footer">技术支持：信联信息发展股份有限公司 服务热线：400-7200100</footer>
    </div>

    <el-dialog v-model="reportAlertVisible" title="上报信息异常" width="480px" append-to-body>
      <div class="alert-block">
        <h4>农药进货数据</h4>
        <p>
          <button type="button" class="cell-link" @click="goWare(1, '零售')">零售（{{ counts.inRetail }}）</button>
          <button type="button" class="cell-link" @click="goWare(1, '批发')">批发（{{ counts.inWhole }}）</button>
        </p>
      </div>
      <div class="alert-block">
        <h4>农药销售数据</h4>
        <p>
          <button type="button" class="cell-link" @click="goWare(2, '零售')">零售（{{ counts.outRetail }}）</button>
          <button type="button" class="cell-link" @click="goWare(2, '批发')">批发（{{ counts.outWhole }}）</button>
        </p>
      </div>
    </el-dialog>

    <el-dialog v-model="filingVisible" title="备案信息异常" width="420px" append-to-body>
      <div class="subject-tiles">
        <button type="button" class="tile" @click="goEnterprise('零售商', true)">
          <div class="tile-box">加载失败<sup class="badge">{{ counts.filingRetail }}</sup></div>
          <div class="tile-name">零售主体</div>
        </button>
        <button type="button" class="tile" @click="goEnterprise('批发商', true)">
          <div class="tile-box">加载失败<sup class="badge">{{ counts.filingWhole }}</sup></div>
          <div class="tile-name">批发主体</div>
        </button>
      </div>
    </el-dialog>

    <el-dialog v-model="licenseVisible" title="营业执照异常" width="420px" append-to-body>
      <div class="subject-tiles">
        <button type="button" class="tile" @click="goEnterprise('零售商', false)">
          <div class="tile-box">零售主体<sup class="badge">{{ counts.licenseRetail }}</sup></div>
        </button>
        <button type="button" class="tile" @click="goEnterprise('批发商', false)">
          <div class="tile-box">批发主体<sup class="badge">{{ counts.licenseWhole }}</sup></div>
        </button>
      </div>
    </el-dialog>

    <el-dialog v-model="monthlyVisible" title="安徽省农药监督管理平台 10月度数据报告" width="640px" append-to-body>
      <div class="monthly">
        <section>
          <h4>生产信息</h4>
          <p>登记：—　上报：—　环比：—</p>
        </section>
        <section>
          <h4>经营信息</h4>
          <p>户数：—　上报户：—　条数：—　占比：—　环比升降：—</p>
        </section>
        <section>
          <h4>使用信息</h4>
          <p>主体：—　条数：—</p>
        </section>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PesSidebar from './PesSidebar.vue'
import { useUserStore } from '@/stores/user'
import { openDemoFill } from './pesActions'
import { MENU_CONFIG } from '@/router/menu'
import { pesDemoLabel } from '@/views/pes/pesDemoRoles'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const collapsed = ref(false)
const pageTitle = computed(() => route.meta?.title || '首页')
const roleLabel = computed(() => pesDemoLabel(userStore.role?.code) || '演示监管员')
const immersive = computed(() => ['/pes/cockpit', '/pes/onemap'].includes(route.path))
const supplement = computed(() => ['/pes/trace', '/pes/products', '/pes/recycle', '/pes/cockpit', '/pes/onemap', '/pes/interconnect'].includes(route.path))
const tabs = ref([{ path: '/pes/home', title: '首页' }])

const counts = {
  inRetail: 3,
  inWhole: 2,
  outRetail: 4,
  outWhole: 1,
  filingRetail: 2,
  filingWhole: 1,
  licenseRetail: 3,
  licenseWhole: 2
}
const reportAlertCount = counts.inRetail + counts.inWhole + counts.outRetail + counts.outWhole
const filingAlertCount = counts.filingRetail + counts.filingWhole
const licenseAlertCount = counts.licenseRetail + counts.licenseWhole
const alertTotal = reportAlertCount + filingAlertCount + licenseAlertCount
const crumbSection = computed(() => {
  const pes = MENU_CONFIG.find((s) => s.system === 'pes')
  const item = pes?.children?.find((c) => c.route === route.path)
  return item?.section || ''
})

const reportUnread = ref(true)
const reportAlertVisible = ref(false)
const filingVisible = ref(false)
const licenseVisible = ref(false)
const monthlyVisible = ref(false)

watch(
  () => route.fullPath,
  () => {
    const path = route.path
    if (path.startsWith('/screen')) return
    const title = route.meta?.title || '页面'
    if (!tabs.value.some((t) => t.path === path)) tabs.value.push({ path, title })
  },
  { immediate: true }
)

function closeTab(path) {
  tabs.value = tabs.value.filter((t) => t.path !== path)
  if (route.path === path) router.push(tabs.value[tabs.value.length - 1]?.path || '/pes/home')
}
function closeAllTabs() {
  tabs.value = [{ path: '/pes/home', title: '首页' }]
  router.push('/pes/home')
}
function logout() {
  if (typeof userStore.logout === 'function') userStore.logout()
  router.push('/pes/login')
}
function openMonthly() {
  monthlyVisible.value = true
  reportUnread.value = false
}
function openReportAlert() { reportAlertVisible.value = true }
function openFilingAlert() { filingVisible.value = true }
function goWare(type, side) {
  reportAlertVisible.value = false
  const path = type === 1 ? '/pes/operation/purchases' : '/pes/operation/sales'
  router.push({ path, query: { alert: '1', side } })
}
function goEnterprise(side, filing) {
  filingVisible.value = false
  licenseVisible.value = false
  const query = { side }
  if (filing) query.filing = '1'
  router.push({ path: '/pes/operation/enterprises', query })
}
</script>

<style lang="scss" scoped>
.pes-app {
  display: flex;
  height: 100%;
  min-height: 100vh;
  background: #EEF2F6;
  color: #303133;
  font-size: 13px;
}
.pes-right { flex: 1; display: flex; flex-direction: column; min-width: 0; }
.pes-top {
  height: 44px;
  flex-shrink: 0;
  background: #fff;
  border-bottom: 1px solid #E5EAF0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
}
.top-left, .top-right { display: flex; align-items: center; gap: 14px; }
.icon-btn {
  border: 0;
  background: transparent;
  cursor: pointer;
  font-size: 16px;
  color: #5a6d85;
}
.crumb { color: #5a6d85; cursor: pointer; }
.crumb:hover { color: #1F8A4C; }
.crumb-sep { color: #C0C4CC; }
.crumb-cur { color: #303133; }
.top-link {
  color: #5a6d85;
  cursor: pointer;
  font-size: 13px;
  position: relative;
  &.user { outline: none; }
  &:hover { color: #1F8A4C; }
}
.warn { color: #5a6d85; }
.badge {
  position: absolute;
  top: -6px;
  right: -10px;
  min-width: 14px;
  height: 14px;
  padding: 0 3px;
  background: #D94A4A;
  color: #fff;
  border-radius: 8px;
  font-size: 10px;
  line-height: 14px;
  text-align: center;
  &.inline { position: static; margin-left: 6px; }
}
.mark::after {
  content: '*';
  display: inline-block;
  margin-left: 2px;
  color: #D94A4A;
  font-weight: 700;
  vertical-align: super;
  font-size: 12px;
}
.pes-tabs {
  flex-shrink: 0;
  height: 36px;
  background: #fff;
  border-bottom: 1px solid #E5EAF0;
  display: flex;
  align-items: stretch;
  padding: 0 12px;
  gap: 0;
}
.tab {
  height: 36px;
  padding: 0 14px;
  line-height: 36px;
  font-size: 13px;
  color: #606266;
  background: transparent;
  border: 0;
  border-bottom: 2px solid transparent;
  border-radius: 0;
  cursor: pointer;
  &.active {
    background: transparent;
    color: #2F6FED;
    font-weight: 600;
    border-bottom-color: #2F6FED;
  }
}
.tab-close { margin-left: 8px; font-style: normal; color: #C0C4CC; }
.tab-close:hover { color: #D94A4A; }
.close-all {
  margin-left: auto;
  align-self: center;
  height: 24px;
  padding: 0 10px;
  border: 1px solid #DCDFE6;
  background: #fff;
  color: #606266;
  border-radius: 2px;
  font-size: 12px;
  cursor: pointer;
}
.close-all:hover { color: #2F6FED; border-color: #2F6FED; }
.pes-main {
  flex: 1;
  overflow: auto;
  padding: 12px 14px 16px;
  background: #EEF2F6;
}
.pes-main :deep(.page-container) { padding: 0; height: auto; overflow: visible; }
.pes-main :deep(.panel) { border-radius: 2px; box-shadow: none; }
.pes-main :deep(.panel-title::before) { background: #1F8A4C; }
.pes-main.immersive {
  padding: 0;
  background: #081120;
  overflow: hidden;
}
.pes-main.immersive :deep(.cockpit) {
  border-radius: 0;
  min-height: 100%;
}
.pes-main.immersive :deep(.map-dark-page) {
  height: 100%;
  min-height: 100%;
}
.pes-main.supplement :deep(.el-button--primary) {
  --el-button-bg-color: #31B854;
  --el-button-border-color: #31B854;
  --el-button-hover-bg-color: #3dc463;
  --el-button-hover-border-color: #3dc463;
  --el-button-active-bg-color: #1F8A4C;
  --el-button-active-border-color: #1F8A4C;
}
.pes-main.supplement :deep(.el-link--primary) { --el-link-text-color: #1F8A4C; }

.pes-footer {
  flex-shrink: 0;
  height: 32px;
  line-height: 32px;
  text-align: center;
  font-size: 12px;
  color: #7A8594;
  background: #fff;
  border-top: 1px solid #E5EAF0;
}
.alert-menu .alert-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 4px;
  cursor: pointer;
  color: #303133;
}
.alert-menu .alert-item:hover { color: #1F8A4C; }
.alert-block h4 { margin: 0 0 8px; font-size: 14px; }
.alert-block p { margin: 0 0 8px; }
.hint { color: #909399; font-size: 12px !important; }
.cell-link {
  border: 0;
  background: transparent;
  color: #1F8A4C;
  cursor: pointer;
  margin-right: 16px;
  font: inherit;
}
.cell-link.muted { color: #909399; }
.support-pop { text-align: center; color: #303133; font-size: 13px; }
.support-pop p { margin: 6px 0 0; }
.support-pop .sub { color: #909399; font-size: 12px; }
.qr-ph {
  width: 140px;
  height: 140px;
  margin: 0 auto 8px;
  background:
    linear-gradient(#ddd 1px, transparent 1px) 0 0 / 14px 14px,
    linear-gradient(90deg, #ddd 1px, transparent 1px) 0 0 / 14px 14px,
    #f5f5f5;
  border: 1px solid #e4e7ed;
}
.monthly section { margin-bottom: 14px; }
.monthly h4 { margin: 0 0 6px; font-size: 14px; color: #303133; }
.monthly p { margin: 0; color: #606266; }

.subject-tiles {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  text-align: center;
  padding: 8px 4px 4px;
}
.subject-tiles .tile {
  border: 0;
  background: transparent;
  cursor: pointer;
  color: #303133;
}
.subject-tiles .tile-box {
  position: relative;
  min-height: 88px;
  border: 1px solid #EEF2F6;
  background: #FAFBFC;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #C0C4CC;
  font-size: 13px;
}
.subject-tiles .badge {
  position: absolute;
  top: 6px;
  right: 8px;
  background: #F56C6C;
  color: #fff;
  border-radius: 10px;
  padding: 0 6px;
  font-size: 12px;
  min-width: 18px;
  line-height: 16px;
}
.subject-tiles .tile-name { margin-top: 8px; }
</style>

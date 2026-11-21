<template>
  <aside class="pes-sidebar" :class="{ collapsed }">
    <div class="brand">
      <div class="brand-title">{{ collapsed ? '农药' : '安徽省农药数字监督管理平台' }}</div>
    </div>
    <el-scrollbar>
      <el-menu
        :default-active="activeMenu"
        :default-openeds="opened"
        :collapse="collapsed"
        :collapse-transition="false"
        background-color="#0B1C33"
        text-color="#D6DEE8"
        active-text-color="#FFFFFF"
        unique-opened
        @select="onSelect"
      >
        <template v-for="item in menuTree" :key="item.key">
          <el-menu-item v-if="!item.children" :index="item.route">
            <el-icon><component :is="item.icon" /></el-icon>
            <template #title>
              <span class="menu-label">{{ item.title }}<i v-if="item.supplement" class="pes-tag">招标补齐</i></span>
            </template>
          </el-menu-item>
          <el-sub-menu v-else :index="item.key">
            <template #title>
              <el-icon><component :is="item.icon" /></el-icon>
              <span>{{ item.title }}</span>
            </template>
            <template v-for="c in item.children" :key="c.route || c.key">
              <el-sub-menu v-if="c.isGroup" :index="c.key">
                <template #title>{{ c.title }}</template>
                <el-menu-item v-for="g in c.children" :key="g.route" :index="g.route">
                  <span class="menu-label">{{ g.title }}<i v-if="g.supplement" class="pes-tag">招标补齐</i></span>
                </el-menu-item>
              </el-sub-menu>
              <el-menu-item v-else :index="c.route">
                <span class="menu-label">{{ c.title }}<i v-if="c.supplement" class="pes-tag">招标补齐</i></span>
              </el-menu-item>
            </template>
          </el-sub-menu>
        </template>
      </el-menu>
    </el-scrollbar>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getMenusForSystem } from '@/router/menu'

defineProps({ collapsed: { type: Boolean, default: false } })
const route = useRoute()
const router = useRouter()
const activeMenu = computed(() => route.path)

const GROUP_ICONS = {
  '首页': 'HomeFilled',
  '数据大屏': 'Monitor',
  '信息审核': 'Stamp',
  '统计分析': 'DataAnalysis',
  '农药生产': 'OfficeBuilding',
  '农药经营': 'Box',
  '农药使用': 'User',
  '限制性农药': 'Warning',
  '内容管理': 'Reading',
  '招标补齐': 'Connection'
}

const menuTree = computed(() => {
  const group = getMenusForSystem('pes')[0]
  const children = group?.children || []
  const tree = []
  children.forEach((c) => {
    const key = c.section || c.title
    if (c.top || !c.section) {
      tree.push({
        key,
        title: c.title,
        route: c.route,
        icon: c.icon || GROUP_ICONS[key],
        openScreen: c.openScreen,
        supplement: !!c.supplement
      })
      return
    }
    let parent = tree.find((t) => t.key === key)
    if (!parent) {
      parent = { key, title: key, icon: GROUP_ICONS[key] || c.icon, children: [] }
      tree.push(parent)
    }
    if (c.subsection) {
      let sub = parent.children.find((x) => x.isGroup && x.title === c.subsection)
      if (!sub) {
        sub = { isGroup: true, key: `${key}-${c.subsection}`, title: c.subsection, children: [] }
        parent.children.push(sub)
      }
      sub.children.push(c)
    } else {
      parent.children.push(c)
    }
  })
  return tree
})

const opened = computed(() => {
  const cur = route.path
  const hit = menuTree.value.find((i) =>
    i.children?.some((c) => c.route === cur || c.children?.some((g) => g.route === cur))
  )
  return hit ? [hit.key] : []
})

function findItem(index, list = menuTree.value) {
  for (const item of list) {
    if (item.route === index) return item
    if (item.children) {
      const hit = findItem(index, item.children)
      if (hit) return hit
    }
  }
  return null
}

function onSelect(index) {
  const item = findItem(index)
  if (item?.openScreen || index === '/screen/overview') {
    const href = router.resolve('/screen/overview').href
    window.open(href, '_blank')
    return
  }
  if (index) router.push(index)
}
</script>

<style lang="scss" scoped>
.pes-sidebar {
  width: 220px;
  background: #0B1C33;
  color: #fff;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  overflow: hidden;
  transition: width 0.2s;
  &.collapsed { width: 64px; }
  &.collapsed :deep(.pes-tag) { display: none; }
}

.brand {
  min-height: 56px;
  padding: 10px 12px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgba(255,255,255,0.08);
}
.brand-title {
  font-size: 13px;
  line-height: 1.4;
  font-weight: 600;
  color: #fff;
  letter-spacing: 0.2px;
}
:deep(.el-menu) { border-right: none; }
:deep(.el-menu-item),
:deep(.el-sub-menu__title) {
  font-size: 13px;
  height: 44px;
  line-height: 44px;
}
:deep(.el-menu-item.is-active) {
  background: #152A45 !important;
}
:deep(.el-sub-menu .el-menu-item) { padding-left: 48px !important; min-width: auto; }
:deep(.el-sub-menu .el-sub-menu .el-menu-item) { padding-left: 64px !important; }
:deep(.el-sub-menu .el-menu-item:has(.pes-tag)) {
  height: auto;
  min-height: 44px;
  line-height: 1.35;
  white-space: normal;
  padding-top: 8px;
  padding-bottom: 8px;
}
:deep(.el-menu-item .menu-label) {
  display: inline-flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 2px 0;
  max-width: 100%;
  line-height: 1.35;
  white-space: normal;
}
</style>

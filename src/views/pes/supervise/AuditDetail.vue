<template>
  <div class="panel" v-if="row">
    <div class="head">
      <div class="title">审核信息详情</div>
      <div class="ops">
        <el-button @click="openDemoFill('审核', { kind: 'audit' })">审核</el-button>
        <el-button class="yellow" @click="openDemoFill('重设密码', { kind: 'password' })">重设密码</el-button>
        <el-button @click="$router.back()">返回</el-button>
      </div>
    </div>
    <h3>账号 / 主体信息</h3>
    <el-descriptions :column="2" border>
      <el-descriptions-item v-for="col in columns" :key="col.prop" :label="col.label">
        {{ row[col.prop] || '—' }}
      </el-descriptions-item>
      <el-descriptions-item v-if="showPlatform" label="平台名称">—</el-descriptions-item>
    </el-descriptions>
    <h3>证件</h3>
    <div class="empty-cert">未上传证件图片</div>
  </div>
  <div v-else class="panel">未找到该条演示数据。<el-button text @click="$router.back()">返回</el-button></div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { PES_LIST_PAGES } from './pages'
import { openDemoFill } from '@/components/pes/pesActions'

const route = useRoute()
const type = computed(() => String(route.params.type || '1'))
const page = computed(() => type.value === '2' ? PES_LIST_PAGES['audit-wholesaler'] : PES_LIST_PAGES['audit-retailer'])
const columns = computed(() => page.value.columns || [])
const showPlatform = computed(() => !!page.value.showPlatformName)
const row = computed(() => (page.value.rows || []).find((r) => String(r.id) === String(route.params.id)))
</script>

<style scoped>
.panel { background: #fff; border-radius: 2px; padding: 14px 16px; }
.head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.title { font-size: 15px; font-weight: 600; }
h3 { margin: 16px 0 8px; font-size: 14px; }
.empty-cert {
  padding: 28px;
  text-align: center;
  color: #909399;
  background: #fafafa;
  border: 1px dashed #dcdfe6;
}
.yellow, .yellow:hover { background: #E6A23C; border-color: #E6A23C; color: #fff; }
</style>

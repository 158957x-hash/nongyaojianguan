<template>
  <div class="page-container">
    <div class="panel">
      <div class="panel-title">
        <span class="title-text">对接对象</span>
      </div>
      <p class="note">本页用于讲述与现有系统的互联互通，展示同步任务和调用 / 抓取日志。真实迁移和接口联调不在原型里，也没有假装已经迁完。</p>
      <el-table :data="targets" border size="small">
        <el-table-column prop="name" label="对接系统" min-width="220" />
        <el-table-column prop="kind" label="方式" width="140" />
        <el-table-column prop="content" label="同步 / 调用内容" min-width="240" />
        <el-table-column prop="status" label="演示状态" width="140" />
      </el-table>
    </div>

    <div class="panel">
      <div class="panel-title">
        <span class="title-text">同步任务</span>
        <div class="title-extra">
          <el-button type="primary" size="small" @click="runDemo">执行一次演示同步</el-button>
        </div>
      </div>
      <el-table :data="tasks" border size="small">
        <el-table-column prop="name" label="任务" min-width="180" />
        <el-table-column prop="target" label="对接对象" min-width="200" />
        <el-table-column prop="cycle" label="周期" width="120" />
        <el-table-column prop="last" label="最近结果" min-width="220" />
      </el-table>
    </div>

    <div class="panel">
      <div class="panel-title">
        <span class="title-text">调用 / 抓取日志</span>
      </div>
      <el-table :data="logs" border size="small">
        <el-table-column prop="time" label="时间" width="170" />
        <el-table-column prop="action" label="动作" width="120" />
        <el-table-column prop="target" label="对象" min-width="180" />
        <el-table-column prop="detail" label="内容" min-width="260" />
        <el-table-column prop="result" label="结果" width="200">
          <template #default="{ row }">
            <span :class="row.ok ? 'ok' : 'fail'">{{ row.result }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { usePesLoopStore } from '@/stores/pesLoop'

const KEY = 'pes_demo_interconnect_v1'
const loop = usePesLoopStore()
const targets = [
  { name: '现有农药数字监督管理平台（第4包存量系统）', kind: '共享同步', content: '生产批次、经营入出库、回收归集', status: '演示可同步' },
  { name: '国家农药数字监督管理平台', kind: '数据抓取 / 上报', content: '限制性农药目录、经营户上报', status: '含失败示例' },
  { name: '皖政通', kind: '调用', content: '移动端扫码录入回传', status: '演示可调用' },
  { name: '皖企通', kind: '调用', content: '经营服务、真伪查询', status: '演示可调用' }
]
const tasks = ref([
  { name: '生产批次回传', target: '第4包存量监管库', cycle: '事件触发', last: 'YS20261120A 已演示回传' },
  { name: '经营进销存日同步', target: '第4包存量监管库', cycle: '每日', last: '最近一次成功（演示）' },
  { name: '包装废弃物回收归集', target: '第4包存量监管库', cycle: '事件触发', last: '零售端回收已可归集' },
  { name: '限制性农药目录抓取', target: '国家农药数字监督管理平台', cycle: '按需', last: '有一条失败日志，可重试' }
])
const seedLogs = [
  { time: '2026-11-20 16:02:18', action: '同步', target: '第4包存量监管库', detail: '生产批次 YS20261120A 回传', result: '成功', ok: true },
  { time: '2026-11-20 16:10:44', action: '抓取', target: '国家农药数字监督管理平台', detail: '限制性农药目录', result: '失败（演示：接口超时）', ok: false },
  { time: '2026-11-20 16:18:03', action: '调用', target: '皖企通', detail: '扫码查真伪 YS20261120A', result: '成功', ok: true },
  { time: '2026-11-20 16:25:11', action: '调用', target: '皖政通', detail: '销售录入 10 瓶，购买人丙', result: '成功', ok: true }
]
const logs = ref(loadLogs())

function loadLogs() {
  try {
    const raw = sessionStorage.getItem(KEY)
    if (raw) return JSON.parse(raw)
  } catch (e) { /* ignore */ }
  return seedLogs
}
function persist() {
  sessionStorage.setItem(KEY, JSON.stringify(logs.value))
}
function nowText() {
  const d = new Date()
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`
}
function runDemo() {
  const batch = loop.heroBatchNo || 'YS20261120A'
  const row = {
    time: nowText(),
    action: '同步',
    target: '第4包存量监管库',
    detail: `演示同步闭环批次 ${batch}（生产、入出库、回收）`,
    result: '成功（演示，未连接真实接口）',
    ok: true
  }
  logs.value = [row, ...logs.value]
  const task = tasks.value.find((t) => t.name === '经营进销存日同步')
  if (task) task.last = `${row.time} 成功（演示）`
  persist()
  ElMessage.success('已写入一条演示同步日志，不是真实接口调用')
}
</script>
<style scoped>
.note { color: #667085; line-height: 1.6; margin: 0 0 14px; font-size: 13px; }
.ok { color: #1F8A4C; }
.fail { color: #D94A4A; }
</style>

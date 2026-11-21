<template>
  <div class="panel">
    <el-button text @click="$router.push('/pes/retail/memberManagement')">返回</el-button>
    <h2>赊/还账记录</h2>
    <p class="hint">以下为演示数据。</p>
    <el-table :data="rows" border empty-text="暂无数据">
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="type" label="类型" />
      <el-table-column prop="created" label="创建时间" />
      <el-table-column prop="amount" label="金额（元）" />
      <el-table-column prop="remain" label="截止赊账金额（元）" />
      <el-table-column prop="remark" label="备注" />
    </el-table>
  </div>
</template>
<script setup>
const rows = [
  { type: '赊账', created: '2026-11-18 10:20:00', amount: '200.00', remain: '200.00', remark: '演示购买人丙 · 演示农药甲' },
  { type: '还账', created: '2026-11-19 15:06:00', amount: '100.00', remain: '100.00', remark: '部分还款（演示）' },
  { type: '赊账', created: '2026-11-20 09:12:00', amount: '100.00', remain: '200.00', remark: '演示购买人丙' }
]
</script>
<style scoped>
.panel { background: #fff; padding: 14px; }
h2 { margin: 8px 0 10px; font-size: 16px; }
.hint { color: #909399; font-size: 12px; margin: 0 0 8px; }
</style>

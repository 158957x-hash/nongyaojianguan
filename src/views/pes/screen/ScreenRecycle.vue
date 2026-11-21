<template>
  <div>
    <p class="note">现网「废弃物回收」分页当时是故障白屏。这里用演示数据补一页，方便讲述监管归集，不假装现网能打开。</p>
    <div class="grid">
      <div class="card"><div class="label">演示回收记录</div><div class="val">{{ loop.recycles.length }}</div></div>
      <div class="card"><div class="label">回收数量（个）</div><div class="val">{{ totalCount }}</div></div>
      <div class="card"><div class="label">回收重量（kg）</div><div class="val">{{ totalWeight }}</div></div>
    </div>
    <div class="table-card">
      <h3>闭环批次 {{ loop.heroBatchNo }} 回收归集</h3>
      <el-table :data="loop.recycles" size="small" class="dark-table">
        <el-table-column prop="voucher" label="凭证号" width="150" />
        <el-table-column prop="date" label="日期" width="110" />
        <el-table-column prop="batchNo" label="批次" width="140" />
        <el-table-column prop="stationName" label="回收站点" />
        <el-table-column prop="fromName" label="交回主体" />
        <el-table-column prop="type" label="类型" width="90" />
        <el-table-column prop="count" label="数量" width="80" />
        <el-table-column prop="weight" label="重量(kg)" width="100" />
        <el-table-column prop="source" label="来源" width="120" />
      </el-table>
    </div>
  </div>
</template>
<script setup>
import { computed } from 'vue'
import { usePesLoopStore } from '@/stores/pesLoop'
const loop = usePesLoopStore()
const totalCount = computed(() => loop.recycles.reduce((s, r) => s + Number(r.count || 0), 0))
const totalWeight = computed(() => loop.recycles.reduce((s, r) => s + Number(r.weight || 0), 0))
</script>
<style scoped>
.note {
  color: #8AA0B8;
  margin: 0 0 16px;
  line-height: 1.6;
  padding: 10px 14px;
  background: rgba(16, 42, 74, 0.55);
  border: 1px solid #1B3C66;
  border-left: 3px solid #5FE08A;
}
.grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 16px; }
.card, .table-card {
  background: rgba(16, 42, 74, 0.8);
  border: 1px solid #1B3C66;
  padding: 16px 18px;
}
.label { color: #8AA0B8; }
.val { font-size: 28px; color: #E8F4FF; margin-top: 6px; font-variant-numeric: tabular-nums; }
.table-card h3 { margin: 0 0 12px; color: #E8F4FF; font-size: 16px; font-weight: 600; }
.dark-table {
  --el-table-bg-color: transparent;
  --el-table-tr-bg-color: transparent;
  --el-table-header-bg-color: #102A4A;
  --el-table-text-color: #D6E4F0;
  --el-table-header-text-color: #9CB0C6;
  --el-table-border-color: #1B3C66;
  --el-table-row-hover-bg-color: rgba(95, 224, 138, 0.08);
}
@media (max-width: 900px) { .grid { grid-template-columns: 1fr; } }
</style>

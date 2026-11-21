<template>
  <div>
    <div class="bar">
      <p class="note">概览指标为演示数据，不是现网当时的真实数。</p>
      <el-button size="small" @click="openDemoFill('查看预警详情', { kind: 'alert' })">查看预警详情</el-button>
    </div>
    <div class="grid">
      <div v-for="m in metrics" :key="m.label" class="card">
        <div class="label">{{ m.label }}</div>
        <div class="val">{{ m.value }}</div>
        <div v-if="m.sub" class="sub">{{ m.sub }}</div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { openDemoFill } from '@/components/pes/pesActions'
const metrics = [
  { label: '生产企业', value: '12' },
  { label: '经营户', value: '1,000', sub: '批发 128 / 零售 872' },
  { label: '监管用户', value: '86' },
  { label: '演示市', value: '3' },
  { label: '年度上报主体', value: '872' },
  { label: '上报记录', value: '3,139' },
  { label: '限制性相关汇总（家）', value: '24' },
  { label: '限制性相关汇总（个）', value: '56' },
  { label: '限制性相关汇总（吨）', value: '1.85' }
]
</script>
<style scoped>
.bar { margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center; gap: 12px; }
.note { color: #8AA0B8; margin: 0; font-size: 12px; }
.grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
.card { background: rgba(16, 42, 74, 0.8); border: 1px solid #1B3C66; padding: 16px 18px; }
.label { color: #8AA0B8; }
.val { font-size: 28px; color: #E8F4FF; margin-top: 6px; }
.sub { margin-top: 4px; color: #9CB0C6; }
@media (max-width: 900px) { .grid { grid-template-columns: 1fr; } }
</style>

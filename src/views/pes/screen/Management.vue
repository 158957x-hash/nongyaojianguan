<template>
  <div class="card">
    <div class="bar">
      <h3>农药经营</h3>
      <el-button size="small" @click="openDemoFill('导出数据')">导出数据</el-button>
    </div>
    <p>已观察分页与「导出数据」入口。下列指标为演示数据，未逐项登记的图表不编造。</p>
    <div class="metrics">
      <div><span>经营户</span><b>1,000</b></div>
      <div><span>批发 / 零售</span><b>128 / 872</b></div>
      <div><span>上报记录</span><b>3,139</b></div>
    </div>
  </div>
</template>
<script setup>
import { openDemoFill } from '@/components/pes/pesActions'
</script>
<style scoped>
.card { background: rgba(16, 42, 74, 0.8); border: 1px solid #1B3C66; padding: 16px 18px; min-height: 280px; }
.bar { display: flex; justify-content: space-between; align-items: center; }
h3 { margin: 0; color: #E8F4FF; }
p, span { color: #8AA0B8; }
.metrics { display: flex; gap: 24px; margin-top: 16px; }
.metrics b { display: block; font-size: 24px; color: #E8F4FF; }
</style>

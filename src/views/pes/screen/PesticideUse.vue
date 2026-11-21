<template>
  <div class="card">
    <h3>农药使用</h3>
    <p>已观察分页入口。下列指标为演示数据，未逐项登记的图表不编造。</p>
    <div class="metrics">
      <div><span>上报主体</span><b>36</b></div>
      <div><span>上报记录</span><b>120</b></div>
    </div>
  </div>
</template>
<style scoped>
.card { background: rgba(16, 42, 74, 0.8); border: 1px solid #1B3C66; padding: 16px 18px; min-height: 280px; }
h3 { margin: 0 0 8px; color: #E8F4FF; }
p, span { color: #8AA0B8; }
.metrics { display: flex; gap: 24px; margin-top: 16px; }
.metrics b { display: block; font-size: 24px; color: #E8F4FF; }
</style>

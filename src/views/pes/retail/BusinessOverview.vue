<template>
  <div class="panel">
    <div class="tabs">
      <button v-for="t in tabs" :key="t.key" type="button" :class="{ on: tab === t.key }" @click="tab = t.key">{{ t.label }}</button>
    </div>
    <div class="filters">
      <button v-for="t in ranges" :key="t" type="button" :class="{ on: range === t }" @click="range = t">{{ t }}</button>
      <el-date-picker v-if="range === '自定义'" v-model="custom" type="daterange" start-placeholder="开始" end-placeholder="结束" value-format="YYYY-MM-DD" />
      <button type="button" :class="{ on: grain === '按日统计' }" @click="grain = '按日统计'">按日统计</button>
      <button type="button" :class="{ on: grain === '按月统计' }" @click="grain = '按月统计'">按月统计</button>
    </div>
    <div class="block">
      <h3>{{ currentTitle }} <el-tooltip content="数据来源：正常登记以及库存调整时补录的销售数据" placement="top"><span class="q">?</span></el-tooltip></h3>
      <p class="period">统计起止日期：{{ periodText }}（演示数据）</p>
      <div class="metrics">
        <div v-for="m in metricItems" :key="m.label"><span>{{ m.label }}</span><b>{{ m.value }}</b></div>
      </div>
      <div class="chart">
        <div class="chart-label">销售额</div>
        <div class="chart-ph bars">
          <div v-for="(b, i) in trendBars" :key="i" class="bar" :style="{ height: b + '%' }" />
        </div>
      </div>
      <div class="ranks">
        <div class="rank green">
          <h4>商品排行榜</h4>
          <div class="sub">
            <button type="button" :class="{ on: goodsRank === '按销售数量（件）' }" @click="goodsRank = '按销售数量（件）'">按销售数量（件）</button>
            <button type="button" :class="{ on: goodsRank === '按销售价格（元）' }" @click="goodsRank = '按销售价格（元）'">按销售价格（元）</button>
          </div>
          <ol class="rank-list">
            <li v-for="(r, i) in goodsRows" :key="r.name"><i>{{ i + 1 }}</i><span>{{ r.name }}</span><b>{{ goodsRank === '按销售数量（件）' ? r.qty : r.amount }}</b></li>
          </ol>
        </div>
        <div class="rank blue">
          <h4>买家排行榜（会员）</h4>
          <div class="sub">
            <button type="button" :class="{ on: buyerRank === '按成交笔数（笔）' }" @click="buyerRank = '按成交笔数（笔）'">按成交笔数（笔）</button>
            <button type="button" :class="{ on: buyerRank === '按购买价格（元）' }" @click="buyerRank = '按购买价格（元）'">按购买价格（元）</button>
          </div>
          <ol class="rank-list">
            <li v-for="(r, i) in buyerRows" :key="r.name"><i>{{ i + 1 }}</i><span>{{ r.name }}</span><b>{{ buyerRank === '按成交笔数（笔）' ? r.count : r.amount }}</b></li>
          </ol>
        </div>
      </div>
      <div v-if="tab === 'p'" class="waste">
        <h3>废弃物回收数据</h3>
        <div class="metrics">
          <div><span>回收废弃物数量</span><b>20 个</b></div>
          <div><span>重量</span><b>4 公斤</b></div>
          <div><span>笔数</span><b>1</b></div>
          <div><span>客户数量</span><b>1</b></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed, ref } from 'vue'
const tabs = [
  { key: 'p', label: '农药经营概况（包含废弃物回收）' },
  { key: 's', label: '种子经营概况' },
  { key: 'f', label: '肥料经营概况' }
]
const tab = ref('p')
const ranges = ['今日', '昨日', '最近7天', '最近30天', '自定义']
const range = ref('最近7天')
const custom = ref([])
const grain = ref('按日统计')
const goodsRank = ref('按销售数量（件）')
const buyerRank = ref('按成交笔数（笔）')
const currentTitle = computed(() => tab.value === 'p' ? '农药经营数据' : (tab.value === 's' ? '种子经营数据' : '肥料经营数据'))
const periodText = computed(() => {
  if (range.value === '今日') return '2026.11.20 - 2026.11.20'
  if (range.value === '昨日') return '2026.11.19 - 2026.11.19'
  if (range.value === '最近7天') return '2026.11.14 - 2026.11.20'
  if (range.value === '最近30天') return '2026.10.22 - 2026.11.20'
  if (custom.value?.length === 2) return custom.value.join(' - ')
  return '2026.11.14 - 2026.11.20'
})
const metricItems = computed(() => {
  if (tab.value === 'p') {
    return [
      { label: '销售金额', value: '¥1,280.00' },
      { label: '销售笔数', value: '3' },
      { label: '成交客户数量', value: '2' },
      { label: '客户赊账金额', value: '¥200.00' }
    ]
  }
  if (tab.value === 's') {
    return [
      { label: '销售金额', value: '¥360.00' },
      { label: '销售笔数', value: '1' },
      { label: '成交客户数量', value: '1' },
      { label: '客户赊账金额', value: '¥0.00' }
    ]
  }
  return [
    { label: '销售金额', value: '¥180.00' },
    { label: '销售笔数', value: '1' },
    { label: '成交客户数量', value: '1' },
    { label: '客户赊账金额', value: '¥0.00' }
  ]
})
const trendBars = computed(() => tab.value === 'p' ? [30, 45, 28, 60, 40, 85, 70] : [10, 18, 12, 20, 16, 24, 22])
const goodsRows = [
  { name: '演示农药甲', qty: '20 件', amount: '¥800.00' },
  { name: '演示农药乙', qty: '8 件', amount: '¥320.00' },
  { name: '演示农药丙', qty: '4 件', amount: '¥160.00' }
]
const buyerRows = [
  { name: '演示购买人丙', count: '2 笔', amount: '¥1,000.00' },
  { name: '演示购买人丁', count: '1 笔', amount: '¥280.00' }
]
</script>
<style scoped>
.panel { background: #fff; padding: 12px 14px; border-radius: 2px; }
.tabs, .filters, .sub { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 12px; }
.tabs button, .filters button, .sub button {
  border: 1px solid #CDECD6; background: #fff; padding: 4px 10px; cursor: pointer; border-radius: 2px;
}
.tabs button.on, .filters button.on, .sub button.on { background: #E8F8EE; color: #16351E; border-color: #31B854; }
h3 { margin: 0 0 8px; font-size: 15px; }
.q { display: inline-block; width: 16px; height: 16px; border: 1px solid #C0C4CC; border-radius: 50%; text-align: center; color: #909399; font-size: 12px; cursor: help; }
.period { color: #909399; margin: 0 0 10px; }
.metrics { display: flex; gap: 12px; flex-wrap: wrap; }
.metrics div { min-width: 120px; background: #F7F9FB; padding: 10px 12px; }
.metrics span { display: block; color: #909399; font-size: 12px; }
.metrics b { font-size: 18px; }
.chart { margin: 16px 0; }
.chart-label { color: #2F6FED; margin-bottom: 6px; }
.chart-ph { height: 180px; border: 1px dashed #dcdfe6; color: #C0C4CC; display: flex; align-items: flex-end; justify-content: center; gap: 10px; padding: 16px 24px 12px; box-sizing: border-box; }
.chart-ph.bars .bar { width: 22px; background: #31B854; opacity: 0.85; }
.rank-list { list-style: none; margin: 0; padding: 0; }
.rank-list li { display: flex; align-items: center; gap: 8px; padding: 6px 0; border-bottom: 1px solid #EEF2F6; }
.rank-list i { font-style: normal; width: 18px; color: #909399; }
.rank-list span { flex: 1; }
.rank-list b { font-weight: 600; }
.ranks { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.rank { padding: 10px; }
.rank.green { background: #F3FBF6; }
.rank.blue { background: #F3F7FD; }
.empty { padding: 28px; text-align: center; color: #909399; }
.waste { margin-top: 16px; padding-top: 12px; border-top: 1px solid #EEF2F6; }
</style>

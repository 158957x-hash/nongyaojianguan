<template>
  <div class="pes-page">
    <div class="panel">
      <div class="area-row">
        <span class="lbl">所在区域：</span>
        <el-select v-model="province" style="width: 120px">
          <el-option label="安徽省" value="安徽省" />
        </el-select>
        <el-select v-model="city" placeholder="选择市" style="width: 120px">
          <el-option label="选择市" value="" />
          <el-option label="演示市A" value="演示市A" />
          <el-option label="演示市B" value="演示市B" />
        </el-select>
        <el-select v-model="district" placeholder="选择区" style="width: 120px">
          <el-option label="选择区" value="" />
          <el-option label="演示区县A" value="演示区县A" />
          <el-option label="演示区县B" value="演示区县B" />
        </el-select>
      </div>

      <section class="block">
        <h3 class="sec"><i />限制性农药登记统计</h3>
        <div class="reg-cards">
          <div class="reg-main">
            <span class="ribbon">登记品种</span>
            <div class="kpi-split">
              <div class="kpi">
                <div class="val">
                  <span class="num blank">{{ regKinds }}</span>
                  <el-icon class="ask" title="口径说明未展开"><QuestionFilled /></el-icon>
                </div>
                <div class="name">登记农药种类（种）</div>
                <el-button size="small" class="ghost-blue" @click="openDemoFill('导出明细')">导出明细</el-button>
              </div>
              <div class="kpi">
                <div class="val">
                  <span class="num slash">{{ regOnSale }}</span>
                  <el-icon class="ask" title="口径说明未展开"><QuestionFilled /></el-icon>
                </div>
                <div class="name">登记/在售农药产品（个）</div>
                <el-button size="small" class="ghost-blue" @click="openDemoFill('导出明细')">导出明细</el-button>
              </div>
            </div>
          </div>
          <div class="stock-card">
            <span class="stock-flag">库存</span>
            <div class="stock-body">
              <div class="name">库存总量（千克）</div>
              <div class="num blank">{{ stockTotal }}</div>
            </div>
          </div>
        </div>
      </section>

      <section class="block">
        <div class="sec-row">
          <h3 class="sec"><i />限制性农药交易统计</h3>
          <div class="chips">
            <button v-for="c in tradeChips" :key="c" type="button" :class="{ on: tradeChip === c }" @click="tradeChip = c">{{ c }}</button>
          </div>
        </div>
        <div class="trade-grid">
          <div class="metric">
            <div class="num">0</div>
            <div class="name">上报经营户（家）</div>
            <el-button size="small" class="ghost-blue" @click="skipRestrictedDetail">查看明细</el-button>
          </div>
          <div class="metric">
            <div class="val-row">
              <span class="num blank"></span>
              <el-icon class="ask" title="口径说明未展开"><QuestionFilled /></el-icon>
            </div>
            <div class="name">进货总量（千克）</div>
            <el-button size="small" class="ghost-blue" @click="skipRestrictedDetail">查看明细</el-button>
          </div>
          <div class="metric">
            <div class="num blank"></div>
            <div class="name">销售总量（千克）</div>
            <el-button size="small" class="ghost-blue" @click="skipRestrictedDetail">查看明细</el-button>
          </div>
          <div class="metric highlight">
            <div class="num blank"></div>
            <div class="name">面向种植户销量（千克）</div>
          </div>
          <div class="metric pair">
            <div>
              <div class="num">0</div>
              <div class="name">上游供应方（家）</div>
            </div>
            <div>
              <div class="num">0</div>
              <div class="name">下游实名采购方（人）</div>
            </div>
          </div>
        </div>
      </section>

      <section class="block">
        <h3 class="sec"><i />限制性农药使用统计</h3>
        <div class="use-grid">
          <div class="metric">
            <div class="num">0</div>
            <div class="name">上报使用主体（家）</div>
            <el-button size="small" class="ghost-blue" @click="skipRestrictedDetail">查看明细</el-button>
          </div>
          <div class="metric">
            <div class="num">&lt;0.01</div>
            <div class="name">用药量（千克）</div>
          </div>
          <div class="metric">
            <div class="num">&lt;0.01</div>
            <div class="name">用药面积（亩）</div>
          </div>
          <div class="metric">
            <div class="num">&lt;0.01</div>
            <div class="name">每亩用药量测算（千克）</div>
          </div>
        </div>
      </section>

      <section class="block chart-block">
        <div class="sec-row">
          <h3 class="sec"><i />统计图表</h3>
          <button type="button" class="chart-tab on">限制性农药农药销售趋势</button>
          <div class="chart-legend">
            <span><i class="dot sale" />销售量（千克）</span>
            <span><i class="dot yoy" />往年同期对比</span>
          </div>
          <div class="chart-range">{{ chartRange }}</div>
        </div>
        <div ref="chartEl" class="chart" />
      </section>
    </div>
  </div>
</template>
<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import * as echarts from 'echarts'
import { QuestionFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { openDemoFill } from '@/components/pes/pesActions'

const province = ref('安徽省')
const city = ref('')
const district = ref('')
const tradeChips = ['最近15天', '本月', '上个月', '本年度', '按日', '按月']
const tradeChip = ref('最近15天')
const regKinds = ref('')
const regOnSale = ref('/')
const stockTotal = ref('')

function pad(n) { return String(n).padStart(2, '0') }
function fmt(d) { return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())}` }
const today = new Date()
const start = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 14)
const chartRange = `${fmt(start)}-${fmt(today)}`

const days = []
const sales = []
const yoy = []
for (let i = 0; i <= 14; i++) {
  const d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i)
  days.push(`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`)
  const demo = [0.8, 1.1, 0.4, 1.6, 0.9, 2.2, 1.4, 0.6, 1.8, 2.4, 3.1, 4.0, 6.5, 8.2, 3.3]
  const past = [0.3, 0.5, 0.2, 0.7, 0.4, 0.9, 0.6, 0.3, 0.8, 1.0, 1.2, 1.6, 2.0, 2.8, 1.1]
  sales.push(demo[i])
  yoy.push(past[i])
}

const chartEl = ref(null)
let chart
function renderChart() {
  if (!chartEl.value) return
  chart = echarts.init(chartEl.value)
  chart.setOption({
    grid: { left: 48, right: 24, top: 16, bottom: 36 },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: days,
      axisTick: { alignWithLabel: true },
      axisLine: { lineStyle: { color: '#DCDFE6' } },
      axisLabel: { color: '#909399', fontSize: 11, rotate: 0 }
    },
    yAxis: {
      type: 'value',
      min: 0,
      axisLine: { show: false },
      splitLine: { lineStyle: { color: '#EEF2F6' } },
      axisLabel: { color: '#909399' }
    },
    series: [
      {
        name: '销售量（千克）',
        type: 'bar',
        barWidth: 8,
        itemStyle: { color: '#5B8FF9' },
        data: sales
      },
      {
        name: '往年同期对比',
        type: 'line',
        smooth: true,
        showSymbol: false,
        itemStyle: { color: '#E67A1A' },
        lineStyle: { width: 2, color: '#E67A1A' },
        data: yoy
      }
    ]
  })
}
onMounted(() => {
  renderChart()
  window.addEventListener('resize', resize)
})
function resize() { chart && chart.resize() }
onBeforeUnmount(() => {
  window.removeEventListener('resize', resize)
  chart && chart.dispose()
})
const skipRestrictedDetail = () => ElMessage.info('限制性农药统计明细页现网未观察，本轮不展开')
</script>
<style scoped>
.panel { background: #fff; border-radius: 2px; padding: 16px 18px 24px; }
.area-row { display: flex; align-items: center; gap: 8px; margin-bottom: 18px; }
.lbl { color: #303133; }
.block { margin-bottom: 22px; }
.sec {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: #303133;
  display: flex;
  align-items: center;
  gap: 8px;
}
 .sec i { width: 4px; height: 14px; background: #2F6FED; display: inline-block; border-radius: 1px; }
.sec-row { display: flex; align-items: center; gap: 16px; margin-bottom: 12px; flex-wrap: wrap; }
.chips { display: flex; gap: 8px; flex-wrap: wrap; }
.chips button {
  border: 1px solid #DCDFE6;
  background: #fff;
  color: #303133;
  padding: 4px 12px;
  border-radius: 2px;
  cursor: pointer;
}
.chips button.on { background: #3B82F6; color: #fff; border-color: #3B82F6; }
.reg-cards { display: grid; grid-template-columns: 1fr 280px; gap: 12px; margin-top: 12px; }
.reg-main, .stock-card, .metric {
  background: #F7F9FB;
  border-radius: 2px;
  position: relative;
}
.reg-main { padding: 18px 16px 16px; }
.ribbon, .stock-flag {
  position: absolute;
  top: 0;
  left: 0;
  background: #8A94A6;
  color: #fff;
  font-size: 12px;
  padding: 3px 10px;
  border-radius: 0 0 4px 0;
  letter-spacing: 2px;
}
.kpi-split { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 12px; }
.kpi, .metric { text-align: center; padding: 16px 8px 14px; }
.name { color: #909399; font-size: 13px; margin: 6px 0 8px; }
.num { font-size: 28px; color: #303133; font-weight: 600; min-height: 34px; line-height: 34px; }
.num.blank:empty, .num.blank:not(:empty) { min-height: 34px; }
.slash { font-weight: 400; color: #606266; }
.val, .val-row { display: flex; align-items: center; justify-content: center; gap: 6px; }
.ask { color: #C0C4CC; cursor: default; }
.stock-card { min-height: 140px; }
.stock-body { padding: 48px 12px 16px; text-align: center; }
.ghost-blue, .ghost-blue:hover {
  background: #fff;
  border-color: #3B82F6;
  color: #3B82F6;
}
.trade-grid {
  display: grid;
  grid-template-columns: 1.1fr 1.1fr 1.1fr 1.3fr 1.8fr;
  gap: 10px;
}
.metric.highlight { background: #EEF1F4; }
.metric.pair {
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: 0;
  background: #F7F9FB;
}
.metric.pair > div { padding: 16px 8px; }
.use-grid { display: grid; grid-template-columns: 1.1fr 1fr 1fr 1fr; gap: 10px; }
.chart-tab {
  border: 0;
  background: #3B82F6;
  color: #fff;
  padding: 4px 12px;
  border-radius: 2px;
  font-size: 12px;
}
.chart-legend { margin-left: auto; display: flex; gap: 16px; color: #606266; font-size: 12px; align-items: center; }
.dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; margin-right: 4px; }
.dot.sale { background: #5B8FF9; }
.dot.yoy { background: #E67A1A; }
.chart-range { color: #909399; font-size: 12px; }
.chart { height: 280px; width: 100%; }
</style>

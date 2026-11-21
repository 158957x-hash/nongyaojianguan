<template>
  <div class="pes-page">
    <div class="panel">
      <div class="panel-title">{{ title }}</div>

      <template v-if="key === 'restricted'">
        <p class="hint">菜单和路由已落下。现网主区未看成独立界面（keep-alive 未切换），本页只留入口，不编内页。</p>
      </template>

      <template v-else-if="key === 'production'">
        <div class="toolbar">
          <button type="button" :class="{ on: chemo === '原药' }" @click="chemo = '原药'">原药</button>
          <button type="button" :class="{ on: chemo === '制剂' }" @click="chemo = '制剂'">制剂</button>
          <label class="check"><input type="checkbox" v-model="showPure"> 显示折百量</label>
          <el-button size="small" @click="openDemoFill('导出')">导出</el-button>
        </div>
        <div class="metrics">
          <div class="metric"><span>注册数</span><b>{{ productionMetrics.register }}</b></div>
          <div class="metric"><span>上报数</span><b>{{ productionMetrics.report }}</b></div>
        </div>
        <div class="box">
          <div class="row" @click="drill = true">
            <span>杀菌剂（{{ chemo }}）</span><span>{{ chemo === '原药' ? '12.60' : '28.40' }}</span>
          </div>
        </div>
        <el-table v-if="drill" :data="productionDrill" border class="pes-table" size="small">
          <el-table-column prop="name" label="分类" />
          <el-table-column prop="qty" label="数量（吨）" width="140" />
        </el-table>
      </template>

      <template v-else-if="key === 'trade'">
        <div class="metrics">
          <div class="metric"><span>登记品种数</span><b>{{ tradeMetrics.varieties }}</b></div>
          <div class="metric"><span>登记 / 在售</span><b>{{ tradeMetrics.onSale }}</b></div>
          <div class="metric"><span>库存（吨）</span><b>{{ tradeMetrics.stock }}</b></div>
          <div class="metric"><span>上报户</span><b>{{ tradeMetrics.reporters }}</b></div>
          <div class="metric"><span>进货</span><b>{{ tradeMetrics.inbound }}</b></div>
          <div class="metric"><span>销售</span><b>{{ tradeMetrics.sold }}</b></div>
        </div>
        <el-button size="small" @click="detailOn = !detailOn">查看明细</el-button>
        <el-button size="small" @click="openDemoFill('导出')">导出</el-button>
                <el-table v-if="detailOn" :data="tradeDetails" border class="pes-table" size="small">
          <el-table-column prop="name" label="农药通用名" />
          <el-table-column prop="inbound" label="进货（吨）" width="120" />
          <el-table-column prop="sold" label="销售（吨）" width="120" />
          <el-table-column prop="stock" label="库存（吨）" width="120" />
        </el-table>
        <p v-else class="hint">点「查看明细」展开演示明细（不是现网当时的真实数）。</p>
      </template>

      <template v-else-if="key === 'operator-report'">
        <div class="metrics">
          <div class="metric"><span>总户数</span><b>{{ operatorMetrics.total }}</b></div>
          <div class="metric"><span>已上报</span><b>{{ operatorMetrics.reported }}</b></div>
          <div class="metric"><span>上报条数</span><b>{{ operatorMetrics.count }}</b></div>
          <div class="metric"><span>占比</span><b>{{ operatorMetrics.ratio }}</b></div>
          <div class="metric"><span>未上报</span><b>{{ operatorMetrics.unreported }}</b></div>
          <div class="metric"><span>异常占比 / 户数</span><b>{{ operatorMetrics.abnormal }}</b></div>
        </div>
        <el-button size="small" @click="openDemoFill('导出未上报')">导出未上报</el-button>
        <el-button size="small" @click="openDemoFill('导出异常')">导出异常</el-button>
      </template>

      <template v-else-if="key === 'country-report'">
        <div class="toolbar">
          <button type="button" :class="{ on: biz === '农药销售' }" @click="biz = '农药销售'">农药销售</button>
          <button type="button" :class="{ on: biz === '农药进货' }" @click="biz = '农药进货'">农药进货</button>
          <button type="button" :class="{ on: org === '零售门店' }" @click="org = '零售门店'">零售门店</button>
          <button type="button" :class="{ on: org === '批发商' }" @click="org = '批发商'">批发商</button>
          <button type="button" :class="{ on: reported === '已上报' }" @click="reported = '已上报'">已上报</button>
          <button type="button" :class="{ on: reported === '未上报' }" @click="reported = '未上报'">未上报</button>
        </div>
        <div v-if="biz === '农药销售' && reported === '未上报'" class="list">
          <div class="row" v-for="n in countrySalesUnreported" :key="n">{{ n }}</div>
          
        </div>
        <div v-else-if="biz === '农药进货' && reported === '未上报'" class="list">
          <div class="row" v-for="n in countryUnreported" :key="n">{{ n }}</div>
          
        </div>
                <div v-else class="list">
          <div class="row" v-for="n in countryReported" :key="n">{{ n }}</div>
          <p class="hint">已上报名单为演示数据。</p>
        </div>
      </template>

      <template v-else-if="key === 'crops'">
        <el-table :data="cropRows" border empty-text="暂无数据" class="pes-table">
          <el-table-column prop="crop" label="主要施用作物" />
          <el-table-column prop="sold" label="农药销售总量（不含限制性）吨" />
          <el-table-column prop="restricted" label="限制性农药销售量（吨）" />
        </el-table>
        <p class="hint">列为现网已观察字段，行是演示数据。导出只留入口。</p>
        <el-button size="small" @click="openDemoFill('导出')">导出</el-button>
      </template>

      <template v-else-if="key === 'usage'">
                <div class="metrics">
          <div class="metric"><span>上报主体</span><b>36</b></div>
          <div class="metric"><span>上报条数</span><b>120</b></div>
        </div>
        <el-table :data="usageRows" border class="pes-table" size="small">
          <el-table-column prop="area" label="地区" />
          <el-table-column prop="subjects" label="上报主体（家）" width="140" />
          <el-table-column prop="count" label="上报条数" width="120" />
        </el-table>
      </template>

      <p class="hint muted">观察路由：{{ observedRoute }}。指标口径未确认，本页数字都是演示数据，不是现网当时的真实数。</p>
    </div>
  </div>
</template>
<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { PES_STATS_PAGES } from './pages'
import { openDemoFill } from '@/components/pes/pesActions'

const route = useRoute()
const conf = computed(() => PES_STATS_PAGES.find((p) => p.key === route.meta.pageKey) || {})
const key = computed(() => conf.value.key || route.meta.pageKey)
const title = computed(() => conf.value.title || route.meta?.title || '统计')
const observedRoute = computed(() => conf.value.observedRoute || '—')
const chemo = ref('原药')
const showPure = ref(false)
const drill = ref(false)
const detailOn = ref(false)
const biz = ref('农药销售')
const org = ref('零售门店')
const reported = ref('未上报')
const countryUnreported = ['演示经营企业甲', '演示经营企业乙']
const countrySalesUnreported = ['演示经营企业己', '演示经营企业庚']
const countryReported = ['演示经营企业丙', '演示经营企业丁', '演示经营企业戊']
const productionDrill = [
  { name: '杀菌剂', qty: '12.60' },
  { name: '杀虫剂', qty: '9.80' },
  { name: '除草剂', qty: '6.20' }
]
const tradeDetails = [
  { name: '演示农药甲', inbound: '0.80', sold: '0.50', stock: '0.30' },
  { name: '演示农药乙', inbound: '1.20', sold: '0.90', stock: '0.30' },
  { name: '演示农药丙', inbound: '0.40', sold: '0.20', stock: '0.20' }
]
const cropRows = [
  { crop: '演示作物甲（水稻）', sold: '2.40', restricted: '0.12' },
  { crop: '演示作物乙（小麦）', sold: '1.10', restricted: '0.00' },
  { crop: '演示作物丙（玉米）', sold: '0.86', restricted: '0.05' }
]
const usageRows = [
  { area: '演示区县A', subjects: 12, count: 48 },
  { area: '演示区县B', subjects: 9, count: 36 },
  { area: '演示区县C', subjects: 8, count: 21 },
  { area: '演示区县D', subjects: 7, count: 15 }
]

const productionMetrics = { register: '126', report: '98' }
const tradeMetrics = {
  varieties: '1,286',
  onSale: '1,286 / 864',
  stock: '352.60',
  reporters: '872',
  inbound: '186.40',
  sold: '142.75'
}
const operatorMetrics = {
  total: '1,000',
  reported: '872',
  count: '3,139',
  ratio: '87.20%',
  unreported: '128',
  abnormal: '3.80% / 38'
}
</script>
<style scoped>
.panel { background: #fff; border-radius: 2px; padding: 14px 16px; }
.panel-title { font-size: 15px; font-weight: 600; color: #303133; margin-bottom: 12px; }
.toolbar { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; margin-bottom: 12px; }
.toolbar button, .chips button {
  border: 1px solid #D9E8DE; background: #fff; padding: 4px 12px; cursor: pointer; border-radius: 2px;
}
.toolbar button.on { background: #1F8A4C; color: #fff; border-color: #1F8A4C; }
.check { color: #606266; font-size: 13px; }
.metrics { display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 12px; }
.metric {
  min-width: 120px; background: #F7F9FB; padding: 10px 14px; border-radius: 2px;
}
.metric span { display: block; color: #909399; font-size: 12px; }
.metric b { font-size: 18px; color: #303133; }
.box, .list { border: 1px solid #EEF2F6; margin-top: 8px; }
.row { display: flex; justify-content: space-between; padding: 8px 10px; cursor: pointer; }
.empty {
  margin-top: 12px; padding: 36px 12px; text-align: center; color: #909399;
  background: #fafafa; border: 1px dashed #dcdfe6;
}
.hint { margin-top: 12px; color: #909399; font-size: 12px; }
.hint.muted { color: #A8ABB2; }
:deep(.pes-table) { --el-table-header-bg-color: #F5F7FA; margin-bottom: 8px; }
</style>

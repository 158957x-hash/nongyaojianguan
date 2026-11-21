<template>
  <div class="pes-page">
    <div class="panel">
      <div class="filter">
        <div class="line">
          <label>登记证号：</label>
          <el-input v-model="form.regNo" placeholder="请输入登记证号" clearable style="width: 200px" />
          <label>农药通用名：</label>
          <el-input v-model="form.commonName" placeholder="请输入农药通用名" clearable style="width: 200px" />
          <label>登记证持有人：</label>
          <el-input v-model="form.holder" placeholder="请输入登记证持有人" clearable style="width: 200px" />
        </div>
        <div class="line">
          <label>所在区域：</label>
          <el-select v-model="form.province" style="width: 110px"><el-option label="安徽省" value="安徽省" /></el-select>
          <el-select v-model="form.city" placeholder="选择市" style="width: 110px">
            <el-option label="选择市" value="" />
            <el-option label="演示市A" value="演示市A" />
          </el-select>
          <el-select v-model="form.district" placeholder="选择区" style="width: 110px">
            <el-option label="选择区" value="" />
            <el-option label="演示区县A" value="演示区县A" />
          </el-select>
          <label>限制性农药：</label>
          <el-select v-model="form.restricted" style="width: 140px">
            <el-option label="不区分" value="不区分" />
            <el-option label="是" value="是" />
            <el-option label="否" value="否" />
          </el-select>
          <label>登记状态：</label>
          <el-select v-model="form.regStatus" style="width: 140px">
            <el-option label="全部" value="全部" />
          </el-select>
        </div>
        <div class="line">
          <label>统计交易时间：</label>
          <div class="chips">
            <button v-for="c in timeChips" :key="c" type="button" :class="{ on: form.period === c }" @click="setPeriod(c)">{{ c }}</button>
          </div>
          <el-date-picker
            v-model="form.range"
            type="daterange"
            value-format="YYYY-MM-DD"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            range-separator="至"
            style="width: 250px"
          />
          <el-button class="btn-search" @click="onSearch">搜索</el-button>
          <el-button class="btn-export" @click="openDemoFill('导出')">导出</el-button>
        </div>
      </div>

      <div class="type-tabs">
        <button type="button" :class="{ on: side === '零售商' }" @click="side = '零售商'">零售商登记的农药({{ retailCount }})</button>
        <button type="button" :class="{ on: side === '批发商' }" @click="side = '批发商'">批发商登记的农药({{ wholesaleCount }})</button>
      </div>

      <el-table :data="pagedRows" border class="pes-table" empty-text="暂无数据">
        <el-table-column prop="regNo" label="登记证号" min-width="130" show-overflow-tooltip />
        <el-table-column prop="commonName" label="农药通用名" min-width="130" show-overflow-tooltip />
        <el-table-column prop="holder" label="登记证持有人" min-width="150" show-overflow-tooltip />
        <el-table-column prop="restricted" label="限制性农药" width="100" />
        <el-table-column prop="inbound" label="进货量（吨）" width="110" />
        <el-table-column prop="sold" label="销售量（吨）" width="110" />
        <el-table-column prop="stock" label="库存量（吨）" width="110" />
        <el-table-column prop="dealers" label="登记经营户（家）" width="130" />
        <el-table-column label="操作" width="160" fixed="right">
          <template #default="{ row }">
            <button type="button" class="act" @click="openTrace(row)">农药追溯</button>
            <button type="button" class="act" @click="skipDealerPage">登记经营户</button>
          </template>
        </el-table-column>
      </el-table>
      <div class="table-footer">
        <span>共 {{ visibleRows.length }} 条</span>
        <el-pagination
          small background layout="prev, pager, next, sizes"
          :total="visibleRows.length"
          :page-size="pageSize"
          :current-page="page"
          :page-sizes="[10, 20, 50]"
          @current-change="page = $event"
          @size-change="onSize"
        />
      </div>
    </div>

    <el-dialog v-model="traceVisible" width="900px" append-to-body class="trace-dlg" :show-close="true">
      <template #header>
        <div class="dlg-title"><i />农药追溯</div>
      </template>
      <div v-if="current" class="head-card">
        <div class="head-left">
          <div><span>登记证号</span>{{ current.regNo }}</div>
          <div><span>农药名称</span>{{ current.commonName }}</div>
        </div>
        <div class="head-right">
          <div><span>登记证持有人</span>{{ current.holder }}</div>
        </div>
      </div>
      <div class="sub-tabs">
        <button type="button" :class="{ on: traceTab === '来源' }" @click="traceTab = '来源'">农药来源</button>
        <button type="button" :class="{ on: traceTab === '去向' }" @click="traceTab = '去向'">农药去向</button>
      </div>

      <template v-if="traceTab === '来源'">
        <div class="dlg-filter">
          <label>供应商名称：</label>
          <el-input v-model="sourceForm.name" placeholder="请输入" clearable style="width: 160px" />
          <label>联系人：</label>
          <el-input v-model="sourceForm.contact" placeholder="请输入" clearable style="width: 140px" />
          <label>联系电话：</label>
          <el-input v-model="sourceForm.phone" placeholder="请输入" clearable style="width: 140px" />
        </div>
        <div class="dlg-filter">
          <label>统计交易时间：</label>
          <div class="chips">
            <button v-for="c in sourceChips" :key="c" type="button" :class="{ on: sourceForm.period === c }" @click="setSourcePeriod(c)">{{ c }}</button>
          </div>
          <el-date-picker v-model="sourceForm.range" type="daterange" value-format="YYYY-MM-DD" start-placeholder="开始日期" end-placeholder="结束日期" range-separator="至" style="width: 240px" />
          <el-button class="btn-search" @click="sourceSearched = true">搜索</el-button>
          <el-button class="btn-export" @click="openDemoFill('导出')">导出</el-button>
        </div>
        <el-table :data="sourceSearched ? sourceRows : []" border class="pes-table" empty-text="暂无数据">
          <el-table-column prop="name" label="供应商名称" min-width="140" />
          <el-table-column prop="contact" label="联系人" width="100" />
          <el-table-column prop="phone" label="联系电话" width="120" />
          <el-table-column prop="qty" label="供应量（吨）" width="120" />
          <el-table-column prop="buyers" label="买家数量（人）" width="120" />
          <el-table-column label="操作" width="170">
            <template #default="{ row }">
              <el-button size="small" class="btn-green" @click="openBuyers(row)">查看买家</el-button>
              <el-button size="small" class="btn-search" @click="goTxn(row)">交易明细</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>

      <template v-else>
        <div class="dlg-filter">
          <label>买家名称：</label>
          <el-input v-model="destForm.name" placeholder="请输入" clearable style="width: 180px" />
          <label>联系电话：</label>
          <el-input v-model="destForm.phone" placeholder="请输入" clearable style="width: 160px" />
        </div>
        <div class="dlg-filter">
          <label>统计交易时间：</label>
          <div class="chips">
            <button v-for="c in sourceChips" :key="c" type="button" :class="{ on: destForm.period === c }" @click="destForm.period = c">{{ c }}</button>
          </div>
          <el-date-picker v-model="destForm.range" type="daterange" value-format="YYYY-MM-DD" start-placeholder="开始日期" end-placeholder="结束日期" range-separator="至" style="width: 240px" />
          <el-button class="btn-search" @click="destSearched = true">搜索</el-button>
          <el-button class="btn-export" @click="openDemoFill('导出')">导出</el-button>
        </div>
        <el-table :data="destSearched ? destRows : []" border class="pes-table" empty-text="暂无数据">
          <el-table-column prop="name" label="买家名称" min-width="140" />
          <el-table-column prop="phone" label="联系电话" width="130" />
          <el-table-column prop="qty" label="购买量（吨）" width="120" />
          <el-table-column prop="suppliers" label="供应商数量（家）" width="140" />
          <el-table-column label="操作" width="120" />
        </el-table>
      </template>
    </el-dialog>

    <el-dialog v-model="buyerVisible" width="860px" append-to-body>
      <template #header>
        <div class="dlg-title"><i />相关采购主体</div>
      </template>
      <div v-if="current && currentSource" class="head-card">
        <div class="head-left">
          <div><span>登记证号</span>{{ current.regNo }}</div>
          <div><span>农药名称</span>{{ current.commonName }}</div>
          <div><span>交易时间</span>{{ sourceRangeText }}</div>
        </div>
        <div class="head-right">
          <div><span>供应商名称</span>{{ currentSource.name }}</div>
          <div><span>登记证持有人</span>{{ current.holder }}</div>
        </div>
      </div>
      <div class="dlg-filter">
        <label>买家名称：</label>
        <el-input v-model="buyerForm.name" placeholder="请输入" clearable style="width: 180px" />
        <label>联系电话：</label>
        <el-input v-model="buyerForm.phone" placeholder="请输入" clearable style="width: 160px" />
        <el-button class="btn-search" @click="buyerSearched = true">搜索</el-button>
        <el-button class="btn-export" @click="openDemoFill('导出')">导出</el-button>
      </div>
      <el-table :data="buyerSearched ? buyerRows : buyerRows" border class="pes-table" empty-text="暂无数据">
        <el-table-column prop="name" label="买家名称" min-width="160" />
        <el-table-column prop="phone" label="联系电话" width="140" />
        <el-table-column prop="qty" label="购买量（吨）" width="120" />
        <el-table-column label="操作" width="120">
          <template #default="{ row }">
            <el-button size="small" class="btn-search" @click="goTxn(currentSource, row)">交易明细</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script setup>
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { openDemoFill } from '@/components/pes/pesActions'
import { PES_LIST_PAGES } from './pages'

const router = useRouter()
const pageConf = PES_LIST_PAGES['operation-pesticide'] || { rows: [] }
const timeChips = ['昨日', '最近15天', '最近30天', '本月', '近三个月', '本年度']
const sourceChips = ['昨日', '最近15天', '本月', '上月', '全年']

function pad(n) { return String(n).padStart(2, '0') }
function fmt(d) { return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` }
function rangeOf(chip) {
  const t = new Date()
  const today = new Date(t.getFullYear(), t.getMonth(), t.getDate())
  const d = (offset) => { const x = new Date(today); x.setDate(x.getDate() + offset); return x }
  if (chip === '昨日') return [fmt(d(-1)), fmt(d(-1))]
  if (chip === '最近15天') return [fmt(d(-14)), fmt(today)]
  if (chip === '最近30天') return [fmt(d(-29)), fmt(today)]
  if (chip === '本月') return [fmt(new Date(today.getFullYear(), today.getMonth(), 1)), fmt(today)]
  if (chip === '上个月' || chip === '上月') {
    const first = new Date(today.getFullYear(), today.getMonth() - 1, 1)
    const last = new Date(today.getFullYear(), today.getMonth(), 0)
    return [fmt(first), fmt(last)]
  }
  if (chip === '近三个月') return [fmt(new Date(today.getFullYear(), today.getMonth() - 2, 1)), fmt(today)]
  if (chip === '本年度' || chip === '全年') return [fmt(new Date(today.getFullYear(), 0, 1)), fmt(today)]
  return [fmt(today), fmt(today)]
}

const form = reactive({
  regNo: '',
  commonName: '',
  holder: '',
  province: '安徽省',
  city: '',
  district: '',
  restricted: '不区分',
  regStatus: '全部',
  period: '昨日',
  range: rangeOf('昨日')
})
const appliedPeriod = ref('昨日')
const searched = ref(false)
const side = ref('零售商')
const page = ref(1)
const pageSize = ref(10)

function setPeriod(c) {
  form.period = c
  form.range = rangeOf(c)
}
function onSearch() {
  appliedPeriod.value = form.period
  searched.value = true
  page.value = 1
}
function onSize(s) { pageSize.value = s; page.value = 1 }

const allRows = computed(() => (pageConf.rows || []).map((r) => ({
  ...r,
  side: r.side || '零售商'
})))

const periodRows = computed(() => {
  if (appliedPeriod.value === '昨日' || !searched.value) return []
  return allRows.value
})
const retailCount = computed(() => periodRows.value.filter((r) => r.side === '零售商').length)
const wholesaleCount = computed(() => periodRows.value.filter((r) => r.side === '批发商').length)

const visibleRows = computed(() => {
  return periodRows.value.filter((r) => {
    if (r.side !== side.value) return false
    if (form.regNo && !String(r.regNo).includes(form.regNo)) return false
    if (form.commonName && !String(r.commonName).includes(form.commonName)) return false
    if (form.holder && !String(r.holder).includes(form.holder)) return false
    if (form.restricted !== '不区分' && r.restricted !== form.restricted) return false
    return true
  })
})
const pagedRows = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return visibleRows.value.slice(start, start + pageSize.value)
})

const traceVisible = ref(false)
const current = ref(null)
const traceTab = ref('来源')
const sourceSearched = ref(false)
const destSearched = ref(false)
const sourceForm = reactive({ name: '', contact: '', phone: '', period: '最近15天', range: rangeOf('最近15天') })
const destForm = reactive({ name: '', phone: '', period: '最近15天', range: rangeOf('最近15天') })
function setSourcePeriod(c) {
  sourceForm.period = c
  sourceForm.range = rangeOf(c)
}
const sourceRows = [
  { id: 'src-1', name: '演示供应商甲', contact: '演示联系人甲', phone: '—', qty: '0.02', buyers: '1' }
]
const destRows = []
const sourceRangeText = computed(() => {
  const r = sourceForm.range || []
  return r.length === 2 ? `${r[0]}-${r[1]}` : '—'
})

function openTrace(row) {
  current.value = row
  traceTab.value = '来源'
  sourceSearched.value = false
  destSearched.value = false
  sourceForm.period = '最近15天'
  sourceForm.range = rangeOf('最近15天')
  destForm.period = '最近15天'
  destForm.range = rangeOf('最近15天')
  traceVisible.value = true
}

const buyerVisible = ref(false)
const currentSource = ref(null)
const buyerForm = reactive({ name: '', phone: '' })
const buyerSearched = ref(true)
const buyerRows = [
  { id: 'buy-1', name: '演示采购主体甲', phone: '—', qty: '0.02' }
]
function openBuyers(row) {
  currentSource.value = row
  buyerVisible.value = true
}
function goTxn(source, buyer) {
  traceVisible.value = false
  buyerVisible.value = false
  const range = sourceForm.range || rangeOf('最近15天')
  router.push({
    path: '/pes/operation/purchases',
    query: {
      type: '1',
      curTab: side.value === '批发商' ? '2' : '1',
      dateTime: Array.isArray(range) ? range.join(',') : '',
      productRegister: current.value?.regNo || '',
      companyName: buyer?.name || '',
      supplierName: source?.name || ''
    }
  })
}
const skipDealerPage = () => ElMessage.info('登记经营户内页现网未观察，本轮不展开')
</script>
<style scoped>
.panel { background: #fff; border-radius: 2px; padding: 16px; }
.filter .line { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 10px; margin-bottom: 10px; }
.filter label { color: #303133; }
.chips { display: flex; gap: 6px; flex-wrap: wrap; }
.chips button {
  border: 1px solid #DCDFE6; background: #fff; color: #303133;
  padding: 4px 10px; border-radius: 2px; cursor: pointer;
}
.chips button.on { background: #3B82F6; color: #fff; border-color: #3B82F6; }
.btn-search, .btn-search:hover { background: #3B82F6; border-color: #3B82F6; color: #fff; }
.btn-export, .btn-export:hover { background: #fff; border-color: #3B82F6; color: #3B82F6; }
.btn-green, .btn-green:hover { background: #31B854; border-color: #31B854; color: #fff; }
.type-tabs {
  display: flex;
  background: #F3F6F9;
  margin: 8px 0 0;
}
.type-tabs button {
  border: 0;
  background: transparent;
  padding: 8px 18px;
  cursor: pointer;
  color: #303133;
}
.type-tabs button.on { background: #fff; color: #3B82F6; border-bottom: 2px solid #3B82F6; }
.act { border: 0; background: transparent; color: #3B82F6; cursor: pointer; margin-right: 8px; font: inherit; }
.table-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 10px; color: #909399; font-size: 12px; }
.dlg-title { display: flex; align-items: center; gap: 8px; font-weight: 600; }
.dlg-title i { width: 4px; height: 14px; background: #3B82F6; display: inline-block; }
.head-card {
  display: grid;
  grid-template-columns: 1fr 1fr;
  border: 1px solid #E5EAF0;
  margin-bottom: 12px;
}
.head-left, .head-right { padding: 10px 14px; }
.head-left { background: #FAFBFC; }
.head-card span { display: inline-block; width: 96px; color: #909399; }
.sub-tabs { display: flex; gap: 0; margin-bottom: 12px; }
.sub-tabs button {
  border: 0;
  background: #F0F2F5;
  padding: 8px 18px;
  cursor: pointer;
  color: #303133;
}
.sub-tabs button.on { background: #5B9CFF; color: #fff; }
.dlg-filter { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin-bottom: 10px; }
:deep(.pes-table) { --el-table-header-bg-color: #F5F7FA; }
:deep(.el-pagination.is-background .el-pager li.is-active) { background-color: #3B82F6; }
</style>

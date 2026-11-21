<template>
  <div class="pes-page">
    <div class="panel">
      <div class="filter">
        <div class="line">
          <label>经营企业名称：</label>
          <el-input v-model="form.name" placeholder="请输入经营企业名称" clearable style="width: 200px" />
          <label>农药经营许可证号：</label>
          <el-input v-model="form.license" placeholder="请输入农药经营许可证" clearable style="width: 200px" />
          <label>法人姓名：</label>
          <el-input v-model="form.legal" placeholder="请输入法人姓名" clearable style="width: 180px" />
        </div>
        <div class="line">
          <label>联系方式：</label>
          <el-input v-model="form.phone" placeholder="请输入联系方式" clearable style="width: 180px" />
          <label>账号名称：</label>
          <el-input v-model="form.account" placeholder="请输入账号名称" clearable style="width: 180px" />
          <label>限制性农药销售：</label>
          <el-select v-model="form.restrictSale" style="width: 140px">
            <el-option label="全部" value="全部" />
            <el-option label="已关闭" value="已关闭" />
            <el-option label="已开启" value="已开启" />
          </el-select>
        </div>
        <div class="line">
          <label>账号状态：</label>
          <el-select v-model="form.accountStatus" style="width: 140px">
            <el-option label="已启用" value="已启用" />
            <el-option label="全部" value="全部" />
          </el-select>
          <label>数据来源：</label>
          <el-select v-model="form.source" style="width: 140px">
            <el-option label="全部" value="全部" />
            <el-option label="省平台" value="省平台" />
            <el-option label="第三方" value="第三方" />
          </el-select>
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
        </div>
        <div class="line">
          <label>统计日期：</label>
          <div class="chips">
            <button v-for="c in dateChips" :key="c" type="button" :class="{ on: form.period === c }" @click="form.period = c">{{ c }}</button>
          </div>
          <el-button class="btn-search" @click="onSearch">搜索</el-button>
          <el-button class="btn-export" @click="openDemoFill('导出')">导出</el-button>
        </div>
      </div>

      <div class="type-tabs">
        <button type="button" :class="{ on: role === '零售商' }" @click="role = '零售商'">零售商</button>
        <button type="button" :class="{ on: role === '批发商' }" @click="role = '批发商'">批发商</button>
      </div>
      <div class="chips bar-chips">
        <button type="button" :class="{ on: chip === '全部' }" @click="chip = '全部'">全部{{ role }}{{ counts.all }}家</button>
        <button type="button" :class="{ on: chip === '已上报' }" @click="chip = '已上报'">只看已上报的{{ counts.reported }}家</button>
        <button type="button" :class="{ on: chip === '未上报' }" @click="chip = '未上报'">只看未上报的{{ counts.unreported }}家</button>
      </div>

      <el-table :data="pagedRows" border class="pes-table" empty-text="暂无数据">
        <el-table-column type="index" label="序号" width="60" :index="indexMethod" />
        <el-table-column prop="name" label="经营企业名称" min-width="140" show-overflow-tooltip />
        <el-table-column prop="uscc" label="统一社会信用代码" min-width="160" show-overflow-tooltip />
        <el-table-column prop="license" label="农药经营许可证号" min-width="150" show-overflow-tooltip />
        <el-table-column prop="legal" label="法人姓名" width="100" />
        <el-table-column prop="account" label="账号名称" width="120" />
        <el-table-column prop="phone" label="联系方式" width="120" />
        <el-table-column prop="area" label="所在区域" width="130" show-overflow-tooltip />
        <el-table-column label="限制性农药销售" width="140">
          <template #default="{ row }">
            <span>{{ row.restrictSale || '已关闭' }}</span>
            <button type="button" class="act" @click="openDemoFill(row.restrictSale === '已开启' ? '关闭限制性销售' : '开启限制性销售')">{{ row.restrictSale === '已开启' ? '关闭' : '开启' }}</button>
          </template>
        </el-table-column>
        <el-table-column prop="accountStatus" label="账号状态" width="100" />
        <el-table-column prop="source" label="数据来源" width="100" />
        <el-table-column prop="reportLedger" min-width="120">
          <template #header><span class="header-orange">上报台账（条）</span></template>
        </el-table-column>
        <el-table-column prop="inbound" label="进货量（吨）" width="110" />
        <el-table-column prop="sold" label="销售量（吨）" width="110" />
        <el-table-column prop="stock" label="库存量（吨）" width="110" />
        <el-table-column label="操作" width="100" fixed="right">
          <template #default="{ row }">
            <button type="button" class="act" @click="openDetail(row)">查看详情</button>
          </template>
        </el-table-column>
      </el-table>
      <div class="table-footer">
        <span>共 {{ filtered.length }} 条</span>
        <el-pagination
          small background layout="total, prev, pager, next, sizes"
          :total="filtered.length"
          :page-size="pageSize"
          :current-page="page"
          :page-sizes="[10, 20, 50]"
          @current-change="page = $event"
          @size-change="onSize"
        />
      </div>
    </div>

    <el-dialog v-model="visible" width="980px" append-to-body :show-close="true" class="ent-dlg">
      <template #header>
        <div class="detail-tabs">
          <button v-for="t in detailTabs" :key="t" type="button" :class="{ on: dtab === t }" @click="onDetailTab(t)">{{ t }}</button>
        </div>
      </template>

      <div v-if="dtab === '基本信息' && current" class="basic">
        <h4 class="sec"><i />数据概览</h4>
        <div class="overview-tools">
          <el-date-picker v-model="overviewMonth" type="month" value-format="YYYY-MM" placeholder="选择月" style="width: 140px" />
          <el-date-picker v-model="overviewYear" type="year" value-format="YYYY" placeholder="选择年" style="width: 120px" />
          <span class="range-text">{{ overviewRangeText }}</span>
        </div>
        <div class="kpis">
          <div><b>{{ current.reportLedger || '—' }}</b><span>上报记录（条）</span></div>
          <div><b>{{ current.inbound || '—' }}</b><span>进货总量（吨）</span></div>
          <div><b>{{ current.sold || '—' }}</b><span>销售总量（吨）</span></div>
          <div><b>{{ current.stock || '—' }}</b><span>库存总量（吨）</span></div>
        </div>

        <h4 class="sec"><i />账号信息</h4>
        <div class="grid2">
          <div><label>账户名称：</label>{{ current.account || '—' }}</div>
          <div><label>注册日期：</label>{{ current.registeredAt || '—' }}</div>
          <div><label>审核状态：</label>{{ current.auditStatus || '审核通过' }}</div>
          <div><label>账号状态：</label>{{ current.accountEnabled || '已启用' }}</div>
          <div><label>备注：</label>{{ current.remark || '-' }}</div>
          <div><label>平台名称：</label>{{ current.source || '省平台' }}</div>
        </div>

        <h4 class="sec"><i />主体信息</h4>
        <div class="grid2">
          <div><label>主体名称：</label>{{ current.name || '—' }}</div>
          <div><label>法人姓名：</label>{{ current.legal || '—' }}</div>
          <div><label>联系方式：</label>{{ fill(current.phone, '000-0000-0000') }}</div>
          <div><label>所在区域：</label>{{ current.area || '—' }}</div>
          <div class="full"><label>详细地址：</label>{{ fill(current.address, (current.area || '演示区县A') + '演示街道1号') }}</div>
          <div><label>统一社会信用代码：</label>{{ fill(current.uscc, '00000000000000000X（演示）') }}</div>
          <div>
            <label>营业执照照片：</label>
            <div class="photo">未上传证件图片</div>
          </div>
          <div><label>农药经营许可证号：</label>{{ fill(current.license, '演示-农经证-0001') }}</div>
          <div><label>许可证有效期：</label>{{ fill(current.licenseValid, '2024-01-01 至 2029-12-31') }}</div>
          <div>
            <label>农药经营许可证照片：</label>
            <div class="photo">未上传证件图片</div>
          </div>
        </div>
      </div>

      <div v-else-if="dtab === '登记农药'" class="tab-body">
        <div class="chips">
          <button type="button" :class="{ on: saleState === '在售' }" @click="saleState = '在售'">在售</button>
          <button type="button" :class="{ on: saleState === '下架' }" @click="saleState = '下架'">下架</button>
        </div>
        <el-table :data="pesticideRows" border class="pes-table" empty-text="暂无数据">
          <el-table-column prop="regNo" label="登记证号" min-width="140" />
          <el-table-column prop="commonName" label="农药通用名" min-width="140" />
          <el-table-column prop="holder" label="登记证持有人" min-width="140" />
          <el-table-column prop="restricted" label="限制性农药" width="100" />
          <el-table-column prop="inbound" label="进货量（吨）" width="110" />
          <el-table-column prop="sold" label="销售量（吨）" width="110" />
          <el-table-column prop="stock" label="库存量（吨）" width="110" />
        </el-table>
      </div>

      <div v-else-if="dtab === '销售明细'" class="tab-body">
        <el-table :data="saleRows" border class="pes-table" empty-text="暂无数据">
          <el-table-column prop="product" label="产品名称" min-width="120" />
          <el-table-column prop="regNo" label="登记证号" min-width="130" />
          <el-table-column prop="category" label="农药类别" width="100" />
          <el-table-column prop="nature" label="产品性质" width="90" />
          <el-table-column prop="restricted" label="是否限制性农药" width="130" />
          <el-table-column prop="time" label="销售（出库）时间" width="160" />
          <el-table-column prop="qty" label="销售（出库）数量" width="130" />
          <el-table-column prop="spec" label="产品规格" width="90" />
          <el-table-column prop="enterprise" label="销售（出库）企业" min-width="140" />
          <el-table-column prop="area" label="所在区域" width="120" />
          <el-table-column prop="buyer" label="购买人名称" width="120" />
          <el-table-column prop="source" label="数据来源" width="90" />
        </el-table>
      </div>

      <template #footer>
        <el-button disabled>审核</el-button>
        <el-button class="btn-reset" @click="openDemoFill('重设密码', { kind: 'password' })">重设密码</el-button>
        <el-button class="btn-lock" @click="openDemoFill('锁定账号')">锁定账号</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { openDemoFill } from '@/components/pes/pesActions'

const props = defineProps({ page: { type: Object, required: true } })
const route = useRoute()
const router = useRouter()
const dateChips = ['最近15天', '本月', '上个月', '本年度', '按日', '按月']
const form = reactive({
  name: '', license: '', legal: '', phone: '', account: '',
  restrictSale: '全部', accountStatus: '已启用', source: '全部',
  province: '安徽省', city: '', district: '', period: '最近15天'
})
const applied = reactive({ ...form })
const role = ref('零售商')
const chip = ref('全部')
const page = ref(1)
const pageSize = ref(10)
const visible = ref(false)
const current = ref(null)
const detailTabs = ['基本信息', '登记农药', '进货明细', '销售明细']
const dtab = ref('基本信息')
const saleState = ref('在售')
const overviewMonth = ref('')
const overviewYear = ref('')

watch(() => route.query, (q) => {
  if (q.side === '零售' || q.side === '零售商') role.value = '零售商'
  if (q.side === '批发' || q.side === '批发商') role.value = '批发商'
  if (q.filing === '1') chip.value = '全部'
}, { immediate: true })

const roleRows = computed(() => (props.page.rows || []).filter((r) => r.role === role.value))
const counts = computed(() => {
  const rows = roleRows.value
  return {
    all: rows.length,
    reported: rows.filter((r) => r.report === '已上报').length,
    unreported: rows.filter((r) => r.report === '未上报').length
  }
})
const filtered = computed(() => roleRows.value.filter((r) => {
  if (chip.value !== '全部' && r.report !== chip.value) return false
  if (applied.name && !String(r.name).includes(applied.name)) return false
  if (applied.license && !String(r.license).includes(applied.license)) return false
  if (applied.legal && !String(r.legal).includes(applied.legal)) return false
  if (applied.phone && !String(r.phone).includes(applied.phone)) return false
  if (applied.account && !String(r.account).includes(applied.account)) return false
  if (applied.restrictSale !== '全部' && r.restrictSale !== applied.restrictSale) return false
  if (applied.source !== '全部' && r.source !== applied.source) return false
  return true
}))
const pagedRows = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return filtered.value.slice(start, start + pageSize.value)
})
function indexMethod(i) { return (page.value - 1) * pageSize.value + i + 1 }
function onSearch() {
  Object.assign(applied, form)
  page.value = 1
}
function onSize(s) { pageSize.value = s; page.value = 1 }

const overviewRangeText = computed(() => {
  const t = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  const end = `${t.getFullYear()}-${pad(t.getMonth() + 1)}-${pad(t.getDate())}`
  const start = new Date(t.getFullYear(), t.getMonth(), t.getDate() - 14)
  return `${start.getFullYear()}-${pad(start.getMonth() + 1)}-${pad(start.getDate())} - ${end}`
})

function fill(value, fallback) {
  return !value || value === '—' ? fallback : value
}

const pesticideCatalog = {
  'demo-e1': [
    { regNo: '演示-PD2017-0001', commonName: '演示农药甲', holder: '演示生产企业甲', restricted: '否', inbound: '0.50', sold: '0.20', stock: '0.30', saleState: '在售' },
    { regNo: '演示-PD2018-0002', commonName: '演示农药乙', holder: '演示生产企业乙', restricted: '是', inbound: '0.10', sold: '0.00', stock: '0.10', saleState: '下架' }
  ],
  'demo-e4': [
    { regNo: '演示-PD2017-0001', commonName: '演示农药甲', holder: '演示生产企业甲', restricted: '否', inbound: '0.10', sold: '0.04', stock: '0.06', saleState: '在售' }
  ],
  'demo-e2': []
}

const saleCatalog = {
  'demo-e1': [
    { product: '演示农药甲', regNo: '演示-PD2017-0001', category: '杀虫剂', nature: '制剂', restricted: '否', time: '2026-11-20 10:18:00', qty: '20', spec: '200ml', enterprise: '演示经营企业甲', area: '演示区县A', buyer: '演示购买人丙', source: '省平台' }
  ],
  'demo-e4': [
    { product: '演示农药甲', regNo: '演示-PD2017-0001', category: '杀虫剂', nature: '制剂', restricted: '否', time: '2026-11-18 16:40:00', qty: '4', spec: '200ml', enterprise: '演示经营企业丙', area: '演示区县A', buyer: '演示购买人丁', source: '第三方' }
  ]
}

const pesticideRows = computed(() => {
  if (!current.value) return []
  const rows = current.value.pesticides || pesticideCatalog[current.value.id] || defaultPesticides(current.value)
  return rows.filter((row) => row.saleState === saleState.value)
})

function defaultPesticides(ent) {
  if (ent.report === '未上报') return []
  return [{
    regNo: '演示-PD2017-0001',
    commonName: '演示农药甲',
    holder: '演示生产企业甲',
    restricted: '否',
    inbound: ent.inbound || '0.10',
    sold: ent.sold || '0.04',
    stock: ent.stock || '0.06',
    saleState: '在售'
  }]
}

const saleRows = computed(() => {
  if (!current.value) return []
  if ((current.value.sales || []).length) return current.value.sales
  if (saleCatalog[current.value.id]) return saleCatalog[current.value.id]
  if (current.value.report === '未上报') return []
  return [{
    product: '演示农药甲',
    regNo: '演示-PD2017-0001',
    category: '杀虫剂',
    nature: '制剂',
    restricted: '否',
    time: '2026-11-19 11:00:00',
    qty: '2',
    spec: '200ml',
    enterprise: current.value.name,
    area: current.value.area || '演示区县A',
    buyer: '演示购买人丙',
    source: current.value.source || '省平台'
  }]
})

function openDetail(row) {
  current.value = row
  dtab.value = '基本信息'
  saleState.value = '在售'
  visible.value = true
}
function onDetailTab(t) {
  if (t === '进货明细') {
    visible.value = false
    router.push({
      path: '/pes/operation/purchases',
      query: {
        type: '1',
        curTab: role.value === '批发商' ? '2' : '1',
        companyName: current.value?.name || '',
        mainBodyId: current.value?.id || '',
        id: current.value?.id || ''
      }
    })
    return
  }
  dtab.value = t
}
</script>
<style scoped>
.panel { background: #fff; border-radius: 2px; padding: 16px; }
.filter .line { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 10px; margin-bottom: 10px; }
.filter label { color: #303133; }
.chips { display: flex; gap: 6px; flex-wrap: wrap; }
.chips button, .bar-chips button {
  border: 1px solid #DCDFE6; background: #fff; color: #303133;
  padding: 4px 12px; border-radius: 2px; cursor: pointer;
}
.chips button.on, .bar-chips button.on { background: #3B82F6; color: #fff; border-color: #3B82F6; }
.bar-chips { margin: 10px 0; }
.bar-chips button.on { background: #3B82F6; }
.btn-search, .btn-search:hover { background: #3B82F6; border-color: #3B82F6; color: #fff; }
.btn-export, .btn-export:hover { background: #fff; border-color: #3B82F6; color: #3B82F6; }
.type-tabs { display: flex; background: #F3F6F9; margin-top: 4px; }
.type-tabs button { border: 0; background: transparent; padding: 8px 18px; cursor: pointer; }
.type-tabs button.on { background: #fff; color: #3B82F6; border-bottom: 2px solid #3B82F6; }
.act { border: 0; background: transparent; color: #3B82F6; cursor: pointer; margin-left: 6px; font: inherit; }
.header-orange { color: #E6A23C; font-weight: 600; }
.header-orange::after { content: ''; display: inline-block; width: 6px; height: 6px; margin-left: 4px; background: #E6A23C; border-radius: 50%; vertical-align: super; }
.table-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 10px; color: #909399; font-size: 12px; }
.detail-tabs { display: flex; width: 100%; background: #F3F6F9; }
.detail-tabs button { flex: 1; border: 0; background: transparent; padding: 10px 0; cursor: pointer; color: #303133; }
.detail-tabs button.on { background: #3B82F6; color: #fff; }
.sec { margin: 0 0 10px; font-size: 14px; display: flex; align-items: center; gap: 8px; }
.sec i { width: 4px; height: 14px; background: #3B82F6; display: inline-block; }
.overview-tools { display: flex; gap: 8px; align-items: center; margin-bottom: 12px; }
.range-text { margin-left: auto; color: #909399; font-size: 12px; }
.kpis { display: grid; grid-template-columns: repeat(4, 1fr); text-align: center; margin-bottom: 18px; }
.kpis b { display: block; font-size: 26px; color: #303133; }
.kpis span { color: #909399; font-size: 13px; }
.grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px 24px; margin-bottom: 16px; color: #303133; }
.grid2 label { color: #909399; margin-right: 8px; }
.grid2 .full { grid-column: 1 / -1; }
.photo {
  display: inline-flex; align-items: center; justify-content: center;
  width: 110px; height: 80px; background: #C0C4CC; color: #fff; font-size: 12px; border-radius: 2px; vertical-align: middle;
}
.hint, .tab-body { color: #909399; font-size: 13px; }
.btn-reset, .btn-reset:hover { background: #F3D19E; border-color: #F3D19E; color: #946200; }
.btn-lock, .btn-lock:hover { background: #FDE2E2; border-color: #F89898; color: #C45656; }
:deep(.pes-table) { --el-table-header-bg-color: #F5F7FA; }
:deep(.el-pagination.is-background .el-pager li.is-active) { background-color: #3B82F6; }
:deep(.el-dialog__header) { padding: 0; margin-right: 0; }
:deep(.el-dialog__headerbtn) { top: 8px; z-index: 2; }
</style>

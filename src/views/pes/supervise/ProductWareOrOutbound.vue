<template>
  <div class="pes-page">
    <div class="panel">
      <div class="filter">
        <div class="line">
          <label>产品名称：</label>
          <el-input v-model="form.product" placeholder="请输入产品名称" clearable style="width: 180px" />
          <label>登记证号：</label>
          <el-input v-model="form.regNo" placeholder="请输入登记证号" clearable style="width: 180px" />
          <label>农药类别：</label>
          <el-select v-model="form.category" placeholder="请选择" clearable style="width: 140px">
            <el-option v-for="c in categories" :key="c" :label="c" :value="c" />
          </el-select>
          <label>是否限制性农药：</label>
          <el-select v-model="form.restricted" placeholder="请选择" clearable style="width: 140px">
            <el-option label="是" value="是" />
            <el-option label="否" value="否" />
          </el-select>
        </div>
        <div class="line">
          <label>是否预售数据：</label>
          <el-select v-model="form.presale" style="width: 140px">
            <el-option label="全部" value="全部" />
          </el-select>
          <label>经营企业名称：</label>
          <el-input v-model="form.companyName" placeholder="请输入经营企业名称" clearable style="width: 180px" />
          <label>{{ isSale ? '农药经营许可证' : '农药经营许可证' }}：</label>
          <el-input v-model="form.license" placeholder="请输入农药经营许可证" clearable style="width: 180px" />
          <label>{{ isSale ? '购买人名称' : '供应商名称' }}：</label>
          <el-input v-model="form.partner" :placeholder="isSale ? '请输入购买人名称' : '请输入供应商名称'" clearable style="width: 180px" />
        </div>
        <div class="line">
          <label>数据来源：</label>
          <el-select v-model="form.source" style="width: 140px">
            <el-option label="全部" value="全部" />
            <el-option label="省平台" value="省平台" />
            <el-option label="第三方" value="第三方" />
          </el-select>
          <label>统计时间：</label>
          <el-date-picker
            v-model="form.range"
            type="daterange"
            value-format="YYYY-MM-DD"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            range-separator="至"
            style="width: 250px"
          />
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
          <el-button class="btn-search" @click="onSearch">搜索</el-button>
          <el-button class="btn-export" @click="openDemoFill('导出')">导出</el-button>
        </div>
      </div>

      <div class="type-tabs">
        <button type="button" :class="{ on: tab === '零售商' }" @click="tab = '零售商'">零售商</button>
        <button type="button" :class="{ on: tab === '批发商' }" @click="tab = '批发商'">批发商</button>
      </div>

      <el-table :data="pagedRows" border class="pes-table" empty-text="暂无数据">
        <el-table-column type="index" label="序号" width="55" :index="indexMethod" />
        <el-table-column
          v-for="col in dataColumns"
          :key="col.prop"
          :prop="col.prop"
          :label="col.label"
          :min-width="col.width || 120"
          show-overflow-tooltip
        >
          <template #default="{ row }">
            <button v-if="isLink(col.prop)" type="button" class="cell-link" @click="ElMessage.info('关联内页现网未观察，本轮不展开')">{{ row[col.prop] || '—' }}</button>
            <span v-else-if="col.alertMark && row.isAlert === '是'" class="alert-cell">
              <i class="alert-icon" />{{ row[col.prop] || '—' }}
              <em v-if="row.qtyFlag" class="qty-flag">{{ row.qtyFlag }}</em>
            </span>
            <span v-else>{{ row[col.prop] || '—' }}</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="table-footer">
        <span>共 {{ filtered.length }} 条</span>
        <el-pagination
          small background layout="total, prev, pager, next, sizes"
          :total="filtered.length"
          :page-size="pageSize"
          :current-page="pageNo"
          :page-sizes="[10, 20, 50]"
          @current-change="pageNo = $event"
          @size-change="onSize"
        />
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { openDemoFill } from '@/components/pes/pesActions'
import { usePesLoopStore } from '@/stores/pesLoop'

const props = defineProps({ page: { type: Object, required: true } })
const loop = usePesLoopStore()
const route = useRoute()
const isSale = computed(() => props.page.type === 2)
const categories = ['杀虫剂', '除草剂', '杀菌剂']
const form = reactive({
  product: '', regNo: '', category: '', restricted: '',
  presale: '全部', companyName: '', license: '', partner: '',
  source: '全部', range: [], province: '安徽省', city: '', district: ''
})
const applied = reactive({ ...form, range: [] })
const tab = ref('零售商')
const pageNo = ref(1)
const pageSize = ref(10)
const isAlert = computed(() => route.query.alert === '1')

const dataColumns = computed(() => (props.page.columns || []).filter((c) => c.type !== 'index'))

function isLink(prop) {
  return ['regNo', 'enterprise', 'supplier', 'buyer'].includes(prop)
}

function applyQuery(q) {
  if (q.productRegister) form.regNo = q.productRegister
  if (q.companyName) form.companyName = q.companyName
  if (q.supplierName && !isSale.value) form.partner = q.supplierName
  if (q.dateTime) {
    const parts = String(q.dateTime).split(',')
    if (parts.length === 2) form.range = parts
  }
  if (q.curTab === '2' || q.side === '批发' || q.side === '批发商') tab.value = '批发商'
  else if (q.curTab === '1' || q.side === '零售' || q.side === '零售商') tab.value = '零售商'
  Object.assign(applied, { ...form, range: form.range ? [...form.range] : [] })
}

watch(() => route.query, (q) => applyQuery(q), { immediate: true })

function onSearch() {
  Object.assign(applied, { ...form, range: form.range ? [...form.range] : [] })
  pageNo.value = 1
}
function onSize(s) { pageSize.value = s; pageNo.value = 1 }
function indexMethod(i) { return (pageNo.value - 1) * pageSize.value + i + 1 }

const sourceRows = computed(() => {
  if (isAlert.value) return props.page.alertRows || []
  const live = isSale.value ? loop.outbounds : loop.inbounds
  return [...live, ...(props.page.rows || [])]
})

const filtered = computed(() => sourceRows.value.filter((r) => {
  const side = r.side === '批发' || r.side === '批发商' ? '批发商' : '零售商'
  if (side !== tab.value) return false
  if (isAlert.value && route.query.side) {
    const qSide = route.query.side === '批发' || route.query.side === '批发商' ? '批发商' : '零售商'
    if (side !== qSide) return false
  }
  if (applied.product && !String(r.product || '').includes(applied.product)) return false
  if (applied.regNo && !String(r.regNo || '').includes(applied.regNo)) return false
  if (applied.category && r.category !== applied.category) return false
  if (applied.restricted && r.restricted !== applied.restricted) return false
  if (applied.companyName && !String(r.enterprise || '').includes(applied.companyName)) return false
  const partnerKey = isSale.value ? 'buyer' : 'supplier'
  if (applied.partner && !String(r[partnerKey] || '').includes(applied.partner)) return false
  if (applied.source !== '全部' && r.source !== applied.source) return false
  if (Array.isArray(applied.range) && applied.range.length === 2) {
    const day = String(r.time || '').slice(0, 10)
    if (day && (day < applied.range[0] || day > applied.range[1])) return false
  }
  return true
}))
const pagedRows = computed(() => {
  const start = (pageNo.value - 1) * pageSize.value
  return filtered.value.slice(start, start + pageSize.value)
})
</script>
<style scoped>
.panel { background: #fff; border-radius: 2px; padding: 16px; }
.filter .line { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 10px; margin-bottom: 10px; }
.filter label { color: #303133; }
.btn-search, .btn-search:hover { background: #3B82F6; border-color: #3B82F6; color: #fff; }
.btn-export, .btn-export:hover { background: #fff; border-color: #3B82F6; color: #3B82F6; }
.type-tabs { display: flex; background: #F3F6F9; margin: 4px 0 0; }
.type-tabs button { border: 0; background: transparent; padding: 8px 18px; cursor: pointer; }
.type-tabs button.on { background: #fff; color: #3B82F6; border-bottom: 2px solid #3B82F6; }
.cell-link { border: 0; background: transparent; color: #3B82F6; cursor: pointer; padding: 0; font: inherit; }
.alert-cell { color: #D94A4A; }
.alert-icon { display: inline-block; width: 8px; height: 8px; margin-right: 6px; border-radius: 50%; background: #D94A4A; }
.qty-flag { font-style: normal; margin-left: 6px; font-size: 12px; }
.table-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 10px; color: #909399; font-size: 12px; }
:deep(.pes-table) { --el-table-header-bg-color: #F5F7FA; }
:deep(.el-pagination.is-background .el-pager li.is-active) { background-color: #3B82F6; }
</style>

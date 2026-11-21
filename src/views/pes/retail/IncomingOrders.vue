<template>
  <div class="panel">
    <div class="head">
      <h2>我的入库单</h2>
      <div>
        <el-button text @click="openDemoFill('如何退货给供应商')">如何退货给供应商</el-button>
        <span class="scan">支持扫码搜索</span>
      </div>
    </div>
    <el-form inline>
      <el-form-item label="入库时间">
        <el-date-picker v-model="form.range" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" value-format="YYYY-MM-DD" />
      </el-form-item>
      <el-form-item label="入库单号"><el-input v-model="form.no" /></el-form-item>
      <el-form-item label="供应商信息"><el-input v-model="form.supplier" placeholder="名称/联系方式" /></el-form-item>
      <el-form-item label="商品信息"><el-input v-model="form.goods" placeholder="通用名/别名/登记证号" /></el-form-item>
      <el-form-item>
        <el-button class="green" @click="search">搜索订单</el-button>
        <el-button @click="showAll">显示全部</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="rows" border empty-text="暂无数据">
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="time" label="进货时间" />
      <el-table-column prop="type" label="订单类型" />
      <el-table-column prop="total" label="订单总额（元）" />
      <el-table-column prop="qty" label="入库数量" />
      <el-table-column prop="paid" label="实付金额（元）" />
      <el-table-column prop="supplier" label="供应商" />
      <el-table-column prop="phone" label="联系方式" />
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button link @click="open(row)">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="foot">
      <label><input type="checkbox" v-model="showNo"> 显示入库单号</label>
      <el-button @click="openDemoFill('导出明细')">导出明细</el-button>
    </div>
    <p v-if="showNo && rows.length" class="nos">入库单号：{{ rows.map((r) => r.no).join('、') }}</p>

    <el-dialog v-model="visible" title="入库单详情" width="640px" append-to-body>
      <template v-if="current">
        <h4>供应商信息</h4>
        <p>{{ current.supplier }}　{{ current.phone }}</p>
        <h4>商品信息</h4>
        <p>上报状态：{{ current.report }} <el-button link @click="openDemoFill('撤销上报')">撤销上报</el-button></p>
        <p><el-button link @click="openDemoFill('生产日期')">生产日期</el-button></p>
        <h4>支付信息</h4>
        <p>订单总额：{{ current.total }}　实付金额：{{ current.paid }}</p>
        <h4>其他</h4>
        <p>入库单号：{{ current.no }}　入库时间：{{ current.time }}　订单类型：{{ current.type }}</p>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { computed, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { openDemoFill } from '@/components/pes/pesActions'
import { INCOMING_ORDERS, SUPPLIERS } from './retailData'
const route = useRoute()
const form = reactive({ range: [], no: '', supplier: '', goods: '' })
const all = ref(true)
const showNo = ref(false)
const visible = ref(false)
const current = ref(null)
const source = computed(() => {
  const sid = route.query.supplier
  if (!sid) return INCOMING_ORDERS
  const s = SUPPLIERS.find((x) => x.id === sid)
  if (!s) return INCOMING_ORDERS.filter((o) => false)
  return INCOMING_ORDERS.filter((o) => o.supplier === s.name)
})
const rows = computed(() => {
  if (!all.value && form.range?.length === 2) {
    return source.value.filter((r) => {
      const day = r.time.slice(0, 10)
      return day >= form.range[0] && day <= form.range[1]
    })
  }
  let list = source.value
  if (form.no && list.every) list = list.filter((r) => r.no.includes(form.no))
  if (form.supplier) list = list.filter((r) => r.supplier.includes(form.supplier) || String(r.phone).includes(form.supplier))
  return list
})
function search() { all.value = false }
function showAll() { all.value = true; form.range = []; form.no = ''; form.supplier = ''; form.goods = '' }
function open(row) { current.value = row; visible.value = true }
</script>
<style scoped>
.panel { background: #fff; padding: 14px; }
.head { display: flex; justify-content: space-between; align-items: center; }
h2 { margin: 0; font-size: 16px; }
h4 { margin: 12px 0 6px; }
.scan { color: #31B854; margin-left: 8px; }
.green, .green:hover { background: #31B854; border-color: #31B854; color: #fff; }
.foot { display: flex; justify-content: space-between; align-items: center; margin-top: 10px; }
.nos { color: #909399; }
</style>

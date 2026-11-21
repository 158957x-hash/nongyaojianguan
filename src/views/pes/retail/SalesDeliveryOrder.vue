<template>
  <div class="panel">
    <h2>我的销售单</h2>
    <div class="notice">支持扫码搜索</div>
    <el-form inline>
      <el-form-item label="销售时间">
        <el-date-picker v-model="form.range" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" value-format="YYYY-MM-DD" />
      </el-form-item>
      <el-form-item label="销售单号"><el-input v-model="form.no" /></el-form-item>
      <el-form-item label="购买人信息"><el-input v-model="form.buyer" placeholder="姓名/联系方式" /></el-form-item>
      <el-form-item label="商品信息"><el-input v-model="form.goods" /></el-form-item>
      <el-form-item>
        <el-button class="green" @click="search">搜索订单</el-button>
        <el-button @click="showAll">显示全部</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="rows" border empty-text="暂无数据" class="tint">
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="time" label="销售时间" />
      <el-table-column prop="type" label="订单类型" />
      <el-table-column prop="total" label="订单总额（元）" />
      <el-table-column prop="qty" label="销售数量" />
      <el-table-column prop="received" label="实收金额（元）" />
      <el-table-column prop="returned" label="退货数量" />
      <el-table-column prop="buyer" label="购买人姓名" />
      <el-table-column prop="phone" label="联系方式" />
      <el-table-column label="操作" width="160">
        <template #default="{ row }">
          <el-button link @click="open(row)">查看详情</el-button>
          <el-button link @click="openDemoFill('商品退货')">商品退货</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="foot">
      <label><input type="checkbox" v-model="showNo"> 显示销售单号</label>
      <el-button @click="openDemoFill('导出明细')">导出明细</el-button>
    </div>
    <p v-if="showNo && rows.length" class="nos">销售单号：{{ rows.map((r) => r.no).join('、') }}</p>

    <el-dialog v-model="visible" title="销售单详情" width="680px" append-to-body>
      <template v-if="current">
        <h4>购买人信息</h4>
        <p>类型：{{ current.buyerType }}　姓名：{{ current.buyer }}　电话：{{ current.phone }}　证件：{{ current.idNo }}</p>
        <el-button @click="openDemoFill('补打小票')">补打小票</el-button>
        <h4>商品信息</h4>
        <p>上报状态：{{ current.report }}
          <el-button link @click="openDemoFill('重新上报')">重新上报</el-button>
          <el-button link @click="openDemoFill('原因')">原因</el-button>
          <el-button link @click="openDemoFill('施用作物')">施用作物</el-button>
          <el-button link @click="openDemoFill('撤销上报')">撤销上报</el-button>
        </p>
        <h4>支付信息</h4>
        <p>支付方式：{{ current.payWay }}　订单总额：{{ current.total }}　优惠：{{ current.discount }}　应收：{{ current.receivable }}　实收：{{ current.received }}　赊账：{{ current.credit }}</p>
        <h4>其他</h4>
        <p>销售单号：{{ current.no }}　购买时间：{{ current.time }}　订单类型：{{ current.type }}</p>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { computed, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { openDemoFill } from '@/components/pes/pesActions'
import { SALES_ORDERS, MEMBERS } from './retailData'
const route = useRoute()
const form = reactive({ range: [], no: '', buyer: '', goods: '' })
const all = ref(true)
const showNo = ref(false)
const visible = ref(false)
const current = ref(null)
const source = computed(() => {
  const mid = route.query.member
  if (!mid) return SALES_ORDERS
  const m = MEMBERS.find((x) => x.id === mid)
  if (!m) return []
  return SALES_ORDERS.filter((o) => o.buyer === m.name)
})
const rows = computed(() => {
  let list = source.value
  if (!all.value && form.range?.length === 2) {
    list = list.filter((r) => {
      const day = r.time.slice(0, 10)
      return day >= form.range[0] && day <= form.range[1]
    })
  }
  if (form.no) list = list.filter((r) => r.no.includes(form.no))
  if (form.buyer) list = list.filter((r) => r.buyer.includes(form.buyer) || String(r.phone).includes(form.buyer))
  return list
})
function search() { all.value = false }
function showAll() { all.value = true; form.range = []; form.no = ''; form.buyer = ''; form.goods = '' }
function open(row) { current.value = row; visible.value = true }
</script>
<style scoped>
.panel { background: #fff; padding: 14px; }
h2 { margin: 0 0 8px; font-size: 16px; }
h4 { margin: 12px 0 6px; }
.notice { background: #FFF8E6; color: #C48A00; padding: 6px 10px; margin-bottom: 10px; }
.green, .green:hover { background: #31B854; border-color: #31B854; color: #fff; }
.foot { display: flex; justify-content: space-between; margin-top: 10px; }
.nos { color: #909399; }
:deep(.tint th) { background: #E8F8EE !important; }
</style>

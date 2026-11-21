<template>
  <div class="panel">
    <div v-if="!mode" class="choose">
      <h3>请选择登记入库的方式</h3>
      <button type="button" class="way" @click="setMode('self')">自己登记入库</button>
      <button type="button" class="way rec" @click="setMode('whole')">
        批发商登记入库 <sup>推荐</sup>
      </button>
    </div>

    <template v-else-if="mode === 'self'">
      <div class="toolbar">
        <el-button class="green" @click="supOpen = true">选择供应商</el-button>
        <el-button class="green" @click="scanOpen = true">扫码录入</el-button>
        <span v-if="supplier" class="picked">当前供应商：{{ supplier }}</span>
      </div>
      <div class="layout">
        <div class="table-side">
          <el-table :data="cart" border empty-text="请从右侧选择商品，或使用扫码录入">
            <el-table-column prop="name" label="商品名称" />
            <el-table-column prop="batchNo" label="批次号" width="140" />
            <el-table-column prop="price" label="入库单价" width="100" />
            <el-table-column label="入库数量" width="130">
              <template #default="{ row }">
                <el-input-number v-model="row.qty" :min="1" size="small" :controls="false" />
              </template>
            </el-table-column>
            <el-table-column prop="produceDate" label="生产日期" width="120" />
            <el-table-column label="操作" width="80">
              <template #default="{ $index }">
                <el-button link type="danger" @click="cart.splice($index, 1)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="goods-side">
          <button v-for="g in inboundGoods" :key="g.id" type="button" class="good" @click="onPick(g)">
            <div>{{ g.name }}</div>
            <div class="meta">{{ g.maker }}　{{ g.spec }}　{{ g.stockText }}<template v-if="g.batchNo">　{{ g.batchNo }}</template></div>
          </button>
        </div>
      </div>
      <div class="bar">
        <el-button :disabled="!cart.length" @click="cart = []">清空全部</el-button>
        <span>共计{{ cartCount }}个　参考进货总价 <em>¥{{ cartAmount }}</em></span>
        <el-button class="orange" :disabled="!cart.length" @click="onSubmit">立即入库（键盘Enter）</el-button>
      </div>
    </template>

    <template v-else>
      <div class="notice">暂无待处理入库单…（支持安徽省内批发商）</div>
      <el-button text @click="closed = !closed">查看已关闭入库单</el-button>
      <el-table :data="inboundBills" border empty-text="暂无数据">
        <el-table-column prop="time" label="推送时间" />
        <el-table-column prop="supplier" label="供应商名称" />
        <el-table-column prop="contact" label="联系人" />
        <el-table-column prop="phone" label="联系电话" />
        <el-table-column prop="total" label="订单总额（元）" />
        <el-table-column v-if="!closed" prop="remain" label="剩余处理时间" />
        <el-table-column v-else prop="reason" label="关闭原因" />
        <el-table-column label="操作" />
      </el-table>
    </template>

    <el-dialog v-model="supOpen" title="选择供应商" width="640px" append-to-body>
      <el-input v-model="supKw" placeholder="供应商名称/联系人/手机号" />
      <el-table :data="supRows" size="small" border style="margin-top:8px">
        <el-table-column prop="name" label="供应商名称" />
        <el-table-column prop="contact" label="联系人" />
        <el-table-column prop="phone" label="联系方式" />
        <el-table-column label="操作" width="80">
          <template #default="{ row }">
            <el-button class="green-line" size="small" @click="pickSupplier(row.name)">选择</el-button>
          </template>
        </el-table-column>
      </el-table>
      <h4>快速新增供应商</h4>
      <el-input v-model="newSup.name" placeholder="供应商名称" />
      <el-input v-model="newSup.contact" placeholder="联系人姓名" style="margin-top:8px" />
      <el-input v-model="newSup.phone" placeholder="联系方式" style="margin-top:8px" />
      <template #footer>
        <el-button @click="supOpen = false">取消</el-button>
        <el-button class="orange" @click="addSupplier">新增并选择供应商</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="scanOpen" title="扫码录入" width="440px" append-to-body>
      <p class="scan-tip">演示环境用批次号代替扫码。可识别已提交的生产批次，默认带入演示批次。</p>
      <el-input v-model="scanCode" placeholder="扫描或输入批次号" @keyup.enter="onScan" />
      <template #footer>
        <el-button @click="scanOpen = false">取消</el-button>
        <el-button class="green" @click="onScan">识别入库</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="okOpen" title="入库成功" width="460px" append-to-body>
      <p>已提交 {{ lastCount }} 条入库记录。监管端「产品进货信息」和「流向追溯」可按批次查看。</p>
      <template #footer>
        <el-button class="green" @click="okOpen = false">知道了</el-button>
        <el-button @click="goTrace">去监管端追溯</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { GOODS, SUPPLIERS } from './retailData'
import { usePesLoopStore, LOOP_PRODUCER } from '@/stores/pesLoop'

const route = useRoute()
const router = useRouter()
const loop = usePesLoopStore()
const mode = ref(null)
const pendingBills = [
  { time: '2026-11-20 09:30:00', supplier: '演示批发商甲', contact: '演示联系人乙', phone: '000-0000-0001', total: '860.00', remain: '22小时', reason: '' }
]
const closedBills = [
  { time: '2026-11-18 14:00:00', supplier: '演示批发商乙', contact: '演示联系人丁', phone: '000-0000-0002', total: '420.00', remain: '', reason: '超时未接收（演示）' }
]
const inboundBills = computed(() => closed.value ? closedBills : pendingBills)
const closed = ref(false)
const supOpen = ref(false)
const scanOpen = ref(false)
const okOpen = ref(false)
const supKw = ref('')
const scanCode = ref('')
const supplier = ref(LOOP_PRODUCER.name)
const lastCount = ref(0)
const lastBatch = ref('')
const cart = ref([])
const newSup = reactive({ name: '', contact: '', phone: '' })
const extraSuppliers = ref([])

const inboundGoods = computed(() => {
  const base = GOODS.filter((g) => !g.hideOnShelf && g.stock > 0)
  return [...loop.retailGoods, ...base]
})
const supRows = computed(() => {
  const list = [...extraSuppliers.value, ...SUPPLIERS, { id: 'loop-p', name: LOOP_PRODUCER.name, contact: '演示联系人甲', phone: '—' }]
  const q = supKw.value.trim()
  if (!q) return list
  return list.filter((s) => s.name.includes(q) || String(s.contact || '').includes(q) || String(s.phone).includes(q))
})
const cartCount = computed(() => cart.value.reduce((s, l) => s + (Number(l.qty) || 0), 0))
const cartAmount = computed(() => {
  const n = cart.value.reduce((s, l) => s + (Number(l.price) || 0) * (Number(l.qty) || 0), 0)
  return n.toFixed(2)
})

function setMode(m) {
  mode.value = m
  const currentType = m === 'whole' ? '2' : '1'
  router.replace({ path: '/pes/retail/purchasing', query: { currentType } })
}

watch(() => route.query.currentType, (t) => {
  if (t === '2') mode.value = 'whole'
  else if (t === '1') mode.value = 'self'
  else mode.value = null
}, { immediate: true })

function onPick(g) {
  const exist = cart.value.find((x) => x.id === g.id)
  if (exist) {
    exist.qty += 1
    return
  }
  const batch = g.batchNo || (g.loop ? String(g.id).replace(/^loop-/, '') : '')
  const fromLoop = batch ? loop.findByScan(batch) : null
  cart.value.push({
    id: g.id,
    name: g.name,
    price: g.price || 0,
    qty: 1,
    produceDate: fromLoop?.produceDate || '—',
    batchNo: batch || '—',
    maker: g.maker,
    loop: !!g.loop || !!fromLoop
  })
}

function pickSupplier(name) {
  supplier.value = name
  supOpen.value = false
}

function addSupplier() {
  if (!newSup.name) return ElMessage.warning('请填写供应商名称')
  extraSuppliers.value.unshift({ id: `sup-${Date.now()}`, ...newSup })
  pickSupplier(newSup.name)
}

function onScan() {
  const code = scanCode.value.trim() || loop.heroBatchNo
  const batch = loop.findByScan(code)
  if (!batch) return ElMessage.warning('未识别到该批次，请先在生产端提交台账')
  onPick({
    id: `loop-${batch.batchNo}`,
    name: batch.productName,
    maker: batch.producerName,
    price: 28,
    batchNo: batch.batchNo,
    loop: true,
    spec: '瓶',
    stockText: ''
  })
  supplier.value = supplier.value || batch.producerName
  scanOpen.value = false
  ElMessage.success(`已识别批次 ${batch.batchNo}`)
}

function onSubmit() {
  if (!cart.value.length) return ElMessage.warning('请先选择要入库的商品')
  try {
    const created = cart.value.map((line) => loop.submitInbound({
      batchNo: line.batchNo !== '—' ? line.batchNo : loop.heroBatchNo,
      qty: line.qty,
      supplier: supplier.value || LOOP_PRODUCER.name
    }))
    lastCount.value = created.length
    lastBatch.value = created[0]?.batchNo || ''
    cart.value = []
    okOpen.value = true
  } catch (e) {
    ElMessage.warning(e.message || '入库失败')
  }
}

function goTrace() {
  okOpen.value = false
  const href = router.resolve({ path: '/pes/trace', query: { batch: lastBatch.value } }).href
  window.open(href, '_blank')
}

function onKey(e) {
  if (e.key !== 'Enter' || mode.value !== 'self') return
  const tag = (e.target && e.target.tagName) || ''
  if (['INPUT', 'TEXTAREA', 'SELECT'].includes(tag)) return
  onSubmit()
}
onMounted(() => {
  scanCode.value = loop.heroBatchNo
  window.addEventListener('keydown', onKey)
})
onUnmounted(() => window.removeEventListener('keydown', onKey))
</script>
<style scoped>
.panel { background: #fff; padding: 14px; border-radius: 2px; }
.choose { text-align: center; padding: 40px 0; }
.way { margin: 8px; padding: 12px 24px; border: 1px solid #31B854; background: #fff; color: #31B854; cursor: pointer; position: relative; }
.way.rec sup { position: absolute; top: -8px; right: -8px; background: #F14F00; color: #fff; border-radius: 8px; padding: 0 5px; font-size: 10px; }
.toolbar { display: flex; align-items: center; gap: 10px; }
.picked { color: #606266; font-size: 13px; }
.green, .green:hover { background: #31B854; border-color: #31B854; color: #fff; }
.green-line { color: #31B854; }
.orange, .orange:hover { background: #F14F00; border-color: #F14F00; color: #fff; }
.layout { display: grid; grid-template-columns: 1fr 260px; gap: 10px; margin-top: 10px; }
.good { display: block; width: 100%; text-align: left; border: 1px solid #CDECD6; background: #E8F8EE; padding: 8px; margin-bottom: 8px; cursor: pointer; }
.meta { color: #909399; margin-top: 4px; }
.bar { display: flex; align-items: center; gap: 12px; margin-top: 12px; }
.bar em { color: #F14F00; font-style: normal; font-weight: 700; }
.notice { background: #FFF3E8; color: #F14F00; padding: 10px 12px; margin-bottom: 8px; }
.scan-tip { color: #606266; font-size: 13px; margin: 0 0 10px; }
</style>

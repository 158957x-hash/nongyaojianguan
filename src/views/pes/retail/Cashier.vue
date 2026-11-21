<template>
  <div class="panel">
    <div class="toolbar">
      <button class="green" type="button" @click="buyerOpen = true">选择购买人</button>
      <button class="green" type="button" @click="openScan">扫码销售</button>
      <span class="picked">当前购买人：{{ buyerLabel }}</span>
    </div>
    <div class="layout">
      <div class="table-side">
        <el-table :data="cart" border empty-text="请从右侧选择商品，或扫码录入">
          <el-table-column prop="name" label="商品名称" min-width="160">
            <template #default="{ row }">
              <div>{{ row.name }}</div>
              <div v-if="row.restricted" class="res">{{ row.restricted }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="batchNo" label="批次号" width="140" />
          <el-table-column prop="price" label="单价" width="80" />
          <el-table-column label="数量" width="130">
            <template #default="{ row }">
              <el-input-number v-model="row.qty" :min="1" size="small" :controls="false" />
            </template>
          </el-table-column>
          <el-table-column prop="spec" label="规格" width="80" />
          <el-table-column label="操作" width="80">
            <template #default="{ $index }">
              <el-button link type="danger" @click="cart.splice($index, 1)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="goods-side">
        <div class="g-search">
          <el-input v-model="kw" clearable placeholder="扫描或输入商品名称" />
        </div>
        <button v-for="g in shelf" :key="g.id" type="button" class="good" @click="add(g)">
          <div>{{ g.name }}</div>
          <div class="meta">{{ g.maker }}　{{ g.spec }}　{{ g.stockText }}<template v-if="g.batchNo">　{{ g.batchNo }}</template></div>
        </button>
        <div v-if="!shelf.length" class="empty">暂无符合条件的商品</div>
      </div>
    </div>
    <div class="bar">
      <el-button :disabled="!cart.length" @click="cart = []">清空全部</el-button>
      <span>共计{{ cartCount }}个　销售总价 <em>¥{{ cartAmount }}</em></span>
      <el-button class="orange" :disabled="!cart.length" @click="onCheckout">立即结账（键盘Enter）</el-button>
    </div>

    <el-dialog v-model="buyerOpen" title="选择购买人" width="640px" append-to-body>
      <div class="buyer-actions">
        <el-button class="green" @click="pickBuyer('walkin', '散客')">散客结账</el-button>
      </div>
      <el-input v-model="memberKw" placeholder="会员姓名 / 手机号" />
      <el-table :data="memberRows" size="small" border style="margin-top:8px">
        <el-table-column prop="name" label="姓名" />
        <el-table-column prop="phone" label="手机号" />
        <el-table-column label="操作" width="80">
          <template #default="{ row }">
            <el-button class="green-line" size="small" @click="pickBuyer('member', row.name)">选择</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog v-model="scanOpen" title="扫码销售" width="440px" append-to-body>
      <p class="scan-tip">演示环境用批次号代替扫码。识别已入库批次后加入购物车。</p>
      <el-input v-model="scanCode" placeholder="扫描或输入批次号" @keyup.enter="onScan" />
      <template #footer>
        <el-button @click="scanOpen = false">取消</el-button>
        <el-button class="green" @click="onScan">识别并加入</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="okOpen" title="结账成功" width="460px" append-to-body>
      <p>已向 <b>{{ buyerLabel }}</b> 销售 {{ lastCount }} 个商品。监管端「产品销售信息」和「流向追溯」可按批次查看。</p>
      <template #footer>
        <el-button class="green" @click="okOpen = false">知道了</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { GOODS, MEMBERS } from './retailData'
import { usePesLoopStore } from '@/stores/pesLoop'

const loop = usePesLoopStore()
const cart = ref([])
const kw = ref('')
const buyerOpen = ref(false)
const scanOpen = ref(false)
const okOpen = ref(false)
const memberKw = ref('')
const scanCode = ref('')
const buyerType = ref('walkin')
const buyerName = ref('散客')
const lastCount = ref(0)

const buyerLabel = computed(() => buyerType.value === 'member' ? `会员 · ${buyerName.value}` : buyerName.value)
const memberRows = computed(() => {
  const q = memberKw.value.trim()
  if (!q) return MEMBERS
  return MEMBERS.filter((m) => m.name.includes(q) || String(m.phone).includes(q))
})
const shelf = computed(() => {
  const q = kw.value.trim()
  const base = GOODS.filter((g) => !g.hideOnShelf && g.stock > 0 && !g.restricted)
  const merged = [...loop.retailGoods, ...base]
  if (!q) return merged
  return merged.filter((g) => g.name.includes(q) || (g.batchNo && g.batchNo.includes(q)) || (g.maker && g.maker.includes(q)))
})
const cartCount = computed(() => cart.value.reduce((s, l) => s + (Number(l.qty) || 0), 0))
const cartAmount = computed(() => {
  const n = cart.value.reduce((s, l) => s + (Number(l.price) || 0) * (Number(l.qty) || 0), 0)
  return n.toFixed(2)
})

function add(g) {
  const exist = cart.value.find((x) => x.id === g.id)
  if (exist) {
    exist.qty += 1
    return
  }
  cart.value.push({
    id: g.id,
    name: g.name,
    price: g.price || 0,
    qty: 1,
    spec: g.spec || '瓶',
    batchNo: g.batchNo || (g.loop ? String(g.id).replace(/^loop-/, '') : '—'),
    restricted: g.restricted || '',
    loop: !!g.loop
  })
}

function pickBuyer(type, name) {
  buyerType.value = type
  buyerName.value = name
  buyerOpen.value = false
}

function openScan() {
  scanCode.value = loop.heroBatchNo
  scanOpen.value = true
}

function onScan() {
  const code = scanCode.value.trim() || loop.heroBatchNo
  const batch = loop.findByScan(code)
  if (!batch) return ElMessage.warning('未识别到该批次，请先完成生产填报并入库')
  const goods = loop.retailGoods.find((g) => g.batchNo === batch.batchNo)
  if (!goods) return ElMessage.warning('该批次尚未入库，请先在采购入库中扫码入库')
  add(goods)
  scanOpen.value = false
  ElMessage.success(`已识别批次 ${batch.batchNo}`)
}

function onCheckout() {
  if (!cart.value.length) return ElMessage.warning('请先选择商品')
  try {
    const lines = cart.value.filter((l) => l.batchNo && l.batchNo !== '—')
    if (!lines.length) return ElMessage.warning('购物车中没有可追溯批次，请扫码或选择闭环商品')
    loop.submitOutbound({ lines, buyer: buyerName.value })
    lastCount.value = cartCount.value
    cart.value = []
    okOpen.value = true
  } catch (e) {
    ElMessage.warning(e.message || '结账失败')
  }
}

function onKey(e) {
  if (e.key !== 'Enter') return
  const tag = (e.target && e.target.tagName) || ''
  if (['INPUT', 'TEXTAREA', 'SELECT'].includes(tag)) return
  onCheckout()
}
onMounted(() => window.addEventListener('keydown', onKey))
onUnmounted(() => window.removeEventListener('keydown', onKey))
</script>
<style scoped>
.panel { background: #fff; padding: 14px; border-radius: 2px; }
.toolbar { display: flex; align-items: center; gap: 10px; }
.picked { color: #606266; font-size: 13px; }
.green, .green:hover { background: #31B854; border-color: #31B854; color: #fff; }
.green-line { color: #31B854; }
.orange, .orange:hover { background: #F14F00; border-color: #F14F00; color: #fff; }
.layout { display: grid; grid-template-columns: 1fr 260px; gap: 10px; margin-top: 10px; }
.g-search { margin-bottom: 8px; }
.good { display: block; width: 100%; text-align: left; border: 1px solid #CDECD6; background: #E8F8EE; padding: 8px; margin-bottom: 8px; cursor: pointer; }
.meta { color: #909399; margin-top: 4px; }
.res { color: #F14F00; font-size: 12px; margin-top: 2px; }
.bar { display: flex; align-items: center; gap: 12px; margin-top: 12px; }
.bar em { color: #F14F00; font-style: normal; font-weight: 700; }
.empty { color: #909399; font-size: 13px; padding: 8px; }
.buyer-actions { margin-bottom: 8px; }
.scan-tip { color: #606266; font-size: 13px; margin: 0 0 10px; }
</style>

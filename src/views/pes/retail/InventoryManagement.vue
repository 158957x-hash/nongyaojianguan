<template>
  <div class="panel">
    <h2>商品库存</h2>
    <div class="tabs">
      <button v-for="t in kinds" :key="t" type="button" :class="{ on: kind === t }" @click="kind = t">{{ t }}</button>
    </div>
    <div v-if="kind === '农药'" class="filters">
      <button v-for="s in statuses" :key="s" type="button" :class="{ on: status === s }" @click="status = s">{{ s }}</button>
      <el-input v-model="kw" placeholder="搜索" style="width:200px" />
      <el-button class="green" @click="shown = true">搜索</el-button>
      <el-button @click="kw = ''; status = '全部农药'">显示全部</el-button>
      <span class="scan">支持扫码搜索</span>
      <el-button @click="openDemoFill('导出明细')">导出明细</el-button>
    </div>
    <el-table v-if="kind === '农药'" :data="rows" border empty-text="暂无数据">
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="name" label="农药名称" />
      <el-table-column prop="ingredient" label="总有效成分及含量" />
      <el-table-column prop="form" label="剂型" />
      <el-table-column prop="spec" label="规格" />
      <el-table-column label="销售单价（元）">
        <template #default="{ row }"><span class="price">{{ row.price }}</span></template>
      </el-table-column>
      <el-table-column prop="stock" label="当前库存" />
      <el-table-column prop="sold" label="销售数量" />
      <el-table-column label="操作" width="220">
        <template #default>
          <el-button link @click="openDemoFill('补充库存', { kind: 'stock' })">补充库存</el-button>
          <el-button link @click="openDemoFill('库存调整', { kind: 'stock' })">库存调整</el-button>
          <el-button link @click="openDemoFill('调整记录', { kind: 'stockLog' })">调整记录</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-table v-else :data="otherRows" border empty-text="暂无数据">
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="name" :label="kind + '名称'" />
      <el-table-column prop="spec" label="规格" />
      <el-table-column label="销售单价（元）">
        <template #default="{ row }"><span class="price">{{ row.price }}</span></template>
      </el-table-column>
      <el-table-column prop="stock" label="当前库存" />
      <el-table-column prop="sold" label="销售数量" />
      <el-table-column label="操作" width="220">
        <template #default>
          <el-button link @click="openDemoFill('补充库存', { kind: 'stock' })">补充库存</el-button>
          <el-button link @click="openDemoFill('库存调整', { kind: 'stock' })">库存调整</el-button>
          <el-button link @click="openDemoFill('调整记录', { kind: 'stockLog' })">调整记录</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script setup>
import { computed, ref } from 'vue'
import { openDemoFill } from '@/components/pes/pesActions'
import { GOODS } from './retailData'
const kinds = ['农药', '肥料', '种子']
const kind = ref('农药')
const statuses = ['全部农药', '有库存的', '无库存的']
const status = ref('全部农药')
const kw = ref('')
const shown = ref(true)
const fallbackStock = {
  肥料: [
    { name: '演示肥料甲', spec: '袋', price: 35, stock: 60, sold: '12' }
  ],
  种子: [
    { name: '演示种子甲', spec: '袋', price: 18, stock: 40, sold: '8' }
  ]
}
const rows = computed(() => GOODS.filter((g) => {
  if (g.kind !== '农药') return false
  if (String(g.status).includes('已下架') && status.value !== '无库存的') return false
  if (status.value === '有库存的' && !(g.stock > 0)) return false
  if (status.value === '无库存的' && g.stock > 0) return false
  const q = kw.value.trim()
  if (q && !g.name.includes(q)) return false
  return true
}))
const otherRows = computed(() => {
  const fromGoods = GOODS.filter((g) => g.kind === kind.value)
  return fromGoods.length ? fromGoods : (fallbackStock[kind.value] || [])
})
</script>
<style scoped>
.panel { background: #fff; padding: 14px; }
h2 { margin: 0 0 10px; font-size: 16px; }
.tabs, .filters { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 10px; align-items: center; }
.tabs button, .filters button { border: 1px solid #CDECD6; background: #fff; padding: 4px 10px; cursor: pointer; }
.tabs button.on, .filters button.on { background: #E8F8EE; border-color: #31B854; }
.green, .green:hover { background: #31B854; border-color: #31B854; color: #fff; }
.scan { color: #31B854; }
.price { color: #F14F00; }
</style>

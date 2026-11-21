<template>
  <div class="panel">
    <h2>我的商品</h2>
    <div class="tabs">
      <button v-for="t in kinds" :key="t" type="button" :class="{ on: kind === t }" @click="kind = t">{{ t }}</button>
    </div>
    <div class="filters">
      <template v-if="kind === '农药'">
        <button v-for="s in statuses" :key="s" type="button" :class="{ on: status === s }" @click="status = s">{{ s }}</button>
      </template>
      <el-button class="green" @click="openDemoFill('新增' + kind)">新增{{ kind }}</el-button>
      <el-input v-if="kind === '农药'" v-model="kw" placeholder="输入通用名/别名/登记证号/生产企业搜索" style="width:300px" />
    </div>
    <el-table v-if="kind === '农药'" :data="rows" border empty-text="暂无数据">
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column label="农药名称" min-width="160">
        <template #default="{ row }">
          {{ row.name }} <span v-if="row.restricted" class="tag">[限制]</span>
        </template>
      </el-table-column>
      <el-table-column prop="ingredient" label="总有效成分及含量" />
      <el-table-column prop="form" label="剂型" />
      <el-table-column prop="spec" label="包装规格" />
      <el-table-column label="销售单价（元）">
        <template #default="{ row }"><span class="price">{{ row.price }}</span></template>
      </el-table-column>
      <el-table-column label="当前库存">
        <template #default="{ row }"><span :class="{ red: row.stock === 0 }">{{ row.stock }}</span></template>
      </el-table-column>
      <el-table-column prop="sold" label="销售数量" />
      <el-table-column label="产品状态">
        <template #default="{ row }"><span :class="{ red: String(row.status).includes('已下架') }">{{ row.status }}</span></template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template #default>
          <el-button link @click="openDemoFill('改售价')">改售价</el-button>
          <el-button link @click="openDemoFill('补充库存', { kind: 'stock' })">补充库存</el-button>
          <el-button link @click="openDemoFill('更多操作')">更多</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-table v-else :data="otherRows" border empty-text="暂无数据">
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="name" :label="kind + '名称'" />
      <el-table-column prop="spec" label="规格" />
      <el-table-column label="操作" width="120">
        <template #default>
          <el-button link @click="openDemoFill('更多操作')">更多</el-button>
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
const statuses = ['全部农药', '出售中的', '已下架的']
const status = ref('全部农药')
const kw = ref('')
const rows = computed(() => GOODS.filter((g) => {
  if (g.kind !== '农药') return false
  if (status.value === '出售中的' && g.status !== '出售中') return false
  if (status.value === '已下架的' && !String(g.status).includes('已下架')) return false
  const q = kw.value.trim()
  if (q && !g.name.includes(q) && !g.maker.includes(q)) return false
  return true
}))
const otherRows = computed(() => GOODS.filter((g) => g.kind === kind.value))
</script>
<style scoped>
.panel { background: #fff; padding: 14px; border-radius: 2px; }
h2 { margin: 0 0 10px; font-size: 16px; }
.tabs, .filters { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 10px; align-items: center; }
.tabs button, .filters button {
  border: 1px solid #CDECD6; background: #fff; padding: 4px 10px; cursor: pointer;
}
.tabs button.on, .filters button.on { background: #E8F8EE; border-color: #31B854; }
.green, .green:hover { background: #31B854; border-color: #31B854; color: #fff; }
.tag { color: #D94A4A; margin-left: 4px; }
.price { color: #F14F00; }
.red { color: #D94A4A; }
</style>

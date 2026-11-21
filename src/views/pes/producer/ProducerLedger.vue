<template>
  <div class="panel">
    <div class="head">
      <h3>生产批次与台账</h3>
      <el-button type="primary" class="green" :disabled="!loop.profileConfirmed" @click="openCreate">新增生产批次</el-button>
    </div>
    <el-alert
      v-if="!loop.profileConfirmed"
      type="warning"
      show-icon
      :closable="false"
      title="请先在「企业备案」确认主体信息，再填报生产批次"
      style="margin-bottom: 12px"
    />
    <p class="hint">提交后，监管端「产品与批次库 / 流向追溯」和零售端扫码入库都能看到这一批。地名和数量均为演示数据。</p>

    <el-table :data="loop.batches" border>
      <el-table-column prop="batchNo" label="批次号" width="150" />
      <el-table-column prop="productName" label="产品" min-width="140" />
      <el-table-column prop="regNo" label="登记证号" width="160" />
      <el-table-column prop="produceDate" label="生产日期" width="120" />
      <el-table-column prop="produceQty" label="产量" width="90" align="right" />
      <el-table-column prop="salesQty" label="销量" width="90" align="right" />
      <el-table-column prop="inventoryQty" label="库存" width="90" align="right" />
      <el-table-column prop="destination" label="销售去向" min-width="140" />
      <el-table-column prop="unit" label="单位" width="70" />
      <el-table-column prop="status" label="状态" width="90" />
      <el-table-column prop="submitTime" label="提交时间" width="170" />
    </el-table>

    <el-dialog v-model="open" title="新增生产批次" width="560px" append-to-body>
      <el-form :model="form" label-width="110px">
        <el-form-item label="产品">
          <el-select v-model="form.productId" style="width: 100%">
            <el-option v-for="p in loop.products" :key="p.id" :label="`${p.name}（${p.regNo}）`" :value="p.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="生产日期"><el-date-picker v-model="form.produceDate" value-format="YYYY-MM-DD" style="width: 100%" /></el-form-item>
        <el-form-item label="批次号"><el-input v-model="form.batchNo" placeholder="印在包装上的生产批次号" /></el-form-item>
        <el-form-item label="产量"><el-input-number v-model="form.produceQty" :min="0" :controls="false" style="width: 100%" /></el-form-item>
        <el-form-item label="销量"><el-input-number v-model="form.salesQty" :min="0" :controls="false" style="width: 100%" /></el-form-item>
        <el-form-item label="库存"><el-input-number v-model="form.inventoryQty" :min="0" :controls="false" style="width: 100%" /></el-form-item>
        <el-form-item label="销售去向"><el-input v-model="form.destination" placeholder="销售到哪家经营企业" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="open = false">取消</el-button>
        <el-button type="primary" class="green" @click="onSubmit">提交</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="okOpen" title="提交成功" width="440px" append-to-body>
      <p>生产台账已提交。批次 <b>{{ last?.batchNo }}</b> 已进入演示数据，监管端按批次可追溯，零售端可用该批次号扫码入库。</p>
      <template #footer>
        <el-button type="primary" class="green" @click="okOpen = false">知道了</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { usePesLoopStore, LOOP_OPERATOR, LOOP_PRODUCT } from '@/stores/pesLoop'

const loop = usePesLoopStore()
const open = ref(false)
const okOpen = ref(false)
const last = ref(null)
const form = reactive({
  productId: LOOP_PRODUCT.id,
  produceDate: '2026-11-20',
  batchNo: '',
  produceQty: 100,
  salesQty: 60,
  inventoryQty: 40,
  destination: LOOP_OPERATOR.name
})

function openCreate() {
  form.batchNo = `YS${new Date().toISOString().slice(0, 10).replace(/-/g, '')}${String(loop.batches.length + 1).padStart(2, '0')}`
  form.productId = loop.products[0]?.id || LOOP_PRODUCT.id
  open.value = true
}

function onSubmit() {
  try {
    last.value = loop.submitProduce({ ...form })
    open.value = false
    okOpen.value = true
  } catch (e) {
    ElMessage.warning(e.message || '提交失败')
  }
}
</script>

<style scoped>
.panel { background: #fff; padding: 16px 20px 20px; border-radius: 2px; box-shadow: none; }
.head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
.head h3 { margin: 0; font-size: 16px; color: #303133; font-weight: 600; position: relative; padding-left: 10px; }
.head h3::before { content: ""; position: absolute; left: 0; top: 3px; bottom: 3px; width: 3px; background: #1F8A4C; border-radius: 1px; }
.hint { color: #909399; font-size: 13px; margin: 0 0 14px; }
.green, .green:hover { background: #31B854; border-color: #31B854; }
</style>

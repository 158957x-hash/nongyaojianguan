<template>
  <div class="panel">
    <div class="head">
      <h2>包装废弃物回收</h2>
      <el-button class="green" @click="addOpen = true">新增回收记录</el-button>
    </div>
    <div class="filters">
      <el-select v-model="measure" style="width:160px">
        <el-option label="全部计量方式" value="全部计量方式" />
        <el-option label="数量" value="数量" />
        <el-option label="重量" value="重量" />
      </el-select>
      <el-input v-model="kw" placeholder="输入送交人姓名、联系方式快速搜索" style="width:280px" />
      <el-button class="green" @click="applied = { measure, kw }">搜索回收记录</el-button>
      <el-button @click="measure = '全部计量方式'; kw = ''; applied = { measure: '全部计量方式', kw: '' }">显示全部</el-button>
    </div>
    <el-table :data="rows" border empty-text="暂无数据">
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="created" label="新增时间" />
      <el-table-column prop="mode" label="计量方式" />
      <el-table-column prop="time" label="回收时间" />
      <el-table-column prop="name" label="送交人姓名" />
      <el-table-column prop="phone" label="联系方式" />
      <el-table-column prop="qty" label="回收数量/重量（个/公斤）" />
      <el-table-column label="操作" />
    </el-table>

    <el-dialog v-model="addOpen" title="新增回收记录" width="560px" append-to-body @closed="reset">
      <el-form label-width="130px">
        <el-form-item label="回收时间" required>
          <el-date-picker v-model="form.time" type="date" value-format="YYYY-MM-DD" />
        </el-form-item>
        <el-form-item label="废弃物送交人" required>
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="送交人联系方式" required>
          <el-input v-model="form.phone" />
        </el-form-item>
        <el-form-item label="模式">
          <el-radio-group v-model="form.mode">
            <el-radio label="回收重量">回收重量</el-radio>
            <el-radio label="回收数量">回收数量</el-radio>
          </el-radio-group>
        </el-form-item>
        <div class="kinds">
          <div v-for="k in kinds" :key="k">
            <span>{{ k }}</span>
            <el-input v-model="form.vals[k]" :placeholder="form.mode === '回收重量' ? '如有，请输入重量' : '如有，请输入数量'" />
          </div>
        </div>
        <p>合计 {{ total }} {{ form.mode === '回收重量' ? '公斤' : '个' }}</p>
      </el-form>
      <template #footer>
        <el-button class="green" @click="onSubmit">确认新增</el-button>
        <el-button @click="addOpen = false">取消</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { computed, reactive, ref } from 'vue'
import dayjs from 'dayjs'
import { ElMessage } from 'element-plus'
import { usePesLoopStore } from '@/stores/pesLoop'
const loop = usePesLoopStore()
const measure = ref('全部计量方式')
const kw = ref('')
const applied = ref({ measure: '全部计量方式', kw: '' })
const addOpen = ref(false)
const kinds = ['塑料瓶', '玻璃瓶', '袋子', '其他']
const form = reactive({ time: dayjs().format('YYYY-MM-DD'), name: '演示购买人丙', phone: '—', mode: '回收数量', vals: { 塑料瓶: '20', 玻璃瓶: '', 袋子: '', 其他: '' } })
const total = computed(() => kinds.reduce((s, k) => s + (Number(form.vals[k]) || 0), 0))
const rows = computed(() => {
  return loop.retailWastes.filter((r) => {
    if (applied.value.measure !== '全部计量方式' && r.mode !== applied.value.measure) return false
    const q = applied.value.kw.trim()
    if (q && !String(r.name).includes(q) && !String(r.phone).includes(q)) return false
    return true
  })
})
function reset() {
  form.time = dayjs().format('YYYY-MM-DD')
  form.name = '演示购买人丙'
  form.phone = '—'
  form.mode = '回收数量'
  kinds.forEach((k) => { form.vals[k] = k === '塑料瓶' ? '20' : '' })
}
function onSubmit() {
  if (!form.name || !form.time) return ElMessage.warning('请填写送交人和回收时间')
  if (!total.value) return ElMessage.warning('请填写回收数量或重量')
  loop.submitRetailWaste({
    mode: form.mode,
    time: form.time,
    name: form.name,
    phone: form.phone,
    qty: `${total.value}${form.mode === '回收重量' ? '公斤' : '个'}`,
    batchNo: loop.heroBatchNo
  })
  addOpen.value = false
  ElMessage.success('回收记录已提交，监管端「包装废弃物回收」可查看（演示）')
}
</script>
<style scoped>
.panel { background: #fff; padding: 14px; border-radius: 2px; }
.head { display: flex; justify-content: space-between; align-items: center; }
h2 { margin: 0; font-size: 16px; }
.filters { display: flex; gap: 8px; margin: 12px 0; }
.green, .green:hover { background: #31B854; border-color: #31B854; color: #fff; }
.kinds div { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
.kinds span { width: 70px; }
</style>

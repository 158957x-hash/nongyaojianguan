<template>
  <div class="panel">
    <div class="head">
      <h3>产品登记</h3>
      <el-button type="primary" class="green" @click="open = true">新增产品登记</el-button>
    </div>
    <el-table :data="loop.products" border>
      <el-table-column prop="name" label="农药名称" min-width="140" />
      <el-table-column prop="regNo" label="登记证号" min-width="150" />
      <el-table-column prop="trademark" label="商标" width="120" />
      <el-table-column prop="category" label="类别" width="100" />
      <el-table-column prop="form" label="剂型" width="100" />
      <el-table-column prop="restricted" label="限制性农药" width="110" />
      <el-table-column prop="spec" label="规格" width="90" />
    </el-table>

    <el-dialog v-model="open" title="新增产品登记" width="520px" append-to-body>
      <el-form :model="form" label-width="100px">
        <el-form-item label="农药名称"><el-input v-model="form.name" /></el-form-item>
        <el-form-item label="登记证号"><el-input v-model="form.regNo" /></el-form-item>
        <el-form-item label="商标"><el-input v-model="form.trademark" /></el-form-item>
        <el-form-item label="类别">
          <el-select v-model="form.category" style="width: 100%">
            <el-option label="杀虫剂" value="杀虫剂" />
            <el-option label="除草剂" value="除草剂" />
            <el-option label="杀菌剂" value="杀菌剂" />
          </el-select>
        </el-form-item>
        <el-form-item label="剂型"><el-input v-model="form.form" /></el-form-item>
        <el-form-item label="规格"><el-input v-model="form.spec" placeholder="如 瓶、袋" /></el-form-item>
        <el-form-item label="限制性农药">
          <el-select v-model="form.restricted" style="width: 100%">
            <el-option label="否" value="否" />
            <el-option label="是" value="是" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="open = false">取消</el-button>
        <el-button type="primary" class="green" @click="onSave">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { usePesLoopStore } from '@/stores/pesLoop'

const loop = usePesLoopStore()
const open = ref(false)
const form = reactive({ name: '', regNo: '', trademark: '演示商标', category: '杀虫剂', form: '乳油', spec: '瓶', restricted: '否' })

function onSave() {
  if (!form.name || !form.regNo) return ElMessage.warning('请填写农药名称和登记证号')
  loop.addProduct({ ...form })
  open.value = false
  ElMessage.success('产品登记已保存（演示）')
  Object.assign(form, { name: '', regNo: '', trademark: '演示商标', category: '杀虫剂', form: '乳油', spec: '瓶', restricted: '否' })
}
</script>

<style scoped>
.panel { background: #fff; padding: 16px 20px 20px; border-radius: 2px; box-shadow: none; }
.head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
.head h3 { margin: 0; font-size: 16px; color: #303133; font-weight: 600; position: relative; padding-left: 10px; }
.head h3::before { content: ""; position: absolute; left: 0; top: 3px; bottom: 3px; width: 3px; background: #1F8A4C; border-radius: 1px; }
.green, .green:hover { background: #31B854; border-color: #31B854; }
</style>

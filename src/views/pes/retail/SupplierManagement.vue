<template>
  <div class="panel">
    <h2>我的供应商</h2>
    <div class="filters">
      <el-button class="green" @click="addOpen = true">新增供应商</el-button>
      <el-input v-model="kw" placeholder="输入供应商名称、联系人姓名、联系方式快速搜索" style="width:340px" />
    </div>
    <el-table :data="rows" border empty-text="暂无数据">
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="name" label="供应商名称" />
      <el-table-column prop="contact" label="联系人" />
      <el-table-column prop="phone" label="联系电话" />
      <el-table-column prop="area" label="所在区域" />
      <el-table-column prop="orders" label="供货笔数（笔）" />
      <el-table-column prop="amount" label="供货总额（元）" />
      <el-table-column label="操作" width="200">
        <template #default="{ row }">
          <el-button link @click="$router.push('/pes/retail/incomingOrders?supplier=' + row.id)">供货记录</el-button>
          <el-button link @click="openDemoFill('编辑供应商')">编辑</el-button>
          <el-button link @click="openDemoFill('删除供应商')">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="addOpen" title="新增供应商" width="520px" append-to-body>
      <el-form label-width="140px">
        <el-form-item label="供应商名称"><el-input v-model="form.name" /></el-form-item>
        <el-form-item label="联系人姓名"><el-input v-model="form.contact" /></el-form-item>
        <el-form-item label="联系人电话"><el-input v-model="form.phone" /></el-form-item>
        <p class="opt">选填</p>
        <el-form-item label="统一社会信用代码"><el-input v-model="form.uscc" /></el-form-item>
        <el-form-item label="所在地区（省/市/区）"><el-input v-model="form.area" /></el-form-item>
        <el-form-item label="详细地址"><el-input v-model="form.address" /></el-form-item>
        <el-form-item label="备注"><el-input v-model="form.remark" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addOpen = false">取消</el-button>
        <el-button class="green" @click="openDemoFill('保存供应商')">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { computed, reactive, ref } from 'vue'
import { openDemoFill } from '@/components/pes/pesActions'
import { SUPPLIERS } from './retailData'
const kw = ref('')
const addOpen = ref(false)
const form = reactive({ name: '', contact: '', phone: '', uscc: '', area: '', address: '', remark: '' })
const rows = computed(() => SUPPLIERS.filter((s) => {
  const q = kw.value.trim()
  if (!q) return true
  return s.name.includes(q) || s.contact.includes(q) || String(s.phone).includes(q)
}))
</script>
<style scoped>
.panel { background: #fff; padding: 14px; }
h2 { margin: 0 0 10px; font-size: 16px; }
.filters { display: flex; gap: 8px; margin-bottom: 10px; }
.green, .green:hover { background: #31B854; border-color: #31B854; color: #fff; }
.opt { margin: 8px 0; font-weight: 600; }
</style>

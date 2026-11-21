<template>
  <div class="panel">
    <h2>我的会员</h2>
    <div class="filters">
      <el-button class="green" @click="addOpen = true">新增会员</el-button>
      <el-input v-model="kw" placeholder="输入会员姓名、联系方式快速搜索" style="width:280px" />
    </div>
    <el-table :data="rows" border empty-text="暂无数据">
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="name" label="会员姓名" />
      <el-table-column prop="phone" label="联系电话" />
      <el-table-column prop="orders" label="消费笔数（笔）" />
      <el-table-column prop="amount" label="消费总额（元）" />
      <el-table-column prop="credit" label="当前赊账额（元）" />
      <el-table-column label="操作" width="260">
        <template #default="{ row }">
          <el-button link @click="$router.push('/pes/retail/salesDeliveryOrder?member=' + row.id)">消费记录</el-button>
          <el-button link @click="$router.push('/pes/retail/creditRecord/' + row.id)">赊/还账记录</el-button>
          <el-button link @click="openDemoFill('编辑会员')">编辑</el-button>
          <el-button link @click="openDemoFill('删除会员')">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="addOpen" title="新增会员" width="520px" append-to-body>
      <el-form label-width="110px">
        <el-form-item label="会员姓名"><el-input v-model="form.name" /></el-form-item>
        <el-form-item label="联系电话"><el-input v-model="form.phone" /></el-form-item>
        <p class="opt">以下信息选填</p>
        <el-form-item label="身份证号码">
          <el-input v-model="form.idNo" />
          <p class="hint">建议填写，如购买限制农药时必须填写</p>
        </el-form-item>
        <el-form-item label="所在地区"><el-input v-model="form.area" /></el-form-item>
        <el-form-item label="详细地址"><el-input v-model="form.address" /></el-form-item>
        <el-form-item label="所属单位名称"><el-input v-model="form.unit" /></el-form-item>
        <el-form-item label="单位证号编号"><el-input v-model="form.unitNo" placeholder="统一信用代码/许可证编号" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addOpen = false">取消</el-button>
        <el-button class="green" @click="openDemoFill('保存会员')">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { computed, reactive, ref } from 'vue'
import { openDemoFill } from '@/components/pes/pesActions'
import { MEMBERS } from './retailData'
const kw = ref('')
const addOpen = ref(false)
const form = reactive({ name: '', phone: '', idNo: '', area: '', address: '', unit: '', unitNo: '' })
const rows = computed(() => MEMBERS.filter((m) => {
  const q = kw.value.trim()
  if (!q) return true
  return m.name.includes(q) || String(m.phone).includes(q)
}))
</script>
<style scoped>
.panel { background: #fff; padding: 14px; }
h2 { margin: 0 0 10px; font-size: 16px; }
.filters { display: flex; gap: 8px; margin-bottom: 10px; }
.green, .green:hover { background: #31B854; border-color: #31B854; color: #fff; }
.opt { margin: 8px 0; color: #303133; font-weight: 600; }
.hint { margin: 4px 0 0; color: #909399; font-size: 12px; }
</style>

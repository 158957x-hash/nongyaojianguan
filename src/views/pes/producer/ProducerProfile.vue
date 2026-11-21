<template>
  <div class="panel">
    <div class="head">
      <h3>企业备案</h3>
      <el-tag v-if="loop.profileConfirmed" type="success" effect="plain">已确认</el-tag>
      <el-tag v-else type="warning" effect="plain">待确认</el-tag>
    </div>
    <p class="hint">演示数据，不是现网档案。确认后即可填报生产批次。</p>
    <el-descriptions :column="2" border>
      <el-descriptions-item label="企业名称">{{ p.name }}</el-descriptions-item>
      <el-descriptions-item label="统一社会信用代码">{{ p.uscc }}</el-descriptions-item>
      <el-descriptions-item label="生产许可证">{{ p.license }}</el-descriptions-item>
      <el-descriptions-item label="法定代表人">{{ p.legal }}</el-descriptions-item>
      <el-descriptions-item label="联系人">{{ p.contact }}</el-descriptions-item>
      <el-descriptions-item label="联系方式">{{ p.phone }}</el-descriptions-item>
      <el-descriptions-item label="所在区域">{{ p.area }}</el-descriptions-item>
      <el-descriptions-item label="生产范围">{{ p.scope }}</el-descriptions-item>
      <el-descriptions-item label="地址" :span="2">{{ p.address }}</el-descriptions-item>
    </el-descriptions>
    <div class="foot">
      <el-button type="primary" class="green" :disabled="loop.profileConfirmed" @click="onConfirm">确认备案信息</el-button>
      <el-button @click="$router.push('/pes/producer/ledger')">去填报生产台账</el-button>
    </div>
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import { usePesLoopStore } from '@/stores/pesLoop'

const loop = usePesLoopStore()
const p = loop.producer

function onConfirm() {
  loop.confirmProfile()
  ElMessage.success('备案信息已确认，可以填报生产批次')
}
</script>

<style scoped>
.panel { background: #fff; padding: 16px 20px 20px; border-radius: 2px; box-shadow: none; }
.head { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
.head h3 { margin: 0; font-size: 16px; color: #303133; font-weight: 600; position: relative; padding-left: 10px; }
.head h3::before { content: ""; position: absolute; left: 0; top: 3px; bottom: 3px; width: 3px; background: #1F8A4C; border-radius: 1px; }
.hint { color: #909399; font-size: 13px; margin: 0 0 14px; }
.foot { margin-top: 16px; }
.green, .green:hover { background: #31B854; border-color: #31B854; }
</style>

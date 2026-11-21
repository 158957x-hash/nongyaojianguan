<template>
  <PesObserveList
    title="限制性农药"
    banner=""
    :toolbar="toolbar"
    :columns="columns"
    :rows="rows"
    :actions="actions"
    control-actions
    footer="演示名称，非正式名录。导入、下载模板、编辑、删除只留入口。"
    @action="(act) => openDemoFill(act?.label || '写操作')"
    @toolbar="(btn) => openDemoFill(btn?.label || '写操作')"
  />
</template>
<script setup>
import PesObserveList from '@/components/pes/PesObserveList.vue'
import { openDemoFill } from '@/components/pes/pesActions'

const toolbar = [
  { label: '导入限制性农药', primary: true, write: true },
  { label: '下载导入模板', write: true }
]
const columns = [
  { prop: 'importedAt', label: '导入时间', width: 160 },
  { prop: 'name', label: '限制性农药通用名', width: 180 },
  { prop: 'setting', label: '经营设置', width: 140 },
  { prop: 'remark', label: '备注', width: 140 }
]
const actions = [
  { label: '编辑', tone: 'blue', write: true },
  { label: '删除', tone: 'red', write: true }
]
const rows = [
  { id: 'r1', importedAt: '2026-03-01 10:00:00', name: '演示限制性农药甲', setting: '无需定点经营', remark: '无备注' },
  { id: 'r2', importedAt: '2026-03-01 10:00:00', name: '演示限制性农药乙', setting: '定点经营', remark: '无备注' },
  { id: 'r3', importedAt: '2026-06-12 09:20:00', name: '演示限制性农药丙', setting: '禁止经营', remark: '禁销售使用' }
]
</script>

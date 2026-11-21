<template>
  <PesObserveList ref="listRef" v-bind="page" :rows="page.rows" :default-filters="page.defaultFilters">
    <template #detail="{ row }">
      <el-descriptions v-if="row" :column="1" border>
        <el-descriptions-item v-for="col in page.columns" :key="col.prop" :label="col.label">
          {{ row[col.prop] || '—' }}
        </el-descriptions-item>
        <el-descriptions-item label="上报次数">
          <span :class="{ red: row.reportCount === 0 }">{{ row.reportCount === 0 ? '0' : (row.reportCount || '—') }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="主体类型">{{ row.subjectType || '—' }}</el-descriptions-item>
      </el-descriptions>
    </template>
    <template #detail-footer>
      <el-button @click="openDemoFill('审核', { kind: 'audit' })">审核</el-button>
      <el-button class="yellow" @click="openDemoFill('重设密码', { kind: 'password' })">重设密码</el-button>
      <el-button @click="openDemoFill('锁定账号')">锁定账号</el-button>
    </template>
  </PesObserveList>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import PesObserveList from '@/components/pes/PesObserveList.vue'
import { openDemoFill } from '@/components/pes/pesActions'
const props = defineProps({ page: { type: Object, required: true } })
const route = useRoute()
const listRef = ref(null)
onMounted(() => {
  const id = route.query.open
  if (!id) return
  const row = (props.page.rows || []).find((r) => String(r.id) === String(id))
  if (row) listRef.value?.openDetail(row, '查看详情')
})
</script>
<style scoped>
.red { color: #D94A4A; }
:deep(.yellow), :deep(.yellow:hover) { background: #E6A23C; border-color: #E6A23C; color: #fff; }
</style>

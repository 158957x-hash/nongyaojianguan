<template>
  <PesObserveList v-bind="page" :rows="page.rows" @link="onLink" />
</template>
<script setup>
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import PesObserveList from '@/components/pes/PesObserveList.vue'
defineProps({ page: { type: Object, required: true } })
const router = useRouter()
function onLink(col, row) {
  if (col.link === 'subject') {
    router.push({ path: '/pes/usage/subjects', query: { open: row.subjectId } })
    return
  }
  if (col.link === 'regNo') {
    ElMessage.info('产品登记信息行上无查看详情，不编内页')
  }
}
</script>

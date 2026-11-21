<template>
  <PesObserveList v-bind="page" :rows="page.rows" control-actions @action="onAction" />
</template>
<script setup>
import { useRouter } from 'vue-router'
import PesObserveList from '@/components/pes/PesObserveList.vue'
import { openDemoFill } from '@/components/pes/pesActions'
const props = defineProps({ page: { type: Object, required: true } })
const router = useRouter()
function onAction(act, row) {
  if (act.label === '查看详情') {
    router.push({ path: '/pes/production/enterprises/details', query: { id: row.id, queryType: '1' } })
    return
  }
  openDemoFill(act.label || '写操作')
}
</script>

<template>
  <div>
    <div class="tabs">
      <button v-for="t in page.tabs" :key="t" type="button" :class="{ on: tab === t }" @click="tab = t">{{ t }}</button>
    </div>
    <PesObserveList
      v-bind="page"
      :rows="filtered"
      :actions="rowActions"
      search-tone="blue"
      control-actions
      @action="onAction"
    />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import PesObserveList from '@/components/pes/PesObserveList.vue'
import { openDemoFill } from '@/components/pes/pesActions'

const props = defineProps({ page: { type: Object, required: true } })
const router = useRouter()
const tab = ref('待审核')
const filtered = computed(() => (props.page.rows || []).filter((r) => r.audit === tab.value))

function rowActions(row) {
  const view = { label: '查看', tone: 'cyan' }
  if (row.audit === '待审核') return [view, { label: '审核', tone: 'orange', write: true }]
  return [view]
}

function onAction(act, row) {
  if (act.label === '查看') {
    router.push(`/pes/audit/dealerDetails/${props.page.auditType}/${row.id}`)
    return
  }
  openDemoFill('审核', { kind: 'audit' })
}
</script>

<style scoped>
.tabs { display: flex; gap: 0; margin-bottom: 0; background: #fff; padding: 8px 14px 0; border-radius: 2px 2px 0 0; }
.tabs button {
  border: 1px solid #E5EAF0;
  border-bottom: none;
  background: #F7F9FB;
  padding: 6px 16px;
  cursor: pointer;
  color: #5a6d85;
}
.tabs button.on { background: #fff; color: #1F8A4C; font-weight: 600; }
</style>

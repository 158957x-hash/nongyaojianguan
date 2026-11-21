<template>
  <PesObserveList v-bind="page" :rows="page.rows" />
</template>
<script setup>
import PesObserveList from '@/components/pes/PesObserveList.vue'
defineProps({ page: { type: Object, required: true } })
</script>

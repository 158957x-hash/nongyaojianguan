<template>
  <div class="card">
    <h3>{{ title }}</h3>
    <p>{{ note }}</p>
  </div>
</template>
<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const title = computed(() => route.meta?.title || '入口')
const notes = {
  '/screen/recycle': '现网该分页 HTTP 500、白屏。此处只留入口，不编内页。',
  '/screen/seed': '现网为空白画布。此处只留入口，不编内页。',
  '/screen/fertilizer': '未确认到独立画面。此处只留入口，不编内页。'
}
const note = computed(() => route.meta?.entryNote || notes[route.path] || '独立界面未观察或现网故障，不编内页。')
</script>
<style scoped>
.card { background: rgba(16, 42, 74, 0.8); border: 1px solid #1B3C66; padding: 28px 24px; min-height: 280px; }
h3 { margin: 0 0 10px; color: #E8F4FF; }
p { margin: 0; color: #8AA0B8; line-height: 1.7; }
</style>

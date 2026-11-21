<template>
  <div class="pending">
    <div class="card">
      <h2>{{ title }}</h2>
      <p>{{ message }}</p>
    </div>
  </div>
</template>
<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const title = computed(() => route.meta?.title || '入口')
const message = computed(() => route.meta?.entryNote || '该入口已按现网菜单落下。独立界面未观察或现网故障，不编内页。')
</script>
<style lang="scss" scoped>
.pending { height: 100%; }
.card {
  background: #fff;
  border-radius: 2px;
  min-height: 280px;
  padding: 28px 24px;
  h2 { margin: 0 0 10px; font-size: 16px; font-weight: 600; color: #303133; }
  p { margin: 0; color: #909399; font-size: 13px; line-height: 1.7; }
}
</style>

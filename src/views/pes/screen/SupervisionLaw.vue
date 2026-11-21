<template>
  <div>
    <h3>监管执法</h3>
    <p class="cap">摄像头墙 · 离线 / 套餐上限</p>
    <div class="wall">
      <div v-for="n in 8" :key="n" class="cam">
        <div class="pic">离线</div>
        <div class="name">演示摄像头 {{ n }}</div>
      </div>
    </div>
    <p class="note">套餐上限</p>
  </div>
</template>
<style scoped>
h3 { margin: 0 0 4px; color: #E8F4FF; }
.cap, .note { color: #8AA0B8; margin: 0 0 12px; }
.wall { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
.cam { background: #0A1C33; border: 1px solid #1B3C66; }
.pic {
  height: 120px; display: flex; align-items: center; justify-content: center;
  background: #08101C; color: #D94A4A;
}
.name { padding: 6px 8px; color: #9CB0C6; font-size: 12px; }
@media (max-width: 900px) { .wall { grid-template-columns: 1fr 1fr; } }
</style>

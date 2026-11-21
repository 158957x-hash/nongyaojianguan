<template>
  <div class="mobile-page">
    <div class="mobile-header">
      <button class="back-button" @click="$router.push('/mobile/wanzhengtong')">‹</button>
      <b>皖政通 · 农药监管</b>
      <span></span>
    </div>
    <p class="tip">演示页：扫码录入生产 / 销售，支持离线暂存，数据与 PC 端共用。账号在监管端登录后即可查看。</p>
    <el-tabs v-model="tab" class="tabs">
      <el-tab-pane label="扫码录入" name="scan">
        <div class="card">
          <el-form label-position="top">
            <el-form-item label="批次号（演示用批次号代替扫码）">
              <el-input v-model="form.batchNo" placeholder="扫描或输入批次号" />
            </el-form-item>
            <el-form-item label="录入类型">
              <el-radio-group v-model="form.kind">
                <el-radio-button value="生产">生产</el-radio-button>
                <el-radio-button value="销售">销售</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="种类">
              <el-input v-model="form.productName" />
            </el-form-item>
            <el-form-item label="数量">
              <el-input-number v-model="form.qty" :min="1" style="width: 100%" />
            </el-form-item>
            <el-form-item v-if="form.kind === '销售'" label="购买人">
              <el-input v-model="form.buyer" />
            </el-form-item>
          </el-form>
          <div class="actions">
            <el-button @click="saveDraft">离线暂存</el-button>
            <el-button type="primary" @click="submitNow">提交并同步</el-button>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane :label="`离线暂存（${loop.mobileDrafts.length}）`" name="draft">
        <div v-if="!loop.mobileDrafts.length" class="empty">暂无离线记录</div>
        <div v-for="d in loop.mobileDrafts" :key="d.id" class="item">
          <div>
            <b>{{ d.kind }} · {{ d.batchNo }}</b>
            <p>{{ d.productName }} · {{ d.qty }}瓶<template v-if="d.buyer"> · {{ d.buyer }}</template></p>
            <small>{{ d.savedAt }}</small>
          </div>
          <el-button size="small" type="primary" @click="syncDraft(d.id)">同步</el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane label="产销速览" name="overview">
        <div class="card">
          <div class="metric"><b>{{ loop.batches.length }}</b><span>生产批次</span></div>
          <div class="metric"><b>{{ loop.inbounds.length }}</b><span>经营入库</span></div>
          <div class="metric"><b>{{ loop.outbounds.length }}</b><span>销售出库</span></div>
        </div>
        <div v-for="b in loop.batches" :key="b.id" class="item">
          <div>
            <b>{{ b.batchNo }} · {{ b.productName }}</b>
            <p>产量 {{ b.produceQty }}{{ b.unit }} · 去向 {{ b.destination }}</p>
          </div>
        </div>
        <div v-for="e in loop.mobileEntries" :key="e.id" class="item">
          <div>
            <b>移动端已同步 · {{ e.kind }} · {{ e.batchNo }}</b>
            <p>{{ e.productName }} · {{ e.qty }}瓶 · {{ e.submitTime }}</p>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { usePesLoopStore, LOOP_PRODUCT } from '@/stores/pesLoop'

const loop = usePesLoopStore()
const tab = ref('scan')
const form = reactive({
  batchNo: loop.heroBatchNo,
  kind: '销售',
  productName: LOOP_PRODUCT.name,
  qty: 10,
  buyer: '演示购买人丙'
})

function saveDraft() {
  if (!form.batchNo) return ElMessage.warning('请填写批次号')
  loop.saveMobileDraft({ ...form })
  ElMessage.success('已离线暂存，可在无网时先记下，回来再同步')
  tab.value = 'draft'
}
function submitNow() {
  if (!form.batchNo) return ElMessage.warning('请填写批次号')
  loop.submitMobileEntry({ ...form })
  ElMessage.success('已同步，监管端和追溯可继续查看该批次（演示）')
  tab.value = 'overview'
}
function syncDraft(id) {
  try {
    loop.syncMobileDraft(id)
    ElMessage.success('暂存记录已同步')
    tab.value = 'overview'
  } catch (e) {
    ElMessage.warning(e.message || '同步失败')
  }
}
</script>
<style scoped>
.mobile-page {
  width: 100%;
  min-width: 0;
  min-height: 100%;
  box-sizing: border-box;
  background: #f5f6f8;
  padding: 0 10px 30px;
  overflow-x: hidden;
}
.mobile-header {
  height: 58px;
  display: grid;
  grid-template-columns: 42px 1fr 42px;
  align-items: center;
  text-align: center;
  color: #222;
  font-size: 23px;
}
.back-button {
  border: 0;
  background: none;
  font-size: 38px;
  line-height: 1;
  color: #333;
  text-align: left;
  padding: 0 0 5px 7px;
}
.tip { color: #667085; font-size: 12px; line-height: 1.5; margin: 0 2px 12px; }
.card {
  background: #fff;
  border-radius: 14px;
  padding: 16px;
  box-shadow: 0 1px 5px rgba(31, 52, 73, 0.04);
}
.actions { display: flex; gap: 8px; margin-top: 8px; }
.actions :deep(.el-button--primary),
:deep(.el-button--primary) {
  --el-button-bg-color: #1668DC;
  --el-button-border-color: #1668DC;
  --el-button-hover-bg-color: #3a7fe3;
  --el-button-hover-border-color: #3a7fe3;
  --el-button-active-bg-color: #0f55b8;
  --el-button-active-border-color: #0f55b8;
}
:deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
  background: #1668DC;
  border-color: #1668DC;
  box-shadow: -1px 0 0 0 #1668DC;
  color: #fff;
}
.tabs :deep(.el-tabs__active-bar) { background: #1668DC; }
.tabs :deep(.el-tabs__item.is-active),
.tabs :deep(.el-tabs__item:hover) { color: #1668DC; }
.item {
  background: #fff;
  border-radius: 14px;
  padding: 12px 14px;
  margin-top: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  box-shadow: 0 1px 5px rgba(31, 52, 73, 0.04);
}
.item p, .item small { margin: 4px 0 0; color: #667085; font-size: 12px; }
.empty { text-align: center; color: #98a2b3; padding: 24px 0; }
.metric { display: inline-block; width: 33%; text-align: center; }
.metric b { display: block; font-size: 20px; color: #1668DC; }
.metric span { font-size: 12px; color: #667085; }
</style>

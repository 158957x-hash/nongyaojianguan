<template>
  <div class="pes-page">
    <div class="panel">
      <div class="title-row">
        <div class="title-text">{{ title }}</div>
        <div class="title-extra">
          <el-button
            v-for="btn in toolbar"
            :key="btn.label"
            size="small"
            :class="toolbarClass(btn)"
            @click="onToolbar(btn)"
          >{{ btn.label }}</el-button>
        </div>
      </div>

      <div v-if="banner" class="banner">{{ banner }}</div>

      <slot name="toolbar-extra" />

      <el-form v-if="filters.length" inline class="filter-bar" @submit.prevent="onSearch">
        <el-form-item v-for="f in filters" :key="f.key" :label="f.label">
          <el-input
            v-if="f.type === 'input' || !f.type"
            v-model="form[f.key]"
            clearable
            :placeholder="f.placeholder || ('请输入' + f.label)"
            style="width: 180px"
            :disabled="searchDisabled"
          />
          <el-select
            v-else-if="f.type === 'select'"
            v-model="form[f.key]"
            clearable
            :placeholder="f.placeholder || (f.options && f.options.length ? '全部' : '选项待观察')"
            style="width: 180px"
            :disabled="searchDisabled || !(f.options && f.options.length)"
          >
            <el-option v-for="opt in (f.options || [])" :key="opt" :label="opt" :value="opt" />
          </el-select>
          <el-date-picker
            v-else-if="f.type === 'daterange'"
            v-model="form[f.key]"
            type="daterange"
            value-format="YYYY-MM-DD"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            range-separator="至"
            style="width: 240px"
            :disabled="searchDisabled"
          />
        </el-form-item>
        <el-form-item>
          <el-button class="pes-search" :class="{ 'pes-search-blue': searchTone === 'blue' }" :disabled="searchDisabled" native-type="button" @click="onSearch">搜索</el-button>
          <el-button :disabled="searchDisabled" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>

      <slot name="before-table" />

      <el-table v-if="columns.length" :data="pagedRows" border class="pes-table" empty-text="暂无数据">
        <el-table-column
          v-for="col in columns"
          :key="col.prop"
          :prop="col.type === 'index' ? undefined : col.prop"
          :label="col.label"
          :width="col.type === 'index' ? (col.width || 60) : undefined"
          :min-width="col.type === 'index' ? undefined : (col.width || 120)"
          show-overflow-tooltip
        >
          <template v-if="col.headerClass" #header>
            <span :class="col.headerClass">{{ col.label }}</span>
          </template>
          <template #default="scope">
            <span v-if="col.type === 'index'">{{ indexBase + scope.$index + 1 }}</span>
            <template v-else-if="col.restrictToggle">
              <span>{{ cellText(scope.row, col.prop) || '已关闭' }}</span>
              <button type="button" class="act-btn tone-link" @click.stop="openDemoFill('开启限制性销售')">开启</button>
            </template>
            <button v-else-if="col.link" type="button" class="cell-link" @click="onLink(col, scope.row)">{{ cellText(scope.row, col.prop) || '—' }}</button>
            <span v-else-if="col.alertIcon && scope.row[col.prop] === '是'" class="alert-cell">
              <i class="alert-icon" />{{ cellText(scope.row, col.prop) }}
            </span>
            <span v-else-if="col.alertMark && scope.row.isAlert === '是'" class="alert-cell">
              <i class="alert-icon" />{{ cellText(scope.row, col.prop) || '—' }}
              <em v-if="scope.row.qtyFlag" class="qty-flag">{{ scope.row.qtyFlag }}</em>
            </span>
            <span v-else-if="col.qtyFlag && scope.row[col.prop]">{{ cellText(scope.row, col.prop) }}</span>
            <span v-else>{{ cellText(scope.row, col.prop) || '—' }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="hasActionCol" label="操作" fixed="right" :width="actionWidth">
          <template #default="{ row }">
            <button
              v-for="act in actionsFor(row)"
              :key="act.label"
              type="button"
              :class="['act-btn', 'tone-' + (act.tone || 'link')]"
              @click="onAction(act, row)"
            >{{ act.label }}</button>
          </template>
        </el-table-column>
      </el-table>
      <div v-else class="empty-fields">{{ emptyText }}</div>

      <div class="table-footer">
        <span>{{ footerText }}</span>
        <el-pagination
          v-if="columns.length || showPagerOnEmpty"
          small
          background
          layout="total, prev, pager, next, sizes"
          :total="filteredRows.length"
          :page-size="pageSize"
          :current-page="page"
          :page-sizes="[10, 20, 50]"
          @current-change="page = $event"
          @size-change="onSizeChange"
        />
      </div>
    </div>

    <el-dialog v-model="detailVisible" :title="detailTitle" width="720px" append-to-body>
      <slot name="detail" :row="current" :action="actionName">
        <template v-if="current">
          <el-descriptions v-if="columns.length" :column="1" border>
            <el-descriptions-item v-for="col in columns" :key="col.prop" :label="col.label">
              {{ current[col.prop] || '—' }}
            </el-descriptions-item>
          </el-descriptions>
          <p v-if="detailHint" class="detail-hint">{{ detailHint }}</p>
        </template>
      </slot>
      <template #footer>
        <slot name="detail-footer" :row="current" :action="actionName">
          <el-button @click="detailVisible = false">关闭</el-button>
        </slot>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { openDemoFill } from './pesActions'

const props = defineProps({
  title: { type: String, required: true },
  evidence: { type: String, default: 'OBSERVED' },
  evidenceLabel: { type: String, default: '监管端已观察' },
  note: { type: String, default: '' },
  banner: { type: String, default: '' },
  filters: { type: Array, default: () => [] },
  columns: { type: Array, default: () => [] },
  actions: { type: Array, default: () => [] },
  writeActions: { type: Array, default: () => [] },
  toolbar: { type: Array, default: () => [] },
  searchDisabled: { type: Boolean, default: false },
  searchTone: { type: String, default: 'green' },
  rows: { type: Array, default: () => [] },
  footer: { type: String, default: '' },
  emptyText: { type: String, default: '暂无数据' },
  showPagerOnEmpty: { type: Boolean, default: false },
  unobservedDetail: { type: Boolean, default: false },
  defaultFilters: { type: Object, default: () => ({}) },
  controlActions: { type: Boolean, default: false }
})

const emit = defineEmits(['action', 'link', 'toolbar'])

const form = reactive({})
function initForm() {
  props.filters.forEach((f) => {
    form[f.key] = props.defaultFilters[f.key] ?? undefined
  })
}
initForm()
const applied = reactive({})
function applyDefaults() {
  props.filters.forEach((f) => { applied[f.key] = form[f.key] })
}
applyDefaults()

const detailVisible = ref(false)
const current = ref(null)
const actionName = ref('')
const page = ref(1)
const pageSize = ref(10)

watch(() => props.defaultFilters, () => {
  initForm()
  applyDefaults()
}, { deep: true })

const detailTitle = computed(() => {
  const act = actionName.value || '查看详情'
  return current.value ? `${props.title} · ${act}` : act
})
const detailHint = computed(() => {
  return ''
})

function normalizeAction(act) {
  if (typeof act === 'object' && act) return { label: act.label, tone: act.tone, write: !!act.write }
  const label = String(act)
  const write = props.writeActions.includes(label) || ['停用', '删除', '编辑', '管理'].includes(label)
  let tone = 'link'
  if (label === '查看') tone = 'cyan'
  else if (label === '审核') tone = 'orange'
  else if (label === '删除') tone = 'red'
  return { label, tone, write }
}

function actionsFor(row) {
  if (typeof props.actions === 'function') return (props.actions(row) || []).map(normalizeAction)
  return (props.actions || []).map(normalizeAction)
}
const hasActionCol = computed(() => {
  if (typeof props.actions === 'function') return true
  return (props.actions || []).length > 0
})
const actionWidth = computed(() => 160)

function toolbarClass(btn) {
  if (btn.tone === 'yellow') return 'pes-btn-yellow'
  if (btn.primary) return 'pes-search'
  return ''
}

function cellText(row, key) {
  const v = row?.[key]
  return v == null ? '' : String(v)
}

function matchRow(row, query) {
  for (const f of props.filters) {
    const v = query[f.key]
    if (v == null || v === '') continue
    if (f.type === 'daterange' && Array.isArray(v) && v.length === 2) {
      const raw = cellText(row, f.key)
      if (!raw || raw === '—') return false
      const day = raw.slice(0, 10)
      if (day < v[0] || day > v[1]) return false
      continue
    }
    if (f.key === 'keyword' || (!props.columns.some((c) => c.prop === f.key) && (f.type === 'input' || !f.type))) {
      const kw = String(v).trim()
      if (!kw) continue
      const hit = props.columns.some((c) => cellText(row, c.prop).includes(kw))
        || Object.values(row).some((x) => String(x ?? '').includes(kw))
      if (!hit) return false
      continue
    }
    if (f.type === 'select') {
      const aliases = (f.matchValues && f.matchValues[String(v)]) || [String(v)]
      if (!aliases.includes(cellText(row, f.key))) return false
      continue
    }
    if (!cellText(row, f.key).includes(String(v).trim())) return false
  }
  return true
}

const filteredRows = computed(() => props.rows.filter((row) => matchRow(row, applied)))
const indexBase = computed(() => (page.value - 1) * pageSize.value)
const pagedRows = computed(() => {
  const start = indexBase.value
  return filteredRows.value.slice(start, start + pageSize.value)
})
const footerText = computed(() => {
  if (props.footer) return props.footer
  if (!props.columns.length) return '暂无数据'
  return `演示数据 ${filteredRows.value.length} 条，非正式导出`
})

function resetForm() {
  props.filters.forEach((f) => { form[f.key] = props.defaultFilters[f.key] ?? undefined })
}
function applyForm() {
  props.filters.forEach((f) => { applied[f.key] = form[f.key] })
  page.value = 1
}
function reset() {
  resetForm()
  applyForm()
}
function onSearch() {
  if (props.searchDisabled) return
  applyForm()
}
function onSizeChange(size) {
  pageSize.value = size
  page.value = 1
}

function onToolbar(btn) {
  emit('toolbar', btn)
  if (btn?.write || String(btn?.label || '').includes('导出') || String(btn?.label || '').includes('添加') || String(btn?.label || '').includes('导入')) {
    openDemoFill(btn?.label || '写操作')
    return
  }
}

function onAction(act, row) {
  emit('action', act, row)
  if (props.controlActions) return
  if (act.write) {
    openDemoFill(act.label || '写操作', { kind: act.label === '审核' ? 'audit' : 'confirm' })
    return
  }
  if (props.unobservedDetail) {
    ElMessage.info('该内页还在对照现网补字段')
    return
  }
  current.value = row || {}
  actionName.value = act.label || '查看详情'
  detailVisible.value = true
}

function onLink(col, row) {
  emit('link', col, row)
}

defineExpose({ openDetail(row, act = '查看详情') {
  current.value = row
  actionName.value = act
  detailVisible.value = true
}, closeDetail() { detailVisible.value = false } })
</script>

<style scoped>
.pes-page { height: 100%; }
.panel {
  background: #fff;
  border-radius: 2px;
  padding: 12px 14px 10px;
}
.title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
}
.title-text { font-size: 15px; font-weight: 600; color: #303133; }
.banner {
  margin-bottom: 10px;
  padding: 8px 12px;
  background: #F4F8F5;
  border: 1px solid #D9E8DE;
  color: #1F8A4C;
  font-size: 13px;
  border-radius: 2px;
}
.filter-bar { margin-bottom: 8px; }
.pes-search {
  background: #1F8A4C;
  border-color: #1F8A4C;
  color: #fff;
}
.pes-search:hover,
.pes-search:focus {
  background: #187a42;
  border-color: #187a42;
  color: #fff;
}
.pes-search-blue,
.pes-search-blue:hover,
.pes-search-blue:focus {
  background: #2F6FED;
  border-color: #2F6FED;
  color: #fff;
}
.pes-btn-yellow,
.pes-btn-yellow:hover,
.pes-btn-yellow:focus {
  background: #E6A23C;
  border-color: #E6A23C;
  color: #fff;
}
.cell-link {
  border: 0;
  background: transparent;
  color: #1F8A4C;
  cursor: pointer;
  padding: 0;
  font: inherit;
}
.cell-link:hover { text-decoration: underline; }
.alert-cell { color: #D94A4A; }
.qty-flag { font-style: normal; margin-left: 6px; font-size: 12px; }
.header-orange { color: #E6A23C; font-weight: 600; }
.alert-icon {
  display: inline-block;
  width: 8px;
  height: 8px;
  margin-right: 6px;
  border-radius: 50%;
  background: #D94A4A;
}
.act-btn {
  border: 0;
  background: transparent;
  cursor: pointer;
  font-size: 13px;
  margin-right: 8px;
  padding: 0;
}
.tone-link { color: #1F8A4C; }
.tone-blue { color: #2F6FED; }
.tone-cyan { color: #1AA6A6; }
.tone-orange { color: #E67A1A; }
.tone-red { color: #D94A4A; }
.empty-fields { padding: 36px 12px; text-align: center; color: #909399; background: #fafafa; border: 1px dashed #dcdfe6; }
.table-footer {
  margin-top: 10px;
  color: #909399;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.detail-hint { margin-top: 16px; color: #909399; font-size: 13px; line-height: 1.6; }
:deep(.pes-table) {
  --el-table-header-bg-color: #F5F7FA;
  --el-table-header-text-color: #606266;
}
:deep(.el-pagination.is-background .el-pager li.is-active) {
  background-color: #1F8A4C;
}
</style>

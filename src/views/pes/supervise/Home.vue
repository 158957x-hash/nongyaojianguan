<template>
  <div class="pes-home">
    <section class="block">
      <div class="block-head">
        <div class="block-title">安徽省数据概览</div>
        <TimeFilter v-model="overviewPeriod" />
      </div>
      <div class="split">
        <div class="col">
          <div class="col-title">农药经营（零售、批发）</div>
          <div class="metrics-panel">
            <div class="metric">
              <b class="num">{{ bizReportRate }}</b>
              <span class="label">经营户上报率</span>
            </div>
            <i class="divider" />
            <div class="metric">
              <b class="num danger">{{ bizUnreported }}</b>
              <span class="label">未上报经营户（家）</span>
            </div>
            <p class="footnote">演示月均上报率 {{ bizMonthlyRate }}，人均上报条数 {{ bizPerCapita }} 条 <i class="help" title="指标口径未在现网确认，演示不展示真实数值">?</i></p>
          </div>
        </div>
        <div class="col">
          <div class="col-title">农药使用</div>
          <div class="metrics-panel single">
            <div class="metric">
              <b class="num">{{ usageSubjects }}</b>
              <span class="label">上报主体（家）</span>
            </div>
          </div>
        </div>
      </div>
      <div class="quick-row">
        <div class="quick-group">
          <button v-for="btn in quickLeft" :key="btn.label" type="button" class="quick" @click="go(btn)">{{ btn.label }}</button>
        </div>
        <div class="quick-group">
          <button v-for="btn in quickRight" :key="btn.label" type="button" class="quick" @click="go(btn)">{{ btn.label }}</button>
        </div>
      </div>
    </section>

    <section class="block">
      <div class="block-head">
        <div class="block-title">全省上报排行</div>
        <TimeFilter v-model="rankPeriod" />
      </div>
      <div class="split rank-split">
        <div class="col">
          <div class="col-title-row">
            <div class="col-title">农药经营（零售、批发）</div>
            <div class="chips">
              <button type="button" class="chip sm fill" :class="{ on: areaDim === 'county' }" @click="setAreaDim('county')">按区县</button>
              <button type="button" class="chip sm fill" :class="{ on: areaDim === 'city' }" @click="setAreaDim('city')">按市级</button>
            </div>
          </div>
          <div class="solid-tabs">
            <button type="button" class="stab" :class="{ on: rankTab === 'subjects' }" @click="rankTab = 'subjects'">上报主体占比排行（上报主体占比）</button>
            <button type="button" class="stab" :class="{ on: rankTab === 'count' }" @click="rankTab = 'count'">上报数量排行（上报条数）</button>
          </div>
          <div class="sub-tabs">
            <template v-if="rankTab === 'subjects'">
              <button type="button" class="sub" :class="{ on: shareMode === '15d' }" @click="shareMode = '15d'">按最近15天占比</button>
              <button type="button" class="sub" :class="{ on: shareMode === 'yearly' }" @click="shareMode = 'yearly'">按年月均占比 <i class="help dark">?</i> <span class="caret">▾</span></button>
            </template>
            <template v-else>
              <button type="button" class="sub" :class="{ on: countMode === '15d' }" @click="countMode = '15d'">按最近15天总条数</button>
              <button type="button" class="sub" :class="{ on: countMode === 'yearly' }" @click="countMode = 'yearly'">按年人均条数 <i class="help dark">?</i> <span class="caret">▾</span></button>
            </template>
          </div>
          <p v-if="areaDim === 'city'" class="rank-hint">提示：点击对应城市，可查看他的区县上报情况</p>
          <ul class="rank-list">
            <li v-for="(row, i) in rankRows" :key="row.name" :class="{ clickable: areaDim === 'city' }" @click="onRankClick(row)">
              <span class="bar" :style="{ width: row.ratio + '%' }" />
              <span v-if="i < 3" class="watermark" :class="'w' + (i + 1)">NO.{{ i + 1 }}</span>
              <span v-if="i < 3" class="medal" :class="'m' + (i + 1)">{{ i + 1 }}</span>
              <span v-else class="idx">{{ i + 1 }}</span>
              <span class="name">{{ row.name }}</span>
              <span class="val">{{ row.value }}</span>
            </li>
          </ul>
        </div>
        <div class="col">
          <div class="col-title">农药使用</div>
          <div class="solid-tabs">
            <button type="button" class="stab on">上报数量排行（上报条数）</button>
          </div>
          <ul class="rank-list">
            <li v-for="(row, i) in usageRankRows" :key="row.name">
              <span class="bar" :style="{ width: row.ratio + '%' }" />
              <span v-if="i < 3" class="watermark" :class="'w' + (i + 1)">NO.{{ i + 1 }}</span>
              <span v-if="i < 3" class="medal" :class="'m' + (i + 1)">{{ i + 1 }}</span>
              <span v-else class="idx">{{ i + 1 }}</span>
              <span class="name">{{ row.name }}</span>
              <span class="val">{{ row.value }}</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, defineComponent, h, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const overviewPeriod = ref({ type: '15d' })
const rankPeriod = ref({ type: '15d' })
const areaDim = ref('county')
const rankTab = ref('subjects')
const shareMode = ref('15d')
const countMode = ref('15d')
const drilledCity = ref('')

const bizReportRate = '87.20%'
const bizUnreported = 128
const bizMonthlyRate = '84.60%'
const bizPerCapita = '3.60'
const usageSubjects = 36

const shareDemo = [
  { suffix: 'A', value: '100.00%', ratio: 100 },
  { suffix: 'B', value: '85.00%', ratio: 85 },
  { suffix: 'C', value: '72.00%', ratio: 72 },
  { suffix: 'D', value: '64.00%', ratio: 64 },
  { suffix: 'E', value: '51.00%', ratio: 51 },
  { suffix: 'F', value: '40.00%', ratio: 40 },
  { suffix: 'G', value: '28.00%', ratio: 28 }
]
const countDemo = [
  { suffix: 'A', value: '8,000', ratio: 100 },
  { suffix: 'B', value: '6,400', ratio: 80 },
  { suffix: 'C', value: '5,200', ratio: 65 },
  { suffix: 'D', value: '4,100', ratio: 51 },
  { suffix: 'E', value: '3,000', ratio: 38 },
  { suffix: 'F', value: '2,100', ratio: 26 },
  { suffix: 'G', value: '1,200', ratio: 15 }
]

const rankRows = computed(() => {
  const source = rankTab.value === 'count' ? countDemo : shareDemo
  if (areaDim.value === 'city') {
    return source.map((row) => ({ name: '演示市' + row.suffix, value: row.value, ratio: row.ratio }))
  }
  const prefix = drilledCity.value ? `${drilledCity.value}·演示区县` : '演示区县'
  return source.map((row) => ({ name: prefix + row.suffix, value: row.value, ratio: row.ratio }))
})

const usageRankDemo = [
  { suffix: 'A', value: '36', ratio: 100 },
  { suffix: 'B', value: '28', ratio: 78 },
  { suffix: 'C', value: '21', ratio: 58 },
  { suffix: 'D', value: '15', ratio: 42 },
  { suffix: 'E', value: '9', ratio: 25 }
]
const usageRankRows = computed(() => usageRankDemo.map((row) => ({ name: '演示区县' + row.suffix, value: row.value, ratio: row.ratio })))

const quickLeft = [
  { label: '经营户上报统计', to: '/pes/stats/operator-report' },
  { label: '农药交易量统计', to: '/pes/stats/trade' },
  { label: '经营户详情', to: '/pes/operation/enterprises' }
]
const quickRight = [
  { label: '农药使用统计', to: '/pes/stats/usage' },
  { label: '使用主体详情', to: '/pes/usage/subjects' }
]

function go(btn) {
  if (btn.to) router.push(btn.to)
}

function setAreaDim(dim) {
  areaDim.value = dim
  if (dim === 'city') drilledCity.value = ''
}

function onRankClick(row) {
  if (areaDim.value !== 'city') return
  drilledCity.value = row.name
  areaDim.value = 'county'
}

function padDot(d) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}.${m}.${day}`
}

function formatRange(type, month, year) {
  const end = new Date()
  if (type === '15d') {
    const start = new Date(end)
    start.setDate(end.getDate() - 14)
    return `${padDot(start)} - ${padDot(end)}`
  }
  if (type === 'month') return `2026.11.01 - ${padDot(end)}`
  if (type === 'byMonth') {
    const [y, m] = (month || '2026-11').split('-').map(Number)
    const last = new Date(y, m, 0)
    return `${y}.${String(m).padStart(2, '0')}.01 - ${padDot(last)}`
  }
  if (type === 'byYear') {
    const y = year || 2026
    return `${y}.01.01 - ${y}.12.31`
  }
  return '—'
}

const TimeFilter = defineComponent({
  name: 'TimeFilter',
  props: { modelValue: { type: Object, required: true } },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const setType = (type) => emit('update:modelValue', { ...props.modelValue, type })
    const setMonth = (month) => emit('update:modelValue', { type: 'byMonth', month })
    const setYear = (year) => emit('update:modelValue', { type: 'byYear', year })
    return () => {
      const v = props.modelValue
      const chip = (key, label) => h('button', {
        type: 'button',
        class: ['chip', { on: v.type === key }],
        onClick: () => setType(key)
      }, label)
      return h('div', { class: 'filters' }, [
        chip('15d', '最近15天'),
        chip('month', '本月'),
        h('select', {
          class: ['chip', 'select', 'has-cal', { on: v.type === 'byMonth' }],
          value: v.type === 'byMonth' ? v.month || '2026-11' : '',
          onChange: (e) => setMonth(e.target.value || '2026-11')
        }, [
          h('option', { value: '', disabled: true }, '按整月统计'),
          h('option', { value: '2026-11' }, '2026年11月'),
          h('option', { value: '2026-10' }, '2026年10月')
        ]),
        h('select', {
          class: ['chip', 'select', { on: v.type === 'byYear' }],
          value: v.type === 'byYear' ? String(v.year || 2026) : '',
          onChange: (e) => setYear(Number(e.target.value) || 2026)
        }, [
          h('option', { value: '', disabled: true }, '按全年统计'),
          h('option', { value: '2026' }, '2026年'),
          h('option', { value: '2025' }, '2025年')
        ]),
        h('span', { class: 'range' }, formatRange(v.type, v.month, v.year))
      ])
    }
  }
})
</script>

<style lang="scss" scoped>
.pes-home { display: flex; flex-direction: column; gap: 12px; }
.block {
  background: #fff;
  border-radius: 2px;
  padding: 16px 16px 18px;
  box-shadow: 0 1px 2px rgba(15, 30, 50, 0.04);
}
.block-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 14px;
}
.block-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  flex-shrink: 0;
}
.filters,
:deep(.filters) {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: flex-end;
}
.chip,
:deep(.chip) {
  height: 32px;
  padding: 0 12px;
  border: 1px solid #DCDFE6;
  background: #fff;
  color: #606266;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
  &.sm {
    height: 26px;
    padding: 0 10px;
    font-size: 12px;
    border-radius: 4px;
  }
  &.on {
    background: #fff;
    border-color: #419C27;
    color: #419C27;
  }
  &.fill.on {
    background: #419C27;
    border-color: #419C27;
    color: #fff;
  }
  &.select {
    appearance: none;
    padding-right: 22px;
    background-image: linear-gradient(45deg, transparent 50%, currentColor 50%), linear-gradient(135deg, currentColor 50%, transparent 50%);
    background-position: calc(100% - 12px) 13px, calc(100% - 7px) 13px;
    background-size: 5px 5px, 5px 5px;
    background-repeat: no-repeat;
  }
  &.has-cal {
    padding-left: 28px;
    background-image:
      url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 14 14' fill='none'><rect x='1.5' y='3' width='11' height='9.5' rx='1.2' stroke='%23909399' stroke-width='1.2'/><path d='M1.5 6h11' stroke='%23909399' stroke-width='1.2'/><path d='M4 1.5v3M10 1.5v3' stroke='%23909399' stroke-width='1.2' stroke-linecap='round'/></svg>"),
      linear-gradient(45deg, transparent 50%, currentColor 50%),
      linear-gradient(135deg, currentColor 50%, transparent 50%);
    background-position: 8px 50%, calc(100% - 12px) 13px, calc(100% - 7px) 13px;
    background-size: 14px 14px, 5px 5px, 5px 5px;
    background-repeat: no-repeat;
  }
}
.range, :deep(.range) { color: #909399; font-size: 13px; margin-left: 4px; }
.split {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.col { min-width: 0; }
.col-title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  &::before {
    content: '';
    width: 4px;
    height: 16px;
    background: #1378FC;
    border-radius: 1px;
    flex-shrink: 0;
  }
}
.col-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  .col-title { margin-bottom: 0; }
}
.chips { display: flex; gap: 6px; }
.metrics-panel {
  background: #F9F9F9;
  border-radius: 2px;
  min-height: 148px;
  padding: 28px 24px 20px;
  display: grid;
  grid-template-columns: 1fr 1px 1fr;
  align-items: start;
  position: relative;
  &.single {
    grid-template-columns: 1fr;
    justify-items: center;
  }
}
.metric {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  .num { font-size: 32px; font-weight: 600; color: #303133; line-height: 1; }
  .label { font-size: 13px; color: #606266; }
  .danger { color: #FE0A0A; }
}
.divider { display: block; width: 1px; height: 52px; background: #DCDCDC; justify-self: center; margin-top: 4px; }
.footnote {
  grid-column: 1 / -1;
  margin: 16px 0 0;
  text-align: center;
  color: #F59F2F;
  font-size: 13px;
  line-height: 1.4;
}
.help {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  margin-left: 2px;
  border-radius: 50%;
  border: 1px solid currentColor;
  font-size: 10px;
  font-style: normal;
  line-height: 1;
  vertical-align: middle;
  opacity: 0.9;
  &.dark { color: #909399; margin-left: 4px; }
}
.quick-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-top: 14px;
}
.quick-group { display: flex; flex-wrap: wrap; gap: 10px; }
.quick {
  height: 36px;
  padding: 0 16px;
  border: 1px solid #AED8F9;
  background: #E9F2FB;
  color: #017AF5;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
  &:hover { background: #DCECFA; }
}
.solid-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0;
  margin: 12px 0 0;
}
.stab {
  border: 0;
  background: #F5F7FA;
  color: #303133;
  font-size: 13px;
  height: 32px;
  padding: 0 14px;
  cursor: pointer;
  &.on {
    background: #58A8F0;
    color: #fff;
  }
}
.sub-tabs {
  display: flex;
  align-items: center;
  gap: 18px;
  margin: 10px 0 6px;
  min-height: 28px;
}
.sub {
  border: 0;
  background: transparent;
  color: #909399;
  font-size: 13px;
  padding: 0 0 6px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  &.on {
    color: #303133;
    box-shadow: inset 0 -2px 0 #1378FC;
  }
}
.caret { font-size: 10px; color: #909399; margin-left: 2px; }
.rank-hint {
  margin: 0 0 8px;
  padding: 6px 10px;
  background: #F5F7FA;
  color: #606266;
  font-size: 13px;
  border-radius: 2px;
}
.rank-list { list-style: none; margin: 0; padding: 0; }
.rank-list li {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  height: 44px;
  font-size: 13px;
  overflow: hidden;
  border-bottom: 1px solid #F0F2F5;
}
.rank-list li.clickable { cursor: pointer; }
.bar {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  background: #E4F0F9;
  pointer-events: none;
}
.watermark {
  position: absolute;
  right: 8px;
  font-size: 36px;
  font-weight: 700;
  font-style: italic;
  line-height: 1;
  pointer-events: none;
  letter-spacing: 1px;
  opacity: 0.35;
  &.w1 { color: #F5C49A; }
  &.w2 { color: #B7D3F5; }
  &.w3 { color: #B7E5C8; }
}
.medal {
  width: 28px;
  height: 20px;
  clip-path: polygon(0 0, 78% 0, 100% 50%, 78% 100%, 0 100%);
  text-align: center;
  line-height: 20px;
  font-size: 12px;
  font-style: italic;
  font-weight: 600;
  color: #fff;
  z-index: 1;
  flex-shrink: 0;
  margin-left: 2px;
  &.m1 { background: #F1833A; }
  &.m2 { background: #2384F4; }
  &.m3 { background: #5AC476; }
}
.idx {
  width: 28px;
  text-align: center;
  color: #909399;
  z-index: 1;
  flex-shrink: 0;
}
.name { flex: 1; color: #303133; z-index: 1; }
.val { color: #303133; z-index: 1; min-width: 4.5em; text-align: right; margin-right: 8px; }
.empty {
  min-height: 280px;
  margin-top: 8px;
  background: #F7F8FA;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.empty-art { width: 148px; height: 120px; }
.empty-text { margin-top: 8px; color: #8B9FD4; font-size: 14px; }
</style>

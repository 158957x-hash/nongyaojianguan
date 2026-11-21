import { reactive } from 'vue'
import { ElMessage } from 'element-plus'

export const demoFill = reactive({
  visible: false,
  title: '写操作',
  kind: 'confirm',
  message: '演示环境不调用真实接口，确认后仅作讲解。',
  form: { old: '', now: '', confirm: '', result: '通过', opinion: '', qty: 1, remark: '' },
  rows: []
})

const STOCK_LOG = [
  { time: '2026-11-19 10:20:00', type: '补充库存', qty: '+20', batchNo: 'YS20261120A', operator: '演示经营企业甲' },
  { time: '2026-11-19 16:05:00', type: '库存调整', qty: '-2', batchNo: 'YS20261120A', operator: '演示经营企业甲' }
]

const ALERT_ROWS = [
  { type: '上报信息异常', subject: '演示经营企业甲', detail: '进货数据 3 条待核' },
  { type: '备案信息异常', subject: '演示经营企业甲', detail: '证件材料加载失败' }
]

export function openDemoFill(title, options = {}) {
  const kind = options.kind || 'confirm'
  demoFill.title = title || '写操作'
  demoFill.kind = kind
  demoFill.message = options.message || '演示环境不调用真实接口，确认后仅作讲解。'
  demoFill.form = {
    old: '',
    now: '',
    confirm: '',
    result: '通过',
    opinion: '',
    qty: 1,
    remark: '',
    ...(options.form || {})
  }
  demoFill.rows = options.rows || (kind === 'stockLog' ? STOCK_LOG : kind === 'alert' ? ALERT_ROWS : [])
  demoFill.visible = true
}

export function closeDemoFill() {
  demoFill.visible = false
}

export function confirmDemoFill() {
  demoFill.visible = false
  ElMessage.info('演示环境未执行该操作')
}

/** 兼容原调用：无标题时打开「写操作」确认框。 */
export function demoWrite(arg) {
  const title = typeof arg === 'string' ? arg : (arg && arg.label) || '写操作'
  const kind = title === '审核' ? 'audit' : (title.includes('密码') ? 'password' : 'confirm')
  openDemoFill(title, { kind })
}

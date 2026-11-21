// 监管端已观察页面配置。只收录观察记录里写明的筛选、列和操作，未写明的字段不编造。

const DEMO_NOTE = '演示数据仅用于撑起列表/详情骨架，不是原系统导出。'

const AUDIT_FILTERS = [
  { key: 'name', label: '经营企业名称' },
  { key: 'legal', label: '法人姓名' },
  { key: 'license', label: '农药经营许可证号' },
  { key: 'phone', label: '联系方式' },
  { key: 'account', label: '账号名称' },
  { key: 'accountStatus', label: '账号状态', type: 'select', options: ['已启用'] },
  { key: 'source', label: '数据来源', type: 'select', options: ['省平台'] },
  { key: 'area', label: '所在区域' },
  { key: 'bizType', label: '审核业务类型', type: 'select', options: ['新用户', '信息修改'] },
  { key: 'audit', label: '审核状态', type: 'select', options: ['待审核', '审核通过', '审核未通过'] },
  { key: 'created', label: '创建时间', type: 'daterange' }
]

const AUDIT_COLUMNS = [
  { prop: 'created', label: '创建时间', width: 160 },
  { prop: 'name', label: '经营企业名称', width: 160 },
  { prop: 'uscc', label: '统一社会信用代码', width: 180 },
  { prop: 'license', label: '农药经营许可证号', width: 160 },
  { prop: 'legal', label: '法人姓名', width: 100 },
  { prop: 'account', label: '账号名称', width: 120 },
  { prop: 'phone', label: '联系方式', width: 120 },
  { prop: 'area', label: '所在区域', width: 140 },
  { prop: 'accountStatus', label: '账号状态', width: 100 },
  { prop: 'bizType', label: '审核业务类型', width: 120 },
  { prop: 'audit', label: '审核状态', width: 100 },
  { prop: 'source', label: '数据来源', width: 100 }
]

const AUDIT_RETAILER_ROWS = [
  { id: 'demo-a1', created: '2026-11-02 09:10:00', name: '演示经营企业甲', uscc: '—', license: '—', legal: '演示法人甲', account: 'demo_shop_a', phone: '—', area: '演示区县A', accountStatus: '已启用', bizType: '新用户', audit: '待审核', source: '省平台' },
  { id: 'demo-a2', created: '2026-11-08 14:20:00', name: '演示经营企业乙', uscc: '—', license: '—', legal: '演示法人乙', account: 'demo_shop_b', phone: '—', area: '演示区县B', accountStatus: '已启用', bizType: '新用户', audit: '审核通过', source: '省平台' },
  { id: 'demo-a3', created: '2026-11-15 11:05:00', name: '演示经营企业丙', uscc: '—', license: '—', legal: '演示法人丙', account: 'demo_shop_c', phone: '—', area: '演示区县A', accountStatus: '已启用', bizType: '信息修改', audit: '待审核', source: '省平台' },
  { id: 'demo-a4', created: '2026-11-16 11:05:00', name: '演示经营企业丁', uscc: '—', license: '—', legal: '演示法人丁', account: 'demo_shop_d', phone: '—', area: '演示区县C', accountStatus: '已启用', bizType: '新用户', audit: '审核未通过', source: '省平台' }
]

const AUDIT_WHOLESALER_ROWS = [
  { id: 'demo-w1', created: '2026-11-03 10:12:00', name: '演示批发企业甲', uscc: '—', license: '—', legal: '演示法人戊', account: 'demo_whole_a', phone: '—', area: '演示区县A', accountStatus: '已启用', bizType: '新用户', audit: '待审核', source: '省平台' },
  { id: 'demo-w2', created: '2026-11-09 16:40:00', name: '演示批发企业乙', uscc: '—', license: '—', legal: '演示法人己', account: 'demo_whole_b', phone: '—', area: '演示区县B', accountStatus: '已启用', bizType: '信息修改', audit: '审核通过', source: '省平台' },
  { id: 'demo-w3', created: '2026-11-14 08:30:00', name: '演示批发企业丙', uscc: '—', license: '—', legal: '演示法人庚', account: 'demo_whole_c', phone: '—', area: '演示区县C', accountStatus: '已启用', bizType: '新用户', audit: '审核未通过', source: '省平台' }
]

export const PES_LIST_PAGES = {
  'production-enterprise': {
    title: '生产企业信息',
    observedRoute: '#/produceMassage/manufacture',
    evidence: 'OBSERVED',
    evidenceLabel: '列表与详情页签已观察，列名已按截图补全',
    note: '筛选可见账户状态「已启用」，列表「账户状态」单元格可见「正常」（用词按现网两处原文）。详情五页签已进入。添加、停用、编辑信息、重设密码只留入口。' + DEMO_NOTE,
    filters: [
      { key: 'keyword', label: '搜索', placeholder: '请输入搜索内容' },
      { key: 'accountStatus', label: '账户状态', type: 'select', options: ['已启用'], matchValues: { '已启用': ['已启用', '正常'] } }
    ],
    columns: [
      { prop: 'index', label: '序号', type: 'index', width: 60 },
      { prop: 'created', label: '创建时间', width: 160 },
      { prop: 'name', label: '企业名称', width: 160 },
      { prop: 'license', label: '农药生产许可证号', width: 160 },
      { prop: 'uscc', label: '统一社会信用代码', width: 180 },
      { prop: 'legal', label: '法人代表（负责人）', width: 140 },
      { prop: 'contact', label: '联系人姓名', width: 110 },
      { prop: 'phone', label: '联系人手机', width: 120 },
      { prop: 'area', label: '生产场所在区域', width: 140 },
      { prop: 'address', label: '详细地址', width: 180 },
      { prop: 'accountStatus', label: '账户状态', width: 100 }
    ],
    actions: ['查看详情', '停用'],
    writeActions: ['停用'],
    toolbar: [
      { label: '添加生产企业', primary: true, write: true },
      { label: '停用', write: true }
    ],
    rows: [
      { id: 'demo-m1', created: '2026-03-12 09:10:00', name: '演示生产企业甲', license: '演示-XK-0001', uscc: '—', legal: '演示负责人甲', contact: '演示联系人甲', phone: '—', area: '演示区县A', address: '演示地址甲', accountStatus: '正常' },
      { id: 'demo-m2', created: '2026-06-08 14:20:00', name: '演示生产企业乙', license: '演示-XK-0002', uscc: '—', legal: '演示负责人乙', contact: '演示联系人乙', phone: '—', area: '演示区县B', address: '演示地址乙', accountStatus: '正常' }
    ],
    detailRoute: true,
    footer: '演示 2 条，非正式导出。筛选「已启用」与列表值「正常」按现网两处原文保留。'
  },
  'production-registration': {
    title: '产品登记信息',
    observedRoute: '#/produceMassage/productRegistration',
    evidence: 'OBSERVED',
    evidenceLabel: '列表页已观察，行上无查看详情，列名已按截图补全',
    note: '已观察到搜索/重置和大列表。行上没有「查看详情」，不增加操作列。' + DEMO_NOTE,
    filters: [{ key: 'keyword', label: '搜索', placeholder: '请输入搜索内容' }],
    columns: [
      { prop: 'index', label: '序号', type: 'index', width: 60 },
      { prop: 'regNo', label: '登记证号', width: 150 },
      { prop: 'category', label: '农药类别', width: 100 },
      { prop: 'form', label: '剂型', width: 90 },
      { prop: 'name', label: '农药名称', width: 140 },
      { prop: 'totalContent', label: '总含量', width: 90 },
      { prop: 'ingredient', label: '有效成分及含量', width: 150 },
      { prop: 'toxicity', label: '毒性', width: 90 },
      { prop: 'dosage', label: '用药量', width: 90 },
      { prop: 'validUntil', label: '有效时间', width: 120 },
      { prop: 'holder', label: '登记持有人', width: 150 }
    ],
    actions: [],
    toolbar: [],
    rows: [
      { id: 'demo-r1', regNo: '演示-PD2017-0001', category: '杀虫剂', form: '乳油', name: '演示农药甲', totalContent: '—', ingredient: '—', toxicity: '—', dosage: '—', validUntil: '—', holder: '演示持有人A' },
      { id: 'demo-r2', regNo: '演示-PD2018-0002', category: '除草剂', form: '水剂', name: '演示农药乙', totalContent: '—', ingredient: '—', toxicity: '—', dosage: '—', validUntil: '—', holder: '演示持有人B' },
      { id: 'demo-r3', regNo: '演示-PD2019-0003', category: '杀菌剂', form: '可湿性粉剂', name: '演示农药丙', totalContent: '—', ingredient: '—', toxicity: '—', dosage: '—', validUntil: '—', holder: '演示持有人A' }
    ],
    footer: '演示 3 条，非正式导出。行上无查看详情。'
  },
  'production-monthly': {
    title: '月报管理',
    observedRoute: '#/produceMassage/monthlyMagazine',
    evidence: 'OBSERVED',
    evidenceLabel: '列表与页头说明已观察，列名已按截图补全',
    note: '系统每月1号将自动创建下月上报任务。手动添加上报任务和行内「管理」只留入口，不编表单结果。',
    banner: '系统每月1号将自动创建下月上报任务',
    filters: [],
    columns: [
      { prop: 'index', label: '序号', type: 'index', width: 60 },
      { prop: 'created', label: '创建时间', width: 160 },
      { prop: 'name', label: '任务名称', width: 220 },
      { prop: 'reportTime', label: '上报时间', width: 200 },
      { prop: 'enterpriseCount', label: '上报企业数量', width: 120 }
    ],
    actions: ['管理'],
    toolbar: [{ label: '手动添加上报任务', primary: true, write: true }],
    rows: [
      { id: 'demo-mon-1', created: '2026-10-01 00:00:00', name: '演示2026年11月上报任务', reportTime: '2026-11-01 至 2026-11-30', enterpriseCount: '—' },
      { id: 'demo-mon-2', created: '2026-11-01 00:00:00', name: '演示2026年12月上报任务', reportTime: '2026-12-01 至 2026-12-31', enterpriseCount: '—' }
    ],
    footer: '演示 2 条。手动添加与行内「管理」只留入口，不编任务表单结果。'
  },
  'operation-enterprise': {
    title: '经营企业信息',
    observedRoute: '#/businessInformation/businessEnterprise',
    evidence: 'OBSERVED',
    evidenceLabel: '零售/批发、上报芯片、限制性销售与详情页签已观察，列名已按截图补全',
    note: '可切零售商/批发商页签；芯片为「全部零售商/批发商N家」「只看已上报的N家」「只看未上报的N家」。限制性农药销售列为「已关闭」加「开启」，或「已开启」加「关闭」，点击只留入口、不改状态。列表账号状态为「正常」，详情账号状态为「已启用」。上报台账表头带橙色标记。详情为页内弹窗：基本信息 / 登记农药 / 进货明细 / 销售明细。进货明细跳转产品进货信息并带入主体筛选。导出、开启/关闭限制性销售、审核/重设密码/锁定账号只留入口。' + DEMO_NOTE,
    roleSwitch: ['零售商', '批发商'],
    chips: ['全部', '已上报', '未上报'],
    filters: [],
    columns: [
      { prop: 'index', label: '序号', type: 'index', width: 60 },
      { prop: 'name', label: '经营企业名称', width: 150 },
      { prop: 'uscc', label: '统一社会信用代码', width: 180 },
      { prop: 'license', label: '农药经营许可证号', width: 160 },
      { prop: 'legal', label: '法人姓名', width: 100 },
      { prop: 'account', label: '账号名称', width: 120 },
      { prop: 'phone', label: '联系方式', width: 120 },
      { prop: 'area', label: '所在区域', width: 140 },
      { prop: 'restrictSale', label: '限制性农药销售', width: 150, restrictToggle: true },
      { prop: 'accountStatus', label: '账号状态', width: 100 },
      { prop: 'source', label: '数据来源', width: 100 },
      { prop: 'reportLedger', label: '上报台账（条）', width: 130, headerClass: 'header-orange' },
      { prop: 'inbound', label: '进货量（吨）', width: 110 },
      { prop: 'sold', label: '销售量（吨）', width: 110 },
      { prop: 'stock', label: '库存量（吨）', width: 110 }
    ],
    actions: ['查看详情'],
    toolbar: [{ label: '导出', write: true }],
    rows: [
      { id: 'demo-e1', role: '零售商', report: '已上报', name: '演示经营企业甲', uscc: '—', license: '—', legal: '演示法人甲', account: 'demo_shop_a', phone: '—', area: '演示区县A', restrictSale: '已关闭', accountStatus: '正常', accountEnabled: '已启用', source: '省平台', reportLedger: '12', inbound: '0.50', sold: '0.20', stock: '0.30', registeredAt: '2024-03-12 10:20:00', auditStatus: '审核通过', remark: '-', address: '—', licenseValid: '—' },
      { id: 'demo-e2', role: '零售商', report: '未上报', name: '演示经营企业乙', uscc: '—', license: '—', legal: '演示法人乙', account: 'demo_shop_b', phone: '—', area: '演示区县B', restrictSale: '已关闭', accountStatus: '正常', accountEnabled: '已启用', source: '省平台', reportLedger: '—', inbound: '—', sold: '—', stock: '—', registeredAt: '2025-01-08 09:00:00', auditStatus: '审核通过', remark: '-', address: '—', licenseValid: '—' },
      { id: 'demo-e4', role: '零售商', report: '已上报', name: '演示经营企业丙', uscc: '—', license: '—', legal: '演示法人丙', account: 'demo_shop_c', phone: '—', area: '演示区县A', restrictSale: '已关闭', accountStatus: '正常', accountEnabled: '已启用', source: '第三方', reportLedger: '6', inbound: '0.10', sold: '0.04', stock: '0.06', registeredAt: '2024-11-02 14:10:00', auditStatus: '审核通过', remark: '-', address: '—', licenseValid: '—' },
      { id: 'demo-e3', role: '批发商', report: '已上报', name: '演示批发企业甲', uscc: '—', license: '—', legal: '演示法人戊', account: 'demo_whole_a', phone: '—', area: '演示区县A', restrictSale: '已关闭', accountStatus: '正常', accountEnabled: '已启用', source: '省平台', reportLedger: '8', inbound: '1.20', sold: '0.60', stock: '0.60', registeredAt: '2023-06-01 11:00:00', auditStatus: '审核通过', remark: '-', address: '—', licenseValid: '—' },
      { id: 'demo-e5', role: '批发商', report: '未上报', name: '演示批发企业乙', uscc: '—', license: '—', legal: '演示法人己', account: 'demo_whole_b', phone: '—', area: '演示区县B', restrictSale: '已开启', accountStatus: '正常', accountEnabled: '已启用', source: '省平台', reportLedger: '—', inbound: '—', sold: '—', stock: '—', registeredAt: '2025-04-18 16:40:00', auditStatus: '审核通过', remark: '-', address: '—', licenseValid: '—' }
    ],
    footer: '演示数据，非正式导出。开启限制性销售只留入口。'
  },
  'operation-pesticide': {
    title: '经营农药信息',
    observedRoute: '#/businessInformation/pesticideInfo',
    evidence: 'OBSERVED',
    evidenceLabel: '筛选、列表、农药追溯弹窗及交易明细跳转已观察',
    note: '默认为昨日可空态；最近15天并搜索后展示演示行。页签为「零售商登记的农药」「批发商登记的农药」带数量。行操作：农药追溯（页内弹窗，含来源/去向、查看买家、交易明细跳转进货列表）、登记经营户（内页未打开，只留入口）。导出只留入口。' + DEMO_NOTE,
    typeCounts: { retail: '—', wholesale: '—' },
    filters: [
      { key: 'regNo', label: '登记证号', placeholder: '请输入登记证号' },
      { key: 'commonName', label: '农药通用名' },
      { key: 'holder', label: '登记证持有人' },
      { key: 'area', label: '所在区域' },
      { key: 'restricted', label: '限制性农药', type: 'select', options: ['是', '否'] },
      { key: 'regStatus', label: '登记状态', type: 'select', options: [], placeholder: '选项待观察' },
      { key: 'tradeTime', label: '统计交易时间', type: 'select', options: ['昨日', '最近15天', '最近30天', '本月', '近三个月', '本年度'] },
      { key: 'range', label: '起止时间', type: 'daterange' }
    ],
    columns: [
      { prop: 'regNo', label: '登记证号', width: 140 },
      { prop: 'commonName', label: '农药通用名', width: 140 },
      { prop: 'holder', label: '登记证持有人', width: 160 },
      { prop: 'restricted', label: '限制性农药', width: 100 },
      { prop: 'inbound', label: '进货量（吨）', width: 110 },
      { prop: 'sold', label: '销售量（吨）', width: 110 },
      { prop: 'stock', label: '库存量（吨）', width: 110 },
      { prop: 'dealers', label: '登记经营户（家）', width: 130 }
    ],
    actions: ['农药追溯', '登记经营户'],
    toolbar: [{ label: '导出', write: true }],
    rows: [
      { id: 'demo-1', side: '零售商', regNo: '演示-PD2017-0001', commonName: '演示通用名甲', holder: '演示持有人A', restricted: '否', inbound: '0.02', sold: '0.01', stock: '0.01', dealers: '1' },
      { id: 'demo-2', side: '零售商', regNo: '演示-PD2018-0002', commonName: '演示通用名乙', holder: '演示持有人B', restricted: '是', inbound: '0', sold: '0', stock: '0.01', dealers: '1' },
      { id: 'demo-3', side: '零售商', regNo: '演示-PD2019-0003', commonName: '演示通用名丙', holder: '演示持有人A', restricted: '否', inbound: '0.04', sold: '0.02', stock: '0.02', dealers: '2' },
      { id: 'demo-5', side: '批发商', regNo: '演示-PD2017-0001', commonName: '演示通用名甲', holder: '演示持有人A', restricted: '否', inbound: '0.10', sold: '0.04', stock: '0.06', dealers: '1' },
      { id: 'demo-4', side: '批发商', regNo: '演示-PD2020-0004', commonName: '演示通用名丁', holder: '演示持有人C', restricted: '是', inbound: '0.03', sold: '0.01', stock: '0.02', dealers: '1' }
    ],
    footer: '演示数据，非正式导出。登记经营户内页未观察，只留入口。'
  },
  'operation-purchase': {
    title: '产品进货信息',
    observedRoute: '#/businessInformation/productWareOrOutbound/type=1',
    type: 1,
    evidence: 'OBSERVED',
    evidenceLabel: '空态表头与预警下钻为同一套列，已按截图补全',
    note: '空态表头和预警下钻用同一套列。可见筛选含产品名称、登记证号、农药类别、是否限制性农药、是否预售数据、经营企业名称、农药经营许可证、供应商名称、数据来源、统计时间、所在区域；页签零售商/批发商。登记证号、进货企业、供应商名称为文字链（点击只留入口）。预警图标、数量异常标记叠在「进货（入库）数量」单元格上。导出只留入口。' + DEMO_NOTE,
    filters: [],
    columns: [
      { prop: 'index', label: '序号', type: 'index', width: 60 },
      { prop: 'product', label: '产品名称', width: 140 },
      { prop: 'regNo', label: '登记证号', width: 150, link: true },
      { prop: 'category', label: '农药类别', width: 100 },
      { prop: 'nature', label: '产品性质', width: 100 },
      { prop: 'restricted', label: '是否限制性农药', width: 130 },
      { prop: 'time', label: '进货（入库）时间', width: 160 },
      { prop: 'qty', label: '进货（入库）数量', width: 160, alertMark: true },
      { prop: 'spec', label: '产品规格', width: 100 },
      { prop: 'enterprise', label: '进货（入库）企业', width: 160, link: true },
      { prop: 'area', label: '所在区域', width: 140 },
      { prop: 'supplier', label: '供应商名称', width: 140, link: true },
      { prop: 'source', label: '数据来源', width: 100 }
    ],
    actions: [],
    toolbar: [{ label: '导出', write: true }],
    rows: [
      { id: 'demo-in-n1', product: '演示农药甲', regNo: '演示-PD2017-0001', category: '杀虫剂', nature: '制剂', restricted: '否', time: '2026-11-08 09:20:00', qty: '10', spec: '瓶', enterprise: '演示经营企业甲', area: '演示区县A', supplier: '演示供应商甲', source: '省平台', side: '零售' },
      { id: 'demo-in-n3', product: '演示农药丙', regNo: '演示-PD2019-0003', category: '杀菌剂', nature: '制剂', restricted: '否', time: '2026-11-12 11:10:00', qty: '8', spec: '袋', enterprise: '演示经营企业甲', area: '演示区县A', supplier: '演示供应商甲', source: '省平台', side: '零售' },
      { id: 'demo-in-n2', product: '演示农药乙', regNo: '演示-PD2018-0002', category: '除草剂', nature: '制剂', restricted: '是', time: '2026-11-10 15:40:00', qty: '20', spec: '袋', enterprise: '演示批发企业甲', area: '演示区县A', supplier: '演示供应商乙', source: '省平台', side: '批发' }
    ],
    alertRows: [
      { id: 'demo-in-1', product: '演示农药甲', regNo: '演示-PD2017-0001', category: '杀虫剂', nature: '制剂', restricted: '否', time: '2026-11-08 09:20:00', qty: '—', spec: '瓶', enterprise: '演示经营企业甲', area: '演示区县A', supplier: '演示供应商甲', source: '省平台', isAlert: '是', qtyFlag: '数量异常', side: '零售' },
      { id: 'demo-in-2', product: '演示农药乙', regNo: '演示-PD2018-0002', category: '除草剂', nature: '制剂', restricted: '是', time: '2026-11-10 15:40:00', qty: '—', spec: '袋', enterprise: '演示批发企业甲', area: '演示区县A', supplier: '演示供应商乙', source: '省平台', isAlert: '是', qtyFlag: '数量异常', side: '批发' }
    ],
    footer: '空态与预警下钻为同一套表头。演示数据，非正式导出。'
  },
  'operation-sale': {
    title: '产品销售信息',
    observedRoute: '#/businessInformation/productWareOrOutbound/type=2',
    type: 2,
    evidence: 'OBSERVED',
    evidenceLabel: '空态表头与预警下钻为同一套列，已按截图补全',
    note: '与进货同一套表头，仅将「进货（入库）」换成「销售（出库）」，「供应商名称」换成「购买人名称」。预警图标、数量异常标记叠在「销售（出库）数量」单元格上。导出只留入口。' + DEMO_NOTE,
    filters: [],
    columns: [
      { prop: 'index', label: '序号', type: 'index', width: 60 },
      { prop: 'product', label: '产品名称', width: 140 },
      { prop: 'regNo', label: '登记证号', width: 150 },
      { prop: 'category', label: '农药类别', width: 100 },
      { prop: 'nature', label: '产品性质', width: 100 },
      { prop: 'restricted', label: '是否限制性农药', width: 130 },
      { prop: 'time', label: '销售（出库）时间', width: 160 },
      { prop: 'qty', label: '销售（出库）数量', width: 160, alertMark: true },
      { prop: 'spec', label: '产品规格', width: 100 },
      { prop: 'enterprise', label: '销售（出库）企业', width: 160 },
      { prop: 'area', label: '所在区域', width: 140 },
      { prop: 'buyer', label: '购买人名称', width: 140 },
      { prop: 'source', label: '数据来源', width: 100 }
    ],
    actions: [],
    toolbar: [{ label: '导出', write: true }],
    rows: [
      { id: 'demo-out-n1', product: '演示农药甲', regNo: '演示-PD2017-0001', category: '杀虫剂', nature: '制剂', restricted: '否', time: '2026-11-11 10:00:00', qty: '—', spec: '瓶', enterprise: '演示经营企业甲', area: '演示区县A', buyer: '演示购买人甲', source: '省平台', side: '零售' },
      { id: 'demo-out-n2', product: '演示农药乙', regNo: '演示-PD2018-0002', category: '除草剂', nature: '制剂', restricted: '是', time: '2026-11-12 16:30:00', qty: '—', spec: '袋', enterprise: '演示批发企业甲', area: '演示区县A', buyer: '演示购买人乙', source: '省平台', side: '批发' }
    ],
    alertRows: [
      { id: 'demo-out-1', product: '演示农药甲', regNo: '演示-PD2017-0001', category: '杀虫剂', nature: '制剂', restricted: '否', time: '2026-11-11 10:00:00', qty: '—', spec: '瓶', enterprise: '演示经营企业甲', area: '演示区县A', buyer: '演示购买人甲', source: '省平台', isAlert: '是', qtyFlag: '数量异常', side: '零售' },
      { id: 'demo-out-2', product: '演示农药乙', regNo: '演示-PD2018-0002', category: '除草剂', nature: '制剂', restricted: '是', time: '2026-11-12 16:30:00', qty: '—', spec: '袋', enterprise: '演示批发企业甲', area: '演示区县A', buyer: '演示购买人乙', source: '省平台', isAlert: '是', qtyFlag: '数量异常', side: '批发' }
    ],
    footer: '空态与预警下钻为同一套表头。演示数据，非正式导出。'
  },
  'usage-subject': {
    title: '使用主体信息',
    observedRoute: '#/usageInfo/mainPart',
    evidence: 'OBSERVED',
    evidenceLabel: '筛选、列表和只读详情已观察',
    note: '默认可见「审核通过 / 已启用」。详情可见上报次数、主体类型「企业 / 种植户」。审核 / 重设密码 / 锁定账号只留入口。' + DEMO_NOTE,
    filters: [
      { key: 'name', label: '使用主体名称' },
      { key: 'contact', label: '联系人' },
      { key: 'phone', label: '联系方式' },
      { key: 'account', label: '账号名称' },
      { key: 'audit', label: '审核状态', type: 'select', options: ['审核通过', '待审核', '审核未通过'] },
      { key: 'accountStatus', label: '账号状态', type: 'select', options: ['已启用'] }
    ],
    columns: [
      { prop: 'name', label: '使用主体名称', width: 160 },
      { prop: 'contact', label: '联系人', width: 100 },
      { prop: 'phone', label: '联系方式', width: 120 },
      { prop: 'account', label: '账号名称', width: 120 },
      { prop: 'region', label: '所在地', width: 140 },
      { prop: 'address', label: '详细地址', width: 180 },
      { prop: 'audit', label: '审核状态', width: 100 },
      { prop: 'accountStatus', label: '账号状态', width: 100 }
    ],
    actions: ['查看详情'],
    defaultFilters: { audit: '审核通过', accountStatus: '已启用' },
    rows: [
      { id: 'demo-u1', name: '演示使用主体甲', contact: '演示联系人甲', phone: '—', account: 'demo_user_a', region: '演示区县A', address: '演示地址甲', audit: '审核通过', accountStatus: '已启用', reportCount: 0, subjectType: '种植户' },
      { id: 'demo-u2', name: '演示使用主体乙', contact: '演示联系人乙', phone: '—', account: 'demo_user_b', region: '演示区县B', address: '演示地址乙', audit: '审核通过', accountStatus: '已启用', reportCount: '—', subjectType: '企业' },
      { id: 'demo-u3', name: '演示使用主体丙', contact: '演示联系人丙', phone: '—', account: 'demo_user_c', region: '演示区县A', address: '演示地址丙', audit: '待审核', accountStatus: '已启用', reportCount: 0, subjectType: '种植户' },
      { id: 'demo-u4', name: '演示使用主体丁', contact: '演示联系人丁', phone: '—', account: 'demo_user_d', region: '演示区县C', address: '演示地址丁', audit: '审核未通过', accountStatus: '已启用', reportCount: 0, subjectType: '企业' }
    ],
    footer: '演示 4 条，非正式导出。'
  },
  'usage-product': {
    title: '产品使用信息',
    observedRoute: '#/usageInfo/product',
    evidence: 'OBSERVED',
    evidenceLabel: '列表已观察：登记证号、使用主体为链接',
    note: '登记证号、使用主体是链接；没有单独的「查看详情」按钮。其余列名未逐项登记，不编造。导出只留入口。',
    filters: [],
    columns: [
      { prop: 'regNo', label: '登记证号', width: 160, link: 'regNo' },
      { prop: 'subject', label: '使用主体', width: 180, link: 'subject' }
    ],
    actions: [],
    toolbar: [{ label: '导出', write: true }],
    rows: [
      { id: 'demo-up1', regNo: '演示-PD2017-0001', subject: '演示使用主体甲', subjectId: 'demo-u1' },
      { id: 'demo-up2', regNo: '演示-PD2018-0002', subject: '演示使用主体乙', subjectId: 'demo-u2' }
    ],
    footer: '仅展示观察记录写明的两列链接。演示 2 条。'
  },
  'audit-retailer': {
    title: '零售商审核',
    observedRoute: '#/auditInforma/dealerOrRetailers/type=1',
    auditType: 1,
    evidence: 'OBSERVED',
    evidenceLabel: '筛选、列表、页签和审核信息详情已观察',
    note: '待审核行是「查看」和「审核」两个按钮，不是「查看审核」。详情可见账号/主体信息、证件未上传空态、平台名称。导出、审核、重设密码只留入口。' + DEMO_NOTE,
    filters: AUDIT_FILTERS,
    columns: AUDIT_COLUMNS,
    tabs: ['待审核', '审核通过', '审核未通过'],
    searchTone: 'blue',
    toolbar: [{ label: '导出', tone: 'yellow', write: true }],
    rows: AUDIT_RETAILER_ROWS,
    showPlatformName: true,
    footer: '演示数据，非正式导出。'
  },
  'audit-wholesaler': {
    title: '批发商审核',
    observedRoute: '#/auditInforma/dealerOrRetailers/type=2',
    auditType: 2,
    evidence: 'OBSERVED',
    evidenceLabel: '与零售商审核同一套界面，详情已进',
    note: '与零售商审核同一套界面（type=2）。待审核行同样是「查看」+「审核」。详情未见「平台名称」。导出、审核、重设密码只留入口。' + DEMO_NOTE,
    filters: AUDIT_FILTERS,
    columns: AUDIT_COLUMNS,
    tabs: ['待审核', '审核通过', '审核未通过'],
    searchTone: 'blue',
    toolbar: [{ label: '导出', tone: 'yellow', write: true }],
    rows: AUDIT_WHOLESALER_ROWS,
    showPlatformName: false,
    footer: '演示数据，非正式导出。批发商详情不展示平台名称。'
  }
}

export const PES_STATS_PAGES = [
  { key: 'production', title: '生产统计', route: '/pes/stats/production', observedRoute: '#/statistical/production' },
  { key: 'trade', title: '农药交易统计', route: '/pes/stats/trade', observedRoute: '#/statistical/business/business' },
  { key: 'operator-report', title: '经营户上报统计', route: '/pes/stats/operator-report', observedRoute: '#/statistical/business/reportStatistics' },
  { key: 'country-report', title: '经营户上报（国家平台）', route: '/pes/stats/country-report', observedRoute: '#/statistical/business/countryReport' },
  { key: 'crops', title: '施用作物统计', route: '/pes/stats/crops', observedRoute: '#/statistical/business/applyingCropStatistics' },
  { key: 'usage', title: '使用统计', route: '/pes/stats/usage', observedRoute: '#/statistical/usage' },
  { key: 'restricted', title: '限制性农药统计', route: '/pes/stats/restricted', observedRoute: '#/statistical/pesticideStatistics' }
]

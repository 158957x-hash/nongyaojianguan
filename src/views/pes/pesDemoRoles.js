// 农药演示账号文案。不改动粮食子系统沿用的 DEMO_ROLES 真实区划名。
export const PES_DEMO_ACCOUNTS = [
  { code: 'province', title: '省级监管', unit: '演示省农业农村厅', region: '演示省', home: '/pes/home', note: '现网一级菜单保持不变，切换的是演示身份。' },
  { code: 'city', title: '市级监管', unit: '演示市A农业农村局', region: '演示市A', home: '/pes/home', note: '数据范围按演示市A讲述，现网菜单与省级一致。' },
  { code: 'county', title: '县级监管', unit: '演示区县A农业农村局', region: '演示区县A', home: '/pes/home', note: '数据范围按演示区县A讲述，现网菜单与省级一致。' },
  { code: 'pes_producer', title: '生产企业', unit: '演示生产企业甲', region: '演示市A', home: '/pes/producer/ledger', note: '进入生产填报端，不在监管侧栏里打开。' },
  { code: 'pes_operator', title: '经营企业', unit: '演示经营企业甲', region: '演示区县A', home: '/pes/retail/cashier', note: '进入零售经营端。' },
  { code: 'pes_recycler', title: '回收主体', unit: '演示回收站甲', region: '演示市A', home: '/pes/recycle', note: '可在监管端登记包装废弃物回收。' }
]

export function pesDemoAccount(code) {
  return PES_DEMO_ACCOUNTS.find((a) => a.code === code)
}

export function pesDemoLabel(code) {
  const item = pesDemoAccount(code)
  return item ? item.title : '演示账号'
}

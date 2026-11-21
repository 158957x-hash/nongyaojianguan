export const DEMO_STORE = '演示门店'

export const CASHIER_CATEGORIES = [
  { key: 'all-p', label: '全部农药', count: 6, color: '#31B854', group: 'p' },
  { key: 'herb', label: '除草剂', count: 2, color: '#31B854', group: 'p' },
  { key: 'insect', label: '杀虫剂', count: 3, color: '#E38AA8', group: 'p' },
  { key: 'fungi', label: '杀菌剂', count: 1, color: '#4A5560', group: 'p' },
  { key: 'reg', label: '调节剂', count: 0, color: '#E67A1A', group: 'p' },
  { key: 'other', label: '其他', count: 0, color: '#909399', group: 'p' },
  { key: 'seed', label: '全部种子', count: 1, color: '#31B854', group: 's' },
  { key: 'fert', label: '全部肥料', count: 0, color: '#31B854', group: 'f' }
]

export const GOODS = [
  { id: 'g1', kind: '农药', category: 'insect', name: '演示通用名甲', maker: '演示生产企业甲', spec: '瓶', stock: 86, stockText: '剩余86', price: 20, restricted: true, ingredient: '—', form: '—', status: '出售中', sold: '—' },
  { id: 'g2', kind: '农药', category: 'insect', name: '演示通用名乙', maker: '演示生产企业乙', spec: '瓶', stock: 86, stockText: '剩余86', price: 20, restricted: true, ingredient: '—', form: '—', status: '出售中', sold: '—' },
  { id: 'g3', kind: '农药', category: 'insect', name: '演示通用名戊', maker: '演示生产企业乙', spec: '瓶', packSpec: '200克/瓶', stock: 86, stockText: '剩余86', price: 10, restricted: false, ingredient: '—', form: '—', status: '出售中', sold: '—' },
  { id: 'g4', kind: '农药', category: 'herb', name: '演示通用名丙', maker: '演示生产企业甲', spec: '袋', packSpec: '20克/袋', stock: 1200, stockText: '剩余999+', price: 20, restricted: false, ingredient: '—', form: '—', status: '出售中', sold: '—' },
  { id: 'g5', kind: '农药', category: 'herb', name: '演示通用名己', maker: '演示生产企业甲', spec: '袋', packSpec: '20克/袋', stock: 100, stockText: '剩余100', price: 20, restricted: false, ingredient: '—', form: '—', status: '出售中', sold: '—' },
  { id: 'g6', kind: '农药', category: 'fungi', name: '演示通用名丁', maker: '演示生产企业丙', spec: '袋', packSpec: '50克/袋', stock: 40, stockText: '剩余40', price: 20, restricted: false, ingredient: '—', form: '—', status: '出售中', sold: '—' },
  { id: 'g7', kind: '农药', category: 'fungi', name: '演示通用名庚', maker: '演示生产企业丙', spec: '袋', stock: 0, stockText: '剩余0', price: 20, restricted: false, ingredient: '—', form: '—', status: '已下架(无库存)', sold: '—', hideOnShelf: true },
  { id: 'g8', kind: '种子', category: 'seed', name: '演示种子甲', maker: '演示生产企业丁', spec: '袋', stock: 40, stockText: '剩余40', price: 18, restricted: false, ingredient: '—', form: '—', status: '出售中', sold: '—' }
]

export const MEMBERS = [
  { id: 'm1', name: '演示会员甲', phone: '—', area: '演示区县A', orders: '—', amount: '—', credit: '—' },
  { id: 'm2', name: '演示会员乙', phone: '—', area: '演示区县B', orders: '—', amount: '—', credit: '—' }
]

export const SUPPLIERS = [
  { id: 's1', name: '演示供应商甲', contact: '演示联系人甲', phone: '—', area: '演示区县A', orders: '—', amount: '—' },
  { id: 's2', name: '演示供应商乙', contact: '演示联系人乙', phone: '—', area: '演示区县B', orders: '—', amount: '—' }
]

export const INCOMING_ORDERS = [
  { id: 'io1', time: '2026-11-10 09:20:00', no: 'demo-in-001', type: '手动入库', total: '—', qty: '—', paid: '—', supplier: '演示供应商甲', phone: '—', report: '已上报' }
]

export const SALES_ORDERS = [
  { id: 'so1', time: '2026-11-11 10:00:00', no: 'demo-out-001', type: '正常销售', total: '—', qty: '—', received: '—', returned: '—', buyer: '演示会员甲', phone: '—', buyerType: '会员', idNo: '—', payWay: '—', discount: '—', receivable: '—', credit: '—', report: '已上报' },
  { id: 'so2', time: '2026-11-12 16:30:00', no: 'demo-out-002', type: '盘点报损', total: '0.00', qty: '—', received: '0.00', returned: '—', buyer: '—', phone: '—', buyerType: '散客', idNo: '—', payWay: '—', discount: '—', receivable: '0.00', credit: '—', report: '—' }
]

export const MORE_CARDS = [
  { key: 'goods', title: '商品管理', to: '/pes/retail/goodsManagement', desc: '新增，修改价格以及商品其他信息' },
  { key: 'member', title: '会员管理', to: '/pes/retail/memberManagement', desc: '新增，修改会员信息，查看会员赊款' },
  { key: 'supplier', title: '供应商管理', to: '/pes/retail/supplierManagement', desc: '新增，修改供应商信息，查看供货记录' },
  { key: 'inventory', title: '库存管理', to: '/pes/retail/inventoryManagement', desc: '查看商品剩余多少库存，提供调整库存功能' },
  { key: 'incoming', title: '采购入库单', to: '/pes/retail/incomingOrders', desc: '查看采购入库的单据记录与明细' },
  { key: 'sales', title: '销售出库单', to: '/pes/retail/salesDeliveryOrder', desc: '查看订单销售单据记录与明细，进行商品退货' },
  { key: 'pending', title: '待接收入库单', to: '/pes/retail/purchasing?currentType=2', desc: '查看省内批发商推送的销售单，支持销售单自动入库' },
  { key: 'store', title: '门店信息', to: '/pes/retail/storeInformation', desc: '查看，修改门店信息（修改信息需要通过监管部门审核后生效）' }
]

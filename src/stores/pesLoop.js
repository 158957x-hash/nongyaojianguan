import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

const STORAGE_KEY = 'pes_demo_loop_v1'

export const LOOP_PRODUCER = {
  id: 'DEMO-P-001',
  name: '演示生产企业甲',
  license: '演示-XK-0001',
  uscc: '91340000DEMO0001X',
  legal: '演示负责人甲',
  contact: '演示联系人甲',
  phone: '—',
  address: '演示区县A产业园',
  area: '演示区县A',
  scope: '杀虫剂、杀菌剂制剂'
}

export const LOOP_OPERATOR = {
  id: 'DEMO-S-001',
  name: '演示经营企业甲',
  license: '演示-JY-0001',
  area: '演示区县A'
}

export const LOOP_PRODUCT = {
  id: 'DEMO-PRD-001',
  name: '演示农药甲',
  regNo: '演示-PD2017-0001',
  category: '杀虫剂',
  form: '乳油',
  nature: '制剂',
  restricted: '否',
  trademark: '演示商标甲',
  spec: '瓶',
  packSpec: '200毫升/瓶',
  producerId: 'DEMO-P-001',
  producerName: '演示生产企业甲'
}

const HERO_BATCH = 'YS20261120A'

export const LOOP_RECYCLER = {
  id: 'DEMO-R-001', name: '演示回收站甲', license: '演示-HS-0001', area: '演示区县A'
}

// 仅用于地图点位，地名一律演示，不对应真实县区
export const LOOP_POINTS = {
  producer: { lng: 117.12, lat: 31.92 },
  operator: { lng: 117.18, lat: 31.89 },
  buyer: { lng: 117.22, lat: 31.86 },
  recycler: { lng: 117.15, lat: 31.88 }
}

export const LOOP_REGION = { province: '演示省', city: '演示市A', county: '演示区县A' }


function nowText(d = new Date()) {
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`
}

function seed() {
  return {
    profileConfirmed: true,
    products: [{ ...LOOP_PRODUCT }],
    batches: [
      {
        id: 'LOOP-BAT-001',
        batchNo: HERO_BATCH,
        productId: LOOP_PRODUCT.id,
        productName: LOOP_PRODUCT.name,
        regNo: LOOP_PRODUCT.regNo,
        trademark: LOOP_PRODUCT.trademark,
        category: LOOP_PRODUCT.category,
        produceDate: '2026-11-18',
        produceQty: 200,
        salesQty: 120,
        inventoryQty: 80,
        destination: LOOP_OPERATOR.name,
        unit: '瓶',
        qr: HERO_BATCH,
        status: '已提交',
        submitTime: '2026-11-18 16:20:00',
        producerId: LOOP_PRODUCER.id,
        producerName: LOOP_PRODUCER.name
      }
    ],
    inbounds: [
      {
        id: 'LOOP-IN-001',
        batchNo: HERO_BATCH,
        product: LOOP_PRODUCT.name,
        regNo: LOOP_PRODUCT.regNo,
        category: LOOP_PRODUCT.category,
        nature: LOOP_PRODUCT.nature,
        restricted: LOOP_PRODUCT.restricted,
        time: '2026-11-19 09:30:00',
        qty: '80',
        spec: LOOP_PRODUCT.spec,
        enterprise: LOOP_OPERATOR.name,
        area: LOOP_OPERATOR.area,
        supplier: LOOP_PRODUCER.name,
        source: '演示填报',
        side: '零售',
        scan: true
      }
    ],
    outbounds: [
      {
        id: 'LOOP-OUT-001',
        batchNo: HERO_BATCH,
        product: LOOP_PRODUCT.name,
        regNo: LOOP_PRODUCT.regNo,
        category: LOOP_PRODUCT.category,
        nature: LOOP_PRODUCT.nature,
        restricted: LOOP_PRODUCT.restricted,
        time: '2026-11-19 14:20:00',
        qty: '20',
        spec: LOOP_PRODUCT.spec,
        enterprise: LOOP_OPERATOR.name,
        area: LOOP_OPERATOR.area,
        buyer: '演示购买人丙',
        source: '演示填报',
        side: '零售',
        scan: true
      }
    ],
    recycles: [
      {
        id: 'LOOP-RC-001',
        voucher: 'YS-HZ-001',
        date: '2026-11-20',
        batchNo: HERO_BATCH,
        stationId: 'DEMO-R-001',
        stationName: '演示回收站甲',
        fromName: '演示经营企业甲',
        type: '农药瓶',
        count: 20,
        weight: 4,
        handle: '无害化焚烧处置',
        status: 'pending',
        regionLabel: '演示区县A',
        source: '演示填报'
      }
    ],
    retailWastes: [
      {
        id: 'LOOP-RW-001',
        created: '2026-11-20 15:10:00',
        mode: '回收数量',
        time: '2026-11-20',
        name: '演示购买人丙',
        phone: '—',
        qty: '20个',
        batchNo: HERO_BATCH,
        source: '演示填报'
      }
    ],
    mobileDrafts: [],
    mobileEntries: []
  }
}

function loadState() {
  const base = seed()
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      return {
        ...base,
        ...parsed,
        recycles: parsed.recycles || base.recycles,
        retailWastes: parsed.retailWastes || base.retailWastes,
        mobileDrafts: parsed.mobileDrafts || base.mobileDrafts,
        mobileEntries: parsed.mobileEntries || base.mobileEntries
      }
    }
  } catch (e) { /* ignore */ }
  return base
}

export const usePesLoopStore = defineStore('pesLoop', () => {
  const state = ref(loadState())

  function persist() {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state.value))
  }

  const products = computed(() => state.value.products)
  const batches = computed(() => state.value.batches)
  const inbounds = computed(() => state.value.inbounds)
  const outbounds = computed(() => state.value.outbounds)
  const profileConfirmed = computed(() => state.value.profileConfirmed)
  const heroBatchNo = HERO_BATCH

  const retailGoods = computed(() => state.value.batches
    .filter((b) => Number(b.inventoryQty) > 0 || state.value.inbounds.some((i) => i.batchNo === b.batchNo))
    .map((b) => {
      const inbound = state.value.inbounds.filter((i) => i.batchNo === b.batchNo).reduce((s, i) => s + Number(i.qty || 0), 0)
      const sold = state.value.outbounds.filter((o) => o.batchNo === b.batchNo).reduce((s, o) => s + Number(o.qty || 0), 0)
      const stock = Math.max(inbound - sold, 0)
      const product = state.value.products.find((p) => p.id === b.productId) || LOOP_PRODUCT
      return {
        id: `loop-${b.batchNo}`,
        kind: '农药',
        category: 'insect',
        name: b.productName,
        maker: b.producerName,
        spec: product.spec || '瓶',
        packSpec: product.packSpec || product.spec || '瓶',
        stock,
        stockText: `剩余${stock}`,
        price: 28,
        restricted: product.restricted === '是',
        batchNo: b.batchNo,
        regNo: b.regNo,
        loop: true
      }
    }))

  function confirmProfile() {
    state.value.profileConfirmed = true
    persist()
  }

  function addProduct(form) {
    const item = {
      id: `DEMO-PRD-${Date.now()}`,
      name: form.name,
      regNo: form.regNo,
      category: form.category || '杀虫剂',
      form: form.form || '乳油',
      nature: '制剂',
      restricted: form.restricted || '否',
      trademark: form.trademark || '演示商标',
      spec: form.spec || '瓶',
      packSpec: form.packSpec || form.spec || '瓶',
      producerId: LOOP_PRODUCER.id,
      producerName: LOOP_PRODUCER.name
    }
    state.value.products = [item, ...state.value.products]
    persist()
    return item
  }

  function submitProduce(form) {
    const product = state.value.products.find((p) => p.id === form.productId) || state.value.products[0] || LOOP_PRODUCT
    const batchNo = String(form.batchNo || '').trim().toUpperCase()
    if (!batchNo) throw new Error('请填写批次号')
    if (state.value.batches.some((b) => b.batchNo === batchNo)) throw new Error('该批次号已存在')
    const item = {
      id: `LOOP-BAT-${Date.now()}`,
      batchNo,
      productId: product.id,
      productName: product.name,
      regNo: product.regNo,
      trademark: product.trademark,
      category: product.category,
      produceDate: form.produceDate,
      produceQty: Number(form.produceQty) || 0,
      salesQty: Number(form.salesQty) || 0,
      inventoryQty: Number(form.inventoryQty) || 0,
      destination: form.destination || LOOP_OPERATOR.name,
      unit: product.spec || '瓶',
      qr: batchNo,
      status: '已提交',
      submitTime: nowText(),
      producerId: LOOP_PRODUCER.id,
      producerName: LOOP_PRODUCER.name
    }
    state.value.batches = [item, ...state.value.batches]
    persist()
    return item
  }

  function findByScan(code) {
    const key = String(code || '').trim().toUpperCase()
    return state.value.batches.find((b) => b.batchNo.toUpperCase() === key || b.qr.toUpperCase() === key)
  }

  function submitInbound({ batchNo, qty, supplier }) {
    const batch = findByScan(batchNo)
    if (!batch) throw new Error('未识别到该批次，请先在生产端提交台账')
    const product = state.value.products.find((p) => p.id === batch.productId) || LOOP_PRODUCT
    const item = {
      id: `LOOP-IN-${Date.now()}`,
      batchNo: batch.batchNo,
      product: batch.productName,
      regNo: batch.regNo,
      category: batch.category || product.category,
      nature: product.nature,
      restricted: product.restricted,
      time: nowText(),
      qty: String(qty),
      spec: product.spec || '瓶',
      enterprise: LOOP_OPERATOR.name,
      area: LOOP_OPERATOR.area,
      supplier: supplier || batch.producerName,
      source: '演示填报',
      side: '零售',
      scan: true
    }
    state.value.inbounds = [item, ...state.value.inbounds]
    persist()
    return item
  }

  function submitOutbound({ lines, buyer }) {
    if (!buyer) throw new Error('请先登记购买人')
    if (!lines?.length) throw new Error('请先选择商品')
    const created = lines.map((line, idx) => {
      const batchNo = line.batchNo || (line.loop ? String(line.id || '').replace(/^loop-/, '') : HERO_BATCH)
      const batch = findByScan(batchNo)
      const product = batch
        ? (state.value.products.find((p) => p.id === batch.productId) || LOOP_PRODUCT)
        : (state.value.products[0] || LOOP_PRODUCT)
      return {
        id: `LOOP-OUT-${Date.now()}-${idx}`,
        batchNo: batch?.batchNo || batchNo || HERO_BATCH,
        product: line.name || batch?.productName || product.name,
        regNo: line.regNo || batch?.regNo || product.regNo,
        category: product.category,
        nature: product.nature,
        restricted: product.restricted,
        time: nowText(),
        qty: String(line.qty),
        spec: line.spec || product.spec || '瓶',
        enterprise: LOOP_OPERATOR.name,
        area: LOOP_OPERATOR.area,
        buyer,
        source: '演示填报',
        side: '零售',
        scan: !!line.loop || !!batch
      }
    })
    state.value.outbounds = [...created, ...state.value.outbounds]
    persist()
    return created
  }

  function getTrace(batchNo) {
    const batch = findByScan(batchNo)
    if (!batch) return null
    const product = state.value.products.find((p) => p.id === batch.productId) || LOOP_PRODUCT
    const links = [
      {
        date: batch.produceDate,
        type: 'produce',
        from: batch.producerName,
        to: batch.producerName,
        qty: batch.produceQty,
        breakPoint: false
      },
      ...state.value.inbounds.filter((i) => i.batchNo === batch.batchNo).map((i) => ({
        date: String(i.time).slice(0, 10),
        type: 'purchase',
        from: i.supplier,
        to: i.enterprise,
        qty: i.qty,
        breakPoint: false
      })),
      ...state.value.outbounds.filter((o) => o.batchNo === batch.batchNo).map((o) => ({
        date: String(o.time).slice(0, 10),
        type: 'buy',
        from: o.enterprise,
        to: o.buyer,
        qty: o.qty,
        realName: o.buyer,
        breakPoint: !o.buyer
      }))
    ]
    return {
      batch: { batchNo: batch.batchNo, produceDate: batch.produceDate },
      product: { name: product.name, producerName: batch.producerName, trademark: batch.trademark, regNo: batch.regNo },
      links,
      loop: true
    }
  }

  const recycles = computed(() => state.value.recycles)
  const retailWastes = computed(() => state.value.retailWastes)
  const mobileDrafts = computed(() => state.value.mobileDrafts)
  const mobileEntries = computed(() => state.value.mobileEntries)

  const loopSubjects = computed(() => ([
    { id: LOOP_PRODUCER.id, name: LOOP_PRODUCER.name, type: 'produce', license: LOOP_PRODUCER.license, legal: LOOP_PRODUCER.legal, status: '正常', area: LOOP_PRODUCER.area, center: [LOOP_POINTS.producer.lng, LOOP_POINTS.producer.lat], loop: true, batchNo: HERO_BATCH },
    { id: LOOP_OPERATOR.id, name: LOOP_OPERATOR.name, type: 'operate', license: LOOP_OPERATOR.license, legal: '演示负责人乙', status: '正常', area: LOOP_OPERATOR.area, center: [LOOP_POINTS.operator.lng, LOOP_POINTS.operator.lat], loop: true, batchNo: HERO_BATCH },
    { id: 'DEMO-U-001', name: '演示购买人丙', type: 'use', license: '—', legal: '演示购买人丙', status: '正常', area: '演示区县A', center: [LOOP_POINTS.buyer.lng, LOOP_POINTS.buyer.lat], loop: true, batchNo: HERO_BATCH },
    { id: LOOP_RECYCLER.id, name: LOOP_RECYCLER.name, type: 'recycle', license: LOOP_RECYCLER.license, legal: '演示回收负责人', status: '正常', area: LOOP_RECYCLER.area, center: [LOOP_POINTS.recycler.lng, LOOP_POINTS.recycler.lat], loop: true, batchNo: HERO_BATCH }
  ]))

  function submitRecycle(form) {
    const item = {
      id: `LOOP-RC-${Date.now()}`,
      voucher: form.voucher || `YS-HZ-${Date.now()}`,
      date: form.date,
      batchNo: form.batchNo || HERO_BATCH,
      stationId: form.stationId || LOOP_RECYCLER.id,
      stationName: form.stationName || LOOP_RECYCLER.name,
      fromName: form.fromName || LOOP_OPERATOR.name,
      type: form.type || '农药瓶',
      count: Number(form.count) || 0,
      weight: Number(form.weight) || 0,
      handle: form.handle || '无害化焚烧处置',
      status: 'pending',
      regionLabel: '演示区县A',
      source: form.source || '演示填报'
    }
    state.value.recycles = [item, ...state.value.recycles]
    persist()
    return item
  }

  function submitRetailWaste(form) {
    const item = {
      id: `LOOP-RW-${Date.now()}`,
      created: nowText(),
      mode: form.mode,
      time: form.time,
      name: form.name,
      phone: form.phone || '—',
      qty: form.qty,
      batchNo: form.batchNo || HERO_BATCH,
      source: '演示填报'
    }
    state.value.retailWastes = [item, ...state.value.retailWastes]
    submitRecycle({
      voucher: `YS-HZ-${Date.now()}`,
      date: form.time,
      batchNo: item.batchNo,
      fromName: LOOP_OPERATOR.name,
      type: '农药瓶',
      count: Number(String(form.qty).replace(/[^0-9.]/g, '')) || 0,
      weight: form.mode === '回收重量' ? (Number(String(form.qty).replace(/[^0-9.]/g, '')) || 0) : 0,
      handle: '待处置',
      source: '零售端回收'
    })
    persist()
    return item
  }

  function saveMobileDraft(form) {
    const item = { id: `LOOP-MD-${Date.now()}`, ...form, savedAt: nowText(), status: '离线暂存' }
    state.value.mobileDrafts = [item, ...state.value.mobileDrafts]
    persist()
    return item
  }

  function submitMobileEntry(form) {
    const item = { id: `LOOP-ME-${Date.now()}`, ...form, submitTime: nowText(), status: '已同步' }
    state.value.mobileEntries = [item, ...state.value.mobileEntries]
    persist()
    return item
  }

  function syncMobileDraft(id) {
    const draft = state.value.mobileDrafts.find((d) => d.id === id)
    if (!draft) throw new Error('未找到暂存记录')
    const entry = submitMobileEntry({ ...draft, fromDraft: true })
    state.value.mobileDrafts = state.value.mobileDrafts.filter((d) => d.id !== id)
    persist()
    return entry
  }

  function resetDemo() {
    state.value = seed()
    persist()
  }

  return {
    products, batches, inbounds, outbounds, profileConfirmed, retailGoods, heroBatchNo,
    recycles, retailWastes, mobileDrafts, mobileEntries, loopSubjects,
    confirmProfile, addProduct, submitProduce, findByScan, submitInbound, submitOutbound, getTrace, resetDemo,
    submitRecycle, submitRetailWaste, saveMobileDraft, submitMobileEntry, syncMobileDraft,
    producer: LOOP_PRODUCER,
    operator: LOOP_OPERATOR,
    recycler: LOOP_RECYCLER
  }
})

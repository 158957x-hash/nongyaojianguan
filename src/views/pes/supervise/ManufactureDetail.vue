<template>
  <div class="panel">
    <div class="head">
      <div class="title">生产企业信息编辑</div>
      <div>
        <el-button @click="openDemoFill('编辑信息')">编辑信息</el-button>
        <el-button class="yellow" @click="openDemoFill('重设密码', { kind: 'password' })">重设密码</el-button>
        <el-button @click="$router.back()">返回</el-button>
      </div>
    </div>
    <div class="tabs">
      <button v-for="t in tabs" :key="t" type="button" :class="{ on: tab === t }" @click="tab = t">{{ t }}</button>
    </div>

    <div v-if="tab === '企业信息'" class="form">
      <div class="row"><div class="label">企业名称</div><div class="value">{{ enterprise.name }}</div></div>
      <div class="row"><div class="label">统一社会信用代码</div><div class="value">{{ display.uscc }}</div></div>
      <div class="row"><div class="label">法人代表（负责人）</div><div class="value">{{ enterprise.legal }}</div></div>
      <div class="row"><div class="label">企业类型</div><div class="value">{{ display.enterpriseType }}</div></div>
      <div class="row"><div class="label">备注</div><div class="value">{{ display.remark }}</div></div>
      <div class="section">负责农药许可事项的联系人信息</div>
      <div class="row"><div class="label">姓名</div><div class="value">{{ enterprise.contact }}</div></div>
      <div class="row"><div class="label">座机</div><div class="value">{{ display.landline }}</div></div>
      <div class="row"><div class="label">手机</div><div class="value">{{ display.mobile }}</div></div>
      <div class="row"><div class="label">电子邮箱</div><div class="value">{{ display.email }}</div></div>
      <div class="row"><div class="label">通信地址</div><div class="value">{{ display.mailAddress }}</div></div>
    </div>

    <div v-else-if="tab === '生产许可信息'" class="form">
      <div class="row"><div class="label">农药生产许可证号</div><div class="value">{{ enterprise.license }}</div></div>
      <div class="row"><div class="label">农药生产许可范围</div><div class="value">{{ display.licenseScope }}</div></div>
      <div class="row"><div class="label">批准日期</div><div class="value">{{ display.licenseApproved }}</div></div>
      <div class="row"><div class="label">有效期至</div><div class="value">{{ display.licenseUntil }}</div></div>
      <div class="row"><div class="label">备注</div><div class="value">{{ display.remark }}</div></div>
    </div>

    <div v-else-if="tab === '生产地信息'" class="form">
      <div class="row"><div class="label">生产地所在区域</div><div class="value">{{ enterprise.area }}</div></div>
      <div class="row"><div class="label">生产地详细地址</div><div class="value">{{ display.siteAddress }}</div></div>
      <div class="row"><div class="label">生产地所在园区的类型</div><div class="value">{{ display.parkType }}</div></div>
      <div class="row"><div class="label">生产地所在园区的级别</div><div class="value">{{ display.parkLevel }}</div></div>
      <div class="row"><div class="label">备注</div><div class="value">{{ display.remark }}</div></div>
    </div>

    <div v-else-if="tab === '账号信息'" class="form">
      <div class="row"><div class="label">账户名称</div><div class="value">{{ display.accountName }}</div></div>
    </div>

    <div v-else class="block">
      <el-table :data="products" border class="pes-table" empty-text="暂无数据">
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="regNo" label="登记证号" min-width="150" />
        <el-table-column prop="category" label="农药类别" width="100" />
        <el-table-column prop="form" label="剂型" width="110" />
        <el-table-column prop="name" label="农药名称" min-width="140" />
        <el-table-column prop="totalContent" label="总含量" width="90" />
        <el-table-column prop="ingredient" label="有效成分及含量" min-width="140" />
        <el-table-column prop="toxicity" label="毒性" width="90" />
        <el-table-column prop="dosage" label="用药量" width="90" />
        <el-table-column prop="validUntil" label="有效时间" width="120" />
        <el-table-column prop="holder" label="登记持有人" min-width="140" />
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { openDemoFill } from '@/components/pes/pesActions'
import { PES_LIST_PAGES } from './pages'

const route = useRoute()
const tabs = ['企业信息', '生产许可信息', '生产地信息', '账号信息', '登记产品']
const tab = ref(tabs[0])

const enterprises = PES_LIST_PAGES['production-enterprise'].rows
const allProducts = PES_LIST_PAGES['production-registration'].rows

const enterprise = computed(() => {
  const id = route.query.id
  return enterprises.find((row) => row.id === id) || enterprises[0] || {}
})

const display = computed(() => {
  const row = enterprise.value
  const suffix = row.id === 'demo-m2' ? '0002' : '0001'
  const area = row.area || '演示区县A'
  const address = !row.address || row.address === '—' ? `${area}演示街道1号` : row.address
  return {
    uscc: !row.uscc || row.uscc === '—' ? `00000000000000${suffix}X（演示）` : row.uscc,
    enterpriseType: '农药生产企业（演示）',
    remark: '—',
    landline: '000-0000-0000',
    mobile: '13800000000（演示）',
    email: row.id === 'demo-m2' ? 'demo-m2@example.com' : 'demo-m1@example.com',
    mailAddress: address,
    licenseScope: '制剂生产（演示）',
    licenseApproved: '2024-01-01',
    licenseUntil: '2029-12-31',
    siteAddress: address,
    parkType: '演示类型',
    parkLevel: '演示级别',
    accountName: row.id === 'demo-m2' ? 'demo_maker_b' : 'demo_maker_a'
  }
})

const productsByEnterprise = {
  'demo-m1': ['demo-r1', 'demo-r2'],
  'demo-m2': ['demo-r3']
}

const products = computed(() => {
  const ids = productsByEnterprise[enterprise.value.id] || allProducts.map((row) => row.id)
  return allProducts
    .filter((row) => ids.includes(row.id))
    .map((row) => ({ ...row, holder: enterprise.value.name || row.holder }))
})
</script>

<style scoped>
.panel { background: #fff; padding: 14px 16px; border-radius: 2px; }
.head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.title { font-size: 15px; font-weight: 600; }
.tabs { display: flex; gap: 0; border-bottom: 1px solid #E5EAF0; margin-bottom: 16px; }
.tabs button {
  border: 0; background: transparent; padding: 8px 16px; cursor: pointer; color: #5a6d85;
  border-bottom: 2px solid transparent;
}
.tabs button.on { color: #1F8A4C; border-bottom-color: #1F8A4C; font-weight: 600; }
.block { margin-top: 4px; }
.form { max-width: 880px; padding: 8px 0 20px; }
.section {
  margin: 18px 0 8px;
  padding-left: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}
.row { display: flex; align-items: flex-start; min-height: 36px; line-height: 36px; }
.label {
  width: 240px;
  text-align: right;
  color: #606266;
  padding-right: 16px;
  flex-shrink: 0;
}
.label::after { content: '：'; }
.value { flex: 1; color: #303133; word-break: break-all; }
.yellow, .yellow:hover { background: #E6A23C; border-color: #E6A23C; color: #fff; }
</style>

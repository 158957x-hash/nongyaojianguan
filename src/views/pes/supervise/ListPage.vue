<template>
  <AuditList v-if="isAudit" :page="page" />
  <PesticideInfo v-else-if="key === 'operation-pesticide'" />
  <BusinessEnterprise v-else-if="key === 'operation-enterprise'" :page="page" />
  <ProductWareOrOutbound v-else-if="key === 'operation-purchase' || key === 'operation-sale'" :page="page" />
  <UsageSubjectList v-else-if="key === 'usage-subject'" :page="page" />
  <UsageProductList v-else-if="key === 'usage-product'" :page="page" />
  <ManufactureList v-else-if="key === 'production-enterprise'" :page="page" />
  <MonthlyMagazine v-else-if="key === 'production-monthly'" :page="page" />
  <PesObserveList
    v-else-if="page"
    v-bind="listBind"
    :unobserved-detail="key === 'operation-pesticide' || key === 'production-monthly'"
  >
    <template v-if="page.typeCounts" #toolbar-extra>
      <div class="type-counts">
        <button type="button" :class="{ on: pesticideSide === '零售商' }" @click="pesticideSide = '零售商'">零售商登记农药数量 {{ page.typeCounts.retail }}</button>
        <button type="button" :class="{ on: pesticideSide === '批发商' }" @click="pesticideSide = '批发商'">批发商登记农药数量 {{ page.typeCounts.wholesale }}</button>
      </div>
    </template>
  </PesObserveList>
  <div v-else class="page-container">页面配置缺失</div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import PesObserveList from '@/components/pes/PesObserveList.vue'
import { PES_LIST_PAGES } from './pages'
import AuditList from './AuditList.vue'
import PesticideInfo from './PesticideInfo.vue'
import BusinessEnterprise from './BusinessEnterprise.vue'
import ProductWareOrOutbound from './ProductWareOrOutbound.vue'
import UsageSubjectList from './UsageSubjectList.vue'
import UsageProductList from './UsageProductList.vue'
import ManufactureList from './ManufactureList.vue'
import MonthlyMagazine from './MonthlyMagazine.vue'

const route = useRoute()
const key = computed(() => route.meta.pageKey)
const page = computed(() => PES_LIST_PAGES[key.value] || null)
const isAudit = computed(() => key.value === 'audit-retailer' || key.value === 'audit-wholesaler')
const pesticideSide = ref('零售商')
const listBind = computed(() => {
  if (!page.value) return {}
  const { rows, ...rest } = page.value
  return { ...rest, rows: rows || [] }
})
</script>

<style scoped>
.type-counts { display: flex; gap: 8px; margin-bottom: 10px; }
.type-counts button {
  border: 1px solid #D9E8DE;
  background: #fff;
  color: #303133;
  padding: 4px 10px;
  cursor: pointer;
  border-radius: 2px;
}
.type-counts button.on { background: #1F8A4C; color: #fff; border-color: #1F8A4C; }
</style>

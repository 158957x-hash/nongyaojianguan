import { createRouter, createWebHashHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'
import Layout from '@/components/layout/Layout.vue'

// 路由模块：全部静态注册 + meta.roles 过滤菜单
const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/Login.vue'),
    meta: { title: '登录' }
  },
  // ===== 统一入口（独立全屏页，不套系统后台布局）=====
  {
    path: '/entry',
    name: 'Entry',
    component: () => import('@/views/entry/Entry.vue'),
    meta: { title: '统一入口' }
  },

  {
    path: '/pes/login',
    name: 'PesLogin',
    component: () => import('@/views/pes/supervise/PesLogin.vue'),
    meta: { title: '登录', public: true }
  },
  {
    path: '/pes/roles',
    name: 'PesRoleSwitch',
    component: () => import('@/views/pes/RoleSwitch.vue'),
    meta: { title: '账户分级与角色切换' }
  },
  {
    path: '/pes',
    component: () => import('@/components/pes/PesLayout.vue'),
    redirect: '/pes/home',
    meta: { subsystem: 'pes' },
    children: [
      { path: 'home', name: 'PesHome', component: () => import('@/views/pes/supervise/Home.vue'), meta: { title: '首页' } },
      { path: 'restricted', name: 'PesRestricted', component: () => import('@/views/pes/supervise/RestrictedSetup.vue'), meta: { title: '限制性农药' } },
      { path: 'content', name: 'PesContentMgmt', component: () => import('@/views/pes/supervise/ContentManagement.vue'), meta: { title: '内容管理' } },
      { path: 'production/enterprises', name: 'PesProductionEnterprises', component: () => import('@/views/pes/supervise/ListPage.vue'), meta: { title: '生产企业信息', pageKey: 'production-enterprise' } },
      { path: 'production/registrations', name: 'PesProductionRegistrations', component: () => import('@/views/pes/supervise/ListPage.vue'), meta: { title: '产品登记信息', pageKey: 'production-registration' } },
      { path: 'production/monthly', name: 'PesProductionMonthly', component: () => import('@/views/pes/supervise/ListPage.vue'), meta: { title: '月报管理', pageKey: 'production-monthly' } },
      { path: 'operation/enterprises', name: 'PesOperationEnterprises', component: () => import('@/views/pes/supervise/ListPage.vue'), meta: { title: '经营企业信息', pageKey: 'operation-enterprise' } },
      { path: 'operation/pesticides', name: 'PesOperationPesticides', component: () => import('@/views/pes/supervise/ListPage.vue'), meta: { title: '经营农药信息', pageKey: 'operation-pesticide' } },
      { path: 'operation/purchases', name: 'PesOperationPurchases', component: () => import('@/views/pes/supervise/ListPage.vue'), meta: { title: '产品进货信息', pageKey: 'operation-purchase' } },
      { path: 'operation/sales', name: 'PesOperationSales', component: () => import('@/views/pes/supervise/ListPage.vue'), meta: { title: '产品销售信息', pageKey: 'operation-sale' } },
      { path: 'usage/subjects', name: 'PesUsageSubjects', component: () => import('@/views/pes/supervise/ListPage.vue'), meta: { title: '使用主体信息', pageKey: 'usage-subject' } },
      { path: 'usage/products', name: 'PesUsageProducts', component: () => import('@/views/pes/supervise/ListPage.vue'), meta: { title: '产品使用信息', pageKey: 'usage-product' } },
      { path: 'audit/retailers', name: 'PesAuditRetailers', component: () => import('@/views/pes/supervise/ListPage.vue'), meta: { title: '零售商审核', pageKey: 'audit-retailer' } },
      { path: 'audit/wholesalers', name: 'PesAuditWholesalers', component: () => import('@/views/pes/supervise/ListPage.vue'), meta: { title: '批发商审核', pageKey: 'audit-wholesaler' } },
      { path: 'stats/production', name: 'PesStatsProduction', component: () => import('@/views/pes/supervise/StatsPage.vue'), meta: { title: '生产统计', pageKey: 'production' } },
      { path: 'stats/trade', name: 'PesStatsTrade', component: () => import('@/views/pes/supervise/StatsPage.vue'), meta: { title: '农药交易统计', pageKey: 'trade' } },
      { path: 'stats/operator-report', name: 'PesStatsOperatorReport', component: () => import('@/views/pes/supervise/StatsPage.vue'), meta: { title: '经营户上报统计', pageKey: 'operator-report' } },
      { path: 'stats/country-report', name: 'PesStatsCountryReport', component: () => import('@/views/pes/supervise/StatsPage.vue'), meta: { title: '经营户上报（国家平台）', pageKey: 'country-report' } },
      { path: 'stats/crops', name: 'PesStatsCrops', component: () => import('@/views/pes/supervise/StatsPage.vue'), meta: { title: '施用作物统计', pageKey: 'crops' } },
      { path: 'stats/usage', name: 'PesStatsUsage', component: () => import('@/views/pes/supervise/StatsPage.vue'), meta: { title: '使用统计', pageKey: 'usage' } },
      { path: 'stats/restricted', name: 'PesStatsRestricted', component: () => import('@/views/pes/supervise/RestrictedStats.vue'), meta: { title: '限制性农药统计', pageKey: 'restricted' } },
      { path: 'audit/dealerDetails/:type/:id', name: 'PesAuditDetail', component: () => import('@/views/pes/supervise/AuditDetail.vue'), meta: { title: '审核信息详情' } },
      { path: 'production/enterprises/details', name: 'PesManufactureDetail', component: () => import('@/views/pes/supervise/ManufactureDetail.vue'), meta: { title: '生产企业信息编辑' } },
      // 旧 pes 路由保留，避免入口页、门户和一张图旧链接失效；侧栏不再展示
      { path: 'subjects', name: 'PesSubjects', component: () => import('@/views/pes/SubjectArchives.vue'), meta: { title: '主体档案' } },
      { path: 'confirm', name: 'PesConfirm', component: () => import('@/views/pes/SubjectConfirm.vue'), meta: { title: '主体确认' } },
      { path: 'products', name: 'PesProducts', component: () => import('@/views/pes/ProductCatalog.vue'), meta: { title: '产品与批次库' } },
      { path: 'produce-ledger', name: 'PesProduceLedger', component: () => import('@/views/pes/ProduceLedger.vue'), meta: { title: '生产台账', roles: ['province', 'city', 'county', 'pes_producer'] } },
      { path: 'trade-ledger', name: 'PesTradeLedger', component: () => import('@/views/pes/TradeLedger.vue'), meta: { title: '经营台账', roles: ['province', 'city', 'county', 'pes_operator'] } },
      { path: 'usage', name: 'PesUsage', component: () => import('@/views/pes/UsageRecords.vue'), meta: { title: '使用记录', roles: ['province', 'city', 'county'] } },
      { path: 'trace', name: 'PesTrace', component: () => import('@/views/pes/TraceFlow.vue'), meta: { title: '流向追溯' } },
      { path: 'recycle', name: 'PesRecycle', component: () => import('@/views/pes/Recycle.vue'), meta: { title: '包装废弃物回收', roles: ['province', 'city', 'county', 'pes_recycler'] } },
      { path: 'stats', name: 'PesStats', component: () => import('@/views/pes/Stats.vue'), meta: { title: '统计报表', roles: ['province', 'city', 'county'] } },
      { path: 'cockpit', name: 'PesCockpit', component: () => import('@/views/pes/Cockpit.vue'), meta: { title: '3D监管驾驶舱', roles: ['province', 'city', 'county'] } },
      { path: 'public', name: 'PesPublic', component: () => import('@/views/pes/PublicService.vue'), meta: { title: '公众服务' } },
      { path: 'publish', name: 'PesPublish', component: () => import('@/views/pes/ContentPublish.vue'), meta: { title: '内容发布', roles: ['province'] } }
      ,{ path: 'onemap', name: 'PesPesticideMap', component: () => import('@/views/onemap/PesticideMap.vue'), meta: { title: '农药监管一张图' } },
      { path: 'interconnect', name: 'PesInterconnect', component: () => import('@/views/pes/Interconnect.vue'), meta: { title: '互联互通演示' } }
    ]
  },
  {
    path: '/pes/mobile',
    component: () => import('@/components/layout/MobileLayout.vue'),
    meta: { title: '皖企通移动端演示' },
    children: [
      { path: '', name: 'PesMobile', component: () => import('@/views/mobile/WanqitongPesticide.vue'), meta: { title: '皖企通 · 农药服务' } }
    ]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/entry',
    children: [
      // ===== 专项一张图 =====
      {
        path: 'onemap',
        meta: { subsystem: 'onemap' },
        children: [
          { path: 'safety', name: 'OnemapSafety', component: () => import('@/views/onemap/SafetyMap.vue'), meta: { title: '粮食安全监测一张图' } },
          { path: 'silage', name: 'OnemapSilage', component: () => import('@/views/sil/PlantingMap.vue'), meta: { title: '青贮饲料一张图' } },
          { path: 'pesticide', name: 'OnemapPesticide', component: () => import('@/views/onemap/PesticideMap.vue'), meta: { title: '农药监管一张图' } }
        ]
      },

      // ===== 粮食计划管理 =====
      {
        path: 'gpm',
        meta: { subsystem: 'gpm' },
        children: [
          { path: 'plan', name: 'GpmPlan', component: () => import('@/views/gpm/PlanMake.vue'), meta: { title: '种植计划制定', roles: ['province', 'city', 'county'] } },
          { path: 'subjects', name: 'GpmSubjects', component: () => import('@/views/gpm/Subjects.vue'), meta: { title: '种植主体管理', roles: ['province'] } },
          { path: 'plots', name: 'GpmPlots', component: () => import('@/views/gpm/Plots.vue'), meta: { title: '地块管理', roles: ['province'] } },
          { path: 'audit', name: 'GpmAudit', component: () => import('@/views/gpm/Audit.vue'), meta: { title: '上报计划审核', roles: ['province', 'city', 'county'] } },
          { path: 'plan-report', name: 'GpmPlanReport', component: () => import('@/views/gpm/PlanReport.vue'), meta: { title: '上报计划', roles: ['city', 'county'] } },
          { path: 'stats', name: 'GpmStats', component: () => import('@/views/gpm/Stats.vue'), meta: { title: '种植统计分析', roles: ['province'] } },
          { path: 'decompose', name: 'GpmDecompose', component: () => import('@/views/gpm/PlanDecompose.vue'), meta: { title: '任务分解', roles: ['province', 'city'] } },
          { path: 'crops', name: 'GpmCrops', component: () => import('@/views/gpm/Crops.vue'), meta: { title: '作物维护', roles: ['province'] } },
          { path: 'progress', name: 'GpmProgress', component: () => import('@/views/gpm/Progress.vue'), meta: { title: '播种进度调度', roles: ['province', 'city', 'county'] } },
          { path: 'harvest-progress', name: 'GpmHarvestProgress', component: () => import('@/views/gpm/HarvestProgress.vue'), meta: { title: '收获进度调度', roles: ['province', 'city', 'county'] } },
          { path: 'progress-audit', name: 'GpmProgressAudit', component: () => import('@/views/gpm/ProgressAudit.vue'), meta: { title: '进度审核', roles: ['province', 'city'] } },
          { path: 'disaster', name: 'GpmDisaster', component: () => import('@/views/gpm/Disaster.vue'), meta: { title: '气象预警' } },
          { path: 'disaster-archive', name: 'GpmDisasterArchive', component: () => import('@/views/gpm/DisasterArchive.vue'), meta: { title: '灾情档案' } },
          { path: 'policy', name: 'GpmPolicy', component: () => import('@/views/gpm/Policy.vue'), meta: { title: '惠农政策' } }
        ]
      },

      // ===== 青贮饲料管理 =====
      {
        path: 'sil',
        meta: { subsystem: 'sil' },
        children: [
          { path: 'plan', name: 'SilPlan', component: () => import('@/views/sil/PlanDeclare.vue'), meta: { title: '种植计划申报', roles: ['grower', 'county'] } },
          { path: 'storage-declare', name: 'SilStorageDeclare', component: () => import('@/views/sil/StorageDeclareList.vue'), meta: { title: '青贮饲料作物收储申报', roles: ['storage_subject', 'county'] } },
          { path: 'disaster', name: 'SilDisaster', component: () => import('@/views/sil/DisasterReport.vue'), meta: { title: '受灾作物补充收储上报', roles: ['grower', 'county'] } },
          { path: 'audit', name: 'SilAudit', component: () => import('@/views/sil/AuditCenter.vue'), meta: { title: '备案审核', roles: ['county'] } },
          { path: 'matching', name: 'SilMatching', component: () => import('@/views/sil/Matching.vue'), meta: { title: '养殖企业查询匹配', roles: ['storage_subject', 'province', 'city', 'county'] } },
          { path: 'map', name: 'SilMap', component: () => import('@/views/sil/PlantingMap.vue'), meta: { title: '种植上图', roles: ['province', 'city', 'county'] } },
          { path: 'subjects', name: 'SilSubjects', component: () => import('@/views/sil/SubjectCheck.vue'), meta: { title: '主体信息核查', roles: ['province', 'city', 'county', 'town'] } },
          { path: 'ledger', name: 'SilLedger', component: () => import('@/views/sil/ProductionLedger.vue'), meta: { title: '青贮饲料生产台账', roles: ['province', 'city', 'county'] } },
          { path: 'storage-subjects', name: 'SilStorageSubjects', component: () => import('@/views/sil/StorageSubjects.vue'), meta: { title: '收储主体管理', roles: ['province'] } }
        ]
      },

      // ===== 粮食安全综合监管 =====
      {
        path: 'fsr',
        meta: { subsystem: 'fsr' },
        children: [
          { path: 'stats', name: 'FsrStats', component: () => import('@/views/fsr/ReviewStats.vue'), meta: { title: '长势对比库', roles: ['province', 'city'] } },
          { path: 'events', name: 'FsrEvents', component: () => import('@/views/fsr/EventCenter.vue'), meta: { title: '变化图斑库' } },
          { path: 'task', name: 'FsrTask', component: () => import('@/views/fsr/TaskDispatch.vue'), meta: { title: '任务流程库' } },
          { path: 'indoor', name: 'FsrIndoor', component: () => import('@/views/fsr/IndoorCheck.vue'), meta: { title: '内业智能核查（安全环境演示）', roles: ['province'] } },
          { path: 'reports', name: 'FsrReports', component: () => import('@/views/fsr/ReportCenter.vue'), meta: { title: '事件简报与排名', roles: ['province', 'city'] } },
          { path: 'config', name: 'FsrConfig', component: () => import('@/views/fsr/BizConfig.vue'), meta: { title: '业务配置', roles: ['province'] } }
        ]
      },


      { path: '403', name: 'Forbidden', component: () => import('@/views/common/403.vue'), meta: { title: '无权访问' } }
    ]
  },
  // ===== 移动端演示（独立手机壳布局，不走 Layout）=====
  {
    path: '/mobile',
    component: () => import('@/components/layout/MobileLayout.vue'),
    children: [
      { path: 'wanqitong', name: 'MobileWanqitong', component: () => import('@/views/mobile/WanqitongHome.vue'), meta: { title: '皖企通' } },
      { path: 'wanzhengtong', name: 'MobileWanzhengtong', component: () => import('@/views/mobile/WanzhengtongHome.vue'), meta: { title: '皖政通' } },
      { path: 'wzt-gpm', name: 'MobileWztGpm', component: () => import('@/views/mobile/WanzhengtongGpm.vue'), meta: { title: '皖政通·粮食计划管理', roles: ['county', 'town'] } },
      { path: 'wzt-county-plan', name: 'MobileWztCountyPlan', component: () => import('@/views/mobile/WanzhengtongCountyPlan.vue'), meta: { title: '皖政通·县级计划管理', roles: ['county'] } },
      { path: 'wzt-county-report', name: 'MobileWztCountyReport', component: () => import('@/views/mobile/WanzhengtongCountyPlan.vue'), meta: { title: '皖政通·县级上报计划', roles: ['county'] } },
      { path: 'wzt-county-audit', name: 'MobileWztCountyAudit', component: () => import('@/views/mobile/WanzhengtongCountyPlan.vue'), meta: { title: '皖政通·乡镇计划审核', roles: ['county'] } },
      { path: 'wzt-town-plan', name: 'MobileWztTownPlan', component: () => import('@/views/mobile/WanzhengtongTownPlan.vue'), meta: { title: '皖政通·乡镇计划管理', roles: ['town'] } },
      { path: 'wzt-progress', name: 'MobileWztProgress', component: () => import('@/views/mobile/WanzhengtongProgressEntry.vue'), meta: { title: '皖政通·进度填报', roles: ['county', 'town'] } },
      { path: 'wzt-policies', name: 'MobileWztPolicies', component: () => import('@/views/mobile/WanzhengtongPolicies.vue'), meta: { title: '皖政通·惠农政策', roles: ['county', 'town'] } },
      { path: 'wzt-weather', name: 'MobileWztWeather', component: () => import('@/views/mobile/WanzhengtongDisaster.vue'), meta: { title: '皖政通·气象预警', roles: ['county', 'town'] } },
      { path: 'wzt-disaster', name: 'MobileWztDisaster', component: () => import('@/views/mobile/WanzhengtongDisaster.vue'), meta: { title: '皖政通·灾情上报', roles: ['county'] } },
      { path: 'wzt-silage', name: 'MobileWztSilage', component: () => import('@/views/mobile/WanzhengtongSilage.vue'), meta: { title: '皖政通·青贮饲料管理', roles: ['county', 'town'] } },
      { path: 'wzt-safety', name: 'MobileWztSafety', component: () => import('@/views/mobile/WanzhengtongSafety.vue'), meta: { title: '皖政通·粮食安全综合监管', roles: ['county', 'town'] } },
      { path: 'wzt-food-safety', name: 'MobileWztFoodSafety', component: () => import('@/views/mobile/WanzhengtongFoodSafety.vue'), meta: { title: '皖政通·粮食安全综合监管', roles: ['county', 'town', 'city', 'province'] } },
      { path: 'wzt-pesticide', name: 'MobileWztPesticide', component: () => import('@/views/mobile/WanzhengtongPesticide.vue'), meta: { title: '皖政通·农药监管', roles: ['province', 'city', 'county', 'town'] } },
      { path: 'gpm', name: 'MobileGpm', component: () => import('@/views/mobile/GpmMobileHome.vue'), meta: { title: '皖企通·种植主体工作台', roles: ['grower'] } },
      { path: 'wqt-silage', name: 'MobileWqtSilage', component: () => import('@/views/mobile/WanqitongSilage.vue'), meta: { title: '皖企通·青贮饲料管理', roles: ['grower', 'storage_subject'] } },
      { path: 'plans', name: 'MobilePlans', component: () => import('@/views/mobile/PlanList.vue'), meta: { title: '计划列表', roles: ['grower'] } },
      { path: 'progress', name: 'MobileProgress', component: () => import('@/views/mobile/ProgressList.vue'), meta: { title: '播种与收获', roles: ['grower'] } },
      { path: 'policies', name: 'MobilePolicies', component: () => import('@/views/mobile/PolicyList.vue'), meta: { title: '惠农政策', roles: ['grower', 'storage_subject'] } },
      { path: 'advisories', name: 'MobileAdvisories', component: () => import('@/views/mobile/GrowerAdvisories.vue'), meta: { title: '气象预警与惠农政策', roles: ['grower'] } },
      { path: 'snapshot', name: 'MobileSnapshot', component: () => import('@/views/mobile/SnapReport.vue'), meta: { title: '皖事通·随手拍', roles: ['grower', 'storage_subject'] } },
      { path: 'declare', name: 'MobileDeclare', component: () => import('@/views/mobile/DeclareForm.vue'), meta: { title: '皖企通·主体填报', roles: ['grower'] } }
    ]
  },

  {
    path: '/screen',
    component: () => import('@/views/pes/screen/ScreenLayout.vue'),
    redirect: '/screen/overview',
    meta: { subsystem: 'pes-screen' },
    children: [
      { path: 'overview', name: 'PesScreenOverview', component: () => import('@/views/pes/screen/Overview.vue'), meta: { title: '农药概览' } },
      { path: 'produce', name: 'PesScreenProduce', component: () => import('@/views/pes/screen/Produce.vue'), meta: { title: '农药生产' } },
      { path: 'management', name: 'PesScreenManagement', component: () => import('@/views/pes/screen/Management.vue'), meta: { title: '农药经营' } },
      { path: 'pesticideUse', name: 'PesScreenUse', component: () => import('@/views/pes/screen/PesticideUse.vue'), meta: { title: '农药使用' } },
      { path: 'recycle', name: 'PesScreenRecycle', component: () => import('@/views/pes/screen/ScreenRecycle.vue'), meta: { title: '废弃物回收' } },
      { path: 'supervisionLawEnforcement', name: 'PesScreenLaw', component: () => import('@/views/pes/screen/SupervisionLaw.vue'), meta: { title: '监管执法' } },
      { path: 'seed', name: 'PesScreenSeed', component: () => import('@/views/pes/screen/ScreenPending.vue'), meta: { title: '种子监管' } },
      { path: 'fertilizer', name: 'PesScreenFertilizer', component: () => import('@/views/pes/screen/ScreenPending.vue'), meta: { title: '肥料监管' } }
    ]
  },
  {
    path: '/pes/producer/login',
    name: 'PesProducerLogin',
    component: () => import('@/views/pes/producer/ProducerLogin.vue'),
    meta: { title: '生产单位填报登录', public: true }
  },
  {
    path: '/pes/producer',
    component: () => import('@/views/pes/producer/ProducerLayout.vue'),
    redirect: '/pes/producer/ledger',
    meta: { subsystem: 'pes-producer' },
    children: [
      { path: 'profile', name: 'PesProducerProfile', component: () => import('@/views/pes/producer/ProducerProfile.vue'), meta: { title: '企业备案' } },
      { path: 'products', name: 'PesProducerProducts', component: () => import('@/views/pes/producer/ProducerProducts.vue'), meta: { title: '产品登记' } },
      { path: 'ledger', name: 'PesProducerLedger', component: () => import('@/views/pes/producer/ProducerLedger.vue'), meta: { title: '生产批次与台账' } }
    ]
  },
  {
    path: '/pes/retail/login',
    name: 'PesRetailLogin',
    component: () => import('@/views/pes/retail/RetailLogin.vue'),
    meta: { title: '农资大掌柜', public: true }
  },
  {
    path: '/pes/retail',
    component: () => import('@/views/pes/retail/RetailLayout.vue'),
    redirect: '/pes/retail/cashier',
    meta: { subsystem: 'pes-retail' },
    children: [
      { path: 'cashier', name: 'PesRetailCashier', component: () => import('@/views/pes/retail/Cashier.vue'), meta: { title: '收银台' } },
      { path: 'businessOverview', name: 'PesRetailOverview', component: () => import('@/views/pes/retail/BusinessOverview.vue'), meta: { title: '经营概况' } },
      { path: 'purchasing', name: 'PesRetailPurchasing', component: () => import('@/views/pes/retail/Purchasing.vue'), meta: { title: '采购入库' } },
      { path: 'productStorage', name: 'PesRetailWaste', component: () => import('@/views/pes/retail/WasteRecycle.vue'), meta: { title: '包装废弃物回收' } },
      { path: 'goodsManagement', name: 'PesRetailGoods', component: () => import('@/views/pes/retail/GoodsManagement.vue'), meta: { title: '我的商品' } },
      { path: 'memberManagement', name: 'PesRetailMembers', component: () => import('@/views/pes/retail/MemberManagement.vue'), meta: { title: '我的会员' } },
      { path: 'supplierManagement', name: 'PesRetailSuppliers', component: () => import('@/views/pes/retail/SupplierManagement.vue'), meta: { title: '我的供应商' } },
      { path: 'inventoryManagement', name: 'PesRetailInventory', component: () => import('@/views/pes/retail/InventoryManagement.vue'), meta: { title: '商品库存' } },
      { path: 'incomingOrders', name: 'PesRetailIncoming', component: () => import('@/views/pes/retail/IncomingOrders.vue'), meta: { title: '我的入库单' } },
      { path: 'salesDeliveryOrder', name: 'PesRetailSales', component: () => import('@/views/pes/retail/SalesDeliveryOrder.vue'), meta: { title: '我的销售单' } },
      { path: 'storeInformation', name: 'PesRetailStore', component: () => import('@/views/pes/retail/StoreInformation.vue'), meta: { title: '门店信息' } },
      { path: 'creditRecord/:id', name: 'PesRetailCredit', component: () => import('@/views/pes/retail/CreditRecord.vue'), meta: { title: '赊/还账记录' } }
    ]
  },
  { path: '/:pathMatch(.*)*', redirect: '/entry' }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  const isPes = to.path === '/pes' || to.path.startsWith('/pes/')
  const isPesLogin = to.path === '/pes/login' || to.path === '/pes/retail/login' || to.path === '/pes/producer/login'
  const isProducer = to.path.startsWith('/pes/producer')
  const isScreen = to.path === '/screen' || to.path.startsWith('/screen/')
  const isRetail = to.path.startsWith('/pes/retail')
  if (isScreen) {
    document.title = to.meta.title ? `${to.meta.title} - 安徽省农药智慧数据管理大屏` : '安徽省农药智慧数据管理大屏'
  } else if (isProducer) {
    document.title = to.meta.title ? `${to.meta.title} - 农药生产电子台账` : '农药生产电子台账'
  } else if (isRetail) {
    document.title = to.meta.title ? `${to.meta.title} - 农资大掌柜` : '农资大掌柜'
  } else if (isPes) {
    document.title = to.meta.title ? `${to.meta.title} - 安徽省农药数字监督管理系统` : '安徽省农药数字监督管理系统'
  } else {
    document.title = to.meta.title ? `${to.meta.title} - 安徽省粮食生产安全监测监管平台` : '安徽省粮食生产安全监测监管平台'
  }

  if (to.path !== '/login' && !isPesLogin && !userStore.isLoggedIn) {
    if (isRetail) return next('/pes/retail/login')
    if (isProducer) return next('/pes/producer/login')
    return next(isPes || isScreen ? '/pes/login' : '/login')
  }
  if (userStore.role?.code === 'pes_producer' && isPes && !isProducer && !isPesLogin && !isRetail && to.path !== '/pes/roles') {
    return next('/pes/producer/ledger')
  }
  if (to.path === '/login' && userStore.isLoggedIn) {
    return next('/entry')
  }
  // 角色权限校验
  if (to.meta.roles && !userStore.hasRole(to.meta.roles)) {
    return next('/403')
  }
  next()
})

export default router

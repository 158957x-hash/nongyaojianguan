<template>
  <div class="panel">
    <h2>门店信息</h2>
    <section>
      <h3>门店状态</h3>
      <p class="ok">审核通过</p>
    </section>
    <section>
      <h3>门店信息</h3>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="门店名称">演示门店</el-descriptions-item>
        <el-descriptions-item label="所在区域">演示区县A</el-descriptions-item>
        <el-descriptions-item label="联系人姓名">
          演示联系人
          <el-button link @click="openDemoFill('修改门店信息')">修改</el-button>
        </el-descriptions-item>
        <el-descriptions-item label="经营种类">农药</el-descriptions-item>
        <el-descriptions-item label="成立日期">2024-03-01</el-descriptions-item>
        <el-descriptions-item label="详细地址">演示区县A演示街道1号</el-descriptions-item>
        <el-descriptions-item label="联系电话">
          000-0000-0000
          <el-button link @click="openDemoFill('修改门店信息')">修改</el-button>
        </el-descriptions-item>
        <el-descriptions-item label="法人姓名">演示法人</el-descriptions-item>
      </el-descriptions>
    </section>
    <section>
      <h3>证照信息</h3>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="统一社会信用代码">00000000000000000X（演示）</el-descriptions-item>
        <el-descriptions-item label="农药经营许可证编号">演示-农经证-0001</el-descriptions-item>
        <el-descriptions-item label="经营许可证有效期">2024-01-01 至 2029-12-31</el-descriptions-item>
        <el-descriptions-item label="营业执照照片">（空）</el-descriptions-item>
        <el-descriptions-item label="农药经营许可证照片">（空）</el-descriptions-item>
      </el-descriptions>
      <el-button style="margin-top:12px" @click="openDemoFill('申请变更认证')">申请变更认证</el-button>
    </section>
  </div>
</template>
<script setup>
import { openDemoFill } from '@/components/pes/pesActions'
</script>
<style scoped>
.panel { background: #fff; padding: 14px; }
h2 { margin: 0 0 12px; font-size: 16px; }
h3 { margin: 16px 0 8px; font-size: 14px; }
.ok { color: #31B854; font-weight: 600; }
</style>

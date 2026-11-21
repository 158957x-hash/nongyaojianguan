<template>
  <el-dialog v-model="demoFill.visible" class="demo-fill-dialog" width="520px" append-to-body @closed="closeDemoFill">
    <template #title>
      {{ demoFill.title }}<span class="demo-fill-tag">演示补齐</span>
    </template>

    <el-form v-if="demoFill.kind === 'password'" label-width="96px">
      <el-form-item label="原密码"><el-input v-model="demoFill.form.old" type="password" show-password /></el-form-item>
      <el-form-item label="新密码"><el-input v-model="demoFill.form.now" type="password" show-password /></el-form-item>
      <el-form-item label="确认密码"><el-input v-model="demoFill.form.confirm" type="password" show-password /></el-form-item>
    </el-form>

    <el-form v-else-if="demoFill.kind === 'audit'" label-width="96px">
      <el-form-item label="审核结果">
        <el-radio-group v-model="demoFill.form.result">
          <el-radio value="通过">通过</el-radio>
          <el-radio value="不通过">不通过</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="审核意见">
        <el-input v-model="demoFill.form.opinion" type="textarea" rows="3" placeholder="请填写演示审核意见" />
      </el-form-item>
    </el-form>

    <el-form v-else-if="demoFill.kind === 'stock'" label-width="96px">
      <el-form-item label="批次号"><el-input model-value="YS20261120A" disabled /></el-form-item>
      <el-form-item label="数量"><el-input-number v-model="demoFill.form.qty" :min="1" /></el-form-item>
      <el-form-item label="说明"><el-input v-model="demoFill.form.remark" placeholder="演示说明，不写回库存" /></el-form-item>
    </el-form>

    <el-table v-else-if="demoFill.kind === 'stockLog'" :data="demoFill.rows" border size="small">
      <el-table-column prop="time" label="时间" width="170" />
      <el-table-column prop="type" label="类型" width="100" />
      <el-table-column prop="qty" label="数量" width="80" />
      <el-table-column prop="batchNo" label="批次号" width="140" />
      <el-table-column prop="operator" label="操作主体" />
    </el-table>

    <el-table v-else-if="demoFill.kind === 'alert'" :data="demoFill.rows" border size="small">
      <el-table-column prop="type" label="预警类型" width="140" />
      <el-table-column prop="subject" label="主体" width="160" />
      <el-table-column prop="detail" label="说明" />
    </el-table>

    <p v-else>{{ demoFill.message }}</p>

    <template #footer>
      <el-button @click="closeDemoFill">取消</el-button>
      <el-button type="primary" @click="confirmDemoFill">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { demoFill, closeDemoFill, confirmDemoFill } from './pesActions'
</script>

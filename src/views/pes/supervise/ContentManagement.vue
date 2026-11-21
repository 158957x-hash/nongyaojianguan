<template>
  <div>
    <PesObserveList
      title="内容管理"
      :filters="filters"
      :columns="columns"
      :rows="rows"
      :actions="[{ label: '删除', tone: 'red', write: true }]"
      :toolbar="[{ label: '新增文章', primary: true }]"
      footer="演示 2 条。所属栏目目前只确认到「通知和公告」。没有查看详情。"
      control-actions
      @action="(act) => openDemoFill(act?.label || '删除文章')"
      @toolbar="addVisible = true"
    />
    <el-dialog v-model="addVisible" title="新增文章" width="520px" append-to-body @close="resetAdd">
      <el-form label-width="96px">
        <el-form-item label="文章标题" required>
          <el-input v-model="form.title" maxlength="100" />
        </el-form-item>
        <el-form-item label="所属栏目" required>
          <el-select v-model="form.column" placeholder="请选择">
            <el-option label="通知和公告" value="通知和公告" />
          </el-select>
        </el-form-item>
        <el-form-item label="上传内容">
          <input type="file" accept=".pdf,.doc,.docx,.xls,.xlsx" @change="onFile" />
          <p class="hint">请选择文件名后缀为.pdf .doc .docx .xls .xlsx的文件，文件大小不能超过8M</p>
          <p v-if="fileError" class="err">{{ fileError }}</p>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addVisible = false">取消</el-button>
        <el-button type="primary" @click="onSave">保存并发布</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import PesObserveList from '@/components/pes/PesObserveList.vue'
import { openDemoFill } from '@/components/pes/pesActions'

const filters = [
  { key: 'title', label: '文章标题' },
  { key: 'column', label: '所属栏目', type: 'select', options: ['通知和公告'] }
]
const columns = [
  { prop: 'created', label: '新增时间', width: 160 },
  { prop: 'title', label: '文章标题', width: 220 },
  { prop: 'column', label: '所属栏目', width: 140 }
]
const rows = [
  { id: 'c1', created: '2026-10-12 09:00:00', title: '演示通知甲', column: '通知和公告' },
  { id: 'c2', created: '2026-11-01 14:20:00', title: '演示公告乙', column: '通知和公告' }
]
const addVisible = ref(false)
const fileError = ref('')
const form = reactive({ title: '', column: '通知和公告', file: null })
const ALLOW = ['.pdf', '.doc', '.docx', '.xls', '.xlsx']

function resetAdd() {
  form.title = ''
  form.column = '通知和公告'
  form.file = null
  fileError.value = ''
}
function onFile(e) {
  const file = e.target.files?.[0]
  fileError.value = ''
  form.file = null
  if (!file) return
  const name = file.name.toLowerCase()
  const ok = ALLOW.some((ext) => name.endsWith(ext))
  if (!ok) {
    fileError.value = '请选择文件名后缀为.pdf .doc .docx .xls .xlsx的文件，文件大小不能超过8M'
    e.target.value = ''
    return
  }
  if (file.size > 8 * 1024 * 1024) {
    fileError.value = '请选择文件名后缀为.pdf .doc .docx .xls .xlsx的文件，文件大小不能超过8M'
    e.target.value = ''
    return
  }
  form.file = file
}
function onSave() {
  if (!form.title || !form.column) {
    ElMessage.warning('请填写文章标题和所属栏目')
    return
  }
  openDemoFill('保存并发布')
}
</script>
<style scoped>
.hint { margin: 6px 0 0; color: #909399; font-size: 12px; line-height: 1.5; }
.err { margin: 4px 0 0; color: #D94A4A; font-size: 12px; }
</style>

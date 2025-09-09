<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="保护级别名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入保护级别名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="是否有数据" prop="hasData">
        <el-input
          v-model="queryParams.hasData"
          placeholder="请输入是否有数据"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['fys:levels:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['fys:levels:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['fys:levels:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['fys:levels:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="levelsList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="保护级别 ID" align="center" prop="id" />
      <el-table-column label="保护级别名称" align="center" prop="name" />
      <el-table-column label="是否有数据" align="center" prop="hasData" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['fys:levels:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['fys:levels:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改佛岩寺数据对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="levelsRef" :model="form" :rules="rules" label-width="80px">
        <!-- 隐藏保护级别 ID 输入框 -->
        <el-form-item label="保护级别 ID" prop="id" style="display: none;">
          <el-input v-model="form.id" placeholder="请输入保护级别 ID" />
        </el-form-item>
        <el-form-item label="保护级别名称" prop="name">
          <el-input
            v-model="form.name"
            placeholder="请输入保护级别名称"
            @input="autoFillLevelId"
          />
        </el-form-item>
        <el-form-item label="是否有数据" prop="hasData">
          <el-input v-model="form.hasData" placeholder="请输入是否有数据" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Levels">
import { listLevels, getLevels, delLevels, addLevels, updateLevels } from "@/api/fys/levels"

const { proxy } = getCurrentInstance()

const levelsList = ref([])
const open = ref(false)
const loading = ref(true)
const showSearch = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const title = ref("")
const allLevels = ref([]) // 存储所有保护级别数据

const data = reactive({
  form: {
    id: null, // 初始化保护级别 ID
    name: null, // 初始化保护级别名称
    hasData: null
  },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    name: null,
    hasData: null
  },
  rules: {
    id: [ // 添加保护级别 ID 验证规则
      { required: true, message: "保护级别 ID 不能为空", trigger: "blur" }
    ],
    name: [
      { required: true, message: "保护级别名称不能为空", trigger: "blur" }
    ],
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询佛岩寺数据列表 */
function getList() {
  loading.value = true
  listLevels(queryParams.value).then(response => {
    levelsList.value = response.rows
    total.value = response.total
    loading.value = false
  }).catch(error => {
    console.error('查询列表失败:', error)
    proxy.$modal.msgError('查询列表失败')
    loading.value = false
  })
}

// 获取所有保护级别数据
function getAllLevels() {
  listLevels({}).then(response => {
    allLevels.value = response.rows
  }).catch(error => {
    console.error('获取所有保护级别数据失败:', error)
    proxy.$modal.msgError('获取所有保护级别数据失败')
  })
}

// 自动填充保护级别 ID
function autoFillLevelId() {
  const level = allLevels.value.find(item => item.name === form.value.name)
  if (level) {
    form.value.id = level.id
  } else {
    form.value.id = null
  }
}

// 取消按钮
function cancel() {
  open.value = false
  reset()
}

// 表单重置
function reset() {
  form.value = {
    id: null,
    name: null,
    hasData: null
  }
  proxy.resetForm("levelsRef")
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1
  getList()
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef")
  handleQuery()
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id)
  single.value = selection.length !== 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  open.value = true
  title.value = "添加佛岩寺数据"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _id = row.id || ids.value
  getLevels(_id).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改佛岩寺数据"
  }).catch(error => {
    console.error('获取详情失败:', error)
    proxy.$modal.msgError('获取详情失败')
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["levelsRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateLevels(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        }).catch(error => {
          console.error('修改失败:', error)
          proxy.$modal.msgError('修改失败')
        })
      } else {
        addLevels(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功")
          open.value = false
          getList()
        }).catch(error => {
          console.error('新增失败:', error)
          proxy.$modal.msgError('新增失败')
        })
      }
    }
  })
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _ids = row.id || ids.value
  const idStr = Array.isArray(_ids) ? _ids.join(',') : _ids
  proxy.$modal.confirm('是否确认删除佛岩寺数据编号为"' + idStr + '"的数据项？').then(function() {
    return delLevels(_ids)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(error => {
    console.error('删除失败:', error)
    proxy.$modal.msgError('删除失败')
  })
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('fys/levels/export', {
    ...queryParams.value
  }, `levels_${new Date().getTime()}.xlsx`).catch(error => {
    console.error('导出失败:', error)
    proxy.$modal.msgError('导出失败')
  })
}

// 修改初始化逻辑，获取所有保护级别数据
getAllLevels()
getList()
</script>
<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="文物名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入文物名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="保护级别" prop="levelId">
        <el-select
          style="width: 150px;"
          v-model="queryParams.levelId"
          placeholder="请选择保护级别"
          clearable
          @keyup.enter="handleQuery"
        >
          <el-option
            v-for="item in levelOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="文物类型" prop="typeId" style="width: 240px;">
        <el-select
          v-model="queryParams.typeId"
          placeholder="请选择文物类型"
          clearable
          @keyup.enter="handleQuery"
        >
          <el-option
            v-for="item in typeOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
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
          v-hasPermi="['fys:culturals:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['fys:culturals:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['fys:culturals:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['fys:culturals:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="culturalsList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="文物名称" align="center" prop="name" />
      <el-table-column label="保护级别" align="center">
        <template #default="scope">
          {{ levelOptions.find(item => item.id === scope.row.levelId)?.name || scope.row.levelId }}
        </template>
      </el-table-column>
      <el-table-column label="文物类型" align="center">
        <template #default="scope">
          {{ typeOptions.find(item => item.id === scope.row.typeId)?.name || scope.row.typeId }}
        </template>
      </el-table-column>
      <el-table-column label="文物描述" align="center" prop="description" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['fys:culturals:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['fys:culturals:remove']">删除</el-button>
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

    <!-- 添加或修改文物列表对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="culturalsRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="文物名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入文物名称" />
        </el-form-item>
        <el-form-item label="保护级别" prop="levelId">
          <el-select
            v-model="form.levelId"
            placeholder="请选择保护级别"
          >
            <el-option
              v-for="item in levelOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="文物类型" prop="typeId">
          <el-select
            v-model="form.typeId"
            placeholder="请选择文物类型"
          >
            <el-option
              v-for="item in typeOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="文物描述" prop="description">
          <el-input v-model="form.description" type="textarea" placeholder="请输入内容" />
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

<script setup name="Culturals">
import { listCulturals, getCulturals, delCulturals, addCulturals, updateCulturals } from "@/api/fys/culturals"
import { listLevels } from "@/api/fys/levels"
import { listTypes } from "@/api/fys/types" // 导入文物类型列表方法

const { proxy } = getCurrentInstance()

const culturalsList = ref([])
const open = ref(false)
const loading = ref(true)
const showSearch = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const title = ref("")

const data = reactive({
  form: {
    id: null,
    name: null,
    levelId: null,
    typeId: null, // 恢复 typeId 字段
    description: null
  },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    name: null,
    levelId: null,
    typeId: null, // 恢复 typeId 字段
    description: null
  },
  rules: {
    name: [
      { required: true, message: "文物名称不能为空", trigger: "blur" }
    ],
    levelId: [
      { required: true, message: "保护级别不能为空", trigger: "blur" }
    ],
    typeId: [ // 恢复文物类型验证规则
      { required: true, message: "文物类型不能为空", trigger: "blur" }
    ],
  }
})

const { queryParams, form, rules } = toRefs(data)

const levelOptions = ref([])
const typeOptions = ref([]) // 恢复 typeOptions

// 保存初始的查询参数
const initialQueryParams = JSON.parse(JSON.stringify(data.queryParams))

function getList() {
  loading.value = true
  // 获取保护级别选项
  listLevels().then(response => {
    if (response && response.rows) {
      // 检查每个选项是否包含 id 和 name 字段
      const isValidOptions = response.rows.every(item => 'id' in item && 'name' in item)
      if (isValidOptions) {
        levelOptions.value = response.rows
      } else {
        console.error('保护级别数据格式缺少必要字段:', response)
        proxy.$modal.msgError('保护级别数据格式缺少必要字段')
      }
    } else {
      console.error('保护级别数据格式不正确:', response)
      proxy.$modal.msgError('获取保护级别数据格式不正确')
    }
  }).catch(error => {
    proxy.$modal.msgError('获取保护级别数据失败')
    console.error('获取保护级别数据失败:', error)
  })

  // 获取文物类型选项
  listTypes().then(response => {
    if (response && response.rows) {
      // 检查每个选项是否包含 id 和 name 字段
      const isValidOptions = response.rows.every(item => 'id' in item && 'name' in item)
      if (isValidOptions) {
        typeOptions.value = response.rows
      } else {
        console.error('文物类型数据格式缺少必要字段:', response)
        proxy.$modal.msgError('文物类型数据格式缺少必要字段')
      }
    } else {
      console.error('文物类型数据格式不正确:', response)
      proxy.$modal.msgError('获取文物类型数据格式不正确')
    }
  }).catch(error => {
    proxy.$modal.msgError('获取文物类型数据失败')
    console.error('获取文物类型数据失败:', error)
  })

  listCulturals(queryParams.value).then(response => {
    culturalsList.value = response.rows
    total.value = response.total
    loading.value = false
  }).catch(error => {
    proxy.$modal.msgError('获取文物列表数据失败')
    console.error('获取文物列表数据失败:', error)
    loading.value = false
  })
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
    levelId: null,
    typeId: null, // 恢复 typeId 字段
    description: null
  }
  proxy.resetForm("culturalsRef")
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1
  getList()
}

/** 重置按钮操作 */
function resetQuery() {
  // 手动重置查询参数
  Object.assign(data.queryParams, initialQueryParams)
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
  title.value = "添加文物列表"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _id = row.id || ids.value
  getCulturals(_id).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改文物列表"
  }).catch(error => {
    proxy.$modal.msgError('获取文物详情失败')
    console.error('获取文物详情失败:', error)
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["culturalsRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateCulturals(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        }).catch(error => {
          proxy.$modal.msgError('修改文物失败')
          console.error('修改文物失败:', error)
        })
      } else {
        addCulturals(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功")
          open.value = false
          getList()
        }).catch(error => {
          proxy.$modal.msgError('新增文物失败')
          console.error('新增文物失败:', error)
        })
      }
    }
  })
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _ids = row.id || ids.value
  const idStr = Array.isArray(_ids) ? _ids.join(',') : _ids
  proxy.$modal.confirm('是否确认删除文物列表编号为"' + idStr + '"的数据项？').then(function() {
    return delCulturals(_ids)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(error => {
    proxy.$modal.msgError('删除文物失败')
    console.error('删除文物失败:', error)
  })
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('fys/culturals/export', {
    ...queryParams.value
  }, `culturals_${new Date().getTime()}.xlsx`).catch(error => {
    proxy.$modal.msgError('导出文物数据失败')
    console.error('导出文物数据失败:', error)
  })
}

getList()
</script>

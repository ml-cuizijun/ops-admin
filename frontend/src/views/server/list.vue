<!--
  ============================================================================
  list.vue - 服务器列表页面
  ============================================================================
  
  这是服务器管理的主页面，实现了完整的 CRUD 功能：
  - Create: 新增服务器
  - Read: 查看服务器列表
  - Update: 编辑服务器
  - Delete: 删除服务器
  
  页面结构：
  ┌────────────────────────────────────────────────────┐
  │  el-card (卡片容器)                                │
  │  ┌──────────────────────────────────────────────┐  │
  │  │  Header: 标题 + 新增按钮                      │  │
  │  ├──────────────────────────────────────────────┤  │
  │  │  el-table (数据表格)                         │  │
  │  │  ┌────┬────────┬────────┬──────┬──────────┐  │  │
  │  │  │ ID │  名称  │   IP   │ 状态 │   操作   │  │  │
  │  │  ├────┼────────┼────────┼──────┼──────────┤  │  │
  │  │  │ 1  │ web-01 │ 192... │ 运行 │ 编辑 删除│  │  │
  │  │  └────┴────────┴────────┴──────┴──────────┘  │  │
  │  └──────────────────────────────────────────────┘  │
  └────────────────────────────────────────────────────┘
  
  ┌────────────────────────────────────────────────────┐
  │  el-dialog (弹窗 - 新增/编辑)                      │
  │  ┌──────────────────────────────────────────────┐  │
  │  │  el-form (表单)                              │  │
  │  │  - 服务器名称                                │  │
  │  │  - IP地址                                   │  │
  │  │  - 端口                                      │  │
  │  │  - ...                                       │  │
  │  └──────────────────────────────────────────────┘  │
  │              [ 取消 ]  [ 确定 ]                    │
  └────────────────────────────────────────────────────┘
-->

<template>
  <!-- 
    页面最外层容器
    用 class 添加样式，在 <style> 中定义
  -->
  <div class="page-container">
    
    <!-- 
      el-card: Element Plus 卡片组件
      shadow="hover": 鼠标悬停时显示阴影
    -->
    <el-card shadow="hover">
      
      <!-- 
        #header: 具名插槽，定义卡片头部内容
        等价于 <template v-slot:header>
      -->
      <template #header>
        <div class="card-header">
          <!-- 标题 -->
          <span>服务器列表</span>
          
          <!-- 按钮组：用 div 包裹让按钮挨在一起 -->
          <div class="header-buttons">
            <el-input 
              v-model="searchKeyword" 
              style="width: 200px" 
              placeholder="搜索服务器名称或ip" 
              clearable
              @keyup.enter="handleSearch"
            />
            <el-button type="primary" icon="Search" @click="handleSearch">搜索</el-button>
            <el-button icon="Refresh" @click="fetchList(true)" :loading="loading">刷新</el-button>
            <el-button type="primary" icon="Plus" @click="handleAdd">
              添加服务器
            </el-button>
          </div>
        </div>
      </template>

      <!-- 
        ==================== 数据表格 ====================
        
        el-table: 表格组件
        :data="serverList": 绑定表格数据（响应式，数据变化表格自动更新）
        v-loading="loading": 加载中状态，显示 loading 动画
        stripe: 斑马纹（隔行变色）
        border: 显示边框
      -->
      <el-table :data="filteredList" v-loading="loading" stripe border>
        
        <!-- 
          el-table-column: 表格列
          prop: 对应数据对象的属性名
          label: 列标题
          width: 列宽度（不设置则自适应）
        -->
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="服务器名称" width="150" />
        <el-table-column prop="ip" label="IP地址" width="150" />
        <el-table-column prop="port" label="端口" width="80" />
        
        <!-- 
          自定义列内容：使用作用域插槽
          
          #default="{ row }": 获取当前行数据
          row 就是 serverList 数组中的一个元素
          比如 { id: 1, name: 'web-01', status: 'running', ... }
        -->
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <!-- 
              el-tag: 标签组件，用于状态显示
              :type: 动态绑定标签类型
              三元表达式：条件 ? 真时的值 : 假时的值
            -->
            <el-tag :type="row.status === 'running' ? 'success' : 'danger'">
              {{ row.status === 'running' ? '运行中' : '已停止' }}
            </el-tag>
          </template>
        </el-table-column>
        
        <!-- CPU 列：添加百分号后缀 -->
        <el-table-column prop="cpu" label="CPU" width="80">
          <template #default="{ row }">{{ row.cpu }}%</template>
        </el-table-column>
        
        <!-- 内存列 -->
        <el-table-column prop="memory" label="内存" width="80">
          <template #default="{ row }">{{ row.memory }}%</template>
        </el-table-column>
        
        <!-- 
          备注列
          show-overflow-tooltip: 内容过长时显示省略号，鼠标悬停显示完整内容
        -->
        <el-table-column prop="remark" label="备注" show-overflow-tooltip />
        
        <!-- 
          操作列
          fixed="right": 固定在右侧，横向滚动时不会滚走
        -->
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <!-- 
              编辑按钮
              size="small": 小尺寸按钮
              @click="handleEdit(row)": 点击时传递当前行数据
            -->
            <el-button type="primary" size="small" @click="handleEdit(row)">
              编辑
            </el-button>
            <el-button type="danger" size="small" @click="handleDelete(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 
      ==================== 新增/编辑弹窗 ====================
      
      el-dialog: 对话框组件
      v-model="dialogVisible": 双向绑定，控制弹窗显示/隐藏
      :title: 动态标题，根据 isEdit 显示不同文字
      width: 弹窗宽度
    -->
    <el-dialog 
      v-model="dialogVisible" 
      :title="isEdit ? '编辑服务器' : '添加服务器'"
      width="500px"
    >
      <!-- 
        el-form: 表单组件
        :model="form": 绑定表单数据对象
        label-width: 标签宽度
        :rules="rules": 表单验证规则
        ref="formRef": 获取表单实例，用于调用验证方法
      -->
      <el-form :model="form" label-width="100px" :rules="rules" ref="formRef">
        
        <!-- 
          el-form-item: 表单项
          label: 标签文字
          prop: 对应 rules 中的规则名（用于验证）
        -->
        <el-form-item label="服务器名称" prop="name">
          <!-- 
            el-input: 输入框
            v-model: 双向绑定，输入内容自动同步到 form.name
            placeholder: 占位提示文字
          -->
          <el-input v-model="form.name" placeholder="请输入服务器名称" />
        </el-form-item>
        
        <el-form-item label="IP地址" prop="ip">
          <el-input v-model="form.ip" placeholder="请输入IP地址" />
        </el-form-item>
        
        <el-form-item label="端口" prop="port">
          <!-- 
            el-input-number: 数字输入框
            :min/:max: 限制最小/最大值
          -->
          <el-input-number v-model="form.port" :min="1" :max="65535" />
        </el-form-item>
        
        <el-form-item label="状态">
          <!-- 
            el-select: 下拉选择框
            el-option: 选项
            label: 显示文字
            value: 实际值
          -->
          <el-select v-model="form.status" placeholder="请选择状态">
            <el-option label="运行中" value="running" />
            <el-option label="已停止" value="stopped" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="CPU使用率">
          <el-input-number v-model="form.cpu" :min="0" :max="100" />
        </el-form-item>
        
        <el-form-item label="内存使用率">
          <el-input-number v-model="form.memory" :min="0" :max="100" />
        </el-form-item>
        
        <el-form-item label="备注">
          <!-- type="textarea": 多行文本输入 -->
          <el-input v-model="form.remark" type="textarea" rows="3" placeholder="请输入备注" />
        </el-form-item>
      </el-form>

      <!-- 
        #footer: 弹窗底部插槽，放置按钮
      -->
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <!-- :loading="submitLoading": 提交中显示加载状态 -->
        <el-button type="primary" @click="handleSubmit" :loading="submitLoading">
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<!-- 
  ============================================================================
  JavaScript 逻辑部分
  ============================================================================
-->
<script setup>
// ==================== 导入依赖 ====================

// ref: 创建响应式变量
// onMounted: 组件挂载后执行的生命周期钩子
import { ref, onMounted } from 'vue'

// Element Plus 的消息组件
// ElMessage: 消息提示（顶部弹出）
// ElMessageBox: 消息弹窗（确认框等）
import { ElMessage, ElMessageBox } from 'element-plus'

// 导入 API 函数
import { getServerList, createServer, updateServer, deleteServer } from '@/api/server'

// ==================== 响应式数据定义 ====================

/**
 * ref() 创建响应式变量
 * 
 * 响应式的意思：当变量值改变时，使用它的地方会自动更新
 * 
 * 在 JS 中访问/修改：xxx.value
 * 在模板中访问：直接用 xxx（Vue 自动解包）
 */

// 加载状态：控制表格 loading 动画
const loading = ref(false)

// 搜索关键词
const searchKeyword = ref('')

// 服务器列表数据（原始数据）
const serverList = ref([])

// 过滤后的列表（用于显示）
const filteredList = ref([])

// 弹窗显示状态
const dialogVisible = ref(false)

// 是否是编辑模式（true: 编辑，false: 新增）
const isEdit = ref(false)

// 提交按钮加载状态
const submitLoading = ref(false)

// 表单引用：用于调用表单验证方法
// 通过 ref="formRef" 绑定到 el-form 组件
const formRef = ref(null)

// 表单数据对象
const form = ref({
  id: null,           // ID（编辑时需要）
  name: '',           // 服务器名称
  ip: '',             // IP 地址
  port: 22,           // 端口，默认 22
  status: 'running',  // 状态，默认运行中
  cpu: 0,             // CPU 使用率
  memory: 0,          // 内存使用率
  remark: ''          // 备注
})

/**
 * 表单验证规则
 * 
 * 格式：{ 字段名: [规则数组] }
 * 
 * 规则属性：
 * - required: 是否必填
 * - message: 验证失败时的提示
 * - trigger: 触发验证的时机（blur: 失去焦点，change: 值改变）
 */
const rules = {
  name: [{ required: true, message: '请输入服务器名称', trigger: 'blur' }],
  ip: [{ required: true, message: '请输入IP地址', trigger: 'blur' }]
}

// ==================== 生命周期钩子 ====================

/**
 * onMounted: 组件挂载后执行
 * 
 * 什么时候叫"挂载"？
 * - Vue 组件渲染完成，DOM 已经生成
 * - 适合发起 API 请求获取初始数据
 * 
 * 生命周期顺序：
 * setup() → onBeforeMount → onMounted → onBeforeUpdate → onUpdated → onBeforeUnmount → onUnmounted
 */
onMounted(() => {
  // 页面加载时获取服务器列表
  fetchList()
})

// ==================== 方法定义 ====================

/**
 * 获取服务器列表
 * 
 * async/await: 异步函数语法
 * - async: 声明这是一个异步函数
 * - await: 等待 Promise 完成
 * 
 * try/catch/finally: 异常处理
 * - try: 尝试执行的代码
 * - catch: 出错时执行
 * - finally: 无论成功失败都执行
 */
async function fetchList(showTip = false) {
  // 显示 loading
  loading.value = true
  try {
    // 调用 API 获取数据
    const res = await getServerList()
    
    // 将数据赋值给 serverList
    serverList.value = res.data || []
    // 同时更新过滤列表
    filteredList.value = serverList.value
    
    // 如果是手动刷新，显示成功提示
    if (showTip) {
      ElMessage.success('刷新成功')
    } 
  } catch (error) {
    console.error('获取列表失败:', error)
  } finally {
    loading.value = false
  }
}

/**
 * 搜索功能
 * 根据关键词过滤服务器列表
 */
function handleSearch() {
  const keyword = searchKeyword.value.trim().toLowerCase()
  
  if (!keyword) {
    // 没有关键词，显示全部
    filteredList.value = serverList.value
  } else {
    // 根据名称或 IP 过滤
    filteredList.value = serverList.value.filter(server => 
      server.name.toLowerCase().includes(keyword) ||
      server.ip.toLowerCase().includes(keyword)
    )
  }
  
  ElMessage.success(`找到 ${filteredList.value.length} 条记录`)
}

/**
 * 重置表单
 * 
 * 在打开新增弹窗前调用，清空之前的数据
 */
function resetForm() {
  form.value = {
    id: null,
    name: '',
    ip: '',
    port: 22,
    status: 'running',
    cpu: 0,
    memory: 0,
    remark: ''
  }
}

/**
 * 新增按钮点击事件
 */
function handleAdd() {
  resetForm()            // 清空表单
  isEdit.value = false   // 设置为新增模式
  dialogVisible.value = true  // 显示弹窗
}

/**
 * 编辑按钮点击事件
 * 
 * @param row - 当前行数据，由表格传入
 */
function handleEdit(row) {
  // { ...row } 展开运算符，创建 row 的浅拷贝
  // 为什么要拷贝？直接修改 row 会影响表格显示
  form.value = { ...row }
  isEdit.value = true    // 设置为编辑模式
  dialogVisible.value = true
}

/**
 * 提交表单（新增或编辑）
 */
async function handleSubmit() {
  // 表单验证
  // formRef.value 是 el-form 组件实例
  // validate() 返回 Promise，验证失败会 reject
  await formRef.value.validate()
  
  submitLoading.value = true
  try {
    if (isEdit.value) {
      // ===== 编辑模式 =====
      await updateServer(form.value.id, form.value)
      ElMessage.success('更新成功')
    } else {
      // ===== 新增模式 =====
      await createServer(form.value)
      ElMessage.success('创建成功')
    }
    
    dialogVisible.value = false  // 关闭弹窗
    fetchList()  // 重新获取列表，刷新数据
  } catch (error) {
    console.error('提交失败:', error)
  } finally {
    submitLoading.value = false
  }
}

/**
 * 删除按钮点击事件
 * 
 * @param row - 要删除的行数据
 */
async function handleDelete(row) {
  try {
    // 显示确认框
    // ElMessageBox.confirm(消息, 标题, 配置)
    // 返回 Promise：点击确定 resolve，点击取消 reject
    await ElMessageBox.confirm(
      `确定要删除服务器 "${row.name}" 吗？`,
      '删除确认',
      { type: 'warning' }  // warning 类型显示黄色警告图标
    )
    
    // 用户点击确定，执行删除
    await deleteServer(row.id)
    ElMessage.success('删除成功')
    fetchList()  // 刷新列表
    
  } catch (error) {
    // 用户点击取消，error 值是 'cancel'，不需要处理
    if (error !== 'cancel') {
      console.error('删除失败:', error)
    }
  }
}
</script>

<!-- 
  ============================================================================
  样式部分
  ============================================================================
  
  scoped: 样式只作用于当前组件
-->
<style scoped>
/* 页面容器 */
.page-container {
  padding: 10px;
}

/* 卡片头部：左右两端对齐 */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 按钮组：按钮之间添加间距 */
.header-buttons {
  display: flex;
  gap: 10px;  /* 按钮之间的间距 */
}
</style>

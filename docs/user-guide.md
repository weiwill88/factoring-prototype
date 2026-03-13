# 保理系统原型 — 使用说明

## 访问地址

**线上预览**：https://factoring-prototype.vercel.app  
**GitHub 仓库**：https://github.com/weiwill88/factoring-prototype

---

## 系统入口

首页提供三个入口卡片，点击进入对应端：

| 端 | 路径 | 说明 |
|---|---|---|
| 银行管理端 | `/admin/*` | 系统配置（标签/产品/定价） |
| 供应商端 | `/supplier/*` | 融资企业操作（注册/额度/融资） |
| 资金方端 | `/funder/*` | 保理公司操作（审批/放款/结算） |

> Header 右侧 `Segmented` 组件可随时切换端。

---

## 功能模块一览

### 银行管理端

| 页面 | 路径 | 功能 |
|------|------|------|
| 标签管理 | `/admin/tags` | 客户维度/融资维度标签的增删改查、启用停用 |
| 产品管理 | `/admin/products` | 22个产品SKU列表，点击"配置"打开费项编辑抽屉 |
| 产品定价 | `/admin/pricing` | 标签定价规则 + 产品基准定价 |

### 供应商端

| 页面 | 路径 | 功能 |
|------|------|------|
| 驾驶舱 | `/supplier/dashboard` | 额度总额/余额/融资余额统计，最近融资记录，到期提醒 |
| 注册管理 | `/supplier/register` | **三步向导**：手机验证→企业信息→资料上传(含OCR模拟) |
| 我的额度 | `/supplier/credit` | 额度列表(含使用率进度条)，可跳转申请/查看 |
| 业务管理 | `/supplier/financing` | 融资申请列表，含状态筛选 |

### 资金方端

| 页面 | 路径 | 功能 |
|------|------|------|
| 客户管理 | `/funder/customers` | 供应商列表+搜索，详情抽屉(基本信息/标签/联系) |
| 核心企业额度 | `/funder/credit/core-enterprise` | 核心企业授信管理，编辑抽屉含额度设置表格 |
| 供应商额度 | `/funder/credit/supplier` | 供应商额度管理，**8级审批进度条**，子额度/费用/交易对手 |
| 池保理 | `/funder/business/pool` | 业务列表+详情Modal |
| 预保理/国内保理-补/票据保理-补 | `/funder/business/*` | 业务列表 |
| 结算管理 | `/funder/settlement/bills` | **3 Tab**：票据兑付/尾款划转/退息划转 |
| 账户管理 | `/funder/accounts` | 账户列表+流水明细(可按账户筛选) |
| 市场经营 | `/funder/marketing/metrics` | 业务指标KPI+客户营销拜访记录 |

---

## 数据说明

- 所有数据为 **Mock 数据**，存储在浏览器 `localStorage`
- 刷新页面数据不会丢失
- 点击右上角 ⚙ 齿轮图标 → "重置数据" 可恢复初始数据
- 注册新供应商后，数据会写入 localStorage，可在客户管理页面查看

---

## 测试路径

### 路径 1：供应商注册全流程
1. 进入 `/supplier/register` → 填写三步表单 → 提交
2. 切换到"资金方"端 → 客户管理中查看新注册的供应商

### 路径 2：额度-融资全链条
1. `/supplier/credit` 查看额度列表 → 查看额度详情
2. 切换到"资金方"端 → `/funder/credit/supplier` 查看8级审批进度
3. `/supplier/financing` 查看融资列表

### 路径 3：结算闭环
1. `/funder/settlement/bills` → 查看待兑付票据 → 点击"兑付"
2. 切换"尾款划转"Tab → 确认划转
3. `/funder/accounts` 查看流水明细

---

## 技术栈

- Next.js 15 (App Router) + TypeScript
- Ant Design 5
- localStorage (数据持久化)
- Vercel (自动部署)

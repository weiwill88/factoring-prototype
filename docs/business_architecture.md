# 保理系统业务架构分析文档

> 基于需求文档文本 + 68 张截图多模态解析的综合整理  
> 生成时间：2026-03-13

---

## 一、系统架构总览

### 1.1 平台角色体系

系统采用 **多租户三角色** 架构：

```
┌─────────────────────────────────────────────────┐
│                  平台层（银行管理）                │
│  标签管理 · 产品定价 · 产品管理 · 协议管理 · 角色权限  │
└───────────────────┬─────────────────────────────┘
                    │
        ┌───────────┴───────────┐
        ▼                       ▼
┌──────────────┐       ┌──────────────┐
│   宿主 (Host) │       │  资金方 (FC)  │
│              │       │              │
│  运营 + 客户经理│       │  运营 + 客户经理│
│  + 复核       │       │  + 市场总监    │
│              │       │  + 风险复核    │
│              │       │  + 风险总监    │
│              │       │  + 审查委员会   │
│              │       │  + 总经理      │
└──────┬───────┘       └──────┬───────┘
       │                      │
       └──────────┬───────────┘
                  │
       ┌──────────┴──────────┐
       ▼                     ▼
┌──────────────┐    ┌──────────────┐
│  供应商/卖方   │    │  核心企业/买方  │
│  (Supplier)  │    │ (Core Ent.)  │
│              │    │              │
│  高级经办      │    │  高级经办      │
│  高级复核      │    │  高级复核      │
└──────────────┘    └──────────────┘
```

### 1.2 核心模块关系图

```mermaid
graph TB
    subgraph 平台管理
        A1[标签管理] --> A2[产品定价]
        A3[产品管理] --> A2
        A3 --> A4[协议管理]
        A5[角色权限]
    end

    subgraph 供应商端
        B1[注册/审批] --> B2[驾驶舱]
        B3[我的额度] --> B4[我的协议]
        B5[业务管理-融资申请]
        B6[资产管理]
        B7[费用管理]
        B8[在线开票]
    end

    subgraph 资金方端
        C1[客群管理]
        C2[额度管理-核心企业]
        C3[额度管理-供应商]
        C4[业务管理-池保理/预保理/国内保理-补/票据保理-补]
        C5[结算-票据管理]
        C6[结算-尾款划转]
        C7[结算-退息划转]
        C8[市场与经营管理]
        C9[账户管理-流水/挂账/保证金]
    end

    A1 -.->|标签关联| B1
    A1 -.->|标签关联| B5
    A2 -.->|定价规则| B5
    A3 -.->|产品配置| B5
    A3 -.->|产品配置| C4
    A4 -.->|协议模板| B4

    B1 -->|审批| C1
    B3 -->|审批| C3
    B5 -->|审批| C4
    B5 -->|放款| C5
    B5 -->|回款| C6
    B5 -->|回款| C7
    B6 -->|资产引用| B5
```

### 1.3 产品矩阵

| 产品大类 | 类型 | 追索权 | 对应现有产品名 |
|---------|------|-------|------------|
| 国内保理 | 应收账款(上游) | 有追/无追 | 国内保理-有追/无追 |
| 国内保理 | 应付账款(下游) | 有追/无追 | 下游保理国内保理-有追/无追 |
| 国内保理 | 保兑单 | 无追 | 国内保理-中兵保兑单-无追 |
| 国内保理 | 商票 | 有追/无追 | 票据保理-有追/无追(商票) |
| 国内保理 | 银票 | 有追/无追 | 票据保理-有追/无追 |
| 国内保理 | 池保理 | 有追/无追 | 池保理-有追/无追 |
| 国内保理 | 外部军工产业银票 | — | 外部军工产业票据保理-银票 |
| 国内保理 | 外部军工产品商票 | — | 外部军工产业票据保理-商票 |
| 反向保理 | 应收账款(账单) | — | 保兑单 |
| 反向保理 | 应付账款(线上应付) | — | 线上应付 |
| 汽配订单 | 汽配融 | — | 汽配融 |
| 再保理 | 再保理 | 有追/无追 | 再保理-有追/无追 |
| 预付保理 | 上游 | 有追/无追 | 预保理-有追/无追 |
| 预付保理 | 下游 | 有追/无追 | 下游保理预保理-有追/无追 |

> **共计 22 个产品 SKU**，由 `产品大类 × 类型 × 追索权` 三元组唯一确定

---

## 二、核心业务流程

### 2.1 供应商注册及审批流程

```mermaid
sequenceDiagram
    participant S as 供应商
    participant H as 宿主客户经理
    participant HR as 宿主复核

    S->>S: Step1: 手机号验证(图形验证码+短信)
    S->>S: Step2: 填写注册信息(企业/法人/操作人员/UKey)
    S->>S: Step3: 上传注册资料(11类附件)
    S->>S: OCR识别财务报表反显
    S->>S: 签署平台使用协议(云签约)
    S->>H: 提交注册申请
    Note over H: 填写企业标签信息<br/>(公司资信/所属板块/评级等12项)
    Note over H: 查询工商违法信息<br/>查询失信被执行信息
    H->>HR: 审批通过
    HR->>S: 注册完成
    Note over HR: 可退回(审核不通过)
```

### 2.2 额度申请及审批流程（最多8级审批）

```mermaid
sequenceDiagram
    participant S as 供应商经办
    participant SR as 供应商复核
    participant CM as 资金方客户经理
    participant MD as 市场总监
    participant RR as 风险复核
    participant RD as 风险总监(三级)
    participant AC as 审查委员会(四级)
    participant GM as 总经理(五级)

    Note over S: 前置：完成业务账户维护
    S->>S: 填写额度申请(企业/合同/交易对手)
    S->>SR: 提交
    SR->>CM: 复核通过
    Note over CM: 填写企业标签<br/>设置交易对手参数<br/>设置子额度+费用列表<br/>设置交易对手融资比例/校准日
    CM->>MD: 审批通过
    MD->>RR: 复核通过
    RR->>RD: 三级审批
    RD->>AC: 四级审批
    AC->>GM: 五级审批
    GM->>GM: 最终审批
    Note over GM: 审批完成后自动生成<br/>对应子额度产品的协议
    GM-->>S: 供应商签署协议(云签约)
```

**额度审批核心信息**：
- **子额度信息**：额度编号、产品、金额、是否循环、追索权、期限、底层资产核实情况、资金用途、增信措施
- **费用列表**：收费项目、计费方式、收费方式、费率
- **交易对手**：名称、应收账款月均余额、账期、校准日、融资比例、担保方、担保比例

### 2.3 融资申请（国内保理-应收账款）全流程

```mermaid
sequenceDiagram
    participant S as 供应商经办
    participant CM as 资金方客户经理
    participant SR as 供应商复核
    participant OR as 资金方运营复核
    participant L4 as 四级审批(审查委员会)
    participant L5 as 五级审批(总经理)
    participant ZD as 中登登记
    participant FK as 放款

    S->>S: 1.选择融资产品(需有额度+已签约)
    S->>S: 2.填写申请信息(交易对手/明暗/回款方式等)
    S->>S: 3.上传交易附件(发票验真/合同OCR/其他材料)
    S->>S: 4.填写融资信息(金额/期限/费用/收款账号)
    S->>S: 5.协议签署(云签约)
    Note over S: 额度占用→记录在途占用
    S->>CM: 提交融资申请
    Note over CM: 审批融资标签<br/>调整费率(在区间内)<br/>设置优惠利率/金额
    CM->>SR: 审批通过
    SR->>OR: 复核通过
    OR->>L4: 运营复核通过
    L4->>L5: 四级审批通过
    L5->>ZD: 五级审批通过
    ZD->>ZD: 中登网登记(资金方审核通过、放款前)
    ZD->>FK: 登记成功
    Note over FK: 先收费：扣平台服务费+保理手续费<br/>→判断利息付费方式<br/>→先收则扣利息<br/>→剩余款划扣到供应商
    FK->>S: 放款成功
    Note over FK: 明保理→短信通知交易对手<br/>暗保理→不通知
    Note over FK: 额度记录：在途→已使用
```

**放款失败处理**：退回供应商经办

### 2.4 保理回款流程

```mermaid
flowchart TB
    A[回款触发] --> B{回款方式}
    B -->|现金| C[到期清分]
    B -->|商票/银票| D[票据兑付]
    B -->|保兑单| E[保兑单冲销]

    C --> C1{回款路径}
    C1 -->|直接回款| C2[核心企业账户清分划扣]
    C1 -->|间接回款| C3[供应商账户清分划扣]

    D --> D1[票据到期系统自动还款]

    E --> E1{保兑单类型}
    E1 -->|间接| E2[供应商持有保兑单偿还]
    E1 -->|直接| E3[核心企业持有保兑单偿还]

    subgraph 冲销计算
        F1[选择冲销项目：本金/本金及利息]
        F2[计算偿还总金额]
        F3{回款金额 vs 应还金额}
        F3 -->|回款 >= 应还| F4[计算退尾款=回款-偿还总额]
        F3 -->|回款 < 应还| F5[优先收贴息费，计算剩余尾款]
        F6[多账单：按到期日优先偿还]
    end

    C2 --> F1
    C3 --> F1

    subgraph 退息处理
        G1{是否提前结清}
        G1 -->|全部提前+先收息| G2[退息=本金×费率×剩余天数/360]
        G1 -->|全部提前+后收息| G3[按实际还款时间计息，退息=0]
        G1 -->|部分提前+先收息| G4[退息=已还本金×费率×剩余天数/360]
        G1 -->|部分提前+后收息| G5[按实际还款时间及剩余本金计息]
    end

    F4 --> G1
    F5 --> G1
```

### 2.5 放款方式分支

```mermaid
flowchart LR
    A[放款方式] --> B[现金]
    A --> C[银票]
    A --> D[商票]
    A --> E[供应链票据]

    B --> B1[资金方账户必须为平安银行]
    B --> B2{是否财司户}
    B2 -->|是| B3[请求财司接口划扣]
    B2 -->|否| B4[直接划扣]

    C --> C1[推送开立银票到银行]
    C --> C2[客户经理打手续费到银行收费账户]
    C --> C3[银行开票→票号返回系统]

    D --> D1[推送开立商票到银行]
    D --> D2[同银票流程]

    E --> E1[审批结束]
    E1 --> E2[票交所登记出票]
    E2 --> E3[票交所提示承兑]
    E3 --> E4[系统自动承兑]
    E4 --> E5[通知供应商应答]
    E5 --> E6[供应商应答]
```

---

## 三、数据模型（核心实体关系）

```mermaid
erDiagram
    HOST ||--|{ TAG : manages
    HOST ||--|{ PRODUCT : manages
    HOST ||--|{ PRICING : configures

    TAG {
        int id
        string name
        string dimension "客户维度/融资维度"
        string enum_values
        string status "启用/停用"
        string judge_logic "判断逻辑描述"
    }

    PRODUCT {
        int id
        int host_id FK
        string category "国内保理/反向保理/预付保理..."
        string type "应收账款/商票/银票/池保理..."
        string recourse "有追/无追"
        boolean is_guarantee "是否需要担保"
        string guarantee_type "企业/个人"
        boolean is_zhongdeng "是否中登登记"
        string zhongdeng_stage "中登登记环节"
        boolean has_handling_fee "是否收取保理手续费"
        boolean show_fee_detail "供应商是否展示费用明细"
    }

    PRODUCT ||--|{ FEE_CONFIG : has
    FEE_CONFIG {
        int id
        int product_id FK
        string fee_item "保理手续费/平台服务费/利息/宽限期利息/罚息/票据服务费"
        string billing_mode "逐笔/年化/一口价"
        float fixed_rate "一口价费率%"
        string payment_mode "先收/后收/等额本金/等额本息/按月/按季/到期支付"
        boolean is_invoiceable "是否可开票"
    }

    PRICING {
        int id
        int host_id FK
        int funder_id FK
        datetime last_modified
    }

    PRICING ||--|{ TAG_PRICING : has
    TAG_PRICING {
        int pricing_id FK
        int tag_id FK
        string enum_value
        string method "调整基价/上浮/下浮"
        float value "百分比或BP"
    }

    PRICING ||--|{ PRODUCT_PRICING : has
    PRODUCT_PRICING {
        int pricing_id FK
        int product_id FK
        float base_price "基准价%"
        string linked_tags "关联标签ID列表"
        string price_range "价格区间"
        string applicable_fees "适用费项"
        string relationship "共用/并列"
    }

    SUPPLIER ||--o{ REGISTRATION : submits
    REGISTRATION {
        int id
        int supplier_id FK
        string company_name
        string unified_credit_code
        string industry
        string enterprise_nature
        string province_city
        string legal_rep_name
        string legal_rep_id
        string financial_report_json
        string status "待审批/已通过/已拒绝"
    }

    SUPPLIER ||--|{ CREDIT_APPLICATION : applies
    CREDIT_APPLICATION {
        int id
        int supplier_id FK
        int funder_id FK
        string app_number "YYYYMMDDHHMMSS001"
        decimal total_amount
        string status
    }

    CREDIT_APPLICATION ||--|{ SUB_CREDIT : contains
    SUB_CREDIT {
        int id
        int credit_app_id FK
        string credit_number
        int product_id FK
        decimal amount
        boolean is_revolving
        string recourse "有追/无追"
        date start_date
        date end_date
        int grace_period_days
        string repayment_method
        string asset_verification
        string fund_purpose
    }

    CREDIT_APPLICATION ||--|{ COUNTERPARTY : has
    COUNTERPARTY {
        int id
        int credit_app_id FK
        string company_name
        string unified_credit_code
        string legal_rep
        boolean is_approved
        boolean is_group_member
        boolean has_cooperation_agreement
        string settlement_method "现金/银票/商票/保兑单/保证金/流水挂账"
        int account_period_months
        decimal avg_receivable
        int calibration_days "校准日"
        float financing_ratio "融资比例%"
        string guarantee_party "担保方"
        float guarantee_ratio "担保比例%"
    }

    SUPPLIER ||--|{ FINANCING_APPLICATION : submits
    FINANCING_APPLICATION {
        int id
        int supplier_id FK
        int product_id FK
        int counterparty_id FK
        string app_number
        decimal invoice_total
        decimal max_loan_amount "最高可放款=发票总额×融资比例"
        decimal applied_amount
        date apply_date
        date due_date
        string loan_method "现金/银票/商票"
        string fee_payer "融资企业/交易对手/第三方"
        decimal estimated_arrival "预计到账=最高放款-费用总计"
        string receiving_account
        string receiving_bank
        boolean is_confidential "是否涉密"
        boolean is_pledged "是否质押"
        string status
    }

    FINANCING_APPLICATION ||--|{ ASSET : references
    ASSET {
        int id
        string type "发票/合同/商票/银票"
        string voucher_number
        decimal face_amount
        decimal remaining_amount
        string buyer_name
        string seller_name
        date issue_date
        date due_date
        string status
    }

    FINANCING_APPLICATION ||--|{ LOAN : generates
    LOAN {
        int id
        int financing_app_id FK
        string loan_number
        decimal loan_amount
        decimal remaining_principal
        date loan_date
        date due_date
        string loan_method
        string status "在途/已放款/已结清"
    }

    LOAN ||--|{ FEE_RECORD : has
    FEE_RECORD {
        int id
        int loan_id FK
        string fee_item
        string billing_mode
        string payment_mode
        float rate
        decimal calculated_amount
        decimal actual_amount
        decimal discount_rate "优惠利率"
        decimal discount_amount "优惠金额"
        string payer "付费方"
        boolean is_collected
    }

    LOAN ||--|{ REPAYMENT : has
    REPAYMENT {
        int id
        int loan_id FK
        string repayment_method "现金/商票/银票/保兑单"
        decimal repayment_amount
        decimal principal_repaid
        decimal interest_repaid
        decimal tail_amount "尾款金额"
        decimal refund_interest "退息金额"
        date repayment_date
        string status
    }

    FUNDER ||--|{ BUSINESS_ACCOUNT : has
    BUSINESS_ACCOUNT {
        int id
        int funder_id FK
        string account_name
        string account_number
        string bank_name
        decimal balance
    }

    BUSINESS_ACCOUNT ||--|{ TRANSACTION_FLOW : records
    TRANSACTION_FLOW {
        int id
        int account_id FK
        string flow_number
        date transaction_date
        decimal amount
        string currency
        string payer_account
        string payer_name
        string direction "转入/转出"
        string payee_account
        string payee_name
        string remark
    }
```

---

## 四、状态机定义

### 4.1 供应商注册状态机

```mermaid
stateDiagram-v2
    [*] --> 草稿: 开始注册
    草稿 --> 待审批: 提交注册
    待审批 --> 客户经理审批中: 分配客户经理
    客户经理审批中 --> 待复核: 客户经理通过
    客户经理审批中 --> 已拒绝: 客户经理拒绝
    待复核 --> 已通过: 复核通过
    待复核 --> 已拒绝: 复核拒绝
    已拒绝 --> 草稿: 重新提交
    已通过 --> [*]
```

### 4.2 额度申请状态机

```mermaid
stateDiagram-v2
    [*] --> 草稿: 创建申请
    草稿 --> 供应商复核中: 经办提交
    供应商复核中 --> 客户经理审批中: 供应商复核通过
    供应商复核中 --> 已退回: 复核拒绝
    客户经理审批中 --> 市场总监审批中: 客户经理通过
    客户经理审批中 --> 已退回: 客户经理拒绝
    市场总监审批中 --> 风险复核中: 市场总监通过
    风险复核中 --> 风险总监审批中: 风险复核通过
    风险总监审批中 --> 审查委员会审批中: 风险总监通过
    审查委员会审批中 --> 总经理审批中: 审查委员会通过
    总经理审批中 --> 已通过: 总经理通过
    总经理审批中 --> 已退回: 任意环节拒绝
    已通过 --> 协议生成中: 自动生成协议
    协议生成中 --> 待签约: 协议生成完成
    待签约 --> 已生效: 签约完成
    已退回 --> 草稿: 修改后重新提交
    已生效 --> 额度调整中: 发起调整
    额度调整中 --> 已生效: 调整审批通过
```

### 4.3 融资申请状态机

```mermaid
stateDiagram-v2
    [*] --> 草稿
    草稿 --> 客户经理审批中: 供应商经办提交
    note right of 草稿: 额度在途占用
    客户经理审批中 --> 供应商复核中: 客户经理通过
    客户经理审批中 --> 已退回: 拒绝
    供应商复核中 --> 运营复核中: 复核通过
    运营复核中 --> 四级审批中: 运营复核通过
    四级审批中 --> 五级审批中: 四级通过
    五级审批中 --> 待中登登记: 五级通过
    待中登登记 --> 中登登记中: 发起登记
    中登登记中 --> 待放款: 登记成功
    待放款 --> 收费中: 发起收费
    收费中 --> 放款中: 收费完成
    放款中 --> 已放款: 放款成功
    放款中 --> 已退回: 放款失败
    note right of 已放款: 额度→已使用
    已放款 --> 部分回款: 部分回款冲销
    已放款 --> 已结清: 全额回款冲销
    部分回款 --> 已结清: 剩余全额回款
    已退回 --> 草稿: 修改后重新提交
    note right of 已退回: 释放在途额度
```

### 4.4 额度占用状态机

```mermaid
stateDiagram-v2
    [*] --> 可用
    可用 --> 在途占用: 融资申请提交
    在途占用 --> 已使用: 放款成功
    在途占用 --> 可用: 融资申请退回/撤销
    已使用 --> 部分释放: 部分回款
    已使用 --> 可用: 全额回款(循环额度)
    部分释放 --> 可用: 剩余回款完成(循环额度)
    已使用 --> 已消耗: 全额回款(非循环额度)
```

---

## 五、角色权限矩阵

### 5.1 宿主角色

| 功能模块 | 客户经理 | 运营(原经办) | 复核 |
|---------|---------|------------|------|
| 注册审批-填标签 | ✅ 主办 | ❌ | ✅ 复核 |
| 修改企业信息 | ✅ | ✅ | ✅ |
| 客户管理 | ✅ | ✅ | ✅ |
| 额度管理 | ✅ 配合资金方 | ✅ | ❌ |

> 客户经理有"组别"概念，同组成员可互相处理任务

### 5.2 资金方角色

| 功能模块 | 客户经理 | 运营(原经办) | 运营复核 | 市场总监 | 风险复核 | 风险总监 | 审查委员会 | 总经理 |
|---------|---------|------------|---------|---------|---------|---------|---------|-------|
| 客户管理-增删改查 | ✅ | ✅ | ✅ | — | — | — | — | — |
| 核心企业额度-新增 | ✅ 主办 | — | — | ✅ 复核 | ✅ | ✅ 三级 | ✅ 四级 | ✅ 五级 |
| 供应商额度-新增 | ✅ 主办 | — | — | ✅ 复核 | ✅ | ✅ | ✅ | ✅ |
| 融资审批-标签/费率 | ✅ 主办 | — | ✅ 复核 | — | — | — | ✅ 四级 | ✅ 五级 |
| 池保理/预保理新增 | ✅ 提交 | ✅ 审批 | ✅ 复核 | — | — | — | — | — |
| 结算-尾款/退息 | — | ✅ 经办 | ✅ 复核 | — | — | — | — | — |
| 营销管理 | ✅ 录入 | ✅ 审批 | ✅ 复核 | — | — | — | — | — |
| 账户管理 | — | ✅ | ✅ | — | — | — | — | — |

### 5.3 供应商角色

| 功能模块 | 高级经办 | 高级复核 |
|---------|---------|---------|
| 注册 | ✅ 主办 | ❌ |
| 额度申请 | ✅ 主办 | ✅ 复核 |
| 融资申请 | ✅ 主办 | ✅ 复核 |
| 资产管理 | ✅ | ✅ |
| 费用管理-查看 | ✅ | ✅ |
| 我的协议-签约 | ✅ | — |
| 我的额度 | ✅ | ✅ |

---

## 六、计费引擎规则全集

### 6.1 费用项目枚举

| 费用项目 | 适用产品 | 计费方式 | 收费方式 |
|---------|---------|---------|---------|
| 保理手续费 | 所有 | 逐笔 | 先收 |
| 平台服务费 | 所有 | 逐笔/年化 | 先收/按月/按季 |
| 利息 | 所有 | 年化/一口价 | 先收/等额本金/等额本息/按月/按季/到期还本付息 |
| 宽限期利息 | 所有 | 年化 | — |
| 罚息 | 所有 | 年化 | — |
| 票据服务费 | 票据类产品 | 逐笔 | 先收 |
| 贴息费 | 票据回款 | 逐笔 | 当场收取 |

### 6.2 利息计算公式详解

| 付费模式 | 计算公式 | 期数规则 |
|---------|---------|---------|
| **先收** | `融资金额 × 费率 × 期限 / 360` | — |
| **等额本金** | 每月本金 = `融资金额 / 还款月数`<br/>日利率 = `利率 / 360`<br/>利息 = `剩余本金 × 日利率 × 天数` | 算头不算尾，还款日当日不算，首期按贷款日计算 |
| **等额本息** | `[本金 × 月利率 × (1+月利率)^月数] / [(1+月利率)^月数 - 1]` | 同上 |
| **按月(每月20日)** | 每期 = `本金 × 费率 / 360 × 当期天数`<br/>到期日<月度结算日时，到期还本+剩余利息 | — |
| **按季(3/6/9/12月20日)** | 每期 = `本金 × 费率 / 360 × 当期天数`<br/>到期日<季度结算日时，到期还本+剩余利息 | — |
| **到期还本付息** | `本金 × 费率 / 360 × 期数` | — |

### 6.3 定价引擎逻辑

```
最终费率 = f(产品基准价, 标签定价调整, 客户经理微调, 优惠)

1. 取产品基准价 base_rate
2. 遍历该笔融资关联的所有标签：
   - 如果标签定价方式="调整基价" → 替换 base_rate = 标签值
   - 如果标签定价方式="上浮" → base_rate += 标签值(BP)
   - 如果标签定价方式="下浮" → base_rate -= 标签值(BP)
3. 计算价格区间 [min, max]：
   - 如果有多条"调整基价"标签：min = 最低基价 - 累计下浮, max = 最高基价 + 累计上浮
4. 费项关系处理：
   - "共用"：所有费项费率加总必须在价格区间内
   - "并列"：每个单独的费用项目费率必须在价格区间内
5. 客户经理在 [min, max] 内修改最终费率
6. 可在营销优惠区间内设置优惠利率/优惠金额
```

### 6.4 退息计算规则

| 场景 | 息方式 | 退息公式 |
|------|-------|---------|
| 全部提前结清 | 先收 | `本金 × 费率 × 剩余天数 / 360` |
| 全部提前结清 | 后收 | 按实际还款时间计息，退息=0 |
| 部分提前结清 | 先收 | `已偿还本金 × 费率 × 剩余天数 / 360` |
| 部分提前结清 | 后收 | 按实际还款时间+剩余本金计息 |

---

## 七、硬编码场景分析

### 7.1 需要解耦的硬编码逻辑

| 序号 | 硬编码点 | 当前实现 | 建议方案 |
|------|---------|---------|---------|
| 1 | 标签对价格的影响 | "对价格的影响需要代码开发实现" | 设计DSL规则引擎，标签→价格 映射可配置 |
| 2 | 融资标签自动判断 | 部分根据业务数据自动判断（金额区间/期限区间/是否集团等） | 将判断规则提取为可配置的Expression |
| 3 | 22种产品的差异化流程 | 不同产品走不同代码分支 | 产品化配置：产品×流程节点 矩阵化 |
| 4 | 放款方式分支（现金/银票/商票/供应链票据） | 4种放款走4套不同逻辑 | 策略模式+接口适配器 |
| 5 | 回款方式分支（现金/商票/银票/保兑单） | 4种回款走4套逻辑，其中保兑单又分直接/间接 | 同上 |
| 6 | 费率计算方式 | 7种利息模式各自实现 | 计费引擎工厂模式，每种模式一个策略类 |
| 7 | 中登登记环节配置 | 硬编码"资金方审核通过放款前" | 可配置流程节点 |
| 8 | OCR识别分支 | 合同OCR/发票OCR/票据OCR/财务报表OCR | 统一OCR服务+策略分发 |
| 9 | 审批层级配置 | 最多8级审批写死 | 工作流引擎可配置审批链 |
| 10 | 回款冲销优先级 | "优先到期日临近的账单偿还" | 可配置偿还排序策略 |
| 11 | 额度占用逻辑 | 供应商额度+买方额度双向占用 | 额度服务抽象化 |
| 12 | 协议模板按产品生成 | "有几个产品生成几份合同" | 协议模板引擎 |

### 7.2 外部系统集成点

| 序号 | 外部系统 | 用途 | 接口方向 |
|------|---------|------|---------|
| 1 | 平安银行 | 资金划扣（放款/收费/尾款划转） | 双向 |
| 2 | 财司系统 | 财司户资金划扣 | 调用 |
| 3 | 中登网 | 应收账款登记/查询/撤销 | 双向 |
| 4 | 橙E-银行票据系统 | 银票开立/查额度/查手续费率 | 调用 |
| 5 | 橙E-KYCR | 商票查费用/开票手续费率 | 调用 |
| 6 | 票交所 | 供应链票据登记出票/提示承兑/应答 | 双向 |
| 7 | OCR服务 | 合同/发票/票据/财务报表识别 | 调用 |
| 8 | 云签约平台 | 协议签署/征信授权书签署 | 调用 |
| 9 | CFCA数字证书 | 数字证书授权 | 调用 |
| 10 | 短信平台 | 注册验证码/交易对手通知 | 调用 |
| 11 | 工商信息查询 | 违法信息/失信被执行信息 | 调用 |

### 7.3 开发优先级建议

```
Phase 1 (一期) — 核心闭环
├── 供应商注册+审批
├── 我的额度(额度申请+审批)
├── 我的协议(签约)
├── 产品管理+标签管理+定价基础
└── 基础角色权限

Phase 2 (二期) — 业务主体
├── 国内保理全流程(融资申请→审批→中登→放款→回款→冲销)
├── 计费引擎(7种模式)
├── 资产管理(OCR集成)
├── 票据保理
├── 池保理
├── 预保理
├── 费用管理+在线开票
└── 结算(尾款/退息/票据兑付)

Phase 3 (三期) — 运营支撑
├── 驾驶舱
├── 市场与经营管理(营销/看板/指标/年度目标)
├── 账户管理(流水/挂账/保证金)
├── 反向保理/汽配订单/再保理
├── 费用拆分
└── 统计报表
```

---

## 附录A：页面清单

| 编号 | 模块 | 页面 | 类型 | 对应截图 |
|------|------|------|------|---------|
| P01 | 银行管理 | 标签管理-客户维度编辑 | 配置表格 | img_001 |
| P02 | 银行管理 | 标签管理-融资维度编辑 | 配置表格 | img_002 |
| P03 | 银行管理 | 产品定价-标签定价Tab | 配置表格 | img_003 |
| P04 | 银行管理 | 产品定价-产品定价Tab | 配置表格 | — |
| P05 | 银行管理 | 产品管理-产品配置 | 表单 | img_004 |
| P06 | 银行管理 | 产品管理-费项配置 | 表单 | img_005 |
| P07 | 银行管理 | 协议管理 | 列表+编辑 | — |
| P08 | 供应商 | 注册Step1-手机号验证 | 向导表单 | img_007 |
| P09 | 供应商 | 注册Step2-注册信息 | 向导表单 | img_008 |
| P10 | 供应商 | 注册Step3-上传资料 | 向导表单 | img_009 |
| P11 | 供应商 | 注册-财务报表 | 表单 | img_010 |
| P12 | 供应商 | 注册审批-标签填写 | 审批表单 | img_011 |
| P13 | 供应商 | 注册审批-详情 | 查看 | img_012 |
| P14 | 供应商 | 驾驶舱 | Dashboard | img_013 |
| P15 | 供应商 | 国内保理-融资列表 | 列表 | img_014 |
| P16 | 供应商 | 融资申请-交易附件发票Tab | 附件管理 | img_015 |
| P17 | 供应商 | 融资申请-费用列表 | 表格 | img_016 |
| P18 | 供应商 | 融资申请-收款账号 | 表单 | img_017 |
| P19 | 供应商 | 保理融资凭证 | 凭证模板 | img_018 |
| P20 | 供应商 | 回款冲销 | 操作表单 | img_020 |
| P21 | 供应商 | 应收账款管理列表 | 列表 | img_021 |
| P22 | 供应商 | 费用管理 | 列表 | img_022 |
| P23 | 供应商 | 在线开票 | 功能页 | img_023 |
| P24 | 供应商 | 邮寄地址 | 列表 | img_024 |
| P25 | 供应商 | 我的额度列表 | 列表 | img_025 |
| P26 | 供应商 | 额度申请 | 表单 | img_026/027 |
| P27 | 供应商 | 客户经理审批-标签 | 审批表单 | img_028 |
| P28 | 供应商 | 客户经理审批-额度/费用 | 审批表单 | img_029/030 |
| P29 | 供应商 | 我的协议 | 列表 | img_031 |
| P30 | 资金方 | 客户管理列表 | 列表 | img_032 |
| P31 | 资金方 | 核心企业额度列表 | 列表 | img_033 |
| P32 | 资金方 | 核心企业额度编辑 | 表单 | img_034 |
| P33 | 资金方 | 供应商额度列表 | 列表 | img_035 |
| P34 | 资金方 | 池保理列表 | 列表 | img_036 |
| P35 | 资金方 | 池保理-新增/申请 | 表单 | img_037 |
| P36 | 资金方 | 预保理列表 | 列表 | img_038 |
| P37 | 资金方 | 预保理-新增/申请 | 表单 | img_039/040/041 |
| P38 | 资金方 | 国内保理-补列表 | 列表 | img_042 |
| P39 | 资金方 | 票据保理-补列表 | 列表 | img_043 |
| P40 | 资金方 | 票据管理-回款兑付 | 列表 | img_044/045 |
| P41 | 资金方 | 票据管理-放款承兑 | 列表 | img_046 |
| P42 | 资金方 | 尾款划转 | 列表+操作 | img_047/048 |
| P43 | 资金方 | 退息划转 | 列表+操作 | img_049/050 |
| P44 | 资金方 | 业务指标管理 | 列表+编辑 | img_051/052 |
| P45 | 资金方 | 客户营销管理-录入 | 列表+编辑 | img_053/054 |
| P46 | 资金方 | 客户营销管理-统计 | 列表 | img_055 |
| P47 | 资金方 | 核心企业业务看板 | 列表+编辑(6屏) | img_056~062 |
| P48 | 资金方 | 年度目标 | 列表 | img_063 |
| P49 | 资金方 | 账户管理 | 列表 | img_064 |
| P50 | 资金方 | 交易流水 | 流水查询 | img_065 |
| P51 | 资金方 | 流水挂账 | 操作 | img_066 |
| P52 | 资金方 | 保证金挂账列表 | 列表 | img_067 |
| P53 | 资金方 | 保证金挂账操作 | 操作 | img_068 |

> **共计 53 个独立页面**（不含子Tab和弹窗）

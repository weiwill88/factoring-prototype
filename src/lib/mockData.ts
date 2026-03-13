import type {
  Tag, Product, FeeConfig, Supplier, CreditApplication, SubCredit,
  Counterparty, FinancingApplication, Asset, FeeRecord, ApprovalStep,
  Agreement, BusinessAccount, TransactionFlow, Repayment,
  BusinessMetric, MarketingRecord, TagPricing, ProductPricing
} from './types';

// ===== 标签数据 =====
export const customerTags: Tag[] = [
  { id: 'ct-1', name: '集团成员', dimension: '客户维度', enumValues: ['是', '否'], status: '启用', judgeLogic: '注册审批宿主客户经理填写' },
  { id: 'ct-2', name: '所属板块', dimension: '客户维度', enumValues: ['军品', '汽车', '战略新兴'], status: '启用', judgeLogic: '注册审批宿主客户经理填写' },
  { id: 'ct-3', name: '客户评级', dimension: '客户维度', enumValues: ['A', 'B', 'C', 'D'], status: '启用', judgeLogic: '注册审批宿主客户经理填写' },
];

export const financingTags: Tag[] = [
  { id: 'ft-1', name: '是否集团供应商', dimension: '融资维度', enumValues: ['是', '否'], status: '启用', judgeLogic: '交易对手是否集团成员' },
  { id: 'ft-2', name: '新老客户', dimension: '融资维度', enumValues: ['新', '老'], status: '启用', judgeLogic: '是否有已融资的交易' },
  { id: 'ft-3', name: '保理阶段', dimension: '融资维度', enumValues: ['订单', '应付'], status: '启用', judgeLogic: '订单-预付；应付-应收账款' },
  { id: 'ft-4', name: '金额区间(万元)', dimension: '融资维度', enumValues: ['0-100', '100-500', '500-1000', '1000+'], status: '启用', judgeLogic: '根据融资申请金额判断' },
  { id: 'ft-5', name: '期限区间(月)', dimension: '融资维度', enumValues: ['0-3', '3-6', '6-12', '12+'], status: '启用', judgeLogic: '根据融资申请期限判断' },
  { id: 'ft-6', name: '回款路径', dimension: '融资维度', enumValues: ['直接', '间接'], status: '停用', judgeLogic: '额度' },
  { id: 'ft-7', name: '所属领域', dimension: '融资维度', enumValues: ['军品三化&四个方向', '汽车新四化&新能源汽车', '双碳&绿色环保&新域新质'], status: '启用', judgeLogic: '资金方客户经理选择' },
  { id: 'ft-8', name: '票据期限(月)', dimension: '融资维度', enumValues: ['0-3', '3-6', '6-12'], status: '启用', judgeLogic: '根据融资申请票据期限判断' },
  { id: 'ft-9', name: '票据金额(万元)', dimension: '融资维度', enumValues: ['0-100', '100-500', '500+'], status: '启用', judgeLogic: '根据融资申请票据金额判断' },
  { id: 'ft-10', name: '追索权', dimension: '融资维度', enumValues: ['有追', '无追'], status: '启用', judgeLogic: '产品配置判断' },
];

// ===== 产品SKU =====
export const products: Product[] = [
  { id: 'p-01', category: '国内保理', type: '应收账款(上游)', recourse: '有追', legacyName: '国内保理-有追', isGuarantee: false, isZhongdeng: true, zhongdengStage: '资金方审核通过放款前', hasHandlingFee: true, showFeeDetail: true, feeConfigs: [], status: '启用' },
  { id: 'p-02', category: '国内保理', type: '应收账款(上游)', recourse: '无追', legacyName: '国内保理-无追', isGuarantee: false, isZhongdeng: true, zhongdengStage: '资金方审核通过放款前', hasHandlingFee: true, showFeeDetail: true, feeConfigs: [], status: '启用' },
  { id: 'p-03', category: '国内保理', type: '应付账款(下游)', recourse: '有追', legacyName: '下游保理国内保理-有追', isGuarantee: false, isZhongdeng: true, zhongdengStage: '资金方审核通过放款前', hasHandlingFee: true, showFeeDetail: true, feeConfigs: [], status: '启用' },
  { id: 'p-04', category: '国内保理', type: '应付账款(下游)', recourse: '无追', legacyName: '下游保理国内保理-无追', isGuarantee: false, isZhongdeng: true, zhongdengStage: '资金方审核通过放款前', hasHandlingFee: true, showFeeDetail: true, feeConfigs: [], status: '启用' },
  { id: 'p-05', category: '国内保理', type: '保兑单', recourse: '无追', legacyName: '国内保理-中兵保兑单-无追', isGuarantee: false, isZhongdeng: true, zhongdengStage: '资金方审核通过放款前', hasHandlingFee: true, showFeeDetail: true, feeConfigs: [], status: '启用' },
  { id: 'p-06', category: '国内保理', type: '商票', recourse: '有追', legacyName: '票据保理-有追(商票)', isGuarantee: false, isZhongdeng: false, hasHandlingFee: true, showFeeDetail: true, feeConfigs: [], status: '启用' },
  { id: 'p-07', category: '国内保理', type: '商票', recourse: '无追', legacyName: '票据保理-无追(商票)', isGuarantee: false, isZhongdeng: false, hasHandlingFee: true, showFeeDetail: true, feeConfigs: [], status: '启用' },
  { id: 'p-08', category: '国内保理', type: '银票', recourse: '有追', legacyName: '票据保理-有追', isGuarantee: false, isZhongdeng: false, hasHandlingFee: true, showFeeDetail: true, feeConfigs: [], status: '启用' },
  { id: 'p-09', category: '国内保理', type: '银票', recourse: '无追', legacyName: '票据保理-无追', isGuarantee: false, isZhongdeng: false, hasHandlingFee: true, showFeeDetail: true, feeConfigs: [], status: '启用' },
  { id: 'p-10', category: '国内保理', type: '池保理', recourse: '有追', legacyName: '池保理-有追', isGuarantee: false, isZhongdeng: true, zhongdengStage: '资金方审核通过放款前', hasHandlingFee: true, showFeeDetail: true, feeConfigs: [], status: '启用' },
  { id: 'p-11', category: '国内保理', type: '池保理', recourse: '无追', legacyName: '池保理-无追', isGuarantee: false, isZhongdeng: true, zhongdengStage: '资金方审核通过放款前', hasHandlingFee: true, showFeeDetail: true, feeConfigs: [], status: '启用' },
  { id: 'p-12', category: '国内保理', type: '外部军工产业银票', recourse: '—', legacyName: '外部军工产业票据保理-银票', isGuarantee: false, isZhongdeng: false, hasHandlingFee: true, showFeeDetail: true, feeConfigs: [], status: '启用' },
  { id: 'p-13', category: '国内保理', type: '外部军工产品商票', recourse: '—', legacyName: '外部军工产业票据保理-商票', isGuarantee: false, isZhongdeng: false, hasHandlingFee: true, showFeeDetail: true, feeConfigs: [], status: '启用' },
  { id: 'p-14', category: '反向保理', type: '应收账款(账单)', recourse: '—', legacyName: '保兑单', isGuarantee: false, isZhongdeng: true, zhongdengStage: '资金方审核通过放款前', hasHandlingFee: true, showFeeDetail: true, feeConfigs: [], status: '启用' },
  { id: 'p-15', category: '反向保理', type: '应付账款(线上应付)', recourse: '—', legacyName: '线上应付', isGuarantee: false, isZhongdeng: true, zhongdengStage: '资金方审核通过放款前', hasHandlingFee: true, showFeeDetail: true, feeConfigs: [], status: '启用' },
  { id: 'p-16', category: '汽配订单', type: '汽配融', recourse: '—', legacyName: '汽配融', isGuarantee: false, isZhongdeng: false, hasHandlingFee: true, showFeeDetail: true, feeConfigs: [], status: '启用' },
  { id: 'p-17', category: '再保理', type: '再保理', recourse: '有追', legacyName: '再保理-有追', isGuarantee: false, isZhongdeng: true, zhongdengStage: '资金方审核通过放款前', hasHandlingFee: true, showFeeDetail: true, feeConfigs: [], status: '停用' },
  { id: 'p-18', category: '再保理', type: '再保理', recourse: '无追', legacyName: '再保理-无追', isGuarantee: false, isZhongdeng: true, zhongdengStage: '资金方审核通过放款前', hasHandlingFee: true, showFeeDetail: true, feeConfigs: [], status: '停用' },
  { id: 'p-19', category: '预付保理', type: '上游', recourse: '有追', legacyName: '预保理-有追', isGuarantee: false, isZhongdeng: true, zhongdengStage: '资金方审核通过放款前', hasHandlingFee: true, showFeeDetail: true, feeConfigs: [], status: '启用' },
  { id: 'p-20', category: '预付保理', type: '上游', recourse: '无追', legacyName: '预保理-无追', isGuarantee: false, isZhongdeng: true, zhongdengStage: '资金方审核通过放款前', hasHandlingFee: true, showFeeDetail: true, feeConfigs: [], status: '启用' },
  { id: 'p-21', category: '预付保理', type: '下游', recourse: '有追', legacyName: '下游保理预保理-有追', isGuarantee: false, isZhongdeng: true, zhongdengStage: '资金方审核通过放款前', hasHandlingFee: true, showFeeDetail: true, feeConfigs: [], status: '启用' },
  { id: 'p-22', category: '预付保理', type: '下游', recourse: '无追', legacyName: '下游保理预保理-无追', isGuarantee: false, isZhongdeng: true, zhongdengStage: '资金方审核通过放款前', hasHandlingFee: true, showFeeDetail: true, feeConfigs: [], status: '启用' },
];

// ===== 示例供应商 =====
export const sampleSuppliers: Supplier[] = [
  {
    id: 'sup-001', companyName: '上海明远科技有限公司', unifiedCreditCode: '91310000MA1FL8XU3B',
    enterpriseNature: '有限责任公司', industry: '制造业', province: '上海', city: '浦东新区',
    address: '张江高科技园区碧波路1000号', employeeCount: 150,
    legalRepName: '张明', legalRepIdType: '身份证', legalRepIdNumber: '310101199001011234',
    operatorName: '李芳', operatorPhone: '13800138001', operatorEmail: 'lifang@mingyuan.com',
    customerManager: '王建国', registrationDate: '2025-08-15', status: '已通过',
    tags: { '公司资信状况': '良好', '所属板块': '汽车', '是否高新技术企业': '是', '客户评级': 'A', '集团成员': '是' },
  },
  {
    id: 'sup-002', companyName: '深圳鼎力达机械有限公司', unifiedCreditCode: '91440300MA5DQKXN7P',
    enterpriseNature: '有限责任公司', industry: '机械制造', province: '广东', city: '深圳',
    address: '宝安区新安街道4区109号', employeeCount: 80,
    legalRepName: '刘强', legalRepIdType: '身份证', legalRepIdNumber: '440305198805152468',
    operatorName: '赵丽', operatorPhone: '13900139002', operatorEmail: 'zhaoli@dinglida.com',
    customerManager: '王建国', registrationDate: '2025-09-20', status: '已通过',
    tags: { '公司资信状况': '良好', '所属板块': '军品', '是否高新技术企业': '否', '客户评级': 'B', '集团成员': '否' },
  },
  {
    id: 'sup-003', companyName: '重庆华创新材料有限公司', unifiedCreditCode: '91500000789DEF1234',
    enterpriseNature: '股份有限公司', industry: '新材料', province: '重庆', city: '渝北区',
    address: '两江新区金开大道999号', employeeCount: 200,
    legalRepName: '陈伟', legalRepIdType: '身份证', legalRepIdNumber: '500112199203184567',
    operatorName: '周敏', operatorPhone: '13700137003', operatorEmail: 'zhoumin@huachuang.com',
    customerManager: '李雪梅', registrationDate: '2025-11-05', status: '待审批',
  },
];

// ===== 示例额度申请 =====
export const sampleCreditApplications: CreditApplication[] = [
  {
    id: 'ca-001', supplierId: 'sup-001', supplierName: '上海明远科技有限公司',
    funderId: 'f-001', funderName: '天逸保理',
    appNumber: '20250815140020001', totalAmount: 10000000, usedAmount: 3000000, availableAmount: 7000000,
    startDate: '2025-08-20', endDate: '2026-08-20',
    status: '已生效', signingStatus: '已签约',
    subCredits: [
      { id: 'sc-001', creditNumber: 'CL-2025-001-01', productId: 'p-01', productName: '国内保理-有追(应收账款)', amount: 5000000, isRevolving: true, recourse: '有追', factoringType: '明保理', startDate: '2025-08-20', endDate: '2026-08-20', gracePeriodDays: 15, repaymentMethod: '到期还本付息' },
      { id: 'sc-002', creditNumber: 'CL-2025-001-02', productId: 'p-06', productName: '国内保理-有追(商票)', amount: 5000000, isRevolving: true, recourse: '有追', factoringType: '暗保理', startDate: '2025-08-20', endDate: '2026-08-20', gracePeriodDays: 10, repaymentMethod: '先收' },
    ],
    counterparties: [
      { id: 'cp-001', companyName: '中兵科技集团有限公司', settlementMethod: ['现金', '银票'], accountPeriodMonths: 6, financingRatio: 80, calibrationDays: 30, isGroupMember: true, hasCooperationAgreement: true, tradingAmounts: { '2025': 5000, '2024': 4500, '2023': 4000 }, receivableBalances: { '2025': 1200, '2024': 1100, '2023': 900 } },
    ],
    feeList: [
      { id: 'fr-001', feeItem: '保理手续费', billingMode: '逐笔', paymentMode: '先收', rate: 0.5, calculatedAmount: 50000, payer: '融资企业', isCollected: true },
      { id: 'fr-002', feeItem: '利息', billingMode: '年化', paymentMode: '先收', rate: 5.5, calculatedAmount: 275000, payer: '融资企业', isCollected: true },
    ],
    approvalSteps: [
      { step: 1, role: '供应商经办', approver: '李芳', status: '已通过', approvedAt: '2025-08-15 14:00' },
      { step: 2, role: '供应商复核', approver: '张明', status: '已通过', approvedAt: '2025-08-15 16:30' },
      { step: 3, role: '资金方客户经理', approver: '王建国', status: '已通过', approvedAt: '2025-08-16 10:00' },
      { step: 4, role: '市场总监', approver: '赵刚', status: '已通过', approvedAt: '2025-08-16 14:00' },
      { step: 5, role: '风险复核', approver: '孙丽', status: '已通过', approvedAt: '2025-08-17 09:00' },
      { step: 6, role: '风险总监', approver: '周明', status: '已通过', approvedAt: '2025-08-17 14:00' },
      { step: 7, role: '审查委员会', approver: '委员会', status: '已通过', approvedAt: '2025-08-18 10:00' },
      { step: 8, role: '总经理', approver: '陈总', status: '已通过', approvedAt: '2025-08-18 15:00' },
    ],
  },
  {
    id: 'ca-002', supplierId: 'sup-002', supplierName: '深圳鼎力达机械有限公司',
    funderId: 'f-001', funderName: '天逸保理',
    appNumber: '20250920100030001', totalAmount: 5000000, usedAmount: 0, availableAmount: 5000000,
    startDate: '2025-10-01', endDate: '2026-10-01',
    status: '客户经理审批中', signingStatus: '未签约',
    subCredits: [
      { id: 'sc-003', creditNumber: 'CL-2025-002-01', productId: 'p-01', productName: '国内保理-有追(应收账款)', amount: 5000000, isRevolving: true, recourse: '有追', factoringType: '明保理', startDate: '2025-10-01', endDate: '2026-10-01', gracePeriodDays: 15, repaymentMethod: '到期还本付息' },
    ],
    counterparties: [
      { id: 'cp-002', companyName: '长安汽车股份有限公司', settlementMethod: ['现金', '商票'], accountPeriodMonths: 3, financingRatio: 70, calibrationDays: 15, isGroupMember: false, hasCooperationAgreement: true, tradingAmounts: { '2025': 3000, '2024': 2800 }, receivableBalances: { '2025': 800, '2024': 700 } },
    ],
    feeList: [],
    approvalSteps: [
      { step: 1, role: '供应商经办', approver: '赵丽', status: '已通过', approvedAt: '2025-09-20 10:00' },
      { step: 2, role: '供应商复核', approver: '刘强', status: '已通过', approvedAt: '2025-09-20 14:00' },
      { step: 3, role: '资金方客户经理', status: '进行中' },
      { step: 4, role: '市场总监', status: '待处理' },
      { step: 5, role: '风险复核', status: '待处理' },
      { step: 6, role: '风险总监', status: '待处理' },
      { step: 7, role: '审查委员会', status: '待处理' },
      { step: 8, role: '总经理', status: '待处理' },
    ],
  },
];

// ===== 示例融资申请 =====
export const sampleFinancingApps: FinancingApplication[] = [
  {
    id: 'fa-001', supplierId: 'sup-001', supplierName: '上海明远科技有限公司',
    productId: 'p-01', productName: '国内保理-有追(应收账款)',
    counterpartyId: 'cp-001', counterpartyName: '中兵科技集团有限公司',
    appNumber: 'FIN-20251001-001', invoiceTotal: 2000000, maxLoanAmount: 1600000,
    appliedAmount: 1600000, applyDate: '2025-10-01', dueDate: '2026-01-01',
    loanMethod: '现金', feePayer: '融资企业', estimatedArrival: 1540000,
    receivingAccount: '6228480000000001', receivingBank: '平安银行上海分行',
    isConfidential: false, isPledged: false,
    status: '已放款',
    assets: [
      { id: 'a-001', type: '发票', voucherNumber: 'FP-2025100001', faceAmount: 1200000, remainingAmount: 1200000, buyerName: '中兵科技集团有限公司', sellerName: '上海明远科技有限公司', issueDate: '2025-09-15', dueDate: '2026-03-15', status: '正常', verificationResult: '验真通过' },
      { id: 'a-002', type: '发票', voucherNumber: 'FP-2025100002', faceAmount: 800000, remainingAmount: 800000, buyerName: '中兵科技集团有限公司', sellerName: '上海明远科技有限公司', issueDate: '2025-09-20', dueDate: '2026-03-20', status: '正常', verificationResult: '验真通过' },
    ],
    feeRecords: [
      { id: 'fee-001', feeItem: '保理手续费', billingMode: '逐笔', paymentMode: '先收', rate: 0.5, calculatedAmount: 8000, payer: '融资企业', isCollected: true },
      { id: 'fee-002', feeItem: '平台服务费', billingMode: '逐笔', paymentMode: '先收', rate: 0.3, calculatedAmount: 4800, payer: '融资企业', isCollected: true },
      { id: 'fee-003', feeItem: '利息', billingMode: '年化', paymentMode: '先收', rate: 5.5, calculatedAmount: 22000, payer: '融资企业', isCollected: true },
    ],
    approvalSteps: [
      { step: 1, role: '供应商经办', approver: '李芳', status: '已通过', approvedAt: '2025-10-01 09:00' },
      { step: 2, role: '资金方客户经理', approver: '王建国', status: '已通过', approvedAt: '2025-10-01 14:00' },
      { step: 3, role: '供应商复核', approver: '张明', status: '已通过', approvedAt: '2025-10-02 09:00' },
      { step: 4, role: '运营复核', approver: '陈芳', status: '已通过', approvedAt: '2025-10-02 14:00' },
      { step: 5, role: '中登登记', approver: '系统', status: '已通过', approvedAt: '2025-10-03 10:00' },
      { step: 6, role: '放款', approver: '系统', status: '已通过', approvedAt: '2025-10-03 15:00' },
    ],
  },
  {
    id: 'fa-002', supplierId: 'sup-001', supplierName: '上海明远科技有限公司',
    productId: 'p-01', productName: '国内保理-有追(应收账款)',
    counterpartyId: 'cp-001', counterpartyName: '中兵科技集团有限公司',
    appNumber: 'FIN-20251115-002', invoiceTotal: 3000000, maxLoanAmount: 2400000,
    appliedAmount: 2400000, applyDate: '2025-11-15', dueDate: '2026-05-15',
    loanMethod: '现金', feePayer: '融资企业', estimatedArrival: 2310000,
    receivingAccount: '6228480000000001', receivingBank: '平安银行上海分行',
    isConfidential: false, isPledged: false,
    status: '客户经理审批中',
    assets: [
      { id: 'a-003', type: '发票', voucherNumber: 'FP-2025110001', faceAmount: 3000000, remainingAmount: 3000000, buyerName: '中兵科技集团有限公司', sellerName: '上海明远科技有限公司', issueDate: '2025-11-01', dueDate: '2026-05-01', status: '正常', verificationResult: '验真通过' },
    ],
    feeRecords: [
      { id: 'fee-004', feeItem: '保理手续费', billingMode: '逐笔', paymentMode: '先收', rate: 0.5, calculatedAmount: 12000, payer: '融资企业', isCollected: false },
      { id: 'fee-005', feeItem: '利息', billingMode: '年化', paymentMode: '先收', rate: 5.5, calculatedAmount: 66000, payer: '融资企业', isCollected: false },
    ],
    approvalSteps: [
      { step: 1, role: '供应商经办', approver: '李芳', status: '已通过', approvedAt: '2025-11-15 09:00' },
      { step: 2, role: '资金方客户经理', status: '进行中' },
      { step: 3, role: '供应商复核', status: '待处理' },
      { step: 4, role: '运营复核', status: '待处理' },
      { step: 5, role: '中登登记', status: '待处理' },
      { step: 6, role: '放款', status: '待处理' },
    ],
  },
];

// ===== 示例协议 =====
export const sampleAgreements: Agreement[] = [
  { id: 'ag-001', agreementNumber: 'AGR-2025-001-01', productName: '国内保理-有追(应收账款)', supplierName: '上海明远科技有限公司', startDate: '2025-08-20', endDate: '2026-08-20', status: '已签约' },
  { id: 'ag-002', agreementNumber: 'AGR-2025-001-02', productName: '国内保理-有追(商票)', supplierName: '上海明远科技有限公司', startDate: '2025-08-20', endDate: '2026-08-20', status: '已签约' },
  { id: 'ag-003', agreementNumber: 'AGR-2025-002-01', productName: '国内保理-有追(应收账款)', supplierName: '深圳鼎力达机械有限公司', startDate: '2025-10-01', endDate: '2026-10-01', status: '待签约' },
];

// ===== 示例账户 =====
export const sampleAccounts: BusinessAccount[] = [
  { id: 'acc-001', accountName: '天逸保理基本户', accountNumber: '1100 1234 5678 9012', bankName: '平安银行深圳分行', balance: 50000000 },
  { id: 'acc-002', accountName: '天逸保理保证金户', accountNumber: '1100 9876 5432 1098', bankName: '平安银行深圳分行', balance: 8000000 },
];

export const sampleFlows: TransactionFlow[] = [
  { id: 'fl-001', accountId: 'acc-001', flowNumber: 'TXN-20251003-001', transactionDate: '2025-10-03', amount: 1600000, payerAccount: '1100 1234 5678 9012', payerName: '天逸保理', direction: '转出', payeeAccount: '6228480000000001', payeeName: '上海明远科技有限公司', remark: '放款-FIN-20251001-001' },
  { id: 'fl-002', accountId: 'acc-001', flowNumber: 'TXN-20251003-002', transactionDate: '2025-10-03', amount: 34800, payerAccount: '6228480000000001', payerName: '上海明远科技有限公司', direction: '转入', payeeAccount: '1100 1234 5678 9012', payeeName: '天逸保理', remark: '收费-FIN-20251001-001(手续费+利息)' },
];

// ===== 示例回款 =====
export const sampleRepayments: Repayment[] = [
  { id: 'rp-001', loanId: 'fa-001', businessNumber: 'FIN-20251001-001', productName: '国内保理-有追', supplierName: '上海明远科技有限公司', counterpartyName: '中兵科技集团有限公司', repaymentMethod: '现金', repaymentAmount: 0, principalRepaid: 0, interestRepaid: 0, tailAmount: 0, refundInterest: 0, repaymentDate: '', status: '待划转' },
];

// ===== 示例营销 =====
export const sampleMetrics: BusinessMetric[] = [
  { id: 'bm-001', metricName: '年度保理余额目标', targetValue: 100000, currentValue: 65000, unit: '万元', year: 2025, status: '进行中' },
  { id: 'bm-002', metricName: '新增客户数', targetValue: 50, currentValue: 32, unit: '家', year: 2025, status: '进行中' },
  { id: 'bm-003', metricName: '客户满意度', targetValue: 95, currentValue: 92, unit: '%', year: 2025, status: '进行中' },
];

export const sampleMarketing: MarketingRecord[] = [
  { id: 'mr-001', customerName: '成都航天动力有限公司', contactPerson: '黄涛', contactPhone: '13512345001', visitDate: '2025-09-15', visitContent: '初次拜访，介绍保理产品', followUpPlan: '发送产品方案，约下次面谈', status: '跟进中', customerManager: '王建国' },
  { id: 'mr-002', customerName: '武汉光谷电子有限公司', contactPerson: '林芳', contactPhone: '13612345002', visitDate: '2025-10-10', visitContent: '产品方案讲解，客户有意向', followUpPlan: '准备授信方案', status: '跟进中', customerManager: '李雪梅' },
];

// ===== 定价数据 =====
export const sampleTagPricings: TagPricing[] = [
  { id: 'tp-1', tagId: 'ft-1', tagName: '是否集团供应商', enumValue: '是', method: '下浮', value: 0.5 },
  { id: 'tp-2', tagId: 'ft-1', tagName: '是否集团供应商', enumValue: '否', method: '上浮', value: 0.3 },
  { id: 'tp-3', tagId: 'ft-2', tagName: '新老客户', enumValue: '新', method: '上浮', value: 0.5 },
  { id: 'tp-4', tagId: 'ft-2', tagName: '新老客户', enumValue: '老', method: '下浮', value: 0.3 },
  { id: 'tp-5', tagId: 'ft-4', tagName: '金额区间(万元)', enumValue: '0-100', method: '上浮', value: 1.0 },
  { id: 'tp-6', tagId: 'ft-4', tagName: '金额区间(万元)', enumValue: '1000+', method: '下浮', value: 0.5 },
];

export const sampleProductPricings: ProductPricing[] = [
  { id: 'pp-1', productId: 'p-01', productName: '国内保理-应收账款', basePrice: 3.0, linkedTags: ['ft-1', 'ft-2', 'ft-3', 'ft-4', 'ft-5', 'ft-6', 'ft-7'], priceRange: '3%~3.9%', applicableFees: '保理手续费/利率', relationship: '共用' },
  { id: 'pp-2', productId: 'p-03', productName: '国内保理-应付账款', basePrice: 3.0, linkedTags: ['ft-1', 'ft-2', 'ft-3', 'ft-4', 'ft-5', 'ft-6', 'ft-7'], priceRange: '动态计算', applicableFees: '保理手续费/利率/平台服务费', relationship: '并列' },
];

// ===== localStorage 工具函数 =====
const STORAGE_KEY = 'factoring_prototype_data';

export interface AppData {
  customerTags: Tag[];
  financingTags: Tag[];
  products: Product[];
  suppliers: Supplier[];
  creditApplications: CreditApplication[];
  financingApplications: FinancingApplication[];
  agreements: Agreement[];
  accounts: BusinessAccount[];
  flows: TransactionFlow[];
  repayments: Repayment[];
  metrics: BusinessMetric[];
  marketing: MarketingRecord[];
  tagPricings: TagPricing[];
  productPricings: ProductPricing[];
}

function getDefaultData(): AppData {
  return {
    customerTags: [...customerTags],
    financingTags: [...financingTags],
    products: [...products],
    suppliers: [...sampleSuppliers],
    creditApplications: [...sampleCreditApplications],
    financingApplications: [...sampleFinancingApps],
    agreements: [...sampleAgreements],
    accounts: [...sampleAccounts],
    flows: [...sampleFlows],
    repayments: [...sampleRepayments],
    metrics: [...sampleMetrics],
    marketing: [...sampleMarketing],
    tagPricings: [...sampleTagPricings],
    productPricings: [...sampleProductPricings],
  };
}

export function getAppData(): AppData {
  if (typeof window === 'undefined') return getDefaultData();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  const data = getDefaultData();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  return data;
}

export function saveAppData(data: AppData): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function resetAppData(): AppData {
  const data = getDefaultData();
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
  return data;
}

export function generateId(prefix: string = 'id'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
}

export function generateAppNumber(): string {
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${now.getFullYear()}${pad(now.getMonth()+1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}001`;
}

// ========================
// 核心类型定义 — 保理系统
// ========================

// ---------- 标签管理 ----------
export interface Tag {
  id: string;
  name: string;
  dimension: '客户维度' | '融资维度';
  enumValues: string[];
  status: '启用' | '停用';
  judgeLogic: string;
}

// ---------- 产品管理 ----------
export type ProductCategory = '国内保理' | '反向保理' | '汽配订单' | '再保理' | '预付保理';
export type ProductType = string;
export type RecourseType = '有追' | '无追' | '—';

export interface FeeConfig {
  id: string;
  feeItem: '保理手续费' | '平台服务费' | '利息' | '宽限期利息' | '罚息' | '票据服务费' | '贴息费';
  billingMode: '逐笔' | '年化' | '一口价';
  fixedRate?: number;
  paymentMode: '先收' | '等额本金' | '等额本息' | '按月' | '按季' | '到期还本付息' | '利随本清';
  isInvoiceable: boolean;
}

export interface Product {
  id: string;
  category: ProductCategory;
  type: ProductType;
  recourse: RecourseType;
  legacyName: string;
  isGuarantee: boolean;
  guaranteeType?: '企业' | '个人';
  isZhongdeng: boolean;
  zhongdengStage?: string;
  hasHandlingFee: boolean;
  showFeeDetail: boolean;
  feeConfigs: FeeConfig[];
  status: '启用' | '停用';
}

// ---------- 产品定价 ----------
export interface TagPricing {
  id: string;
  tagId: string;
  tagName: string;
  enumValue: string;
  method: '调整基价' | '上浮' | '下浮';
  value: number;
}

export interface ProductPricing {
  id: string;
  productId: string;
  productName: string;
  basePrice: number;
  linkedTags: string[];
  priceRange: string;
  applicableFees: string;
  relationship: '共用' | '并列';
}

// ---------- 供应商注册 ----------
export interface Supplier {
  id: string;
  companyName: string;
  unifiedCreditCode: string;
  taxRegNumber?: string;
  enterpriseNature: string;
  industry: string;
  province: string;
  city: string;
  address: string;
  employeeCount?: number;
  legalRepName: string;
  legalRepIdType: string;
  legalRepIdNumber: string;
  operatorName: string;
  operatorPhone: string;
  operatorEmail: string;
  customerManager?: string;
  registrationDate: string;
  status: '草稿' | '待审批' | '客户经理审批中' | '待复核' | '已通过' | '已拒绝';
  tags?: Record<string, string>;
}

// ---------- 额度申请 ----------
export interface Counterparty {
  id: string;
  companyName: string;
  unifiedCreditCode?: string;
  legalRep?: string;
  settlementMethod: string[];
  accountPeriodMonths: number;
  purchaseProduct?: string;
  tradingAmounts: Record<string, number>;
  receivableBalances: Record<string, number>;
  financingRatio?: number;
  calibrationDays?: number;
  guaranteeParty?: string;
  guaranteeRatio?: number;
  isGroupMember?: boolean;
  hasCooperationAgreement?: boolean;
}

export interface SubCredit {
  id: string;
  creditNumber: string;
  productId: string;
  productName: string;
  amount: number;
  isRevolving: boolean;
  recourse: RecourseType;
  factoringType: '明保理' | '暗保理';
  startDate: string;
  endDate: string;
  gracePeriodDays: number;
  repaymentMethod: string;
  assetVerification?: string;
  fundPurpose?: string;
}

export interface CreditApplication {
  id: string;
  supplierId: string;
  supplierName: string;
  funderId: string;
  funderName: string;
  appNumber: string;
  totalAmount: number;
  usedAmount: number;
  availableAmount: number;
  startDate: string;
  endDate: string;
  status: '草稿' | '供应商复核中' | '客户经理审批中' | '市场总监审批中' | '风险复核中' | '风险总监审批中' | '审查委员会审批中' | '总经理审批中' | '已通过' | '待签约' | '已生效' | '已退回';
  signingStatus: '未签约' | '待签约' | '已签约';
  subCredits: SubCredit[];
  counterparties: Counterparty[];
  feeList: FeeRecord[];
  approvalSteps: ApprovalStep[];
  remark?: string;
}

// ---------- 审批流程 ----------
export interface ApprovalStep {
  step: number;
  role: string;
  approver?: string;
  status: '待处理' | '已通过' | '已拒绝' | '进行中';
  approvedAt?: string;
  remark?: string;
}

// ---------- 融资申请 ----------
export interface Asset {
  id: string;
  type: '发票' | '合同' | '商票' | '银票';
  voucherNumber: string;
  faceAmount: number;
  remainingAmount: number;
  buyerName: string;
  sellerName: string;
  issueDate: string;
  dueDate: string;
  status: string;
  verificationResult?: string;
}

export interface FeeRecord {
  id: string;
  feeItem: string;
  billingMode: string;
  paymentMode: string;
  rate: number;
  calculatedAmount: number;
  actualAmount?: number;
  discountRate?: number;
  discountAmount?: number;
  payer: '融资企业' | '交易对手' | '第三方';
  isCollected: boolean;
}

export interface FinancingApplication {
  id: string;
  supplierId: string;
  supplierName: string;
  productId: string;
  productName: string;
  counterpartyId: string;
  counterpartyName: string;
  appNumber: string;
  invoiceTotal: number;
  maxLoanAmount: number;
  appliedAmount: number;
  applyDate: string;
  dueDate: string;
  loanMethod: '现金' | '银票' | '商票';
  feePayer: '融资企业' | '交易对手' | '第三方';
  estimatedArrival: number;
  receivingAccount: string;
  receivingBank: string;
  isConfidential: boolean;
  isPledged: boolean;
  status: '草稿' | '客户经理审批中' | '供应商复核中' | '运营复核中' | '四级审批中' | '五级审批中' | '待中登登记' | '中登登记中' | '待放款' | '收费中' | '放款中' | '已放款' | '部分回款' | '已结清' | '已退回';
  assets: Asset[];
  feeRecords: FeeRecord[];
  approvalSteps: ApprovalStep[];
}

// ---------- 结算 ----------
export interface Repayment {
  id: string;
  loanId: string;
  businessNumber: string;
  productName: string;
  supplierName: string;
  counterpartyName: string;
  repaymentMethod: '现金' | '商票' | '银票' | '保兑单';
  repaymentAmount: number;
  principalRepaid: number;
  interestRepaid: number;
  tailAmount: number;
  refundInterest: number;
  repaymentDate: string;
  status: '待划转' | '已划转';
}

// ---------- 账户管理 ----------
export interface BusinessAccount {
  id: string;
  accountName: string;
  accountNumber: string;
  bankName: string;
  balance: number;
}

export interface TransactionFlow {
  id: string;
  accountId: string;
  flowNumber: string;
  transactionDate: string;
  amount: number;
  payerAccount: string;
  payerName: string;
  direction: '转入' | '转出';
  payeeAccount: string;
  payeeName: string;
  remark: string;
}

// ---------- 市场经营 ----------
export interface BusinessMetric {
  id: string;
  metricName: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  year: number;
  status: '进行中' | '已完成' | '未达标';
}

export interface MarketingRecord {
  id: string;
  customerName: string;
  contactPerson: string;
  contactPhone: string;
  visitDate: string;
  visitContent: string;
  followUpPlan: string;
  status: '跟进中' | '已签约' | '已流失';
  customerManager: string;
}

// ---------- 协议 ----------
export interface Agreement {
  id: string;
  agreementNumber: string;
  productName: string;
  supplierName: string;
  startDate: string;
  endDate: string;
  status: '待签约' | '已签约';
}

// ---------- 菜单配置 ----------
export interface MenuItem {
  key: string;
  label: string;
  icon?: string;
  path?: string;
  children?: MenuItem[];
}

export type PortalType = 'admin' | 'supplier' | 'funder';

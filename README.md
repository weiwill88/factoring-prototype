# 保理系统可交互原型

> Interactive Factoring System Prototype

## 项目概述

这是一个基于 Next.js + Ant Design 的**保理公司业务系统可交互原型**。  
目的是通过前端原型验证业务流程和交互逻辑，为后续正式开发提供参照。

## 技术栈

| 技术 | 用途 |
|------|------|
| Next.js 15 (App Router) | 前端框架 |
| React 19 | UI 库 |
| Ant Design 5 | 中后台组件库 |
| TypeScript | 类型安全 |
| localStorage | Mock 数据持久化 |

## 项目结构

```
src/
├── app/                        # Next.js App Router 路由
│   ├── layout.tsx              # 全局布局
│   ├── page.tsx                # 首页
│   ├── supplier/               # 供应商端
│   │   ├── register/           # 注册流程
│   │   ├── credit/             # 我的额度
│   │   ├── financing/          # 融资申请
│   │   ├── assets/             # 资产管理
│   │   └── dashboard/          # 驾驶舱
│   ├── funder/                 # 资金方端
│   │   ├── customers/          # 客群管理
│   │   ├── credit/             # 额度管理
│   │   ├── business/           # 业务管理
│   │   ├── settlement/         # 结算
│   │   └── marketing/          # 市场经营
│   └── admin/                  # 银行管理端
│       ├── tags/               # 标签管理
│       ├── pricing/            # 产品定价
│       └── products/           # 产品管理
├── components/                 # 公共组件
│   ├── layout/                 # 布局组件
│   └── shared/                 # 通用业务组件
├── lib/                        # 工具库
│   ├── mock/                   # Mock 数据
│   ├── types/                  # TypeScript 类型定义
│   └── utils/                  # 工具函数
└── styles/                     # 样式文件
```

## 文档参照

- `docs/business_architecture.md` — 完整业务架构分析（模块/流程/状态机/计费规则/角色权限）
- `docs/image_analysis.md` — 68张原系统截图的结构化解析
- `docs/raw_document.md` — 原始需求文档文本提取
- `docs/reference/` — 关键参照截图

## 本地开发

```bash
npm install
npm run dev
```

打开 http://localhost:3000

## 部署

推送到 main 分支后，Vercel 自动部署。

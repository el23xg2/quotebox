---
name: QuoteBox MVP Plan
overview: QuoteBox是面向美国/欧洲自由职业者的极简报价、合同与发票管理工具。核心定位：只做HoneyBook最常用的三个功能，价格砍到1/4（$9/月），界面现代简洁，两周内出MVP。
todos:
  - id: setup-project
    content: 初始化 Next.js + Tailwind + Supabase + Vercel 部署
    status: completed
  - id: auth
    content: 用户认证（Supabase Auth + Magic Link）
    status: completed
  - id: client-crud
    content: 数据库表创建 + 客户管理 CRUD
    status: completed
  - id: quotes
    content: 报价创建、预览、发送、客户端查看
    status: completed
  - id: contracts
    content: 合同创建、电子签名、已签署 PDF
    status: completed
  - id: invoices
    content: 发票创建、Stripe 收款、状态追踪
    status: completed
  - id: pricing-paywall
    content: 定价页面、Stripe 订阅管理、付费墙
    status: completed
  - id: email-notifications
    content: 邮件通知（报价/合同/发票状态变更）
    status: completed
  - id: responsive
    content: 响应式适配 + 基础 SEO
    status: completed
isProject: false
---

# QuoteBox: 自由职业者报价/合同/收款工具 — 产品计划

## 一、产品目标

创建一个面向英语国家自由职业者的 Web 应用，帮助他们在 5 分钟内完成"报价 → 合同签署 → 收款"的完整流程。没有多余功能，没有学习曲线。

**关键数据目标：**
- 上线后 4 周内获取 50 个付费用户（MVP 验证）
- 6 个月内达到 500 个付费用户（$4,500 MRR）
- 退费率 < 5%（因为功能精简，用户不会因为"太复杂"而离开）

## 二、目标用户画像（Persona）

**名称：** Sarah, 美国婚礼摄影师
- 月收入：$5,000-12,000
- 现状：用 HoneyBook $36/月，但只用了报价+合同+发票三个功能
- 痛点：不想付 $36/月，但找不到更便宜的替代品（Workdeck 还要 $12/月，而且有太多她用不到的时钟/费用追踪功能）
- 她愿意付：$9/月，只要三个核心功能好用

**名称：** Mike, 自由 UI 设计师
- 月收入：$4,000-8,000
- 现状：用 Google Docs + PayPal 手动管理，每次出单要花 1-2 小时
- 痛点：想找一个工具但觉得 HoneyBook 太贵/功能太多
- 他愿意付：$9/月，只要能节省他每周 5 小时的行政时间

## 三、MVP 功能范围

### 核心功能（MVP 必须包含）：

**1. 客户管理**
- 添加客户：姓名、邮箱、电话、公司
- 客户列表：搜索、筛选
- 客户详情页：显示关联的报价、合同、发票

**2. 报价单（Quotes）**
- 创建报价：填写客户、服务项目（名称、描述、数量、单价）、自动计算总价
- 使用模板保存常用服务项目
- 发送给客户：生成在线链接
- 客户查看报价：浏览器打开，看到项目明细和总价
- 报价状态追踪：已发送、已查看、已接受、已拒绝
- 报价转合同：客户接受后一键转为合同

**3. 合同（Contracts）**
- 从报价创建合同或独立创建
- 合同模板：填写条款、服务范围、付款条件
- 电子签名：客户在线签名（手绘签名或打字签名）
- 合同状态：草稿、已发送、已签署、已过期
- 已签署 PDF 自动存储

**4. 发票（Invoices）**
- 从合同创建发票或独立创建
- 发票项目：自动带入合同中的服务项目
- 在线收款：对接 Stripe，客户点击链接直接付款
- 付款状态追踪：未付、部分付款、已付清
- 逾期提醒：自动或手动发送提醒

### MVP 不包含（刻意排除）：
- 时间追踪
- 费用/支出管理
- 项目管理/Kanban
- AI 功能
- 团队协作/多用户
- 移动端 App（先只做响应式 Web）
- 自动报表/分析
- 与 QuickBooks 等集成

## 四、定价方案

| 方案 | 价格 | 功能 |
|------|------|------|
| Free | $0 | 1 个客户，每月 3 份文档（报价+合同+发票合计） |
| Pro 月付 | $9/月 | 无限客户，无限文档，电子签名，Stripe 收款 |
| Pro 年付 | $99/年 | 省 $9，相当于 $8.25/月 |
| Lifetime | $249 | 一次性买断，适合大单自由职业者 |

支付按 $9/月定价与竞品对比：
- HoneyBook: $36/月（贵 4 倍）
- Bonsai: $9/月起（但功能太多）
- Workdeck: $12/月（还有时钟/费用追踪）
- Dubsado: $20/月起（更复杂）
- **QuoteBox: $9/月 — 最便宜的纯报价+合同+发票工具**

## 五、技术架构

```
前端（Next.js + Tailwind CSS）
  ├── Landing Page（产品介绍页）
  ├── 注册/登录（Magic Link 或 Google OAuth）
  ├── Dashboard（最近活动概览）
  ├── 客户管理（列表 + 详情 + 编辑）
  ├── 报价创建/编辑/预览/发送
  ├── 合同创建/编辑/预览/签名
  ├── 发票创建/编辑/预览/发送/收款
  └── 设置页面（个人信息、Stripe 对接、模板管理）

            │
     ┌──────┴──────┐
     │  Next.js    │
     │  API Routes │
     └──────┬──────┘
            │
     ┌──────┴──────┐
     │  Supabase   │
     │  (DB + Auth)│
     └──────┬──────┘
            │
     ┌──────┴──────┐
     │  Stripe     │
     │  (付款)     │
     └─────────────┘

外部工具：
  - @react-pdf/renderer：PDF 生成（报价单/合同/发票 PDF）
  - react-signature-canvas：电子签名
  - Stripe Checkout：在线收款 + 订阅管理
  - Supabase：数据库 + 用户认证 + 文件存储（存签署后的 PDF）
  - Vercel：部署
```

### 数据模型（核心表）

```
clients: id, user_id, name, email, phone, company, created_at

quotes: id, user_id, client_id, quote_number, status, 
        subtotal, tax, total, created_at, sent_at, viewed_at, accepted_at
  quote_items: id, quote_id, description, quantity, unit_price, amount

contracts: id, user_id, client_id, quote_id, title, content,
           status, signed_at, pdf_url, created_at
  contract_signatures: id, contract_id, type, signature_data, signed_at

invoices: id, user_id, client_id, contract_id, invoice_number,
          status, total, paid_amount, due_date, created_at, paid_at
  invoice_items: id, invoice_id, description, quantity, unit_price, amount
```

## 六、UI/UX 设计原则

### 设计风格
- **颜色主题**：深蓝 + 白色为主（专业、信任感），绿色为成功/确认
- **布局**：左侧导航栏（Logo + 4 个主菜单项），右侧内容区
- **字体**：Inter（干净、现代的无衬线字体）

### 关键页面的用户流程

**核心工作流（5 分钟完成）：**

```
添加客户 → 创建报价 → 发送报价链接 → 客户在线查看
  → 客户接受 → 自动转为合同 → 客户签名 → 自动转为发票
  → 客户付款（Stripe Checkout）→ 收到款项 → 结束
```

**报价创建页面流程：**
1. 选择客户（或新建）
2. 添加服务项（名称、描述、数量、单价）→ 自动计算
3. （可选）添加税率、折扣
4. 预览报价（看起来像一份专业的 PDF）
5. 一键发送（生成链接，自动发邮件给客户）
6. 客户打开链接 → 看到报价 → 点击"Accept" → 进入签名 → 进入付款

### 极简主义的体现
- 没有仪表盘饼图/统计数字（MVP 只显示最近文档列表）
- 每个页面只做一件事（创建报价就是纯创建报价，不塞其他信息）
- 表单使用垂直布局，字段最少化
- 关键操作按钮颜色突出（绿色"发送"、"签名"、"付款"）

## 七、两周 MVP 开发路线图

### 第 1 周：基础架构 + 客户 + 报价

| 天数 | 任务 | 产出 |
|------|------|------|
| Day 1 | Next.js 项目初始化，Tailwind 配置，Supabase 连接，部署到 Vercel | 一个能打开的空白页面 |
| Day 2 | 用户认证（Supabase Auth + Magic Link），登录/注册页面 | 用户可以注册登录 |
| Day 3 | 数据库表创建（clients, quotes, quote_items），客户管理 CRUD | 可以添加/查看客户 |
| Day 4 | 报价创建表单，项目行动态添加，自动计算，报价模板 | 可以创建报价 |
| Day 5 | 报价预览页面（PDF 样式，用 Tailwind 模拟），发送功能 | 报价可以预览和发送 |
| Day 6-7 | 客户端的报价查看页面（公开链接），接受/拒绝按钮，报价状态管理 | 客户可以打开链接查看报价 |

### 第 2 周：合同 + 发票 + 收款

| 天数 | 任务 | 产出 |
|------|------|------|
| Day 8 | 合同表创建，合同创建页面（从报价转换/独立创建），合同条款编辑 | 可以创建合同 |
| Day 9 | 电子签名功能（react-signature-canvas），签名流程，已签署 PDF 生成 | 客户可以在线签名 |
| Day 10 | 发票表创建，发票创建页面（从合同转换），发票预览 | 可以创建发票 |
| Day 11 | Stripe 集成：Stripe Checkout，付款回调，付款状态更新 | 客户可以付款 |
| Day 12 | 邮件通知（报价已发送、合同已签署、发票已付款），响应式适配 | 自动通知 |
| Day 13-14 | 定价页面，Stripe 订阅管理，支付墙（Free vs Pro），Bug 修复，基础 SEO | 产品可以发布 |

## 八、发布与推广计划

### Day 14-21：发布（零成本推广）

**第一步：Product Hunt 发布**
- 准备 Landing Page 截图和 GIF 演示
- 准备简短的产品描述（"HoneyBook, but $9/month and only the features you actually use"）
- 发布到 Product Hunt

**第二步：Reddit 推广**
- 在 r/freelance、r/weddingphotography、r/graphic_design、r/web_design 发帖
- 标题示例： "Built a $9/month alternative to HoneyBook — quotes, contracts, and invoices only. No bloat."
- 直接对比 HoneyBook 的定价

**第3步：Indie Hackers 分享**
- 写开发日志
- 分享 MRR 里程碑

**第4步：Google 搜索**
- SEO 针对 "honeybook alternative"、"freelance invoice tool" 等关键词
- Landing Page 做好 SEO meta

## 九、成本与收入模型

### 月运营成本
| 项目 | 成本 |
|------|------|
| Vercel Pro | $20/月 |
| Supabase Pro | $25/月 |
| 域名 quote-box.app (或其他) | ~$2/月 |
| SendGrid（邮件发送） | $0（免费额度 100 封/天，够了） |
| Stripe 手续费 | 2.9% + $0.30/笔（用户付的） |
| **总计** | **约 $47/月** |

### 营收测算
- 500 个 Pro 月付用户 × $9 = **$4,500 MRR**
- 假设 20% 用户选年付（$99/年 = $8.25/月），实际 MRR 会高约 5%
- 扣除 Stripe 手续费（~$130/月） + 运营成本（$47/月）
- **净利润：约 $4,323/月**

## 十、关键风险与应对

| 风险 | 可能性 | 应对 |
|------|--------|------|
| 用户觉得功能太少 | 中 | 先验证"只做三个功能"的假设，发布后 1 个月内根据反馈加 1-2 个高频请求的功能 |
| 电子签名法律效力不确定 | 低 | 采用行业标准（ESign Act/GDPR），在合同中注明签名类型 |
| Stripe 收款争议 | 低 | 使用 Stripe 的标准争议处理流程 |
| Workdeck 降价竞争 | 低 | Workdeck 已经有 $12/月，降到 $9 可能但他们会亏，且我们是纯三个功能更轻量 |
| 找不到种子用户 | 中 | 发布前就开始在 Reddit 互动，不要等到做好了才找人 |

## 十一、成功标准

- **1 个月内**：50 个付费用户（验证 PMF）
- **3 个月内**：200 个付费用户（$1,800 MRR）
- **6 个月内**：500 个付费用户（$4,500 MRR）
- 退费率 < 5%/月

如果 1 个月后少于 20 个付费用户，重新评估产品定位。如果 3 个月后少于 100 个付费用户，考虑 pivoted 到其他方向（比如只做发票，或者加回时间追踪等）。

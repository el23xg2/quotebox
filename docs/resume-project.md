# QuoteBox 项目经历 — 简历

> 投递岗位：AI 产品工程师（游戏 AI 助手方向）
> 项目链接：[quotebox.pro](https://quotebox.pro) | [github.com/el23xg2/quotebox](https://github.com/el23xg2/quotebox)

---

## 一句话描述

从市场调研到上线运营，用 Cursor（Claude）全程辅助开发了一款面向美国自由职业者的报价/合同/收款 SaaS，定价 $9/月，对打 HoneyBook（$36/月）。

---

## 我做了什么

- **市场调研与产品定义**：通过大量阅读 Reddit、Hacker News、G2、Trustpilot 的公开数据，识别到 HoneyBook 2025 年涨价 89%（$19→$36/月）引发大量自由职业者不满的明确信号。确定产品定位：只保留 3 个核心功能（报价、合同电子签名、发票收款），定价砍到 $9/月。
- **全栈开发**：独立完成 Next.js 16 + Supabase + Tailwind CSS 全栈应用，包括用户认证（Magic Link）、客户管理、报价创建/发送/查看/接受、合同在线签名（Canvas 手绘 + 打字双模式）、发票生成 + 在线支付（Creem Checkout）、付费墙（Free/Pro/Lifetime 三档）、邮件通知系统（Resend + 失败自动告警）。
- **Stripe → Creem 支付迁移**：因 Stripe 对中国创始人 KYC 流程不友好，独立调研并迁移到 Creem，重写 webhook 签名验证（HMAC-SHA256）、checkout 流程、订阅生命周期管理共 8 种事件。
- **SEO 与营销落地**：完成元标签优化、结构化数据（JSON-LD）、sitemap/robots.txt 配置、Google Search Console 提交。创建针对长尾关键词的落地页（"HoneyBook Alternative"、"Freelance Invoice Tool"），编写 2 篇 SEO 博客。上线一周内 Google 平均排名 6.7。
- **Product Hunt 发布**：独立完成截图、GIF 演示录制（FFmpeg 处理）、产品文案、First Comment 发布。

---

## AI 工具（Cursor/Claude）具体帮了什么

这是最核心的部分——整个项目 95% 以上的代码由 Cursor 中 Claude 生成，我不是"偶尔尝试 AI"，而是**把 AI 协作作为唯一工作流**：

| 环节 | AI 工具的具体作用 | 我的角色 |
|------|------------------|---------|
| **代码生成** | 所有页面组件、API routes、数据库 CRUD、webhook handler、邮件模板均由 Claude 生成。例如 `webhook/route.ts` 一次性生成 HMAC 签名验证 + 8 种事件处理 switch case。 | 我描述需求（"需要用 Creem webhook 处理这些事件类型"），检查生成的代码逻辑，修正签名验证的 timing-safe 比较方式。 |
| **需求拆解 & prompt 工程** | 我学会了一套方法论：先跟 AI 说清楚"现状是什么、我要改什么、期望结果是什么"，而不是模糊地说"帮我修 bug"。例如"Stripe checkout 要换成 Creem，API 签名方式变了，环境变量也变了，请批量替换所有相关文件"。 | 把产品需求翻译成 AI 可执行的明确指令，并在 AI 生成后做 QA：检查边界情况、错误处理、安全性。 |
| **调试 & 架构决策** | 支付迁移、签名验证、Supabase RLS 权限配置、Next.js 16 新 API（params 改为 Promise）等复杂问题，通过反复追问 Claude 找到根因。 | 判断 AI 建议的合理性——有些方案太复杂，我会说"简化一下，先不做 X"；有些方案不够安全，我要求补充。 |
| **非代码环节** | SEO meta 策略、产品文案、PH First Comment、Reddit 推广帖、数据库 schema 设计、数据模型关系——全部通过和 AI 对话完成。 | 提供行业背景（自由职业者痛点）、做最终决策、去人工执行 AI 做不了的事（Creem 后台配置、域名 DNS、Google Search Console 操作）。 |

---

## 关键数据（截至上线第 2 周）

- Google 搜索平均排名 6.7（全新域名，sitemap 提交后 2 天）
- 已收录页面：5 个
- Product Hunt 曝光：获得 upvotes 和自然评论
- 全部功能流程（注册→报价→签名→付款→邮件通知）已通过端到端测试
- 代码量：约 50+ 个页面/组件/API route 文件

---

## 可提供的展示材料

| 序号 | 内容 | 文件 |
|------|------|------|
| 1 | 首页 Hero | `docs/screenshots/1-homepage-hero.png` |
| 2 | 报价页 | `docs/screenshots/2-quote-page.png` |
| 3 | 合同签名页 | `docs/screenshots/3-contract-signing.png` |
| 4 | 发票支付页 | `docs/screenshots/4-invoice-page.png` |
| 5 | Dashboard | `docs/screenshots/5-dashboard.png` |
| 6 | 30 秒 Demo GIF | `docs/screenshots/quotebox-demo.gif` |
| - | 线上地址 | [quotebox.pro](https://quotebox.pro) |
| - | 源代码 | [github.com/el23xg2/quotebox](https://github.com/el23xg2/quotebox) |

---

## 与岗位要求的对应

| 岗位要求 | 匹配点 |
|---------|--------|
| "有实际用 Claude Code 完成项目的经验，是工作流的一部分" | 整项目 95%+ 代码由 Cursor/Claude 生成，不是偶尔用，是唯一工作流 |
| "能清晰拆解需求并与 code agent 高效沟通" | 展示了"把产品需求翻译成 AI 可执行指令"的具体方法论 |
| "具备基础代码能力，能读懂 AI 生成的代码，判断质量，做必要调整" | webhook 签名验证、边界情况检查、架构简化决策——都是具体例子 |
| "对 AI 产品有真实使用经验和自己的判断" | 不仅用过，还形成了 prompt 工程方法论和 AI 生成代码的 QA 流程 |
| "沟通清晰，能把想法转化为可执行的描述" | 整个项目文档化（MVP Plan、市场调研、推广策略） |
| "加分：有 GitHub 分享过自己做的东西" | 有公开 GitHub + 线上产品 |

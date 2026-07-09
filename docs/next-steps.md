# QuoteBox 下一步行动计划 - 更新

## 阶段一：修 Bug + 打磨 ✅ 已完成

| # | 任务 | 状态 |
|---|------|------|
| 1 | **统一金额显示** — 所有前端页面使用 `formatCurrency()` 统一显示美元金额 | ✅ |
| 2 | **邮件发件人修复** — 已改 `onboarding@resend.dev` | ✅ |
| 3 | **公开页面权限控制** — draft 不显示操作按钮 | ✅ |
| 4 | **按钮反馈** — 已加 alert 提示成功/失败 | ✅ |
| 5 | **客户端页面移动端适配** — 表格加 `overflow-x-auto`，canvas 签名支持触控 | ✅ |

## 阶段二：付费墙 ✅ 已完成

| # | 任务 | 状态 |
|---|------|------|
| 6 | **subscriptions 表 + RLS** — SQL 迁移已在 `supabase-migration.sql` 中 | ✅ |
| 7 | **Stripe webhook** — 处理订阅创建、续费、取消、一次性付款（lifetime） | ✅ |
| 8 | **创建订阅路由** — 关联当前用户，支持 subscription/payment 两种 mode | ✅ |
| 9 | **使用限制** — Free 用户限 3 个客户、5 份文档，达到限制时提示升级 | ✅ |
| 10 | **设置页面** — 显示真实计划、用量进度条、取消订阅按钮 | ✅ |
| 11 | **侧边栏** — 显示 Free/Pro 标识 | ✅ |

## 阶段三：准备发布

| # | 任务 | 说明 |
|---|------|------|
| 12 | **买域名** | 比如 `quotebox.app` 或 `quoteboxhq.com`（~$12/年） |
| 13 | **Landing Page 文案打磨** | 首页措辞优化，突出 "HoneyBook alternative — $9/month" |
| 14 | **准备截图/GIF** | 录屏演示完整流程（30 秒），准备 Product Hunt 发布素材 |

## 阶段四：发布推广

| # | 任务 | 说明 |
|---|------|------|
| 15 | **Reddit 发帖** | r/freelance、r/webdev、r/SaaS |
| 16 | **Product Hunt 发布** | 配合 Reddit 帖一起 |

---

## 在 Railway 部署前需要做的

1. **在 Stripe Dashboard 创建产品与价格**
   - 登录 Stripe Dashboard → 产品 → 添加产品
   - 创建 Pro Monthly：$9/月 → 获取 Price ID（形如 `price_xxxxx`）
   - 创建 Pro Yearly：$99/年 → 获取 Price ID
   - 创建 Lifetime：$249 → 获取 Price ID
   - 记下这三个 Price ID
2. **在代码中替换 price ID**
   - `src/app/dashboard/pricing/page.tsx` — 替换 `price_pro_monthly`、`price_pro_yearly`、`price_lifetime`
   - `src/app/api/stripe/create-subscription/route.ts` — 同上
   - `src/app/api/stripe/webhook/route.ts` — 同上
3. **配置 Stripe Webhook**
   - Stripe Dashboard → 开发者 → Webhooks → 添加端点
   - 端点 URL: `https://你的域名/api/stripe/webhook`
   - 事件: `checkout.session.completed`、`invoice.paid`、`customer.subscription.updated`、`customer.subscription.deleted`
   - 记下 Signing secret → 设置到 Railway 环境变量 `STRIPE_WEBHOOK_SECRET`
4. **运行 SQL 迁移**
   - 进入 Supabase Dashboard → SQL Editor
   - 运行 `supabase-migration.sql` 中的 CREATE TABLE subscriptions 和相关 RLS 策略

## 环境变量

```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx
NEXT_PUBLIC_APP_URL=https://quotes.example.com
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
```

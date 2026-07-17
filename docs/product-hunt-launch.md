# QuoteBox Product Hunt 发布物料

## Tagline（一句话）

> Quotes, contracts & invoices for $9/month — without the HoneyBook bloat.

## Description（产品描述）

**The problem:**

HoneyBook charges $36/month for a tool packed with features most solo freelancers never touch — Kanban boards, team collaboration, automations, pipelines. You're paying for an enterprise tool when all you need is three things: send a quote, get a contract signed, and send an invoice.

I was a freelance photographer for 3 years. I paid HoneyBook $432/year and used maybe 15% of its features. That's $1,296 wasted over 3 years for stuff I never clicked.

**The solution:**

QuoteBox does exactly three things and does them well:

1. **Quotes** — Create professional quotes with line items, tax, and discounts in seconds. Send a client link. They accept with one click.
2. **Contracts** — Auto-generate a contract from an accepted quote. Clients sign with a typed name or drawn signature — e-signatures included, legally binding.
3. **Invoices** — Generate invoices from contracts. Accept credit card payments. Track paid, overdue, and pending automatically.

That's it. No Kanban boards. No "workflow automations." No team seats. Just what you actually need to get paid.

**The pitch:**

- Free plan: 3 clients, 5 documents, no credit card required
- Pro: $9/month — unlimited everything
- That's 75% cheaper than HoneyBook
- Try it free at quotebox.pro

## First Comment（发布后第一个评论）

Hey everyone! I'm Xueyi, the solo founder behind QuoteBox.

**Why I built this:**

I was a freelance photographer for a few years and used HoneyBook the whole time. It's a solid tool, but I kept looking at my $36/month bill and thinking — I use 3 features out of 30. Quotes, contracts, invoices. That's it. Everything else was just noise.

So I built QuoteBox for myself. Three tools, one workflow: add client → create quote → client accepts → auto-generate contract with e-signature → invoice with payment link. Done. 5 minutes per client.

**The pricing choice:**

I priced it at $9/month because I think $36 is unreasonable for what most solo freelancers actually need. There's also a free plan (3 clients, 5 docs) because I want people to try it without giving me a credit card first.

**The tech stack (for the builders here):**
- Next.js + Supabase + Tailwind
- Payments via Creem (migrated from Stripe — long story involving KYC as a Chinese founder)
- Emails via Resend

**What's next:**
- PDF generation improvements
- Template saving for repeat clients
- Possibly a lifetime plan

Happy to answer any questions about building, pricing, or the Stripe-to-Creem migration story. Ask me anything!

🔗 quotebox.pro

---

## 截图清单

| # | 页面 | 说明 |
|---|------|------|
| 1 | 首页 Hero | 展示 "Quotes, Contracts & Invoices for Freelancers. $9/month" |
| 2 | 报价创建页 | 展示报价编辑界面，有 line items、client info |
| 3 | 合同签名页 | 展示 e-signature 界面（public view） |
| 4 | 发票页 | 展示发票详情，含 "Pay Now" 按钮 |
| 5 | Dashboard | 展示总览数据：总收入、待处理发票、最近活动 |

## GIF/视频脚本（30 秒）

1. 打开 Dashboard（2s）
2. 点击 "New Quote" → 添加 client → 添加 line items → 发送（8s）
3. 切换到 client 视角：打开 public quote link → 点击 Accept（5s）
4. 自动生成 contract → 展示 e-signature 界面（5s）
5. 切换到 invoice → 展示 "Pay Now" 按钮（5s）
6. 回到 Dashboard，展示 "Paid" 状态更新（5s）

总时长：~30 秒

---

## 发布 checklist

- [ ] Product Hunt 账号已创建
- [ ] 5 张截图已准备
- [ ] 30 秒 GIF/视频已录制
- [ ] Tagline & Description 已写好（见上文）
- [ ] First comment 已准备好
- [ ] 发布时间确定（周二/周三/周四 PST 午夜 = 北京时间 15:00）
- [ ] Hunter 名单已确定（3-5 人）

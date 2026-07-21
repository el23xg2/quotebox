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

## ⬇️ 明天直接复制下面这段，粘贴到 PH 评论区 ⬇️

Hey everyone — Xueyi here, solo maker from China.

I shot freelance photography for a few years. Paid HoneyBook $36/mo the whole time. Solid product, but I literally used 3 features out of 30. Quotes, contracts, invoices. Everything else just sat there while I paid $432 a year for it.

So I built QuoteBox. Does exactly those three things. Add a client → send a quote → client accepts → contract auto-generates with e-signatures → invoice with a pay link. Done in 5 minutes.

It's $9/mo for unlimited everything, and there's a free plan (3 clients, 5 docs) — no card needed.

Built with Next.js + Supabase + Tailwind. Payments run on Creem (switched from Stripe after a nightmare KYC process as a non-US founder — happy to share that story if anyone's curious).

Would love feedback from other freelancers here. Does this solve a real problem for you? What would make you switch?

🔗 quotebox.pro

---

## 截图清单


| #   | 页面        | 说明                                                          |
| --- | --------- | ----------------------------------------------------------- |
| 1   | 首页 Hero   | 展示 "Quotes, Contracts & Invoices for Freelancers. $9/month" |
| 2   | 报价创建页     | 展示报价编辑界面，有 line items、client info                           |
| 3   | 合同签名页     | 展示 e-signature 界面（public view）                              |
| 4   | 发票页       | 展示发票详情，含 "Pay Now" 按钮                                       |
| 5   | Dashboard | 展示总览数据：总收入、待处理发票、最近活动                                       |


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
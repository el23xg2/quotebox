# 邮件登录故障排查指南

## 症状

登录页面显示：
- `Sign in failed: Failed to fetch`
- 或 `Authentication service is unreachable`

## 根因（2026-08-05 诊断结果）

生产环境配置的 Supabase 项目 `mbwcyolsackplskpdkns.supabase.co` **DNS 无法解析（NXDOMAIN）**。

这意味着 Supabase 项目很可能已被**删除**或**长期暂停后回收**，而不是代码 bug。

## 快速诊断

部署后访问：

```
https://quotebox.pro/api/health
```

如果 `supabase_reachable` 为 `false` 且 detail 包含 `DNS lookup failed`，说明 Supabase 项目不可用。

## 修复步骤

### 1. 登录 Supabase Dashboard

访问 [https://supabase.com/dashboard](https://supabase.com/dashboard)

- 如果项目存在但显示 **Paused**：点击 **Restore project**
- 如果项目已删除：创建新项目，记下新的 Project URL 和 API keys

### 2. 配置新/恢复的项目

在 Supabase SQL Editor 中执行 `supabase-migration.sql`（新建项目时）。

在 **Authentication → URL Configuration** 中设置：

| 字段 | 值 |
|------|-----|
| Site URL | `https://quotebox.pro` |
| Redirect URLs | `https://quotebox.pro/auth/callback` |
| | `https://quotebox-production.up.railway.app/auth/callback` |

在 **Authentication → Providers → Email** 中启用 Magic Link。

### 3. 更新 Railway 环境变量

登录 [https://railway.app](https://railway.app)，找到 QuoteBox 项目，更新以下变量：

```
NEXT_PUBLIC_SUPABASE_URL=https://<your-new-project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<new-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<new-service-role-key>
NEXT_PUBLIC_APP_URL=https://quotebox.pro
```

**重要**：`NEXT_PUBLIC_*` 变量在 `next build` 时内联到前端代码中。修改后必须**重新部署**（触发完整 build），不能只 restart。

### 4. 验证

1. 等待 Railway 部署完成
2. 访问 `https://quotebox.pro/api/health`，确认所有 checks 为 `ok: true`
3. 在 `https://quotebox.pro/login` 输入邮箱测试 magic link

## 代码改进（本 PR）

- 登录改为服务端 API（`/api/auth/magic-link`），错误信息更清晰
- 新增 `/api/health` 健康检查端点，便于快速定位 Supabase 连接问题

## 需要你提供的信息

如果以上步骤无法自行完成，请提供：

1. **Supabase** 账号访问（或新的 Project URL + keys）
2. **Railway** 项目访问（或确认环境变量已更新并重新部署）

没有这两个平台的访问权限，无法从代码层面恢复已删除的 Supabase 项目。

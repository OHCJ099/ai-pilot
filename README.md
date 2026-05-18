# AI Pilot

统一管理多个 AI 编程助手 — 一键切换、并行对比、智能路由。

## 支持的 AI 工具

| 工具 | 命令 | 提供商 |
|------|------|--------|
| Claude Code | `claude` | Anthropic |
| Gemini CLI | `gemini` | Google |
| Codex | `codex` | OpenAI |
| DeepSeek TUI | `deepseek-tui` | DeepSeek |
| Reasonix | `reasonix` | DeepSeek-native |

## 安装

```bash
npm install -g ai-pilot
```

## 使用

```bash
# 查看已安装的 AI 工具
ai-pilot

# 启动指定工具
ai-pilot run claude
ai-pilot run reasonix

# 带提示词启动
ai-pilot run claude -p "帮我写一个排序算法"

# 智能路由 — 根据任务自动选择最合适的 AI
ai-pilot "fix the login bug"      # → Claude
ai-pilot "write a REST API"       # → Reasonix
ai-pilot "explain closures"       # → Gemini

# 并行对比 — 所有 AI 同时回答
ai-pilot compare "解释 JavaScript 闭包"
```

## 智能路由规则

- **调试/修复** → Claude Code
- **生成/创建** → Reasonix
- **解释/学习** → Gemini CLI
- **其他** → 第一个可用工具

## 为什么用 AI Pilot？

- 不用记住每个 AI 工具的启动命令
- 不确定哪个 AI 最擅长某个任务？用 `compare` 并行对比
- 根据任务类型自动选择最合适的 AI
- 一个入口管理所有 AI 编程助手

## License

MIT

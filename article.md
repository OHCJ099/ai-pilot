# AI Pilot：统一管理多个AI编程助手的CLI工具

## 前言

你是否同时安装了 Claude Code、Gemini CLI、Codex、DeepSeek TUI、Reasonix 等多个AI编程助手？每次都要记住不同的启动命令，还要纠结哪个AI最适合当前任务？

今天给大家介绍一个开源工具 **AI Pilot** — 统一管理多个AI编程助手，一键切换、并行对比、智能路由。

## 功能特性

### 1. 一键查看已安装的AI工具

```bash
$ ai-pilot

  AI Pilot — AI 编程助手管理器

  已安装的 AI 工具:

    ✓  Claude Code (Anthropic) (claude)
    ✓  Gemini CLI (Google) (gemini)
    ✓  Codex (OpenAI) (codex)
    ✓  DeepSeek TUI (deepseek-tui)
    ✓  Reasonix (DeepSeek-native) (reasonix)
```

### 2. 智能路由

根据任务内容自动选择最合适的AI：

- **调试/修复任务** → Claude Code（擅长代码理解和修复）
- **生成/创建任务** → Reasonix（擅长代码生成）
- **解释/学习任务** → Gemini CLI（擅长解释概念）

```bash
ai-pilot "fix the login bug"      # → 自动选择 Claude
ai-pilot "write a REST API"       # → 自动选择 Reasonix
ai-pilot "explain closures"       # → 自动选择 Gemini
```

### 3. 并行对比

不确定哪个AI最适合？让所有AI同时回答，对比结果：

```bash
ai-pilot compare "解释JavaScript闭包"
```

所有已安装的AI会同时运行，输出并排显示，方便对比。

### 4. 使用历史

自动记录使用历史，方便回顾：

```bash
ai-pilot history
```

## 安装

```bash
npm install -g ai-pilot
```

## 为什么开发这个工具？

作为一名同时使用多个AI编程助手的开发者，我发现：

1. 每个AI都有自己的启动命令和参数
2. 不同AI擅长不同类型的任务
3. 经常需要对比多个AI的回答

AI Pilot 就是为了解决这些问题而生的。

## 技术实现

AI Pilot 使用 TypeScript 编写，核心功能包括：

- **工具检测**：通过执行 `--version` 命令检测工具是否安装
- **智能路由**：基于关键词匹配选择最合适的AI
- **并行执行**：使用 Node.js 的 `child_process.spawn` 并行运行多个AI
- **历史记录**：使用 JSON 文件记录使用历史

## 开源地址

GitHub: https://github.com/OHCJ099/ai-pilot

欢迎 Star 和 PR！

## 总结

AI Pilot 是一个简单但实用的工具，帮助开发者更高效地使用多个AI编程助手。如果你也同时使用多个AI工具，不妨试试看。

---

*作者：OHCJ099*
*开源协议：MIT*

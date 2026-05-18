import { execSync, spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

interface AITool {
  name: string;
  cmd: string;
  args: string[];
  description: string;
  detect(): boolean;
}

const tools: AITool[] = [
  {
    name: "claude",
    cmd: "claude",
    args: [],
    description: "Claude Code (Anthropic)",
    detect() {
      try { execSync("claude --version", { stdio: "ignore" }); return true; } catch { return false; }
    },
  },
  {
    name: "gemini",
    cmd: "gemini",
    args: [],
    description: "Gemini CLI (Google)",
    detect() {
      try { execSync("gemini --version", { stdio: "ignore" }); return true; } catch { return false; }
    },
  },
  {
    name: "codex",
    cmd: "codex",
    args: [],
    description: "Codex (OpenAI)",
    detect() {
      try { execSync("codex --version", { stdio: "ignore" }); return true; } catch { return false; }
    },
  },
  {
    name: "deepseek-tui",
    cmd: "deepseek-tui",
    args: [],
    description: "DeepSeek TUI",
    detect() {
      try { execSync("deepseek-tui --version", { stdio: "ignore" }); return true; } catch { return false; }
    },
  },
  {
    name: "reasonix",
    cmd: "reasonix",
    args: ["code"],
    description: "Reasonix (DeepSeek-native)",
    detect() {
      try { execSync("reasonix --version", { stdio: "ignore" }); return true; } catch { return false; }
    },
  },
];

function detectAll(): AITool[] {
  return tools.filter((t) => t.detect());
}

function printStatus(installed: AITool[]) {
  console.log("\n  AI Pilot — AI 编程助手管理器\n");
  console.log("  已安装的 AI 工具:\n");
  for (const t of tools) {
    const ok = installed.some((i) => i.name === t.name);
    const mark = ok ? "✓" : "✗";
    const color = ok ? "\x1b[32m" : "\x1b[90m";
    console.log(`    ${color}${mark}\x1b[0m  ${t.description} (${t.name})`);
  }
  console.log();
}

function launchTool(tool: AITool, userArgs: string[]) {
  const args = [...tool.args, ...userArgs];
  console.log(`\x1b[36m▶ 启动 ${tool.description}...\x1b[0m\n`);
  const child = spawn(tool.cmd, args, { stdio: "inherit", shell: true });
  child.on("exit", (code) => process.exit(code ?? 0));
}

function compare(task: string, installed: AITool[]) {
  console.log(`\x1b[36m▶ 并行对比模式 — 任务: ${task}\x1b[0m\n`);
  const results: { name: string; output: string }[] = [];
  let done = 0;

  for (const tool of installed) {
    const args = [...tool.args, task];
    const child = spawn(tool.cmd, args, { shell: true, stdio: ["ignore", "pipe", "pipe"] });
    let output = "";
    child.stdout.on("data", (d: Buffer) => (output += d.toString()));
    child.stderr.on("data", (d: Buffer) => (output += d.toString()));
    child.on("exit", () => {
      results.push({ name: tool.name, output: output.trim() });
      done++;
      if (done === installed.length) {
        console.log("═══ 对比结果 ═══\n");
        for (const r of results) {
          console.log(`\x1b[33m── ${r.name} ──\x1b[0m`);
          console.log(r.output.slice(0, 2000));
          console.log();
        }
      }
    });
  }
}

function smartRoute(task: string, installed: AITool[]) {
  const lower = task.toLowerCase();
  let pick: AITool | undefined;
  if (lower.includes("debug") || lower.includes("fix") || lower.includes("bug")) {
    pick = installed.find((t) => t.name === "claude") ?? installed[0];
  } else if (lower.includes("write") || lower.includes("create") || lower.includes("generate")) {
    pick = installed.find((t) => t.name === "reasonix") ?? installed[0];
  } else if (lower.includes("explain") || lower.includes("learn")) {
    pick = installed.find((t) => t.name === "gemini") ?? installed[0];
  } else {
    pick = installed[0];
  }
  if (pick) {
    console.log(`\x1b[36m✦ 智能路由 → ${pick.description}\x1b[0m\n`);
    launchTool(pick, [task]);
  }
}

function showHelp() {
  console.log(`
  AI Pilot — 统一管理多个 AI 编程助手

  用法:
    ai-pilot                显示已安装的 AI 工具状态
    ai-pilot run <name>     启动指定 AI 工具
    ai-pilot run <name> -p  启动指定 AI 工具并传入提示词
    ai-pilot <prompt>       智能路由到最合适的 AI
    ai-pilot compare <p>    并行运行所有 AI 并对比结果
    ai-pilot help           显示此帮助

  示例:
    ai-pilot run claude
    ai-pilot run reasonix -p "帮我写一个排序算法"
    ai-pilot "fix the login bug"        → 自动选 Claude
    ai-pilot "write a REST API"         → 自动选 Reasonix
    ai-pilot compare "解释闭包"          → 所有 AI 同时回答
`);
}

const args = process.argv.slice(2);
const installed = detectAll();

if (args.length === 0) {
  printStatus(installed);
  process.exit(0);
}

if (args[0] === "help" || args[0] === "--help" || args[0] === "-h") {
  showHelp();
  process.exit(0);
}

if (args[0] === "status") {
  printStatus(installed);
  process.exit(0);
}

if (args[0] === "run") {
  const name = args[1];
  if (!name) { console.error("用法: ai-pilot run <name> [-p <prompt>]"); process.exit(1); }
  const tool = installed.find((t) => t.name === name);
  if (!tool) { console.error(`未找到已安装的 AI 工具: ${name}`); process.exit(1); }
  const pIdx = args.indexOf("-p");
  const userArgs = pIdx >= 0 ? args.slice(pIdx + 1) : [];
  launchTool(tool, userArgs);
} else if (args[0] === "compare") {
  const task = args.slice(1).join(" ");
  if (!task) { console.error("用法: ai-pilot compare <prompt>"); process.exit(1); }
  compare(task, installed);
} else {
  const task = args.join(" ");
  smartRoute(task, installed);
}

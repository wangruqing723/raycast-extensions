// Unicode 编码转换工具函数库

export interface UnicodeAnalysis {
  originalText: string;
  hex: string;
  javascript: string;
  unicode: string;
  decimal: string;
  codePoints: CodePoint[];
}

export interface CodePoint {
  char: string;
  code: number;
  hex: string;
  decimal: string;
}

// 检测输入类型
export function detectInputType(input: string): "text" | "unicode" | "unknown" {
  const trimmed = input.trim();

  // 检查 \uXXXX 格式
  if (/\\u[0-9a-fA-F]{4}/.test(trimmed)) {
    return "unicode";
  }

  // 检查 U+XXXX 格式
  if (/U\+[0-9a-fA-F]{4}/.test(trimmed)) {
    return "unicode";
  }

  // 检查十进制格式（纯数字和空格）
  if (/^\d+(\s+\d+)*$/.test(trimmed)) {
    return "unicode";
  }

  // 否则当作普通文本
  return "text";
}

// 将文本转换为十六进制格式（空格分隔）
export function toHexFormat(text: string): string {
  return [...text].map((char) => char.charCodeAt(0).toString(16).toUpperCase().padStart(4, "0")).join(" ");
}

// 将文本转换为 JavaScript \uXXXX 格式
export function toJSFormat(text: string): string {
  return [...text].map((char) => "\\u" + char.charCodeAt(0).toString(16).padStart(4, "0")).join("");
}

// 将文本转换为 Unicode 标准 U+XXXX 格式（空格分隔）
export function toUnicodeStdFormat(text: string): string {
  return [...text].map((char) => "U+" + char.charCodeAt(0).toString(16).toUpperCase().padStart(4, "0")).join(" ");
}

// 将文本转换为十进制格式（空格分隔）
export function toDecimalFormat(text: string): string {
  return [...text].map((char) => char.charCodeAt(0).toString()).join(" ");
}

// 从 \uXXXX 格式解码
function decodeJSFormat(input: string): string {
  return input.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
}

// 从 U+XXXX 格式解码
function decodeUnicodeStdFormat(input: string): string {
  return input.replace(/[Uu]\+([0-9a-fA-F]{4})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
}

// 从十进制格式解码
function decodeDecimalFormat(input: string): string {
  const numbers = input
    .trim()
    .split(/\s+/)
    .filter((n) => n && /^\d+$/.test(n));
  return numbers.map((num) => String.fromCharCode(parseInt(num, 10))).join("");
}

// 从十六进制格式解码
function decodeHexFormat(input: string): string {
  const trimmed = input.trim();
  // 移除所有空格然后分成 4 位一组
  const hexOnly = trimmed.replace(/\s+/g, "");
  const result = [];
  for (let i = 0; i < hexOnly.length; i += 4) {
    const hex = hexOnly.slice(i, i + 4);
    if (hex.length === 4) {
      result.push(String.fromCharCode(parseInt(hex, 16)));
    }
  }
  return result.join("");
}

// 解码 Unicode 序列
export function decodeUnicodeSequence(input: string): string {
  const trimmed = input.trim();

  // 尝试 \uXXXX 格式
  if (/\\u[0-9a-fA-F]{4}/.test(trimmed)) {
    return decodeJSFormat(trimmed);
  }

  // 尝试 U+XXXX 格式
  if (/[Uu]\+[0-9a-fA-F]{4}/.test(trimmed)) {
    return decodeUnicodeStdFormat(trimmed);
  }

  // 尝试十进制格式（纯数字和空格）
  if (/^\d+(\s+\d+)*$/.test(trimmed)) {
    return decodeDecimalFormat(trimmed);
  }

  // 尝试十六进制格式
  // 支持：4位一组（4F60 597D 或 4F60597D 都可以）
  if (/^[0-9a-fA-F]{4}([0-9a-fA-F]{4}|\s+[0-9a-fA-F]{4})*$/.test(trimmed)) {
    return decodeHexFormat(trimmed);
  }

  throw new Error("无法识别的 Unicode 格式");
}

// 生成代码点信息
export function getCodePoints(text: string): CodePoint[] {
  return [...text].map((char) => ({
    char,
    code: char.charCodeAt(0),
    hex: char.charCodeAt(0).toString(16).toUpperCase().padStart(4, "0"),
    decimal: char.charCodeAt(0).toString(),
  }));
}

// 主函数：分析 Unicode
export function analyzeUnicode(input: string): UnicodeAnalysis {
  const inputType = detectInputType(input);

  // 获取原始文本
  let originalText = "";
  if (inputType === "text") {
    originalText = input;
  } else {
    originalText = decodeUnicodeSequence(input);
  }

  return {
    originalText,
    hex: toHexFormat(originalText),
    javascript: toJSFormat(originalText),
    unicode: toUnicodeStdFormat(originalText),
    decimal: toDecimalFormat(originalText),
    codePoints: getCodePoints(originalText),
  };
}

// 生成 Markdown 展示结果
export function generateMarkdown(analysis: UnicodeAnalysis): string {
  const { originalText, hex, javascript, unicode, decimal, codePoints } = analysis;

  let markdown = `## Unicode 转换结果\n\n`;
  markdown += `**原始文本：** ${originalText}\n`;
  markdown += `**字符数：** ${originalText.length}\n\n`;

  markdown += `### 格式转换\n\n`;

  markdown += `#### 十六进制格式\n`;
  markdown += "```\n";
  markdown += hex + "\n";
  markdown += "```\n\n";

  markdown += `#### JavaScript 格式 (\\uXXXX)\n`;
  markdown += "```\n";
  markdown += javascript + "\n";
  markdown += "```\n\n";

  markdown += `#### Unicode 标准格式 (U+XXXX)\n`;
  markdown += "```\n";
  markdown += unicode + "\n";
  markdown += "```\n\n";

  markdown += `#### 十进制格式\n`;
  markdown += "```\n";
  markdown += decimal + "\n";
  markdown += "```\n\n";

  markdown += `### 字符详情\n\n`;
  markdown += `| 字符 | 十六进制 | 十进制 | JavaScript |\n`;
  markdown += `|------|--------|--------|------------|\n`;

  codePoints.forEach((cp) => {
    const jsFormat = `\\u${cp.hex}`;
    markdown += `| ${cp.char} | ${cp.hex} | ${cp.decimal} | ${jsFormat} |\n`;
  });

  return markdown;
}

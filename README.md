# Dev-Tool

一个功能丰富的 Raycast 扩展，提供各种开发工具：加密/解密、哈希生成、文本处理等。

## 功能特性

### 🔐 加密工具

- **SM4**: SM4 对称加密/解密，支持 ECB 和 CBC 模式，支持密钥历史记录
- **JWT**: JWT 解析和生成（HS256 算法），自动识别过期状态
- **Bcrypt**: Bcrypt 哈希生成和密码验证，支持自定义 Salt 位数（4-31）

### 🔗 编码工具

- **Base64**: Base64 编解码，支持从剪贴板快速转换
- **Hex**: 十六进制编解码
- **Hexadecimal**: 十六进制转义序列（\xXX）解码

### #️⃣ 哈希工具

- **MD5**: MD5 哈希生成
- **Hash**: 通用哈希生成（SHA512、SHA256、SHA1）
- **UUID**: UUID 生成，支持大小写和连字符控制

### 📝 文本工具

- **文本对比**: 行级文本对比，支持忽略大小写和空行

## 安装

### 前置要求

- Node.js 18+
- npm 10+

### 开发安装

```bash
# 克隆/下载项目
cd dev-tool

# 安装依赖
npm install

# 构建项目
npm run build

# 或进行本地开发
npm run dev
```

## 使用方法

### SM4 加密/解密

1. 打开 "SM4" 命令
2. 输入要加密或解密的文本
3. 选择操作模式（加密/解密）
4. 选择加密模式（ECB/CBC）
5. 如需，输入 IV（仅 CBC 模式需要）
6. 选择输出格式（Hex/Base64/UTF-8）
7. 运行

**注意**: 
- 密钥必须是 32 字符的十六进制字符串
- 加密输出默认为 Hex 格式，解密默认输出 UTF-8
- 系统自动保存最近 10 个使用过的密钥

### JWT 解析/生成

**解析模式**:
1. 输入完整的 JWT Token（格式：Header.Payload.Signature）
2. 自动解析并显示 Header、Payload 和签名
3. 时间戳自动转换为可读格式并标注过期状态

**生成模式**:
1. 输入 JSON 格式的 Payload（例：`{"sub":"123","exp":1710000000}`）
2. 输入 Secret（HS256 密钥）
3. 生成 JWT Token 并自动复制到剪贴板

### Bcrypt 哈希/验证

**哈希模式**:
1. 输入明文密码
2. 设置 Salt 位数（默认 12，范围 4-31）
3. 生成 Bcrypt 哈希值

**验证模式**:
1. 输入原始密码
2. 输入要验证的 Bcrypt 哈希
3. 验证是否匹配

### Base64 编解码

```bash
# 快速编码
raycast "Base64 Encode" "Your text here"

# 快速解码（默认）
raycast "Base64" "SGVsbG8gV29ybGQ="
```

从剪贴板读取：不带文本参数直接调用，将从剪贴板读取

### UUID 生成

```bash
# 生成标准 UUID（小写，带连字符）
raycast "UUID"

# 生成大写 UUID
raycast "UUID" "true" "false"

# 生成无连字符 UUID
raycast "UUID" "false" "true"
```

### Hash 生成

```bash
# SHA256 哈希（默认）
raycast "Hash" "sha256" "Your text"

# SHA512 哈希
raycast "Hash" "sha512" "Your text"

# SHA1 哈希
raycast "Hash" "sha1" "Your text"
```

### 文本对比

1. 打开 "文本对比" 命令
2. 在文本 A 中输入第一段文本
3. 在文本 B 中输入第二段文本
4. 可选：启用"忽略大小写"或"忽略空行"
5. 点击"Compare"查看差异

## 开发

### 项目结构

```
src/
├── __tests__/           # 单元测试
├── types/              # TypeScript 类型定义
├── utils/              # 工具函数
│   ├── guard.ts       # 输入验证
│   ├── input.ts       # 输入处理
│   └── result.ts      # 结果展示
├── hooks/             # React hooks
│   └── useFormAction.ts
├── *.ts               # 无界面命令
└── *-form.tsx         # 表单界面
```

### 脚本命令

```bash
# 开发模式
npm run dev

# 生产构建
npm run build

# 运行单元测试
npm test

# 监视测试
npm test:watch

# 类型检查
npm run type-check

# 代码检查
npm run lint

# 自动修复 lint 问题
npm run fix-lint

# 发布到 Raycast Store
npm run publish
```

### 添加新工具

1. 在 `src/` 目录创建工具文件（如 `my-tool.ts`）
2. 在 `package.json` 的 `commands` 数组中添加命令定义
3. 导出 `default` 异步函数处理逻辑
4. 使用 `utils/result.ts` 中的 `success` 和 `failure` 函数展示结果

示例：
```typescript
import { getInputText } from "./utils/input";
import { success, failure } from "./utils/result";

export default async function Command(props: { arguments: { text?: string } }) {
  try {
    const text = await getInputText(props.arguments.text);
    const result = /* 处理逻辑 */;
    await success(result, { title: "处理成功", hud: true });
  } catch (err) {
    await failure(err, "处理失败");
  }
}
```

### 类型安全

所有代码使用 TypeScript 严格模式，建议：
- 明确定义函数参数和返回类型
- 使用 `types/` 目录存储共享类型定义
- 运行 `npm run type-check` 验证类型
- 避免 `as unknown` 类型强制转换

## 测试

项目使用 Jest 进行单元测试，覆盖 utils 和编码转换逻辑。

```bash
# 运行所有测试
npm test

# 监视模式运行测试
npm test:watch

# 查看覆盖率
npm test -- --coverage
```

## 许可证

MIT

## 贡献

欢迎提交问题和改进建议！

## 更新日志

### v1.0.0

- ✨ 初始版本发布
- 📦 更新所有依赖到最新版本
- 🧪 添加单元测试框架和测试用例
- 🔧 改进代码质量和类型安全
- 📚 完善文档和使用示例


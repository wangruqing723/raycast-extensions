# 贡献指南

感谢你对 Dev-Tool 的兴趣！本文档将帮助你了解如何贡献代码。

## 开发工作流程

### 1. 环境设置

```bash
# 克隆项目
git clone <repository>
cd dev-tool

# 安装依赖
npm install

# 开始开发
npm run dev
```

### 2. 开发流程

```bash
# 创建功能分支
git checkout -b feature/my-feature

# 本地开发和测试
npm run dev

# 运行测试确保没有破坏
npm test
npm run type-check
npm run lint

# 提交更改
git add .
git commit -m "feat: add my feature"

# 推送并创建 Pull Request
git push origin feature/my-feature
```

## 代码规范

### TypeScript

- 所有代码使用 TypeScript 严格模式
- 明确定义所有函数的参数和返回类型
- 避免使用 `any` 类型
- 共享类型定义放在 `src/types/` 目录

### 文件命名

- 组件文件：kebab-case（如 `sm4-form.tsx`）
- 工具文件：kebab-case（如 `base64.ts`）
- 测试文件：`*.test.ts` 或 `*.test.tsx`

### 代码风格

- 使用 Prettier 格式化代码：`npm run fix-lint`
- 遵循 ESLint 规则
- 注释：仅在 WHY 不明显时添加，默认无注释

### 错误处理

```typescript
import { success, failure } from "./utils/result";

try {
  const result = await doSomething();
  await success(result, { title: "成功" });
} catch (err) {
  await failure(err, "失败");
}
```

## 添加新功能

### 添加新的命令工具

1. **创建工具文件** (`src/my-tool.ts`)

```typescript
import { getInputText } from "./utils/input";
import { success, failure } from "./utils/result";

export default async function Command(props: { arguments: { text?: string } }) {
  try {
    const text = await getInputText(props.arguments.text);
    const result = /* 你的逻辑 */;
    await success(result, { title: "处理成功" });
  } catch (err) {
    await failure(err, "处理失败");
  }
}
```

2. **更新 package.json** 添加命令配置

```json
{
  "name": "my-tool",
  "title": "My Tool",
  "subtitle": "工具描述",
  "description": "详细描述",
  "mode": "no-view",
  "arguments": [
    {
      "name": "text",
      "type": "text",
      "placeholder": "输入文本"
    }
  ]
}
```

3. **添加单元测试** (`src/__tests__/my-tool.test.ts`)

### 添加新的表单工具

1. **创建表单组件** (`src/my-form.tsx`)

```typescript
import { Form, ActionPanel, Action } from "@raycast/api";
import { useState } from "react";
import { success, failure } from "./utils/result";

export default function Command() {
  const [mode, setMode] = useState("default");

  async function onSubmit(values: { /* ... */ }) {
    try {
      const result = /* 你的逻辑 */;
      await success(result, { title: "成功" });
    } catch (err) {
      await failure(err, "失败");
    }
  }

  return (
    <Form actions={<ActionPanel><Action.SubmitForm title="Run" onSubmit={onSubmit} /></ActionPanel>}>
      {/* 表单字段 */}
    </Form>
  );
}
```

2. **更新 package.json** 添加命令配置（`mode: "view"`）

## 测试

### 运行测试

```bash
# 运行所有测试
npm test

# 监视模式
npm test:watch

# 覆盖率检查
npm test -- --coverage
```

### 编写测试

```typescript
describe("feature name", () => {
  it("should do something", () => {
    expect(true).toBe(true);
  });
});
```

## 提交规范

使用约定式提交：

- `feat:` 新功能
- `fix:` 修复 bug
- `docs:` 文档更新
- `refactor:` 代码重构
- `test:` 测试相关
- `chore:` 其他（依赖更新等）

示例：
```
feat: add new encryption tool
fix: correct base64 decoding error
docs: update README with examples
```

## Pull Request 流程

1. Fork 项目
2. 创建功能分支：`git checkout -b feature/amazing-feature`
3. 提交更改：`git commit -m 'feat: add amazing feature'`
4. 推送到分支：`git push origin feature/amazing-feature`
5. 提交 Pull Request

### PR 清单

- [ ] 代码遵循项目风格规范
- [ ] 所有测试通过 (`npm test`)
- [ ] 类型检查通过 (`npm run type-check`)
- [ ] Lint 检查通过 (`npm run lint`)
- [ ] 添加了必要的测试
- [ ] 更新了 README 或文档（如需要）

## 构建和发布

```bash
# 本地构建
npm run build

# 发布到 Raycast Store
npm run publish
```

## 问题排查

### 常见问题

**Q: TypeScript 编译错误**
```bash
npm run type-check
```

**Q: 依赖冲突**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Q: 测试失败**
```bash
npm test -- --verbose
```

## 发放新版本

1. 更新 `package.json` 版本号
2. 更新 `CHANGELOG.md`
3. 提交并创建版本 tag
4. 运行 `npm run publish`

## 许可证

所有贡献视为在 MIT 许可证下发布。

## 联系方式

有任何问题或建议，欢迎提交 Issue 或 Discussion。

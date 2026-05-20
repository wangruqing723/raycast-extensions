import { Form, ActionPanel, Action, Detail } from "@raycast/api";
import { useState } from "react";
import { analyzeUnicode, generateMarkdown } from "./utils/unicode";
import { failure } from "./utils/result";

export default function Command() {
  const [markdown, setMarkdown] = useState<string | null>(null);

  if (markdown) {
    return (
      <Detail
        markdown={markdown}
        actions={
          <ActionPanel>
            <Action.CopyToClipboard title="Copy Result" content={markdown} />
            <Action title="返回" onAction={() => setMarkdown(null)} />
          </ActionPanel>
        }
      />
    );
  }

  async function onSubmit(values: { input?: string }) {
    try {
      if (!values.input || !values.input.trim()) {
        throw new Error("请输入文本或 Unicode 序列");
      }

      const analysis = analyzeUnicode(values.input);
      const result = generateMarkdown(analysis);
      setMarkdown(result);
    } catch (err) {
      await failure(err, "转换失败");
    }
  }

  return (
    <Form
      navigationTitle="Unicode 编码转换"
      actions={
        <ActionPanel>
          <Action.SubmitForm title="转换" onSubmit={onSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextArea id="input" title="输入" placeholder="输入文本、\uXXXX 格式、U+XXXX 格式或十进制码点" />
    </Form>
  );
}

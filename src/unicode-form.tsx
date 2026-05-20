import { List, ActionPanel, Action } from "@raycast/api";
import { useEffect, useState } from "react";
import { analyzeUnicode, detectInputType, decodeUnicodeSequence } from "./utils/unicode";

export default function UnicodeCommand() {
  const [searchText, setSearchText] = useState("");
  const [result, setResult] = useState<{
    mode: "encode" | "decode";
    analysis?: ReturnType<typeof analyzeUnicode>;
    decodedText?: string;
  } | null>(null);

  useEffect(() => {
    if (!searchText.trim()) {
      setResult(null);
      return;
    }

    try {
      const inputType = detectInputType(searchText);

      // 输入是中文/普通文本 → 编码模式
      if (inputType === "text") {
        const analysis = analyzeUnicode(searchText);
        setResult({
          mode: "encode",
          analysis,
        });
      } else {
        // 输入是 Unicode 编码 → 解码模式
        const decodedText = decodeUnicodeSequence(searchText);
        const analysis = analyzeUnicode(decodedText);
        setResult({
          mode: "decode",
          analysis,
          decodedText,
        });
      }
    } catch {
      setResult(null);
    }
  }, [searchText]);

  // 编码模式：显示中文对应的三种编码格式
  if (result?.mode === "encode" && result.analysis) {
    const { originalText, hex, javascript, unicode } = result.analysis;
    const formats = [
      { label: "Hexadecimal (Hex)", value: hex },
      { label: "JavaScript (\\uXXXX)", value: javascript },
      { label: "Unicode Standard (U+XXXX)", value: unicode },
    ];

    return (
      <List searchBarPlaceholder="Enter text or Unicode code..." onSearchTextChange={setSearchText} filtering={false}>
        <List.Section title={`Encode: ${originalText}`}>
          {formats.map((fmt) => (
            <List.Item
              key={fmt.label}
              title={fmt.label}
              subtitle={fmt.value}
              actions={
                <ActionPanel>
                  <Action.CopyToClipboard content={fmt.value} title="Copy" />
                </ActionPanel>
              }
            />
          ))}
        </List.Section>
      </List>
    );
  }

  // 解码模式：显示 Unicode 编码对应的中文和详细信息
  if (result?.mode === "decode" && result.analysis) {
    const { originalText, codePoints } = result.analysis;

    return (
      <List searchBarPlaceholder="Enter text or Unicode code..." onSearchTextChange={setSearchText} filtering={false}>
        <List.Section title={`Decode: ${originalText} (${originalText.length} chars)`}>
          {codePoints.map((cp) => (
            <List.Item
              key={`${cp.char}-${cp.hex}`}
              title={`${cp.char}`}
              subtitle={`Hex: ${cp.hex} | Decimal: ${cp.decimal} | JS: \\u${cp.hex}`}
              actions={
                <ActionPanel>
                  <Action.CopyToClipboard content={cp.char} title="Copy Character" />
                  <Action.CopyToClipboard content={cp.hex} title="Copy Hex" />
                </ActionPanel>
              }
            />
          ))}
        </List.Section>
      </List>
    );
  }

  // 搜索框为空或加载中
  return (
    <List searchBarPlaceholder="Enter text or Unicode code..." onSearchTextChange={setSearchText} filtering={false} />
  );
}

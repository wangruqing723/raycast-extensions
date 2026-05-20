import { List, ActionPanel, Action } from "@raycast/api";
import { useEffect, useState } from "react";
import { analyzeUnicode, UnicodeAnalysis } from "./utils/unicode";

export default function UnicodeCommand() {
  const [searchText, setSearchText] = useState("");
  const [analysis, setAnalysis] = useState<UnicodeAnalysis | null>(null);

  useEffect(() => {
    if (!searchText.trim()) {
      setAnalysis(null);
      return;
    }

    try {
      const result = analyzeUnicode(searchText);
      setAnalysis(result);
    } catch {
      setAnalysis(null);
    }
  }, [searchText]);

  const items =
    analysis && searchText.trim()
      ? [
          { format: "十六进制 (Hex)", value: analysis.hex },
          { format: "JavaScript (\\uXXXX)", value: analysis.javascript },
          { format: "Unicode 标准 (U+XXXX)", value: analysis.unicode },
          { format: "十进制", value: analysis.decimal },
        ]
      : [];

  return (
    <List searchBarPlaceholder="输入文本或 Unicode 码点" onSearchTextChange={setSearchText} filtering={false}>
      {analysis && searchText.trim() && (
        <List.Section title={`原始文本: ${analysis.originalText} (${analysis.originalText.length} 字符)`}>
          {items.map((item) => (
            <List.Item
              key={item.format}
              title={item.format}
              subtitle={item.value}
              actions={
                <ActionPanel>
                  <Action.CopyToClipboard content={item.value} title="复制转换结果" />
                </ActionPanel>
              }
            />
          ))}
        </List.Section>
      )}
    </List>
  );
}

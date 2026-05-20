// SM4 加密配置的正确类型定义
export interface SM4EncryptOptions {
  mode: "ECB" | "CBC";
  iv?: string;
  inputEncoding: "utf8" | "hex" | "base64";
  outputEncoding: "utf8" | "hex" | "base64";
}

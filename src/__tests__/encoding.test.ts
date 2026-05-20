describe("base64 编解码", () => {
  it("应该正确编码 UTF-8 文本", () => {
    const text = "Hello World";
    const encoded = Buffer.from(text, "utf8").toString("base64");
    expect(encoded).toBe("SGVsbG8gV29ybGQ=");
  });

  it("应该正确解码 Base64", () => {
    const encoded = "SGVsbG8gV29ybGQ=";
    const decoded = Buffer.from(encoded, "base64").toString("utf8");
    expect(decoded).toBe("Hello World");
  });

  it("应该处理中文字符", () => {
    const text = "你好世界";
    const encoded = Buffer.from(text, "utf8").toString("base64");
    const decoded = Buffer.from(encoded, "base64").toString("utf8");
    expect(decoded).toBe(text);
  });
});

describe("hex 编解码", () => {
  it("应该正确转换文本为 hex", () => {
    const text = "Hello";
    const hex = Buffer.from(text, "utf8").toString("hex");
    expect(hex).toBe("48656c6c6f");
  });

  it("应该正确将 hex 转换回文本", () => {
    const hex = "48656c6c6f";
    const text = Buffer.from(hex, "hex").toString("utf8");
    expect(text).toBe("Hello");
  });
});

import {
  detectInputType,
  toHexFormat,
  toJSFormat,
  toUnicodeStdFormat,
  toDecimalFormat,
  decodeUnicodeSequence,
  getCodePoints,
  analyzeUnicode,
} from "../utils/unicode";

describe("Unicode 工具", () => {
  describe("detectInputType", () => {
    it("应该检测普通文本", () => {
      expect(detectInputType("hello")).toBe("text");
    });

    it("应该检测中文文本", () => {
      expect(detectInputType("你好")).toBe("text");
    });

    it("应该检测 \\uXXXX 格式", () => {
      expect(detectInputType("\\u4f60\\u597d")).toBe("unicode");
    });

    it("应该检测 U+XXXX 格式", () => {
      expect(detectInputType("U+4F60 U+597D")).toBe("unicode");
    });

    it("应该检测十进制格式", () => {
      expect(detectInputType("20320 22909")).toBe("unicode");
    });
  });

  describe("编码转换", () => {
    it("toHexFormat: 应该将中文转换为十六进制", () => {
      expect(toHexFormat("你好")).toBe("4F60 597D");
    });

    it("toHexFormat: 应该处理 ASCII 字符", () => {
      expect(toHexFormat("AB")).toBe("0041 0042");
    });

    it("toJSFormat: 应该将文本转换为 JavaScript 格式", () => {
      expect(toJSFormat("你好")).toBe("\\u4f60\\u597d");
    });

    it("toJSFormat: 应该处理 ASCII", () => {
      expect(toJSFormat("A")).toBe("\\u0041");
    });

    it("toUnicodeStdFormat: 应该将文本转换为 Unicode 标准格式", () => {
      expect(toUnicodeStdFormat("你好")).toBe("U+4F60 U+597D");
    });

    it("toDecimalFormat: 应该将文本转换为十进制", () => {
      expect(toDecimalFormat("你好")).toBe("20320 22909");
    });

    it("toDecimalFormat: 应该处理 ASCII", () => {
      expect(toDecimalFormat("AB")).toBe("65 66");
    });
  });

  describe("解码", () => {
    it("应该解码 \\uXXXX 格式", () => {
      expect(decodeUnicodeSequence("\\u4f60\\u597d")).toBe("你好");
    });

    it("应该解码 U+XXXX 格式（移除空格）", () => {
      expect(decodeUnicodeSequence("U+4F60U+597D")).toBe("你好");
    });

    it("应该解码大小写混合的 U+XXXX 格式", () => {
      expect(decodeUnicodeSequence("u+4f60u+597d")).toBe("你好");
    });

    it("应该解码十进制格式", () => {
      expect(decodeUnicodeSequence("20320 22909")).toBe("你好");
    });

    it("应该解码十六进制格式", () => {
      expect(decodeUnicodeSequence("4F60597D")).toBe("你好");
    });

    it("应该抛出错误对于无效格式", () => {
      expect(() => decodeUnicodeSequence("xyz123")).toThrow();
    });
  });

  describe("getCodePoints", () => {
    it("应该提取中文字符的码点信息", () => {
      const points = getCodePoints("你");
      expect(points).toHaveLength(1);
      expect(points[0].char).toBe("你");
      expect(points[0].code).toBe(0x4f60);
      expect(points[0].hex).toBe("4F60");
      expect(points[0].decimal).toBe("20320");
    });

    it("应该处理多个字符", () => {
      const points = getCodePoints("AB");
      expect(points).toHaveLength(2);
      expect(points[0].char).toBe("A");
      expect(points[1].char).toBe("B");
    });
  });

  describe("analyzeUnicode", () => {
    it("应该分析普通文本", () => {
      const analysis = analyzeUnicode("你好");
      expect(analysis.originalText).toBe("你好");
      expect(analysis.hex).toBe("4F60 597D");
      expect(analysis.javascript).toBe("\\u4f60\\u597d");
      expect(analysis.unicode).toBe("U+4F60 U+597D");
      expect(analysis.decimal).toBe("20320 22909");
    });

    it("应该分析 Unicode 序列并转换回文本", () => {
      const analysis = analyzeUnicode("\\u4f60\\u597d");
      expect(analysis.originalText).toBe("你好");
    });

    it("应该生成正确数量的码点信息", () => {
      const analysis = analyzeUnicode("ABC");
      expect(analysis.codePoints).toHaveLength(3);
    });
  });

  describe("边界情况", () => {
    it("应该处理空格分隔的十进制", () => {
      expect(decodeUnicodeSequence("65 66 67")).toBe("ABC");
    });

    it("应该处理单个字符", () => {
      const analysis = analyzeUnicode("A");
      expect(analysis.originalText).toBe("A");
      expect(analysis.hex).toBe("0041");
      expect(analysis.decimal).toBe("65");
    });

    it("应该处理混合 ASCII 和中文", () => {
      const analysis = analyzeUnicode("A你B");
      expect(analysis.originalText).toBe("A你B");
      expect(analysis.codePoints).toHaveLength(3);
    });

    it("应该处理特殊符号", () => {
      const analysis = analyzeUnicode("@#$");
      expect(analysis.codePoints).toHaveLength(3);
      expect(analysis.codePoints[0].char).toBe("@");
    });
  });

  describe("往返转换", () => {
    it("文本 → 十六进制 → 文本（移除空格）", () => {
      const original = "你好";
      const hex = toHexFormat(original).replace(/\s+/g, "");
      const decoded = decodeUnicodeSequence(hex);
      expect(decoded).toBe(original);
    });

    it("文本 → Unicode 标准 → 文本（移除空格）", () => {
      const original = "你好";
      const unicode = toUnicodeStdFormat(original).replace(/\s+/g, "");
      const decoded = decodeUnicodeSequence(unicode);
      expect(decoded).toBe(original);
    });

    it("文本 → 十进制 → 文本", () => {
      const original = "你好";
      const decimal = toDecimalFormat(original);
      const decoded = decodeUnicodeSequence(decimal);
      expect(decoded).toBe(original);
    });
  });
});

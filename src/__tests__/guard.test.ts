import { ensureNonEmpty, ensureBase64, ensureHex } from "../utils/guard";

describe("guard.ts", () => {
  describe("ensureNonEmpty", () => {
    it("应该抛出错误当值为空字符串时", () => {
      expect(() => ensureNonEmpty("")).toThrow("参数不能为空");
    });

    it("应该抛出错误当值只包含空格时", () => {
      expect(() => ensureNonEmpty("   ")).toThrow("参数不能为空");
    });

    it("应该返回字符串当值有效时", () => {
      expect(ensureNonEmpty("test")).toBe("test");
    });

    it("应该接受自定义错误消息", () => {
      expect(() => ensureNonEmpty("", "用户名")).toThrow("用户名不能为空");
    });
  });

  describe("ensureBase64", () => {
    it("应该抛出错误当长度不是4的倍数时", () => {
      expect(() => ensureBase64("YQ=")).toThrow();
    });

    it("应该接受有效的 Base64", () => {
      expect(ensureBase64("SGVsbG8gV29ybGQ=")).toBe("SGVsbG8gV29ybGQ=");
    });

    it("应该拒绝无效字符", () => {
      expect(() => ensureBase64("!!!!")).toThrow();
    });

    it("应该支持带 = 的 Base64", () => {
      expect(ensureBase64("dGVzdA==")).toBe("dGVzdA==");
    });
  });

  describe("ensureHex", () => {
    it("应该抛出错误当长度是奇数时", () => {
      expect(() => ensureHex("abc")).toThrow("非法 Hex：长度必须是偶数");
    });

    it("应该接受有效的 Hex", () => {
      expect(ensureHex("abcdef")).toBe("abcdef");
    });

    it("应该接受大写 Hex", () => {
      expect(ensureHex("ABCDEF")).toBe("ABCDEF");
    });

    it("应该拒绝无效字符", () => {
      expect(() => ensureHex("gggg")).toThrow("非法 Hex：只能包含 0-9 a-f A-F");
    });

    it("应该支持大小写混合", () => {
      expect(ensureHex("AbCdEf")).toBe("AbCdEf");
    });
  });
});

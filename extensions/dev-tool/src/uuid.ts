import crypto from "crypto";
import { success, failure } from "./utils/result";

export default async function Command(props: { arguments: { dash?: string; upper?: string } }) {
  try {
    const { dash, upper } = props.arguments;

    // 将字符串参数转换为布尔值
    // 默认：dash 为 true （保留连接符）， upper 为 true （小写）
    const delDash = dash !== undefined && dash !== "" && dash !== "true";
    const toUpper = upper !== undefined && upper !== "" && upper !== "true";

    let uuid: string = crypto.randomUUID();

    if (delDash) {
      uuid = uuid.replace(/-/g, "");
    }
    if (toUpper) {
      uuid = uuid.toUpperCase();
    }

    await success(uuid, { title: "UUID 成功", hud: true });
  } catch (error) {
    await failure(error, "生成 UUID 失败");
  }
}

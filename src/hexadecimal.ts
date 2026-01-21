// src/base64.ts
import { getInputText } from "./utils/input";
import { success, failure } from "./utils/result";

export default async function Command(props: {
  arguments: { text?: string };
}) {
  try {
    const text = await getInputText(props.arguments.text);

    const result =
      Buffer.from(text.replace(/\x([0-9a-fA-F]{2})/g,(m,p)=>String.fromCharCode(parseInt(p,16))),'binary').toString('utf8');

    await success(result, { title: "Decode 成功" });
  } catch (err) {
    await failure(err, "Decode 失败");
  }
}

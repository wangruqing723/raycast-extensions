import { getInputText } from "./utils/input";
import { success, failure } from "./utils/result";

export default async function Command(props: { arguments: { text?: string } }) {
    try {
        const text = await getInputText(props.arguments.text);

        // 1) 用 \\x 的正则（\\ 在源码中表示字面 \）
        const replaced = text.replace(/\\x([0-9a-fA-F]{2})/g, (_, hex) =>
            String.fromCharCode(parseInt(hex, 16))
        );

        // 2) 把由上步得到的“latin1 表示的字节字符序列”转换回 bytes，然后 UTF-8 解码
        const buf = Buffer.from(replaced, "latin1"); // 'latin1' 明确指定单字节编码
        const result = buf.toString("utf8");
        await success(result, { title: "Decode 成功", hud: true });
    } catch (err) {
        await failure(err, "Decode 失败");
    }
}

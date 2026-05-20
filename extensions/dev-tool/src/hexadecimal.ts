import { getInputText } from "./utils/input";
import { success, failure } from "./utils/result";

function decodeHexToUtf8(text: string): string {
  const replaced = text.replace(/\\x([0-9a-fA-F]{2})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
  const buf = Buffer.from(replaced, "latin1");
  return buf.toString("utf8");
}

export default async function Command(props: { arguments: { text?: string } }) {
  try {
    const text = await getInputText(props.arguments.text);

    if (!text.includes("\\x")) {
      throw new Error("input does not contain valid hex escape sequence (\\xXX)");
    }

    const result = decodeHexToUtf8(text);
    await success(result, { title: "Decode success", hud: true });
  } catch (err) {
    await failure(err, "Decode failed");
  }
}

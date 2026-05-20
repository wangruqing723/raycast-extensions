import { useCallback } from "react";
import { success, failure } from "../utils/result";

interface FormActionOptions {
  title: string;
  hud?: boolean;
}

export function useFormAction() {
  const handleSuccess = useCallback(async (result: string, options: FormActionOptions) => {
    await success(result, {
      title: `${options.title}成功`,
      hud: options.hud,
    });
  }, []);

  const handleError = useCallback(async (error: unknown, title: string) => {
    await failure(error, title);
  }, []);

  return { handleSuccess, handleError };
}

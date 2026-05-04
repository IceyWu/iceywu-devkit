type AnyFunction = (...args: readonly any[]) => unknown;

export interface DebounceOptions {
  /** Execute on the leading edge instead of the trailing edge. */
  readonly immediate?: boolean;
}

export interface DebouncedFunction<F extends AnyFunction> {
  (...args: Parameters<F>): ReturnType<F> | undefined;
  readonly isPending: boolean;
  clear(): void;
  flush(): void;
  trigger(): void;
}

/**
 * @description 延迟调用，最后一次调用后 wait 毫秒才执行。语义与
 * `debounce@3` 一致：提供 `isPending` / `clear()` / `flush()` / `trigger()` 控制
 * 接口，并会在 `function_` 非函数、`wait` 为负、或 `options` 为 boolean 时
 * 抛出对应的 TypeError / RangeError。
 */
export function debounce<F extends AnyFunction>(
  function_: F,
  wait = 100,
  options: DebounceOptions = {}
): DebouncedFunction<F> {
  if (typeof function_ !== "function") {
    throw new TypeError(
      `Expected the first parameter to be a function, got \`${typeof function_}\`.`
    );
  }
  if (wait < 0) {
    throw new RangeError("`wait` must not be negative.");
  }
  if (typeof options === "boolean") {
    throw new TypeError(
      "The `options` parameter must be an object, not a boolean. Use `{immediate: true}` instead."
    );
  }

  const { immediate } = options;

  let storedContext: unknown;
  let storedArguments: Parameters<F> | undefined;
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  let timestamp = 0;
  let result: ReturnType<F> | undefined;

  function run(): ReturnType<F> | undefined {
    const callContext = storedContext;
    const callArguments = storedArguments;
    storedContext = undefined;
    storedArguments = undefined;
    result = (function_ as (...a: any[]) => ReturnType<F>).apply(
      callContext,
      (callArguments ?? []) as any[]
    );
    return result;
  }

  function later(): void {
    const last = Date.now() - timestamp;
    if (last < wait && last >= 0) {
      timeoutId = setTimeout(later, wait - last);
    } else {
      timeoutId = undefined;
      if (!immediate) {
        result = run();
      }
    }
  }

  const debounced = function (
    this: unknown,
    ...arguments_: Parameters<F>
  ): ReturnType<F> | undefined {
    if (
      storedContext &&
      this !== storedContext &&
      Object.getPrototypeOf(this) === Object.getPrototypeOf(storedContext)
    ) {
      throw new Error(
        "Debounced method called with different contexts of the same prototype."
      );
    }

    storedContext = this;
    storedArguments = arguments_;
    timestamp = Date.now();

    const callNow = immediate && !timeoutId;
    if (!timeoutId) {
      timeoutId = setTimeout(later, wait);
    }
    if (callNow) {
      result = run();
      return result;
    }
  } as DebouncedFunction<F>;

  Object.defineProperty(debounced, "isPending", {
    get(): boolean {
      return timeoutId !== undefined;
    },
  });

  debounced.clear = (): void => {
    if (!timeoutId) {
      return;
    }
    clearTimeout(timeoutId);
    timeoutId = undefined;
    storedContext = undefined;
    storedArguments = undefined;
  };

  debounced.flush = (): void => {
    if (!timeoutId) {
      return;
    }
    debounced.trigger();
  };

  debounced.trigger = (): void => {
    result = run();
    debounced.clear();
  };

  return debounced;
}

/**
 * @description 获取文件类型
 * @param url 文件地址
 * @returns { image, video, pdf, document, audio, zip, excel, ppt, code, executable, presentation, other }
 */
export function getFileType(url: string): string {
  if (!url) {
    return "other";
  }
  const fileTypes: { [key: string]: string[] } = {
    image: [
      "jpg",
      "jpeg",
      "png",
      "gif",
      "webp",
      "svg",
      "bmp",
      "tiff",
      "ico",
      "heic",
      "heif",
      "raw",
      "cr2",
      "nef",
      "orf",
      "sr2",
      "psd",
      "ai",
      "eps",
      "indd",
    ],
    video: ["mp4", "avi", "mov", "mkv", "flv", "wmv", "webm", "mpeg", "3gp"],
    pdf: ["pdf"],
    document: ["doc", "docx", "txt", "rtf", "odt", "md", "tex"],
    audio: ["mp3", "wav", "ogg", "flac", "aac", "m4a", "wma", "aiff"],
    zip: ["zip", "rar", "7z", "tar", "gz", "bz2", "xz"],
    excel: ["xls", "xlsx", "csv", "ods"],
    ppt: ["ppt", "pptx", "odp", "key"],
    code: [
      "js",
      "html",
      "css",
      "java",
      "cpp",
      "py",
      "ts",
      "rb",
      "php",
      "cs",
      "go",
      "rs",
      "swift",
      "kt",
      "scala",
    ],
    executable: ["exe", "msi", "bat", "sh", "bin", "apk", "dmg", "iso"],
    presentation: ["key", "odp"],
  };
  const fileExtension = url.split(".").pop()?.toLowerCase();
  for (const fileType in fileTypes) {
    if (fileTypes[fileType].includes(fileExtension!)) {
      return fileType;
    }
  }
  return "other";
}

/**
 * @description 格式化数字，添加千位分隔符
 * @param num 数字
 * @returns { string } string:格式化后的数字
 */
export function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * @description 节流函数
 * @param func 函数
 * @param delay 延迟时间
 * @returns { Function } Function:节流函数
 * @example
 * ```
 * const handler = throttle(() => console.log("tick"), 200);
 * ```
 */
export function throttle(func: Function, delay: number): Function {
  let timer: NodeJS.Timeout;
  let lastExecTime = 0;
  return function (this: any, ...args: any[]) {
    const currentTime = Date.now();
    const remainingTime = delay - (currentTime - lastExecTime);
    clearTimeout(timer);
    if (remainingTime <= 0) {
      func.apply(this, args);
      lastExecTime = currentTime;
    } else {
      timer = setTimeout(() => {
        func.apply(this, args);
        lastExecTime = Date.now();
      }, remainingTime);
    }
  };
}

export default {
  getFileType,
  formatNumber,
  throttle,
  debounce,
};

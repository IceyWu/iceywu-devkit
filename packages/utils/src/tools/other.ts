import debounce from "debounce";
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
 * @description 生成指定长度的随机字符串
 * @param length 长度
 * @returns { string } string:随机字符串
 */
export function randomString(length: number): string {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

/**
 * @description 节流函数
 * @param func 函数
 * @param delay 延迟时间
 * @returns { Function } Function:节流函数
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

export { debounce };

export default {
  getFileType,
  formatNumber,
  randomString,
  throttle,
};

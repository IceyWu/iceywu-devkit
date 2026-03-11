import dayjs from "dayjs";

export function formatTime(
  value: string | number | null | undefined,
  format = "YYYY-MM-DD HH:mm:ss",
  isIso = true
): string {
  if (!value) {
    return "未知";
  }

  try {
    let timestamp = value;
    if (isIso) {
      timestamp = new Date(value).getTime();
    }

    if (timestamp.toString().length < 13) {
      timestamp = Number(timestamp) * 1000;
    }

    return dayjs(timestamp).format(format);
  } catch {
    return "格式错误";
  }
}

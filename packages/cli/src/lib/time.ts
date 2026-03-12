import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone.js";
import utc from "dayjs/plugin/utc.js";

dayjs.extend(utc);
dayjs.extend(timezone);

const DEFAULT_TIMEZONE = "Asia/Shanghai";

export function formatTime(
  value: string | number | null | undefined,
  format = "YYYY-MM-DD HH:mm:ss",
  isIso = true
): string {
  if (!value) {
    return "未知";
  }

  try {
    if (isIso) {
      return dayjs.utc(value).tz(DEFAULT_TIMEZONE).format(format);
    }

    let timestamp = value;

    if (timestamp.toString().length < 13) {
      timestamp = Number(timestamp) * 1000;
    }

    return dayjs(Number(timestamp)).tz(DEFAULT_TIMEZONE).format(format);
  } catch {
    return "格式错误";
  }
}

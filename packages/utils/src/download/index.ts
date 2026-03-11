export interface DownloadFileReturn {
  // onSuccess: any;
  // onProcess: any;
  // onError: any;
  stop: () => void;
}
export interface RequestHeader {
  [key: string]: string;
}
export interface DownloadFileOptions {
  header: RequestHeader[] | undefined;
}
/**
 * @param blob file blob(文件blob)
 * @fileName file name(文件名)
 * @return void
 * @description create download file(创建下载文件)
 */
export function createDownload(blob: Blob, fileName: string) {
  if (!(blob && fileName)) {
    return;
  }
  const element = document.createElement("a");
  const url = window.URL.createObjectURL(blob);
  element.style.display = "none";
  element.href = url;
  element.download = `${fileName}`;
  document.body.appendChild(element);
  element.click();
  if (window.URL) {
    window.URL.revokeObjectURL(url);
  } else {
    window.webkitURL.revokeObjectURL(url);
  }
  document.body.removeChild(element);
}

/**
 * @description download file from url(下载文件)
 * @param url file url(文件地址)
 * @param fileName file name(文件名)
 * @param callbackList { onSuccess:下载成功 onProcess:下载进度 onError:下载失败 }
 * @param callbackList.onSuccess 下载成功回调
 * @param callbackList.onProcess 下载进度回调
 * @param callbackList.onError 下载失败回调
 * @param option request header(请求头)
 * @returns { stop } stop:停止下载
 */
export function downloadFile(
  url: string,
  fileName: string,
  callbackList?: {
    onSuccess?: (response: any) => void;
    onProcess?: (event: any) => void;
    onError?: (event: any) => void;
  },
  option?: DownloadFileOptions
): DownloadFileReturn {
  const xhr = new XMLHttpRequest() as any;
  const stop = () => {
    xhr.abort();
  };
  xhr.open("GET", url, true);
  const { header } = option || {};
  if (header) {
    Object.keys(header).forEach((key: string) => {
      xhr.setRequestHeader(key, header[key as keyof typeof header]);
    });
  }
  xhr.responseType = "blob";
  xhr.send();
  const { onSuccess, onProcess, onError } = callbackList || {};
  xhr.onload = function () {
    if (this.status === 200) {
      onSuccess && onSuccess(this.response);
      createDownload(this.response, fileName);
    } else {
      onError && onError(this);
    }
  };
  xhr.onprogress = (e: any) => {
    onProcess && onProcess(e);
  };
  xhr.onerror = (e: any) => {
    onError && onError(e);
  };
  return {
    stop,
  };
}

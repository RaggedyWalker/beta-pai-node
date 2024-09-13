export class BaseException extends Error {
  // 状态码
  status: number | undefined;
  code: number | undefined;
}
export class UndefinedConfigureError extends BaseException {
  status = 500;
  code = 500001;
  constructor(msg?: string) {
    super();
    this.message = msg || '未找到配置枚举';
  }
}

export class ExternalRequestError extends BaseException {
  status = 500;
  code = 500002;
  constructor(msg?: string) {
    super();
    this.message = msg || '未找到配置枚举';
  }
}

export class BusinessError extends BaseException {
  status = 500;
  code = 500003;
  constructor(msg?: string) {
    super();
    this.message = msg || '业务错误';
  }
}

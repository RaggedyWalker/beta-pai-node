// 系统枚举值列表类型
export type EnumList = EnumObject[];
type EnumObject = {
  label: string;
  value: string | number;
};

// 对象键值类型
export type objectKey<T> = keyof T;

export interface BusinessError extends Error {
  code: number;
  message: string;
  status: number;
}

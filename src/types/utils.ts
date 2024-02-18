// 系统枚举值列表类型
export type EnumList = EnumObject[];
type EnumObject = {
  label: string;
  value: string | number;
};

// 对象键值类型
export type objectKey<T> = keyof T;

/**
 * Represents a business error that occurs during the execution of a program.
 * @interface
 */
export interface BusinessError extends Error {
  code: number;
  message: string;
  status: number;
}

/**
 * Represents a paginated list of elements.
 *
 * @template T The type of elements in the page.
 */
export interface Page<T> {
  pageSize: number;
  currentPage: number;
  total: number;
  list: T[];
}

export interface FetchResult {
  [key: string]: string | number;
}

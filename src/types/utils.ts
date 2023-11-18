// 返回系统枚举值类型，均显示为label,value数组
export type EnumList = EnumObject[];
type EnumObject = {
  label: string;
  value: string | number;
};

import { EnumTypes } from "types";
import { getListFromEnum, translateEnum } from "utils";

type Props = {
  id: string;
  name: string;
  enumType: EnumTypes;
  defaultValue?: number;
  required?: boolean;
};

export default function EnumSelect({ enumType, defaultValue, ...props }: Props) {
  let enumList = getListFromEnum(enumType)

  if (defaultValue !== undefined) {
    enumList = enumList.filter(enumVal => enumVal !== defaultValue);
    enumList.unshift(defaultValue);
  }

  return (
    <select {...props}>
      {enumList.map((enumVal, i) => (
        <option key={i} value={enumVal}
        >{translateEnum(enumVal, enumType)}</option>
      ))}
    </select>
  );
}
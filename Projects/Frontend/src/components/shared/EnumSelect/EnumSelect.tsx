import { EnumTypes } from "types";
import { getListFromEnum, translateEnum } from "utils";

type Props = {
  id: string;
  name: string;
  enumType: EnumTypes;
  defaultValue?: number;
}

export default function EnumSelect({ id, name, enumType, defaultValue }: Props) {
  return (
    <select id={id} name={name}>
      {getListFromEnum(enumType).map((enumVal, i) => (
        <option key={i} value={enumVal} 
          defaultValue={defaultValue === enumVal ? defaultValue : undefined}
        >{translateEnum(enumVal, enumType)}</option>
      ))}
    </select>
  );
}
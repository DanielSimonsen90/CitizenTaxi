import { EnumTypes } from "types";
import { getListFromEnum, translateEnum } from "utils";

type Props = {
  id: string;
  name: string;
  enumType: EnumTypes;
}

export default function EnumSelect({ id, name, enumType }: Props) {
  return (
    <select id={id} name={name}>
      {getListFromEnum(enumType).map((enumVal, i) => (
        <option key={i} value={enumVal}>{translateEnum(enumVal)}</option>
      ))}
    </select>
  );
}
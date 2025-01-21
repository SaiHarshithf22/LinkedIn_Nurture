import { CustomCheckbox } from "../CustomCheckbox/CustomCheckbox";

export const ProfileCheckbox = ({ data, name }) => {
  return <CustomCheckbox initialValue={data?.value} name={name} />;
};

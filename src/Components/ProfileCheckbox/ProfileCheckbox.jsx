import { CustomCheckbox } from "../CustomCheckbox/CustomCheckbox";

export const ProfileCheckbox = ({ data, name }) => {
  return <CustomCheckbox checked={data?.value} name={name} />;
};

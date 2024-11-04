import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GenericOption } from "@/model/generic";

interface SelectGenericProps {
  name: string;
  placeholder: string;
  options: GenericOption[];
  defaultValue?: string;
}

const SelectGeneric = ({
  name,
  placeholder,
  options,
  defaultValue,
}: SelectGenericProps) => {
  return (
    <Select name={name} defaultValue={defaultValue}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{placeholder}</SelectLabel>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default SelectGeneric;

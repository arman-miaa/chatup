/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type TPHSelectProps = {
  label: string;
  name: string;
  control: any;
  disabled?: boolean;
  options?:
    | {
        value: string;
        label: string;
        disabled?: boolean;
      }[];
};

const PHSelect = ({
  label,
  name,
  control,
  options,
  disabled,
}: TPHSelectProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-2 w-full">
          <FormLabel>{label}</FormLabel>

          <FormControl>
            <Select
              disabled={disabled}
              onValueChange={field.onChange}
              value={field.value}
            >
              <SelectTrigger className="w-full py-6">
                <SelectValue placeholder={`Select ${label}`} />
              </SelectTrigger>

              <SelectContent>
                {options?.map((opt) => (
                  <SelectItem
                    key={opt.value}
                    value={opt.value}
                    disabled={opt.disabled}
                  >
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default PHSelect;

/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

type PHInputProps = {
  type?: string;
  name: string;
  label?: string;
  disabled?: boolean;
  placeholder?: string;
  control: any;
};

const PHInput = ({
  type = "text",
  name,
  label,
  disabled,
  placeholder,
  control,
}: PHInputProps) => {
  const isPassword = type === "password";
  const [showPassword, setShowPassword] = useState(false);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-2">
          {label && <FormLabel htmlFor={name}>{label}</FormLabel>}

          <FormControl>
            <div className="relative">
              <Input
                {...field}
                id={name}
                disabled={disabled}
                placeholder={placeholder}
                type={isPassword ? (showPassword ? "text" : "password") : type}
                className={isPassword ? "pr-10  py-6" : " py-6"}
              />

              {isPassword && (
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              )}
            </div>
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default PHInput;

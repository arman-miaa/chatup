/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

// example useing form

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { useState } from "react";

import { FormProvider, useForm } from "react-hook-form";

import NRDatePicker from "./NRDatePicker";
import PHInput from "./NRInput";
import PHSelect from "./NRSelect";
import PHSelectWithWatch from "./PHSelectWithWatch";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  role: z.string().refine((value) => value !== "", {
    message: "Role is required",
    path: ["role"],
  }),
  country: z.string().optional(),
  dob: z.date().optional(),
});

const options = [
  { value: "admin", label: "Admin" },
  { value: "manager", label: "Manager" },
  { value: "user", label: "User" },
];

const countries = [
  { value: "bd", label: "Bangladesh" },
  { value: "in", label: "India" },
  { value: "us", label: "USA" },
];

export default function ProfileForm() {
  const [selectedRole, setSelectedRole] = useState("");

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      role: "",
      country: "",
      dob: undefined,
    },
  });

  const onSubmit = (data: any) => {
    console.log("Form Submitted:", data);
  };

  return (
    <div className="max-w-xl mx-auto p-6 border rounded-xl shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Profile Form</h2>

      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <PHInput
            control={form.control}
            name="name"
            label="Full Name"
            type="text"
          />

          <PHInput
            control={form.control}
            name="email"
            label="Email Address"
            type="email"
          />

          <PHSelectWithWatch
            control={form.control}
            name="role"
            label="Role"
            options={options}
            onValueChange={setSelectedRole}
          />

          <PHSelect
            control={form.control}
            name="country"
            label="Country"
            options={countries}
          />

          <NRDatePicker
            control={form.control}
            name="dob"
            label="Date of Birth"
          />

          <Button type="submit" className="w-full">
            Submit
          </Button>
        </form>
      </FormProvider>

      {selectedRole && (
        <p className="mt-4 text-sm text-muted-foreground">
          Selected Role: <strong>{selectedRole}</strong>
        </p>
      )}
    </div>
  );
}

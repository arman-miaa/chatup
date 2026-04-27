/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import Link from "next/link";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useForgotPasswordMutation } from "@/redux/api/authApi";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function ResetPassword() {
  const router = useRouter();

  const [forgotPassword, { isLoading }] = useForgotPasswordMutation() as any;

  const form = useForm<FieldValues>({
    defaultValues: {
      email: "",
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    router.push(`/forgot-password/otp?email=${data?.email}`);

    try {
      const res = await forgotPassword(data).unwrap();
      if (res.success) {
        toast.success(res.message);
      }
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast.error(error?.data?.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <div className="hidden lg:flex lg:w-1/2 relative">
        <div
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/otp.jpg')",
          }}
        ></div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10 bg-white">
        <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
          <div className="mb-8 text-center">
            <h2 className="text-[40px] font-bold text-gray-800 mb-2">
              Forgot Password?
            </h2>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="email@gmail.com"
                        {...field}
                        className="py-6 rounded-2xl"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full rounded-lg  font-medium transition-colors"
                disabled={isSubmitting}
              >
                Send OTP
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Remember your password?{" "}
              <Link
                href="/login"
                className="text-primary font-medium hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

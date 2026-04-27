/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import {
  useResendOtpMutation,
  useVerifyOtpMutation,
} from "@/redux/api/authApi";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const otpSchema = z.object({
  otp: z
    .array(
      z
        .string()
        .length(1)
        .regex(/^[A-Za-z0-9]$/, "Must be alphanumeric")
    )
    .length(4),
});

type OtpFormData = z.infer<typeof otpSchema>;

export default function Otp() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [reSendOtp] = useResendOtpMutation() as any;
  const [verifiedOtp, { isLoading: isVerifyingOtp }] =
    useVerifyOtpMutation() as any;

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [otpValues, setOtpValues] = useState<string[]>(Array(4).fill(""));

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
  } = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: Array(4).fill(""),
    },
  });

  const handleResendOtp = async () => {
    if (!email) {
      toast.error("Email not found");
      return;
    }
    // console.log("email", email);

    try {
      const res = await reSendOtp({ email: email }).unwrap();
      // console.log("res", res);
      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.message || "Failed to resend OTP");
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Something went wrong");
    }
  };

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      const digits = value.split("").slice(0, 4 - index);
      const newOtpValues = [...otpValues];

      digits.forEach((digit, i) => {
        if (index + i < 4) {
          newOtpValues[index + i] = digit;
          setValue(`otp.${index + i}`, digit);
        }
      });

      setOtpValues(newOtpValues);
      const nextIndex = Math.min(index + digits.length, 3);
      inputRefs.current[nextIndex]?.focus();
    } else if (/^[0-9]$/.test(value) || value === "") {
      const newOtpValues = [...otpValues];
      newOtpValues[index] = value;
      setOtpValues(newOtpValues);
      setValue(`otp.${index}`, value);

      if (value && index < 3) {
        inputRefs.current[index + 1]?.focus();
      }
    }

    trigger("otp");
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const router = useRouter();

  const onSubmit = async (data: OtpFormData) => {
    if (!email) {
      toast.error("Email not found");
      return;
    }

    const payload = { email: email, otp: Number(data.otp.join("")) };

    // console.log("payload", payload);

    try {
      const res = await verifiedOtp(payload).unwrap();
      // console.log("res", res);
      if (res.success) {
        toast.success(res.message);
        router.push(`/forgot-password/otp/change-password?email=${email}`);
      } else {
        toast.error(res.message || "Failed to verify OTP");
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  return (
    <div className="min-h-screen relative flex items-center justify-center">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3, ease: [0.4, 0.0, 0.2, 1] }}
          className="relative z-10 w-full max-w-md"
        >
          <div className="bg-white p-8 mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="text-center mb-8"
            >
              <h1 className="text-[40px] font-bold text-gray-900 mb-2">
                Enter Code
              </h1>
              <p className="text-gray-600 text-[18px]">
                We’ve sent a code to {email}
              </p>
            </motion.div>

            <motion.form
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <div>
                <div className="flex justify-between gap-2 sm:gap-3">
                  {[0, 1, 2, 3].map((index) => (
                    <div key={index} className="w-full">
                      <input
                        ref={(el) => {
                          inputRefs.current[index] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={4}
                        value={otpValues[index]}
                        onChange={(e) => handleChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        className="w-15 aspect-square text-center text-xl font-medium border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors border-gray-300"
                        aria-label={`Digit ${index + 1} of OTP`}
                      />
                    </div>
                  ))}
                </div>
                {errors.otp && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm text-red-600 text-center"
                  >
                    Please enter a valid 4-digit code
                  </motion.p>
                )}
              </div>
              <div>
                Didn’t get a code?{" "}
                <span
                  onClick={handleResendOtp}
                  className="text-black font-semibold cursor-pointer hover:underline"
                >
                  Click to resend
                </span>
              </div>
              <div className="flex justify-between items-center gap-4">
                <motion.button
                  type="submit"
                  disabled={isVerifyingOtp || otpValues.some((v) => !v)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="cursor-pointer w-full bg-primary disabled:bg-primary/60 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                >
                  {isVerifyingOtp ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    "Verify OTP"
                  )}
                </motion.button>

                <div>
                  <Link
                    href="/forgot-password"
                    className="text-black font-semibold hover:underline"
                  >
                    <Button
                      variant="outline"
                      className="cursor-pointer w-full font-medium py-3 px-4 rounded-lg transition-colors duration-200 hover:bg-white flex items-center justify-center"
                    >
                      Cancel
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.form>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

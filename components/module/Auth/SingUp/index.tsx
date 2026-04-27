/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { useRegisterMutation } from "@/redux/api/authApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImageIcon, Lock, Mail, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const registerSchema = z
  .object({
    fullName: z.string().min(1, "Full name is required"),
    email: z.string().email("Invalid email address").min(1, "Email is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    agreedToTerms: z.boolean().refine((val) => val === true, {
      message: "You must agree to the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function RegisterPage() {
  const router = useRouter();
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>("");

  const [registerUser, { isLoading }] = useRegisterMutation() as any;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreedToTerms: false,
    },
  });

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      const preview = URL.createObjectURL(file);
      setPhotoPreview(preview);
    }
  };

  const onSubmit = async (data: any) => {
    const payload = {
      fullName: data.fullName,
      email: data.email,
      password: data.password,
    };

    const formData = new FormData();
    formData.append("data", JSON.stringify(payload));

    if (photo) {
      formData.append("image", photo);
    }

    try {
      const res = await registerUser(formData).unwrap();

      if (res.success) {
        toast.success(res.message || "Registration successful! Please login.");
        
        // Clear photo preview
        if (photoPreview) {
          URL.revokeObjectURL(photoPreview);
        }
        
        router.push("/login");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl  ">


        {/* Right Side - Registration Form */}
        <div className="w-full md:w-1/2 bg-white rounded-3xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Create Account
            </h2>
            <p className="text-gray-600">
              Fill in the details below to register
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Photo Upload */}
            <div className="flex flex-col items-center">
              <label className="text-sm font-medium text-gray-700 mb-3 self-start">
                Profile Photo (Optional)
              </label>
              <label className="w-24 h-24 border-2 border-dashed border-[#a4d65e] rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors overflow-hidden">
                {photoPreview ? (
                  <Image
                    src={photoPreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    width={96}
                    height={96}
                  />
                ) : (
                  <ImageIcon className="w-8 h-8 text-gray-400" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name*
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  {...register("fullName")}
                  placeholder="John Doe"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a4d65e] focus:border-transparent outline-none transition-all"
                />
              </div>
              {errors.fullName?.message && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.fullName.message as string}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address*
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  {...register("email")}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a4d65e] focus:border-transparent outline-none transition-all"
                />
              </div>
              {errors.email?.message && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message as string}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password*
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  {...register("password")}
                  placeholder="Minimum 6 characters"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a4d65e] focus:border-transparent outline-none transition-all"
                />
              </div>
              {errors.password?.message && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message as string}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password*
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  {...register("confirmPassword")}
                  placeholder="Re-enter your password"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a4d65e] focus:border-transparent outline-none transition-all"
                />
              </div>
              {errors.confirmPassword?.message && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword.message as string}
                </p>
              )}
            </div>

            {/* Terms Checkbox */}
            <div>
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  {...register("agreedToTerms")}
                  className="mt-1 w-4 h-4 text-[#a4d65e] border-gray-300 rounded focus:ring-[#a4d65e]"
                />
                <label className="text-sm text-gray-600">
                  I agree to the{" "}
                  <Link
                    href="/terms-privacy"
                    className="text-[#f4d03f] hover:underline font-medium"
                  >
                    Terms & Conditions
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/terms-privacy"
                    className="text-[#f4d03f] hover:underline font-medium"
                  >
                    Privacy Policy
                  </Link>
                </label>
              </div>
              {errors.agreedToTerms?.message && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.agreedToTerms.message as string}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#a4d65e] hover:bg-[#8bc34a] text-gray-800 font-semibold py-6 rounded-lg transition-colors"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>

            {/* Login Link */}
            <p className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-gray-800 font-semibold hover:underline"
              >
                Log in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
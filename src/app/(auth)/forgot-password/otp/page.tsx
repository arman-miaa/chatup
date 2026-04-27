import Otp from "@/components/module/Auth/otp";

export default function ResetPassword() {
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

      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white">
        <Otp />
      </div>
    </div>
  );
}

import { Metadata } from "next";
import LoginForm from "@/components/auth/login-form";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Access Bank - Admin Login",
  description: "Secure administrator login portal for Access Bank business card management.",
};

export default function AuthenticationPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-6 px-4">
        <div className="flex justify-center mb-6">
          <Image
            src="/access-logo.png"
            alt="Access Bank"
            width={160}
            height={48}
            priority
          />
        </div>
        <LoginForm />
      </div>
    </div>
  );
}

"use client"

import React, { useState, FormEvent } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { registerUser } from "@/services/auth"

const SignUpPage = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  //   alert("Signup Page")

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    // await registerUser({ email, password })
    console.log({ email, password })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <Card className="w-full max-w-md shadow-xl p-4">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-semibold">
            Create your UoK Account
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@uok.ac.rw"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full mt-4">
              Sign Up
            </Button>
          </form>

          <p className="text-sm text-center text-gray-600 mt-4">
            Already have an account?{" "}
            <a href="/signin" className="text-blue-600 underline">
              Sign in
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default SignUpPage

// =============================
// verify.tsx
// =============================
// import React, { useState, FormEvent } from "react";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import { verifyEmail } from "@/services/auth";

// export function VerifyEmailPage(): JSX.Element {
//   const [token, setToken] = useState("");

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();
//     await verifyEmail(token);
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
//       <Card className="w-full max-w-md shadow-xl p-4">
//         <CardHeader>
//           <CardTitle className="text-center text-2xl font-semibold">Verify Email</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="token">Verification Token</Label>
//               <Input
//                 id="token"
//                 type="text"
//                 placeholder="Enter token sent to your email"
//                 value={token}
//                 onChange={(e) => setToken(e.target.value)}
//                 required
//               />
//             </div>

//             <Button type="submit" className="w-full mt-4">Verify</Button>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

// // =============================
// // services/auth.ts
// // =============================
// export async function registerUser(data: { email: string; password: string }): Promise<void> {
//   await fetch("http://localhost:5000/api/auth/register", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(data),
//   });
// }

// export async function verifyEmail(token: string): Promise<void> {
//   await fetch(`http://localhost:5000/api/auth/verify/${token}`);
// }

// export async function loginUser(data: { email: string; password: string }): Promise<void> {
//   await fetch("http://localhost:5000/api/auth/login", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(data),
//   });
// }

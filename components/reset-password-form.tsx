"use client";
 
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
 
export function ResetPasswordForm() {
 return (
   <div className="mt-16 mx-auto sm:max-w-sm px-4">
     <h1 className="text-2xl font-bold text-center">Reset Password</h1>
     <form className="mt-12" noValidate>
       <div className="grid gap-4">
         <div className="grid gap-2">
           <Label htmlFor="newPassword">New password</Label>
           <Input id="newPassword" type="password" name="newPassword" />
         </div>
         <div className="grid gap-2">
           <Label htmlFor="newPassword">Confirm new password</Label>
           <Input
             id="confirmNewPassword"
             type="password"
             name="confirmNewPassword"
           />
         </div>
         <Button type="submit" className="w-full">
           Reset password
         </Button>
       </div>
     </form>
   </div>
 );
}
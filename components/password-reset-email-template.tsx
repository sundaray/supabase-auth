import * as React from "react";

import { Button } from "@react-email/button";
import { Html } from "@react-email/html";
import { Tailwind } from "@react-email/tailwind";
import { Text } from "@react-email/text";

export function PasswordResetTemplate({ url }: { url: string }) {
  return (
    <Html>
      <Tailwind>
        <Text className="text-base font-medium text-gray-900">Hello,</Text>
        <Text className="text-base font-medium text-gray-900">
          We received a request to reset your password. Click the button below
          to create a new password.
        </Text>
        <Button
          href={url}
          className="rounded bg-blue-600 px-4 py-2 text-base font-medium text-white"
        >
          Reset Password
        </Button>
        <Text className="text-base font-medium text-gray-900">
          Note: The link will epire in 1 hour.
        </Text>
        <Text className="text-sm font-medium text-gray-500">
          If you didn&apos;t request a password reset, you can safely ignore
          this email.
        </Text>
      </Tailwind>
    </Html>
  );
}

"use client";

import { ErrorDisplay } from "@/components/ui/error-display";

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
}) {
  return <ErrorDisplay message={error.message} />;
}

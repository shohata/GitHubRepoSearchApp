"use client";

import { ErrorDisplay } from "@/components/ui/error-display";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ErrorDisplay message={error.message} reload={() => reset()} />;
}

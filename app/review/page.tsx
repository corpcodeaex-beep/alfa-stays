import type { Metadata } from "next";
import { Suspense } from "react";
import { ReviewFlow } from "@/components/review-flow";
import { GoogleReviews } from "@/components/google-reviews";
import { BlobScene } from "@/components/haikei";

export const metadata: Metadata = {
  title: "Rate your stay",
  description: "Tell us about your stay.",
  robots: { index: false },
};

export default function ReviewPage() {
  return (
    <div className="relative overflow-hidden px-4 pb-10 pt-28">
      <BlobScene className="pointer-events-none absolute left-1/2 top-0 w-[160%] max-w-none -translate-x-1/2" />
      <Suspense>
        <div className="relative grid min-h-[calc(100svh-10rem)] place-items-center">
          <ReviewFlow />
        </div>
        <GoogleReviews />
      </Suspense>
    </div>
  );
}

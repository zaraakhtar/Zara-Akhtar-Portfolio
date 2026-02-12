import { StarryBackground, Tower, ScrollButtons, Dragon } from "@/components";

export default function Home() {
  return (
    <div className="relative min-h-screen w-full">
      {/* Starry background - fixed behind everything */}
      <StarryBackground />

      {/* Fixed UI Elements */}
      <ScrollButtons />
      <Dragon />

      {/* Tower - scrollable content */}
      <div className="relative z-10">
        <Tower />
      </div>
    </div>
  );
}

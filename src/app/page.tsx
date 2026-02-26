import { StarryBackground, Tower, ScrollButtons, BackgroundMusic } from "@/components";

export default function Home() {
  return (
    <div className="relative min-h-screen w-full">
      {/* Starry background - fixed behind everything */}
      <StarryBackground />

      {/* Fixed UI Elements */}
      <ScrollButtons />
      <BackgroundMusic />


      {/* Tower - scrollable content yes */}
      <div className="relative z-10">
        <Tower />
      </div>
    </div>
  );
}

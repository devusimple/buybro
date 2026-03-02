import { Button } from "@/components/ui/button";
import bg_video from "/assets/bg-mockup.mp4"

export default function Hero() {
    return (
        <section className="relative w-full h-screen overflow-hidden">

            {/* --- Background Video --- */}
            <video
                className="object-cover absolute inset-0 w-full h-full"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
            >
                <source src={bg_video} />
            </video>

            <div className="absolute inset-0 bg-black/50"></div>

            {/* --- Content Container --- */}
            <div className="relative z-10 w-full h-screen items-center justify-center">

                <Button>Check new Arrivals</Button>
            </div>
        </section>
    );
}
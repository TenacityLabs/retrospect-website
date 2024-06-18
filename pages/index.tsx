import { useWindowSize } from "@uidotdev/usehooks";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import useScrollObserver from "@/hooks/useScrollObserver";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scrollPosition, setScrollPosition] = useState<number>(0);
  const { width, height } = useWindowSize();

  const [email, setEmail] = useState<string>()

  const { targetRef: firstPageObserver } = useScrollObserver('pop-out-element', '.child-1')
  const { targetRef: secondPageObserver } = useScrollObserver('pop-out-element', '.child-2')

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext('2d');
      if (context && width !== null && height !== null) {
        context.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < 60; i++) {
          const theta = (i * Math.PI) / 30 + scrollPosition / (500 * Math.PI);
          const ellipseSemiFW = width / 2 * 0.95;
          const ellipseSemiFH = height / 2 * 0.95;
          const ellipseRadius = (ellipseSemiFW * ellipseSemiFH) /
            Math.sqrt(
              ellipseSemiFW * ellipseSemiFW * Math.sin(theta) * Math.sin(theta) +
              ellipseSemiFH * ellipseSemiFH * Math.cos(theta) * Math.cos(theta)
            );

          const amplitude = 0.95
          // + 0.05 * (Math.sin(8 * scrollPosition / (height * Math.PI)))


          context.beginPath();
          context.strokeStyle = 'rgba(255, 255, 255, 0.3)';
          context.lineWidth = 2;
          context.moveTo(
            width / 2 + (width + height) * Math.cos(theta),
            height / 2 + (width + height) * Math.sin(theta)
          );
          context.lineTo(
            width / 2 + ellipseRadius * amplitude * Math.cos(theta),
            height / 2 + ellipseRadius * amplitude * Math.sin(theta)
          );
          context.stroke();

          if (i % 5 === 0) {
            context.beginPath();
            context.strokeStyle = 'rgba(255, 255, 255, 0.2)'
            context.lineWidth = 2;
            context.moveTo(
              width / 2 + (width + height) * Math.cos(theta),
              height / 2 + (width + height) * Math.sin(theta)
            );
            context.lineTo(
              width / 2 + (ellipseRadius * 0.85) * amplitude * Math.cos(theta),
              height / 2 + (ellipseRadius * 0.85) * amplitude * Math.sin(theta)
            );
            context.stroke();
          }
        }
      }
    }
  }, [scrollPosition, width, height]);

  return (
    <main className="relative w-screen h-screen">
      <canvas width={width || 0} height={height || 0} ref={canvasRef} className="fixed inset-0 pointer-events-none max-lg:hidden" />
      <div className={`fixed inset-0 pointer-events-none transition-all duration-500
            ${scrollPosition < (height || 0) / 3 ? "opacity-75 translate-y-0" : "opacity-0 translate-y-16"}`}>
        <div className="absolute bottom-0 flex items-center justify-center font-syne mb-4 text-2xl animate-pulse w-full max-lg:hidden">
          Scroll down
        </div>
      </div>
      <h1 className="hidden">Retrospect</h1>
      <div className="h-[240vh] grid"
        style={{
          gridTemplateRows: "120vh 120vh"
        }}>
        <div ref={firstPageObserver}>
          <div className="h-full flex flex-col items-center justify-center gap-8 text-center child-1 pb-[20vh] px-6">
            <Image
              src="/assets/logo.png"
              alt="retrospect-logo"
              width={75}
              height={75}
            />

            <h1 className="font-light text-5xl tracking-wide">
              Live in <i>Retrospect</i>.
            </h1>
            <h2 className="font-syne text-3xl tracking-wider">
              Digital time capsules to help you <br /> document the moments that matter.
            </h2>
            <div className="flex flex-col gap-4 items-center tracking-wider">
              <div className="text-2xl font-syne">Join the Waitlist</div>
              <input className="bg-white/[0.7] focus:bg-white/[0.8] focus:scale-[1.02] rounded-full w-96 ring-none outline-none caret-transparent
              text-center p-2 text-xl text-black font-public tracking-tight transition-all duration-300"
                placeholder="name@gmail.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value) }}
                aria-label="waitlist input"
              >
              </input>
            </div>
            <div className="flex flex-row items-center gap-2">
              <Link
                href="https://www.instagram.com/retrospect.space/"
                target="_blank"
                className="hover:brightness-75 transition-all"
                aria-label="instagram button"
              >
                <Image
                  src="/assets/instagram-icon.png"
                  alt="retrospect-instagram"
                  width={50}
                  height={50}
                />
              </Link>
              <Link
                href="https://www.slimescholars.com"
                target="_blank"
                className="hover:brightness-75 transition-all"
                aria-label="tiktok button"
              >
                <Image
                  src="/assets/tiktok-icon.png"
                  alt="retrospect-tiktok"
                  width={50}
                  height={50}
                />
              </Link>
            </div>
          </div>
        </div>
        <div ref={secondPageObserver}>
          <div className="h-full flex flex-col items-center justify-start gap-8 text-center child-2 pb-[20vh]">
            <h3 className="font-light text-5xl tracking-wide max-lg:hidden">
              The <i>Experience</i>
            </h3>
            <div className="flex flex-row items-center gap-8 max-lg:flex-col max-lg:mt-8">
              <h4 className="font-light text-3xl tracking-wide w-[22.5vw] text-left 
              max-lg:w-[70vw] max-md:w-[90vw] max-lg:text-center max-lg:text-4xl"
                style={{
                  lineHeight: 1.5
                }}>
                We&apos;re creating <i>digital time capsules,</i> helping you build multimedia archives to document the <i>moments that matter.</i>
              </h4>
              <div className="max-lg:flex max-lg:flex-col max-lg:items-center lg:justify-center w-fit max-lg:w-full">
                <div className="lg:hidden font-light text-5xl tracking-wide mt-40">
                  The <i>Experience</i>
                </div>
                <Image
                  src="/assets/iphone.png"
                  alt="iphone"
                  width={0}
                  height={0}
                  sizes="25vw"
                  className="w-auto h-[70vh] mt-12 max-lg:w-[80%] max-lg:mt-8 max-lg:h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

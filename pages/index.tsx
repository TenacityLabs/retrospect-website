import { useWindowSize } from "@uidotdev/usehooks";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import useScrollObserver from "@/hooks/useScrollObserver";
import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";

function safeAxiosApply<
  T extends (...args: any[]) => Promise<AxiosResponse<any, any>>
>(fn: T) {
  return async function (...args: Parameters<T>): Promise<ReturnType<T>> {
    const res = await fn(...args)
      .then((res) => res)
      .catch((err) => {
        if (err instanceof AxiosError) return err;
        else throw err;
      });
    return res as ReturnType<T>;
  };
}

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scrollPosition, setScrollPosition] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [complete, setComplete] = useState<boolean>(false);
  const { width, height } = useWindowSize();

  const [email, setEmail] = useState<string>()

  const { targetRef: firstPageObserver } = useScrollObserver('pop-out-element', '.child-1')
  const { targetRef: secondPageObserver } = useScrollObserver('pop-out-element', '.child-2')

  const addEmail = async () => {
    setLoading(true)
    try {
      const response = await safeAxiosApply(async () => await axios.post("/api/add-email", { email }))()
      if (response instanceof AxiosError) {
        console.log(response)
        if (response.response?.data.message) {
          toast(response.response?.data.message)
        }
        else {
          toast("There was an error with adding your email. Please try again in a few minutes.")
        }
      }
      else {
        toast("Email added successfully!")
        setComplete(true)
      }
    }
    catch (error: any) {
      toast(error.message)
    }
    finally {
      setLoading(false)
    }
  }

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
          context.strokeStyle = i % 5 === 0 ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.3)';
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
            context.strokeStyle = 'rgba(255, 255, 255, 0.4)'
            context.lineWidth = 2;
            context.moveTo(
              width / 2 + ellipseRadius * amplitude * Math.cos(theta),
              height / 2 + ellipseRadius * amplitude * Math.sin(theta)
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
      <h1 className="hidden">Retrospect</h1>
      <div className="h-[240vh] grid"
        style={{
          gridTemplateRows: "120vh 120vh"
        }}>
        <div ref={firstPageObserver}>
          <div className="h-full flex flex-col items-center justify-center gap-8 text-center child-1 pb-[20vh] px-6">
            <Image
              src="/assets/logo.svg"
              alt="retrospect-logo"
              width={75}
              height={75}
            />

            <h1 className="font-light text-5xl tracking-wide">
              Live in <i>Retrospect</i>.
            </h1>
            <h2 className="font-syne text-3xl tracking-wider font-semibold">
              Digital time capsules to help you <br className="max-lg:hidden" /> document the moments that matter.
            </h2>
            <div className={`flex flex-col gap-4 items-center tracking-wider`}>
              <div className="text-2xl font-syne font-semibold">Join the Waitlist</div>
              <div className={`relative w-96`}>
                <input className={`relative bg-white/[0.7] ${!complete && "focus:bg-white/[0.9]"} ${complete && "caret-transparent"} ${complete && "cursor-not-allowed"}
                rounded-2xl w-full ring-none outline-none text-center p-2 text-xl text-black font-public tracking-tight transition-all duration-300 z-10 placeholder:text-neutral-500`}
                  disabled={complete}
                  placeholder="name@gmail.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value) }}
                  aria-label="waitlist input"
                />
                <button className={`absolute top-0 pt-12 flex w-full items-center justify-center font-syne bg-white/[0.3] ${!complete && "hover:bg-white/[0.5]"} ${complete && "cursor-not-allowed"} 
                transition-all duration-150 rounded-2xl pb-1 z-0 origin-top ${email ? "scale-y-100 h-auto" : "scale-y-0 h-0"}`}
                  disabled={complete || loading}
                  onClick={addEmail}
                  style={{
                    paddingTop: email ? "3rem" : 0
                  }}>
                  <span className="transition-opacity duration-150">
                    {complete ? "You're all set!" : loading ? "Loading..." : "Sign Me Up!"}
                  </span>
                </button>
              </div>
            </div>
            <div className="flex flex-row items-center gap-2 mt-4">
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
                href="https://www.tiktok.com/@retrospectspace"
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
          <div className="h-full flex flex-col items-center justify-start gap-8 text-center child-2 pb-[20vh] max-lg:-mt-[20vh]">
            <h3 className="font-light text-5xl tracking-wide max-lg:hidden">
              The <i>Experience</i>
            </h3>
            <div className="flex flex-row items-center gap-8 max-lg:flex-col max-lg:mt-8">
              <h4 className="font-light text-3xl tracking-wide w-[22.5vw] text-left 
              max-lg:w-[70vw] max-md:w-[90vw] max-lg:text-center max-lg:text-4xl"
                style={{
                  lineHeight: 1.5
                }}
              >
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

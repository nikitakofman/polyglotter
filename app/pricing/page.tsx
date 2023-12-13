import PricingCards from "@/components/PricingCards";

function Pricing() {
  return (
    <div className="isolate overflow-hidden dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 pt-10 pb-10 text-center customminheight lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-base font-semibold leading-7  text-[#EF9351]">
            Pricing
          </h2>
          <p className="mt-2 text-4xl font-bold tracking-tight dark:text-white text-black sm:text-5xl">
            The right price for you,{" "}
            <br className="hidden sm:inline lg:hidden" />
            whoever you are
          </p>
        </div>
        <div className="relative mt-6">
          <p className="mx-auto max-w-2xl text-lg mb-8 dark:text-white leading-8 text-black/60">
            We&apos;re 99% sure we have a plan to match 100% of your needs
          </p>
          <PricingCards redirect={true} />
          {/* <svg
            viewBox="0 0 1208 1024"
            className="absolute -top-10 left-1/2 -z-10 h-[64rem] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:-top-12 md:-top-20 lg:-top-12 xl:top-0"
          >
            <ellipse
              cx={605}
              cy={512}
              fill="url(#radial-gradient-pricing)"
              rx={604}
              ry={512}
            />
            <defs>
              <radialGradient id="radial-gradient-pricing">
                <stop stopColor="#EF9351" />
                <stop offset={1} stopColor="#EF9351" />
              </radialGradient>
            </defs>
          </svg> */}
        </div>
      </div>

      {/* <div className="flow-root bg-white pb-24 sm:pb-32">
        <div className="-mt-80">
          <PricingCards redirect={true} />
        </div>
      </div> */}
    </div>
  );
}

export default Pricing;

import { Github, AcademicCapSolid } from "@medusajs/icons"
import { Button, Heading } from "@medusajs/ui"

const Hero = () => {
  return (
    <div className="h-[75vh] w-full border-b border-ui-border-base relative bg-ui-bg-subtle">
      <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center small:p-32 gap-6">
        <span>
          <Heading
            level="h1"
            className="text-3xl leading-10 text-ui-fg-base font-normal"
          >
            z-Commerce
          </Heading>
          <Heading
            level="h2"
            className="text-3xl leading-10 text-ui-fg-subtle font-normal"
          >
            Powered by Medusa, Next.js, Heimdall, Docker, and many more things
          </Heading>
        </span>
        <span>
        <a
          href="https://github.com/ermolaev1337/medusa-zkp"
          target="_blank"
        >
          <Button variant="secondary">
            GitHub
            <Github />
          </Button>
        </a>
                    <span/>
          <a
          href="https://www.researchgate.net/publication/370595405_z-Commerce_Designing_a_data-minimizing_one-click_checkout_solution"
          target="_blank"
        >
          <Button variant="secondary">
            ResearchGate
            <AcademicCapSolid />
          </Button>
        </a>
        </span>
      </div>
    </div>
  )
}

export default Hero

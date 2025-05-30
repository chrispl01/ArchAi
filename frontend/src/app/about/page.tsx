'use client';
import BackButton from '@/components/BackButton';

export default function About() {
  return (
    <>
      <BackButton />
      <div className="flex-col flex justify-center w-full min-h-[80vh] text-left px-4 sm:px-4 md:px-8 lg:px-24 xl:px-32 animate-slide-in-right-to-left">

        <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-left">
          About ArchAi
        </h1>
        <section className="mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold mb-2 text-left">
            What is ArchAi?
          </h2>
          <p className="text-base sm:text-lg leading-relaxed">
            ArchAi is a platform developed to support users in transforming
            conceptual ideas into secure and efficient cloud architecture
            solutions. It leverages advanced automation techniques to bridge the
            gap between user requirements and technical cloud infrastructure
            design.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold mb-2 text-left">
            How does it work?
          </h2>
          <p className="text-base sm:text-lg leading-relaxed">
            ArchAi employs large language model (LLM)-driven automation to
            assist in the planning and automatic generation of cloud
            architectures, ensuring scalability, security, and cost-efficiency.
            The platform interprets high-level user input and generates
            optimized infrastructure blueprints based on best practices.
          </p>
        </section>

        <section>
          <h2 className="text-xl sm:text-2xl font-semibold mb-2 text-left">
            Background
          </h2>
          <p className="text-base sm:text-lg leading-relaxed">
            The development of ArchAi is part of a university research project
            that explores the integration of software engineering methodologies,
            artificial intelligence, and cloud computing technologies. The
            platform aims to simplify the complex task of cloud architecture
            design, making it accessible for users without extensive cloud
            expertise while promoting innovative and reliable infrastructure
            solutions.
          </p>
        </section>
      </div>
    </>
  );
}

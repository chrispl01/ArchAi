export default function About() {
  return (
    <main className="flex-col flex justify-center w-full min-h-[80vh] text-left px-4 sm:px-4 md:px-8 lg:px-24 xl:px-32 animate-slide-in-right-to-left">
      <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-left">
        About ArchAi
      </h1>

      <section className="mb-6">
        <h2 className="text-xl sm:text-2xl font-semibold mb-2 text-left">
          What is ArchAi?
        </h2>
        <p className="text-base sm:text-lg leading-relaxed">
          ArchAi is a platform designed to help users to transform their ideas
          into secure, efficient cloud architecture solutions.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl sm:text-2xl font-semibold mb-2 text-left">
          How does it work?
        </h2>
        <p className="text-base sm:text-lg leading-relaxed">
          ArchAi uses llm-driven automation to assist in planning, and
          generation of cloud architectures.
        </p>
      </section>

      <section>
        <h2 className="text-xl sm:text-2xl font-semibold mb-2 text-left">
          Background
        </h2>
        <p className="text-base sm:text-lg leading-relaxed">
          This platform is developed as part of a university project, aimed at
          exploring the intersection of software engineering, AI, and cloud architectures
          technologies.
        </p>
      </section>
    </main>
  );
}

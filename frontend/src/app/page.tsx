import { ProblemForm } from "@/components/ProblemForm";

export default function HomePage() {
  return (
    <div className="space-y-8">
      <section className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Win your hackathon with{" "}
          <span className="text-brand">AI-generated</span> solutions
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-slate-600">
          Enter a problem statement and instantly get a full solution: analysis,
          architecture, tech stack, roadmap, pitch deck content, and innovation
          highlights.
        </p>
      </section>

      <div className="mx-auto max-w-2xl">
        <ProblemForm />
      </div>
    </div>
  );
}

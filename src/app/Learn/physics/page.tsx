// src/app/Learn/physics/page.tsx
import Link from "next/link";

const physicsTopics = [
  {
    section: "General Physics",
    topics: [
      "Units and Dimensions",
      "Physical World and Measurement",
      "Kinematics",
      "Laws of Motion",
      "Work, Energy and Power",
      "Rotational Motion",
      "Gravitation",
      "Properties of Matter",
      "Thermodynamics",
      "Kinetic Theory of Gases",
      "Oscillations and Waves",
    ],
  },
  {
    section: "Mechanics & Heat",
    topics: [
      "System of Particles and Rotational Motion",
      "Gravitation",
      "Mechanical Properties of Solids",
      "Mechanical Properties of Fluids",
      "Thermal Properties of Matter",
      "Thermodynamics",
      "Kinetic Theory",
    ],
  },
  {
    section: "Electrodynamics",
    topics: [
      "Electrostatics",
      "Current Electricity",
      "Magnetic Effects of Current and Magnetism",
      "Electromagnetic Induction and Alternating Currents",
      "Electromagnetic Waves",
    ],
  },
  {
    section: "Modern Physics",
    topics: [
      "Dual Nature of Matter and Radiation",
      "Atoms",
      "Nuclei",
      "Semiconductor Electronics",
    ],
  },
];

export default function PhysicsPage() {
  return (
    <main className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-10 text-center">Physics Learning Path</h1>

      <div className="max-w-4xl mx-auto space-y-10">
        {physicsTopics.map(({ section, topics }) => (
          <section key={section}>
            <h2 className="text-2xl font-semibold mb-6 border-b border-green-600 pb-2">
              {section}
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {topics.map((topic) => (
                <li key={topic}>
                  <Link
                    href={`/subjects/physics/${topic
                      .toLowerCase()
                      .replace(/[ ,]/g, "-")}`}
                    className="block rounded-md border border-green-600 px-4 py-3 hover:bg-green-700 transition"
                  >
                    {topic}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}
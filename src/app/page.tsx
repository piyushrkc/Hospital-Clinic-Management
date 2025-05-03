export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">OPD Management System</h1>
        <a href="/login" className="text-blue-600 font-medium hover:underline">
          Login
        </a>
      </header>

      {/* Hero */}
      <section className="flex-1 bg-gray-100 flex flex-col justify-center items-center p-10 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Comprehensive Healthcare Management Solution
        </h2>
        <p className="max-w-2xl mb-6 text-gray-700">
          Streamline your outpatient department operations with our all-in-one platform
          for patients, doctors, and administrators.
        </p>
        <div className="flex gap-4">
          <a
            href="/login"
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Get Started
          </a>
          <a
            href="#features"
            className="border border-blue-600 text-blue-600 py-2 px-4 rounded hover:bg-blue-100"
          >
            Learn More
          </a>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-white py-16 px-8">
        <h3 className="text-2xl font-bold text-center mb-8">Key Features</h3>
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <FeatureCard
            title="Patient Module"
            features={[
              'Online appointment booking',
              'Medical records access',
              'Digital prescriptions',
              'Lab results viewing',
            ]}
          />
          <FeatureCard
            title="Doctor Module"
            features={[
              'Patient queue management',
              'E-prescription system',
              'Medical history access',
              'Appointment scheduling',
            ]}
          />
          <FeatureCard
            title="Admin Module"
            features={[
              'Staff management',
              'Hospital resource tracking',
              'Department performance metrics',
              'Financial operations',
            ]}
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 p-6 text-center text-sm text-gray-600">
        © 2025 OPD Management System. All rights reserved.
      </footer>
    </div>
  );
}

function FeatureCard({ title, features }: { title: string; features: string[] }) {
  return (
    <div className="bg-gray-50 border rounded-lg p-6 shadow">
      <h4 className="text-xl font-semibold mb-4">{title}</h4>
      <ul className="text-sm space-y-2 text-gray-700">
        {features.map((f, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="text-green-600 font-bold">✓</span> {f}
          </li>
        ))}
      </ul>
    </div>
  );
}
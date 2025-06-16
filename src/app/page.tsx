import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F1F8F4]">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#204535] font-heading">
            NullCent
          </h1>
          <div className="flex gap-4">
            <Link 
              href="/auth/login"
              className="px-5 py-2 rounded-lg bg-[#428766] text-white font-heading hover:bg-[#306B51] transition-colors duration-200 text-sm"
            >
              Einloggen
            </Link>
            <Link 
              href="/auth/register"
              className="px-5 py-2 rounded-lg bg-[#428766] text-white font-heading hover:bg-[#306B51] transition-colors duration-200 text-sm"
            >
              Registrieren
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-[#204535] font-heading mb-6">
            Willkommen bei NullCent
          </h2>
          <p className="text-lg text-[#204535] font-body mb-8">
            Dein persönlicher Finanzassistent für optimale Geldanlage und Vermögensaufbau.
          </p>
        </div>
      </section>
    </main>
  )
}

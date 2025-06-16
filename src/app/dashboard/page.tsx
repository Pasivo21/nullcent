import DashboardLayout from '@/components/layout/DashboardLayout'

export default function DashboardPage() {
  return (
    <DashboardLayout title="Dein Finanzüberblick">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Beispiel-Karten */}
        <div className="p-6 bg-white rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-[#1B392D] mb-2 font-heading">Gesamtkredite</h3>
          <p className="text-3xl font-bold text-[#204535]">€12.500</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-[#1B392D] mb-2 font-heading">Monatliche Rate</h3>
          <p className="text-3xl font-bold text-[#204535]">€450</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-[#1B392D] mb-2 font-heading">Durchschnittlicher Zinssatz</h3>
          <p className="text-3xl font-bold text-[#204535]">4.2%</p>
        </div>
      </div>
    </DashboardLayout>
  )
} 
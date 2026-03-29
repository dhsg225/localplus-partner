export default function DashboardHeader({ 
  title, 
  subtitle, 
  children 
}: { 
  title: string, 
  subtitle?: string, 
  children?: React.ReactNode 
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight italic">{title}.</h1>
        {subtitle && <p className="text-gray-500 font-medium italic">{subtitle}</p>}
      </div>
      <div className="flex items-center space-x-3 shrink-0">
        {children}
      </div>
    </div>
  )
}

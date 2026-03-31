import { organizationApi, ingestionApi } from '@/lib/api.server'
import DashboardHeader from '@/components/DashboardHeader'
import IngestionDashboard from './components/IngestionDashboard'

export default async function IngestionPage() {
  const businessId = await organizationApi.getPartnerBusiness()
  const { isSuperAdmin } = await organizationApi.checkPermissions()

  if (!businessId && !isSuperAdmin) {
    return <div>Organization required.</div>
  }

  // Load existing batches for this organization
  const batchesResponse = await ingestionApi.getBatches(businessId || '')
  const batches = batchesResponse.data || []

  return (
    <div className="space-y-8 pb-20">
      <DashboardHeader 
        title="Content Ingestion" 
        subtitle="Data Cleaning Command Center for messy external listings"
      />

      <IngestionDashboard 
        organizationId={businessId || ''} 
        initialBatches={batches}
      />
    </div>
  )
}

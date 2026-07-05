import { organizationApi, taxonomyApi, entitiesApi } from '@/lib/api.server'
import DashboardHeader from '@/components/DashboardHeader'
import BusinessProfileForm from './components/BusinessProfileForm'

export default async function BusinessProfilePage() {
  const businessId = await organizationApi.getPartnerBusiness()
  
  // Fetch initial data
  const [cuisinesRes, featuresRes, profileRes] = await Promise.all([
    taxonomyApi.getCategories('cuisine'),
    taxonomyApi.getCategories('feature'),
    entitiesApi.getProfile(businessId)
  ])

  const cuisines = Array.isArray(cuisinesRes.data) ? cuisinesRes.data : []
  const features = Array.isArray(featuresRes.data) ? featuresRes.data : []
  const initialProfile = profileRes.data || null

  return (
    <div className="space-y-10 pb-20">
      <DashboardHeader 
        title="Business Profile Control" 
        subtitle="Manage your canonical entity data for the Answer Engine"
      />

      <div className="max-w-5xl">
        <BusinessProfileForm 
          businessId={businessId}
          cuisines={cuisines}
          features={features}
          initialProfile={initialProfile}
        />
      </div>
    </div>
  )
}

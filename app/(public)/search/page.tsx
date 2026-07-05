import SearchUI from './components/SearchUI'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Discover Hua Hin | LocalPlus Discover',
  description: 'Search for businesses in Hua Hin via our grounded Answer Engine discover path.',
}

export default function SearchPage() {
  return (
    <main className="min-h-screen bg-white selection:bg-red-500 selection:text-white">
      <SearchUI />
    </main>
  )
}

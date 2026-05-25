import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, MapPin, TrendingUp } from 'lucide-react'
import prisma from '@/lib/prisma'

interface StatePageProps {
  params: {
    state: string
  }
}

const VALID_STATES = ['NSW', 'VIC', 'QLD', 'SA', 'WA', 'TAS', 'NT', 'ACT']
const STATE_NAMES: Record<string, string> = {
  NSW: 'New South Wales',
  VIC: 'Victoria',
  QLD: 'Queensland',
  SA: 'South Australia',
  WA: 'Western Australia',
  TAS: 'Tasmania',
  NT: 'Northern Territory',
  ACT: 'Australian Capital Territory'
}

export default async function StatePage({ params }: StatePageProps) {
  const state = params.state.toUpperCase()
  
  if (!VALID_STATES.includes(state)) {
    notFound()
  }

  // Fetch top suburbs for this state
  const suburbs = await prisma.suburbs.findMany({
    where: {
      state: state
    },
    orderBy: {
      investmentScore: 'desc'
    },
    take: 20,
    select: {
      id: true,
      name: true,
      state: true,
      postcode: true,
      medianPrice: true,
      growth12m: true,
      rentalYield: true,
      investmentScore: true
    }
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Home
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {STATE_NAMES[state]}
          </h1>
          <p className="text-gray-600">
            Explore top investment suburbs in {STATE_NAMES[state]}
          </p>
        </div>

        {suburbs.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <p className="text-gray-500">No suburbs available for {STATE_NAMES[state]} yet.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {suburbs.map((suburb) => (
              <Link
                key={suburb.id}
                href={`/suburb/${suburb.name}?state=${suburb.state}&postcode=${suburb.postcode}`}
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <MapPin className="h-5 w-5 text-gray-400" />
                      <h3 className="text-xl font-semibold text-gray-900">
                        {suburb.name}, {suburb.state} {suburb.postcode}
                      </h3>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      <div>
                        <p className="text-sm text-gray-500">Median Price</p>
                        <p className="text-lg font-semibold text-gray-900">
                          ${suburb.medianPrice?.toLocaleString() || 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Annual Growth</p>
                        <p className={`text-lg font-semibold ${(suburb.growth12m || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {suburb.growth12m?.toFixed(2) || '0.00'}%
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Rental Yield</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {suburb.rentalYield?.toFixed(2) || '0.00'}%
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Investment Score</p>
                        <p className="text-lg font-semibold text-blue-600">
                          {suburb.investmentScore || 0}/100
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <TrendingUp className="h-6 w-6 text-blue-600 ml-4" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function HomepageSkeleton() {
  return (
    <main className="min-h-screen relative">
      {/* Hero Slider Skeleton */}
      <div className="w-full h-[80vh] bg-gray-900 animate-pulse" />

      {/* IWKL Banner Skeleton */}
      <div className="w-full h-32 bg-gray-800 animate-pulse" />

      {/* Journey Begins Skeleton */}
      <div className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="h-8 bg-gray-700 rounded w-1/2 mx-auto mb-4 animate-pulse" />
          <div className="h-4 bg-gray-700 rounded w-1/3 mx-auto animate-pulse" />
        </div>
      </div>

      {/* Teams Slider Skeleton */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="h-10 bg-gray-700 rounded w-1/2 mx-auto mb-4 animate-pulse" />
            <div className="h-2 bg-gray-700 rounded w-1/4 mx-auto animate-pulse" />
          </div>
          <div className="flex gap-6 overflow-hidden">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex-shrink-0 w-80 h-96 bg-gray-800 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>

      {/* Points Table Skeleton */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="h-10 bg-gray-300 rounded w-1/2 mx-auto mb-4 animate-pulse" />
            <div className="h-4 bg-gray-300 rounded w-1/4 mx-auto animate-pulse" />
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="h-12 bg-gray-200 rounded mb-4 animate-pulse" />
            {[...Array(9)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 rounded mb-2 animate-pulse" />
            ))}
          </div>
        </div>
      </section>

      {/* Video Hub Skeleton */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="h-10 bg-gray-700 rounded w-1/2 mx-auto mb-4 animate-pulse" />
            <div className="h-4 bg-gray-700 rounded w-1/3 mx-auto animate-pulse" />
          </div>
          <div className="flex gap-6">
            <div className="w-1/2 aspect-video bg-gray-800 rounded-xl animate-pulse" />
            <div className="w-1/2 h-64 bg-gray-800 rounded-xl animate-pulse" />
          </div>
        </div>
      </section>

      {/* Latest Updates Skeleton */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="h-10 bg-gray-700 rounded w-1/2 mx-auto mb-4 animate-pulse" />
            <div className="h-4 bg-gray-700 rounded w-1/3 mx-auto animate-pulse" />
          </div>
          <div className="flex gap-6 overflow-hidden">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex-shrink-0 w-80 h-64 bg-gray-800 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Skeleton */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="h-10 bg-gray-700 rounded w-1/2 mx-auto mb-4 animate-pulse" />
            <div className="h-4 bg-gray-700 rounded w-1/3 mx-auto animate-pulse" />
          </div>
          <div className="flex gap-6 overflow-hidden">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex-shrink-0 w-80 h-56 bg-gray-800 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

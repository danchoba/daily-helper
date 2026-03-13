export function PageSkeleton({ cards = 3 }: { cards?: number }) {
  return (
    <div className="animate-pulse space-y-6">
      <div className="space-y-3">
        <div className="h-3 w-28 rounded-full bg-earth-200" />
        <div className="h-10 w-72 rounded-2xl bg-earth-200" />
        <div className="h-4 w-full max-w-xl rounded-full bg-earth-100" />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: cards }).map((_, index) => (
          <div key={index} className="rounded-2xl border border-earth-200 bg-white p-5">
            <div className="h-10 w-10 rounded-xl bg-earth-100" />
            <div className="mt-4 h-7 w-16 rounded-full bg-earth-200" />
            <div className="mt-3 h-4 w-32 rounded-full bg-earth-100" />
            <div className="mt-2 h-4 w-full rounded-full bg-earth-100" />
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {Array.from({ length: 2 }).map((_, index) => (
          <div key={index} className="rounded-2xl border border-earth-200 bg-white p-5">
            <div className="h-5 w-48 rounded-full bg-earth-200" />
            <div className="mt-4 h-4 w-full rounded-full bg-earth-100" />
            <div className="mt-2 h-4 w-3/4 rounded-full bg-earth-100" />
          </div>
        ))}
      </div>
    </div>
  )
}

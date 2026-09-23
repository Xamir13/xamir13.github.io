import { Card } from "@/components/site/primitives";

export default function BlogLoading() {
  return (
    <div className="mx-auto max-w-5xl px-3 py-8 sm:px-4 md:px-8 md:py-16">
      {/* Direction inherits from <html> (set pre-paint by the lang boot
          script) so the skeleton mirrors correctly in both languages. */}
      <div className="pt-16 md:pt-24 pb-8 md:pb-16">
        <div className="flex flex-row gap-3 md:gap-6">
          <div className="relative w-10 md:w-14 shrink-0 flex flex-col items-center">
            <div className="h-11 w-11 rounded-full bg-muted animate-pulse" />
            <div className="mt-4 w-1 flex-1 rounded-full bg-muted/50" />
          </div>
          <div className="flex-1 flex flex-col gap-4">
            <div className="h-6 w-28 rounded-md bg-muted animate-pulse" />
            <div className="h-4 w-64 max-w-full rounded-md bg-muted/70 animate-pulse" />
            <div className="mt-2 flex flex-col gap-3">
              {[0, 1, 2].map((i) => (
                <Card
                  key={i}
                  className="w-full max-w-[500px] border-border/50 shadow-sm"
                >
                  <div className="space-y-3 p-6">
                    <div className="h-5 w-3/4 rounded-md bg-muted animate-pulse" />
                    <div className="flex gap-2">
                      <div className="h-5 w-16 rounded-full bg-muted animate-pulse" />
                      <div className="h-5 w-20 rounded-full bg-muted animate-pulse" />
                    </div>
                    <div className="h-4 w-full rounded-md bg-muted/70 animate-pulse" />
                    <div className="h-4 w-2/3 rounded-md bg-muted/70 animate-pulse" />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client"

import { PageLoader } from "@/components/page-loader"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function PageLoaderShowcasePage() {
  const [showFullPageLoader, setShowFullPageLoader] = useState(false)

  return (
    <div className="min-h-svh bg-background">
      <div className="container py-12">
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-4xl font-bold">Page Loader</h1>
            <p className="text-muted-foreground mt-2">
              Beautiful loading indicator components for your application
            </p>
          </div>

          {/* Section: Inline Loaders */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Inline Loaders</h2>
            <p className="text-muted-foreground">
              Use these loaders within your page content
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Small */}
              <div className="border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
                <p className="text-sm font-medium mb-4">Small (sm)</p>
                <div className="bg-background rounded-lg p-6">
                  <PageLoader size="sm" message="Loading..." />
                </div>
              </div>

              {/* Medium */}
              <div className="border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
                <p className="text-sm font-medium mb-4">Medium (md)</p>
                <div className="bg-background rounded-lg p-6">
                  <PageLoader size="md" message="Loading..." />
                </div>
              </div>

              {/* Large */}
              <div className="border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
                <p className="text-sm font-medium mb-4">Large (lg)</p>
                <div className="bg-background rounded-lg p-6">
                  <PageLoader size="lg" message="Loading..." />
                </div>
              </div>

              {/* Extra Large */}
              <div className="border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
                <p className="text-sm font-medium mb-4">Extra Large (xl)</p>
                <div className="bg-background rounded-lg p-6">
                  <PageLoader size="xl" message="Loading..." />
                </div>
              </div>
            </div>
          </div>

          {/* Section: Custom Messages */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Custom Messages</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
                <p className="text-sm font-medium mb-4">Default Message</p>
                <div className="bg-background rounded-lg p-6">
                  <PageLoader size="md" />
                </div>
              </div>

              <div className="border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
                <p className="text-sm font-medium mb-4">Custom Message</p>
                <div className="bg-background rounded-lg p-6">
                  <PageLoader
                    size="md"
                    message="Fetching your data..."
                  />
                </div>
              </div>

              <div className="border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
                <p className="text-sm font-medium mb-4">No Message</p>
                <div className="bg-background rounded-lg p-6">
                  <PageLoader size="md" message="" />
                </div>
              </div>

              <div className="border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
                <p className="text-sm font-medium mb-4">Long Message</p>
                <div className="bg-background rounded-lg p-6">
                  <PageLoader
                    size="md"
                    message="Syncing your documents across all devices..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section: Full Page Loader */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Full Page Loader</h2>
            <p className="text-muted-foreground">
              Overlay loader that covers the entire viewport
            </p>

            <Button
              onClick={() => setShowFullPageLoader(true)}
              className="bg-primary hover:bg-primary/90"
            >
              Show Full Page Loader
            </Button>

            <div className="bg-muted/50 border border-border rounded-lg p-6 text-sm text-muted-foreground">
              <code>
                &lt;PageLoader fullPage&#123;true&#125; message=&#34;Loading
                page...&#34; /&gt;
              </code>
            </div>
          </div>

          {/* Section: Usage Examples */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Usage Examples</h2>

            <div className="bg-muted/50 border border-border rounded-lg p-6 space-y-4 font-mono text-sm">
              <div>
                <p className="text-primary font-semibold mb-2">
                  Basic Usage:
                </p>
                <pre className="bg-background p-3 rounded border border-border overflow-auto">
{`import { PageLoader } from "@/components/page-loader"

export default function MyPage() {
  return (
    <PageLoader size="lg" message="Loading your data..." />
  )
}`}
                </pre>
              </div>

              <div>
                <p className="text-primary font-semibold mb-2">
                  Full Page Overlay:
                </p>
                <pre className="bg-background p-3 rounded border border-border overflow-auto">
{`<PageLoader
  fullPage
  size="lg"
  message="Please wait..."
/>`}
                </pre>
              </div>

              <div>
                <p className="text-primary font-semibold mb-2">
                  In a Conditional:
                </p>
                <pre className="bg-background p-3 rounded border border-border overflow-auto">
{`{isLoading ? (
  <PageLoader message="Fetching data..." />
) : (
  <YourContent />
)}`}
                </pre>
              </div>
            </div>
          </div>

          {/* Section: Props */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Props</h2>

            <div className="overflow-x-auto border border-border rounded-lg">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-4 py-2 text-left font-semibold">Prop</th>
                    <th className="px-4 py-2 text-left font-semibold">Type</th>
                    <th className="px-4 py-2 text-left font-semibold">
                      Default
                    </th>
                    <th className="px-4 py-2 text-left font-semibold">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border hover:bg-muted/30">
                    <td className="px-4 py-2">
                      <code className="bg-muted px-2 py-1 rounded">
                        fullPage
                      </code>
                    </td>
                    <td className="px-4 py-2">boolean</td>
                    <td className="px-4 py-2">false</td>
                    <td className="px-4 py-2">
                      Show as full-page overlay
                    </td>
                  </tr>
                  <tr className="border-b border-border hover:bg-muted/30">
                    <td className="px-4 py-2">
                      <code className="bg-muted px-2 py-1 rounded">
                        message
                      </code>
                    </td>
                    <td className="px-4 py-2">string</td>
                    <td className="px-4 py-2">"Loading..."</td>
                    <td className="px-4 py-2">
                      Custom message to display
                    </td>
                  </tr>
                  <tr className="border-b border-border hover:bg-muted/30">
                    <td className="px-4 py-2">
                      <code className="bg-muted px-2 py-1 rounded">size</code>
                    </td>
                    <td className="px-4 py-2">
                      "sm" | "md" | "lg" | "xl"
                    </td>
                    <td className="px-4 py-2">"lg"</td>
                    <td className="px-4 py-2">Size of the loader icon</td>
                  </tr>
                  <tr className="hover:bg-muted/30">
                    <td className="px-4 py-2">
                      <code className="bg-muted px-2 py-1 rounded">
                        className
                      </code>
                    </td>
                    <td className="px-4 py-2">string</td>
                    <td className="px-4 py-2">-</td>
                    <td className="px-4 py-2">
                      Additional CSS classes
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Full Page Loader Overlay */}
      {showFullPageLoader && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
          onClick={() => setShowFullPageLoader(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <PageLoader
              size="xl"
              message="Loading your dashboard..."
            />
          </div>
        </div>
      )}

      {/* Click hint for full page loader */}
      {showFullPageLoader && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[51] text-sm text-muted-foreground">
          Click anywhere to close
        </div>
      )}
    </div>
  )
}

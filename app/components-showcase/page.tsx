"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { CustomCard } from "@/components/custom/custom-card"
import { CustomInput } from "@/components/custom/custom-input"
import { CustomModal } from "@/components/custom/custom-modal"
import { CustomAlert } from "@/components/custom/custom-alert"
import { showNotification } from "@/components/custom/custom-notification"
import { Button } from "@/components/ui/button"
import { IconSettings, IconMail, IconLock, IconCheck, IconAlertTriangle, IconInfoCircle, IconAlertOctagon } from "@tabler/icons-react"

export default function ComponentShowcase() {
  const [modalOpen, setModalOpen] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const [inputError, setInputError] = useState("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)
    if (value.length < 3) {
      setInputError("Minimum 3 characters required")
    } else {
      setInputError("")
    }
  }

  return (
    <div className="min-h-svh flex flex-col">
      <Header />
      <div className="flex-1 flex flex-col gap-8 p-6">
        <div>
          <h1 className="text-3xl font-bold">Component Showcase</h1>
          <p className="text-muted-foreground">Explore all custom components with their variants</p>
        </div>

        {/* Custom Cards Section */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Custom Cards</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <CustomCard
              title="Default Card"
              description="Standard card variant"
              icon={<IconSettings className="w-5 h-5" />}
            >
              <p className="text-sm text-muted-foreground">
                This is a default card with a clean design and standard styling.
              </p>
            </CustomCard>

            <CustomCard
              title="Highlight Card"
              description="Featured content"
              variant="highlight"
              icon={<IconCheck className="w-5 h-5" />}
            >
              <p className="text-sm text-muted-foreground">
                This card has a highlighted variant with gradient background and hover effects.
              </p>
            </CustomCard>

            <CustomCard
              title="Accent Card"
              description="Accent variant"
              variant="accent"
              icon={<IconSettings className="w-5 h-5" />}
            >
              <p className="text-sm text-muted-foreground">
                This card uses the accent color scheme for emphasis.
              </p>
            </CustomCard>
          </div>

          {/* Card with Footer */}
          <CustomCard
            title="Card with Footer"
            description="Complete card example"
            footer={
              <div className="flex gap-2 justify-end">
                <Button variant="outline" size="sm">
                  Cancel
                </Button>
                <Button size="sm">Save</Button>
              </div>
            }
          >
            <p className="text-sm text-muted-foreground">
              This card has a footer section perfect for actions or additional information.
            </p>
          </CustomCard>
        </section>

        {/* Custom Inputs Section */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Custom Inputs</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <CustomInput
              label="Email Address"
              placeholder="Enter your email"
              type="email"
              icon={<IconMail className="w-4 h-4" />}
              hint="We'll never share your email"
            />

            <CustomInput
              label="Password"
              placeholder="Enter your password"
              type="password"
              icon={<IconLock className="w-4 h-4" />}
              required
            />

            <CustomInput
              label="Username"
              placeholder="Choose a username"
              value={inputValue}
              onChange={handleInputChange}
              error={inputError}
              required
            />

            <CustomInput
              label="Disabled Input"
              placeholder="This input is disabled"
              disabled
            />
          </div>
        </section>

        {/* Custom Alerts Section */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Custom Alerts</h2>
          <div className="space-y-3">
            <CustomAlert
              type="default"
              title="Default Alert"
              description="This is a default alert with neutral styling."
            />

            <CustomAlert
              type="success"
              title="Success!"
              description="Your action has been completed successfully."
            />

            <CustomAlert
              type="info"
              title="Information"
              description="Here's some helpful information you should know about."
            />

            <CustomAlert
              type="warning"
              title="Warning"
              description="Please be careful with this action - it may have consequences."
            />

            <CustomAlert
              type="destructive"
              title="Error!"
              description="Something went wrong. Please try again or contact support."
              action={
                <Button variant="outline" size="sm">
                  Retry
                </Button>
              }
            />
          </div>
        </section>

        {/* Custom Modal Section */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Custom Modal</h2>
          <Button onClick={() => setModalOpen(true)}>Open Modal</Button>

          <CustomModal
            open={modalOpen}
            onOpenChange={setModalOpen}
            title="Modal Example"
            description="This is a custom modal component with integrated close button"
            footer={
              <>
                <Button variant="outline" onClick={() => setModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setModalOpen(false)}>Confirm</Button>
              </>
            }
          >
            <p className="text-sm text-muted-foreground">
              This modal demonstrates the CustomModal component with all its features including close button,
              footer actions, and smooth animations.
            </p>
          </CustomModal>
        </section>

        {/* Notifications Section */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Notifications (Toast)</h2>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() =>
                showNotification("Success notification", {
                  type: "success",
                  description: "Operation completed successfully!",
                })
              }
            >
              Show Success
            </Button>

            <Button
              variant="outline"
              onClick={() =>
                showNotification("Error notification", {
                  type: "error",
                  description: "Something went wrong!",
                })
              }
            >
              Show Error
            </Button>

            <Button
              variant="outline"
              onClick={() =>
                showNotification("Warning notification", {
                  type: "warning",
                  description: "Please be careful!",
                })
              }
            >
              Show Warning
            </Button>

            <Button
              variant="outline"
              onClick={() =>
                showNotification("Info notification", {
                  type: "info",
                  description: "Here's some information!",
                })
              }
            >
              Show Info
            </Button>

            <Button
              variant="outline"
              onClick={() =>
                showNotification("Notification with action", {
                  type: "success",
                  action: {
                    label: "Undo",
                    onClick: () => showNotification("Undo clicked!", { type: "info" }),
                  },
                })
              }
            >
              Show with Action
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}

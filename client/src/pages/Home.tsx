import FormWidget from "@/components/FormWidget"

export default function Home() {
  const handleFormSubmit = (data: any) => {
    console.log("Transaction form data:", data)
    // TODO: Send data to backend API when implemented
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-foreground mb-2">
            Real Estate Transaction
          </h1>
          <p className="text-muted-foreground">
            Complete the form below to process your transaction
          </p>
        </div>
        <FormWidget onSubmit={handleFormSubmit} />
      </div>
    </div>
  )
}
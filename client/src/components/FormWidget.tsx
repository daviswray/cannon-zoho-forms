import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

const formSchema = z.object({
  agentSelect: z.string().min(1, "Please select an agent"),
  clientName: z.string().min(2, "Client name must be at least 2 characters"),
  buyerOrSeller: z.enum(["buyer", "seller"], {
    required_error: "Please select buyer or seller",
  }),
  transactionType: z.string().min(1, "Please select a transaction type"),
  listingType: z.string().min(1, "Please select a listing type"),
})

type FormData = z.infer<typeof formSchema>

interface FormWidgetProps {
  onSubmit?: (data: FormData) => void
  className?: string
}

export default function FormWidget({ onSubmit, className = "" }: FormWidgetProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      agentSelect: "",
      clientName: "",
      buyerOrSeller: undefined,
      transactionType: "",
      listingType: "",
    },
  })

  const handleSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    console.log("Form submitted with data:", data)
    
    try {
      if (onSubmit) {
        await onSubmit(data)
      }
      
      toast({
        title: "Form Submitted",
        description: "Real estate transaction form has been submitted successfully.",
      })
      
      // Reset form after successful submission
      form.reset()
    } catch (error) {
      toast({
        title: "Submission Error",
        description: "There was an error submitting the form. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Generate generic options for dropdowns
  const generateOptions = (count: number) => {
    return Array.from({ length: count }, (_, i) => ({
      value: `option${i + 1}`,
      label: `Option ${i + 1}`,
    }))
  }

  const agentOptions = generateOptions(5)
  const transactionOptions = generateOptions(6)
  const listingOptions = generateOptions(4)

  return (
    <Card className={`w-full max-w-md mx-auto ${className}`}>
      <CardHeader>
        <CardTitle className="text-xl font-medium">Transaction Form</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Agent Select */}
            <FormField
              control={form.control}
              name="agentSelect"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Agent Select</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} data-testid="select-agent">
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an agent" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {agentOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Client Name */}
            <FormField
              control={form.control}
              name="clientName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter client name"
                      data-testid="input-client-name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Buyer or Seller */}
            <FormField
              control={form.control}
              name="buyerOrSeller"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Buyer or Seller</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex space-x-6"
                      data-testid="radio-buyer-seller"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="buyer" id="buyer" />
                        <Label htmlFor="buyer">Buyer</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="seller" id="seller" />
                        <Label htmlFor="seller">Seller</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Transaction Type */}
            <FormField
              control={form.control}
              name="transactionType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Transaction Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} data-testid="select-transaction-type">
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select transaction type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {transactionOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Listing Type */}
            <FormField
              control={form.control}
              name="listingType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Listing Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} data-testid="select-listing-type">
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select listing type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {listingOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting}
              data-testid="button-submit"
            >
              {isSubmitting ? "Submitting..." : "Submit Form"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
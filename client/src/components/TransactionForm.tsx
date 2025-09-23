/// <reference types="vite/client" />
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { transactionFormSchema, type TransactionForm, type FubAgent, type FubPerson, type FubDeal, type ApiResponse } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { User, Building, FileText, Handshake, ExternalLink, Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

const transactionTypes = [
  { value: "bba", label: "Buyer Broker Agreement (BBA)" },
  { value: "la", label: "Listing Agreement (LA)" },
  { value: "uc", label: "Under Contract (UC)" },
];

const listingTypes = [
  { value: "listing", label: "Listing" },
  { value: "lease", label: "Lease" },
];

interface TransactionFormProps {
  onSubmit?: (data: TransactionForm) => void;
}

// API helper functions
async function fetchAgents(): Promise<FubAgent[]> {
  const response = await fetch('/api/agents');
  const result: ApiResponse<FubAgent[]> = await response.json();
  if (!result.success) {
    throw new Error(result.error || 'Failed to fetch agents');
  }
  return result.data || [];
}

async function fetchLead(personId: number): Promise<FubPerson> {
  // Use path parameter instead of query parameter
  const response = await fetch(`/api/lead/${personId}`);
  const result: ApiResponse<FubPerson> = await response.json();
  if (!result.success) {
    throw new Error(result.error || 'Failed to fetch leads');
  }
  if (!result.data) {
    throw new Error('Lead not found');
  }
  return result.data;
}

async function fetchDeals(buyerOrSeller: string, transactionType: string, agentId?: number): Promise<FubDeal[]> {
  const response = await fetch(`/api/deals?buyerOrSeller=${buyerOrSeller}&transactionType=${transactionType}&agentId=${agentId || ''}`);
  const result: ApiResponse<FubDeal[]> = await response.json();
  if (!result.success) {
    throw new Error(result.error || 'Failed to fetch deals');
  }
  return result.data || [];
}

async function submitTransaction(data: TransactionForm) {
  const response = await fetch('/api/transactions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  const result = await response.json();
  if (!result.success) {
    throw new Error(result.error || 'Failed to submit transaction');
  }
  return result.data;
}

export default function TransactionForm({ onSubmit }: TransactionFormProps) {
  // Extract personId from URL search parameters
  const [personId, setPersonId] = useState<string | null>(null);
  
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const personIdParam = urlParams.get('personId');
    if (personIdParam) {
      setPersonId(personIdParam);
    }
  }, []);

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [shouldFetchDeals, setShouldFetchDeals] = useState(false);

  const form = useForm<TransactionForm>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      agentId: "", // Make sure this isn't undefined
      clientName: "",
      buyerOrSeller: undefined, // Consider using a default value
      transactionType: undefined, // Consider using a default value
      listingType: undefined,
      fubDealId: "",
    },
  });

  const buyerOrSeller = form.watch('buyerOrSeller');
  const transactionType = form.watch('transactionType');
  
  // Validate buyer/seller + transaction type combinations
  const isValidCombination = (buyerSeller: string, transType: string) => {
    const validCombinations = {
      'buyer': ['bba', 'uc'],
      'seller': ['la', 'uc']
    };
    return validCombinations[buyerSeller as keyof typeof validCombinations]?.includes(transType);
  };

  // Fetch agents from FUB
  const { data: agents = [], isLoading: agentsLoading } = useQuery({
    queryKey: ['agents'],
    queryFn: fetchAgents,
  });

  // Fetch lead based on URL path parameter
  const { data: leadData, isLoading: leadLoading } = useQuery({
    queryKey: ['lead', personId],
    queryFn: () => fetchLead(Number(personId)),
    enabled: !!personId && !isNaN(Number(personId)),
  });

  // Auto-populate form when lead data is available
  useEffect(() => {
    if (leadData) {
      form.setValue('clientName', `${leadData.firstName} ${leadData.lastName}`);
    }
  }, [leadData, form]);

  // Fetch deals based on conditions
  const { data: deals = [], isLoading: dealsLoading, error: dealsError } = useQuery({
    queryKey: ['deals', buyerOrSeller, transactionType],
    queryFn: () => fetchDeals(buyerOrSeller!, transactionType!, agents.find(a => a.id.toString() === form.getValues('agentId'))?.id),
    enabled: !!(buyerOrSeller && transactionType && isValidCombination(buyerOrSeller, transactionType)),
  });

  // Reset fubDealId when conditions change
  useEffect(() => {
    if (buyerOrSeller && transactionType) {
      form.setValue('fubDealId', '');
    }
  }, [buyerOrSeller, transactionType, form]);

  const submitMutation = useMutation({
    mutationFn: async (data: TransactionForm) => {
      // Submit to both endpoints sequentially
      console.log("Submitting data:", data);
      
      // Validate one more time before submission
      const validationResult = transactionFormSchema.safeParse(data);
      console.log("Validation result:", validationResult);

      if (!validationResult.success) {
        throw new Error("Validation failed: " + validationResult.error.message);
      }
      
      
      
      // Send to main API
      return await submitTransaction(data);
    },
    onSuccess: (data) => {
      toast({
        title: "Transaction Submitted",
        description: data.message || "Transaction submitted successfully to Follow-up Boss",
      });
      form.reset();
      if (onSubmit) {
        onSubmit(form.getValues());
      }
    },
    onError: (error) => {
      console.error("Submission error:", error);
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit transaction",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (data: TransactionForm) => {
    console.log("Form data received:", data);
    console.log("Form values from getValues:", form.getValues());
    
    // Basic validation
    if (!data.agentId || !data.clientName || !data.buyerOrSeller || !data.transactionType) {
      toast({
        title: "Missing Required Fields",
        description: "Please fill out all required fields before submitting.",
        variant: "destructive",
      });
      return;
    }

    submitMutation.mutate(data);
  };

  const handleCreateNew = () => {
    // Open appropriate Zoho form based on transaction type
    const selectedAgent = agents.find(a => a.id.toString() === form.getValues('agentId'));
    const agentFirst = selectedAgent ? `${selectedAgent.firstName}` : '';
    const agentLast = selectedAgent ? `${selectedAgent.lastName}` : '';
    const agentEmail = selectedAgent ? `${selectedAgent.email}` : '';
    const clientFirst = form.getValues('clientName').split(' ')[0] || '';
    const clientLast = form.getValues('clientName').split(' ').slice(1).join(' ') || '';
    const clientEmail = leadData?.email || '';
    const clientPhone = leadData?.phone || '';

    const ZOHO_FORM_URLS = {
      //buyer-uc directs to New Contract. Default is also New Contract

    'buyer-bba': (agentFirst: string, agentLast: string, clientFirst: string, clientLast: string, agentEmail: string, clientEmail: string, clientPhone: string) => `${import.meta.env.VITE_ZOHO_BUYER_BBA_FORM_URL || 'https://forms.zohopublic.com/CannonTeam/form/NewBBASubmission/formperma/Qm2AwO4xY7RPOIJ0Of_9k3gcV-dzHu32C7Vn3w5OH9g'}?Name_First=${encodeURIComponent(agentFirst)}&Name_Last=${encodeURIComponent(agentLast)}&Name1_First=${encodeURIComponent(clientFirst)}&Name1_Last=${encodeURIComponent(clientLast)}&Email2=${encodeURIComponent(agentEmail)}&Email=${encodeURIComponent(clientEmail)}&PhoneNumber=${encodeURIComponent(clientPhone)}`,
      
    'buyer-uc': (agentFirst: string, agentLast: string, clientFirst: string, clientLast: string, agentEmail: string, clientEmail: string, clientPhone: string) => `${import.meta.env.VITE_ZOHO_BUYER_UC_FORM_URL || 'https://secure.cannonteam.com/CannonTeam/form/SubmitANewContract/formperma/9lTM0a8kzmi4iy6zuFQUVfhT0lfqnnOlbLH05fn_x1E'}?Name_First=${encodeURIComponent(agentFirst)}&Name_Last=${encodeURIComponent(agentLast)}&Name1_First=${encodeURIComponent(clientFirst)}&Name1_Last=${encodeURIComponent(clientLast)}&Email=${encodeURIComponent(agentEmail)}&Email1=${encodeURIComponent(clientEmail)}&PhoneNumber=${encodeURIComponent(clientPhone)}`,

    'seller-la': (agentFirst: string, agentLast: string, clientFirst: string, clientLast: string, agentEmail: string, clientEmail: string, clientPhone: string) => `${import.meta.env.VITE_ZOHO_SELLER_LA_FORM_URL || 'https://secure.cannonteam.com/CannonTeam/form/SubmitANewListing/formperma/78JeD2bofmAdny2Oa57i0fpLQNhVmTkpOyop0eBp0ck'}?Name2_First=${encodeURIComponent(agentFirst)}&Name2_Last=${encodeURIComponent(agentLast)}&Name_First=${encodeURIComponent(clientFirst)}&Name_Last=${encodeURIComponent(clientLast)}&Email2=${encodeURIComponent(agentEmail)}&Email=${encodeURIComponent(clientEmail)}&PhoneNumber1=${encodeURIComponent(clientPhone)}`,

    'seller-uc': (agentFirst: string, agentLast: string, clientFirst: string, clientLast: string, agentEmail: string, clientEmail: string, clientPhone: string) => `${import.meta.env.VITE_ZOHO_SELLER_UC_FORM_URL || 'https://secure.cannonteam.com/CannonTeam/form/SubmitANewLease/formperma/N9yiE4OPoXlb3WkOetjQdSPPdU7YTQMUbtZcaqTP0TU'}?Name2_First=${encodeURIComponent(agentFirst)}&Name2_Last=${encodeURIComponent(agentLast)}&Name_First=${encodeURIComponent(clientFirst)}&Name_Last=${encodeURIComponent(clientLast)}&Email2=${encodeURIComponent(agentEmail)}&Email=${encodeURIComponent(clientEmail)}&PhoneNumber1=${encodeURIComponent(clientPhone)}`,
      //'default': (agentFirst: string, agentLast: string, clientFirst: string, clientLast: string, agentEmail: string) => `${import.meta.env.VITE_ZOHO_BUYER_UC_FORM_URL || 'https://secure.cannonteam.com/CannonTeam/form/SubmitANewContract/formperma/9lTM0a8kzmi4iy6zuFQUVfhT0lfqnnOlbLH05fn_x1E'}?Name_First=${encodeURIComponent(agentFirst)}&Name_Last=${encodeURIComponent(agentLast)}&Name1_First=${encodeURIComponent(clientFirst)}&Name1_Last=${encodeURIComponent(clientLast)}&Email=${encodeURIComponent(agentEmail)}`
    };



    const formType = `${buyerOrSeller || 'default'}-${transactionType || ''}` as keyof typeof ZOHO_FORM_URLS;
    const zohoUrlFn = ZOHO_FORM_URLS[formType] ;//|| ZOHO_FORM_URLS.default
    const zohoUrl = zohoUrlFn(agentFirst, agentLast, clientFirst, clientLast, agentEmail, clientEmail, clientPhone);
    window.open(zohoUrl, '_blank');
  };

  // Helper function to get form type display text for buttons
  const getFormTypeDisplay = () => {
    const foundType = transactionTypes.find(type => type.value === transactionType);
    return foundType ? foundType.label : 'Form Type';
  };

  // Show conditional logic information
  const getConditionalMessage = () => {
    if (!buyerOrSeller || !transactionType) return null;
    
    let message = "";
    if (buyerOrSeller === 'buyer') {
      if (transactionType === 'bba') {
        message = "Showing FUB Deals for Buyer Applications";
      } else if (transactionType === 'uc') {
        message = "Showing FUB Deals for Buyer Applications & BBA";
      }
    } else if (buyerOrSeller === 'seller') {
      if (transactionType === 'la') {
        message = "Showing FUB Deals for Seller Applications";
      } else if (transactionType === 'uc') {
        message = "Showing FUB Deals for Seller Applications & LA";
      }
    }
    
    return message ? (
      <div className="p-3 bg-primary/10 border border-primary/20 rounded-md text-sm text-primary">
        {message}
      </div>
    ) : null;
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center gap-2">
        <FileText className="h-6 w-6 text-primary" />
        <CardTitle>Transaction Form</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {getConditionalMessage()}
            {/* Agent Selection */}
            <FormField
              control={form.control}
              name="agentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Agent Select
                  </FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value} 
                    data-testid="select-agent"
                    disabled={agentsLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={
                          agentsLoading ? "Loading agents..." : "Choose an agent"
                        } />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {agents.map((agent) => (
                        <SelectItem key={agent.id} value={agent.id.toString()}>
                          {agent.firstName} {agent.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                  {agentsLoading && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Loading agents from Follow-up Boss...
                    </div>
                  )}
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
                  placeholder="Enter client's full name"
                  data-testid="input-client-name"
                  {...field}
                  value={field.value || (leadData ? `${leadData.firstName} ${leadData.lastName}` : "")}
                  onChange={field.onChange}
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
                      className="flex flex-row gap-6"
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
                  <FormLabel className="flex items-center gap-2">
                    <Handshake className="h-4 w-4" />
                    Transaction Type
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} data-testid="select-transaction-type">
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select transaction type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {transactionTypes
                        .filter(type => {
                          if (!buyerOrSeller) return true;
                          if (buyerOrSeller === 'buyer') return ['bba', 'uc'].includes(type.value);
                          if (buyerOrSeller === 'seller') return ['la', 'uc'].includes(type.value);
                          return true;
                        })
                        .map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Listing Type - Only show if Transaction Type is Listing Agreement */}
            {transactionType === 'la' && (
              <FormField
                control={form.control}
                name="listingType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      Listing Type
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex flex-row gap-6"
                        data-testid="radio-listing-type"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="listing" id="listing" />
                          <Label htmlFor="listing">Listing</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="lease" id="lease" />
                          <Label htmlFor="lease">Lease</Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* FUB Deal Selection */}
            {buyerOrSeller && transactionType && (
              <FormField
                control={form.control}
                name="fubDealId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>FUB Deal Selection</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value} 
                      data-testid="select-fub-deal"
                      disabled={dealsLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={
                            !isValidCombination(buyerOrSeller!, transactionType!) ? "Invalid combination" :
                            dealsLoading ? "Loading deals..." : 
                            dealsError ? "Error loading deals" :
                            deals.length === 0 ? "No matching deals found" :
                            "Select a deal from Follow-up Boss"
                          } />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {deals.map((deal) => (
                          <SelectItem key={deal.id} value={deal.id.toString()}>
                            {deal.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                    {dealsLoading && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Loading deals based on your selection...
                      </div>
                    )}
                    {dealsError && (
                      <div className="text-sm text-destructive">
                        Failed to load deals. Please check your Follow-up Boss connection.
                      </div>
                    )}
                    {!isValidCombination(buyerOrSeller || '', transactionType || '') && buyerOrSeller && transactionType && (
                      <div className="text-sm text-destructive">
                        {buyerOrSeller === 'buyer' ? 'Buyers can only select BBA or Under Contract' : 'Sellers can only select Listing Agreement or Under Contract'}
                      </div>
                    )}
                  </FormItem>
                )}
              />
            )}

            <div className="flex gap-4">
              <Button 
                type="submit" 
                className="flex-1" 
                data-testid="button-submit"
                disabled={submitMutation.isPending || !buyerOrSeller || !transactionType || !isValidCombination(buyerOrSeller, transactionType)}
              >
                {submitMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  transactionType ? `Submit ${getFormTypeDisplay()}` : "Submit"
                )}
              </Button>
              
              <Button 
                type="button"
                variant="outline"
                className="flex-1"
                onClick={handleCreateNew}
                data-testid="button-create-new"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                {transactionType ? `Create New (${getFormTypeDisplay()})` : "Create New"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
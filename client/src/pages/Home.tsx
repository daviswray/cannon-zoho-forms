import TransactionForm from '@/components/TransactionForm';
import { type TransactionForm as TransactionFormType } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';

export default function Home() {
  const { toast } = useToast();

  const handleFormSubmit = (data: TransactionFormType) => {
    console.log('Transaction form submitted:', data);
    
    // Show success toast
    toast({
      title: "Transaction Submitted",
      description: `Transaction for ${data.clientName} has been successfully submitted.`,
    });

    // In a real application, this would send data to the server
    // Example: await apiRequest('/api/transactions', { method: 'POST', body: data });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Real Estate Transaction Management
          </h1>
        </div>
        
        <TransactionForm onSubmit={handleFormSubmit} />
        
        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>All fields are required to complete the transaction processing.</p>
        </div>
      </div>
    </div>
  );
}
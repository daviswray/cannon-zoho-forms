import TransactionForm from '../TransactionForm';
import { type TransactionForm as TransactionFormType } from '@shared/schema';

export default function TransactionFormExample() {
  const handleFormSubmit = (data: TransactionFormType) => {
    console.log('Transaction form submitted:', data);
    // In a real app, this would send data to the server
    alert(`Transaction submitted for ${data.clientName}!`);
  };

  return (
    <div className="p-6 min-h-screen bg-background">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Real Estate Transaction Form</h1>
          <p className="text-muted-foreground">Complete all fields to process the transaction</p>
        </div>
        <TransactionForm onSubmit={handleFormSubmit} />
      </div>
    </div>
  );
}
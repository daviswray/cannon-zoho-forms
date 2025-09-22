import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import TransactionForm from "@/components/TransactionForm";
import NotFound from "@/pages/not-found";

// Wrapper component to handle route props
function TransactionFormPage() {
  return <TransactionForm />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/form" component={TransactionFormPage} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

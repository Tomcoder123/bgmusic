import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({ 
  title = "Connection Error", 
  message = "Could not connect to YouTube API. Please check your internet connection.", 
  onRetry 
}: ErrorStateProps) {
  return (
    <div className="px-4 py-12 text-center">
      <div className="text-5xl text-destructive mb-4 flex justify-center">
        <AlertCircle className="h-16 w-16" />
      </div>
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <p className="text-muted-foreground mb-4">{message}</p>
      {onRetry && (
        <Button 
          className="px-4 py-2 bg-primary rounded-full text-white font-medium hover:bg-primary-light transition-colors"
          onClick={onRetry}
        >
          Try Again
        </Button>
      )}
    </div>
  );
}

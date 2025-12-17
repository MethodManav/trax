import { useState } from "react";
import { motion } from "framer-motion";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { useAddTracker } from "@/hooks/useTrackers";
import { Category, categoryConfig } from "@/lib/mockData";
import { Loader2 } from "lucide-react";

interface AddTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCategory?: Category;
}

export function AddTrackerModal({ isOpen, onClose, defaultCategory = "mobiles" }: AddTrackerModalProps) {
  const [category, setCategory] = useState<Category>(defaultCategory);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [currentPrice, setCurrentPrice] = useState("");
  const [targetPrice, setTargetPrice] = useState("");
  const [alertType, setAlertType] = useState<"below" | "percent">("below");
  
  const addTracker = useAddTracker();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await addTracker.mutateAsync({
      category,
      name,
      url: category !== "flights" ? url : undefined,
      route: category === "flights" ? url : undefined,
      currentPrice: parseFloat(currentPrice),
      targetPrice: parseFloat(targetPrice),
      originalPrice: parseFloat(currentPrice),
    });
    
    // Reset form
    setName("");
    setUrl("");
    setCurrentPrice("");
    setTargetPrice("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Tracker">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Category Selector */}
        <div>
          <label className="text-sm font-medium text-foreground mb-3 block">
            Category
          </label>
          <div className="grid grid-cols-3 gap-3">
            {(Object.keys(categoryConfig) as Category[]).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  category === cat
                    ? "border-primary bg-primary/5"
                    : "border-glass-border hover:border-primary/50"
                }`}
              >
                <span className="text-2xl block mb-2">
                  {categoryConfig[cat].icon}
                </span>
                <span className="text-sm font-medium text-foreground">
                  {categoryConfig[cat].label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Product/Route Name */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            {category === "flights" ? "Route" : "Product Name"}
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={category === "flights" ? "e.g., New York → London" : "e.g., iPhone 15 Pro"}
            className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            required
          />
        </div>

        {/* URL/Route Code */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            {category === "flights" ? "Route Code" : "Product URL"}
          </label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder={category === "flights" ? "e.g., JFK → LHR" : "https://..."}
            className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          />
        </div>

        {/* Prices */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Current Price ($)
            </label>
            <input
              type="number"
              value={currentPrice}
              onChange={(e) => setCurrentPrice(e.target.value)}
              placeholder="0.00"
              className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Target Price ($)
            </label>
            <input
              type="number"
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
              placeholder="0.00"
              className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              required
            />
          </div>
        </div>

        {/* Alert Condition */}
        <div>
          <label className="text-sm font-medium text-foreground mb-3 block">
            Alert Condition
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setAlertType("below")}
              className={`flex-1 py-3 rounded-xl border-2 transition-all duration-200 text-sm font-medium ${
                alertType === "below"
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-glass-border text-muted-foreground hover:border-primary/50"
              }`}
            >
              Below target price
            </button>
            <button
              type="button"
              onClick={() => setAlertType("percent")}
              className={`flex-1 py-3 rounded-xl border-2 transition-all duration-200 text-sm font-medium ${
                alertType === "percent"
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-glass-border text-muted-foreground hover:border-primary/50"
              }`}
            >
              % drop from current
            </button>
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="hero" 
            className="flex-1"
            disabled={addTracker.isPending}
          >
            {addTracker.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Adding...
              </>
            ) : (
              "Add Tracker"
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Category, categoryConfig } from "@/lib/mockData";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AddTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCategory?: Category;
}

export function AddTrackerModal({
  isOpen,
  onClose,
  defaultCategory = "mobiles",
}: AddTrackerModalProps) {
  const queryClient = useQueryClient();
  const [category, setCategory] = useState<Category>(defaultCategory);
  const [name, setName] = useState("");
  const [modelName, setModelName] = useState("");
  const [ram, setRam] = useState("");
  const [rom, setRom] = useState("");
  const [targetPrice, setTargetPrice] = useState("");
  const [timeDuration, setTimeDuration] = useState("7d");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Only support mobile category for now
      if (category !== "mobiles") {
        setError("Only mobile trackers are supported at this time");
        setIsLoading(false);
        return;
      }

      const token = localStorage.getItem("x-auth-token");
      if (!token) {
        setError("Please login to add a tracker");
        setIsLoading(false);
        return;
      }

      // Validate required fields
      if (!name.trim()) {
        setError("Brand name is required");
        setIsLoading(false);
        return;
      }

      if (!modelName.trim()) {
        setError("Model name is required");
        setIsLoading(false);
        return;
      }

      if (!targetPrice || parseFloat(targetPrice) <= 0) {
        setError("Target price must be greater than 0");
        setIsLoading(false);
        return;
      }

      // Convert RAM and ROM from string to numbers (MB for RAM, MB for ROM)
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/triggers`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
          body: JSON.stringify({
            eventType: "mobile",
            config: {
              brandName: name.trim(),
              modelName: modelName.trim(),
              ram: ram,
              rom: rom,
            },
            expectedPrice: parseFloat(targetPrice),
            timeDuration: timeDuration,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create trigger");
      }

      // Invalidate queries to refresh the list
      queryClient.invalidateQueries({ queryKey: ["tracked-mobile-triggers"] });
      queryClient.invalidateQueries({ queryKey: ["trackers"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });

      // Reset form
      setName("");
      setModelName("");
      setRam("");
      setRom("");
      setTargetPrice("");
      setTimeDuration("7d");
      onClose();
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add tracker");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Tracker">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Category Selector */}
        <div>
          <label className="text-sm font-medium text-foreground mb-3 block">
            Category
          </label>
          <div className="grid grid-cols-2 gap-3">
            {(["mobiles", "flights"] as Category[]).map((cat) => (
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
            {category === "flights" ? "From " : "Phone Name"}
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={
              category === "flights"
                ? "e.g., New York → London"
                : "e.g., iPhone 15 Pro"
            }
            className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            required
          />
        </div>
        {/* To Flight */}
        {category === "flights" && (
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              To
            </label>
            <input
              type="text"
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              placeholder="e.g., London"
              className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </div>
        )}
        {/* Model Name */}
        {category === "mobiles" && (
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Model Name
            </label>
            <input
              type="text"
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              placeholder="17 Pro Max, Galaxy S23 Ultra, etc."
              className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              required
            />
          </div>
        )}

        {/* RAM */}
        {category === "mobiles" && (
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              RAM
            </label>
            <input
              type="text"
              value={ram}
              onChange={(e) => setRam(e.target.value)}
              placeholder="8GB, 12GB, etc."
              className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              required
            />
          </div>
        )}

        {/* ROM */}
        {category === "mobiles" && (
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              ROM
            </label>
            <input
              type="text"
              value={rom}
              onChange={(e) => setRom(e.target.value)}
              placeholder="128GB, 256GB, etc."
              className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              required
            />
          </div>
        )}

        {/* Target Price */}
        {category === "mobiles" && (
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Target Price ($)
            </label>
            <input
              type="number"
              step="0.01"
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
              placeholder="e.g., 999.99"
              className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              required
            />
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
            {error}
          </div>
        )}

        {/* Submit */}
        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="hero"
            className="flex-1"
            disabled={isLoading}
          >
            {isLoading ? (
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

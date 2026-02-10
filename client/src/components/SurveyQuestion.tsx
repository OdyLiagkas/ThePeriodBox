import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronDown, X, GripVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface Option {
  value: string;
  label: string;
}

interface SurveyQuestionProps {
  question: string;
  description?: string;
  type: "single" | "multiple" | "text" | "select-multiple" | "dropdown" | "ranking";
  options?: Option[];
  value?: string | string[];
  onChange: (value: string | string[]) => void;
  maxSelections?: number;
}

export function SurveyQuestion({ 
  question, 
  description, 
  type, 
  options = [], 
  value = type === "multiple" || type === "select-multiple" || type === "ranking" ? [] : "",
  onChange,
  maxSelections
}: SurveyQuestionProps) {
  const [rankingItems, setRankingItems] = useState<Option[]>(options);

  const handleMultipleChange = (optionValue: string, checked: boolean) => {
    const currentValues = Array.isArray(value) ? value : [];
    
    // Check maxSelections limit
    if (maxSelections && checked && currentValues.length >= maxSelections) {
      return; // Don't allow more selections than max
    }
    
    const newValues = checked
      ? [...currentValues, optionValue]
      : currentValues.filter(v => v !== optionValue);
    onChange(newValues);
    console.log(`${checked ? "Selected" : "Deselected"}: ${optionValue}`);
  };

  const handleRemoveSelection = (optionValue: string) => {
    const currentValues = Array.isArray(value) ? value : [];
    onChange(currentValues.filter(v => v !== optionValue));
  };

  const handleRankingChange = (optionValue: string, newRank: number) => {
    const currentRanks = (value as string[]) || [];
    const newRanks = [...currentRanks];
    
    // Remove from current position if exists
    const existingIdx = newRanks.indexOf(optionValue);
    if (existingIdx > -1) {
      newRanks.splice(existingIdx, 1);
    }
    
    // Insert at new position (0-indexed)
    if (newRank >= 0 && newRank <= newRanks.length) {
      newRanks.splice(newRank, 0, optionValue);
    }
    
    onChange(newRanks);
  };

  const getCurrentRank = (optionValue: string): number => {
    const currentRanks = (value as string[]) || [];
    return currentRanks.indexOf(optionValue);
  };

  return (
    <Card className="border-2" data-testid="card-survey-question">
      <CardContent className="p-8 space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold font-accent" data-testid="text-question">{question}</h2>
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>

        {type === "dropdown" ? (
          <div className="space-y-3">
            <select
              value={(value as string) || ""}
              onChange={(e) => {
                onChange(e.target.value);
                console.log(`Selected: ${e.target.value}`);
              }}
              className="w-full p-3 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              data-testid="select-dropdown"
            >
              <option value="" disabled>Select an option...</option>
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        ) : type === "ranking" ? (
          <div className="space-y-3" data-testid="ranking-group">
            <p className="text-sm text-muted-foreground mb-4">
              Drag to reorder or use the dropdowns to set priority (1 = highest priority)
            </p>
            {options.map((option, index) => {
              const currentRank = getCurrentRank(option.value);
              const displayRank = currentRank === -1 ? "" : currentRank + 1;
              
              return (
                <div
                  key={option.value}
                  className="flex items-center gap-3 p-4 rounded-lg border bg-card hover-elevate transition-all"
                >
                  <GripVertical className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  <select
                    value={displayRank}
                    onChange={(e) => {
                      const newRank = e.target.value === "" ? -1 : parseInt(e.target.value) - 1;
                      if (newRank === -1) {
                        // Remove from ranking
                        const currentRanks = (value as string[]) || [];
                        onChange(currentRanks.filter(v => v !== option.value));
                      } else {
                        handleRankingChange(option.value, newRank);
                      }
                    }}
                    className="w-20 p-2 border rounded text-center focus:outline-none focus:ring-2 focus:ring-primary"
                    data-testid={`rank-select-${option.value}`}
                  >
                    <option value="">Rank</option>
                    {options.map((_, i) => (
                      <option key={i} value={i + 1}>{i + 1}</option>
                    ))}
                  </select>
                  <span className="flex-1 font-medium">{option.label}</span>
                  {currentRank !== -1 && (
                    <Badge variant="secondary" className="ml-2">
                      #{displayRank}
                    </Badge>
                  )}
                </div>
              );
            })}
            
            {/* Show current ranking order */}
            {Array.isArray(value) && value.length > 0 && (
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium mb-2">Your current ranking:</p>
                <ol className="list-decimal list-inside space-y-1">
                  {value.map((val) => {
                    const opt = options.find(o => o.value === val);
                    return opt ? <li key={val} className="text-sm">{opt.label}</li> : null;
                  })}
                </ol>
              </div>
            )}
          </div>
        ) : type === "select-multiple" ? (
          <div className="space-y-3">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between text-left font-normal"
                  data-testid="button-select-multiple"
                >
                  <span className="text-muted-foreground">
                    {Array.isArray(value) && value.length > 0
                      ? `${value.length} selected`
                      : "Select brands..."}
                  </span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <div className="max-h-[300px] overflow-y-auto p-4 space-y-2">
                  {options.map((option) => {
                    const isChecked = Array.isArray(value) && value.includes(option.value);
                    const isDisabled = maxSelections !== undefined && 
                      !isChecked && 
                      Array.isArray(value) && 
                      value.length >= maxSelections;
                    
                    return (
                      <Label
                        key={option.value}
                        htmlFor={`select-${option.value}`}
                        className={`flex items-center space-x-3 p-2 rounded-md hover-elevate transition-all ${
                          isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                        }`}
                      >
                        <Checkbox
                          id={`select-${option.value}`}
                          checked={isChecked}
                          disabled={isDisabled}
                          onCheckedChange={(checked) => handleMultipleChange(option.value, checked === true)}
                          data-testid={`checkbox-select-${option.value}`}
                        />
                        <span className="flex-1 font-medium">{option.label}</span>
                      </Label>
                    );
                  })}
                </div>
              </PopoverContent>
            </Popover>
            
            {Array.isArray(value) && value.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {value.map((selectedValue) => {
                  const option = options.find(opt => opt.value === selectedValue);
                  return option ? (
                    <Badge
                      key={selectedValue}
                      variant="secondary"
                      className="gap-1 pr-1"
                      data-testid={`badge-${selectedValue}`}
                    >
                      {option.label}
                      <button
                        onClick={() => handleRemoveSelection(selectedValue)}
                        className="ml-1 hover-elevate rounded-full p-0.5"
                        data-testid={`button-remove-${selectedValue}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ) : null;
                })}
              </div>
            )}
            
            {maxSelections && (
              <p className="text-xs text-muted-foreground">
                Select up to {maxSelections} options ({Array.isArray(value) ? value.length : 0} selected)
              </p>
            )}
          </div>
        ) : type === "text" ? (
          <div className="space-y-3">
            <Input
              type="text"
              placeholder="Enter your answer..."
              value={value as string}
              onChange={(e) => onChange(e.target.value)}
              className="text-base"
              data-testid="input-text"
            />
          </div>
        ) : type === "single" ? (
          <RadioGroup 
            value={value as string} 
            onValueChange={(newValue) => {
              onChange(newValue);
              console.log(`Selected: ${newValue}`);
            }}
            data-testid="radio-group"
          >
            <div className="space-y-3">
              {options.map((option) => (
                <Label
                  key={option.value}
                  htmlFor={option.value}
                  className="flex items-center space-x-3 p-4 rounded-lg hover-elevate border cursor-pointer transition-all w-full"
                >
                  <RadioGroupItem
                    value={option.value}
                    id={option.value}
                    data-testid={`radio-${option.value}`}
                  />
                  <span className="flex-1 font-medium">{option.label}</span>
                </Label>
              ))}
            </div>
          </RadioGroup>
        ) : (
          <div className="space-y-3" data-testid="checkbox-group">
            {options.map((option) => {
              const isChecked = Array.isArray(value) && value.includes(option.value);
              const isDisabled = maxSelections !== undefined && 
                !isChecked && 
                Array.isArray(value) && 
                value.length >= maxSelections;
              
              return (
                <Label
                  key={option.value}
                  htmlFor={option.value}
                  className={`flex items-center space-x-3 p-4 rounded-lg hover-elevate border transition-all w-full ${
                    isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                  }`}
                >
                  <Checkbox 
                    id={option.value}
                    checked={isChecked}
                    disabled={isDisabled}
                    onCheckedChange={(checked) => handleMultipleChange(option.value, checked === true)}
                    data-testid={`checkbox-${option.value}`}
                  />
                  <span className="flex-1 font-medium">{option.label}</span>
                </Label>
              );
            })}
            
            {maxSelections && (
              <p className="text-xs text-muted-foreground">
                Select up to {maxSelections} options ({Array.isArray(value) ? value.length : 0} selected)
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
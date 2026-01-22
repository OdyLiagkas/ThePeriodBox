import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronDown, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Option {
  value: string;
  label: string;
}

interface SurveyQuestionProps {
  question: string;
  description?: string;
  type: "single" | "multiple" | "text" | "select-multiple";
  options?: Option[];
  value?: string | string[];
  onChange: (value: string | string[]) => void;
}

export function SurveyQuestion({ 
  question, 
  description, 
  type, 
  options = [], 
  value = type === "multiple" || type === "select-multiple" ? [] : "",
  onChange 
}: SurveyQuestionProps) {
  const handleMultipleChange = (optionValue: string, checked: boolean) => {
    const currentValues = Array.isArray(value) ? value : [];
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

  return (
    <Card className="border-2" data-testid="card-survey-question">
      <CardContent className="p-8 space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold font-accent" data-testid="text-question">{question}</h2>
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>

        {type === "select-multiple" ? (
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
                    return (
                      <Label
                        key={option.value}
                        htmlFor={`select-${option.value}`}
                        className="flex items-center space-x-3 p-2 rounded-md hover-elevate transition-all cursor-pointer"
                      >
                        <Checkbox
                          id={`select-${option.value}`}
                          checked={isChecked}
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
              return (
                <Label
                  key={option.value}
                  htmlFor={option.value}
                  className="flex items-center space-x-3 p-4 rounded-lg hover-elevate border cursor-pointer transition-all w-full"
                >
                  <Checkbox 
                    id={option.value}
                    checked={isChecked}
                    onCheckedChange={(checked) => handleMultipleChange(option.value, checked === true)}
                    data-testid={`checkbox-${option.value}`}
                  />
                  <span className="flex-1 font-medium">{option.label}</span>
                </Label>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

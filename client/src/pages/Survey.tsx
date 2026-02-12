import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SurveyProgress } from "@/components/SurveyProgress";
import { SurveyQuestion } from "@/components/SurveyQuestion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLocation } from "wouter";
import { CheckCircle2, GripVertical } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Question {
  id: string;
  question: string;
  description?: string;
  type: "single" | "multiple" | "text" | "select-multiple" | "dropdown" | "ranking";
  options?: { value: string; label: string }[];
  maxSelections?: number;
  conditional?: (answers: Record<string, string | string[]>) => boolean;
  allowOther?: boolean;
  otherPlaceholder?: string;
  optional?: boolean;
}

// Hormonal stage options
const hormonalStageOptions = [
  { value: "no-change", label: "Not in a period of hormonal change" },
  { value: "on-bc", label: "On hormonal birth control for > 2 years (pill, patch, IUD, etc.)" },
  { value: "stopped-bc", label: "Recently stopped hormonal birth control" },
  { value: "started-bc", label: "Recently started hormonal birth control" },
  { value: "pregnant", label: "Currently pregnant" },
  { value: "postpartum", label: "Postpartum or recently gave birth" },
  { value: "perimenopausal", label: "Perimenopausal" },
  { value: "menopausal", label: "Menopausal" },
];

// Helper to determine which path user is on
const getUserPath = (answers: Record<string, string | string[]>) => {
  const stage = answers["hormonal-stage"] as string;
  if (!stage) return null;
  if (["no-change", "on-bc", "stopped-bc", "started-bc"].includes(stage)) return "menstruating";
  if (stage === "pregnant") return "pregnant";
  if (stage === "postpartum") return "postpartum";
  if (stage === "perimenopausal") return "perimenopausal";
  if (stage === "menopausal") return "menopausal";
  return null;
};

// Helper to check if user should see the goals question
const shouldShowGoals = (answers: Record<string, string | string[]>) => {
  const stage = answers["hormonal-stage"] as string;
  return ["no-change", "on-bc", "stopped-bc", "started-bc"].includes(stage);
};

// Base questions (shown to everyone)
const baseQuestions: Question[] = [
  {
    id: "hormonal-stage",
    question: "What is your current hormonal stage?",
    type: "dropdown",
    options: hormonalStageOptions,
  },
  {
    id: "goals",
    question: "What are you looking to get from your customized period box?",
    description: "Select all that apply.",
    type: "multiple",
    options: [
      { value: "exploring", label: "Exploring new brands" },
      { value: "better-product", label: "Finding a product that works better for my body" },
      { value: "new-type", label: "Introducing a new product type" },
      { value: "switching", label: "Switching products" },
      { value: "organic", label: "Switch to fully organic products" },
    ],
    conditional: (answers) => shouldShowGoals(answers),
  },
];

// Menstruating path questions (A, B, C, D selected)
const menstruatingQuestions: Question[] = [
  {
    id: "flow",
    question: "How would you describe your flow?",
    type: "single",
    options: [
      { value: "light", label: "Light – minimal flow 1-2 days" },
      { value: "moderate", label: "Moderate – regular flow 3-5 days" },
      { value: "heavy", label: "Heavy – significant flow, 5+ days" },
      { value: "heavy-then-moderate", label: "Heavy the first ~2 days, moderate days 3/4, light last part of period" },
      { value: "varies", label: "Varies – changes month to month" },
    ],
  },
  {
    id: "past-products",
    question: "Which products have you used in the past?",
    description: "Check all that apply.",
    type: "multiple",
    options: [
      { value: "tampons", label: "Tampons" },
      { value: "pads", label: "Pads" },
      { value: "cups", label: "Menstrual cups" },
      { value: "discs", label: "Menstrual discs" },
      { value: "underwear", label: "Period underwear" },
      { value: "liners", label: "Panty liners" },
    ],
  },
  {
    id: "organic-preference",
    question: "Do you prefer organic / natural materials?",
    type: "single",
    options: [
      { value: "always", label: "Yes, always" },
      { value: "sometimes", label: "Sometimes / open to trying" },
      { value: "not-important", label: "Not important to me" },
    ],
  },
  {
    id: "tampon-applicator",
    question: "For tampons, do you prefer:",
    type: "single",
    options: [
      { value: "plastic", label: "Plastic applicators" },
      { value: "cardboard", label: "Cardboard" },
      { value: "no-applicator", label: "No applicator (digital)" },
      { value: "no-preference", label: "Does not matter" },
    ],
  },
  {
    id: "leaks",
    question: "Have you ever had leaks with your current products?",
    type: "single",
    options: [
      { value: "often", label: "Often" },
      { value: "sometimes", label: "Sometimes" },
      { value: "rarely", label: "Rarely / never" },
    ],
  },
  {
    id: "sensitivities",
    question: "Do you have any sensitivities?",
    description: "We'll filter out products that may not work for you.",
    type: "multiple",
    options: [
      { value: "fragrance", label: "Fragrance sensitivity" },
      { value: "latex", label: "Latex allergy" },
      { value: "hypoallergenic", label: "Prefer hypoallergenic materials" },
      { value: "none", label: "No known sensitivities" },
    ],
  },
  {
    id: "comfort",
    question: "Do you feel your current products are comfortable?",
    type: "single",
    options: [
      { value: "very", label: "Yes, very" },
      { value: "sometimes", label: "Sometimes" },
      { value: "struggle", label: "No, I struggle with comfort" },
    ],
  },
  {
    id: "current-brand",
    question: "Which brand(s) are you currently using?",
    description: "Select all that apply. If selecting 'Other', please specify brands separated by commas.",
    type: "select-multiple",
    allowOther: true,
    otherPlaceholder: "Enter other brands (separate by commas)...",
    options: [
      { value: "always", label: "Always" },
      { value: "august", label: "August" },
      { value: "cora", label: "Cora" },
      { value: "daye", label: "Daye" },
      { value: "generic", label: "Generic Store Brands" },
      { value: "here-we-flo", label: "Here We Flo" },
      { value: "honey-pot", label: "Honey Pot" },
      { value: "kind-cup", label: "Kind Cup" },
      { value: "kotex", label: "Kotex" },
      { value: "lola", label: "LOLA" },
      { value: "marlow", label: "Marlow" },
      { value: "natracare", label: "Natracare" },
      { value: "ob", label: "OB" },
      { value: "organyc", label: "Organyc" },
      { value: "playtex", label: "Playtex" },
      { value: "rael", label: "Rael" },
      { value: "seventh-generation", label: "Seventh Generation" },
      { value: "stayfree", label: "Stayfree" },
      { value: "tampax", label: "Tampax" },
      { value: "this-is-l", label: "This is L." },
      { value: "other", label: "Other" },
    ],
  },
  {
    id: "lifestyle",
    question: "What's your typical daily routine?",
    type: "single",
    options: [
      { value: "sedentary", label: "Mostly sitting - Office work, studying" },
      { value: "moderate", label: "Moderate activity - Walking, light exercise" },
      { value: "active", label: "Very active - Running, sports, gym workouts" },
      { value: "mixed", label: "Mixed - Varies day to day" },
    ],
  },
  {
    id: "priorities",
    question: "What matters most to you?",
    description: "Select all that apply.",
    type: "multiple",
    options: [
      { value: "organic", label: "Organic & natural materials" },
      { value: "eco", label: "Eco-friendly & sustainable" },
      { value: "comfort", label: "Maximum comfort" },
      { value: "protection", label: "Leak-proof protection" },
      { value: "discreet", label: "Discreet & portable" },
      { value: "budget", label: "Budget-friendly" },
    ],
  },
  {
    id: "interested-products",
    question: "Which products are you interested in trying or exploring new brands?",
    description: "We'll focus on these in your recommendations.",
    type: "multiple",
    options: [
      { value: "tampons", label: "Tampons" },
      { value: "pads", label: "Pads" },
      { value: "liners", label: "Panty liners" },
    ],
  },
  {
    id: "most-important",
    question: "What's most important to you when trying a new product?",
    description: "Drag items to rank from highest to lowest importance (top = most important).",
    type: "ranking",
    options: [
      { value: "comfort", label: "Comfort" },
      { value: "price", label: "Price" },
      { value: "sustainability", label: "Sustainability" },
      { value: "brand-reputation", label: "Brand reputation" },
      { value: "organic", label: "Organic/natural ingredients" },
      { value: "leak-protection", label: "Leak protection" },
    ],
  },
];

// Pregnant path questions (E selected)
const pregnantQuestions: Question[] = [
  {
    id: "trimester",
    question: "Which trimester are you currently in?",
    type: "single",
    options: [
      { value: "1st", label: "1st" },
      { value: "2nd", label: "2nd" },
      { value: "3rd", label: "3rd" },
    ],
  },
  {
    id: "pregnancy-goals",
    question: "What are you hoping The Period Box can help with?",
    description: "Select all that apply.",
    type: "multiple",
    options: [
      { value: "discharge", label: "Staying comfortable with increased discharge during pregnancy" },
      { value: "postpartum-prep", label: "Finding products that may be helpful after delivery (postpartum bleeding)" },
      { value: "period-return", label: "Preparing for when my period returns after pregnancy" },
      { value: "bladder-leakage", label: "Managing light bladder leakage during pregnancy or postpartum" },
      { value: "gentle-skin", label: "Finding products that are gentle on sensitive skin" },
      { value: "absorbency", label: "Needing different absorbency levels during postpartum recovery" },
    ],
  },
  {
    id: "protection-timing",
    question: "When do you most need protection?",
    type: "single",
    options: [
      { value: "overnight", label: "Overnight" },
      { value: "day", label: "During the day at work or home" },
      { value: "active", label: "While moving or being active" },
      { value: "resting", label: "At home / resting" },
    ],
  },
  {
    id: "organic-preference-pregnant",
    question: "Do you prefer organic / natural materials?",
    type: "single",
    options: [
      { value: "always", label: "Yes, always" },
      { value: "sometimes", label: "Sometimes / open to trying" },
      { value: "not-important", label: "Not important to me" },
    ],
  },
  {
    id: "sensitivities-pregnant",
    question: "Do you have any sensitivities?",
    type: "multiple",
    options: [
      { value: "fragrance", label: "Fragrance sensitivity" },
      { value: "latex", label: "Latex allergy" },
      { value: "hypoallergenic", label: "Prefer hypoallergenic materials" },
      { value: "none", label: "No known sensitivities" },
    ],
  },
  {
    id: "most-important-pregnant",
    question: "What's most important to you when trying a new product?",
    description: "Drag items to rank from highest to lowest importance (top = most important).",
    type: "ranking",
    options: [
      { value: "comfort", label: "Comfort" },
      { value: "price", label: "Price" },
      { value: "sustainability", label: "Sustainability" },
      { value: "brand-reputation", label: "Brand reputation" },
      { value: "organic", label: "Organic/natural ingredients" },
      { value: "leak-protection", label: "Leak protection" },
    ],
  },
  {
    id: "additional-notes-pregnant",
    question: "Is there anything else you want us to know about your body or comfort right now to help us find the right products for your needs?",
    type: "text",
    optional: true,
  },
];

// Postpartum path questions (F selected)
const postpartumQuestions: Question[] = [
  {
    id: "postpartum-timeline",
    question: "How far postpartum are you?",
    type: "single",
    options: [
      { value: "0-2", label: "0 - 2 weeks" },
      { value: "2-6", label: "2 - 6 weeks" },
      { value: "6-12", label: "6 - 12 weeks" },
      { value: "3-6", label: "3 - 6 months" },
      { value: "6+", label: "More than 6 months" },
    ],
  },
  {
    id: "postpartum-experience",
    question: "What best describes what you're experiencing right now?",
    type: "single",
    options: [
      { value: "heavy", label: "Heavy bleeding (changing frequently)" },
      { value: "moderate", label: "Moderate bleeding" },
      { value: "light", label: "Light bleeding or spotting" },
      { value: "discharge", label: "Mostly discharge, little to no bleeding" },
      { value: "varies", label: "It varies day to day" },
    ],
  },
  {
    id: "bleeding-appearance",
    question: "What does your bleeding or discharge look like most of the time?",
    type: "single",
    options: [
      { value: "bright-red", label: "Bright red" },
      { value: "dark-red", label: "Dark red or brown" },
      { value: "pink", label: "Pink" },
      { value: "yellow-white", label: "Yellow or white" },
      { value: "unsure", label: "Unsure / changes often" },
    ],
  },
  {
    id: "delivery-method",
    question: "How did you deliver?",
    type: "single",
    options: [
      { value: "vaginal", label: "Vaginal delivery" },
      { value: "cesarean", label: "Cesarean section" },
      { value: "assisted", label: "Assisted vaginal delivery (forceps/vacuum)" },
      { value: "other", label: "Other" },
    ],
  },
  {
    id: "tenderness",
    question: "Are you experiencing tenderness or sensitivity?",
    description: "Select all that apply.",
    type: "multiple",
    options: [
      { value: "perineal", label: "Perineal soreness or stitches" },
      { value: "c-section", label: "C-section incision sensitivity" },
      { value: "pelvic", label: "General pelvic discomfort" },
      { value: "none", label: "No significant sensitivity" },
    ],
  },
  {
    id: "bladder-leakage-postpartum",
    question: "Are you experiencing bladder leakage?",
    type: "single",
    options: [
      { value: "frequently", label: "Yes, frequently" },
      { value: "occasionally", label: "Yes, occasionally" },
      { value: "no", label: "No" },
    ],
  },
  {
    id: "organic-preference-postpartum",
    question: "Do you prefer organic / natural materials?",
    type: "single",
    options: [
      { value: "always", label: "Yes, always" },
      { value: "sometimes", label: "Sometimes / open to trying" },
      { value: "not-important", label: "Not important to me" },
    ],
  },
  {
    id: "sensitivities-postpartum",
    question: "Do you have any sensitivities?",
    type: "multiple",
    options: [
      { value: "fragrance", label: "Fragrance sensitivity" },
      { value: "latex", label: "Latex allergy" },
      { value: "hypoallergenic", label: "Prefer hypoallergenic materials" },
      { value: "none", label: "No known sensitivities" },
    ],
  },
  {
    id: "protection-timing-postpartum",
    question: "When do you most need protection?",
    type: "single",
    options: [
      { value: "overnight", label: "Overnight" },
      { value: "day", label: "During the day at work or home" },
      { value: "active", label: "While moving or being active" },
      { value: "resting", label: "At home / resting" },
    ],
  },
  {
    id: "most-important-postpartum",
    question: "What's most important to you when trying a new product?",
    description: "Drag items to rank from highest to lowest importance (top = most important).",
    type: "ranking",
    options: [
      { value: "comfort", label: "Comfort" },
      { value: "price", label: "Price" },
      { value: "sustainability", label: "Sustainability" },
      { value: "brand-reputation", label: "Brand reputation" },
      { value: "organic", label: "Organic/natural ingredients" },
      { value: "leak-protection", label: "Leak protection" },
    ],
  },
  {
    id: "additional-notes-postpartum",
    question: "Is there anything else you want us to know about your body or comfort right now to help us find the right products for your needs?",
    type: "text",
    optional: true,
  },
];

// Perimenopausal path questions (G selected)
const perimenopausalQuestions: Question[] = [
  {
    id: "peri-status",
    question: "Which best describes you right now?",
    type: "single",
    options: [
      { value: "diagnosed", label: "I've been told I'm in perimenopause" },
      { value: "suspect", label: "I think I may be in perimenopause" },
      { value: "unsure", label: "I'm not sure, but my cycle has changed" },
      { value: "none", label: "None of the above" },
    ],
  },
  {
    id: "age-range",
    question: "Which age range are you in?",
    type: "single",
    options: [
      { value: "under-40", label: "Under 40" },
      { value: "40-44", label: "40 - 44" },
      { value: "45-49", label: "45 - 49" },
      { value: "50-54", label: "50 - 54" },
      { value: "54+", label: "> 54" },
    ],
  },
  {
    id: "predictability",
    question: "How predictable are your periods right now?",
    type: "single",
    options: [
      { value: "very", label: "Very predictable" },
      { value: "somewhat", label: "Somewhat unpredictable" },
      { value: "highly", label: "Highly unpredictable" },
      { value: "skip", label: "I skip periods sometimes" },
    ],
  },
  {
    id: "flow-changes",
    question: "How has your flow changed recently?",
    description: "Select all that apply.",
    type: "multiple",
    options: [
      { value: "heavier", label: "Heavier than before" },
      { value: "lighter", label: "Lighter than before" },
      { value: "longer", label: "Longer periods" },
      { value: "shorter", label: "Shorter periods" },
      { value: "spotting", label: "Spotting between periods" },
      { value: "varies", label: "It varies month to month" },
    ],
  },
  {
    id: "peri-symptoms",
    question: "Do you experience any of the following?",
    description: "Select all that apply.",
    type: "multiple",
    options: [
      { value: "gushes", label: "Sudden heavy \"gushes\"" },
      { value: "clots", label: "Blood clots" },
      { value: "flooding", label: "Flooding or overflow" },
      { value: "none", label: "None of the above" },
    ],
  },
  {
    id: "spotting-frequency",
    question: "Do you experience spotting or unexpected bleeding?",
    type: "single",
    options: [
      { value: "frequently", label: "Frequently" },
      { value: "occasionally", label: "Occasionally" },
      { value: "rarely", label: "Rarely" },
      { value: "never", label: "Never" },
    ],
  },
  {
    id: "leak-worry",
    question: "Do you worry about leaks overnight or during long stretches?",
    type: "single",
    options: [
      { value: "often", label: "Yes, often" },
      { value: "sometimes", label: "Sometimes" },
      { value: "rarely", label: "Rarely" },
    ],
  },
  {
    id: "internal-products",
    question: "How do you feel about intravaginal products (tampons, cups etc.) right now?",
    type: "single",
    options: [
      { value: "prefer", label: "I prefer them" },
      { value: "occasionally", label: "I use them occasionally" },
      { value: "avoid", label: "I avoid them now" },
      { value: "stopped", label: "I've stopped using them entirely" },
    ],
  },
  {
    id: "discomfort-timing",
    question: "When do leaks or discomfort bother you most?",
    description: "Select all that apply.",
    type: "multiple",
    options: [
      { value: "overnight", label: "Overnight" },
      { value: "exercise", label: "During exercise or movement" },
      { value: "day", label: "During the day" },
      { value: "traveling", label: "While traveling" },
    ],
  },
  {
    id: "additional-notes-peri",
    question: "Is there anything else you want us to know about your body or comfort right now to help us find the right products for your needs?",
    type: "text",
    optional: true,
  },
];

// Menopausal path questions (H selected)
const menopausalQuestions: Question[] = [
  {
    id: "meno-status",
    question: "Which best describes you right now?",
    type: "single",
    options: [
      { value: "12-months", label: "I have not had a period in 12 months or more" },
      { value: "unsure", label: "I'm not sure, but my periods have stopped" },
      { value: "hormone-therapy", label: "I'm using hormone therapy and do not have periods" },
      { value: "none", label: "None of the above" },
    ],
  },
  {
    id: "time-since",
    question: "About how long has it been since your last period?",
    type: "single",
    options: [
      { value: "12-18", label: "12 - 18 months" },
      { value: "18-24", label: "18 - 24 months" },
      { value: "2-5", label: "2 - 5 years" },
      { value: "5+", label: "More than 5 years" },
    ],
  },
  {
    id: "daily-protection",
    question: "Do you use protection for daily moisture or discharge?",
    type: "single",
    options: [
      { value: "daily", label: "Yes, daily" },
      { value: "occasionally", label: "Occasionally" },
      { value: "no", label: "No" },
    ],
  },
  {
    id: "bladder-leakage-meno",
    question: "Are you experiencing bladder leakage?",
    type: "single",
    options: [
      { value: "frequently", label: "Yes, frequently" },
      { value: "occasionally", label: "Yes, occasionally" },
      { value: "no", label: "No" },
    ],
  },
  {
    id: "discomfort-timing-meno",
    question: "When do leaks or discomfort bother you most?",
    description: "Select all that apply.",
    type: "multiple",
    options: [
      { value: "overnight", label: "Overnight" },
      { value: "exercise", label: "During exercise or movement" },
      { value: "day", label: "During the day" },
      { value: "traveling", label: "While traveling" },
    ],
  },
  {
    id: "additional-notes-meno",
    question: "Is there anything else you want us to know about your body or comfort right now to help us find the right products for your needs?",
    type: "text",
    optional: true,
  },
];

// Combine all questions with conditional logic
const getAllQuestions = (): Question[] => {
  return [
    ...baseQuestions,
    ...menstruatingQuestions.map(q => ({
      ...q,
      conditional: (answers: Record<string, string | string[]>) => getUserPath(answers) === "menstruating"
    })),
    ...pregnantQuestions.map(q => ({
      ...q,
      conditional: (answers: Record<string, string | string[]>) => getUserPath(answers) === "pregnant"
    })),
    ...postpartumQuestions.map(q => ({
      ...q,
      conditional: (answers: Record<string, string | string[]>) => getUserPath(answers) === "postpartum"
    })),
    ...perimenopausalQuestions.map(q => ({
      ...q,
      conditional: (answers: Record<string, string | string[]>) => getUserPath(answers) === "perimenopausal"
    })),
    ...menopausalQuestions.map(q => ({
      ...q,
      conditional: (answers: Record<string, string | string[]>) => getUserPath(answers) === "menopausal"
    })),
  ];
};

// Drag and Drop Ranking Component
interface DragDropRankingProps {
  options: { value: string; label: string }[];
  value: string[];
  onChange: (value: string[]) => void;
}

function DragDropRanking({ options, value, onChange }: DragDropRankingProps) {
  const [items, setItems] = useState<{ value: string; label: string }[]>([]);
  const [draggingItem, setDraggingItem] = useState<string | null>(null);
  const [dragOverItem, setDragOverItem] = useState<string | null>(null);

  // Initialize items from value or options
  useEffect(() => {
    if (value && value.length > 0) {
      const orderedItems = value
        .map(v => options.find(o => o.value === v))
        .filter((o): o is { value: string; label: string } => o !== undefined);
      // Add any missing options
      const missingOptions = options.filter(o => !value.includes(o.value));
      setItems([...orderedItems, ...missingOptions]);
    } else {
      setItems([...options]);
    }
  }, [options, value]);

  const handleDragStart = (e: React.DragEvent, itemValue: string) => {
    setDraggingItem(itemValue);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", itemValue);
  };

  const handleDragEnd = () => {
    setDraggingItem(null);
    setDragOverItem(null);
  };

  const handleDragOver = (e: React.DragEvent, overItemValue: string) => {
    e.preventDefault();
    if (draggingItem && draggingItem !== overItemValue) {
      setDragOverItem(overItemValue);
    }
  };

  const handleDrop = (e: React.DragEvent, targetValue: string) => {
    e.preventDefault();
    if (!draggingItem || draggingItem === targetValue) return;

    const newItems = [...items];
    const dragIndex = newItems.findIndex(i => i.value === draggingItem);
    const dropIndex = newItems.findIndex(i => i.value === targetValue);

    if (dragIndex !== -1 && dropIndex !== -1) {
      const [removed] = newItems.splice(dragIndex, 1);
      newItems.splice(dropIndex, 0, removed);
      setItems(newItems);
      onChange(newItems.map(i => i.value));
    }

    setDraggingItem(null);
    setDragOverItem(null);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverItem(null);
  };

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div
          key={item.value}
          draggable
          onDragStart={(e) => handleDragStart(e, item.value)}
          onDragEnd={handleDragEnd}
          onDragOver={(e) => handleDragOver(e, item.value)}
          onDrop={(e) => handleDrop(e, item.value)}
          onDragLeave={handleDragLeave}
          className={`
            flex items-center gap-3 p-3 rounded-lg border-2 cursor-move transition-all
            ${draggingItem === item.value 
              ? "opacity-50 border-primary bg-primary/5" 
              : "border-border bg-card hover:border-primary/50"
            }
            ${dragOverItem === item.value && draggingItem !== item.value
              ? "border-primary bg-primary/10 scale-[1.02]"
              : ""
            }
          `}
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
            {index + 1}
          </div>
          <GripVertical className="w-5 h-5 text-muted-foreground" />
          <span className="flex-1 font-medium">{item.label}</span>
        </div>
      ))}
      <p className="text-sm text-muted-foreground mt-2">
        Drag items to reorder. Top = highest priority.
      </p>
    </div>
  );
}

// Updated SurveyQuestionComponent - replace the entire component
interface SurveyQuestionProps extends Question {
  value: string | string[] | undefined;
  onChange: (value: string | string[]) => void;
}

function SurveyQuestionComponent({
  id,
  question,
  description,
  type,
  options,
  maxSelections,
  value,
  onChange,
  allowOther,
  otherPlaceholder,
  optional,
}: SurveyQuestionProps) {
  const [otherText, setOtherText] = useState("");
  const [isOtherSelected, setIsOtherSelected] = useState(false);

  // Check if "other" is selected when value changes
  useEffect(() => {
    if ((type === "select-multiple" || type === "multiple") && allowOther) {
      const values = Array.isArray(value) ? value : [];
      setIsOtherSelected(values.includes("other"));
      
      // Parse existing other values from the combined string if present
      const otherValue = values.find(v => typeof v === "string" && v.startsWith("other:"));
      if (otherValue) {
        setOtherText((otherValue as string).replace("other:", ""));
      }
    }
  }, [value, type, allowOther]);

const handleOtherTextChange = (text: string) => {
  setOtherText(text);
  const values = Array.isArray(value) ? (value as string[]).filter(v => !v.startsWith("other:")) : [];
  if (text.trim()) {
    // Store the raw text exactly as typed with "other:" prefix
    onChange([...values, `other:${text}`]);
  } else {
    onChange(values);
  }
};

  const renderQuestion = () => {
    switch (type) {
      case "ranking":
        return (
          <DragDropRanking
            options={options || []}
            value={Array.isArray(value) ? value : []}
            onChange={onChange}
          />
        );

      case "text":
        return (
          <div className="space-y-2">
            <textarea
              className="w-full min-h-[100px] p-3 rounded-md border border-input bg-background text-sm"
              placeholder={optional ? "Optional - tell us more (or leave blank)" : "Type your answer here..."}
              value={(value as string) || ""}
              onChange={(e) => onChange(e.target.value)}
            />
{/*            {optional && (
              <p className="text-xs text-muted-foreground">
                This question is optional. Leave blank if you prefer.
              </p>
            )} */}
          </div>
        );

      case "single":
        return (
          <div className="grid gap-2">
            {options?.map((option) => {
              const isSelected = value === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => onChange(option.value)}
                  className={`
                    flex items-center justify-between p-3 rounded-lg border-2 transition-all text-left
                    ${isSelected 
                      ? "border-primary bg-primary/5" 
                      : "border-border hover:border-primary/50"
                    }
                  `}
                >
                  <span className="font-medium">{option.label}</span>
                  {isSelected && <CheckCircle2 className="w-5 h-5 text-primary" />}
                </button>
              );
            })}
          </div>
        );

      case "dropdown":
        return (
          <select
            className="w-full p-3 rounded-md border border-input bg-background text-sm"
            value={(value as string) || ""}
            onChange={(e) => onChange(e.target.value)}
          >
            <option value="" disabled>Select an option...</option>
            {options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case "multiple":
      case "select-multiple":
        return (
          <div className="space-y-3">
            <div className="grid gap-2">
              {options?.map((option) => {
                const values = Array.isArray(value) ? value : [];
                const isSelected = values.includes(option.value);
                return (
                  <button
                    key={option.value}
                    onClick={() => {
                      const current = Array.isArray(value) ? value : [];
                      if (isSelected) {
                        onChange(current.filter((v) => v !== option.value));
                      } else {
                        if (!maxSelections || current.length < maxSelections) {
                          onChange([...current, option.value]);
                        }
                      }
                    }}
                    className={`
                      flex items-center justify-between p-3 rounded-lg border-2 transition-all text-left
                      ${isSelected 
                        ? "border-primary bg-primary/5" 
                        : "border-border hover:border-primary/50"
                      }
                    `}
                  >
                    <span className="font-medium">{option.label}</span>
                    {isSelected && <CheckCircle2 className="w-5 h-5 text-primary" />}
                  </button>
                );
              })}
            </div>
            
            {allowOther && isOtherSelected && (
              <div className="mt-4 p-4 rounded-lg border-2 border-primary/20 bg-primary/5">
                <Label htmlFor={`${id}-other`} className="text-sm font-medium mb-2 block">
                  Please specify:
                </Label>
                <Input
                  id={`${id}-other`}
                  placeholder={otherPlaceholder || "Enter other brands..."}
                  value={otherText}
                  onChange={(e) => handleOtherTextChange(e.target.value)}
                  className="bg-background"
                />
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="p-4 text-red-500">
            Unknown question type: {type}
          </div>
        );
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h3 className="text-lg font-semibold">{question}</h3>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      {renderQuestion()}
    </div>
  );
}
export default function Survey() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [isComplete, setIsComplete] = useState(false);
  
  // Get dynamic question list based on current answers
  const [surveyQuestions, setSurveyQuestions] = useState<Question[]>(getAllQuestions());
  
  // Filter questions based on conditional logic
  const visibleQuestions = surveyQuestions.filter(q => 
    !q.conditional || q.conditional(answers)
  );

  /*  redirect if not logged in  */
  useEffect(() => {
    if (!isLoading && !isAuthenticated) setLocation("/survey-login");
  }, [isLoading, isAuthenticated, setLocation]);

  // Update visible questions when answers change (for path switching)
  useEffect(() => {
    setSurveyQuestions(getAllQuestions());
    // Reset step if current step is now beyond visible questions
    if (currentStep >= visibleQuestions.length && visibleQuestions.length > 0) {
      setCurrentStep(visibleQuestions.length - 1);
    }
  }, [answers]);

const submitSurvey = useMutation({
  mutationFn: async (surveyData: { answers: Record<string, string | string[]> }) => {
    if (!isAuthenticated || !user?.googleId) {
      throw new Error("You must be logged in to submit a survey.");
    }

    // Process answers before submitting - handle "other" values and optional text
    const processedAnswers: Record<string, string | string[]> = {};
    
    for (const [key, val] of Object.entries(surveyData.answers)) {
      const question = visibleQuestions.find(q => q.id === key);
      
      if (question?.type === "text" && question?.optional && (!val || (typeof val === "string" && val.trim() === ""))) {
        processedAnswers[key] = "NONE";
      } else if ((question?.type === "select-multiple" || question?.type === "multiple") && question?.allowOther && Array.isArray(val)) {
        // Keep other values as-is, just remove the "other:" prefix but keep the full text
        const processed: string[] = [];
        val.forEach(v => {
          if (typeof v === "string" && v.startsWith("other:")) {
            // Just remove the prefix, keep the entire text as one entry
            processed.push(v.replace("other:", ""));
          } else {
            processed.push(v);
          }
        });
        processedAnswers[key] = processed;
      } else {
        processedAnswers[key] = val;
      }
    }

    const res = await fetch("/api/survey-responses", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ answers: processedAnswers }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ message: res.statusText }));
      throw new Error(errorData.message || "Failed to submit survey");
    }

    return res.json();
  },

  onSuccess: (data) => {
    console.log("Survey submitted successfully:", data);
    setIsComplete(true);
  },

  onError: (error: any) => {
    toast({
      title: "Error submitting survey",
      description: error.message,
      variant: "destructive",
    });
  },
});

  const currentQuestion = visibleQuestions[currentStep];
  const isLastQuestion = currentStep === visibleQuestions.length - 1;
  const progressStep = currentStep + 1;
  const totalSteps = visibleQuestions.length;

  const handleAnswer = (value: string | string[]) => {
    setAnswers({ ...answers, [currentQuestion.id]: value });
  };

  const handleNext = () => {
    if (isLastQuestion) {
      submitSurvey.mutate({ answers }); 
      console.log("Survey completed with answers:", answers);
    } else {
      setCurrentStep(currentStep + 1);
      console.log(`Moving to question ${currentStep + 2}`);
    }
  };

  const handlePrevious = () => {
    // If going back from the second question to the first, clear all answers
    if (currentStep === 1) {
      setAnswers({});
      setCurrentStep(0);
      console.log("Going back to first question - cleared all answers");
    } else {
      setCurrentStep(currentStep - 1);
      console.log(`Going back to question ${currentStep}`);
    }
  };

  const canProceed = () => {
    const answer = answers[currentQuestion.id];
    
    // If question is optional, always allow proceed
    if (currentQuestion.optional) return true;
    
    if (!answer) return false;
    
    if (currentQuestion.type === "multiple" || currentQuestion.type === "select-multiple") {
      const answerArray = Array.isArray(answer) ? answer : [];
      if (currentQuestion.maxSelections) {
        return answerArray.length > 0 && answerArray.length <= currentQuestion.maxSelections;
      }
      return answerArray.length > 0;
    }
    
    if (currentQuestion.type === "ranking") {
      const answerArray = Array.isArray(answer) ? answer : [];
      return answerArray.length === currentQuestion.options?.length;
    }
    
    if (currentQuestion.type === "text") {
      return typeof answer === "string" && answer.trim().length > 0;
    }
    
    return Boolean(answer);
  };

  const handleGetSampleKit = () => {
    if (!isAuthenticated) {
      toast({
        title: "Account Required",
        description: "Please log in or create an account to get your sample kit.",
      });
      setTimeout(() => {
        window.location.href = "/login";
      }, 500);
      return;
    }
    setLocation("/account");
  };

  if (isComplete) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl space-y-8">
            <Card className="border-2">
              <CardContent className="p-12 text-center space-y-6">
                <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-primary to-chart-2 flex items-center justify-center">
                  <CheckCircle2 className="h-10 w-10 text-white" />
                </div>
                
                <div className="space-y-3">
                  <h1 className="text-3xl md:text-4xl font-bold font-heading">
                    Perfect! We Found Your Match
                  </h1>
                  <p className="text-lg text-muted-foreground">
                    Based on your answers, we've curated the ideal sample kit just for you.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-chart-2/5">
              <CardContent className="p-8 space-y-4">
                <div className="text-center space-y-3">
                  <h2 className="text-2xl md:text-3xl font-bold font-heading bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
                    Try the PeriodBox Sample Kit
                  </h2>
                  <p className="text-muted-foreground">
                    Get a curated selection of the brands that fit you best. Try before you commit to full-size products!
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                    <p className="text-sm">Personalized samples based on your survey results</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                    <p className="text-sm">Try multiple products to find your perfect match</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                    <p className="text-sm">Risk-free way to discover new brands</p>
                  </div>
                </div>

                <div className="pt-4">
                  <Button 
                    size="lg" 
                    variant="default"
                    className="w-full text-base font-semibold"
                    data-testid="button-purchase-kit"
                    onClick={handleGetSampleKit}
                  >
                    Get Your Sample Kit
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Don't render until we have a current question
  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">Loading...</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-8 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <h1 className="text-3xl md:text-4xl font-bold font-heading">
                Find Your Perfect Match
              </h1>
              <p className="text-muted-foreground">
                Answer a few questions to get personalized recommendations
              </p>
            </div>

            <SurveyProgress 
              currentStep={progressStep} 
              totalSteps={totalSteps} 
            />

            <SurveyQuestionComponent
              {...currentQuestion}
              value={answers[currentQuestion.id]}
              onChange={handleAnswer}
            />

            <div className="flex gap-4 justify-between">
              <Button
                variant="outline"
                size="lg"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                data-testid="button-previous"
              >
                Previous
              </Button>
              <Button
                size="lg"
                onClick={handleNext}
                disabled={!canProceed() || submitSurvey.isPending}
                data-testid="button-next"
              >
                {submitSurvey.isPending ? "Submitting..." : isLastQuestion ? "Complete Survey" : "Next Question"}
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
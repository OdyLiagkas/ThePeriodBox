import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { ProductCardNoHeart } from "@/components/ProductCardNoHeart";
import { useSurvey, SurveyResult } from "@/hooks/useSurvey";
import { SurveyAnswers } from "@/components/SurveyAnswers";
import { 
  Package, 
  History, 
  ClipboardList, 
  ShoppingBag, 
  ThumbsUp, 
  ThumbsDown,
  Sparkles,
  LogOut,
  User,
  CheckCircle2,
  Bell
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Trash2, AlertTriangle } from "lucide-react";

/* ----------  TYPES  ---------- */
interface PortalProduct {
  id: string;
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  category: string;
  matchReasons: string[];
  feedback?: 'positive' | 'negative' | null;
}

interface Order {
  id: string;
  date: string;
  total: string;
  status: string;
  items: { name: string; qty: number; price: string }[];
}

interface LikedProduct {
  id: string;
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  category: string;
  features: string[];
}

type TabValue = 'box' | 'history' | 'survey' | 'orders';


interface DeleteAccountButtonProps {
  onDelete: () => void;
}

function DeleteAccountButton({ onDelete }: DeleteAccountButtonProps) {
  const [isConfirming, setIsConfirming] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleFirstClick = () => {
    setIsConfirming(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete();
    } catch (error) {
      setIsDeleting(false);
      setIsConfirming(false);
    }
  };

  const handleCancel = () => {
    setIsConfirming(false);
  };

  if (isConfirming) {
    return (
      <div className="fixed bottom-24 right-4 md:right-8 z-50 animate-in fade-in slide-in-from-bottom-4 duration-200">
        <Card className="border-destructive/50 shadow-xl bg-white max-w-sm">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              <span className="font-semibold">Are you sure?</span>
            </div>
            <p className="text-sm text-muted-foreground">
              This will permanently delete your account and all associated data. This action cannot be undone.
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={handleCancel}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="flex-1 gap-2"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <Sparkles className="h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    Yes, Delete
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-200">
      <Button
        variant="outline"
        size="sm"
        className="gap-2 border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive hover:border-destructive shadow-md"
        onClick={handleFirstClick}
      >
        <Trash2 className="h-4 w-4" />
        Delete Account
      </Button>
    </div>
  );
}




/* ----------  DEMO AUTH HOOK  ---------- */
function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/user", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        setUser(data);
        setIsLoading(false);
      })
      .catch(() => {
        setUser(null);
        setIsLoading(false);
      });
  }, []);

  const logout = () => {
    window.location.href = "/api/logout";
  };

  return { 
    user, 
    isLoading, 
    isAuthenticated: !!user, 
    logout,
    name: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : "Friend"
  };
}

/* ----------  MOCK DATA FOR YOUR BOX  ---------- */
const MOCK_BOX_PRODUCTS: PortalProduct[] = [
  {
    id: "box-1",
    name: "Organic Cotton Tampons",
    description: "Ultra-absorbent organic cotton tampons with biodegradable applicator",
    price: "$0.00",
    imageUrl: "/api/placeholder/300/300",
    category: "Tampons",
    matchReasons: ["Based on your flow preference", "Eco-friendly choice", "Recommended for active lifestyle"],
    feedback: null
  },
  {
    id: "box-2",
    name: "Period Underwear",
    description: "Leak-proof, comfortable period underwear for medium flow days",
    price: "$0.00",
    imageUrl: "/api/placeholder/300/300",
    category: "Underwear",
    matchReasons: ["Matches your comfort priority", "Reusable option", "Great for overnight"],
    feedback: null
  },
  {
    id: "box-3",
    name: "Menstrual Cup",
    description: "Medical-grade silicone cup, size medium",
    price: "$0.00",
    imageUrl: "/api/placeholder/300/300",
    category: "Cup",
    matchReasons: ["Long-lasting protection", "Zero waste option", "Cost-effective"],
    feedback: null
  }
];

/* ----------  SIDEBAR NAV ITEM  ---------- */
interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  value: TabValue;
  active: boolean;
  onClick: (value: TabValue) => void;
}

function NavItem({ icon, label, value, active, onClick }: NavItemProps) {
  return (
    <button
      onClick={() => onClick(value)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 group ${
        active 
          ? "bg-gradient-to-r from-primary/20 to-chart-2/20 text-primary font-semibold shadow-sm" 
          : "text-muted-foreground hover:bg-primary/5 hover:text-foreground"
      }`}
    >
      <span className={`${active ? "text-primary" : "text-muted-foreground group-hover:text-primary"} transition-colors`}>
        {icon}
      </span>
      <span className="font-medium">{label}</span>
      {active && (
        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
      )}
    </button>
  );
}

/* ----------  PRODUCT FEEDBACK CARD  ---------- */
interface ProductFeedbackCardProps {
  product: PortalProduct;
  onFeedback: (productId: string, type: 'positive' | 'negative') => void;
}

function ProductFeedbackCard({ product, onFeedback }: ProductFeedbackCardProps) {
  return (
    <Card className="overflow-hidden border-border/50 hover:shadow-lg transition-all duration-300 group">
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-primary/5 to-chart-2/5">
        <img 
          src={product.imageUrl} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      <CardContent className="p-5 space-y-4">
        <div>
          <Badge variant="secondary" className="mb-2 bg-primary/10 text-primary border-0">
            {product.category}
          </Badge>
          <h3 className="font-bold text-lg font-heading">{product.name}</h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{product.description}</p>
        </div>

        {product.matchReasons && product.matchReasons.length > 0 && (
          <div className="space-y-2 bg-gradient-to-r from-primary/5 to-chart-2/5 p-3 rounded-lg">
            <p className="text-xs font-semibold text-primary flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              Why we picked this
            </p>
            <ul className="text-xs text-muted-foreground space-y-1">
              {product.matchReasons.map((reason, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-primary mt-0.5">•</span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="pt-2 border-t border-border/50">
          <p className="text-xs text-muted-foreground mb-3 font-medium">How was this match?</p>
          <div className="flex gap-2">
            <Button
              variant={product.feedback === 'positive' ? 'default' : 'outline'}
              size="sm"
              className={`flex-1 gap-2 transition-all ${
                product.feedback === 'positive' 
                  ? 'bg-gradient-to-r from-primary to-chart-2 text-white border-0' 
                  : 'hover:border-primary hover:text-primary'
              }`}
              onClick={() => onFeedback(product.id, 'positive')}
            >
              <ThumbsUp className="h-4 w-4" />
              Love it
            </Button>
            <Button
              variant={product.feedback === 'negative' ? 'default' : 'outline'}
              size="sm"
              className={`flex-1 gap-2 transition-all ${
                product.feedback === 'negative' 
                  ? 'bg-destructive text-white border-0' 
                  : 'hover:border-destructive hover:text-destructive'
              }`}
              onClick={() => onFeedback(product.id, 'negative')}
            >
              <ThumbsDown className="h-4 w-4" />
              Not for me
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
/* ----------  NOTIFICATION PREFERENCE COMPONENT  ---------- */
interface NotificationPreferenceProps {
  onGoToSurvey: () => void;
}

function NotificationPreference({ onGoToSurvey }: NotificationPreferenceProps) {
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  // SHOPIFY_URL: to be replaced with real Shopify product URL when ready
  const SHOPIFY_PRODUCT_URL = "https://yourperiodbox.myshopify.com/products/period-box";

  const { data: statusData, isLoading: checkingStatus } = useQuery({
    queryKey: ['notification-status'],
    queryFn: async () => {
      const res = await fetch("/api/notify-when-ready/status", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to check status");
      return res.json();
    },
    enabled: isAuthenticated,
  });

  const saveNotification = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/notify-when-ready", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id || user?.googleId,
          email: user?.email,
        }),
      });
      if (!res.ok) throw new Error("Failed to save");
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Preference saved",
        description: "We'll notify you when your period box is ready!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const isNotified = statusData?.notified === true;
  const isSubscribed = statusData?.subscribed || saveNotification.isSuccess;
  const isPending = checkingStatus || saveNotification.isPending;

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-chart-2/20 flex items-center justify-center">
          <Package className="h-10 w-10 text-primary" />
        </div>

        <div className="space-y-2">
          {isNotified ? (
            <>
              <h2 className="text-2xl md:text-3xl font-bold font-heading">
                Your period box is ready! 🎉
              </h2>
              <p className="text-muted-foreground text-lg">
                Click below to purchase your personalized period box
              </p>
            </>
          ) : (
            <>
              <h2 className="text-2xl md:text-3xl font-bold font-heading">
                We are currently working on curating your perfect sample box
              </h2>
              <p className="text-muted-foreground text-lg">
                Click below to be notified when it's ready
              </p>
            </>
          )}
        </div>
      </div>

      <div className="max-w-md mx-auto">
        {isNotified ? (
          <a
            href={SHOPIFY_PRODUCT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 p-6 rounded-xl border-2 border-primary bg-gradient-to-r from-primary to-chart-2 text-white font-bold text-lg shadow-lg hover:opacity-90 transition-opacity"
          >
            <ShoppingBag className="w-6 h-6" />
            Buy Your Box Now
          </a>
        ) : (
          <div
            onClick={() => {
              if (!isSubscribed && !isPending) {
                saveNotification.mutate();
              }
            }}
            className={`
              relative flex items-center justify-center gap-3 p-6 rounded-xl border-2 cursor-pointer transition-all duration-300
              ${isSubscribed
                ? "border-green-500 bg-green-50/50 cursor-default"
                : "border-primary/20 bg-gradient-to-r from-primary/5 to-chart-2/5 hover:border-primary/50 hover:shadow-md"
              }
              ${isPending ? "opacity-70 cursor-wait" : ""}
            `}
          >
            {isSubscribed ? (
              <>
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-green-700 text-lg">Preference saved</p>
                  <p className="text-green-600 text-sm">We'll email you when your box is ready!</p>
                </div>
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bell className="w-6 h-6 text-primary" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-foreground text-lg">
                    {isPending ? "Checking..." : "Notify me when ready"}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Get an email as soon as your curated box is available
                  </p>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          In the meantime, you can{" "}
          <button
            onClick={onGoToSurvey}
            className="text-primary hover:underline font-medium"
          >
            review your survey results
          </button>
          {" "}or{" "}
          <button
            onClick={() => setLocation("/survey")}
            className="text-primary hover:underline font-medium"
          >
            update your preferences
          </button>
          {" "}by retaking the survey.
        </p>
      </div>
    </div>
  );
}

/* ----------  PAGE  ---------- */
export default function Account() {
  const { user, isLoading, isAuthenticated, logout } = useAuth();
const [, setLocation] = useLocation();
const [activeTab, setActiveTab] = useState<TabValue>(() => {
  const params = new URLSearchParams(window.location.search);
  const tab = params.get('tab');
  if (tab === 'orders' || tab === 'history' || tab === 'survey' || tab === 'box') {
    return tab as TabValue;
  }
  return 'box';
});
  const { toast } = useToast();

  // Use the survey hook
  const { survey, isLoading: surveyLoading, error: surveyError } = useSurvey();

  const [products, setProducts] = useState<PortalProduct[]>([]);
  const [likedProducts, setLikedProducts] = useState<LikedProduct[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [boxProducts, setBoxProducts] = useState<PortalProduct[]>(MOCK_BOX_PRODUCTS);
  const deleteAccount = useMutation({
  mutationFn: async () => {
    const res = await fetch("/api/user", {
      method: "DELETE",
      credentials: "include",
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ message: res.statusText }));
      throw new Error(errorData.message || "Failed to delete account");
    }
    return res.json();
  },
  onSuccess: () => {
    toast({
      title: "Account deleted",
      description: "Your account has been permanently deleted.",
    });
    // Redirect to home page after deletion
    window.location.href = "/";
  },
  onError: (error: any) => {
    toast({
      title: "Error deleting account",
      description: error.message,
      variant: "destructive",
    });
  },
});


  /*  redirect if not logged in  */
  useEffect(() => {
    if (!isLoading && !isAuthenticated) setLocation("/login");
  }, [isLoading, isAuthenticated, setLocation]);

  /*  load dashboard data  */
  useEffect(() => {
    if (!isAuthenticated) return;

    // Load liked products
    const likedRaw = localStorage.getItem("liked_products");
    if (likedRaw) {
      const likedIds: string[] = JSON.parse(likedRaw);
      fetch("/api/products.json")
        .then((r) => r.json())
        .then((all: PortalProduct[]) => {
          const filtered = all.filter((p) => likedIds.includes(p.id));
          const likedProducts = filtered.map((p) => ({
            id: p.id,
            name: p.name,
            description: p.description,
            price: p.price,
            imageUrl: p.imageUrl,
            category: p.category,
            features: [],
          }));
          setLikedProducts(likedProducts);
        })
        .catch(() => setLikedProducts([]));
    }

    // Load products and orders
    fetch("/api/account/products.json").then((r) => r.json()).then(setProducts).catch(() => {});
    fetch("/api/account/orders.json").then((r) => r.json()).then(setOrders).catch(() => {});
  }, [isAuthenticated]);

  const handleProductFeedback = (productId: string, type: 'positive' | 'negative') => {
    setBoxProducts(prev => prev.map(p => 
      p.id === productId ? { ...p, feedback: type } : p
    ));
  };

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-chart-2/5 to-chart-3/5">
      <div className="flex items-center gap-2 text-primary">
        <Sparkles className="h-5 w-5 animate-pulse" />
        <span className="font-semibold">Loading portal...</span>
      </div>
    </div>
  );
  
  if (!isAuthenticated) return null;

  const renderContent = () => {
    switch (activeTab) {
      case 'box':
        return (
          <div className="space-y-8 py-8">
            {/* NEW: Notification Preference Section */}
            <NotificationPreference 
              onGoToSurvey={() => setActiveTab('survey')} 
            />

            {/* COMMENTED OUT: Original Your Box Section */}
          </div>
        );

      case 'history':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold font-heading">History</h2>
              <p className="text-muted-foreground">Your past boxes and product feedback</p>
            </div>
            
            {boxProducts.some(p => p.feedback) ? (
              <div className="space-y-4">
                {boxProducts.filter(p => p.feedback).map(product => (
                  <Card key={product.id} className="overflow-hidden">
                    <CardContent className="p-4 flex items-center gap-4">
                      <img src={product.imageUrl} alt={product.name} className="w-16 h-16 rounded-lg object-cover" />
                      <div className="flex-1">
                        <h3 className="font-semibold">{product.name}</h3>
                        <p className="text-sm text-muted-foreground">{product.category}</p>
                      </div>
                      <Badge 
                        variant={product.feedback === 'positive' ? 'default' : 'destructive'}
                        className={product.feedback === 'positive' ? 'bg-gradient-to-r from-primary to-chart-2' : ''}
                      >
                        {product.feedback === 'positive' ? 'Liked' : 'Disliked'}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-gradient-to-br from-primary/5 to-chart-2/5 border-dashed">
                <CardContent className="p-12 text-center">
                  <History className="h-12 w-12 text-primary/40 mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">No history yet</h3>
                  <p className="text-muted-foreground mb-4">Start giving feedback on your box products to build your history</p>
                  <Button variant="outline" onClick={() => setActiveTab('box')}>View Your Box</Button>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case 'survey':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold font-heading">Survey Results</h2>
              <p className="text-muted-foreground">Your personalized profile and preferences</p>
            </div>

            <Card className="overflow-hidden border-primary/20">
              <div className="bg-gradient-to-r from-primary/10 via-chart-2/10 to-chart-3/10 p-6 border-b border-primary/10">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <ClipboardList className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold font-heading">Your Profile</h3>
                    <p className="text-sm text-muted-foreground">Completed on {survey?.completedAt || 'N/A'}</p>
                  </div>
                </div>
              </div>
              
              <CardContent className="p-6">
                {surveyLoading ? (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Sparkles className="h-4 w-4 animate-pulse" />
                    Loading survey...
                  </div>
                ) : survey ? (
                  <div className="space-y-6">
                    <SurveyAnswers answers={survey.answers} />
                    
                    <div className="pt-4 border-t border-border/50">
                      <Button 
                        onClick={() => setLocation("/survey")} 
                        className="w-full sm:w-auto gap-2 bg-gradient-to-r from-primary to-chart-2 hover:opacity-90 transition-opacity"
                      >
                        <Sparkles className="h-4 w-4" />
                        Retake Survey
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">
                      {surveyError ? `Error: ${surveyError}` : "No survey on file."}
                    </p>
                    <Button onClick={() => setLocation("/survey")} className="gap-2">
                      <Sparkles className="h-4 w-4" />
                      Take Survey
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );

      case 'orders':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold font-heading">Orders</h2>
              <p className="text-muted-foreground">Track your shipments and view past orders</p>
            </div>

            {orders.length ? (
              <div className="space-y-4">
                {orders.map((order) => (
                  <Card key={order.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <CardContent className="p-0">
                      <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-primary/5 to-chart-2/5 border-b border-border/50">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-white rounded-lg shadow-sm">
                            <ShoppingBag className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-semibold font-heading">Order #{order.id}</p>
                            <p className="text-sm text-muted-foreground">{order.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-bold text-lg">{order.total}</span>
                          <Badge className="bg-gradient-to-r from-primary to-chart-2 text-white border-0">
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                      
                      {order.items && (
                        <div className="p-4 space-y-2">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-sm">
                              <span className="text-muted-foreground">{item.name} × {item.qty}</span>
                              <span className="font-medium">{item.price}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-gradient-to-br from-primary/5 to-chart-2/5 border-dashed">
                <CardContent className="p-12 text-center">
                  <ShoppingBag className="h-12 w-12 text-primary/40 mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">No orders yet</h3>
                  <p className="text-muted-foreground mb-4">Your subscription box will appear here once shipped</p>
                  <Button variant="outline" onClick={() => setActiveTab('box')}>View Your Box</Button>
                </CardContent>
              </Card>
            )}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary/5 via-chart-2/5 to-chart-3/5">
      <Header />
      
      <main className="flex-1 py-8 md:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          {/* Welcome Header */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold font-heading mb-2">
                Welcome back,{" "}
                <span className="bg-gradient-to-r from-primary via-chart-2 to-chart-3 bg-clip-text text-transparent">
                  {user?.firstName ?? "friend"}
                </span>
              </h1>
              <p className="text-muted-foreground">Manage your personalized period care experience</p>
            </div>
            <Button 
              variant="outline" 
              onClick={logout}
              className="gap-2 self-start sm:self-auto hover:bg-destructive/10 hover:text-destructive hover:border-destructive transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>

          {/* Main Layout */}
          <div className="relative grid lg:grid-cols-[280px_1fr] gap-8">
            {/* Sidebar Navigation */}
            <aside className="space-y-2">
              <Card className="p-2 sticky top-24 bg-white/80 backdrop-blur-sm border-primary/10">
                <div className="p-4 mb-2 border-b border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-chart-2 flex items-center justify-center text-white font-bold">
                      <User className="h-5 w-5" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="font-semibold truncate">{user?.firstName} {user?.lastName}</p>
                      <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                    </div>
                  </div>
                </div>
                
                <nav className="space-y-1 p-2">
                  <NavItem 
                    icon={<Package className="h-5 w-5" />}
                    label="Your Box"
                    value="box"
                    active={activeTab === 'box'}
                    onClick={setActiveTab}
                  />
                  <NavItem 
                    icon={<History className="h-5 w-5" />}
                    label="History"
                    value="history"
                    active={activeTab === 'history'}
                    onClick={setActiveTab}
                  />
                  <NavItem 
                    icon={<ClipboardList className="h-5 w-5" />}
                    label="Survey Results"
                    value="survey"
                    active={activeTab === 'survey'}
                    onClick={setActiveTab}
                  />
                  <NavItem 
                    icon={<ShoppingBag className="h-5 w-5" />}
                    label="Orders"
                    value="orders"
                    active={activeTab === 'orders'}
                    onClick={setActiveTab}
                  />
                </nav>
              </Card>
            </aside>

            {/* Content Area */}
            <div className="min-h-[600px]">
              {renderContent()}
            </div>

          </div>
            <div className="flex justify-end mt-6 pr-[5px]">
              <DeleteAccountButton onDelete={() => deleteAccount.mutate()} />
            </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
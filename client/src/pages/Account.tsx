import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { ProductCardNoHeart } from "@/components/ProductCardNoHeart";
import { useSurvey, SurveyResult } from "@/hooks/useSurvey";
import { SurveyAnswers } from "@/components/SurveyAnswers";


/* ----------  TYPES  ---------- */
interface PortalProduct {
  id: string;
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  category: string;
  matchReasons: string[];
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

/* ----------  PAGE  ---------- */
export default function Account() {
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  const [, setLocation] = useLocation();

  // Use the survey hook
  const { survey, isLoading: surveyLoading, error: surveyError } = useSurvey();

  const [products, setProducts] = useState<PortalProduct[]>([]);
  const [likedProducts, setLikedProducts] = useState<LikedProduct[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

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

  if (isLoading) return <p className="p-8">Loading portal…</p>;
  if (!isAuthenticated) return null; // redirect in progress

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold font-heading mb-4">
              Welcome, {user?.firstName ?? "friend"} 👋
            </h1>
            <Button variant="outline" onClick={logout}>
              Sign Out
            </Button>
          </div>

          <Tabs defaultValue="products">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2 w-full">
              <TabsTrigger value="products">For You</TabsTrigger>
              <TabsTrigger value="liked">Liked</TabsTrigger>
              <TabsTrigger value="results">Survey Results</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
            </TabsList>

<TabsContent value="results" className="space-y-4 pt-2">
  <Card>
    <CardContent className="p-6">
      {surveyLoading ? (
        <p>Loading survey…</p>
      ) : survey ? (
        <>
          <h3 className="font-semibold mb-2">Completed</h3>
          <p className="text-sm text-muted-foreground">{survey.completedAt}</p>
          
          {/* Prettier display */}
          <SurveyAnswers answers={survey.answers} className="mt-3" />

        </>
      ) : (
        <p className="text-muted-foreground">
          {surveyError ? `Error: ${surveyError}` : "No survey on file."}
        </p>
      )}
      <Button className="mt-4" onClick={() => setLocation("/survey")}>
        Retake Survey
      </Button>
    </CardContent>
  </Card>
</TabsContent>


            {/* Products tab */}
            <TabsContent value="products" className="space-y-4 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product) => (
                  <div key={product.id} className="space-y-2">
                    <ProductCardNoHeart {...product} image={product.imageUrl} />
                    {product.matchReasons && product.matchReasons.length > 0 && (
                      <div className="px-2 space-y-1">
                        <p className="text-xs font-semibold text-primary">Why we recommend this:</p>
                        <ul className="text-xs text-muted-foreground space-y-0.5">
                          {product.matchReasons.map((reason, idx) => (
                            <li key={idx}>• {reason}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Liked products tab */}
            <TabsContent value="liked" className="space-y-4 pt-6">
              {likedProducts.length ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {likedProducts.map((p) => (
                    <div key={p.id} className="space-y-2">
                      <ProductCard {...p} image={p.imageUrl} />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No liked products yet.</p>
              )}
            </TabsContent>

            {/* Orders tab */}
            <TabsContent value="orders" className="space-y-4 pt-6">
              {orders.length ? (
                orders.map((o) => (
                  <Card key={o.id}>
                    <CardContent className="p-4 flex justify-between items-center">
                      <div>
                        <p className="font-semibold">Order #{o.id}</p>
                        <p className="text-sm text-muted-foreground">{o.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{o.total}</p>
                        <Badge>{o.status}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-muted-foreground">No orders yet.</p>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}

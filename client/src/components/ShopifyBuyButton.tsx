import { useEffect, useRef, useState } from 'react';
import { ShoppingBag, Sparkles } from 'lucide-react';

interface ShopifyBuyButtonProps {
  domain: string;
  storefrontAccessToken: string;
  productId: string;
  moneyFormat?: string;
  buttonText?: string;
}

export default function ShopifyBuyButton({
  domain,
  storefrontAccessToken,
  productId,
  moneyFormat = '%24%7B%7Bamount%7D%7D',
}: ShopifyBuyButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);
  const [shopifyReady, setShopifyReady] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (!containerRef.current || initialized.current) return;

    const initShopify = () => {
      const shopify = window.ShopifyBuy;
      if (!shopify?.UI) return;

      const client = shopify.buildClient({
        domain,
        storefrontAccessToken,
      });

      shopify.UI.onReady(client).then((ui) => {
        // Create a hidden component to get checkout URL functionality
        const hiddenNode = document.createElement('div');
        hiddenNode.style.display = 'none';
        document.body.appendChild(hiddenNode);

        ui.createComponent('product', {
          id: productId,
          node: hiddenNode,
          moneyFormat,
          options: {
            product: {
              contents: {
                img: false,
                title: false,
                price: false,
                description: false,
                button: false,
              },
            },
            cart: {
              startOpen: false,
              popup: false,
            },
          },
        });

        setShopifyReady(true);

        // Store client reference for checkout
        (window as any).__shopifyClient = client;
      });
    };

    const loadScript = () => {
      if (document.querySelector('script[data-shopify-buy]')) {
        const shopify = window.ShopifyBuy;
        if (shopify?.UI) {
          initShopify();
        } else {
          const existing = document.querySelector('script[data-shopify-buy]');
          existing?.addEventListener('load', initShopify);
        }
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js';
      script.async = true;
      script.setAttribute('data-shopify-buy', 'true');
      script.onload = initShopify;
      document.body.appendChild(script);
    };

    loadScript();
    initialized.current = true;
  }, [domain, storefrontAccessToken, productId, moneyFormat]);

  const handleCheckout = async () => {
    if (!shopifyReady) return;
    setIsAdding(true);

    try {
      // Use Shopify's storefront API to create a checkout directly
      const response = await fetch(`https://${domain}/api/2024-01/graphql.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
        },
        body: JSON.stringify({
          query: `
            mutation checkoutCreate($input: CheckoutCreateInput!) {
              checkoutCreate(input: $input) {
                checkout {
                  webUrl
                }
                checkoutUserErrors {
                  message
                }
              }
            }
          `,
          variables: {
            input: {
              lineItems: [
                {
                  variantId: `gid://shopify/ProductVariant/${productId}`,
                  quantity: 1,
                },
              ],
            },
          },
        }),
      });

      const data = await response.json();
      const checkoutUrl = data?.data?.checkoutCreate?.checkout?.webUrl;

      if (checkoutUrl) {
        window.open(checkoutUrl, '_blank');
      } else {
        console.error('Checkout creation failed:', data);
        // Fallback: redirect to product page
        window.open(`https://${domain}/products/period-box`, '_blank');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      // Fallback: redirect to product page
      window.open(`https://${domain}/products/period-box`, '_blank');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-4">
      <button
        onClick={handleCheckout}
        disabled={!shopifyReady || isAdding}
        className={`
          w-full flex items-center justify-center gap-3 p-6 rounded-xl border-2 
          bg-gradient-to-r from-primary to-chart-2 text-white font-bold text-lg 
          shadow-lg transition-all duration-200
          ${!shopifyReady || isAdding 
            ? 'opacity-70 cursor-wait' 
            : 'hover:opacity-90 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]'
          }
        `}
      >
        {isAdding ? (
          <>
            <Sparkles className="w-6 h-6 animate-spin" />
            Preparing checkout...
          </>
        ) : (
          <>
            <ShoppingBag className="w-6 h-6" />
            Add your personalized period box to your cart
          </>
        )}
      </button>

      {/* Hidden Shopify container for API initialization */}
      <div ref={containerRef} style={{ display: 'none' }} />
    </div>
  );
}

/* ----------  TypeScript global declarations  ---------- */
declare global {
  interface Window {
    ShopifyBuy?: {
      buildClient: (config: { domain: string; storefrontAccessToken: string }) => unknown;
      UI?: {
        onReady: (client: unknown) => Promise<{
          createComponent: (type: string, config: unknown) => void;
        }>;
      };
    };
  }
}
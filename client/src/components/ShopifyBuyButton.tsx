import { useEffect, useRef } from 'react';

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
  buttonText = 'Add to cart',
}: ShopifyBuyButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (!containerRef.current || initialized.current) return;

    const initShopify = () => {
      // Guard: ensure ShopifyBuy and UI are both available
      const shopify = window.ShopifyBuy;
      if (!shopify?.UI) return;

      const client = shopify.buildClient({
        domain,
        storefrontAccessToken,
      });

      shopify.UI.onReady(client).then((ui) => {
        ui.createComponent('product', {
          id: productId,
          node: containerRef.current,
          moneyFormat,
          options: {
            product: {
              iframe: false,
              contents: {
                img: true,
                title: true,
                price: true,
                description: true,
                button: true,
              },
              text: {
                button: buttonText,
              },
              styles: {
                product: {
                  '@media (min-width: 601px)': {
                    'max-width': '100%',
                    'margin-left': '0px',
                    'margin-bottom': '0px',
                  },
                },
                button: {
                  'background-color': '#fc5f5f',
                  color: '#fafafa',
                  ':hover': {
                    'background-color': '#e35656',
                    color: '#fafafa',
                  },
                  ':focus': {
                    'background-color': '#e35656',
                  },
                  'border-radius': '0.75rem',
                  'font-weight': 'bold',
                  'font-size': '1.125rem',
                  padding: '1rem 2rem',
                  width: '100%',
                },
                title: {
                  'font-family': 'inherit',
                  'font-size': '1.5rem',
                  'font-weight': 'bold',
                },
                price: {
                  'font-family': 'inherit',
                  'font-size': '1.25rem',
                  color: '#fc5f5f',
                },
              },
            },
            cart: {
              styles: {
                button: {
                  'background-color': '#fc5f5f',
                  color: '#fafafa',
                  ':hover': {
                    'background-color': '#e35656',
                    color: '#fafafa',
                  },
                  ':focus': {
                    'background-color': '#e35656',
                  },
                },
              },
              text: {
                total: 'Subtotal',
                button: 'Checkout',
              },
            },
            toggle: {
              styles: {
                toggle: {
                  'background-color': '#fc5f5f',
                  ':hover': {
                    'background-color': '#e35656',
                  },
                  ':focus': {
                    'background-color': '#e35656',
                  },
                },
                count: {
                  color: '#fafafa',
                  ':hover': {
                    color: '#fafafa',
                  },
                },
                iconPath: {
                  fill: '#fafafa',
                },
              },
            },
          },
        });
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

    return () => {
      // Shopify UI handles its own cleanup on re-render
    };
  }, [domain, storefrontAccessToken, productId, moneyFormat, buttonText]);

  return <div ref={containerRef} />;
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
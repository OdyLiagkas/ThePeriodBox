import { ProductCard } from '../ProductCard'
import productImage from "@assets/generated_images/Period_products_collection_photo_196a839e.png";

export default function ProductCardExample() {
  return (
    <div className="p-8 max-w-sm">
      <ProductCard
        name="Organic Cotton Tampons"
        description="Super-soft, 100% organic cotton tampons for comfortable all-day protection"
        price="$12.99"
        image={productImage}
        category="Tampons"
        features={["Organic", "Eco-friendly", "Leak-proof"]}
      />
    </div>
  )
}

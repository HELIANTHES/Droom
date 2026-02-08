# Website Architecture: E-commerce Businesses

## Overview

This specification covers websites for e-commerce businesses (jewelry stores, boutiques, artisan goods, home goods, etc.). These businesses require:

- **Primary conversion:** Product purchases (via Shopify)
- **Secondary conversion:** Email capture, consultation bookings (for custom work)
- **Key pages:** Shop, Product Detail, Cart/Checkout, Custom Consultation
- **Integration:** Shopify → Webhook → FastAPI → n8n → Purchase attribution → Dashboard

**Stack:**
- **Frontend:** Next.js 14+ (TypeScript, App Router)
- **Backend:** FastAPI (Python)
- **E-commerce Platform:** Shopify (headless or embedded)
- **Styling:** Tailwind CSS
- **Deployment:** Vercel (frontend), Railway/Render (backend)

---

## Site Architecture Patterns by Business Type

### Pattern 1: Jewelry/Luxury Goods

**Key Characteristics:** 
- High-ticket items ($500-$5,000+)
- Heavy on visual presentation
- Custom/bespoke options
- Trust signals critical (certifications, guarantees)

**Site Structure:**
```
Home
├─ Hero: Lifestyle imagery + "Shop Collection" CTA
├─ Featured products (3-5 hero items)
├─ Categories overview
├─ Social proof (Instagram feed, testimonials)
└─ Trust badges (certifications, guarantees)

/shop
├─ Product grid with filters
│  └─ Filter by: Category, Price, Material, Style
├─ Sort: Featured, Price (low/high), Newest
└─ Pagination

/shop/[category]
├─ Category-specific landing page
├─ Filtered product grid
└─ Category description + SEO content

/product/[slug]
├─ Image gallery (4-8 high-res images, zoom, 360° optional)
├─ Product details (price, materials, dimensions, SKU)
├─ Size/variant selector
├─ Add to cart (prominent)
├─ Trust signals (free shipping, returns, warranty)
├─ Product description (detailed)
├─ Care instructions
├─ Related products
└─ Reviews

/cart
├─ Cart items with thumbnails
├─ Quantity adjustment
├─ Promo code field
├─ Subtotal, shipping estimate, tax
└─ Checkout button (Shopify)

/custom-consultation ← SECONDARY CONVERSION
├─ Form: Name, email, phone, project details, budget
├─ Portfolio of custom work
├─ Process explanation
└─ Integration: Form → n8n → Lead Scoring

/about
├─ Brand story
├─ Craftsmanship process
├─ Artisan bios
└─ Values/sustainability

/contact
```

**Conversion Funnel:**
```
Instagram Ad (ring photo: "ethereal-diamond-ring")
  ↓
Landing: /product/ethereal-diamond-engagement-ring?source=instagram&campaign=engagement-001
  ↓
User browses, adds to cart
  ↓
Shopify checkout (Shopify-hosted)
  ↓
Purchase complete
  ↓
Shopify webhook → FastAPI → n8n
  ↓
n8n: Match email to Lead (if exists) → Create Purchase attribution → Update content ROAS
  ↓
Dashboard: Purchase attribution shown, content ROAS updated
```

---

### Pattern 2: Fashion/Apparel

**Key Characteristics:**
- Large inventory (50-500+ SKUs)
- Size/color variants critical
- Seasonal collections
- Fast returns/exchanges

**Site Structure:**
```
Home
/shop - All products with robust filtering
/shop/[collection] - e.g., "Spring 2026", "Sale"
/product/[slug]
/lookbook - Editorial photography, shoppable
/size-guide
/returns-exchanges
```

**Unique Features:**
- Virtual try-on (AR, optional)
- Size recommendation quiz
- Wishlist functionality
- Quick view modals (add to cart without leaving shop page)

---

### Pattern 3: Artisan/Handmade Goods

**Key Characteristics:**
- Limited quantities
- Made-to-order
- Story-driven (maker's journey)
- Custom options

**Site Structure:**
```
Home
/shop
/product/[slug]
/custom-orders - Form for bespoke pieces
/about-the-maker - Heavy storytelling
/process - How items are made (video, photos)
/wholesale - B2B inquiries
```

**Unique Features:**
- Inventory status ("Only 2 left!", "Made to order - 2 week lead time")
- Behind-the-scenes content
- Custom order form (similar to consultation form from service sites)

---

## Universal Components (All E-commerce Sites)

### Component 1: Product Grid

**Purpose:** Display products in browsable grid with filtering/sorting

```typescript
interface Product {
  id: string;
  title: string;
  slug: string;
  price: number;
  compareAtPrice?: number;  // Original price if on sale
  images: string[];
  variants: ProductVariant[];
  tags: string[];
  inStock: boolean;
  isNew?: boolean;
  isFeatured?: boolean;
}

interface ProductVariant {
  id: string;
  title: string;  // "Small", "Gold", "14K White Gold"
  price: number;
  availableForSale: boolean;
  sku: string;
}

interface ProductGridProps {
  products: Product[];
  filters?: {
    category?: string;
    priceRange?: [number, number];
    materials?: string[];
    inStockOnly?: boolean;
  };
  sortBy?: 'featured' | 'price-asc' | 'price-desc' | 'newest';
}

export function ProductGrid({ products, filters, sortBy }: ProductGridProps) {
  const [filteredProducts, setFilteredProducts] = useState(products);
  
  useEffect(() => {
    let result = [...products];
    
    // Apply filters
    if (filters?.category) {
      result = result.filter(p => p.tags.includes(filters.category));
    }
    
    if (filters?.priceRange) {
      const [min, max] = filters.priceRange;
      result = result.filter(p => p.price >= min && p.price <= max);
    }
    
    if (filters?.inStockOnly) {
      result = result.filter(p => p.inStock);
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      default: // featured
        result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }
    
    setFilteredProducts(result);
  }, [products, filters, sortBy]);
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {filteredProducts.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const [isHovered, setIsHovered] = useState(false);
  const discount = product.compareAtPrice 
    ? Math.round((1 - product.price / product.compareAtPrice) * 100)
    : 0;
  
  return (
    <Link 
      href={`/product/${product.slug}`}
      className="group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-square mb-3 overflow-hidden rounded-lg bg-gray-100">
        {/* Product Image */}
        <img
          src={isHovered && product.images[1] ? product.images[1] : product.images[0]}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-2">
          {product.isNew && (
            <span className="bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded">
              NEW
            </span>
          )}
          {discount > 0 && (
            <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
              -{discount}%
            </span>
          )}
          {!product.inStock && (
            <span className="bg-gray-800 text-white text-xs font-semibold px-2 py-1 rounded">
              SOLD OUT
            </span>
          )}
        </div>
        
        {/* Quick Add (optional - appears on hover) */}
        {product.inStock && product.variants.length === 1 && (
          <button
            className="absolute bottom-2 left-2 right-2 bg-white text-gray-900 py-2 rounded-lg font-medium opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.preventDefault();
              addToCart(product.variants[0].id, 1);
            }}
          >
            Quick Add
          </button>
        )}
      </div>
      
      {/* Product Info */}
      <div>
        <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">
          {product.title}
        </h3>
        
        <div className="flex items-baseline gap-2">
          <span className="font-semibold text-lg">
            ${product.price.toFixed(2)}
          </span>
          {product.compareAtPrice && (
            <span className="text-sm text-gray-500 line-through">
              ${product.compareAtPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
```

---

### Component 2: Product Detail Page

**Purpose:** Showcase product, enable purchase

```typescript
interface ProductDetailProps {
  product: {
    id: string;
    title: string;
    description: string;
    price: number;
    compareAtPrice?: number;
    images: string[];
    variants: ProductVariant[];
    materials: string[];
    dimensions?: string;
    weight?: string;
    sku: string;
    tags: string[];
    vendor: string;
    availableForSale: boolean;
    metafields?: {
      care_instructions?: string;
      shipping_info?: string;
      warranty?: string;
    };
  };
  relatedProducts: Product[];
  reviews?: Review[];
}

export function ProductDetail({ product, relatedProducts, reviews }: ProductDetailProps) {
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    
    try {
      await addToCart(selectedVariant.id, quantity);
      
      // Fire conversion event
      if (typeof window.fbq !== 'undefined') {
        window.fbq('track', 'AddToCart', {
          content_ids: [product.id],
          content_type: 'product',
          value: selectedVariant.price * quantity,
          currency: 'USD'
        });
      }
      
      // Show success notification
      showNotification('Added to cart!');
      
    } catch (error) {
      console.error('Failed to add to cart:', error);
      showNotification('Failed to add to cart. Please try again.', 'error');
    } finally {
      setIsAddingToCart(false);
    }
  };
  
  return (
    <div className="container mx-auto px-6 py-12">
      <div className="grid md:grid-cols-2 gap-12">
        {/* Images */}
        <div>
          {/* Main Image */}
          <div className="aspect-square mb-4 bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={product.images[selectedImage]}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Thumbnail Gallery */}
          <div className="grid grid-cols-4 gap-2">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`aspect-square rounded-lg overflow-hidden border-2 transition ${
                  selectedImage === index ? 'border-black' : 'border-transparent'
                }`}
              >
                <img
                  src={image}
                  alt={`${product.title} ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
        
        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
          
          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-2xl font-bold">
              ${selectedVariant.price.toFixed(2)}
            </span>
            {product.compareAtPrice && (
              <span className="text-xl text-gray-500 line-through">
                ${product.compareAtPrice.toFixed(2)}
              </span>
            )}
          </div>
          
          {/* Variant Selection */}
          {product.variants.length > 1 && (
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Select {product.variants[0].title.includes('Size') ? 'Size' : 'Option'}
              </label>
              <div className="flex flex-wrap gap-2">
                {product.variants.map(variant => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant)}
                    disabled={!variant.availableForSale}
                    className={`px-4 py-2 border-2 rounded-lg font-medium transition ${
                      selectedVariant.id === variant.id
                        ? 'border-black bg-black text-white'
                        : variant.availableForSale
                        ? 'border-gray-300 hover:border-gray-400'
                        : 'border-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {variant.title}
                    {!variant.availableForSale && ' (Sold Out)'}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Quantity */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Quantity</label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 border rounded-lg hover:bg-gray-100"
              >
                -
              </button>
              <span className="w-12 text-center font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 border rounded-lg hover:bg-gray-100"
              >
                +
              </button>
            </div>
          </div>
          
          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            disabled={!selectedVariant.availableForSale || isAddingToCart}
            className="w-full bg-black text-white py-4 rounded-lg font-semibold hover:bg-gray-800 transition disabled:bg-gray-300 disabled:cursor-not-allowed mb-4"
          >
            {!selectedVariant.availableForSale
              ? 'Sold Out'
              : isAddingToCart
              ? 'Adding to Cart...'
              : 'Add to Cart'}
          </button>
          
          {/* Trust Signals */}
          <div className="border-t pt-6 space-y-3 mb-6">
            <TrustBadge icon={Truck} text="Free shipping on orders over $100" />
            <TrustBadge icon={RefreshCw} text="30-day returns & exchanges" />
            <TrustBadge icon={Shield} text="Lifetime warranty" />
            <TrustBadge icon={Award} text="Ethically sourced materials" />
          </div>
          
          {/* Product Details */}
          <div className="border-t pt-6">
            <h2 className="font-semibold text-lg mb-3">Product Details</h2>
            <div className="prose prose-sm text-gray-600 mb-6">
              <p>{product.description}</p>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Materials:</span>
                <span className="font-medium">{product.materials.join(', ')}</span>
              </div>
              {product.dimensions && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Dimensions:</span>
                  <span className="font-medium">{product.dimensions}</span>
                </div>
              )}
              {product.weight && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Weight:</span>
                  <span className="font-medium">{product.weight}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">SKU:</span>
                <span className="font-medium">{product.sku}</span>
              </div>
            </div>
          </div>
          
          {/* Collapsible Sections */}
          {product.metafields?.care_instructions && (
            <Accordion title="Care Instructions">
              <p className="text-sm text-gray-600">{product.metafields.care_instructions}</p>
            </Accordion>
          )}
          
          {product.metafields?.shipping_info && (
            <Accordion title="Shipping Information">
              <p className="text-sm text-gray-600">{product.metafields.shipping_info}</p>
            </Accordion>
          )}
        </div>
      </div>
      
      {/* Reviews */}
      {reviews && reviews.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-8">Customer Reviews</h2>
          <ReviewsSection reviews={reviews} />
        </div>
      )}
      
      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-8">You May Also Like</h2>
          <ProductGrid products={relatedProducts} />
        </div>
      )}
    </div>
  );
}

function TrustBadge({ icon: Icon, text }: { icon: any; text: string }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <Icon className="w-5 h-5 text-gray-600" />
      <span className="text-gray-600">{text}</span>
    </div>
  );
}

function Accordion({ title, children }: { title: string; children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border-t py-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center font-medium"
      >
        {title}
        <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="mt-3">
          {children}
        </div>
      )}
    </div>
  );
}
```

---

### Component 3: Shopping Cart

**Purpose:** Review cart, apply discounts, proceed to checkout

```typescript
interface CartItem {
  id: string;
  productId: string;
  variantId: string;
  title: string;
  variantTitle: string;
  price: number;
  quantity: number;
  image: string;
  url: string;
}

interface CartProps {
  items: CartItem[];
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemove: (itemId: string) => void;
}

export function ShoppingCart({ items, onUpdateQuantity, onRemove }: CartProps) {
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 100 ? 0 : 10;  // Free shipping over $100
  const tax = subtotal * 0.0875;  // Example: 8.75% tax
  const total = subtotal - discount + shipping + tax;
  
  const handleApplyPromo = async () => {
    setIsApplyingPromo(true);
    
    try {
      // In production: Call Shopify API to validate discount code
      const response = await fetch('/api/shopify/validate-discount', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: promoCode, subtotal })
      });
      
      const result = await response.json();
      
      if (result.valid) {
        setDiscount(result.discount);
        showNotification(`Discount applied: $${result.discount.toFixed(2)} off`);
      } else {
        showNotification('Invalid promo code', 'error');
      }
    } catch (error) {
      showNotification('Failed to apply promo code', 'error');
    } finally {
      setIsApplyingPromo(false);
    }
  };
  
  if (items.length === 0) {
    return (
      <div className="container mx-auto px-6 py-20 text-center">
        <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-400" />
        <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-gray-600 mb-6">Add some products to get started!</p>
        <Button href="/shop">Continue Shopping</Button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {items.map(item => (
              <div key={item.id} className="flex gap-4 border rounded-lg p-4">
                {/* Product Image */}
                <Link href={item.url} className="flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                </Link>
                
                {/* Product Info */}
                <div className="flex-1">
                  <Link href={item.url} className="font-medium hover:underline">
                    {item.title}
                  </Link>
                  {item.variantTitle && (
                    <p className="text-sm text-gray-600 mt-1">{item.variantTitle}</p>
                  )}
                  <p className="font-semibold mt-2">${item.price.toFixed(2)}</p>
                </div>
                
                {/* Quantity & Remove */}
                <div className="flex flex-col items-end justify-between">
                  <button
                    onClick={() => onRemove(item.id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 border rounded hover:bg-gray-100"
                    >
                      -
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 border rounded hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                  
                  <p className="font-semibold mt-2">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Order Summary */}
        <div>
          <div className="border rounded-lg p-6 sticky top-6">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">
                  {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">${tax.toFixed(2)}</span>
              </div>
              
              <div className="border-t pt-3 flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            
            {/* Promo Code */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Promo Code</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  placeholder="SAVE10"
                  className="flex-1 px-3 py-2 border rounded-lg"
                />
                <button
                  onClick={handleApplyPromo}
                  disabled={!promoCode || isApplyingPromo}
                  className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-300"
                >
                  Apply
                </button>
              </div>
            </div>
            
            {/* Checkout Button */}
            <button
              onClick={() => proceedToCheckout()}
              className="w-full bg-black text-white py-4 rounded-lg font-semibold hover:bg-gray-800 transition mb-3"
            >
              Proceed to Checkout
            </button>
            
            <button
              onClick={() => window.location.href = '/shop'}
              className="w-full border border-gray-300 py-3 rounded-lg font-medium hover:bg-gray-50 transition"
            >
              Continue Shopping
            </button>
            
            {/* Trust Signals */}
            <div className="mt-6 pt-6 border-t space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>Secure checkout</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4" />
                <span>Free shipping over $100</span>
              </div>
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                <span>30-day returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

### Component 4: Custom Consultation Form (For Bespoke/Custom Work)

**Purpose:** Capture leads for custom orders (high-ticket, requires consultation)

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const consultationSchema = z.object({
  name: z.string().min(2, 'Name required'),
  email: z.string().email('Valid email required'),
  phone: z.string().regex(/^\(\d{3}\) \d{3}-\d{4}$/, 'Phone format: (555) 123-4567'),
  projectType: z.string().min(1, 'Please select a project type'),
  budget: z.string().min(1, 'Please select a budget range'),
  timeline: z.string().optional(),
  description: z.string().min(20, 'Please provide more details (at least 20 characters)'),
  inspiration: z.string().optional(),
  hearAboutUs: z.string().optional(),
});

type ConsultationFormData = z.infer<typeof consultationSchema>;

export function CustomConsultationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  const { register, handleSubmit, formState: { errors } } = useForm<ConsultationFormData>({
    resolver: zodResolver(consultationSchema)
  });
  
  const onSubmit = async (data: ConsultationFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      const response = await fetch('/api/forms/custom-consultation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          source: 'custom-consultation-page',
          submittedAt: new Date().toISOString()
        })
      });
      
      if (!response.ok) throw new Error('Submission failed');
      
      // Fire conversion
      if (typeof window.fbq !== 'undefined') {
        window.fbq('track', 'Lead', {
          content_name: 'Custom Consultation',
          value: 2000,  // Average custom order value
          currency: 'USD'
        });
      }
      
      window.location.href = '/custom-consultation/thank-you';
      
    } catch (error) {
      setSubmitError('Failed to submit. Please try again or email us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-4">Start Your Custom Project</h2>
        <p className="text-gray-600">
          Tell us about your vision, and we'll create something uniquely yours. 
          We'll respond within 24 hours with a personalized consultation.
        </p>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-lg p-8">
        {/* Name */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium mb-2">Full Name *</label>
          <input
            {...register('name')}
            type="text"
            className={`w-full px-4 py-3 border rounded-lg ${errors.name ? 'border-red-500' : ''}`}
            placeholder="Your name"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>
        
        {/* Email */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium mb-2">Email *</label>
          <input
            {...register('email')}
            type="email"
            className={`w-full px-4 py-3 border rounded-lg ${errors.email ? 'border-red-500' : ''}`}
            placeholder="you@example.com"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>
        
        {/* Phone */}
        <div className="mb-4">
          <label htmlFor="phone" className="block text-sm font-medium mb-2">Phone *</label>
          <input
            {...register('phone')}
            type="tel"
            className={`w-full px-4 py-3 border rounded-lg ${errors.phone ? 'border-red-500' : ''}`}
            placeholder="(555) 123-4567"
          />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
        </div>
        
        {/* Project Type */}
        <div className="mb-4">
          <label htmlFor="projectType" className="block text-sm font-medium mb-2">Project Type *</label>
          <select
            {...register('projectType')}
            className={`w-full px-4 py-3 border rounded-lg ${errors.projectType ? 'border-red-500' : ''}`}
          >
            <option value="">Select...</option>
            <option value="engagement-ring">Engagement Ring</option>
            <option value="wedding-bands">Wedding Bands</option>
            <option value="necklace">Necklace</option>
            <option value="earrings">Earrings</option>
            <option value="bracelet">Bracelet</option>
            <option value="redesign">Redesign Existing Jewelry</option>
            <option value="other">Other</option>
          </select>
          {errors.projectType && <p className="text-red-500 text-sm mt-1">{errors.projectType.message}</p>}
        </div>
        
        {/* Budget */}
        <div className="mb-4">
          <label htmlFor="budget" className="block text-sm font-medium mb-2">Budget Range *</label>
          <select
            {...register('budget')}
            className={`w-full px-4 py-3 border rounded-lg ${errors.budget ? 'border-red-500' : ''}`}
          >
            <option value="">Select...</option>
            <option value="under-2000">Under $2,000</option>
            <option value="2000-5000">$2,000 - $5,000</option>
            <option value="5000-10000">$5,000 - $10,000</option>
            <option value="10000-20000">$10,000 - $20,000</option>
            <option value="over-20000">Over $20,000</option>
          </select>
          {errors.budget && <p className="text-red-500 text-sm mt-1">{errors.budget.message}</p>}
        </div>
        
        {/* Timeline */}
        <div className="mb-4">
          <label htmlFor="timeline" className="block text-sm font-medium mb-2">Timeline</label>
          <select
            {...register('timeline')}
            className="w-full px-4 py-3 border rounded-lg"
          >
            <option value="">When do you need this?</option>
            <option value="flexible">Flexible / No rush</option>
            <option value="1-3-months">1-3 months</option>
            <option value="3-6-months">3-6 months</option>
            <option value="urgent">Urgent (under 1 month)</option>
          </select>
        </div>
        
        {/* Description */}
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium mb-2">
            Describe Your Vision *
          </label>
          <textarea
            {...register('description')}
            rows={6}
            className={`w-full px-4 py-3 border rounded-lg ${errors.description ? 'border-red-500' : ''}`}
            placeholder="Tell us about your dream piece. What style, materials, or specific details are you envisioning?"
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
        </div>
        
        {/* Inspiration */}
        <div className="mb-4">
          <label htmlFor="inspiration" className="block text-sm font-medium mb-2">
            Inspiration / Reference Images (optional)
          </label>
          <input
            {...register('inspiration')}
            type="text"
            className="w-full px-4 py-3 border rounded-lg"
            placeholder="Links to Pinterest, Instagram, or other inspiration"
          />
          <p className="text-sm text-gray-500 mt-1">
            You can also email photos after submitting this form
          </p>
        </div>
        
        {/* How did you hear */}
        <div className="mb-6">
          <label htmlFor="hearAboutUs" className="block text-sm font-medium mb-2">
            How did you hear about us?
          </label>
          <select
            {...register('hearAboutUs')}
            className="w-full px-4 py-3 border rounded-lg"
          >
            <option value="">Select...</option>
            <option value="instagram">Instagram</option>
            <option value="facebook">Facebook</option>
            <option value="google">Google Search</option>
            <option value="referral">Friend/Family Referral</option>
            <option value="other">Other</option>
          </select>
        </div>
        
        {submitError && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
            {submitError}
          </div>
        )}
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-black text-white py-4 rounded-lg font-semibold hover:bg-gray-800 disabled:bg-gray-300"
        >
          {isSubmitting ? 'Submitting...' : 'Start My Custom Project'}
        </button>
        
        <p className="text-xs text-gray-500 text-center mt-4">
          We'll respond within 24 hours with next steps and a preliminary quote.
        </p>
      </form>
    </div>
  );
}
```

---

## Shopify Integration

### Backend: Shopify Client

```python
# backend/services/shopify_client.py

import os
import hmac
import hashlib
import httpx
from typing import Optional

class ShopifyClient:
    def __init__(self):
        self.shop_url = os.getenv("SHOPIFY_SHOP_URL")  # e.g., "mystore.myshopify.com"
        self.access_token = os.getenv("SHOPIFY_ACCESS_TOKEN")
        self.api_version = "2024-01"
        self.base_url = f"https://{self.shop_url}/admin/api/{self.api_version}"
    
    async def get_products(self, limit: int = 50, collection_id: Optional[str] = None):
        """Fetch products from Shopify"""
        url = f"{self.base_url}/products.json"
        params = {"limit": limit}
        
        if collection_id:
            params["collection_id"] = collection_id
        
        async with httpx.AsyncClient() as client:
            response = await client.get(
                url,
                params=params,
                headers={"X-Shopify-Access-Token": self.access_token}
            )
            return response.json()
    
    async def get_product(self, product_id: str):
        """Fetch single product by ID"""
        url = f"{self.base_url}/products/{product_id}.json"
        
        async with httpx.AsyncClient() as client:
            response = await client.get(
                url,
                headers={"X-Shopify-Access-Token": self.access_token}
            )
            return response.json()
    
    async def validate_discount_code(self, code: str):
        """Validate a discount code"""
        url = f"{self.base_url}/discount_codes/lookup.json"
        params = {"code": code}
        
        async with httpx.AsyncClient() as client:
            response = await client.get(
                url,
                params=params,
                headers={"X-Shopify-Access-Token": self.access_token}
            )
            
            if response.status_code == 200:
                data = response.json()
                # Calculate discount amount based on type
                # This is simplified - real implementation depends on discount type
                return {
                    "valid": True,
                    "discount": data.get("amount", 0)  # Or percentage
                }
            else:
                return {"valid": False}
    
    def verify_webhook(self, data: bytes, hmac_header: str) -> bool:
        """Verify Shopify webhook signature"""
        secret = os.getenv("SHOPIFY_WEBHOOK_SECRET").encode('utf-8')
        hash = hmac.new(secret, data, hashlib.sha256)
        computed_hmac = hash.hexdigest()
        return hmac.compare_digest(computed_hmac, hmac_header)

shopify_client = ShopifyClient()
```

---

### Backend: Webhook Handler

```python
# backend/routers/webhooks.py

from fastapi import APIRouter, Request, HTTPException, Header
from services.shopify_client import shopify_client
from services.n8n_client import n8n_client
from services.neo4j_client import neo4j_client
import json

router = APIRouter(prefix="/api/webhooks", tags=["webhooks"])

@router.post("/shopify/orders/create")
async def shopify_order_created(
    request: Request,
    x_shopify_hmac_sha256: str = Header(None)
):
    """
    Webhook: Shopify order created
    
    Flow:
    1. Verify webhook signature
    2. Extract order data
    3. Forward to n8n for processing
    4. n8n will:
       - Match customer email to Lead in Neo4j
       - Create Purchase node
       - Attribute to Campaign/Content
       - Update ROAS calculations
       - Notify dashboard
    """
    
    # Get raw body for signature verification
    body = await request.body()
    
    # Verify webhook is from Shopify
    if not shopify_client.verify_webhook(body, x_shopify_hmac_sha256):
        raise HTTPException(status_code=401, detail="Invalid webhook signature")
    
    # Parse order data
    order = json.loads(body)
    
    # Extract relevant fields
    order_data = {
        "order_id": order["id"],
        "order_number": order["order_number"],
        "customer_email": order["customer"]["email"],
        "customer_name": f"{order['customer']['first_name']} {order['customer']['last_name']}",
        "total_price": float(order["total_price"]),
        "subtotal_price": float(order["subtotal_price"]),
        "total_tax": float(order["total_tax"]),
        "currency": order["currency"],
        "line_items": [
            {
                "product_id": item["product_id"],
                "variant_id": item["variant_id"],
                "title": item["title"],
                "quantity": item["quantity"],
                "price": float(item["price"])
            }
            for item in order["line_items"]
        ],
        "created_at": order["created_at"],
        "landing_site": order.get("landing_site"),  # May contain UTM params
        "referring_site": order.get("referring_site")
    }
    
    # Forward to n8n
    brand_id = os.getenv("BRAND_ID")
    await n8n_client.trigger_webhook(
        f"webhook/{brand_id}/shopify-order",
        order_data
    )
    
    return {"success": True}


@router.post("/shopify/customers/create")
async def shopify_customer_created(
    request: Request,
    x_shopify_hmac_sha256: str = Header(None)
):
    """
    Webhook: New customer created in Shopify
    (Optional - can be used to sync customer data)
    """
    
    body = await request.body()
    
    if not shopify_client.verify_webhook(body, x_shopify_hmac_sha256):
        raise HTTPException(status_code=401, detail="Invalid webhook signature")
    
    customer = json.loads(body)
    
    # Forward to n8n if needed
    # Or handle directly
    
    return {"success": True}
```

---

## Purchase Attribution Flow (n8n Workflow)

**Workflow 9: Shopify Integration** (detailed)

### Node-by-Node Flow

```
1. Webhook Trigger: Receive order from FastAPI
   ↓
2. Parse Order Data
   Extract: customer_email, order_id, total_price, product_ids
   ↓
3. Query Neo4j: Find matching Lead
   Query: MATCH (l:Lead {email: $email, brand_id: $brand_id})
   Returns: Lead node (if exists from previous form submission)
   ↓
4. Branch: Lead Found?
   
   YES → Continue attribution flow
   NO → Create anonymous purchase record, skip attribution
   
   ↓ (if YES)
   
5. Query Neo4j: Trace Lead back to Campaign
   Query: 
   MATCH (l:Lead {email: $email})-[:CAME_FROM]->(camp:Campaign)
   MATCH (camp)<-[:RAN_IN]-(content:Content)
   Returns: Campaign ID, Content ID
   ↓
6. Create Purchase Node in Neo4j
   Query:
   CREATE (p:Purchase {
     id: $purchase_id,
     brand_id: $brand_id,
     order_id: $order_id,
     order_total: $total_price,
     product_ids: $product_ids,
     purchase_date: datetime(),
     customer_email: $email
   })
   ↓
7. Create Attribution Relationships
   Query:
   MATCH (p:Purchase {id: $purchase_id})
   MATCH (camp:Campaign {id: $campaign_id})
   MATCH (content:Content {id: $content_id})
   MATCH (customer:Customer {email: $email})
   
   MERGE (customer)-[:MADE_PURCHASE]->(p)
   MERGE (p)-[:ATTRIBUTED_TO]->(camp)
   MERGE (p)-[:ATTRIBUTED_TO]->(content)
   ↓
8. Update Content Revenue & ROAS
   Query:
   MATCH (c:Content {id: $content_id})
   SET c.total_revenue = c.total_revenue + $order_total
   
   // Recalculate ROAS
   WITH c
   MATCH (c)-[:RAN_IN]->()-[:ACHIEVED]->(perf:Performance)
   WITH c, sum(perf.spend) AS total_spend, c.total_revenue AS total_revenue
   SET c.true_roas = total_revenue / total_spend
   ↓
9. Update Pinecone Content Metadata
   Update vector metadata with true ROAS including purchases
   ↓
10. CSO Agent: Analyze Purchase Attribution
    Prompt: "A purchase was just attributed to content-{id}. 
            Previous ROAS (conversions only): {old_roas}
            New ROAS (including purchase): {new_roas}
            Should we scale this content?"
    ↓
11. If CSO recommends: Increase budget to high-performing content
    ↓
12. Notify Dashboard
    POST /api/webhooks/purchase-attribution
    Body: {
      purchase_id, order_total, content_id, campaign_id,
      old_roas, new_roas, attribution_confidence
    }
    ↓
13. Send Thank You Email to Customer
    (Optional: Include product care instructions, related products)
```

---

## Site Configuration (E-commerce)

**Location:** `/clients/{brand-name}/website/config.json`

```json
{
  "brand_name": "Ethereal Jewelry",
  "brand_id": "ethereal-jewelry",
  "tagline": "Handcrafted Fine Jewelry",
  "business_model": "ecommerce-primary",
  
  "contact": {
    "phone": "(415) 555-0199",
    "email": "hello@etherealjewelry.com",
    "address": "456 Market St, San Francisco, CA 94102"
  },
  
  "shopify": {
    "shop_url": "ethereal-jewelry.myshopify.com",
    "storefront_access_token": "xxxxx",
    "checkout_url": "https://ethereal-jewelry.myshopify.com/cart"
  },
  
  "product_categories": [
    {"name": "Engagement Rings", "slug": "engagement-rings", "featured": true},
    {"name": "Wedding Bands", "slug": "wedding-bands", "featured": true},
    {"name": "Necklaces", "slug": "necklaces", "featured": false},
    {"name": "Earrings", "slug": "earrings", "featured": false},
    {"name": "Bracelets", "slug": "bracelets", "featured": false}
  ],
  
  "shipping": {
    "free_shipping_threshold": 100,
    "standard_rate": 10,
    "expedited_rate": 25,
    "international_available": true
  },
  
  "policies": {
    "returns_days": 30,
    "warranty": "lifetime",
    "resize_free": true,
    "engrave_free": true
  },
  
  "brand_colors": {
    "primary": "#1A1A1A",
    "secondary": "#F5F5F5",
    "accent": "#C9A563",
    "text": "#2C2C2C"
  },
  
  "logo": "/assets/logo.svg",
  "favicon": "/assets/favicon.ico",
  
  "social_media": {
    "instagram": "https://instagram.com/etherealjewelry",
    "pinterest": "https://pinterest.com/etherealjewelry",
    "facebook": "https://facebook.com/etherealjewelry"
  },
  
  "seo": {
    "title": "Ethereal Jewelry | Handcrafted Fine Jewelry & Engagement Rings",
    "description": "Discover handcrafted engagement rings, wedding bands, and fine jewelry. Ethically sourced materials, lifetime warranty, free shipping over $100.",
    "keywords": ["engagement rings", "wedding bands", "handmade jewelry", "fine jewelry", "custom rings"]
  },
  
  "tracking": {
    "google_analytics": "G-XXXXXXXXXX",
    "google_ads_conversion_id": "AW-XXXXXXXXXX",
    "meta_pixel_id": "XXXXXXXXXX",
    "pinterest_tag_id": "XXXXXXXXXX"
  },
  
  "features": {
    "custom_consultation": true,
    "virtual_try_on": false,
    "chat_support": true,
    "product_reviews": true
  }
}
```

---

## Deployment Considerations

### Environment Variables

**Frontend:**
```
NEXT_PUBLIC_SHOPIFY_DOMAIN=ethereal-jewelry.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=xxxxx
NEXT_PUBLIC_API_URL=https://api.etherealjewelry.com
NEXT_PUBLIC_BRAND_ID=ethereal-jewelry
```

**Backend:**
```
SHOPIFY_SHOP_URL=ethereal-jewelry.myshopify.com
SHOPIFY_ACCESS_TOKEN=shpat_xxxxx
SHOPIFY_WEBHOOK_SECRET=xxxxx
N8N_WEBHOOK_URL=https://n8n.yourserver.com
NEO4J_URI=neo4j+s://xxxxx
PINECONE_API_KEY=xxxxx
BRAND_ID=ethereal-jewelry
```

### Shopify Setup Steps

1. **Create Shopify Store**
   - Sign up at shopify.com
   - Choose plan (Basic: $39/mo recommended)
   
2. **Install Products**
   - Add all products with:
     - High-quality images (minimum 4 per product)
     - Detailed descriptions
     - Variants (size, material, etc.)
     - SKUs
     - Inventory quantities

3. **Create Custom App** (for API access)
   - Shopify Admin → Apps → Develop apps → Create app
   - Configure Admin API scopes:
     - read_products, read_orders, read_customers
   - Get API credentials (access token)

4. **Configure Webhooks**
   - Settings → Notifications → Webhooks
   - Add webhook:
     - Event: Order creation
     - URL: `https://api.etherealjewelry.com/api/webhooks/shopify/orders/create`
     - Format: JSON

5. **Set Up Checkout**
   - Option A: Use Shopify-hosted checkout (easier, recommended)
   - Option B: Headless checkout (more control, complex)

6. **Configure Shipping**
   - Settings → Shipping and delivery
   - Add shipping zones
   - Set rates

7. **Add Payment Gateways**
   - Shopify Payments (recommended, no transaction fees)
   - Or: Stripe, PayPal

---

## Advanced Features (Optional)

### Virtual Try-On (Jewelry/Fashion)

```typescript
// Using AR.js or model-viewer for 3D models
import '@google/model-viewer';

export function VirtualTryOn({ productModel }: { productModel: string }) {
  return (
    <model-viewer
      src={productModel}
      alt="3D model of product"
      ar
      ar-modes="webxr scene-viewer quick-look"
      camera-controls
      auto-rotate
      className="w-full h-96"
    />
  );
}
```

### Product Reviews Integration

```typescript
// Using Shopify Product Reviews app or custom solution
interface Review {
  id: string;
  rating: number;
  title: string;
  body: string;
  author: string;
  verified_purchase: boolean;
  created_at: string;
}

export function ReviewsSection({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  
  useEffect(() => {
    fetchReviews(productId).then(setReviews);
  }, [productId]);
  
  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex">
          {[1,2,3,4,5].map(i => (
            <Star key={i} className={i <= avgRating ? 'text-yellow-400 fill-current' : 'text-gray-300'} />
          ))}
        </div>
        <span className="text-lg font-semibold">{avgRating.toFixed(1)}</span>
        <span className="text-gray-600">({reviews.length} reviews)</span>
      </div>
      
      <div className="space-y-6">
        {reviews.map(review => (
          <div key={review.id} className="border-b pb-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className={`w-4 h-4 ${i <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                ))}
              </div>
              <span className="font-semibold">{review.title}</span>
            </div>
            <p className="text-gray-700 mb-2">{review.body}</p>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>{review.author}</span>
              {review.verified_purchase && (
                <span className="flex items-center gap-1">
                  <Check className="w-4 h-4 text-green-500" />
                  Verified Purchase
                </span>
              )}
              <span>·</span>
              <span>{new Date(review.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Wishlist/Favorites

```typescript
// Store in localStorage or user account
export function useWishlist() {
  const [wishlist, setWishlist] = useState<string[]>([]);
  
  useEffect(() => {
    const saved = localStorage.getItem('wishlist');
    if (saved) setWishlist(JSON.parse(saved));
  }, []);
  
  const addToWishlist = (productId: string) => {
    const updated = [...wishlist, productId];
    setWishlist(updated);
    localStorage.setItem('wishlist', JSON.stringify(updated));
  };
  
  const removeFromWishlist = (productId: string) => {
    const updated = wishlist.filter(id => id !== productId);
    setWishlist(updated);
    localStorage.setItem('wishlist', JSON.stringify(updated));
  };
  
  const isInWishlist = (productId: string) => wishlist.includes(productId);
  
  return { wishlist, addToWishlist, removeFromWishlist, isInWishlist };
}
```

---

## Testing Checklist (E-commerce Specific)

**Before Launch:**
- [ ] All products display correctly
- [ ] Product images load and zoom works
- [ ] Variant selection works (size, color, etc.)
- [ ] Add to cart works for all products
- [ ] Cart updates correctly (quantity, remove)
- [ ] Promo codes validate correctly
- [ ] Checkout redirects to Shopify properly
- [ ] Test purchase end-to-end (use Shopify test mode)
- [ ] Purchase webhook fires correctly
- [ ] Purchase appears in Neo4j
- [ ] Attribution logic works (if lead exists)
- [ ] Dashboard shows purchase attribution
- [ ] Content ROAS updates with purchase data
- [ ] Conversion pixels fire on purchase
- [ ] Order confirmation email sends
- [ ] Custom consultation form submits
- [ ] Mobile shopping experience smooth
- [ ] Page load times acceptable (< 3s)
- [ ] SSL certificate valid
- [ ] All product links work (no 404s)
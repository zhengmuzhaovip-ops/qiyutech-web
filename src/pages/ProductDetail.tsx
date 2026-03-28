import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  Heart,
  Star,
  Check,
  Minus,
  Plus,
  Truck,
  Shield,
  RotateCcw,
  ChevronRight,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { API_BASE_URL } from '../config';
import type { ApiProduct } from '../hooks/useProducts';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'specifications'>('description');
  const [showAddedMessage, setShowAddedMessage] = useState(false);
  const [product, setProduct] = useState<ApiProduct | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<ApiProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/products/${id}`);
        const data = await res.json();
        if (data.success) {
          const p = data.product;
          setProduct({
            ...p,
            price: Number(p.price),
            comparePrice: Number(p.comparePrice),
            stock: Number(p.stock),
          });
          // fetch related by same category
          const rel = await fetch(`${API_BASE_URL}/products?category=${p.category}&limit=4`);
          const relData = await rel.json();
          if (relData.success) {
            setRelatedProducts(
              relData.products
                .filter((r: ApiProduct) => r._id !== p._id)
                .slice(0, 4)
                .map((r: ApiProduct) => ({
                  ...r,
                  price: Number(r.price),
                  comparePrice: Number(r.comparePrice),
                  stock: Number(r.stock),
                }))
            );
          }
        }
      } catch (err) {
        console.error('Failed to fetch product', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-display text-gray-800 mb-4">Product Not Found</h1>
          <Link to="/" className="text-brand-blue hover:underline">Return to Home</Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product._id,
        name: product.name,
        price: product.price,
        image: product.images?.[0] || '',
      });
    }
    setShowAddedMessage(true);
    setTimeout(() => setShowAddedMessage(false), 2000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };

  const inStock = product.stock > 0;

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-gray-500 hover:text-gray-700">Home</Link>
            <ChevronRight size={16} className="text-gray-300" />
            <Link to="/products" className="text-gray-500 hover:text-gray-700 capitalize">{product.category}</Link>
            <ChevronRight size={16} className="text-gray-300" />
            <span className="text-gray-800">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Product Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div>
            <div className="bg-gray-50 rounded-2xl p-8 aspect-square flex items-center justify-center mb-4 overflow-hidden">
              {product.images?.[activeImage] ? (
                <img
                  src={product.images[activeImage]}
                  alt={product.name}
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <div className="text-gray-300">No Image</div>
              )}
            </div>
            {product.images?.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${activeImage === i ? 'border-brand-blue' : 'border-transparent'}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <span className="text-xs text-gray-400 capitalize font-body">{product.brand}</span>
            <h1 className="font-display text-3xl sm:text-4xl text-gray-800 mb-4 mt-1">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className={`${i < Math.floor(product.rating?.average || 0) ? 'text-brand-blue fill-brand-blue' : 'text-gray-200'}`}
                  />
                ))}
              </div>
              <span className="text-gray-500 text-sm">{product.rating?.average?.toFixed(1) || '0.0'}</span>
              <span className="text-gray-400 text-sm">({product.rating?.count || 0} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-brand-blue font-display text-4xl">
                ${product.price.toFixed(2)}
              </span>
              {product.comparePrice > 0 && (
                <>
                  <span className="text-gray-400 font-body text-xl line-through">
                    ${product.comparePrice.toFixed(2)}
                  </span>
                  <span className="bg-brand-blue/10 text-brand-blue text-sm font-body px-2 py-1 rounded">
                    Save ${(product.comparePrice - product.price).toFixed(2)}
                  </span>
                </>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2 mb-6">
              <div className={`w-2 h-2 rounded-full ${inStock ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className={inStock ? 'text-green-500' : 'text-red-500'}>
                {inStock ? `In Stock (${product.stock} left)` : 'Out of Stock'}
              </span>
            </div>

            {/* Quantity Selector */}
            <div className="mb-6">
              <label className="text-gray-500 text-sm mb-2 block">Quantity</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  <Minus size={18} />
                </button>
                <span className="text-gray-800 font-body text-lg w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mb-8">
              <button
                onClick={handleAddToCart}
                disabled={!inStock}
                className="flex-1 bg-brand-blue text-white font-body font-semibold py-4 rounded-full hover:bg-brand-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <ShoppingCart size={20} />
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                disabled={!inStock}
                className="flex-1 bg-gray-800 text-white font-body font-semibold py-4 rounded-full hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Buy Now
              </button>
              <button className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors">
                <Heart size={20} />
              </button>
            </div>

            {/* Added to Cart Message */}
            {showAddedMessage && (
              <div className="mb-6 bg-green-500/10 border border-green-500/30 rounded-lg p-4 flex items-center gap-2">
                <Check size={20} className="text-green-500" />
                <span className="text-green-600">Added to cart successfully!</span>
              </div>
            )}

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Truck className="mx-auto text-brand-blue mb-2" size={24} />
                <span className="text-gray-500 text-xs">Free Shipping</span>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Shield className="mx-auto text-brand-blue mb-2" size={24} />
                <span className="text-gray-500 text-xs">Authentic</span>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <RotateCcw className="mx-auto text-brand-blue mb-2" size={24} />
                <span className="text-gray-500 text-xs">30-Day Return</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-16">
          <div className="flex gap-8 border-b border-gray-100 mb-8">
            <button
              onClick={() => setActiveTab('description')}
              className={`pb-4 text-lg font-body transition-colors relative ${activeTab === 'description' ? 'text-gray-800' : 'text-gray-400 hover:text-gray-600'}`}
            >
              Description
              {activeTab === 'description' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-blue" />}
            </button>
            <button
              onClick={() => setActiveTab('specifications')}
              className={`pb-4 text-lg font-body transition-colors relative ${activeTab === 'specifications' ? 'text-gray-800' : 'text-gray-400 hover:text-gray-600'}`}
            >
              Specifications
              {activeTab === 'specifications' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-blue" />}
            </button>
          </div>

          {activeTab === 'description' ? (
            <div className="text-gray-600 font-body leading-relaxed">
              <p className="mb-4">{product.description}</p>
              {product.shortDescription && (
                <p className="text-gray-400 text-sm">{product.shortDescription}</p>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-4 text-gray-500 font-body w-1/3">Brand</td>
                    <td className="py-4 text-gray-800 font-body">{product.brand}</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-4 text-gray-500 font-body">Category</td>
                    <td className="py-4 text-gray-800 font-body capitalize">{product.category}</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-4 text-gray-500 font-body">SKU</td>
                    <td className="py-4 text-gray-800 font-body">{product.sku}</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-4 text-gray-500 font-body">Stock</td>
                    <td className="py-4 text-gray-800 font-body">{product.stock}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="font-display text-2xl text-gray-800 mb-8">Related Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((related) => (
                <Link
                  key={related._id}
                  to={`/product/${related._id}`}
                  className="group bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-brand-blue/50 transition-all shadow-sm hover:shadow-lg"
                >
                  <div className="aspect-square p-4 bg-gray-50">
                    {related.images?.[0] ? (
                      <img
                        src={related.images[0]}
                        alt={related.name}
                        className="w-full h-full object-contain transition-transform group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">No Image</div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-gray-700 font-body text-sm line-clamp-2 mb-2">{related.name}</h3>
                    <p className="text-brand-blue font-display text-lg">${related.price.toFixed(2)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

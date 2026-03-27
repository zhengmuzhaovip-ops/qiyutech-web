import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Search, SlidersHorizontal, Eye, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useProducts, ApiProduct } from '../hooks/useProducts';

const CATEGORIES = ['disposable', 'pod', 'mod', 'juice', 'accessory', 'other'];
const SORT_OPTIONS = [
  { label: 'Newest', value: '-createdAt' },
  { label: 'Price: Low to High', value: 'price' },
  { label: 'Price: High to Low', value: '-price' },
];

export default function ProductsPage() {
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('-createdAt');
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const { addToCart } = useCart();

  const { products, total, pages, isLoading } = useProducts({
    search, category, sort, page, limit: 12,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const handleCategoryChange = (cat: string) => {
    setCategory(cat === category ? '' : cat);
    setPage(1);
  };

  const handleAddToCart = (e: React.MouseEvent, product: ApiProduct) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || '',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-4xl sm:text-5xl text-gray-900 tracking-wide mb-2">
            All <span className="text-brand-blue">Products</span>
          </h1>
          <p className="text-gray-500 font-body">{total} products available</p>
        </div>

        {/* Search + Controls */}
        <div className="flex flex-wrap gap-3 mb-6 items-center">
          <form onSubmit={handleSearch} className="relative flex-1 min-w-60">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue"
            />
            {searchInput && (
              <button type="button" onClick={() => { setSearchInput(''); setSearch(''); setPage(1); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X size={14} />
              </button>
            )}
          </form>

          <select
            value={sort}
            onChange={e => { setSort(e.target.value); setPage(1); }}
            className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
          >
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 border rounded-xl px-3 py-2.5 text-sm transition-colors ${showFilters ? 'bg-brand-blue text-white border-brand-blue' : 'bg-white border-gray-200 text-gray-600 hover:border-brand-blue'}`}
          >
            <SlidersHorizontal size={16} />
            Filters {category && '(1)'}
          </button>
        </div>

        {/* Category Filter */}
        {showFilters && (
          <div className="flex flex-wrap gap-2 mb-6 p-4 bg-white rounded-xl border border-gray-100">
            <button
              onClick={() => { setCategory(''); setPage(1); }}
              className={`px-4 py-1.5 rounded-full text-sm font-body transition-colors ${!category ? 'bg-brand-blue text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              All
            </button>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-body capitalize transition-colors ${category === cat ? 'bg-brand-blue text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden border border-gray-100 animate-pulse">
                <div className="aspect-square bg-gray-200" />
                <div className="p-4 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-gray-400 font-body text-lg mb-4">No products found</p>
            {(search || category) && (
              <button
                onClick={() => { setSearch(''); setSearchInput(''); setCategory(''); setPage(1); }}
                className="text-brand-blue hover:underline text-sm"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map(product => (
              <Link
                key={product._id}
                to={`/product/${product._id}`}
                className="group bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-brand-blue/50 transition-all duration-300 shadow-sm hover:shadow-lg hover:-translate-y-1"
              >
                <div className="relative aspect-square bg-gradient-to-b from-gray-50 to-transparent p-4 overflow-hidden">
                  {product.comparePrice > 0 && (
                    <div className="absolute top-2 left-2 z-10 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded">
                      SALE
                    </div>
                  )}
                  {product.images?.[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">No Image</div>
                  )}

                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-800 hover:bg-brand-blue hover:text-white transition-colors">
                      <Eye size={18} />
                    </div>
                    <button
                      onClick={(e) => handleAddToCart(e, product)}
                      className="w-10 h-10 bg-brand-blue rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors"
                    >
                      <ShoppingCart size={18} />
                    </button>
                  </div>
                </div>

                <div className="p-4">
                  <span className="text-xs text-gray-400 capitalize font-body">{product.category}</span>
                  <h3 className="text-gray-700 font-body text-sm line-clamp-2 mt-1 mb-2 group-hover:text-brand-blue transition-colors">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                      <span className="text-brand-blue font-display text-lg">${product.price.toFixed(2)}</span>
                      {product.comparePrice > 0 && (
                        <span className="text-gray-400 text-xs line-through">${product.comparePrice.toFixed(2)}</span>
                      )}
                    </div>
                    {product.stock <= 10 && product.stock > 0 && (
                      <span className="text-xs text-orange-500 font-body">Only {product.stock} left</span>
                    )}
                    {product.stock === 0 && (
                      <span className="text-xs text-red-400 font-body">Out of stock</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 border border-gray-200 rounded-xl text-sm bg-white disabled:opacity-40 hover:border-brand-blue hover:text-brand-blue transition-colors"
            >
              ← Prev
            </button>

            {[...Array(pages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setPage(i + 1)}
                className={`w-9 h-9 rounded-xl text-sm transition-colors ${page === i + 1 ? 'bg-brand-blue text-white' : 'bg-white border border-gray-200 hover:border-brand-blue hover:text-brand-blue'}`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => setPage(p => Math.min(pages, p + 1))}
              disabled={page === pages}
              className="px-4 py-2 border border-gray-200 rounded-xl text-sm bg-white disabled:opacity-40 hover:border-brand-blue hover:text-brand-blue transition-colors"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

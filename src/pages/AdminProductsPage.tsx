import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import {
  bootstrapAdminCatalog,
  createAdminProduct,
  createAdminProductSeries,
  deleteAdminProduct,
  deleteAdminProductSeries,
  fetchAdminProducts,
  fetchAdminProductSeries,
  updateAdminProduct,
  updateAdminProductSeries,
  type AdminProduct,
  type AdminProductPayload,
  type AdminProductSeries,
  type AdminProductSeriesPayload,
  type AdminProductSpec,
} from '../lib/admin';

const FIXED_CARD_EYEBROW = 'Wholesale Item';
const FIXED_FRONTEND_TAGS = ['Wholesale pricing', 'Shelf-ready'];
const DEFAULT_SERIES_EYEBROW = 'Wholesale Series';
const DEFAULT_SERIES_TITLE = 'GEEK BAR PULSE X Series';
const DEFAULT_SERIES_DESCRIPTION = 'Shelf-ready wholesale SKUs built for repeat retail ordering.';

const categoryLabels: Record<string, string> = {
  disposable: '一次性',
  pod: 'Pod',
  mod: 'Mod',
  juice: '烟油',
  accessory: '配件',
  other: '其他',
};

const emptySeriesForm: AdminProductSeriesPayload = {
  eyebrow: DEFAULT_SERIES_EYEBROW,
  title: '',
  description: '',
  sortOrder: 0,
  isActive: true,
};

const emptyProductForm: AdminProductPayload = {
  name: '',
  shortName: '',
  flavor: '',
  description: '',
  shortDescription: '',
  badge: '',
  price: 0,
  comparePrice: 0,
  category: 'disposable',
  brand: '',
  seriesId: '',
  image: '',
  gallery: [],
  highlights: [],
  specs: [],
  stock: 0,
  sku: '',
  weight: 0,
  sortOrder: 0,
  tags: FIXED_FRONTEND_TAGS,
  isActive: true,
  isFeatured: false,
};

function toSeriesForm(series: AdminProductSeries): AdminProductSeriesPayload {
  return {
    eyebrow: series.eyebrow,
    title: series.title,
    description: series.description,
    sortOrder: series.sortOrder,
    isActive: series.isActive,
  };
}

export default function AdminProductsPage() {
  const { token } = useAuth();
  const [seriesList, setSeriesList] = useState<AdminProductSeries[]>([]);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSavingProduct, setIsSavingProduct] = useState(false);
  const [isSavingSeries, setIsSavingSeries] = useState(false);
  const [isCreatingSeries, setIsCreatingSeries] = useState(false);
  const [isBootstrappingCatalog, setIsBootstrappingCatalog] = useState(false);
  const [deletingSeriesId, setDeletingSeriesId] = useState<string | null>(null);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [expandedSeriesId, setExpandedSeriesId] = useState<string | null>(null);
  const [activeProductSeriesId, setActiveProductSeriesId] = useState<string | null>(null);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [seriesForm, setSeriesForm] = useState<AdminProductSeriesPayload>(emptySeriesForm);
  const [newSeriesForm, setNewSeriesForm] = useState<AdminProductSeriesPayload>(emptySeriesForm);
  const [form, setForm] = useState<AdminProductPayload>(emptyProductForm);
  const [galleryInput, setGalleryInput] = useState('');
  const [highlightsInput, setHighlightsInput] = useState('');
  const [specsInput, setSpecsInput] = useState('');

  useEffect(() => {
    if (!token) return;
    let active = true;
    const currentToken = token;

    async function loadInitialData() {
      try {
        setIsLoading(true);
        const [nextSeries, nextProducts] = await Promise.all([
          fetchAdminProductSeries(currentToken),
          fetchAdminProducts(currentToken),
        ]);

        if (!active) return;

        setSeriesList(nextSeries);
        setProducts(nextProducts);
        setError('');
      } catch (loadError) {
        if (!active) return;
        setError(loadError instanceof Error ? loadError.message : '无法加载系列与商品数据。');
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    loadInitialData();

    return () => {
      active = false;
    };
  }, [token]);

  useEffect(() => {
    if (!activeProductSeriesId) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      document.getElementById('product-editor-anchor')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [activeProductSeriesId, editingProductId]);

  const productsBySeries = useMemo(
    () =>
      products.reduce<Record<string, AdminProduct[]>>((groups, product) => {
        if (!product.seriesId) {
          return groups;
        }

        if (!groups[product.seriesId]) {
          groups[product.seriesId] = [];
        }

        groups[product.seriesId].push(product);
        return groups;
      }, {}),
    [products],
  );

  const summary = useMemo(
    () => ({
      seriesTotal: seriesList.length,
      total: products.length,
      active: products.filter((product) => product.isActive).length,
      lowStock: products.filter((product) => product.stock <= 10).length,
    }),
    [products, seriesList],
  );

  const gallery = useMemo(() => toLineList(galleryInput).slice(0, 3), [galleryInput]);
  const highlights = useMemo(() => toLineList(highlightsInput), [highlightsInput]);
  const specs = useMemo(() => parseSpecs(specsInput), [specsInput]);

  const activeSeries = useMemo(
    () => seriesList.find((series) => series.id === activeProductSeriesId) || null,
    [activeProductSeriesId, seriesList],
  );
  const activeSeriesProducts = activeProductSeriesId ? productsBySeries[activeProductSeriesId] || [] : [];
  const previewImage = form.image.trim() || gallery[0] || '/images/catalog-geek-bar-pulse-x-pear-of-thieves.png';
  const detailGallery = Array.from(
    { length: 3 },
    (_, index) => (gallery.length > 0 ? gallery[index] || gallery[0] : previewImage) || previewImage,
  );
  const cardTitle = form.shortName.trim() || form.name.trim() || '商品卡片标题';
  const detailTitle = form.name.trim() || '商品详情标题';
  const flavor = form.flavor.trim() || '风味副标题';
  const seriesEyebrow = (seriesForm.eyebrow || activeSeries?.eyebrow || DEFAULT_SERIES_EYEBROW).trim();
  const seriesTitle = (seriesForm.title || activeSeries?.title || DEFAULT_SERIES_TITLE).trim();
  const seriesDescription = (seriesForm.description || activeSeries?.description || DEFAULT_SERIES_DESCRIPTION).trim();
  const seriesBadgeCount = `${Math.max(activeSeriesProducts.length, 1)} SKU${activeSeriesProducts.length === 1 ? '' : 's'}`;

  function resetProductForm() {
    setEditingProductId(null);
    setForm(emptyProductForm);
    setGalleryInput('');
    setHighlightsInput('');
    setSpecsInput('');
  }

  function openSeries(series: AdminProductSeries) {
    const isSameSeries = expandedSeriesId === series.id;
    if (isSameSeries) {
      setExpandedSeriesId(null);
      setActiveProductSeriesId(null);
      resetProductForm();
      return;
    }

    setExpandedSeriesId(series.id);
    setSeriesForm(toSeriesForm(series));
    setActiveProductSeriesId(null);
    resetProductForm();
  }

  function startCreateProduct(series: AdminProductSeries) {
    setExpandedSeriesId(series.id);
    setSeriesForm(toSeriesForm(series));
    setActiveProductSeriesId(series.id);
    setForm({
      ...emptyProductForm,
      seriesId: series.id,
      sortOrder: (productsBySeries[series.id] || []).length,
    });
    setGalleryInput('');
    setHighlightsInput('');
    setSpecsInput('');
    setEditingProductId(null);
    setError('');
  }

  function editProduct(product: AdminProduct) {
    const targetSeries = seriesList.find((series) => series.id === product.seriesId);
    if (targetSeries) {
      setExpandedSeriesId(targetSeries.id);
      setSeriesForm(toSeriesForm(targetSeries));
      setActiveProductSeriesId(targetSeries.id);
    }

    setEditingProductId(product.id);
    setForm({
      name: product.name,
      shortName: product.shortName,
      flavor: product.flavor,
      description: product.description,
      shortDescription: product.shortDescription,
      badge: product.badge,
      price: product.price,
      comparePrice: product.comparePrice,
      category: product.category,
      brand: product.brand,
      seriesId: product.seriesId,
      image: product.image,
      gallery: product.gallery,
      highlights: product.highlights,
      specs: product.specs,
      stock: product.stock,
      sku: product.sku,
      weight: product.weight,
      sortOrder: product.sortOrder,
      tags: FIXED_FRONTEND_TAGS,
      isActive: product.isActive,
      isFeatured: product.isFeatured,
    });
    setGalleryInput(product.gallery.join('\n'));
    setHighlightsInput(product.highlights.join('\n'));
    setSpecsInput(product.specs.map((item) => `${item.label}: ${item.value}`).join('\n'));
  }

  function cancelProductEditor() {
    setActiveProductSeriesId(null);
    resetProductForm();
    setError('');
  }

  async function refreshData(nextExpandedSeriesId?: string | null) {
    if (!token) return;
    const [nextSeries, nextProducts] = await Promise.all([
      fetchAdminProductSeries(token),
      fetchAdminProducts(token),
    ]);

    setSeriesList(nextSeries);
    setProducts(nextProducts);

    const resolvedExpandedSeriesId = nextExpandedSeriesId === undefined ? expandedSeriesId : nextExpandedSeriesId;
    if (!resolvedExpandedSeriesId) {
      return;
    }

    const currentSeries = nextSeries.find((series) => series.id === resolvedExpandedSeriesId);
    if (!currentSeries) {
      setExpandedSeriesId(null);
      setActiveProductSeriesId(null);
      resetProductForm();
      return;
    }

    setExpandedSeriesId(resolvedExpandedSeriesId);
    setSeriesForm(toSeriesForm(currentSeries));
  }

  async function handleCreateSeries(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) return;

    const payload: AdminProductSeriesPayload = {
      eyebrow: newSeriesForm.eyebrow.trim() || DEFAULT_SERIES_EYEBROW,
      title: newSeriesForm.title.trim(),
      description: newSeriesForm.description.trim(),
      sortOrder: Number(newSeriesForm.sortOrder || 0),
      isActive: newSeriesForm.isActive,
    };

    if (!payload.title) {
      setError('系列标题不能为空。');
      return;
    }

    try {
      setIsCreatingSeries(true);
      setError('');
      const createdSeries = await createAdminProductSeries(token, payload);
      setNewSeriesForm(emptySeriesForm);
      await refreshData(createdSeries.id);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : '无法创建系列。');
    } finally {
      setIsCreatingSeries(false);
    }
  }

  async function handleUpdateSeries(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token || !expandedSeriesId) return;

    const payload: AdminProductSeriesPayload = {
      eyebrow: seriesForm.eyebrow.trim() || DEFAULT_SERIES_EYEBROW,
      title: seriesForm.title.trim(),
      description: seriesForm.description.trim(),
      sortOrder: Number(seriesForm.sortOrder || 0),
      isActive: seriesForm.isActive,
    };

    if (!payload.title) {
      setError('系列标题不能为空。');
      return;
    }

    try {
      setIsSavingSeries(true);
      setError('');
      await updateAdminProductSeries(token, expandedSeriesId, payload);
      await refreshData(expandedSeriesId);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : '无法保存系列设置。');
    } finally {
      setIsSavingSeries(false);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token || !activeProductSeriesId) return;

    const payload: AdminProductPayload = {
      ...form,
      name: form.name.trim(),
      shortName: form.shortName.trim(),
      flavor: form.flavor.trim(),
      description: form.description.trim(),
      shortDescription: form.shortDescription.trim(),
      badge: form.badge.trim(),
      category: 'disposable',
      brand: form.brand.trim(),
      seriesId: activeProductSeriesId,
      image: form.image.trim(),
      gallery,
      highlights,
      specs,
      stock: Number(form.stock || 0),
      sku: form.sku.trim(),
      weight: Number(form.weight || 0),
      sortOrder: Number(form.sortOrder || 0),
      tags: FIXED_FRONTEND_TAGS,
      price: Number(form.price || 0),
      comparePrice: Number(form.comparePrice || 0),
      isActive: true,
      isFeatured: false,
    };

    if (!payload.name || !payload.shortDescription || !payload.description) {
      setError('商品名称、简短描述和详细描述不能为空。');
      return;
    }

    try {
      setIsSavingProduct(true);
      setError('');
      if (editingProductId) {
        await updateAdminProduct(token, editingProductId, payload);
      } else {
        await createAdminProduct(token, payload);
      }
      await refreshData(activeProductSeriesId);
      cancelProductEditor();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : '无法保存商品。');
    } finally {
      setIsSavingProduct(false);
    }
  }

  async function handleDeleteSeries(series: AdminProductSeries) {
    if (!token) return;

    const confirmed = window.confirm(`删除系列“${series.title}”后，该系列下的所有商品也会一起删除。确定继续吗？`);
    if (!confirmed) {
      return;
    }

    try {
      setDeletingSeriesId(series.id);
      setError('');
      await deleteAdminProductSeries(token, series.id);

      if (expandedSeriesId === series.id || activeProductSeriesId === series.id) {
        setExpandedSeriesId(null);
        setActiveProductSeriesId(null);
        resetProductForm();
      }

      await refreshData(null);
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : '无法删除系列。');
    } finally {
      setDeletingSeriesId(null);
    }
  }

  async function handleDeleteProduct(product: AdminProduct) {
    if (!token) return;

    const confirmed = window.confirm(`确定删除商品“${product.shortName || product.name}”吗？删除后将无法继续编辑。`);
    if (!confirmed) {
      return;
    }

    try {
      setDeletingProductId(product.id);
      setError('');
      await deleteAdminProduct(token, product.id);

      if (editingProductId === product.id) {
        cancelProductEditor();
      }

      await refreshData(product.seriesId);
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : '无法删除商品。');
    } finally {
      setDeletingProductId(null);
    }
  }

  async function handleBootstrapCatalog() {
    if (!token) return;

    try {
      setIsBootstrappingCatalog(true);
      setError('');
      await bootstrapAdminCatalog(token);
      await refreshData(expandedSeriesId ?? null);
    } catch (bootstrapError) {
      setError(bootstrapError instanceof Error ? bootstrapError.message : '无法导入前台默认商品。');
    } finally {
      setIsBootstrappingCatalog(false);
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[1.9rem] border border-white/10 bg-white/[0.03] px-5 py-6 sm:px-6 sm:py-7">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-neutral-500">商品管理</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">系列容器下的商品编辑器</h2>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
          <p className="max-w-4xl text-sm leading-7 text-neutral-400">先创建产品系列，再把商品加到对应系列下面。商品编辑继续沿用现在这套前台 1:1 预览结构，保存后自动收起商品编辑器。</p>
          <Button type="button" variant="secondary" onClick={handleBootstrapCatalog} disabled={isBootstrappingCatalog}>
            {isBootstrappingCatalog ? '导入中...' : '导入前台默认商品'}
          </Button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard label="当前系列数" value={String(summary.seriesTotal)} />
        <SummaryCard label="当前商品数" value={String(summary.total)} />
        <SummaryCard label="已上架商品" value={String(summary.active)} />
        <SummaryCard label="低库存商品" value={String(summary.lowStock)} />
      </section>

      {error ? <div className="rounded-[1rem] border border-red-500/30 bg-red-950/20 px-4 py-3 text-sm text-red-300">{error}</div> : null}

      <section className="space-y-5">
        <SectionBlock eyebrow="第一步" title="先创建产品系列">
          <form className="grid gap-4 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]" onSubmit={handleCreateSeries}>
            <div className="space-y-4 rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5">
              <Field label="系列眉文">
                <input value={newSeriesForm.eyebrow} onChange={(event) => setNewSeriesForm((current) => ({ ...current, eyebrow: event.target.value }))} className="h-11 rounded-[1rem] border border-white/10 bg-black px-4 text-sm text-white outline-none" />
              </Field>
              <Field label="系列标题">
                <input value={newSeriesForm.title} onChange={(event) => setNewSeriesForm((current) => ({ ...current, title: event.target.value }))} className="h-11 rounded-[1rem] border border-white/10 bg-black px-4 text-sm text-white outline-none" />
              </Field>
              <Field label="系列说明">
                <textarea value={newSeriesForm.description} onChange={(event) => setNewSeriesForm((current) => ({ ...current, description: event.target.value }))} rows={4} className="rounded-[1rem] border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none" />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="系列排序">
                  <input type="number" min="0" value={newSeriesForm.sortOrder} onChange={(event) => setNewSeriesForm((current) => ({ ...current, sortOrder: Number(event.target.value) }))} className="h-11 rounded-[1rem] border border-white/10 bg-black px-4 text-sm text-white outline-none" />
                </Field>
                <div className="flex items-end">
                  <ToggleCard title="系列上架" description="控制整个系列是否可用于前台分组展示。" checked={newSeriesForm.isActive} onChange={(checked) => setNewSeriesForm((current) => ({ ...current, isActive: checked }))} />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isCreatingSeries}>{isCreatingSeries ? '创建系列中...' : '创建系列'}</Button>
            </div>

            <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.03]">
              <div className="border-b border-white/10 px-4 py-4"><p className="text-xs uppercase tracking-[0.18em] text-neutral-500">系列预览</p></div>
              <div className="p-4">
                <FrontendCatalogSeriesPreview eyebrow={newSeriesForm.eyebrow.trim() || DEFAULT_SERIES_EYEBROW} title={newSeriesForm.title.trim() || DEFAULT_SERIES_TITLE} description={newSeriesForm.description.trim() || DEFAULT_SERIES_DESCRIPTION} skuCountLabel="0 SKUs" />
              </div>
            </div>
          </form>
        </SectionBlock>

        <SectionBlock eyebrow="第二步" title="展开系列后添加商品">
          {isLoading ? (
            <PanelHint>正在加载系列与商品数据...</PanelHint>
          ) : seriesList.length === 0 ? (
            <PanelHint>先创建一个产品系列，创建完成后就在该系列下面添加商品。</PanelHint>
          ) : (
            <div className="space-y-5">
              {seriesList.map((series) => {
                const seriesProducts = productsBySeries[series.id] || [];
                const isExpanded = expandedSeriesId === series.id;

                return (
                  <section key={series.id} className={`overflow-hidden rounded-[1.8rem] border transition ${isExpanded ? 'border-emerald-400/20 bg-emerald-500/[0.04]' : 'border-white/10 bg-white/[0.03]'}`}>
                    <div className="flex flex-col gap-4 px-5 py-5 sm:px-6">
                      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                        <div className="space-y-3">
                          <p className="text-xs uppercase tracking-[0.22em] text-neutral-500">{series.eyebrow}</p>
                          <div>
                            <h3 className="text-3xl font-semibold text-white">{series.title}</h3>
                            <p className="mt-3 max-w-4xl text-sm leading-7 text-neutral-400">{series.description || '当前系列还没有说明文案。'}</p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <Pill>{`${seriesProducts.length} SKU${seriesProducts.length === 1 ? '' : 's'}`}</Pill>
                            <Pill>{series.isActive ? '系列上架中' : '系列已隐藏'}</Pill>
                            <Pill>{`排序 ${series.sortOrder}`}</Pill>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-3">
                          <Button type="button" variant="secondary" onClick={() => startCreateProduct(series)}>添加商品</Button>
                          <Button type="button" variant="secondary" onClick={() => handleDeleteSeries(series)} disabled={deletingSeriesId === series.id}>
                            {deletingSeriesId === series.id ? '删除系列中...' : '删除系列'}
                          </Button>
                          <Button type="button" variant="secondary" onClick={() => openSeries(series)}>{isExpanded ? '收起系列' : '展开系列'}</Button>
                        </div>
                      </div>

                      {!isExpanded ? null : (
                        <div className="space-y-4 border-t border-white/10 pt-5">
                          <form className="grid gap-4 xl:grid-cols-[minmax(0,0.82fr),minmax(360px,1fr)] xl:items-start" onSubmit={handleUpdateSeries}>
                            <div className="grid min-w-0 gap-4 rounded-[1.35rem] border border-white/10 bg-black/30 p-4">
                              <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">系列设置</p>
                              <Field label="系列眉文">
                                <input value={seriesForm.eyebrow} onChange={(event) => setSeriesForm((current) => ({ ...current, eyebrow: event.target.value }))} className="h-11 w-full min-w-0 max-w-full rounded-[1rem] border border-white/10 bg-black px-4 text-sm text-white outline-none" />
                              </Field>
                              <Field label="系列标题">
                                <input value={seriesForm.title} onChange={(event) => setSeriesForm((current) => ({ ...current, title: event.target.value }))} className="h-11 w-full min-w-0 max-w-full rounded-[1rem] border border-white/10 bg-black px-4 text-sm text-white outline-none" />
                              </Field>
                              <Field label="系列说明">
                                <textarea value={seriesForm.description} onChange={(event) => setSeriesForm((current) => ({ ...current, description: event.target.value }))} rows={3} className="w-full min-w-0 max-w-full resize-none overflow-hidden rounded-[1rem] border border-white/10 bg-black px-4 py-3 text-sm leading-7 text-white outline-none" />
                              </Field>
                            </div>

                            <div className="grid min-w-0 gap-4">
                              <div className="min-w-0 self-start overflow-hidden rounded-[1.35rem] border border-white/10 bg-white/[0.03] xl:max-w-[680px]">
                                <div className="border-b border-white/10 px-4 py-3"><p className="text-xs uppercase tracking-[0.18em] text-neutral-500">前台系列预览</p></div>
                                <div className="p-4">
                                  <FrontendCatalogSeriesPreview eyebrow={seriesForm.eyebrow.trim() || DEFAULT_SERIES_EYEBROW} title={seriesForm.title.trim() || DEFAULT_SERIES_TITLE} description={seriesForm.description.trim() || DEFAULT_SERIES_DESCRIPTION} skuCountLabel={`${seriesProducts.length} SKU${seriesProducts.length === 1 ? '' : 's'}`} compact />
                                </div>
                              </div>

                              <div className="grid gap-4 rounded-[1.35rem] border border-white/10 bg-black/30 p-4 lg:grid-cols-[140px,170px,minmax(220px,1fr)] lg:items-end">
                                <Field label="系列排序">
                                  <input type="number" min="0" value={seriesForm.sortOrder} onChange={(event) => setSeriesForm((current) => ({ ...current, sortOrder: Number(event.target.value) }))} className="h-11 w-full min-w-0 max-w-full rounded-[1rem] border border-white/10 bg-black px-4 text-sm text-white outline-none" />
                                </Field>
                                <InlineSwitchField label="系列上架" checked={seriesForm.isActive} onChange={(checked) => setSeriesForm((current) => ({ ...current, isActive: checked }))} />
                                <Button type="submit" className="w-full lg:h-11" disabled={isSavingSeries}>{isSavingSeries ? '保存系列中...' : '保存系列设置'}</Button>
                              </div>
                            </div>
                          </form>
                        </div>
                      )}

                      <div className={`${isExpanded ? '' : 'border-t border-white/10 pt-5'}`}>
                        {seriesProducts.length === 0 ? (
                          <PanelHint>这个系列下面还没有商品，先点右上角“添加商品”。</PanelHint>
                        ) : (
                          <div className="grid gap-4">
                            {seriesProducts.map((product) => (
                              <div key={product.id} className={`overflow-hidden rounded-[1.5rem] border text-left transition ${editingProductId === product.id ? 'border-emerald-400/25 bg-emerald-500/[0.08]' : 'border-white/10 bg-white/[0.03] hover:border-white/20'}`}>
                                <div className="grid gap-4 p-4 sm:grid-cols-[210px,1fr]">
                                  <div className="relative overflow-hidden rounded-[1.15rem] border border-white/10 bg-black">
                                    <img src={product.image || '/images/catalog-geek-bar-pulse-x-pear-of-thieves.png'} alt={product.name} className="h-44 w-full object-cover object-center" />
                                    <div className="absolute left-3 top-3"><Pill>{product.badge || 'Badge'}</Pill></div>
                                  </div>
                                  <div className="flex flex-col justify-between">
                                    <div>
                                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                        <div>
                                          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">卡片信息</p>
                                          <h3 className="mt-2 text-2xl font-semibold text-white">{product.shortName || product.name}</h3>
                                          <p className="mt-2 text-lg text-white/90">{product.flavor || '未设置风味'}</p>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                          <Button type="button" variant="secondary" className="px-4 py-2 text-xs" onClick={() => editProduct(product)}>编辑商品</Button>
                                          <Button type="button" variant="secondary" className="px-4 py-2 text-xs" onClick={() => handleDeleteProduct(product)} disabled={deletingProductId === product.id}>
                                            {deletingProductId === product.id ? '删除中...' : '删除商品'}
                                          </Button>
                                        </div>
                                      </div>
                                      <p className="mt-3 line-clamp-2 text-sm leading-7 text-neutral-400">{product.shortDescription || product.description}</p>
                                    </div>
                                    <div className="mt-4 grid gap-3 sm:grid-cols-4">
                                      <MiniStat label="价格" value={`$${product.price.toFixed(2)}`} />
                                      <MiniStat label="库存" value={String(product.stock)} />
                                      <MiniStat label="分类" value={formatCategory(product.category)} />
                                      <MiniStat label="排序" value={String(product.sortOrder)} />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </section>
                );
              })}
            </div>
          )}
        </SectionBlock>

        {activeProductSeriesId ? (
          <>
            <div id="product-editor-anchor">
              <SectionBlock eyebrow="商品编辑器" title={editingProductId ? '编辑当前商品' : '新增系列商品'}>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <p className="max-w-3xl text-sm leading-7 text-neutral-400">商品保存成功后，这块编辑器会自动收起；系列容器本身保持展开，方便你继续加下一个商品。</p>
                  <Button type="button" variant="secondary" onClick={cancelProductEditor}>收起编辑器</Button>
                </div>
              </SectionBlock>
            </div>

            <SectionBlock eyebrow="系列头部" title="当前商品所属系列预览">
              <FrontendCatalogSeriesPreview eyebrow={seriesEyebrow || DEFAULT_SERIES_EYEBROW} title={seriesTitle || DEFAULT_SERIES_TITLE} description={seriesDescription || DEFAULT_SERIES_DESCRIPTION} skuCountLabel={seriesBadgeCount} />
            </SectionBlock>

            <SectionBlock eyebrow="前台预览" title="你现在改的内容会显示在这里">
              <div className="space-y-4">
                <div className="grid gap-4 xl:grid-cols-[380px,minmax(0,780px)] xl:items-stretch xl:justify-start">
                  <div className="flex h-full flex-col rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5 xl:max-w-[380px]">
                    <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">前台列表页</p>
                    <h4 className="mt-2 text-2xl font-semibold text-white">卡片设置</h4>
                    <div className="mt-5 flex flex-1 flex-col justify-between gap-4">
                      <Field label="商品卡片标题">
                        <input value={form.shortName} onChange={(event) => setForm((current) => ({ ...current, shortName: event.target.value }))} className="h-11 rounded-[1rem] border border-white/10 bg-black px-4 text-sm text-white outline-none" />
                      </Field>
                      <Field label="风味名称">
                        <input value={form.flavor} onChange={(event) => setForm((current) => ({ ...current, flavor: event.target.value }))} className="h-11 rounded-[1rem] border border-white/10 bg-black px-4 text-sm text-white outline-none" />
                      </Field>
                      <Field label="卡片徽章">
                        <input value={form.badge} onChange={(event) => setForm((current) => ({ ...current, badge: event.target.value }))} className="h-11 rounded-[1rem] border border-white/10 bg-black px-4 text-sm text-white outline-none" />
                      </Field>
                      <Field label="主卡图片">
                        <input value={form.image} onChange={(event) => setForm((current) => ({ ...current, image: event.target.value }))} className="h-11 rounded-[1rem] border border-white/10 bg-black px-4 text-sm text-white outline-none" />
                      </Field>
                      <Field label="卡片简短描述">
                        <textarea value={form.shortDescription} onChange={(event) => setForm((current) => ({ ...current, shortDescription: event.target.value }))} rows={4} className="rounded-[1rem] border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none" />
                      </Field>
                    </div>
                  </div>

                  <div className="flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.03] xl:max-w-[780px]">
                    <div className="border-b border-white/10 px-4 py-4"><p className="text-xs uppercase tracking-[0.18em] text-neutral-500">列表页卡片预览</p></div>
                    <div className="flex flex-1 items-center p-4">
                      <div className="w-full max-w-[680px]">
                        <FrontendCatalogCardPreview image={previewImage} badge={form.badge.trim() || 'Best Seller'} title={cardTitle} flavor={flavor} price={form.price} shortDescription={form.shortDescription.trim() || '这里显示列表页卡片的简短描述。'} compact />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.03]">
                  <div className="border-b border-white/10 px-4 py-4"><p className="text-xs uppercase tracking-[0.18em] text-neutral-500">详情页预览</p></div>
                  <div className="p-4">
                    <FrontendDetailPreview image={detailGallery[0]} gallery={detailGallery} eyebrow={flavor} title={detailTitle} description={form.description.trim() || '这里显示前台详情页的商品介绍。'} flavor={flavor} price={form.price} stock={form.stock} />
                  </div>
                </div>
              </div>
            </SectionBlock>
          </>
        ) : null}

        {activeProductSeriesId ? (
        <form className="space-y-5" onSubmit={handleSubmit}>
          <SectionBlock eyebrow="前台详情页" title="详情文本与图集">
            <div className="grid gap-4 xl:grid-cols-[minmax(0,1.05fr),minmax(320px,0.95fr)]">
              <div className="space-y-4">
                <div className="grid gap-3">
                  <Field label="详情图 1（默认大图）">
                    <input value={gallery[0] || ''} onChange={(event) => setGalleryInput(updateGalleryLine(galleryInput, 0, event.target.value))} className="h-11 rounded-[1rem] border border-white/10 bg-black px-4 text-sm text-white outline-none" />
                  </Field>
                  <Field label="详情图 2">
                    <input value={gallery[1] || ''} onChange={(event) => setGalleryInput(updateGalleryLine(galleryInput, 1, event.target.value))} className="h-11 rounded-[1rem] border border-white/10 bg-black px-4 text-sm text-white outline-none" />
                  </Field>
                  <Field label="详情图 3">
                    <input value={gallery[2] || ''} onChange={(event) => setGalleryInput(updateGalleryLine(galleryInput, 2, event.target.value))} className="h-11 rounded-[1rem] border border-white/10 bg-black px-4 text-sm text-white outline-none" />
                  </Field>
                </div>
              </div>
              <div className="space-y-4">
                <Field label="详情页完整标题">
                  <input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} className="h-11 rounded-[1rem] border border-white/10 bg-black px-4 text-sm text-white outline-none" />
                </Field>
                <Field label="详情页口味名称">
                  <input value={form.flavor} onChange={(event) => setForm((current) => ({ ...current, flavor: event.target.value }))} className="h-11 rounded-[1rem] border border-white/10 bg-black px-4 text-sm text-white outline-none" />
                </Field>
                <Field label="详情页长描述">
                  <textarea value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} rows={5} className="rounded-[1rem] border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none" />
                </Field>
              </div>
            </div>
          </SectionBlock>

          <SectionBlock eyebrow="销售层" title="价格与库存">
            <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr),minmax(320px,0.9fr)]">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="价格"><input type="number" min="0" step="0.01" value={form.price} onChange={(event) => setForm((current) => ({ ...current, price: Number(event.target.value) }))} className="h-11 rounded-[1rem] border border-white/10 bg-black px-4 text-sm text-white outline-none" /></Field>
                <Field label="库存"><input type="number" min="0" value={form.stock} onChange={(event) => setForm((current) => ({ ...current, stock: Number(event.target.value) }))} className="h-11 rounded-[1rem] border border-white/10 bg-black px-4 text-sm text-white outline-none" /></Field>
                <Field label="SKU"><input value={form.sku} onChange={(event) => setForm((current) => ({ ...current, sku: event.target.value }))} className="h-11 rounded-[1rem] border border-white/10 bg-black px-4 text-sm text-white outline-none" /></Field>
                <Field label="商品分类"><input value="一次性" readOnly className="h-11 rounded-[1rem] border border-white/10 bg-black px-4 text-sm text-white outline-none" /></Field>
              </div>
              <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr),220px] sm:items-end">
                <Field label="系列内排序"><input type="number" min="0" value={form.sortOrder} onChange={(event) => setForm((current) => ({ ...current, sortOrder: Number(event.target.value) }))} className="h-11 rounded-[1rem] border border-white/10 bg-black px-4 text-sm text-white outline-none" /></Field>
                <Button type="submit" className="w-full" disabled={isSavingProduct}>{isSavingProduct ? '保存商品中...' : editingProductId ? '保存商品修改' : '创建当前商品'}</Button>
              </div>
            </div>
          </SectionBlock>
        </form>
        ) : null}
      </section>
    </div>
  );
}

function FrontendCatalogCardPreview({
  image,
  badge,
  title,
  flavor,
  price,
  shortDescription,
  compact = false,
}: {
  image: string;
  badge: string;
  title: string;
  flavor: string;
  price: number;
  shortDescription: string;
  compact?: boolean;
}) {
  return (
    <article
      style={{
        width: '100%',
        maxWidth: compact ? 560 : 620,
        position: 'relative',
        overflow: 'hidden',
        borderRadius: compact ? 28 : 32,
        border: '1px solid rgba(255,255,255,0.08)',
        background:
          'linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.018) 42%, rgba(255,255,255,0.02) 100%), #101010',
        display: 'flex',
        flexDirection: 'column',
        minHeight: compact ? 620 : 700,
        boxShadow: '0 20px 56px rgba(0,0,0,0.24)',
      }}
    >
      <div style={{ position: 'relative', padding: compact ? 16 : 20, paddingBottom: 0 }}>
        <div
          style={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: compact ? 22 : 26,
            background:
              'radial-gradient(circle at top, rgba(255,255,255,0.1), transparent 28%), linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01)), #0d0d0d',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 10,
              borderRadius: 20,
              border: '1px solid rgba(255,255,255,0.05)',
              pointerEvents: 'none',
              zIndex: 1,
            }}
          />
          <img
            src={image}
            alt={title}
            style={{
              width: '100%',
              height: compact ? 344 : 400,
              objectFit: 'cover',
              objectPosition: 'center',
              display: 'block',
              filter: 'saturate(0.9) contrast(1.04)',
              transform: 'scale(1.01)',
            }}
          />
          <div style={{ position: 'absolute', top: compact ? 14 : 18, right: compact ? 14 : 18, zIndex: 2 }}>
            <PreviewSmallBadge text={badge} />
          </div>
          <div
            style={{
              position: 'absolute',
              right: compact ? 14 : 18,
              bottom: compact ? 14 : 18,
              padding: compact ? '8px 12px' : '10px 14px',
              borderRadius: compact ? 16 : 18,
              background: 'rgba(0,0,0,0.38)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#fff',
              fontSize: compact ? 11 : 12,
              letterSpacing: 0.3,
              zIndex: 2,
            }}
          >
            {flavor}
          </div>
        </div>
      </div>

      <div style={{ padding: compact ? 20 : 26, display: 'flex', flexDirection: 'column', gap: compact ? 12 : 14, flex: 1 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: 16,
            paddingBottom: compact ? 14 : 16,
            borderBottom: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          <div>
            <p
              style={{
                margin: 0,
                marginBottom: compact ? 10 : 12,
                color: '#8d8d8d',
                fontSize: compact ? 11 : 12,
                letterSpacing: 1.7,
                textTransform: 'uppercase',
              }}
            >
              {FIXED_CARD_EYEBROW}
            </p>
            <h2 style={{ margin: 0, fontSize: compact ? 20 : 24, lineHeight: 1.04, letterSpacing: -0.6 }}>{title}</h2>
            <p style={{ margin: 0, marginTop: 6, color: '#f3f3f3', fontSize: compact ? 16 : 18, lineHeight: 1.15, fontWeight: 500 }}>
              {flavor}
            </p>
          </div>
          <div
            style={{
              padding: compact ? '8px 12px' : '10px 14px',
              borderRadius: compact ? 16 : 18,
              border: '1px solid rgba(255,255,255,0.06)',
              background: 'rgba(255,255,255,0.02)',
              minWidth: compact ? 88 : 100,
              textAlign: 'right',
            }}
          >
            <p style={{ margin: 0, marginBottom: 6, color: '#8f8f8f', fontSize: compact ? 10 : 11, letterSpacing: 0.4, textTransform: 'uppercase' }}>
              Price
            </p>
            <div style={{ fontSize: compact ? 18 : 21, lineHeight: 1, fontWeight: 800, whiteSpace: 'nowrap' }}>${price.toFixed(2)}</div>
          </div>
        </div>

        <p style={{ margin: 0, color: '#a1a1a1', fontSize: compact ? 12 : 13, lineHeight: 1.75, maxWidth: compact ? 410 : 460 }}>{shortDescription}</p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', opacity: 0.92 }}>
          {FIXED_FRONTEND_TAGS.map((tag) => (
            <PreviewSmallBadge key={tag} text={tag} />
          ))}
        </div>
        <div
          style={{
            marginTop: 'auto',
            paddingTop: compact ? 12 : 14,
            borderTop: '1px solid rgba(255,255,255,0.07)',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 10,
            opacity: 0.82,
          }}
        >
          <button type="button" style={previewSecondaryActionStyle}>
            Review Product
          </button>
          <button type="button" style={previewSecondaryActionStyle}>
            Add to Order
          </button>
        </div>
      </div>
    </article>
  );
}

function FrontendCatalogSeriesPreview({
  eyebrow,
  title,
  description,
  skuCountLabel,
  compact = false,
}: {
  eyebrow: string;
  title: string;
  description: string;
  skuCountLabel: string;
  compact?: boolean;
}) {
  return (
    <div
      style={{
        width: '100%',
        minWidth: 0,
        borderRadius: compact ? 24 : 28,
        border: '1px solid rgba(255,255,255,0.08)',
        background:
          'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.015)), #111111',
        padding: compact ? '16px 18px' : '18px 24px',
        boxShadow: '0 16px 44px rgba(0,0,0,0.18)',
      }}
    >
      <div
        style={{
          display: 'grid',
          gap: 10,
          minWidth: 0,
        }}
      >
        <p
          style={{
            margin: 0,
            color: '#8b8b8b',
            fontSize: 12,
            letterSpacing: 1.8,
            textTransform: 'uppercase',
          }}
        >
          {eyebrow}
        </p>

        <h2 style={{ margin: 0, minWidth: 0, fontSize: compact ? 22 : 32, lineHeight: compact ? 1.08 : 1.05, overflowWrap: 'anywhere' }}>
          <span style={{ fontSize: compact ? 22 : 32, lineHeight: compact ? 1.08 : 1.05, overflowWrap: 'anywhere' }}>{title}</span>
        </h2>

        <p
          style={{
            margin: 0,
            maxWidth: compact ? 560 : 640,
            color: '#b1b1b1',
            fontSize: compact ? 14 : 16,
            lineHeight: compact ? 1.6 : 1.65,
          }}
        >
          {description}
        </p>
      </div>

      <div
        style={{
          display: 'flex',
          gap: 8,
          flexWrap: 'wrap',
          marginTop: compact ? 14 : 16,
        }}
      >
        <PreviewSmallBadge text={eyebrow} />
        <PreviewSmallBadge text={skuCountLabel} />
        <PreviewSmallBadge text="Shelf-ready" />
      </div>
    </div>
  );
}

function FrontendDetailPreview({
  image,
  gallery,
  eyebrow,
  title,
  description,
  flavor,
  price,
  stock,
}: {
  image: string;
  gallery: string[];
  eyebrow: string;
  title: string;
  description: string;
  flavor: string;
  price: number;
  stock: number;
}) {
  return (
    <div style={{ display: 'grid', gap: 24 }}>
      <div
        style={{
          display: 'grid',
          gap: 24,
          gridTemplateColumns: 'minmax(420px, 1.02fr) minmax(420px, 0.98fr)',
          alignItems: 'start',
        }}
      >
        <div>
          <div
            style={{
              position: 'relative',
              overflow: 'hidden',
              borderRadius: 28,
              border: '1px solid rgba(255,255,255,0.08)',
              background:
                'radial-gradient(circle at top, rgba(255,255,255,0.1), transparent 28%), linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01)), #0d0d0d',
              padding: 22,
            }}
          >
            <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 24 }}>
              <img
                src={image}
                alt={title}
                style={{ width: '100%', height: 560, objectFit: 'cover', objectPosition: 'center', display: 'block' }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: 18,
                  bottom: 96,
                  padding: '14px 18px',
                  borderRadius: 20,
                  background: 'rgba(0,0,0,0.4)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: '#fff',
                  minWidth: 410,
                }}
              >
                <p style={{ margin: 0, color: '#b5b5b5', fontSize: 12, letterSpacing: 2, textTransform: 'uppercase' }}>
                  Product Presentation
                </p>
                <div style={{ marginTop: 10, fontSize: 20, fontWeight: 700 }}>{title}</div>
              </div>
              <div
                style={{
                  position: 'absolute',
                  left: 18,
                  bottom: 22,
                  padding: '14px 18px',
                  borderRadius: 18,
                  background: 'rgba(0,0,0,0.4)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: '#fff',
                  minWidth: 190,
                }}
              >
                <p style={{ margin: 0, color: '#b5b5b5', fontSize: 12, letterSpacing: 2, textTransform: 'uppercase' }}>
                  Product Type
                </p>
                <div style={{ marginTop: 10, fontSize: 16, fontWeight: 600 }}>Disposable Vape</div>
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: 18,
              display: 'grid',
              gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
              gap: 14,
            }}
          >
            {gallery.map((thumb, index) => (
              <div
                key={`${thumb}-${index}`}
                style={{
                  overflow: 'hidden',
                  borderRadius: 18,
                  border: index === 0 ? '2px solid rgba(255,255,255,0.22)' : '1px solid rgba(255,255,255,0.08)',
                  background: '#0d0d0d',
                  boxShadow: index === 0 ? '0 0 0 1px rgba(255,255,255,0.06) inset' : 'none',
                }}
              >
                <img
                  src={thumb}
                  alt={`Gallery ${index + 1}`}
                  style={{ width: '100%', height: 112, objectFit: 'cover', objectPosition: 'center', display: 'block' }}
                />
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.015)), #101010',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 34,
            padding: 30,
            boxShadow: '0 24px 80px rgba(0,0,0,0.36)',
          }}
        >
          <p
            style={{
              margin: 0,
              color: '#8d8d8d',
              letterSpacing: 2,
              fontSize: 12,
              marginBottom: 16,
              textTransform: 'uppercase',
            }}
          >
            {eyebrow}
          </p>
          <h2 style={{ fontSize: 52, lineHeight: 1.02, letterSpacing: -1.2, margin: 0, marginBottom: 16 }}>{title}</h2>
          <p style={{ color: '#a5a5a5', fontSize: 16, lineHeight: 1.9, marginTop: 0, marginBottom: 24 }}>{description}</p>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
            <PreviewSmallBadge text="Wholesale supply" />
            <PreviewSmallBadge text="U.S. retail ready" />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16, marginBottom: 24 }}>
            <div>
              <p style={{ margin: 0, color: '#7f7f7f', fontSize: 13, marginBottom: 8 }}>Wholesale Price</p>
              <div style={{ fontSize: 42, fontWeight: 800, lineHeight: 1 }}>${price.toFixed(2)}</div>
            </div>
            <div
              style={{
                padding: '12px 16px',
                borderRadius: 18,
                background: '#0c0c0c',
                border: '1px solid rgba(255,255,255,0.08)',
                color: '#d0d0d0',
                fontSize: 13,
                lineHeight: 1.55,
              }}
            >
              Volume pricing and MOQ are available for trade accounts.
            </div>
          </div>

          <div
            style={{
              padding: 22,
              background: 'rgba(255,255,255,0.025)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 22,
              marginBottom: 20,
            }}
          >
            <div
              style={{
                display: 'flex',
                gap: 12,
                alignItems: 'flex-start',
                marginBottom: 16,
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'grid', gap: 8 }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 16,
                    overflow: 'hidden',
                    background: '#0f0f0f',
                    width: 'fit-content',
                  }}
                >
                  <button type="button" style={previewQtyButtonStyle}>
                    -
                  </button>
                  <div style={{ minWidth: 58, textAlign: 'center', fontWeight: 600 }}>1</div>
                  <button type="button" style={previewQtyButtonStyle}>
                    +
                  </button>
                </div>
                <div style={{ color: '#8d8d8d', fontSize: 13 }}>Select order quantity</div>
              </div>

              <div
                style={{
                  width: 196,
                  minWidth: 196,
                  padding: '0 16px',
                  borderRadius: 16,
                  border: '1px solid rgba(255,255,255,0.08)',
                  background: '#0f0f0f',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 10,
                  height: 46,
                }}
              >
                <p
                  style={{
                    margin: 0,
                    color: '#8d8d8d',
                    fontSize: 11,
                    letterSpacing: 1.4,
                    textTransform: 'uppercase',
                    whiteSpace: 'nowrap',
                  }}
                >
                  In stock
                </p>
                <div style={{ fontSize: 24, fontWeight: 700, lineHeight: 1, whiteSpace: 'nowrap', minWidth: '7ch', textAlign: 'right' }}>
                  {stock}
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 10 }}>
              <button type="button" style={previewPrimaryActionStyle}>
                Add to Order
              </button>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <button type="button" style={previewSecondaryActionStyle}>
                  Request Pricing
                </button>
                <button type="button" style={previewSecondaryActionStyle}>
                  Contact Account Manager
                </button>
              </div>
            </div>
          </div>

          <div
            style={{
              padding: 20,
              background: 'rgba(255,255,255,0.025)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 22,
            }}
          >
            <h3 style={{ marginTop: 0, marginBottom: 14, fontSize: 20 }}>Flavor Options</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              <PreviewSmallBadge text={flavor} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const previewQtyButtonStyle = {
  width: 44,
  height: 44,
  border: 'none',
  background: 'transparent',
  color: '#ffffff',
  fontSize: 18,
  cursor: 'default',
} satisfies import('react').CSSProperties;

const previewPrimaryActionStyle = {
  height: 56,
  borderRadius: 999,
  border: '1px solid rgba(255,255,255,0.08)',
  background: '#f5f5f5',
  color: '#111111',
  fontSize: 16,
  fontWeight: 500,
  cursor: 'default',
} satisfies import('react').CSSProperties;

const previewSecondaryActionStyle = {
  height: 48,
  borderRadius: 999,
  border: '1px solid rgba(255,255,255,0.1)',
  background: 'transparent',
  color: '#ffffff',
  fontSize: 15,
  cursor: 'default',
} satisfies import('react').CSSProperties;

function PreviewSmallBadge({ text }: { text: string }) {
  return <span style={{ display: 'inline-flex', alignItems: 'center', padding: '7px 11px', borderRadius: 999, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)', color: '#e7e7e7', fontSize: 11, letterSpacing: 0.3 }}>{text}</span>;
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.03] px-5 py-5"><p className="text-xs uppercase tracking-[0.22em] text-neutral-500">{label}</p><p className="mt-3 text-3xl font-semibold text-white">{value}</p></div>;
}

function SectionBlock({ eyebrow, title, children }: { eyebrow: string; title: string; children: ReactNode }) {
  return <section className="rounded-[1.8rem] border border-white/10 bg-black/40 p-5 sm:p-6"><p className="text-xs uppercase tracking-[0.18em] text-neutral-500">{eyebrow}</p><h3 className="mt-2 text-2xl font-semibold text-white">{title}</h3><div className="mt-5 space-y-4">{children}</div></section>;
}

function PanelHint({ children }: { children: string }) {
  return <div className="rounded-[1.3rem] border border-dashed border-white/10 bg-black/50 px-4 py-5 text-sm text-neutral-400">{children}</div>;
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="flex min-w-0 flex-col gap-2 text-xs uppercase tracking-[0.18em] text-neutral-500">{label}{children}</label>;
}

function Pill({ children }: { children: string }) {
  return <span className="inline-flex rounded-full border border-white/10 bg-black/55 px-3 py-1 text-xs text-neutral-200">{children}</span>;
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return <div className="rounded-[1rem] border border-white/10 bg-black/35 px-3 py-3"><p className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">{label}</p><p className="mt-2 truncate text-sm font-medium text-white">{value}</p></div>;
}

function ToggleCard({ title, description, checked, onChange }: { title: string; description: string; checked: boolean; onChange: (checked: boolean) => void; }) {
  return <button type="button" onClick={() => onChange(!checked)} className={`rounded-[1.2rem] border px-4 py-4 text-left transition ${checked ? 'border-emerald-400/20 bg-emerald-500/10' : 'border-white/10 bg-white/[0.02] hover:border-white/20'}`}><div className="flex items-center justify-between gap-4"><div><p className="text-sm font-medium text-white">{title}</p><p className="mt-2 text-sm leading-6 text-neutral-400">{description}</p></div><div className={`relative h-7 w-12 rounded-full transition ${checked ? 'bg-emerald-400/70' : 'bg-white/10'}`}><span className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${checked ? 'left-6' : 'left-1'}`} /></div></div></button>;
}

function InlineSwitchField({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void; }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`flex h-11 items-center justify-between rounded-[1rem] border px-4 transition ${checked ? 'border-emerald-400/20 bg-emerald-500/10' : 'border-white/10 bg-white/[0.02] hover:border-white/20'}`}
    >
      <span className="text-sm font-medium text-white">{label}</span>
      <span className={`relative h-6 w-11 rounded-full transition ${checked ? 'bg-emerald-400/70' : 'bg-white/10'}`}>
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${checked ? 'left-5' : 'left-0.5'}`} />
      </span>
    </button>
  );
}

function toLineList(input: string) {
  return input.split(/\r?\n/).map((item) => item.trim()).filter(Boolean);
}

function updateGalleryLine(input: string, index: number, nextValue: string) {
  const lines = input.split(/\r?\n/);
  while (lines.length < 3) {
    lines.push('');
  }
  lines[index] = nextValue.trim();
  return lines.slice(0, 3).join('\n');
}

function parseSpecs(input: string): AdminProductSpec[] {
  return input.split(/\r?\n/).map((item) => item.trim()).filter(Boolean).map((item) => {
    const [label, ...rest] = item.split(':');
    return { label: label?.trim() || '', value: rest.join(':').trim() };
  }).filter((item) => item.label && item.value);
}

function formatCategory(category: string) {
  return categoryLabels[category] ?? category;
}

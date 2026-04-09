import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  fetchAdminDashboard,
  fetchAdminOrders,
  fetchAdminProducts,
  fetchAdminProductSeries,
  fetchAdminUsers,
  type AdminDashboard,
  type AdminOrder,
  type AdminProduct,
  type AdminProductSeries,
  type AdminUser,
} from '../lib/admin';

type DateGroup<T> = {
  dateKey: string;
  label: string;
  items: T[];
};

export default function AdminDashboardPage() {
  const { token } = useAuth();
  const [dashboard, setDashboard] = useState<AdminDashboard | null>(null);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [seriesList, setSeriesList] = useState<AdminProductSeries[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [expandedOrderGroup, setExpandedOrderGroup] = useState<string | null>(null);
  const [expandedUserGroup, setExpandedUserGroup] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    let active = true;
    setIsLoading(true);

    Promise.all([
      fetchAdminDashboard(token),
      fetchAdminOrders(token),
      fetchAdminUsers(token),
      fetchAdminProductSeries(token),
      fetchAdminProducts(token),
    ])
      .then(([stats, nextOrders, nextUsers, nextSeries, nextProducts]) => {
        if (!active) return;

        const nextOrderGroups = groupOrdersByDate(nextOrders);
        const nextUserGroups = groupUsersByDate(nextUsers);

        setDashboard(stats);
        setOrders(nextOrders);
        setUsers(nextUsers);
        setSeriesList(nextSeries);
        setProducts(nextProducts);
        setExpandedOrderGroup(nextOrderGroups[0]?.dateKey ?? null);
        setExpandedUserGroup(nextUserGroups[0]?.dateKey ?? null);
        setError('');
      })
      .catch((loadError) => {
        if (!active) return;
        setError(loadError instanceof Error ? loadError.message : '无法加载后台概览。');
      })
      .finally(() => {
        if (!active) return;
        setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [token]);

  const topCards = useMemo(
    () =>
      dashboard
        ? [
            { label: '订单', value: String(dashboard.totalOrders) },
            { label: '用户', value: String(dashboard.totalUsers) },
            { label: '商品', value: String(dashboard.totalProducts) },
            { label: '低库存', value: String(dashboard.lowStockProducts) },
          ]
        : [],
    [dashboard],
  );

  const inventoryBySeries = useMemo(() => {
    return seriesList.map((series) => {
      const seriesProducts = products
        .filter((product) => product.seriesId === series.id)
        .sort((left, right) => left.sortOrder - right.sortOrder || left.name.localeCompare(right.name));

      return {
        ...series,
        products: seriesProducts,
      };
    });
  }, [products, seriesList]);

  const inventorySummary = useMemo(() => {
    const totalUnits = products.reduce((sum, product) => sum + Math.max(product.stock, 0), 0);
    const outOfStockCount = products.filter((product) => product.stock <= 0).length;
    const lowStockCount = products.filter((product) => product.stock > 0 && product.stock <= 10).length;

    return {
      totalUnits,
      outOfStockCount,
      lowStockCount,
    };
  }, [products]);

  const recentOrderGroups = useMemo(() => groupOrdersByDate(orders).slice(0, 3), [orders]);
  const recentUserGroups = useMemo(() => groupUsersByDate(users).slice(0, 3), [users]);

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(16,185,129,0.12),rgba(255,255,255,0.03))] px-5 py-6 sm:px-7 sm:py-8">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-400/80">概览</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-[3rem]">后台总览</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-neutral-300">
          订单、用户和库存集中展示在这里，方便你不离开后台就能查看最近的业务状态。
        </p>
      </section>

      {error ? (
        <div className="rounded-[1.2rem] border border-red-500/30 bg-red-950/20 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      ) : null}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {topCards.map((card) => (
          <div
            key={card.label}
            className="rounded-[1.4rem] border border-white/10 bg-white/[0.03] px-5 py-5"
          >
            <p className="text-xs uppercase tracking-[0.22em] text-neutral-500">{card.label}</p>
            <p className="mt-3 text-3xl font-semibold text-white">{card.value}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.05fr,0.95fr]">
        <div className="rounded-[1.7rem] border border-white/10 bg-black/40 p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-neutral-500">最近订单</p>
              <h3 className="mt-2 text-xl font-semibold text-white">订单动态</h3>
            </div>
            <Link
              to="/admin/orders"
              className="rounded-full border border-white/10 px-4 py-2 text-sm text-neutral-300 transition hover:border-white/25 hover:text-white"
            >
              查看全部
            </Link>
          </div>

          <div className="mt-5 space-y-3">
            {isLoading ? (
              <PanelHint>正在加载订单...</PanelHint>
            ) : recentOrderGroups.length === 0 ? (
              <PanelHint>当前还没有订单。</PanelHint>
            ) : (
              recentOrderGroups.map((group) => (
                <DateAccordion
                  key={group.dateKey}
                  label={group.label}
                  countLabel={`${group.items.length} 笔订单`}
                  expanded={expandedOrderGroup === group.dateKey}
                  onToggle={() =>
                    setExpandedOrderGroup((current) =>
                      current === group.dateKey ? null : group.dateKey,
                    )
                  }
                >
                  <div className="space-y-2">
                    {group.items.map((order) => (
                      <div
                        key={order.id}
                        className="rounded-[1rem] border border-white/10 bg-black/40 px-3 py-3"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-white">
                              {order.orderNumber}
                            </p>
                            <p className="mt-1 truncate text-sm text-neutral-400">
                              {order.customer}
                            </p>
                          </div>
                          <p className="text-sm font-medium text-white">
                            ${order.total.toFixed(2)}
                          </p>
                        </div>
                        <p className="mt-2 text-xs uppercase tracking-[0.2em] text-neutral-500">
                          {formatStatus(order.status)} / {formatPaymentStatus(order.paymentStatus)}
                        </p>
                      </div>
                    ))}
                  </div>
                </DateAccordion>
              ))
            )}
          </div>
        </div>

        <div className="rounded-[1.7rem] border border-white/10 bg-black/40 p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-neutral-500">最近用户</p>
              <h3 className="mt-2 text-xl font-semibold text-white">用户动态</h3>
            </div>
            <Link
              to="/admin/users"
              className="rounded-full border border-white/10 px-4 py-2 text-sm text-neutral-300 transition hover:border-white/25 hover:text-white"
            >
              查看全部
            </Link>
          </div>

          <div className="mt-5 space-y-3">
            {isLoading ? (
              <PanelHint>正在加载用户...</PanelHint>
            ) : recentUserGroups.length === 0 ? (
              <PanelHint>当前还没有用户。</PanelHint>
            ) : (
              recentUserGroups.map((group) => (
                <DateAccordion
                  key={group.dateKey}
                  label={group.label}
                  countLabel={`${group.items.length} 位用户`}
                  expanded={expandedUserGroup === group.dateKey}
                  onToggle={() =>
                    setExpandedUserGroup((current) =>
                      current === group.dateKey ? null : group.dateKey,
                    )
                  }
                >
                  <div className="space-y-2">
                    {group.items.map((user) => (
                      <div
                        key={user.id}
                        className="rounded-[1rem] border border-white/10 bg-black/40 px-3 py-3"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-white">{user.name}</p>
                            <p className="mt-1 truncate text-sm text-neutral-400">
                              {user.email || user.phone || '暂无联系方式'}
                            </p>
                          </div>
                          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
                            {user.role === 'admin' ? '管理员' : '用户'}
                          </p>
                        </div>
                        <p className="mt-2 truncate text-sm text-neutral-500">
                          {user.company || '暂无公司信息'}
                        </p>
                      </div>
                    ))}
                  </div>
                </DateAccordion>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="rounded-[1.7rem] border border-white/10 bg-black/40 p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-neutral-500">库存快照</p>
            <h3 className="mt-2 text-xl font-semibold text-white">系列与商品库存</h3>
            <p className="mt-2 max-w-2xl text-sm text-neutral-400">
              用更紧凑的方式查看每个系列下的商品库存，让总览页保持清晰，不会变成另一个很长的商品页。
            </p>
          </div>
          <Link
            to="/admin/products"
            className="rounded-full border border-white/10 px-4 py-2 text-sm text-neutral-300 transition hover:border-white/25 hover:text-white"
          >
            打开商品页
          </Link>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <CompactMetric label="系列" value={String(seriesList.length)} tone="neutral" />
          <CompactMetric label="库存总量" value={String(inventorySummary.totalUnits)} tone="ok" />
          <CompactMetric
            label="库存关注"
            value={`低库存 ${inventorySummary.lowStockCount} / 缺货 ${inventorySummary.outOfStockCount}`}
            tone={
              inventorySummary.outOfStockCount > 0
                ? 'out'
                : inventorySummary.lowStockCount > 0
                  ? 'low'
                  : 'neutral'
            }
          />
        </div>

        <div className="mt-5 grid max-h-[430px] gap-3 overflow-y-auto pr-1 lg:grid-cols-2">
          {isLoading ? (
            <PanelHint>正在加载库存...</PanelHint>
          ) : inventoryBySeries.length === 0 ? (
            <PanelHint>当前还没有商品系列。</PanelHint>
          ) : (
            inventoryBySeries.map((series) => (
              <div
                key={series.id}
                className="rounded-[1.3rem] border border-white/10 bg-white/[0.02] p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-[11px] uppercase tracking-[0.22em] text-neutral-500">
                      {series.eyebrow}
                    </p>
                    <h4 className="mt-2 truncate text-lg font-semibold text-white">
                      {series.title}
                    </h4>
                    {series.description ? (
                      <p className="mt-2 line-clamp-2 text-sm text-neutral-400">
                        {series.description}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <StockPill tone={series.isActive ? 'ok' : 'neutral'}>
                      {series.isActive ? '已上架' : '已隐藏'}
                    </StockPill>
                    <StockPill tone="neutral">{`${series.products.length} 个商品`}</StockPill>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  {series.products.length === 0 ? (
                    <PanelHint>这个系列下还没有商品。</PanelHint>
                  ) : (
                    series.products.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center justify-between gap-4 rounded-[1rem] border border-white/10 bg-black/30 px-3 py-2.5"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-white">
                            {product.shortName || product.name}
                          </p>
                          <p className="truncate text-xs text-neutral-400">
                            {product.flavor || '未设置口味'}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="hidden text-xs text-neutral-500 sm:inline">
                            {product.sku || '无 SKU'}
                          </span>
                          <StockPill tone={getStockTone(product.stock)}>
                            {product.stock <= 0 ? '缺货' : `库存 ${product.stock}`}
                          </StockPill>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

function DateAccordion({
  label,
  countLabel,
  expanded,
  onToggle,
  children,
}: {
  label: string;
  countLabel: string;
  expanded: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-[1.2rem] border border-white/10 bg-white/[0.02]">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left"
      >
        <div className="min-w-0">
          <p className="text-sm font-medium text-white">{label}</p>
          <p className="mt-1 text-xs uppercase tracking-[0.2em] text-neutral-500">{countLabel}</p>
        </div>
        <span className="text-sm text-neutral-400">{expanded ? '-' : '+'}</span>
      </button>

      {expanded ? <div className="border-t border-white/10 px-4 py-3">{children}</div> : null}
    </div>
  );
}

function PanelHint({ children }: { children: string }) {
  return (
    <div className="rounded-[1.2rem] border border-dashed border-white/10 bg-black/50 px-4 py-5 text-sm text-neutral-400">
      {children}
    </div>
  );
}

function CompactMetric({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: 'ok' | 'low' | 'out' | 'neutral';
}) {
  const tones = {
    ok: 'border-emerald-400/15 bg-emerald-500/8 text-emerald-100',
    low: 'border-amber-400/15 bg-amber-500/8 text-amber-100',
    out: 'border-red-400/15 bg-red-500/8 text-red-100',
    neutral: 'border-white/10 bg-white/[0.03] text-white',
  };

  return (
    <div className={`rounded-[1.1rem] border px-4 py-3 ${tones[tone]}`}>
      <p className="text-[11px] uppercase tracking-[0.2em] text-neutral-500">{label}</p>
      <p className="mt-2 text-lg font-semibold">{value}</p>
    </div>
  );
}

function StockPill({
  children,
  tone,
}: {
  children: string;
  tone: 'ok' | 'low' | 'out' | 'neutral';
}) {
  const tones = {
    ok: 'border-emerald-400/20 bg-emerald-500/10 text-emerald-200',
    low: 'border-amber-400/20 bg-amber-500/10 text-amber-200',
    out: 'border-red-400/20 bg-red-500/10 text-red-200',
    neutral: 'border-white/10 bg-white/[0.04] text-neutral-200',
  };

  return (
    <span className={`inline-flex rounded-full border px-3 py-1 text-xs ${tones[tone]}`}>
      {children}
    </span>
  );
}

function groupOrdersByDate(orders: AdminOrder[]): Array<DateGroup<AdminOrder>> {
  return groupByDate(orders, (order) => order.createdAt);
}

function groupUsersByDate(users: AdminUser[]): Array<DateGroup<AdminUser>> {
  return groupByDate(users, (user) => user.createdAt);
}

function groupByDate<T>(items: T[], getDate: (item: T) => string): Array<DateGroup<T>> {
  const groups = new Map<string, DateGroup<T>>();

  items.forEach((item) => {
    const date = new Date(getDate(item));
    const dateKey = getLocalDateKey(date);

    if (!groups.has(dateKey)) {
      groups.set(dateKey, {
        dateKey,
        label: formatDateGroupLabel(date),
        items: [],
      });
    }

    groups.get(dateKey)?.items.push(item);
  });

  return Array.from(groups.values()).sort((left, right) => right.dateKey.localeCompare(left.dateKey));
}

function getLocalDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatDateGroupLabel(date: Date) {
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  });
}

function getStockTone(stock: number): 'ok' | 'low' | 'out' {
  if (stock <= 0) return 'out';
  if (stock <= 10) return 'low';
  return 'ok';
}

function formatStatus(status: string) {
  const labels: Record<string, string> = {
    pending: '待处理',
    processing: '处理中',
    shipped: '已发货',
    delivered: '已送达',
    cancelled: '已取消',
  };

  return labels[status] ?? status;
}

function formatPaymentStatus(status: string) {
  const labels: Record<string, string> = {
    unpaid: '未付款',
    pending_confirmation: '待确认',
    paid: '已付款',
    refunded: '已退款',
  };

  return labels[status] ?? status;
}

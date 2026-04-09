import { useEffect, useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { downloadWholesaleInvoicePdf } from '../lib/orders';
import {
  deleteAdminOrder,
  fetchAdminDashboard,
  fetchAdminOrders,
  updateAdminOrderStatus,
  type AdminDashboard,
  type AdminOrder,
} from '../lib/admin';

const statusOptions = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
const paymentStatusOptions = ['unpaid', 'pending_confirmation', 'paid', 'refunded'];

const statusLabels: Record<string, string> = {
  pending: '待处理',
  processing: '处理中',
  shipped: '已发货',
  delivered: '已送达',
  cancelled: '已取消',
};

const paymentStatusLabels: Record<string, string> = {
  unpaid: '未付款',
  pending_confirmation: '待确认',
  paid: '已付款',
  refunded: '已退款',
};

type OrderGroup = {
  dateKey: string;
  label: string;
  totalAmount: number;
  items: AdminOrder[];
};

export default function AdminOrdersPage() {
  const { isLoggedIn, user, token } = useAuth();
  const [dashboard, setDashboard] = useState<AdminDashboard | null>(null);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [expandedDateKey, setExpandedDateKey] = useState<string | null>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [search, setSearch] = useState('');
  const [draftStatuses, setDraftStatuses] = useState<
    Record<string, { status: string; paymentStatus: string }>
  >({});
  const [isLoading, setIsLoading] = useState(false);
  const [savingOrderId, setSavingOrderId] = useState<string | null>(null);
  const [downloadingOrderId, setDownloadingOrderId] = useState<string | null>(null);
  const [deletingOrderId, setDeletingOrderId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    if (!token || !isAdmin) {
      setDashboard(null);
      setOrders([]);
      setExpandedDateKey(null);
      setExpandedOrderId(null);
      return;
    }

    let active = true;
    setIsLoading(true);

    Promise.all([
      fetchAdminDashboard(token),
      fetchAdminOrders(token, {
        status: statusFilter || undefined,
        paymentStatus: paymentFilter || undefined,
        search: search.trim() || undefined,
      }),
    ])
      .then(([nextDashboard, nextOrders]) => {
        if (!active) return;
        setDashboard(nextDashboard);
        setOrders(nextOrders);
        setDraftStatuses(
          Object.fromEntries(
            nextOrders.map((order) => [
              order.id,
              { status: order.status, paymentStatus: order.paymentStatus },
            ]),
          ),
        );
        setExpandedDateKey(null);
        setExpandedOrderId(null);
        setError('');
      })
      .catch((loadError) => {
        if (!active) return;
        setError(loadError instanceof Error ? loadError.message : '无法加载后台订单。');
      })
      .finally(() => {
        if (!active) return;
        setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [token, isAdmin, statusFilter, paymentFilter, search]);

  const summaryCards = useMemo(
    () =>
      dashboard
        ? [
            { label: '待处理订单', value: String(dashboard.pendingOrders) },
            { label: '处理中', value: String(dashboard.processingOrders) },
            { label: '已收金额', value: `$${dashboard.totalRevenue}` },
            { label: '贸易用户', value: String(dashboard.totalUsers) },
          ]
        : [],
    [dashboard],
  );

  const orderGroups = useMemo(() => groupOrdersByDate(orders), [orders]);

  if (!isLoggedIn) {
    return <Navigate to="/login" replace state={{ from: '/admin/orders' }} />;
  }

  if (!isAdmin) {
    return <Navigate to="/account" replace />;
  }

  async function refreshOrders() {
    if (!token) return;

    const nextOrders = await fetchAdminOrders(token, {
      status: statusFilter || undefined,
      paymentStatus: paymentFilter || undefined,
      search: search.trim() || undefined,
    });

    setOrders(nextOrders);
    setDraftStatuses(
      Object.fromEntries(
        nextOrders.map((order) => [
          order.id,
          { status: order.status, paymentStatus: order.paymentStatus },
        ]),
      ),
    );
    setExpandedOrderId(null);
  }

  async function handleSave(orderId: string) {
    if (!token) return;

    const nextDraft = draftStatuses[orderId];
    if (!nextDraft) return;

    try {
      setSavingOrderId(orderId);
      await updateAdminOrderStatus(token, orderId, nextDraft);
      await refreshOrders();
      setError('');
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : '无法更新这笔订单。');
    } finally {
      setSavingOrderId(null);
    }
  }

  async function handleDownloadInvoice(order: AdminOrder) {
    if (!token) return;

    try {
      setDownloadingOrderId(order.id);
      await downloadWholesaleInvoicePdf(token, order.id, order.orderNumber);
      setError('');
    } catch (downloadError) {
      setError(downloadError instanceof Error ? downloadError.message : '无法下载订单 PDF。');
    } finally {
      setDownloadingOrderId(null);
    }
  }

  async function handleDeleteOrder(order: AdminOrder) {
    if (!token) return;

    const confirmed = window.confirm(`确认删除订单 ${order.orderNumber} 吗？库存会自动恢复。`);
    if (!confirmed) return;

    try {
      setDeletingOrderId(order.id);
      await deleteAdminOrder(token, order.id);
      if (expandedOrderId === order.id) {
        setExpandedOrderId(null);
      }
      await refreshOrders();
      setError('');
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : '无法删除这笔订单。');
    } finally {
      setDeletingOrderId(null);
    }
  }

  return (
    <div className="mx-auto max-w-7xl overflow-x-hidden px-4 py-8 sm:px-6 sm:py-20">
      <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-neutral-500">
            后台订单
          </p>
          <h1 className="mt-3 text-[2.1rem] font-semibold leading-[1.02] tracking-tight text-white sm:text-4xl">
            批发订单管理
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-neutral-400">
            查看最新批发订单，更新订单和付款状态，并在同一后台界面直接下载正式发票 PDF。
          </p>
        </div>
      </div>

      {summaryCards.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => (
            <div
              key={card.label}
              className="rounded-[1.35rem] border border-white/10 bg-white/[0.03] px-5 py-5"
            >
              <p className="text-xs uppercase tracking-[0.22em] text-neutral-500">{card.label}</p>
              <p className="mt-3 text-2xl font-semibold text-white">{card.value}</p>
            </div>
          ))}
        </div>
      ) : null}

      <section className="mt-5 rounded-[1.75rem] border border-white/10 bg-neutral-950 p-4 sm:mt-6 sm:rounded-[2rem] sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <FilterSelect
            label="订单状态"
            value={statusFilter}
            onChange={setStatusFilter}
            options={['', ...statusOptions]}
            optionLabels={statusLabels}
          />
          <FilterSelect
            label="付款状态"
            value={paymentFilter}
            onChange={setPaymentFilter}
            options={['', ...paymentStatusOptions]}
            optionLabels={paymentStatusLabels}
          />
          <label className="flex min-w-[240px] flex-1 flex-col gap-2 text-xs uppercase tracking-[0.18em] text-neutral-500">
            搜索
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="订单号或邮箱"
              className="h-11 rounded-[1rem] border border-white/10 bg-black px-4 text-sm normal-case tracking-normal text-white outline-none placeholder:text-neutral-500"
            />
          </label>
        </div>

        {error ? (
          <div className="mt-4 rounded-[1rem] border border-red-500/30 bg-red-950/20 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        ) : null}

        {isLoading ? (
          <div className="mt-5 rounded-[1.25rem] border border-white/10 bg-black px-5 py-6 text-sm text-neutral-400">
            正在加载后台订单...
          </div>
        ) : orderGroups.length === 0 ? (
          <div className="mt-5 rounded-[1.25rem] border border-dashed border-white/10 bg-black px-5 py-6 text-sm text-neutral-400">
            当前筛选条件下没有订单。
          </div>
        ) : (
          <div className="mt-5 max-h-[78vh] space-y-3 overflow-y-auto pr-1">
            {orderGroups.map((group) => (
              <div
                key={group.dateKey}
                className="overflow-hidden rounded-[1.35rem] border border-white/10 bg-black"
              >
                <button
                  type="button"
                  onClick={() => {
                    setExpandedDateKey((current) =>
                      current === group.dateKey ? null : group.dateKey,
                    );
                    setExpandedOrderId(null);
                  }}
                  className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left sm:px-5"
                >
                  <div className="min-w-0">
                    <p className="text-base font-medium text-white sm:text-lg">{group.label}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.22em] text-neutral-500">
                      {group.items.length} 笔订单 / ${group.totalAmount.toFixed(2)}
                    </p>
                  </div>
                  <span className="text-sm text-neutral-400">
                    {expandedDateKey === group.dateKey ? '-' : '+'}
                  </span>
                </button>

                {expandedDateKey === group.dateKey ? (
                  <div className="border-t border-white/10 px-4 py-4 sm:px-5">
                    <div className="space-y-3">
                      {group.items.map((order) => {
                        const draft = draftStatuses[order.id] || {
                          status: order.status,
                          paymentStatus: order.paymentStatus,
                        };

                        return (
                          <div
                            key={order.id}
                            className="overflow-hidden rounded-[1.2rem] border border-white/10 bg-white/[0.02]"
                          >
                            <button
                              type="button"
                              onClick={() =>
                                setExpandedOrderId((current) =>
                                  current === order.id ? null : order.id,
                                )
                              }
                              className="flex w-full items-start justify-between gap-4 px-4 py-4 text-left"
                            >
                              <div className="min-w-0">
                                <p className="text-base font-medium text-white">
                                  {order.orderNumber}
                                </p>
                                <p className="mt-1 text-sm text-neutral-400">{order.customer}</p>
                                <p className="mt-1 text-xs text-neutral-500">
                                  {new Date(order.createdAt).toLocaleString('en-US', {
                                    dateStyle: 'medium',
                                    timeStyle: 'short',
                                  })}
                                </p>
                              </div>
                              <div className="flex items-start gap-4 text-right">
                                <div>
                                  <p className="text-base font-medium text-white">
                                    ${order.total.toFixed(2)}
                                  </p>
                                  <p className="mt-1 text-xs uppercase tracking-[0.22em] text-neutral-500">
                                    {getStatusLabel(order.status)} /{' '}
                                    {getPaymentStatusLabel(order.paymentStatus)}
                                  </p>
                                </div>
                                <span className="mt-1 text-sm text-neutral-500">
                                  {expandedOrderId === order.id ? '-' : '+'}
                                </span>
                              </div>
                            </button>

                            {expandedOrderId === order.id ? (
                              <div className="border-t border-white/10 px-4 py-4">
                                <div className="grid gap-4 xl:grid-cols-[1.1fr,0.9fr]">
                                  <div className="space-y-3">
                                    {order.items.map((item) => (
                                      <div
                                        key={`${order.id}-${item.id}`}
                                        className="grid gap-3 rounded-[1rem] border border-white/10 bg-black/30 px-4 py-3 sm:flex sm:items-center sm:justify-between"
                                      >
                                        <div className="flex min-w-0 items-center gap-3">
                                          <img
                                            src={item.image}
                                            alt={`${item.name} ${item.selectedFlavor}`.trim()}
                                            className="h-16 w-16 shrink-0 rounded-[1rem] border border-white/10 object-cover object-left"
                                          />
                                          <div className="min-w-0">
                                            <p className="truncate text-sm font-medium text-white sm:text-base">
                                              {item.name}
                                            </p>
                                            <p className="mt-1 truncate text-xs text-neutral-400 sm:text-sm">
                                              {item.selectedFlavor || '默认规格'}
                                            </p>
                                            <p className="mt-2 text-xs text-neutral-500 sm:text-sm">
                                              数量 {item.quantity}
                                            </p>
                                          </div>
                                        </div>
                                        <p className="text-sm text-neutral-300">
                                          ${item.lineTotal.toFixed(2)}
                                        </p>
                                      </div>
                                    ))}
                                  </div>

                                  <div className="space-y-3">
                                    <div className="rounded-[1rem] border border-white/10 bg-black/30 px-4 py-4">
                                      <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">
                                        用户信息
                                      </p>
                                      <p className="mt-3 text-sm text-white">{order.customer}</p>
                                      <p className="mt-1 break-all text-sm text-neutral-400">
                                        {order.email || '暂无邮箱'}
                                      </p>
                                      <p className="mt-1 text-sm text-neutral-400">
                                        {order.phone || '暂无电话'}
                                      </p>
                                      <p className="mt-3 text-sm text-neutral-400">
                                        {order.addressLine}
                                      </p>
                                    </div>

                                    <div className="rounded-[1rem] border border-white/10 bg-black/30 px-4 py-4">
                                      <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">
                                        金额与支付
                                      </p>
                                      <div className="mt-3 space-y-2 text-sm text-neutral-300">
                                        <AdminRow
                                          label="商品小计"
                                          value={`$${order.subtotal.toFixed(2)}`}
                                        />
                                        <AdminRow
                                          label="运费"
                                          value={`$${order.shipping.toFixed(2)}`}
                                        />
                                        <AdminRow
                                          label="税费"
                                          value={`$${order.tax.toFixed(2)}`}
                                        />
                                        <AdminRow
                                          label="订单总额"
                                          value={`$${order.total.toFixed(2)}`}
                                        />
                                        <AdminRow
                                          label="付款方式"
                                          value={formatPaymentMethod(order.paymentMethod)}
                                        />
                                      </div>
                                    </div>

                                    <div className="rounded-[1rem] border border-white/10 bg-black/30 px-4 py-4">
                                      <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">
                                        订单操作
                                      </p>
                                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                        <FilterSelect
                                          label="订单状态"
                                          value={draft.status}
                                          onChange={(value) =>
                                            setDraftStatuses((current) => ({
                                              ...current,
                                              [order.id]: {
                                                ...draft,
                                                status: value,
                                              },
                                            }))
                                          }
                                          options={statusOptions}
                                          optionLabels={statusLabels}
                                          compact
                                        />
                                        <FilterSelect
                                          label="付款状态"
                                          value={draft.paymentStatus}
                                          onChange={(value) =>
                                            setDraftStatuses((current) => ({
                                              ...current,
                                              [order.id]: {
                                                ...draft,
                                                paymentStatus: value,
                                              },
                                            }))
                                          }
                                          options={paymentStatusOptions}
                                          optionLabels={paymentStatusLabels}
                                          compact
                                        />
                                      </div>
                                      {order.note ? (
                                        <p className="mt-4 rounded-[0.9rem] border border-white/10 bg-black px-3 py-3 text-sm leading-6 text-neutral-400">
                                          {order.note}
                                        </p>
                                      ) : null}
                                      <div className="mt-4 grid gap-3 sm:grid-cols-3">
                                        <Button
                                          type="button"
                                          onClick={() => handleSave(order.id)}
                                          disabled={savingOrderId === order.id}
                                          className="w-full"
                                        >
                                          {savingOrderId === order.id
                                            ? '保存中...'
                                            : '保存订单更新'}
                                        </Button>
                                        <Button
                                          type="button"
                                          variant="secondary"
                                          onClick={() => handleDownloadInvoice(order)}
                                          disabled={downloadingOrderId === order.id}
                                          className="w-full"
                                        >
                                          {downloadingOrderId === order.id
                                            ? '正在生成 PDF...'
                                            : '下载 PDF'}
                                        </Button>
                                        <Button
                                          type="button"
                                          variant="secondary"
                                          onClick={() => handleDeleteOrder(order)}
                                          disabled={deletingOrderId === order.id}
                                          className="w-full border-red-500/25 bg-red-500/10 text-red-200 hover:bg-red-500/15"
                                        >
                                          {deletingOrderId === order.id
                                            ? '删除中...'
                                            : '删除订单'}
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ) : null}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
  optionLabels,
  compact = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  optionLabels?: Record<string, string>;
  compact?: boolean;
}) {
  return (
    <label
      className={`flex flex-col gap-2 text-xs uppercase tracking-[0.18em] text-neutral-500 ${
        compact ? '' : 'min-w-[170px]'
      }`}
    >
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 rounded-[1rem] border border-white/10 bg-black px-4 text-sm normal-case tracking-normal text-white outline-none"
      >
        {options.map((option) => (
          <option key={option || 'all'} value={option}>
            {option ? optionLabels?.[option] ?? option.replace(/_/g, ' ') : '全部'}
          </option>
        ))}
      </select>
    </label>
  );
}

function AdminRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span>{label}</span>
      <span className="text-white">{value}</span>
    </div>
  );
}

function getStatusLabel(status: string) {
  return statusLabels[status] ?? status;
}

function getPaymentStatusLabel(status: string) {
  return paymentStatusLabels[status] ?? status;
}

function formatPaymentMethod(method: string) {
  return method === 'bank_transfer' ? '银行转账' : method;
}

function groupOrdersByDate(orders: AdminOrder[]): OrderGroup[] {
  const groups = new Map<string, OrderGroup>();

  orders.forEach((order) => {
    const date = new Date(order.createdAt);
    const dateKey = getLocalDateKey(date);

    if (!groups.has(dateKey)) {
      groups.set(dateKey, {
        dateKey,
        label: date.toLocaleDateString('zh-CN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          weekday: 'short',
        }),
        totalAmount: 0,
        items: [],
      });
    }

    const group = groups.get(dateKey);
    if (!group) return;

    group.items.push(order);
    group.totalAmount += order.total;
  });

  return Array.from(groups.values()).sort((left, right) => right.dateKey.localeCompare(left.dateKey));
}

function getLocalDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

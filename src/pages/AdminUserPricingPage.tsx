import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  fetchAdminUserPricing,
  fetchAdminUsers,
  updateAdminUserPricing,
  type AdminUser,
  type AdminUserPricingItem,
} from '../lib/admin';

type PricingDraft = Record<string, string>;

export default function AdminUserPricingPage() {
  const { token } = useAuth();
  const [searchParams] = useSearchParams();
  const requestedUserId = searchParams.get('userId') || '';
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedUserName, setSelectedUserName] = useState('');
  const [pricingItems, setPricingItems] = useState<AdminUserPricingItem[]>([]);
  const [draft, setDraft] = useState<PricingDraft>({});
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isLoadingPricing, setIsLoadingPricing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!token) return;

    let active = true;
    setIsLoadingUsers(true);

    fetchAdminUsers(token, { role: 'user', hasCustomPricing: 'true' })
      .then((nextUsers) => {
        if (!active) return;
        setUsers(nextUsers);

        const preferredUser =
          nextUsers.find((user) => user.id === requestedUserId) ||
          nextUsers.find((user) => user.id === selectedUserId) ||
          nextUsers[0];

        setSelectedUserId(preferredUser?.id || '');
      })
      .catch((loadError) => {
        if (!active) return;
        setError(loadError instanceof Error ? loadError.message : '无法加载用户列表。');
      })
      .finally(() => {
        if (!active) return;
        setIsLoadingUsers(false);
      });

    return () => {
      active = false;
    };
  }, [token, requestedUserId]);

  useEffect(() => {
    if (!token || !selectedUserId) {
      setPricingItems([]);
      setDraft({});
      return;
    }

    let active = true;
    setIsLoadingPricing(true);
    setSuccess('');

    fetchAdminUserPricing(token, selectedUserId)
      .then((result) => {
        if (!active) return;
        setSelectedUserName(result.user.name);
        setPricingItems(result.items);
        setDraft(
          result.items.reduce<PricingDraft>((accumulator, item) => {
            accumulator[item.productId] = item.customPrice === null ? '' : item.customPrice.toFixed(2);
            return accumulator;
          }, {}),
        );
        setError('');
      })
      .catch((loadError) => {
        if (!active) return;
        setError(loadError instanceof Error ? loadError.message : '无法加载专属价格。');
      })
      .finally(() => {
        if (!active) return;
        setIsLoadingPricing(false);
      });

    return () => {
      active = false;
    };
  }, [token, selectedUserId]);

  const summary = useMemo(
    () => ({
      customers: users.length,
      customPrices: pricingItems.filter((item) => item.customPrice !== null).length,
      products: pricingItems.length,
    }),
    [pricingItems, users.length],
  );

  async function handleSave() {
    if (!token || !selectedUserId) return;

    try {
      setIsSaving(true);
      setSuccess('');
      await updateAdminUserPricing(
        token,
        selectedUserId,
        pricingItems.map((item) => ({
          productId: item.productId,
          price: draft[item.productId] === '' ? null : Number(draft[item.productId]),
        })),
      );
      const refreshed = await fetchAdminUserPricing(token, selectedUserId);
      setPricingItems(refreshed.items);
      setDraft(
        refreshed.items.reduce<PricingDraft>((accumulator, item) => {
          accumulator[item.productId] = item.customPrice === null ? '' : item.customPrice.toFixed(2);
          return accumulator;
        }, {}),
      );
      setSuccess('专属价格已保存。');
      setError('');
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : '无法保存专属价格。');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[1.9rem] border border-white/10 bg-white/[0.03] px-5 py-6 sm:px-6 sm:py-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-neutral-500">专属价格</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">用户专属价格面板</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-neutral-400">
              这里只显示已经在用户页加入专属价格名单的客户。先加人，再来维护具体商品价格，后台会更整洁。
            </p>
          </div>

          <Link
            to="/admin/users"
            className="inline-flex h-11 items-center justify-center rounded-full border border-white/20 px-5 text-sm text-white transition hover:border-white/40"
          >
            返回用户页
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <SummaryCard label="专属价用户数" value={String(summary.customers)} />
        <SummaryCard label="当前已设价格" value={String(summary.customPrices)} />
        <SummaryCard label="可配置商品" value={String(summary.products)} />
      </section>

      <section className="rounded-[1.9rem] border border-white/10 bg-black/40 p-4 sm:p-6">
        <div className="grid gap-4 lg:grid-cols-[320px,1fr]">
          <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-neutral-500">选择用户</p>
            <select
              value={selectedUserId}
              onChange={(event) => setSelectedUserId(event.target.value)}
              className="mt-3 h-12 w-full rounded-[1rem] border border-white/10 bg-black px-4 text-sm text-white outline-none"
              disabled={isLoadingUsers || users.length === 0}
            >
              {users.length === 0 ? <option value="">暂无专属价用户</option> : null}
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} · {user.email || '无邮箱'}
                </option>
              ))}
            </select>

            <div className="mt-4 rounded-[1rem] border border-white/10 bg-black/30 px-4 py-4 text-sm text-neutral-300">
              <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">当前对象</p>
              <p className="mt-2 font-medium text-white">{selectedUserName || '请先在用户页加入专属价格名单'}</p>
              <p className="mt-2 leading-6 text-neutral-400">
                留空代表继续沿用商品默认价。专属价格会自动同步到前台展示、购物车、结账与订单记录。
              </p>
            </div>
          </div>

          <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.03] p-4 sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-neutral-500">价格列表</p>
                <h3 className="mt-2 text-xl font-semibold text-white">默认价与专属价并排维护</h3>
              </div>

              <button
                type="button"
                onClick={handleSave}
                disabled={!selectedUserId || isSaving || isLoadingPricing}
                className="inline-flex h-11 items-center justify-center rounded-full border border-white bg-white px-5 text-sm font-medium text-black transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSaving ? '保存中...' : '保存专属价格'}
              </button>
            </div>

            {error ? (
              <div className="mt-4 rounded-[1rem] border border-red-500/30 bg-red-950/20 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            ) : null}

            {success ? (
              <div className="mt-4 rounded-[1rem] border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                {success}
              </div>
            ) : null}

            {isLoadingPricing ? (
              <div className="mt-5 text-sm text-neutral-400">正在加载价格数据...</div>
            ) : pricingItems.length === 0 ? (
              <div className="mt-5 text-sm text-neutral-400">当前没有可配置商品。</div>
            ) : (
              <div className="mt-5 space-y-3">
                {pricingItems.map((item) => (
                  <div
                    key={item.productId}
                    className="grid gap-3 rounded-[1.2rem] border border-white/10 bg-black/30 px-4 py-4 lg:grid-cols-[1.3fr,0.7fr,0.8fr]"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-base font-medium text-white">{item.shortName || item.productName}</p>
                      <p className="mt-1 truncate text-sm text-neutral-300">{item.flavor || item.productName}</p>
                      <p className="mt-2 truncate text-xs uppercase tracking-[0.18em] text-neutral-500">
                        {item.seriesTitle || '未分配系列'}
                      </p>
                    </div>

                    <div className="rounded-[1rem] border border-white/10 bg-white/[0.03] px-4 py-3">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">默认价格</p>
                      <p className="mt-2 whitespace-nowrap text-2xl font-semibold text-white">
                        ${item.basePrice.toFixed(2)}
                      </p>
                    </div>

                    <label className="rounded-[1rem] border border-white/10 bg-white/[0.03] px-4 py-3">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">专属价格</p>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={draft[item.productId] ?? ''}
                        onChange={(event) =>
                          setDraft((current) => ({
                            ...current,
                            [item.productId]: event.target.value,
                          }))
                        }
                        placeholder="留空则默认"
                        className="mt-2 h-11 w-full rounded-[0.9rem] border border-white/10 bg-black px-4 text-base text-white outline-none placeholder:text-neutral-500"
                      />
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.03] px-5 py-5">
      <p className="text-xs uppercase tracking-[0.22em] text-neutral-500">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
    </div>
  );
}

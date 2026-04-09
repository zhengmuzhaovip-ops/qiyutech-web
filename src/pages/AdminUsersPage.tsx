import { useEffect, useMemo, useState } from 'react';
import { ButtonLink } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import {
  deleteAdminUser,
  fetchAdminUsers,
  updateAdminUserCustomPricing,
  type AdminUser,
} from '../lib/admin';

const roleOptions = ['', 'user', 'admin'];

export default function AdminUsersPage() {
  const { token } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [pricingToggleUserId, setPricingToggleUserId] = useState<string | null>(null);
  const [error, setError] = useState('');

  async function refreshUsers(active = true) {
    if (!token) return;

    const nextUsers = await fetchAdminUsers(token, {
      search: search.trim() || undefined,
      role: roleFilter || undefined,
    });

    if (!active) return;
    setUsers(nextUsers);
  }

  useEffect(() => {
    if (!token) return;

    let active = true;
    setIsLoading(true);

    refreshUsers(active)
      .then(() => {
        if (!active) return;
        setError('');
      })
      .catch((loadError) => {
        if (!active) return;
        setError(loadError instanceof Error ? loadError.message : '无法加载用户列表。');
      })
      .finally(() => {
        if (!active) return;
        setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [token, search, roleFilter]);

  async function handleDeleteUser(user: AdminUser) {
    if (!token || user.role === 'admin') return;

    const confirmed = window.confirm(`确认删除用户“${user.name || user.email}”吗？`);
    if (!confirmed) return;

    try {
      setDeletingUserId(user.id);
      await deleteAdminUser(token, user.id);
      await refreshUsers();
      setError('');
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : '无法删除这个用户。');
    } finally {
      setDeletingUserId(null);
    }
  }

  async function handleToggleCustomPricing(user: AdminUser, enabled: boolean) {
    if (!token || user.role === 'admin') return;

    const confirmed = window.confirm(
      enabled
        ? `确认把“${user.name || user.email}”加入专属价格名单吗？`
        : `确认把“${user.name || user.email}”移出专属价格名单吗？移出后该用户现有专属价格会一并清除。`,
    );

    if (!confirmed) return;

    try {
      setPricingToggleUserId(user.id);
      await updateAdminUserCustomPricing(token, user.id, enabled);
      await refreshUsers();
      setError('');
    } catch (toggleError) {
      setError(toggleError instanceof Error ? toggleError.message : '无法更新专属价格状态。');
    } finally {
      setPricingToggleUserId(null);
    }
  }

  const summary = useMemo(
    () => ({
      total: users.length,
      admins: users.filter((user) => user.role === 'admin').length,
      enabledPricing: users.filter((user) => user.hasCustomPricing).length,
    }),
    [users],
  );

  return (
    <div className="space-y-6">
      <section className="rounded-[1.9rem] border border-white/10 bg-white/[0.03] px-5 py-6 sm:px-6 sm:py-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-neutral-500">用户管理</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">客户账户中心</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-neutral-400">
              先在用户页决定谁可以使用专属价格，再进入专属价格页面做具体商品价格维护，整个流程会更清晰。
            </p>
          </div>

          <ButtonLink
            to="/admin/users/pricing"
            variant="secondary"
            className="w-full sm:w-auto sm:px-6"
          >
            查看专属价格页
          </ButtonLink>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <SummaryCard label="当前用户数" value={String(summary.total)} />
        <SummaryCard label="管理员账户" value={String(summary.admins)} />
        <SummaryCard label="已开专属价" value={String(summary.enabledPricing)} />
      </section>

      <section className="rounded-[1.9rem] border border-white/10 bg-black/40 p-4 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <label className="flex min-w-[240px] flex-1 flex-col gap-2 text-xs uppercase tracking-[0.18em] text-neutral-500">
            搜索
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="姓名、邮箱或手机号"
              className="h-11 rounded-[1rem] border border-white/10 bg-black px-4 text-sm normal-case tracking-normal text-white outline-none placeholder:text-neutral-500"
            />
          </label>

          <label className="flex min-w-[170px] flex-col gap-2 text-xs uppercase tracking-[0.18em] text-neutral-500">
            账户角色
            <select
              value={roleFilter}
              onChange={(event) => setRoleFilter(event.target.value)}
              className="h-11 rounded-[1rem] border border-white/10 bg-black px-4 text-sm normal-case tracking-normal text-white outline-none"
            >
              {roleOptions.map((role) => (
                <option key={role || 'all'} value={role}>
                  {role ? (role === 'admin' ? '管理员' : '用户') : '全部'}
                </option>
              ))}
            </select>
          </label>
        </div>

        {error ? (
          <div className="mt-4 rounded-[1rem] border border-red-500/30 bg-red-950/20 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        ) : null}

        <div className="mt-5 overflow-hidden rounded-[1.4rem] border border-white/10">
          <div className="hidden grid-cols-[1.1fr,1fr,0.95fr,1.1fr,1fr] gap-4 border-b border-white/10 bg-white/[0.03] px-5 py-4 text-xs uppercase tracking-[0.18em] text-neutral-500 lg:grid">
            <span>用户</span>
            <span>联系方式</span>
            <span>角色 / 专属价</span>
            <span>公司 / 地址</span>
            <span>操作</span>
          </div>

          {isLoading ? (
            <div className="px-5 py-6 text-sm text-neutral-400">正在加载用户数据...</div>
          ) : users.length === 0 ? (
            <div className="px-5 py-6 text-sm text-neutral-400">当前没有匹配的用户。</div>
          ) : (
            <div className="divide-y divide-white/10">
              {users.map((user) => {
                const isTogglingPricing = pricingToggleUserId === user.id;
                const isDeleting = deletingUserId === user.id;

                return (
                  <div
                    key={user.id}
                    className="grid gap-4 px-5 py-5 lg:grid-cols-[1.1fr,1fr,0.95fr,1.1fr,1fr] lg:items-start"
                  >
                    <div className="space-y-3">
                      <p className="text-base font-medium text-white">{user.name}</p>
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">注册时间</p>
                        <p className="mt-1 text-sm text-neutral-400">
                          {user.createdAt
                            ? new Date(user.createdAt).toLocaleString('zh-CN', {
                                dateStyle: 'medium',
                                timeStyle: 'short',
                              })
                            : '暂无'}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm text-neutral-300">
                      <p className="break-all">{user.email || '暂无邮箱'}</p>
                      <p>{user.phone || '暂无手机号'}</p>
                    </div>

                    <div className="space-y-3">
                      <span className="inline-flex rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-neutral-300">
                        {user.role === 'admin' ? '管理员' : '用户'}
                      </span>
                      <div>
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs uppercase tracking-[0.18em] ${
                            user.hasCustomPricing
                              ? 'border border-emerald-400/20 bg-emerald-500/10 text-emerald-300'
                              : 'border border-white/10 bg-white/[0.03] text-neutral-400'
                          }`}
                        >
                          {user.hasCustomPricing ? '已开专属价' : '未开专属价'}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm text-neutral-300">
                      <p>{user.company || '暂无公司信息'}</p>
                      <p className="leading-6 text-neutral-400">{user.addressLine}</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {user.role !== 'admin' ? (
                        <>
                          {user.hasCustomPricing ? (
                            <>
                              <ButtonLink
                                to={`/admin/users/pricing?userId=${user.id}`}
                                variant="secondary"
                                className="h-10 px-4 text-sm"
                              >
                                管理专属价
                              </ButtonLink>
                              <button
                                type="button"
                                onClick={() => handleToggleCustomPricing(user, false)}
                                disabled={isTogglingPricing}
                                className="inline-flex h-10 items-center justify-center rounded-[0.95rem] border border-white/10 bg-white/[0.03] px-4 text-sm text-neutral-200 transition hover:border-white/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                {isTogglingPricing ? '处理中...' : '移出专属价'}
                              </button>
                            </>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleToggleCustomPricing(user, true)}
                              disabled={isTogglingPricing}
                              className="inline-flex h-10 items-center justify-center rounded-[0.95rem] border border-emerald-400/20 bg-emerald-500/10 px-4 text-sm text-emerald-200 transition hover:bg-emerald-500/15 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {isTogglingPricing ? '处理中...' : '加入专属价'}
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handleDeleteUser(user)}
                            disabled={isDeleting}
                            className="inline-flex h-10 items-center justify-center rounded-[0.95rem] border border-red-500/25 bg-red-500/10 px-4 text-sm text-red-200 transition hover:bg-red-500/15 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {isDeleting ? '删除中...' : '删除用户'}
                          </button>
                        </>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
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

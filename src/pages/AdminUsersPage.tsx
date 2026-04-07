import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchAdminUsers, type AdminUser } from '../lib/admin';

const roleOptions = ['', 'user', 'admin'];

export default function AdminUsersPage() {
  const { token } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) return;

    let active = true;
    setIsLoading(true);

    fetchAdminUsers(token, {
      search: search.trim() || undefined,
      role: roleFilter || undefined,
    })
      .then((nextUsers) => {
        if (!active) return;
        setUsers(nextUsers);
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

  const summary = useMemo(
    () => ({
      total: users.length,
      admins: users.filter((user) => user.role === 'admin').length,
      active: users.filter((user) => user.isActive).length,
    }),
    [users],
  );

  return (
    <div className="space-y-6">
      <section className="rounded-[1.9rem] border border-white/10 bg-white/[0.03] px-5 py-6 sm:px-6 sm:py-7">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-neutral-500">用户管理</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">客户账户中心</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-neutral-400">
          查看当前注册客户、管理员账号与联系方式，为后续专属报价和订单服务做准备。
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <SummaryCard label="当前列表人数" value={String(summary.total)} />
        <SummaryCard label="管理员人数" value={String(summary.admins)} />
        <SummaryCard label="启用账号" value={String(summary.active)} />
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
            账号角色
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
          <div className="hidden grid-cols-[1.1fr,1fr,0.75fr,1.1fr,0.7fr] gap-4 border-b border-white/10 bg-white/[0.03] px-5 py-4 text-xs uppercase tracking-[0.18em] text-neutral-500 lg:grid">
            <span>用户</span>
            <span>联系方式</span>
            <span>角色</span>
            <span>公司 / 地址</span>
            <span>状态</span>
          </div>

          {isLoading ? (
            <div className="px-5 py-6 text-sm text-neutral-400">正在加载用户数据...</div>
          ) : users.length === 0 ? (
            <div className="px-5 py-6 text-sm text-neutral-400">当前没有匹配的用户。</div>
          ) : (
            <div className="divide-y divide-white/10">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="grid gap-4 px-5 py-5 lg:grid-cols-[1.1fr,1fr,0.75fr,1.1fr,0.7fr] lg:items-start"
                >
                  <div>
                    <p className="text-base font-medium text-white">{user.name}</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.18em] text-neutral-500">
                      注册时间
                    </p>
                    <p className="mt-1 text-sm text-neutral-400">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleString('en-US', {
                            dateStyle: 'medium',
                            timeStyle: 'short',
                          })
                        : '暂无'}
                    </p>
                  </div>

                  <div className="space-y-2 text-sm text-neutral-300">
                    <p className="break-all">{user.email || '暂无邮箱'}</p>
                    <p>{user.phone || '暂无手机号'}</p>
                  </div>

                  <div>
                    <span className="inline-flex rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-neutral-300">
                      {user.role === 'admin' ? '管理员' : '用户'}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm text-neutral-300">
                    <p>{user.company || '暂无公司信息'}</p>
                    <p className="leading-6 text-neutral-400">{user.addressLine}</p>
                  </div>

                  <div>
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs uppercase tracking-[0.18em] ${
                        user.isActive
                          ? 'border border-emerald-400/20 bg-emerald-500/10 text-emerald-300'
                          : 'border border-neutral-500/20 bg-neutral-500/10 text-neutral-400'
                      }`}
                    >
                      {user.isActive ? '启用中' : '已停用'}
                    </span>
                  </div>
                </div>
              ))}
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

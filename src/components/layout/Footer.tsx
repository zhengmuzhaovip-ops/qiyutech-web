import { siteSettings } from '../../data/site';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#0b0b0b]">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-7 lg:px-8 lg:py-8">
        <section className="group relative overflow-hidden rounded-[1.45rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.015))] px-4 py-5 sm:px-5 sm:py-5 lg:px-6 lg:py-4">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,211,159,0.09),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(74,141,255,0.09),transparent_34%)] opacity-80 transition duration-500 group-hover:opacity-100" />
          <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(56,211,159,0.8),rgba(74,141,255,0.8),transparent)] opacity-75 transition duration-500 group-hover:inset-x-6 group-hover:opacity-100" />

          <div className="relative flex flex-col gap-5 lg:hidden">
            <FooterBrand />

            <div className="grid min-w-0 gap-2.5 sm:grid-cols-2">
              <FooterRail
                label="Email"
                value={siteSettings.email}
                href={`mailto:${siteSettings.email}`}
              />
              <FooterRail
                label="Phone (USA)"
                value={siteSettings.phoneUs}
                href={`tel:${siteSettings.phoneUs.replace(/[^\d+]/g, '')}`}
              />
              <FooterRail
                label="Phone (China)"
                value={siteSettings.phoneChina}
                href={`tel:${siteSettings.phoneChina.replace(/[^\d+]/g, '')}`}
              />
              <FooterRail label="Office" value={siteSettings.address} />
            </div>
          </div>

          <div className="relative hidden lg:grid lg:grid-cols-[290px,minmax(0,390px),250px] lg:items-center lg:justify-between lg:gap-5 xl:grid-cols-[320px,minmax(0,420px),280px] xl:gap-6">
            <FooterBrand compact />

            <div className="min-w-0 rounded-[1.15rem] border border-white/10 bg-black/22 px-3 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
              <div className="grid min-w-0 grid-cols-2 gap-2.5">
                <DesktopFooterRail
                  label="Email"
                  value={siteSettings.email}
                  href={`mailto:${siteSettings.email}`}
                />
                <DesktopFooterRail
                  label="Phone (USA)"
                  value={siteSettings.phoneUs}
                  href={`tel:${siteSettings.phoneUs.replace(/[^\d+]/g, '')}`}
                />
                <DesktopFooterRail
                  label="Phone (China)"
                  value={siteSettings.phoneChina}
                  href={`tel:${siteSettings.phoneChina.replace(/[^\d+]/g, '')}`}
                />
                <DesktopFooterRail label="Office" value={siteSettings.address} />
              </div>
            </div>

            <FooterSupportPanel compact />
          </div>
        </section>

        <div className="mt-3 flex flex-col gap-2 text-[11px] text-neutral-500 sm:flex-row sm:items-center sm:justify-between sm:text-xs">
          <p>{siteSettings.footerCopyright}</p>
          <p>Phone (USA) and Phone (China) remain available for direct wholesale contact.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterBrand({ compact = false }: { compact?: boolean }) {
  return (
    <div className="min-w-0">
      <div className="flex items-center gap-3.5">
        <img
          src="/images/logo-new-4-8.png"
          alt={`${siteSettings.brandName} logo`}
          className={`${compact ? 'h-11 w-11' : 'h-12 w-12'} shrink-0 object-contain drop-shadow-[0_0_18px_rgba(72,168,255,0.18)]`}
        />
        <div className="min-w-0">
          <p
            className={`${compact ? 'text-[0.98rem]' : 'text-[1.02rem]'} font-semibold uppercase tracking-[0.14em] text-white`}
          >
            {siteSettings.brandName}
          </p>
          <p className="mt-1 text-[11px] uppercase tracking-[0.24em] text-[#38d39f]">
            Wholesale Contact Desk
          </p>
        </div>
      </div>

      <p
        className={`${compact ? 'mt-3 max-w-[290px] text-[13px] leading-6' : 'mt-3 max-w-md text-sm leading-6'} text-neutral-300`}
      >
        Direct contact for reorders, pricing follow-up, and coordinated U.S. and China support.
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        <FooterPill label="U.S. wholesale" />
        <FooterPill label="Fast reorders" />
        <FooterPill label="China support" />
      </div>
    </div>
  );
}

function FooterRail({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href?: string;
}) {
  const valueNode = href ? (
    <a href={href} className="block text-sm leading-5 text-neutral-100 transition hover:text-white">
      {value}
    </a>
  ) : (
    <span className="block text-sm leading-5 text-neutral-100">{value}</span>
  );

  return (
    <div className="rounded-[0.9rem] border border-white/8 bg-black/24 px-3.5 py-2 transition duration-300 hover:-translate-y-[2px] hover:border-white/16 hover:bg-white/[0.05]">
      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-neutral-500">
        {label}
      </p>
      <div className="mt-1 min-h-[1.65rem] break-words">{valueNode}</div>
    </div>
  );
}

function DesktopFooterRail({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href?: string;
}) {
  const valueNode = href ? (
    <a
      href={href}
      className="block text-[14px] leading-5 text-neutral-100 transition hover:text-white xl:text-[15px]"
    >
      {value}
    </a>
  ) : (
    <span className="block text-[14px] leading-5 text-neutral-100 xl:text-[15px]">{value}</span>
  );

  return (
    <div className="rounded-[0.95rem] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.035),rgba(255,255,255,0.01))] px-3 py-2.5 transition duration-300 hover:-translate-y-[2px] hover:border-white/16 hover:bg-white/[0.05]">
      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-neutral-500">
        {label}
      </p>
      <div className="mt-2 min-h-[2.1rem] break-words">{valueNode}</div>
    </div>
  );
}

function FooterSupportPanel({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`${compact ? 'px-4 py-3.5' : 'px-4 py-4'} rounded-[1.1rem] border border-white/10 bg-black/30`}
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-neutral-500">
        Support Window
      </p>
      <p className={`${compact ? 'mt-2 max-w-[220px] text-[13px] leading-6' : 'mt-2 text-sm leading-6'} text-neutral-200`}>
        Pricing, reorders, and account follow-up through one direct contact flow.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <FooterMicroPill label="Fast reply" />
        <FooterMicroPill label="Trade support" />
      </div>
    </div>
  );
}

function FooterPill({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[10px] font-medium text-neutral-300">
      {label}
    </span>
  );
}

function FooterMicroPill({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] font-medium text-neutral-300">
      {label}
    </span>
  );
}

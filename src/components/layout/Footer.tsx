import { siteSettings } from '../../data/site';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 md:grid-cols-3">
        <div>
          <p className="text-lg font-semibold text-white">{siteSettings.brandName}</p>
          <p className="mt-3 max-w-sm text-sm leading-6 text-neutral-400">
            Professional product presentation with a lightweight ordering flow for a focused catalog.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500">Contact</p>
          <div className="mt-4 space-y-2 text-sm text-neutral-300">
            <p>{siteSettings.phone}</p>
            <p>{siteSettings.email}</p>
            <p>{siteSettings.address}</p>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500">Sales</p>
          <div className="mt-4 space-y-2 text-sm text-neutral-300">
            <a href={siteSettings.whatsappUrl} target="_blank" rel="noreferrer" className="block hover:text-white">
              WhatsApp: {siteSettings.whatsapp}
            </a>
            <a href={`mailto:${siteSettings.email}`} className="block hover:text-white">
              Email sales team
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-6 py-4 text-center text-xs text-neutral-500">
        {siteSettings.footerCopyright}
      </div>
    </footer>
  );
}

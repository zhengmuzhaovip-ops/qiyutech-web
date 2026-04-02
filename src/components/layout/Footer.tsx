import { siteSettings } from '../../data/site';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-8 md:grid-cols-3 md:gap-10 md:py-12">
        <div>
          <p className="text-lg font-semibold text-white">{siteSettings.brandName}</p>
          <p className="mt-2 max-w-sm text-sm leading-6 text-neutral-400 md:mt-3">
            Wholesale supply for U.S. retail partners, with dependable ordering, trade support, and store delivery coordination.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500">Contact</p>
          <div className="mt-3 space-y-1.5 text-sm text-neutral-300 md:mt-4 md:space-y-2">
            <p>{siteSettings.phone}</p>
            <p>{siteSettings.email}</p>
            <p>{siteSettings.address}</p>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500">Trade Support</p>
          <div className="mt-3 space-y-1.5 text-sm text-neutral-300 md:mt-4 md:space-y-2">
            <a href={siteSettings.whatsappUrl} target="_blank" rel="noreferrer" className="block hover:text-white">
              WhatsApp: {siteSettings.whatsapp}
            </a>
            <a href={`mailto:${siteSettings.email}`} className="block hover:text-white">
              Contact wholesale team
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-6 py-3 text-center text-xs text-neutral-500 md:py-4">
        {siteSettings.footerCopyright}
      </div>
    </footer>
  );
}

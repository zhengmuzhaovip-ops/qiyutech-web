import { useLanguage } from '../context/LanguageContext';

export default function LanguageSwitch() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1 bg-white/5 rounded-full p-1 border border-white/10">
      <button
        onClick={() => setLanguage('en')}
        className={`px-3 py-1.5 rounded-full text-xs font-body font-semibold transition-all duration-300 ${
          language === 'en'
            ? 'bg-brand-red text-white'
            : 'text-white/60 hover:text-white'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage('zh')}
        className={`px-3 py-1.5 rounded-full text-xs font-body font-semibold transition-all duration-300 ${
          language === 'zh'
            ? 'bg-brand-red text-white'
            : 'text-white/60 hover:text-white'
        }`}
      >
        中文
      </button>
    </div>
  );
}

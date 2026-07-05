import { useState, useCallback, useEffect, useRef } from 'react';
import Icon from '@/components/ui/icon';
import {
  generateApplicant,
  rollAttack,
  CURRENT_DATE,
  type Applicant,
  type Document,
} from '@/lib/game';

type Verdict = 'ALLOW' | 'DENY';
type LifeState = 'alive' | 'dead';

const RULES = [
  'Гражданам Трудоградов — паспорт Трудоградов.',
  'Иностранцам — загранпаспорт.',
  'Гражданам Zɫatogrady — загранпаспорт + виза.',
  'Отказ: код паспорта не типовой. Формула: 2 случайные цифры + код страны + день рождения (2 цифры) + случайная буква.',
  'Отказ: код человека не типовой. Формула: 2 случайные цифры + 2 случайные латинские буквы + случайная цифра + случайная буква.',
  'Отказ: ВТОРЫЕ цифры в коде паспорта (после кода страны, из дня рождения) ≠ день рождения.',
  'Отказ: гражданин Zɫatogrady без визы.',
  'Внимание: около 5% посетителей — нападающие. Успей нажать "ОГОНЬ НА ПОРАЖЕНИЕ".',
];

const ATTACK_SECONDS = 3;

const DocumentCard = ({ doc }: { doc: Document }) => (
  <div className="animate-doc-in bg-[#f4f1ea] border-2 border-[#8a8578] shadow-[6px_8px_0_rgba(0,0,0,0.18)] p-5 -rotate-[0.6deg]">
    <div className="flex items-center gap-2 border-b-2 border-[#8a8578] pb-2 mb-3">
      <div className="w-6 h-6 rounded-full border-2 border-[#6b3b2e] flex items-center justify-center">
        <Icon name="Shield" size={13} className="text-[#6b3b2e]" />
      </div>
      <h3 className="font-display font-600 tracking-wider text-[#2c2a26] text-sm">
        {doc.title}
      </h3>
    </div>
    <div className="space-y-1.5">
      {doc.lines.map((line) => (
        <div key={line.label} className="flex justify-between gap-4 text-[13px]">
          <span className="font-body text-[#6f6a5e] uppercase tracking-wide text-[11px] pt-0.5">
            {line.label}
          </span>
          <span className="font-mono font-500 text-[#1f1d1a] text-right">
            {line.value}
          </span>
        </div>
      ))}
    </div>
  </div>
);

const Index = () => {
  const [applicant, setApplicant] = useState<Applicant>(() => generateApplicant());
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [correct, setCorrect] = useState<boolean | null>(null);
  const [stats, setStats] = useState({ total: 0, right: 0 });
  const [showRules, setShowRules] = useState(false);

  const [life, setLife] = useState<LifeState>('alive');
  const [isAttack, setIsAttack] = useState(false);
  const [survived, setSurvived] = useState(false);
  const [timeLeft, setTimeLeft] = useState(ATTACK_SECONDS);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Проверяем нападение при появлении нового посетителя
  useEffect(() => {
    if (rollAttack()) {
      setIsAttack(true);
      setSurvived(false);
      setTimeLeft(ATTACK_SECONDS);
    }
    return () => clearTimer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applicant]);

  // Тикающий таймер нападения
  useEffect(() => {
    if (!isAttack || survived) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearTimer();
          setLife('dead');
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearTimer();
  }, [isAttack, survived, clearTimer]);

  const fire = useCallback(() => {
    if (!isAttack || survived || life === 'dead') return;
    clearTimer();
    setSurvived(true);
    setIsAttack(false);
    setTimeout(() => setSurvived(false), 2000);
  }, [isAttack, survived, life, clearTimer]);

  const decide = useCallback(
    (v: Verdict) => {
      if (verdict || isAttack || life === 'dead') return;
      const isRight = (v === 'ALLOW') === applicant.shouldAllow;
      setVerdict(v);
      setCorrect(isRight);
      setStats((s) => ({ total: s.total + 1, right: s.right + (isRight ? 1 : 0) }));
    },
    [verdict, applicant, isAttack, life],
  );

  const next = useCallback(() => {
    setApplicant(generateApplicant());
    setVerdict(null);
    setCorrect(null);
    setIsAttack(false);
    setSurvived(false);
  }, []);

  const restart = useCallback(() => {
    setLife('alive');
    setStats({ total: 0, right: 0 });
    next();
  }, [next]);

  if (life === 'dead') {
    return (
      <div className="min-h-screen bg-[#1a1b1d] font-body text-[#e8e6e1] flex flex-col items-center justify-center px-6 animate-fade-in">
        <Icon name="Skull" size={56} className="text-[#8a2b22] mb-4" />
        <h1 className="font-display text-3xl tracking-widest text-[#8a2b22] mb-2">
          ИНСПЕКТОР ПОГИБ
        </h1>
        <p className="font-mono text-[13px] text-[#a9a69e] mb-8 text-center max-w-sm">
          Вы не успели отреагировать на нападение. Смена окончена.
        </p>
        <div className="font-mono text-[12px] text-[#7c7a73] mb-6">
          Верных решений за смену: <span className="text-[#e8e6e1]">{stats.right} / {stats.total}</span>
        </div>
        <button
          onClick={restart}
          className="flex items-center gap-2 bg-[#3a3d43] hover:bg-[#474a51] active:scale-[0.98] transition-all px-6 py-4 rounded-sm font-display tracking-widest shadow-[0_5px_0_#26282c]"
        >
          <Icon name="RotateCcw" size={18} />
          НАЧАТЬ НОВУЮ СМЕНУ
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen booth-bg font-body text-[#e8e6e1] flex flex-col">
      {/* Верхняя панель */}
      <header className="border-b-4 border-[#2a2c30] bg-[#33353a]/80 backdrop-blur px-6 py-4 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-sm bg-[#6b3b2e] flex items-center justify-center shadow-inner">
            <Icon name="Stamp" size={22} className="text-[#f4f1ea]" />
          </div>
          <div>
            <h1 className="font-display text-xl tracking-widest font-600 leading-none">
              ПОГРАНИЧНЫЙ КОНТРОЛЬ
            </h1>
            <p className="font-mono text-[11px] text-[#a9a69e] tracking-wide mt-0.5">
              Аэропорт · Большой Город · Трудограды
            </p>
          </div>
        </div>
        <div className="flex items-center gap-5 font-mono text-[12px]">
          <div className="text-right">
            <p className="text-[#a9a69e] text-[10px] uppercase">Дата</p>
            <p className="text-[#e8e6e1] tracking-wider">{CURRENT_DATE}</p>
          </div>
          <div className="text-right">
            <p className="text-[#a9a69e] text-[10px] uppercase">Верно</p>
            <p className="tracking-wider">
              <span className="text-[#7fb069]">{stats.right}</span>
              <span className="text-[#6f6a5e]"> / {stats.total}</span>
            </p>
          </div>
          <button
            onClick={() => setShowRules((s) => !s)}
            className="flex items-center gap-1.5 border border-[#5a5d63] hover:border-[#8a8d93] px-3 py-2 rounded-sm transition-colors"
          >
            <Icon name="BookOpen" size={15} />
            Устав
          </button>
        </div>
      </header>

      {/* Устав */}
      {showRules && (
        <div className="bg-[#2a2c30] border-b-2 border-[#1c1e21] px-6 py-4 animate-fade-in">
          <h2 className="font-display tracking-widest text-[#c9a24b] text-sm mb-2 flex items-center gap-2">
            <Icon name="ScrollText" size={16} /> ИНСТРУКЦИЯ ИНСПЕКТОРА
          </h2>
          <ul className="grid md:grid-cols-2 gap-x-8 gap-y-1 font-mono text-[12px] text-[#c4c1ba]">
            {RULES.map((r, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-[#6b3b2e]">§{i + 1}</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Оверлей нападения */}
      {isAttack && (
        <div className="fixed inset-0 z-50 bg-[#8a2b22]/95 backdrop-blur-sm flex flex-col items-center justify-center px-6 animate-fade-in">
          <Icon name="TriangleAlert" size={48} className="text-[#f4f1ea] mb-4 animate-pulse" />
          <h2 className="font-display text-3xl tracking-widest text-[#f4f1ea] mb-2 text-center">
            НАПАДЕНИЕ!
          </h2>
          <p className="font-mono text-[13px] text-[#f4d9d5] mb-6 text-center max-w-sm">
            Посетитель достал оружие. У вас есть {timeLeft} сек, чтобы открыть огонь на поражение.
          </p>
          <div className="font-display text-6xl font-700 text-[#f4f1ea] mb-8 tabular-nums">
            {timeLeft}
          </div>
          <button
            onClick={fire}
            className="flex items-center gap-3 bg-[#1f1d1a] hover:bg-[#2c2a26] active:scale-[0.97] transition-all px-8 py-5 rounded-sm font-display tracking-widest text-xl shadow-[0_6px_0_#000] border-2 border-[#f4f1ea]"
          >
            <Icon name="Crosshair" size={24} className="text-[#c9a24b]" />
            ОГОНЬ НА ПОРАЖЕНИЕ
          </button>
        </div>
      )}

      {/* Уведомление об успешной обороне */}
      {survived && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-[#2f6b3a] border-2 border-[#7fb069] px-6 py-3 rounded-sm font-display tracking-widest text-sm animate-fade-in shadow-lg">
          УГРОЗА НЕЙТРАЛИЗОВАНА
        </div>
      )}

      {/* Рабочий стол */}
      <main className="relative flex-1 flex flex-col items-center px-6 py-8">
        {/* Табельное оружие на столе (декор) */}
        <div className="pointer-events-none select-none hidden lg:flex flex-col items-center absolute bottom-8 right-8 opacity-90">
          <div className="bg-[#3a3d43] border border-[#26282c] rounded-sm px-3 py-2 shadow-[4px_6px_0_rgba(0,0,0,0.25)] rotate-[8deg]">
            <div className="flex items-center gap-1.5">
              <Icon name="Crosshair" size={26} className="text-[#c9a24b]" />
              <div className="w-14 h-3 bg-[#1f1d1a] rounded-sm" />
              <div className="w-3 h-6 bg-[#1f1d1a] rounded-sm" />
            </div>
          </div>
          <p className="mt-1 font-mono text-[9px] tracking-widest text-[#7c7a73] rotate-[8deg]">
            ТАБЕЛЬНОЕ · ПМ
          </p>
        </div>

        <div className="mb-6 text-center">
          <p className="font-mono text-[12px] text-[#a9a69e] uppercase tracking-widest">
            Следующий посетитель
          </p>
          <p className="font-display text-2xl tracking-wider text-[#f4f1ea]">
            Гражданин · {applicant.country.name}
          </p>
          <div className="mt-3 inline-flex items-start gap-2 max-w-md text-left bg-[#2a2c30]/70 border border-[#4a4d52] rounded-sm px-4 py-2 animate-fade-in">
            <Icon name="MessageSquare" size={15} className="text-[#c9a24b] mt-0.5 shrink-0" />
            <div>
              <p className="font-body text-[13px] text-[#e8e6e1] italic">
                «{applicant.greeting}»
                <span className="not-italic text-[#7c7a73] font-mono text-[10px] ml-2">
                  / {applicant.greetingLang}
                </span>
              </p>
              {applicant.greetingTranslation && (
                <p className="font-body text-[11px] text-[#8f8c84] mt-0.5">
                  {applicant.greetingTranslation}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Документы на столе */}
        <div className="relative">
          <div className="grid sm:grid-cols-2 gap-6 max-w-3xl">
            {applicant.documents.map((doc, i) => (
              <DocumentCard key={i} doc={doc} />
            ))}
          </div>

          {/* Штамп поверх документов */}
          {verdict && (
            <div
              className={`absolute top-1/2 left-1/2 animate-stamp pointer-events-none select-none border-[5px] px-6 py-3 font-display tracking-widest text-2xl font-700 ${
                verdict === 'ALLOW'
                  ? 'border-[#2f6b3a] text-[#2f6b3a]'
                  : 'border-[#8a2b22] text-[#8a2b22]'
              }`}
              style={{ backgroundColor: 'rgba(244,241,234,0.55)' }}
            >
              {verdict === 'ALLOW' ? 'ВЪЕЗД РАЗРЕШЁН' : 'ВЪЕЗД ЗАПРЕЩЁН'}
            </div>
          )}
        </div>

        {/* Панель решения */}
        <div className="mt-10 w-full max-w-3xl">
          {!verdict ? (
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => decide('ALLOW')}
                className="group flex items-center justify-center gap-3 bg-[#2f6b3a] hover:bg-[#37803f] active:scale-[0.98] transition-all py-5 rounded-sm font-display tracking-widest text-lg shadow-[0_6px_0_#1f4a28]"
              >
                <Icon name="Check" size={22} />
                РАЗРЕШИТЬ ВЪЕЗД
              </button>
              <button
                onClick={() => decide('DENY')}
                className="group flex items-center justify-center gap-3 bg-[#8a2b22] hover:bg-[#a3332a] active:scale-[0.98] transition-all py-5 rounded-sm font-display tracking-widest text-lg shadow-[0_6px_0_#5e1c16]"
              >
                <Icon name="X" size={22} />
                ЗАПРЕТИТЬ ВЪЕЗД
              </button>
            </div>
          ) : (
            <div className="animate-fade-in">
              <div
                className={`flex items-start gap-3 border-l-4 p-4 rounded-sm mb-4 ${
                  correct
                    ? 'border-[#7fb069] bg-[#2f6b3a]/20'
                    : 'border-[#c9584d] bg-[#8a2b22]/20'
                }`}
              >
                <Icon
                  name={correct ? 'CircleCheck' : 'CircleAlert'}
                  size={22}
                  className={correct ? 'text-[#7fb069] mt-0.5' : 'text-[#e08a80] mt-0.5'}
                />
                <div>
                  <p className="font-display tracking-wider text-sm">
                    {correct ? 'ВЕРНОЕ РЕШЕНИЕ' : 'ОШИБКА ИНСПЕКТОРА'}
                  </p>
                  <p className="font-mono text-[12px] text-[#c4c1ba] mt-1">
                    {applicant.reason}
                  </p>
                </div>
              </div>
              <button
                onClick={next}
                className="w-full flex items-center justify-center gap-2 bg-[#3a3d43] hover:bg-[#474a51] active:scale-[0.99] transition-all py-4 rounded-sm font-display tracking-widest shadow-[0_5px_0_#26282c]"
              >
                СЛЕДУЮЩИЙ ПОСЕТИТЕЛЬ
                <Icon name="ArrowRight" size={18} />
              </button>
            </div>
          )}
        </div>
      </main>

      <footer className="text-center py-4 font-mono text-[10px] text-[#7c7a73] border-t border-[#2a2c30]">
        СЛУЖБА ПОГРАНИЧНОГО КОНТРОЛЯ ТРУДОГРАДОВ · ОТДЕЛ ПРОВЕРКИ ДОКУМЕНТОВ
      </footer>
    </div>
  );
};

export default Index;
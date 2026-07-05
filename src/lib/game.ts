export type CountryKey = 'TG' | 'BS' | 'FS' | 'UE' | 'ZG';

export interface Country {
  key: CountryKey;
  name: string;
  code: string;
}

export const COUNTRIES: Record<CountryKey, Country> = {
  TG: { key: 'TG', name: 'Трудограды', code: 'ТГ' },
  BS: { key: 'BS', name: 'Bierstadte', code: 'BS' },
  FS: { key: 'FS', name: 'Fredomsities', code: 'FS' },
  UE: { key: 'UE', name: 'United Empire', code: 'UE' },
  ZG: { key: 'ZG', name: 'Zɫatogrady', code: 'ZG' },
};

export const CURRENT_DATE = '01.06.1980';

const RU_NAMES = ['Иван Петров', 'Анна Смирнова', 'Пётр Волков', 'Мария Козлова', 'Сергей Орлов', 'Ольга Белова', 'Дмитрий Зайцев', 'Елена Кузнецова'];
const EN_NAMES = ['John Smith', 'Emma Brown', 'Karl Weber', 'Anna Fischer', 'Lucas Meyer', 'Sofia Wagner', 'Otto Braun', 'Nina Koch'];
const REASONS = ['туризм', 'работа', 'учёба', 'визит к семье', 'бизнес'];
const LETTERS = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
const DIGITS = '0123456789';

const rnd = (arr: string) => arr[Math.floor(Math.random() * arr.length)];
const rndItem = <T>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
const pad2 = (n: number) => String(n).padStart(2, '0');

// Приветственные фразы въезжающих (косметика). weight — вероятность языка в %.
interface Phrase { weight: number; text: string; lang: string; }
const GREETINGS: Record<CountryKey, Phrase[]> = {
  TG: [
    { weight: 85, lang: 'русский', text: 'Здравствуйте, товарищ инспектор!' },
    { weight: 5, lang: 'литовский', text: 'Sveiki, inspektoriau!' },
    { weight: 4, lang: 'украинский', text: 'Доброго дня, пане інспекторе!' },
    { weight: 4, lang: 'белорусский', text: 'Добры дзень, спадар інспектар!' },
    { weight: 1, lang: 'бурятский', text: 'Сайн байна, инспектор!' },
  ],
  BS: [{ weight: 100, lang: 'немецкий', text: 'Guten Tag, Herr Inspektor!' }],
  FS: [
    { weight: 80, lang: 'английский', text: 'Good day, inspector!' },
    { weight: 10, lang: 'испанский', text: '¡Buenos días, inspector!' },
    { weight: 5, lang: 'ирландский', text: 'Dia dhuit, a chigire!' },
  ],
  UE: [
    { weight: 80, lang: 'английский', text: 'Good day, officer!' },
    { weight: 10, lang: 'валлийский', text: 'Prynhawn da, arolygydd!' },
    { weight: 5, lang: 'scots', text: 'Guid day tae ye, inspector!' },
    { weight: 5, lang: 'ирландский', text: 'Dia dhuit, a chigire!' },
  ],
  ZG: [
    { weight: 90, lang: 'польский', text: 'Dzień dobry, panie inspektorze!' },
    { weight: 6, lang: 'литовский', text: 'Laba diena, inspektoriau!' },
    { weight: 4, lang: 'латышский', text: 'Labdien, inspektor!' },
  ],
};

function pickGreeting(key: CountryKey): Phrase {
  const list = GREETINGS[key];
  const total = list.reduce((s, p) => s + p.weight, 0);
  let r = Math.random() * total;
  for (const p of list) {
    r -= p.weight;
    if (r <= 0) return p;
  }
  return list[0];
}

function randomDate(minYear: number, maxYear: number): string {
  const day = 1 + Math.floor(Math.random() * 28);
  const month = 1 + Math.floor(Math.random() * 12);
  const year = minYear + Math.floor(Math.random() * (maxYear - minYear + 1));
  return `${pad2(day)}.${pad2(month)}.${year}`;
}

function ageFromBirth(birth: string): number {
  const [d, m, y] = birth.split('.').map(Number);
  const [cd, cm, cy] = CURRENT_DATE.split('.').map(Number);
  let age = cy - y;
  if (cm < m || (cm === m && cd < d)) age -= 1;
  return age;
}

// Код паспорта: 2 цифры + код страны + день рождения(2 цифры) + буква
function passportCode(country: Country, birth: string, corrupt = false): string {
  const dd = corrupt ? pad2(1 + Math.floor(Math.random() * 28)) : birth.split('.')[0];
  return `${rnd(DIGITS)}${rnd(DIGITS)}${country.code}${dd}${rnd(LETTERS)}`;
}

// Код человека: 2 цифры + 2 латинские буквы + цифра + буква
function personCode(): string {
  return `${rnd(DIGITS)}${rnd(DIGITS)}${rnd(LETTERS)}${rnd(LETTERS)}${rnd(DIGITS)}${rnd(LETTERS)}`;
}

export interface DocLine { label: string; value: string; }
export interface Document {
  title: string;
  lines: DocLine[];
}

export interface Applicant {
  country: Country;
  documents: Document[];
  shouldAllow: boolean;
  reason: string;
  greeting: string;
  greetingLang: string;
}

type Flaw = 'none' | 'badPassCode' | 'badPersonCode' | 'birthMismatch' | 'underage' | 'noVisa';

export function generateApplicant(): Applicant {
  const country = rndItem(Object.values(COUNTRIES));
  const isTG = country.key === 'TG';
  const isZG = country.key === 'ZG';

  // выбираем изъян (или его отсутствие)
  const flaws: Flaw[] = ['none', 'none', 'badPassCode', 'birthMismatch', 'underage'];
  if (isZG) flaws.push('noVisa', 'noVisa');
  flaws.push('badPersonCode');
  let flaw = rndItem(flaws);
  // noVisa применимо только к ZG
  if (flaw === 'noVisa' && !isZG) flaw = 'none';

  const underage = flaw === 'underage';
  const birth = underage ? randomDate(1964, 1968) : randomDate(1920, 1961);

  const ruName = rndItem(RU_NAMES);
  const enName = rndItem(EN_NAMES);
  const validUntil = randomDate(1981, 1999);

  const corruptPass = flaw === 'birthMismatch';
  const badPassLen = flaw === 'badPassCode';
  const badPersonLen = flaw === 'badPersonCode';

  let pcode = passportCode(country, birth, corruptPass);
  if (badPassLen) pcode = pcode.slice(0, 4) + '!'; // сломанный формат

  let human = personCode();
  if (badPersonLen) human = human.slice(0, 3); // сломанный формат

  const documents: Document[] = [];

  if (isTG) {
    documents.push({
      title: 'ПАСПОРТ ТРУДОГРАДОВ',
      lines: [
        { label: 'ФИО', value: ruName },
        { label: 'Дата рождения', value: birth },
        { label: 'Действителен до', value: validUntil },
        { label: 'Код паспорта', value: pcode },
        { label: 'Код', value: human },
      ],
    });
  } else {
    documents.push({
      title: `ЗАГРАНПАСПОРТ · ${country.name.toUpperCase()}`,
      lines: [
        { label: 'NS', value: enName },
        { label: 'Date of birth', value: birth },
        { label: 'Valid until', value: validUntil },
        { label: 'Pasport code', value: pcode },
        { label: 'Code', value: human },
      ],
    });
    if (isZG && flaw !== 'noVisa') {
      documents.push({
        title: 'ВИЗА',
        lines: [
          { label: 'ИФ', value: ruName },
          { label: 'Дата рождения', value: birth },
          { label: 'Въезд до', value: randomDate(1981, 1990) },
          { label: 'Код паспорта', value: pcode },
          { label: 'Причина въезда', value: rndItem(REASONS) },
          { label: 'Код', value: human },
        ],
      });
    }
  }

  // определяем правильный ответ
  let shouldAllow = true;
  let reason = 'Все документы в порядке';
  if (badPassLen) { shouldAllow = false; reason = 'Код паспорта не типовой'; }
  else if (badPersonLen) { shouldAllow = false; reason = 'Код человека не типовой'; }
  else if (corruptPass) { shouldAllow = false; reason = 'Цифры в коде паспорта не совпадают с днём рождения'; }
  else if (underage) { shouldAllow = false; reason = 'Гражданин младше 18 лет'; }
  else if (flaw === 'noVisa') { shouldAllow = false; reason = 'Гражданин Zɫatogrady не предъявил визу'; }

  const greeting = pickGreeting(country.key);

  return { country, documents, shouldAllow, reason, greeting: greeting.text, greetingLang: greeting.lang };
}

export { ageFromBirth };
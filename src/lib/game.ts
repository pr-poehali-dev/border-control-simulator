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
interface GreetingPhrase { text: string; translation?: string; }
interface LangGroup { weight: number; lang: string; phrases: GreetingPhrase[]; }
interface PickedGreeting { text: string; translation?: string; lang: string; }

const GREETINGS: Record<CountryKey, LangGroup[]> = {
  TG: [
    {
      weight: 85, lang: 'русский', phrases: [
        { text: 'Ну и болтанка была над горами. Еле посадили эту Тушку.' },
        { text: 'Командир, привет. Трясло — будто в грузовике по просёлку.' },
        { text: 'Пять часов в воздухе. Давай штамп — и я спать.' },
        { text: 'Слушай, начальник, у вас тут буфет работает? С утра не ел.' },
        { text: 'Наконец-то дома! Родной аэропорт, родные лица.' },
        { text: 'Земляк! Дай обниму. Нет? Ну хоть пропусти побыстрее.' },
        { text: 'Приземлились — уже праздник. А проверка — дело святое.' },
        { text: 'А что, какие-то проблемы? Я чист, как стёклышко.' },
        { text: 'Это личные вещи. Сувениры. Ничего запрещённого.' },
        { text: 'В Боинге кондиционер сдох. Так что я немного... того. Но пахнет от меня не контрабандой.' },
        { text: 'Везу только храп соседа в ушах. Это декларировать?' },
      ],
    },
    {
      weight: 5, lang: 'литовский', phrases: [
        { text: 'Laba diena, inspektoriau.', translation: 'Добрый день, инспектор.' },
        { text: 'Skridau iš namų. Ilgas kelias.', translation: 'Летел из дома. Долгий путь.' },
        { text: 'Tas lėktuvas toks senas... Bijojau, kad subyrės.', translation: 'Этот самолёт такой старый... Боялся, что развалится.' },
        { text: 'Aš tik tranzitas. Nieko nevežu.', translation: 'Я только транзит. Ничего не везу.' },
        { text: 'Gal sutarsim?', translation: 'Может договоримся?' },
        { text: 'Čia tik lauknešėliai šeimai.', translation: 'Это только гостинцы семье.' },
      ],
    },
    {
      weight: 4, lang: 'украинский', phrases: [
        { text: 'Здоровенькі були! Летів на старому Ілі. Гарний лайнер, тільки шумний.' },
        { text: 'Начальнику, рідний, ну пропусти. Я додому, до жінки, до борщу.' },
        { text: 'Свої, свої. Втомився — сил нема. Давай штамп, і я пішов.' },
        { text: 'Нема в мене нічого. Хіба що сало в ручній поклажі. Жартую. Чи ні?' },
        { text: 'Літав у справах. Привіз лише недосип і бажання виспатись.' },
        { text: 'Що ви так довго дивитесь? Там усе чисто.' },
      ],
    },
    {
      weight: 4, lang: 'белорусский', phrases: [
        { text: 'Добры дзень, спадар афіцэр. Ляцеў доўгі час, стаміўся.' },
        { text: 'Нічога такога не вязу. Адпачываць ляцеў. Калі ласка, хутчэй.' },
        { text: 'Дакументы? Зараз... Ох, рукі замерзлі. Холадна ў вас у аэрапорце.' },
        { text: 'Здароў, зямляк. Змена цяжкая? У мяне таксама дзянёк — не пазайздросціш.' },
        { text: 'Усё чыста. Бульбу нават не вязу. Слова гонару.' },
        { text: 'Можна прайсці? А то наступны рэйс чакае.' },
      ],
    },
    {
      weight: 1, lang: 'бурятский', phrases: [
        { text: 'Амар сайн, дарга.', translation: 'Здравствуй, начальник.' },
        { text: 'Долго летел, однако. Самолёт железный, но душный.' },
        { text: 'Чемодан? Один. Подарки везу. Ничего такого.' },
        { text: 'Ты не смотри строго, командир. Я человек простой.' },
        { text: 'Чай будешь? У меня с собой есть. В полёте не давали.' },
        { text: 'Всё чисто, однако. Может, печать поставишь?' },
      ],
    },
  ],
  BS: [
    {
      weight: 100, lang: 'немецкий', phrases: [
        { text: 'Guten Tag, Herr Grenzbeamte.', translation: 'Добрый день, господин пограничник.' },
        { text: 'Flug war etwas holprig, aber pünktlich.', translation: 'Полёт был немного тряским, но вовремя.' },
        { text: 'Hier ist mein Pass. Alles in Ordnung.', translation: 'Вот мой паспорт. Всё в порядке.' },
        { text: 'Muss das so lange dauern? Ich habe nur einen Koffer.', translation: 'Это должно так долго длиться? У меня только один чемодан.' },
        { text: 'Typisch. Überall Kontrolle.', translation: 'Типично. Везде контроль.' },
        { text: 'Ich habe nichts zu verzollen. Nur Geschenke.', translation: 'Мне нечего декларировать. Только подарки.' },
        { text: 'Bier und Wurst. Sonst nichts. Zufrieden?', translation: 'Пиво и колбаса. Больше ничего. Довольны?' },
      ],
    },
  ],
  FS: [
    {
      weight: 80, lang: 'английский', phrases: [
        { text: 'Here you are, inspector. Long flight.', translation: 'Держите, инспектор. Долгий перелёт.' },
        { text: 'Just a suitcase full of jet lag and bad coffee.', translation: 'Только чемодан с джетлагом и плохим кофе.' },
        { text: 'Five hours in a tin can. This stamp better be magic.', translation: 'Пять часов в консервной банке. Эта печать должна быть волшебной.' },
        { text: "I swear it's just souvenirs. And maybe some snacks.", translation: 'Клянусь, это просто сувениры. И, может, немного закусок.' },
      ],
    },
    {
      weight: 10, lang: 'испанский', phrases: [
        { text: '¡Por fin, tierra firme!', translation: 'Наконец-то, твёрдая земля!' },
        { text: 'Amigo, solo traigo recuerdos y una botella.', translation: 'Друг, везу только воспоминания и бутылку.' },
        { text: 'No tengo nada. Palabra.', translation: 'Ничего не имею. Слово.' },
        { text: 'Hombre, este avión era más viejo que mi abuela.', translation: 'Боже, этот самолёт был старше моей бабушки.' },
      ],
    },
    {
      weight: 5, lang: 'ирландский', phrases: [
        { text: 'Dia dhuit, a chara!', translation: 'Здравствуй, друг!' },
        { text: 'Níl aon rud agam. Geallaim.', translation: 'Ничего у меня нет. Обещаю.' },
        { text: 'Tá mé tuirseach. Lig dom dul.', translation: 'Я устал. Дай мне пройти.' },
      ],
    },
  ],
  UE: [
    {
      weight: 80, lang: 'английский', phrases: [
        { text: 'Good day, officer. Rather bumpy approach.', translation: 'Добрый день, офицер. Довольно тряский заход на посадку.' },
        { text: 'My passport. Everything should be in order.', translation: 'Мой паспорт. Всё должно быть в порядке.' },
        { text: "Just a short visit. Business, not pleasure, I'm afraid.", translation: 'Короткий визит. Боюсь, по делам, не отдых.' },
        { text: 'I do hope the queue moves faster than the aeroplane.', translation: 'Надеюсь, очередь движется быстрее самолёта.' },
      ],
    },
    {
      weight: 10, lang: 'валлийский', phrases: [
        { text: 'Bore da, syr. Dyma fy mhasport.', translation: 'Доброе утро, сэр. Вот мой паспорт.' },
        { text: "Dim byd i'w ddatgan. Jyst dŵad i weld y wlad.", translation: 'Нечего декларировать. Просто приехал увидеть страну.' },
        { text: "Mae'r awyren 'na'n hen. Ond mae'n hedfan.", translation: 'Этот самолёт старый. Но летает.' },
      ],
    },
    {
      weight: 5, lang: 'scots', phrases: [
        { text: "Aye, here's ma papers. Lang flight.", translation: 'Ага, вот мои документы. Долгий перелёт.' },
        { text: "Och, dinnae fash. Nothin' tae declare.", translation: 'Ох, не беспокойтесь. Нечего декларировать.' },
        { text: 'Jist a wee dram in ma bag. For medicinal purposes.', translation: 'Только глоточек в сумке. В лечебных целях.' },
      ],
    },
    {
      weight: 5, lang: 'ирландский', phrases: [
        { text: 'Dia is Muire duit, a oifigigh.', translation: 'Здравствуй, офицер.' },
        { text: 'Níl tada agam ach tuirse.', translation: 'Ничего у меня нет, кроме усталости.' },
        { text: 'An mbeidh fáilte romham?', translation: 'Меня ждёт тёплый приём?' },
      ],
    },
  ],
  ZG: [
    {
      weight: 90, lang: 'польский', phrases: [
        { text: 'Dzień dobry, panie inspektorze.', translation: 'Добрый день, господин инспектор.' },
        { text: 'Proszę, moje dokumenty. Wszystko w porządku.', translation: 'Пожалуйста, мои документы. Всё в порядке.' },
        { text: 'Nic nie wiozę. Tylko zmęczenie po locie.', translation: 'Ничего не везу. Только усталость после полёта.' },
        { text: 'Ale ta maszyna stara! Czułem każdy wstrząs.', translation: 'Ну и старая машина! Чувствовал каждый толчок.' },
        { text: 'Może jakoś się dogadamy, co?', translation: 'Может как-то договоримся, а?' },
        { text: 'Tylko pamiątki dla rodziny. Nic więcej.', translation: 'Только сувениры для семьи. Ничего больше.' },
      ],
    },
    {
      weight: 6, lang: 'литовский', phrases: [
        { text: 'Laba diena. Pavargau, bet laimingas.', translation: 'Добрый день. Устал, но счастлив.' },
        { text: 'Ar ilgai dar laukti?', translation: 'Долго ещё ждать?' },
      ],
    },
    {
      weight: 4, lang: 'латышский', phrases: [
        { text: 'Labdien, priekšniek.', translation: 'Добрый день, начальник.' },
        { text: 'Nekā nav. Tikai nogurums.', translation: 'Ничего нет. Только усталость.' },
        { text: 'Vai drīkstu iet?', translation: 'Можно идти?' },
      ],
    },
  ],
};

function pickGreeting(key: CountryKey): PickedGreeting {
  const groups = GREETINGS[key];
  const total = groups.reduce((s, g) => s + g.weight, 0);
  let r = Math.random() * total;
  let group = groups[0];
  for (const g of groups) {
    r -= g.weight;
    if (r <= 0) { group = g; break; }
  }
  const phrase = rndItem(group.phrases);
  return { text: phrase.text, translation: phrase.translation, lang: group.lang };
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
  greetingTranslation?: string;
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
          { label: 'ИФ', value: enName },
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

  return {
    country,
    documents,
    shouldAllow,
    reason,
    greeting: greeting.text,
    greetingLang: greeting.lang,
    greetingTranslation: greeting.translation,
  };
}

export { ageFromBirth };
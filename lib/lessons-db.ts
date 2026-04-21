/**
 * Unified Lesson Database
 * Each lesson has ONE unique ID with localized content (Russian and English)
 * 
 * Structure:
 * - lesson_id: unique identifier (lesson_1, lesson_2, etc.)
 * - title_en / title_ru: localized titles
 * - sections: content array with localized text
 */

export interface LessonSection {
  type: 'greeting' | 'heading' | 'paragraph' | 'paragraphs' | 'list'
  title?: string
  content?: string | string[]
  items?: Array<{
    title: string
    description: string
  }>
}

export interface Lesson {
  id: string
  startLesson: number // Original lesson number for mapping
  title_en: string
  title_ru: string
  sections_en: LessonSection[]
  sections_ru: LessonSection[]
}

// Unified lesson database with localized content
export const lessons: Record<string, Lesson> = {
  intro_lesson_1: {
    id: 'intro_lesson_1',
    startLesson: 101,
    title_en: 'What will you get after completing the Genesis Foundation course',
    title_ru: 'Что ты получишь после завершения курса Genesis Foundation',
    sections_en: [
      {
        type: 'greeting',
        content: [
          'Welcome, Pioneer! You\'re about to start an incredible journey into the world of cryptocurrency. This is not just another online course — it\'s your personal guide to becoming confident and knowledgeable in the crypto industry.',
          'Think of this course as building a strong foundation for a house. Without it, everything else will be unstable. With this foundation, you\'ll be ready to face any challenge in the crypto world with confidence and wisdom.'
        ]
      },
      {
        type: 'heading',
        title: 'What Will You Gain From This Course?'
      },
      {
        type: 'list',
        items: [
          {
            title: 'Deep Understanding of Cryptocurrency',
            description: 'You\'ll learn what cryptocurrency really is, not just buzzwords. We\'ll explain blockchain, Bitcoin, and why these technologies matter for the future. No complicated jargon — just clear, honest explanations.'
          },
          {
            title: 'Skills in Safe Handling of Pi and Your Assets',
            description: 'Security is everything in crypto. You\'ll learn how to protect your Pi coins and other digital assets from theft and fraud. These are practical, real-world skills that will protect your money.'
          },
          {
            title: 'Protection From Fraudsters and Scams',
            description: 'The crypto world has scammers. In this course, you\'ll learn to spot red flags, recognize common scams, and protect yourself. Knowledge is your best defense.'
          },
          {
            title: 'A Clear, Structured Curriculum',
            description: 'We\'ve organized everything into 8 logical blocks. Each block builds on the previous one, so you\'ll progress naturally from beginner to confident learner.'
          }
        ]
      }
    ],
    sections_ru: [
      {
        type: 'greeting',
        content: [
          'Добро пожаловать, Пионер! Ты начинаешь невероятное путешествие в мир криптовалют. Это не просто еще один онлайн-курс — это твой личный гид к уверенности и знаниям в крипто-индустрии.',
          'Подумай об этом курсе как о строительстве прочного фундамента дома. Без него всё остальное будет нестабильным. С этим фундаментом ты будешь готов к любому вызову в крипто-мире с уверенностью и мудростью.'
        ]
      },
      {
        type: 'heading',
        title: 'Что ты получишь от этого курса?'
      },
      {
        type: 'list',
        items: [
          {
            title: 'Глубокое понимание криптовалют',
            description: 'Ты узнаешь, что такое криптовалюта на самом деле, не просто модные слова. Мы объясним блокчейн, Биткоин и почему эти технологии важны для будущего. Никакого сложного жаргона — просто ясные, честные объяснения.'
          },
          {
            title: 'Навыки безопасного обращения с Pi и своими активами',
            description: 'Безопасность — это всё в крипто. Ты научишься защищать свои монеты Pi и другие цифровые активы от кражи и мошенничества. Это практические, реальные навыки, которые защитят твои деньги.'
          },
          {
            title: 'Защита от мошенников и скамов',
            description: 'В крипто-мире есть мошенники. В этом курсе ты научишься видеть красные флаги, распознавать распространённые скамы и защищать себя. Знание — лучшая защита.'
          },
          {
            title: 'Чёткая, структурированная программа',
            description: 'Мы организовали всё в 8 логических блоков. Каждый блок строится на предыдущем, поэтому ты будешь развиваться естественно от новичка к уверенному учащемуся.'
          }
        ]
      }
    ]
  },

  lesson_1: {
    id: 'lesson_1',
    startLesson: 1,
    title_en: 'Why Money Is Changing and What Comes Next',
    title_ru: 'Почему деньги меняются и что приходит им на смену',
    sections_en: [
      {
        type: 'greeting',
        content: [
          'Welcome to Lesson 1! You\'re starting a journey that will change your understanding of money.',
          'Let\'s understand how money works and why cryptocurrency is the future.'
        ]
      },
      {
        type: 'heading',
        title: 'How Did Money Appear?'
      },
      {
        type: 'paragraph',
        content: 'Thousands of years ago, people exchanged goods directly — fish for bread, sheep for cloth. But this was inconvenient. What if you wanted bread but only had one sheep? Money solved this problem. It became a common medium of exchange that everyone accepts. First came gold coins, then paper money, now digital currency.'
      }
    ],
    sections_ru: [
      {
        type: 'greeting',
        content: [
          'Добро пожаловать на первый урок! Ты начинаешь путешествие, которое изменит твоё понимание денег.',
          'Давай разберёмся, как работают деньги и почему криптовалюта — это будущее.'
        ]
      },
      {
        type: 'heading',
        title: 'Как появились деньги?'
      },
      {
        type: 'paragraph',
        content: 'Тысячи лет назад люди обменивались товарами напрямую — рыба за хлеб, овцы за ткань. Но это было неудобно. Что если ты хотел хлеб, но у тебя была только одна овца? Деньги решили эту проблему. Они стали общим средством обмена, которое все принимают. Сначала это были золотые монеты, потом бумажные деньги, теперь — цифровые.'
      }
    ]
  },

  lesson_2: {
    id: 'lesson_2',
    startLesson: 2,
    title_en: 'How Cryptocurrency Is Already Changing the World',
    title_ru: 'Как криптовалюта уже меняет мир вокруг нас',
    sections_en: [
      {
        type: 'greeting',
        content: [
          'Welcome to Lesson 2!',
          'Maybe it seems to you that cryptocurrency is something distant and abstract. In reality, it\'s already here and already changing people\'s lives. Let\'s look at real examples.'
        ]
      }
    ],
    sections_ru: [
      {
        type: 'greeting',
        content: [
          'Добро пожаловать на второй урок!',
          'Может быть, тебе кажется, что криптовалюта — это что-то далёкое и абстрактное. На самом деле, она уже здесь и уже меняет жизнь людей. Давай посмотрим на реальные примеры.'
        ]
      }
    ]
  },

  lesson_3: {
    id: 'lesson_3',
    startLesson: 3,
    title_en: 'What Opportunities Crypto Opens for Ordinary People',
    title_ru: 'Какие новые возможности открывает криптовалюта обычному человеку',
    sections_en: [
      {
        type: 'greeting',
        content: [
          'Welcome to Lesson 3!',
          'We already know why cryptocurrency appeared and how it\'s changing the world. Now let\'s look at what cryptocurrency gives you personally.'
        ]
      }
    ],
    sections_ru: [
      {
        type: 'greeting',
        content: [
          'Добро пожаловать на третий урок!',
          'Мы уже знаем, почему появилась криптовалюта и как она меняет мир. Теперь давай посмотрим, что криптовалюта даёт тебе лично.'
        ]
      }
    ]
  },

  lesson_4: {
    id: 'lesson_4',
    startLesson: 4,
    title_en: 'Why Now Is the Best Time to Study Cryptocurrency',
    title_ru: 'Почему именно сейчас — лучшее время изучать криптовалюту',
    sections_en: [
      {
        type: 'greeting',
        content: [
          'Welcome to Lesson 4!',
          'You already know what cryptocurrency is, how it\'s changing the world, and what opportunities it provides. Now the question: why is now the best time to learn?'
        ]
      }
    ],
    sections_ru: [
      {
        type: 'greeting',
        content: [
          'Добро пожаловать на четвёртый урок!',
          'Ты уже знаешь, что такое криптовалюта, как она меняет мир и какие возможности она дарует. Теперь вопрос: почему именно сейчас лучшее время для обучения?'
        ]
      }
    ]
  },

  lesson_5: {
    id: 'lesson_5',
    startLesson: 5,
    title_en: 'Main Risks of the Crypto Market and How to Prepare for Them',
    title_ru: 'Главные риски крипторынка и как к ним подготовиться',
    sections_en: [
      {
        type: 'greeting',
        content: [
          'Welcome to Lesson 5!',
          'We\'ve covered the basics of cryptocurrency. Now it\'s time to talk about what could go wrong. Understanding risks is just as important as understanding opportunities.'
        ]
      },
      {
        type: 'heading',
        title: 'Why Understanding Risk Matters'
      },
      {
        type: 'paragraph',
        content: 'Cryptocurrency is powerful and profitable, but it\'s also new and volatile. If you don\'t understand the risks, you could lose money. This lesson will help you recognize these risks and prepare for them.'
      }
    ],
    sections_ru: [
      {
        type: 'greeting',
        content: [
          'Добро пожаловать на пятый урок!',
          'Мы прошли основы криптовалюты. Теперь пора поговорить о том, что может пойти не так. Понимание рисков так же важно, как понимание возможностей.'
        ]
      },
      {
        type: 'heading',
        title: 'Почему важно понимать риски'
      },
      {
        type: 'paragraph',
        content: 'Криптовалюта мощная и прибыльная, но она также новая и волатильная. Если ты не понимаешь риски, ты можешь потерять деньги. Этот урок поможет тебе распознать эти риски и подготовиться к ним.'
      }
    ]
  },

  lesson_6: {
    id: 'lesson_6',
    startLesson: 6,
    title_en: 'Real Stories of People Who Came to Crypto',
    title_ru: 'Реальные истории людей, которые пришли в крипту',
    sections_en: [
      {
        type: 'greeting',
        content: [
          'Welcome to Lesson 6!',
          'Let\'s look at real examples of different scenarios. Not everyone succeeds in the same way, and there\'s no single path to success. Here are stories from real people.'
        ]
      },
      {
        type: 'heading',
        title: 'Learning from Real Experiences'
      },
      {
        type: 'paragraph',
        content: 'The best way to learn is from others\' experiences. We won\'t promise you riches, but we\'ll show you what\'s possible when you approach crypto thoughtfully and with the right knowledge.'
      }
    ],
    sections_ru: [
      {
        type: 'greeting',
        content: [
          'Добро пожаловать на шестой урок!',
          'Давайте посмотрим на реальные примеры разных сценариев. Не все люди добиваются успеха одинаково, и нет единого пути к успеху. Вот истории реальных людей.'
        ]
      },
      {
        type: 'heading',
        title: 'Учимся на опыте других'
      },
      {
        type: 'paragraph',
        content: 'Лучший способ учиться — это учиться на опыте других. Мы не обещаем тебе богатство, но покажем, что возможно, когда ты подходишь к крипто внимательно и с правильными знаниями.'
      }
    ]
  },

  lesson_7: {
    id: 'lesson_7',
    startLesson: 7,
    title_en: 'Cryptocurrency and Familiar Finance — What\'s the Main Difference',
    title_ru: 'Криптовалюта и привычные финансы — в чём главная разница',
    sections_en: [
      {
        type: 'greeting',
        content: [
          'Welcome to Lesson 7!',
          'You\'ve learned a lot about cryptocurrency. Now let\'s compare it directly with traditional banking. This will help you understand what makes crypto truly different.'
        ]
      },
      {
        type: 'heading',
        title: 'The Core Differences Explained Simply'
      },
      {
        type: 'paragraph',
        content: 'In traditional finance, banks control your money. In crypto, you control your money. That\'s the main difference. Let\'s break down all the other differences in simple terms.'
      }
    ],
    sections_ru: [
      {
        type: 'greeting',
        content: [
          'Добро пожаловать на седьмой урок!',
          'Ты узнал много о криптовалюте. Теперь давайте сравним её напрямую с традиционным банкингом. Это поможет тебе понять, что делает крипто по-настоящему другой.'
        ]
      },
      {
        type: 'heading',
        title: 'Основные отличия объяснены просто'
      },
      {
        type: 'paragraph',
        content: 'В традиционных финансах банки контролируют твои деньги. В крипто ты контролируешь свои деньги. Это главное отличие. Давайте разберём все остальные отличия простым языком.'
      }
    ]
  },

  lesson_8: {
    id: 'lesson_8',
    startLesson: 8,
    title_en: 'Your First Checklist: Are You Ready to Move Forward?',
    title_ru: 'Твой первый чек-лист: готов ли ты двигаться дальше?',
    sections_en: [
      {
        type: 'greeting',
        content: [
          'Welcome to Lesson 8 — The Final Lesson of Block 1!',
          'You\'ve completed seven lessons and learned a lot. Before you move to the next block, let\'s make sure you understand everything you need to.'
        ]
      },
      {
        type: 'heading',
        title: 'Your Readiness Checklist'
      },
      {
        type: 'paragraph',
        content: 'This final lesson is about reflection. Do you understand what money is? Do you know why crypto exists? Can you explain these concepts to a friend? If yes, you\'re ready for Block 2.'
      }
    ],
    sections_ru: [
      {
        type: 'greeting',
        content: [
          'Добро пожаловать на Урок 8 — Финальный урок Блока 1!',
          'Ты прошёл семь уроков и узнал много. Прежде чем ты перейдёшь на следующий блок, давайте убедимся, что ты понимаешь всё, что нужно.'
        ]
      },
      {
        type: 'heading',
        title: 'Твой чек-лист готовности'
      },
      {
        type: 'paragraph',
        content: 'Этот финальный урок — о рефлексии. Ты понимаешь, что такое деньги? Знаешь ли ты, почему существует крипто? Можешь ли ты объяснить эти понятия другу? Если да, ты готов к Блоку 2.'
      }
    ]
  },

  intro_lesson_2: {
    id: 'intro_lesson_2',
    startLesson: 102,
    title_en: 'Basic Concepts of the Crypto Industry',
    title_ru: 'Базовые понятия криптоиндустрии',
    sections_en: [
      {
        type: 'greeting',
        content: [
          'Welcome to Lesson 2!',
          'Let\'s learn the basic words you\'ll hear in the crypto world. Don\'t worry — we\'ll explain everything in simple terms.'
        ]
      },
      {
        type: 'heading',
        title: 'What is Cryptocurrency?'
      },
      {
        type: 'paragraph',
        content: 'Cryptocurrency is digital money. Unlike regular money from a bank, nobody controls it. It works on technology called blockchain.'
      },
      {
        type: 'heading',
        title: 'What is Blockchain?'
      },
      {
        type: 'paragraph',
        content: 'Blockchain is a chain of information blocks. Each block records transactions. No one can change old blocks, so it\'s safe and honest.'
      },
      {
        type: 'heading',
        title: 'What is a Wallet?'
      },
      {
        type: 'paragraph',
        content: 'A wallet is your digital purse. You store your crypto there. You have two keys: a public key (like your email) and a private key (like your password).'
      },
      {
        type: 'heading',
        title: 'What is a Transaction?'
      },
      {
        type: 'paragraph',
        content: 'A transaction is when you send crypto to someone. It\'s recorded in the blockchain. Everyone can see it happened, but they can\'t see your name.'
      },
      {
        type: 'heading',
        title: 'Key Words to Remember'
      },
      {
        type: 'list',
        items: [
          {
            title: 'Bitcoin',
            description: 'The first and most famous cryptocurrency.'
          },
          {
            title: 'Mining',
            description: 'The process of creating new blocks and getting rewards.'
          },
          {
            title: 'Fee',
            description: 'A small payment for confirming a transaction.'
          },
          {
            title: 'Address',
            description: 'Your wallet\'s public key — where people send crypto to you.'
          }
        ]
      }
    ],
    sections_ru: [
      {
        type: 'greeting',
        content: [
          'Добро пожаловать на Урок 2!',
          'Давайте выучим базовые слова, которые ты услышишь в крипто-мире. Не волнуйся — мы объясним всё простыми словами.'
        ]
      },
      {
        type: 'heading',
        title: 'Что такое криптовалюта?'
      },
      {
        type: 'paragraph',
        content: 'Криптовалюта — это цифровые деньги. В отличие от обычных денег из банка, её никто не контролирует. Она работает на технологии, которая называется блокчейн.'
      },
      {
        type: 'heading',
        title: 'Что такое блокчейн?'
      },
      {
        type: 'paragraph',
        content: 'Блокчейн — это цепь информационных блоков. Каждый блок записывает транзакции. Никто не может изменить старые блоки, поэтому это безопасно и честно.'
      },
      {
        type: 'heading',
        title: 'Что такое кошелёк?'
      },
      {
        type: 'paragraph',
        content: 'Кошелёк — это твой цифровой кошелек. Ты хранишь там свою крипто. У тебя есть два ключа: публичный ключ (как твой email) и приватный ключ (как твой пароль).'
      },
      {
        type: 'heading',
        title: 'Что такое транзакция?'
      },
      {
        type: 'paragraph',
        content: 'Транзакция — это когда ты отправляешь крипто кому-то. Это записывается в блокчейне. Все видят, что это произошло, но они не видят твоё имя.'
      },
      {
        type: 'heading',
        title: 'Ключевые слова для запоминания'
      },
      {
        type: 'list',
        items: [
          {
            title: 'Биткоин',
            description: 'Первая и самая известная криптовалюта.'
          },
          {
            title: 'Майнинг',
            description: 'Процесс создания новых блоков и получения награды.'
          },
          {
            title: 'Комиссия',
            description: 'Небольшой платёж за подтверждение транзакции.'
          },
          {
            title: 'Адрес',
            description: 'Публичный ключ твоего кошелька — куда люди отправляют тебе крипто.'
          }
        ]
      }
    ]
  }
}

/**
 * Get lesson by ID and language
 */
export function getLesson(lessonId: string, language: 'en' | 'ru') {
  const lesson = lessons[lessonId]
  if (!lesson) {
    console.error(`[Lessons] Lesson not found: ${lessonId}`)
    return null
  }
  
  return {
    id: lesson.id,
    title: language === 'en' ? lesson.title_en : lesson.title_ru,
    sections: language === 'en' ? lesson.sections_en : lesson.sections_ru
  }
}

/**
 * Get all lesson IDs
 */
export function getAllLessonIds(): string[] {
  return Object.keys(lessons)
}

/**
 * Convert lesson number to lesson ID
 */
export function lessonNumberToId(lessonNumber: number): string {
  const lesson = Object.values(lessons).find(l => l.startLesson === lessonNumber)
  return lesson?.id || `lesson_${lessonNumber}`
}

// Generated from pasted reference text. Do not hand-edit names here; update the reference and regenerate.
export type YggnarokAiEntity = {
  order?: number;
  key: string;
  name: string;
  area?: string;
  title?: string;
  function?: string;
  summary?: string;
  comparableOptions?: string[];
  note?: string;
};

export const yggnarokPrimaryAiAgents = [
  {
    "order": 1,
    "key": "heimdall",
    "name": "Heimdall",
    "area": "Roteamento"
  },
  {
    "order": 2,
    "key": "janus",
    "name": "Janus",
    "area": "Fluxos"
  },
  {
    "order": 3,
    "key": "isis",
    "name": "Ísis",
    "area": "Triagem"
  },
  {
    "order": 4,
    "key": "maat",
    "name": "Ma’at",
    "area": "Justiça e conciliação"
  },
  {
    "order": 5,
    "key": "athena",
    "name": "Athena",
    "area": "Estratégia"
  },
  {
    "order": 6,
    "key": "hotei",
    "name": "Hotei",
    "area": "Assistente Pet"
  },
  {
    "order": 7,
    "key": "hefesto",
    "name": "Hefesto",
    "area": "Prompt e ideias"
  },
  {
    "order": 8,
    "key": "tenjin",
    "name": "Tenjin",
    "area": "Tutorial"
  },
  {
    "order": 9,
    "key": "amaterasu",
    "name": "Amaterasu",
    "area": "Criação de conteúdo"
  },
  {
    "order": 10,
    "key": "benzaiten",
    "name": "Benzaiten",
    "area": "Estética"
  },
  {
    "order": 11,
    "key": "daedalus",
    "name": "Daedalus",
    "area": "Geração técnica"
  },
  {
    "order": 12,
    "key": "orpheus",
    "name": "Orpheus",
    "area": "Voz e storytelling"
  },
  {
    "order": 13,
    "key": "gaia",
    "name": "Gaia",
    "area": "Monetização"
  },
  {
    "order": 14,
    "key": "inari",
    "name": "Inari",
    "area": "Copy e oferta"
  },
  {
    "order": 15,
    "key": "hermes",
    "name": "Hermes",
    "area": "Distribuição"
  },
  {
    "order": 16,
    "key": "ebisu",
    "name": "Ebisu",
    "area": "Parcerias e links"
  },
  {
    "order": 17,
    "key": "daikokuten",
    "name": "Daikokuten",
    "area": "Campanhas"
  },
  {
    "order": 18,
    "key": "fuxi",
    "name": "Fuxi",
    "area": "Estratégia de nicho"
  },
  {
    "order": 19,
    "key": "omoikane",
    "name": "Omoikane",
    "area": "Relatórios"
  },
  {
    "order": 20,
    "key": "hachiman",
    "name": "Hachiman",
    "area": "Aprendizado global"
  },
  {
    "order": 21,
    "key": "mnemosyne",
    "name": "Mnemosyne",
    "area": "Memória"
  },
  {
    "order": 22,
    "key": "wenchang",
    "name": "Wenchang",
    "area": "Biblioteca"
  },
  {
    "order": 23,
    "key": "hypnos",
    "name": "Hypnos",
    "area": "Lixeira inteligente"
  },
  {
    "order": 24,
    "key": "yomi",
    "name": "Yomi",
    "area": "Direitos autorais"
  },
  {
    "order": 25,
    "key": "themis",
    "name": "Themis",
    "area": "Regras e LGPD"
  },
  {
    "order": 26,
    "key": "zhong_kui",
    "name": "Zhong Kui",
    "area": "Conteúdo problemático"
  },
  {
    "order": 27,
    "key": "susanoo",
    "name": "Susanoo",
    "area": "Segurança"
  },
  {
    "order": 28,
    "key": "asclepio",
    "name": "Asclépio",
    "area": "Saúde do sistema"
  },
  {
    "order": 29,
    "key": "raphael",
    "name": "Raphael",
    "area": "Recuperação"
  },
  {
    "order": 30,
    "key": "metatron",
    "name": "Metatron",
    "area": "Logs e permissões"
  },
  {
    "order": 31,
    "key": "astraea",
    "name": "Astraea",
    "area": "XP e Rank"
  },
  {
    "order": 32,
    "key": "yama",
    "name": "Yama",
    "area": "Karma"
  },
  {
    "order": 33,
    "key": "caishen",
    "name": "Caishen",
    "area": "Recompensas"
  },
  {
    "order": 34,
    "key": "nuwa",
    "name": "Nüwa",
    "area": "Onboarding"
  },
  {
    "order": 35,
    "key": "ame_no_uzume",
    "name": "Ame-no-Uzume",
    "area": "Interface e UX"
  },
  {
    "order": 36,
    "key": "sarutahiko",
    "name": "Sarutahiko",
    "area": "Postagem manual"
  },
  {
    "order": 37,
    "key": "gabriel",
    "name": "Gabriel",
    "area": "Notificações"
  },
  {
    "order": 38,
    "key": "pandora",
    "name": "Pandora",
    "area": "Testes"
  },
  {
    "order": 39,
    "key": "anubis",
    "name": "Anúbis",
    "area": "Auditoria final"
  },
  {
    "order": 40,
    "key": "nemesis",
    "name": "Nemesis",
    "area": "Risco de marca"
  }
] as const satisfies readonly YggnarokAiEntity[];

export const yggnarokExtendedAiCatalog = [
  {
    "order": 1,
    "key": "heimdall",
    "name": "Heimdall",
    "title": "IA Roteadora Geral das IAs",
    "function": "decidir quais IAs entram em cada fluxo, evitando chamadas desnecessárias, custo extra e gargalo.",
    "summary": "Heimdall, na mitologia nórdica, é o guardião da ponte Bifröst, que conecta mundos. Ele é famoso por enxergar e ouvir a grandes distâncias, vigiando a chegada de ameaças e movimentos importantes. Como IA, representa visão ampla, vigilância e roteamento entre áreas diferentes.",
    "comparableOptions": [
      "Janus",
      "Hermes",
      "Omoikane",
      "Metatron",
      "Fuxi",
      "Hécate",
      "Sarutahiko",
      "Ganesha",
      "Eshu/Eleguá",
      "Papa Legba."
    ],
    "note": "Heimdall é o melhor nome para roteamento geral; Janus é melhor para transição de etapas."
  },
  {
    "order": 2,
    "key": "janus",
    "name": "Janus",
    "title": "IA de Fluxos, Portas e Transições",
    "function": "controlar passagem entre ideia, criação, revisão, aprovação, postagem, relatório, aprendizado e arquivamento.",
    "summary": "Janus é o deus romano das portas, começos, finais e passagens. É representado com duas faces, olhando para passado e futuro, o que combina com mudança de estado dentro de um sistema. Ele não decide o conteúdo; ele garante que cada etapa passe para a próxima corretamente.",
    "comparableOptions": [
      "Hermes",
      "Hécate",
      "Sarutahiko",
      "Ganesha",
      "Papa Legba",
      "Eshu/Eleguá",
      "Iris",
      "Mercúrio",
      "Fuxi",
      "Heimdall."
    ],
    "note": "se Janus e Heimdall coexistirem, Heimdall escolhe a rota; Janus controla o fluxo dentro da rota."
  },
  {
    "order": 3,
    "key": "isis",
    "name": "Ísis",
    "title": "IA de Triagem e Curadoria Inicial",
    "function": "entender o pedido do usuário, identificar intenção, organizar fragmentos de informação e enviar para o fluxo correto.",
    "summary": "Ísis é uma das grandes deusas egípcias, ligada à magia, proteção, maternidade simbólica e reconstrução. Seu mito mais famoso envolve reunir partes de Osíris para restaurá-lo, o que representa pegar fragmentos dispersos e dar sentido a eles. No OS, essa imagem combina com curadoria inicial e recomposição de pedidos confusos.",
    "comparableOptions": [
      "Ma’at",
      "Enma",
      "Yanluo Wang",
      "Anúbis",
      "Themis",
      "Dike",
      "Raguel",
      "Yama",
      "Nüwa."
    ],
    "note": "Ísis também serve muito bem para recuperação/restauração. Você pode comparar com Raphael e Nüwa antes de decidir."
  },
  {
    "order": 4,
    "key": "maat",
    "name": "Ma’at",
    "title": "IA de Justiça, Equilíbrio e Conciliação",
    "function": "evitar decisões injustas, pesar contexto humano, corrigir punições e equilibrar XP, Karma, performance e erro real.",
    "summary": "Ma’at é a deusa egípcia da verdade, justiça, equilíbrio e ordem cósmica. No julgamento dos mortos, o coração era pesado contra a pena de Ma’at, simbolizando se a pessoa viveu em equilíbrio. Como IA, é perfeita para decisões que não podem ser frias, injustas ou automáticas demais.",
    "comparableOptions": [
      "Themis",
      "Dike",
      "Astraea",
      "Raguel",
      "Yama",
      "Anúbis",
      "Forseti",
      "Shamash",
      "Varuna."
    ],
    "note": "Ma’at deve ser o freio moral do OS."
  },
  {
    "order": 5,
    "key": "athena",
    "name": "Athena",
    "title": "IA de Estratégia Suprema",
    "function": "planejamento avançado, decisões de longo prazo, expansão, priorização e arquitetura estratégica.",
    "summary": "Athena é a deusa grega da sabedoria, estratégia, defesa da cidade, ofícios e guerra inteligente. Ela não representa violência bruta, mas raciocínio, prudência, tática e vitória por inteligência. No OS, ela deve ficar acima das decisões estratégicas, principalmente quando envolve crescimento, recursos e direção do produto.",
    "comparableOptions": [
      "Omoikane",
      "Thoth",
      "Fuxi",
      "Odin",
      "Mimir",
      "Metis",
      "Prometeu",
      "Guan Yu",
      "Vishvakarma",
      "Minerva."
    ],
    "note": "não usar Athena como dados principal; dados ficam melhor com Omoikane, Thoth e Seshat."
  },
  {
    "order": 6,
    "key": "metatron",
    "name": "Metatron",
    "title": "IA de Permissões, Logs e Hierarquia Técnica",
    "function": "registrar acessos, alterações, permissões, decisões sensíveis, logs e autoridade técnica.",
    "summary": "Metatron é associado, em tradições místicas judaicas e esotéricas, à função de escriba celestial e presença próxima ao trono divino. Ele representa registro, ordem superior, hierarquia e documentação do invisível. Como IA, encaixa em logs, permissões e rastreabilidade.",
    "comparableOptions": [
      "Seshat",
      "Thoth",
      "Nabu",
      "Janus",
      "Argus",
      "Anúbis",
      "Ma’at",
      "Raziel",
      "Wenchang."
    ],
    "note": "Metatron não decide regras; ele registra e controla rastros de autoridade."
  },
  {
    "order": 7,
    "key": "anubis",
    "name": "Anúbis",
    "title": "IA de Auditoria Final",
    "function": "revisar decisões importantes antes de aplicação, pesar risco, regra, contexto e impacto.",
    "summary": "Anúbis é o deus egípcio associado à mumificação, proteção dos mortos e julgamento no pós-vida. Ele conduz a pesagem do coração, comparando-o à pena de Ma’at. Isso faz dele um símbolo perfeito para auditoria final, quando uma decisão precisa ser pesada antes de atravessar uma fronteira crítica.",
    "comparableOptions": [
      "Ma’at",
      "Themis",
      "Yama",
      "Enma",
      "Rhadamanthys",
      "Shamash",
      "Raguel",
      "Metatron",
      "Nemesis."
    ],
    "note": "Anúbis também pode auditar publicações arriscadas; nesse caso é subfunção, não IA separada."
  },
  {
    "order": 8,
    "key": "pandora",
    "name": "Pandora",
    "title": "IA de Simulações, Testes e Falhas Possíveis",
    "function": "simular mudanças antes de aplicar, testar riscos e prever o que pode dar errado.",
    "summary": "Pandora é a figura grega associada ao recipiente que libera males no mundo. Ela representa consequências escondidas, curiosidade perigosa e riscos que só aparecem quando algo é aberto. Como IA de testes, Pandora serve para abrir problemas em ambiente seguro antes que cheguem ao sistema real.",
    "comparableOptions": [
      "Loki",
      "Prometeu",
      "Daedalus",
      "Hécate",
      "Mara",
      "Eris",
      "Coyote",
      "Anansi",
      "Set",
      "Hermes."
    ],
    "note": "no Simulador dos Seres Supremos, Pandora deve operar em sandbox total."
  },
  {
    "order": 9,
    "key": "omoikane",
    "name": "Omoikane",
    "title": "IA de Relatórios, Insights e Decisão Analítica",
    "function": "transformar métricas em explicações simples, recomendações e próximos passos.",
    "summary": "Omoikane é o kami japonês da inteligência e sabedoria coletiva. Nos mitos, ele ajuda os deuses a pensarem em soluções quando Amaterasu se esconde na caverna. Como IA, representa análise, deliberação e síntese de dados em decisão prática.",
    "comparableOptions": [
      "Thoth",
      "Seshat",
      "Metatron",
      "Athena",
      "Mimir",
      "Raziel",
      "Nabu",
      "Odin",
      "Fuxi",
      "Ma’at."
    ],
    "note": "aparece também como recomendação pós-postagem; pode ser o mesmo módulo."
  },
  {
    "order": 10,
    "key": "mimir",
    "name": "Mimir",
    "title": "IA de Base de Conhecimento Interna",
    "function": "responder dúvidas sobre o próprio OS, regras, módulos, cargos, IAs, fluxos e telas.",
    "summary": "Mimir, na mitologia nórdica, é uma figura de sabedoria profunda ligada ao poço do conhecimento. Odin sacrifica um olho para beber desse poço, mostrando que o conhecimento verdadeiro tem preço e profundidade. Como IA, Mimir é a memória consultável do sistema.",
    "comparableOptions": [
      "Thoth",
      "Wenchang",
      "Saraswati",
      "Raziel",
      "Metatron",
      "Nabu",
      "Athena",
      "Omoikane",
      "Ogma."
    ],
    "note": "Mimir também foi listado em dados; melhor deixá-lo como conhecimento interno."
  },
  {
    "order": 11,
    "key": "izanami",
    "name": "Izanami",
    "title": "IA de Ciclos, Riscos e Encerramentos",
    "function": "supervisionar falhas graves, ciclos problemáticos, bloqueios, riscos profundos e encerramento de fluxos.",
    "summary": "Izanami é uma deusa japonesa ligada à criação e à morte. Após sua morte, passa a ser associada ao Yomi, o mundo dos mortos, tornando-se uma figura de fim, transformação e consequência. No OS, ela representa a supervisão de zonas perigosas e ciclos que precisam ser encerrados ou renascidos.",
    "comparableOptions": [
      "Ereshkigal",
      "Hel",
      "Hécate",
      "Persephone",
      "Kali",
      "Morrígan",
      "Nephthys",
      "Coatlicue",
      "Mictecacihuatl."
    ],
    "note": "ideal para supervisão operacional profunda."
  },
  {
    "order": 12,
    "key": "izanagi",
    "name": "Izanagi",
    "title": "IA de Criação Estrutural",
    "function": "supervisionar criação de perfis, padrões criativos, nascimento de fluxos e estruturação de novos módulos.",
    "summary": "Izanagi é um deus criador japonês, envolvido na criação das ilhas do Japão e no nascimento de vários kami. Ele representa origem, estrutura inicial e separação do caos em forma organizada. Como IA, combina com criação de bases estruturais e nascimento de novos perfis.",
    "comparableOptions": [
      "Ptah",
      "Vishvakarma",
      "Prometeu",
      "Fuxi",
      "Pangu",
      "Brahma",
      "Khnum",
      "Nüwa",
      "Quetzalcóatl."
    ],
    "note": "Izanagi não é conteúdo solto; é criação estrutural."
  },
  {
    "order": 13,
    "key": "hachiman",
    "name": "Hachiman",
    "title": "IA de Aprendizado Global Estratégico",
    "function": "aprender com todos os perfis, campanhas, conteúdos, erros, acertos e padrões do sistema.",
    "summary": "Hachiman é um deus japonês associado à guerra, proteção e, em certos contextos, ao patronato dos guerreiros. Ele não é apenas combate; representa experiência acumulada em batalhas e proteção estratégica. No OS, cada post, campanha ou perfil é uma batalha de aprendizado.",
    "comparableOptions": [
      "Athena",
      "Odin",
      "Mimir",
      "Thoth",
      "Omoikane",
      "Guan Yu",
      "Tyr",
      "Kartikeya",
      "Ogma",
      "Nike."
    ],
    "note": "Hachiman aprende com o campo inteiro, não apenas com um perfil."
  },
  {
    "order": 14,
    "key": "themis",
    "name": "Themis",
    "title": "IA de Regras, Política Interna, LGPD e Termos",
    "function": "cuidar de regras centrais, termos, privacidade, governança, limites legais e políticas internas.",
    "summary": "Themis é a deusa grega da lei divina, ordem, costume e justiça superior. Diferente de uma juíza que pune depois, Themis representa a estrutura normativa que existe antes da ação. Como IA, ela define e interpreta regras do OS.",
    "comparableOptions": [
      "Dike",
      "Ma’at",
      "Varuna",
      "Shamash",
      "Raguel",
      "Anúbis",
      "Yama",
      "Forseti",
      "Tyr."
    ],
    "note": "pode aparecer em direitos autorais; nesse caso ela apoia Yomi, mas não substitui Yomi."
  },
  {
    "order": 15,
    "key": "yama",
    "name": "Yama",
    "title": "IA de Karma, Conduta e Risco Humano",
    "function": "medir postura, responsabilidade, tentativas de burlar regras, histórico e risco de confiança.",
    "summary": "Yama é juiz dos mortos em tradições hindu e budista, ligado à morte, consequência e avaliação moral. Ele combina diretamente com Karma porque observa atos e consequências. No OS, Yama não mede talento; mede postura, risco e responsabilidade.",
    "comparableOptions": [
      "Enma",
      "Anúbis",
      "Ma’at",
      "Themis",
      "Dike",
      "Raguel",
      "Rhadamanthys",
      "Minos",
      "Shamash."
    ],
    "note": "Yama deve ser justo, não punitivo por erro inocente."
  },
  {
    "order": 16,
    "key": "nemesis",
    "name": "Nemesis",
    "title": "IA de Reputação e Risco de Marca",
    "function": "avaliar se conteúdo pode causar crise, dano de imagem, polêmica desnecessária ou reação negativa.",
    "summary": "Nemesis é a deusa grega da retribuição contra excesso, arrogância e desequilíbrio. Ela não representa maldade; representa consequência quando alguém passa do limite. Como IA, é perfeita para antecipar risco reputacional antes que o perfil se prejudique.",
    "comparableOptions": [
      "Ma’at",
      "Themis",
      "Anúbis",
      "Yama",
      "Sekhmet",
      "Kali",
      "Zhong Kui",
      "Shamash",
      "Hécate."
    ],
    "note": "Nemesis não censura criatividade; ela alerta sobre consequência."
  },
  {
    "order": 17,
    "key": "shichifukujin",
    "name": "Shichifukujin",
    "title": "IA de Sorte, Timing e Fatores Externos de Performance",
    "function": "separar erro real de azar, algoritmo, timing, contexto externo e variação natural de performance.",
    "summary": "Shichifukujin são os Sete Deuses da Sorte no Japão, associados a prosperidade, arte, sabedoria, longevidade, comércio e proteção. O conjunto representa múltiplas formas de sorte, não apenas dinheiro. No OS, ajuda a entender que performance não depende só do criador.",
    "comparableOptions": [
      "Fortuna",
      "Tyche",
      "Lakshmi",
      "Daikokuten",
      "Ebisu",
      "Caishen",
      "Janus",
      "Norns",
      "Moirai."
    ],
    "note": "essencial para não punir usuário por post que falhou por fator externo."
  },
  {
    "order": 18,
    "key": "chronos",
    "name": "Chronos",
    "title": "IA de Tempo Contínuo e Calendário",
    "function": "controlar calendário editorial, ciclos, datas, recorrência, sazonalidade e cronologia.",
    "summary": "Chronos é a personificação do tempo contínuo na tradição grega. Ele representa a passagem regular, a linha temporal e o fluxo inevitável dos dias. No OS, Chronos organiza calendário e continuidade.",
    "comparableOptions": [
      "Kairos",
      "Janus",
      "Tsukuyomi",
      "Selene",
      "Nanna/Sin",
      "Norns",
      "Moirai",
      "Zurvan",
      "Thoth."
    ],
    "note": "Chronos cuida do calendário; Kairos escolhe o momento ideal."
  },
  {
    "order": 19,
    "key": "kairos",
    "name": "Kairos",
    "title": "IA de Momento Oportuno",
    "function": "detectar janelas ideais para postar, lançar campanha, mudar estratégia ou aproveitar trend.",
    "summary": "Kairos representa o momento certo, a oportunidade que aparece e precisa ser aproveitada. Diferente de Chronos, que é tempo contínuo, Kairos é qualidade do momento. No OS, ele responde: “agora é a hora certa?”",
    "comparableOptions": [
      "Chronos",
      "Fortuna",
      "Tyche",
      "Hermes",
      "Janus",
      "Norns",
      "Moirai",
      "Shichifukujin",
      "Apollo."
    ],
    "note": "Kairos pode ser sub-IA de Chronos, Hermes e Sarutahiko."
  },
  {
    "order": 20,
    "key": "norns",
    "name": "Norns",
    "title": "IA de Tendências Futuras e Padrões Recorrentes",
    "function": "prever tendências, padrões futuros, ciclos repetidos e caminhos prováveis.",
    "summary": "As Norns, na mitologia nórdica, tecem o destino e estão ligadas ao passado, presente e futuro. Elas representam continuidade, consequência e fios que conectam eventos. Como IA, são úteis para prever padrões de crescimento e tendências.",
    "comparableOptions": [
      "Moirai",
      "Fortuna",
      "Tyche",
      "Chronos",
      "Kairos",
      "Mimir",
      "Odin",
      "Omoikane",
      "Shichifukujin."
    ],
    "note": "boa para previsão estratégica, não para calendário operacional."
  },
  {
    "order": 21,
    "key": "hotei",
    "name": "Hotei",
    "title": "IA Pet Humanizada",
    "function": "orientar o usuário com leveza, explicar caminhos, aparecer como pet/bolha e reduzir confusão.",
    "summary": "Hotei é uma figura associada à felicidade, abundância, riso, simplicidade e boa fortuna. Ele é acolhedor, popular e não intimidador. Como Assistente Pet, representa uma presença amigável que ajuda o usuário sem parecer uma autoridade fria.",
    "comparableOptions": [
      "Kannon",
      "Gabriel",
      "Hermes",
      "Ganesha",
      "Bes",
      "Eirene",
      "Brigid",
      "Saraswati",
      "Ame-no-Uzume."
    ],
    "note": "Hotei não deve ser o nome principal de áudio; áudio fica melhor com Benzaiten/Orpheus."
  },
  {
    "order": 22,
    "key": "kannon",
    "name": "Kannon",
    "title": "IA de Comunidade e Relacionamento",
    "function": "cuidar de comentários, seguidores, respostas, empatia, tom humano e comunidade.",
    "summary": "Kannon é a forma japonesa de Avalokiteśvara, figura de compaixão que escuta o sofrimento dos seres. Sua força simbólica é acolher, ouvir e responder com cuidado. No OS, ela cuida da relação entre perfil e público.",
    "comparableOptions": [
      "Guan Yin",
      "Chamuel",
      "Hestia",
      "Brigid",
      "Mazu",
      "Freyja",
      "Hathor",
      "Eir",
      "Tara."
    ],
    "note": "Kannon é excelente para atendimento, comentários e comunidade."
  },
  {
    "order": 23,
    "key": "tenjin",
    "name": "Tenjin",
    "title": "IA de Tutorial e Ensino Básico",
    "function": "ensinar usuários iniciantes, criar tutoriais e explicar telas passo a passo.",
    "summary": "Tenjin é um kami japonês associado aos estudos, escrita e aprendizado, derivado da figura histórica Sugawara no Michizane. É venerado por estudantes e pessoas buscando sucesso acadêmico. No OS, encaixa diretamente com tutoria e ensino.",
    "comparableOptions": [
      "Wenchang",
      "Saraswati",
      "Thoth",
      "Nabu",
      "Seshat",
      "Ogma",
      "Ganesha",
      "Chiron",
      "Manjushri."
    ],
    "note": "Tenjin deve falar simples, principalmente para usuários iniciantes."
  },
  {
    "order": 24,
    "key": "selene",
    "name": "Selene",
    "title": "IA de Pausa, Sobrecarga e Ritmo Humano",
    "function": "detectar cansaço, excesso de informação, confusão e sugerir pausa ou simplificação.",
    "summary": "Selene é a deusa grega da lua, símbolo de noite, ciclo, calma e ritmo. Ela representa o tempo de desacelerar, descansar e observar com suavidade. No OS, protege o usuário de sobrecarga mental.",
    "comparableOptions": [
      "Hypnos",
      "Tsukuyomi",
      "Chang’e",
      "Nanna/Sin",
      "Eir",
      "Kannon",
      "Hestia",
      "Morpheus",
      "Chandra."
    ],
    "note": "Selene é importante para usuários com dificuldade de foco ou excesso de informação."
  },
  {
    "order": 25,
    "key": "ganesha",
    "name": "Ganesha",
    "title": "IA de Remoção de Obstáculos do Usuário",
    "function": "destravar usuários iniciantes quando não sabem o próximo passo.",
    "summary": "Ganesha, na tradição hindu, é amplamente associado à remoção de obstáculos, sabedoria e bons começos. Ele é invocado antes de novos projetos e jornadas. No OS, representa a IA que torna o caminho mais fácil quando o usuário trava.",
    "comparableOptions": [
      "Hotei",
      "Tenjin",
      "Kannon",
      "Janus",
      "Hermes",
      "Sarutahiko",
      "Nüwa",
      "Chiron",
      "Hestia."
    ],
    "note": "Ganesha pode ser chamado pelo Pet quando o usuário estiver perdido."
  },
  {
    "order": 26,
    "key": "chiron",
    "name": "Chiron",
    "title": "IA de Mentoria e Aprendizado Prático",
    "function": "orientar evolução prática, treinar usuários e transformar erro em aprendizado.",
    "summary": "Chiron é o centauro sábio da mitologia grega, mestre de heróis como Aquiles e Asclépio. Diferente de outros centauros violentos, ele representa ensino, cura e formação. No OS, é excelente para mentoria prática e progressiva.",
    "comparableOptions": [
      "Tenjin",
      "Saraswati",
      "Ganesha",
      "Athena",
      "Mimir",
      "Brigid",
      "Kannon",
      "Thoth",
      "Wenchang."
    ],
    "note": "Chiron pode guiar Ordens de treinamento."
  },
  {
    "order": 27,
    "key": "hestia",
    "name": "Hestia",
    "title": "IA de Ambiente Seguro e Confortável",
    "function": "criar sensação de acolhimento, rotina confortável e ambiente simples para usuários iniciantes.",
    "summary": "Hestia é a deusa grega do lar, da lareira e da estabilidade doméstica. Ela representa o centro seguro da casa, paz e continuidade. No OS, é a IA que reduz sensação de frieza tecnológica e torna a experiência mais humana.",
    "comparableOptions": [
      "Kannon",
      "Selene",
      "Hotei",
      "Brigid",
      "Eir",
      "Guan Yin",
      "Mazu",
      "Ame-no-Uzume",
      "Hestia."
    ],
    "note": "boa para modo Fácil e onboarding sensível."
  },
  {
    "order": 28,
    "key": "gabriel",
    "name": "Gabriel",
    "title": "IA de Alertas, Mensagens e Notificações",
    "function": "enviar avisos, lembretes, alertas, mensagens internas e comunicação de eventos.",
    "summary": "Gabriel é conhecido como arcanjo mensageiro em tradições abraâmicas, ligado a anúncios e revelações importantes. Seu domínio é comunicação clara e entrega de mensagem. No OS, representa notificações relevantes, não spam.",
    "comparableOptions": [
      "Hermes",
      "Iris",
      "Mercúrio",
      "Sandalphon",
      "Eshu/Eleguá",
      "Papa Legba",
      "Bragi",
      "Nabu",
      "Thoth."
    ],
    "note": "Gabriel entrega; Hermes distribui; Janus muda status."
  },
  {
    "order": 29,
    "key": "saraswati",
    "name": "Saraswati",
    "title": "IA de Clareza de Linguagem e Educação Criativa",
    "function": "melhorar escrita, clareza, vocabulário, explicação e aprendizado criativo.",
    "summary": "Saraswati é deusa hindu da sabedoria, música, linguagem, aprendizado e artes. Ela une conhecimento e expressão, tornando-a forte para texto, ensino e criação refinada. No OS, pode ajudar usuários a escrever melhor sem intimidar.",
    "comparableOptions": [
      "Tenjin",
      "Wenchang",
      "Thoth",
      "Benzaiten",
      "Brigid",
      "Apollo",
      "Ogma",
      "Nabu",
      "Kannon."
    ],
    "note": "excelente para usuários com dificuldade de transformar ideia em texto."
  },
  {
    "order": 30,
    "key": "brigid",
    "name": "Brigid",
    "title": "IA de Inspiração e Apoio Criativo",
    "function": "desbloquear criatividade, gerar ideias leves e apoiar textos, frases e inspiração.",
    "summary": "Brigid é uma deusa celta associada à poesia, cura, inspiração, fogo criativo e artesanato. Ela une cuidado e criação, sendo menos técnica que Hefesto e mais inspiradora. No OS, ajuda quando o usuário precisa de chama criativa.",
    "comparableOptions": [
      "Saraswati",
      "Apollo",
      "Benzaiten",
      "Amaterasu",
      "Chiron",
      "Kannon",
      "Hestia",
      "Orpheus",
      "Bragi."
    ],
    "note": "Brigid é boa como sub-IA de inspiração chamada por Amaterasu ou Hefesto."
  },
  {
    "order": 31,
    "key": "amaterasu",
    "name": "Amaterasu",
    "title": "IA Principal de Criação de Conteúdo",
    "function": "criar ideias, posts, vídeos, roteiros, narrativas e direção criativa geral.",
    "summary": "Amaterasu é a deusa japonesa do sol, luz e autoridade celestial. Seu mito da caverna mostra como a ausência de luz afeta o mundo, e como expressão, festa e arte a trazem de volta. No OS, ela representa visibilidade, brilho e presença pública do conteúdo.",
    "comparableOptions": [
      "Apollo",
      "Saraswati",
      "Brigid",
      "Benzaiten",
      "Ame-no-Uzume",
      "Hathor",
      "Oshun",
      "Lugh",
      "Orpheus."
    ],
    "note": "Amaterasu é criação principal; Benzaiten cuida da estética."
  },
  {
    "order": 32,
    "key": "benzaiten",
    "name": "Benzaiten",
    "title": "IA de Estética Criativa",
    "function": "cuidar de estilo visual, beleza, harmonia, composição e linguagem estética.",
    "summary": "Benzaiten é uma das Sete Divindades da Sorte no Japão, associada à música, arte, eloquência, beleza e fluxo criativo. Sua origem se liga a Saraswati, reforçando a conexão com linguagem e artes. No OS, ela refina a forma estética do conteúdo.",
    "comparableOptions": [
      "Aphrodite",
      "Hathor",
      "Saraswati",
      "Oshun",
      "Brigid",
      "Apollo",
      "Jophiel",
      "Freyja",
      "Ame-no-Uzume."
    ],
    "note": "pode cuidar de áudio, mas separe áudio técnico em Orpheus/Pan."
  },
  {
    "order": 33,
    "key": "hefesto",
    "name": "Hefesto",
    "title": "IA de Forja de Prompts e Ideias",
    "function": "transformar ideia bruta em prompt, briefing, roteiro, conteúdo ou instrução utilizável.",
    "summary": "Hefesto é o deus grego da forja, metalurgia, fogo artesanal e fabricação. Ele pega matéria bruta e transforma em arma, ferramenta ou obra refinada. No OS, é o melhor símbolo para transformar ideia bagunçada em estrutura aproveitável.",
    "comparableOptions": [
      "Ptah",
      "Vishvakarma",
      "Daedalus",
      "Wayland",
      "Goibniu",
      "Svarog",
      "Ogun",
      "Brigid",
      "Khnum."
    ],
    "note": "Hefesto deve ser cuidadoso com usuários que escrevem mal ou têm pouca experiência."
  },
  {
    "order": 34,
    "key": "daedalus",
    "name": "Daedalus",
    "title": "IA de Geração Técnica de Mídia",
    "function": "criar prompts técnicos para imagem, vídeo, áudio, assets e automações de geração.",
    "summary": "Daedalus é o inventor e arquiteto grego conhecido pelo Labirinto de Creta e por soluções engenhosas. Ele representa técnica, complexidade, engenharia e criatividade aplicada. No OS, transforma imaginação em instrução técnica precisa.",
    "comparableOptions": [
      "Hefesto",
      "Vishvakarma",
      "Ptah",
      "Khnum",
      "Wayland",
      "Goibniu",
      "Svarog",
      "Ogun",
      "Imhotep."
    ],
    "note": "Daedalus deve ter sub-IAs para imagem, vídeo, áudio, prompt técnico e assets."
  },
  {
    "order": 35,
    "key": "orpheus",
    "name": "Orpheus",
    "title": "IA de Voz, Narração e Storytelling Sonoro",
    "function": "narração, voz, emoção, ritmo, storytelling e impacto auditivo.",
    "summary": "Orpheus é o músico e poeta mítico capaz de encantar animais, humanos e até forças do submundo. Sua música atravessa fronteiras emocionais. No OS, ele representa narração que prende atenção e dá alma ao conteúdo.",
    "comparableOptions": [
      "Bragi",
      "Apollo",
      "Saraswati",
      "Benzaiten",
      "Sandalphon",
      "Hathor",
      "Ogma",
      "Taliesin",
      "Väinämöinen."
    ],
    "note": "Orpheus é melhor para voz/narrativa que para edição sonora técnica."
  },
  {
    "order": 36,
    "key": "pygmalion",
    "name": "Pygmalion",
    "title": "IA de Personagens Originais",
    "function": "criar mascotes, avatares, personagens originais, personas e variações seguras.",
    "summary": "Pygmalion é o escultor grego que cria uma figura tão perfeita que ela ganha vida no mito. Ele representa criação de personagem com identidade, forma e presença. No OS, ajuda a substituir dependência de personagens protegidos por criações originais.",
    "comparableOptions": [
      "Nüwa",
      "Khnum",
      "Ptah",
      "Prometeu",
      "Daedalus",
      "Vishvakarma",
      "Brahma",
      "Izanagi",
      "Quetzalcóatl."
    ],
    "note": "Pygmalion deve trabalhar junto com Yomi e Tsukuyomi-no-Mikoto."
  },
  {
    "order": 37,
    "key": "apollo",
    "name": "Apollo",
    "title": "IA de Direção Artística, Luz e Harmonia",
    "function": "orientar direção visual com luz, composição, harmonia, beleza clara e performance refinada.",
    "summary": "Apollo é deus grego ligado ao sol, música, profecia, cura, harmonia e artes. Ele representa clareza, proporção, luz e ideal artístico. No OS, é bom para conteúdos que precisam parecer limpos, fortes e visualmente nobres.",
    "comparableOptions": [
      "Amaterasu",
      "Benzaiten",
      "Saraswati",
      "Jophiel",
      "Hathor",
      "Brigid",
      "Orpheus",
      "Lugh",
      "Athena."
    ],
    "note": "Apollo também aparece em cura; se ficar confuso, usar Apollo apenas em arte/luz."
  },
  {
    "order": 38,
    "key": "ame_no_uzume",
    "name": "Ame-no-Uzume",
    "title": "IA de Humor, Entretenimento e Performance Visual",
    "function": "criar conteúdo divertido, teatral, expressivo, viral e de fácil engajamento.",
    "summary": "Ame-no-Uzume é a deusa japonesa da dança, riso e performance. No mito, sua dança faz os deuses rirem e ajuda a atrair Amaterasu para fora da caverna. No OS, ela representa entretenimento que chama atenção e desbloqueia público.",
    "comparableOptions": [
      "Hathor",
      "Brigid",
      "Hermes",
      "Dioniso",
      "Pan",
      "Benzaiten",
      "Saraswati",
      "Hotei",
      "Oshun."
    ],
    "note": "também serve para UX; se usar nos dois, separar “Uzume Conteúdo” e “Uzume Interface”."
  },
  {
    "order": 39,
    "key": "hathor",
    "name": "Hathor",
    "title": "IA de Conteúdo Alegre, Musical e Emocional",
    "function": "criar conteúdo com alegria, música, beleza, afeto, celebração e apelo emocional.",
    "summary": "Hathor é deusa egípcia da música, dança, amor, alegria, maternidade e beleza. Ela combina com conteúdo leve, emocional e sensorial. No OS, pode ajudar vídeos que precisam de energia positiva e conexão afetiva.",
    "comparableOptions": [
      "Benzaiten",
      "Aphrodite",
      "Oshun",
      "Ame-no-Uzume",
      "Saraswati",
      "Brigid",
      "Hotei",
      "Orpheus",
      "Apollo."
    ],
    "note": "ótima para perfis lifestyle, beleza, casa, culinária e comunidade."
  },
  {
    "order": 40,
    "key": "bragi",
    "name": "Bragi",
    "title": "IA de Texto Poético, Frases e Narrativa Curta",
    "function": "criar frases, legendas poéticas, textos curtos, falas memoráveis e copy com estética narrativa.",
    "summary": "Bragi é deus nórdico da poesia e eloquência. Ele representa a palavra artística, o verso e a fala com forma bela. No OS, é útil para legendas, hooks poéticos e textos com impacto emocional.",
    "comparableOptions": [
      "Orpheus",
      "Saraswati",
      "Ogma",
      "Thoth",
      "Apollo",
      "Taliesin",
      "Brigid",
      "Nabu",
      "Gabriel."
    ],
    "note": "Bragi não é copy agressiva; Inari/Hermes cuidam de persuasão comercial."
  },
  {
    "order": 41,
    "key": "taliesin",
    "name": "Taliesin",
    "title": "IA de Storytelling Épico e Simbólico",
    "function": "criar narrativas simbólicas, épicas, místicas, mitológicas e de marca profunda.",
    "summary": "Taliesin é um bardo lendário galês ligado à poesia, inspiração e sabedoria profética. Ele representa narrativa de grande tom, identidade mítica e linguagem encantatória. No OS, ajuda marcas e perfis que precisam de lore e storytelling forte.",
    "comparableOptions": [
      "Orpheus",
      "Bragi",
      "Calliope",
      "Odin",
      "Saraswati",
      "Apollo",
      "Clio",
      "Thoth",
      "Mimir."
    ],
    "note": "bom para YGGNAROK / YGN, perfis com estética anime/fantasia e narrativas de personagem."
  },
  {
    "order": 42,
    "key": "pan",
    "name": "Pan",
    "title": "IA de Sons Naturais, ASMR e Sensação Orgânica",
    "function": "sons naturais, textura sonora, ASMR, ambientes, respiração e sensação orgânica.",
    "summary": "Pan é deus grego da natureza selvagem, bosques, pastores e flauta. Ele representa som instintivo, orgânico e natural, diferente da música refinada de Apollo. No OS, encaixa muito bem em ASMR, cozinha, casa, natureza e vídeos sensoriais.",
    "comparableOptions": [
      "Orpheus",
      "Benzaiten",
      "Hathor",
      "Apollo",
      "Bragi",
      "Hotei",
      "Saraswati",
      "Morpheus",
      "Selene."
    ],
    "note": "Pan é uma sub-IA perfeita para ASMR e som ambiente."
  },
  {
    "order": 43,
    "key": "morpheus",
    "name": "Morpheus",
    "title": "IA de Ideias Visuais Oníricas e Surrealistas",
    "function": "criar visuais de sonho, cenas fantásticas, transições surreais e imagens imaginativas.",
    "summary": "Morpheus é uma figura ligada aos sonhos e à capacidade de formar imagens durante o sono. Ele representa metamorfose visual, símbolos e cenas que não seguem lógica comum. No OS, serve para conteúdo surreal, fantasia e estética de sonho.",
    "comparableOptions": [
      "Hypnos",
      "Selene",
      "Hécate",
      "Brigid",
      "Taliesin",
      "Pygmalion",
      "Daedalus",
      "Orpheus",
      "Apollo."
    ],
    "note": "Morpheus não é lixeira; Hypnos cuida de ideias adormecidas."
  },
  {
    "order": 44,
    "key": "clio",
    "name": "Clio",
    "title": "IA de Conteúdo Histórico e Memória Narrativa",
    "function": "criar contexto histórico, linha do tempo, explicações de origem e memória de marca.",
    "summary": "Clio é a musa grega da história. Ela representa registro narrativo do passado, memória cultural e explicação de como algo chegou ao presente. No OS, ajuda a criar conteúdos com contexto, evolução e trajetória.",
    "comparableOptions": [
      "Mnemosyne",
      "Thoth",
      "Seshat",
      "Wenchang",
      "Mimir",
      "Nabu",
      "Taliesin",
      "Omoikane",
      "Anúbis."
    ],
    "note": "Clio aparece também em dados/histórico; pode ser a mesma IA aplicada a narrativas históricas."
  },
  {
    "order": 45,
    "key": "calliope",
    "name": "Calliope",
    "title": "IA de Roteiros Épicos e Narrativas Longas",
    "function": "criar roteiros longos, vídeos narrativos, séries, arcos e conteúdos épicos.",
    "summary": "Calliope é a musa grega da poesia épica e da eloquência. Ela é associada a grandes narrativas heroicas, não apenas frases curtas. No OS, é ideal para vídeos longos, histórias em série e roteiros com começo, meio e fim.",
    "comparableOptions": [
      "Taliesin",
      "Orpheus",
      "Bragi",
      "Clio",
      "Apollo",
      "Saraswati",
      "Thoth",
      "Mimir",
      "Athena."
    ],
    "note": "Calliope é narrativa longa; Bragi é texto curto."
  },
  {
    "order": 46,
    "key": "vishvakarma",
    "name": "Vishvakarma",
    "title": "IA de Integrações Técnicas e Arquitetura de Geração",
    "function": "conectar ferramentas, redes sociais, bancos de dados, APIs, automações e infraestrutura de mídia.",
    "summary": "Vishvakarma é o arquiteto divino da tradição hindu, construtor de palácios, armas e estruturas celestiais. Ele representa engenharia sagrada e construção técnica em alto nível. No OS, é o nome mais forte para arquitetura e integrações.",
    "comparableOptions": [
      "Daedalus",
      "Hefesto",
      "Ptah",
      "Ogun",
      "Wayland",
      "Goibniu",
      "Svarog",
      "Imhotep",
      "Fuxi."
    ],
    "note": "melhor para infraestrutura do que para criação artística."
  },
  {
    "order": 47,
    "key": "ptah",
    "name": "Ptah",
    "title": "IA de Criação Conceitual por Texto/Comando",
    "function": "transformar conceito em comando, estrutura, briefing e criação orientada por palavra.",
    "summary": "Ptah é deus egípcio criador associado à palavra, pensamento e artesanato. Em algumas tradições, cria por meio do coração e da língua, isto é, ideia e fala. No OS, combina com geração conceitual por comando textual.",
    "comparableOptions": [
      "Hefesto",
      "Daedalus",
      "Thoth",
      "Khnum",
      "Vishvakarma",
      "Izanagi",
      "Prometeu",
      "Seshat",
      "Nabu."
    ],
    "note": "Ptah é ótimo para “texto vira estrutura”."
  },
  {
    "order": 48,
    "key": "khnum",
    "name": "Khnum",
    "title": "IA de Moldagem de Personagens, Avatares e Formas",
    "function": "ajustar formas, corpos, mascotes, avatares, proporções e variações visuais.",
    "summary": "Khnum é um deus egípcio ligado à criação de seres em um torno de oleiro. Ele literalmente molda formas vivas a partir do barro, o que o torna muito forte para modelagem de personagens. No OS, é sub-IA de Pygmalion/Daedalus.",
    "comparableOptions": [
      "Pygmalion",
      "Nüwa",
      "Ptah",
      "Daedalus",
      "Vishvakarma",
      "Prometeu",
      "Hefesto",
      "Brahma",
      "Izanagi."
    ],
    "note": "Khnum molda forma; Pygmalion dá personalidade."
  },
  {
    "order": 49,
    "key": "ogun",
    "name": "Ogun",
    "title": "IA de Ferramentas, Tecnologia e Produção Pesada",
    "function": "lidar com ferramentas, produção técnica, infraestrutura prática, processos pesados e automações duras.",
    "summary": "Ogun, em tradições iorubás e afro-diaspóricas, é orixá do ferro, ferramentas, guerra, trabalho, caminhos e tecnologia prática. Ele representa a força que abre passagem com metal e ação. No OS, combina com produção técnica pesada e ferramentas.",
    "comparableOptions": [
      "Hefesto",
      "Vishvakarma",
      "Daedalus",
      "Svarog",
      "Wayland",
      "Goibniu",
      "Thor",
      "Indra",
      "Ptah."
    ],
    "note": "pode ser segurança técnica; se dividir, usar Ogun Forge e Ogun Guard."
  },
  {
    "order": 50,
    "key": "wayland",
    "name": "Wayland",
    "title": "IA de Acabamento Técnico e Refinamento Artesanal",
    "function": "polir assets, corrigir detalhes, melhorar acabamento visual e técnico.",
    "summary": "Wayland é um ferreiro lendário da tradição germânica, associado à habilidade extraordinária na criação de armas e peças refinadas. Ele representa artesanato técnico e acabamento superior. No OS, entra quando algo já existe mas precisa ficar mais bem-feito.",
    "comparableOptions": [
      "Hefesto",
      "Goibniu",
      "Svarog",
      "Ogun",
      "Daedalus",
      "Vishvakarma",
      "Ptah",
      "Imhotep",
      "Apollo."
    ],
    "note": "ótimo para pós-processamento e refinamento."
  },
  {
    "order": 51,
    "key": "goibniu",
    "name": "Goibniu",
    "title": "IA de Produção de Assets Reutilizáveis",
    "function": "criar bibliotecas de peças reutilizáveis, modelos, templates e componentes criativos.",
    "summary": "Goibniu é um deus ferreiro da mitologia irlandesa, ligado à fabricação de armas e à habilidade artesanal. Ele também aparece associado à hospitalidade e banquetes em algumas fontes. No OS, sua força é fabricar peças confiáveis e repetíveis.",
    "comparableOptions": [
      "Hefesto",
      "Wayland",
      "Ogun",
      "Svarog",
      "Daedalus",
      "Vishvakarma",
      "Ptah",
      "Seshat",
      "Wenchang."
    ],
    "note": "perfeito para templates e kits de assets."
  },
  {
    "order": 52,
    "key": "svarog",
    "name": "Svarog",
    "title": "IA de Renderização e Transformação Técnica",
    "function": "lidar com renderização, conversão, transformação de mídia e processos de fogo/criação técnica.",
    "summary": "Svarog é uma divindade eslava associada ao céu, fogo e ferreiro celestial em algumas tradições. Ele representa fogo criador, calor técnico e fabricação. No OS, combina com transformação de mídia e renderização.",
    "comparableOptions": [
      "Hefesto",
      "Ogun",
      "Goibniu",
      "Wayland",
      "Vishvakarma",
      "Daedalus",
      "Ptah",
      "Agni",
      "Apollo."
    ],
    "note": "bom como sub-IA técnica de processamento."
  },
  {
    "order": 53,
    "key": "imhotep",
    "name": "Imhotep",
    "title": "IA de Estrutura Técnica, Arquitetura e Documentação",
    "function": "organizar arquitetura técnica, diagnóstico, documentação de estruturas e boas práticas.",
    "summary": "Imhotep foi uma figura histórica egípcia depois divinizada, associada à arquitetura, medicina e sabedoria. É famoso pela ligação com construção monumental e conhecimento técnico. No OS, representa engenharia aplicada e documentação estrutural.",
    "comparableOptions": [
      "Vishvakarma",
      "Daedalus",
      "Ptah",
      "Seshat",
      "Asclépio",
      "Thoth",
      "Wenchang",
      "Metatron",
      "Nabu."
    ],
    "note": "serve tanto para técnica quanto para saúde do sistema, mas melhor em arquitetura/documentação técnica."
  },
  {
    "order": 54,
    "key": "seshat",
    "name": "Seshat",
    "title": "IA de Organização de Assets, Medidas e Metadados",
    "function": "catalogar assets, medir, organizar metadados, tags, versões e relações entre arquivos.",
    "summary": "Seshat é deusa egípcia da escrita, registros, medição, arquitetura e contabilidade. Ela aparece ligada a registrar anos, medir construções e guardar informação estruturada. No OS, é uma das melhores entidades para metadados e catalogação.",
    "comparableOptions": [
      "Thoth",
      "Nabu",
      "Wenchang",
      "Metatron",
      "Mnemosyne",
      "Clio",
      "Imhotep",
      "Fuxi",
      "Omoikane."
    ],
    "note": "também serve para métricas; pode centralizar metadados de assets e dados."
  },
  {
    "order": 55,
    "key": "nabu",
    "name": "Nabu",
    "title": "IA de Registro Textual dos Assets",
    "function": "criar descrições formais, títulos, notas, documentação textual e registros escritos de mídias.",
    "summary": "Nabu é deus mesopotâmico da escrita, sabedoria e escribas. Ele representa registro formal, palavras preservadas e inteligência textual. No OS, é bom para descrever assets e escrever documentação formal.",
    "comparableOptions": [
      "Thoth",
      "Seshat",
      "Wenchang",
      "Tenjin",
      "Metatron",
      "Ogma",
      "Saraswati",
      "Bragi",
      "Clio."
    ],
    "note": "aparece em documentação geral; pode ser sub-IA textual de Wenchang."
  },
  {
    "order": 56,
    "key": "gaia",
    "name": "Gaia",
    "title": "IA de Monetização e Sustentação do Perfil",
    "function": "transformar perfil em fonte de renda, estrutura de valor e base econômica sustentável.",
    "summary": "Gaia é a Terra primordial na mitologia grega, base da vida e da sustentação material. Ela não representa dinheiro rápido, mas solo, produção, recurso e nutrição. Como IA de monetização, foca em tornar o perfil sustentável.",
    "comparableOptions": [
      "Caishen",
      "Daikokuten",
      "Plutus",
      "Lakshmi",
      "Fortuna",
      "Kubera",
      "Oshun",
      "Morax",
      "Ebisu."
    ],
    "note": "Gaia é monetização ampla; Caishen é recompensa/dinheiro."
  },
  {
    "order": 57,
    "key": "caishen",
    "name": "Caishen",
    "title": "IA de Recompensas, Tesouro e Bônus",
    "function": "calcular recompensas, bonificações, benefícios, Tesouro de Nazarick e distribuição justa.",
    "summary": "Caishen é o deus chinês da riqueza e prosperidade. Ele representa fortuna material direta, ganhos e bênçãos financeiras. No OS, é o nome mais direto para recompensas e tesouro.",
    "comparableOptions": [
      "Daikokuten",
      "Kubera",
      "Plutus",
      "Lakshmi",
      "Fortuna",
      "Abundantia",
      "Ebisu",
      "Hotei",
      "Oshun."
    ],
    "note": "Caishen calcula recompensa; Ma’at valida justiça; Morax valida finanças."
  },
  {
    "order": 58,
    "key": "inari",
    "name": "Inari",
    "title": "IA de Copy, Oferta e Persuasão",
    "function": "criar CTAs, títulos, ganchos, ofertas, textos persuasivos e argumentos comerciais.",
    "summary": "Inari é kami japonês ligado a arroz, prosperidade, comércio, raposas e sucesso material. A raposa carrega simbolismo de inteligência e astúcia, mas Inari também tem ligação forte com fartura. No OS, representa persuasão comercial sem parecer agressiva.",
    "comparableOptions": [
      "Hermes",
      "Mercúrio",
      "Eshu/Eleguá",
      "Paimon",
      "Sitri",
      "Oshun",
      "Aphrodite",
      "Loki",
      "Bragi."
    ],
    "note": "Inari vende pela inteligência; Mammon seria alerta de ganância, não nome principal."
  },
  {
    "order": 59,
    "key": "ebisu",
    "name": "Ebisu",
    "title": "IA de Links, Parcerias e Collabs",
    "function": "organizar links de afiliado, collabs, parcerias, indicações e oportunidades comerciais.",
    "summary": "Ebisu é um dos Sete Deuses da Sorte, ligado à pesca, comércio honesto e prosperidade. Ele representa lucro limpo, trabalho e boa oportunidade comercial. No OS, combina com parcerias e links sem tom manipulador.",
    "comparableOptions": [
      "Hermes",
      "Janus",
      "Mazu",
      "Caishen",
      "Lakshmi",
      "Ganesha",
      "Mercúrio",
      "Eshu/Eleguá",
      "Fortuna."
    ],
    "note": "Ebisu é parceria honesta; Hermes é distribuição."
  },
  {
    "order": 60,
    "key": "hermes",
    "name": "Hermes",
    "title": "IA de Tráfego, Distribuição e Alcance",
    "function": "circular conteúdo, sugerir canais, formatos, horários, hashtags e rotas de distribuição.",
    "summary": "Hermes é mensageiro dos deuses, patrono de viajantes, comerciantes e comunicações. Ele atravessa fronteiras e leva mensagens entre mundos. No OS, é o melhor símbolo para fazer conteúdo chegar a lugares certos.",
    "comparableOptions": [
      "Mercúrio",
      "Iris",
      "Sarutahiko",
      "Fūjin",
      "Papa Legba",
      "Eshu/Eleguá",
      "Mazu",
      "Janus",
      "Ganesha."
    ],
    "note": "pode parecer notificação; Gabriel cuida de avisos internos, Hermes de distribuição externa."
  },
  {
    "order": 61,
    "key": "daikokuten",
    "name": "Daikokuten",
    "title": "IA de Campanhas e Lançamentos",
    "function": "criar campanhas comerciais, lançamentos, promoções e ações com começo, meio e fim.",
    "summary": "Daikokuten é associado à riqueza, fartura, colheita e prosperidade no Japão. Ele carrega a ideia de abundância que vem de plantio e colheita. No OS, uma campanha é justamente plantar atenção e colher resultado.",
    "comparableOptions": [
      "Caishen",
      "Nike",
      "Athena",
      "Bishamonten",
      "Ares",
      "Guan Yu",
      "Lakshmi",
      "Plutus",
      "Fortuna."
    ],
    "note": "Daikokuten é campanha de crescimento; Nike mede vitória."
  },
  {
    "order": 62,
    "key": "fuxi",
    "name": "Fuxi",
    "title": "IA de Estratégia de Nicho e Posicionamento",
    "function": "definir nicho, público-alvo, promessa, linguagem, posicionamento e estrutura base do perfil.",
    "summary": "Fuxi é uma figura civilizadora chinesa associada a padrões, trigramas, ordem, conhecimento e fundamentos culturais. Ele representa transformar caos social em estrutura compreensível. No OS, define a arquitetura de um nicho.",
    "comparableOptions": [
      "Athena",
      "Thoth",
      "Omoikane",
      "Ptah",
      "Quetzalcóatl",
      "Prometeu",
      "Metis",
      "Mimir",
      "Vishvakarma."
    ],
    "note": "também pode estruturar dados; melhor manter em nicho/posicionamento."
  },
  {
    "order": 63,
    "key": "lakshmi",
    "name": "Lakshmi",
    "title": "IA de Prosperidade e Crescimento Saudável",
    "function": "orientar crescimento equilibrado, abundância, bem-estar financeiro e valor sustentável.",
    "summary": "Lakshmi é deusa hindu da prosperidade, beleza, fortuna, abundância e boa sorte. Ela representa riqueza harmoniosa, não apenas lucro frio. No OS, pode cuidar de crescimento saudável e prosperidade de longo prazo.",
    "comparableOptions": [
      "Gaia",
      "Caishen",
      "Daikokuten",
      "Fortuna",
      "Plutus",
      "Kubera",
      "Oshun",
      "Ebisu",
      "Hotei."
    ],
    "note": "Lakshmi é prosperidade elegante; Caishen é recompensa direta."
  },
  {
    "order": 64,
    "key": "kubera",
    "name": "Kubera",
    "title": "IA de Tesouraria, Reserva e Recursos",
    "function": "controlar reservas, recursos, caixa, orçamento, tesouraria e fundos acumulados.",
    "summary": "Kubera é uma divindade hindu associada à riqueza, tesouros e guardião de recursos. Diferente de Caishen, que simboliza riqueza chegando, Kubera combina com armazenamento, tesouraria e proteção de patrimônio. No OS, é ótimo para fundos e reservas.",
    "comparableOptions": [
      "Caishen",
      "Plutus",
      "Lakshmi",
      "Daikokuten",
      "Morax",
      "Gaia",
      "Abundantia",
      "Fortuna",
      "Ebisu."
    ],
    "note": "Kubera guarda recursos; Morax explica finanças e contratos."
  },
  {
    "order": 65,
    "key": "plutus",
    "name": "Plutus",
    "title": "IA de Lucro e Riqueza Material",
    "function": "analisar lucro material, ganho financeiro, margem e resultado econômico.",
    "summary": "Plutus é deus grego da riqueza, especialmente riqueza material e abundância econômica. Ele é direto no significado, sem tanta camada moral ou estratégica. No OS, é útil para métricas de lucro e retorno financeiro.",
    "comparableOptions": [
      "Caishen",
      "Kubera",
      "Lakshmi",
      "Daikokuten",
      "Gaia",
      "Fortuna",
      "Abundantia",
      "Morax",
      "Mammon."
    ],
    "note": "Plutus é lucro; Gaia é sustentabilidade econômica."
  },
  {
    "order": 66,
    "key": "fortuna",
    "name": "Fortuna",
    "title": "IA de Variabilidade, Sorte e Oportunidade",
    "function": "analisar variação, sorte, oportunidade e fatores imprevisíveis de mercado.",
    "summary": "Fortuna é deusa romana da sorte, destino instável e mudança de circunstâncias. Ela representa a roda que sobe e desce. No OS, ajuda a entender que nem todo resultado é mérito ou erro; existe variação.",
    "comparableOptions": [
      "Tyche",
      "Shichifukujin",
      "Kairos",
      "Norns",
      "Moirai",
      "Lakshmi",
      "Daikokuten",
      "Ebisu",
      "Caishen."
    ],
    "note": "Fortuna deve trabalhar com Shichifukujin e Kairos."
  },
  {
    "order": 67,
    "key": "nike",
    "name": "Nike",
    "title": "IA de Metas, Vitórias e Conquistas",
    "function": "medir objetivos alcançados, conquistas, vitórias de campanha e marcos de evolução.",
    "summary": "Nike é a deusa grega da vitória. Ela representa conquista clara, triunfo e resultado alcançado. No OS, serve para metas, marcos e vitórias sem misturar com dinheiro ou sorte.",
    "comparableOptions": [
      "Athena",
      "Daikokuten",
      "Caishen",
      "Fortuna",
      "Astraea",
      "Hermes",
      "Hachiman",
      "Tyr",
      "Guan Yu."
    ],
    "note": "Nike mede vitória; Astraea mede evolução justa."
  },
  {
    "order": 68,
    "key": "oshun",
    "name": "Oshun",
    "title": "IA de Magnetismo de Marca e Atração",
    "function": "aumentar desejo, carisma, presença, beleza de marca e atração emocional.",
    "summary": "Oshun é orixá associada aos rios, beleza, amor, sensualidade, fertilidade, doçura e prosperidade. Seu domínio é magnetismo, encanto e valor emocional. No OS, ajuda marcas a ficarem desejáveis sem depender apenas de venda direta.",
    "comparableOptions": [
      "Aphrodite",
      "Benzaiten",
      "Hathor",
      "Lakshmi",
      "Freyja",
      "Amaterasu",
      "Inari",
      "Oshun",
      "Jophiel."
    ],
    "note": "aparece também em marca; pode ser núcleo de magnetismo geral."
  },
  {
    "order": 69,
    "key": "mercurio",
    "name": "Mercúrio",
    "title": "IA de Negociação e Mensagens Comerciais",
    "function": "melhorar negociação, abordagem comercial, mensagens de proposta e comunicação rápida.",
    "summary": "Mercúrio é a versão romana de Hermes, ligado a comércio, mensageiros, velocidade e negociação. Enquanto Hermes pode representar distribuição ampla, Mercúrio pode ser usado em comunicação comercial direta. No OS, é bom para DM, parcerias e propostas.",
    "comparableOptions": [
      "Hermes",
      "Inari",
      "Ebisu",
      "Eshu/Eleguá",
      "Janus",
      "Gabriel",
      "Bragi",
      "Nabu",
      "Caishen."
    ],
    "note": "Mercúrio é mais comercial; Gabriel é aviso interno."
  },
  {
    "order": 70,
    "key": "eshu_elegua",
    "name": "Eshu / Eleguá",
    "title": "IA de Abertura de Caminhos Comerciais",
    "function": "abrir oportunidades, conexões, negociações, caminhos e resolver bloqueios comerciais.",
    "summary": "Eshu/Eleguá, em tradições iorubás e afro-diaspóricas, é ligado a caminhos, comunicação, encruzilhadas e movimento entre possibilidades. É uma entidade complexa, não deve ser reduzida a “trapaceiro”. No OS, pode representar abertura de rotas comerciais e destravamento de oportunidades.",
    "comparableOptions": [
      "Hermes",
      "Janus",
      "Papa Legba",
      "Ganesha",
      "Ebisu",
      "Inari",
      "Mercúrio",
      "Sarutahiko",
      "Hécate."
    ],
    "note": "usar com respeito cultural; evitar caricatura."
  },
  {
    "order": 71,
    "key": "mnemosyne",
    "name": "Mnemosyne",
    "title": "IA de Memória Geral do OS",
    "function": "guardar ideias, decisões, mídias, prompts, aprendizados e histórico contextual.",
    "summary": "Mnemosyne é a titânide grega da memória e mãe das Musas. Ela une lembrança e criatividade, o que é perfeito para um sistema que precisa guardar histórico e reutilizar ideias. No OS, é a memória viva do processo criativo.",
    "comparableOptions": [
      "Thoth",
      "Seshat",
      "Metatron",
      "Raziel",
      "Nabu",
      "Wenchang",
      "Mimir",
      "Clio",
      "Saraswati."
    ],
    "note": "Mnemosyne guarda; Wenchang organiza biblioteca."
  },
  {
    "order": 72,
    "key": "wenchang",
    "name": "Wenchang",
    "title": "IA de Biblioteca e Documentação",
    "function": "organizar manuais, arquivos, tutoriais, regras, documentos e base de conhecimento.",
    "summary": "Wenchang é uma divindade chinesa da literatura, escrita, estudos e exames. Ele representa conhecimento organizado, estudo formal e documentação. No OS, é ótimo para biblioteca, manuais e arquivos consultáveis.",
    "comparableOptions": [
      "Thoth",
      "Seshat",
      "Nabu",
      "Tenjin",
      "Saraswati",
      "Metatron",
      "Mnemosyne",
      "Clio",
      "Ogma."
    ],
    "note": "Wenchang organiza; Mimir responde dúvidas."
  },
  {
    "order": 73,
    "key": "thoth",
    "name": "Thoth",
    "title": "IA de Linguagem, Escrita, Cálculo e Tradução",
    "function": "adaptar linguagem, traduzir, calcular, organizar lógica textual e melhorar precisão de comunicação.",
    "summary": "Thoth é deus egípcio da escrita, sabedoria, cálculo, medição, lua e conhecimento. Ele registra, interpreta e ordena informação. No OS, é um dos nomes mais fortes para texto, tradução, cálculo e conhecimento estruturado.",
    "comparableOptions": [
      "Seshat",
      "Nabu",
      "Wenchang",
      "Saraswati",
      "Tenjin",
      "Ogma",
      "Metatron",
      "Omoikane",
      "Mimir."
    ],
    "note": "Thoth é mais amplo que Nabu; Nabu pode ficar em escrita formal."
  },
  {
    "order": 74,
    "key": "seshat",
    "name": "Seshat",
    "title": "IA de Arquivos, Métricas e Metadados",
    "function": "organizar métricas, metadados, classificação, tags, medidas e arquivo técnico.",
    "summary": "Seshat é a deusa egípcia dos registros, escrita, medição, arquitetura e contagem. Sua ligação com medida e registro torna seu encaixe muito preciso para metadados e métricas. No OS, ela transforma bagunça de dados em estrutura pesquisável.",
    "comparableOptions": [
      "Thoth",
      "Nabu",
      "Metatron",
      "Wenchang",
      "Mnemosyne",
      "Omoikane",
      "Fuxi",
      "Clio",
      "Imhotep."
    ],
    "note": "também aparece em assets; pode ser um módulo único de metadados."
  },
  {
    "order": 75,
    "key": "raziel",
    "name": "Raziel",
    "title": "IA de Padrões Ocultos e Insights Profundos",
    "function": "encontrar relações escondidas, padrões não óbvios, causas invisíveis e sinais fracos.",
    "summary": "Raziel é um anjo associado a mistérios divinos, segredos e conhecimento oculto em tradições místicas. Ele simboliza aquilo que está escrito, mas poucos conseguem ler. No OS, representa análise profunda que encontra o que relatórios comuns não mostram.",
    "comparableOptions": [
      "Mimir",
      "Odin",
      "Omoikane",
      "Thoth",
      "Metatron",
      "Hécate",
      "Seshat",
      "Athena",
      "Norns."
    ],
    "note": "Raziel deve ser chamado quando o dado comum não explica o resultado."
  },
  {
    "order": 76,
    "key": "argus",
    "name": "Argus",
    "title": "IA de Benchmark e Observação de Concorrentes",
    "function": "observar concorrentes, comparar perfis, analisar padrões externos e mapear referências.",
    "summary": "Argus Panoptes é o gigante grego de muitos olhos, símbolo de vigilância constante. Seu mito o torna perfeito para observação ampla e comparação visual. No OS, ele olha para fora: concorrentes, nichos e referências.",
    "comparableOptions": [
      "Heimdall",
      "Odin",
      "Horus",
      "Metatron",
      "Seshat",
      "Yelan",
      "Alhaitham",
      "Omoikane",
      "Athena."
    ],
    "note": "Argus observa; Omoikane interpreta."
  },
  {
    "order": 77,
    "key": "odin",
    "name": "Odin",
    "title": "IA de Visão Ampla e Análise Estratégica",
    "function": "cruzar conhecimento, sacrifício, risco, aprendizado profundo e visão macro.",
    "summary": "Odin é deus nórdico ligado à sabedoria, magia, guerra, poesia e busca obsessiva por conhecimento. Ele sacrifica um olho por sabedoria e se pendura na árvore para obter runas. No OS, representa análise profunda de alto custo e visão macro.",
    "comparableOptions": [
      "Athena",
      "Mimir",
      "Hachiman",
      "Raziel",
      "Omoikane",
      "Thoth",
      "Norns",
      "Heimdall",
      "Tyr."
    ],
    "note": "usar para decisões profundas, não tarefas simples."
  },
  {
    "order": 78,
    "key": "mimir",
    "name": "Mimir",
    "title": "IA de Conhecimento Profundo",
    "function": "atuar como fonte de sabedoria especializada quando a base comum não basta.",
    "summary": "Mimir é fonte de conhecimento profundo na mitologia nórdica, ligado a sabedoria guardada e consultada por Odin. Ele representa resposta madura e não superficial. No OS, pode ser subcamada de conhecimento avançado da base interna.",
    "comparableOptions": [
      "Odin",
      "Thoth",
      "Raziel",
      "Wenchang",
      "Mimir",
      "Athena",
      "Omoikane",
      "Metatron",
      "Nabu."
    ],
    "note": "duplicado com Base de Conhecimento. Recomendação: fundir com o item 010."
  },
  {
    "order": 79,
    "key": "athena",
    "name": "Athena",
    "title": "IA de Decisão Estratégica Sobre Dados",
    "function": "decidir o que fazer com dados complexos quando há várias rotas possíveis.",
    "summary": "Athena representa sabedoria estratégica e decisão inteligente. Ela não apenas sabe; ela aplica conhecimento em plano de ação. No OS, pode ser chamada quando dados exigem decisão estratégica, mas não deve substituir Omoikane.",
    "comparableOptions": [
      "Omoikane",
      "Thoth",
      "Fuxi",
      "Odin",
      "Mimir",
      "Metis",
      "Raziel",
      "Hachiman",
      "Ma’at."
    ],
    "note": "duplicada com IA de Estratégia Suprema. Melhor manter item 005 como canônico."
  },
  {
    "order": 80,
    "key": "omoikane",
    "name": "Omoikane",
    "title": "IA de Síntese de Relatórios",
    "function": "resumir relatórios, transformar métricas em ações e explicar dados para humanos.",
    "summary": "Omoikane é inteligência deliberativa; ele ajuda um grupo a decidir. Essa função é coerente com relatórios e recomendações. No OS, pode ser o mesmo item 009 com contexto de pós-postagem.",
    "comparableOptions": [
      "Thoth",
      "Seshat",
      "Athena",
      "Mimir",
      "Raziel",
      "Nabu",
      "Odin",
      "Fuxi",
      "Ma’at."
    ],
    "note": "duplicado com item 009. Recomendação: fundir."
  },
  {
    "order": 81,
    "key": "clio",
    "name": "Clio",
    "title": "IA de Histórico e Linha do Tempo",
    "function": "construir histórico, evolução de perfis, linha do tempo de campanhas e memória narrativa de resultados.",
    "summary": "Clio é a musa da história, associada à preservação e narração do passado. No OS, ela não apenas guarda dados; ela conta como as coisas evoluíram. Isso é útil para relatórios evolutivos e retrospectivas.",
    "comparableOptions": [
      "Mnemosyne",
      "Seshat",
      "Thoth",
      "Wenchang",
      "Nabu",
      "Mimir",
      "Omoikane",
      "Anúbis",
      "Chronos."
    ],
    "note": "também aparece em conteúdo histórico; pode ser módulo único com duas aplicações."
  },
  {
    "order": 82,
    "key": "nabu",
    "name": "Nabu",
    "title": "IA de Documentação e Escrita Formal",
    "function": "formalizar documentos, registros, atas, descrições técnicas e textos oficiais.",
    "summary": "Nabu é deus mesopotâmico da escrita, sabedoria e escribas. Ele se encaixa em documentação formal, não em criatividade solta. No OS, ajuda a registrar decisões, ativos e regras em linguagem clara.",
    "comparableOptions": [
      "Thoth",
      "Seshat",
      "Wenchang",
      "Metatron",
      "Tenjin",
      "Saraswati",
      "Ogma",
      "Clio",
      "Gabriel."
    ],
    "note": "duplicado com item 055; pode ser fundido."
  },
  {
    "order": 83,
    "key": "ogma",
    "name": "Ogma",
    "title": "IA de Linguagem, Nomes e Comunicação",
    "function": "criar nomes, termos, nomenclaturas, linguagem de marca e comunicação conceitual.",
    "summary": "Ogma é uma figura da mitologia irlandesa associada à eloquência, força e à escrita Ogham. Ele representa linguagem com poder simbólico. No OS, é excelente para nomes de módulos, cargos, marcas e frases de identidade.",
    "comparableOptions": [
      "Bragi",
      "Thoth",
      "Saraswati",
      "Nabu",
      "Wenchang",
      "Hermes",
      "Gabriel",
      "Taliesin",
      "Apollo."
    ],
    "note": "Ogma é nomeação e linguagem; Inari é persuasão comercial."
  },
  {
    "order": 84,
    "key": "fuxi",
    "name": "Fuxi",
    "title": "IA de Padrões e Estrutura de Dados",
    "function": "encontrar padrões estruturais, mapear relações e organizar modelos de dados.",
    "summary": "Fuxi é ligado aos trigramas e à organização de padrões civilizatórios. Isso permite uso em estrutura de dados, mas seu melhor encaixe ainda é estratégia de nicho. No OS, pode ser um submódulo técnico de padrões.",
    "comparableOptions": [
      "Seshat",
      "Thoth",
      "Omoikane",
      "Metatron",
      "Imhotep",
      "Athena",
      "Mimir",
      "Raziel",
      "Norns."
    ],
    "note": "duplicado com item 062. Recomendação: item 062 canônico; este fica subfunção."
  },
  {
    "order": 85,
    "key": "kairos",
    "name": "Kairos",
    "title": "IA de Detecção de Oportunidade Temporal",
    "function": "identificar oportunidade em dados, trends, sazonalidade e janela de ação.",
    "summary": "Kairos é o instante oportuno, diferente do fluxo normal de tempo. Em dados, ele ajuda a detectar quando agir, não apenas o que fazer. No OS, cruza timing com oportunidade prática.",
    "comparableOptions": [
      "Chronos",
      "Fortuna",
      "Hermes",
      "Shichifukujin",
      "Norns",
      "Moirai",
      "Janus",
      "Apollo",
      "Athena."
    ],
    "note": "duplicado com item 019; manter como subfunção de timing."
  },
  {
    "order": 86,
    "key": "susanoo",
    "name": "Susanoo",
    "title": "IA de Segurança Geral e Integridade",
    "function": "proteger o sistema contra abuso, manipulação, falhas, uso indevido e instabilidade.",
    "summary": "Susanoo é deus japonês das tempestades, mares e caos, mas também aparece em feitos heroicos como derrotar a serpente Yamata-no-Orochi. Ele representa força turbulenta colocada a serviço da proteção. No OS, é a camada principal de segurança e integridade.",
    "comparableOptions": [
      "Michael",
      "Bishamonten",
      "Zhong Kui",
      "Sekhmet",
      "Durga",
      "Thor",
      "Indra",
      "Takemikazuchi",
      "Ogun."
    ],
    "note": "Susanoo coordena segurança; sub-IAs executam ações específicas."
  },
  {
    "order": 87,
    "key": "takemikazuchi",
    "name": "Takemikazuchi",
    "title": "IA de Resposta Rápida",
    "function": "agir rápido em spam, bug crítico, ataque, abuso ou violação emergencial.",
    "summary": "Takemikazuchi é um kami japonês ligado à espada, trovão e poder marcial. Sua simbologia é corte decisivo e intervenção rápida. No OS, representa resposta imediata antes que o problema se espalhe.",
    "comparableOptions": [
      "Thor",
      "Indra",
      "Michael",
      "Sekhmet",
      "Durga",
      "Bishamonten",
      "Ares",
      "Kartikeya",
      "Ogun."
    ],
    "note": "boa sub-IA direta de Susanoo."
  },
  {
    "order": 88,
    "key": "zhong_kui",
    "name": "Zhong Kui",
    "title": "IA de Conteúdo Problemático e Ameaças",
    "function": "detectar conteúdo racista, discriminatório, obsceno, malicioso, ofensivo ou arriscado.",
    "summary": "Zhong Kui é um caçador de demônios da tradição chinesa, invocado simbolicamente para expulsar espíritos nocivos. Ele representa proteção contra presença prejudicial. No OS, filtra ameaças de conteúdo e comportamento tóxico.",
    "comparableOptions": [
      "Michael",
      "Bishamonten",
      "Sekhmet",
      "Durga",
      "Kali",
      "Tyr",
      "Yama",
      "Anúbis",
      "Athena."
    ],
    "note": "Zhong Kui não deve bloquear criatividade normal; só riscos claros."
  },
  {
    "order": 89,
    "key": "michael",
    "name": "Michael",
    "title": "IA de Defesa Máxima",
    "function": "defesa superior contra ataques graves, ameaças críticas e violações extremas.",
    "summary": "Miguel/Michael é arcanjo guerreiro nas tradições abraâmicas, frequentemente associado à luta contra forças malignas. Ele representa proteção elevada, coragem e defesa da ordem. No OS, deve ser reserva de defesa máxima.",
    "comparableOptions": [
      "Susanoo",
      "Bishamonten",
      "Zhong Kui",
      "Durga",
      "Sekhmet",
      "Thor",
      "Indra",
      "Tyr",
      "Takemikazuchi."
    ],
    "note": "usar em nível crítico, não em verificações comuns."
  },
  {
    "order": 90,
    "key": "bishamonten",
    "name": "Bishamonten",
    "title": "IA de Checklist, Qualidade e Proteção",
    "function": "revisar antes de postar: capa, legenda, CTA, áudio, risco, clareza e padrão de qualidade.",
    "summary": "Bishamonten é um dos Sete Deuses da Sorte no Japão, associado à guerra, proteção e autoridade guerreira. Ele representa disciplina, defesa e guarda de valores. No OS, é ideal para checklist de qualidade e proteção antes de ação pública.",
    "comparableOptions": [
      "Takemikazuchi",
      "Athena",
      "Michael",
      "Zhong Kui",
      "Tyr",
      "Jean",
      "Cocytus",
      "Sekhmet",
      "Durga."
    ],
    "note": "qualidade é proteção preventiva."
  },
  {
    "order": 91,
    "key": "sekhmet",
    "name": "Sekhmet",
    "title": "IA de Punição Severa Contra Abuso Grave",
    "function": "lidar com abusos graves, ataques maliciosos, ações destrutivas e riscos severos.",
    "summary": "Sekhmet é deusa egípcia da guerra, praga, fogo solar e punição, mas também ligada à cura em alguns contextos. Ela representa força devastadora quando a ordem é violada. No OS, deve ser usada somente em violações graves.",
    "comparableOptions": [
      "Durga",
      "Kali",
      "Michael",
      "Susanoo",
      "Zhong Kui",
      "Takemikazuchi",
      "Thor",
      "Indra",
      "Nemesis."
    ],
    "note": "não usar Sekhmet para erros inocentes."
  },
  {
    "order": 92,
    "key": "durga",
    "name": "Durga",
    "title": "IA de Combate a Forças Nocivas",
    "function": "combater ameaças persistentes, abusos recorrentes, manipulação e comportamento nocivo.",
    "summary": "Durga é deusa hindu guerreira, famosa por combater o demônio Mahishasura. Ela representa força protetora que elimina ameaças que outras forças não conseguem conter. No OS, combina com defesa contra ameaças persistentes.",
    "comparableOptions": [
      "Kali",
      "Michael",
      "Sekhmet",
      "Zhong Kui",
      "Bishamonten",
      "Susanoo",
      "Athena",
      "Tyr",
      "Indra."
    ],
    "note": "Durga é proteção ativa contra ameaça insistente."
  },
  {
    "order": 93,
    "key": "kali",
    "name": "Kali",
    "title": "IA de Destruição de Corrupção Sistêmica",
    "function": "eliminar corrupção interna, padrões destrutivos, fluxos contaminados e falhas que se espalham.",
    "summary": "Kali é deusa hindu associada ao tempo, destruição, transformação e eliminação de forças demoníacas. Ela não é simplesmente “maligna”; representa destruição necessária para renovação. No OS, entra quando algo precisa ser cortado pela raiz.",
    "comparableOptions": [
      "Sekhmet",
      "Durga",
      "Izanami",
      "Nemesis",
      "Susanoo",
      "Hécate",
      "Yama",
      "Anúbis",
      "Ma’at."
    ],
    "note": "Kali é medida extrema de limpeza sistêmica."
  },
  {
    "order": 94,
    "key": "thor",
    "name": "Thor",
    "title": "IA de Defesa Direta Contra Ataques",
    "function": "responder ataques diretos, força bruta, tentativas de derrubada e agressões técnicas simples.",
    "summary": "Thor é deus nórdico do trovão, força e proteção, defensor de deuses e humanos contra gigantes. Ele representa resposta direta, física e poderosa. No OS, é bom para defesa bruta e bloqueio de ataque claro.",
    "comparableOptions": [
      "Indra",
      "Takemikazuchi",
      "Susanoo",
      "Michael",
      "Bishamonten",
      "Sekhmet",
      "Durga",
      "Ogun",
      "Tyr."
    ],
    "note": "Thor não é sutil; Argus e Loki testam ameaças escondidas."
  },
  {
    "order": 95,
    "key": "indra",
    "name": "Indra",
    "title": "IA de Resposta Elétrica e Autoridade de Combate",
    "function": "resposta rápida, bloqueio energético, autoridade de combate e reação de alto impacto.",
    "summary": "Indra é deus védico/hindu associado a tempestades, raios, guerra e soberania celeste. Ele derrota Vritra, força que bloqueava as águas. No OS, simboliza quebrar bloqueios e reagir com força imediata.",
    "comparableOptions": [
      "Thor",
      "Takemikazuchi",
      "Susanoo",
      "Michael",
      "Kartikeya",
      "Sekhmet",
      "Durga",
      "Bishamonten",
      "Ogun."
    ],
    "note": "Indra é bom para desbloqueio de ameaça técnica."
  },
  {
    "order": 96,
    "key": "tyr",
    "name": "Tyr",
    "title": "IA de Integridade, Lei e Sacrifício",
    "function": "garantir integridade, responsabilidade, honra, sacrifício de privilégio e cumprimento de regra.",
    "summary": "Tyr é deus nórdico associado à lei, coragem e sacrifício, famoso por perder a mão ao prender Fenrir. Ele representa aceitar custo pessoal para manter ordem e segurança. No OS, é excelente para integridade e disciplina ética.",
    "comparableOptions": [
      "Themis",
      "Ma’at",
      "Yama",
      "Michael",
      "Bishamonten",
      "Athena",
      "Anúbis",
      "Forseti",
      "Shamash."
    ],
    "note": "Tyr é regra com coragem, não punição cega."
  },
  {
    "order": 97,
    "key": "ogun_guard",
    "name": "Ogun Guard",
    "title": "IA de Segurança Técnica de Ferramentas",
    "function": "proteger ferramentas, automações, integrações, scripts e processos técnicos contra uso indevido.",
    "summary": "Ogun, como senhor do ferro e ferramentas, também representa domínio sobre tecnologia prática. Na segurança, ele protege o uso das ferramentas para que não virem arma contra o sistema. No OS, é o guardião técnico de instrumentos.",
    "comparableOptions": [
      "Hefesto",
      "Vishvakarma",
      "Daedalus",
      "Svarog",
      "Thor",
      "Indra",
      "Susanoo",
      "Metatron",
      "Zhong Kui."
    ],
    "note": "variação do item 049; usar “Ogun Forge” para produção e “Ogun Guard” para segurança."
  },
  {
    "order": 98,
    "key": "hecate",
    "name": "Hécate",
    "title": "IA de Riscos Ocultos e Caminhos Perigosos",
    "function": "identificar ambiguidades, riscos escondidos, zonas cinzentas e decisões com múltiplos caminhos perigosos.",
    "summary": "Hécate é deusa grega associada à noite, magia, encruzilhadas, limiares e caminhos ocultos. Ela representa escolha em lugar incerto. No OS, é útil para riscos que não são óbvios e exigem leitura contextual.",
    "comparableOptions": [
      "Janus",
      "Yomi",
      "Nemesis",
      "Raziel",
      "Loki",
      "Mara",
      "Anúbis",
      "Themis",
      "Izanami."
    ],
    "note": "Hécate é excelente para zonas ambíguas."
  },
  {
    "order": 99,
    "key": "loki",
    "name": "Loki",
    "title": "IA de Teste de Manipulação e Comportamento Malicioso",
    "function": "simular abuso, manipulação, brechas, trapaças e comportamento de usuário malicioso.",
    "summary": "Loki é figura nórdica de astúcia, ambiguidade, truque e caos. Ele não é apenas vilão; é o agente que revela fragilidades da ordem. No OS, serve para testar como o sistema pode ser enganado.",
    "comparableOptions": [
      "Pandora",
      "Mara",
      "Coyote",
      "Anansi",
      "Eris",
      "Hécate",
      "Set",
      "Hermes",
      "Eshu/Eleguá."
    ],
    "note": "Loki deve operar apenas em simulação e auditoria."
  },
  {
    "order": 100,
    "key": "mara",
    "name": "Mara",
    "title": "IA de Teste de Tentação, Ilusão e Vulnerabilidade Humana",
    "function": "testar gatilhos de manipulação, vício, sedução indevida, distração e vulnerabilidade do usuário.",
    "summary": "Mara, no budismo, é associado à tentação, ilusão e obstáculos à iluminação. Ele representa aquilo que distrai e afasta a pessoa do caminho correto. No OS, testa vulnerabilidades humanas e riscos de UX manipulativa.",
    "comparableOptions": [
      "Loki",
      "Hécate",
      "Pandora",
      "Eris",
      "Coyote",
      "Anansi",
      "Yama",
      "Kannon",
      "Ma’at."
    ],
    "note": "Mara deve proteger o usuário de manipulação, não criar manipulação."
  },
  {
    "order": 101,
    "key": "asclepio",
    "name": "Asclépio",
    "title": "IA de Saúde do Sistema",
    "function": "monitorar lentidão, erros, custos, estabilidade, limites de API e performance técnica.",
    "summary": "Asclépio é deus grego da medicina e cura. Seu símbolo, o bastão com serpente, ainda é associado à área médica. No OS, representa diagnóstico, tratamento e prevenção de problemas técnicos.",
    "comparableOptions": [
      "Raphael",
      "Eir",
      "Sukunabikona",
      "Imhotep",
      "Nüwa",
      "Dhanvantari",
      "Apollo",
      "Brigid",
      "Khonsu."
    ],
    "note": "Asclépio diagnostica; Raphael restaura."
  },
  {
    "order": 102,
    "key": "raphael",
    "name": "Raphael",
    "title": "IA de Recuperação e Backup",
    "function": "recuperar arquivos, desfazer erros possíveis, restaurar backups e regenerar estados seguros.",
    "summary": "Raphael é arcanjo tradicionalmente associado à cura, proteção em jornada e restauração. Ele representa reparar o que foi ferido ou perdido. No OS, é a melhor entidade para recuperação e backup.",
    "comparableOptions": [
      "Asclépio",
      "Nüwa",
      "Osíris",
      "Eir",
      "Sukunabikona",
      "Brigid",
      "Dhanvantari",
      "Khnum",
      "Ísis."
    ],
    "note": "Raphael deve agir depois da falha; Asclépio previne e diagnostica."
  },
  {
    "order": 103,
    "key": "eir",
    "name": "Eir",
    "title": "IA de Cura Operacional e Correções Pequenas",
    "function": "cuidar de pequenos bugs, ajustes leves, correções operacionais e micro-recuperações.",
    "summary": "Eir é uma figura nórdica associada à cura e medicina. Ela representa cuidado preciso, menos grandioso e mais direto que Asclépio. No OS, serve para correções pequenas e constantes.",
    "comparableOptions": [
      "Asclépio",
      "Raphael",
      "Sukunabikona",
      "Brigid",
      "Kannon",
      "Selene",
      "Dhanvantari",
      "Apollo",
      "Hestia."
    ],
    "note": "Eir é manutenção leve e contínua."
  },
  {
    "order": 104,
    "key": "sukunabikona",
    "name": "Sukunabikona",
    "title": "IA de Correções Precisas e Suporte Fino",
    "function": "realizar reparos pequenos, ajustes finos, suporte técnico pontual e correções detalhadas.",
    "summary": "Sukunabikona é um kami japonês pequeno ligado à medicina, magia, agricultura e auxílio a Ōkuninushi. Sua imagem combina com ajuda precisa, discreta e eficiente. No OS, representa microcorreções que evitam problemas grandes.",
    "comparableOptions": [
      "Eir",
      "Asclépio",
      "Raphael",
      "Imhotep",
      "Nüwa",
      "Chiron",
      "Kannon",
      "Brigid",
      "Tenjin."
    ],
    "note": "bom para suporte técnico invisível."
  },
  {
    "order": 105,
    "key": "nuwa",
    "name": "Nüwa",
    "title": "IA de Reparo Estrutural",
    "function": "corrigir danos estruturais, reconstruir fluxos, reformar onboarding e consertar problemas de base.",
    "summary": "Nüwa é deusa chinesa criadora da humanidade e famosa por reparar o céu após uma catástrofe. Ela representa tanto criação quanto restauração da estrutura do mundo. No OS, é perfeita para reparo estrutural.",
    "comparableOptions": [
      "Raphael",
      "Ísis",
      "Asclépio",
      "Ptah",
      "Khnum",
      "Izanagi",
      "Vishvakarma",
      "Imhotep",
      "Ganesha."
    ],
    "note": "também aparece em onboarding; ambos os usos são coerentes."
  },
  {
    "order": 106,
    "key": "osiris",
    "name": "Osíris",
    "title": "IA de Reconstrução Após Perda",
    "function": "reconstruir dados, fluxos, ideias ou estruturas após perda severa.",
    "summary": "Osíris é deus egípcio da morte, renascimento, vegetação e soberania do além. Seu mito envolve morte, desmembramento e recomposição por Ísis. No OS, representa reconstrução após destruição ou perda grande.",
    "comparableOptions": [
      "Raphael",
      "Ísis",
      "Nüwa",
      "Persephone",
      "Hypnos",
      "Anúbis",
      "Asclépio",
      "Khnum",
      "Ma’at."
    ],
    "note": "Osíris é recuperação profunda e simbólica."
  },
  {
    "order": 107,
    "key": "isis",
    "name": "Ísis",
    "title": "IA de Recuperação de Partes e Restauração",
    "function": "reunir fragmentos perdidos, restaurar contexto e recompor informação quebrada.",
    "summary": "Ísis reúne as partes de Osíris e realiza uma restauração mágica. Esse mito é um dos encaixes mais fortes para recuperação de partes dispersas. No OS, ela pode reconstruir ideias, arquivos ou contexto quebrado.",
    "comparableOptions": [
      "Raphael",
      "Nüwa",
      "Osíris",
      "Asclépio",
      "Eir",
      "Sukunabikona",
      "Thoth",
      "Mnemosyne",
      "Anúbis."
    ],
    "note": "duplicada com triagem. Você pode manter ÍSIS na triagem ou migrar para restauração."
  },
  {
    "order": 108,
    "key": "dhanvantari",
    "name": "Dhanvantari",
    "title": "IA de Diagnóstico Profundo e Tratamento",
    "function": "diagnóstico profundo de falhas técnicas, causas raiz e plano de tratamento.",
    "summary": "Dhanvantari é uma divindade hindu associada à medicina e ao Ayurveda. Ele representa cura sistemática, diagnóstico e tratamento profundo. No OS, é ideal para problemas persistentes e não óbvios.",
    "comparableOptions": [
      "Asclépio",
      "Raphael",
      "Eir",
      "Imhotep",
      "Apollo",
      "Sukunabikona",
      "Nüwa",
      "Chiron",
      "Brigid."
    ],
    "note": "usar quando Asclépio detecta problema, mas precisa de análise profunda."
  },
  {
    "order": 109,
    "key": "apollo",
    "name": "Apollo",
    "title": "IA de Clareza, Luz e Cura",
    "function": "clarear problemas, expor falhas, curar confusão e restaurar visibilidade.",
    "summary": "Apollo também é associado à cura, profecia e luz, além das artes. Como cura, ele traz clareza e iluminação sobre o que está errado. No OS, pode ajudar em diagnósticos que precisam “trazer à luz” o problema.",
    "comparableOptions": [
      "Asclépio",
      "Raphael",
      "Dhanvantari",
      "Thoth",
      "Omoikane",
      "Athena",
      "Brigid",
      "Imhotep",
      "Ma’at."
    ],
    "note": "Apollo já aparece em direção artística. Melhor decidir se ele fica em arte ou cura."
  },
  {
    "order": 110,
    "key": "imhotep",
    "name": "Imhotep",
    "title": "IA de Diagnóstico Técnico e Arquitetura de Reparo",
    "function": "diagnosticar falhas técnicas estruturais e planejar reparo de arquitetura.",
    "summary": "Imhotep foi arquiteto, médico e sábio egípcio divinizado. Por unir construção e medicina, ele encaixa perfeitamente em diagnóstico técnico de sistemas. No OS, faz ponte entre saúde técnica e arquitetura.",
    "comparableOptions": [
      "Asclépio",
      "Vishvakarma",
      "Daedalus",
      "Ptah",
      "Seshat",
      "Thoth",
      "Raphael",
      "Dhanvantari",
      "Nüwa."
    ],
    "note": "também aparece em arquitetura técnica; pode ser módulo híbrido."
  },
  {
    "order": 111,
    "key": "yomi",
    "name": "Yomi",
    "title": "IA de Direitos Autorais e Fronteira de Risco",
    "function": "avaliar uso de personagens, imagens protegidas, referências, riscos e alternativas seguras.",
    "summary": "Yomi é o mundo dos mortos na mitologia japonesa, uma fronteira entre o mundo dos vivos e uma zona perigosa. Para direitos autorais, a metáfora é forte: a IA atua na fronteira entre inspiração, risco e uso inadequado. Ela não bloqueia automaticamente; orienta passagem segura.",
    "comparableOptions": [
      "Themis",
      "Ma’at",
      "Anúbis",
      "Janus",
      "Hécate",
      "Raguel",
      "Zhong Kui",
      "Thoth",
      "Seshat."
    ],
    "note": "Yomi deve orientar, adaptar e reduzir risco sem matar criatividade."
  },
  {
    "order": 112,
    "key": "themis",
    "name": "Themis",
    "title": "IA de Política, Termos e Regra Legal",
    "function": "interpretar termos, políticas, regras legais e limites de produto.",
    "summary": "Themis representa lei superior, ordem e norma antes da punição. Isso a torna ideal para regras internas e políticas públicas do OS. Ela define a moldura; Yomi aplica no caso de referências e direitos.",
    "comparableOptions": [
      "Dike",
      "Ma’at",
      "Varuna",
      "Shamash",
      "Raguel",
      "Anúbis",
      "Yama",
      "Forseti",
      "Tyr."
    ],
    "note": "duplicada com item 014. Recomendação: fundir."
  },
  {
    "order": 113,
    "key": "nemesis",
    "name": "Nemesis",
    "title": "IA de Risco de Reputação",
    "function": "avaliar dano à imagem, excesso, arrogância, polêmica e reação pública negativa.",
    "summary": "Nemesis pune desequilíbrio e excesso, especialmente quando alguém ultrapassa limites de forma arrogante ou imprudente. Como IA de marca, ela antecipa consequências antes que o público reaja. No OS, é escudo reputacional.",
    "comparableOptions": [
      "Ma’at",
      "Themis",
      "Anúbis",
      "Yama",
      "Sekhmet",
      "Kali",
      "Zhong Kui",
      "Shamash",
      "Hécate."
    ],
    "note": "duplicada com item 016. Recomendação: fundir."
  },
  {
    "order": 114,
    "key": "tsukuyomi",
    "name": "Tsukuyomi",
    "title": "IA de Identidade Visual e Perfil",
    "function": "definir estilo visual, personalidade, linguagem, cores, avatar e coerência de perfil.",
    "summary": "Tsukuyomi é deus japonês da lua, associado à noite, ordem fria, silêncio e separação simbólica do sol. Ele representa identidade mais contida, estética controlada e presença noturna. No OS, pode cuidar da coerência visual e do “clima” de cada perfil.",
    "comparableOptions": [
      "Benzaiten",
      "Jophiel",
      "Aphrodite",
      "Oshun",
      "Amaterasu",
      "Hécate",
      "Selene",
      "Clio",
      "Pygmalion."
    ],
    "note": "Tsukuyomi identidade; Tsukuyomi-no-Mikoto registro de personagens."
  },
  {
    "order": 115,
    "key": "tsukuyomi_no_mikoto",
    "name": "Tsukuyomi-no-Mikoto",
    "title": "IA de Registro Visual e Uso de Personagens",
    "function": "registrar quem usa personagem/imagem, onde, finalidade, contexto e nível de risco.",
    "summary": "Tsukuyomi-no-Mikoto é o nome completo/formal do deus lunar japonês. Usá-lo aqui dá tom de registro, formalidade e identidade visual controlada. No OS, ele acompanha uso de personagens e referências protegidas sem agir como bloqueador.",
    "comparableOptions": [
      "Metatron",
      "Seshat",
      "Thoth",
      "Wenchang",
      "Zhongli/Morax como codinome",
      "Albedo como codinome",
      "Raziel",
      "Yomi",
      "Clio."
    ],
    "note": "atua junto de Yomi e Pygmalion."
  },
  {
    "order": 116,
    "key": "aphrodite",
    "name": "Aphrodite",
    "title": "IA de Atratividade Visual e Marca",
    "function": "aumentar atratividade, desejo visual, beleza de marca e apelo estético.",
    "summary": "Aphrodite é deusa grega do amor, beleza, desejo e atração. Ela representa magnetismo visual e emocional. No OS, é boa para avaliar se uma marca ou conteúdo desperta interesse estético.",
    "comparableOptions": [
      "Oshun",
      "Benzaiten",
      "Hathor",
      "Jophiel",
      "Freyja",
      "Lakshmi",
      "Amaterasu",
      "Inari",
      "Apollo."
    ],
    "note": "usar com cuidado para não reduzir marca a sensualidade."
  },
  {
    "order": 117,
    "key": "jophiel",
    "name": "Jophiel",
    "title": "IA de Beleza e Clareza Visual",
    "function": "deixar interface, marca e conteúdo visualmente mais claros, belos e compreensíveis.",
    "summary": "Jophiel é arcanjo associado à beleza, iluminação e pensamentos elevados em tradições esotéricas. Ele representa beleza que clareia, não apenas enfeita. No OS, ajuda a tornar visual mais limpo e compreensível.",
    "comparableOptions": [
      "Benzaiten",
      "Aphrodite",
      "Oshun",
      "Apollo",
      "Ame-no-Uzume",
      "Hathor",
      "Saraswati",
      "Hestia",
      "Amaterasu."
    ],
    "note": "Jophiel é clareza estética; Benzaiten é criação artística."
  },
  {
    "order": 118,
    "key": "oshun",
    "name": "Oshun",
    "title": "IA de Magnetismo e Presença de Marca",
    "function": "melhorar carisma, conexão emocional, desejo e presença sensorial da marca.",
    "summary": "Oshun representa rios, doçura, beleza, amor, fertilidade, encanto e prosperidade. Ela é uma força de atração emocional e estética. No OS, ajuda perfis a parecerem desejáveis, agradáveis e memoráveis.",
    "comparableOptions": [
      "Aphrodite",
      "Benzaiten",
      "Hathor",
      "Freyja",
      "Lakshmi",
      "Inari",
      "Amaterasu",
      "Jophiel",
      "Kannon."
    ],
    "note": "duplicada com item 068. Pode ser um único núcleo de magnetismo."
  },
  {
    "order": 119,
    "key": "hecate",
    "name": "Hécate",
    "title": "IA de Referências Perigosas e Ambiguidades",
    "function": "analisar referências obscuras, ambíguas, arriscadas ou com duplo sentido.",
    "summary": "Hécate está ligada a encruzilhadas, limiares, noite, magia e escolhas difíceis. Ela é excelente para situações em que algo não é claramente seguro ou proibido. No OS, trabalha com Yomi, Nemesis e Themis em zonas cinzentas.",
    "comparableOptions": [
      "Yomi",
      "Janus",
      "Anúbis",
      "Themis",
      "Raziel",
      "Loki",
      "Mara",
      "Nemesis",
      "Ma’at."
    ],
    "note": "duplicada com riscos ocultos; pode ser uma só IA de ambiguidade."
  },
  {
    "order": 120,
    "key": "anubis",
    "name": "Anúbis",
    "title": "IA de Auditoria de Risco Antes de Publicar",
    "function": "pesar risco legal, reputacional, visual e de conteúdo antes de publicação sensível.",
    "summary": "Anúbis representa passagem e julgamento final. Antes de publicar, ele pode pesar se o conteúdo atravessa a fronteira com segurança. No OS, é auditoria antes do “ponto sem volta”.",
    "comparableOptions": [
      "Ma’at",
      "Themis",
      "Yomi",
      "Nemesis",
      "Yama",
      "Enma",
      "Raguel",
      "Zhong Kui",
      "Hécate."
    ],
    "note": "duplicado com item 007; melhor manter como aplicação específica de Anúbis."
  },
  {
    "order": 121,
    "key": "sarutahiko",
    "name": "Sarutahiko",
    "title": "IA de Postagem Manual Assistida",
    "function": "guiar postagem manual com checklist, passo a passo, status e orientação prática.",
    "summary": "Sarutahiko é um kami japonês associado a caminhos e orientação, conhecido por guiar a descida divina em mitos japoneses. Ele representa condução segura por uma rota. No OS, guia o usuário do rascunho até a postagem.",
    "comparableOptions": [
      "Hermes",
      "Janus",
      "Gabriel",
      "Iris",
      "Ganesha",
      "Hestia",
      "Tenjin",
      "Kairos",
      "Bishamonten."
    ],
    "note": "perfeito para Aba Postagem V1 manual assistida."
  },
  {
    "order": 122,
    "key": "hermes",
    "name": "Hermes",
    "title": "IA de Publicação e Distribuição",
    "function": "levar conteúdo publicado para canais, formatos, redes e rotas adequadas.",
    "summary": "Hermes é mensageiro e viajante entre mundos. Na publicação, ele não cria o conteúdo; ele leva a mensagem para fora. No OS, é distribuição externa após aprovação.",
    "comparableOptions": [
      "Mercúrio",
      "Iris",
      "Gabriel",
      "Sarutahiko",
      "Fūjin",
      "Eshu/Eleguá",
      "Janus",
      "Kairos",
      "Mazu."
    ],
    "note": "duplicado com item 060; pode ser o mesmo núcleo de distribuição."
  },
  {
    "order": 123,
    "key": "gabriel",
    "name": "Gabriel",
    "title": "IA de Notificações e Lembretes",
    "function": "avisar prazos, revisões, erros, aprovações, lembretes e mensagens importantes.",
    "summary": "Gabriel é mensageiro de revelações importantes. Ele não deve mandar ruído constante; deve entregar aviso que importa. No OS, cuida de comunicação interna ao usuário.",
    "comparableOptions": [
      "Hermes",
      "Iris",
      "Mercúrio",
      "Sandalphon",
      "Nabu",
      "Thoth",
      "Janus",
      "Hotei",
      "Paimon como codinome."
    ],
    "note": "duplicado com item 028; fundir."
  },
  {
    "order": 124,
    "key": "janus",
    "name": "Janus",
    "title": "IA de Mudança de Status",
    "function": "controlar rascunho, em revisão, aprovado, postado, arquivado, descartado e recuperado.",
    "summary": "Janus governa portas e transições, o que faz dele ideal para status. Cada status é uma porta atravessada dentro do fluxo. No OS, evita que conteúdo fique perdido entre etapas.",
    "comparableOptions": [
      "Sarutahiko",
      "Hermes",
      "Gabriel",
      "Hécate",
      "Ganesha",
      "Chronos",
      "Kairos",
      "Metatron",
      "Seshat."
    ],
    "note": "duplicado com item 002; manter como aplicação específica."
  },
  {
    "order": 125,
    "key": "kairos",
    "name": "Kairos",
    "title": "IA de Melhor Momento para Postar",
    "function": "sugerir janela ideal de postagem com base em público, tendência, rotina e histórico.",
    "summary": "Kairos é o momento oportuno. Para postagem, ele decide quando o conteúdo tem mais chance de encontrar a audiência no estado certo. No OS, é o oposto de postar aleatoriamente.",
    "comparableOptions": [
      "Chronos",
      "Hermes",
      "Shichifukujin",
      "Fortuna",
      "Omoikane",
      "Norns",
      "Sarutahiko",
      "Apollo",
      "Janus."
    ],
    "note": "duplicado com item 019/085; pode ser sub-IA única."
  },
  {
    "order": 126,
    "key": "chronos",
    "name": "Chronos",
    "title": "IA de Calendário Editorial",
    "function": "organizar calendário, frequência, datas, rotinas e cronograma de conteúdos.",
    "summary": "Chronos é tempo linear e contínuo. Um calendário editorial precisa de regularidade, ordem e sequência. No OS, Chronos dá estrutura temporal para criação e postagem.",
    "comparableOptions": [
      "Kairos",
      "Janus",
      "Tsukuyomi",
      "Selene",
      "Norns",
      "Moirai",
      "Thoth",
      "Seshat",
      "Sarutahiko."
    ],
    "note": "duplicado com item 018; fundir."
  },
  {
    "order": 127,
    "key": "hestia",
    "name": "Hestia",
    "title": "IA de Rotina Confortável do Usuário",
    "function": "criar rotina simples, previsível, menos cansativa e confortável para trabalho diário.",
    "summary": "Hestia é a lareira, o centro da casa, a rotina tranquila e estável. No OS, ela ajuda o usuário a manter constância sem sentir o sistema pesado demais. É útil para modo Fácil e rotina de postagem.",
    "comparableOptions": [
      "Selene",
      "Kannon",
      "Hotei",
      "Ganesha",
      "Tenjin",
      "Sarutahiko",
      "Brigid",
      "Eir",
      "Hestia."
    ],
    "note": "duplicada com item 027; pode ser aplicação operacional."
  },
  {
    "order": 128,
    "key": "ganesha",
    "name": "Ganesha",
    "title": "IA de Destravamento de Tarefas Pendentes",
    "function": "ajudar quando o usuário não conclui tarefa, trava ou abandona processo.",
    "summary": "Ganesha remove obstáculos e abençoa inícios. Em tarefas pendentes, ele ajuda a reduzir fricção e transformar uma tarefa grande em passos simples. No OS, trabalha junto com Hotei, Tenjin e Sarutahiko.",
    "comparableOptions": [
      "Hotei",
      "Tenjin",
      "Kannon",
      "Chiron",
      "Janus",
      "Sarutahiko",
      "Hestia",
      "Selene",
      "Hermes."
    ],
    "note": "duplicado com item 025; fundir."
  },
  {
    "order": 129,
    "key": "bishamonten",
    "name": "Bishamonten",
    "title": "IA de Checklist Antes da Publicação",
    "function": "revisar qualidade, risco e clareza imediatamente antes do usuário postar.",
    "summary": "Bishamonten representa defesa, disciplina e proteção guerreira. Antes de publicar, ele age como guarda que verifica se tudo está pronto. No OS, reduz erro bobo antes de algo ir ao público.",
    "comparableOptions": [
      "Athena",
      "Takemikazuchi",
      "Zhong Kui",
      "Ma’at",
      "Anúbis",
      "Themis",
      "Sarutahiko",
      "Omoikane",
      "Gabriel."
    ],
    "note": "duplicado com item 090; fundir."
  },
  {
    "order": 130,
    "key": "omoikane",
    "name": "Omoikane",
    "title": "IA de Recomendação Pós-Postagem",
    "function": "analisar o resultado após o post e sugerir próxima ação.",
    "summary": "Omoikane é inteligência deliberativa. Depois da postagem, ele olha resultado, contexto e histórico para recomendar o próximo passo. No OS, fecha o ciclo entre publicação e aprendizado.",
    "comparableOptions": [
      "Hachiman",
      "Shichifukujin",
      "Omoikane",
      "Thoth",
      "Seshat",
      "Kairos",
      "Athena",
      "Fuxi",
      "Mnemosyne."
    ],
    "note": "duplicado com item 009/080; fundir."
  },
  {
    "order": 131,
    "key": "morax",
    "name": "Morax",
    "title": "IA de Financeiro Guiado, Contratos e Valor",
    "function": "explicar lucro, ROI, comissão, custo, metas, contratos, valor e decisões financeiras para usuários iniciantes.",
    "summary": "No universo de Genshin, Morax/Zhongli é ligado a contratos, história, valor e estabilidade. Fora de Genshin, Morax também é um nome demonológico, então há risco de conflito simbólico. Para uso seguro público, pode ser melhor usar Kubera, Caishen ou Mercúrio Financeiro; para codinome interno, Morax é forte por contratos.",
    "comparableOptions": [
      "Kubera",
      "Caishen",
      "Plutus",
      "Lakshmi",
      "Daikokuten",
      "Gaia",
      "Hermes",
      "Themis",
      "Ma’at."
    ],
    "note": "como você já usa Morax, ele pode ficar como codinome interno financeiro guiado."
  },
  {
    "order": 132,
    "key": "buda",
    "name": "BUDA",
    "title": "IA de Crescimento sem Venda Direta",
    "function": "perfis focados em notoriedade, autoridade, retenção, engajamento e público sem venda imediata.",
    "summary": "Buda representa iluminação, caminho, consciência e evolução interna. Usar “Buda” exige respeito, porque é figura religiosa viva para muitas pessoas. No OS, a ideia combina com crescimento paciente, presença e construção de autoridade, mas pode ser melhor usar Kannon, Saraswati ou Amaterasu como nome comercial.",
    "comparableOptions": [
      "Kannon",
      "Amaterasu",
      "Saraswati",
      "Apollo",
      "Hotei",
      "Mazu",
      "Lakshmi",
      "Athena",
      "Fuxi."
    ],
    "note": "manter BUDA internamente se você gosta, mas avaliar nome público depois."
  },
  {
    "order": 133,
    "key": "yomi_copyright",
    "name": "Yomi-Copyright",
    "title": "Sub-IA de Personagem Protegido",
    "function": "avaliar uso de personagem famoso, fanart, avatar inspirado e adaptação segura.",
    "summary": "Esta é uma especialização de Yomi. A fronteira do Yomi representa o limite entre inspiração segura e risco de violação. Aqui a IA não deve bloquear automaticamente; deve orientar: usar como referência, transformar em personagem original, cosplay, paródia segura ou identidade adaptada.",
    "comparableOptions": [
      "Themis",
      "Hécate",
      "Anúbis",
      "Tsukuyomi-no-Mikoto",
      "Pygmalion",
      "Seshat",
      "Nemesis",
      "Ma’at",
      "Janus."
    ],
    "note": "essencial para perfis com estética anime/personagens."
  },
  {
    "order": 134,
    "key": "tsukuyomi_visual_ledger",
    "name": "Tsukuyomi-Visual Ledger",
    "title": "Sub-IA de Histórico de Uso Visual",
    "function": "manter histórico de imagens, personagens, perfis, contextos, riscos e decisões de uso.",
    "summary": "Tsukuyomi-no-Mikoto como registro lunar dá a ideia de arquivo silencioso, observação fria e controle de identidade. Esta sub-IA mantém memória visual do que cada perfil usa. Ela ajuda a manter coerência sem travar criatividade.",
    "comparableOptions": [
      "Seshat",
      "Metatron",
      "Clio",
      "Mnemosyne",
      "Thoth",
      "Wenchang",
      "Yomi",
      "Anúbis",
      "Raziel."
    ],
    "note": "funciona junto com Biblioteca e Yomi."
  },
  {
    "order": 135,
    "key": "daedalus_image",
    "name": "Daedalus-Image",
    "title": "Sub-IA de Prompt Técnico para Imagem",
    "function": "criar prompts técnicos de imagem, composição, iluminação, estilo, proporção e qualidade.",
    "summary": "Daedalus como inventor e engenheiro se especializa aqui em construção visual. Ele transforma estética em instrução controlável. Essa sub-IA evita que Amaterasu ou Benzaiten virem técnicas demais.",
    "comparableOptions": [
      "Ptah",
      "Khnum",
      "Pygmalion",
      "Vishvakarma",
      "Hefesto",
      "Apollo",
      "Benzaiten",
      "Seshat",
      "Imhotep."
    ],
    "note": "separar imagem, vídeo e áudio reduz gargalo de Daedalus."
  },
  {
    "order": 136,
    "key": "daedalus_video",
    "name": "Daedalus-Video",
    "title": "Sub-IA de Prompt Técnico para Vídeo",
    "function": "criar prompts de movimento, câmera, duração, cortes, ritmo, transições e animação.",
    "summary": "Daedalus-Video pega a engenharia criativa e aplica ao tempo e movimento. Vídeo exige lógica diferente de imagem, porque envolve ritmo, ação e continuidade. Esta sub-IA impede prompts confusos para ferramentas de vídeo.",
    "comparableOptions": [
      "Orpheus",
      "Chronos",
      "Kairos",
      "Apollo",
      "Ame-no-Uzume",
      "Hermes",
      "Svarog",
      "Vishvakarma",
      "Ptah."
    ],
    "note": "importante para CapCut, IA de vídeo e animações."
  },
  {
    "order": 137,
    "key": "daedalus_audio",
    "name": "Daedalus-Audio",
    "title": "Sub-IA Técnica de Áudio",
    "function": "criar instruções técnicas de áudio, mix, efeitos, ASMR, trilha e ritmo sonoro.",
    "summary": "Esta sub-IA usa a engenharia de Daedalus para áudio, enquanto Orpheus cuida de emoção/narração e Benzaiten de musicalidade. Ela transforma intenção sonora em parâmetros técnicos. Evita sobrecarregar Hotei/Pet.",
    "comparableOptions": [
      "Orpheus",
      "Benzaiten",
      "Pan",
      "Apollo",
      "Saraswati",
      "Sandalphon",
      "Bragi",
      "Hotei",
      "Svarog."
    ],
    "note": "áudio técnico deve ficar separado de assistência humana."
  },
  {
    "order": 138,
    "key": "amaterasu_ideias",
    "name": "Amaterasu-Ideias",
    "title": "Sub-IA de Ideação de Conteúdo",
    "function": "gerar ideias de posts, séries, vídeos curtos, formatos e variações.",
    "summary": "Amaterasu representa luz e visibilidade. Esta sub-IA cuida especificamente da centelha inicial: trazer ideias para fora da escuridão. Ela trabalha antes de roteiro, estética e técnico.",
    "comparableOptions": [
      "Brigid",
      "Apollo",
      "Saraswati",
      "Ame-no-Uzume",
      "Benzaiten",
      "Hathor",
      "Morpheus",
      "Taliesin",
      "Calliope."
    ],
    "note": "boa para gerar volume sem confundir com execução."
  },
  {
    "order": 139,
    "key": "amaterasu_roteiro_curto",
    "name": "Amaterasu-Roteiro Curto",
    "title": "Sub-IA de Shorts/Reels/TikTok",
    "function": "criar roteiros curtos com hook, retenção, cortes e frase de impacto.",
    "summary": "A luz de Amaterasu vira aqui atenção imediata. Roteiro curto precisa capturar rápido, manter ritmo e entregar impacto. Esta sub-IA trabalha com Kairos, Hermes e Omoikane.",
    "comparableOptions": [
      "Bragi",
      "Ame-no-Uzume",
      "Inari",
      "Hermes",
      "Orpheus",
      "Apollo",
      "Hachiman",
      "Shichifukujin",
      "Benzaiten."
    ],
    "note": "essencial para conteúdo viral."
  },
  {
    "order": 140,
    "key": "amaterasu_roteiro_longo",
    "name": "Amaterasu-Roteiro Longo",
    "title": "Sub-IA de Narrativas Longas",
    "function": "criar roteiros longos, vídeos explicativos, séries e narrativas profundas.",
    "summary": "Aqui Amaterasu ilumina uma jornada inteira, não só um hook. Narrativas longas precisam estrutura, ritmo, retenção e conclusão. Calliope, Taliesin e Clio são opções ainda mais específicas.",
    "comparableOptions": [
      "Calliope",
      "Taliesin",
      "Orpheus",
      "Clio",
      "Thoth",
      "Saraswati",
      "Athena",
      "Mimir",
      "Apollo."
    ],
    "note": "pode usar Calliope como nome se quiser máxima fidelidade."
  },
  {
    "order": 141,
    "key": "inari_hook",
    "name": "Inari-Hook",
    "title": "Sub-IA de Ganchos e Primeira Frase",
    "function": "criar primeiras frases, títulos, aberturas, headlines e ganchos de atenção.",
    "summary": "Inari traz prosperidade e astúcia comercial. Como sub-IA de hook, usa a raposa simbólica para encontrar a abertura mais atraente. Deve ser persuasiva sem manipular de forma nociva.",
    "comparableOptions": [
      "Hermes",
      "Bragi",
      "Ogma",
      "Oshun",
      "Aphrodite",
      "Paimon como codinome",
      "Sitri",
      "Apollo",
      "Ame-no-Uzume."
    ],
    "note": "trabalhar junto com Nemesis para evitar clickbait tóxico."
  },
  {
    "order": 142,
    "key": "inari_cta",
    "name": "Inari-CTA",
    "title": "Sub-IA de Chamada para Ação",
    "function": "criar chamadas para comentar, clicar, salvar, comprar, seguir ou compartilhar.",
    "summary": "Inari-CTA transforma atenção em ação. A simbologia de comércio e prosperidade ajuda a manter foco em resultado. A IA deve adaptar CTAs ao nível do usuário e ao objetivo do perfil.",
    "comparableOptions": [
      "Hermes",
      "Mercúrio",
      "Ebisu",
      "Oshun",
      "Lakshmi",
      "Caishen",
      "Bragi",
      "Gabriel",
      "Janus."
    ],
    "note": "CTAs devem ser claros e não forçados."
  },
  {
    "order": 143,
    "key": "gaia_afiliados",
    "name": "Gaia-Afiliados",
    "title": "Sub-IA de Afiliados",
    "function": "escolher produtos, comissão, link, promessa, criativo e análise de conversão para afiliados.",
    "summary": "Gaia como sustentação econômica se especializa em um modelo de renda. Afiliado exige equilíbrio entre produto, público e confiança. Esta sub-IA trabalha com Ebisu, Inari, Hermes e Morax.",
    "comparableOptions": [
      "Ebisu",
      "Caishen",
      "Hermes",
      "Inari",
      "Daikokuten",
      "Lakshmi",
      "Morax",
      "Kubera",
      "Mercúrio."
    ],
    "note": "boa para seus perfis de venda/afiliados."
  },
  {
    "order": 144,
    "key": "gaia_produto_proprio",
    "name": "Gaia-Produto Próprio",
    "title": "Sub-IA de Produtos Próprios",
    "function": "estruturar produto, promessa, preço, entrega, diferenciação e funil.",
    "summary": "Gaia sustenta, mas produto próprio precisa raiz mais profunda que afiliado. Esta sub-IA cuida de oferta construída internamente. Trabalha bem com Fuxi, Athena, Inari, Caishen e Morax.",
    "comparableOptions": [
      "Fuxi",
      "Athena",
      "Caishen",
      "Kubera",
      "Plutus",
      "Lakshmi",
      "Ptah",
      "Vishvakarma",
      "Daikokuten."
    ],
    "note": "usar quando o OS crescer além de afiliados."
  },
  {
    "order": 145,
    "key": "morax_roi",
    "name": "Morax-ROI",
    "title": "Sub-IA de ROI, Comissão e Custo",
    "function": "explicar retorno sobre investimento, comissão, margem, custo por conteúdo e lucro líquido.",
    "summary": "Morax como contrato/valor é útil internamente para cálculos financeiros explicados. A IA deve traduzir números para linguagem simples. É parte de financeiro guiado para usuários iniciantes.",
    "comparableOptions": [
      "Plutus",
      "Caishen",
      "Kubera",
      "Thoth",
      "Seshat",
      "Ma’at",
      "Themis",
      "Gaia",
      "Athena."
    ],
    "note": "pode ser renomeada para Plutus-ROI se quiser nome mitológico mais público."
  },
  {
    "order": 146,
    "key": "hermes_trends",
    "name": "Hermes-Trends",
    "title": "Sub-IA de Tendências e Formatos em Alta",
    "function": "mapear tendências, sons, formatos, hashtags, estilos e oportunidades atuais.",
    "summary": "Hermes circula entre mundos e carrega mensagens rapidamente. Para trends, ele representa velocidade de circulação cultural. Esta sub-IA observa o que está se movendo agora.",
    "comparableOptions": [
      "Kairos",
      "Fortuna",
      "Ame-no-Uzume",
      "Apollo",
      "Oshun",
      "Argus",
      "Shichifukujin",
      "Bragi",
      "Pan."
    ],
    "note": "por depender de dados atuais, no produto real precisa conexão externa."
  },
  {
    "order": 147,
    "key": "argus_concorrentes",
    "name": "Argus-Concorrentes",
    "title": "Sub-IA de Concorrentes Diretos",
    "function": "observar perfis concorrentes, comparar posts, frequência, linguagem, estética e ofertas.",
    "summary": "Argus tem muitos olhos, símbolo perfeito de observação ampla. Na versão concorrentes, ele não copia; ele detecta padrões externos. Ajuda o perfil a aprender sem perder identidade.",
    "comparableOptions": [
      "Heimdall",
      "Odin",
      "Omoikane",
      "Seshat",
      "Athena",
      "Fuxi",
      "Hermes",
      "Hachiman",
      "Clio."
    ],
    "note": "deve trabalhar com Yomi para evitar cópia indevida."
  },
  {
    "order": 148,
    "key": "nemesis_crise",
    "name": "Nemesis-Crise",
    "title": "Sub-IA de Crise de Marca",
    "function": "orientar resposta a críticas, comentários negativos, polêmica e risco reputacional ativo.",
    "summary": "Nemesis lida com consequência. Em crise, ela ajuda a reconhecer excesso, dano e reparação necessária. Trabalha com Ma’at, Kannon, Themis e Anúbis.",
    "comparableOptions": [
      "Ma’at",
      "Kannon",
      "Themis",
      "Anúbis",
      "Raguel",
      "Zhong Kui",
      "Yama",
      "Athena",
      "Gabriel."
    ],
    "note": "crise precisa de tom humano, não só defesa."
  },
  {
    "order": 149,
    "key": "kannon_atendimento",
    "name": "Kannon-Atendimento",
    "title": "Sub-IA de Atendimento ao Público",
    "function": "responder dúvidas, comentários, reclamações e mensagens de seguidores com empatia.",
    "summary": "Kannon escuta sofrimento e responde com compaixão. No atendimento, isso significa responder sem arrogância, com clareza e respeito. A IA deve adaptar tom ao perfil.",
    "comparableOptions": [
      "Guan Yin",
      "Chamuel",
      "Hestia",
      "Gabriel",
      "Hotei",
      "Mazu",
      "Brigid",
      "Eir",
      "Ma’at."
    ],
    "note": "trabalha com Nemesis em crise."
  },
  {
    "order": 150,
    "key": "kannon_comunidade",
    "name": "Kannon-Comunidade",
    "title": "Sub-IA de Engajamento Comunitário",
    "function": "criar enquetes, perguntas, respostas, quadros, rituais de comunidade e vínculo com seguidores.",
    "summary": "Kannon representa compaixão ativa e escuta. Em comunidade, a IA ajuda a criar pertencimento. Ela foca retenção e relacionamento, não venda direta.",
    "comparableOptions": [
      "Hestia",
      "Hotei",
      "Hathor",
      "Ame-no-Uzume",
      "Kannon",
      "Mazu",
      "Saraswati",
      "Oshun",
      "Brigid."
    ],
    "note": "excelente para BUDA/perfis sem venda direta."
  },
  {
    "order": 151,
    "key": "tenjin_onboarding_didatico",
    "name": "Tenjin-Onboarding Didático",
    "title": "Sub-IA de Primeira Semana",
    "function": "conduzir o usuário nos primeiros dias com explicações simples, exemplos e tarefas pequenas.",
    "summary": "Tenjin como kami dos estudos encaixa no começo educativo. Esta sub-IA evita despejar tudo de uma vez no usuário. Ela guia por etapas.",
    "comparableOptions": [
      "Ganesha",
      "Nüwa",
      "Hotei",
      "Chiron",
      "Saraswati",
      "Wenchang",
      "Kannon",
      "Hestia",
      "Gabriel."
    ],
    "note": "essencial para reduzir abandono."
  },
  {
    "order": 152,
    "key": "selene_simplificar",
    "name": "Selene-Simplificar",
    "title": "Sub-IA de Modo Simples",
    "function": "reduzir interface, texto, opções e complexidade quando o usuário estiver confuso.",
    "summary": "Selene traz calma, noite e ritmo. O Modo Simples é uma forma de diminuir luz forte e excesso de estímulo. Ajuda usuários iniciantes ou cansados.",
    "comparableOptions": [
      "Hestia",
      "Kannon",
      "Hotei",
      "Ganesha",
      "Tenjin",
      "Hypnos",
      "Eir",
      "Saraswati",
      "Nüwa."
    ],
    "note": "combina com modos Fácil/Normal/Difícil."
  },
  {
    "order": 153,
    "key": "astraea",
    "name": "Astraea",
    "title": "IA de XP, Ordens e Rank de Nazarick",
    "function": "controlar XP, níveis, Ordens, Rank de Nazarick, evolução e progresso justo.",
    "summary": "Astraea é deusa grega da justiça pura e inocente. Ela representa mérito sem corrupção e equilíbrio sem vaidade. No OS, ajuda o Sistema de Evolução a ser justo e não parecer só competição.",
    "comparableOptions": [
      "Ma’at",
      "Athena",
      "Nike",
      "Hermes",
      "Ganesha",
      "Saraswati",
      "Yama",
      "Dike",
      "Fortuna."
    ],
    "note": "Astraea mede evolução; Yama mede Karma."
  },
  {
    "order": 154,
    "key": "astraea_ordens",
    "name": "Astraea-Ordens",
    "title": "Sub-IA de Ordens e Desafios Opcionais",
    "function": "criar Ordens opcionais adaptadas ao nível do usuário, com aprendizado e recompensa.",
    "summary": "Astraea como justiça pura garante que Ordens sejam possíveis, justas e úteis. A sub-IA evita desafios humilhantes ou impossíveis. Trabalha com Chiron, Tenjin, Hachiman e Caishen.",
    "comparableOptions": [
      "Chiron",
      "Tenjin",
      "Athena",
      "Nike",
      "Ganesha",
      "Saraswati",
      "Hachiman",
      "Ma’at",
      "Yama."
    ],
    "note": "Ordens não são obrigatórias; são treinamento/incentivo."
  },
  {
    "order": 155,
    "key": "caishen_tesouro",
    "name": "Caishen-Tesouro",
    "title": "Sub-IA do Tesouro de Nazarick",
    "function": "calcular recompensas acumuladas, tesouro, bônus futuros e liberação de benefícios.",
    "summary": "Caishen representa riqueza chegando; no Tesouro, ele organiza distribuição material de forma clara. Trabalha com Ma’at para justiça e Morax/Kubera para viabilidade financeira. Ajuda a não desperdiçar trabalho quando ainda não há fundo suficiente.",
    "comparableOptions": [
      "Kubera",
      "Daikokuten",
      "Lakshmi",
      "Plutus",
      "Fortuna",
      "Hotei",
      "Abundantia",
      "Ma’at",
      "Morax."
    ],
    "note": "recompensas dependem de lucro líquido e aprovação adequada."
  },
  {
    "order": 156,
    "key": "yama_karma",
    "name": "Yama-Karma",
    "title": "Sub-IA de Karma Operacional",
    "function": "acompanhar conduta, confiança, tentativas de burlar permissões e responsabilidade operacional.",
    "summary": "Yama julga consequência moral. Como Karma operacional, ele registra postura ao longo do tempo, sem confundir erro iniciante com má-fé. Trabalha com Ma’at para evitar injustiça.",
    "comparableOptions": [
      "Enma",
      "Anúbis",
      "Ma’at",
      "Themis",
      "Dike",
      "Raguel",
      "Rhadamanthys",
      "Minos",
      "Shamash."
    ],
    "note": "Karma deve ser invisível ou explicado com muito cuidado."
  },
  {
    "order": 157,
    "key": "nuwa_onboarding",
    "name": "Nüwa-Onboarding",
    "title": "Sub-IA de Diagnóstico Inicial",
    "function": "analisar usuário no início e sugerir modo Fácil/Normal/Difícil, permissões e caminho inicial.",
    "summary": "Nüwa cria e repara; no onboarding ela molda o início do usuário. Seu papel é formar uma primeira estrutura segura ao redor dele. Trabalha com Tenjin, Hotei, Selene e Ganesha.",
    "comparableOptions": [
      "Ganesha",
      "Kannon",
      "Saraswati",
      "Fuxi",
      "Prometeu",
      "Chiron",
      "Tenjin",
      "Hestia",
      "Ptah."
    ],
    "note": "Nüwa também pode reparar estrutura, mas aqui é onboarding."
  },
  {
    "order": 158,
    "key": "ame_no_uzume_ux",
    "name": "Ame-no-Uzume-UX",
    "title": "Sub-IA de Interface e Clareza Visual",
    "function": "adaptar aparência, reduzir poluição visual, melhorar explicações e tornar telas mais humanas.",
    "summary": "Ame-no-Uzume usa dança, humor e expressão para trazer Amaterasu de volta à luz. Em UX, isso significa transformar interface travada em algo vivo e claro. Ela melhora entendimento sem mudar autoridade crítica.",
    "comparableOptions": [
      "Benzaiten",
      "Aphrodite",
      "Jophiel",
      "Hathor",
      "Oshun",
      "Hestia",
      "Apollo",
      "Saraswati",
      "Brigid."
    ],
    "note": "mudanças relevantes devem ir para Teste dos Seres Supremos."
  },
  {
    "order": 159,
    "key": "pandora_sandbox",
    "name": "Pandora-Sandbox",
    "title": "Sub-IA de Simulação Isolada",
    "function": "garantir que simulações não alterem dados, modos reais, permissões reais ou interface real.",
    "summary": "Pandora abre riscos escondidos, mas aqui dentro de uma caixa segura. A sub-IA Sandbox garante que o caos fique contido no ambiente simulado. É essencial para o Simulador dos Seres Supremos.",
    "comparableOptions": [
      "Loki",
      "Hécate",
      "Janus",
      "Metatron",
      "Anúbis",
      "Daedalus",
      "Mara",
      "Themis",
      "Heimdall."
    ],
    "note": "prioridade máxima quando modo simulação estiver ativo."
  },
  {
    "order": 160,
    "key": "metatron_audit_trail",
    "name": "Metatron-Audit Trail",
    "title": "Sub-IA de Trilha de Auditoria",
    "function": "registrar exatamente quem fez o quê, quando, por quê, com qual permissão e qual IA participou.",
    "summary": "Metatron como escriba celestial é perfeito para trilha de auditoria. Ele transforma ações invisíveis em registro confiável. No OS, protege governança e permite revisar decisões.",
    "comparableOptions": [
      "Seshat",
      "Thoth",
      "Nabu",
      "Anúbis",
      "Ma’at",
      "Janus",
      "Argus",
      "Wenchang",
      "Themis."
    ],
    "note": "indispensável para Admin/Momonga e Tumba de Nazarick."
  },
  {
    "order": 161,
    "key": "themis_lgpd",
    "name": "Themis-LGPD",
    "title": "Sub-IA de Privacidade e Dados Pessoais",
    "function": "avaliar coleta, uso, armazenamento, exclusão e exposição de dados pessoais.",
    "summary": "Themis representa lei e ordem superior. Em privacidade, ela cria limites claros para proteger usuários e sistema. Trabalha com Metatron, Seshat, Yomi e Anúbis.",
    "comparableOptions": [
      "Ma’at",
      "Dike",
      "Varuna",
      "Shamash",
      "Raguel",
      "Anúbis",
      "Yama",
      "Tyr",
      "Metatron."
    ],
    "note": "importante desde a V1 se houver cadastro real de usuários."
  },
  {
    "order": 162,
    "key": "seshat_tags",
    "name": "Seshat-Tags",
    "title": "Sub-IA de Tags Automáticas",
    "function": "gerar tags, categorias, metadados, rótulos e relações entre arquivos e ideias.",
    "summary": "Seshat registra, mede e organiza. Em tags, ela transforma conteúdo solto em biblioteca pesquisável. Trabalha com Mnemosyne, Wenchang e Hypnos.",
    "comparableOptions": [
      "Thoth",
      "Nabu",
      "Metatron",
      "Wenchang",
      "Fuxi",
      "Clio",
      "Omoikane",
      "Imhotep",
      "Raziel."
    ],
    "note": "essencial para Lixeira Inteligente e Biblioteca."
  },
  {
    "order": 163,
    "key": "hypnos",
    "name": "Hypnos",
    "title": "IA de Lixeira Inteligente e Recuperação Criativa",
    "function": "guardar ideias descartadas, recuperar conceitos esquecidos e sugerir reutilização segura.",
    "summary": "Hypnos é deus grego do sono. Ideias descartadas no OS não estão mortas; estão adormecidas. Isso faz de Hypnos um nome perfeito para Lixeira Inteligente, onde algo pode voltar quando o contexto muda.",
    "comparableOptions": [
      "Morpheus",
      "Osíris",
      "Persephone",
      "Ereshkigal",
      "Hades",
      "Tsukuyomi",
      "Mnemosyne",
      "Lethe",
      "Anúbis."
    ],
    "note": "Hypnos recupera ideias; Mnemosyne guarda histórico ativo."
  },
  {
    "order": 164,
    "key": "hypnos_reuso",
    "name": "Hypnos-Reuso",
    "title": "Sub-IA de Reaproveitamento Criativo",
    "function": "pegar ideias descartadas e transformar em novos posts, variações, campanhas ou referências.",
    "summary": "Hypnos guarda o que dorme; esta sub-IA desperta o que ainda tem valor. Ela compara contexto antigo com oportunidade nova. Trabalha com Kairos, Amaterasu, Seshat e Mnemosyne.",
    "comparableOptions": [
      "Morpheus",
      "Osíris",
      "Persephone",
      "Mnemosyne",
      "Clio",
      "Kairos",
      "Amaterasu",
      "Brigid",
      "Daedalus."
    ],
    "note": "muito útil para aproveitar ideias que antes não serviam."
  },
  {
    "order": 165,
    "key": "thoth_localizacao",
    "name": "Thoth-Localização",
    "title": "Sub-IA de Tradução e Adaptação Cultural",
    "function": "adaptar textos entre idiomas, regiões, tons e públicos sem perder sentido.",
    "summary": "Thoth domina escrita, linguagem, cálculo e conhecimento. Na localização, ele não traduz palavra por palavra; adapta intenção, cultura e clareza. Trabalha com Saraswati, Ogma e Kannon.",
    "comparableOptions": [
      "Saraswati",
      "Nabu",
      "Wenchang",
      "Gabriel",
      "Ogma",
      "Hermes",
      "Bragi",
      "Ma’at",
      "Athena."
    ],
    "note": "importante para perfis multilíngues."
  },
  {
    "order": 166,
    "key": "ogma_naming",
    "name": "Ogma-Naming",
    "title": "Sub-IA de Nomes, Marcas e Termos",
    "function": "criar nomes de perfis, produtos, módulos, quadros, séries e categorias.",
    "summary": "Ogma é ligado à eloquência e escrita simbólica. Nomear é dar forma e identidade a algo. No OS, esta sub-IA evita nomes genéricos ou forçados.",
    "comparableOptions": [
      "Bragi",
      "Thoth",
      "Saraswati",
      "Nabu",
      "Wenchang",
      "Hermes",
      "Apollo",
      "Taliesin",
      "Benzaiten."
    ],
    "note": "perfeita para continuar nomeando módulos do YGGNAROK / YGN."
  },
  {
    "order": 167,
    "key": "hecate_grey_zone",
    "name": "Hécate-Grey Zone",
    "title": "Sub-IA de Zona Cinzenta",
    "function": "analisar casos onde não está claro se algo é permitido, seguro, ofensivo ou problemático.",
    "summary": "Hécate governa limiares e encruzilhadas. A zona cinzenta é exatamente uma encruzilhada moral, legal ou criativa. Trabalha com Yomi, Themis, Ma’at e Nemesis.",
    "comparableOptions": [
      "Janus",
      "Yomi",
      "Themis",
      "Anúbis",
      "Raziel",
      "Ma’at",
      "Loki",
      "Mara",
      "Nemesis."
    ],
    "note": "reduz bloqueios injustos e liberações perigosas."
  },
  {
    "order": 168,
    "key": "argus_quality_watch",
    "name": "Argus-Quality Watch",
    "title": "Sub-IA de Monitoramento de Qualidade",
    "function": "observar queda de qualidade, padrões repetitivos, erros recorrentes e baixa evolução.",
    "summary": "Argus com muitos olhos observa continuamente. Aqui ele não compara concorrentes; observa o próprio sistema. Trabalha com Bishamonten, Omoikane e Hachiman.",
    "comparableOptions": [
      "Heimdall",
      "Bishamonten",
      "Omoikane",
      "Hachiman",
      "Seshat",
      "Athena",
      "Metatron",
      "Clio",
      "Ma’at."
    ],
    "note": "útil para detectar conteúdo ficando genérico."
  },
  {
    "order": 169,
    "key": "hachiman_battle_memory",
    "name": "Hachiman-Battle Memory",
    "title": "Sub-IA de Aprendizado por Campanha",
    "function": "aprender especificamente com campanhas, lançamentos e ações comerciais.",
    "summary": "Hachiman como deus guerreiro aprende com batalhas. Campanhas são batalhas comerciais com estratégia, timing e resultado. Esta sub-IA alimenta Daikokuten, Gaia e Athena.",
    "comparableOptions": [
      "Athena",
      "Guan Yu",
      "Nike",
      "Daikokuten",
      "Omoikane",
      "Shichifukujin",
      "Hermes",
      "Caishen",
      "Fuxi."
    ],
    "note": "separa aprendizado comercial do aprendizado criativo geral."
  },
  {
    "order": 170,
    "key": "hachiman_creator_memory",
    "name": "Hachiman-Creator Memory",
    "title": "Sub-IA de Aprendizado por Criador",
    "function": "aprender estilo, evolução, dificuldade, pontos fortes e limitações de cada criador.",
    "summary": "Hachiman protege e aprende com o campo. Nesta sub-IA, cada criador vira um histórico de batalhas, evolução e treinamento. Trabalha com Chiron, Tenjin, Ma’at e Astraea.",
    "comparableOptions": [
      "Chiron",
      "Tenjin",
      "Mnemosyne",
      "Omoikane",
      "Ma’at",
      "Astraea",
      "Kannon",
      "Hotei",
      "Selene."
    ],
    "note": "essencial para personalização humana justa."
  },
  {
    "order": 171,
    "key": "bishamonten_preflight",
    "name": "Bishamonten-Preflight",
    "title": "Sub-IA de Revisão Final de Conteúdo",
    "function": "fazer a checagem final antes de o conteúdo sair do sistema.",
    "summary": "Bishamonten protege como guerreiro guardião. Preflight é a inspeção antes do voo, antes do post ir ao público. Essa sub-IA evita erro básico, falta de CTA, áudio ruim ou capa fraca.",
    "comparableOptions": [
      "Anúbis",
      "Ma’at",
      "Zhong Kui",
      "Themis",
      "Sarutahiko",
      "Omoikane",
      "Athena",
      "Takemikazuchi",
      "Gabriel."
    ],
    "note": "pode ser checklist obrigatório em modo Normal/Difícil."
  },
  {
    "order": 172,
    "key": "sarutahiko_step_guide",
    "name": "Sarutahiko-Step Guide",
    "title": "Sub-IA de Guia Passo a Passo",
    "function": "guiar o usuário por ações manuais com instruções pequenas e sequenciais.",
    "summary": "Sarutahiko guia caminhos. Como sub-IA, ele transforma tarefas grandes em passos curtos. É perfeito para postagem manual, integração inicial e tarefas de configuração.",
    "comparableOptions": [
      "Tenjin",
      "Ganesha",
      "Janus",
      "Hermes",
      "Gabriel",
      "Hestia",
      "Kannon",
      "Chiron",
      "Chronos."
    ],
    "note": "deve ser usado em modo Fácil."
  },
  {
    "order": 173,
    "key": "janus_state_manager",
    "name": "Janus-State Manager",
    "title": "Sub-IA de Estado do Sistema",
    "function": "controlar se o sistema está em modo real, simulação, teste, rascunho, aprovação ou aplicação.",
    "summary": "Janus governa portas e passagens. Gerenciar estado é controlar qual porta está aberta e qual está fechada. Esta sub-IA é crítica para evitar bug entre Modo Simulação e Modos Eus reais.",
    "comparableOptions": [
      "Metatron",
      "Heimdall",
      "Pandora",
      "Hécate",
      "Chronos",
      "Themis",
      "Anúbis",
      "Sarutahiko",
      "Seshat."
    ],
    "note": "prioridade alta no Simulador dos Seres Supremos."
  },
  {
    "order": 174,
    "key": "heimdall_cost_router",
    "name": "Heimdall-Cost Router",
    "title": "Sub-IA de Controle de Custo de IAs",
    "function": "decidir quando usar IA leve, média ou pesada para evitar gasto desnecessário.",
    "summary": "Heimdall observa de longe e escolhe rota. Como controle de custo, ele evita chamar uma entidade poderosa para tarefa simples. Trabalha com Athena, Omoikane e Janus.",
    "comparableOptions": [
      "Omoikane",
      "Athena",
      "Hermes",
      "Janus",
      "Metatron",
      "Fuxi",
      "Seshat",
      "Ganesha",
      "Thoth."
    ],
    "note": "essencial para produto real com múltiplos usuários."
  },
  {
    "order": 175,
    "key": "maat_fairness_engine",
    "name": "Ma’at-Fairness Engine",
    "title": "Sub-IA de Justiça de XP e Penalidades",
    "function": "validar se XP, Karma, penalidades, bônus e avaliações foram justas.",
    "summary": "Ma’at pesa equilíbrio e verdade. Esta sub-IA evita que o sistema puna sorte ruim, dificuldade de escrita ou falta de experiência. Trabalha com Shichifukujin, Astraea, Yama e Chiron.",
    "comparableOptions": [
      "Astraea",
      "Yama",
      "Anúbis",
      "Themis",
      "Dike",
      "Raguel",
      "Shichifukujin",
      "Chiron",
      "Kannon."
    ],
    "note": "muito importante para manter confiança dos usuários."
  },
  {
    "order": 176,
    "key": "shichifukujin_luck_factor",
    "name": "Shichifukujin-Luck Factor",
    "title": "Sub-IA de Fator Sorte",
    "function": "estimar quanto do resultado veio de sorte, timing, algoritmo ou contexto externo.",
    "summary": "Shichifukujin como conjunto de deuses da sorte permite analisar múltiplas formas de acaso. Esta sub-IA evita confundir sorte com competência absoluta. Trabalha com Fortuna, Kairos e Omoikane.",
    "comparableOptions": [
      "Fortuna",
      "Tyche",
      "Kairos",
      "Norns",
      "Moirai",
      "Daikokuten",
      "Ebisu",
      "Caishen",
      "Lakshmi."
    ],
    "note": "impede bonificação injusta por viral isolado."
  },
  {
    "order": 177,
    "key": "athena_roadmap",
    "name": "Athena-Roadmap",
    "title": "Sub-IA de Roadmap do OS",
    "function": "priorizar próximas telas, módulos, integrações e melhorias do produto.",
    "summary": "Athena planeja com inteligência. Como Roadmap, ela decide o que construir primeiro considerando impacto, custo e risco. Trabalha com Momonga/Admin no Comando Supremo.",
    "comparableOptions": [
      "Fuxi",
      "Vishvakarma",
      "Omoikane",
      "Heimdall",
      "Janus",
      "Themis",
      "Metatron",
      "Hachiman",
      "Ma’at."
    ],
    "note": "útil para Google AI Studio e evolução do app real."
  },
  {
    "order": 178,
    "key": "vishvakarma_api",
    "name": "Vishvakarma-API",
    "title": "Sub-IA de APIs e Conectores",
    "function": "planejar conexões com redes sociais, banco de dados, automações, armazenamento e ferramentas externas.",
    "summary": "Vishvakarma constrói estruturas divinas. APIs são pontes estruturais entre sistemas. Esta sub-IA garante que integração não vire gambiarra.",
    "comparableOptions": [
      "Daedalus",
      "Hermes",
      "Janus",
      "Metatron",
      "Seshat",
      "Imhotep",
      "Ptah",
      "Ogun",
      "Fuxi."
    ],
    "note": "importante para sair do protótipo e virar sistema real."
  },
  {
    "order": 179,
    "key": "asclepio_cost_health",
    "name": "Asclépio-Cost Health",
    "title": "Sub-IA de Saúde de Custo e Performance",
    "function": "monitorar custo de tokens, chamadas de IA, tempo de resposta, erros e lentidão.",
    "summary": "Asclépio diagnostica saúde. Em sistemas com IA, custo e latência também são sintomas. Esta sub-IA avisa quando uma arquitetura está ficando cara ou lenta demais.",
    "comparableOptions": [
      "Heimdall-Cost Router",
      "Omoikane",
      "Seshat",
      "Metatron",
      "Raphael",
      "Imhotep",
      "Vishvakarma",
      "Thoth",
      "Ma’at."
    ],
    "note": "evita que o OS fique inviável financeiramente."
  },
  {
    "order": 180,
    "key": "raphael_rollback",
    "name": "Raphael-Rollback",
    "title": "Sub-IA de Reversão Segura",
    "function": "desfazer mudanças, restaurar versão anterior e recuperar estado estável.",
    "summary": "Raphael cura e restaura. Rollback é cura técnica depois de mudança ruim. Trabalha com Metatron-Audit Trail, Janus-State Manager e Pandora-Sandbox.",
    "comparableOptions": [
      "Nüwa",
      "Osíris",
      "Ísis",
      "Asclépio",
      "Eir",
      "Sukunabikona",
      "Anúbis",
      "Metatron",
      "Janus."
    ],
    "note": "essencial para testes no Comando Supremo."
  }
] as const satisfies readonly YggnarokAiEntity[];

export const yggnarokCanonicalAiAgents = [
  {
    "key": "heimdall",
    "name": "Heimdall",
    "area": "roteamento geral"
  },
  {
    "key": "janus",
    "name": "Janus",
    "area": "fluxos e estados"
  },
  {
    "key": "isis",
    "name": "Ísis",
    "area": "triagem e curadoria, caso você queira manter o nome já usado"
  },
  {
    "key": "maat",
    "name": "Ma’at",
    "area": "justiça e conciliação"
  },
  {
    "key": "athena",
    "name": "Athena",
    "area": "estratégia suprema"
  },
  {
    "key": "metatron",
    "name": "Metatron",
    "area": "permissões e logs"
  },
  {
    "key": "anubis",
    "name": "Anúbis",
    "area": "auditoria final"
  },
  {
    "key": "pandora",
    "name": "Pandora",
    "area": "simulações"
  },
  {
    "key": "omoikane",
    "name": "Omoikane",
    "area": "relatórios e insights"
  },
  {
    "key": "mimir",
    "name": "Mimir",
    "area": "base de conhecimento interna"
  },
  {
    "key": "izanami",
    "name": "Izanami",
    "area": "riscos profundos e encerramentos"
  },
  {
    "key": "izanagi",
    "name": "Izanagi",
    "area": "criação estrutural"
  },
  {
    "key": "hachiman",
    "name": "Hachiman",
    "area": "aprendizado global"
  },
  {
    "key": "themis",
    "name": "Themis",
    "area": "regras, termos e LGPD"
  },
  {
    "key": "yama",
    "name": "Yama",
    "area": "Karma e conduta"
  },
  {
    "key": "nemesis",
    "name": "Nemesis",
    "area": "reputação e crise"
  },
  {
    "key": "shichifukujin",
    "name": "Shichifukujin",
    "area": "sorte e fatores externos"
  },
  {
    "key": "chronos",
    "name": "Chronos",
    "area": "calendário"
  },
  {
    "key": "kairos",
    "name": "Kairos",
    "area": "momento oportuno"
  },
  {
    "key": "norns",
    "name": "Norns",
    "area": "tendências futuras"
  },
  {
    "key": "hotei",
    "name": "Hotei",
    "area": "Assistente Pet"
  },
  {
    "key": "kannon",
    "name": "Kannon",
    "area": "comunidade"
  },
  {
    "key": "tenjin",
    "name": "Tenjin",
    "area": "tutorial"
  },
  {
    "key": "selene",
    "name": "Selene",
    "area": "pausa e sobrecarga"
  },
  {
    "key": "ganesha",
    "name": "Ganesha",
    "area": "destravamento"
  },
  {
    "key": "chiron",
    "name": "Chiron",
    "area": "mentoria"
  },
  {
    "key": "hestia",
    "name": "Hestia",
    "area": "conforto e rotina"
  },
  {
    "key": "gabriel",
    "name": "Gabriel",
    "area": "notificações"
  },
  {
    "key": "saraswati",
    "name": "Saraswati",
    "area": "linguagem educativa"
  },
  {
    "key": "brigid",
    "name": "Brigid",
    "area": "inspiração"
  },
  {
    "key": "amaterasu",
    "name": "Amaterasu",
    "area": "criação principal"
  },
  {
    "key": "benzaiten",
    "name": "Benzaiten",
    "area": "estética"
  },
  {
    "key": "hefesto",
    "name": "Hefesto",
    "area": "prompts e ideias"
  },
  {
    "key": "daedalus",
    "name": "Daedalus",
    "area": "geração técnica"
  },
  {
    "key": "orpheus",
    "name": "Orpheus",
    "area": "voz e storytelling"
  },
  {
    "key": "pygmalion",
    "name": "Pygmalion",
    "area": "personagens originais"
  },
  {
    "key": "apollo",
    "name": "Apollo",
    "area": "direção artística"
  },
  {
    "key": "ame_no_uzume",
    "name": "Ame-no-Uzume",
    "area": "humor, performance e UX"
  },
  {
    "key": "hathor",
    "name": "Hathor",
    "area": "conteúdo alegre/emocional"
  },
  {
    "key": "bragi",
    "name": "Bragi",
    "area": "frases e narrativa curta"
  },
  {
    "key": "taliesin",
    "name": "Taliesin",
    "area": "storytelling simbólico"
  },
  {
    "key": "pan",
    "name": "Pan",
    "area": "ASMR e sons naturais"
  },
  {
    "key": "morpheus",
    "name": "Morpheus",
    "area": "visual onírico"
  },
  {
    "key": "clio",
    "name": "Clio",
    "area": "histórico e contexto"
  },
  {
    "key": "calliope",
    "name": "Calliope",
    "area": "roteiros longos"
  },
  {
    "key": "vishvakarma",
    "name": "Vishvakarma",
    "area": "integrações e arquitetura técnica"
  },
  {
    "key": "ptah",
    "name": "Ptah",
    "area": "criação conceitual por comando"
  },
  {
    "key": "khnum",
    "name": "Khnum",
    "area": "moldagem visual"
  },
  {
    "key": "ogun",
    "name": "Ogun",
    "area": "ferramentas e produção pesada"
  },
  {
    "key": "wayland",
    "name": "Wayland",
    "area": "acabamento"
  },
  {
    "key": "goibniu",
    "name": "Goibniu",
    "area": "assets reutilizáveis"
  },
  {
    "key": "svarog",
    "name": "Svarog",
    "area": "renderização/transformação técnica"
  },
  {
    "key": "imhotep",
    "name": "Imhotep",
    "area": "arquitetura técnica e diagnóstico"
  },
  {
    "key": "seshat",
    "name": "Seshat",
    "area": "metadados e catalogação"
  },
  {
    "key": "nabu",
    "name": "Nabu",
    "area": "documentação formal"
  },
  {
    "key": "gaia",
    "name": "Gaia",
    "area": "monetização"
  },
  {
    "key": "caishen",
    "name": "Caishen",
    "area": "recompensas"
  },
  {
    "key": "inari",
    "name": "Inari",
    "area": "copy e oferta"
  },
  {
    "key": "ebisu",
    "name": "Ebisu",
    "area": "links e collabs"
  },
  {
    "key": "hermes",
    "name": "Hermes",
    "area": "distribuição"
  },
  {
    "key": "daikokuten",
    "name": "Daikokuten",
    "area": "campanhas"
  },
  {
    "key": "fuxi",
    "name": "Fuxi",
    "area": "nicho e posicionamento"
  },
  {
    "key": "lakshmi",
    "name": "Lakshmi",
    "area": "prosperidade"
  },
  {
    "key": "kubera",
    "name": "Kubera",
    "area": "tesouraria"
  },
  {
    "key": "plutus",
    "name": "Plutus",
    "area": "lucro"
  },
  {
    "key": "fortuna",
    "name": "Fortuna",
    "area": "sorte e variação"
  },
  {
    "key": "nike",
    "name": "Nike",
    "area": "metas"
  },
  {
    "key": "oshun",
    "name": "Oshun",
    "area": "magnetismo"
  },
  {
    "key": "mercurio",
    "name": "Mercúrio",
    "area": "negociação"
  },
  {
    "key": "eshu_elegua",
    "name": "Eshu/Eleguá",
    "area": "abertura de caminhos"
  },
  {
    "key": "mnemosyne",
    "name": "Mnemosyne",
    "area": "memória"
  },
  {
    "key": "wenchang",
    "name": "Wenchang",
    "area": "biblioteca"
  },
  {
    "key": "thoth",
    "name": "Thoth",
    "area": "linguagem, cálculo e tradução"
  },
  {
    "key": "raziel",
    "name": "Raziel",
    "area": "padrões ocultos"
  },
  {
    "key": "argus",
    "name": "Argus",
    "area": "benchmark"
  },
  {
    "key": "odin",
    "name": "Odin",
    "area": "visão ampla"
  },
  {
    "key": "ogma",
    "name": "Ogma",
    "area": "nomes e linguagem"
  },
  {
    "key": "susanoo",
    "name": "Susanoo",
    "area": "segurança geral"
  },
  {
    "key": "takemikazuchi",
    "name": "Takemikazuchi",
    "area": "resposta rápida"
  },
  {
    "key": "zhong_kui",
    "name": "Zhong Kui",
    "area": "conteúdo problemático"
  },
  {
    "key": "michael",
    "name": "Michael",
    "area": "defesa máxima"
  },
  {
    "key": "bishamonten",
    "name": "Bishamonten",
    "area": "checklist e qualidade"
  },
  {
    "key": "sekhmet",
    "name": "Sekhmet",
    "area": "abuso grave"
  },
  {
    "key": "durga",
    "name": "Durga",
    "area": "ameaça persistente"
  },
  {
    "key": "kali",
    "name": "Kali",
    "area": "corrupção sistêmica"
  },
  {
    "key": "thor",
    "name": "Thor",
    "area": "defesa direta"
  },
  {
    "key": "indra",
    "name": "Indra",
    "area": "resposta elétrica"
  },
  {
    "key": "tyr",
    "name": "Tyr",
    "area": "integridade"
  },
  {
    "key": "hecate",
    "name": "Hécate",
    "area": "zonas cinzentas"
  },
  {
    "key": "loki",
    "name": "Loki",
    "area": "teste de manipulação"
  },
  {
    "key": "mara",
    "name": "Mara",
    "area": "teste de tentação e vulnerabilidade"
  },
  {
    "key": "asclepio",
    "name": "Asclépio",
    "area": "saúde do sistema"
  },
  {
    "key": "raphael",
    "name": "Raphael",
    "area": "recuperação e backup"
  },
  {
    "key": "eir",
    "name": "Eir",
    "area": "cura operacional pequena"
  },
  {
    "key": "sukunabikona",
    "name": "Sukunabikona",
    "area": "suporte fino"
  },
  {
    "key": "nuwa",
    "name": "Nüwa",
    "area": "onboarding e reparo estrutural"
  },
  {
    "key": "osiris",
    "name": "Osíris",
    "area": "reconstrução após perda"
  },
  {
    "key": "dhanvantari",
    "name": "Dhanvantari",
    "area": "diagnóstico profundo"
  },
  {
    "key": "yomi",
    "name": "Yomi",
    "area": "direitos autorais"
  },
  {
    "key": "tsukuyomi",
    "name": "Tsukuyomi",
    "area": "identidade visual"
  },
  {
    "key": "tsukuyomi_no_mikoto",
    "name": "Tsukuyomi-no-Mikoto",
    "area": "registro visual"
  },
  {
    "key": "aphrodite",
    "name": "Aphrodite",
    "area": "atratividade visual"
  },
  {
    "key": "jophiel",
    "name": "Jophiel",
    "area": "beleza e clareza"
  },
  {
    "key": "sarutahiko",
    "name": "Sarutahiko",
    "area": "postagem manual"
  },
  {
    "key": "astraea",
    "name": "Astraea",
    "area": "XP e Rank"
  },
  {
    "key": "morax",
    "name": "Morax",
    "area": "financeiro guiado, se mantido como codinome interno"
  },
  {
    "key": "buda",
    "name": "BUDA",
    "area": "crescimento sem venda direta, se mantido como nome interno"
  },
  {
    "key": "morpheus_hypnos",
    "name": "Morpheus/Hypnos",
    "area": "sonhos e lixeira inteligente, com Hypnos canônico para lixeira"
  },
  {
    "key": "janus_state_manager",
    "name": "Janus-State Manager",
    "area": "estado real/simulado"
  },
  {
    "key": "pandora_sandbox",
    "name": "Pandora-Sandbox",
    "area": "simulação isolada"
  }
] as const satisfies readonly YggnarokAiEntity[];

export function findYggnarokAiEntity(keyOrName: string) {
  const normalized = normalizeAiEntityKey(keyOrName);
  return yggnarokExtendedAiCatalog.find((entity) => entity.key === normalized)
    ?? yggnarokPrimaryAiAgents.find((entity) => entity.key === normalized)
    ?? yggnarokCanonicalAiAgents.find((entity) => entity.key === normalized)
    ?? null;
}

export function normalizeAiEntityKey(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

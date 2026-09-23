import {
  AtSign,
  BadgeHelp,
  Brush,
  Briefcase,
  Coffee,
  CodeXml,
  FerrisWheel,
  FileDown,
  Github,
  Instagram,
  Layers,
  Lightbulb,
  Mail,
  Mountain,
  Rocket,
  Send,
  Sparkles,
  User,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* هویت سایت — همه‌ی محتوای سایت از این فایل خوانده می‌شود             */
/* ------------------------------------------------------------------ */

export const profile = {
  username: "امیرعلی",
  usernameEn: "AmirAli",
  firstName: "امیرعلی",
  lastName: "طاهری",
  firstNameEn: "AmirAli",
  lastNameEn: "Taheri",
  fullName: "امیرعلی طاهری",
  fullNameEn: "AmirAli Taheri",
  role: "توسعه‌دهنده فول‌استک",
  roleEn: "Full-Stack Developer",
  bio: "توسعه‌دهنده‌ی ۱۴ ساله از اصفهان، ایران. از ۱۳ سالگی در حال ساختن چیزهایی برای وبم؛ عاشق TypeScript، Next.js و ساخت ابزارهایی که مشکل واقعی مردم را حل می‌کنند. باور دارم ایده‌ی خوب و پشتکار، از هر چیز دیگری مهم‌تر است.",
  bioEn:
    "A 14-year-old developer from Isfahan, Iran. I've been building things for the web since I was 13; in love with TypeScript, Next.js and building tools that solve real people's problems. I believe a good idea and persistence matter more than anything else.",
  email: "azazamir139@gmail.com",
  phone: "09394465148",
  location: "خمینی‌شهر، اصفهان، ایران",
  locationEn: "Khomeinishahr, Isfahan, Iran",
  avatarInitials: "ام",
  avatarImage: "/images/profile.png",
  heroCover: "/images/nature.png",
};

export const typedPhrases: string[] = [
  "سیستم‌هایی طراحی می‌کنم که مقیاس‌پذیرند.",
  "از ایده تا محصولِ زنده.",
  "منطقِ بک‌اند، ظرافتِ فرانت‌اند.",
  "ایده‌ها را به اثر تبدیل می‌کنم.",
  "کارایی، یک ویژگی است.",
];

export const typedPhrasesEn: string[] = [
  "I design systems that scale.",
  "From idea to live product.",
  "Backend logic, frontend finesse.",
  "Turning ideas into impact.",
  "Performance is a feature.",
];

export const navItems: {
  href: string;
  label: string;
  labelEn: string;
  icon: LucideIcon;
}[] = [
  { href: "#projects", label: "کارها", labelEn: "Work", icon: Lightbulb },
  { href: "/blog", label: "بلاگ", labelEn: "Blog", icon: FerrisWheel },
  { href: "#about", label: "درباره من", labelEn: "About Me", icon: User },
  { href: "/resume", label: "رزومه", labelEn: "Résumé", icon: Briefcase },
  { href: "#contact", label: "تماس", labelEn: "Contact", icon: AtSign },
];

export const footerLinks: { href: string; label: string; labelEn: string }[] = [
  { href: "#projects", label: "پروژه‌ها", labelEn: "Projects" },
  { href: "#about", label: "درباره من", labelEn: "About Me" },
  { href: "#experience", label: "تجربه‌ها", labelEn: "Experience" },
  { href: "/blog", label: "بلاگ", labelEn: "Blog" },
  { href: "#contact", label: "تماس", labelEn: "Contact" },
];

export type Social = {
  id: string;
  name: string;
  nameEn: string;
  url: string;
  icon: LucideIcon;
  label?: string;
};

export const socials: Social[] = [
  { id: "github", name: "گیت‌هاب", nameEn: "GitHub", url: "https://github.com/azazamir139-glitch", icon: Github },
  {
    id: "instagram",
    name: "اینستاگرام",
    nameEn: "Instagram",
    url: "https://www.instagram.com/xamirlolcode139/",
    icon: Instagram,
    label: "@xamirlolcode139",
  },
  {
    id: "telegram",
    name: "تلگرام",
    nameEn: "Telegram",
    url: "https://t.me/Amirkakao",
    icon: Send,
    label: "@Amirkakao",
  },
  { id: "email", name: "ایمیل", nameEn: "Email", url: "mailto:azazamir139@gmail.com", icon: Mail },
];

/* ------------------------------------------------------------------ */
/* پروژه‌ها                                                            */
/* ------------------------------------------------------------------ */

export type ProjectTeamMember = { name: string; role: string };
export type ProjectRole = { name: string; description: string };
export type ProjectArchitecture = { label: string; value: string };

export type Project = {
  slug: string;
  title: string;
  /** English variants for the bilingual homepage card (detail pages stay Persian for now). */
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  tags: string[];
  tagsEn?: string[];
  icon: string;
  /** Live website URL. When absent the «دموی زنده» button renders disabled with an explanatory hint. */
  liveUrl?: string;
  githubUrl?: string;
  /** پروژه‌برگ fields (same presentation model as the reference) */
  overview: string;
  features: string[];
  techAll: string[];
  team: ProjectTeamMember[];
  /** English variants for the bilingual preview modal + detail page. */
  overviewEn?: string;
  featuresEn?: string[];
  rolesEn?: ProjectRole[];
  architectureEn?: ProjectArchitecture[];
  goalEn?: string;
  managementEn?: string[];
  supportEn?: string;
  designEn?: string;
  structureEn?: string[];
  teamEn?: ProjectTeamMember[];
  year?: string;
  /** Extended sections rendered on the detail page when present */
  roles?: ProjectRole[];
  architecture?: ProjectArchitecture[];
  goal?: string;
  management?: string[];
  support?: string;
  design?: string;
  structure?: string[];
};

export const projects: Project[] = [
  {
    slug: "madrese-shahid-ejhei",
    title: "مدرسه شهید اژه‌ای خمینی‌شهر",
    titleEn: "Shahid Ejei School of Khomeinishahr",
    description:
      "سامانه جامع آموزشی، مدیریتی و ارتباطی مدرسه با پنل‌های اختصاصی دانش‌آموزان، دبیران، مدیران و انجمن‌های دانش‌آموزی.",
    descriptionEn:
      "The school's all-in-one educational, management and communication system with dedicated panels for students, teachers, managers and student associations.",
    tags: ["Python", "Flask", "Socket.IO", "JWT"],
    icon: "/images/projects/samad-logo.png",
    liveUrl: "https://myejei.ir",
    githubUrl: "https://github.com/azazamir139-glitch",
    overview:
      "وب‌سایت مدرسه شهید اژه‌ای خمینی‌شهر یک سامانه جامع آموزشی، مدیریتی و ارتباطی است که با هدف یکپارچه‌سازی خدمات دیجیتال مدرسه و تسهیل ارتباط میان دانش‌آموزان، دبیران، مدیران و انجمن‌های دانش‌آموزی توسعه یافته است.\n\nاین سامانه مجموعه‌ای از امکانات آموزشی، مدیریتی، اطلاع‌رسانی و ارتباطی را در قالب پنل‌های اختصاصی و مبتنی بر سطح دسترسی کاربران ارائه می‌کند.",
    features: [
      "پنل اختصاصی دانش‌آموزان با دسترسی به امکانات و محتوای آموزشی",
      "پنل دبیران درسی برای مدیریت و انتشار منابع آموزشی",
      "پنل مدیریت مدرسه برای مدیریت کاربران، کلاس‌ها، دروس، دبیران و محتوای سامانه",
      "سیستم ارتباطی و گفت‌وگوی داخلی میان کاربران",
      "سامانه مدیریت انجمن‌های دانش‌آموزی",
      "مدیریت اعضا و درخواست‌های عضویت انجمن‌ها",
      "مدیریت اخبار، اطلاعیه‌ها و محتوای اطلاع‌رسانی مدرسه",
      "سیستم مدیریت و ارائه منابع و فایل‌های آموزشی",
      "مدیریت افتخارات، المپیادها و موفقیت‌های دانش‌آموزان",
      "گالری تصاویر و معرفی امکانات مدرسه",
      "سیستم گزارش‌گیری و نمایش آمار مدیریتی",
      "مدیریت دروس و ساختار آموزشی",
      "کنترل دسترسی کاربران بر اساس نقش و سطح دسترسی",
      "طراحی واکنش‌گرا برای رایانه، تبلت و تلفن همراه",
      "بخش Scientific Lessons برای ارائه محتوای علمی و آموزشی تعاملی",
    ],
    roles: [
      {
        name: "دانش‌آموز",
        description:
          "دسترسی به امکانات آموزشی، منابع، انجمن‌ها، ارتباطات و سایر خدمات مربوط به دانش‌آموز.",
      },
      {
        name: "دبیر درسی",
        description:
          "مدیریت و انتشار منابع آموزشی و دسترسی به امکانات مرتبط با کلاس‌ها و دروس اختصاص‌یافته.",
      },
      {
        name: "مدیر",
        description:
          "مدیریت جامع سامانه، کاربران، کلاس‌ها، دبیران، دروس، محتوا، گزارش‌ها و سایر بخش‌های مدیریتی.",
      },
      {
        name: "دبیر انجمن",
        description:
          "مدیریت اختصاصی انجمن شامل اطلاعات انجمن، دوره‌ها، رویدادها، اعضا، درخواست‌های عضویت، اطلاعیه‌ها و سایر امکانات مرتبط.",
      },
    ],
    architecture: [
      { label: "Frontend", value: "HTML5، CSS3، JavaScript" },
      { label: "Backend", value: "Python، Flask" },
      { label: "Database", value: "SQLite، Flask-SQLAlchemy" },
      { label: "Real-Time Communication", value: "Socket.IO" },
      { label: "Authentication & Authorization", value: "JWT-based Authentication، Role-Based Access Control" },
      { label: "Typography", value: "IranYekan" },
    ],
    goal: "هدف اصلی این پروژه ایجاد یک زیرساخت دیجیتال یکپارچه برای مدرسه است که بتواند فرآیندهای آموزشی، مدیریتی، ارتباطی و اطلاع‌رسانی را در یک محیط متمرکز و قابل توسعه ارائه کند.\n\nاین سامانه با تمرکز بر ساختار ماژولار، کنترل دسترسی، تجربه کاربری مناسب و قابلیت توسعه طراحی شده است تا در آینده نیز امکان افزودن امکانات و سرویس‌های جدید به آن وجود داشته باشد.",
    overviewEn:
      "The Shahid Ejei School website of Khomeinishahr is an all-in-one educational, management and communication system built to unify the school's digital services and simplify communication between students, teachers, managers and student associations.\n\nThe system provides a set of educational, administrative, announcement and communication features through dedicated, permission-aware panels tailored to each user role.",
    featuresEn: [
      "Dedicated student panel with access to facilities and learning content",
      "Subject-teacher panel for managing and publishing learning resources",
      "School management panel for users, classes, courses, teachers and system content",
      "Internal messaging and communication system between users",
      "Student association management system",
      "Member management and association membership requests",
      "News, announcements and school-wide communication content",
      "Learning resource and file management system",
      "Honors, olympiads and student achievement management",
      "Photo gallery and school facilities showcase",
      "Reporting and management statistics dashboard",
      "Course and academic structure management",
      "Role-based access control for every user",
      "Responsive design for desktop, tablet and mobile",
      "Scientific Lessons section for interactive learning content",
    ],
    rolesEn: [
      {
        name: "Student",
        description:
          "Access to learning facilities, resources, associations, communications and other student services.",
      },
      {
        name: "Subject Teacher",
        description:
          "Managing and publishing learning resources and access to the classes and courses assigned to them.",
      },
      {
        name: "Manager",
        description:
          "Full management of the system, users, classes, teachers, courses, content, reports and all other administrative areas.",
      },
      {
        name: "Association Teacher",
        description:
          "Dedicated association management including association info, courses, events, members, membership requests, announcements and related features.",
      },
    ],
    architectureEn: [
      { label: "Frontend", value: "HTML5, CSS3, JavaScript" },
      { label: "Backend", value: "Python, Flask" },
      { label: "Database", value: "SQLite, Flask-SQLAlchemy" },
      { label: "Real-Time Communication", value: "Socket.IO" },
      { label: "Authentication & Authorization", value: "JWT-based Authentication, Role-Based Access Control" },
      { label: "Typography", value: "IranYekan" },
    ],
    goalEn:
      "The main goal of this project is to create a unified digital infrastructure for the school that can bring educational, administrative, communication and announcement processes into one centralized, extensible environment.\n\nWith a focus on a modular structure, access control, a smooth user experience and future extensibility, the system is designed so new features and services can keep being added over time.",
    teamEn: [{ name: "AmirAli Taheri", role: "Full-Stack Developer" }],
    techAll: [
      "HTML5",
      "CSS3",
      "JavaScript",
      "Python",
      "Flask",
      "Flask-SQLAlchemy",
      "SQLite",
      "Socket.IO",
      "JWT Authentication",
    ],
    team: [{ name: "امیرعلی طاهری", role: "توسعه‌دهنده فول‌استک" }],
  },
  {
    slug: "marshall-store",
    title: "فروشگاه آنلاین لوازم خانگی مارشال",
    titleEn: "Marshall Home Appliances Online Store",
    description:
      "پلتفرم تخصصی معرفی و ارائه محصولات لوازم خانگی برند مارشال با جست‌وجو، دسته‌بندی، پشتیبانی مشتریان و تجربه‌ای مدرن و منظم.",
    descriptionEn:
      "A dedicated platform for Marshall home-appliance products with search, categories, customer support and a clean, modern experience.",
    tags: ["فروشگاه آنلاین", "پنل مدیریتی", "پشتیبانی مشتریان"],
    tagsEn: ["Online Store", "Admin Panel", "Customer Support"],
    icon: "/images/projects/marshal-logo.png",
    liveUrl: "https://marshal.ir",
    githubUrl: "https://github.com/azazamir139-glitch",
    overview:
      "وب‌سایت مارشال یک پلتفرم تخصصی برای معرفی و ارائه محصولات لوازم خانگی برند مارشال است که با تمرکز بر معرفی حرفه‌ای محصولات، دسترسی آسان کاربران به اطلاعات، ارتباط با مجموعه و ارائه تجربه‌ای مدرن و منظم طراحی شده است.\n\nاین وب‌سایت علاوه بر معرفی محصولات و دسته‌بندی‌های مختلف، امکانات متنوعی برای جست‌وجو، بررسی محصولات، دریافت پشتیبانی و ارتباط مستقیم با مجموعه در اختیار کاربران قرار می‌دهد.\n\nدر این پلتفرم قیمت محصولات به‌صورت عمومی نمایش داده نمی‌شود و کاربران برای دریافت اطلاعات مربوط به قیمت و شرایط خرید می‌توانند از طریق بخش ارتباط با مجموعه و پشتیبانی اقدام کنند.",
    features: [
      "صفحه اصلی مدرن با ساختار چندبخشی",
      "هدر دو لایه با دسترسی سریع به بخش‌های اصلی",
      "جست‌وجوی محصولات",
      "نمایش دسته‌بندی‌های مختلف لوازم خانگی",
      "بخش محصولات منتخب",
      "معرفی پیشنهادهای ویژه",
      "نمایش محصولات و جزئیات تخصصی آن‌ها",
      "گالری تصاویر محصولات",
      "مشخصات و ویژگی‌های فنی محصولات",
      "بخش ویدئوهای معرفی",
      "استوری‌های ویدئویی",
      "بنرهای اسلایدی و محتوای تبلیغاتی",
      "سیستم جست‌وجو و دسترسی آسان به محصولات",
      "امکان دریافت اطلاعات قیمت از طریق ارتباط با مجموعه",
      "بخش پشتیبانی و ارتباط با مشتریان",
      "صفحه راهنمای خرید",
      "بخش درباره ما",
      "صفحه تماس با ما",
      "بخش برندها و دسته‌بندی محصولات",
      "سیستم عضویت و ورود کاربران",
      "پروفایل کاربری",
      "علاقه‌مندی‌ها",
      "سبد خرید و فرآیند خرید",
      "مدیریت سفارش‌ها و وضعیت سفارش",
      "سیستم نظرات و امتیازدهی",
      "نمایش محصولات مرتبط",
      "اعلان‌ها و اطلاع‌رسانی",
      "بخش پرسش‌های متداول",
      "فرم‌های ارتباطی",
      "فوتر سه‌ستونه با دسترسی به لینک‌ها و اطلاعات مجموعه",
    ],
    support:
      "یکی از بخش‌های مهم وب‌سایت مارشال، سیستم ارتباط و پشتیبانی مشتریان است. کاربران می‌توانند برای دریافت اطلاعات بیشتر درباره محصولات، قیمت، شرایط خرید و سایر موارد موردنیاز با مجموعه ارتباط برقرار کنند.\n\nساختار سایت به گونه‌ای طراحی شده است که مسیر دسترسی کاربر از مشاهده محصول تا دریافت اطلاعات و برقراری ارتباط با مجموعه ساده و قابل دسترس باشد.",
    management: [
      "مدیریت محصولات",
      "افزودن، ویرایش و حذف محصولات",
      "مدیریت تصاویر و مشخصات محصولات",
      "مدیریت دسته‌بندی‌ها",
      "مدیریت محتوای صفحات",
      "مدیریت بنرها و محتوای تبلیغاتی",
      "مدیریت سفارش‌ها",
      "مدیریت کاربران",
      "مدیریت نظرات و امتیازها",
      "مدیریت موجودی و اطلاعات محصولات",
      "مدیریت پیشنهادهای ویژه",
      "مدیریت اطلاعات تماس و پشتیبانی",
      "مشاهده گزارش‌ها و آمارهای مدیریتی",
    ],
    design:
      "طراحی مارشال بر پایه هویت بصری سفید، آبی و قرمز شکل گرفته است. استفاده از پس‌زمینه‌های روشن، رنگ اصلی آبی و رنگ قرمز برای تأکیدهای بصری، ساختاری منسجم و قابل تشخیص برای برند ایجاد کرده است.\n\nوب‌سایت به‌صورت واکنش‌گرا طراحی شده تا کاربران بتوانند در رایانه، تبلت و تلفن همراه تجربه‌ای یکپارچه و مناسب داشته باشند.",
    structure: [
      "محصولات",
      "دسته‌بندی‌ها",
      "پیشنهاد ویژه",
      "برندها",
      "راهنمای خرید",
      "درباره ما",
      "تماس با ما",
      "پشتیبانی",
    ],
    goal: "هدف اصلی پروژه مارشال ایجاد یک بستر دیجیتال حرفه‌ای برای معرفی محصولات لوازم خانگی، تقویت ارتباط با مشتریان، ارائه اطلاعات کامل محصولات و فراهم‌کردن یک تجربه کاربری مدرن و قابل اعتماد است.\n\nاین پروژه با تمرکز بر طراحی حرفه‌ای، دسترسی آسان، معرفی دقیق محصولات، پشتیبانی مشتریان و قابلیت توسعه در آینده طراحی شده است.",
    overviewEn:
      "The Marshall website is a dedicated platform for presenting the brand's home-appliance products, designed with a focus on professional product presentation, easy access to information, communication with the team and a clean, modern experience.\n\nBeyond product listings and categories, the site offers search, detailed product pages, customer support and direct contact with the team.\n\nProduct prices are not shown publicly on the platform; visitors can request pricing and purchase details through the contact and support sections.",
    featuresEn: [
      "Modern multi-section homepage",
      "Two-layer header with quick access to the main areas",
      "Product search",
      "Browse home-appliance categories",
      "Featured products section",
      "Special offers showcase",
      "Product pages with detailed specifications",
      "Product image galleries",
      "Technical specs and product features",
      "Product introduction videos",
      "Video stories",
      "Slide banners and promotional content",
      "Search system with easy product discovery",
      "Pricing information via the contact team",
      "Customer support and communication section",
      "Buying guide page",
      "About us page",
      "Contact us page",
      "Brands and product categories section",
      "User registration and login",
      "User profile",
      "Wishlist",
      "Shopping cart and checkout flow",
      "Order management and order status",
      "Reviews and rating system",
      "Related products",
      "Notifications and announcements",
      "FAQ section",
      "Contact forms",
      "Three-column footer with links and company information",
    ],
    supportEn:
      "One of the key parts of the Marshall website is its customer communication and support system. Visitors can reach the team for more information about products, pricing, purchase conditions and anything else they need.\n\nThe site structure is designed so the path from viewing a product to getting information and contacting the team stays simple and always within reach.",
    managementEn: [
      "Product management",
      "Adding, editing and removing products",
      "Managing product images and specifications",
      "Category management",
      "Page content management",
      "Banner and promotional content management",
      "Order management",
      "User management",
      "Review and rating management",
      "Inventory and product information management",
      "Special offers management",
      "Contact and support information management",
      "Management reports and statistics",
    ],
    designEn:
      "Marshall's design is built on a white, blue and red visual identity. Light backgrounds, blue as the primary color and red for visual accents create a coherent, instantly recognizable brand structure.\n\nThe website is fully responsive so users get a consistent, comfortable experience on desktop, tablet and mobile.",
    structureEn: [
      "Products",
      "Categories",
      "Special Offers",
      "Brands",
      "Buying Guide",
      "About Us",
      "Contact Us",
      "Support",
    ],
    goalEn:
      "The main goal of the Marshall project is to build a professional digital platform for presenting home-appliance products, strengthening customer relationships, providing complete product information and delivering a modern, trustworthy user experience.\n\nThe project was designed with a focus on professional presentation, easy access, accurate product information, customer support and future extensibility.",
    teamEn: [{ name: "AmirAli Taheri", role: "Full-Stack Developer" }],
    techAll: [],
    team: [{ name: "امیرعلی طاهری", role: "توسعه‌دهنده فول‌استک" }],
  },
];

/* ------------------------------------------------------------------ */
/* خدمات                                                               */
/* ------------------------------------------------------------------ */

export type Service = {
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  icon: LucideIcon;
};

export const services: Service[] = [
  {
    title: "توسعه وب حرفه‌ای",
    titleEn: "Professional Web Development",
    description:
      "ساخت وب‌سایت‌های سریع، مدرن، امن و مقیاس‌پذیر با تمرکز بر تجربه کاربری و کیفیت کدنویسی.",
    descriptionEn:
      "Building fast, modern, secure and scalable websites with a focus on user experience and code quality.",
    icon: CodeXml,
  },
  {
    title: "مهندسی نرم‌افزار",
    titleEn: "Software Engineering",
    description:
      "طراحی و پیاده‌سازی نرم‌افزارهای قابل توسعه با معماری اصولی، کدنویسی تمیز و حل مسائل پیچیده.",
    descriptionEn:
      "Designing and implementing extensible software with solid architecture, clean code and complex problem solving.",
    icon: Rocket,
  },
  {
    title: "توسعه سمت سرور و پایگاه داده",
    titleEn: "Backend & Database Development",
    description:
      "ساخت سامانه‌های قدرتمند سمت سرور، رابط‌های برنامه‌نویسی و پایگاه‌های داده با تمرکز بر امنیت، سرعت و پایداری.",
    descriptionEn:
      "Building powerful server-side systems, APIs and databases with a focus on security, speed and reliability.",
    icon: Brush,
  },
  {
    title: "برنامه‌نویسی فول‌استک",
    titleEn: "Full-Stack Development",
    description:
      "توسعه کامل محصولات نرم‌افزاری از رابط کاربری و منطق برنامه تا سمت سرور، پایگاه داده و ارتباط میان بخش‌های مختلف سیستم.",
    descriptionEn:
      "End-to-end product development — from UI and application logic to the server, database and the communication between every part of the system.",
    icon: BadgeHelp,
  },
];

/* ------------------------------------------------------------------ */
/* نکات جالب                                                           */
/* ------------------------------------------------------------------ */

export type FunFact = { text: string; textEn: string; icon: LucideIcon };

export const funFacts: FunFact[] = [
  {
    text: "از ۱۳ سالگی تقریباً هر روز کد می‌زنم؛ حتی روزهای امتحان. ⚡",
    textEn: "I've coded almost every day since I was 13 — even on exam days. ⚡",
    icon: Zap,
  },
  {
    text: "به‌جای پروژه‌های آموزشی تکراری، سراغ پروژه‌های واقعی می‌روم. 🛠",
    textEn: "Instead of repetitive tutorial projects, I go for real ones. 🛠",
    icon: Wrench,
  },
  {
    text: "رویش قله‌ی کرکس را با خانواده فتح کردم. 🏔️",
    textEn: "I climbed Mount Karkas with my family. 🏔️",
    icon: Mountain,
  },
  {
    text: "بهترین ایده‌های برنامه‌نویسی‌ام همیشه نیمه‌شب می‌آیند. ☕",
    textEn: "My best coding ideas always arrive at midnight. ☕",
    icon: Coffee,
  },
];

/* ------------------------------------------------------------------ */
/* تجربه‌ها                                                            */
/* ------------------------------------------------------------------ */

export type Experience = {
  period: string;
  periodEn?: string;
  role: string;
  roleEn?: string;
  company: string;
  companyEn?: string;
  location?: string;
  locationEn?: string;
  description: string;
  descriptionEn?: string;
  /** Dedicated project-detail route the card/arrow navigates to. */
  projectSlug?: string;
};

export const experience: Experience[] = [
  {
    period: "پروژه ۰۱",
    periodEn: "Project 01",
    role: "توسعه‌دهنده فول‌استک",
    roleEn: "Full-Stack Developer",
    company: "مدرسه شهید اژه‌ای خمینی‌شهر",
    companyEn: "Shahid Ejei School of Khomeinishahr",
    location: "خمینی‌شهر، اصفهان",
    locationEn: "Khomeinishahr, Isfahan",
    description:
      "توسعه یک سامانه جامع آموزشی، مدیریتی و ارتباطی با پنل‌های اختصاصی دانش‌آموزان، دبیران، مدیران و انجمن‌های دانش‌آموزی، با تمرکز بر کنترل دسترسی، منابع آموزشی و ارتباطات داخلی.",
    descriptionEn:
      "Developed an all-in-one educational, management and communication system with dedicated panels for students, teachers, managers and student associations — focused on access control, learning resources and internal communications.",
    projectSlug: "madrese-shahid-ejhei",
  },
  {
    period: "پروژه ۰۲",
    periodEn: "Project 02",
    role: "توسعه‌دهنده فول‌استک",
    roleEn: "Full-Stack Developer",
    company: "فروشگاه مارشال",
    companyEn: "Marshall Store",
    description:
      "طراحی و توسعه یک پلتفرم حرفه‌ای معرفی و ارائه محصولات لوازم خانگی با امکانات جست‌وجو، دسته‌بندی محصولات، پشتیبانی مشتریان، مدیریت محتوا و تجربه کاربری واکنش‌گرا.",
    descriptionEn:
      "Designed and developed a professional home-appliance platform with product search, categories, customer support, content management and a responsive user experience.",
    projectSlug: "marshall-store",
  },
];

/* ------------------------------------------------------------------ */
/* تحصیلات                                                             */
/* ------------------------------------------------------------------ */

export type Education = {
  period?: string;
  degree: string;
  degreeEn?: string;
  school?: string;
  schoolEn?: string;
  location?: string;
  locationEn?: string;
  status?: string;
  statusEn?: string;
  focus?: string;
  highlights?: string;
  /** Short practical course summary shown on the front face between the
      title and the open hint (keeps the compact card balanced). */
  description?: string;
  descriptionEn?: string;
  /** Brand image shown inside the opened (flipped) card. Sabz Learn uses
      its official logo; the two courses use their dedicated provided brand
      images (University of Helsinki lockup / Spektor mascot) — the full
      certificate images stay exclusively in the Certificates section. */
  logo?: string;
};

export const education: Education[] = [
  {
    degree: "دوره HTML، CSS و JavaScript",
    degreeEn: "HTML, CSS & JavaScript Course",
    school: "سبز لرن",
    schoolEn: "Sabz Learn",
    location: "آنلاین",
    locationEn: "Online",
    status: "گذرانده‌شده.",
    statusEn: "Completed.",
    description:
      "دوره آنلاین مبانی وب؛ ساخت صفحات با HTML، استایل‌دهی با CSS و افزودن تعامل با جاوااسکریپت.",
    descriptionEn:
      "Online web-basics course: building pages with HTML, styling with CSS and adding interactivity with JavaScript.",
    logo: "/images/education/sabz-learn-logo.svg",
  },
  {
    degree: "دوره Reaktor با محوریت المنت آف AI",
    degreeEn: "Reaktor Course — Elements of AI",
    school: "Reaktor",
    location: "آنلاین",
    locationEn: "Online",
    status: "گذرانده‌شده.",
    statusEn: "Completed.",
    description:
      "دوره آنلاین مقدمات هوش مصنوعی و یادگیری ماشین همراه با تمرین‌های عملی؛ معادل ۲ واحد ECTS.",
    descriptionEn:
      "Online introduction to AI and machine learning with practical exercises — equal to 2 ECTS credits.",
    logo: "/images/education/helsinki-logo.png",
  },
  {
    degree: "دوره Spektor با محوریت Python Fundamentals",
    degreeEn: "Spektor Course — Python Fundamentals",
    school: "Spektor",
    location: "آنلاین",
    locationEn: "Online",
    status: "گذرانده‌شده.",
    statusEn: "Completed.",
    description:
      "دوره آنلاین مبانی پایتون؛ آشنایی با مفاهیم پایه زبان همراه با تمرین‌های کاربردی.",
    descriptionEn:
      "Online Python fundamentals course: core language concepts with hands-on, practical exercises.",
    logo: "/images/education/spektor-logo.png",
  },
];

/* ------------------------------------------------------------------ */
/* گواهینامه‌ها                                                        */
/* ------------------------------------------------------------------ */

export type Certification = {
  title: string;
  titleEn?: string;
  issuer: string;
  date?: string;
  dateEn?: string;
  credentialId?: string;
  url?: string;
  description?: string;
  descriptionEn?: string;
  image?: string;
  tags: string[];
  tagsEn?: string[];
};

export const certifications: Certification[] = [
  {
    title: "Python Fundamentals",
    issuer: "Spektor",
    date: "۴ سپتامبر ۲۰۲۵",
    dateEn: "Sep 4, 2025",
    description:
      "دوره‌ای با تمرکز بر مفاهیم بنیادی پایتون، اصول برنامه‌نویسی و تقویت مهارت حل مسئله با Python.",
    descriptionEn:
      "A course focused on Python's core concepts, programming fundamentals and strengthening problem-solving skills with Python.",
    url: "https://www.ilorez.dev/",
    image: "/images/certificates/python-fundamentals.png",
    tags: ["Python"],
  },
  {
    title: "المنت آف AI",
    titleEn: "Elements of AI",
    issuer: "Reaktor",
    date: "۲۹ ژوئیه ۲۰۲۴",
    dateEn: "Jul 29, 2024",
    description:
      "دوره‌ای با محوریت مفاهیم و کاربردهای هوش مصنوعی و آشنایی با رویکردهای نوین توسعه نرم‌افزار.",
    descriptionEn:
      "A course centered on the concepts and applications of artificial intelligence and modern approaches to software development.",
    url: "https://www.ilorez.dev/",
    image: "/images/certificates/elements-of-ai.png",
    tags: ["هوش مصنوعی"],
    tagsEn: ["AI"],
  },
];

/* ------------------------------------------------------------------ */
/* مهارت‌ها                                                            */
/* ------------------------------------------------------------------ */

export type SkillCategory = {
  /** Stable key (language-independent) used by the flip-card cube data. */
  id: string;
  title: string;
  titleEn: string;
  skills: { name: string; nameEn?: string; level?: string; levelEn?: string }[]
};

export const skills: SkillCategory[] = [
  {
    id: "langs",
    title: "زبان‌ها و فریم‌ورک‌ها",
    titleEn: "Languages & Frameworks",
    skills: [
      { name: "TypeScript", level: "پیشرفته", levelEn: "Advanced" },
      { name: "JavaScript", level: "پیشرفته", levelEn: "Advanced" },
      { name: "React.js", level: "پیشرفته", levelEn: "Advanced" },
      { name: "Next.js", level: "پیشرفته", levelEn: "Advanced" },
      { name: "Node.js", level: "پیشرفته", levelEn: "Advanced" },
      { name: "NestJS", level: "متوسط", levelEn: "Intermediate" },
      { name: "PostgreSQL", level: "پیشرفته", levelEn: "Advanced" },
      { name: "MongoDB", level: "متوسط", levelEn: "Intermediate" },
      { name: "Redis", level: "متوسط", levelEn: "Intermediate" },
      { name: "Python", level: "متوسط", levelEn: "Intermediate" },
      { name: "REST API", level: "پیشرفته", levelEn: "Advanced" },
      { name: "GraphQL", level: "متوسط", levelEn: "Intermediate" },
    ],
  },
  {
    id: "devops",
    title: "دواپس و سیستم",
    titleEn: "DevOps & System",
    skills: [
      { name: "لینوکس", nameEn: "Linux", level: "پیشرفته", levelEn: "Advanced" },
      { name: "Docker", level: "پیشرفته", levelEn: "Advanced" },
      { name: "Git", level: "پیشرفته", levelEn: "Advanced" },
      { name: "GitFlow", level: "پیشرفته", levelEn: "Advanced" },
      { name: "CI/CD", level: "متوسط", levelEn: "Intermediate" },
      { name: "Nginx", level: "متوسط", levelEn: "Intermediate" },
      { name: "Bash", level: "پیشرفته", levelEn: "Advanced" },
      { name: "شبکه", nameEn: "Networking", level: "متوسط", levelEn: "Intermediate" },
    ],
  },
  {
    id: "soft",
    title: "مهارت‌های نرم",
    titleEn: "Soft Skills",
    skills: [
      { name: "حل مسئله", nameEn: "Problem Solving" },
      { name: "کار تیمی", nameEn: "Teamwork" },
      { name: "تفکر انتقادی", nameEn: "Critical Thinking" },
      { name: "ارتباط مؤثر", nameEn: "Communication" },
      { name: "یادگیری مادام‌العمر", nameEn: "Lifelong Learning" },
      { name: "منتورینگ", nameEn: "Mentoring" },
    ],
  },
  {
    id: "tools",
    title: "ابزارها و تکنولوژی‌ها",
    titleEn: "Tools & Technologies",
    skills: [
      { name: "Prisma", level: "پیشرفته", levelEn: "Advanced" },
      { name: "TanStack Query", level: "پیشرفته", levelEn: "Advanced" },
      { name: "Zustand", level: "پیشرفته", levelEn: "Advanced" },
      { name: "Tailwind CSS", level: "پیشرفته", levelEn: "Advanced" },
      { name: "Figma", level: "متوسط", levelEn: "Intermediate" },
      { name: "Storybook", level: "متوسط", levelEn: "Intermediate" },
      { name: "Sentry", level: "متوسط", levelEn: "Intermediate" },
      { name: "Vitest", level: "متوسط", levelEn: "Intermediate" },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* تماس                                                                */
/* ------------------------------------------------------------------ */

export const contactIntro =
  "پروژه‌ای در ذهن دارید، ایده‌ای برای همکاری، یا فقط می‌خواهید سلام کنید؟ خوشحال می‌شوم شنیدن از شما و گفت‌وگو درباره‌ی ساختن چیزهای معنادار با هم.";

export const contactIntroEn =
  "Have a project in mind, an idea for collaboration, or just want to say hi? I'd love to hear from you and talk about building meaningful things together.";

/* ------------------------------------------------------------------ */
/* بلاگ                                                               */
/* ------------------------------------------------------------------ */

export type BlogPost = {
  slug: string;
  title: string;
  /** English variant for the bilingual UI (falls back to the Persian title). */
  titleEn?: string;
  excerpt: string;
  /** English variant for the bilingual UI (falls back to the Persian excerpt). */
  excerptEn?: string;
  /** Category (دسته‌بندی) shown on cards and article meta. */
  category: string;
  /** Difficulty level (سطح). */
  level: string;
  date: string;
  /** ISO (Gregorian) date for machine consumption — RSS pubDate, JSON-LD. */
  dateISO: string;
  readingTime: string;
  tags: string[];
  content: string;
};

export const blogPosts: BlogPost[] = [
  {
    slug: "will-ai-replace-programmers",
    title: "آیا AI واقعاً برنامه‌نویس‌ها را جایگزین می‌کند؟",
    titleEn: "Will AI Really Replace Programmers?",
    excerpt:
      "از ابزارهایی که کد می‌نویسند تا مسئولیت خروجی؛ مروری بر اینکه نقش برنامه‌نویس در عصر AI چگونه در حال تغییر است و چه مهارت‌هایی اهمیت می‌یابد.",
    excerptEn:
      "From tools that write code to owning the outcome — a look at how the programmer's role is changing in the AI era and which skills are becoming essential.",
    category: "هوش مصنوعی و برنامه‌نویسی",
    level: "متوسط تا پیشرفته",
    date: "۱۲ شهریور ۱۴۰۵",
    dateISO: "2026-09-03",
    readingTime: "۸ دقیقه مطالعه",
    tags: ["AI", "برنامه‌نویسی", "AI Coding", "Developer", "آینده برنامه‌نویسی"],
    content: `
چند سال پیش اگر می‌گفتیم یک ابزار هوش مصنوعی می‌تواند برایمان یک API بنویسد، یک صفحه وب بسازد یا حتی خطای پروژه را پیدا کند، شاید بیشتر شبیه یک ایده علمی‌تخیلی به نظر می‌رسید.

امروز اما این اتفاق کاملاً عادی شده است.

ابزارهایی مثل Copilot و سایر coding agentها می‌توانند بخشی از فرایند توسعه را از نوشتن کد گرفته تا اجرای تست و بررسی خطا انجام دهند. طبق نظرسنجی Stack Overflow در سال ۲۰۲۵، ۸۴٪ پاسخ‌دهندگان از ابزارهای AI استفاده می‌کنند یا قصد استفاده از آن‌ها را دارند. بااین‌حال، اعتماد به خروجی این ابزارها بسیار کمتر از میزان استفاده از آن‌هاست.

پس سؤال اصلی دیگر این نیست:

«آیا AI می‌تواند کد بنویسد؟»

بلکه سؤال مهم‌تر این است:

«آیا یک برنامه‌نویس می‌تواند کدی را که AI نوشته، بفهمد و مسئولیت آن را بپذیرد؟»

## AI چه چیزی را تغییر داده است؟

هوش مصنوعی بسیاری از کارهای تکراری را سریع‌تر کرده است:

- ساخت کامپوننت‌های اولیه
- نوشتن API
- تولید تست
- توضیح کد
- پیدا کردن بعضی خطاها
- تبدیل کد از یک زبان به زبان دیگر
- تولید SQL
- نوشتن مستندات
- Refactoring اولیه

اما این‌ها الزاماً به معنی حذف برنامه‌نویس نیست.

در واقع نقش برنامه‌نویس در حال تغییر است.

قبلاً بخش بزرگی از زمان توسعه‌دهنده صرف نوشتن کد می‌شد. امروز بخش مهم‌تری از کار به طراحی معماری، تعریف مسئله، بررسی خروجی، تست، امنیت و تصمیم‌گیری فنی منتقل شده است.

## مشکل کجاست؟

AI ممکن است کدی تولید کند که:

- ظاهراً درست است ولی رفتار اشتباه دارد.
- در شرایط خاص خراب می‌شود.
- آسیب‌پذیری امنیتی دارد.
- با معماری پروژه هماهنگ نیست.
- وابستگی غیرضروری اضافه می‌کند.
- مشکل اصلی را پنهان می‌کند.

به همین دلیل «کد تولیدشده» با «کد قابل اعتماد» یکی نیست.

## برنامه‌نویس آینده چه مهارتی دارد؟

برنامه‌نویس آینده الزاماً کسی نیست که سریع‌تر تایپ می‌کند.

او کسی است که می‌تواند:

- مسئله را درست تعریف کند.
- معماری مناسبی انتخاب کند.
- از AI برای سرعت استفاده کند.
- خروجی AI را بررسی کند.
- تست بنویسد.
- امنیت را بررسی کند.
- تصمیم نهایی را خودش بگیرد.

## نتیجه

AI احتمالاً برنامه‌نویسی را حذف نمی‌کند؛ اما برنامه‌نویسی بدون AI را برای بسیاری از پروژه‌ها به روشی کم‌سرعت‌تر تبدیل خواهد کرد.

مهارت مهم آینده فقط «کدنویسی» نیست.

توانایی ساختن، بررسی کردن و مسئولیت‌پذیری نسبت به نرم‌افزار است.
`,
  },
  {
    slug: "why-typescript-became-essential",
    title: "TypeScript چرا به یکی از مهم‌ترین زبان‌های دنیای وب تبدیل شد؟",
    titleEn: "Why Did TypeScript Become One of the Most Important Languages on the Web?",
    excerpt:
      "GitHub در گزارش Octoverse 2025 اعلام کرد TypeScript به پرکاربردترین زبان روی GitHub تبدیل شده است؛ بررسی می‌کنیم این رشد از کجا آمده و چه ربطی به AI دارد.",
    excerptEn:
      "GitHub's Octoverse 2025 report named TypeScript the most-used language on the platform. We look at where that growth came from — and what it has to do with AI.",
    category: "Web Development",
    level: "متوسط",
    date: "۲۹ مرداد ۱۴۰۵",
    dateISO: "2026-08-20",
    readingTime: "۷ دقیقه مطالعه",
    tags: ["TypeScript", "JavaScript", "Frontend", "Web", "توسعه وب"],
    content: `
JavaScript سال‌ها یکی از پایه‌های اصلی وب بوده است؛ اما با بزرگ‌تر شدن پروژه‌ها، مشکل JavaScript خام بیشتر خودش را نشان داد.

پروژه‌های بزرگ‌تر یعنی:

- فایل‌های بیشتر
- تیم‌های بزرگ‌تر
- APIهای پیچیده‌تر
- داده‌های بیشتر
- Refactoring دشوارتر

اینجاست که TypeScript وارد می‌شود.

GitHub در گزارش Octoverse 2025 اعلام کرد TypeScript در آگوست ۲۰۲۵ برای اولین بار از Python و JavaScript عبور کرده و به پرکاربردترین زبان روی GitHub تبدیل شده است. همچنین تعداد مشارکت‌کنندگان TypeScript بیش از یک میلیون نفر افزایش داشته است.

## TypeScript دقیقاً چه چیزی اضافه می‌کند؟

TypeScript در اصل JavaScript به‌علاوه سیستم Type است.

مثلاً:

\`\`\`ts
function add(a: number, b: number) {
    return a + b;
}
\`\`\`

حالا اگر کسی اشتباهاً مقدار متنی وارد کند، ابزارهای توسعه می‌توانند قبل از اجرای برنامه به مشکل اشاره کنند.

این موضوع در پروژه‌های بزرگ اهمیت زیادی دارد.

## چرا AI هم باعث رشد TypeScript شده؟

این قسمت جالب است.

وقتی AI کد تولید می‌کند، داشتن ساختار مشخص و Typeهای دقیق می‌تواند به توسعه‌دهنده و ابزار AI کمک کند که روابط بین بخش‌های مختلف پروژه را بهتر درک کند.

GitHub نیز در تحلیل Octoverse به ارتباط رشد زبان‌های typed با توسعه نرم‌افزار به کمک AI اشاره کرده است.

## آیا JavaScript تمام شده؟

خیر.

JavaScript همچنان بخش عظیمی از اکوسیستم وب را تشکیل می‌دهد.

TypeScript در نهایت به JavaScript تبدیل می‌شود و در مرورگر، چیزی که اجرا می‌شود همچنان JavaScript است.

بنابراین مسئله:

JavaScript در برابر TypeScript

نیست.

بلکه بیشتر:

JavaScript با Type Safety بیشتر

است.

## چه زمانی TypeScript ارزش بیشتری دارد؟

برای پروژه‌های کوچک شاید JavaScript ساده کافی باشد.

اما وقتی پروژه:

- چندین صفحه دارد
- APIهای متعدد دارد
- تیمی توسعه داده می‌شود
- مدل‌های داده زیادی دارد
- قرار است مدت طولانی نگهداری شود

TypeScript می‌تواند ارزش بسیار زیادی داشته باشد.

## نتیجه

رشد TypeScript فقط یک ترند نیست.

بخشی از آن نتیجه طبیعی بزرگ‌تر شدن پروژه‌های وب و نیاز به ساختار بهتر است؛ و بخشی هم با تغییر روش توسعه نرم‌افزار و ورود AI به چرخه توسعه ارتباط دارد.
`,
  },
  {
    slug: "who-is-responsible-for-ai-bugs",
    title: "وقتی AI کد می‌نویسد، چه کسی مسئول باگ است؟",
    titleEn: "When AI Writes the Code, Who Is Responsible for the Bugs?",
    excerpt:
      "وقتی یک AI Agent سیستم احراز هویت می‌سازد و دو هفته بعد حفره‌ای امنیتی پیدا می‌شود، چه کسی مقصر است؟ پاسخ کوتاه: مسئولیت همچنان با انسان و تیم توسعه است.",
    excerptEn:
      "An AI agent builds the auth system and two weeks later a security hole turns up — who is at fault? Short answer: responsibility still belongs to the humans and the development team.",
    category: "مهندسی نرم‌افزار",
    level: "پیشرفته",
    date: "۱۵ مرداد ۱۴۰۵",
    dateISO: "2026-08-06",
    readingTime: "۸ دقیقه مطالعه",
    tags: ["AI Coding", "Bug", "Testing", "Software Engineering", "Code Review"],
    content: `
## مسئله

فرض کنید از یک AI Agent می‌خواهید سیستم احراز هویت بسازد.

Agent کد را می‌نویسد.

برنامه اجرا می‌شود.

همه‌چیز ظاهراً درست است.

اما دو هفته بعد یک کاربر می‌تواند از یک مسیر خاص بدون دسترسی مناسب وارد بخشی از سیستم شود.

چه کسی مقصر است؟

AI؟

توسعه‌دهنده؟

شرکت؟

پاسخ ساده است:

مسئولیت نرم‌افزار همچنان با انسان و تیم توسعه است.

## چرا تست مهم‌تر شده؟

هرچه تولید کد سریع‌تر شود، امکان تولید کد اشتباه هم بیشتر می‌شود.

اگر AI بتواند در چند دقیقه صدها خط کد تولید کند، بررسی نکردن آن کد می‌تواند خطرناک باشد.

به همین دلیل تست باید بخشی از فرایند تولید باشد، نه مرحله‌ای که در پایان پروژه به آن فکر کنیم.

پژوهش‌های منتشرشده در سپتامبر ۲۰۲۶ نیز روی نقش تست در چرخه‌های توسعه مبتنی بر LLM و Agentها تمرکز کرده‌اند و تأکید می‌کنند صرفاً «سبز شدن تست‌ها» به معنی درست بودن کامل رفتار نرم‌افزار نیست.

## یک Workflow بهتر

برای استفاده حرفه‌ای از AI می‌توان این چرخه را داشت:

\`\`\`text
Problem
↓
Specification
↓
AI Implementation
↓
Tests
↓
Run
↓
Review
↓
Security Check
↓
Deploy
\`\`\`

نه اینکه:

\`\`\`text
Prompt → Copy → Deploy
\`\`\`

## تست فقط برای پیدا کردن Bug نیست

تست خوب یک قرارداد برای رفتار سیستم است.

مثلاً اگر Login قرار است:

- username معتبر قبول کند
- password اشتباه را رد کند
- کاربر بدون دسترسی را وارد پنل نکند

همه این رفتارها باید قابل آزمایش باشند.

## AI را به جای Programmer قرار ندهید

بهتر است AI را مانند یک توسعه‌دهنده بسیار سریع اما نیازمند Review در نظر بگیریم.

AI می‌تواند:

- پیشنهاد بدهد
- کد بنویسد
- خطا را بررسی کند
- تست تولید کند
- توضیح بدهد

اما انسان باید:

- تصمیم بگیرد
- Review کند
- تست را اعتبارسنجی کند
- ریسک را بسنجد
- مسئولیت نتیجه را بپذیرد

## نتیجه

هرچه ابزارهای AI قدرتمندتر می‌شوند، مهارت‌هایی مثل Testing، Debugging و Code Review کم‌اهمیت‌تر نمی‌شوند.

اتفاقاً مهم‌تر می‌شوند.
`,
  },
  {
    slug: "from-idea-to-real-website",
    title: "از یک ایده تا یک وب‌سایت واقعی؛ چرا ساخت پروژه از یادگیری کد مهم‌تر است؟",
    titleEn: "From an Idea to a Real Website: Why Building Matters More Than Just Learning Code",
    excerpt:
      "چرا ماه‌ها فقط آموزش دیدن کافی نیست و ساختن پروژه‌ی واقعی، مهم‌ترین معلم برنامه‌نویسی است؛ از Authentication و Database تا Deployment.",
    excerptEn:
      "Why months of tutorials alone are never enough — and why building a real project, from authentication and databases to deployment, is the most important teacher in programming.",
    category: "مسیر برنامه‌نویسی",
    level: "همه سطوح",
    date: "۱ مرداد ۱۴۰۵",
    dateISO: "2026-07-23",
    readingTime: "۸ دقیقه مطالعه",
    tags: ["پروژه", "یادگیری برنامه‌نویسی", "Portfolio", "Full Stack"],
    content: `
## یادگیری بدون ساختن

یکی از بزرگ‌ترین اشتباهات برنامه‌نویسان تازه‌کار این است که ماه‌ها فقط آموزش می‌بینند.

HTML یاد می‌گیرند.

CSS یاد می‌گیرند.

JavaScript یاد می‌گیرند.

بعد Python.

بعد یک Framework دیگر.

اما وقتی از آن‌ها می‌خواهی یک پروژه واقعی بسازند، نمی‌دانند از کجا شروع کنند.

مشکل کمبود اطلاعات نیست.

مشکل نبود تجربه حل مسئله است.

## پروژه واقعی چه چیزی یاد می‌دهد؟

وقتی یک وب‌سایت واقعی می‌سازی، ناگهان با مسائلی مواجه می‌شوی که در آموزش‌های ساده کمتر دیده می‌شوند:

- Authentication
- Database
- File Upload
- API
- Permissions
- Error Handling
- Responsive Design
- Security
- Deployment
- Git
- Performance

این‌ها همان چیزهایی هستند که یک پروژه را از یک Demo ساده جدا می‌کنند.

## پروژه خوب چه ویژگی دارد؟

لازم نیست پروژه عظیم باشد.

یک پروژه خوب باید:

یک مشکل مشخص را حل کند.

مثلاً:

- سیستم مدیریت مدرسه
- فروشگاه
- سیستم مدیریت پروژه
- وبلاگ
- داشبورد
- سیستم رزرو
- ابزار آموزشی

## پروژه را چگونه شروع کنیم؟

اول Feature List بنویسید.

مثلاً:

\`\`\`text
Authentication
Users
Dashboard
Posts
Comments
Admin
Search
Database
\`\`\`

بعد آن را به بخش‌های کوچک‌تر تقسیم کنید.

## چرا Portfolio اهمیت دارد؟

گفتن:

«من Python بلدم»

خیلی ضعیف‌تر از این است:

«با Python یک سیستم واقعی ساخته‌ام که Authentication، Database، API و پنل مدیریتی دارد.»

پروژه نشان می‌دهد که فقط Syntax زبان را نمی‌دانید؛ بلکه می‌توانید مسئله حل کنید.

## نتیجه

بهترین راه یادگیری برنامه‌نویسی این نیست که منتظر باشید همه‌چیز را بلد شوید.

پروژه را شروع کنید، و هنگام ساختن چیزهایی را که نمی‌دانید یاد بگیرید.
`,
  },
  {
    slug: "git-version-control-for-serious-projects",
    title: "Git فقط برای ذخیره کد نیست؛ چرا هر پروژه جدی به Version Control نیاز دارد؟",
    titleEn: "Git Isn't Just for Saving Code: Why Every Serious Project Needs Version Control",
    excerpt:
      "Commit، Branch و GitHub؛ چرا Version Control بخش اساسی Workflow حرفه‌ای توسعه نرم‌افزار است، نه فقط ابزاری برای برگرداندن فایل قبلی.",
    excerptEn:
      "Commits, branches and GitHub — why version control is a core part of a professional software workflow, not just a tool for restoring yesterday's file.",
    category: "ابزارهای توسعه",
    level: "متوسط",
    date: "۱۸ تیر ۱۴۰۵",
    dateISO: "2026-07-09",
    readingTime: "۷ دقیقه مطالعه",
    tags: ["Git", "GitHub", "Version Control", "Software Development"],
    content: `
## تصور کنید Git ندارید

پروژه را تغییر می‌دهید.

یک قابلیت جدید اضافه می‌کنید.

بعد همه‌چیز خراب می‌شود.

حالا باید بفهمید چه چیزی تغییر کرده است.

اگر Git نداشته باشید، کار سخت می‌شود.

با Git می‌توانید تاریخچه پروژه را داشته باشید.

## Commit چیست؟

Commit را می‌توان یک Snapshot از وضعیت پروژه در یک لحظه خاص دانست.

مثلاً:

\`\`\`text
Initial project
↓
Add authentication
↓
Fix dashboard
↓
Add notifications
↓
Security improvements
\`\`\`

اگر تغییر جدید خراب شد، می‌توان بررسی کرد چه چیزی تغییر کرده است.

## GitHub چه تفاوتی دارد؟

Git ابزار Version Control است.

GitHub یک پلتفرم برای میزبانی و همکاری روی Repositoryهای Git است.

GitHub علاوه بر ذخیره کد، امکاناتی مانند:

- Pull Request
- Issues
- Code Review
- Actions
- Collaboration

را فراهم می‌کند.

گزارش Octoverse 2025 نشان می‌دهد GitHub همچنان با رشد بسیار زیاد جامعه توسعه‌دهندگان روبه‌رو بوده و بیش از ۱۸۰ میلیون توسعه‌دهنده روی این پلتفرم فعالیت داشته‌اند.

## Commit خوب چگونه است؟

بد:

\`\`\`text
update
fix
changes
final
final2
\`\`\`

بهتر:

\`\`\`text
Add authentication middleware
Fix dashboard authorization
Add teacher material permissions
\`\`\`

پیام Commit باید توضیح دهد چه تغییری انجام شده است.

## نتیجه

Git فقط یک ابزار برای «برگرداندن فایل قبلی» نیست.

یک بخش اساسی از Workflow حرفه‌ای توسعه نرم‌افزار است.
`,
  },
  {
    slug: "web-security-from-day-one",
    title: "امنیت وب را نباید بعد از ساخت سایت شروع کرد",
    titleEn: "Web Security Must Start Before the Site Is Built",
    excerpt:
      "امنیت یک Feature نیست؛ یک Property برای کل سیستم است. چرا باید از طراحی سیستم وارد پروژه شود، نه بعد از ساخت سایت.",
    excerptEn:
      "Security is not a feature; it is a property of the whole system. Why it has to enter the project at design time — not after the site is finished.",
    category: "امنیت",
    level: "متوسط تا پیشرفته",
    date: "۴ تیر ۱۴۰۵",
    dateISO: "2026-06-25",
    readingTime: "۹ دقیقه مطالعه",
    tags: ["Web Security", "Authentication", "Authorization", "API", "Backend"],
    content: `
## یک اشتباه رایج

بعضی توسعه‌دهندگان ابتدا کل سایت را می‌سازند و در آخر می‌گویند:

«حالا امنیتش را درست کنیم.»

این رویکرد خطرناک است.

امنیت باید از طراحی سیستم وارد پروژه شود.

## Authentication با Authorization فرق دارد

این دو اصطلاح اغلب با هم اشتباه گرفته می‌شوند.

Authentication:

«تو چه کسی هستی؟»

Authorization:

«تو اجازه انجام چه کاری را داری؟»

مثلاً یک کاربر ممکن است وارد سیستم شده باشد، اما اجازه ورود به پنل مدیریت را نداشته باشد.

## Route Protection

یکی از مهم‌ترین قسمت‌های Backend این است که صرفاً مخفی کردن یک دکمه را به‌عنوان امنیت در نظر نگیریم.

مثلاً:

\`\`\`text
Admin Button → Hidden
\`\`\`

امنیت واقعی نیست.

کاربر ممکن است مستقیماً Endpoint را درخواست کند.

پس Backend باید خودش Permission را بررسی کند.

## اصل مهم

هر درخواست حساس باید دوباره بررسی شود.

مثلاً:

\`\`\`text
Request
↓
Authenticated?
↓
Authorized?
↓
Validate Input
↓
Perform Action
\`\`\`

## موضوع داغ ۲۰۲۶: امنیت Agentها

با افزایش استفاده از coding agentها، امنیت فقط درباره برنامه‌ای که می‌سازیم نیست.

خود ابزارهای Agent، MCP Serverها، Skillها و تنظیمات آن‌ها نیز می‌توانند سطح حمله ایجاد کنند.

یک مطالعه منتشرشده در سپتامبر ۲۰۲۶ روی هزاران Repository نشان داده که بخشی از پیکربندی‌های Agent دارای مشکلات امنیتی قابل تشخیص هستند، از جمله MCPهای بدون نسخه Pin‌شده و مجوزهای اجرای بیش از حد گسترده.

## نتیجه

امنیت یک Feature نیست.

یک Property برای کل سیستم است.

هرچه پروژه بزرگ‌تر می‌شود، Authentication، Authorization، Validation و Logging اهمیت بیشتری پیدا می‌کنند.
`,
  },
  {
    slug: "flask-vs-fastapi-choosing-backend",
    title: "Flask یا FastAPI؟ انتخاب Backend مناسب برای پروژه واقعی",
    titleEn: "Flask or FastAPI? Choosing the Right Backend for a Real Project",
    excerpt:
      "Flask یا FastAPI؟ مقایسه‌ای منصفانه برای انتخاب Backend مناسب پروژه‌ی واقعی؛ از انعطاف معماری تا مستندسازی خودکار API.",
    excerptEn:
      "Flask or FastAPI? A fair comparison for choosing the right backend for a real project — from architectural flexibility to automatic API documentation.",
    category: "Backend",
    level: "متوسط",
    date: "۲۱ خرداد ۱۴۰۵",
    dateISO: "2026-06-11",
    readingTime: "۸ دقیقه مطالعه",
    tags: ["Python", "Flask", "FastAPI", "Backend", "API"],
    content: `
## Flask

Flask یک Framework سبک و انعطاف‌پذیر برای Python است.

یکی از نقاط قوت آن این است که توسعه‌دهنده آزادی زیادی در معماری پروژه دارد.

برای پروژه‌هایی که می‌خواهیم ساختار آن‌ها را خودمان طراحی کنیم، این انعطاف بسیار ارزشمند است.

## FastAPI

FastAPI با تمرکز جدی روی ساخت APIهای مدرن Python طراحی شده است.

Type Hintها در آن نقش مهمی دارند و مستندسازی API نیز می‌تواند به شکل خودکار تولید شود.

## کدام بهتر است؟

پاسخ مطلق وجود ندارد.

برای پروژه‌ای که:

- API محور است
- Type Hint اهمیت زیادی دارد
- مستندسازی API مهم است

FastAPI انتخاب جذابی است.

برای پروژه‌ای که:

- ساختار سفارشی دارد
- Server-rendered pages دارد
- کنترل مستقیم بیشتری روی اجزا می‌خواهید

Flask می‌تواند انتخاب بسیار خوبی باشد.

## مهم‌تر از Framework

یک اشتباه رایج این است که توسعه‌دهنده فکر کند انتخاب Framework مهم‌ترین تصمیم پروژه است.

معمولاً این‌طور نیست.

Architecture، Database Design، Security و Maintainability اهمیت بیشتری دارند.

یک پروژه بدساخت با بهترین Framework هم بد می‌ماند.

## نتیجه

Framework را بر اساس پروژه انتخاب کنید، نه بر اساس اینکه کدام Framework «ترندتر» است.
`,
  },
  {
    slug: "why-debugging-matters",
    title: "چرا Debugging یکی از مهم‌ترین مهارت‌های یک برنامه‌نویس است؟",
    titleEn: "Why Debugging Is One of a Programmer's Most Important Skills",
    excerpt:
      "همه پروژه‌ها Bug دارند؛ تفاوت حرفه‌ای‌ها در نحوه‌ی برخورد با Bug است. از خواندن خطا تا بازتولید و ایزوله‌کردن مسئله.",
    excerptEn:
      "Every project has bugs; professionals differ in how they deal with them. From reading the error to reproducing and isolating the problem.",
    category: "مهارت‌های برنامه‌نویسی",
    level: "متوسط",
    date: "۷ خرداد ۱۴۰۵",
    dateISO: "2026-05-28",
    readingTime: "۷ دقیقه مطالعه",
    tags: ["Debugging", "Error", "Programming", "Problem Solving"],
    content: `
## برنامه‌نویس حرفه‌ای کسی نیست که Bug ندارد

همه پروژه‌ها Bug دارند.

تفاوت برنامه‌نویس حرفه‌ای با تازه‌کار بیشتر در نحوه برخورد با Bug مشخص می‌شود.

## روش اشتباه

وقتی برنامه خراب می‌شود:

\`\`\`text
Change random code
↓
Run
↓
Still broken
↓
Change another thing
↓
Break something else
\`\`\`

این روش معمولاً مشکل را بزرگ‌تر می‌کند.

## روش بهتر

اول:

خطا را بخوان.

نه فقط آخرین خط را.

پیغام خطا معمولاً اطلاعات ارزشمندی دارد:

- File
- Line
- Function
- Exception
- Context

## خطا را بازتولید کنید

اگر نمی‌توانیم Bug را دوباره ایجاد کنیم، بررسی آن بسیار سخت‌تر می‌شود.

پس اول:

Reproduce

بعد:

Isolate

بعد:

Understand

و در نهایت:

Fix

## AI در Debugging

AI می‌تواند در تحلیل Stack Trace بسیار مفید باشد.

اما بهتر است به‌جای:

«این کد خراب است، درستش کن»

اطلاعات بیشتری بدهیم:

\`\`\`text
Expected: ...
Actual: ...
Error: ...
Steps to reproduce: ...
Relevant code: ...
\`\`\`

هرچه مسئله دقیق‌تر تعریف شود، احتمال رسیدن به پاسخ مفید بیشتر می‌شود.

## نتیجه

Debugging فقط پیدا کردن خط اشتباه نیست.

یک مهارت حل مسئله است.

و با بزرگ‌تر شدن پروژه‌ها، ارزش آن بیشتر می‌شود.
`,
  },
  {
    slug: "speed-without-quality-is-dangerous",
    title: "چرا سرعت توسعه بدون کیفیت می‌تواند خطرناک باشد؟",
    titleEn: "Why Development Speed Without Quality Can Be Dangerous",
    excerpt:
      "سرعت اولیه ممکن است هزینه‌ی آینده را افزایش دهد؛ درباره Technical Debt و پیوند سرعت تولید کد با کیفیت و امنیت.",
    excerptEn:
      "Early speed can raise tomorrow's costs — on technical debt and the link between code-production speed, quality and security.",
    category: "مهندسی نرم‌افزار",
    level: "پیشرفته",
    date: "۲۴ اردیبهشت ۱۴۰۵",
    dateISO: "2026-05-14",
    readingTime: "۸ دقیقه مطالعه",
    tags: ["Software Quality", "AI", "Technical Debt", "Development"],
    content: `
## سرعت همیشه خوب نیست

فرض کنید تیمی می‌تواند در یک هفته قابلیت‌هایی را بسازد که قبلاً یک ماه زمان می‌برد.

عالی است.

اما اگر تعداد Bugها هم چهار برابر شود چه؟

اگر نگهداری پروژه سخت شود چه؟

اگر امنیت کاهش پیدا کند چه؟

آن‌وقت سرعت اولیه ممکن است هزینه آینده را افزایش دهد.

## AI این مسئله را جدی‌تر کرده

ابزارهای AI می‌توانند حجم تولید کد را افزایش دهند.

Stack Overflow در ۲۰۲۵ گزارش کرده که استفاده از AI در توسعه بسیار گسترده شده، اما اعتماد به دقت خروجی‌ها همچنان مسئله مهمی است.

مطالعات و گزارش‌های جدید ۲۰۲۶ نیز به شکاف میان سرعت تولید کد و کنترل کیفیت و امنیت آن اشاره کرده‌اند.

## Technical Debt

وقتی برای سرعت، راه‌حل‌های موقتی و ضعیف را وارد پروژه می‌کنیم، Technical Debt ایجاد می‌شود.

مثلاً:

\`\`\`text
فعلاً این کد را سریع بنویس
بعداً تمیزش می‌کنیم
\`\`\`

مشکل این است که «بعداً» خیلی وقت‌ها هیچ‌وقت نمی‌رسد.

## راه‌حل چیست؟

سرعت را حذف نکنیم.

بلکه سرعت را با کنترل همراه کنیم:

Sustainable Development

## نتیجه

هدف توسعه‌دهنده حرفه‌ای این نیست که بیشترین کد را در کمترین زمان بنویسد.

هدف این است که بیشترین ارزش قابل اعتماد را با کمترین هزینه بلندمدت ایجاد کند.
`,
  },
  {
    slug: "future-programmer-skills",
    title: "برنامه‌نویس آینده چه مهارت‌هایی باید داشته باشد؟",
    titleEn: "What Skills Will the Programmer of the Future Need?",
    excerpt:
      "از یادگیری عمیق یک زبان تا امنیت و همکاری با AI؛ مهارت‌هایی که برنامه‌نویس آینده به آن‌ها نیاز دارد و با تغییر Frameworkها ارزش خود را حفظ می‌کنند.",
    excerptEn:
      "From deeply learning one language to security and collaborating with AI — the skills that keep a future programmer valuable no matter which frameworks come and go.",
    category: "آینده برنامه‌نویسی",
    level: "همه سطوح",
    date: "۱۰ اردیبهشت ۱۴۰۵",
    dateISO: "2026-04-30",
    readingTime: "۹ دقیقه مطالعه",
    tags: ["Future of Programming", "AI", "Full Stack", "Career", "Developer"],
    content: `
## دنیای برنامه‌نویسی در حال تغییر است

امروز یادگیری برنامه‌نویسی فقط یادگیری Syntax یک زبان نیست.

توسعه‌دهنده باید بتواند بین چند دنیای مختلف حرکت کند:

- Frontend
- Backend
- Database
- Git
- Cloud
- Security
- AI
- Testing
- Architecture

## ۱. یک زبان را عمیق یاد بگیرید

لازم نیست ده زبان بلد باشید.

یک زبان را آن‌قدر خوب یاد بگیرید که بتوانید با آن مسئله حل کنید.

Python برای Backend، Automation و AI بسیار قدرتمند است.

JavaScript/TypeScript نیز ستون مهم اکوسیستم وب هستند.

طبق داده‌های GitHub، Python همچنان رشد بسیار زیادی در حوزه AI و Data دارد و TypeScript نیز در سال ۲۰۲۵ به رتبه اول استفاده در GitHub رسید.

## ۲. فقط Framework یاد نگیرید

اگر فقط مثلاً یک Framework را بلد باشید، با تغییر نسخه یا تکنولوژی ممکن است بخش بزرگی از دانشتان بلااستفاده شود.

اما اگر HTTP، Database، Authentication، Networking و Architecture را بفهمید، یادگیری Framework جدید بسیار آسان‌تر می‌شود.

## ۳. AI را ابزار بدانید

برنامه‌نویس آینده باید بلد باشد با AI کار کند.

اما نه به این معنی که هر خروجی AI را قبول کند.

بلکه:

\`\`\`text
Prompt
↓
Generate
↓
Review
↓
Test
↓
Improve
\`\`\`

## ۴. امنیت

با افزایش Agentها و سیستم‌های AI، امنیت اهمیت بیشتری پیدا می‌کند.

امنیت دیگر فقط موضوع متخصص امنیت نیست.

هر Full-Stack Developer باید حداقل اصول:

- Authentication
- Authorization
- Input Validation
- Secrets
- API Security
- Dependency Security

را بداند.

## ۵. ارتباط و مستندسازی

توانایی توضیح دادن یک سیستم به اندازه ساختن آن مهم است.

کدی که فقط سازنده‌اش می‌فهمد، در پروژه بزرگ یک مشکل است.

## آینده چیست؟

احتمالاً توسعه نرم‌افزار به سمت همکاری نزدیک‌تر انسان و AI حرکت می‌کند.

AI بخش بیشتری از کارهای تکراری را انجام می‌دهد و انسان بیشتر روی:

- تصمیم‌گیری
- معماری
- محصول
- اعتبارسنجی
- امنیت
- حل مسائل پیچیده

تمرکز می‌کند.

## نتیجه

برنامه‌نویس آینده لزوماً کسی نیست که بیشترین Syntax را حفظ کرده باشد.

او کسی است که می‌تواند:

مسئله را بفهمد → راه‌حل طراحی کند → با ابزارهای مختلف آن را بسازد → خروجی را آزمایش کند → و مسئولیت نتیجه را بپذیرد.

این مهارت‌ها با تغییر Frameworkها هم ارزش خودشان را حفظ می‌کنند.
`,
  },
  {
    slug: "prompt-engineering-for-developers",
    title: "مهندسی پرامپت برای برنامه‌نویس‌ها؛ چگونه از AI کد بهتر بگیریم؟",
    titleEn: "Prompt Engineering for Developers: How to Get Better Code from AI",
    excerpt:
      "چرا یک پرامپت مبهم به کد بی‌کیفیت می‌رسد و یک پرامپت حرفه‌ای چگونه خروجی قابل بررسی می‌سازد؛ اجزای پرامپت اثربخش، نقش Context و روش بررسی کد تولیدشده با AI.",
    excerptEn:
      "Why a vague prompt produces low-quality code and how a professional one yields reviewable output — the parts of an effective prompt, the role of context, and how to review AI-generated code.",
    category: "هوش مصنوعی",
    level: "متوسط تا پیشرفته",
    date: "۲۷ فروردین ۱۴۰۵",
    dateISO: "2026-04-16",
    readingTime: "۷ دقیقه مطالعه",
    tags: ["AI", "Prompt Engineering", "AI Coding", "Workflow"],
    content: `
هوش مصنوعی می‌تواند در چند ثانیه کدی تولید کند که نوشتن آن برای یک برنامه‌نویس زمان زیادی می‌برد. اما کیفیت این کد به یک عامل مهم وابسته است: نحوه تعریف مسئله.

دو نفر ممکن است از یک مدل هوش مصنوعی استفاده کنند، اما یکی کدی مرتب، قابل تست و هماهنگ با پروژه دریافت کند و دیگری با ده‌ها خطای جدید روبه‌رو شود. تفاوت اغلب در پرامپت، اطلاعاتی که ارائه شده و نحوه بررسی نتیجه است.

مهندسی پرامپت برای برنامه‌نویس‌ها یعنی یاد بگیریم چگونه مسئله را دقیق به AI منتقل کنیم تا خروجی آن قابل استفاده‌تر، قابل بررسی‌تر و نزدیک‌تر به نیاز پروژه باشد.

## ۱. چرا پرامپت‌های مبهم نتیجه ضعیفی دارند؟

فرض کنید به یک Agent بگوییم:

«برای من یک سیستم لاگین بساز.»

این درخواست مشخص نمی‌کند:

- پروژه با چه زبان و Frameworkی نوشته شده است؟
- ساختار فایل‌ها چگونه است؟
- کاربران چه نقش‌هایی دارند؟
- روش احراز هویت چیست؟
- چه شرایطی باید تست شود؟
- آیا اجازه تغییر فایل‌های دیگر را دارد؟

در نتیجه، Agent ممکن است چیزی بسازد که از نظر خودش درست است، اما با معماری پروژه ما سازگار نباشد.

## ۲. اجزای یک پرامپت حرفه‌ای

یک پرامپت مناسب برای کار برنامه‌نویسی بهتر است شامل این بخش‌ها باشد:

- نقش و هدف
- زمینه پروژه
- نیازمندی‌ها
- محدودیت‌ها
- شرایط پذیرش
- روش گزارش

## ۳. مثال یک پرامپت ضعیف و حرفه‌ای

پرامپت ضعیف:

\`Fix my login page.\`

پرامپت حرفه‌ای:

\`\`\`text
You are working on an existing Flask application.

Goal:
Fix the login flow without changing unrelated features.

Requirements:
1. Preserve the existing UI and styling.
2. Support the current user roles.
3. Show a clear error when credentials are invalid.
4. Do not clear the password field after an error.
5. Keep the existing database schema unless a change is essential.
6. Inspect the relevant files before editing.
7. Run appropriate tests and report all modified files.

Do not rewrite the project or replace the current authentication system.
\`\`\`

پرامپت دوم فقط طولانی‌تر نیست؛ اطلاعاتی دارد که احتمال تصمیم‌های اشتباه را کاهش می‌دهد.

## ۴. Context مهم‌تر از تعداد کلمات است

اگر Agent نداند یک پروژه چگونه سازمان‌دهی شده، ممکن است فایل جدیدی بسازد که با ساختار قبلی هماهنگ نیست.

به‌جای فرستادن کل پروژه بدون توضیح، بهتر است ابتدا بخش‌های مرتبط را مشخص کنیم.

## ۵. خروجی AI را چگونه بررسی کنیم؟

هیچ پرامپتی تضمین نمی‌کند کد تولیدشده بدون خطا باشد.

بعد از دریافت کد باید:

- تغییرات را بررسی کنیم.
- تست‌های مربوط به قابلیت را اجرا کنیم.
- رفتارهای خطا را آزمایش کنیم.
- امنیت و مجوزهای دسترسی را بررسی کنیم.
- مطمئن شویم قابلیت‌های قبلی خراب نشده‌اند.

## جمع‌بندی

پرامپت‌نویسی حرفه‌ای جایگزین دانش برنامه‌نویسی نیست؛ بلکه راهی برای استفاده بهتر از آن دانش در همکاری با AI است. هرچه مسئله دقیق‌تر تعریف شود، احتمال دریافت راه‌حل سازگار با پروژه بیشتر می‌شود.
`,
  },
  {
    slug: "coding-agent-vs-chatbot",
    title: "Coding Agent چیست و چه تفاوتی با چت‌بات معمولی دارد؟",
    titleEn: "What Is a Coding Agent and How Does It Differ from a Regular Chatbot?",
    excerpt:
      "از دستیار متنی تا همکاری فعال در پروژه؛ مروری بر تفاوت Coding Agent و چت‌بات معمولی، چرخه‌ی کار Agentها، مزایا، خطرها و اصول استفاده‌ی حرفه‌ای از آن‌ها.",
    excerptEn:
      "From a text assistant to an active collaborator in your project — how coding agents differ from chatbots, how their work cycle runs, their benefits and risks, and the principles of using them professionally.",
    category: "AI Agents",
    level: "متوسط",
    date: "۱۳ فروردین ۱۴۰۵",
    dateISO: "2026-04-02",
    readingTime: "۸ دقیقه مطالعه",
    tags: ["AI Agents", "AI", "Developer", "Automation"],
    content: `
تا چند سال پیش، بیشتر ابزارهای هوش مصنوعی برنامه‌نویسی در نقش یک دستیار متنی فعالیت می‌کردند. توسعه‌دهنده سؤال می‌پرسید، کد دریافت می‌کرد و خودش آن را در پروژه قرار می‌داد.

امروزه Coding Agentها می‌توانند در محیط پروژه کار کنند، فایل‌ها را بخوانند، تغییر دهند، فرمان اجرا کنند و نتیجه را بررسی کنند. این تغییر، شیوه همکاری برنامه‌نویس و هوش مصنوعی را دگرگون کرده است.

## ۱. چت‌بات معمولی چه می‌کند؟

در حالت معمول:

\`Developer → Prompt → AI → Code suggestion\`

توسعه‌دهنده مسئول انتقال کد به پروژه، اجرای آن و اصلاح خطاهاست.

## ۲. Coding Agent چگونه کار می‌کند؟

یک Agent برنامه‌نویسی معمولاً چرخه‌ای شبیه این دارد:

\`\`\`text
Understand task
      ↓
Inspect project
      ↓
Plan changes
      ↓
Edit files
      ↓
Run commands or tests
      ↓
Review results
      ↓
Improve or report
\`\`\`

قابلیت هر Agent متفاوت است و ممکن است اجرای فرمان یا تغییر فایل به تأیید کاربر نیاز داشته باشد.

## ۳. مزایای Agentها

- بررسی چند فایل
- انجام کارهای چندمرحله‌ای
- کمک به Debugging
- اجرای تست
- تحلیل ارتباط میان بخش‌های پروژه

## ۴. خطر اصلی چیست؟

Agent ممکن است با هدف انجام یک وظیفه، تغییراتی فراتر از نیاز ایجاد کند.

به همین دلیل دستورهای زیر اهمیت دارند:

\`\`\`text
Preserve unrelated functionality.
Inspect before editing.
Make the smallest necessary changes.
Do not rewrite existing modules without justification.
\`\`\`

## ۵. چگونه حرفه‌ای از Agent استفاده کنیم؟

کار بزرگ را به وظایف کوچک تبدیل کنید.

به‌جای:

«کل پنل مدیریت را حرفه‌ای کن.»

بگویید:

«ابتدا فقط منطق احراز هویت Routeهای پنل مدیریت را بررسی کن. هنوز هیچ فایلی را تغییر نده. مشکلات امنیتی را گزارش کن و برای هر مشکل راه‌حل مشخص پیشنهاد بده.»

## جمع‌بندی

Coding Agent یک ابزار قدرتمند برای همکاری در توسعه نرم‌افزار است، اما نباید آن را جایگزین کامل مهندسی نرم‌افزار دانست.
`,
  },
  {
    slug: "what-is-mcp-protocol",
    title: "MCP چیست و چرا در حال تغییر شیوه کار ابزارهای هوش مصنوعی است؟",
    titleEn: "What Is MCP and Why Is It Changing How AI Tools Work?",
    excerpt:
      "MCP یا Model Context Protocol روش استاندارد اتصال مدل‌ها و Agentها به ابزارها و منابع بیرونی است؛ در این نوشته با معماری، کاربردها و نکات امنیتی آن آشنا می‌شویم.",
    excerptEn:
      "MCP — the Model Context Protocol — is the standard way to connect models and agents to external tools and resources. A look at its architecture, use cases and security considerations.",
    category: "AI Infrastructure",
    level: "متوسط تا پیشرفته",
    date: "۲۸ اسفند ۱۴۰۴",
    dateISO: "2026-03-19",
    readingTime: "۷ دقیقه مطالعه",
    tags: ["MCP", "AI Infrastructure", "AI Agents", "Integration"],
    content: `
یک مدل هوش مصنوعی به‌تنهایی فقط بر اساس ورودی و توانایی‌هایش پاسخ تولید می‌کند. اما برای انجام کارهای واقعی، گاهی باید به ابزارهای بیرونی متصل شود؛ مثلاً فایل‌ها را بخواند، با GitHub کار کند یا از یک سرویس اطلاعات بگیرد.

MCP یا Model Context Protocol روشی استاندارد برای ارتباط مدل‌ها و Agentها با ابزارها و منابع خارجی است.

## ۱. MCP چه مشکلی را حل می‌کند؟

قبل از وجود پروتکل‌های استاندارد، هر ابزار ممکن بود روش مخصوص خود را برای اتصال به مدل‌ها داشته باشد.

MCP تلاش می‌کند یک قرارداد مشترک برای معرفی و استفاده از ابزارها فراهم کند.

## ۲. اجزای اصلی

\`\`\`text
AI Application / Host
        ↓
MCP Client
        ↓
MCP Server
        ↓
External System
\`\`\`

## ۳. ابزار، منبع و قابلیت چیست؟

یک MCP Server می‌تواند ابزارهایی ارائه کند که Agent از آن‌ها استفاده کند. همچنین ممکن است منابعی برای خواندن اطلاعات یا الگوهایی برای تعامل بهتر فراهم کند.

## ۴. امنیت در MCP

قبل از استفاده باید بررسی شود:

- چه ابزارهایی در دسترس‌اند؟
- هر ابزار چه مجوزهایی دارد؟
- آیا اطلاعات حساس به سرویس ارسال می‌شود؟
- آیا ابزار می‌تواند فایل‌ها را تغییر دهد؟
- آیا اجرای عملیات نیازمند تأیید است؟
- آیا منبع ابزار قابل اعتماد است؟

## ۵. کاربرد واقعی

یک Server مربوط به GitHub می‌تواند در صورت پشتیبانی، امکان خواندن Issueها یا بررسی Pull Requestها را فراهم کند.

## جمع‌بندی

MCP یک استاندارد برای ارتباط مدل‌ها و Agentها با ابزارهای خارجی است؛ اما استفاده امن از آن نیازمند کنترل مجوزها، بررسی منابع و محدود کردن دسترسی‌هاست.
`,
  },
  {
    slug: "does-more-code-mean-faster-development",
    title: "آیا تولید کد بیشتر با AI واقعاً یعنی توسعه سریع‌تر؟",
    titleEn: "Does Generating More Code with AI Actually Mean Faster Development?",
    excerpt:
      "خط کد بیشتر به‌خودی‌خود یعنی پیشرفت بیشتر؟ مروری بر تفاوت سرعت ظاهری و سرعت واقعی، بدهی فنی و معیارهایی که برای سنجش توسعه‌ی سریع و قابل اعتماد مهم‌ترند.",
    excerptEn:
      "Is more code automatically more progress? A look at the difference between apparent and real speed, technical debt, and the metrics that matter for fast, trustworthy development.",
    category: "AI و کیفیت",
    level: "متوسط",
    date: "۱۴ اسفند ۱۴۰۴",
    dateISO: "2026-03-05",
    readingTime: "۷ دقیقه مطالعه",
    tags: ["AI", "کیفیت نرم‌افزار", "Technical Debt", "Developer"],
    content: `
تعداد خطوط کد معیار مناسبی برای سنجش ارزش نرم‌افزار نیست. کد بیشتر ممکن است قابلیت بیشتری ایجاد کند، اما می‌تواند پیچیدگی، خطا و هزینه نگهداری را هم افزایش دهد.

## ۱. سرعت ظاهری و سرعت واقعی

سرعت ظاهری یعنی قابلیت چقدر سریع تولید شده است.

سرعت واقعی یعنی قابلیت چقدر سریع به شکل قابل اعتماد، قابل نگهداری و آماده استفاده تحویل داده شده است.

## ۲. Technical Debt چیست؟

بدهی فنی زمانی ایجاد می‌شود که برای رسیدن سریع‌تر به نتیجه، راه‌حل‌هایی انتخاب کنیم که در آینده هزینه بیشتری به پروژه تحمیل می‌کنند.

نمونه‌ها:

- تکرار کد
- نبود تست
- معماری نامنظم
- وابستگی‌های غیرضروری
- نادیده گرفتن خطاها
- راه‌حل‌های موقتی

## ۳. چگونه سرعت را با کیفیت متعادل کنیم؟

\`\`\`text
Small task
   ↓
Implementation
   ↓
Focused tests
   ↓
Code review
   ↓
Integration
\`\`\`

## ۴. چه معیارهایی مهم‌ترند؟

- زمان تحویل قابلیت قابل استفاده
- تعداد خطاهای پس از انتشار
- زمان رفع خطا
- میزان موفقیت تست‌ها
- رضایت کاربر
- قابلیت نگهداری
- امنیت و پایداری

## جمع‌بندی

AI می‌تواند سرعت تولید کد را افزایش دهد، اما توسعه سریع فقط با نوشتن کد بیشتر اتفاق نمی‌افتد. هدف اصلی باید تولید ارزش قابل اعتماد باشد.
`,
  },
  {
    slug: "delegate-project-to-ai-agent-safely",
    title: "چگونه یک پروژه را به AI Agent بسپاریم بدون اینکه کنترل کد را از دست بدهیم؟",
    titleEn: "How to Hand a Project to an AI Agent Without Losing Control of the Code",
    excerpt:
      "سپردن پروژه به Agent بدون از دست دادن کنترل کد ممکن است؛ با شناخت وضعیت پروژه، تقسیم وظیفه به مراحل کوچک، محدودیت‌های صریح و بررسی دقیق تغییرات.",
    excerptEn:
      "Delegating to an agent without losing control is possible — know the state of your project, split the work into small steps, set explicit constraints and review every change carefully.",
    category: "Workflow",
    level: "متوسط تا پیشرفته",
    date: "۳۰ بهمن ۱۴۰۴",
    dateISO: "2026-02-19",
    readingTime: "۸ دقیقه مطالعه",
    tags: ["Workflow", "AI Agents", "Git", "Best Practices"],
    content: `
استفاده از Agent برای تغییر پروژه می‌تواند بسیار سریع باشد، اما یک اشتباه کوچک در تعریف وظیفه ممکن است باعث تغییر فایل‌های نامرتبط یا خراب شدن قابلیت‌های قبلی شود.

## ۱. قبل از شروع، وضعیت پروژه را بشناسید

پیش از هر تغییر مهم:

- ساختار پوشه‌ها را بررسی کنید.
- وضعیت Git را ببینید.
- فایل‌های مرتبط را مشخص کنید.
- هدف دقیق را بنویسید.
- محدودیت‌های پروژه را تعیین کنید.

## ۲. وظیفه را به مراحل کوچک تقسیم کنید

- تحلیل قابلیت فعلی
- طراحی راه‌حل
- تغییر Backend
- تغییر رابط کاربری
- تست
- بررسی نهایی

## ۳. محدودیت‌های صریح بنویسید

\`\`\`text
Preserve all unrelated functionality.
Do not change the visual design.
Do not remove existing routes.
Do not modify the database schema unless required.
Do not rewrite entire files for a small fix.
\`\`\`

## ۴. تغییرات را بررسی کنید

بعد از اجرای Agent فقط به جمله «Done» اعتماد نکنید.

بررسی کنید:

- چه فایل‌هایی تغییر کرده‌اند؟
- آیا فایل جدیدی ایجاد شده؟
- آیا وابستگی جدیدی اضافه شده؟
- آیا تست اجرا شده؟
- آیا رفتار مورد انتظار درست است؟

## ۵. اهمیت Git

Git امکان بررسی تفاوت‌ها و بازگشت به وضعیت قبلی را فراهم می‌کند.

## جمع‌بندی

یک Agent زمانی بیشترین ارزش را دارد که در یک فرایند کنترل‌شده فعالیت کند. وظیفه کوچک، محدودیت روشن، بررسی تغییرات و تست، چهار اصل مهم همکاری حرفه‌ای با Agent هستند.
`,
  },
  {
    slug: "clean-frontend-architecture",
    title: "معماری تمیز در پروژه‌های فرانت‌اند؛ از فایل‌های شلوغ تا ساختار قابل نگهداری",
    titleEn: "Clean Frontend Architecture: From Crowded Files to a Maintainable Structure",
    excerpt:
      "از فایل‌های شلوغ تا ساختاری قابل نگهداری؛ تفکیک مسئولیت‌ها، مفهوم Component، جداسازی منطق و پرهیز از پیچیدگی غیرضروری در پروژه‌های فرانت‌اند.",
    excerptEn:
      "From crowded files to a maintainable structure — separating responsibilities, the component mindset, isolating logic and avoiding needless complexity in frontend projects.",
    category: "Frontend",
    level: "متوسط",
    date: "۱۶ بهمن ۱۴۰۴",
    dateISO: "2026-02-05",
    readingTime: "۸ دقیقه مطالعه",
    tags: ["Frontend", "Architecture", "Component", "JavaScript"],
    content: `
در ابتدای ساخت یک سایت، قرار دادن همه کدها در یک فایل ممکن است سریع و ساده باشد. اما وقتی پروژه بزرگ‌تر می‌شود، پیدا کردن یک تابع، اصلاح یک بخش یا جلوگیری از خراب شدن قابلیت‌های دیگر دشوارتر خواهد شد.

معماری فرانت‌اند یعنی کد را به شکلی سازمان‌دهی کنیم که توسعه، تست و نگهداری آن آسان‌تر باشد.

## ۱. تفکیک مسئولیت‌ها

یک ساختار نمونه:

\`\`\`text
frontend/
├── components/
├── pages/
├── services/
├── utils/
├── styles/
└── main.js
\`\`\`

## ۲. Component چیست؟

کامپوننت بخشی مستقل از رابط کاربری است که می‌تواند دوباره استفاده شود؛ مانند:

- دکمه
- کارت مقاله
- نوار ناوبری
- فرم ورود
- پنجره اعلان

## ۳. چرا جداسازی منطق مهم است؟

\`\`\`text
UI
 ↓
Event Handler
 ↓
Validation
 ↓
API Service
 ↓
Response Handling
\`\`\`

## ۴. Vanilla JavaScript هم به معماری نیاز دارد

برای داشتن ساختار خوب، حتماً به React یا Framework خاصی نیاز نیست.

## ۵. از پیچیدگی غیرضروری دوری کنید

معماری تمیز به معنی ساختن ده‌ها پوشه برای یک پروژه کوچک نیست.

## جمع‌بندی

پروژه فرانت‌اند خوب فقط ظاهر زیبا ندارد. ساختار داخلی آن نیز باید قابل فهم، قابل توسعه و قابل نگهداری باشد.
`,
  },
  {
    slug: "how-javascript-runs-in-browser",
    title: "JavaScript در مرورگر دقیقاً چگونه اجرا می‌شود؟",
    titleEn: "How Exactly Does JavaScript Run in the Browser?",
    excerpt:
      "Call Stack، Promise و Event Loop چگونه کار می‌کنند؟ درک نحوه‌ی اجرای JavaScript در مرورگر برای طراحی برنامه‌های تعاملی و غیرهم‌زمان بهتر.",
    excerptEn:
      "How do the call stack, promises and the event loop work? Understanding JavaScript execution in the browser is the key to better interactive and asynchronous programs.",
    category: "JavaScript",
    level: "متوسط تا پیشرفته",
    date: "۲ بهمن ۱۴۰۴",
    dateISO: "2026-01-22",
    readingTime: "۹ دقیقه مطالعه",
    tags: ["JavaScript", "Event Loop", "Async", "Browser"],
    content: `
درک نحوه اجرای JavaScript، Call Stack، Promise و Event Loop باعث می‌شود برنامه‌های تعاملی و Asynchronous را بهتر طراحی کنیم.

## ۱. JavaScript و اجرای کد

مرورگر برای اجرای JavaScript از موتورهای مخصوص استفاده می‌کند و محیط مرورگر امکاناتی مانند DOM، Timerها و درخواست‌های شبکه را در اختیار برنامه قرار می‌دهد.

## ۲. Call Stack چیست؟

Call Stack ساختاری است که اجرای توابع فعال را مدیریت می‌کند.

\`\`\`javascript
function greet() {
  console.log("Hello");
}

greet();
\`\`\`

## ۳. Promise و کارهای غیرهم‌زمان

مثلاً:

\`\`\`javascript
console.log("Start");

setTimeout(() => {
  console.log("Timer");
}, 0);

console.log("End");
\`\`\`

خروجی معمولاً:

\`\`\`text
Start
End
Timer
\`\`\`

صفر بودن زمان Timer به معنی اجرای فوری آن نیست.

## ۴. Event Loop

Event Loop هماهنگی میان اجرای کد، Stack و صف‌های وظایف را بر عهده دارد.

## ۵. چرا این موضوع در سایت مهم است؟

اجرای طولانی JavaScript می‌تواند باعث تأخیر در کلیک‌ها، اسکرول و انیمیشن‌ها شود.

## جمع‌بندی

آشنایی با Call Stack، Event Loop و عملیات غیرهم‌زمان به برنامه‌نویس کمک می‌کند رفتار برنامه را بهتر پیش‌بینی کند.
`,
  },
  {
    slug: "why-is-website-slow",
    title: "چرا سایت کند است؟ راهنمای عمیق بهینه‌سازی عملکرد وب",
    titleEn: "Why Is the Website Slow? A Deep Guide to Web Performance",
    excerpt:
      "تصاویر سنگین، JavaScript اضافه، فونت‌های متعدد و مشکلات سرور؛ راهنمای یافتن علت کندی سایت و بهینه‌سازی بر اساس Core Web Vitals.",
    excerptEn:
      "Heavy images, extra JavaScript, too many fonts and server problems — how to find the real cause of a slow site and optimize against Core Web Vitals.",
    category: "Performance",
    level: "متوسط",
    date: "۱۸ دی ۱۴۰۴",
    dateISO: "2026-01-08",
    readingTime: "۸ دقیقه مطالعه",
    tags: ["Performance", "Core Web Vitals", "بهینه‌سازی", "Frontend"],
    content: `
کاربر انتظار دارد یک سایت سریع باز شود، دکمه‌ها بدون تأخیر کار کنند و محتوای اصلی به‌موقع نمایش داده شود.

## ۱. منابع سنگین

تصاویر بزرگ، فونت‌های متعدد و فایل‌های JavaScript غیرضروری می‌توانند زمان بارگذاری را افزایش دهند.

## ۲. JavaScript بیش از حد

راهکارها:

- حذف کدهای غیرضروری
- تقسیم کدها
- کاهش محاسبات تکراری
- استفاده مناسب از Event Delegation
- بهینه‌سازی DOM

## ۳. فونت‌ها

فونت‌های سفارشی ظاهر سایت را بهتر می‌کنند، اما تعداد زیاد فایل‌ها و وزن‌های غیرضروری می‌تواند بر بارگذاری اثر بگذارد.

## ۴. Core Web Vitals

سه معیار مهم:

- LCP
- INP
- CLS

## ۵. چگونه مشکل را پیدا کنیم؟

ابتدا عملکرد را اندازه‌گیری کنید و سپس مشخص کنید مشکل از شبکه، منابع، JavaScript، سرور یا Database است.

## جمع‌بندی

سرعت سایت حاصل همکاری فرانت‌اند، Backend، شبکه، تصاویر، فونت‌ها و معماری است.
`,
  },
  {
    slug: "web-accessibility-for-everyone",
    title: "دسترسی‌پذیری وب؛ چگونه سایتی بسازیم که همه بتوانند از آن استفاده کنند؟",
    titleEn: "Web Accessibility: How to Build a Site Everyone Can Use",
    excerpt:
      "سایت خوب برای همه قابل استفاده است؛ از HTML معنایی و دسترسی با صفحه‌کلید تا فرم‌های قابل فهم، کنتراست رنگ و تست دسترسی‌پذیری.",
    excerptEn:
      "A good site works for everyone — semantic HTML and keyboard access, understandable forms, color contrast and accessibility testing.",
    category: "Accessibility",
    level: "متوسط",
    date: "۴ دی ۱۴۰۴",
    dateISO: "2025-12-25",
    readingTime: "۸ دقیقه مطالعه",
    tags: ["Accessibility", "HTML", "UX", "استانداردهای وب"],
    content: `
یک سایت خوب نباید فقط برای کاربری طراحی شود که با ماوس، صفحه‌نمایش بزرگ و شرایط ایده‌آل از آن استفاده می‌کند.

## ۱. HTML معنایی

استفاده از عناصر مناسب HTML به مرورگر و فناوری‌های کمکی کمک می‌کند ساختار صفحه را بهتر درک کنند.

## ۲. دسترسی با صفحه‌کلید

تمام کنترل‌های مهم باید با صفحه‌کلید قابل دسترسی باشند.

## ۳. فرم‌های قابل فهم

هر ورودی باید برچسب مشخص داشته باشد و خطاهای فرم واضح نمایش داده شوند.

## ۴. رنگ و کنتراست

رنگ نباید تنها راه انتقال اطلاعات باشد.

## ۵. تست دسترسی‌پذیری

سایت را با صفحه‌کلید، اندازه‌های مختلف صفحه و ابزارهای بررسی دسترسی‌پذیری آزمایش کنید.

## جمع‌بندی

دسترسی‌پذیری بخشی از کیفیت واقعی سایت است.
`,
  },
  {
    slug: "frontend-security-secrets",
    title: "امنیت فرانت‌اند؛ چه اطلاعاتی را نباید هرگز به مرورگر بسپاریم؟",
    titleEn: "Frontend Security: What Should Never Be Trusted to the Browser",
    excerpt:
      "مرورگر مرز اعتماد نیست؛ چرا Secretها، تصمیم‌های امنیتی و اعتبارسنجی هرگز نباید فقط به فرانت‌اند سپرده شوند و XSS چگونه شکل می‌گیرد.",
    excerptEn:
      "The browser is not a trust boundary — why secrets, security decisions and validation must never live only in the frontend, and how XSS takes shape.",
    category: "امنیت وب",
    level: "متوسط تا پیشرفته",
    date: "۲۰ آذر ۱۴۰۴",
    dateISO: "2025-12-11",
    readingTime: "۸ دقیقه مطالعه",
    tags: ["امنیت وب", "XSS", "Security", "Frontend"],
    content: `
مرورگر محیطی است که کد فرانت‌اند در آن اجرا می‌شود. بنابراین نباید اطلاعات محرمانه یا تصمیم‌های امنیتی مهم را صرفاً به رابط کاربری بسپاریم.

## ۱. Secret چیست؟

Secret اطلاعاتی مانند کلید خصوصی، رمز عبور سرویس، Token حساس یا اطلاعات دسترسی است.

\`\`\`text
Frontend code ≠ Secure secret storage
\`\`\`

## ۲. مخفی کردن دکمه امنیت نیست

مخفی کردن دکمه پنل مدیریت فقط تجربه کاربری را کنترل می‌کند و جلوی درخواست مستقیم به API را نمی‌گیرد.

Backend باید هویت و مجوز را بررسی کند.

## ۳. XSS چیست؟

Cross-Site Scripting یا XSS زمانی رخ می‌دهد که داده کنترل‌نشده به شکلی ناامن در صفحه اجرا شود.

## ۴. اعتبارسنجی سمت کاربر کافی نیست

Backend باید داده‌ها را دوباره بررسی کند.

## ۵. توکن‌ها و نشست‌ها

روش ذخیره و مدیریت توکن باید بر اساس معماری و مدل تهدید پروژه انتخاب شود.

## جمع‌بندی

فرانت‌اند بخشی مهم از امنیت است، اما مرز اعتماد نیست.
`,
  },
  {
    slug: "rest-api-design",
    title: "REST API چیست و چگونه یک API حرفه‌ای طراحی کنیم؟",
    titleEn: "What Is a REST API and How Do You Design One Professionally?",
    excerpt:
      "از متدهای HTTP و Status Codeها تا ساختار پاسخ منظم و صفحه‌بندی؛ اصول طراحی یک REST API حرفه‌ای با قرارداد مشخص.",
    excerptEn:
      "From HTTP methods and status codes to clean response structure and pagination — the principles of designing a professional REST API with a clear contract.",
    category: "Backend",
    level: "متوسط",
    date: "۶ آذر ۱۴۰۴",
    dateISO: "2025-11-27",
    readingTime: "۸ دقیقه مطالعه",
    tags: ["Backend", "REST", "API", "HTTP"],
    content: `
API پل ارتباطی میان بخش‌های مختلف نرم‌افزار است و REST یکی از سبک‌های رایج برای طراحی APIهای وب است.

## ۱. API چیست؟

API قراردادی برای ارتباط میان نرم‌افزارهاست.

مثلاً:

\`GET /api/articles\`

## ۲. متدهای HTTP

| Method | کاربرد        |
| ------ | ------------- |
| GET    | دریافت داده   |
| POST   | ایجاد داده    |
| PUT    | جایگزینی کامل |
| PATCH  | تغییر بخشی    |
| DELETE | حذف           |

## ۳. Status Codeها

نمونه‌ها:

\`200 OK\`

\`201 Created\`

\`400 Bad Request\`

\`401 Unauthorized\`

\`403 Forbidden\`

\`404 Not Found\`

\`500 Internal Server Error\`

## ۴. طراحی پاسخ منظم

\`\`\`json
{
  "data": {
    "id": 12,
    "title": "Learning APIs"
  },
  "error": null
}
\`\`\`

## ۵. Pagination

برای مجموعه‌های بزرگ بهتر است داده‌ها صفحه‌بندی شوند.

\`\`\`text
GET /api/articles?page=2&limit=20
\`\`\`

## جمع‌بندی

API خوب باید قرارداد مشخص، Status Code مناسب، ساختار پاسخ منظم، اعتبارسنجی و کنترل دسترسی داشته باشد.
`,
  },
  {
    slug: "sql-vs-nosql",
    title: "SQL یا NoSQL؛ کدام پایگاه داده برای پروژه ما مناسب‌تر است؟",
    titleEn: "SQL or NoSQL: Which Database Fits Your Project?",
    excerpt:
      "پایگاه داده رابطه‌ای یا NoSQL؟ معیارهای انتخاب مانند روابط داده‌ها، تراکنش‌ها، شکل داده‌ها و مقیاس‌پذیری را مرور می‌کنیم تا انتخاب آگاهانه‌تری داشته باشید.",
    excerptEn:
      "Relational or NoSQL? We review the selection criteria — data relationships, transactions, data shape and scalability — so you can make a more informed choice.",
    category: "Database",
    level: "متوسط",
    date: "۲۲ آبان ۱۴۰۴",
    dateISO: "2025-11-13",
    readingTime: "۸ دقیقه مطالعه",
    tags: ["Database", "SQL", "NoSQL", "Backend"],
    content: `
پایگاه داده یکی از مهم‌ترین بخش‌های هر نرم‌افزار واقعی است.

## ۱. پایگاه داده رابطه‌ای

داده‌ها معمولاً در جدول‌هایی با ستون و ردیف ذخیره می‌شوند.

مثلاً:

\`\`\`text
Students
Teachers
Classes
Lessons
Grades
\`\`\`

## ۲. SQL چیست؟

SQL زبان رایج برای کار با بسیاری از پایگاه‌های داده رابطه‌ای است.

\`\`\`sql
SELECT name
FROM students
WHERE class_id = 8;
\`\`\`

## ۳. NoSQL چیست؟

NoSQL به خانواده‌ای از پایگاه‌های داده اشاره دارد که الزاماً از مدل جدولی رابطه‌ای استفاده نمی‌کنند.

## ۴. معیار انتخاب

- روابط میان داده‌ها
- نیاز به تراکنش
- شکل داده‌ها
- حجم و الگوی دسترسی
- امکانات تیم
- هزینه نگهداری
- نیازهای مقیاس‌پذیری

## ۵. آیا SQL قدیمی شده است؟

خیر. پایگاه‌های داده رابطه‌ای همچنان برای بسیاری از سیستم‌های مالی، آموزشی، مدیریتی و تجاری انتخاب مناسبی هستند.

## جمع‌بندی

هیچ پایگاه داده‌ای برای همه پروژه‌ها بهترین نیست.
`,
  },
  {
    slug: "database-index-explained",
    title: "Database Index چیست و چرا می‌تواند جست‌وجو را سریع‌تر کند؟",
    titleEn: "What Is a Database Index and Why Can It Make Searches Faster?",
    excerpt:
      "Index مانند فهرست کتاب جست‌وجو را سریع می‌کند، اما همیشه هم خوب نیست؛ با ساختار Index، هزینه‌های آن و خواندن Query Plan آشنا می‌شویم.",
    excerptEn:
      "An index speeds up lookups like a book's table of contents — but it isn't always good. We look at how indexes work, what they cost, and how to read a query plan.",
    category: "Database Performance",
    level: "متوسط تا پیشرفته",
    date: "۸ آبان ۱۴۰۴",
    dateISO: "2025-10-30",
    readingTime: "۷ دقیقه مطالعه",
    tags: ["Database", "Index", "Performance", "SQL"],
    content: `
فرض کنید یک جدول شامل میلیون‌ها رکورد داریم و می‌خواهیم کاربری را بر اساس ایمیل پیدا کنیم. Index یکی از ابزارهای مهم برای بهبود عملکرد جست‌وجو است.

## ۱. Index چگونه کار می‌کند؟

Index ساختاری کمکی است که پایگاه داده می‌تواند برای پیدا کردن رکوردها از آن استفاده کند.

ایده اصلی شبیه فهرست یک کتاب است.

## ۲. مثال

\`\`\`sql
SELECT *
FROM users
WHERE email = 'user@example.com';
\`\`\`

Index مناسب روی \`email\` می‌تواند برای چنین جست‌وجویی مفید باشد.

## ۳. Index همیشه خوب نیست

Indexها:

- فضای ذخیره‌سازی مصرف می‌کنند.
- ممکن است درج داده را کندتر کنند.
- هنگام تغییر رکوردها باید به‌روزرسانی شوند.
- می‌توانند پیچیدگی اضافه کنند.

## ۴. Query Plan

با بررسی Query Plan می‌توان فهمید پایگاه داده چگونه Query را اجرا می‌کند.

## ۵. اشتباه رایج

ایجاد Index روی تمام ستون‌ها روش مناسبی نیست.

## جمع‌بندی

Index باید هدفمند و بر اساس Queryهای واقعی استفاده شود.
`,
  },
  {
    slug: "modern-web-authentication",
    title: "احراز هویت مدرن در وب؛ Session، JWT و Refresh Token",
    titleEn: "Modern Web Authentication: Sessions, JWT and Refresh Tokens",
    excerpt:
      "Authentication و Authorization چه تفاوتی دارند؟ مروری بر مدل Session، ساختار JWT، نقش Refresh Token و نکات امنیتی احراز هویت مدرن.",
    excerptEn:
      "What is the difference between authentication and authorization? A review of the session model, JWT structure, the role of refresh tokens and modern auth security notes.",
    category: "Authentication",
    level: "متوسط تا پیشرفته",
    date: "۲۴ مهر ۱۴۰۴",
    dateISO: "2025-10-16",
    readingTime: "۹ دقیقه مطالعه",
    tags: ["Authentication", "JWT", "Session", "Security"],
    content: `
بسیاری از سایت‌ها باید بدانند کاربر چه کسی است و چه اجازه‌هایی دارد.

## ۱. Authentication و Authorization

Authentication یعنی تشخیص هویت کاربر.

Authorization یعنی بررسی اینکه کاربر چه اجازه‌ای دارد.

## ۲. Session چیست؟

در مدل Session، سرور اطلاعات نشست کاربر را مدیریت می‌کند و مرورگر معمولاً یک شناسه نشست دریافت می‌کند.

## ۳. JWT چیست؟

JWT قالبی برای انتقال اطلاعات قابل اعتبارسنجی است. محتوای معمول JWT رمزنگاری‌شده و محرمانه نیست و امضای آن برای تشخیص تغییر غیرمجاز استفاده می‌شود.

پس نباید اطلاعات حساس را داخل JWT قرار داد.

## ۴. Refresh Token

در برخی معماری‌ها، Access Token کوتاه‌عمر است و Refresh Token برای دریافت Access Token جدید استفاده می‌شود.

## ۵. نکات امنیتی

- رمز عبور را با Hash امن ذخیره کنید.
- برای نشست‌ها انقضا در نظر بگیرید.
- مجوزها را در Backend بررسی کنید.
- Tokenها را از دسترسی JavaScript غیرقابل اعتماد محافظت کنید.
- در برابر CSRF و سرقت نشست تدابیر مناسب اتخاذ کنید.

## جمع‌بندی

Session و JWT ابزارهایی برای طراحی احراز هویت هستند، نه راه‌حل جادویی امنیت.
`,
  },
  {
    slug: "secure-file-upload",
    title: "چگونه یک سیستم آپلود فایل امن بسازیم؟",
    titleEn: "How Do You Build a Secure File Upload System?",
    excerpt:
      "آپلود فایل یکی از حساس‌ترین قابلیت‌های وب است؛ از محدودیت اندازه و بررسی نوع واقعی فایل تا نام‌گذاری امن، کنترل دسترسی و ثبت رخدادها.",
    excerptEn:
      "File upload is one of the most sensitive features on the web — from size limits and real file-type checks to safe naming, access control and event logging.",
    category: "Flask و امنیت",
    level: "متوسط تا پیشرفته",
    date: "۱۰ مهر ۱۴۰۴",
    dateISO: "2025-10-02",
    readingTime: "۸ دقیقه مطالعه",
    tags: ["Flask", "امنیت وب", "Backend", "File Upload"],
    content: `
آپلود فایل در سایت‌هایی مانند سامانه‌های آموزشی، وبلاگ‌ها و پنل‌های مدیریتی قابلیت مهمی است.

## ۱. چرا آپلود فایل خطرناک است؟

فایل ممکن است:

- حجم بسیار زیادی داشته باشد.
- نوع واقعی آن با پسوند متفاوت باشد.
- نام خطرناک داشته باشد.
- حاوی محتوای مخرب باشد.
- باعث مصرف بیش از حد منابع شود.

## ۲. محدودیت اندازه

سرور باید حداکثر اندازه فایل را تعیین کند.

## ۳. نام فایل

نباید نام فایل کاربر مستقیماً به‌عنوان مسیر ذخیره‌سازی استفاده شود.

## ۴. نوع فایل

پسوند به‌تنهایی معیار مطمئنی برای نوع فایل نیست.

## ۵. کنترل دسترسی

فایل خصوصی نباید فقط با دانستن URL قابل دسترسی باشد.

## ۶. ثبت خطا و نظارت

آپلودهای ناموفق و فایل‌های ردشده باید به شکل مناسب ثبت شوند.

## جمع‌بندی

سیستم آپلود فایل امن ترکیبی از اعتبارسنجی، محدودیت منابع، ذخیره‌سازی مناسب و کنترل دسترسی است.
`,
  },
  {
    slug: "testing-unit-integration-e2e",
    title: "تست‌نویسی از صفر؛ Unit، Integration و End-to-End چه تفاوتی دارند؟",
    titleEn: "Testing from Scratch: How Unit, Integration and End-to-End Tests Differ",
    excerpt:
      "Unit، Integration و End-to-End چه تفاوتی دارند و هر کدام چه چیزی را بررسی می‌کنند؟ ویژگی‌های تست خوب و اهمیت بیشتر تست در دوران تولید کد با AI.",
    excerptEn:
      "What separates unit, integration and end-to-end tests, and what does each one actually verify? The traits of good tests — and why they matter even more in the AI era.",
    category: "Testing",
    level: "متوسط",
    date: "۲۷ شهریور ۱۴۰۴",
    dateISO: "2025-09-18",
    readingTime: "۸ دقیقه مطالعه",
    tags: ["Testing", "Unit Test", "Integration", "E2E"],
    content: `
تست‌نویسی یکی از راه‌های مهم اطمینان از رفتار نرم‌افزار است.

## ۱. Unit Test

Unit Test یک واحد کوچک از منطق برنامه را بررسی می‌کند.

\`\`\`python
def add(a, b):
    return a + b
\`\`\`

## ۲. Integration Test

در تست یکپارچه، چند بخش با هم بررسی می‌شوند:

\`\`\`text
Request
  ↓
Route
  ↓
Database
  ↓
Response
\`\`\`

## ۳. End-to-End Test

یک مسیر کامل کاربر را بررسی می‌کند:

\`\`\`text
Open website
   ↓
Login
   ↓
Open dashboard
   ↓
Create article
   ↓
Verify article
\`\`\`

## ۴. تست خوب چه ویژگی دارد؟

- قابل تکرار
- نتیجه مشخص
- مستقل از شرایط تصادفی
- بررسی رفتار مهم
- خطای قابل تشخیص

## ۵. تست و AI

وقتی AI کد تولید می‌کند، تست اهمیت بیشتری پیدا می‌کند.

## جمع‌بندی

Unit، Integration و End-to-End جایگزین یکدیگر نیستند و می‌توانند در کنار هم پوشش مناسبی ایجاد کنند.
`,
  },
  {
    slug: "what-is-docker",
    title: "Docker چیست و چرا توسعه‌دهنده باید کانتینرها را بشناسد؟",
    titleEn: "What Is Docker and Why Should Developers Know Containers?",
    excerpt:
      "Image و Container چه تفاوتی دارند؟ چرا Docker محیط‌های توسعه را یکدست می‌کند و Dockerfile چگونه این فرایند را توصیف می‌کند.",
    excerptEn:
      "How do images differ from containers? Why Docker makes development environments consistent, and how a Dockerfile describes the whole process.",
    category: "DevOps",
    level: "متوسط",
    date: "۱۳ شهریور ۱۴۰۴",
    dateISO: "2025-09-04",
    readingTime: "۸ دقیقه مطالعه",
    tags: ["DevOps", "Docker", "Container", "Deployment"],
    content: `
Docker راهی برای بسته‌بندی برنامه و وابستگی‌های آن در محیط‌های قابل تکرار فراهم می‌کند.

## ۱. Image و Container

Image یک الگوی بسته‌بندی‌شده برای اجرای برنامه است.

Container نمونه‌ای در حال اجرا از یک Image است.

## ۲. چرا مفید است؟

Docker می‌تواند اختلاف محیط‌های توسعه را کاهش دهد.

## ۳. Dockerfile

نمونه:

\`\`\`dockerfile
FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

CMD ["python", "app.py"]
\`\`\`

## ۴. Container جایگزین کامل ماشین مجازی نیست

کانتینرها معمولاً سبک‌تر از ماشین مجازی هستند، اما مدل ایزوله‌سازی آن‌ها یکسان نیست.

## ۵. کاربرد در پروژه واقعی

Docker می‌تواند برای Backend، Database، سرویس‌های کمکی، تست و CI/CD استفاده شود.

## جمع‌بندی

Docker ابزاری برای ساخت محیط‌های قابل تکرار و بسته‌بندی نرم‌افزار است.
`,
  },
  {
    slug: "what-is-ci-cd",
    title: "CI/CD چیست و چگونه انتشار نرم‌افزار را خودکار کنیم؟",
    titleEn: "What Is CI/CD and How Do You Automate Software Releases?",
    excerpt:
      "از Continuous Integration تا Continuous Deployment؛ ساختار یک Pipeline نمونه، فایده‌های CI/CD و نکات مهم مدیریت Secretها و مجوزها.",
    excerptEn:
      "From continuous integration to continuous deployment — the anatomy of a sample pipeline, the benefits of CI/CD, and the key rules for handling secrets and permissions.",
    category: "DevOps",
    level: "متوسط",
    date: "۳۰ مرداد ۱۴۰۴",
    dateISO: "2025-08-21",
    readingTime: "۸ دقیقه مطالعه",
    tags: ["DevOps", "CI/CD", "Automation", "Deployment"],
    content: `
CI/CD برای خودکارسازی بخش‌هایی از فرایند ساخت، تست و تحویل نرم‌افزار استفاده می‌شود.

## ۱. Continuous Integration

Pipeline می‌تواند:

- کد را دریافت کند.
- وابستگی‌ها را نصب کند.
- تست‌ها را اجرا کند.
- خطاهای ساخت را گزارش دهد.

## ۲. Continuous Delivery و Deployment

Continuous Delivery نرم‌افزار را برای انتشار آماده می‌کند.

Continuous Deployment می‌تواند انتشار نسخه‌های تأییدشده را خودکار کند.

## ۳. Pipeline نمونه

\`\`\`text
Push to Git
    ↓
Install dependencies
    ↓
Run tests
    ↓
Build
    ↓
Security checks
    ↓
Deploy
\`\`\`

## ۴. چرا مهم است؟

CI/CD می‌تواند خطاها را زودتر آشکار کند و فرایند انتشار را قابل پیش‌بینی‌تر کند.

## ۵. نکات مهم

Secretها باید به‌درستی مدیریت شوند و مجوزهای Pipeline بیش از نیاز گسترده نباشند.

## جمع‌بندی

CI/CD فقط اجرای خودکار چند فرمان نیست؛ یک فرایند مهندسی برای افزایش قابلیت اطمینان در تحویل نرم‌افزار است.
`,
  },
  {
    slug: "professional-open-source-on-github",
    title: "چگونه یک پروژه متن‌باز حرفه‌ای در GitHub بسازیم؟",
    titleEn: "How to Build a Professional Open-Source Project on GitHub",
    excerpt:
      "قرار دادن کد در GitHub به‌تنهایی کافی نیست؛ README خوب، ساختار مرتب Repository، Issue و Pull Request، مجوز و امنیت Repository را مرور می‌کنیم.",
    excerptEn:
      "Putting code on GitHub alone is not enough — we review a good README, a tidy repository structure, issues and pull requests, licensing and repository security.",
    category: "Git و GitHub",
    level: "متوسط",
    date: "۱۶ مرداد ۱۴۰۴",
    dateISO: "2025-08-07",
    readingTime: "۸ دقیقه مطالعه",
    tags: ["Git", "GitHub", "متن‌باز", "Docs"],
    content: `
قرار دادن کد در GitHub به‌تنهایی یک پروژه متن‌باز حرفه‌ای ایجاد نمی‌کند.

## ۱. README خوب

README باید پاسخ دهد:

- پروژه چیست؟
- چه مشکلی را حل می‌کند؟
- چگونه نصب می‌شود؟
- چگونه اجرا می‌شود؟
- چه امکاناتی دارد؟
- چگونه می‌توان مشارکت کرد؟

## ۲. ساختار Repository

\`\`\`text
project/
├── README.md
├── LICENSE
├── .gitignore
├── docs/
├── src/
├── tests/
└── requirements.txt
\`\`\`

## ۳. Issue و Pull Request

Issue برای ثبت مشکل، پیشنهاد یا وظیفه استفاده می‌شود.

Pull Request برای پیشنهاد تغییرات و بررسی آن‌ها پیش از ادغام در Branch اصلی است.

## ۴. مجوز نرم‌افزار

مجوز مشخص می‌کند دیگران چه حقوقی برای استفاده، تغییر یا توزیع نرم‌افزار دارند.

## ۵. امنیت Repository

اطلاعات محرمانه مانند API Key و Password نباید در Repository قرار بگیرند.

## ۶. پروژه شخصی و رزومه

یک Repository مرتب می‌تواند مهارت‌های برنامه‌نویس را بهتر نشان دهد.

## جمع‌بندی

پروژه متن‌باز حرفه‌ای ترکیبی از کد خوب، مستندات مناسب، تاریخچه قابل فهم و فرایند همکاری مشخص است.
`,
  },
  {
    slug: "from-personal-project-to-production",
    title: "از پروژه شخصی تا محصول واقعی؛ چه چیزهایی قبل از انتشار مهم‌اند؟",
    titleEn: "From Personal Project to Real Product: What Matters Before Release",
    excerpt:
      "انتشار محصول، شروع مرحله‌ی جدید توسعه است؛ چک‌لیست امنیت، پشتیبان‌گیری، عملکرد، تجربه کاربر و مستندات پیش از عرضه‌ی واقعی پروژه.",
    excerptEn:
      "Shipping starts a new phase of development — a pre-launch checklist covering security, backups, performance, user experience and documentation.",
    category: "Full Stack",
    level: "متوسط تا پیشرفته",
    date: "۲ مرداد ۱۴۰۴",
    dateISO: "2025-07-24",
    readingTime: "۹ دقیقه مطالعه",
    tags: ["Full Stack", "Release", "امنیت", "چک‌لیست"],
    content: `
ساخت یک پروژه در کامپیوتر شخصی با ارائه آن به کاربران واقعی تفاوت زیادی دارد.

## ۱. امنیت

قبل از انتشار باید موارد زیر بررسی شوند:

- احراز هویت
- مجوزها
- مدیریت Secretها
- اعتبارسنجی ورودی‌ها
- تنظیمات امنیتی سرور
- کنترل دسترسی فایل‌ها
- مدیریت خطاها
- وابستگی‌های آسیب‌پذیر

## ۲. پشتیبان‌گیری

فقط داشتن Backup کافی نیست؛ امکان بازیابی آن نیز باید آزمایش شود.

## ۳. مدیریت خطا و Logging

کاربر نباید با Stack Trace یا جزئیات حساس داخلی روبه‌رو شود.

## ۴. عملکرد و مقیاس‌پذیری

موارد مهم:

- زمان پاسخ API
- مصرف حافظه
- ظرفیت Database
- محدودیت درخواست‌ها
- اندازه فایل‌ها
- Cache
- منابع استاتیک

## ۵. تجربه کاربر

مسیرهای اصلی کاربر باید بررسی شوند:

- ورود و خروج
- نمایش خطا
- بازیابی اطلاعات
- موبایل
- دسترسی‌پذیری
- Loading
- Empty states
- پشتیبانی

## ۶. مستندات

مستندات باید نصب، اجرا، پیکربندی و نگهداری محصول را توضیح دهند.

## ۷. چک‌لیست پیش از انتشار

\`\`\`text
☐ احراز هویت و مجوزها بررسی شده‌اند
☐ تست‌های اصلی اجرا شده‌اند
☐ پشتیبان‌گیری و بازیابی آزمایش شده است
☐ اطلاعات محرمانه در کد قرار ندارند
☐ خطاها و Logها بررسی شده‌اند
☐ عملکرد و مصرف منابع ارزیابی شده است
☐ رابط کاربری در اندازه‌های مختلف بررسی شده است
☐ راهنمای نصب و استفاده آماده است
\`\`\`

## جمع‌بندی

انتشار محصول پایان برنامه‌نویسی نیست؛ شروع مرحله‌ای جدید از توسعه است. نرم‌افزار واقعی باید قابل اعتماد، قابل نگهداری، امن و آماده پاسخ‌گویی به نیازهای کاربران باشد.
`,
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

/* ------------------------------------------------------------------ */
/* رزومه                                                              */
/* ------------------------------------------------------------------ */

export const resumeSummary =
  "دانش‌آموز ۱۴ ساله‌ی پایه نهم از خمینی‌شهر اصفهان و توسعه‌دهنده‌ی فول‌استک خودآموخته. برنامه‌نویسی را از ۱۳ سالگی با پایتون شروع کردم و امروز با React و Next.js محصول‌هایی می‌سازم که در مدرسه و زندگی واقعی استفاده می‌شوند. علاقه‌مند به متن‌باز، معماری تمیز و یاد دادن به هم‌سن‌وسال‌ها.";

export const resumeSummaryEn =
  "A 14-year-old 9th-grade student from Khomeinishahr, Isfahan, and a self-taught full-stack developer. I started programming with Python at 13 and today I build products with React and Next.js that are actually used at school and in real life. Interested in open source, clean architecture and teaching people my own age.";

export const resumeLanguages = [
  { name: "فارسی", nameEn: "Persian", level: "زبان مادری (۱۰۰٪)", levelEn: "Native (100%)" },
  { name: "انگلیسی", nameEn: "English", level: "خوب (۷۵٪)", levelEn: "Good (75%)" },
  { name: "عربی", nameEn: "Arabic", level: "مقدماتی (۲۵٪)", levelEn: "Beginner (25%)" },
];

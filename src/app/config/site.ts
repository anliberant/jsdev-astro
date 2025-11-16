export const siteConfig = {
  title: `JavaScript Development Space - Master JS and NodeJS`,
  shortTitle: `JavaScript Development Space`,
  siteUrl: `https://jsdev.space`,
  twitterUsername: `@jsdevspace`,
  image: '/images/icon.png',
  description: `Explore the world of JavaScript at our blog, your ultimate resource for guides, tutorials, and articles. Uncover the latest insights, tips, and trends.`,
  navigation: [
    {
      name: 'Howtos',
      path: '/howto/',
    },
    {
      name: 'Snippets',
      path: '/snippets/',
    },
    {
      name: 'Friday',
      path: '/friday/',
    },
  ],
  footerLinks: [
    {
      name: 'Categories',
      path: '/categories/',
    },
    {
      name: 'Tags',
      path: '/tags/',
    },
    {
      name: 'Contact',
      path: '/contact/',
    },
  ],
  social: {
    github: 'https://github.com/jsdevspace',
    facebook: 'https://www.facebook.com/jsdevspace',
    twitter: 'https://x.com/jsdevspace',
    mastodon: 'https://mastodon.social/@jsdevspace',
    telegram: 'https://t.me/jsdevspace',
    substack: 'https://jsdevspace.substack.com',
    bsky: 'https://bsky.app/profile/jsdevspace.bsky.social',
    dailydev: 'https://app.daily.dev/squads/jsdevelopment',
  },
  postsPerPage: 15,
  mainHeadTitle: 'Learn JavaScript The Easy Way',
  mainHeadHeadingTwo:
    'Master JavaScript, Node.js, and Frontend Development with Hands-On Tutorials',
  mainHeadDescription:
    "JSDev Space is your go-to platform for JavaScript learning, offering in-depth tutorials, coding challenges, and expert tips. Whether you're a beginner or an experienced developer, explore modern JavaScript, frameworks, and backend technologies with step-by-step guides and real-world examples. Join a thriving community and sharpen your coding skills today! 🚀",
  howtoHeadTitle: 'JavaScript How-to Tutorials',
  howtoHeadingTwo:
    'Level up your skills in JavaScript, Node.js, and frontend development with practical, hands-on tutorials and real-world examples.',
  howtoHeadingDescription:
    'Howto section provides detailed instructions, best practices, and code snippets to help developers at any skill level. Easy-to-follow guides for developers in JavaScript and TypeScript. Each guide is designed to help developers efficiently implement solutions using JavaScript, frameworks, libraries, and related technologies. How-To guides will simplify your development workflow and boost your coding confidence.',
  snippetsHeadTitle: 'Handy JavaScript Snippets for Developers',
  snippetsHeadingTwo:
    'Boost your productivity with a collection of practical JavaScript snippets for everyday development tasks.',
  snippetsHeadDescription:
    'These snippets are solutions to common coding challenges, covering everything from JavaScript to CSS and TypeScript. Each snippet is tested for practical use and efficiency, making it a valuable resource for developers at any level. With this list, you can focus on building great features while minimizing time spent on repetitive tasks or searching for solutions.',
  fridaysHeadTitle: 'Friday Links Roundup',
  fridaysHeadingTwo:
    'Explore the latest in JavaScript, frameworks, and frontend tools—every Friday.',
  fridaysHeadDescription:
    'Stay updated with our Friday Links Roundup! Discover the latest articles, tools, and resources in web development, design, and technology. Each week, we curate a selection of must-read links to keep you informed and inspired for the weekend.',
  icons: {
    chevronLeft: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>`,
    chevronRight: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>`,
    moreHorizontal: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>`,
  },
  howtosPageTitle: 'How to Master JavaScript: Essential Tutorials and Guides',
  howtosPageDescription:
    'Access a curated collection of step-by-step guides and tutorials on our JavaScript development blog. Learn how to tackle common coding challenges and master JavaScript techniques.',
  snippetsPageTitle: 'JavaScript & TypeScript Snippets: Quick Code Solutions',
  snippetsPageDescription:
    'The Snippets page is your go-to resource for quick, practical code examples that solve everyday programming tasks in JavaScript development.',
  fridaysPageTitle:
    'JavaScript Friday Links Roundup: Latest Insights & Resources',
  fridaysPageDescription:
    'The Friday Roundup on the JSDev blog is your weekly digest of the latest trends, tools, and insights from the world of JavaScript development.',
  footerTextParagraphOne:
    'JSDev Space – Your go-to hub for JavaScript development. Explore expert guides, best practices, and the latest trends in web development, React, Node.js, and more. Stay ahead with cutting-edge tutorials, tools, and insights for modern JS developers. 🚀',
  footerTextParagraphTwo:
    'Join our growing community of developers! Follow us on social media for updates, coding tips, and exclusive content. Stay connected and level up your JavaScript skills with us! 🔥',
} as const;

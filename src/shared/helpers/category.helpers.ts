export type CategoryInfo = {
  name: string;
  heading: string;
  description: string;
  metaDescription: string;
};

export const categoriesWithDescription = [
  'javascript',
  'nestjs',
  'nextjs',
  'electron',
  'react',
  'nodejs',
  'html',
  'gatsby',
  'css',
  'typescipt',
  'phaserjs',
  'bash',
  'git',
  'threejs',
  'design',
  'docker',
  'web3',
];

export const isCategory = (path: string): boolean => {
  return categoriesWithDescription.includes(path.replace('/', '').trim());
};

const howtoCategoriesWithColors = {
  nodejs: ['#61994e', '#4c7d3c'],
  mongodb: ['#001E2B', '#0c516d'],
  javascipt: ['#EFD81D', '#dfc113'],
  html: ['#DE4B25', '#d13d25'],
  eslint: ['#4930BD', '#5e44e7'],
  gatsby: ['#633194', '#7638b8'],
  design: ['#93C1F7', '#68a4f2'],
  typescript: ['#0376C6', '#0f96e8'],
  css: ['#2862E9', '#1f4dd6'],
  react: ['#0096c0', '#03779b'],
};

export const getHowtoCategoryColor = (category: string): string[] => {
  return howtoCategoriesWithColors[category] || ['', ''];
};

export const getCategoryInfo = (
  categoryName: string,
  type = 'post'
): CategoryInfo => {
  let name: string;
  let heading: string;
  let description: string;
  let metaDescription: string;
  if (categoryName === 'javascript') {
    if (type === 'howto') {
      name = 'Mastering JavaScript: Essential Techniques for Web Developers';
      heading = 'Mastering JavaScript: Essential Techniques for Web Developers';
      description =
        "JavaScript is a versatile and powerful programming language that serves as the backbone of modern web development, enabling developers to create dynamic, interactive, and responsive websites that engage users and provide seamless experiences across various devices and platforms. From manipulating the Document Object Model (DOM) to handling asynchronous operations with Promises and async/await syntax, JavaScript offers a rich set of tools and features that allow developers to implement complex functionality with relative ease, while frameworks and libraries like React, Angular, and Vue have further expanded its capabilities and streamlined development workflows. Whether you're building simple interactive elements, complex single-page applications, or full-stack solutions with Node.js on the backend, mastering JavaScript's core concepts, best practices, and modern ES6+ features is essential for anyone looking to excel in web development and create high-performance, maintainable code that meets the demands of today's increasingly sophisticated web ecosystem.";
      metaDescription =
        'Learn essential JavaScript techniques to enhance your web development skills. From DOM manipulation to asynchronous programming, discover how to write efficient, modern JavaScript code for interactive websites.';
    } else if (type === 'post') {
      name = 'JavaScript';
      heading = 'JavaScript: Creating Seamless User Experiences with Code';
      description =
        'JavaScript is a high-level, dynamic programming language widely used for web development. It enables interactive and dynamic user experiences by allowing developers to manipulate the DOM, handle events, and create animations. JavaScript supports asynchronous programming through promises and async/await, making it essential for modern applications. With frameworks like React, Angular, and Vue.js, it powers single-page applications (SPAs) and progressive web apps (PWAs). Beyond the browser, JavaScript is used in backend development with Node.js, mobile apps with React Native, and even game development. Its versatility, vast ecosystem, and continuous evolution make JavaScript one of the most popular and essential programming languages for developers worldwide.';
      metaDescription =
        'Discover JavaScript tutorials, guides, and best practices. Learn ES6+, async programming, DOM manipulation, and more to master modern web development. 🚀';
    }
  }
  if (categoryName === 'web3') {
    if (type === 'howto') {
      name = 'Mastering Web3: Building Secure, Scalable dApps';
      heading = 'Mastering Web3: Building Secure, Scalable dApps';
      description =
        'Web3 development merges cryptography, distributed systems, and modern frontend patterns to create trust-minimized applications that run on public blockchains. This category guides you through the full stack: writing and testing smart contracts (Solidity/Foundry, Hardhat), composing frontend dApps with Wagmi/Viem, Ethers.js, and WalletConnect, and integrating wallets like MetaMask and Rainbow. You’ll learn best practices for gas optimization, contract upgradeability, security audits (reentrancy, access control, overflow), and safe deployments across EVM chains and L2s (Optimism, Arbitrum, Base). We also cover on-chain/off-chain data via oracles, storage with IPFS/Arweave, account abstraction (ERC-4337), and zero-knowledge basics for privacy and scalability. Whether you’re building DeFi protocols, NFT collections with royalties, or enterprise tokenized workflows, you’ll get step-by-step patterns, CI for contracts, and production checklists to ship resilient, maintainable dApps.';
      metaDescription =
        'Learn Web3 end-to-end: Solidity, Hardhat/Foundry, Wagmi/Viem, wallets, security, gas, L2s, IPFS/oracles, and ZK basics to ship production-ready dApps.';
    } else if (type === 'post') {
      name = 'Web3';
      heading = 'Web3: Smart Contracts, Wallets, and Real-World dApps';
      description =
        'Web3 focuses on decentralized applications that leverage smart contracts and public blockchains for transparency and composability. Expect practical guides on Solidity patterns, contract testing with Foundry/Hardhat, and frontend integration using Wagmi/Viem or Ethers.js. We explore wallet UX (MetaMask, Rainbow, WalletConnect), account abstraction (ERC-4337), and L2 rollups for cheaper, faster transactions. You’ll also find patterns for NFTs, DeFi, governance, subgraphs/indexing, data oracles, and decentralized storage (IPFS/Arweave), plus security reviews and deployment playbooks for multi-chain environments (Ethereum, Polygon, Base, Arbitrum, Optimism).';
      metaDescription =
        'Dive into Web3: Solidity, Hardhat/Foundry, Wagmi/Viem, wallets, L2s, IPFS, NFTs, and DeFi. Patterns, security tips, and guides for real-world dApps. 🚀';
    }
  }
  if (categoryName === 'phaserjs') {
    if (type === 'howto') {
      name = 'Master PhaserJS Game Development: Create Stunning HTML5 Games';
      heading = 'Unleashing Creative Game Development with PhaserJS Framework';
      description =
        "PhaserJS stands as one of the most powerful and accessible HTML5 game development frameworks available today, empowering developers to create visually stunning and performant browser-based games without the complexity traditionally associated with game development. Built on modern web technologies and featuring a comprehensive suite of tools for handling sprites, animations, physics, input controls, sound, and state management, PhaserJS streamlines the game creation process while offering enough flexibility and depth to satisfy both novice developers working on their first projects and experienced professionals crafting complex commercial titles. The framework's robust documentation, active community support, and seamless integration with JavaScript and TypeScript make it an ideal choice for those looking to bring their game ideas to life across multiple platforms, from desktop browsers to mobile devices, without sacrificing performance or creative vision. Whether you're interested in developing casual puzzle games, immersive RPGs, fast-paced action adventures, or educational content, PhaserJS provides the foundation and technical capabilities to transform your concepts into engaging interactive experiences that can reach audiences worldwide through the universal medium of the web browser.";
      metaDescription =
        'Learn how to build impressive browser-based games with PhaserJS. Discover essential techniques, optimization tips, and creative approaches for HTML5 game development.';
    } else if (type === 'post') {
      name = 'PhaserJS';
      heading = 'Phaser.js: Building Interactive, Scalable Games for the Web';
      description =
        'PhaserJS is a fast, open-source game framework for building 2D games using JavaScript and HTML5. It provides a powerful rendering engine, physics systems, animation support, and input handling, making it ideal for creating browser-based games. Phaser supports WebGL and Canvas, ensuring high performance across different devices. With built-in features like sprites, tilemaps, tweens, and sound management, it simplifies game development. The framework is widely used for arcade-style, platformer, and puzzle games. Its active community, extensive documentation, and plugin ecosystem make PhaserJS a top choice for both beginners and experienced game developers.';
      metaDescription =
        'Explore in-depth tutorials and articles on web development, JavaScript, game development, and more. Learn new skills with step-by-step guides and expert insights. 🚀';
    }
  }
  if (categoryName === 'css') {
    if (type === 'howto') {
      name = 'Advanced CSS Techniques: Master Modern Web Design';
      heading = 'Transforming Web Interfaces with the Power of CSS';
      description =
        'Cascading Style Sheets (CSS) represents the cornerstone of modern web design, serving as the vital link between raw HTML structure and visually engaging user interfaces that captivate visitors and enhance user experience across devices of all sizes. From fundamental styling properties to advanced layout systems like Grid and Flexbox, CSS empowers designers and developers to implement responsive designs, sophisticated animations, custom typography, and visual effects without relying on JavaScript or external libraries, all while maintaining clean, maintainable code that separates presentation from content. The language has evolved dramatically over recent years with the introduction of powerful features such as CSS variables, calc() functions, media queries, and container queries, enabling more dynamic and adaptable styling approaches that respond intelligently to user preferences, device capabilities, and viewport dimensions. As websites and web applications grow increasingly sophisticated, mastering CSS has become essential for frontend developers who seek to create accessible, performant, and visually stunning user interfaces that work seamlessly across the modern web ecosystem, from mobile devices to desktops, while adhering to current design trends and accessibility standards that ensure content remains available to all users regardless of their browsing environment or physical capabilities.';
      metaDescription =
        'Elevate your web design skills with essential CSS techniques. Learn responsive layouts, animations, Grid, Flexbox, and CSS variables to create stunning, professional websites.';
    } else if (type === 'post') {
      name = 'CSS';
      heading = 'CSS: Mastering Styles and Layouts for Modern Web Design';
      description =
        "CSS (Cascading Style Sheets) is the backbone of modern web design, allowing developers to control layout, typography, animations, and responsiveness. From foundational concepts like selectors and specificity to advanced techniques such as Flexbox, Grid, and CSS variables, mastering CSS enables you to create visually stunning, user-friendly interfaces. Whether you're a beginner learning the basics or an experienced developer refining your skills, our tutorials and guides cover everything you need to stay ahead in the ever-evolving world of web styling.";
      metaDescription =
        'Explore CSS tutorials, tips, and techniques for modern web design. Learn Flexbox, Grid, animations, responsive design, and more to style your websites like a pro. 🎨';
    }
  }
  if (categoryName === 'gatsby') {
    if (type === 'howto') {
      name = 'GatsbyJS Tutorial: Build Lightning-Fast React Websites';
      heading =
        'Enhancing Gatsby Performance for Faster and SEO-Friendly Websites';
      description =
        "GatsbyJS has emerged as one of the most powerful and innovative static site generators in the modern web development ecosystem, combining the flexibility of React components with the speed advantages of pre-rendered HTML to deliver exceptionally fast and highly optimized websites that offer superior user experiences across all devices. Built on a foundation of cutting-edge technologies including React, GraphQL, and webpack, Gatsby enables developers to create sophisticated web applications that load instantly, leverage intelligent image optimization, implement code splitting, and utilize progressive enhancement techniques that ensure content is accessible even before JavaScript fully loads. The framework's plugin architecture and rich ecosystem provide seamless integration with content management systems, e-commerce platforms, and third-party services, allowing developers to source data from virtually anywhere while maintaining the performance benefits of static generation combined with dynamic capabilities through client-side hydration. Whether creating blogs, e-commerce stores, documentation sites, or complex web applications, Gatsby provides a comprehensive development experience that addresses common pain points like SEO, accessibility, progressive web app features, and performance optimization, making it an ideal choice for teams seeking to deliver high-quality web experiences that satisfy both end-users and search engines without sacrificing developer productivity or the interactive capabilities expected in modern web applications.";
      metaDescription =
        'Learn how to create blazing-fast websites with GatsbyJS. Discover static site generation, React integration, GraphQL data handling, and performance optimization techniques.';
    } else if (type === 'post') {
      name = 'GatsbyJS';
      heading = 'Gatsby.js: Building Fast, Static Websites with React';
      description =
        "GatsbyJS is a modern static site generator that combines the power of React and GraphQL to create blazing-fast, SEO-friendly websites. It offers seamless data fetching, image optimization, and powerful build-time enhancements, making it ideal for blogs, portfolios, eCommerce, and enterprise solutions. With a growing ecosystem of plugins and integrations, Gatsby simplifies web development while delivering exceptional performance. Whether you're a beginner exploring static site generation or an experienced developer looking to optimize your workflow, our tutorials and articles will guide you through mastering GatsbyJS.";
      metaDescription =
        'Learn GatsbyJS with in-depth tutorials and guides. Build fast, SEO-friendly, and scalable websites using React and GraphQL. Optimize performance and streamline development!';
    }
  }
  if (categoryName === 'nestjs') {
    if (type === 'howto') {
      name = 'NestJS Framework Guide: Build Scalable Node.js Applications';
      heading = 'Maximizing NestJS Performance and Scalability';
      description =
        "NestJS has rapidly established itself as a premier framework for building server-side applications that combine the flexibility of Node.js with the structured architecture patterns familiar to developers from Angular and other enterprise-focused frameworks, making it an ideal choice for teams working on complex, scalable backend systems that demand maintainability and testability. Built with TypeScript at its core, NestJS embraces strong typing, object-oriented programming principles, functional programming concepts, and dependency injection to create highly modular, loosely coupled application components that can be easily tested, replaced, and scaled as project requirements evolve over time. The framework's opinionated yet flexible architecture provides a solid foundation for microservices, RESTful APIs, GraphQL endpoints, WebSocket servers, and CLI applications while offering seamless integration with databases, message queues, authentication systems, and other third-party services through its extensive ecosystem of modules and plugins. By combining the performance and developer experience benefits of modern JavaScript with time-tested software design patterns like decorators, interceptors, pipes, guards, and middleware, NestJS empowers development teams to create robust backend solutions that can grow from simple prototypes to enterprise-grade applications supporting millions of users without requiring fundamental architectural changes or sacrificing code quality, making it particularly valuable for startups and established companies alike that need to balance rapid development with long-term maintainability in their server-side JavaScript applications.";
      metaDescription =
        'Discover how to build robust backend applications with NestJS. Learn TypeScript integration, dependency injection, modules architecture, and microservices development for scalable enterprise solutions.';
    } else if (type === 'post') {
      name = 'NestJS';
      heading =
        'NestJS: Building Scalable and Efficient Server-Side Applications';
      description =
        "NestJS is a progressive Node.js framework that leverages TypeScript and modular architecture to create scalable and maintainable server-side applications. Inspired by Angular, it introduces decorators, dependency injection, and a structured approach to backend development. With built-in support for WebSockets, GraphQL, microservices, and REST APIs, NestJS is perfect for enterprise applications. Its powerful ecosystem, including middleware, interceptors, and guards, makes it highly extensible. Whether you're a beginner or an experienced developer, our in-depth tutorials and articles will help you harness the full potential of NestJS for modern web applications.";
      metaDescription =
        'Master NestJS with expert tutorials and guides. Build scalable, efficient, and maintainable Node.js applications using TypeScript, decorators, and modular architecture.';
    }
  }
  if (categoryName === 'nextjs') {
    if (type === 'howto') {
      name =
        'NextJS Development Guide: Build High-Performance React Applications';
      heading = 'Enhancing Next.js Performance for Speed and SEO';
      description =
        "NextJS has transformed the React ecosystem by providing a powerful, production-ready framework that elegantly solves many complex challenges of modern web development through its innovative hybrid rendering approach that combines server-side rendering, static site generation, and client-side hydration to deliver exceptional performance and developer experience without compromise. Built by Vercel with a focus on both developer productivity and end-user experience, Next.js offers an impressive array of features including an intuitive file-based routing system, built-in API routes, automatic code splitting, image optimization, font optimization, and seamless integration with various data fetching strategies that allow developers to choose the optimal rendering method for each page or component based on specific requirements. The framework's zero-configuration environment, incremental static regeneration capabilities, middleware support, and internationalization features have made it the preferred choice for businesses ranging from early-stage startups to large enterprises seeking to build scalable, maintainable web applications that provide excellent user experiences while maintaining strong search engine optimization performance and accessibility compliance. As web applications continue to grow in complexity and importance, Next.js stands out by abstracting away much of the configuration complexity traditionally associated with React applications while providing a flexible architecture that can adapt to evolving project needs, enabling development teams to focus on building features rather than wrestling with build tooling, rendering strategies, or performance optimizations that the framework handles automatically through its thoughtful defaults and extensive customization options.";
      metaDescription =
        'Master NextJS to create lightning-fast React applications with server-side rendering and static site generation. Learn routing, API routes, image optimization, and deployment strategies.';
    } else if (type === 'post') {
      name = 'NextJS';
      heading =
        'Next.js: The Ultimate Framework for Building React Applications';
      description =
        "Next.js is a powerful React framework for building high-performance web applications with server-side rendering (SSR), static site generation (SSG), and hybrid rendering. It simplifies routing, enhances SEO, and optimizes performance with automatic code splitting and image optimization. With built-in API routes, middleware, and support for TypeScript, Next.js is ideal for modern web development. Whether you're creating dynamic web apps, e-commerce platforms, or static websites, our tutorials and articles will help you master Next.js and take your projects to the next level.";
      metaDescription =
        'Learn Next.js with in-depth tutorials and guides. Build fast, SEO-friendly, and scalable React applications using server-side rendering, static generation, and API routes.';
    }
  }
  if (categoryName === 'llm') {
    if (type === 'howto') {
      name = 'Optimizing LLM Performance: A Practical Guide';
      heading = 'Mastering LLM Optimization for Performance and Efficiency';
      description =
        "Large Language Models (LLMs) power modern AI applications, but optimizing their performance requires careful tuning. This guide covers essential techniques such as fine-tuning with domain-specific data, prompt engineering for improved responses, and efficient deployment strategies using model quantization and parallel processing. We also explore strategies to reduce latency, enhance accuracy, and manage costs effectively. Whether you're working with open-source models or proprietary solutions, these best practices will help you maximize the potential of LLMs while maintaining efficiency and scalability in production environments.";
      metaDescription =
        'Learn how to optimize Large Language Models (LLMs) for accuracy, efficiency, and scalability. Explore fine-tuning, prompt engineering, and deployment best practices.';
    } else if (type === 'post') {
      name = 'LLM Models';
      heading =
        'LLM Models: Revolutionizing Natural Language Processing and AI';
      description =
        'Large Language Models (LLMs) are advanced AI models trained on massive datasets to understand and generate human-like text. Powered by deep learning and transformer architectures, LLMs enable applications like chatbots, automated content creation, code generation, and language translation. They are widely used in industries ranging from customer service to software development. Our in-depth guides cover LLM fundamentals, training techniques, ethical considerations, and real-world use cases, helping you understand and leverage the power of AI-driven language models.';
      metaDescription =
        'Explore LLM (Large Language Models), their architecture, applications, and impact on AI. Learn how they power chatbots, content generation, and automation.';
    }
  }
  if (categoryName === 'electron') {
    if (type === 'howto') {
      name = 'Optimizing ElectronJS Apps for Performance and Efficiency';
      heading = 'Enhancing ElectronJS App Performance and Optimization';
      description =
        "ElectronJS enables developers to build cross-platform desktop applications using web technologies, but optimizing performance is crucial for a smooth user experience. This guide explores best practices such as reducing memory consumption, optimizing rendering processes, leveraging code-splitting, and minimizing bundle size. We also cover strategies to improve startup time, manage CPU usage, and enhance security without sacrificing functionality. Whether you're building a lightweight utility or a full-featured desktop app, these techniques will help you streamline your ElectronJS application for maximum efficiency and responsiveness.";
      metaDescription =
        'Learn how to enhance ElectronJS app performance with optimization techniques, including memory management, bundling, and efficient rendering.';
    } else if (type === 'post') {
      name = 'ElectronJS';
      heading = 'Electron.js: Build Cross-Platform Desktop Applications';
      description =
        'ElectronJS is an open-source framework that allows developers to create cross-platform desktop applications using web technologies like JavaScript, HTML, and CSS. Built on Chromium and Node.js, Electron enables seamless integration of web-based interfaces with native OS functionality. It powers popular apps like VS Code and Discord, making it a preferred choice for modern desktop development. Our resources cover Electron’s architecture, main and renderer processes, packaging, performance optimization, and security best practices to help you build efficient and scalable desktop applications.';
      metaDescription =
        'Learn about ElectronJS, a framework for building cross-platform desktop applications using JavaScript, HTML, and CSS. Explore tutorials, features, and best practices.';
    }
  }
  if (categoryName === 'react') {
    if (type === 'howto') {
      name = 'Optimizing ReactJS for Performance and Scalability';
      heading =
        'Boosting ReactJS Performance with Proven Optimization Techniques';
      description =
        "ReactJS is a powerful library for building dynamic web applications, but optimizing performance is essential for smooth user experiences. This guide covers key techniques such as lazy loading, code splitting, and memoization to reduce re-renders and improve efficiency. We also explore effective state management strategies, leveraging React's built-in optimizations like useMemo and useCallback, and minimizing bundle size for faster load times. Whether you're developing a small project or a large-scale React app, these best practices will help you enhance performance, maintain scalability, and ensure a responsive UI.";
      metaDescription =
        'Learn how to optimize ReactJS apps for speed, efficiency, and scalability with best practices like code splitting, memoization, and state management.';
    } else if (type === 'post') {
      name = 'ReactJS';
      heading = 'React.js: Unlock the Power of Dynamic User Interfaces';
      description =
        'ReactJS is a popular, open-source JavaScript library for building dynamic, high-performance user interfaces, primarily for single-page applications. Developed by Facebook, React allows developers to create reusable UI components, manage state efficiently, and ensure smooth rendering with a virtual DOM. It simplifies the development of interactive UIs and enhances the performance of web applications. Our resources cover everything from React’s core concepts, like JSX and component lifecycles, to advanced topics such as hooks, performance optimization, and state management with Redux, equipping you with the knowledge to build responsive and scalable front-end applications.';
      metaDescription =
        'Learn about ReactJS, a JavaScript library for building dynamic user interfaces. Explore tutorials, features, and best practices for creating efficient and scalable web applications with React.';
    }
  }
  if (categoryName === 'nodejs') {
    if (type === 'howto') {
      name = 'Optimizing NodeJS for Performance and Scalability';
      heading = 'Enhancing NodeJS Performance for Scalable Applications';
      description =
        "NodeJS is a powerful runtime for building scalable applications, but optimizing performance is crucial for handling high traffic and resource efficiency. This guide explores best practices such as using asynchronous programming to prevent blocking, implementing caching to reduce redundant computations, and leveraging load balancing for better request distribution. We also cover optimizing database queries, managing memory leaks, and using worker threads to improve concurrency. Whether you're developing APIs, real-time apps, or microservices, these techniques will help you maximize NodeJS efficiency and scalability.";
      metaDescription =
        'Learn how to enhance NodeJS performance with best practices like asynchronous programming, load balancing, caching, and efficient memory management.';
    } else if (type === 'post') {
      name = 'NodeJS';
      heading = 'Node.js: Unlocking the Power of Scalable Web Applications';
      description =
        "NodeJS is a powerful, open-source runtime built on Chrome's V8 JavaScript engine, enabling developers to build fast, scalable network applications. With Node.js, developers can write server-side code in JavaScript, allowing for seamless integration between frontend and backend systems. Known for its non-blocking, event-driven architecture, Node.js is ideal for real-time applications, API development, and handling large-scale data. Our resources cover the fundamentals of Node.js, advanced asynchronous programming techniques, API creation, performance tuning, and best practices for developing high-performance backend systems.";
      metaDescription =
        'Learn about NodeJS, a JavaScript runtime for building fast, scalable network applications. Explore tutorials, features, and best practices to enhance your backend development skills.';
    }
  }
  if (categoryName === 'html') {
    if (type === 'howto') {
      name = 'Optimizing HTML for Faster Load Times and Better SEO';
      heading = 'Improving HTML Performance for Speed and SEO';
      description =
        "HTML forms the foundation of every web page, and optimizing it is key to improving load speed, SEO, and accessibility. This guide covers essential techniques such as using semantic HTML for better search engine indexing, reducing unnecessary elements to streamline performance, and implementing lazy loading for images and videos. We also explore best practices like minifying code, leveraging caching, and ensuring mobile responsiveness to enhance user experience. Whether you're building a simple webpage or a complex web app, these optimizations will help you create fast, efficient, and SEO-friendly HTML structures.";
      metaDescription =
        'Learn how to optimize HTML for speed, accessibility, and SEO with best practices like semantic markup, lazy loading, and minification.';
    } else if (type === 'post') {
      name = 'HTML';
      heading = 'HTML: The Foundation of the Web';
      description =
        'HTML (HyperText Markup Language) is the foundational language of the web, used to structure and organize content on webpages. It defines elements such as headings, paragraphs, links, images, forms, and more, allowing browsers to display content in an organized and meaningful way. As the building block of web development, HTML works alongside CSS and JavaScript to create fully functional websites. Our resources cover everything from the basics of HTML tags, attributes, and document structure to more advanced topics such as accessibility, semantic HTML, and SEO optimization, helping you create well-structured and accessible web pages.';
      metaDescription =
        'Learn about HTML, the fundamental markup language for creating webpages. Explore tutorials, tags, attributes, and best practices to build well-structured and accessible websites.';
    }
  }
  if (categoryName === 'typescript') {
    if (type === 'howto') {
      name = 'Optimizing TypeScript for Performance and Maintainability';
      heading = 'Maximizing TypeScript Efficiency for Scalable Applications';
      description =
        "TypeScript enhances JavaScript with static typing and improved tooling, but optimizing its usage is key to maintaining performance and scalability. This guide explores best practices such as using strict typing to prevent runtime errors, leveraging tree shaking to eliminate unused code, and implementing code splitting for faster load times. We also cover optimizing TypeScript compilation, reducing bundle size, and using efficient data structures for better memory management. Whether you're building a frontend application or a backend service, these techniques will help you write cleaner, more efficient, and maintainable TypeScript code.";
      metaDescription =
        'Learn how to optimize TypeScript for better performance, scalability, and maintainability with best practices like strict typing, tree shaking, and code splitting.';
    } else if (type === 'post') {
      name = 'TypeScript';
      heading = 'TypeScript: The Modern JavaScript with Static Typing';
      description =
        'TypeScript is a statically typed superset of JavaScript that adds optional type annotations and advanced features to the language. By introducing a type system, TypeScript enhances JavaScript development by improving code quality, reducing errors, and enabling better tooling support. TypeScript compiles to plain JavaScript, making it compatible with existing JavaScript code and libraries. Our resources cover everything from basic type annotations, interfaces, and classes to advanced topics like generics, decorators, and type inference. Whether you’re a beginner or experienced developer, TypeScript helps you write more reliable and maintainable code, especially for large-scale applications.';
      metaDescription =
        'Learn about TypeScript, a superset of JavaScript that adds static types and advanced features. Explore tutorials and best practices to enhance code quality and maintainability.';
    }
  }
  if (categoryName === 'bash') {
    if (type === 'howto') {
      name = 'Optimizing Bash Scripts for Efficiency and Performance';
      heading = 'Enhancing Bash Scripting for Speed and Efficiency';
      description =
        "Bash scripting is a powerful tool for automation, but optimizing scripts is essential for efficiency and performance. This guide explores best practices such as using built-in shell commands instead of external processes, minimizing subshell usage, and optimizing loops to reduce execution time. We also cover process management, error handling, and leveraging parallel execution for faster task completion. Whether you're writing simple automation scripts or complex system management tasks, these techniques will help you create cleaner, faster, and more reliable Bash scripts.";
      metaDescription =
        'Learn how to optimize Bash scripts with best practices like efficient loops, process management, and minimizing execution time for better performance.';
    } else if (type === 'post') {
      name = 'bash';
      heading = 'Bash Scripting: Automate and Optimize Your Workflow';
      description =
        'Bash (Bourne Again Shell) is a widely-used command-line interface and scripting language for Unix-based systems, including Linux and macOS. Known for its power and flexibility, Bash allows developers and system administrators to automate tasks, manipulate files, manage processes, and control system behavior through simple or complex scripts. It supports variables, loops, conditionals, functions, and more, making it essential for efficient system management and automation. Our resources cover everything from basic command-line usage to advanced scripting techniques, helping you harness the full potential of Bash to streamline workflows and boost productivity.';
      metaDescription =
        'Learn about Bash, a powerful command-line interface and scripting language for Unix-based systems. Explore tutorials and best practices for automating tasks and managing systems efficiently.';
    }
  }
  if (categoryName === 'git') {
    if (type === 'howto') {
      name = 'Optimizing Git Workflow for Efficiency and Collaboration';
      heading = 'Streamlining Git Workflow for Better Version Control';
      description =
        "Git is a powerful version control system, but optimizing your workflow is key to improving efficiency and collaboration. This guide covers best practices such as using clear branching strategies like Git Flow, writing meaningful commit messages, and leveraging interactive rebasing to maintain a clean history. We also explore optimizing repository performance by reducing large files, pruning unnecessary branches, and using shallow clones for faster fetches. Whether you're working solo or in a team, these techniques will help you streamline development, avoid merge conflicts, and maintain a well-structured Git repository.";
      metaDescription =
        'Learn how to optimize your Git workflow with best practices like branching strategies, commit hygiene, rebasing, and efficient repository management.';
    } else if (type === 'post') {
      name = 'git';
      heading = 'Git: The Essential Version Control System';
      description =
        'Git is a distributed version control system that enables developers to track changes in source code during software development. It allows teams to collaborate effectively by providing powerful features such as branching, merging, and version history, ensuring that every change made is recorded and traceable. Git helps prevent conflicts in collaborative environments and makes it easy to roll back to previous versions of a project. Our resources cover everything from basic Git commands, repository management, and workflow strategies to advanced topics like branching models, rebasing, and Git hooks, helping you master Git and enhance your development process.';
      metaDescription =
        'Learn about Git, a distributed version control system for tracking code changes. Explore tutorials, commands, and best practices for effective collaboration and version management.';
    }
  }
  if (categoryName === 'threejs') {
    if (type === 'howto') {
      name = 'Optimizing ThreeJS for Performance and Visual Quality';
      heading = 'Enhancing ThreeJS Performance and Visual Quality';
      description =
        "ThreeJS is a powerful JavaScript library for creating 3D graphics on the web, but optimizing performance is essential for delivering smooth, high-quality experiences. This guide explores techniques such as level of detail (LOD) to reduce the complexity of distant objects, using instancing to efficiently render large numbers of similar objects, and applying texture compression to decrease memory usage. We also cover tips for optimizing shaders, using efficient geometry, and leveraging GPU resources effectively. Whether you're building interactive 3D applications or complex visualizations, these strategies will help you improve the performance and visual appeal of your ThreeJS projects.";
      metaDescription =
        'Learn how to optimize ThreeJS for better performance, smoother animations, and enhanced visual quality with techniques like level of detail (LOD), instancing, and texture compression.';
    } else if (type === 'post') {
      name = 'ThreeJS';
      heading = 'ThreeJS: The Ultimate JavaScript Library for 3D';
      description =
        'Three.js is a powerful, open-source JavaScript library that simplifies the creation of 3D graphics and animations for the web. Built on top of WebGL, Three.js allows developers to render complex 3D models, scenes, and effects directly in the browser without requiring additional plugins. It supports advanced features such as lighting, shadows, textures, camera controls, and physics simulations, making it ideal for creating interactive 3D web applications and games. Our resources cover everything from setting up a basic scene to advanced techniques like shaders, 3D modeling integration, and performance optimization, enabling you to create stunning 3D experiences for the web.';
      metaDescription =
        'Learn about Three.js, a JavaScript library for creating 3D graphics and animations in the browser. Explore tutorials and best practices for building interactive 3D web applications and games.';
    }
  }
  if (categoryName === 'design') {
    if (type === 'howto') {
      name = 'Optimizing Design for Usability, Aesthetics, and Performance';
      heading = 'Creating High-Performance and User-Centric Designs';
      description =
        "Effective design balances aesthetics, usability, and performance to create engaging and functional experiences. This guide explores best practices such as using a clear visual hierarchy to guide user attention, optimizing typography for readability, and implementing responsive layouts for seamless experiences across devices. We also cover performance enhancements like image optimization, efficient use of animations, and accessibility improvements to make designs inclusive. Whether you're designing websites, apps, or digital products, these strategies will help you create visually appealing and high-performing designs that enhance user engagement.";
      metaDescription =
        'Learn how to optimize design for better user experience, accessibility, and performance with best practices in layout, typography, and visual hierarchy.';
    } else if (type === 'post') {
      name = 'Design';
      heading = 'Optimizing Design for Performance and User Engagement';
      description =
        "Great design combines aesthetics, functionality, and performance to create seamless user experiences. This guide covers essential optimization techniques, including visual hierarchy for better navigation, responsive layouts for multi-device support, and typography choices that enhance readability. We also explore strategies for optimizing images, reducing unnecessary animations, and improving accessibility to ensure inclusivity. Whether you're designing websites, apps, or digital products, these best practices will help you build visually appealing, high-performing, and user-friendly interfaces that drive engagement and usability.";
      metaDescription =
        'Discover key design optimization techniques to improve user experience, performance, and accessibility through layout, typography, and visual hierarchy.';
    }
  }
  if (categoryName === 'docker') {
    if (type === 'howto') {
      name = 'Optimizing Docker for Performance, Security, and Scalability';
      heading =
        'Enhancing Docker Performance and Security for Scalable Deployments';
      description =
        "Docker simplifies application deployment, but optimizing its performance and security is crucial for efficiency. This guide covers best practices such as minimizing image size with multi-stage builds, leveraging layer caching for faster builds, and properly configuring resource limits to prevent bottlenecks. We also explore securing containers with least-privilege access, using optimized networking strategies, and implementing health checks for reliability. Whether you're running containers in development or production, these strategies will help you improve speed, security, and scalability while maintaining efficient resource usage.";
      metaDescription =
        'Learn how to optimize Docker for better performance, security, and scalability with best practices like efficient image management, caching, and resource allocation.';
    } else if (type === 'post') {
      name = 'Docker';
      heading = 'Optimizing Docker for Speed, Security, and Scalability';
      description =
        "Docker streamlines application deployment, but optimizing performance and security is key to maximizing efficiency. This guide explores best practices such as reducing image size with multi-stage builds, leveraging caching for faster builds, and setting resource limits to prevent excessive CPU and memory usage. We also cover security enhancements like minimizing privileges, using secure base images, and implementing container health checks. Whether you're managing local development or large-scale production environments, these optimizations will help you run Docker containers more securely, efficiently, and reliably.";
      metaDescription =
        'Optimize Docker with best practices for performance, security, and scalability, including lightweight images, caching, and resource management.';
    }
  }
  if (!name || !heading || !description || !metaDescription) {
    name = 'Unknown Category';
    heading = 'Unknown Category';
    description = 'Description not available for this category.';
    metaDescription = 'Meta description not available for this category.';
  }

  return {
    name,
    heading,
    description,
    metaDescription,
  } as CategoryInfo;
};

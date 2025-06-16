import { HowtoCategoryInfo } from '../types/';

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

export const getHowtoCategoryColor = (category: string): string[] | null => {
  return howtoCategoriesWithColors[category];
};

export const getHowtoCategoryInfo = (category: string): HowtoCategoryInfo => {
  const [color, secondColor] = howtoCategoriesWithColors[category] || ['', ''];
  let description = '';
  let name = '';
  if (category === 'nodejs') {
    name = 'NodeJS How-To Guides';
    description =
      'Explore our comprehensive collection of Node.js how-to guides designed for developers of all skill levels. Whether you’re a beginner looking to understand the basics or an experienced programmer seeking advanced techniques, our step-by-step tutorials cover everything from setting up your Node.js environment to building scalable applications. Learn best practices, troubleshooting tips, and effective solutions to common challenges in Node.js development. Empower your coding journey and unlock the full potential of this powerful JavaScript runtime!';
  }
  if (category === 'mongodb') {
    name = 'MongoDB How-To Guides';
    description =
      "Dive into our extensive MongoDB how-to guides tailored for developers at every level. From installation and basic CRUD operations to advanced querying techniques and performance optimization, our tutorials provide clear, step-by-step instructions. Learn how to effectively manage your data, implement indexing strategies, and utilize MongoDB’s powerful features to build robust applications. Whether you're just starting or looking to enhance your skills, our resources will help you harness the full power of this leading NoSQL database.";
  }
  if (category === 'javascript') {
    name = 'JavaScript How-To Guides';
    description =
      'Unlock the full potential of JavaScript with our comprehensive how-to guides designed for developers of all skill levels. From foundational concepts and syntax to advanced techniques like asynchronous programming and frameworks, our step-by-step tutorials cover everything you need to know. Explore best practices, debugging tips, and practical examples to enhance your coding skills and build dynamic web applications. Whether you’re a beginner eager to learn or an experienced developer seeking to refine your expertise, our resources will empower you on your JavaScript journey.';
  }
  if (category === 'html') {
    name = 'HTML How-To Guides';
    description =
      'Master the fundamentals of web development with our extensive collection of HTML how-to guides. Designed for beginners and seasoned developers alike, our tutorials cover everything from basic tags and attributes to advanced layout techniques using HTML5. Learn how to structure your web pages effectively, create forms, and incorporate multimedia elements to enhance user experience. With clear, step-by-step instructions and practical examples, our resources will help you build a strong foundation in HTML, enabling you to create engaging and accessible websites.';
  }
  if (category === 'eslint') {
    name = 'ESLint How-To Guides';
    description =
      'Enhance your JavaScript development workflow with our comprehensive ESLint how-to guides. Perfect for developers at all levels, these tutorials will help you set up ESLint, configure rules, and integrate it into your projects to ensure code quality and consistency. Learn how to identify and fix common coding issues, customize linting rules for your team’s style guide, and leverage advanced features like plugins and configurations. With our step-by-step instructions and practical tips, you’ll be equipped to maintain clean, error-free code and improve your overall development process.';
  }
  if (category === 'gatsby') {
    name = 'GatsbyJS How-To Guides';
    description =
      'Unlock the power of static site generation with our comprehensive Gatsby.js how-to guides. Tailored for developers of all experience levels, these tutorials cover everything from setting up your Gatsby environment to creating high-performance websites and applications. Explore best practices for data sourcing, optimizing images, and implementing SEO strategies to enhance your site’s visibility. With clear, step-by-step instructions and practical examples, our resources will help you harness Gatsby.js to build fast, modern websites that deliver exceptional user experiences.';
  }
  if (category === 'design') {
    name = 'Design How-To Guides';
    description =
      'Elevate your creative skills with our extensive collection of design how-to guides. Whether you’re a beginner or a seasoned designer, our tutorials cover a wide range of topics, including graphic design, user interface (UI) design, and user experience (UX) principles. Learn essential tools and techniques, from color theory and typography to layout design and branding strategies. With step-by-step instructions and practical tips, our resources will help you bring your design ideas to life and create visually stunning projects that resonate with your audience.';
  }
  if (category === 'typescript') {
    name = 'TypeScript How-To Guides';
    description =
      'Unlock the power of TypeScript with our comprehensive how-to guides designed for developers at all levels. From understanding the basics of static typing to implementing advanced features like interfaces, generics, and decorators, our tutorials cover everything you need to elevate your JavaScript projects. Learn how to improve code quality, enhance maintainability, and leverage TypeScript’s robust tooling ecosystem. With clear, step-by-step instructions and practical examples, our resources will empower you to confidently build scalable, type-safe applications that enhance your development workflow.';
  }
  if (category === 'css') {
    name = 'CSS How-To Guides';
    description =
      'Enhance your web design skills with our extensive collection of CSS how-to guides. Designed for beginners and experienced developers alike, these tutorials cover everything from the fundamentals of styling and layout to advanced techniques like responsive design and CSS animations. Learn how to create visually appealing web pages, implement flexbox and grid layouts, and optimize your styles for different devices. With clear, step-by-step instructions and practical examples, our resources will help you master CSS and bring your creative visions to life.';
  }
  if (category === 'react') {
    name = 'React How-To Guides';
    description =
      'Dive into the world of React with our comprehensive how-to guides designed for developers of all skill levels. Whether you’re just starting or looking to refine your skills, our tutorials cover everything from setting up your development environment to building complex, interactive user interfaces. Explore key concepts like components, state management, hooks, and routing, along with best practices for optimizing performance and enhancing user experience. With clear, step-by-step instructions and practical examples, our resources will empower you to create dynamic web applications using React effectively.';
  }

  return {
    name,
    color,
    secondColor,
    description,
  };
};

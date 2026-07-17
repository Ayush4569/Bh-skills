import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import Course from '../models/course';
import Module from '../models/module';
import Challenge from '../models/challenge';
import Achievement from '../models/achievement';
import UserProgress from '../models/userProgress';
import XPLog from '../models/xpLog';
import Attempt from '../models/attempt';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/brainheaters';

async function seed() {
  console.log('Connecting to database...');
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB.');

  // Clear existing collections
  console.log('Clearing old database records...');
  await Course.deleteMany({});
  await Module.deleteMany({});
  await Challenge.deleteMany({});
  await Achievement.deleteMany({});
  await UserProgress.deleteMany({});
  await XPLog.deleteMany({});
  await Attempt.deleteMany({});

  console.log('Seeding Achievements...');
  const achievements = await Achievement.insertMany([
    {
      title: 'First Steps',
      description: 'Earn your first 20 XP on Brainheaters Labs.',
      xpRequired: 20,
      icon: 'Flag',
    },
    {
      title: 'Code Cadet',
      description: 'Earn 100 XP to prove your foundation.',
      xpRequired: 100,
      icon: 'Shield',
    },
    {
      title: 'Developer in Training',
      description: 'Reach 300 XP and master multiple challenges.',
      xpRequired: 300,
      icon: 'Compass',
    },
    {
      title: 'Master Coder',
      description: 'Reach 600 XP and solve advanced logic rules.',
      xpRequired: 600,
      icon: 'Zap',
    },
    {
      title: 'Brainheaters Wizard',
      description: 'Accumulate 1000 XP and unlock everything.',
      xpRequired: 1000,
      icon: 'Flame',
    },
  ]);
  console.log(`Seeded ${achievements.length} achievements.`);

  // ----------------------------------------------------
  // Learning Path 1: Web Development
  // ----------------------------------------------------
  console.log('Seeding Course: Web Development...');
  const webCourse = await Course.create({
    title: 'Web Development',
    slug: 'web',
    description: 'Learn HTML, CSS, and interactive JavaScript by building user interfaces directly in the browser.',
    icon: 'Globe',
    order: 1,
    published: true,
  });

  console.log('Seeding Modules for Web Development...');
  const htmlModule1 = await Module.create({
    title: 'HTML Text Elements',
    description: 'Learn headings, paragraphs, and hyperlinks.',
    courseId: webCourse._id,
    order: 1,
  });
  const htmlModule2 = await Module.create({
    title: 'HTML Structure & Media',
    description: 'Master text inputs, unordered lists, and images.',
    courseId: webCourse._id,
    order: 2,
  });
  const htmlModule3 = await Module.create({
    title: 'HTML Forms & Tables',
    description: 'Implement tables, textareas, radio buttons, and checkboxes.',
    courseId: webCourse._id,
    order: 3,
  });

  const cssModule1 = await Module.create({
    title: 'CSS Basics & Box Model',
    description: 'Understand background colors, dimensions, padding, margins, and Flexbox.',
    courseId: webCourse._id,
    order: 4,
  });
  const cssModule2 = await Module.create({
    title: 'CSS Styling & Typography',
    description: 'Control font sizes, weights, border radius, and text alignment.',
    courseId: webCourse._id,
    order: 5,
  });
  const cssModule3 = await Module.create({
    title: 'CSS Advanced Layouts',
    description: 'Master grid layouts, absolute positioning, hover transitions, and drop shadows.',
    courseId: webCourse._id,
    order: 6,
  });

  const jsModule1 = await Module.create({
    title: 'JS DOM & Events',
    description: 'Handle click counters, toggle background colors, and process input greetings.',
    courseId: webCourse._id,
    order: 7,
  });
  const jsModule2 = await Module.create({
    title: 'JS Controls & Logic',
    description: 'Toggle visibility modals, render array items to the DOM, and calculate temperature conversions.',
    courseId: webCourse._id,
    order: 8,
  });
  const jsModule3 = await Module.create({
    title: 'JS Advanced Browser APIs',
    description: 'Manage class name toggling, intervals, list filters, and localStorage.',
    courseId: webCourse._id,
    order: 9,
  });

  // ----------------------------------------------------
  // HTML Basics Challenges (1 to 10)
  // ----------------------------------------------------
  console.log('Seeding challenges for HTML Basics...');
  const htmlChallenges = [];

  htmlChallenges.push(await Challenge.create({
    moduleId: htmlModule1._id,
    title: 'The Heading Element',
    description: `### Heading Elements\n\nHTML headings are defined with the \`<h1>\` to \`<h6>\` tags. \`<h1>\` defines the most important heading.\n\n### Objective\nCreate an \`<h1>\` element containing the text \`Hello Brainheaters\`.`,
    language: 'html',
    difficulty: 'easy',
    xp: 20,
    starterCode: `<!-- Write your HTML code below -->\n`,
    solution: `<h1>Hello Brainheaters</h1>`,
    validationRules: [
      {
        id: 'h1_exists',
        description: 'Verify that an <h1> element exists.',
        checkFn: `document.querySelector('h1') !== null`,
      },
      {
        id: 'h1_text',
        description: 'Verify that the <h1> element contains "Hello Brainheaters".',
        checkFn: `document.querySelector('h1')?.textContent?.trim() === 'Hello Brainheaters'`,
      },
    ],
    hints: ['Use the opening tag `<h1>` and closing tag `</h1>`.', 'Verify spelling is exactly "Hello Brainheaters".'],
    published: true,
  }));

  htmlChallenges.push(await Challenge.create({
    moduleId: htmlModule1._id,
    title: 'Welcome Paragraph',
    description: `### HTML Paragraphs\n\nParagraphs are defined with the \`<p>\` tag. You can assign unique IDs to target specific elements.\n\n### Objective\nCreate a paragraph \`<p>\` with the text \`Welcome to the labs.\` and give it an \`id\` attribute set to \`welcome-msg\`.`,
    language: 'html',
    difficulty: 'easy',
    xp: 20,
    starterCode: `<!-- Write your HTML code below -->\n`,
    solution: `<p id="welcome-msg">Welcome to the labs.</p>`,
    validationRules: [
      {
        id: 'p_exists',
        description: 'Verify that a <p> element exists.',
        checkFn: `document.querySelector('p') !== null`,
      },
      {
        id: 'p_id',
        description: 'Verify that the paragraph has the ID "welcome-msg".',
        checkFn: `document.querySelector('p')?.getAttribute('id') === 'welcome-msg'`,
      },
      {
        id: 'p_text',
        description: 'Verify that the paragraph contains "Welcome to the labs.".',
        checkFn: `document.querySelector('p#welcome-msg')?.textContent?.trim() === 'Welcome to the labs.'`,
      },
    ],
    hints: ['An ID attribute is written as `id="value"` inside the opening tag.', 'Example: `<p id="my-id">Text</p>`'],
    published: true,
  }));

  htmlChallenges.push(await Challenge.create({
    moduleId: htmlModule1._id,
    title: 'Hyperlink to Labs',
    description: `### HTML Links\n\nLinks are defined with the \`<a>\` (anchor) tag. The destination is specified in the \`href\` attribute.\n\n### Objective\nCreate a link with the text \`Visit Labs\` that goes to \`https://labs.brainheaters.com\` and opens in a new tab using the \`target="_blank"\` attribute.`,
    language: 'html',
    difficulty: 'easy',
    xp: 20,
    starterCode: `<!-- Write your HTML code below -->\n`,
    solution: `<a href="https://labs.brainheaters.com" target="_blank">Visit Labs</a>`,
    validationRules: [
      {
        id: 'a_exists',
        description: 'Verify that an <a> element exists.',
        checkFn: `document.querySelector('a') !== null`,
      },
      {
        id: 'a_href',
        description: 'Verify that the link href points to "https://labs.brainheaters.com".',
        checkFn: `document.querySelector('a')?.getAttribute('href') === 'https://labs.brainheaters.com'`,
      },
      {
        id: 'a_target',
        description: 'Verify that target is set to "_blank" to open in a new tab.',
        checkFn: `document.querySelector('a')?.getAttribute('target') === '_blank'`,
      },
      {
        id: 'a_text',
        description: 'Verify that the link text is exactly "Visit Labs".',
        checkFn: `document.querySelector('a')?.textContent?.trim() === 'Visit Labs'`,
      },
    ],
    hints: ['Add `href="https://labs.brainheaters.com"` and `target="_blank"` inside the `<a>` tag.'],
    published: true,
  }));

  htmlChallenges.push(await Challenge.create({
    moduleId: htmlModule2._id,
    title: 'Text Inputs',
    description: `### Form Inputs\n\nInputs allow users to enter text. An input tag \`<input>\` is self-closing and utilizes a \`placeholder\` attribute to display temporary text.\n\n### Objective\nCreate an input element with the \`id\` set to \`username-input\` and the \`placeholder\` set to \`Enter your username\`.`,
    language: 'html',
    difficulty: 'easy',
    xp: 20,
    starterCode: `<!-- Write your HTML code below -->\n`,
    solution: `<input id="username-input" placeholder="Enter your username" />`,
    validationRules: [
      {
        id: 'input_exists',
        description: 'Verify that an <input> element exists.',
        checkFn: `document.querySelector('input') !== null`,
      },
      {
        id: 'input_id',
        description: 'Verify that the input has the ID "username-input".',
        checkFn: `document.querySelector('input')?.getAttribute('id') === 'username-input'`,
      },
      {
        id: 'input_placeholder',
        description: 'Verify that the placeholder is set to "Enter your username".',
        checkFn: `document.querySelector('input#username-input')?.getAttribute('placeholder') === 'Enter your username'`,
      },
    ],
    hints: ['The `<input />` tag is self-closing and does not need a closing tag.'],
    published: true,
  }));

  htmlChallenges.push(await Challenge.create({
    moduleId: htmlModule2._id,
    title: 'Unordered Lists',
    description: `### HTML Lists\n\nAn unordered list starts with the \`<ul>\` tag. Each list item starts with the \`<li>\` tag.\n\n### Objective\nCreate an unordered list containing exactly three list items. The list items must contain the text \`HTML\`, \`CSS\`, and \`JavaScript\` in that order.`,
    language: 'html',
    difficulty: 'medium',
    xp: 40,
    starterCode: `<!-- Write your HTML code below -->\n`,
    solution: `<ul>\n  <li>HTML</li>\n  <li>CSS</li>\n  <li>JavaScript</li>\n</ul>`,
    validationRules: [
      {
        id: 'ul_exists',
        description: 'Verify that a <ul> element exists.',
        checkFn: `document.querySelector('ul') !== null`,
      },
      {
        id: 'li_count',
        description: 'Verify that there are exactly 3 <li> child elements inside the list.',
        checkFn: `document.querySelectorAll('ul > li').length === 3`,
      },
      {
        id: 'li_content',
        description: 'Verify that the list items contain "HTML", "CSS", and "JavaScript" in order.',
        checkFn: `(() => {
          const items = Array.from(document.querySelectorAll('ul > li')).map(el => el.textContent?.trim());
          return items[0] === 'HTML' && items[1] === 'CSS' && items[2] === 'JavaScript';
        })()`,
      },
    ],
    hints: ['Nest three `<li>` elements inside one opening and closing `<ul>` tag.'],
    published: true,
  }));

  htmlChallenges.push(await Challenge.create({
    moduleId: htmlModule2._id,
    title: 'Adding Images',
    description: `### HTML Images\n\nImages are defined with the \`<img>\` tag. It is self-closing and requires a source \`src\` and an alternative text \`alt\`.\n\n### Objective\nAdd an \`<img>\` tag with \`src\` set to \`https://images.unsplash.com/photo-1517694712202-14dd9538aa97\` and an \`alt\` attribute set to \`Coding Laptop\`.`,
    language: 'html',
    difficulty: 'easy',
    xp: 20,
    starterCode: `<!-- Add image here -->\n`,
    solution: `<img src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97" alt="Coding Laptop" />`,
    validationRules: [
      {
        id: 'img_exists',
        description: 'Verify that an <img> tag exists.',
        checkFn: `document.querySelector('img') !== null`,
      },
      {
        id: 'img_src',
        description: 'Verify the src points to the Unsplash photo url.',
        checkFn: `document.querySelector('img')?.getAttribute('src') === 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97'`,
      },
      {
        id: 'img_alt',
        description: 'Verify alt text matches "Coding Laptop".',
        checkFn: `document.querySelector('img')?.getAttribute('alt') === 'Coding Laptop'`,
      },
    ],
    hints: ['An image tag looks like: `<img src="url" alt="description" />`.'],
    published: true,
  }));

  htmlChallenges.push(await Challenge.create({
    moduleId: htmlModule3._id,
    title: 'HTML Tables',
    description: `### HTML Tables\n\nA table is defined with the \`<table>\` tag. Row components are \`<tr>\` and headers are \`<th>\`.\n\n### Objective\nCreate a table with a single header row \`<tr>\` containing two headers (\`<th>\`): \`Technology\` and \`Difficulty\` in that order.`,
    language: 'html',
    difficulty: 'medium',
    xp: 40,
    starterCode: `<!-- Create table below -->\n`,
    solution: `<table>\n  <tr>\n    <th>Technology</th>\n    <th>Difficulty</th>\n  </tr>\n</table>`,
    validationRules: [
      {
        id: 'table_exists',
        description: 'Verify table element exists.',
        checkFn: `document.querySelector('table') !== null`,
      },
      {
        id: 'headers_exist',
        description: 'Verify header elements exist inside a row.',
        checkFn: `document.querySelector('table tr th') !== null`,
      },
      {
        id: 'headers_content',
        description: 'Verify headers read "Technology" and "Difficulty" in order.',
        checkFn: `(() => {
          const headers = Array.from(document.querySelectorAll('table th')).map(el => el.textContent?.trim());
          return headers[0] === 'Technology' && headers[1] === 'Difficulty';
        })()`,
      },
    ],
    hints: ['Structure: `<table> <tr> <th>Header1</th> <th>Header2</th> </tr> </table>`.'],
    published: true,
  }));

  htmlChallenges.push(await Challenge.create({
    moduleId: htmlModule3._id,
    title: 'Textarea Form Fields',
    description: `### Textarea element\n\nA \`<textarea>\` tag defines a multi-line text input control, often used for comments or feedback.\n\n### Objective\nCreate a \`<textarea>\` with \`id\` set to \`feedback-box\`, \`rows\` attribute set to \`4\`, and a \`placeholder\` set to \`Enter your feedback here\`.`,
    language: 'html',
    difficulty: 'easy',
    xp: 20,
    starterCode: `<!-- Add textarea below -->\n`,
    solution: `<textarea id="feedback-box" rows="4" placeholder="Enter your feedback here"></textarea>`,
    validationRules: [
      {
        id: 'textarea_exists',
        description: 'Verify textarea exists.',
        checkFn: `document.querySelector('textarea') !== null`,
      },
      {
        id: 'textarea_attrs',
        description: 'Verify id, rows, and placeholder attributes are set correctly.',
        checkFn: `(() => {
          const el = document.querySelector('textarea#feedback-box');
          return el?.getAttribute('rows') === '4' && el?.getAttribute('placeholder') === 'Enter your feedback here';
        })()`,
      },
    ],
    hints: ['Textarea tags require a closing tag: `<textarea id="box" rows="5"></textarea>`.'],
    published: true,
  }));

  htmlChallenges.push(await Challenge.create({
    moduleId: htmlModule3._id,
    title: 'Radio Buttons',
    description: `### Radio Inputs\n\nRadio inputs allow selecting exactly one option from a group. Group them by giving them the same \`name\` attribute.\n\n### Objective\nCreate two radio buttons with the \`name\` attribute set to \`experience\`. Give the first button the ID \`beginner\` and the second the ID \`pro\`.`,
    language: 'html',
    difficulty: 'medium',
    xp: 40,
    starterCode: `<!-- Add radio buttons below -->\n`,
    solution: `<input type="radio" name="experience" id="beginner" />\n<input type="radio" name="experience" id="pro" />`,
    validationRules: [
      {
        id: 'radios_exist',
        description: 'Verify two radio inputs exist.',
        checkFn: `document.querySelectorAll('input[type="radio"]').length === 2`,
      },
      {
        id: 'radios_name',
        description: 'Verify both radio inputs have name="experience".',
        checkFn: `Array.from(document.querySelectorAll('input[type="radio"]')).every(el => el.getAttribute('name') === 'experience')`,
      },
      {
        id: 'radios_ids',
        description: 'Verify radio buttons have beginner and pro IDs respectively.',
        checkFn: `document.getElementById('beginner') !== null && document.getElementById('pro') !== null`,
      },
    ],
    hints: ['Set `type="radio"` and the same name to enforce mutual exclusivity.'],
    published: true,
  }));

  htmlChallenges.push(await Challenge.create({
    moduleId: htmlModule3._id,
    title: 'Checkboxes',
    description: `### Checkboxes\n\nCheckboxes allow selecting multiple options. The \`checked\` attribute pre-selects the checkbox when loading.\n\n### Objective\nCreate a checkbox input with the \`id\` set to \`terms\` and ensure it is checked by default.`,
    language: 'html',
    difficulty: 'easy',
    xp: 20,
    starterCode: `<!-- Add checkbox below -->\n`,
    solution: `<input type="checkbox" id="terms" checked />`,
    validationRules: [
      {
        id: 'checkbox_exists',
        description: 'Verify checkbox input exists.',
        checkFn: `document.querySelector('input[type="checkbox"]') !== null`,
      },
      {
        id: 'checkbox_id',
        description: 'Verify ID is set to "terms".',
        checkFn: `document.querySelector('input[type="checkbox"]')?.getAttribute('id') === 'terms'`,
      },
      {
        id: 'checkbox_checked',
        description: 'Verify it is checked by default.',
        checkFn: `document.querySelector('input#terms')?.checked === true`,
      },
    ],
    hints: ['Set `type="checkbox"` and add the boolean attribute `checked` inside the input opening tag.'],
    published: true,
  }));

  // ----------------------------------------------------
  // CSS Basics Challenges (11 to 20)
  // ----------------------------------------------------
  console.log('Seeding challenges for CSS Basics...');
  const cssChallenges = [];

  cssChallenges.push(await Challenge.create({
    moduleId: cssModule1._id,
    title: 'Background Styling',
    description: `### CSS Colors & Backgrounds\n\nStyle rules apply CSS properties directly. The \`background-color\` sets elements background, and \`color\` sets the text color.\n\n### Objective\nStyle the \`body\` element to have a background color of dark slate-blue (\`rgb(15, 23, 42)\`) and a text color of white (\`rgb(255, 255, 255)\`).`,
    language: 'css',
    difficulty: 'easy',
    xp: 20,
    starterCode: `<style>\n  body {\n    /* Write your CSS rules here */\n  }\n</style>\n<h1>Styled Document</h1>`,
    solution: `<style>\n  body {\n    background-color: rgb(15, 23, 42);\n    color: rgb(255, 255, 255);\n  }\n</style>\n<h1>Styled Document</h1>`,
    validationRules: [
      {
        id: 'bg_color',
        description: 'Verify body background color is set to rgb(15, 23, 42).',
        checkFn: `window.getComputedStyle(document.body).backgroundColor === 'rgb(15, 23, 42)'`,
      },
      {
        id: 'text_color',
        description: 'Verify body text color is set to white (rgb(255, 255, 255)).',
        checkFn: `window.getComputedStyle(document.body).color === 'rgb(255, 255, 255)'`,
      },
    ],
    hints: ['Write properties inside the body selector block.'],
    published: true,
  }));

  cssChallenges.push(await Challenge.create({
    moduleId: cssModule1._id,
    title: 'The CSS Box Model',
    description: `### The Box Model\n\nEvery HTML element is a box. CSS controls \`width\`, \`height\`, inner spacing (\`padding\`), outer spacing (\`margin\`), and colors.\n\n### Objective\nStyle the \`#box\` element to have:\n* Width and height of \`200px\`\n* Background color set to red (\`rgb(239, 68, 68)\`)\n* Padding of \`20px\`\n* Margin of \`40px\``,
    language: 'css',
    difficulty: 'medium',
    xp: 40,
    starterCode: `<style>\n  #box {\n    /* Style this selector */\n  }\n</style>\n<div id="box">Box</div>`,
    solution: `<style>\n  #box {\n    width: 200px;\n    height: 200px;\n    background-color: rgb(239, 68, 68);\n    padding: 20px;\n    margin: 40px;\n  }\n</style>\n<div id="box">Box</div>`,
    validationRules: [
      {
        id: 'box_exists',
        description: 'Verify that #box exists.',
        checkFn: `document.getElementById('box') !== null`,
      },
      {
        id: 'box_styles',
        description: 'Verify width, height, padding, margin, and red color are applied.',
        checkFn: `(() => {
          const style = window.getComputedStyle(document.getElementById('box'));
          return style.width === '200px' && style.height === '200px' && style.padding === '20px' && style.margin === '40px' && style.backgroundColor === 'rgb(239, 68, 68)';
        })()`,
      },
    ],
    hints: ['Make sure unit "px" is added to numerical values.'],
    published: true,
  }));

  cssChallenges.push(await Challenge.create({
    moduleId: cssModule1._id,
    title: 'Centering with Flexbox',
    description: `### Flexbox Alignment\n\nFlexbox makes centering easy. Set display to \`flex\`, then center horizontally (\`justify-content\`) and vertically (\`align-items\`).\n\n### Objective\nStyle the \`.container\` element using Flexbox to center its child \`.item\` both horizontally and vertically. Set container height to \`100vh\`.`,
    language: 'css',
    difficulty: 'medium',
    xp: 40,
    starterCode: `<style>\n  .container {\n    height: 100vh;\n    /* Use Flexbox to center items */\n  }\n  .item {\n    width: 60px;\n    height: 60px;\n    background-color: rgb(59, 130, 246);\n  }\n</style>\n<div class="container">\n  <div class="item"></div>\n</div>`,
    solution: `<style>\n  .container {\n    height: 100vh;\n    display: flex;\n    justify-content: center;\n    align-items: center;\n  }\n  .item {\n    width: 60px;\n    height: 60px;\n    background-color: rgb(59, 130, 246);\n  }\n</style>\n<div class="container">\n  <div class="item"></div>\n</div>`,
    validationRules: [
      {
        id: 'flex_display',
        description: 'Verify display is set to flex.',
        checkFn: `window.getComputedStyle(document.querySelector('.container')).display === 'flex'`,
      },
      {
        id: 'flex_alignment',
        description: 'Verify flex alignment is centered horizontally and vertically.',
        checkFn: `(() => {
          const style = window.getComputedStyle(document.querySelector('.container'));
          return style.justifyContent === 'center' && style.alignItems === 'center';
        })()`,
      },
    ],
    hints: ['Use: `display: flex; justify-content: center; align-items: center;`.'],
    published: true,
  }));

  cssChallenges.push(await Challenge.create({
    moduleId: cssModule2._id,
    title: 'Font Styling',
    description: `### CSS Typography\n\nTypography properties control sizing (\`font-size\`), weights (\`font-weight\`), and color values.\n\n### Objective\nStyle the paragraph with ID \`styled-text\` to have font-size \`24px\`, font-weight \`bold\`, and color set to blue (\`rgb(59, 130, 246)\`).`,
    language: 'css',
    difficulty: 'easy',
    xp: 20,
    starterCode: `<style>\n  #styled-text {\n    /* Style this selector */\n  }\n</style>\n<p id="styled-text">Styled text</p>`,
    solution: `<style>\n  #styled-text {\n    font-size: 24px;\n    font-weight: bold;\n    color: rgb(59, 130, 246);\n  }\n</style>\n<p id="styled-text">Styled text</p>`,
    validationRules: [
      {
        id: 'font_size',
        description: 'Verify font-size is 24px.',
        checkFn: `window.getComputedStyle(document.getElementById('styled-text')).fontSize === '24px'`,
      },
      {
        id: 'font_weight',
        description: 'Verify font-weight is bold.',
        checkFn: `(() => {
          const fw = window.getComputedStyle(document.getElementById('styled-text')).fontWeight;
          return fw === 'bold' || fw === '700';
        })()`,
      },
      {
        id: 'font_color',
        description: 'Verify color is blue rgb(59, 130, 246).',
        checkFn: `window.getComputedStyle(document.getElementById('styled-text')).color === 'rgb(59, 130, 246)'`,
      },
    ],
    hints: ['Target ID: `#styled-text` and write `font-size: 24px; font-weight: bold; color: rgb(59, 130, 246);`.'],
    published: true,
  }));

  cssChallenges.push(await Challenge.create({
    moduleId: cssModule2._id,
    title: 'Border Radius',
    description: `### Border Radius\n\nThe \`border-radius\` property rounds the corners of element borders. \`border: none\` removes outlines.\n\n### Objective\nStyle the button element with class \`.btn\` to have a border-radius of \`12px\` and border styled to \`none\`.`,
    language: 'css',
    difficulty: 'easy',
    xp: 20,
    starterCode: `<style>\n  .btn {\n    padding: 10px 20px;\n    background-color: rgb(79, 70, 229);\n    color: white;\n    /* Style here */\n  }\n</style>\n<button class="btn">Click</button>`,
    solution: `<style>\n  .btn {\n    padding: 10px 20px;\n    background-color: rgb(79, 70, 229);\n    color: white;\n    border-radius: 12px;\n    border: none;\n  }\n</style>\n<button class="btn">Click</button>`,
    validationRules: [
      {
        id: 'btn_radius',
        description: 'Verify border-radius is 12px.',
        checkFn: `window.getComputedStyle(document.querySelector('.btn')).borderRadius === '12px'`,
      },
      {
        id: 'btn_border',
        description: 'Verify border is none.',
        checkFn: `window.getComputedStyle(document.querySelector('.btn')).borderStyle === 'none'`,
      },
    ],
    hints: ['Use `border-radius: 12px;` and `border: none;` inside the `.btn` CSS class.'],
    published: true,
  }));

  cssChallenges.push(await Challenge.create({
    moduleId: cssModule2._id,
    title: 'Text Alignment & Transformation',
    description: `### Text formatting\n\n\`text-align\` controls horizontal spacing. \`text-transform: uppercase\` converts text string characters to capital letters.\n\n### Objective\nStyle the heading with class \`.title\` to center align text horizontally, and uppercase all letters.`,
    language: 'css',
    difficulty: 'easy',
    xp: 20,
    starterCode: `<style>\n  .title {\n    /* Style here */\n  }\n</style>\n<h2 class="title">title</h2>`,
    solution: `<style>\n  .title {\n    text-align: center;\n    text-transform: uppercase;\n  }\n</style>\n<h2 class="title">title</h2>`,
    validationRules: [
      {
        id: 'title_align',
        description: 'Verify text-align is center.',
        checkFn: `window.getComputedStyle(document.querySelector('.title')).textAlign === 'center'`,
      },
      {
        id: 'title_transform',
        description: 'Verify text-transform is uppercase.',
        checkFn: `window.getComputedStyle(document.querySelector('.title')).textTransform === 'uppercase'`,
      },
    ],
    hints: ['Add properties: `text-align: center; text-transform: uppercase;`.'],
    published: true,
  }));

  cssChallenges.push(await Challenge.create({
    moduleId: cssModule3._id,
    title: 'CSS Grid Layout',
    description: `### CSS Grid\n\nGrid layout splits web pages into rows and columns. Use \`repeat()\` to declare repeat patterns.\n\n### Objective\nSet the \`.grid-container\` element to grid display and define a 3-column layout of equal width fraction (\`1fr\`).`,
    language: 'css',
    difficulty: 'medium',
    xp: 40,
    starterCode: `<style>\n  .grid-container {\n    /* Style grid layout */\n  }\n</style>\n<div class="grid-container"><div>1</div><div>2</div><div>3</div></div>`,
    solution: `<style>\n  .grid-container {\n    display: grid;\n    grid-template-columns: repeat(3, 1fr);\n  }\n</style>\n<div class="grid-container"><div>1</div><div>2</div><div>3</div></div>`,
    validationRules: [
      {
        id: 'grid_display',
        description: 'Verify display is grid.',
        checkFn: `window.getComputedStyle(document.querySelector('.grid-container')).display === 'grid'`,
      },
      {
        id: 'grid_columns',
        description: 'Verify grid has exactly 3 template columns.',
        checkFn: `(() => {
          const colStr = window.getComputedStyle(document.querySelector('.grid-container')).gridTemplateColumns;
          return colStr.split(' ').length === 3;
        })()`,
      },
    ],
    hints: ['Apply `display: grid; grid-template-columns: repeat(3, 1fr);`.'],
    published: true,
  }));

  cssChallenges.push(await Challenge.create({
    moduleId: cssModule3._id,
    title: 'Absolute Positioning',
    description: `### Relative & Absolute Layouts\n\nAn absolutely positioned element is placed relative to its closest positioned parent. Give parent \`position: relative\` and child \`position: absolute\`.\n\n### Objective\nStyle parent \`#parent\` relative. Place child \`#child\` absolutely with top offset \`10px\` and right offset \`20px\`.`,
    language: 'css',
    difficulty: 'medium',
    xp: 40,
    starterCode: `<style>\n  #parent {\n    width: 300px; height: 300px; background-color: rgb(243, 244, 246);\n    /* Style parent position */\n  }\n  #child {\n    width: 50px; height: 50px; background-color: rgb(239, 68, 68);\n    /* Style child position */\n  }\n</style>\n<div id="parent"><div id="child"></div></div>`,
    solution: `<style>\n  #parent {\n    width: 300px; height: 300px; background-color: rgb(243, 244, 246);\n    position: relative;\n  }\n  #child {\n    width: 50px; height: 50px; background-color: rgb(239, 68, 68);\n    position: absolute;\n    top: 10px;\n    right: 20px;\n  }\n</style>\n<div id="parent"><div id="child"></div></div>`,
    validationRules: [
      {
        id: 'parent_position',
        description: 'Verify parent has relative position.',
        checkFn: `window.getComputedStyle(document.getElementById('parent')).position === 'relative'`,
      },
      {
        id: 'child_position',
        description: 'Verify child has absolute position.',
        checkFn: `window.getComputedStyle(document.getElementById('child')).position === 'absolute'`,
      },
      {
        id: 'child_offsets',
        description: 'Verify child top is 10px and right is 20px.',
        checkFn: `(() => {
          const s = window.getComputedStyle(document.getElementById('child'));
          return s.top === '10px' && s.right === '20px';
        })()`,
      },
    ],
    hints: ['Make sure to declare position relative on parent first.'],
    published: true,
  }));

  cssChallenges.push(await Challenge.create({
    moduleId: cssModule3._id,
    title: 'Hover Transitions',
    description: `### Transition Effects\n\nTransitions allow property changes to happen smoothly over time. \`transition: background-color 0.3s ease\` creates a hover fade effect.\n\n### Objective\nGive box class \`.box\` a background-color transition of duration \`0.3s\`. On hover, change background color from blue (\`rgb(59, 130, 246)\`) to green (\`rgb(34, 197, 94)\`).`,
    language: 'css',
    difficulty: 'medium',
    xp: 40,
    starterCode: `<style>\n  .box {\n    width: 100px; height: 100px; background-color: rgb(59, 130, 246);\n    /* Add transition here */\n  }\n  .box:hover {\n    /* Add hover state here */\n  }\n</style>\n<div class="box"></div>`,
    solution: `<style>\n  .box {\n    width: 100px; height: 100px; background-color: rgb(59, 130, 246);\n    transition: background-color 0.3s ease;\n  }\n  .box:hover {\n    background-color: rgb(34, 197, 94);\n  }\n</style>\n<div class="box"></div>`,
    validationRules: [
      {
        id: 'box_transition',
        description: 'Verify transition is configured for background-color.',
        checkFn: `(() => {
          const s = window.getComputedStyle(document.querySelector('.box'));
          return s.transitionProperty.includes('background-color') || s.transition.includes('background-color');
        })()`,
      },
    ],
    hints: ['In `.box:hover` selector block, set the green background color.'],
    published: true,
  }));

  cssChallenges.push(await Challenge.create({
    moduleId: cssModule3._id,
    title: 'Box Shadow Effects',
    description: `### Drop Shadows\n\n\`box-shadow\` adds shadows. Values define offset-x, offset-y, blur-radius, and color.\n\n### Objective\nApply a box-shadow of \`0px 4px 6px rgba(0, 0, 0, 0.1)\` to the card class \`.card\`.`,
    language: 'css',
    difficulty: 'easy',
    xp: 20,
    starterCode: `<style>\n  .card {\n    width: 200px; height: 200px; border: 1px solid #ddd;\n    /* Add shadow here */\n  }\n</style>\n<div class="card">Card</div>`,
    solution: `<style>\n  .card {\n    width: 200px; height: 200px; border: 1px solid #ddd;\n    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);\n  }\n</style>\n<div class="card">Card</div>`,
    validationRules: [
      {
        id: 'card_shadow',
        description: 'Verify box-shadow style is applied to the card.',
        checkFn: `window.getComputedStyle(document.querySelector('.card')).boxShadow !== 'none'`,
      },
    ],
    hints: ['Set `box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);` inside the `.card` selector block.'],
    published: true,
  }));

  // ----------------------------------------------------
  // JavaScript Basics Challenges (21 to 30)
  // ----------------------------------------------------
  console.log('Seeding challenges for JavaScript Basics...');
  const jsChallenges = [];

  jsChallenges.push(await Challenge.create({
    moduleId: jsModule1._id,
    title: 'Button Click Counter',
    description: `### JS Click Events\n\nJavaScript responds to user clicks via click listeners. Increment text representation values of target paragraph IDs.\n\n### Objective\nIncrement the text of counter paragraph \`#counter\` by 1 on every click of button \`#btn\`.`,
    language: 'javascript',
    difficulty: 'medium',
    xp: 40,
    starterCode: `<button id="btn">Click me</button>\n<p id="counter">0</p>\n<script>\n  const btn = document.getElementById('btn');\n  const counter = document.getElementById('counter');\n  // Add click listener and increment logic here\n</script>`,
    solution: `<button id="btn">Click me</button>\n<p id="counter">0</p>\n<script>\n  const btn = document.getElementById('btn');\n  const counter = document.getElementById('counter');\n  let val = 0;\n  btn.addEventListener('click', () => {\n    val++;\n    counter.textContent = val;\n  });\n</script>`,
    validationRules: [
      {
        id: 'btn_counter_exists',
        description: 'Verify #btn and #counter exist.',
        checkFn: `document.getElementById('btn') !== null && document.getElementById('counter') !== null`,
      },
      {
        id: 'counter_increments',
        description: 'Verify clicking button increments counter text.',
        checkFn: `(() => {
          const btn = document.getElementById('btn');
          const counter = document.getElementById('counter');
          counter.textContent = '0';
          btn.click();
          if (counter.textContent.trim() !== '1') return false;
          btn.click();
          return counter.textContent.trim() === '2';
        })()`,
      },
    ],
    hints: ['Maintain an integer variable and update `textContent` inside `addEventListener("click", ...)`.'],
    published: true,
  }));

  jsChallenges.push(await Challenge.create({
    moduleId: jsModule1._id,
    title: 'Color Toggle Panel',
    description: `### Inline styles\n\nJavaScript modifies CSS style directly using the \`style\` property.\n\n### Objective\nToggle the background color of \`#box\` between red (\`rgb(255, 0, 0)\`) and blue (\`rgb(0, 0, 255)\`) on every click of the box itself.`,
    language: 'javascript',
    difficulty: 'hard',
    xp: 80,
    starterCode: `<div id="box" style="background-color: rgb(255, 0, 0); padding: 20px; color: white;">Color Box</div>\n<script>\n  const box = document.getElementById('box');\n  // Add click listener to toggle background-color\n</script>`,
    solution: `<div id="box" style="background-color: rgb(255, 0, 0); padding: 20px; color: white;">Color Box</div>\n<script>\n  const box = document.getElementById('box');\n  box.addEventListener('click', () => {\n    const current = window.getComputedStyle(box).backgroundColor;\n    if (current === 'rgb(255, 0, 0)' || current === 'red') {\n      box.style.backgroundColor = 'rgb(0, 0, 255)';\n    } else {\n      box.style.backgroundColor = 'rgb(255, 0, 0)';\n    }\n  });\n</script>`,
    validationRules: [
      {
        id: 'box_color_toggle',
        description: 'Verify clicking #box toggles its background color between red and blue.',
        checkFn: `(() => {
          const box = document.getElementById('box');
          box.style.backgroundColor = 'rgb(255, 0, 0)';
          box.click();
          const first = window.getComputedStyle(box).backgroundColor;
          box.click();
          const second = window.getComputedStyle(box).backgroundColor;
          return first === 'rgb(0, 0, 255)' && second === 'rgb(255, 0, 0)';
        })()`,
      },
    ],
    hints: ['Check current computed background color and toggle value inside a click handler.'],
    published: true,
  }));

  jsChallenges.push(await Challenge.create({
    moduleId: jsModule1._id,
    title: 'Form Value Greeting',
    description: `### Form Value manipulation\n\nAccess text input values using \`input.value\` and greet users dynamically.\n\n### Objective\nCreate an input \`#name-input\`, button \`#greet-btn\`, and paragraph \`#greeting-msg\`. Clicking the button sets the paragraph text content to \`Hello, [name]!\`.`,
    language: 'javascript',
    difficulty: 'medium',
    xp: 40,
    starterCode: `<input id="name-input" placeholder="Name" />\n<button id="greet-btn">Greet</button>\n<p id="greeting-msg"></p>\n<script>\n  // Add click listener to set greeting message\n</script>`,
    solution: `<input id="name-input" placeholder="Name" />\n<button id="greet-btn">Greet</button>\n<p id="greeting-msg"></p>\n<script>\n  const input = document.getElementById('name-input');\n  const btn = document.getElementById('greet-btn');\n  const msg = document.getElementById('greeting-msg');\n  btn.addEventListener('click', () => {\n    msg.textContent = 'Hello, ' + input.value + '!';\n  });\n</script>`,
    validationRules: [
      {
        id: 'greet_flow',
        description: 'Verify entering input and clicking button generates the correct greeting.',
        checkFn: `(() => {
          const inp = document.getElementById('name-input');
          const btn = document.getElementById('greet-btn');
          const msg = document.getElementById('greeting-msg');
          inp.value = 'Alice';
          btn.click();
          return msg.textContent.trim() === 'Hello, Alice!';
        })()`,
      },
    ],
    hints: ['Get input value string inside click callback, concatenate with "Hello, " and "!" and update textContent.'],
    published: true,
  }));

  jsChallenges.push(await Challenge.create({
    moduleId: jsModule2._id,
    title: 'Show and Hide Modal',
    description: `### Toggling visibility\n\nToggle element displays between \`none\` and visible blocks using element inline styles.\n\n### Objective\nToggle modal div \`#modal\` visibility (between display \`none\` and display \`block\`) when clicking \`#toggle-btn\`.`,
    language: 'javascript',
    difficulty: 'medium',
    xp: 40,
    starterCode: `<div id="modal">Modal Content</div>\n<button id="toggle-btn">Toggle</button>\n<script>\n  // Add toggle logic here\n</script>`,
    solution: `<div id="modal">Modal Content</div>\n<button id="toggle-btn">Toggle</button>\n<script>\n  const modal = document.getElementById('modal');\n  const btn = document.getElementById('toggle-btn');\n  btn.addEventListener('click', () => {\n    if (modal.style.display === 'none') {\n      modal.style.display = 'block';\n    } else {\n      modal.style.display = 'none';\n    }\n  });\n</script>`,
    validationRules: [
      {
        id: 'modal_toggle',
        description: 'Verify modal displays toggle between none and block on click.',
        checkFn: `(() => {
          const m = document.getElementById('modal');
          const b = document.getElementById('toggle-btn');
          m.style.display = 'block';
          b.click();
          const hidden = m.style.display === 'none';
          b.click();
          const visible = m.style.display === 'block';
          return hidden && visible;
        })()`,
      },
    ],
    hints: ['Check if `modal.style.display === "none"` and change it to "block", else change to "none".'],
    published: true,
  }));

  jsChallenges.push(await Challenge.create({
    moduleId: jsModule2._id,
    title: 'Array Items Renderer',
    description: `### DOM Element Creation\n\nUse \`document.createElement()\` and list appends to output array values to lists dynamically.\n\n### Objective\nPopulate list \`#tags-list\` with \`<li>\` elements containing tag array names (\`React\`, \`Next.js\`, \`Vite\`) in that order.`,
    language: 'javascript',
    difficulty: 'medium',
    xp: 40,
    starterCode: `<ul id="tags-list"></ul>\n<script>\n  const tags = ['React', 'Next.js', 'Vite'];\n  const list = document.getElementById('tags-list');\n  // Render list items here\n</script>`,
    solution: `<ul id="tags-list"></ul>\n<script>\n  const tags = ['React', 'Next.js', 'Vite'];\n  const list = document.getElementById('tags-list');\n  tags.forEach(tag => {\n    const li = document.createElement('li');\n    li.textContent = tag;\n    list.appendChild(li);\n  });\n</script>`,
    validationRules: [
      {
        id: 'tags_rendered',
        description: 'Verify exactly 3 li elements containing array tag contents are appended.',
        checkFn: `(() => {
          const list = document.getElementById('tags-list');
          const lis = list.querySelectorAll('li');
          if (lis.length !== 3) return false;
          return lis[0].textContent.trim() === 'React' && lis[1].textContent.trim() === 'Next.js' && lis[2].textContent.trim() === 'Vite';
        })()`,
      },
    ],
    hints: ['Iterate through the array using `forEach`, create list item elements, set text content, and append.'],
    published: true,
  }));

  jsChallenges.push(await Challenge.create({
    moduleId: jsModule2._id,
    title: 'Celsius to Fahrenheit Converter',
    description: `### Numeric Input Calculations\n\nRead numerical user values, perform conversions, and print results to the DOM.\n\n### Objective\nRead Celsius value from \`#celsius-input\` on click of \`#calc-btn\`, and render converted Fahrenheit (\`Celsius * 9/5 + 32\`) inside \`#result\`.`,
    language: 'javascript',
    difficulty: 'medium',
    xp: 40,
    starterCode: `<input id="celsius-input" type="number" value="0" />\n<button id="calc-btn">Convert</button>\n<p id="result"></p>\n<script>\n  // Conversion logic\n</script>`,
    solution: `<input id="celsius-input" type="number" value="0" />\n<button id="calc-btn">Convert</button>\n<p id="result"></p>\n<script>\n  const cInput = document.getElementById('celsius-input');\n  const btn = document.getElementById('calc-btn');\n  const res = document.getElementById('result');\n  btn.addEventListener('click', () => {\n    const c = parseFloat(cInput.value);\n    res.textContent = String(c * 9/5 + 32);\n  });\n</script>`,
    validationRules: [
      {
        id: 'temp_conversion',
        description: 'Verify 25 Celsius yields 77 Fahrenheit, and 0 Celsius yields 32 Fahrenheit.',
        checkFn: `(() => {
          const inp = document.getElementById('celsius-input');
          const btn = document.getElementById('calc-btn');
          const res = document.getElementById('result');
          inp.value = '25';
          btn.click();
          if (res.textContent.trim() !== '77') return false;
          inp.value = '0';
          btn.click();
          return res.textContent.trim() === '32';
        })()`,
      },
    ],
    hints: ['Parse input value using `parseFloat`, calculate temperature in Fahrenheit, and store as string.'],
    published: true,
  }));

  jsChallenges.push(await Challenge.create({
    moduleId: jsModule3._id,
    title: 'Toggle Class Name',
    description: `### Class Lists manipulation\n\n\`classList.toggle('className')\` adds classes if missing and removes them if present.\n\n### Objective\nToggle the CSS class \`active\` on element \`#box\` when it is clicked.`,
    language: 'javascript',
    difficulty: 'easy',
    xp: 20,
    starterCode: `<style>.active { border: 2px solid black; }</style>\n<div id="box">Click me</div>\n<script>\n  // Toggle class\n</script>`,
    solution: `<div id="box">Click me</div>\n<script>\n  const box = document.getElementById('box');\n  box.addEventListener('click', () => {\n    box.classList.toggle('active');\n  });\n</script>`,
    validationRules: [
      {
        id: 'class_toggled',
        description: 'Verify class active toggles on box clicks.',
        checkFn: `(() => {
          const box = document.getElementById('box');
          box.classList.remove('active');
          box.click();
          const first = box.classList.contains('active');
          box.click();
          const second = !box.classList.contains('active');
          return first && second;
        })()`,
      },
    ],
    hints: ['Add click event listener to `#box` and call `box.classList.toggle("active")`.'],
    published: true,
  }));

  jsChallenges.push(await Challenge.create({
    moduleId: jsModule3._id,
    title: 'Simple Timer Countdown',
    description: `### Timed intervals\n\n\`setInterval\` schedules periodic executions. Countdown numbers and clear intervals when limits are reached.\n\n### Objective\nDecrement span \`#timer\` from \`10\` to \`0\` by 1 every 10ms after clicking button \`#start-btn\`.`,
    language: 'javascript',
    difficulty: 'hard',
    xp: 80,
    starterCode: `<button id="start-btn">Start</button>\n<span id="timer">10</span>\n<script>\n  // Countdown logic\n</script>`,
    solution: `<button id="start-btn">Start</button>\n<span id="timer">10</span>\n<script>\n  const btn = document.getElementById('start-btn');\n  const timer = document.getElementById('timer');\n  btn.addEventListener('click', () => {\n    let val = 10;\n    const id = setInterval(() => {\n      val--;\n      timer.textContent = val;\n      if (val === 0) clearInterval(id);\n    }, 10);\n  });\n</script>`,
    validationRules: [
      {
        id: 'timer_countdown',
        description: 'Verify countdown reaches 0 after starting.',
        checkFn: `(() => {
          const btn = document.getElementById('start-btn');
          const timer = document.getElementById('timer');
          const oldInterval = window.setInterval;
          let intervalCb = null;
          window.setInterval = (cb, delay) => {
            intervalCb = cb;
            return 123;
          };
          btn.click();
          window.setInterval = oldInterval;
          if (!intervalCb) return false;
          for (let i = 0; i < 10; i++) {
            intervalCb();
          }
          return timer.textContent.trim() === '0';
        })()`,
      },
    ],
    hints: ['Capture setInterval callback, decrement variable value, clear interval using `clearInterval(id)` when 0.'],
    published: true,
  }));

  jsChallenges.push(await Challenge.create({
    moduleId: jsModule3._id,
    title: 'Filter List Items',
    description: `### Text Input Search Filtering\n\nHide list element containers matching search filters dynamically using display styles.\n\n### Objective\nHide list items with class \`.item\` (set display to \`none\`) if they do not contain input value text of \`#search-input\`.`,
    language: 'javascript',
    difficulty: 'hard',
    xp: 80,
    starterCode: `<input id="search-input" />\n<ul><li class="item">Apple</li><li class="item">Banana</li><li class="item">Cherry</li></ul>\n<script>\n  // Filter items on input event\n</script>`,
    solution: `<input id="search-input" />\n<ul><li class="item">Apple</li><li class="item">Banana</li><li class="item">Cherry</li></ul>\n<script>\n  const input = document.getElementById('search-input');\n  const items = document.querySelectorAll('.item');\n  input.addEventListener('input', () => {\n    const text = input.value.toLowerCase();\n    items.forEach(item => {\n      if (item.textContent.toLowerCase().includes(text)) {\n        item.style.display = 'block';\n      } else {\n        item.style.display = 'none';\n      }\n    });\n  });\n</script>`,
    validationRules: [
      {
        id: 'items_filtered',
        description: 'Verify input filters items correctly.',
        checkFn: `(() => {
          const input = document.getElementById('search-input');
          const items = Array.from(document.querySelectorAll('.item'));
          input.value = 'ban';
          input.dispatchEvent(new Event('input'));
          const visible = items.filter(el => el.style.display !== 'none');
          return visible.length === 1 && visible[0].textContent.trim() === 'Banana';
        })()`,
      },
    ],
    hints: ['Add an event listener to `input` event, lowercase search query text, check element contents.'],
    published: true,
  }));

  jsChallenges.push(await Challenge.create({
    moduleId: jsModule3._id,
    title: 'Local Storage Storage',
    description: `### Web Storage API\n\n\`localStorage.setItem(key, value)\` saves values inside the web browser across page reloads.\n\n### Objective\nSave input value \`#settings-input\` inside \`localStorage\` key \`user_settings\` when clicking button \`#save-btn\`.`,
    language: 'javascript',
    difficulty: 'medium',
    xp: 40,
    starterCode: `<input id="settings-input" />\n<button id="save-btn">Save</button>\n<script>\n  // Save to localStorage\n</script>`,
    solution: `<input id="settings-input" />\n<button id="save-btn">Save</button>\n<script>\n  const input = document.getElementById('settings-input');\n  const btn = document.getElementById('save-btn');\n  btn.addEventListener('click', () => {\n    localStorage.setItem('user_settings', input.value);\n  });\n</script>`,
    validationRules: [
      {
        id: 'saved_storage',
        description: 'Verify saving input value writes it to localStorage.',
        checkFn: `(() => {
          const input = document.getElementById('settings-input');
          const btn = document.getElementById('save-btn');
          localStorage.removeItem('user_settings');
          input.value = 'DarkTheme';
          btn.click();
          return localStorage.getItem('user_settings') === 'DarkTheme';
        })()`,
      },
    ],
    hints: ['Access input value on click and call `localStorage.setItem("user_settings", value)`.'],
    published: true,
  }));

  // Link Web Dev challenges sequentially
  const webChallenges = [...htmlChallenges, ...cssChallenges, ...jsChallenges];
  for (let i = 0; i < webChallenges.length - 1; i++) {
    webChallenges[i].nextChallengeId = webChallenges[i + 1]._id;
    await webChallenges[i].save();
  }
  await webChallenges[webChallenges.length - 1].save();
  console.log(`Seeded ${webChallenges.length} Web Dev challenges.`);


  // ----------------------------------------------------
  // Learning Path 2: Python Programming
  // ----------------------------------------------------
  console.log('Seeding Course: Python Programming...');
  const pythonCourse = await Course.create({
    title: 'Python Programming',
    slug: 'python',
    description: 'Learn logic, data structures, and object-oriented Python executing entirely inside your browser.',
    icon: 'Terminal',
    order: 2,
    published: true,
  });

  console.log('Seeding Modules for Python Programming...');
  const pyBasicsModule1 = await Module.create({
    title: 'Python Introduction',
    description: 'Get started with print statements, variables, and basic arithmetic functions.',
    courseId: pythonCourse._id,
    order: 1,
  });
  const pyBasicsModule2 = await Module.create({
    title: 'Python Control Flow & Loops',
    description: 'Learn conditionals, list loops, and string reversing/slicing.',
    courseId: pythonCourse._id,
    order: 2,
  });
  const pyBasicsModule3 = await Module.create({
    title: 'Python Functions & Logic',
    description: 'Master counting vowels, recursive factorials, maximum list searches, and temperature calculations.',
    courseId: pythonCourse._id,
    order: 3,
  });

  const pyOopModule1 = await Module.create({
    title: 'Python Data Structures',
    description: 'Check palindromes, calculate word frequencies, and write list comprehensions.',
    courseId: pythonCourse._id,
    order: 4,
  });
  const pyOopModule2 = await Module.create({
    title: 'Python OOP Basics',
    description: 'Create classes with constructors, handle divide errors, and filter duplicates.',
    courseId: pythonCourse._id,
    order: 5,
  });
  const pyOopModule3 = await Module.create({
    title: 'Python Advanced OOP & Algorithms',
    description: 'Find unique words, merge dictionaries, inherit classes, and validate IP addresses.',
    courseId: pythonCourse._id,
    order: 6,
  });

  // ----------------------------------------------------
  // Python Basics Challenges (1 to 10)
  // ----------------------------------------------------
  console.log('Seeding challenges for Python Basics...');
  const pyBasicsChallenges = [];

  pyBasicsChallenges.push(await Challenge.create({
    moduleId: pyBasicsModule1._id,
    title: 'Hello Python',
    description: `### Print Statement\n\nThe \`print()\` function outputs messages to stdout.\n\n### Objective\nWrite a Python program that prints exactly the string \`Hello, World!\` to stdout.`,
    language: 'python',
    difficulty: 'easy',
    xp: 20,
    starterCode: `# Write your python code below\n`,
    solution: `print("Hello, World!")`,
    validationRules: [
      {
        id: 'print_output',
        description: 'Verify stdout matches "Hello, World!"',
        checkFn: `assert __output__.strip() == "Hello, World!", "Expected output to be exactly 'Hello, World!'"`,
      },
    ],
    hints: ['Use `print("Hello, World!")`.'],
    published: true,
  }));

  pyBasicsChallenges.push(await Challenge.create({
    moduleId: pyBasicsModule1._id,
    title: 'Sum of Variables',
    description: `### Variables\n\nVariables store data values. In Python, variables are initialized when values are assigned.\n\n### Objective\nCreate variable \`a\` with value \`10\`, variable \`b\` with value \`20\`, and print their sum.`,
    language: 'python',
    difficulty: 'easy',
    xp: 20,
    starterCode: `# Declare a and b and print their sum\n`,
    solution: `a = 10\nb = 20\nprint(a + b)`,
    validationRules: [
      {
        id: 'variable_sum',
        description: 'Verify stdout displays the sum 30.',
        checkFn: `assert __output__.strip() == "30", "Expected stdout to print '30'"`,
      },
      {
        id: 'variable_definitions',
        description: 'Verify variables a and b equal 10 and 20 respectively.',
        checkFn: `assert a == 10 and b == 20, "Variables a and b must be set to 10 and 20"`,
      },
    ],
    hints: ['Set `a = 10` and `b = 20` on separate lines, then print their sum.'],
    published: true,
  }));

  pyBasicsChallenges.push(await Challenge.create({
    moduleId: pyBasicsModule1._id,
    title: 'Define an Addition Function',
    description: `### Functions\n\nFunctions return data results using the \`return\` keyword.\n\n### Objective\nCreate function \`add(x, y)\` that returns the sum of \`x\` and \`y\`.`,
    language: 'python',
    difficulty: 'easy',
    xp: 20,
    starterCode: `def add(x, y):\n    # Write your return statement here\n    pass\n\n# Test your function:\nprint("add(5, 3) =", add(5, 3))`,
    solution: `def add(x, y):\n    return x + y\n\n# Test your function:\nprint("add(5, 3) =", add(5, 3))`,
    validationRules: [
      {
        id: 'add_exists',
        description: 'Verify function "add" is defined.',
        checkFn: `assert 'add' in globals() and callable(add), "Function 'add' must be defined."`,
      },
      {
        id: 'add_cases',
        description: 'Verify add(2, 3) yields 5 and add(-1, 1) yields 0.',
        checkFn: `assert add(2, 3) == 5 and add(-1, 1) == 0, "add(x, y) logic incorrect"`,
      },
    ],
    hints: ['Replace \`pass\` with \`return x + y\`.'],
    published: true,
  }));

  pyBasicsChallenges.push(await Challenge.create({
    moduleId: pyBasicsModule2._id,
    title: 'Even or Odd',
    description: `### Conditionals\n\nThe modulo operator \`%\` returns division remainders. Use \`if-else\` statements for logical branching.\n\n### Objective\nDefine function \`is_even(n)\` that returns \`True\` if \`n\` is an even integer, else \`False\`.`,
    language: 'python',
    difficulty: 'easy',
    xp: 20,
    starterCode: `def is_even(n):\n    # Return True if n is even, else False\n    pass\n\n# Test your function:\nprint("is_even(4) =", is_even(4))\nprint("is_even(7) =", is_even(7))`,
    solution: `def is_even(n):\n    return n % 2 == 0\n\n# Test your function:\nprint("is_even(4) =", is_even(4))\nprint("is_even(7) =", is_even(7))`,
    validationRules: [
      {
        id: 'is_even_exists',
        description: 'Verify is_even function is defined.',
        checkFn: `assert 'is_even' in globals() and callable(is_even), "Function is_even must be defined"`,
      },
      {
        id: 'is_even_logic',
        description: 'Verify output logic for 4 and 7.',
        checkFn: `assert is_even(4) is True and is_even(7) is False, "is_even logic incorrect"`,
      },
    ],
    hints: ['A number is even if dividing by 2 leaves remainder 0 (\`n % 2 == 0\`).'],
    published: true,
  }));

  pyBasicsChallenges.push(await Challenge.create({
    moduleId: pyBasicsModule2._id,
    title: 'Summing a List',
    description: `### List Iterations\n\nIterate list values using \`for\` loops.\n\n### Objective\nDefine function \`sum_list(lst)\` that sums all numbers in the list. **Do not use the built-in \`sum()\` function.**`,
    language: 'python',
    difficulty: 'medium',
    xp: 40,
    starterCode: `def sum_list(lst):\n    # Loop and aggregate list values without sum()\n    pass\n\n# Test your function:\nprint("sum_list([1, 2, 3]) =", sum_list([1, 2, 3]))`,
    solution: `def sum_list(lst):\n    total = 0\n    for x in lst:\n        total += x\n    return total\n\n# Test your function:\nprint("sum_list([1, 2, 3]) =", sum_list([1, 2, 3]))`,
    validationRules: [
      {
        id: 'sum_list_exists',
        description: 'Verify function exists.',
        checkFn: `assert 'sum_list' in globals(), "Function sum_list must be defined"`,
      },
      {
        id: 'sum_list_logic',
        description: 'Verify list aggregation values.',
        checkFn: `assert sum_list([1, 2, 3]) == 6 and sum_list([]) == 0, "sum_list logic incorrect"`,
      },
    ],
    hints: ['Initialize running total variable to 0, loop and append, then return total.'],
    published: true,
  }));

  pyBasicsChallenges.push(await Challenge.create({
    moduleId: pyBasicsModule2._id,
    title: 'String Reverse',
    description: `### String Slicing\n\nSlicing formats like \`s[::-1]\` reverse string values in Python.\n\n### Objective\nDefine function \`reverse_string(s)\` that returns the reversed representation of string \`s\`.`,
    language: 'python',
    difficulty: 'easy',
    xp: 20,
    starterCode: `def reverse_string(s):\n    # Return reversed string\n    pass\n\n# Test your function:\nprint("reverse_string('hello') =", reverse_string('hello'))`,
    solution: `def reverse_string(s):\n    return s[::-1]\n\n# Test your function:\nprint("reverse_string('hello') =", reverse_string('hello'))`,
    validationRules: [
      {
        id: 'reverse_string_exists',
        description: 'Verify reverse_string function exists.',
        checkFn: `assert 'reverse_string' in globals(), "Define reverse_string"`,
      },
      {
        id: 'reverse_string_logic',
        description: 'Verify reversing apple yields elppa.',
        checkFn: `assert reverse_string('apple') == 'elppa', "reverse_string logic incorrect"`,
      },
    ],
    hints: ['Return `s[::-1]`.'],
    published: true,
  }));

  pyBasicsChallenges.push(await Challenge.create({
    moduleId: pyBasicsModule3._id,
    title: 'Count Vowels',
    description: `### Character filtering\n\nCheck elements memberships using \`in\` queries.\n\n### Objective\nDefine function \`count_vowels(s)\` that counts vowels (\`a, e, i, o, u\`, case-insensitive) in string \`s\`.`,
    language: 'python',
    difficulty: 'medium',
    xp: 40,
    starterCode: `def count_vowels(s):\n    # Count vowels in s\n    pass\n\n# Test your function:\nprint("count_vowels('hello') =", count_vowels('hello'))`,
    solution: `def count_vowels(s):\n    vowels = 'aeiouAEIOU'\n    return sum(1 for c in s if c in vowels)\n\n# Test your function:\nprint("count_vowels('hello') =", count_vowels('hello'))`,
    validationRules: [
      {
        id: 'count_vowels_exists',
        description: 'Verify count_vowels exists.',
        checkFn: `assert 'count_vowels' in globals(), "Define count_vowels"`,
      },
      {
        id: 'count_vowels_logic',
        description: 'Verify vowel counts inside string values.',
        checkFn: `assert count_vowels('hello') == 2 and count_vowels('AEIOU') == 5, "count_vowels logic incorrect"`,
      },
    ],
    hints: ['Initialize counter, loop characters, increment if character in "aeiouAEIOU".'],
    published: true,
  }));

  pyBasicsChallenges.push(await Challenge.create({
    moduleId: pyBasicsModule3._id,
    title: 'Factorial Calculator',
    description: `### Mathematical recursion\n\nFactorials multiply sequences of positive integers down to 1.\n\n### Objective\nDefine function \`factorial(n)\` that computes the factorial value of positive integer \`n\`.`,
    language: 'python',
    difficulty: 'medium',
    xp: 40,
    starterCode: `def factorial(n):\n    # Return factorial\n    pass\n\n# Test your function:\nprint("factorial(5) =", factorial(5))`,
    solution: `def factorial(n):\n    if n <= 1:\n        return 1\n    return n * factorial(n - 1)\n\n# Test your function:\nprint("factorial(5) =", factorial(5))`,
    validationRules: [
      {
        id: 'factorial_exists',
        description: 'Verify factorial exists.',
        checkFn: `assert 'factorial' in globals(), "Define factorial"`,
      },
      {
        id: 'factorial_logic',
        description: 'Verify 5 factorial is 120 and 0 factorial is 1.',
        checkFn: `assert factorial(5) == 120 and factorial(0) == 1, "factorial logic incorrect"`,
      },
    ],
    hints: ['Return 1 if n is 0 or 1, else return n * factorial(n-1).'],
    published: true,
  }));

  pyBasicsChallenges.push(await Challenge.create({
    moduleId: pyBasicsModule3._id,
    title: 'Find Maximum in List',
    description: `### List scanning\n\nScan list items sequentially to find the largest value without using built-ins.\n\n### Objective\nDefine function \`find_max(lst)\` that returns the largest number in \`lst\`. **Do not use max()**. Return \`None\` if list is empty.`,
    language: 'python',
    difficulty: 'medium',
    xp: 40,
    starterCode: `def find_max(lst):\n    # Return maximum in list\n    pass\n\n# Test your function:\nprint("find_max([1, 5, 3]) =", find_max([1, 5, 3]))`,
    solution: `def find_max(lst):\n    if not lst:\n        return None\n    m = lst[0]\n    for x in lst:\n        if x > m:\n            m = x\n    return m\n\n# Test your function:\nprint("find_max([1, 5, 3]) =", find_max([1, 5, 3]))`,
    validationRules: [
      {
        id: 'find_max_exists',
        description: 'Verify find_max exists.',
        checkFn: `assert 'find_max' in globals(), "Define find_max"`,
      },
      {
        id: 'find_max_logic',
        description: 'Verify list maximums and empty lists are handled.',
        checkFn: `assert find_max([1, 5, 3]) == 5 and find_max([]) is None, "find_max logic incorrect"`,
      },
    ],
    hints: ['Initialize maximum tracking variable to first list element, loop list, and update if larger element found.'],
    published: true,
  }));

  pyBasicsChallenges.push(await Challenge.create({
    moduleId: pyBasicsModule3._id,
    title: 'Celsius to Fahrenheit Calculator',
    description: `### Conversions\n\nFormulas convert temperature representations accurately.\n\n### Objective\nDefine function \`c_to_f(c)\` that calculates Fahrenheit values from Celsius using \`C * 1.8 + 32\`.`,
    language: 'python',
    difficulty: 'easy',
    xp: 20,
    starterCode: `def c_to_f(c):\n    # Convert C to F\n    pass\n\n# Test your function:\nprint("c_to_f(0) =", c_to_f(0))\nprint("c_to_f(100) =", c_to_f(100))`,
    solution: `def c_to_f(c):\n    return c * 1.8 + 32\n\n# Test your function:\nprint("c_to_f(0) =", c_to_f(0))\nprint("c_to_f(100) =", c_to_f(100))`,
    validationRules: [
      {
        id: 'c_to_f_exists',
        description: 'Verify c_to_f exists.',
        checkFn: `assert 'c_to_f' in globals(), "Define c_to_f"`,
      },
      {
        id: 'c_to_f_logic',
        description: 'Verify temperature boundary results.',
        checkFn: `assert abs(c_to_f(0) - 32.0) < 1e-5 and abs(c_to_f(100) - 212.0) < 1e-5, "c_to_f logic incorrect"`,
      },
    ],
    hints: ['Compute and return `c * 1.8 + 32.0`.'],
    published: true,
  }));

  // ----------------------------------------------------
  // Python Data Structures & OOP Challenges (11 to 20)
  // ----------------------------------------------------
  console.log('Seeding challenges for Python Data Structures & OOP...');
  const pyOopChallenges = [];

  pyOopChallenges.push(await Challenge.create({
    moduleId: pyOopModule1._id,
    title: 'Palindrome Checker',
    description: `### Normalizing inputs\n\nStrings contain symmetric structures. Clean spaces and casings before performing comparisons.\n\n### Objective\nCreate function \`is_palindrome(s)\` returning \`True\` if string is a palindrome, else \`False\`. Ignore casing and spaces.`,
    language: 'python',
    difficulty: 'medium',
    xp: 40,
    starterCode: `def is_palindrome(s):\n    # Write palindrome checker\n    pass\n\n# Test your function:\nprint("is_palindrome('racecar') =", is_palindrome('racecar'))\nprint("is_palindrome('hello') =", is_palindrome('hello'))`,
    solution: `def is_palindrome(s):\n    cleaned = "".join(s.lower().split())\n    return cleaned == cleaned[::-1]\n\n# Test your function:\nprint("is_palindrome('racecar') =", is_palindrome('racecar'))\nprint("is_palindrome('hello') =", is_palindrome('hello'))`,
    validationRules: [
      {
        id: 'palindrome_exists',
        description: 'Verify function exists.',
        checkFn: `assert 'is_palindrome' in globals(), "Define is_palindrome"`,
      },
      {
        id: 'palindrome_logic',
        description: 'Verify palindromes ignore spacing and casing.',
        checkFn: `assert is_palindrome("A man a plan a canal Panama") is True and is_palindrome("Hello") is False, "is_palindrome logic incorrect"`,
      },
    ],
    hints: ['Lower input casing using `.lower()`, split and join to strip spacing, compare with reverse slice `[::-1]`.'],
    published: true,
  }));

  pyOopChallenges.push(await Challenge.create({
    moduleId: pyOopModule1._id,
    title: 'Word Frequencies',
    description: `### Word Dictionaries\n\nDictionaries store key-value associations. Track counting logs inside dictionaries.\n\n### Objective\nDefine function \`word_count(s)\` returning dictionaries mapping lowercase words to occurrence frequency counts.`,
    language: 'python',
    difficulty: 'medium',
    xp: 40,
    starterCode: `def word_count(s):\n    # Return frequency mapping dictionary\n    pass\n\n# Test your function:\nprint("word_count('hello world hello') =", word_count('hello world hello'))`,
    solution: `def word_count(s):\n    words = s.lower().split()\n    counts = {}\n    for w in words:\n        counts[w] = counts.get(w, 0) + 1\n    return counts\n\n# Test your function:\nprint("word_count('hello world hello') =", word_count('hello world hello'))`,
    validationRules: [
      {
        id: 'word_count_exists',
        description: 'Verify word_count exists.',
        checkFn: `assert 'word_count' in globals(), "Define word_count"`,
      },
      {
        id: 'word_count_logic',
        description: 'Verify word frequencies dict returned.',
        checkFn: `assert word_count("hello world hello") == {"hello": 2, "world": 1}, "word_count logic incorrect"`,
      },
    ],
    hints: ['Split lowercase string by space: `s.lower().split()`. Use `counts.get(w, 0) + 1` to increment counts.'],
    published: true,
  }));

  pyOopChallenges.push(await Challenge.create({
    moduleId: pyOopModule1._id,
    title: 'List Comprehension Filter',
    description: `### List Comprehensions\n\nComprehensions construct lists inline: \`[expr for item in list if condition]\`.\n\n### Objective\nWrite function \`get_evens(lst)\` using list comprehension returning even values of original lists.`,
    language: 'python',
    difficulty: 'medium',
    xp: 40,
    starterCode: `def get_evens(lst):\n    # Use list comprehension syntax\n    pass\n\n# Test your function:\nprint("get_evens([1, 2, 3, 4, 5]) =", get_evens([1, 2, 3, 4, 5]))`,
    solution: `def get_evens(lst):\n    return [x for x in lst if x % 2 == 0]\n\n# Test your function:\nprint("get_evens([1, 2, 3, 4, 5]) =", get_evens([1, 2, 3, 4, 5]))`,
    validationRules: [
      {
        id: 'comprehension_exists',
        description: 'Verify get_evens exists.',
        checkFn: `assert 'get_evens' in globals(), "Define get_evens"`,
      },
      {
        id: 'comprehension_logic',
        description: 'Verify list matches even numbers.',
        checkFn: `assert get_evens([1, 2, 3, 4]) == [2, 4], "get_evens logic incorrect"`,
      },
    ],
    hints: ['Return a bracketed list comprehension checking if remainder is 0.'],
    published: true,
  }));

  pyOopChallenges.push(await Challenge.create({
    moduleId: pyOopModule2._id,
    title: 'The Car Class',
    description: `### OOP Classes & Constructors\n\nConstructors (\`__init__\`) initialize class properties. Instance methods accept reference argument \`self\` first.\n\n### Objective\nCreate class \`Car\` initializing brand string \`brand\` and speed integer \`speed\`. Add instance method \`accelerate(amount)\` modifying speed values and returning new speeds.`,
    language: 'python',
    difficulty: 'hard',
    xp: 80,
    starterCode: `class Car:\n    # Define your Car class here\n    pass\n\n# Test your class:\nmy_car = Car("Tesla", 80)\nprint("Brand:", my_car.brand)\nprint("Initial Speed:", my_car.speed)\nprint("New Speed after accelerate(30):", my_car.accelerate(30))`,
    solution: `class Car:\n    def __init__(self, brand, speed):\n        self.brand = brand\n        self.speed = speed\n    def accelerate(self, amount):\n        self.speed += amount\n        return self.speed\n\n# Test your class:\nmy_car = Car("Tesla", 80)\nprint("Brand:", my_car.brand)\nprint("Initial Speed:", my_car.speed)\nprint("New Speed after accelerate(30):", my_car.accelerate(30))`,
    validationRules: [
      {
        id: 'class_exists',
        description: 'Verify Car class definition is defined.',
        checkFn: `assert 'Car' in globals() and isinstance(Car, type), "Define Car class"`,
      },
      {
        id: 'class_logic',
        description: 'Verify constructor sets attributes, and accelerate method changes speed values.',
        checkFn: `c = Car("Tesla", 80); assert c.brand == "Tesla" and c.speed == 80 and c.accelerate(30) == 110 and c.speed == 110, "Car class implementation incorrect"`,
      },
    ],
    hints: ['Store attributes inside `__init__(self, brand, speed)` using `self.brand` and `self.speed`.'],
    published: true,
  }));

  pyOopChallenges.push(await Challenge.create({
    moduleId: pyOopModule2._id,
    title: 'Safe Division Handler',
    description: `### Try/Except blocks\n\nException handlers capture operational failures gracefully.\n\n### Objective\nDefine function \`safe_divide(a, b)\` returning \`a / b\`. Catch \`ZeroDivisionError\` and return \`None\` instead of raising exceptions.`,
    language: 'python',
    difficulty: 'hard',
    xp: 80,
    starterCode: `def safe_divide(a, b):\n    # Write try-except block to handle ZeroDivisionError\n    pass\n\n# Test your function:\nprint("safe_divide(10, 2) =", safe_divide(10, 2))\nprint("safe_divide(5, 0) =", safe_divide(5, 0))`,
    solution: `def safe_divide(a, b):\n    try:\n        return a / b\n    except ZeroDivisionError:\n        return None\n\n# Test your function:\nprint("safe_divide(10, 2) =", safe_divide(10, 2))\nprint("safe_divide(5, 0) =", safe_divide(5, 0))`,
    validationRules: [
      {
        id: 'safe_divide_exists',
        description: 'Verify safe_divide function exists.',
        checkFn: `assert 'safe_divide' in globals(), "Define safe_divide"`,
      },
      {
        id: 'safe_divide_logic',
        description: 'Verify divide by zero returns None.',
        checkFn: `assert safe_divide(10, 2) == 5.0 and safe_divide(5, 0) is None, "safe_divide logic incorrect"`,
      },
    ],
    hints: ['Wrap division inside `try:` block, catch division by zero exceptions under `except ZeroDivisionError:`.'],
    published: true,
  }));

  pyOopChallenges.push(await Challenge.create({
    moduleId: pyOopModule2._id,
    title: 'Remove Duplicates',
    description: `### Unique structures\n\nFilters extract duplicate listings while maintaining sequence layout orders.\n\n### Objective\nDefine function \`remove_duplicates(lst)\` returning unique listing entries in their original order.`,
    language: 'python',
    difficulty: 'medium',
    xp: 40,
    starterCode: `def remove_duplicates(lst):\n    # Return unique items in order\n    pass\n\n# Test your function:\nprint("remove_duplicates([1, 2, 2, 3, 1]) =", remove_duplicates([1, 2, 2, 3, 1]))`,
    solution: `def remove_duplicates(lst):\n    seen = set()\n    res = []\n    for x in lst:\n        if x not in seen:\n            seen.add(x)\n            res.append(x)\n    return res\n\n# Test your function:\nprint("remove_duplicates([1, 2, 2, 3, 1]) =", remove_duplicates([1, 2, 2, 3, 1]))`,
    validationRules: [
      {
        id: 'remove_duplicates_exists',
        description: 'Verify remove_duplicates exists.',
        checkFn: `assert 'remove_duplicates' in globals(), "Define remove_duplicates"`,
      },
      {
        id: 'remove_duplicates_logic',
        description: 'Verify unique order list outputs.',
        checkFn: `assert remove_duplicates([1, 2, 2, 3, 1]) == [1, 2, 3], "remove_duplicates logic incorrect"`,
      },
    ],
    hints: ['Use tracking set `seen` to filter duplicates without changing order sequences.'],
    published: true,
  }));

  pyOopChallenges.push(await Challenge.create({
    moduleId: pyOopModule3._id,
    title: 'Find Unique Words',
    description: `### String token filtering\n\nSplit sentences into distinct, ordered word listings.\n\n### Objective\nDefine function \`unique_words(s)\` returning sorted unique lowercase words in string \`s\` split by spaces.`,
    language: 'python',
    difficulty: 'medium',
    xp: 40,
    starterCode: `def unique_words(s):\n    # Return sorted unique words\n    pass\n\n# Test your function:\nprint("unique_words('The cat and the dog') =", unique_words('The cat and the dog'))`,
    solution: `def unique_words(s):\n    words = s.lower().split()\n    return sorted(list(set(words)))\n\n# Test your function:\nprint("unique_words('The cat and the dog') =", unique_words('The cat and the dog'))`,
    validationRules: [
      {
        id: 'unique_words_exists',
        description: 'Verify unique_words exists.',
        checkFn: `assert 'unique_words' in globals(), "Define unique_words"`,
      },
      {
        id: 'unique_words_logic',
        description: 'Verify sorted list of unique words returned.',
        checkFn: `assert unique_words("The cat and the dog") == ["and", "cat", "dog", "the"], "unique_words logic incorrect"`,
      },
    ],
    hints: ['Lowercase input sentences, split by space, convert list to unique set, cast back to list and sort.'],
    published: true,
  }));

  pyOopChallenges.push(await Challenge.create({
    moduleId: pyOopModule3._id,
    title: 'Merge Dictionaries',
    description: `### Dictionary merges\n\nCombine key-value properties. If values share identical keys, sum them up.\n\n### Objective\nDefine function \`merge_dicts(d1, d2)\` returning merged dictionary copies. Sum values sharing matching keys.`,
    language: 'python',
    difficulty: 'medium',
    xp: 40,
    starterCode: `def merge_dicts(d1, d2):\n    # Merge and sum common keys\n    pass\n\n# Test your function:\nprint("merge_dicts({'a': 1, 'b': 2}, {'b': 3, 'c': 4}) =", merge_dicts({'a': 1, 'b': 2}, {'b': 3, 'c': 4}))`,
    solution: `def merge_dicts(d1, d2):\n    res = d1.copy()\n    for k, v in d2.items():\n        res[k] = res.get(k, 0) + v\n    return res\n\n# Test your function:\nprint("merge_dicts({'a': 1, 'b': 2}, {'b': 3, 'c': 4}) =", merge_dicts({'a': 1, 'b': 2}, {'b': 3, 'c': 4}))`,
    validationRules: [
      {
        id: 'merge_dicts_exists',
        description: 'Verify merge_dicts exists.',
        checkFn: `assert 'merge_dicts' in globals(), "Define merge_dicts"`,
      },
      {
        id: 'merge_dicts_logic',
        description: 'Verify merged dict entries are summed.',
        checkFn: `assert merge_dicts({"a": 1, "b": 2}, {"b": 3, "c": 4}) == {"a": 1, "b": 5, "c": 4}, "merge_dicts logic incorrect"`,
      },
    ],
    hints: ['Copy first dictionary using `.copy()`, iterate second dictionary key-values adding value aggregates.'],
    published: true,
  }));

  pyOopChallenges.push(await Challenge.create({
    moduleId: pyOopModule3._id,
    title: 'Inheritance & Overrides',
    description: `### Class Inheritance\n\nSubclasses inherit parent blueprints and override attributes.\n\n### Objective\nCreate class \`ElectricCar\` inheriting from \`Car\`. Add constructor field \`battery_size\` (default \`75\`). Override \`accelerate(amount)\` to speed up by \`amount * 2\` and return updated speeds.`,
    language: 'python',
    difficulty: 'hard',
    xp: 80,
    starterCode: `class Car:\n    def __init__(self, brand, speed):\n        self.brand = brand\n        self.speed = speed\n    def accelerate(self, amount):\n        self.speed += amount\n        return self.speed\n\nclass ElectricCar(Car):\n    # Inherit and override accelerate here\n    pass\n\n# Test your class:\nmy_ev = ElectricCar("Tesla", 50)\nprint("EV Battery:", my_ev.battery_size)\nprint("EV Speed after 30:", my_ev.accelerate(30))`,
    solution: `class Car:\n    def __init__(self, brand, speed):\n        self.brand = brand\n        self.speed = speed\n    def accelerate(self, amount):\n        self.speed += amount\n        return self.speed\n\nclass ElectricCar(Car):\n    def __init__(self, brand, speed, battery_size=75):\n        super().__init__(brand, speed)\n        self.battery_size = battery_size\n    def accelerate(self, amount):\n        self.speed += amount * 2\n        return self.speed\n\n# Test your class:\nmy_ev = ElectricCar("Tesla", 50)\nprint("EV Battery:", my_ev.battery_size)\nprint("EV Speed after 30:", my_ev.accelerate(30))`,
    validationRules: [
      {
        id: 'inheritance_structure',
        description: 'Verify ElectricCar inherits from Car.',
        checkFn: `assert 'ElectricCar' in globals() and issubclass(ElectricCar, Car), "ElectricCar must inherit from Car"`,
      },
      {
        id: 'inheritance_logic',
        description: 'Verify double acceleration and battery_size attribute.',
        checkFn: `ev = ElectricCar("Tesla", 50, 80); assert ev.battery_size == 80 and ev.accelerate(20) == 90 and ev.speed == 90, "ElectricCar logic incorrect"`,
      },
    ],
    hints: ['Call `super().__init__(brand, speed)` inside constructor. Implement accelerate overriding speed increment factor.'],
    published: true,
  }));

  pyOopChallenges.push(await Challenge.create({
    moduleId: pyOopModule3._id,
    title: 'Valid IP Address Checker',
    description: `### String validation\n\nIPv4 addresses contain 4 integer elements divided by dots. Values are bounded between 0 and 255.\n\n### Objective\nDefine function \`is_valid_ip(s)\` checking if string address matches valid IPv4 formats. Return \`True\` if valid, else \`False\`.`,
    language: 'python',
    difficulty: 'hard',
    xp: 80,
    starterCode: `def is_valid_ip(s):\n    # Return True if valid IPv4 else False\n    pass\n\n# Test your function:\nprint("is_valid_ip('192.168.1.1') =", is_valid_ip('192.168.1.1'))\nprint("is_valid_ip('256.0.0.1') =", is_valid_ip('256.0.0.1'))`,
    solution: `def is_valid_ip(s):\n    parts = s.split('.')\n    if len(parts) != 4:\n        return False\n    try:\n        return all(p.isdigit() and 0 <= int(p) <= 255 for p in parts)\n    except Exception:\n        return False\n\n# Test your function:\nprint("is_valid_ip('192.168.1.1') =", is_valid_ip('192.168.1.1'))\nprint("is_valid_ip('256.0.0.1') =", is_valid_ip('256.0.0.1'))`,
    validationRules: [
      {
        id: 'is_valid_ip_exists',
        description: 'Verify function exists.',
        checkFn: `assert 'is_valid_ip' in globals(), "Define is_valid_ip"`,
      },
      {
        id: 'is_valid_ip_logic',
        description: 'Verify address matches valid boundaries.',
        checkFn: `assert is_valid_ip("192.168.1.1") is True and is_valid_ip("256.0.0.1") is False and is_valid_ip("abc.1.1.1") is False, "is_valid_ip logic incorrect"`,
      },
    ],
    hints: ['Split address by dots, verify exactly 4 parts, convert string parts to digits and verify bounds.'],
    published: true,
  }));

  // Link Python challenges sequentially
  const pythonChallenges = [...pyBasicsChallenges, ...pyOopChallenges];
  for (let i = 0; i < pythonChallenges.length - 1; i++) {
    pythonChallenges[i].nextChallengeId = pythonChallenges[i + 1]._id;
    await pythonChallenges[i].save();
  }
  await pythonChallenges[pythonChallenges.length - 1].save();
  console.log(`Seeded ${pythonChallenges.length} Python challenges.`);

  // Create standard student progress baseline
  console.log('Seeding a default student progress record...');
  const firstWebChallenge = webChallenges[0]._id;
  const firstPyChallenge = pythonChallenges[0]._id;

  await UserProgress.create({
    userId: 'guest_user',
    completedChallenges: [],
    unlockedChallenges: [firstWebChallenge, firstPyChallenge],
    xp: 0,
    currentLevel: 1,
  });

  console.log('Database seeding finished successfully!');
  await mongoose.disconnect();
  console.log('Disconnected from MongoDB.');
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});

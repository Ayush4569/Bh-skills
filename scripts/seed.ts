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
  const webModule1 = await Module.create({
    title: 'HTML Basics',
    description: 'Master the fundamental building blocks of web pages: elements, headings, paragraphs, and inputs.',
    courseId: webCourse._id,
    order: 1,
  });

  const webModule2 = await Module.create({
    title: 'CSS & Interactivity',
    description: 'Style your layouts with the Box Model, center items with Flexbox, and bring elements to life with JS callbacks.',
    courseId: webCourse._id,
    order: 2,
  });

  // Seeding Web Module 1 Challenges
  console.log('Seeding challenges for HTML Basics...');
  const webChallengesM1 = [];
  
  const w1c1 = await Challenge.create({
    moduleId: webModule1._id,
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
    hints: [
      'Use the opening tag `<h1>` and closing tag `</h1>`.',
      'Make sure the spelling of "Hello Brainheaters" is exactly correct, including capitalization.',
    ],
    published: true,
  });
  webChallengesM1.push(w1c1);

  const w1c2 = await Challenge.create({
    moduleId: webModule1._id,
    title: 'Welcome Paragraph',
    description: `### HTML Paragraphs\n\nParagraphs are defined with the \`<p>\` tag. You can assign unique IDs to target specific elements using CSS or JavaScript.\n\n### Objective\nCreate a paragraph \`<p>\` with the text \`Welcome to the labs.\` and give it an \`id\` attribute set to \`welcome-msg\`.`,
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
    hints: [
      'An ID attribute is written as `id="value"` inside the opening tag.',
      'Example: `<p id="my-id">Text</p>`',
    ],
    published: true,
  });
  webChallengesM1.push(w1c2);

  const w1c3 = await Challenge.create({
    moduleId: webModule1._id,
    title: 'Hyperlink to Labs',
    description: `### HTML Links\n\nLinks are defined with the \`<a>\` (anchor) tag. The link's destination is specified in the \`href\` attribute. Set \`target="_blank"\` to open links in a new window.\n\n### Objective\nCreate a link with the text \`Visit Labs\` that goes to \`https://labs.brainheaters.com\` and opens in a new tab using the \`target\` attribute.`,
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
    hints: [
      'Add `href="https://labs.brainheaters.com"` and `target="_blank"` inside the `<a>` tag.',
    ],
    published: true,
  });
  webChallengesM1.push(w1c3);

  const w1c4 = await Challenge.create({
    moduleId: webModule1._id,
    title: 'Text Inputs',
    description: `### Form Inputs\n\nInputs allow users to enter text. An input tag \`<input>\` is self-closing and utilizes a \`placeholder\` attribute to display temporary text before the user starts typing.\n\n### Objective\nCreate an input element with the \`id\` set to \`username-input\` and the \`placeholder\` set to \`Enter your username\`.`,
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
    hints: [
      'The `<input />` tag is self-closing and does not need a closing tag.',
    ],
    published: true,
  });
  webChallengesM1.push(w1c4);

  const w1c5 = await Challenge.create({
    moduleId: webModule1._id,
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
    hints: [
      'Nest three `<li>` elements inside one opening and closing `<ul>` tag.',
    ],
    published: true,
  });
  webChallengesM1.push(w1c5);

  // Link Web Module 1 challenges in order
  for (let i = 0; i < webChallengesM1.length - 1; i++) {
    webChallengesM1[i].nextChallengeId = webChallengesM1[i + 1]._id;
    await webChallengesM1[i].save();
  }

  // Seeding Web Module 2 Challenges
  console.log('Seeding challenges for CSS & Interactivity...');
  const webChallengesM2 = [];

  const w2c1 = await Challenge.create({
    moduleId: webModule2._id,
    title: 'Background Styling',
    description: `### CSS Colors & Backgrounds\n\nStyle tags allow you to apply CSS directly to HTML elements. The \`background-color\` property sets the background, and the \`color\` property sets the text color.\n\n### Objective\nCreate a style rule that sets the \`body\` background color to dark slate-blue (\`rgb(15, 23, 42)\` or \`#0f172a\`) and the text color to white (\`rgb(255, 255, 255)\` or \`#ffffff\`).`,
    language: 'css',
    difficulty: 'easy',
    xp: 20,
    starterCode: `<style>\n  body {\n    /* Write your CSS rules here */\n  }\n</style>\n<h1>Styled Document</h1>`,
    solution: `<style>\n  body {\n    background-color: rgb(15, 23, 42);\n    color: rgb(255, 255, 255);\n  }\n</style>\n<h1>Styled Document</h1>`,
    validationRules: [
      {
        id: 'bg_color',
        description: 'Verify that the body background color is set to rgb(15, 23, 42).',
        checkFn: `window.getComputedStyle(document.body).backgroundColor === 'rgb(15, 23, 42)'`,
      },
      {
        id: 'text_color',
        description: 'Verify that the body text color is set to white (rgb(255, 255, 255)).',
        checkFn: `window.getComputedStyle(document.body).color === 'rgb(255, 255, 255)'`,
      },
    ],
    hints: [
      'Inside the body selector block, write `background-color: rgb(15, 23, 42);` and `color: rgb(255, 255, 255);`.',
    ],
    published: true,
  });
  webChallengesM2.push(w2c1);

  const w2c2 = await Challenge.create({
    moduleId: webModule2._id,
    title: 'The CSS Box Model',
    description: `### The Box Model\n\nEvery HTML element is represented as a rectangular box. CSS controls \`width\`, \`height\`, inner spacing (\`padding\`), and outer spacing (\`margin\`).\n\n### Objective\nCreate a \`<div>\` with an \`id\` of \`box\`. In CSS, style it to have:\n* Width and height of \`200px\`\n* Background color set to red (\`rgb(239, 68, 68)\`)\n* Padding of \`20px\`\n* Margin of \`40px\``,
    language: 'css',
    difficulty: 'medium',
    xp: 40,
    starterCode: `<style>\n  #box {\n    /* Style this selector */\n  }\n</style>\n<div id="box">Box</div>`,
    solution: `<style>\n  #box {\n    width: 200px;\n    height: 200px;\n    background-color: rgb(239, 68, 68);\n    padding: 20px;\n    margin: 40px;\n  }\n</style>\n<div id="box">Box</div>`,
    validationRules: [
      {
        id: 'box_exists',
        description: 'Verify that a div with ID "box" exists.',
        checkFn: `document.getElementById('box') !== null`,
      },
      {
        id: 'box_dimensions',
        description: 'Verify that the box is 200px wide and 200px high.',
        checkFn: `(() => {
          const style = window.getComputedStyle(document.getElementById('box'));
          return style.width === '200px' && style.height === '200px';
        })()`,
      },
      {
        id: 'box_color',
        description: 'Verify background color is rgb(239, 68, 68).',
        checkFn: `window.getComputedStyle(document.getElementById('box')).backgroundColor === 'rgb(239, 68, 68)'`,
      },
      {
        id: 'box_spacing',
        description: 'Verify padding is 20px and margin is 40px.',
        checkFn: `(() => {
          const style = window.getComputedStyle(document.getElementById('box'));
          return style.padding === '20px' && style.margin === '40px';
        })()`,
      },
    ],
    hints: [
      'To target an ID in CSS, use the hash symbol: `#box`.',
      'Set `width: 200px; height: 200px; padding: 20px; margin: 40px; background-color: rgb(239, 68, 68);`.',
    ],
    published: true,
  });
  webChallengesM2.push(w2c2);

  const w2c3 = await Challenge.create({
    moduleId: webModule2._id,
    title: 'Centering with Flexbox',
    description: `### Flexbox Alignment\n\nCSS Flexible Box Layout (Flexbox) makes it easy to align children inside a container. Set the container's display to \`flex\`, then use \`justify-content\` and \`align-items\` to center.\n\n### Objective\nStyle the \`.container\` element using Flexbox to center its child \`.item\` both horizontally and vertically. Set the container height to \`100vh\` (viewport height).`,
    language: 'css',
    difficulty: 'medium',
    xp: 40,
    starterCode: `<style>\n  .container {\n    height: 100vh;\n    /* Use Flexbox to center items */\n  }\n  .item {\n    width: 60px;\n    height: 60px;\n    background-color: rgb(59, 130, 246);\n  }\n</style>\n<div class="container">\n  <div class="item"></div>\n</div>`,
    solution: `<style>\n  .container {\n    height: 100vh;\n    display: flex;\n    justify-content: center;\n    align-items: center;\n  }\n  .item {\n    width: 60px;\n    height: 60px;\n    background-color: rgb(59, 130, 246);\n  }\n</style>\n<div class="container">\n  <div class="item"></div>\n</div>`,
    validationRules: [
      {
        id: 'flex_display',
        description: 'Verify that container display is set to flex.',
        checkFn: `window.getComputedStyle(document.querySelector('.container')).display === 'flex'`,
      },
      {
        id: 'flex_center_x',
        description: 'Verify that justify-content is set to center.',
        checkFn: `window.getComputedStyle(document.querySelector('.container')).justifyContent === 'center'`,
      },
      {
        id: 'flex_center_y',
        description: 'Verify that align-items is set to center.',
        checkFn: `window.getComputedStyle(document.querySelector('.container')).alignItems === 'center'`,
      },
    ],
    hints: [
      'Write `display: flex; justify-content: center; align-items: center;` inside the `.container` block.',
    ],
    published: true,
  });
  webChallengesM2.push(w2c3);

  const w2c4 = await Challenge.create({
    moduleId: webModule2._id,
    title: 'Button Click Counter',
    description: `### JavaScript Event Listeners\n\nJavaScript can respond to user actions. Adding a click listener allows code to execute whenever a user clicks an element.\n\n### Objective\nCreate a button with an ID \`btn\` (text: "Click me") and a paragraph with ID \`counter\` starting at \`0\`. Write JavaScript to increment the text of \`counter\` by 1 on every click.`,
    language: 'javascript',
    difficulty: 'medium',
    xp: 40,
    starterCode: `<button id="btn">Click me</button>\n<p id="counter">0</p>\n<script>\n  const btn = document.getElementById('btn');\n  const counter = document.getElementById('counter');\n  // Add click listener and increment logic here\n</script>`,
    solution: `<button id="btn">Click me</button>\n<p id="counter">0</p>\n<script>\n  const btn = document.getElementById('btn');\n  const counter = document.getElementById('counter');\n  let val = 0;\n  btn.addEventListener('click', () => {\n    val++;\n    counter.textContent = val;\n  });\n</script>`,
    validationRules: [
      {
        id: 'btn_and_counter',
        description: 'Verify that the button #btn and paragraph #counter elements exist.',
        checkFn: `document.getElementById('btn') !== null && document.getElementById('counter') !== null`,
      },
      {
        id: 'click_increment_1',
        description: 'Verify that clicking the button increments the counter text to 1.',
        checkFn: `(() => {
          const btn = document.getElementById('btn');
          const counter = document.getElementById('counter');
          counter.textContent = '0'; // reset
          btn.click();
          return counter.textContent.trim() === '1';
        })()`,
      },
      {
        id: 'click_increment_2',
        description: 'Verify that clicking again increments the counter to 2.',
        checkFn: `(() => {
          const btn = document.getElementById('btn');
          const counter = document.getElementById('counter');
          btn.click();
          return counter.textContent.trim() === '2';
        })()`,
      },
    ],
    hints: [
      'Maintain a running integer variable in your JavaScript code.',
      'Add a listener: `btn.addEventListener("click", () => { ... })` and update `counter.textContent`.',
    ],
    published: true,
  });
  webChallengesM2.push(w2c4);

  const w2c5 = await Challenge.create({
    moduleId: webModule2._id,
    title: 'Color Toggle Panel',
    description: `### Dynamic Styles in JS\n\nJavaScript can modify an element's inline CSS style rules directly using the \`style\` property.\n\n### Objective\nCreate a \`<div>\` with ID \`box\` and text "Color Box". Write JavaScript to toggle the background color of the box between red (\`rgb(255, 0, 0)\`) and blue (\`rgb(0, 0, 255)\`) whenever it is clicked.`,
    language: 'javascript',
    difficulty: 'hard',
    xp: 80,
    starterCode: `<div id="box" style="background-color: rgb(255, 0, 0); padding: 20px; color: white;">Color Box</div>\n<script>\n  const box = document.getElementById('box');\n  // Add click listener to toggle background-color\n</script>`,
    solution: `<div id="box" style="background-color: rgb(255, 0, 0); padding: 20px; color: white;">Color Box</div>\n<script>\n  const box = document.getElementById('box');\n  box.addEventListener('click', () => {\n    const current = window.getComputedStyle(box).backgroundColor;\n    if (current === 'rgb(255, 0, 0)' || current === 'red') {\n      box.style.backgroundColor = 'rgb(0, 0, 255)';\n    } else {\n      box.style.backgroundColor = 'rgb(255, 0, 0)';\n    }\n  });\n</script>`,
    validationRules: [
      {
        id: 'box_element',
        description: 'Verify that #box exists and starts with a red background.',
        checkFn: `document.getElementById('box') !== null && window.getComputedStyle(document.getElementById('box')).backgroundColor === 'rgb(255, 0, 0)'`,
      },
      {
        id: 'toggle_to_blue',
        description: 'Verify that clicking the box toggles its background to blue (rgb(0, 0, 255)).',
        checkFn: `(() => {
          const box = document.getElementById('box');
          box.click();
          return window.getComputedStyle(box).backgroundColor === 'rgb(0, 0, 255)';
        })()`,
      },
      {
        id: 'toggle_back_red',
        description: 'Verify that clicking again toggles the background back to red (rgb(255, 0, 0)).',
        checkFn: `(() => {
          const box = document.getElementById('box');
          box.click();
          return window.getComputedStyle(box).backgroundColor === 'rgb(255, 0, 0)';
        })()`,
      },
    ],
    hints: [
      'Use `box.style.backgroundColor` to modify color.',
      'Check the current color, if it is `rgb(255, 0, 0)`, change it to `rgb(0, 0, 255)`, else change it to `rgb(255, 0, 0)`.',
    ],
    published: true,
  });
  webChallengesM2.push(w2c5);

  // Link Web Module 2 challenges in order
  for (let i = 0; i < webChallengesM2.length - 1; i++) {
    webChallengesM2[i].nextChallengeId = webChallengesM2[i + 1]._id;
    await webChallengesM2[i].save();
  }

  // Connect last challenge of module 1 to first challenge of module 2
  webChallengesM1[webChallengesM1.length - 1].nextChallengeId = webChallengesM2[0]._id;
  await webChallengesM1[webChallengesM1.length - 1].save();

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
  const pyModule1 = await Module.create({
    title: 'Python Basics',
    description: 'Get started with outputs, variables, functions, and arithmetic expressions in Python.',
    courseId: pythonCourse._id,
    order: 1,
  });

  const pyModule2 = await Module.create({
    title: 'Data Structures & OOP',
    description: 'Dive deep into list filtering, word dictionaries, classes, constructors, and exception handlers.',
    courseId: pythonCourse._id,
    order: 2,
  });

  // Seeding Python Module 1 Challenges
  console.log('Seeding challenges for Python Basics...');
  const pyChallengesM1 = [];

  const p1c1 = await Challenge.create({
    moduleId: pyModule1._id,
    title: 'Hello Python',
    description: `### Print Statement\n\nThe \`print()\` function prints the specified message to the screen or other standard output.\n\n### Objective\nWrite a Python program that prints exactly the string \`Hello, World!\` to the standard output.`,
    language: 'python',
    difficulty: 'easy',
    xp: 20,
    starterCode: `# Write your python code below\n`,
    solution: `print("Hello, World!")`,
    validationRules: [
      {
        id: 'print_output',
        description: 'Verify stdout matches "Hello, World!"',
        checkFn: `
          # We check the stdout matches hello world. The validator wraps the script.
          # Here we run tests inside Pyodide.
          # For Python, we will run the user code, intercept output, and also execute assertions.
          # The validation logic runs assertions inside pyodide.
          assert __output__.strip() == "Hello, World!", "Expected output to be exactly 'Hello, World!'"
        `,
      },
    ],
    hints: [
      'Use `print("Hello, World!")` exactly as written.',
    ],
    published: true,
  });
  pyChallengesM1.push(p1c1);

  const p1c2 = await Challenge.create({
    moduleId: pyModule1._id,
    title: 'Sum of Variables',
    description: `### Variables\n\nVariables are containers for storing data values. In Python, variables are created when you assign a value to them.\n\n### Objective\nCreate a variable \`a\` with the value \`10\` and a variable \`b\` with the value \`20\`. Print their sum.`,
    language: 'python',
    difficulty: 'easy',
    xp: 20,
    starterCode: `# Declare a and b and print their sum\n`,
    solution: `a = 10\nb = 20\nprint(a + b)`,
    validationRules: [
      {
        id: 'variable_sum',
        description: 'Verify that stdout displays the sum 30.',
        checkFn: `
          assert __output__.strip() == "30", "Expected the stdout to print '30'"
        `,
      },
      {
        id: 'variable_definitions',
        description: 'Verify that variables a and b are declared and set.',
        checkFn: `
          assert 'a' in globals(), "Variable 'a' must be declared."
          assert 'b' in globals(), "Variable 'b' must be declared."
          assert a == 10, "Variable 'a' must equal 10."
          assert b == 20, "Variable 'b' must equal 20."
        `,
      },
    ],
    hints: [
      'Set `a = 10` on line 1.',
      'Set `b = 20` on line 2.',
      'Write `print(a + b)` on line 3.',
    ],
    published: true,
  });
  pyChallengesM1.push(p1c2);

  const p1c3 = await Challenge.create({
    moduleId: pyModule1._id,
    title: 'Define an Addition Function',
    description: `### Functions\n\nA function is a block of code which only runs when it is called. You can pass data, known as parameters, into a function. A function can return data as a result using the \`return\` keyword.\n\n### Objective\nCreate a function \`add(x, y)\` that returns the sum of \`x\` and \`y\`.`,
    language: 'python',
    difficulty: 'easy',
    xp: 20,
    starterCode: `def add(x, y):\n    # Write your return statement here\n    pass`,
    solution: `def add(x, y):\n    return x + y`,
    validationRules: [
      {
        id: 'add_exists',
        description: 'Verify function "add" is defined.',
        checkFn: `
          assert 'add' in globals(), "You must define the function 'add'"
          assert callable(add), "'add' must be a callable function"
        `,
      },
      {
        id: 'add_cases',
        description: 'Verify add(2, 3) yields 5 and add(-1, 1) yields 0.',
        checkFn: `
          assert add(2, 3) == 5, "add(2, 3) should return 5"
          assert add(-1, 1) == 0, "add(-1, 1) should return 0"
        `,
      },
    ],
    hints: [
      'Replace `pass` with `return x + y`.',
    ],
    published: true,
  });
  pyChallengesM1.push(p1c3);

  const p1c4 = await Challenge.create({
    moduleId: pyModule1._id,
    title: 'Even or Odd',
    description: `### Conditionals\n\nPython supports the standard logical conditions. We use \`if\`, \`elif\`, and \`else\` statements for branching. The modulo operator \`%\` returns the division remainder.\n\n### Objective\nDefine a function \`is_even(n)\` that returns \`True\` if \`n\` is an even integer, and \`False\` otherwise.`,
    language: 'python',
    difficulty: 'easy',
    xp: 20,
    starterCode: `def is_even(n):\n    # Return True if n is even, else False\n    pass`,
    solution: `def is_even(n):\n    return n % 2 == 0`,
    validationRules: [
      {
        id: 'is_even_exists',
        description: 'Verify function is defined.',
        checkFn: `
          assert 'is_even' in globals(), "You must define the function 'is_even'"
        `,
      },
      {
        id: 'is_even_logic',
        description: 'Verify output logic for 4, 7, and 0.',
        checkFn: `
          assert is_even(4) is True, "is_even(4) should be True"
          assert is_even(7) is False, "is_even(7) should be False"
          assert is_even(0) is True, "is_even(0) should be True"
        `,
      },
    ],
    hints: [
      'An even number is divisible by 2 with remainder 0 (`n % 2 == 0`).',
    ],
    published: true,
  });
  pyChallengesM1.push(p1c4);

  const p1c5 = await Challenge.create({
    moduleId: pyModule1._id,
    title: 'Summing a List',
    description: `### Iterating Collections\n\nLists store multiple items in a single variable. A \`for\` loop iterates through elements of a list.\n\n### Objective\nDefine a function \`sum_list(lst)\` that sums all numbers in the list and returns it. **Do not use the built-in \`sum()\` function.**`,
    language: 'python',
    difficulty: 'medium',
    xp: 40,
    starterCode: `def sum_list(lst):\n    # Loop and aggregate list values without sum()\n    pass`,
    solution: `def sum_list(lst):\n    total = 0\n    for x in lst:\n        total += x\n    return total`,
    validationRules: [
      {
        id: 'sum_list_exists',
        description: 'Verify function sum_list is defined.',
        checkFn: `
          assert 'sum_list' in globals(), "You must define the function 'sum_list'"
        `,
      },
      {
        id: 'sum_list_logic',
        description: 'Verify that lists are aggregated correctly.',
        checkFn: `
          assert sum_list([1, 2, 3]) == 6, "sum_list([1, 2, 3]) should return 6"
          assert sum_list([]) == 0, "sum_list([]) should return 0"
          assert sum_list([-5, 5, 10]) == 10, "sum_list([-5, 5, 10]) should return 10"
        `,
      },
    ],
    hints: [
      'Initialize a running total variable set to 0.',
      'Use a `for` loop: `for x in lst: total += x` and then `return total` at the end.',
    ],
    published: true,
  });
  pyChallengesM1.push(p1c5);

  // Link Python Module 1 challenges in order
  for (let i = 0; i < pyChallengesM1.length - 1; i++) {
    pyChallengesM1[i].nextChallengeId = pyChallengesM1[i + 1]._id;
    await pyChallengesM1[i].save();
  }

  // Seeding Python Module 2 Challenges
  console.log('Seeding challenges for Python Data Structures & OOP...');
  const pyChallengesM2 = [];

  const p2c1 = await Challenge.create({
    moduleId: pyModule2._id,
    title: 'Palindrome Checker',
    description: `### String Manipulation\n\nStrings can be sliced and transformed. \`s[::-1]\` reverses a string in Python. To normalize strings, ignore spaces and letter casing.\n\n### Objective\nCreate a function \`is_palindrome(s)\` that returns \`True\` if the string is a palindrome, and \`False\` otherwise. Ignore spacing and letter casing.`,
    language: 'python',
    difficulty: 'medium',
    xp: 40,
    starterCode: `def is_palindrome(s):\n    # Write palindrome checker\n    pass`,
    solution: `def is_palindrome(s):\n    cleaned = "".join(s.lower().split())\n    return cleaned == cleaned[::-1]`,
    validationRules: [
      {
        id: 'is_palindrome_exists',
        description: 'Verify palindrome checker exists.',
        checkFn: `
          assert 'is_palindrome' in globals(), "You must define 'is_palindrome'"
        `,
      },
      {
        id: 'is_palindrome_logic',
        description: 'Verify palindrome evaluation rules (e.g. racecar is True, Hello is False, spacing ignored).',
        checkFn: `
          assert is_palindrome("racecar") is True, "'racecar' is a palindrome."
          assert is_palindrome("Hello") is False, "'Hello' is not a palindrome."
          assert is_palindrome("A man a plan a canal Panama") is True, "Spaces and capitalization should be ignored."
        `,
      },
    ],
    hints: [
      'Lower-case the input using `.lower()`.',
      'Remove spaces by calling `.split()` and joining them back: `"".join(...)`.',
      'Compare the string with its reverse: `cleaned == cleaned[::-1]`.',
    ],
    published: true,
  });
  pyChallengesM2.push(p2c1);

  const p2c2 = await Challenge.create({
    moduleId: pyModule2._id,
    title: 'Word Frequencies',
    description: `### Dictionaries\n\nDictionaries are key-value mappings. Use \`dict.get(key, default)\` to safely retrieve or update word counts.\n\n### Objective\nDefine a function \`word_count(s)\` that splits the string by spaces, lowercases words, and returns a dictionary with word frequencies.`,
    language: 'python',
    difficulty: 'medium',
    xp: 40,
    starterCode: `def word_count(s):\n    # Return frequency mapping dictionary\n    pass`,
    solution: `def word_count(s):\n    words = s.lower().split()\n    counts = {}\n    for w in words:\n        counts[w] = counts.get(w, 0) + 1\n    return counts`,
    validationRules: [
      {
        id: 'word_count_exists',
        description: 'Verify function exists.',
        checkFn: `
          assert 'word_count' in globals(), "Define 'word_count'"
        `,
      },
      {
        id: 'word_count_logic',
        description: 'Verify frequency counts logic.',
        checkFn: `
          assert word_count("hello world hello") == {"hello": 2, "world": 1}, "Should count word frequencies."
          assert word_count("") == {}, "Empty string should return empty dict."
        `,
      },
    ],
    hints: [
      'Split the lowercase string: `words = s.lower().split()`.',
      'Iterate and increment values in a counts dictionary.',
    ],
    published: true,
  });
  pyChallengesM2.push(p2c2);

  const p2c3 = await Challenge.create({
    moduleId: pyModule2._id,
    title: 'List Comprehension Filter',
    description: `### List Comprehension\n\nList comprehensions offer a shorter syntax when you want to create a new list based on the values of an existing list.\n\n### Objective\nWrite a function \`get_evens(lst)\` that returns a list containing only the even numbers from the original \`lst\` list using a **list comprehension** syntax.`,
    language: 'python',
    difficulty: 'medium',
    xp: 40,
    starterCode: `def get_evens(lst):\n    # Use list comprehension syntax\n    pass`,
    solution: `def get_evens(lst):\n    return [x for x in lst if x % 2 == 0]`,
    validationRules: [
      {
        id: 'get_evens_exists',
        description: 'Verify function exists.',
        checkFn: `
          assert 'get_evens' in globals(), "Define 'get_evens'"
        `,
      },
      {
        id: 'get_evens_logic',
        description: 'Verify filter conditions.',
        checkFn: `
          assert get_evens([1, 2, 3, 4, 5]) == [2, 4], "Should filter odd numbers."
          assert get_evens([1, 3, 5]) == [], "Should return empty list if all are odd."
        `,
      },
    ],
    hints: [
      'The format for list comprehension with an if condition is: `[x for x in lst if condition]`.',
      'The condition is `x % 2 == 0`.',
    ],
    published: true,
  });
  pyChallengesM2.push(p2c3);

  const p2c4 = await Challenge.create({
    moduleId: pyModule2._id,
    title: 'The Car Class',
    description: `### Object-Oriented Programming (OOP)\n\nClasses create user-defined blueprints. The constructor \`__init__\` sets object instance fields, and instance methods must accept \`self\` as the first parameter.\n\n### Objective\nCreate a class named \`Car\` with an constructor that initializes \`brand\` (string) and \`speed\` (integer). Add an instance method \`accelerate(amount)\` that increases \`speed\` by \`amount\` and returns the new speed.`,
    language: 'python',
    difficulty: 'hard',
    xp: 80,
    starterCode: `class Car:\n    # Define your Car class here\n    pass`,
    solution: `class Car:\n    def __init__(self, brand, speed):\n        self.brand = brand\n        self.speed = speed\n    def accelerate(self, amount):\n        self.speed += amount\n        return self.speed`,
    validationRules: [
      {
        id: 'car_class_exists',
        description: 'Verify Car class is declared.',
        checkFn: `
          assert 'Car' in globals(), "Define 'Car' class."
          assert isinstance(Car, type), "'Car' must be a class definition."
        `,
      },
      {
        id: 'car_class_logic',
        description: 'Verify constructor parameters and accelerate method changes speed.',
        checkFn: `
          c = Car("Tesla", 80)
          assert c.brand == "Tesla", "Brand should be stored."
          assert c.speed == 80, "Speed should be initialized to 80."
          assert c.accelerate(30) == 110, "accelerate(30) should return 110."
          assert c.speed == 110, "Speed property should update to 110."
        `,
      },
    ],
    hints: [
      'Define `def __init__(self, brand, speed):` and store `self.brand = brand` and `self.speed = speed`.',
      'Define `def accelerate(self, amount):` and update `self.speed += amount`, returning `self.speed`.',
    ],
    published: true,
  });
  pyChallengesM2.push(p2c4);

  const p2c5 = await Challenge.create({
    moduleId: pyModule2._id,
    title: 'Safe Division Handler',
    description: `### Try/Except Block\n\nException handling in Python is managed using the \`try\` and \`except\` block structure to intercept run errors.\n\n### Objective\nWrite a function \`safe_divide(a, b)\` that returns \`a / b\`. If division by zero occurs (\`ZeroDivisionError\`), catch it and return \`None\`.`,
    language: 'python',
    difficulty: 'hard',
    xp: 80,
    starterCode: `def safe_divide(a, b):\n    # Write try-except block to handle ZeroDivisionError\n    pass`,
    solution: `def safe_divide(a, b):\n    try:\n        return a / b\n    except ZeroDivisionError:\n        return None`,
    validationRules: [
      {
        id: 'safe_divide_exists',
        description: 'Verify safe_divide function is defined.',
        checkFn: `
          assert 'safe_divide' in globals(), "Define 'safe_divide'"
        `,
      },
      {
        id: 'safe_divide_logic',
        description: 'Verify normal division returns float, and division by 0 returns None.',
        checkFn: `
          assert safe_divide(10, 2) == 5.0, "10 / 2 is 5.0"
          assert safe_divide(5, 0) is None, "Dividing by zero should catch ZeroDivisionError and return None."
        `,
      },
    ],
    hints: [
      'Put `return a / b` inside a `try:` block.',
      'Add `except ZeroDivisionError:` and return `None`.',
    ],
    published: true,
  });
  pyChallengesM2.push(p2c5);

  // Link Python Module 2 challenges in order
  for (let i = 0; i < pyChallengesM2.length - 1; i++) {
    pyChallengesM2[i].nextChallengeId = pyChallengesM2[i + 1]._id;
    await pyChallengesM2[i].save();
  }

  // Connect last challenge of module 1 to first challenge of module 2
  pyChallengesM1[pyChallengesM1.length - 1].nextChallengeId = pyChallengesM2[0]._id;
  await pyChallengesM1[pyChallengesM1.length - 1].save();

  // Create standard student progress baseline
  console.log('Seeding a default student progress record...');
  const firstWebChallenge = webChallengesM1[0]._id;
  const firstPyChallenge = pyChallengesM1[0]._id;

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

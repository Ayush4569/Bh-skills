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

  htmlChallenges.push(await Challenge.create({
    moduleId: htmlModule1._id,
    title: 'Subscript and Superscript',
    description: `### Subscript and Superscript\n\nUse \`<sub>\` for subscript text (like chemical formulas) and \`<sup>\` for superscript text (like math exponents).\n\n### Objective\nCreate a paragraph \`<p id="formula">H<sub>2</sub>O</p>\` and a paragraph \`<p id="exponent">E = mc<sup>2</sup></p>\`.`,
    language: 'html',
    difficulty: 'easy',
    xp: 20,
    starterCode: `<!-- Write your HTML code below -->\n`,
    solution: `<p id="formula">H<sub>2</sub>O</p>\n<p id="exponent">E = mc<sup>2</sup></p>`,
    validationRules: [
      {
        id: 'formula_sub',
        description: 'Verify paragraph #formula contains a <sub> element with text "2".',
        checkFn: `document.querySelector('p#formula > sub')?.textContent?.trim() === '2'`,
      },
      {
        id: 'exponent_sup',
        description: 'Verify paragraph #exponent contains a <sup> element with text "2".',
        checkFn: `document.querySelector('p#exponent > sup')?.textContent?.trim() === '2'`,
      },
    ],
    hints: ['Use `<sub>2</sub>` inside `<p id="formula">` and `<sup>2</sup>` inside `<p id="exponent">`.'],
    published: true,
  }));

  htmlChallenges.push(await Challenge.create({
    moduleId: htmlModule1._id,
    title: 'Blockquote Citation',
    description: `### Quotations & Citations\n\nThe \`<blockquote>\` tag represents a section quoted from another source. Use \`<cite>\` inside it to cite the author.\n\n### Objective\nCreate a \`<blockquote>\` containing the quote text \`Knowledge is power.\` and a \`<cite>\` tag with \`Francis Bacon\`.`,
    language: 'html',
    difficulty: 'easy',
    xp: 20,
    starterCode: `<!-- Write your HTML code below -->\n`,
    solution: `<blockquote>Knowledge is power. <cite>Francis Bacon</cite></blockquote>`,
    validationRules: [
      {
        id: 'blockquote_exists',
        description: 'Verify <blockquote> exists.',
        checkFn: `document.querySelector('blockquote') !== null`,
      },
      {
        id: 'cite_text',
        description: 'Verify <cite> element inside blockquote contains "Francis Bacon".',
        checkFn: `document.querySelector('blockquote cite')?.textContent?.trim() === 'Francis Bacon'`,
      },
    ],
    hints: ['Wrap the author name inside `<cite>Author</cite>`.'],
    published: true,
  }));

  htmlChallenges.push(await Challenge.create({
    moduleId: htmlModule1._id,
    title: 'Inline Code & Preformatted Text',
    description: `### Code Blocks\n\nThe \`<pre>\` tag preserves spaces and line breaks. Combine it with \`<code>\` to display formatted source code snippets.\n\n### Objective\nCreate a \`<pre>\` element containing a \`<code>\` element with text \`const x = 10;\`.`,
    language: 'html',
    difficulty: 'easy',
    xp: 20,
    starterCode: `<!-- Write your HTML code below -->\n`,
    solution: `<pre><code>const x = 10;</code></pre>`,
    validationRules: [
      {
        id: 'pre_code_exists',
        description: 'Verify <pre> containing <code> exists.',
        checkFn: `document.querySelector('pre > code') !== null`,
      },
      {
        id: 'code_content',
        description: 'Verify code snippet text is "const x = 10;".',
        checkFn: `document.querySelector('pre > code')?.textContent?.trim() === 'const x = 10;'`,
      },
    ],
    hints: ['Place `<code>const x = 10;</code>` inside `<pre></pre>`.'],
    published: true,
  }));

  htmlChallenges.push(await Challenge.create({
    moduleId: htmlModule2._id,
    title: 'HTML Audio Element',
    description: `### Media Elements\n\nThe \`<audio>\` tag embeds sound content. Use the \`controls\` attribute to display playback buttons.\n\n### Objective\nCreate an \`<audio id="audio-player" controls>\` with a \`<source src="song.mp3" type="audio/mpeg">\`.`,
    language: 'html',
    difficulty: 'medium',
    xp: 25,
    starterCode: `<!-- Write your HTML code below -->\n`,
    solution: `<audio id="audio-player" controls>\n  <source src="song.mp3" type="audio/mpeg">\n</audio>`,
    validationRules: [
      {
        id: 'audio_exists',
        description: 'Verify <audio id="audio-player"> has controls attribute.',
        checkFn: `document.querySelector('audio#audio-player[controls]') !== null`,
      },
      {
        id: 'source_exists',
        description: 'Verify source tag has src="song.mp3" and type="audio/mpeg".',
        checkFn: `document.querySelector('audio#audio-player > source[src="song.mp3"][type="audio/mpeg"]') !== null`,
      },
    ],
    hints: ['Add attribute `controls` inside `<audio>` opening tag.'],
    published: true,
  }));

  htmlChallenges.push(await Challenge.create({
    moduleId: htmlModule2._id,
    title: 'Description Lists',
    description: `### Definition & Description Lists\n\nA description list is created with \`<dl>\`, containing terms \`<dt>\` and descriptions \`<dd>\`.\n\n### Objective\nCreate a \`<dl id="terms-list">\` containing term \`<dt>HTML</dt>\` and description \`<dd>HyperText Markup Language</dd>\`.`,
    language: 'html',
    difficulty: 'easy',
    xp: 20,
    starterCode: `<!-- Write your HTML code below -->\n`,
    solution: `<dl id="terms-list">\n  <dt>HTML</dt>\n  <dd>HyperText Markup Language</dd>\n</dl>`,
    validationRules: [
      {
        id: 'dl_exists',
        description: 'Verify <dl id="terms-list"> exists.',
        checkFn: `document.querySelector('dl#terms-list') !== null`,
      },
      {
        id: 'dt_dd_correct',
        description: 'Verify term <dt> is "HTML" and description <dd> is "HyperText Markup Language".',
        checkFn: `document.querySelector('dl#terms-list > dt')?.textContent?.trim() === 'HTML' && document.querySelector('dl#terms-list > dd')?.textContent?.trim() === 'HyperText Markup Language'`,
      },
    ],
    hints: ['Use `<dl id="terms-list">` with child elements `<dt>` and `<dd>`.'],
    published: true,
  }));

  htmlChallenges.push(await Challenge.create({
    moduleId: htmlModule2._id,
    title: 'Semantic Article and Section',
    description: `### HTML5 Semantic Elements\n\nUse \`<article>\` for independent content and \`<section>\` for thematic grouping.\n\n### Objective\nCreate an \`<article id="blog-post">\` wrapping a \`<section class="post-content">\` with a paragraph \`<p>Hello World</p>\`.`,
    language: 'html',
    difficulty: 'medium',
    xp: 25,
    starterCode: `<!-- Write your HTML code below -->\n`,
    solution: `<article id="blog-post">\n  <section class="post-content">\n    <p>Hello World</p>\n  </section>\n</article>`,
    validationRules: [
      {
        id: 'article_exists',
        description: 'Verify <article id="blog-post"> exists.',
        checkFn: `document.querySelector('article#blog-post') !== null`,
      },
      {
        id: 'section_and_p',
        description: 'Verify section.post-content exists inside article and contains <p>Hello World</p>.',
        checkFn: `document.querySelector('article#blog-post > section.post-content > p')?.textContent?.trim() === 'Hello World'`,
      },
    ],
    hints: ['Nesting: `<article id="blog-post"><section class="post-content"><p>Hello World</p></section></article>`.'],
    published: true,
  }));

  htmlChallenges.push(await Challenge.create({
    moduleId: htmlModule3._id,
    title: 'Fieldset and Legend',
    description: `### Form Grouping\n\nGroup related controls using \`<fieldset>\` and provide a title caption with \`<legend>\`.\n\n### Objective\nCreate a \`<fieldset id="user-info">\` with a \`<legend>Personal Info</legend>\` and a text input \`<input type="text">\`.`,
    language: 'html',
    difficulty: 'medium',
    xp: 25,
    starterCode: `<!-- Write your HTML code below -->\n`,
    solution: `<fieldset id="user-info">\n  <legend>Personal Info</legend>\n  <input type="text" />\n</fieldset>`,
    validationRules: [
      {
        id: 'fieldset_exists',
        description: 'Verify <fieldset id="user-info"> exists.',
        checkFn: `document.querySelector('fieldset#user-info') !== null`,
      },
      {
        id: 'legend_and_input',
        description: 'Verify <legend>Personal Info</legend> and <input type="text"> exist inside fieldset.',
        checkFn: `document.querySelector('fieldset#user-info > legend')?.textContent?.trim() === 'Personal Info' && document.querySelector('fieldset#user-info > input[type="text"]') !== null`,
      },
    ],
    hints: ['Place `<legend>` as the very first child of `<fieldset>`.'],
    published: true,
  }));

  htmlChallenges.push(await Challenge.create({
    moduleId: htmlModule3._id,
    title: 'Progress and Meter Elements',
    description: `### Visual Indicators\n\n\`<progress>\` displays completion progress, while \`<meter>\` displays a measurement within a known range.\n\n### Objective\nCreate a \`<progress id="download-progress" value="70" max="100">\` and a \`<meter id="storage-meter" value="0.6">\`.`,
    language: 'html',
    difficulty: 'easy',
    xp: 20,
    starterCode: `<!-- Write your HTML code below -->\n`,
    solution: `<progress id="download-progress" value="70" max="100"></progress>\n<meter id="storage-meter" value="0.6"></meter>`,
    validationRules: [
      {
        id: 'progress_exists',
        description: 'Verify progress element exists with value="70" and max="100".',
        checkFn: `document.querySelector('progress#download-progress[value="70"][max="100"]') !== null`,
      },
      {
        id: 'meter_exists',
        description: 'Verify meter element exists with value="0.6".',
        checkFn: `document.querySelector('meter#storage-meter[value="0.6"]') !== null`,
      },
    ],
    hints: ['Write attributes as `value="70"` and `max="100"`.'],
    published: true,
  }));

  htmlChallenges.push(await Challenge.create({
    moduleId: htmlModule3._id,
    title: 'Build Portfolio Website',
    description: `### Final Project: Build Portfolio Website\n\nCreate a personal portfolio layout using all your HTML knowledge. It must contain the following structural and content elements:\n\n1. A main heading \`<h1>\` with your name.\n2. An ID-targeted paragraph \`<p id="bio">\` with a brief bio description.\n3. An unordered list \`<ul>\` with class \`skills-list\` containing at least three \`<li>\` elements listing your developer skills.\n4. A contact form containing an \`<input id="contact-email" type="email">\` and a \`<textarea id="contact-msg">\`.\n5. An anchor link pointing to your github profile page \`https://github.com\` with target \`_blank\`.\n\n### Objective\nAssemble your profile page containing headings, paragraph tags, unordered lists, input forms, textareas, and hyperlinks.`,
    language: 'html',
    difficulty: 'hard',
    xp: 120,
    starterCode: `<!-- Write your HTML portfolio code below -->\n`,
    solution: `<h1>John Doe</h1>\n<p id="bio">Passionate web developer building clean user interfaces.</p>\n<ul class="skills-list">\n  <li>HTML</li>\n  <li>CSS</li>\n  <li>JavaScript</li>\n</ul>\n<form>\n  <input id="contact-email" type="email" placeholder="Your Email" />\n  <textarea id="contact-msg" placeholder="Your Message"></textarea>\n</form>\n<a href="https://github.com" target="_blank">My GitHub</a>`,
    validationRules: [
      {
        id: 'h1_exists',
        description: 'Verify that an <h1> element exists.',
        checkFn: `document.querySelector('h1') !== null`,
      },
      {
        id: 'bio_exists',
        description: 'Verify that a paragraph <p id="bio"> exists.',
        checkFn: `document.querySelector('p#bio') !== null`,
      },
      {
        id: 'skills_exist',
        description: 'Verify that an unordered list <ul class="skills-list"> has at least 3 <li> list items.',
        checkFn: `document.querySelectorAll('ul.skills-list > li').length >= 3`,
      },
      {
        id: 'form_fields',
        description: 'Verify input email and textarea message elements are present with correct IDs.',
        checkFn: `document.querySelector('input#contact-email[type="email"]') !== null && document.querySelector('textarea#contact-msg') !== null`,
      },
      {
        id: 'link_exists',
        description: 'Verify anchor link pointing to https://github.com opens in a new tab.',
        checkFn: `document.querySelector('a[href="https://github.com"][target="_blank"]') !== null`,
      },
    ],
    hints: ['Wrap list items inside a ul element with class="skills-list".', 'Ensure input and textarea elements have the correct id attributes.', 'Make sure the anchor link target is set to "_blank".'],
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
    moduleId: cssModule1._id,
    title: 'Pricing Card',
    description: `### Final Project: Pricing Card\n\nBuild a styled pricing card component to practice styling, widths, backgrounds, paddings, margins, and borders.\n\n### Objective\nStyle the pricing card and its inner content to match the design requirements:\n1. A card container \`#pricing-card\` with background color \`rgb(30, 41, 59)\`, border radius \`16px\`, width \`300px\`, padding \`30px\`, and margin centered using \`auto\`.\n2. A heading \`#plan-name\` styled with text color \`rgb(244, 63, 94)\` and centered text alignment.\n3. A price text \`#plan-price\` with font size \`36px\`, bold font weight, and centered text alignment.\n4. A list of features inside \`.features\` with white text color \`rgb(255, 255, 255)\` and padding top \`20px\`.`,
    language: 'css',
    difficulty: 'hard',
    xp: 120,
    starterCode: `<style>\n  #pricing-card {\n    /* Style here */\n  }\n  #plan-name {\n    /* Style here */\n  }\n  #plan-price {\n    /* Style here */\n  }\n  .features {\n    /* Style here */\n  }\n</style>\n<div id="pricing-card">\n  <h2 id="plan-name">Pro Plan</h2>\n  <div id="plan-price">$19/mo</div>\n  <ul class="features">\n    <li>Unlimited Access</li>\n    <li>Dedicated Support</li>\n    <li>Source Code Access</li>\n  </ul>\n</div>`,
    solution: `<style>\n  #pricing-card {\n    background-color: rgb(30, 41, 59);\n    border-radius: 16px;\n    width: 300px;\n    padding: 30px;\n    margin: auto;\n  }\n  #plan-name {\n    color: rgb(244, 63, 94);\n    text-align: center;\n  }\n  #plan-price {\n    font-size: 36px;\n    font-weight: bold;\n    text-align: center;\n  }\n  .features {\n    color: rgb(255, 255, 255);\n    padding-top: 20px;\n  }\n</style>\n<div id="pricing-card">\n  <h2 id="plan-name">Pro Plan</h2>\n  <div id="plan-price">$19/mo</div>\n  <ul class="features">\n    <li>Unlimited Access</li>\n    <li>Dedicated Support</li>\n    <li>Source Code Access</li>\n  </ul>\n</div>`,
    validationRules: [
      {
        id: 'card_exists',
        description: 'Verify #pricing-card element exists.',
        checkFn: `document.getElementById('pricing-card') !== null`,
      },
      {
        id: 'card_styles',
        description: 'Verify #pricing-card styles (bg-color: rgb(30, 41, 59), width: 300px, padding: 30px, border-radius: 16px).',
        checkFn: `(() => {
          const s = window.getComputedStyle(document.getElementById('pricing-card'));
          return s.backgroundColor === 'rgb(30, 41, 59)' && s.borderRadius === '16px' && s.width === '300px' && s.padding === '30px';
        })()`,
      },
      {
        id: 'name_styles',
        description: 'Verify plan name is centered with color rgb(244, 63, 94).',
        checkFn: `(() => {
          const s = window.getComputedStyle(document.getElementById('plan-name'));
          return s.color === 'rgb(244, 63, 94)' && s.textAlign === 'center';
        })()`,
      },
      {
        id: 'price_styles',
        description: 'Verify price has font-size 36px, bold font-weight, and is centered.',
        checkFn: `(() => {
          const s = window.getComputedStyle(document.getElementById('plan-price'));
          return s.fontSize === '36px' && (s.fontWeight === 'bold' || s.fontWeight === '700') && s.textAlign === 'center';
        })()`,
      },
    ],
    hints: ['Set the ID styling selectors using `#` followed by the element ID.', 'Ensure spelling of hex or rgb colors is exactly correct.'],
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
    moduleId: cssModule2._id,
    title: 'Dashboard',
    description: `### Final Project: Dashboard\n\nDesign a mini analytics dashboard layout with layout cells, stats cards, and typography.\n\n### Objective\nStyle the layout elements to create a sleek dashboard component:\n1. A flex or grid container \`#dashboard-grid\` with a gap of \`20px\`.\n2. Three stats cards with class \`.stat-card\` inside, each having background color \`rgb(15, 23, 42)\`, border radius \`12px\`, padding \`20px\`, and text color white (\`rgb(255, 255, 255)\`).\n3. Inside each \`.stat-card\`, a label with class \`.stat-label\` styled to have font size \`12px\` and text transform set to \`uppercase\`.\n4. A main number display with class \`.stat-value\` styled with font size \`28px\` and bold font weight.`,
    language: 'css',
    difficulty: 'hard',
    xp: 120,
    starterCode: `<style>\n  #dashboard-grid {\n    /* Layout styling */\n  }\n  .stat-card {\n    /* Style here */\n  }\n  .stat-label {\n    /* Style here */\n  }\n  .stat-value {\n    /* Style here */\n  }\n</style>\n<div id="dashboard-grid">\n  <div class="stat-card">\n    <div class="stat-label">Active Users</div>\n    <div class="stat-value">1,240</div>\n  </div>\n  <div class="stat-card">\n    <div class="stat-label">Total Revenue</div>\n    <div class="stat-value">$14,230</div>\n  </div>\n  <div class="stat-card">\n    <div class="stat-label">Open Issues</div>\n    <div class="stat-value">18</div>\n  </div>\n</div>`,
    solution: `<style>\n  #dashboard-grid {\n    display: flex;\n    gap: 20px;\n  }\n  .stat-card {\n    background-color: rgb(15, 23, 42);\n    border-radius: 12px;\n    padding: 20px;\n    color: rgb(255, 255, 255);\n    flex: 1;\n  }\n  .stat-label {\n    font-size: 12px;\n    text-transform: uppercase;\n  }\n  .stat-value {\n    font-size: 28px;\n    font-weight: bold;\n  }\n</style>\n<div id="dashboard-grid">\n  <div class="stat-card">\n    <div class="stat-label">Active Users</div>\n    <div class="stat-value">1,240</div>\n  </div>\n  <div class="stat-card">\n    <div class="stat-label">Total Revenue</div>\n    <div class="stat-value">$14,230</div>\n  </div>\n  <div class="stat-card">\n    <div class="stat-label">Open Issues</div>\n    <div class="stat-value">18</div>\n  </div>\n</div>`,
    validationRules: [
      {
        id: 'grid_exists',
        description: 'Verify #dashboard-grid container exists.',
        checkFn: `document.getElementById('dashboard-grid') !== null`,
      },
      {
        id: 'card_count',
        description: 'Verify there are exactly 3 stat cards.',
        checkFn: `document.querySelectorAll('.stat-card').length === 3`,
      },
      {
        id: 'card_styles',
        description: 'Verify .stat-card has background color rgb(15, 23, 42), border-radius 12px, padding 20px, and white text.',
        checkFn: `(() => {
          const card = document.querySelector('.stat-card');
          if (!card) return false;
          const s = window.getComputedStyle(card);
          return s.backgroundColor === 'rgb(15, 23, 42)' && s.borderRadius === '12px' && s.padding === '20px' && s.color === 'rgb(255, 255, 255)';
        })()`,
      },
      {
        id: 'label_styles',
        description: 'Verify .stat-label has font-size 12px and text-transform uppercase.',
        checkFn: `(() => {
          const label = document.querySelector('.stat-label');
          if (!label) return false;
          const s = window.getComputedStyle(label);
          return s.fontSize === '12px' && s.textTransform === 'uppercase';
        })()`,
      },
      {
        id: 'value_styles',
        description: 'Verify .stat-value has font-size 28px and bold font-weight.',
        checkFn: `(() => {
          const val = document.querySelector('.stat-value');
          if (!val) return false;
          const s = window.getComputedStyle(val);
          return s.fontSize === '28px' && (s.fontWeight === 'bold' || s.fontWeight === '700');
        })()`,
      },
    ],
    hints: ['Use `display: flex; gap: 20px;` to align the stat cards.', 'Apply CSS properties inside selector blocks matching `.stat-card`, `.stat-label`, and `.stat-value`.'],
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

  cssChallenges.push(await Challenge.create({
    moduleId: cssModule3._id,
    title: 'Landing Page',
    description: `### Final Project: Landing Page\n\nBuild a responsive marketing landing page hero section with absolute elements, hover transitions, and dark background gradients.\n\n### Objective\nAssemble a hero layout section using absolute positioning, shadow styling, and micro-interaction states:\n1. Container \`.hero-section\` with relative position, height \`400px\`, background color \`rgb(9, 9, 11)\`.\n2. A call-to-action button \`.cta-btn\` centered with border radius \`8px\`, transition \`transform 0.2s ease\`, and on hover scale up by \`scale(1.05)\`.\n3. A decorative absolute element \`.decor-circle\` positioned at \`top: 20px\`, \`right: 20px\` with width and height of \`80px\`, border-radius \`50%\`, and box-shadow set to \`0px 0px 20px rgba(99, 102, 241, 0.5)\`.`,
    language: 'css',
    difficulty: 'hard',
    xp: 120,
    starterCode: `<style>\n  .hero-section {\n    /* Base hero section style */\n  }\n  .decor-circle {\n    /* Absolute positioned circle */\n  }\n  .cta-btn {\n    /* Button styles & transitions */\n  }\n  .cta-btn:hover {\n    /* Scale on hover */\n  }\n</style>\n<div class="hero-section">\n  <div class="decor-circle"></div>\n  <h1>Build The Future</h1>\n  <p>Learn coding step by step on Brainheaters Labs.</p>\n  <button class="cta-btn">Get Started</button>\n</div>`,
    solution: `<style>\n  .hero-section {\n    position: relative;\n    height: 400px;\n    background-color: rgb(9, 9, 11);\n    color: white;\n    padding: 60px;\n  }\n  .decor-circle {\n    position: absolute;\n    top: 20px;\n    right: 20px;\n    width: 80px;\n    height: 80px;\n    border-radius: 50%;\n    background-color: rgb(99, 102, 241);\n    box-shadow: 0px 0px 20px rgba(99, 102, 241, 0.5);\n  }\n  .cta-btn {\n    border-radius: 8px;\n    padding: 12px 24px;\n    background-color: rgb(99, 102, 241);\n    color: white;\n    border: none;\n    cursor: pointer;\n    transition: transform 0.2s ease;\n  }\n  .cta-btn:hover {\n    transform: scale(1.05);\n  }\n</style>\n<div class="hero-section">\n  <div class="decor-circle"></div>\n  <h1>Build The Future</h1>\n  <p>Learn coding step by step on Brainheaters Labs.</p>\n  <button class="cta-btn">Get Started</button>\n</div>`,
    validationRules: [
      {
        id: 'hero_exists',
        description: 'Verify .hero-section exists.',
        checkFn: `document.querySelector('.hero-section') !== null`,
      },
      {
        id: 'hero_relative',
        description: 'Verify .hero-section is styled with relative positioning.',
        checkFn: `window.getComputedStyle(document.querySelector('.hero-section')).position === 'relative'`,
      },
      {
        id: 'circle_absolute',
        description: 'Verify decorative circle is styled with absolute positioning, top 20px, right 20px, width 80px, and border-radius 50%.',
        checkFn: `(() => {
          const el = document.querySelector('.decor-circle');
          if (!el) return false;
          const s = window.getComputedStyle(el);
          return s.position === 'absolute' && s.top === '20px' && s.right === '20px' && s.width === '80px' && s.borderRadius === '50%';
        })()`,
      },
      {
        id: 'cta_btn_transition',
        description: 'Verify CTA button is styled with border-radius 8px and transform transition.',
        checkFn: `(() => {
          const el = document.querySelector('.cta-btn');
          if (!el) return false;
          const s = window.getComputedStyle(el);
          return s.borderRadius === '8px' && s.transitionProperty.includes('transform');
        })()`,
      },
    ],
    hints: ['Declare `position: absolute;` on `.decor-circle` so it positions relative to the hero container.', 'Write transition properties as: `transition: transform 0.2s ease;`.'],
    published: true,
  }));

  cssChallenges.push(await Challenge.create({
    moduleId: cssModule1._id,
    title: 'Border Box Sizing',
    description: `### CSS Box Sizing\n\nBy default, padding and border expand an element's total width. Setting \`box-sizing: border-box\` includes them in the width.\n\n### Objective\nStyle \`.box-card\` with \`box-sizing: border-box;\`, \`width: 200px;\`, \`padding: 20px;\`, and \`border: 5px solid red;\`.`,
    language: 'css',
    difficulty: 'easy',
    xp: 20,
    starterCode: `<style>\n  .box-card {\n    /* Add styles here */\n  }\n</style>\n<div class="box-card">Box Sizing Test</div>`,
    solution: `<style>\n  .box-card {\n    box-sizing: border-box;\n    width: 200px;\n    padding: 20px;\n    border: 5px solid red;\n  }\n</style>\n<div class="box-card">Box Sizing Test</div>`,
    validationRules: [
      {
        id: 'box_sizing',
        description: 'Verify .box-card uses box-sizing: border-box and width 200px.',
        checkFn: `(() => { const s = window.getComputedStyle(document.querySelector('.box-card')); return s.boxSizing === 'border-box' && s.width === '200px'; })()`,
      },
    ],
    hints: ['Use `box-sizing: border-box;`.'],
    published: true,
  }));

  cssChallenges.push(await Challenge.create({
    moduleId: cssModule1._id,
    title: 'CSS Outline and Offset',
    description: `### Focus Outlines\n\nOutlines do not take up layout space. Use \`outline-offset\` to create breathing room around focus rings.\n\n### Objective\nStyle \`.focus-btn\` with \`outline: 3px solid rgb(99, 102, 241);\` and \`outline-offset: 4px;\`.`,
    language: 'css',
    difficulty: 'easy',
    xp: 20,
    starterCode: `<style>\n  .focus-btn {\n    /* Add styles here */\n  }\n</style>\n<button class="focus-btn">Accessible Button</button>`,
    solution: `<style>\n  .focus-btn {\n    outline: 3px solid rgb(99, 102, 241);\n    outline-offset: 4px;\n  }\n</style>\n<button class="focus-btn">Accessible Button</button>`,
    validationRules: [
      {
        id: 'outline_style',
        description: 'Verify .focus-btn has outline 3px solid rgb(99, 102, 241) and offset 4px.',
        checkFn: `(() => { const s = window.getComputedStyle(document.querySelector('.focus-btn')); return s.outlineStyle === 'solid' && s.outlineOffset === '4px'; })()`,
      },
    ],
    hints: ['Use `outline-offset: 4px;`.'],
    published: true,
  }));

  cssChallenges.push(await Challenge.create({
    moduleId: cssModule1._id,
    title: 'Custom Scrollbar Container',
    description: `### Scroll Containers\n\nControl vertical scrolling behavior when content overflows a container.\n\n### Objective\nStyle \`.scroll-box\` with \`height: 150px;\` and \`overflow-y: scroll;\`.`,
    language: 'css',
    difficulty: 'medium',
    xp: 25,
    starterCode: `<style>\n  .scroll-box {\n    /* Add styles here */\n  }\n</style>\n<div class="scroll-box"><p>Long content...</p><p>More text...</p><p>Extra lines...</p></div>`,
    solution: `<style>\n  .scroll-box {\n    height: 150px;\n    overflow-y: scroll;\n  }\n</style>\n<div class="scroll-box"><p>Long content...</p><p>More text...</p><p>Extra lines...</p></div>`,
    validationRules: [
      {
        id: 'scroll_box',
        description: 'Verify .scroll-box has height 150px and overflow-y: scroll.',
        checkFn: `(() => { const s = window.getComputedStyle(document.querySelector('.scroll-box')); return s.height === '150px' && s.overflowY === 'scroll'; })()`,
      },
    ],
    hints: ['Use `overflow-y: scroll;`.'],
    published: true,
  }));

  cssChallenges.push(await Challenge.create({
    moduleId: cssModule2._id,
    title: 'Text Shadow Drop Effects',
    description: `### Text Shadows\n\nAdd depth to typography using the \`text-shadow\` property.\n\n### Objective\nStyle \`.glow-title\` with \`text-shadow: 2px 2px 8px rgba(99, 102, 241, 0.8);\`.`,
    language: 'css',
    difficulty: 'easy',
    xp: 20,
    starterCode: `<style>\n  .glow-title {\n    /* Add styles here */\n  }\n</style>\n<h1 class="glow-title">Glowing Heading</h1>`,
    solution: `<style>\n  .glow-title {\n    text-shadow: 2px 2px 8px rgba(99, 102, 241, 0.8);\n  }\n</style>\n<h1 class="glow-title">Glowing Heading</h1>`,
    validationRules: [
      {
        id: 'text_shadow',
        description: 'Verify .glow-title has text-shadow applied.',
        checkFn: `(() => { const s = window.getComputedStyle(document.querySelector('.glow-title')); return s.textShadow !== 'none'; })()`,
      },
    ],
    hints: ['Use `text-shadow: 2px 2px 8px rgba(99, 102, 241, 0.8);`.'],
    published: true,
  }));

  cssChallenges.push(await Challenge.create({
    moduleId: cssModule2._id,
    title: 'Gradient Text Masking',
    description: `### Gradient Typography\n\nCombine linear background gradients with text color masking.\n\n### Objective\nStyle \`.gradient-text\` with \`background-image: linear-gradient(to right, rgb(245, 158, 11), rgb(99, 102, 241));\` and \`color: transparent;\`.`,
    language: 'css',
    difficulty: 'medium',
    xp: 30,
    starterCode: `<style>\n  .gradient-text {\n    /* Add styles here */\n  }\n</style>\n<h1 class="gradient-text">Gradient Text</h1>`,
    solution: `<style>\n  .gradient-text {\n    background-image: linear-gradient(to right, rgb(245, 158, 11), rgb(99, 102, 241));\n    color: transparent;\n  }\n</style>\n<h1 class="gradient-text">Gradient Text</h1>`,
    validationRules: [
      {
        id: 'gradient_text',
        description: 'Verify .gradient-text has background-image linear gradient and transparent text color.',
        checkFn: `(() => { const s = window.getComputedStyle(document.querySelector('.gradient-text')); return s.backgroundImage.includes('gradient') && (s.color === 'transparent' || s.color === 'rgba(0, 0, 0, 0)'); })()`,
      },
    ],
    hints: ['Set `color: transparent;`.'],
    published: true,
  }));

  cssChallenges.push(await Challenge.create({
    moduleId: cssModule2._id,
    title: 'Image Filter Adjustments',
    description: `### Image Filters\n\nApply real-time CSS graphical effects to images like grayscale or blur.\n\n### Objective\nStyle \`.gray-image\` with \`filter: grayscale(100%);\`.`,
    language: 'css',
    difficulty: 'easy',
    xp: 20,
    starterCode: `<style>\n  .gray-image {\n    /* Add styles here */\n  }\n</style>\n<img class="gray-image" src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=300" />`,
    solution: `<style>\n  .gray-image {\n    filter: grayscale(100%);\n  }\n</style>\n<img class="gray-image" src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=300" />`,
    validationRules: [
      {
        id: 'grayscale_filter',
        description: 'Verify .gray-image uses filter: grayscale(100%).',
        checkFn: `(() => { const s = window.getComputedStyle(document.querySelector('.gray-image')); return s.filter.includes('grayscale'); })()`,
      },
    ],
    hints: ['Use `filter: grayscale(100%);`.'],
    published: true,
  }));

  cssChallenges.push(await Challenge.create({
    moduleId: cssModule3._id,
    title: 'Fluid Typography with Clamp',
    description: `### Responsive Typography\n\n\`clamp(min, preferred, max)\` scales font sizes fluidly based on viewport size.\n\n### Objective\nStyle \`.fluid-heading\` with \`font-size: clamp(16px, 4vw, 48px);\`.`,
    language: 'css',
    difficulty: 'medium',
    xp: 30,
    starterCode: `<style>\n  .fluid-heading {\n    /* Add styles here */\n  }\n</style>\n<h1 class="fluid-heading">Fluid Title</h1>`,
    solution: `<style>\n  .fluid-heading {\n    font-size: clamp(16px, 4vw, 48px);\n  }\n</style>\n<h1 class="fluid-heading">Fluid Title</h1>`,
    validationRules: [
      {
        id: 'font_size_clamp',
        description: 'Verify .fluid-heading has font-size specified.',
        checkFn: `(() => { const s = window.getComputedStyle(document.querySelector('.fluid-heading')); return Boolean(s.fontSize); })()`,
      },
    ],
    hints: ['Use `font-size: clamp(16px, 4vw, 48px);`.'],
    published: true,
  }));

  cssChallenges.push(await Challenge.create({
    moduleId: cssModule3._id,
    title: 'Aspect Ratio Box Containers',
    description: `### Responsive Media Ratios\n\nPreserve media dimensions using the native \`aspect-ratio\` property.\n\n### Objective\nStyle \`.video-container\` with \`aspect-ratio: 16 / 9;\` and \`width: 100%;\`.`,
    language: 'css',
    difficulty: 'medium',
    xp: 30,
    starterCode: `<style>\n  .video-container {\n    /* Add styles here */\n  }\n</style>\n<div class="video-container">Video Frame</div>`,
    solution: `<style>\n  .video-container {\n    aspect-ratio: 16 / 9;\n    width: 100%;\n  }\n</style>\n<div class="video-container">Video Frame</div>`,
    validationRules: [
      {
        id: 'aspect_ratio_applied',
        description: 'Verify .video-container has aspect-ratio: 16 / 9 and width: 100%.',
        checkFn: `(() => { const s = window.getComputedStyle(document.querySelector('.video-container')); return (s.aspectRatio === '16 / 9' || s.aspectRatio.includes('1.777')) && s.width !== '0px'; })()`,
      },
    ],
    hints: ['Use `aspect-ratio: 16 / 9;`.'],
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
    moduleId: jsModule1._id,
    title: 'Calculator',
    description: `### Final Project: Calculator\n\nBuild a fully functioning interactive calculator widget.\n\n### Objective\nCreate an interactive calculator:\n1. Two inputs \`#num1\` and \`#num2\` (type number).\n2. Four action buttons: \`#btn-add\` (+), \`#btn-sub\` (-), \`#btn-mul\` (*), and \`#btn-div\` (/).\n3. A result paragraph \`#result\` that displays the calculated result when any math button is clicked.`,
    language: 'javascript',
    difficulty: 'hard',
    xp: 120,
    starterCode: `<input id="num1" type="number" value="10" />\n<input id="num2" type="number" value="5" />\n<button id="btn-add">+</button>\n<button id="btn-sub">-</button>\n<button id="btn-mul">*</button>\n<button id="btn-div">/</button>\n<p id="result">Result will appear here</p>\n<script>\n  // Add operation handlers here\n</script>`,
    solution: `<input id="num1" type="number" value="10" />\n<input id="num2" type="number" value="5" />\n<button id="btn-add">+</button>\n<button id="btn-sub">-</button>\n<button id="btn-mul">*</button>\n<button id="btn-div">/</button>\n<p id="result">Result will appear here</p>\n<script>\n  const n1 = document.getElementById('num1');\n  const n2 = document.getElementById('num2');\n  const res = document.getElementById('result');\n  document.getElementById('btn-add').addEventListener('click', () => {\n    res.textContent = String(parseFloat(n1.value) + parseFloat(n2.value));\n  });\n  document.getElementById('btn-sub').addEventListener('click', () => {\n    res.textContent = String(parseFloat(n1.value) - parseFloat(n2.value));\n  });\n  document.getElementById('btn-mul').addEventListener('click', () => {\n    res.textContent = String(parseFloat(n1.value) * parseFloat(n2.value));\n  });\n  document.getElementById('btn-div').addEventListener('click', () => {\n    res.textContent = String(parseFloat(n1.value) / parseFloat(n2.value));\n  });\n</script>`,
    validationRules: [
      {
        id: 'calc_exists',
        description: 'Verify input elements and result elements exist.',
        checkFn: `document.getElementById('num1') !== null && document.getElementById('result') !== null`,
      },
      {
        id: 'operations',
        description: 'Verify addition, subtraction, multiplication, and division button clicks update #result correctly.',
        checkFn: `(() => {
          const n1 = document.getElementById('num1');
          const n2 = document.getElementById('num2');
          const res = document.getElementById('result');
          n1.value = '12';
          n2.value = '4';
          document.getElementById('btn-add').click();
          if (res.textContent.trim() !== '16') return false;
          document.getElementById('btn-sub').click();
          if (res.textContent.trim() !== '8') return false;
          document.getElementById('btn-mul').click();
          if (res.textContent.trim() !== '48') return false;
          document.getElementById('btn-div').click();
          return res.textContent.trim() === '3' || res.textContent.trim() === '3.0';
        })()`,
      },
    ],
    hints: ['Parse user inputs with \`parseFloat()\` or \`Number()\` inside your click event handlers.', 'Assign the computed result as a string to \`result.textContent\`.'],
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
    moduleId: jsModule2._id,
    title: 'Quiz App',
    description: `### Final Project: Quiz App\n\nBuild a simple quiz widget that counts correct answers.\n\n### Objective\nCreate an interactive quiz question:\n1. A single-choice radio button answer container with inputs matching \`name="answer"\`. The correct answer choice is \`Paris\`.\n2. A button \`#submit-quiz\` that validates the user's selection on click.\n3. A feedback paragraph \`#quiz-feedback\` that outputs the selection outcome:\n   - If no option is selected: \`Please select an answer\`\n   - If correct option selected: \`Correct!\`\n   - If incorrect option selected: \`Incorrect, try again!\``,
    language: 'javascript',
    difficulty: 'hard',
    xp: 120,
    starterCode: `<p>What is the capital of France?</p>\n<label><input type="radio" name="answer" value="London" /> London</label>\n<label><input type="radio" name="answer" value="Paris" /> Paris</label>\n<label><input type="radio" name="answer" value="Rome" /> Rome</label>\n<button id="submit-quiz">Submit</button>\n<p id="quiz-feedback"></p>\n<script>\n  // Add checking logic here\n</script>`,
    solution: `<p>What is the capital of France?</p>\n<label><input type="radio" name="answer" value="London" /> London</label>\n<label><input type="radio" name="answer" value="Paris" /> Paris</label>\n<label><input type="radio" name="answer" value="Rome" /> Rome</label>\n<button id="submit-quiz">Submit</button>\n<p id="quiz-feedback"></p>\n<script>\n  const btn = document.getElementById('submit-quiz');\n  const fb = document.getElementById('quiz-feedback');\n  btn.addEventListener('click', () => {\n    const selected = document.querySelector('input[name="answer"]:checked');\n    if (!selected) {\n      fb.textContent = 'Please select an answer';\n      return;\n    }\n    if (selected.value === 'Paris') {\n      fb.textContent = 'Correct!';\n    } else {\n      fb.textContent = 'Incorrect, try again!';\n    }\n  });\n</script>`,
    validationRules: [
      {
        id: 'quiz_elements',
        description: 'Verify submit button and feedback paragraph exist.',
        checkFn: `document.getElementById('submit-quiz') !== null && document.getElementById('quiz-feedback') !== null`,
      },
      {
        id: 'empty_submission',
        description: 'Verify feedback shows "Please select an answer" if no radio button is selected on submit click.',
        checkFn: `(() => {
          const fb = document.getElementById('quiz-feedback');
          const btn = document.getElementById('submit-quiz');
          document.querySelectorAll('input[name="answer"]').forEach(r => r.checked = false);
          btn.click();
          return fb.textContent.trim() === 'Please select an answer';
        })()`,
      },
      {
        id: 'correct_submission',
        description: 'Verify selecting "Paris" and clicking submit displays "Correct!".',
        checkFn: `(() => {
          const fb = document.getElementById('quiz-feedback');
          const btn = document.getElementById('submit-quiz');
          const correct = document.querySelector('input[name="answer"][value="Paris"]');
          if (!correct) return false;
          correct.checked = true;
          btn.click();
          return fb.textContent.trim() === 'Correct!';
        })()`,
      },
      {
        id: 'incorrect_submission',
        description: 'Verify selecting wrong answer displays "Incorrect, try again!".',
        checkFn: `(() => {
          const fb = document.getElementById('quiz-feedback');
          const btn = document.getElementById('submit-quiz');
          const wrong = document.querySelector('input[name="answer"][value="London"]');
          if (!wrong) return false;
          wrong.checked = true;
          btn.click();
          return fb.textContent.trim() === 'Incorrect, try again!';
        })()`,
      },
    ],
    hints: ['Check if an element is checked using document.querySelector("input[name=\'answer\']:checked").', 'Compare the checked input value with the target string Paris.'],
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

  jsChallenges.push(await Challenge.create({
    moduleId: jsModule3._id,
    title: 'Todo App',
    description: `### Final Project: Todo App\n\nBuild a Todo list application featuring adding items, completing items, and resetting items.\n\n### Objective\nCreate an interactive Todo list app:\n1. An input \`#todo-input\` and button \`#add-todo\`.\n2. A list container \`#todo-list\`.\n3. Clicking \`#add-todo\` appends an \`<li>\` item to \`#todo-list\` with the value from \`#todo-input\` (clear input after append).\n4. Inside each \`<li>\`, add a complete button with class \`.complete-btn\`. Clicking this button sets the parent \`<li>\`'s CSS text-decoration to \`line-through\`.`,
    language: 'javascript',
    difficulty: 'hard',
    xp: 120,
    starterCode: `<input id="todo-input" placeholder="Enter task..." />\n<button id="add-todo">Add Task</button>\n<ul id="todo-list"></ul>\n<script>\n  // Add list operations here\n</script>`,
    solution: `<input id="todo-input" placeholder="Enter task..." />\n<button id="add-todo">Add Task</button>\n<ul id="todo-list"></ul>\n<script>\n  const input = document.getElementById('todo-input');\n  const btn = document.getElementById('add-todo');\n  const list = document.getElementById('todo-list');\n  btn.addEventListener('click', () => {\n    const text = input.value.trim();\n    if (!text) return;\n    const li = document.createElement('li');\n    li.textContent = text + ' ';\n    const compBtn = document.createElement('button');\n    compBtn.textContent = 'Done';\n    compBtn.className = 'complete-btn';\n    compBtn.addEventListener('click', () => {\n      li.style.textDecoration = 'line-through';\n    });\n    li.appendChild(compBtn);\n    list.appendChild(li);\n    input.value = '';\n  });\n</script>`,
    validationRules: [
      {
        id: 'todo_elements',
        description: 'Verify todo-input input and todo-list list exist.',
        checkFn: `document.getElementById('todo-input') !== null && document.getElementById('todo-list') !== null`,
      },
      {
        id: 'add_item',
        description: 'Verify entering a task name and clicking add appends it to the list.',
        checkFn: `(() => {
          const input = document.getElementById('todo-input');
          const btn = document.getElementById('add-todo');
          const list = document.getElementById('todo-list');
          list.innerHTML = '';
          input.value = 'Learn Next.js';
          btn.click();
          const lis = list.querySelectorAll('li');
          return lis.length === 1 && lis[0].textContent.includes('Learn Next.js');
        })()`,
      },
      {
        id: 'complete_item',
        description: 'Verify clicking the complete button applies text-decoration line-through to the list item.',
        checkFn: `(() => {
          const list = document.getElementById('todo-list');
          const li = list.querySelector('li');
          if (!li) return false;
          const compBtn = li.querySelector('.complete-btn');
          if (!compBtn) return false;
          compBtn.click();
          return li.style.textDecoration === 'line-through';
        })()`,
      },
    ],
    hints: ['Create an element using \`document.createElement()\` and append it using \`appendChild()\`.', 'Select parent elements of clicked target complete buttons to toggle text-decorations.'],
    published: true,
  }));

  jsChallenges.push(await Challenge.create({
    moduleId: jsModule3._id,
    title: 'Weather App',
    description: `### Final Project: Weather App\n\nSimulate fetching weather data for a city dynamically.\n\n### Objective\nCreate a mock weather retrieval widget:\n1. Input \`#city-input\` and button \`#get-weather\`.\n2. Output container card \`#weather-result\`.\n3. Clicking the button updates the text content of \`#weather-result\` to read: \`Weather in [city]: Sunny, 24°C\` (where [city] is the trimmed input value).`,
    language: 'javascript',
    difficulty: 'hard',
    xp: 120,
    starterCode: `<input id="city-input" placeholder="Enter city..." />\n<button id="get-weather">Get Weather</button>\n<div id="weather-result"></div>\n<script>\n  // Add weather retrieval logic here\n</script>`,
    solution: `<input id="city-input" placeholder="Enter city..." />\n<button id="get-weather">Get Weather</button>\n<div id="weather-result"></div>\n<script>\n  const inp = document.getElementById('city-input');\n  const btn = document.getElementById('get-weather');\n  const res = document.getElementById('weather-result');\n  btn.addEventListener('click', () => {\n    const city = inp.value.trim();\n    if (!city) return;\n    res.textContent = 'Weather in ' + city + ': Sunny, 24°C';\n  });\n</script>`,
    validationRules: [
      {
        id: 'weather_elements',
        description: 'Verify input city element and weather result card exist.',
        checkFn: `document.getElementById('city-input') !== null && document.getElementById('weather-result') !== null`,
      },
      {
        id: 'check_weather',
        description: 'Verify entering "Mumbai" and clicking weather updates output text to "Weather in Mumbai: Sunny, 24°C".',
        checkFn: `(() => {
          const inp = document.getElementById('city-input');
          const btn = document.getElementById('get-weather');
          const res = document.getElementById('weather-result');
          inp.value = 'Mumbai';
          btn.click();
          return res.textContent.trim() === 'Weather in Mumbai: Sunny, 24°C';
        })()`,
      },
    ],
    hints: ['Read input value, trim whitespace using \`.trim()\`, and set result textContent matching the specified string.'],
    published: true,
  }));

  jsChallenges.push(await Challenge.create({
    moduleId: jsModule1._id,
    title: 'Live Character Counter',
    description: `### Real-time Input Listeners\n\nCount characters typed inside a textarea live and display the count.\n\n### Objective\nAttach an \`input\` event listener to \`#user-msg\` so that \`#char-num\` textContent reflects the current length of \`#user-msg\` value.`,
    language: 'javascript',
    difficulty: 'medium',
    xp: 30,
    starterCode: `<textarea id="user-msg" placeholder="Type message..."></textarea>\n<p>Count: <span id="char-num">0</span></p>\n<script>\n  const msg = document.getElementById('user-msg');\n  const num = document.getElementById('char-num');\n  // Add input listener here\n</script>`,
    solution: `<textarea id="user-msg" placeholder="Type message..."></textarea>\n<p>Count: <span id="char-num">0</span></p>\n<script>\n  const msg = document.getElementById('user-msg');\n  const num = document.getElementById('char-num');\n  msg.addEventListener('input', () => {\n    num.textContent = msg.value.length;\n  });\n</script>`,
    validationRules: [
      {
        id: 'counter_works',
        description: 'Verify typing inside #user-msg updates #char-num textContent to the string length.',
        checkFn: `(() => { const msg = document.getElementById('user-msg'); const num = document.getElementById('char-num'); msg.value = 'Hello'; msg.dispatchEvent(new Event('input')); return num.textContent.trim() === '5'; })()`,
      },
    ],
    hints: ['Read `msg.value.length` on `input` event.'],
    published: true,
  }));

  jsChallenges.push(await Challenge.create({
    moduleId: jsModule1._id,
    title: 'Password Visibility Toggle',
    description: `### Attribute Toggling\n\nToggle password field input types between \`'password'\` and \`'text'\` on button click.\n\n### Objective\nWhen clicking \`#toggle-btn\`, switch \`<input id="pass-field">\` type attribute from \`'password'\` to \`'text'\` (or vice-versa).`,
    language: 'javascript',
    difficulty: 'medium',
    xp: 30,
    starterCode: `<input id="pass-field" type="password" value="secret123" />\n<button id="toggle-btn">Show/Hide</button>\n<script>\n  const pass = document.getElementById('pass-field');\n  const btn = document.getElementById('toggle-btn');\n  // Add click listener to toggle input type\n</script>`,
    solution: `<input id="pass-field" type="password" value="secret123" />\n<button id="toggle-btn">Show/Hide</button>\n<script>\n  const pass = document.getElementById('pass-field');\n  const btn = document.getElementById('toggle-btn');\n  btn.addEventListener('click', () => {\n    pass.type = pass.type === 'password' ? 'text' : 'password';\n  });\n</script>`,
    validationRules: [
      {
        id: 'toggle_works',
        description: 'Verify clicking #toggle-btn toggles #pass-field type between "password" and "text".',
        checkFn: `(() => { const pass = document.getElementById('pass-field'); const btn = document.getElementById('toggle-btn'); btn.click(); return pass.type === 'text'; })()`,
      },
    ],
    hints: ['Check `pass.type === "password"` and switch it.'],
    published: true,
  }));

  jsChallenges.push(await Challenge.create({
    moduleId: jsModule1._id,
    title: 'Double Click Element Highlight',
    description: `### Mouse Event Listeners\n\nListen for \`dblclick\` events to toggle CSS classes dynamically.\n\n### Objective\nOn double-clicking \`#card-box\`, add class \`highlighted\` to \`#card-box\`.`,
    language: 'javascript',
    difficulty: 'easy',
    xp: 20,
    starterCode: `<div id="card-box" style="padding:20px; border:1px solid #ccc;">Double Click Me</div>\n<script>\n  const box = document.getElementById('card-box');\n  // Add dblclick listener here\n</script>`,
    solution: `<div id="card-box" style="padding:20px; border:1px solid #ccc;">Double Click Me</div>\n<script>\n  const box = document.getElementById('card-box');\n  box.addEventListener('dblclick', () => {\n    box.classList.add('highlighted');\n  });\n</script>`,
    validationRules: [
      {
        id: 'dblclick_works',
        description: 'Verify double-clicking #card-box adds class "highlighted".',
        checkFn: `(() => { const box = document.getElementById('card-box'); box.dispatchEvent(new MouseEvent('dblclick')); return box.classList.contains('highlighted'); })()`,
      },
    ],
    hints: ['Use `box.addEventListener("dblclick", ...)`.'],
    published: true,
  }));

  jsChallenges.push(await Challenge.create({
    moduleId: jsModule2._id,
    title: 'Simple Tip Calculator',
    description: `### Form Calculation Logic\n\nCalculate tip totals based on input bill amount \`#bill-amount\` and selected tip percentage \`#tip-percent\`.\n\n### Objective\nWhen \`#calc-tip\` is clicked, compute \`(bill * tipPercent / 100)\` and display the tip amount inside \`#tip-total\`.`,
    language: 'javascript',
    difficulty: 'medium',
    xp: 35,
    starterCode: `<input id="bill-amount" type="number" placeholder="Bill Amount" />\n<select id="tip-percent">\n  <option value="15">15%</option>\n  <option value="20">20%</option>\n</select>\n<button id="calc-tip">Calculate Tip</button>\n<p id="tip-total">$0</p>\n<script>\n  const bill = document.getElementById('bill-amount');\n  const tip = document.getElementById('tip-percent');\n  const btn = document.getElementById('calc-tip');\n  const total = document.getElementById('tip-total');\n  // Add calculation logic here\n</script>`,
    solution: `<input id="bill-amount" type="number" placeholder="Bill Amount" />\n<select id="tip-percent">\n  <option value="15">15%</option>\n  <option value="20">20%</option>\n</select>\n<button id="calc-tip">Calculate Tip</button>\n<p id="tip-total">$0</p>\n<script>\n  const bill = document.getElementById('bill-amount');\n  const tip = document.getElementById('tip-percent');\n  const btn = document.getElementById('calc-tip');\n  const total = document.getElementById('tip-total');\n  btn.addEventListener('click', () => {\n    const amt = (parseFloat(bill.value) * parseFloat(tip.value)) / 100;\n    total.textContent = '$' + amt;\n  });\n</script>`,
    validationRules: [
      {
        id: 'tip_calc_works',
        description: 'Verify entering $100 bill with 15% tip updates #tip-total to contain "15".',
        checkFn: `(() => { document.getElementById('bill-amount').value = '100'; document.getElementById('tip-percent').value = '15'; document.getElementById('calc-tip').click(); return document.getElementById('tip-total').textContent.includes('15'); })()`,
      },
    ],
    hints: ['Parse input values as numbers using `parseFloat()`.'],
    published: true,
  }));

  jsChallenges.push(await Challenge.create({
    moduleId: jsModule2._id,
    title: 'Array Filter Search',
    description: `### Filtering DOM Lists\n\nFilter list items based on user search query.\n\n### Objective\nAttach an \`input\` listener to \`#search-query\` to filter list items \`.search-item\`. Set \`style.display = 'none'\` for items that do not include the typed query.`,
    language: 'javascript',
    difficulty: 'medium',
    xp: 35,
    starterCode: `<input id="search-query" placeholder="Search..." />\n<ul>\n  <li class="search-item">Apple</li>\n  <li class="search-item">Banana</li>\n  <li class="search-item">Cherry</li>\n</ul>\n<script>\n  const input = document.getElementById('search-query');\n  const items = document.querySelectorAll('.search-item');\n  // Add search filter listener here\n</script>`,
    solution: `<input id="search-query" placeholder="Search..." />\n<ul>\n  <li class="search-item">Apple</li>\n  <li class="search-item">Banana</li>\n  <li class="search-item">Cherry</li>\n</ul>\n<script>\n  const input = document.getElementById('search-query');\n  const items = document.querySelectorAll('.search-item');\n  input.addEventListener('input', () => {\n    const q = input.value.toLowerCase();\n    items.forEach(item => {\n      const text = item.textContent.toLowerCase();\n      item.style.display = text.includes(q) ? '' : 'none';\n    });\n  });\n</script>`,
    validationRules: [
      {
        id: 'filter_works',
        description: 'Verify typing "Apple" hides Banana and Cherry.',
        checkFn: `(() => { const input = document.getElementById('search-query'); const items = Array.from(document.querySelectorAll('.search-item')); input.value = 'Apple'; input.dispatchEvent(new Event('input')); return items[0].style.display !== 'none' && items[1].style.display === 'none'; })()`,
      },
    ],
    hints: ['Use `item.style.display = text.includes(q) ? "" : "none"`.'],
    published: true,
  }));

  jsChallenges.push(await Challenge.create({
    moduleId: jsModule2._id,
    title: 'Accordion Panel Toggle',
    description: `### Component UI State\n\nExpand and collapse accordion panels on header click.\n\n### Objective\nWhen clicking \`#accordion-head\`, toggle the class \`open\` on \`#accordion-body\`.`,
    language: 'javascript',
    difficulty: 'easy',
    xp: 25,
    starterCode: `<button id="accordion-head">Toggle Panel</button>\n<div id="accordion-body">Panel Details...</div>\n<script>\n  const head = document.getElementById('accordion-head');\n  const body = document.getElementById('accordion-body');\n  // Add click toggle logic here\n</script>`,
    solution: `<button id="accordion-head">Toggle Panel</button>\n<div id="accordion-body">Panel Details...</div>\n<script>\n  const head = document.getElementById('accordion-head');\n  const body = document.getElementById('accordion-body');\n  head.addEventListener('click', () => {\n    body.classList.toggle('open');\n  });\n</script>`,
    validationRules: [
      {
        id: 'accordion_toggle_works',
        description: 'Verify clicking #accordion-head toggles class "open" on #accordion-body.',
        checkFn: `(() => { const head = document.getElementById('accordion-head'); const body = document.getElementById('accordion-body'); head.click(); return body.classList.contains('open'); })()`,
      },
    ],
    hints: ['Use `body.classList.toggle("open")`.'],
    published: true,
  }));

  jsChallenges.push(await Challenge.create({
    moduleId: jsModule3._id,
    title: 'Debounced Input Logger',
    description: `### Debouncing Logic\n\nDelay execution until a specified time has elapsed since the last event.\n\n### Objective\nWhen typing in \`#search-input\`, delay updating \`#status-text\` text to \`'Searched: ' + value\` by 300ms using \`setTimeout\` and \`clearTimeout\`.`,
    language: 'javascript',
    difficulty: 'hard',
    xp: 40,
    starterCode: `<input id="search-input" placeholder="Type fast..." />\n<p id="status-text">Idle</p>\n<script>\n  const input = document.getElementById('search-input');\n  const status = document.getElementById('status-text');\n  let timer;\n  // Add debounced input listener here\n</script>`,
    solution: `<input id="search-input" placeholder="Type fast..." />\n<p id="status-text">Idle</p>\n<script>\n  const input = document.getElementById('search-input');\n  const status = document.getElementById('status-text');\n  let timer;\n  input.addEventListener('input', () => {\n    clearTimeout(timer);\n    timer = setTimeout(() => {\n      status.textContent = 'Searched: ' + input.value;\n    }, 300);\n  });\n</script>`,
    validationRules: [
      {
        id: 'debounced_works',
        description: 'Verify typing updates #status-text after delay.',
        checkFn: `(() => { const input = document.getElementById('search-input'); const status = document.getElementById('status-text'); input.value = 'Code'; input.dispatchEvent(new Event('input')); return status !== null; })()`,
      },
    ],
    hints: ['Clear the previous `timer` before setting a new `setTimeout`.'],
    published: true,
  }));

  jsChallenges.push(await Challenge.create({
    moduleId: jsModule3._id,
    title: 'Session Storage Draft Keeper',
    description: `### SessionStorage API\n\nPersist temporary user state during a browser session using \`sessionStorage\`.\n\n### Objective\nOn \`input\` event of \`#draft-area\`, save its current value to \`sessionStorage\` with key \`'draft_note'\`.`,
    language: 'javascript',
    difficulty: 'medium',
    xp: 30,
    starterCode: `<textarea id="draft-area" placeholder="Write draft..."></textarea>\n<script>\n  const area = document.getElementById('draft-area');\n  // Add input listener to save to sessionStorage\n</script>`,
    solution: `<textarea id="draft-area" placeholder="Write draft..."></textarea>\n<script>\n  const area = document.getElementById('draft-area');\n  area.addEventListener('input', () => {\n    sessionStorage.setItem('draft_note', area.value);\n  });\n</script>`,
    validationRules: [
      {
        id: 'session_storage_saved',
        description: 'Verify typing in #draft-area saves value to sessionStorage under key "draft_note".',
        checkFn: `(() => { const area = document.getElementById('draft-area'); area.value = 'My Note'; area.dispatchEvent(new Event('input')); return sessionStorage.getItem('draft_note') === 'My Note'; })()`,
      },
    ],
    hints: ['Use `sessionStorage.setItem("draft_note", area.value)`.'],
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
    moduleId: pyBasicsModule2._id,
    title: 'Calculator',
    description: `### Final Project: Calculator\n\nCreate a Python function that performs basic mathematical operations based on user input flags.\n\n### Objective\nDefine function \`calculate(a, b, op)\` returning the calculated result of the operator specified. Supported operations:\n* \`"add"\` -> returns \`a + b\`\n* \`"sub"\` -> returns \`a - b\`\n* \`"mul"\` -> returns \`a * b\`\n* \`"div"\` -> returns \`a / b\` (or returns \`"Error: Division by zero"\` if \`b == 0\`).`,
    language: 'python',
    difficulty: 'hard',
    xp: 120,
    starterCode: `def calculate(a, b, op):\n    # Perform calculator operations\n    pass\n\n# Test your function:\nprint("calculate(10, 5, 'add') =", calculate(10, 5, 'add'))\nprint("calculate(10, 0, 'div') =", calculate(10, 0, 'div'))`,
    solution: `def calculate(a, b, op):\n    if op == 'add':\n        return a + b\n    elif op == 'sub':\n        return a - b\n    elif op == 'mul':\n        return a * b\n    elif op == 'div':\n        if b == 0:\n            return "Error: Division by zero"\n        return a / b\n    return None`,
    validationRules: [
      {
        id: 'calculate_exists',
        description: 'Verify function calculate must be defined.',
        checkFn: `assert 'calculate' in globals() and callable(calculate), "Function calculate must be defined"`,
      },
      {
        id: 'calculate_cases',
        description: 'Verify calculator math results and division by zero exceptions.',
        checkFn: `assert calculate(6, 3, 'add') == 9 and calculate(6, 3, 'sub') == 3 and calculate(6, 3, 'mul') == 18 and calculate(6, 3, 'div') == 2.0 and calculate(6, 0, 'div') == "Error: Division by zero", "Calculator operations are incorrect"`,
      },
    ],
    hints: ['Check the value of string parameter \`op\` using \`if-elif-else\` blocks.', 'Before dividing \`a / b\`, check if \`b == 0\` and return the correct error string.'],
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

  pyBasicsChallenges.push(await Challenge.create({
    moduleId: pyBasicsModule3._id,
    title: 'Quiz Game',
    description: `### Final Project: Quiz Game\n\nImplement a trivia quiz function that evaluates answers.\n\n### Objective\nCreate a function \`run_quiz(answers)\` that accepts a dictionary of questions and answers. The keys are the questions, and the values are user answers. If the answers match the official solutions below, count them as correct.\n\nQuestions & Solutions:\n1. \`"What is 5 + 7?"\` -> \`"12"\`\n2. \`"What is the capital of Japan?"\` -> \`"Tokyo"\`\n\nReturn the final score (number of correct answers).`,
    language: 'python',
    difficulty: 'hard',
    xp: 120,
    starterCode: `def run_quiz(answers):\n    # Calculate score based on answers dictionary\n    pass\n\n# Test your function:\ntest_answers = {\n    "What is 5 + 7?": "12",\n    "What is the capital of Japan?": "Tokyo"\n}\nprint("Score:", run_quiz(test_answers))`,
    solution: `def run_quiz(answers):\n    solutions = {\n        "What is 5 + 7?": "12",\n        "What is the capital of Japan?": "Tokyo"\n    }\n    score = 0\n    for q, a in answers.items():\n        if q in solutions and solutions[q].strip().lower() == str(a).strip().lower():\n            score += 1\n    return score`,
    validationRules: [
      {
        id: 'run_quiz_exists',
        description: 'Verify run_quiz is defined.',
        checkFn: `assert 'run_quiz' in globals() and callable(run_quiz), "Function run_quiz must be defined"`,
      },
      {
        id: 'quiz_evaluation',
        description: 'Verify score calculation behaves correctly on mixed capitalization and incorrect answers.',
        checkFn: `assert run_quiz({"What is 5 + 7?": "12", "What is the capital of Japan?": "Tokyo"}) == 2 and run_quiz({"What is 5 + 7?": "10", "What is the capital of Japan?": "Kyoto"}) == 0 and run_quiz({"What is 5 + 7?": "12", "What is the capital of Japan?": "tokyo"}) == 2, "Quiz scoring logic incorrect"`,
      },
    ],
    hints: ['Define a dictionary mapping question strings to their exact answers.', 'Iterate through \`answers.items()\` and strip/lowercase values to match case-insensitively.'],
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
    moduleId: pyOopModule1._id,
    title: 'Password Generator',
    description: `### Final Project: Password Generator\n\nBuild a simple password generator function that generates passwords of custom length from a seed character set.\n\n### Objective\nDefine function \`generate_password(length, chars)\` that returns a random string of length \`length\` using only characters from \`chars\`. Ensure you import \`random\` or use modular indexing to pick characters.`,
    language: 'python',
    difficulty: 'hard',
    xp: 120,
    starterCode: `import random\n\ndef generate_password(length, chars):\n    # Return a random password\n    pass\n\n# Test your function:\nprint("Password:", generate_password(8, "abcdefg12345"))`,
    solution: `import random\n\ndef generate_password(length, chars):\n    return "".join(random.choice(chars) for _ in range(length))`,
    validationRules: [
      {
        id: 'gen_pass_exists',
        description: 'Verify generate_password is defined.',
        checkFn: `assert 'generate_password' in globals() and callable(generate_password), "Function generate_password must be defined"`,
      },
      {
        id: 'gen_pass_checks',
        description: 'Verify password length and characters match constraints.',
        checkFn: `p1 = generate_password(10, "XYZ"); assert len(p1) == 10 and all(c in "XYZ" for c in p1), "Password generation logic incorrect"`,
      },
    ],
    hints: ['Use \`random.choice(chars)\` to pick characters.', 'Iterate or use a generator expression inside \`"".join()\` to build the password string.'],
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

  pyOopChallenges.push(await Challenge.create({
    moduleId: pyOopModule3._id,
    title: 'Student Manager',
    description: `### Final Project: Student Manager\n\nCreate a class-based Student Manager tracking name, grades, and average scores.\n\n### Objective\nImplement two classes, \`Student\` and \`StudentManager\`:\n1. Class \`Student\` initialized with \`name\` (str) and a list of grades \`grades\` (list of integers).\n2. Instance method \`get_average()\` that returns the average of student grades (float). If grades are empty, return \`0.0\`.\n3. Class \`StudentManager\` tracking a list of student objects in \`self.students\`. Add methods \`add_student(student)\` to append a student, and \`get_class_average()\` to return the combined average score of all registered students.`,
    language: 'python',
    difficulty: 'hard',
    xp: 120,
    starterCode: `class Student:\n    # Initialize name and grades list\n    pass\n\nclass StudentManager:\n    # Manage registered student instances\n    pass`,
    solution: `class Student:\n    def __init__(self, name, grades=None):\n        self.name = name\n        self.grades = grades if grades is not None else []\n    def get_average(self):\n        if not self.grades:\n            return 0.0\n        return sum(self.grades) / len(self.grades)\n\nclass StudentManager:\n    def __init__(self):\n        self.students = []\n    def add_student(self, student):\n        self.students.append(student)\n    def get_class_average(self):\n        if not self.students:\n            return 0.0\n        return sum(s.get_average() for s in self.students) / len(self.students)`,
    validationRules: [
      {
        id: 'oop_classes_exist',
        description: 'Verify Student and StudentManager classes are defined.',
        checkFn: `assert 'Student' in globals() and 'StudentManager' in globals(), "Define Student and StudentManager classes"`,
      },
      {
        id: 'student_manager_logic',
        description: 'Verify Student averages and StudentManager class averages match constraints.',
        checkFn: `s1 = Student("Alice", [80, 90]); s2 = Student("Bob", [70, 75]); mgr = StudentManager(); mgr.add_student(s1); mgr.add_student(s2); assert s1.get_average() == 85.0 and mgr.get_class_average() == 78.75, "StudentManager class average calculation incorrect"`,
      },
    ],
    hints: ['Inside \`Student.get_average()\`, handle empty lists gracefully by returning \`0.0\` to avoid division-by-zero errors.', 'Iterate through all student items in \`self.students\` to compute the class average.'],
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

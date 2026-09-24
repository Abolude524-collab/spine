export interface VerificationStep {
  id: number;
  text: string;
  completed?: boolean;
}

export interface ParsonsBlock {
  id: string;
  text: string;
  indent: number;
}

export interface Lesson {
  id: string;
  title: string;
  readTime: string;
  type: "faded_example" | "parsons" | "blank_canvas";
  language: "python" | "html" | "css" | "javascript";
  instructionalText: string;
  mentalModelTitle: string;
  mentalModelDescription: string;
  mentalModelItems: string[];
  verificationSteps: VerificationStep[];
  initialCode: string;
  lockedLines: number[];
  parsonsBlocks: ParsonsBlock[];
  expectedParsons: { id: string; indent: number }[];
}

export interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

export interface Track {
  id: "python" | "html" | "css" | "javascript";
  title: string;
  badge: string;
  description: string;
  modules: Module[];
}

export const TRACKS: Record<string, Track> = {
  // =========================================================================
  // 1. PYTHON TRACK (Comprehensive Novice-to-Extraordinary Curriculum)
  // =========================================================================
  python: {
    id: "python",
    title: "Python",
    badge: "🐍 Python",
    description: "Master Python syntax, data structures, control flow, functions, and WASM execution.",
    modules: [
      {
        id: "py-01",
        title: "Module 01 • Variables, Expressions & Memory",
        description: "Understand variables as named memory boxes, string formatting, and numeric calculations.",
        lessons: [
          {
            id: "py-01-01",
            title: "Lesson 1: Named Memory Boxes & Formatting",
            readTime: "2 mins read",
            type: "faded_example",
            language: "python",
            instructionalText:
              "In Python, variables are labeled memory slots. You store data on the right side of the equals sign (=) and retrieve it by name anytime.",
            mentalModelTitle: "MENTAL MODEL: LABELED COAT CHECK BOX",
            mentalModelDescription:
              "The variable name 'username' holds the string value, which gets injected into formatted strings via f-strings.",
            mentalModelItems: ["username = 'Enoch'", "base_xp = 350", "f'XP: {total_xp}'"],
            verificationSteps: [
              { id: 1, text: "Declare user profile variables username and role" },
              { id: 2, text: "Calculate total_xp by adding 100 bonus points to base_xp" },
              { id: 3, text: "Print formatted profile string with f-string" },
            ],
            initialCode: `# FADED EXAMPLE: Calculate bonus XP
username = "Enoch"
role = "Software Engineer"
base_xp = 350

# EDITABLE SLOT: Add 100 bonus points to base_xp
total_xp = base_xp + 100

print(f"User {username} ({role}) reached {total_xp} XP!")`,
            lockedLines: [1, 2, 3, 4, 9],
            parsonsBlocks: [
              { id: "py1-1", text: 'username = "Enoch"', indent: 0 },
              { id: "py1-2", text: "base_xp = 350", indent: 0 },
              { id: "py1-3", text: "total_xp = base_xp + 100", indent: 0 },
              { id: "py1-4", text: 'print(f"{username}: {total_xp}")', indent: 0 },
            ],
            expectedParsons: [
              { id: "py1-1", indent: 0 },
              { id: "py1-2", indent: 0 },
              { id: "py1-3", indent: 0 },
              { id: "py1-4", indent: 0 },
            ],
          },
          {
            id: "py-01-02",
            title: "Lesson 2: Conditional Decision Checkpoints",
            readTime: "3 mins read",
            type: "faded_example",
            language: "python",
            instructionalText:
              "An if/else statement is like a security guard. If a condition evaluates to True, Python executes the indented block; otherwise, it jumps to the else branch.",
            mentalModelTitle: "MENTAL MODEL: TOLL BOOTH GATE",
            mentalModelDescription:
              "The credit score is checked against the threshold (700+). If true, approval status is set to 'APPROVED'.",
            mentalModelItems: ["Credit: 750", "Check >= 700", "Branch: APPROVED"],
            verificationSteps: [
              { id: 1, text: "Define applicant score variable" },
              { id: 2, text: "Check condition if credit_score >= 700" },
              { id: 3, text: "Set status to 'APPROVED' in the if branch" },
            ],
            initialCode: `# FADED EXAMPLE: Complete loan approval logic
credit_score = 740

if credit_score >= 700:
    # EDITABLE SLOT: Assign status APPROVED
    status = "APPROVED"
else:
    status = "REJECTED"

print(f"Application Status: {status}")`,
            lockedLines: [1, 2, 4, 7, 9],
            parsonsBlocks: [
              { id: "py2-1", text: "credit_score = 740", indent: 0 },
              { id: "py2-2", text: "if credit_score >= 700:", indent: 0 },
              { id: "py2-3", text: 'status = "APPROVED"', indent: 0 },
              { id: "py2-4", text: "else:", indent: 0 },
              { id: "py2-5", text: 'status = "REJECTED"', indent: 0 },
            ],
            expectedParsons: [
              { id: "py2-1", indent: 0 },
              { id: "py2-2", indent: 0 },
              { id: "py2-3", indent: 1 },
              { id: "py2-4", indent: 0 },
              { id: "py2-5", indent: 1 },
            ],
          },
          {
            id: "py-01-03",
            title: "Lesson 3: The Assembly Line Loop (For-Loops)",
            readTime: "3 mins read",
            type: "faded_example",
            language: "python",
            instructionalText:
              "Think of a for-loop like a robotic conveyor arm. For every item in a list, it grabs the item and executes your indented block once.",
            mentalModelTitle: "MENTAL MODEL: CONVEYOR ARM",
            mentalModelDescription:
              "Each server name in the cluster list is inspected and illuminated sequentially.",
            mentalModelItems: ["server_1: US-East", "server_2: EU-West", "server_3: AP-South"],
            verificationSteps: [
              { id: 1, text: "Define list servers with 3 node strings" },
              { id: 2, text: "Iterate using for node in servers" },
              { id: 3, text: "Call inspect_node(node) inside body" },
            ],
            initialCode: `# FADED EXAMPLE: Iterate server nodes
servers = ["US-East", "EU-West", "AP-South"]

for node in servers:
    # EDITABLE SLOT: Process node string
    print(f"Health check passed for: {node}")`,
            lockedLines: [1, 2, 4],
            parsonsBlocks: [
              { id: "py3-1", text: 'servers = ["US-East", "EU-West", "AP-South"]', indent: 0 },
              { id: "py3-2", text: "for node in servers:", indent: 0 },
              { id: "py3-3", text: 'print(f"Health check: {node}")', indent: 0 },
            ],
            expectedParsons: [
              { id: "py3-1", indent: 0 },
              { id: "py3-2", indent: 0 },
              { id: "py3-3", indent: 1 },
            ],
          },
        ],
      },
      {
        id: "py-02",
        title: "Module 02 • Data Structures & Dictionaries",
        description: "Lists, Dictionaries (Key-Value Vaults), and List Comprehensions.",
        lessons: [
          {
            id: "py-02-01",
            title: "Lesson 1: Key-Value Vaults (Dictionaries)",
            readTime: "3 mins read",
            type: "faded_example",
            language: "python",
            instructionalText:
              "Dictionaries store records as key-value pairs (like 'email': 'enoch@spine.dev'). Looking up values by key is instant (O(1) time complexity).",
            mentalModelTitle: "MENTAL MODEL: COAT CHECK TICKETS",
            mentalModelDescription:
              "Handing over the ticket key 'email' instantly retrieves the associated user email string.",
            mentalModelItems: ["'name': 'Alex'", "'role': 'Lead Dev'", "'xp': 450"],
            verificationSteps: [
              { id: 1, text: "Initialize dictionary developer with user fields" },
              { id: 2, text: "Update developer['xp'] by adding 50 points" },
              { id: 3, text: "Print updated user dictionary" },
            ],
            initialCode: `# FADED EXAMPLE: Mutate dictionary values
developer = {
    "name": "Alex Vance",
    "role": "Lead Dev",
    "xp": 450
}

# EDITABLE SLOT: Increase developer xp by 50
developer["xp"] = developer["xp"] + 50

print(f"Updated developer profile: {developer}")`,
            lockedLines: [1, 2, 3, 4, 5, 6, 11],
            parsonsBlocks: [
              { id: "pyd1", text: 'developer = {"name": "Alex", "xp": 450}', indent: 0 },
              { id: "pyd2", text: 'developer["xp"] += 50', indent: 0 },
              { id: "pyd3", text: "print(developer)", indent: 0 },
            ],
            expectedParsons: [
              { id: "pyd1", indent: 0 },
              { id: "pyd2", indent: 0 },
              { id: "pyd3", indent: 0 },
            ],
          },
          {
            id: "py-02-02",
            title: "Lesson 2: List Filtering with Comprehensions",
            readTime: "3 mins read",
            type: "faded_example",
            language: "python",
            instructionalText:
              "List comprehensions let you filter and transform lists in a single, clean line of Python code: [x for x in items if condition].",
            mentalModelTitle: "MENTAL MODEL: OPTICAL SORTING SIEVE",
            mentalModelDescription:
              "Only numbers greater than 50 pass through the sieve into the high_scores output list.",
            mentalModelItems: ["[25, 80, 45, 90]", "Filter > 50", "[80, 90]"],
            verificationSteps: [
              { id: 1, text: "Define original scores list [25, 80, 45, 95]" },
              { id: 2, text: "Use list comprehension [s for s in scores if s >= 50]" },
              { id: 3, text: "Print filtered high scores" },
            ],
            initialCode: `# FADED EXAMPLE: Filter list with comprehension
scores = [25, 80, 45, 95]

# EDITABLE SLOT: Filter scores >= 50
high_scores = [s for s in scores if s >= 50]

print(f"High scores list: {high_scores}")`,
            lockedLines: [1, 2, 4, 7],
            parsonsBlocks: [
              { id: "pyl1", text: "scores = [25, 80, 45, 95]", indent: 0 },
              { id: "pyl2", text: "high_scores = [s for s in scores if s >= 50]", indent: 0 },
              { id: "pyl3", text: "print(high_scores)", indent: 0 },
            ],
            expectedParsons: [
              { id: "pyl1", indent: 0 },
              { id: "pyl2", indent: 0 },
              { id: "pyl3", indent: 0 },
            ],
          },
        ],
      },
      {
        id: "py-03",
        title: "Module 03 • Functions & Modular Engineering",
        description: "Def functions, parameters, return values, and real-world CLI mini-projects.",
        lessons: [
          {
            id: "py-03-01",
            title: "Lesson 1: Reusable Code Machines (def)",
            readTime: "4 mins read",
            type: "faded_example",
            language: "python",
            instructionalText:
              "A function is a reusable machine. You define inputs (parameters), run logic inside, and return a result back to the caller.",
            mentalModelTitle: "MENTAL MODEL: BLACK BOX FUNCTION MACHINE",
            mentalModelDescription:
              "Inputs (price, tax_rate) go in -> Function computes -> Final total comes out.",
            mentalModelItems: ["Input: 100, 0.08", "Calculate Tax", "Return: 108.0"],
            verificationSteps: [
              { id: 1, text: "Define calculate_total(price, tax_rate) function" },
              { id: 2, text: "Compute price + (price * tax_rate)" },
              { id: 3, text: "Return total amount from function" },
            ],
            initialCode: `# FADED EXAMPLE: Write total price calculator function
def calculate_total(price, tax_rate):
    # EDITABLE SLOT: Calculate total with tax
    total = price + (price * tax_rate)
    return total

order_price = calculate_total(100, 0.08)
print(f"Final order price: {order_price}")`,
            lockedLines: [1, 2, 5, 7, 8],
            parsonsBlocks: [
              { id: "pyf1", text: "def calculate_total(price, tax_rate):", indent: 0 },
              { id: "pyf2", text: "total = price + (price * tax_rate)", indent: 0 },
              { id: "pyf3", text: "return total", indent: 0 },
              { id: "pyf4", text: "print(calculate_total(100, 0.08))", indent: 0 },
            ],
            expectedParsons: [
              { id: "pyf1", indent: 0 },
              { id: "pyf2", indent: 1 },
              { id: "pyf3", indent: 1 },
              { id: "pyf4", indent: 0 },
            ],
          },
        ],
      },
    ],
  },

  // =========================================================================
  // 2. HTML TRACK (Semantic Document Architecture)
  // =========================================================================
  html: {
    id: "html",
    title: "HTML",
    badge: "🌐 HTML",
    description: "Understand markup tags, containers, forms, inputs, and semantic document flow.",
    modules: [
      {
        id: "html-01",
        title: "Module 01 • Semantic Document Containers",
        description: "Building accessible DOM trees with semantic tags (<main>, <article>, <header>).",
        lessons: [
          {
            id: "html-01-01",
            title: "Lesson 1: Structuring a Hero Card",
            readTime: "3 mins read",
            type: "faded_example",
            language: "html",
            instructionalText:
              "HTML elements act like Russian nesting dolls. Container tags like <main> or <article> hold headings, paragraphs, and interactive buttons.",
            mentalModelTitle: "MENTAL MODEL: CONTAINER DOLLS",
            mentalModelDescription:
              "Every tag opens and closes cleanly, building a tree node inside the browser DOM.",
            mentalModelItems: ["<main>", "<article>", "<h1>", "<button>"],
            verificationSteps: [
              { id: 1, text: "Wrap hero elements in a <main> container" },
              { id: 2, text: "Create an <h1> main title tag" },
              { id: 3, text: "Add a primary call-to-action <button>" },
            ],
            initialCode: `<!-- FADED EXAMPLE: Complete the hero action button -->
<main class="hero-container">
  <h1>Code Without Intimidation</h1>
  <p>Build confidence from novice to extraordinary.</p>
  <!-- EDITABLE SLOT: Complete the CTA button tag -->
  <button id="cta-btn">Start Learning Free</button>
</main>`,
            lockedLines: [1, 2, 3, 4, 7],
            parsonsBlocks: [
              { id: "html1-1", text: '<main class="hero">', indent: 0 },
              { id: "html1-2", text: "  <h1>Welcome to Spine</h1>", indent: 0 },
              { id: "html1-3", text: '  <button id="btn">Start</button>', indent: 0 },
              { id: "html1-4", text: "</main>", indent: 0 },
            ],
            expectedParsons: [
              { id: "html1-1", indent: 0 },
              { id: "html1-2", indent: 1 },
              { id: "html1-3", indent: 1 },
              { id: "html1-4", indent: 0 },
            ],
          },
          {
            id: "html-01-02",
            title: "Lesson 2: Interactive Forms & Email Inputs",
            readTime: "3 mins read",
            type: "faded_example",
            language: "html",
            instructionalText:
              "Forms collect input from users. The <label> tag pairs with the <input> element so screen readers and users know exactly what data to enter.",
            mentalModelTitle: "MENTAL MODEL: PHYSICAL QUESTIONNAIRE",
            mentalModelDescription:
              "Form labels indicate fields, while inputs specify data types like email or password.",
            mentalModelItems: ["<form>", "<label>", "<input type='email'>", "<button>"],
            verificationSteps: [
              { id: 1, text: "Create form element container" },
              { id: 2, text: "Add email label and matching input field" },
              { id: 3, text: "Add form submit button" },
            ],
            initialCode: `<!-- FADED EXAMPLE: Add email input control -->
<form class="login-form">
  <label for="user-email">Email Address:</label>
  <!-- EDITABLE SLOT: Add input element -->
  <input type="email" id="user-email" placeholder="you@spine.dev" required />
  <button type="submit">Sign In</button>
</form>`,
            lockedLines: [1, 2, 3, 6, 7],
            parsonsBlocks: [
              { id: "html2-1", text: '<form class="login">', indent: 0 },
              { id: "html2-2", text: '  <label for="email">Email</label>', indent: 0 },
              { id: "html2-3", text: '  <input type="email" id="email" />', indent: 0 },
              { id: "html2-4", text: '  <button type="submit">Submit</button>', indent: 0 },
              { id: "html2-5", text: "</form>", indent: 0 },
            ],
            expectedParsons: [
              { id: "html2-1", indent: 0 },
              { id: "html2-2", indent: 1 },
              { id: "html2-3", indent: 1 },
              { id: "html2-4", indent: 1 },
              { id: "html2-5", indent: 0 },
            ],
          },
        ],
      },
    ],
  },

  // =========================================================================
  // 3. CSS TRACK (Layouts & Dark Mode Aesthetics)
  // =========================================================================
  css: {
    id: "css",
    title: "CSS",
    badge: "🎨 CSS",
    description: "Master box model, Flexbox alignment, CSS Grid, and dark mode design systems.",
    modules: [
      {
        id: "css-01",
        title: "Module 01 • Flexbox & Layout Systems",
        description: "Align items seamlessly with flex-direction, justify-content, and gap.",
        lessons: [
          {
            id: "css-01-01",
            title: "Lesson 1: The Flexbox Assembly Line",
            readTime: "2 mins read",
            type: "faded_example",
            language: "css",
            instructionalText:
              "Think of display: flex like a conveyor belt. Setting justify-content: space-between pushes items to opposite edges automatically.",
            mentalModelTitle: "MENTAL MODEL: CONVEYOR BELT ALIGNMENT",
            mentalModelDescription:
              "Flex containers manage alignment along main and cross axes without manual pixel calculations.",
            mentalModelItems: ["display: flex", "justify-content: space-between", "align-items: center"],
            verificationSteps: [
              { id: 1, text: "Enable display: flex on container" },
              { id: 2, text: "Set justify-content: space-between property" },
              { id: 3, text: "Add 1px dark border #222226" },
            ],
            initialCode: `/* FADED EXAMPLE: Complete flex navbar */
.navbar {
  display: flex;
  /* EDITABLE SLOT: Space elements to edges */
  justify-content: space-between;
  align-items: center;
  background-color: #0A0A0C;
  border-bottom: 1px solid #222226;
  padding: 16px;
}`,
            lockedLines: [1, 2, 3, 5, 6, 7, 8, 9],
            parsonsBlocks: [
              { id: "css1-1", text: ".navbar {", indent: 0 },
              { id: "css1-2", text: "display: flex;", indent: 0 },
              { id: "css1-3", text: "justify-content: space-between;", indent: 0 },
              { id: "css1-4", text: "}", indent: 0 },
            ],
            expectedParsons: [
              { id: "css1-1", indent: 0 },
              { id: "css1-2", indent: 1 },
              { id: "css1-3", indent: 1 },
              { id: "css1-4", indent: 0 },
            ],
          },
        ],
      },
    ],
  },

  // =========================================================================
  // 4. JAVASCRIPT TRACK (Interactive DOM & ES6 Logic)
  // =========================================================================
  javascript: {
    id: "javascript",
    title: "JavaScript",
    badge: "⚡ JavaScript",
    description: "Build interactive web applications with ES6, DOM handlers, array methods, and async logic.",
    modules: [
      {
        id: "js-01",
        title: "Module 01 • DOM Manipulation & Event Handlers",
        description: "Listening to user clicks, mutating state, and rendering dynamic UI.",
        lessons: [
          {
            id: "js-01-01",
            title: "Lesson 1: Wiring Click Event Listeners",
            readTime: "3 mins read",
            type: "faded_example",
            language: "javascript",
            instructionalText:
              "An event listener acts like a tripwire. When a user clicks a button, the browser immediately triggers your arrow function callback.",
            mentalModelTitle: "MENTAL MODEL: TRIPWIRE LISTENER",
            mentalModelDescription:
              "addEventListener('click', callback) waits quietly until triggered by user interaction.",
            mentalModelItems: ["buttonNode", ".addEventListener", "'click'", "callback()"],
            verificationSteps: [
              { id: 1, text: "Target DOM element using document.getElementById" },
              { id: 2, text: "Attach addEventListener for 'click'" },
              { id: 3, text: "Log success message to console" },
            ],
            initialCode: `// FADED EXAMPLE: Complete click listener
const button = document.getElementById('submit-btn');

// EDITABLE SLOT: Attach click listener
button.addEventListener('click', () => {
  console.log('Active recall challenge passed!');
});`,
            lockedLines: [1, 2, 3, 6, 7],
            parsonsBlocks: [
              { id: "js1-1", text: "const btn = document.getElementById('btn');", indent: 0 },
              { id: "js1-2", text: "btn.addEventListener('click', () => {", indent: 0 },
              { id: "js1-3", text: "  console.log('Clicked!');", indent: 0 },
              { id: "js1-4", text: "});", indent: 0 },
            ],
            expectedParsons: [
              { id: "js1-1", indent: 0 },
              { id: "js1-2", indent: 0 },
              { id: "js1-3", indent: 1 },
              { id: "js1-4", indent: 0 },
            ],
          },
          {
            id: "js-01-02",
            title: "Lesson 2: Data Transformation with Array .map()",
            readTime: "3 mins read",
            type: "faded_example",
            language: "javascript",
            instructionalText:
              "Array .map() works like a factory conveyor belt. It transforms every item in an input array into a new output array without mutating original data.",
            mentalModelTitle: "MENTAL MODEL: FACTORY TRANSFORMER",
            mentalModelDescription:
              "Each price element passes through the transformer function to return the doubled price array.",
            mentalModelItems: ["[10, 20, 30]", ".map(x => x * 2)", "[20, 40, 60]"],
            verificationSteps: [
              { id: 1, text: "Define original prices array [10, 20, 30]" },
              { id: 2, text: "Call prices.map((price) => price * 2)" },
              { id: 3, text: "Print doubled array result" },
            ],
            initialCode: `// FADED EXAMPLE: Map array elements
const prices = [10, 20, 30];

// EDITABLE SLOT: Double each price using map
const doubled = prices.map((price) => price * 2);

console.log('Doubled Prices:', doubled);`,
            lockedLines: [1, 2, 4, 7],
            parsonsBlocks: [
              { id: "js2-1", text: "const prices = [10, 20, 30];", indent: 0 },
              { id: "js2-2", text: "const doubled = prices.map(p => p * 2);", indent: 0 },
              { id: "js2-3", text: "console.log(doubled);", indent: 0 },
            ],
            expectedParsons: [
              { id: "js2-1", indent: 0 },
              { id: "js2-2", indent: 0 },
              { id: "js2-3", indent: 0 },
            ],
          },
        ],
      },
    ],
  },
};

# Product Requirements Document: Spine

## 1. Product Vision & Objective
**Spine** is an interactive programming learning platform designed to take absolute beginners from passive tutorial consumption to active, independent project building. By employing evidence-based pedagogical frameworks—such as Faded Worked Examples, Parsons Problems, and micro-interactions—Spine prevents "tutorial hell" and equips learners with the confidence and fundamental skills (the "spine") to tackle real-world software engineering challenges.

**Target Languages & Technologies/courses:** HTML, CSS, JavaScript/TypeScript, and Python.

## 2. Design & UX Guidelines
The user interface must minimize cognitive overload, focusing entirely on the learning experience without distracting UI clutter.
*   **Aesthetic Theme:** A modern, dark-themed aesthetic with high-contrast syntax highlighting to reduce eye strain during long coding sessions.
*   **Typography:** Utilize **Montserrat** for all headings and primary UI elements to maintain a clean, highly legible, and professional appearance. Monospace fonts (e.g., Fira Code or JetBrains Mono) will be strictly reserved for the code editor components.
*   **Layout:** Minimalist, component-driven layouts. The primary learning interface will utilize a synchronized split-screen: instructional content on the left, and the active interactive challenge on the right.

## 3. Core Learning Mechanics (The Pedagogical Engine)
These features define the user-facing interactions that force active recall and problem-solving.

### 3.1 Parsons Problem Engine
*   **Description:** Drag-and-drop interfaces where learners sequence pre-written lines of code to solve a logic problem without typing syntax.
*   **Technical Implementation:** Requires a robust drag-and-drop library (e.g., `@hello-pangea/dnd`) integrated with global state management to track block order and validate against an expected array of block IDs.

### 3.2 Faded Examples IDE
*   **Description:** A code editor where 80-90% of the solution is provided and locked. The user can only edit specific "faded" lines to complete the logic.
*   **Technical Implementation:** A web-based code editor utilizing line-level read-only configurations, preventing users from altering the core structure of the problem.

### 3.3 Real-Time Visual Sandbox
*   **Description:** A live preview window for the HTML/CSS/JavaScript modules that updates instantly as the user types, providing immediate visual feedback.
*   **Technical Implementation:** An isolated `<iframe>` rendering environment that securely injects the user's raw HTML/CSS/JS strings into the DOM.

### 3.4 Micro-Interaction Player
*   **Description:** A unified UI layout splitting the screen into a brief (2-minute read) instructional concept and an immediate interactive challenge.
*   **Technical Implementation:** Synchronized state between the learning material (rendered via an MDX parser) and the active challenge component.

### 3.5 "Spine" Project Specs
*   **Description:** The final challenge of a module. The platform provides requirements, API endpoints, and a testing suite on a completely blank canvas.
*   **Technical Implementation:** Integration with a client-side testing framework running against the user's submitted code to pass/fail specific user stories.

## 4. Admin Panel Architecture
The admin panel is the control center for the curriculum. It will use the exact same dark aesthetic but optimize for data density.

### 4.1 Curriculum Manager (The CMS)
* **Module & Lesson Builder:** A graphical interface to structure the flow of the curriculum.
* **MDX Editor:** A real-time markdown editor to write the instructional content for the left pane of the micro-interaction player.
* **Challenge Configurator:** Input fields to set the `initialCodeState` and the `validationLogic` (the test cases the user's code must pass).
* **Type Toggle:** A simple selector to define if a lesson is a Parsons Problem, Faded Example, or Blank Canvas.

### 4.2 Telemetry & Analytics Dashboard
* **Friction Tracking:** Data tables showing which specific lessons have the highest failure rates or time-to-completion, signaling where the curriculum needs adjustment.
* **User Progress Matrix:** A high-level view of where active cohorts are currently situated in the syllabus.

### 4.3 User & Access Management
* **Beta Access:** Tools to manually approve, suspend, or manage user accounts and view individual progress logs.
"""

## 4. Technical Architecture & Stack

### 4.1 Frontend Architecture
*   **Framework:** **Next.js** for handling routing between curriculum modules and providing fast, optimized delivery of the application shell.
*   **Language:** **TypeScript** across the entire stack for end-to-end type safety.
*   **Styling:** **Tailwind CSS** to execute the minimalist, dark-themed design language efficiently.
*   **State Management:** **Zustand** to handle complex client-side states, specifically tracking user progress, handling drag-and-drop coordinates for Parsons Problems, and caching active code strings.
*   **Code Editor:** **Monaco Editor** to provide syntax highlighting, autocomplete, and TypeScript guardrails directly in the browser.

### 4.2 Code Execution Environment
Execution will be handled client-side to ensure scalability, security, and lower server overhead.
*   **HTML/CSS/JS:** Evaluated directly in isolated `<iframe>` elements or via WebContainers.
*   **Python:** Pyodide (Python compiled to WebAssembly) will execute Python logic directly in the browser, eliminating the need for a dedicated backend execution cluster.

### 4.3 Backend & Data Layer
*   **API Framework:** An **Express.js** server running on Node.js to handle user authentication, progress synchronization, and module delivery.
*   **Database:** **MongoDB** to store the nested, document-based data structures inherent to a complex curriculum.

## 5. Core Data Models (High-Level)

### 5.1 User Profile
Tracks authentication, global progress, and learning telemetry.
*   `userId` (UUID)
*   `completedModules` (Array of Module IDs)
*   `telemetry`: Error rates, time spent on specific challenge types (used to refine curriculum).

### 5.2 Curriculum Module
Top-level groupings of content.
*   `moduleId` (String)
*   `title` (String, e.g., "JavaScript Control Flow")
*   `lessons` (Array of Lesson IDs)

### 5.3 Lesson / Challenge Object
The atomic unit of the learning experience.
*   `lessonId` (String)
*   `type` (Enum: 'parsons', 'faded_example', 'blank_canvas')
*   `contentMDX` (String - The instructional text)
*   `initialCodeState` (String/JSON - The starting blocks or code)
*   `validationLogic` (String/JSON - The expected output or AST to test against)

## 6. Phase 1 Release Milestones
*   **Milestone 1:** Core UI Shell & Authentication (Next.js, Express, MongoDB setup).
*   **Milestone 2:** Interactive Engine V1 (Zustand state integration, Monaco Editor, and Parsons Drag-and-Drop).
*   **Milestone 3:** Client-Side Execution (Pyodide and iframe sandboxing).
*   **Milestone 4:** Content integration (HTML/CSS & Intro JS modules).

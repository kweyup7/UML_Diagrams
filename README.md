# Diagram Workshop

An interactive web tutorial that teaches university computing students how to draw the diagrams used in systems analysis and design, one step at a time.

Every lesson follows the same scenario, a **Student Consultation Booking System** in which students book time with lecturers. Seeing one system modelled in several ways helps students understand what each diagram is for and how the diagrams relate to each other.

**Live version:** _add your GitHub Pages link here_

---

## Why we built this

Students often learn diagram notation as a list of symbols to memorise. They can name an actor or a diamond, but struggle to start a diagram from a blank page, to decide what belongs in it, or to see why one diagram exists alongside another.

This project tackles three problems we see in class:

1. **Symbols are taught without a story.** A stickman, an oval and a dashed arrow mean little until you watch them build a real model.
2. **Finished diagrams hide the thinking.** A textbook shows the final result. Students need to see the order in which decisions are made.
3. **Different diagrams look unrelated.** In practice, a use case becomes a process, a data store becomes an entity, and an entity becomes a table. Using one scenario throughout makes those links visible.

## What students can do

Each module has two tabs.

- **Symbols Reference.** A card for every symbol, drawn as it appears in a real diagram, with a plain-language definition and an example from the case study.
- **Step-by-Step Case Study.** The diagram is built from scratch using Previous and Next (or the left and right arrow keys). Whatever is new in each step is highlighted, and each step explains what to draw, why, and a common mistake to avoid.

## What is covered

The content is split into two approaches to analysis and design.

### OOAD (Object-Oriented Analysis and Design)

| Module | What students learn |
| --- | --- |
| Use Case Diagram | Actors, system boundary, use cases, associations, «include» and «extend» |
| Sequence Diagram | Participants, lifelines, activation bars, synchronous and return messages, `alt` fragments |
| Class Diagram | Three-compartment classes, visibility (+ - #), inheritance, association, multiplicity, composition |
| ER Diagram (Chen notation) | Entities, key, multi-valued and derived attributes, relationships, cardinality, total participation |
| Relational Schema | Mapping an ER diagram to tables, primary keys, foreign keys, junction tables |

### SSAD (Structured Systems Analysis and Design)

| Module | What students learn |
| --- | --- |
| Use Case Diagram | Capturing requirements before drawing data flows |
| DFD Level 0 (Context Diagram) | One process, external entities, data flows that cross the boundary |
| DFD Level 1 | Decomposing a process, data stores, balancing against Level 0, black holes, miracles and grey holes |
| Activity Diagram | Swimlanes, actions, decisions and guards, fork and join, final node |
| ER Diagram (Chen notation) | Modelling the data held in the DFD data stores |
| Relational Schema | Turning data stores into tables |

DFDs use Gane and Sarson notation. The reference tab also shows the Yourdon–DeMarco equivalents.

## How it can be used

- **In a lecture.** Project a module and step through the diagram together, pausing to ask students what comes next before pressing Next.
- **In a lab.** Students follow along on their own screens and draw each step on paper or in a modelling tool.
- **As revision.** The Symbols Reference works as a quick cheat sheet before an assessment.
- **As a worked example for coursework.** Students can compare the case study with the diagrams for their own project.

## Run it

### Option 1: open the page (no install)

The standalone build is a single HTML file. Download `index.html` and open it in any browser. It needs no internet connection.

### Option 2: host it for your class

Upload `index.html` to GitHub Pages, Netlify or any static host.

For GitHub Pages: push the file to a repository, open **Settings → Pages**, choose the `main` branch and save.

### Option 3: use the React component

`src/App.jsx` is one self-contained React component with a default export. It needs:

- React 18
- Tailwind CSS 3 (with `./src/**/*.jsx` in its `content` setting)
- `lucide-react`

Every symbol and diagram is built from inline SVG and HTML, so there are no image files to manage.

```bash
npm create vite@latest diagram-workshop -- --template react
cd diagram-workshop
npm install lucide-react
npm install -D tailwindcss@3 postcss autoprefixer
npx tailwindcss init -p
```

Then add `@tailwind base; @tailwind components; @tailwind utilities;` to your main CSS file, copy `App.jsx` into `src/`, and run `npm run dev`.

## Adapting it for your own course

The lessons are defined as plain data near the bottom of `App.jsx`, so you can change them without touching the layout.

- **Change the case study.** Edit the diagram components (for example `UseCaseDiagram`) and the matching step text.
- **Add a module.** Add an entry to `MODULE_LIST` with a title, introduction, symbols, steps and a diagram component, then list its id in `SECTIONS`.
- **Change the notation.** The DFD modules use Gane and Sarson. Swap the `GSProcess` and `GSStore` drawing helpers if your course uses Yourdon–DeMarco.

## Contributing

Corrections, clearer wording and new case studies are welcome. If you find a symbol or rule that differs from your textbook, please open an issue and tell us which textbook or standard you follow. Notation varies between courses, and we would like the tutorial to say so where it matters.

## Credits

Created Paul Kweyu.

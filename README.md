<div align="center">

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=22&duration=3000&pause=1200&color=34D399&center=true&vCenter=true&width=800&lines=Engineering-first+Product+Builder;Building+Performant+Software;Production-Ready+Systems;Developer-Focused+Tools" alt="Typing SVG" />

# Harsha Vardhan Burra

**Engineering products where reliability matters as much as features.**

Building performant software, production-ready systems, and developer-focused tools.

<p align="center">
  <a href="https://github.com/harsha-vardhan-burra">
    <img
      src="https://skillicons.dev/icons?i=github"
      width="42"
      alt="GitHub"
      style="vertical-align: middle;"
    />
  </a>
  <span style="font-size:20px; font-weight:600; vertical-align: middle;">
    harsha-vardhan-burra
  </span>
</p>

</div>

<br>

## About

I like building the part of a project that only becomes visible once it leaves your machine — the packaging edge case, the abuse vector, the state bug that only shows up on a slow connection. A desktop app and a SaaS backend taught me the same lesson from different directions: shipping is where the real engineering starts.

<br>

## Currently

|                   |                                                                                                                                     |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| **Building**      | [GoldTracker](https://github.com/harsha-vardhan-burra/GoldTracker) v2, [SnapLink](https://github.com/harsha-vardhan-burra/SnapLink) |
| **Learning**      | System design, containerized deployments                                                                                            |
| **Interested in** | Backend engineering, abuse-resistant systems, developer tooling                                                                     |

<br>

## Engineering Philosophy

- **A feature isn't complete when it works — it's complete when it fails safely.** Abuse handling and edge cases are part of the spec, not cleanup work.
- **Match the infrastructure to the problem, not to what's impressive.** SQLite suits a single-user desktop tool; PostgreSQL suits a multi-tenant service. The interesting decision is knowing which is which.
- **Automate the decision, not just the task.** Conventional commits and semantic versioning exist so the _reasoning_ behind a release survives, not just the code.
- **Packaging is part of the product.** Software that only runs on the machine that built it isn't shipped yet.
- **The happy path is the easy 80%.** The trust of the system is built in the other 20% — expired sessions, malformed input, a bot filling out a form too fast.
- **Trade-offs should be visible, not hidden.** Every architectural choice below has a reason it wasn't the other option.

<br>

## Featured Projects

### GoldTracker

**Problem.** Gold is a core household savings instrument in India, but retail tooling for tracking it is either locked inside a brokerage app or a manually-updated spreadsheet — nothing sits in between as a lightweight, offline-first personal tool.

**Solution.** A native Windows desktop application that polls live market data, persists it locally, and turns raw price history into portfolio-level analytics without any server dependency once installed.

**Interesting engineering decisions**

- Structured delivery into four sequential phases — ingestion, portfolio tracking, data integrity, analytics — so each layer was provably correct before the next one depended on it.
- Indexed historical price lookups with **bisect** instead of linear scans, reducing lookup complexity from linear scans to logarithmic searches over months of use.
- Returned analytics as **dataclasses** rather than dictionaries, trading a little verbosity for typed, self-documenting results the UI layer can rely on.

**Technical challenges**

- A PyInstaller packaging bug meant file paths resolved correctly in development but broke once frozen into an executable — fixed by making path resolution frozen-aware, a class of bug that's invisible until the moment you actually ship.

**Impact.** An installable desktop tool with a real tagged-release history, not a script that only runs on one machine.

<details>
<summary><strong>Architecture</strong></summary>

```mermaid
%%{init: {'theme': 'dark', 'themeVariables': {'primaryColor': '#34D399', 'primaryTextColor': '#fff', 'primaryBorderColor': '#34D399', 'lineColor': '#34D399', 'background': '#0d1117'}}}%%
flowchart TD
    A[Gold Price API] --> B[Data Ingestion]
    B --> C[Analytics Engine]
    C --> D[(SQLite)]
    D --> E[Desktop App — CustomTkinter]
```

</details>

**Stack:** Python · CustomTkinter · SQLite · matplotlib · pystray · PyInstaller

---

### SnapLink

**Problem.** A URL shortener is trivial until it's public — without abuse controls, it quietly becomes free infrastructure for spam and phishing redirects within days of launch.

**Solution.** A full-stack shortening platform where authentication and abuse-resistance were designed in from the start, not added after the first incident.

**Interesting engineering decisions**

- Spring Boot was chosen for its mature ecosystem around security, dependency injection, and production-ready backend development.
- Combined **JWT authentication with OAuth** (Google, GitHub) and a Remember Me flow — weighing session convenience against token exposure rather than defaulting to the longest-lived option.
- Layered abuse defenses — **disposable-email blocking, Turnstile bot protection, honeypot fields, rate limiting** — so no single check is a single point of failure.
- Chose **PostgreSQL** over a file-backed store for the concurrency and durability a multi-tenant SaaS needs under real load.

**Technical challenges**

- Tracked down environment-variable misuse and React state corruption on client-side navigation before deployment — the class of bug that only surfaces once a user actually clicks around instead of reloading the page.

**Impact.** A shortener engineered to hold up under public traffic, not just under a local demo.

<details>
<summary><strong>Architecture</strong></summary>

```mermaid
%%{init: {'theme': 'dark', 'themeVariables': {'primaryColor': '#34D399', 'primaryTextColor': '#fff', 'primaryBorderColor': '#34D399', 'lineColor': '#34D399', 'background': '#0d1117'}}}%%
flowchart TD
    A[Client — React/Vite] --> B[Spring Boot API]
    B --> C[Authentication — JWT + OAuth]
    B --> D[Anti-Abuse Layer — Turnstile, honeypot, rate limiting]
    C --> E[(PostgreSQL)]
    D --> E
```

</details>

**Stack:** Spring Boot · React/Vite · PostgreSQL

<sub>Both repositories above are personal projects with real release/commit histories — not external open-source contributions, which I don't have on record yet.</sub>

<br>

## ⚡ Engineering Capabilities

<table>
<tr>

<td width="50%" valign="top">

### ⚙️ Backend Engineering

<p>
<img src="https://skillicons.dev/icons?i=java,spring,postgresql&theme=dark" />
</p>

Designing secure backend systems focused on:

- REST APIs
- JWT / OAuth
- Rate Limiting
- Production Reliability

</td>

<td width="50%" valign="top">

### 🎨 Frontend Engineering

<p>
<img src="https://skillicons.dev/icons?i=react,vite,js&theme=dark" />
</p>

Building polished user experiences through:

- Component-driven UI
- Responsive Design
- GSAP Animations
- Performance Optimization

</td>

</tr>

<tr>

<td width="50%" valign="top">

### 🖥 Desktop Engineering

<p>
<img src="https://skillicons.dev/icons?i=python,sqlite&theme=dark" />
</p>

Creating native desktop applications with:

- Offline-first Architecture
- Local Persistence
- Packaging
- Analytics

</td>

<td width="50%" valign="top">

### 🛠 Developer Workflow

<p>
<img src="https://skillicons.dev/icons?i=git,github,bash,vscode&theme=dark" />
</p>

Shipping software through:

- Version Control
- Automation
- Release Management
- Developer Tooling

</td>

</tr>

</table>

## Roadmap

**Shipped**

- [x] GoldTracker — four-phase build, tagged releases
- [x] SnapLink — auth, anti-abuse layer, core shortening flow

**In progress**

- [ ] GoldTracker v2 — deeper analytics, refined UX
- [ ] SnapLink — production deployment hardening (current goal: take it from "working" to "survives being public")

**Next**

- [ ] Docker-based deployment workflows
- [ ] AWS fundamentals for real infrastructure deployment
- [ ] System design — moving from "it works" to "it scales"

<br>

## 🔗 Find Me Online

<div align="center">

<a href="https://github.com/harsha-vardhan-burra">
  <img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" />
</a>

<a href="https://linkedin.com/in/harsha-vardhan-burra">
  <img src="https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" />
</a>

<a href="mailto:harshavardhanburra.dev@gmail.com">
  <img src="https://img.shields.io/badge/Email-EA4335?style=for-the-badge&logo=gmail&logoColor=white" />
</a>

<br><br>

<a href="https://leetcode.com/u/Harsha7989/">
  <img src="https://img.shields.io/badge/LeetCode-FFA116?style=for-the-badge&logo=leetcode&logoColor=black" />
</a>

<a href="https://codeforces.com/profile/Harsha_7989">
  <img src="https://img.shields.io/badge/Codeforces-1F8ACB?style=for-the-badge&logo=codeforces&logoColor=white" />
</a>

<a href="https://www.codechef.com/users/harsha_7989">
  <img src="https://img.shields.io/badge/CodeChef-5B4638?style=for-the-badge&logo=codechef&logoColor=white" />
</a>

</div>

<br>

## GitHub Metrics

<div align="center">
  <img src="https://github-readme-stats-sigma-five.vercel.app/api?username=harsha-vardhan-burra&show_icons=true&theme=tokyonight&bg_color=0d1117&hide_border=true" alt="GitHub Stats" width="49%" />
  <img src="https://github-readme-streak-stats.herokuapp.com/?user=harsha-vardhan-burra&theme=tokyonight&background=0d1117&border=0d1117" alt="Streak Stats" width="49%" />
</div>

<div align="center">
  <img src="https://github-readme-activity-graph.vercel.app/graph?username=harsha-vardhan-burra&theme=github-dark&hide_border=true&bg_color=0D1117&color=34D399&line=34D399&point=FFFFFF&area=true&area_color=34D399" alt="Activity Graph" width="90%" />
</div>

<div align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)"
srcset="https://raw.githubusercontent.com/harsha-vardhan-burra/harsha-vardhan-burra/output/pacman-dark.svg">

<source media="(prefers-color-scheme: light)"
srcset="https://raw.githubusercontent.com/harsha-vardhan-burra/harsha-vardhan-burra/output/pacman.svg">

<img
src="https://raw.githubusercontent.com/harsha-vardhan-burra/harsha-vardhan-burra/output/pacman.svg">
</picture>

</div>

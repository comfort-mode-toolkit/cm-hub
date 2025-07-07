# Contribution Guide for IIT Madras Students

Welcome to the Comfort Mode ecosystem! This guide is for students and researchers from IIT Madras interested in contributing to a new vision for web accessibility, as described in ["Beyond Compliance: A User-Autonomy Framework for Inclusive and Customizable Web Accessibility"](https://doi.org/10.48550/arXiv.2506.10324).
> **Disclaimer:**  
> This guide is an independent, community-created resource for IIT Madras students interested in the Comfort Mode project. It is not officially endorsed by IIT Madras or any of its departments. Its purpose is to help students and contributors get involved, learn, and make a positive impact. Everyone is welcome—your ideas and energy make this community stronger!
---

## What is the Comfort Mode Ecosystem?

**Comfort Mode** is a community-driven accessibility platform that lets web users customize their digital experience—colors, fonts, motion, and more—based on their own needs, not just a fixed "accessible" standard. Inspired by and grateful for the foundational work of WCAG, accessibility researchers, and practitioners, we aim to go further:  
**Can we build a web that truly puts users in control of their own comfort and needs?**

**The Vision:**  
Move beyond basic compliance. Make the web a place where each person—regardless of ability—can tailor their experience for real comfort, ease, and inclusion.

---

## Project Foundation

Built upon the shoulders of giants, including:
- The [W3C WCAG](https://www.w3.org/WAI/standards-guidelines/wcag/) standards
- Research and advocacy from accessibility experts worldwide
- The [Beyond Compliance](https://doi.org/10.48550/arXiv.2506.10324) paper, which proposes a user-autonomy model for web accessibility

---

## How Does Comfort Mode Work? (WIP)

- **cm-core** is a Python command-line tool that lets developers configure accessibility settings in a few steps.
- It generates and overrides CSS custom properties and class names to instantly adapt websites for user comfort.
- It outputs a cm-`comp.html` component of a toggle to copy paste into their code ( either on navbar or somewhere persistent ), a `cm-vars.css` which is basically a override file of the variables in original css, a `cm-toggle.js` which just adds or removes the class from `<body>` tag to toggle between normal and comfort mode - Think light dark theme toggles in websites
- The system is modular: anyone can extend it with new plugins for colors, typography, motion, and more—making the web ever more accessible.
- Comfort Mode does **not** require changing your website’s structure. All changes are layered on top, making it easy and safe to adopt.

Developers simply add our core component and get a comfort toggle—think cookie consent banners, but for personalizing accessibility.

![Comfort Mode toggle - just like light/dark theme toggles on websites](https://github.com/user-attachments/assets/12b7f5d0-fb55-4180-bd73-ef04905e4521)

**Developers customize based on their user base:**
![Users customize the options they want](https://github.com/user-attachments/assets/af0c4f29-dd68-4ec3-890b-ff6a29ab5579)

**The community drives every decision:**
![Community input shapes our roadmap](https://github.com/user-attachments/assets/dc90ed7a-6d46-40b8-96ea-f5b9797cae51)

---

## Contribution Workflow (WIP)

1. **Get Inspired**
   - Read our [research paper](https://doi.org/10.48550/arXiv.2506.10324) and explore the [why behind our vision]([https://github.com/comfort-mode/cm-hub](https://github.com/comfort-mode-toolkit/cm-hub/discussions/2).

2. **Join the Discussion**
   - Share your ideas in [GitHub Discussions](https://github.com/comfort-mode/cm-hub/discussions).
   - Propose features, research topics, or accessibility challenges.

3. **Pick a Project**
   - Check open research topics or implementation issues in the [planner](https://github.com/orgs/comfort-mode-toolkit/projects/2/views/1).
   - Find something that excites you—coding, research, documentation, or testing.

4. **Research & Specification**
   - For new features, contribute to research summaries or specs (see templates in the Hub - wip).
   - Back up your ideas with evidence: user studies, accessibility guidelines, or new user needs.

5. **Development**
   - Fork the relevant repo (e.g., `cm-core`, `cm-colors`).
   - Build your feature following the spec and code standards.
   - Write tests and documentation if relevant.
   - Submit a pull request.

6. **Review & Feedback**
   - Participate in code and research reviews.
   - Address feedback, iterate, and help others.

7. **Celebrate & Share**
   - Your work will help real users have a better web experience!
   - Present your contributions in seminars, discussion groups, or open source showcases.

---

## FAQ

### Do I need to know how to code?

**No!** There are many ways to contribute beyond coding. See “Non-code contributions” below.

### I only know core Python. Is that okay?

**Absolutely.** Many beginner-friendly tasks use only basic Python. See “Python tasks” below for examples.

### What if I’m new to open source or accessibility?

That’s perfectly fine! We welcome newcomers and provide guidance. Start with documentation, research summaries, or beginner Python issues. Ask for help in [GitHub Discussions](https://github.com/comfort-mode/cm-hub/discussions).

---

✨ **Non-code contributions:**

- Researching on various accessibility needs and helping summarize key insights
- Improving our documentation, like making setup steps clearer
- Giving feedback on user flow, accessibility, or interface ideas

🐍 **Python tasks (beginner-friendly):**

- Writing simple CLI interactions (e.g., prompts, outputs, config handling)
- Adding test cases or improving error messages
- Refactoring small chunks of logic for clarity

---

## Why Your Contribution Matters

- **Real-World Impact:** You will directly help people with diverse needs enjoy the web.
- **Research to Reality:** Apply your technical and research skills in a project that bridges theory and practical inclusion.
- **Community:** Join a network of passionate accessibility advocates, developers, and researchers.

---

## How to Get Started

- Read the [General workflow guide]([../comfort-mode-hub.md](https://github.com/comfort-mode-toolkit/cm-hub?tab=readme-ov-file)) for community values, workflow, and project structure.
- Dive into the ["Beyond Compliance" paper](https://doi.org/10.48550/arXiv.2506.10324) for background and inspiration.
- Check out our [planner](https://github.com/orgs/comfort-mode-toolkit/projects/2/views/1).
- Join our [GitHub Discussions](https://github.com/comfort-mode/cm-hub/discussions) to introduce yourself and share your interests.

---

## Acknowledgements

We are deeply grateful for the ongoing efforts of the W3C, WCAG authors, accessibility researchers, advocates, and everyone working to make the web more inclusive. Without their foundational work, Comfort Mode would not be possible.

---

**Let’s build a web that’s not just accessible, but truly comfortable for everyone.**

Ready? [Get involved now!](https://github.com/comfort-mode/cm-hub)

# Comfort Mode: Spacing & Scaling Experiment  
_A research log under `/research/spacing`_

Hi friend 👋  

Thank you for landing here. This page is part of an ongoing, fully open-source project called **Comfort Mode** — our collective attempt to make the web feel gentler, calmer, and easier to use, especially for those who often feel visually overstimulated or fatigued by tightly packed layouts, tiny fonts, or constant motion.

This document outlines our first core experiment:  
📏 **Comparing linear vs perceptual (exponential) scaling models** for adjusting visual spacing and font sizes.

---

## 🌱 Why This Matters

Accessibility isn't just about screen readers or ARIA roles (though those are essential).  
It's also about visual comfort — how text flows, how much breathing room elements have, how easily the eye can follow content without strain or overwhelm.

Today, most “scaling” systems use:
- **Linear models** (e.g., multiply all spacing by 1.2×)
- **Step-based spacing** (4px, 8px, 12px, etc.)

But these don’t always feel natural. A 20% increase in padding may feel massive, while the same 20% applied to font-size may barely register. Why? Because **humans don’t perceive size changes linearly.**

That’s where psychophysics comes in.

---

## 🧠 Our Research Question

**Does perceptual scaling — based on human sensitivity to visual change — feel more comfortable than traditional linear scaling on real websites?**

We're focusing specifically on:
- Font size
- Line height
- Spacing between blocks (margin, padding)
- Element clustering and density

This is not about "what looks best" — it's about **what feels most usable and soothing**, especially during longer reading or browsing sessions.

---

## 🔍 Models We're Testing

### 1. Linear Contextual Scaling  
Each UI property (font size, padding, etc.) has a scaling factor — but we scale them *differently* based on visual role.

| Element        | Scaling Factor |
|----------------|----------------|
| Font Size      | `+0.2x`        |
| Padding        | `+0.3x`        |
| Border Radius  | `+0.1x`        |
| Line Height    | `+0.15x`       |

This gives us predictable, dev-friendly layouts but doesn’t account for perceptual sensitivity.

---

### 2. Perceptual / Psychophysical Scaling  
Inspired by:

- **Weber–Fechner Law** (logarithmic perception of intensity)
- **Stevens’ Power Law** (non-linear response across sensory modalities)

Here, a smaller numeric change in smaller elements feels bigger, while larger elements require bigger numeric changes to feel different.

🧪 We’ll apply this logic to font size, spacing, and layout breathing room to model a “comfort curve” that *feels* more balanced — even if the CSS values aren't evenly scaled.

---

## 🧪 Experiment Design

We'll be A/B testing two versions of a web demo:

| Group A              | Group B                         |
|----------------------|----------------------------------|
| Linear Scaling Model | Perceptual Scaling Model        |
| Shown to 50% users   | Shown to remaining 50% users    |
| No visual labels     | No label about which version    |

Users will simply interact with the site, then respond to a **3-question 5-point comfort scale**, plus an optional comment box.

We’ll analyze:
- Mean scores
- Standard deviation
- Mann–Whitney U test (non-parametric)
- Open-text analysis for qualitative insight

We’re not collecting:
- IP addresses  
- Identifying data  
- Usage metrics beyond the voluntary survey

---

## 🛡️ Ethical Approach

We are intentionally avoiding:
- Labels (e.g., “for ADHD/autistic users”)
- Diagnosis-based options
- Gated features or opt-ins that require disclosure

✨ Anyone can toggle Comfort Mode.  
✨ You don’t need a reason.  
✨ Your comfort is reason enough.

---

## 🫶 Why This Is *Not* Just an “Overlay”

We’ve received (fair!) skepticism about whether this is just another "accessibility overlay."

Let us be clear:
- ❌ Not JS-based DOM rewriting
- ❌ Not marketed as a WCAG compliance solution
- ✅ Build-time optional layer
- ✅ Pure CSS toggle hooks
- ✅ No attempt to mask bad markup or broken semantics

It’s not a patch. It’s a kindness-first utility, rooted in perceptual science and user dignity.

---

## 🔬 For the Curious: Scientific Basis

We draw from:
- Visual perception & psychophysics  
- Accessibility research (W3C + indie studies)  
- Human-centered design literature  
- Our own [preprint on user-autonomy accessibility models](https://arxiv.org/abs/2506.10324)

We're intentionally blending UX design, cognitive science, and real-world user research to ask a very simple, human question:

> “Can this feel better… for someone who just wants a little more ease?”

---

## 📊 What Happens Next?

Once we gather ~200+ responses, we’ll publish:
- Our anonymized results (with charts + interpretation)
- Our code
- Our scaling formulas
- A small summary paper (hopefully at UAIS or similar)
- A comfort-first scaling API that any dev can wrap around their site

All free, open source, and forever non-commercial.

---

## 🤲 How You Can Help

- Share your honest comfort experiences at [Our Github discussions thread](https://github.com/comfort-mode-toolkit/cm-hub/discussions/7) or [Reddit](https://www.reddit.com/r/accessibility/comments/1lu0pms/what_would_make_the_web_feel_more_comfortable_to/)
- Star our repo, join a discussion, or submit a PR  
- Tell us if something feels off, or if we can phrase things better  

We’re here to build this together. Not for labels. Not for checkboxes. But for care.

💛  
With gratitude,  
_— The Comfort Mode Team_  

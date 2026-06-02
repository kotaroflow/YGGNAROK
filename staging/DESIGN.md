---
version: "1.0"
name: YGGNAROK Design System
description: Modern SaaS for AI agents automation with warm, professional visuals
colors:
  light:
    background: "#FAFAFA"
    foreground: "#171717"
    surface: "rgba(255,255,255,.95)"
    surfaceStrong: "#FFFFFF"
    muted: "#404040"
    brand: "#7c3aed"
    brandStrong: "#6d28d9"
  dark:
    background: "#121214"
    foreground: "#F5F5F5"
    surface: "rgba(30,30,32,.65)"
    surfaceStrong: "rgba(36,36,38,.85)"
    muted: "#A3A3A3"
    brand: "#F59E0B"
    brandStrong: "#D97706"
  inversionRule: "Amber (light) → violet accents on light bg; Void (dark) → amber accents on dark bg"
typography:
  display:
    fontFamily: Geist Sans
    fontSize: 32px
    fontWeight: 700
    lineHeight: 1.1
  heading:
    fontFamily: Geist Sans
    fontSize: 24px
    fontWeight: 600
    lineHeight: 1.2
  body:
    fontFamily: Geist Sans
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
rounded:
  sm: 4px
  md: 8px
  lg: 12px
  xl: 16px
spacing:
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  xxl: 32px
components:
  buttonPrimary:
    backgroundColor: "{colors.brand}"
    textColor: "#171717"
    typography: "{typography.body}"
    rounded: "{rounded.xl}"
    padding: "8px 16px"
    height: 36px
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.xl}"
    padding: 20px
  input:
    height: 44px
    rounded: "{rounded.lg}"
---

## Overview

A warm, professional system designed for AI agents SaaS. Uses a 4-tier surface
elevation model with consistent borders and refined typography.

## Colors

| Token | Light (Amber) | Dark (Void) |
|-------|---------------|-------------|
| background | `#FAFAFA` | `#121214` |
| foreground | `#171717` | `#F5F5F5` |
| surface-base | `#FAFAFA` | `#121214` |
| surface | `rgba(255,255,255,.95)` | `rgba(30,30,32,.65)` |
| surface-strong | `#FFFFFF` | `rgba(36,36,38,.85)` |
| surface-overlay | `rgba(255,255,255,.98)` | `rgba(42,42,44,.94)` |
| muted | `#404040` | `#A3A3A3` |
| brand | `#7c3aed` (violet) | `#F59E0B` (amber) |
| brand-strong | `#6d28d9` | `#D97706` |

> **Regra de Inversão**: O tom YGGNAROK inverte entre light e dark.
> - **Amber (light)**: fundo claro, detalhes/glow/aura **VIOLETA**
> - **Void (dark)**: fundo escuro, detalhes/glow/aura **ÂMBAR**

## Surface Elevation System

Four distinct surface tiers prevent visual flatness:

1. **surface-base**: Page background, never elevated
2. **surface**: Cards, panels, sticky headers
3. **surface-strong**: Floating cards, dropdowns
4. **surface-overlay**: Modals, popovers, command palettes

Each tier uses lightness deltas (4-6% L in light mode, 5-8% L in dark mode)
combined with 1-2 layer shadows for depth.

## Typography

- **Display**: 32px, 700 weight, tight leading
- **Heading**: 24px, 600 weight, comfortable leading
- **Body**: 14px, 400 weight, readable line height

## Components

### Button (Primary)
- Background: brand color
- Text: near-black (high contrast)
- Height: 36px
- Rounded: 16px
- States: hover darkens brand-strong, focus ring brand/40

### Input Fields
- Height: 44px
- Rounded: 12px
- Border: 1px solid var(--line)
- Focus: brand border + brand/20 ring

### Cards
- Background: var(--surface)
- Border: 1px solid var(--line)
- Rounded: 16px
- Padding: 20px

## Do's and Don'ts

**Do**
- Promote repeated visual choices into this file
- Use CSS variables for surface tiers and colors
- Apply 2-layer shadows for elevation

**Don't**
- Use single large shadows
- Give child elements larger radius than parents
- Hardcode color values outside CSS variables

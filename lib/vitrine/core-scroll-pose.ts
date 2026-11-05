export const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v))
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t
export const smooth = (t: number) => t * t * (3 - 2 * t)
export const segment = (p: number, a: number, b: number) =>
  smooth(clamp((p - a) / (b - a)))

export function bezier(t: number) {
  const u = 1 - t
  return {
    x: u * u * u * 615 + 3 * u * u * t * 470 + 3 * u * t * t * 210 + t * t * t * 195,
    y: u * u * u * 300 + 3 * u * u * t * 138 + 3 * u * t * t * 238 + t * t * t * 389.2,
  }
}

export type PoseResult = {
  x: number
  bx: number
  by: number
  theta: number
  attached: boolean
  armActive: boolean
}

/** Pure function of scroll progress; reversing scroll reverses movement. */
export function pose(p: number): PoseResult {
  let x = -650
  let bx = -635
  let by = 300
  let theta = 0
  let attached = true
  let armActive = false

  if (p < 0.32) {
    x = lerp(-650, 600, segment(p, 0.17, 0.32))
    bx = x + 15
  } else if (p < 0.48) {
    x = 600
    const t = segment(p, 0.35, 0.48)
    const pt = bezier(t)
    bx = pt.x
    by = pt.y
    theta = -3 * Math.sin(t * Math.PI)
    armActive = true
  } else if (p < 0.7) {
    x = lerp(600, 1300, segment(p, 0.5, 0.57))
    bx = 195
    by = 389.2
    attached = false
  } else if (p < 0.84) {
    x = lerp(1300, 600, segment(p, 0.71, 0.81))
    bx = 195
    by = 389.2
    attached = false
    armActive = p > 0.8
  } else if (p < 0.95) {
    x = 600
    const t = 1 - segment(p, 0.84, 0.95)
    const pt = bezier(t)
    bx = pt.x
    by = pt.y
    theta = -3 * Math.sin(t * Math.PI)
    armActive = true
  } else {
    x = lerp(600, 1310, segment(p, 0.955, 1))
    bx = x + 15
  }

  return { x, bx, by, theta, attached, armActive }
}

export type RigResult = {
  armD: string
  hydraulicD: string
  joint: { x: number; y: number }
  baseJoint: { x: number; y: number }
  chainD: string
  chainOpacity: number
}

export function rig(
  x: number,
  bx: number,
  by: number,
  p: number,
  active: boolean
): RigResult {
  const root = { x: x + 155, y: 414 }
  const carry = { x: x + 185, y: 240 }
  const target = { x: bx + 185, y: by - 52 }
  let blend = 0
  if (p >= 0.33 && p < 0.5) blend = segment(p, 0.33, 0.35) * (1 - segment(p, 0.48, 0.5))
  if (p >= 0.8 && p < 0.96) blend = segment(p, 0.8, 0.84) * (1 - segment(p, 0.95, 0.96))

  const tip = {
    x: lerp(carry.x, target.x, blend),
    y: lerp(carry.y, target.y, blend),
  }
  const dx = tip.x - root.x
  const dy = tip.y - root.y
  const d = Math.max(1, Math.hypot(dx, dy))
  const L = Math.max(230, d * 0.51)
  const h = Math.sqrt(Math.max(0, L * L - (d * d) / 4))
  const joint = {
    x: (root.x + tip.x) / 2 - (dy / d) * h,
    y: (root.y + tip.y) / 2 + (dx / d) * h,
  }

  return {
    armD: `M${root.x} ${root.y}L${joint.x} ${joint.y}L${tip.x} ${tip.y}`,
    hydraulicD: `M${root.x - 28} ${root.y + 5}L${joint.x} ${joint.y}`,
    joint,
    baseJoint: root,
    chainD: `M${bx + 109} ${by + 25}L${target.x} ${target.y}L${bx + 287} ${by + 25}`,
    chainOpacity: active ? blend : 0,
  }
}

export function scrollStageIndex(p: number): number {
  if (p < 0.17) return 0
  if (p < 0.57) return 1
  if (p < 0.71) return 2
  return 3
}

export const CORE_SCROLL_STAGE_POINTS = [0.07, 0.39, 0.65, 0.89] as const

export type CoreScrollStep = {
  title: string
  titleLines: [string, string]
  description: string
  caption: string
  navLabel: string
}

export const CORE_SCROLL_STEPS: CoreScrollStep[] = [
  {
    title: "Vous choisissez.<br>On prépare la suite.",
    titleLines: ["Vous choisissez.", "On prépare la suite."],
    description:
      "Indiquez votre adresse et vos déchets. Nous vous aidons à choisir le bon volume, avec un tarif affiché avant le paiement.",
    caption: "Votre projet commence ici.",
    navLabel: "Le choix",
  },
  {
    title: "La benne arrive.<br>Au bon endroit.",
    titleLines: ["La benne arrive.", "Au bon endroit."],
    description:
      "Le chauffeur livre votre benne. Si nécessaire, nous vous contactons pour confirmer l’accès au chantier et le créneau de pose.",
    caption: "La livraison, au plus près de votre projet.",
    navLabel: "La livraison",
  },
  {
    title: "Vous remplissez.<br>Le chantier avance.",
    titleLines: ["Vous remplissez.", "Le chantier avance."],
    description:
      "Déposez les déchets autorisés pour le forfait choisi, sans dépasser le bord de la benne. Vous gardez votre espace de travail organisé.",
    caption: "Uniquement les déchets autorisés, sous le bord.",
    navLabel: "Le remplissage",
  },
  {
    title: "C’est rempli.<br>On prend le relais.",
    titleLines: ["C’est rempli.", "On prend le relais."],
    description:
      "Nous organisons l’enlèvement selon les modalités convenues avec vous. La benne repart, votre chantier peut continuer.",
    caption: "La benne est reprise selon les modalités convenues.",
    navLabel: "La reprise",
  },
]

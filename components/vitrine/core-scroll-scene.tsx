"use client"

import {
  forwardRef,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
} from "react"

import {
  clamp,
  lerp,
  pose,
  rig,
  segment,
} from "@/lib/vitrine/core-scroll-pose"

const CHASSIS_SRC = "/vitrine-scroll/chassis-sans-roues.png"
const BIN_SRC = "/vitrine-scroll/benne-vide.png"
const NS = "http://www.w3.org/2000/svg"

function setAttrs(el: Element | null, attrs: Record<string, string | number>) {
  if (!el) return
  for (const [k, v] of Object.entries(attrs)) {
    el.setAttribute(k, String(v))
  }
}

export type CoreScrollSceneHandle = {
  render: (p: number, mobile: boolean) => void
}

export const CoreScrollScene = forwardRef<CoreScrollSceneHandle>(function CoreScrollScene(
  _props,
  ref
) {
  const uid = useId().replace(/:/g, "")
  const sceneRef = useRef<SVGSVGElement>(null)
  const rocksRef = useRef<SVGPathElement[]>([])
  const fallingRef = useRef<SVGPathElement[]>([])
  const fillRocksGroupRef = useRef<SVGGElement>(null)
  const fallingRocksGroupRef = useRef<SVGGElement>(null)

  const ids = {
    metal: `metal-${uid}`,
    rubber: `rubber-${uid}`,
    armPaint: `arm-paint-${uid}`,
    phoneMetal: `phone-metal-${uid}`,
    glass: `glass-${uid}`,
    shadow: `shadow-${uid}`,
    phoneShadow: `phone-shadow-${uid}`,
    opening: `opening-${uid}`,
    wheel: `wheel-${uid}`,
  }

  useEffect(() => {
    const fillGroup = fillRocksGroupRef.current
    const fallGroup = fallingRocksGroupRef.current
    if (!fillGroup || !fallGroup || rocksRef.current.length) return

    const rocks: SVGPathElement[] = []
    for (let i = 0; i < 49; i++) {
      const node = document.createElementNS(NS, "path")
      const x = 22 + (i % 16) * 19 + (Math.floor(i / 16) % 2) * 7
      const y = 21 + Math.floor(i / 16) * 5
      node.setAttribute(
        "d",
        `M${x - 5} ${y + 4}l-2-5 5-4 7 2 2 6Z`
      )
      node.setAttribute(
        "fill",
        ["#9a9d8b", "#b7b4a0", "#838d7b", "#d2cab5", "#798274"][i % 5]!
      )
      fillGroup.appendChild(node)
      rocks.push(node)
    }
    rocksRef.current = rocks

    const falling: SVGPathElement[] = []
    for (let i = 0; i < 14; i++) {
      const node = document.createElementNS(NS, "path")
      node.setAttribute("d", "M-5 3l-3-6 5-5 8 3 1 7Z")
      node.setAttribute("fill", ["#9d9c88", "#b0ab98", "#828c7a"][i % 3]!)
      fallGroup.appendChild(node)
      falling.push(node)
    }
    fallingRef.current = falling
  }, [])

  useImperativeHandle(ref, () => ({
    render(p: number, mobile: boolean) {
      const root = sceneRef.current
      if (!root) return

      const $ = (id: string) => root.querySelector(`#${id}`)

      const v = pose(p)
      const truckOpacity = segment(p, 0.14, 0.2)
      const env = segment(p, 0.11, 0.2)
      const phoneFade = 1 - segment(p, 0.17, 0.26)

      setAttrs($(`phone-${uid}`), {
        opacity: phoneFade,
        transform: `translate(${lerp(435, 420, segment(p, 0.17, 0.26))} ${lerp(55, 115, segment(p, 0.17, 0.26))}) scale(${lerp(1, 0.8, segment(p, 0.17, 0.26))})`,
      })
      setAttrs($(`phone-fill-${uid}`), { width: 224 * segment(p, 0.035, 0.09) })
      const phoneButton = $(`phone-button-${uid}`)
      if (phoneButton) {
        phoneButton.textContent = p > 0.085 ? "Votre projet est prêt ✓" : "Choisir ma benne"
      }
      setAttrs($(`confirmation-${uid}`), {
        opacity: segment(p, 0.08, 0.11) * (1 - segment(p, 0.13, 0.18)),
      })
      setAttrs($(`environment-${uid}`), { opacity: env })
      setAttrs($(`truck-${uid}`), {
        transform: `translate(${v.x} 278)`,
        opacity: truckOpacity,
      })
      setAttrs($(`bin-${uid}`), {
        transform: `translate(${v.bx} ${v.by}) rotate(${v.theta} 170 100)`,
        opacity: truckOpacity,
      })
      setAttrs($(`truck-shadow-${uid}`), { cx: v.x + 265, opacity: env * 0.14 })
      setAttrs($(`bin-shadow-${uid}`), {
        cx: v.bx + 170,
        cy: 506,
        rx: lerp(110, 145, clamp((v.by - 200) / 190)),
        opacity: env * 0.1 * clamp((v.by - 240) / 150),
      })
      setAttrs($(`rig-${uid}`), { opacity: truckOpacity })

      const r = rig(v.x, v.bx, v.by, p, v.armActive)
      setAttrs($(`arm-${uid}`), { d: r.armD })
      setAttrs($(`hydraulic-${uid}`), { d: r.hydraulicD })
      setAttrs($(`joint-${uid}`), { cx: r.joint.x, cy: r.joint.y })
      setAttrs($(`base-joint-${uid}`), { cx: r.baseJoint.x, cy: r.baseJoint.y })
      setAttrs($(`chain-${uid}`), { d: r.chainD, opacity: r.chainOpacity })

      const rot = ((v.x + 650) / 39) * (180 / Math.PI)
      setAttrs($(`rear-wheel-${uid}`), { transform: `rotate(${rot})` })
      setAttrs($(`front-wheel-${uid}`), { transform: `rotate(${rot})` })

      const fill = segment(p, 0.575, 0.695)
      setAttrs($(`fill-base-${uid}`), { y: lerp(36, 20, fill) })
      rocksRef.current.forEach((n, i) => {
        setAttrs(n, { opacity: clamp(fill * 1.3 - (i % 16) / 64) })
      })
      fallingRef.current.forEach((n, i) => {
        const s = clamp((fill - i * 0.048) / 0.31)
        const x = 64 + ((i * 37) % 229)
        const y = lerp(-110 - (i % 3) * 12, 27, s)
        setAttrs(n, {
          transform: `translate(${x} ${y}) rotate(${s * 190 + i * 31})`,
          opacity: fill > i * 0.048 && s < 1 ? 0.95 : 0,
        })
      })

      const focus = segment(p, 0.52, 0.59) * (1 - segment(p, 0.7, 0.79))
      const wide = segment(p, 0.33, 0.48) * (1 - segment(p, 0.84, 0.95))
      const phoneFocus = 1 - segment(p, 0.1, 0.24)
      const vw = lerp(lerp(lerp(800, 1000, wide), 720, focus), 500, phoneFocus)
      const vx = lerp(lerp(lerp(440, 145, wide), 15, focus), 325, phoneFocus)

      if (mobile) {
        setAttrs(root, {
          viewBox: `${vx} ${lerp(100, 20, phoneFocus)} ${vw} ${lerp(510, 600, phoneFocus)}`,
        })
      } else {
        setAttrs(root, { viewBox: "0 0 1200 680" })
      }
    },
  }))

  return (
    <svg
      ref={sceneRef}
      className="core-scroll-scene"
      viewBox="0 0 1200 680"
      role="img"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={ids.metal} x2="0" y2="1">
          <stop stopColor="#d5dedc" />
          <stop offset=".25" stopColor="#808f90" />
          <stop offset=".5" stopColor="#d5dfde" />
          <stop offset="1" stopColor="#727f7e" />
        </linearGradient>
        <radialGradient id={ids.rubber}>
          <stop offset=".65" stopColor="#333a3c" />
          <stop offset=".8" stopColor="#141a1b" />
          <stop offset=".95" stopColor="#242d2c" />
          <stop offset="1" stopColor="#0f1716" />
        </radialGradient>
        <linearGradient id={ids.armPaint} x2="1" y2="1">
          <stop stopColor="#336e55" />
          <stop offset=".5" stopColor="#1b503e" />
          <stop offset="1" stopColor="#113729" />
        </linearGradient>
        <linearGradient id={ids.phoneMetal}>
          <stop stopColor="#aebeb2" />
          <stop offset=".4" stopColor="#e7ede5" />
          <stop offset="1" stopColor="#577168" />
        </linearGradient>
        <linearGradient id={ids.glass} x2="1" y2="1">
          <stop stopColor="#fff" />
          <stop offset="1" stopColor="#e9f1e3" />
        </linearGradient>
        <filter id={ids.shadow} x="-.5" y="-1" width="2" height="3">
          <feGaussianBlur stdDeviation="9" />
        </filter>
        <filter id={ids.phoneShadow} x="-.5" y="-.25" width="2" height="1.6">
          <feDropShadow dx="0" dy="22" stdDeviation="22" floodColor="#214633" floodOpacity=".13" />
        </filter>
        <clipPath id={ids.opening}>
          <polygon points="31,19 309,19 326,32 13,32" />
        </clipPath>
        <g id={ids.wheel}>
          <circle r="39" fill={`url(#${ids.rubber})`} />
          <circle r="35" fill="none" stroke="#49524f" strokeWidth=".7" />
          <circle r="28" fill={`url(#${ids.metal})`} stroke="#35403c" strokeWidth="1.2" />
          <circle r="22" fill="#677675" stroke="#d1dbd4" strokeWidth="1" />
          <g fill="#202f2c">
            <ellipse cx="0" cy="-17" rx="3.3" ry="4" />
            <ellipse cx="0" cy="17" rx="3.3" ry="4" />
            <ellipse cx="17" cy="0" rx="4" ry="3.3" />
            <ellipse cx="-17" cy="0" rx="4" ry="3.3" />
            <ellipse cx="12" cy="12" rx="3.3" ry="4" transform="rotate(-45 12 12)" />
            <ellipse cx="-12" cy="12" rx="3.3" ry="4" transform="rotate(45 -12 12)" />
            <ellipse cx="12" cy="-12" rx="3.3" ry="4" transform="rotate(45 12 -12)" />
            <ellipse cx="-12" cy="-12" rx="3.3" ry="4" transform="rotate(-45 -12 -12)" />
          </g>
          <circle r="10" fill="#3d4d48" stroke="#a7b6ad" strokeWidth="1.2" />
          <circle r="5" fill="#5b6b63" />
        </g>
      </defs>

      <g id={`environment-${uid}`} opacity="0">
        <path d="M45 506 H1170" fill="none" stroke="#bbcdbb" strokeWidth="1" />
        <g fill="none" stroke="#8da38e" strokeWidth="1" opacity=".35">
          <path d="M48 518H72 M284 518H319 M647 518H676 M1018 518H1052" />
          <path
            d="M67 425V359L132 318L197 359V425 M87 425V365H175V425 M110 365V425 M151 365V425"
            opacity=".22"
          />
          <path
            d="M1015 425V350H1089V425 M1027 365H1037 M1066 365H1076 M1027 386H1037 M1066 386H1076"
            opacity=".22"
          />
        </g>
      </g>

      <ellipse
        id={`truck-shadow-${uid}`}
        cx="860"
        cy="508"
        rx="250"
        ry="11"
        fill="#284630"
        opacity="0"
        filter={`url(#${ids.shadow})`}
      />
      <ellipse
        id={`bin-shadow-${uid}`}
        cx="390"
        cy="508"
        rx="150"
        ry="9"
        fill="#284630"
        opacity="0"
        filter={`url(#${ids.shadow})`}
      />

      <g id={`truck-${uid}`} opacity="0">
        <g transform="translate(114 188)">
          <g id={`rear-wheel-${uid}`}>
            <use href={`#${ids.wheel}`} />
          </g>
        </g>
        <g transform="translate(411 188)">
          <g id={`front-wheel-${uid}`}>
            <use href={`#${ids.wheel}`} />
          </g>
        </g>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <image href={CHASSIS_SRC} width="520" height="221.8125" />
      </g>

      <g id={`rig-${uid}`} opacity="0">
        <path
          id={`hydraulic-${uid}`}
          stroke="#9aaba4"
          strokeWidth="7"
          fill="none"
          strokeLinecap="round"
        />
        <path
          id={`arm-${uid}`}
          stroke={`url(#${ids.armPaint})`}
          strokeWidth="17"
          fill="none"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <circle id={`joint-${uid}`} r="8" fill="#a2b2a8" stroke="#285b43" strokeWidth="3" />
        <path
          id={`chain-${uid}`}
          stroke="#869b8b"
          strokeWidth="2.5"
          strokeDasharray="3 3"
          fill="none"
        />
        <circle id={`base-joint-${uid}`} r="10" fill="#82998b" stroke="#285b43" strokeWidth="4" />
      </g>

      <g id={`bin-${uid}`} opacity="0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <image href={BIN_SRC} width="340" height="115.812" />
        <g clipPath={`url(#${ids.opening})`}>
          <rect id={`fill-base-${uid}`} x="12" y="35" width="320" height="23" fill="#adb09f" />
          <g ref={fillRocksGroupRef} id={`fill-rocks-${uid}`} />
        </g>
        <g ref={fallingRocksGroupRef} id={`falling-rocks-${uid}`} />
      </g>

      <g
        id={`phone-${uid}`}
        transform="translate(435 55)"
        filter={`url(#${ids.phoneShadow})`}
      >
        <rect width="280" height="520" rx="42" fill={`url(#${ids.phoneMetal})`} />
        <rect x="4" y="4" width="272" height="512" rx="39" fill="#17352b" />
        <rect x="10" y="10" width="260" height="500" rx="33" fill={`url(#${ids.glass})`} />
        <rect x="98" y="17" width="85" height="21" rx="11" fill="#17352b" />
        <text x="30" y="37" fontSize="10" fill="#264a38">
          9:41
        </text>
        <path d="M237 29H249V36H237Z" stroke="#264a38" fill="none" />
        <path d="M233 36V30M228 36V32M223 36V34" stroke="#264a38" strokeWidth="2" />
        <text x="30" y="88" fill="#176047" fontSize="19" fontWeight="bold" letterSpacing="-1">
          CORE
        </text>
        <text x="30" y="120" fill="#788778" fontSize="9" letterSpacing="1.5">
          VOTRE PROJET COMMENCE ICI
        </text>
        <text x="30" y="157" fill="#1b3e31" fontSize="25" letterSpacing="-1">
          La bonne benne,
        </text>
        <text x="30" y="186" fill="#1b3e31" fontSize="25" letterSpacing="-1">
          au bon endroit.
        </text>
        <rect x="29" y="210" width="222" height="106" rx="14" fill="#e3ecdd" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <image href={BIN_SRC} x="61" y="227" width="156" height="53" />
        <text x="140" y="300" textAnchor="middle" fill="#4e6a54" fontSize="10">
          Un volume adapté à vos déchets
        </text>
        <text x="32" y="343" fontSize="9" fill="#6a7c6a">
          LIVRAISON
        </text>
        <path
          d="M37 366a6 6 0 1 1 9 0l-4.5 5Z"
          fill="none"
          stroke="#176047"
          strokeWidth="1.5"
        />
        <circle cx="41.5" cy="361.5" r="1.7" fill="#176047" />
        <text x="57" y="366" fontSize="12" fill="#244b38">
          À l’adresse de votre chantier
        </text>
        <path d="M30 382H250" stroke="#ccdac7" />
        <text x="31" y="404" fontSize="10" fill="#637960">
          Votre tarif avant le paiement
        </text>
        <rect x="28" y="425" width="224" height="48" rx="24" fill="#176047" />
        <rect id={`phone-fill-${uid}`} x="28" y="425" width="0" height="48" rx="24" fill="#3a7a4a" />
        <text id={`phone-button-${uid}`} x="140" y="454" textAnchor="middle" fill="#fff" fontSize="12">
          Choisir ma benne
        </text>
        <rect x="92" y="493" width="96" height="4" rx="2" fill="#b0bfa8" />
      </g>

      <g id={`confirmation-${uid}`} opacity="0">
        <circle cx="760" cy="420" r="36" fill="#d2e89d" />
        <path
          d="m745 420 10 10 20-23"
          stroke="#176047"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  )
})

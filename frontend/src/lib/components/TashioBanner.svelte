<script lang="ts">
	// TashioBanner — layered WebGL parallax banner (volcano bg + logo + Tashio).
	// Client-only: all WebGL setup runs in onMount, so it is SSR-safe.
	// Drop the art files into your site's static/ dir and pass their URLs as props.
	import { onMount } from 'svelte';

	interface Props {
		bgSrc?: string;
		logoSrc?: string;
		tashioSrc?: string;
		/** banner height, any CSS value */
		height?: string;
		/** top-third cloud drift, 0..1.5 */
		clouds?: number;
		/** bg chunk size in px, 1 = crisp */
		pixels?: number;
		/** posterize crunch, 0..1 */
		crunch?: number;
		/** bg crop window lift, 0..0.25 */
		frame?: number;
		/** bg darkness, 0.3..1 */
		bgDim?: number;
		/** parallax master, 0..2 */
		swagger?: number;
		/** tashio center-x, 0.45..1 */
		tashioX?: number;
		/** tashio height fraction, 0.8..1.5 */
		tashioSize?: number;
		cornerX?: number;
		cornerY?: number;
		cornerDark?: number;
		luteGlow?: boolean;
		ashPlume?: boolean;
		/** link the whole banner box out (target _blank, noopener noreferrer). Pass "" to disable. */
		href?: string;
		/** bg duotone experiment: 0 off, 1 red, 2 blue, 3 purple */
		tint?: number;
		/** duotone strength, 0..1 */
		tintAmt?: number;
		/** show the live tuning panel (sliders). Hide for production. */
		controls?: boolean;
	}

	let {
		bgSrc = '/banner/volcano.webp',
		logoSrc = '/banner/logo.webp',
		tashioSrc = '/banner/tashio.webp',
		height = '460px',
		clouds = 0.1,
		pixels = 4,
		crunch = 0.29,
		frame = 0.17,
		bgDim = 0.58,
		swagger = 1.0,
		tashioX = 0.72,
		tashioSize = 1.15,
		cornerX = 0.8,
		cornerY = 0.66,
		cornerDark = 0.85,
		luteGlow = true,
		ashPlume = true,
		href = 'https://steam.tashio.dev',
		tint = 3,
		tintAmt = 0.27,
		controls = false
	}: Props = $props();

	// Local tunable copy of the props. The render loop reads `s`, so the
	// panel below can drive the banner live; props act as initial values.
	let s = $state({
		clouds, pixels, crunch, frame, bgDim, swagger,
		tashioX, tashioSize, cornerX, cornerY, cornerDark,
		luteGlow, ashPlume, tint, tintAmt
	});

	let bannerEl: HTMLDivElement;
	let canvasEl: HTMLCanvasElement;
	let glError: string | null = $state(null);
	let ready = $state(false); // all art uploaded -> fade canvas in, fade placeholder out
	let savedMsg = $state('');
	// first-tap click suppression (iOS): the priming tap stays on the page for
	// the motion prompt; every later tap navigates natively (same-tab: no blank tab possible).
	let suppressNextClick = false;
	function handleLinkClick(e: MouseEvent) {
		if (suppressNextClick) {
			suppressNextClick = false;
			e.preventDefault();
		}
	}
	// motion-arming entry points both funnel here; the pill calls it on demand.
	let showMotionHint = $state(false);
	let armMotion: (() => void) | null = null;
	function retryMotion() {
		showMotionHint = false;
		armMotion?.();
	}
	const STORE_KEY = 'tashioBanner.settings.v3';
	const NUM_KEYS = ['clouds', 'pixels', 'crunch', 'frame', 'bgDim', 'swagger', 'tashioX', 'tashioSize', 'cornerX', 'cornerY', 'cornerDark', 'tint', 'tintAmt'] as const;

	function flash(msg: string) {
		savedMsg = msg;
		setTimeout(() => (savedMsg = ''), 1600);
	}

	/** persist current panel values as this browser's defaults */
	function saveSettings() {
		try {
			localStorage.setItem(STORE_KEY, JSON.stringify({ ...s }));
			flash('saved as defaults');
		} catch {
			flash('save failed');
		}
	}

	/** drop saved defaults and return to the code props */
	function resetSettings() {
		try {
			localStorage.removeItem(STORE_KEY);
		} catch {
			// ignore
		}
		s.clouds = clouds;
		s.pixels = pixels;
		s.crunch = crunch;
		s.frame = frame;
		s.bgDim = bgDim;
		s.swagger = swagger;
		s.tashioX = tashioX;
		s.tashioSize = tashioSize;
		s.cornerX = cornerX;
		s.cornerY = cornerY;
		s.cornerDark = cornerDark;
		s.luteGlow = luteGlow;
		s.ashPlume = ashPlume;
		s.tint = tint;
		s.tintAmt = tintAmt;
		flash('reset to props');
	}

	/** copy a locked-in <TashioBanner .../> snippet with current values */
	async function copyProps() {
		const snippet =
			`<TashioBanner\n` +
			`  bgSrc="${bgSrc}"\n` +
			`  logoSrc="${logoSrc}"\n` +
			`  tashioSrc="${tashioSrc}"\n` +
			`  height="${height}"\n` +
			`  clouds={${s.clouds.toFixed(2)}}\n` +
			`  pixels={${s.pixels.toFixed(0)}}\n` +
			`  crunch={${s.crunch.toFixed(2)}}\n` +
			`  frame={${s.frame.toFixed(2)}}\n` +
			`  bgDim={${s.bgDim.toFixed(2)}}\n` +
			`  swagger={${s.swagger.toFixed(2)}}\n` +
			`  tashioX={${s.tashioX.toFixed(2)}}\n` +
			`  tashioSize={${s.tashioSize.toFixed(2)}}\n` +
			`  cornerX={${s.cornerX.toFixed(2)}}\n` +
			`  cornerY={${s.cornerY.toFixed(2)}}\n` +
			`  cornerDark={${s.cornerDark.toFixed(2)}}\n` +
			`  luteGlow={${s.luteGlow}}\n` +
			`  ashPlume={${s.ashPlume}}\n` +
			`  href="${href}"\n` +
			`  tint={${s.tint.toFixed(0)}}\n` +
			`  tintAmt={${s.tintAmt.toFixed(2)}}\n` +
			`/>`;
		try {
			await navigator.clipboard.writeText(snippet);
			flash('props copied');
		} catch {
			flash('copy failed');
		}
	}

	const LOGO_POS_X = 0.18;
	const LOGO_POS_Y = 0.19;
	const LOGO_SCALE = 0.34;
	const TASHIO_POS_Y = 0.45;
	const IDLE_FREEZE_MS = 400; // fg motion halts fast after the mouse stops

	const VS = `
    attribute vec2 position;
    varying vec2 vUv;
    void main(){ vUv = position*0.5+0.5; gl_Position = vec4(position,0.,1.); }`;

	const NOISE = `
    float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453123); }
    float noise(vec2 p){
      vec2 i=floor(p), f=fract(p);
      vec2 u=f*f*(3.-2.*f);
      return mix(mix(hash(i),hash(i+vec2(1,0)),u.x), mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x), u.y);
    }
    float fbm(vec2 p){ float v=0.,a=.55; for(int i=0;i<4;i++){ v+=a*noise(p); p=p*2.02+7.; a*=.5; } return v; }
    float bayer4(vec2 c){
      int x = int(mod(c.x, 4.0));
      int y = int(mod(c.y, 4.0));
      int i = x + y*4;
      float t = 5.0;
      if (i==0) t=0.0; else if (i==1) t=8.0; else if (i==2) t=2.0; else if (i==3) t=10.0;
      else if (i==4) t=12.0; else if (i==5) t=4.0; else if (i==6) t=14.0; else if (i==7) t=6.0;
      else if (i==8) t=3.0; else if (i==9) t=11.0; else if (i==10) t=1.0; else if (i==11) t=9.0;
      else if (i==12) t=15.0; else if (i==13) t=7.0; else if (i==14) t=13.0;
      return (t + 0.5) / 16.0;
    }
  `;

	// PASS 1: volcano bg only, low-res buffer -> pixelated + crunched + darkened
	const FS_BG = `
    #extension GL_OES_standard_derivatives : enable
    precision highp float;
    varying vec2 vUv;
    uniform sampler2D uImage;
    uniform vec2 uImgSize;
    uniform float uAspect; // true canvas aspect — keeps cover-fit exact at any buffer size
    uniform float uTime, uParX, uParY, uAmt, uGlowOn, uSmokeOn, uCrunch, uFocus, uBgDim;
    uniform float uTintMode, uTintAmt; // bg duotone experiment: 0 off, 1 red, 2 blue, 3 purple
    uniform vec2 uSeed;
    ${NOISE}
    void main(){
      float t = uTime;
      float ca = uAspect;
      float ia = uImgSize.x / max(uImgSize.y,1.0);
      vec2 cuv;
      if (ca > ia) cuv = vec2(vUv.x, (vUv.y-0.5)*(ia/ca)+0.5+uFocus);
      else cuv = vec2((vUv.x-0.5)*(ca/ia)+0.5, vUv.y);

      vec2 imgUV = cuv + vec2(uParX*0.015, uParY*0.015);
      vec3 tex = texture2D(uImage, imgUV).rgb * uBgDim;

      // whole-image cloud/dapple layer (original mockup look), driven by the clouds slider
      float dappleAmt = clamp(uAmt / 1.2, 0.0, 1.0);
      vec2 luv = cuv + vec2(uParX*0.05, uParY*0.03);
      vec2 wind = vec2(t*0.03, t*0.008);
      float leaf = fbm(luv*vec2(9.0,9.0) + wind*0.7 + uSeed);
      float branch = fbm(luv*vec2(3.0,4.5) + wind*0.35 + uSeed.yx);
      float light = (leaf*0.6 + branch*0.4);
      float canopy = smoothstep(0.2,0.85, fbm(luv*1.4 + vec2(t*0.012, 3.7) + uSeed));
      light = light*0.65 + canopy*0.55;
      light = clamp((light-0.5)*1.35 + 0.52, 0.0, 1.0);
      float shade = mix(1.0, 0.55 + 0.85*light, dappleAmt);
      vec3 col = tex * shade;

      // warm fringe on light/shadow edges, follows the same slider
      float edge = fwidth(light);
      float goldMix = smoothstep(0.35,0.7,light) * smoothstep(0.004,0.05,edge);
      vec3 gold = vec3(0.91,0.60,0.22);
      col = mix(col, mix(col,gold,0.6)+gold*0.12, goldMix*0.7*dappleAmt);

      // daytime eruption plume (crater ~0.52, ~0.79, v=1 top)
      if (uSmokeOn > 0.5) {
        vec2 mouth = vec2(0.52, 0.79);
        float flick = 0.62 + 0.24*sin(t*7.0) + 0.14*sin(t*13.7+1.3);
        float h = imgUV.y - mouth.y;
        float colX = mouth.x + h*0.35 + 0.008*sin(t*0.9 + imgUV.y*14.0);
        float wdt = 0.018 + max(h, 0.0)*0.16;
        float dx = (imgUV.x - colX) / max(wdt, 1e-3);
        float column = exp(-dx*dx*1.6) * step(0.0, h) * (1.0 - smoothstep(0.10, 0.42, h));
        float n = fbm(vec2(imgUV.x*14.0, imgUV.y*5.0 - t*0.22) + uSeed + vec2(0.0, flick*0.15));
        float n2 = fbm(vec2(imgUV.x*30.0 + 5.0, imgUV.y*11.0 - t*0.45) + uSeed.yx);
        float dens = clamp(n*0.65 + n2*0.35 - (0.42 + 0.25*smoothstep(0.0, 0.35, h)), 0.0, 1.0);
        float plume = column * smoothstep(0.05, 0.5, dens + column*0.25);
        vec3 ashCold = vec3(0.42, 0.38, 0.36);
        vec3 ashHot  = vec3(1.10, 0.52, 0.12);
        vec3 ash = mix(ashHot, ashCold, smoothstep(0.0, 0.20, h));
        col = mix(col, ash * (0.55 + 0.45*light), clamp(plume*1.15, 0.0, 1.0)*0.7);
        float lip = exp(-pow(distance(imgUV, mouth)*30.0, 2.0));
        float core = exp(-pow(distance(imgUV, mouth + vec2(0.0,-0.008))*55.0, 2.0));
        col += vec3(1.0, 0.30, 0.06) * lip * (0.22 + 0.20*flick);
        col += vec3(1.0, 0.62, 0.20) * core * (0.45 + 0.28*flick);
        float spill = exp(-pow(distance(imgUV, mouth)*7.0, 2.0));
        col += vec3(0.55, 0.16, 0.04) * spill * (0.10 + 0.08*flick);
        for (int i = 0; i < 5; i++) {
          float fi = float(i);
          float sd = hash(vec2(fi*7.31, 3.7));
          float cyc = fract(t*(0.14 + sd*0.12) + sd*7.0);
          vec2 sp = vec2(mouth.x + (hash(vec2(fi, 9.1))-0.5)*0.03 + cyc*0.10 + 0.004*sin(t*3.0+fi*9.0),
                         mouth.y + cyc*0.30);
          float tw = 0.5 + 0.5*sin(t*(6.0+sd*8.0) + fi*17.0);
          float fade = (1.0-cyc)*(1.0-cyc);
          float d = distance(imgUV, sp);
          col += vec3(1.0, 0.45, 0.10) * exp(-d*d*9000.0) * fade * (0.18+0.28*tw);
        }
      }

      // sky cloud drift (top third only) — the clouds prop drives this, nothing else
      float sky = smoothstep(0.68, 0.95, vUv.y);
      float cl = fbm(cuv*2.0 + vec2(t*0.02, 0.0) + uSeed);
      float cl2 = fbm(cuv*4.5 + vec2(-t*0.015, t*0.006) + uSeed.yx);
      float clouds = (cl*0.65 + cl2*0.35 - 0.5) * sky * (0.15 + uAmt*0.45);
      col *= 1.0 + clouds;
      col += vec3(1.0, 0.85, 0.65) * max(clouds, 0.0) * 0.35;

      // monochromatic duotone experiment (bg only) — posterized by the crunch below
      if (uTintMode > 0.5) {
        float tl = clamp(dot(col, vec3(0.299, 0.587, 0.114)), 0.0, 1.0);
        vec3 tc = uTintMode < 1.5 ? vec3(1.0, 0.22, 0.12)
                : uTintMode < 2.5 ? vec3(0.25, 0.50, 1.0)
                :                   vec3(0.62, 0.30, 0.92);
        vec3 duo = mix(vec3(0.02, 0.01, 0.05), tc, pow(tl, 1.15));
        col = mix(col, duo, clamp(uTintAmt, 0.0, 1.0));
      }

      // --- bit-crunch: bg only ---
      float lum = dot(col, vec3(0.299, 0.587, 0.114));
      col = mix(vec3(lum), col, 1.0 + uCrunch*0.9);
      col = (col - 0.5) * (1.0 + uCrunch*0.55) + 0.5;
      float bayer = bayer4(gl_FragCoord.xy);
      float levels = mix(6.0, 2.0, uCrunch);
      vec3 q = floor(clamp(col, 0.0, 1.0) * levels + bayer) / levels;
      col = mix(col, q, clamp(uCrunch*1.15, 0.0, 1.0));
      gl_FragColor = vec4(col, 1.0);
    }`;

	// PASS 2: composite at full res — chunky bg + crisp logo/tashio
	const FS_COMP = `
    precision highp float;
    varying vec2 vUv;
    uniform sampler2D uBg;
    uniform sampler2D uLogo;
    uniform sampler2D uTashio;
    uniform vec2 uResolution;
    uniform vec2 uLogoSize, uTashioSize;
    uniform float uTime, uTimeBg, uParX, uParY, uGlowOn, uSwagger;
    uniform float uFgX, uFgY; // tashio's own fast-smoothed pointer (snappy stops)
    uniform vec3 uCorner;
    uniform vec2 uLogoPos;
    uniform float uLogoScale;
    uniform vec2 uTashioPos;
    uniform float uTashioScale;
    ${NOISE}
    vec4 sampleLayer(sampler2D tx, vec2 imgSize, vec2 pos, float s, vec2 parOff){
      float ca = uResolution.x / max(uResolution.y, 1.0);
      float la = imgSize.x / max(imgSize.y, 1.0);
      vec2 c = pos + parOff;
      vec2 luv = vec2((vUv.x - c.x) / (s*la/ca) + 0.5, (vUv.y - c.y) / s + 0.5);
      vec4 t = texture2D(tx, clamp(luv, 0.0, 1.0));
      float inside = step(0.0, luv.x)*step(luv.x, 1.0)*step(0.0, luv.y)*step(luv.y, 1.0);
      t.a *= inside;
      return t;
    }
    void main(){
      float t = uTime;
      float tBg = uTimeBg;
      float ca = uResolution.x / max(uResolution.y, 1.0);
      vec3 col = texture2D(uBg, vUv).rgb;

      // responsive reframe: 1 on narrow phones, 0 on desktop (blends across tablets)
      float narrow = 1.0 - smoothstep(0.9, 1.35, ca);
      float tashScaleEff = uTashioScale * mix(1.0, 0.55, narrow);
      vec2 tashPosEff = uTashioPos + vec2(mix(0.0, 0.03, narrow), mix(0.0, -0.20, narrow));
      float logoScaleEff = uLogoScale * mix(1.0, 0.65, narrow);
      vec2 logoPosEff = uLogoPos + vec2(mix(0.0, 0.08, narrow), 0.0);

      // tashio first (behind the logo bed)
      float breathe = sin(t*1.3+1.0);
      vec2 tashBob = vec2(0.004*sin(t*0.9), 0.008*breathe);
      float tashS = tashScaleEff*(1.0 + 0.008*breathe);
      vec2 tashOff = vec2(uFgX*0.060, uFgY*0.035)*uSwagger;
      vec4 ta = sampleLayer(uTashio, uTashioSize, tashPosEff + tashBob, tashS, tashOff);
      col = mix(col, ta.rgb, ta.a);

      // lute glow rides tashio's layer (sound-hole ~0.43, ~0.31 in his image space)
      if (uGlowOn > 0.5) {
        float tla = uTashioSize.x / max(uTashioSize.y, 1.0);
        vec2 tc = tashPosEff + tashBob + tashOff;
        vec2 tauv = vec2((vUv.x - tc.x) / (tashS*tla/ca) + 0.5, (vUv.y - tc.y) / tashS + 0.5);
        vec2 g = vec2(0.43, 0.31);
        float pulse = 0.5 + 0.5*sin(tBg*3.2);
        float d2 = dot(tauv-g, (tauv-g)*vec2(1.6,1.0));
        float inside = step(0.0,tauv.x)*step(tauv.x,1.0)*step(0.0,tauv.y)*step(tauv.y,1.0);
        col += vec3(1.0,0.82,0.45) * exp(-d2*90.0) * (0.18+0.45*pulse) * inside * ta.a;
      }

      // black feathered corner over bg AND tashio: the logo bed, always readable
      float corner = (1.0 - smoothstep(0.0, uCorner.x, vUv.x)) * (1.0 - smoothstep(0.0, uCorner.y, vUv.y));
      col = mix(col, vec3(0.0), corner*uCorner.z);

      // logo LAST: always front, crisp, untouched by scene lighting
      vec4 lg = sampleLayer(uLogo, uLogoSize, logoPosEff, logoScaleEff, vec2(0.0, 0.0));
      col = mix(col, lg.rgb, lg.a);

      gl_FragColor = vec4(col, 1.0);
    }`;

	onMount(() => {
		const canvas = canvasEl;
		const banner = bannerEl;
		// restore previously saved defaults (panel -> save as defaults)
		try {
			const raw = localStorage.getItem(STORE_KEY);
			if (raw) {
				const parsed: unknown = JSON.parse(raw);
				if (parsed && typeof parsed === 'object') {
					const p = parsed as Record<string, unknown>;
					for (const k of NUM_KEYS) {
						const v = p[k];
						if (typeof v === 'number' && Number.isFinite(v)) s[k] = v;
					}
					if (typeof p.luteGlow === 'boolean') s.luteGlow = p.luteGlow;
					if (typeof p.ashPlume === 'boolean') s.ashPlume = p.ashPlume;
				}
			}
		} catch {
			// storage unavailable — fall back to props
		}
		try {
		const gl = canvas.getContext('webgl', { antialias: true });
		if (!gl) throw new Error('WebGL context is null (webgl unavailable)');
		const ctx: WebGLRenderingContext = gl;
		ctx.getExtension('OES_standard_derivatives');
		ctx.pixelStorei(ctx.UNPACK_FLIP_Y_WEBGL, true);

		function compile(type: number, src: string) {
			const s = ctx.createShader(type)!;
			ctx.shaderSource(s, src);
			ctx.compileShader(s);
			if (!ctx.getShaderParameter(s, ctx.COMPILE_STATUS))
				throw new Error(ctx.getShaderInfoLog(s) ?? 'shader compile failed');
			return s;
		}
		function program(fsSrc: string) {
			const p = ctx.createProgram()!;
			ctx.attachShader(p, compile(ctx.VERTEX_SHADER, VS));
			ctx.attachShader(p, compile(ctx.FRAGMENT_SHADER, fsSrc));
			ctx.linkProgram(p);
			if (!ctx.getProgramParameter(p, ctx.LINK_STATUS))
				throw new Error(ctx.getProgramInfoLog(p) ?? 'program link failed');
			return p;
		}
		const bgProg = program(FS_BG);
		const compProg = program(FS_COMP);
		const U = (prog: WebGLProgram, n: string) => ctx.getUniformLocation(prog, n);
	const bu = {
		img: U(bgProg, 'uImage'), aspect: U(bgProg, 'uAspect'), size: U(bgProg, 'uImgSize'),
			time: U(bgProg, 'uTime'), px: U(bgProg, 'uParX'), py: U(bgProg, 'uParY'),
			amt: U(bgProg, 'uAmt'), glow: U(bgProg, 'uGlowOn'), smoke: U(bgProg, 'uSmokeOn'),
		seed: U(bgProg, 'uSeed'), crunch: U(bgProg, 'uCrunch'),
		focus: U(bgProg, 'uFocus'), bgdim: U(bgProg, 'uBgDim'),
		tintmode: U(bgProg, 'uTintMode'), tintamt: U(bgProg, 'uTintAmt')
	};
		const cu = {
			bg: U(compProg, 'uBg'), logo: U(compProg, 'uLogo'), tashio: U(compProg, 'uTashio'),
			res: U(compProg, 'uResolution'), lsize: U(compProg, 'uLogoSize'),
			tsize: U(compProg, 'uTashioSize'), time: U(compProg, 'uTime'),
		timebg: U(compProg, 'uTimeBg'), px: U(compProg, 'uParX'), py: U(compProg, 'uParY'),
		fgx: U(compProg, 'uFgX'), fgy: U(compProg, 'uFgY'),
		glow: U(compProg, 'uGlowOn'), swagger: U(compProg, 'uSwagger'),
			corner: U(compProg, 'uCorner'), lpos: U(compProg, 'uLogoPos'),
			lscale: U(compProg, 'uLogoScale'), tpos: U(compProg, 'uTashioPos'),
			tscale: U(compProg, 'uTashioScale')
		};

		const buf = ctx.createBuffer();
		ctx.bindBuffer(ctx.ARRAY_BUFFER, buf);
		ctx.bufferData(ctx.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), ctx.STATIC_DRAW);
		function bindQuad(prog: WebGLProgram) {
			ctx.useProgram(prog);
			const loc = ctx.getAttribLocation(prog, 'position');
			ctx.enableVertexAttribArray(loc);
			ctx.vertexAttribPointer(loc, 2, ctx.FLOAT, false, 0, 0);
		}

		const bgTex = ctx.createTexture();
		ctx.bindTexture(ctx.TEXTURE_2D, bgTex);
		ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.NEAREST);
		ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, ctx.NEAREST);
		ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_S, ctx.CLAMP_TO_EDGE);
		ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_T, ctx.CLAMP_TO_EDGE);
		const fbo = ctx.createFramebuffer();

		const seed: [number, number] = [Math.random() * 40, Math.random() * 40];
		let raf = 0;
		let tParX = 0, tParY = 0, parX = 0, parY = 0, fgX = 0, fgY = 0;
		// split clocks: volcano always breathes, foreground runs only while the mouse is active
		let lastMove = -1e9, clockBg = 0, clockFg = 0, lastNow = performance.now();
		function onMove(e: PointerEvent) {
			const r = canvas.getBoundingClientRect();
			tParX = ((e.clientX - r.left) / r.width - 0.5) * 2;
			tParY = ((e.clientY - r.top) / r.height - 0.5) * -2;
			lastMove = performance.now();
		}
		banner.addEventListener('pointermove', onMove);

		// --- gyroscope parallax (mobile): tilt drives the same targets as the mouse ---
		const TILT_RANGE = 20; // degrees of tilt for full deflection
		const TILT_DEAD = 1.5; // degrees of stillness around level
		let gyroBase: { x: number; y: number; angle: number } | null = null;
		let gyroGotData = false;
		function orientXY(beta: number, gamma: number, angle: number): [number, number] {
			if (angle === 90) return [beta, -gamma];
			if (angle === 270) return [-beta, gamma];
			if (angle === 180) return [-gamma, -beta];
			return [gamma, beta];
		}
		function onTilt(e: DeviceOrientationEvent) {
			if (e.beta == null || e.gamma == null) return;
			gyroGotData = true;
			const angle = (((screen.orientation?.angle ?? 0) % 360) + 360) % 360;
			const [x, y] = orientXY(e.beta, e.gamma, angle);
			if (!gyroBase || gyroBase.angle !== angle) {
				gyroBase = { x, y, angle }; // calibrate level on first read / rotation
				return;
			}
			const shape = (d: number) => {
				const m = Math.max(0, (Math.abs(d) - TILT_DEAD) / (TILT_RANGE - TILT_DEAD));
				return Math.max(-1, Math.min(1, m * Math.sign(d)));
			};
			tParX = -shape(x - gyroBase.x);
			tParY = shape(y - gyroBase.y);
			lastMove = performance.now();
		}
		let gyroOn = false;
		function enableGyro() {
			if (gyroOn || typeof DeviceOrientationEvent === 'undefined') return;
			if (!matchMedia('(pointer: coarse)').matches) return;
			window.addEventListener('deviceorientation', onTilt);
			gyroOn = true;
		}
		async function primeMotion() {
			try {
				const doe = DeviceOrientationEvent as unknown as {
					requestPermission?: () => Promise<string>;
				};
				if (typeof doe.requestPermission === 'function') {
					if ((await doe.requestPermission()) !== 'granted') {
						showMotionHint = true;
						return;
					}
				}
			} catch {
				showMotionHint = true;
				return;
			}
			enableGyro();
			// watchdog: granted but silent usually means the OS-level motion
			// toggle is off (iOS Settings -> Privacy -> Motion & Orientation).
			setTimeout(() => {
				if (!gyroGotData) showMotionHint = true;
			}, 3500);
		}
		if (matchMedia('(pointer: coarse)').matches && typeof DeviceOrientationEvent !== 'undefined') {
			const doe = DeviceOrientationEvent as unknown as {
				requestPermission?: () => Promise<string>;
			};
			// Android & co: no permission gate, tilt just works. iOS asks on
			// pointerdown — a valid gesture that never interferes with clicks.
			if (typeof doe.requestPermission !== 'function') {
				enableGyro();
			} else {
				armMotion = () => {
					void primeMotion();
				};
				let primed = false;
				const onPointerDown = () => {
					if (!primed) {
						primed = true;
						suppressNextClick = true;
						void primeMotion();
					} else {
						suppressNextClick = false;
					}
				};
				banner.addEventListener('pointerdown', onPointerDown);
			}
		}

		function makeTex() {
			const tex = ctx.createTexture();
			ctx.bindTexture(ctx.TEXTURE_2D, tex);
			ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_S, ctx.CLAMP_TO_EDGE);
			ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_T, ctx.CLAMP_TO_EDGE);
			ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.LINEAR);
			ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, ctx.LINEAR);
			return tex;
		}
		const texBg = makeTex(), texLogo = makeTex(), texTash = makeTex();
		let loadedCount = 0;
		const sizes: Record<string, [number, number]> = {};
		function load(src: string, tex: WebGLTexture | null, key: string, unit: number) {
			const img = new Image();
			img.onload = () => {
				ctx.activeTexture(ctx.TEXTURE0 + unit);
				ctx.bindTexture(ctx.TEXTURE_2D, tex);
				ctx.texImage2D(ctx.TEXTURE_2D, 0, ctx.RGBA, ctx.RGBA, ctx.UNSIGNED_BYTE, img);
				sizes[key] = [img.naturalWidth, img.naturalHeight];
				if (++loadedCount === 3) ready = true;
			};
			img.onerror = () => {
				const msg = `image failed to load: ${src}`;
				console.error('[TashioBanner]', msg);
				glError = glError ? `${glError}; ${msg}` : msg;
			};
			img.src = src;
		}
		// NOTE: reads props once at mount; changing src props remounts via {#key} in parent.
		load(bgSrc, texBg, 'bg', 0);
		load(logoSrc, texLogo, 'logo', 1);
		load(tashioSrc, texTash, 'tash', 2);

		const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
		let bgW = 0, bgH = 0;
		function resize() {
			const dpr = Math.min(devicePixelRatio || 1, 1.5);
			const w = Math.round(canvas.clientWidth * dpr), h = Math.round(canvas.clientHeight * dpr);
			if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
			const lw = Math.max(8, Math.round(canvas.clientWidth / s.pixels));
			// derive height from width so the buffer always matches the canvas aspect
			const lh = Math.max(8, Math.round((lw * canvas.clientHeight) / Math.max(1, canvas.clientWidth)));
			if (lw !== bgW || lh !== bgH) {
				bgW = lw; bgH = lh;
				ctx.bindTexture(ctx.TEXTURE_2D, bgTex);
				ctx.texImage2D(ctx.TEXTURE_2D, 0, ctx.RGBA, bgW, bgH, 0, ctx.RGBA, ctx.UNSIGNED_BYTE, null);
			}
		}
		function tick(now: number) {
			resize();
			if (loadedCount < 3) { raf = requestAnimationFrame(tick); return; }
			const dt = Math.min((now - lastNow) / 1000, 0.1); lastNow = now;
			if (!reduced) clockBg += dt;
			if (!reduced && now - lastMove < IDLE_FREEZE_MS) clockFg += dt;
			parX += (tParX - parX) * 0.25; parY += (tParY - parY) * 0.25;
		fgX += (tParX - fgX) * 0.6; fgY += (tParY - fgY) * 0.6;

			// PASS 1: chunky bg into the low-res buffer
			ctx.bindFramebuffer(ctx.FRAMEBUFFER, fbo);
			ctx.framebufferTexture2D(ctx.FRAMEBUFFER, ctx.COLOR_ATTACHMENT0, ctx.TEXTURE_2D, bgTex, 0);
			ctx.viewport(0, 0, bgW, bgH);
			bindQuad(bgProg);
			ctx.activeTexture(ctx.TEXTURE0); ctx.bindTexture(ctx.TEXTURE_2D, texBg);
			ctx.uniform1i(bu.img, 0);
			ctx.uniform1f(bu.aspect, canvas.width / Math.max(1, canvas.height));
			ctx.uniform2f(bu.size, sizes.bg[0], sizes.bg[1]);
			ctx.uniform1f(bu.time, clockBg);
			ctx.uniform1f(bu.px, parX); ctx.uniform1f(bu.py, parY);
			ctx.uniform1f(bu.amt, s.clouds);
			ctx.uniform1f(bu.glow, 0); ctx.uniform1f(bu.smoke, s.ashPlume ? 1 : 0);
			ctx.uniform1f(bu.crunch, s.crunch);
			ctx.uniform1f(bu.focus, s.frame);
			ctx.uniform1f(bu.bgdim, s.bgDim);
			ctx.uniform1f(bu.tintmode, s.tint); ctx.uniform1f(bu.tintamt, s.tintAmt);
			ctx.uniform2f(bu.seed, seed[0], seed[1]);
			ctx.drawArrays(ctx.TRIANGLE_STRIP, 0, 4);

			// PASS 2: composite at full res — crisp layers over chunky bg
			ctx.bindFramebuffer(ctx.FRAMEBUFFER, null);
			ctx.viewport(0, 0, canvas.width, canvas.height);
			bindQuad(compProg);
			ctx.activeTexture(ctx.TEXTURE3); ctx.bindTexture(ctx.TEXTURE_2D, bgTex);
			ctx.activeTexture(ctx.TEXTURE1); ctx.bindTexture(ctx.TEXTURE_2D, texLogo);
			ctx.activeTexture(ctx.TEXTURE2); ctx.bindTexture(ctx.TEXTURE_2D, texTash);
			ctx.uniform1i(cu.bg, 3); ctx.uniform1i(cu.logo, 1); ctx.uniform1i(cu.tashio, 2);
			ctx.uniform2f(cu.res, canvas.width, canvas.height);
			ctx.uniform2f(cu.lsize, sizes.logo[0], sizes.logo[1]);
			ctx.uniform2f(cu.tsize, sizes.tash[0], sizes.tash[1]);
			ctx.uniform1f(cu.time, clockFg);
			ctx.uniform1f(cu.timebg, clockBg);
			ctx.uniform1f(cu.px, parX); ctx.uniform1f(cu.py, parY);
		ctx.uniform1f(cu.fgx, fgX); ctx.uniform1f(cu.fgy, fgY);
			ctx.uniform1f(cu.glow, s.luteGlow ? 1 : 0);
			ctx.uniform1f(cu.swagger, s.swagger);
			ctx.uniform3f(cu.corner, s.cornerX, s.cornerY, s.cornerDark);
			ctx.uniform2f(cu.lpos, LOGO_POS_X, LOGO_POS_Y); ctx.uniform1f(cu.lscale, LOGO_SCALE);
			ctx.uniform2f(cu.tpos, s.tashioX, TASHIO_POS_Y); ctx.uniform1f(cu.tscale, s.tashioSize);
			ctx.drawArrays(ctx.TRIANGLE_STRIP, 0, 4);
			raf = requestAnimationFrame(tick);
		}
		raf = requestAnimationFrame(tick);

		return () => {
			cancelAnimationFrame(raf);
			banner.removeEventListener('pointermove', onMove);
			window.removeEventListener('deviceorientation', onTilt);
			armMotion = null;
			ctx.getExtension('WEBGL_lose_context')?.loseContext();
		};
		} catch (e) {
			const msg = e instanceof Error ? e.message : String(e);
			console.error('[TashioBanner]', msg);
			glError = msg;
		}
	});
</script>

<div class="tb-wrap">
	{#snippet bannerBox()}
		<div class="tb-banner" bind:this={bannerEl} style:height>
			<canvas bind:this={canvasEl} class:tb-hidden={!ready}></canvas>
			<div class="tb-placeholder" class:tb-hide={ready} aria-hidden="true"><div class="tb-shimmer"></div></div>
			{#if glError}
				<img class="tb-fallback" src={bgSrc} alt="" />
			{/if}
			<div class="tb-vignette"></div>
			{#if glError}
				<div class="tb-error">banner failed: {glError}</div>
			{/if}
		</div>
	{/snippet}
	<div class="tb-stage">
	{#if href}
		<a class="tb-link" {href} aria-label="Tashio Tempo on Steam" onclick={handleLinkClick}>{@render bannerBox()}</a>
	{:else}
		{@render bannerBox()}
	{/if}
	{#if showMotionHint}
		<div class="tb-motion-hint" role="status">
			<span>No motion yet — on iPhone turn on Settings → Privacy → Motion&nbsp;&amp;&nbsp;Orientation</span>
			<button type="button" onclick={retryMotion}>Try again</button>
			<button type="button" class="tb-x" onclick={() => (showMotionHint = false)} aria-label="Dismiss">×</button>
		</div>
	{/if}
	</div>
	{#if controls}
		<div class="tb-controls">
			<span class="tb-ctl"><label>clouds <input type="range" min="0" max="1.5" step="0.01" value={s.clouds} oninput={(e) => (s.clouds = +e.currentTarget.value)} /></label><b>{s.clouds.toFixed(2)}</b></span>
			<span class="tb-ctl"><label>pixels <input type="range" min="1" max="12" step="1" value={s.pixels} oninput={(e) => (s.pixels = +e.currentTarget.value)} /></label><b>{s.pixels.toFixed(0)}</b></span>
			<span class="tb-ctl"><label>crunch <input type="range" min="0" max="1" step="0.01" value={s.crunch} oninput={(e) => (s.crunch = +e.currentTarget.value)} /></label><b>{s.crunch.toFixed(2)}</b></span>
			<span class="tb-ctl"><label>frame <input type="range" min="0" max="0.25" step="0.01" value={s.frame} oninput={(e) => (s.frame = +e.currentTarget.value)} /></label><b>{s.frame.toFixed(2)}</b></span>
			<span class="tb-ctl"><label>bg <input type="range" min="0.3" max="1" step="0.01" value={s.bgDim} oninput={(e) => (s.bgDim = +e.currentTarget.value)} /></label><b>{s.bgDim.toFixed(2)}</b></span>
			<span class="tb-ctl"><label>swagger <input type="range" min="0" max="2" step="0.01" value={s.swagger} oninput={(e) => (s.swagger = +e.currentTarget.value)} /></label><b>{s.swagger.toFixed(2)}</b></span>
			<span class="tb-ctl"><label>tashio x <input type="range" min="0.45" max="1" step="0.01" value={s.tashioX} oninput={(e) => (s.tashioX = +e.currentTarget.value)} /></label><b>{s.tashioX.toFixed(2)}</b></span>
			<span class="tb-ctl"><label>tashio size <input type="range" min="0.8" max="1.5" step="0.01" value={s.tashioSize} oninput={(e) => (s.tashioSize = +e.currentTarget.value)} /></label><b>{s.tashioSize.toFixed(2)}</b></span>
			<span class="tb-ctl"><label>corner x <input type="range" min="0.3" max="1.2" step="0.01" value={s.cornerX} oninput={(e) => (s.cornerX = +e.currentTarget.value)} /></label><b>{s.cornerX.toFixed(2)}</b></span>
			<span class="tb-ctl"><label>corner y <input type="range" min="0.35" max="1" step="0.01" value={s.cornerY} oninput={(e) => (s.cornerY = +e.currentTarget.value)} /></label><b>{s.cornerY.toFixed(2)}</b></span>
			<span class="tb-ctl"><label>corner dark <input type="range" min="0.4" max="1" step="0.01" value={s.cornerDark} oninput={(e) => (s.cornerDark = +e.currentTarget.value)} /></label><b>{s.cornerDark.toFixed(2)}</b></span>
			<span class="tb-ctl"><label><input type="checkbox" checked={s.luteGlow} onchange={(e) => (s.luteGlow = e.currentTarget.checked)} /> lute glow</label></span>
			<span class="tb-ctl"><label><input type="checkbox" checked={s.ashPlume} onchange={(e) => (s.ashPlume = e.currentTarget.checked)} /> ash plume</label></span>
			<span class="tb-ctl"><label>tint <select value={s.tint} onchange={(e) => (s.tint = +e.currentTarget.value)}>
				<option value={0}>off</option>
				<option value={1}>red</option>
				<option value={2}>blue</option>
				<option value={3}>purple</option>
			</select></label></span>
			<span class="tb-ctl"><label>tint amt <input type="range" min="0" max="1" step="0.01" value={s.tintAmt} oninput={(e) => (s.tintAmt = +e.currentTarget.value)} /></label><b>{s.tintAmt.toFixed(2)}</b></span>
			<span class="tb-ctl tb-btns">
				<button type="button" onclick={saveSettings}>save as defaults</button>
				<button type="button" onclick={resetSettings}>reset</button>
				<button type="button" onclick={copyProps}>copy props</button>
				{#if savedMsg}<b class="tb-msg">{savedMsg}</b>{/if}
			</span>
		</div>
	{/if}
</div>

<style>
	.tb-banner {
		position: relative;
		width: 100%;
		overflow: hidden;
		background: #000;
	}
	.tb-banner canvas {
		width: 100%;
		height: 100%;
		display: block;
		opacity: 1;
		transition: opacity 0.6s ease;
	}
	.tb-banner canvas.tb-hidden {
		opacity: 0;
	}
	.tb-placeholder {
		position: absolute;
		inset: 0;
		overflow: hidden;
		background: linear-gradient(135deg, #141021 0%, #0e0b1e 55%, #1a1430 100%);
		opacity: 1;
		transition: opacity 0.6s ease;
		pointer-events: none;
	}
	.tb-placeholder.tb-hide {
		opacity: 0;
	}
	.tb-shimmer {
		position: absolute;
		inset: -50%;
		background: linear-gradient(
			100deg,
			transparent 30%,
			rgba(255, 255, 255, 0.06) 50%,
			transparent 70%
		);
		animation: tb-sweep 1.6s linear infinite;
	}
	@keyframes tb-sweep {
		from {
			transform: translateX(-25%);
		}
		to {
			transform: translateX(25%);
		}
	}
	.tb-fallback {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}
	.tb-vignette {
		position: absolute;
		inset: 0;
		pointer-events: none;
		background: radial-gradient(120% 90% at 50% 40%, transparent 55%, rgba(0, 0, 0, 0.45) 100%);
	}
	.tb-error {
		position: absolute;
		inset: auto 8px 8px 8px;
		background: rgba(120, 10, 10, 0.9);
		color: #fff;
		font: 12px/1.4 monospace;
		padding: 6px 8px;
		white-space: pre-wrap;
	}
	.tb-wrap {
		width: 100%;
	}
	.tb-stage {
		position: relative;
	}
	.tb-motion-hint {
		position: absolute;
		left: 50%;
		bottom: 12px;
		transform: translateX(-50%);
		display: flex;
		gap: 10px;
		align-items: center;
		max-width: min(92%, 560px);
		padding: 8px 12px;
		font: 12px/1.4 system-ui, sans-serif;
		color: #f2e8d8;
		background: rgba(14, 11, 30, 0.92);
		border: 1px solid #4a3f6e;
		border-radius: 999px;
		pointer-events: auto;
	}
	.tb-motion-hint button {
		font: inherit;
		font-size: 12px;
		padding: 3px 10px;
		cursor: pointer;
		color: #111;
		background: #e89a39;
		border: none;
		border-radius: 999px;
		white-space: nowrap;
	}
	.tb-motion-hint .tb-x {
		background: transparent;
		color: #f2e8d8;
		border: 1px solid #4a3f6e;
		padding: 0 8px;
	}
	.tb-link {
		display: block;
		text-decoration: none;
	}
	.tb-controls {
		display: flex;
		flex-wrap: wrap;
		gap: 8px 16px;
		align-items: center;
		margin-top: 10px;
		padding: 10px 12px;
		font: 12px/1.4 system-ui, sans-serif;
		color: #f2e8d8;
		background: #0e0b1e;
		border: 1px solid #2a2440;
	}
	.tb-controls label {
		display: flex;
		gap: 6px;
		align-items: center;
		white-space: nowrap;
	}
	.tb-controls input[type='range'] {
		width: 110px;
		accent-color: #e89a39;
	}
	.tb-controls select {
		font: inherit;
		font-size: 12px;
		color: #f2e8d8;
		background: #2a2440;
		border: 1px solid #4a3f6e;
		padding: 2px 4px;
	}
	.tb-controls b {
		font-weight: 600;
		min-width: 36px;
		font-variant-numeric: tabular-nums;
	}
	.tb-controls .tb-msg {
		color: #e89a39;
		min-width: 0;
	}
	.tb-controls button {
		font: inherit;
		font-size: 12px;
		padding: 3px 10px;
		cursor: pointer;
		color: #f2e8d8;
		background: #2a2440;
		border: 1px solid #4a3f6e;
	}
	.tb-controls button:hover {
		background: #3a3056;
	}
</style>

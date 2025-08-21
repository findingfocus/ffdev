<script lang="ts">
	import '../app.css';
	import { slide } from "svelte/transition";
	import { sineIn } from "svelte/easing";
	import { onMount } from 'svelte';
	import {page} from "$app/state";

	let { children } = $props();

	let currentPath = $derived(page.url.pathname);

	const slideParams = { delay: 150, duration: 350, easing: sineIn };

	// Start with hidden true, but we'll update on mount
	let hidden = $state(true);
	let dropdownOpen = $state(false);
	let isMobile = $state(true);

	onMount(() => {
		// Set initial state based on screen size
		isMobile = window.innerWidth < 768;
		hidden = isMobile; // Only hide on mobile initially

		// Optional: Add resize listener to update isMobile state
		const handleResize = () => {
			isMobile = window.innerWidth < 768;
		};

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	});

	function toggleMenu() {
		hidden = !hidden;
	}

	function handleNavClick() {
		if (isMobile) { // Only close on mobile
			hidden = true;
		}
	}

	function closeDropdown() {
		dropdownOpen = false;
	}
</script>

<div class="flex flex-col min-h-screen w-full relative overflow-hidden text-right">
	<img
			src="/images/sandias.png"
			alt="Sandias Mountains"
			class="fixed top-0 left-0 w-full h-screen object-cover bg-fixed bg-left bg-no-repeat z-0 brightness-[0.4] contrast-[1.1] saturate-[0.9]"/>
	<div class="mx-auto mt-0 z-15">
		<video class="mx-auto w-full max-w-full object-contain" preload="auto" playsinline autoplay loop muted>
			<source src="/video/Banner-HEVC.mov" type="video/mp4; codecs=hvc1">
			<source src="/video/Banner-VP9.webm" type="video/webm">
			Your browser does not support the video tag.
		</video>
		<div class="h-[0.2em] w-full bg-gradient-to-t from-[#2b4f6e] to-[#335b7f] md:hidden"></div>
	</div>

	<!-- Position the navbar separately -->
	<nav class="fixed md:sticky bottom-0 md:top-0 left-0 w-full z-20 text-white text-center bg-gradient-to-b from-[#496D8E] to-[#1e3a53] rounded md:rounded-none">
		<div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-0">
			<div class="ml-4 md:mx-12 text-[1.1em] font-['Arial']">Paul Thompson | Software Engineer</div>
<!--			<div></div> &lt;!&ndash; Empty div to push hamburger to right &ndash;&gt;-->
			<button
					aria-label="Toggle navigation menu"
					class="inline-flex items-center my-1 mx-1 w-10 h-10 justify-center text-sm text-[#a9c4de] rounded-lg md:hidden hover:bg-[#2d4d6e] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#496D8E] border-none float-right transition-colors duration-300"
					onclick={toggleMenu}
			>
				<svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
					<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15"/>
				</svg>
			</button>

			{#if !hidden || !isMobile}
				<div transition:slide={slideParams} class="w-full md:block md:w-auto transition-height duration-[450ms] ease-in-out">
					<ul class="font-medium flex flex-col mt-2 md:mt-0 md:flex-row md:space-x-0 md:mt-0 md:border-0">
						<li>
							<a href="/"
							   onclick={handleNavClick}
							   class="block pl-3 pr-4 text-gray-300 text-right leading-none text-[1.1em] font-['Arial'] p-2 md:p-4 hover:bg-white hover:text-black transition-all duration-600 {currentPath === '/' ? 'text-white' : ''}"
							>Home</a>
						</li>
						<li>
							<a href="/interactive-art"
							   onclick={handleNavClick}
							   class="block py-2 pl-3 pr-4 text-gray-300 text-right leading-none text-[1.1em] font-['Arial'] p-2 md:p-4 hover:bg-white hover:text-black transition-all duration-600 {currentPath === '/interactive-art' ? 'text-white' : ''}"
							>Interactive Art</a>
						</li>
					</ul>

				</div>
			{/if}
		</div>
	</nav>

	<main class="flex-1 relative mx-4 md:mx-10 lg:mx-20 mt-4 md:mt-8 pb-8 text-left text-white">
		{@render children()}
	</main>
</div>
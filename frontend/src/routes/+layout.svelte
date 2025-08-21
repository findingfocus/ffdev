<script lang="ts">
	import '../app.css';
	import { slide } from "svelte/transition";
	import { sineIn } from "svelte/easing";
	import { onMount } from 'svelte';

	let { children } = $props();

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
			class="fixed top-0 left-0 w-full h-screen object-cover bg-fixed bg-left bg-no-repeat z-0"
	/>

	<!-- Keep the video at the top -->
	<div class="mx-auto mt-0 z-15">
		<video class="mx-auto w-full md:mx-[50px] max-w-full max-h-full object-contain" preload="auto" playsinline autoplay loop muted>
			<source src="/video/Banner-HEVC.mov" type="video/mp4; codecs=hvc1">
			<source src="/video/Banner-VP9.webm" type="video/webm">
			Your browser does not support the video tag.
		</video>
	</div>

	<!-- Position the navbar separately -->
	<nav class="fixed md:sticky bottom-0 md:top-0 left-0 w-full z-20 text-white text-center bg-blue-950 rounded-xl">
		<div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
			<div></div> <!-- Empty div to push hamburger to right -->
			<button
					aria-label="Toggle navigation menu"
					class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-400 rounded-lg md:hidden hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 border-none float-right"
					onclick={toggleMenu}
			>
				<svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
					<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15"/>
				</svg>
			</button>

			{#if !hidden || !isMobile}
				<div transition:slide={slideParams} class="w-full md:block md:w-auto transition-height duration-[450ms] ease-in-out">
					<ul class="font-medium flex flex-col p-4 md:p-0 mt-4 rounded-lg md:flex-row md:space-x-8 md:mt-0 md:border-0">
						<li>
							<a href="/" onclick={handleNavClick} class="block py-2 pl-3 pr-4 text-white text-right leading-none text-[1.1em] font-['Arial'] p-2 md:p-4 rounded hover:bg-white hover:text-black transition-all duration-1000">Home</a>
						</li>
						<li>
							<a href="/interactive-art" onclick={handleNavClick} class="block py-2 pl-3 pr-4 text-white text-right leading-none text-[1.1em] font-['Arial'] p-2 md:p-4 rounded hover:bg-white hover:text-black transition-all duration-1000">Interactive Art</a>
						</li>
					</ul>
				</div>
			{/if}
		</div>
	</nav>

	<main class="flex-1 relative mx-4 md:mx-10 lg:mx-20 mt-4 md:mt-8 pb-8 text-left">
		{@render children()}
	</main>
</div>
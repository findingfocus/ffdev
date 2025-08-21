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


<div class="flex flex-col min-h-screen w-full relative overflow-hidden">
	<div class="fixed inset-0 bg-gradient-to-b from-slate-950 via-cyan-950 via-80% to-cyan-850 z-0"></div>
	<img
			src="/images/sandias.png"
			alt="Sandias Mountains"
			class="fixed top-0 left-0 w-full h-screen object-cover opacity-50 z-0"
	/>

	<div class="sticky top-0 md:top-4 mx-0 md:mx-10 lg:mx-20 z-15">
		<video class="img-fluid mx-auto" preload="auto" playsinline autoplay loop muted style="display:block;">
			<source src="/video/Banner-HEVC.mov" type="video/mp4; codecs=hvc1">
			<source src="/video/Banner-VP9.webm" type="video/webm">
			Your browser does not support the video tag.
		</video>

		<nav class="bg-white border-gray-200 dark:bg-cyan-950 rounded-xl">
			<div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
				<div></div> <!-- Empty div to push hamburger to right -->
				<button
						aria-label="Toggle navigation menu"
						class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
						onclick={toggleMenu}
				>
					<svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
						<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15"/>
					</svg>
				</button>

				{#if !hidden || !isMobile}
					<div transition:slide={slideParams} class="w-full md:block md:w-auto">
						<ul class="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
							<li>
								<a href="/" onclick={handleNavClick} class="block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500">Home</a>
							</li>
							<li>
								<a href="/interactive-art" onclick={handleNavClick} class="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Interactive Art</a>
							</li>
						</ul>
					</div>
				{/if}
			</div>
		</nav>

	</div>

	<main class="flex-1 relative mx-0 md:mx-10 lg:mx-20 mt-4 md:mt-8 pb-8">
		{@render children()}
	</main>
</div>
<script lang="ts">
	import '../app.css';
	import { slide } from "svelte/transition";
	import {linear} from "svelte/easing";
	import { onMount } from 'svelte';
	import {page} from "$app/state";

	let { children } = $props();

	let currentPath = $derived(page.url.pathname);

	const slideParams = { delay: 100, duration: 300, easing: linear };

	// Default collapsed state
	let menuOpen = $state(false);
	let isMobile = $state(true); // Assume mobile by default
	let mounted = $state(false);
	let isResizing = $state(false); // Track if changes are from resize

	onMount(() => {
		document.documentElement.style.backgroundColor = "#2b4f6e";
		document.body.style.backgroundColor = "#2b4f6e";
		// Check if we're on mobile
		isMobile = window.innerWidth < 768;

		// Set initial menu state based on screen size
		menuOpen = !isMobile;

		mounted = true;

		const handleResize = () => {
			isResizing = true;
			const wasMobile = isMobile;
			isMobile = window.innerWidth < 768;

			// When changing from mobile to desktop, open menu
			if (wasMobile && !isMobile) {
				menuOpen = true;
			}
			// When changing from desktop to mobile, close menu
			else if (!wasMobile && isMobile) {
				menuOpen = false;
			}

			// Reset resize flag after a short delay
			setTimeout(() => {
				isResizing = false;
			}, 50);
		};

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	});

	function toggleMenu() {
		menuOpen = !menuOpen;
	}

	function handleNavClick() {
		if (isMobile) {
			menuOpen = false;
		}
	}

	function handleVideoLoad() {
		document.getElementById('videoPlaceholder').style.display = 'none';
	}

</script>

<svelte:head>
	<style>
		/* Ensure the background color is set from the start */
		:root, html, body {
			background-color: #070F26;
		}
	</style>
</svelte:head>

<div class="flex flex-col min-h-screen w-full relative overflow-hidden text-right">
	<img
			src="/images/sandias.png"
			alt="Sandias Mountains"
			class="fixed top-0 left-0 w-full h-screen object-cover bg-fixed bg-left bg-no-repeat z-0 brightness-[0.4] contrast-[1.1] saturate-[0.9]"/>

	<!-- Video container with aspect ratio preservation -->
	<div class="mx-auto mt-0 z-15 w-full">
		<!-- Container with aspect ratio placeholder that maintains space -->
		<div class="relative w-full max-w-[1100px] mx-auto" style="aspect-ratio: 5/1;">
			<img
					src="/images/MATRIX001.png"
					id="videoPlaceholder"
					class="absolute top-0 left-0 w-full h-full object-cover"
					alt="Video preview"
			/>

			<!-- Video positioned absolutely to fill the container -->
			<video
					class="absolute top-0 left-0 w-full h-full object-cover"
					preload="auto"
					playsinline
					autoplay
					loop
					muted
			>
				<source src="/video/Banner-HEVC.mov" type="video/mp4; codecs=hvc1">
				<source src="/video/Banner-VP9.webm" type="video/webm">
				Your browser does not support the video tag.
			</video>
		</div>
		<div class="h-[0.2em] w-full bg-gradient-to-t from-[#2b4f6e] to-[#335b7f] md:hidden"></div>
	</div>

<!--	NAVBAR-->
	<nav class="fixed md:sticky bottom-0 md:top-0 left-0 w-full z-20 text-white bg-gradient-to-b from-[#496D8E] to-[#1e3a53] rounded md:rounded-none">
		<div class="max-w-screen-xl flex flex-wrap items-center justify-between">
			<div class="ml-4 md:mx-12 text-[1.1em] font-['Arial'] md:hidden">Paul Thompson | Software Engineer</div>
			<!-- Mobile menu toggle button - only visible on mobile -->
			<button
					aria-label="Toggle navigation menu"
					class="inline-flex items-center my-1 mx-1 w-10 h-10 justify-center text-sm text-[#a9c4de] rounded-lg md:hidden hover:bg-[#2d4d6e] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#496D8E] border-none float-right transition-colors duration-300"
					onclick={toggleMenu}
			>
				<svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
					<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15"/>
				</svg>
			</button>

			<!-- Desktop menu (always visible, no animation) -->
			<div class="hidden md:block md:w-auto ml-10 lg:ml-20">
				<ul class="font-medium flex flex-col md:flex-row md:space-x-0 md:mt-0 md:border-0">
					<li>
						<a href="/"
						   class="block pl-3 pr-4 text-gray-300 text-right leading-none text-[1.1em] font-['Arial'] p-2 md:p-4 hover:bg-white hover:text-black transition-all duration-600 {currentPath === '/' ? 'text-white' : ''}"
						>Home</a>
					</li>
					<li>
						<a href="/interactive-art"
						   class="block pr-4 md:p-4 text-gray-300 text-right leading-none text-[1.1em] font-['Arial'] hover:bg-white hover:text-black transition-all duration-600 {currentPath === '/interactive-art' ? 'text-white' : ''}"
						>Interactive Art</a>
					</li>
					<li>
						<a href="/programming"
						   class="block pr-4 md:p-4 text-gray-300 text-right leading-none text-[1.1em] font-['Arial'] hover:bg-white hover:text-black transition-all duration-600 {currentPath === '/programming' ? 'text-white' : ''}"
						>Programming</a>
					</li>
					<li>
						<a href="/coding-streams"
						   class="block pr-4 md:p-4 text-gray-300 text-right leading-none text-[1.1em] font-['Arial'] hover:bg-white hover:text-black transition-all duration-600 {currentPath === '/coding-streams' ? 'text-white' : ''}"
						>Coding Streams</a>
					</li>
					<li>
						<a href="/contact"
						   class="block pr-4 md:p-4 text-gray-300 text-right leading-none text-[1.1em] font-['Arial'] hover:bg-white hover:text-black transition-all duration-600 {currentPath === '/contact' ? 'text-white' : ''}"
						>Contact Me</a>
					</li>
				</ul>
			</div>

			<!-- Mobile menu -->
			<div class="w-full md:hidden">
				{#if mounted && !isResizing}
					<!-- Animated mobile menu when not resizing -->
					{#if menuOpen}
						<div transition:slide={slideParams}>
							<ul class="font-medium flex flex-col mt-2">
								<li>
									<a href="/"
									   onclick={handleNavClick}
									   class="block py-3 pl-3 pr-4 text-gray-300 text-right leading-none text-[1.1em] font-['Arial'] p-2 hover:bg-white hover:text-black transition-all duration-600 {currentPath === '/' ? 'text-white' : ''}"
									>Home</a>
								</li>
								<li>
									<a href="/interactive-art"
									   onclick={handleNavClick}
									   class="block py-3 pl-3 pr-4 text-gray-300 text-right leading-none text-[1.1em] font-['Arial'] p-2 hover:bg-white hover:text-black transition-all duration-600 {currentPath === '/interactive-art' ? 'text-white' : ''}"
									>Interactive Art</a>
								</li>
								<li>
									<a href="/programming"
									   onclick={handleNavClick}
									   class="block py-3 pl-3 pr-4 text-gray-300 text-right leading-none text-[1.1em] font-['Arial'] p-2 hover:bg-white hover:text-black transition-all duration-600 {currentPath === '/programming' ? 'text-white' : ''}"
									>Programming</a>
								</li>
								<li>
									<a href="/coding-streams"
									   onclick={handleNavClick}
									   class="block py-3 pl-3 pr-4 text-gray-300 text-right leading-none text-[1.1em] font-['Arial'] p-2 hover:bg-white hover:text-black transition-all duration-600 {currentPath === '/coding-streams' ? 'text-white' : ''}"
									>Coding Streams</a>
								</li>
								<li>
									<a href="/contact"
									   onclick={handleNavClick}
									   class="block py-3 pl-3 pr-4 text-gray-300 text-right leading-none text-[1.1em] font-['Arial'] p-2 hover:bg-white hover:text-black transition-all duration-600 {currentPath === '/contact' ? 'text-white' : ''}"
									>Contact Me</a>
								</li>
							</ul>
						</div>
					{/if}
				{:else if mounted && isResizing}
					<!-- Non-animated mobile menu during resize -->
					{#if menuOpen}
						<div>
							<ul class="font-medium flex flex-col mt-2">
								<li>
									<a href="/"
									   onclick={handleNavClick}
									   class="block pl-3 pr-4 text-gray-300 text-right leading-none text-[1.1em] font-['Arial'] p-2 hover:bg-white hover:text-black transition-all duration-600 {currentPath === '/' ? 'text-white' : ''}"
									>Home</a>
								</li>
								<li>
									<a href="/interactive-art"
									   onclick={handleNavClick}
									   class="block py-2 pl-3 pr-4 text-gray-300 text-right leading-none text-[1.1em] font-['Arial'] p-2 hover:bg-white hover:text-black transition-all duration-600 {currentPath === '/interactive-art' ? 'text-white' : ''}"
									>Interactive Art</a>
								</li>
							</ul>
						</div>
					{/if}
				{/if}
			</div>
		</div>
	</nav>

	<main class="flex-1 relative mx-4 md:mx-10 lg:mx-20 mt-2 md:mt-4 pb-8 text-left text-white">
		{@render children()}
	</main>
</div>
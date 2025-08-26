<script lang="ts">
	import '../app.css';
	import '../prism.css';
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

<div class="flex flex-col min-h-screen w-full relative overflow-hidden text-right z-0">
	<img
			src="/images/sandias.png"
			alt="Sandias Mountains"
			class="fixed top-0 left-0 w-full h-[105vh] object-cover bg-fixed bg-left bg-no-repeat z-0 inset-0 bg-[#0a1b4d]/60 mix-blend-multiply md:translate-y-0 -translate-y-18">
	<div class="absolute inset-0 bg-[#0a1b4d]/70"></div>
	<div class="fixed bottom-0 left-0 w-full h-[20vh] bg-gradient-to-t from-black to-transparent pointer-events-none z-10"></div>


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
			<div class="ml-4 md:mx-12 text-[1em] font-['Arial'] md:hidden">Paul Thompson | Software Engineer</div>
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
			<div class="hidden md:block md:w-auto ml-10 lg:ml-30">
				<ul class="font-medium flex flex-col md:flex-row md:space-x-0 md:mt-0 md:border-0">
					<li>
						<a href="/"
						   class="block pl-3 pr-4 text-[#9ca3af]/100 text-right leading-none text-[1em] font-['Arial'] p-2 md:p-4 hover:bg-white hover:text-black transition-all duration-600 {currentPath === '/' ? 'text-white' : ''}"
						>Home</a>
					</li>
					<li>
						<a href="/interactive-art"
						   class="block pr-4 md:py-4 md:px-3 text-[#9ca3af]/100 text-right leading-none text-[1em] font-['Arial'] hover:bg-white hover:text-black transition-all duration-600 {currentPath === '/interactive-art' ? 'text-white' : ''}"
						>Interactive Art</a>
					</li>
                    <li>
                        <a href="/programming"
                           class="block pr-4 md:py-4 md:px-3 text-[#9ca3af]/100 text-right leading-none text-[1em] font-['Arial'] hover:bg-white hover:text-black transition-all duration-600 {currentPath === '/programming' ? 'text-white' : ''}"
                        >Programming</a>
                    </li>
					<li>
						<a href="/coding-streams"
						   class="block pr-4 md:py-4 md:px-3 text-[#9ca3af]/100 text-right leading-none text-[1em] font-['Arial'] hover:bg-white hover:text-black transition-all duration-600 {currentPath === '/coding-streams' ? 'text-white' : ''}"
						>Coding Streams</a>
					</li>
					<li>
						<a href="/contact"
						   class="block pr-4 md:py-4 md:px-3 text-[#9ca3af]/100 text-right leading-none text-[1em] font-['Arial'] hover:bg-white hover:text-black transition-all duration-600 {currentPath === '/contact' ? 'text-white' : ''}"
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
									   class="block py-2.5 pl-3 pr-4 text-[#9ca3af]/100 text-right leading-none text-[1em] font-['Arial'] p-2 hover:bg-white hover:text-black transition-all duration-600 {currentPath === '/' ? 'text-white' : ''}"
									>Home</a>
								</li>
                                <li>
                                    <a href="/interactive-art"
                                       onclick={handleNavClick}
                                       class="block py-2.5 pl-3 pr-4 text-[#9ca3af]/100 text-right leading-none text-[1em] font-['Arial'] p-2 hover:bg-white hover:text-black transition-all duration-600 {currentPath === '/interactive-art' ? 'text-white' : ''}"
                                    >Interactive Art</a>
                                </li>
								<li>
									<a href="/programming"
									   onclick={handleNavClick}
									   class="block py-2.5 pl-3 pr-4 text-[#9ca3af]/100 text-right leading-none text-[1em] font-['Arial'] p-2 hover:bg-white hover:text-black transition-all duration-600 {currentPath === '/programming' ? 'text-white' : ''}"
									>Programming</a>
								</li>
								<li>
									<a href="/coding-streams"
									   onclick={handleNavClick}
									   class="block py-2.5 pl-3 pr-4 text-[#9ca3af]/100 text-right leading-none text-[1em] font-['Arial'] p-2 hover:bg-white hover:text-black transition-all duration-600 {currentPath === '/coding-streams' ? 'text-white' : ''}"
									>Coding Streams</a>
								</li>
								<li>
									<a href="/contact"
									   onclick={handleNavClick}
									   class="block py-2.5 pl-3 pr-4 text-[#9ca3af]/100 text-right leading-none text-[1em] font-['Arial'] p-2 hover:bg-white hover:text-black transition-all duration-600 {currentPath === '/contact' ? 'text-white' : ''}"
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
									   class="block pl-3 pr-4 text-gray-300 text-right leading-none font-['Arial'] p-2 hover:bg-white hover:text-black transition-all duration-600 {currentPath === '/' ? 'text-white' : ''}"
									>Home</a>
								</li>
								<li>
									<a href="/interactive-art"
									   onclick={handleNavClick}
									   class="block py-2.5 pl-3 pr-4 text-gray-300 text-right leading-none font-['Arial'] p-2 hover:bg-white hover:text-black transition-all duration-600 {currentPath === '/interactive-art' ? 'text-white' : ''}"
									>Interactive Art</a>
								</li>
							</ul>
						</div>
					{/if}
				{/if}
			</div>
		</div>
	</nav>

	<main class="flex-1 relative z-10">
		<div class="absolute inset-0 bg-[rgba(8,15,50,0.65)] mix-blend-multiply pointer-events-none -top[100vh] saturate-60"></div>
		<div class="relative z-10 mx-2.5 md:mx-12 lg:mx-30 mt-2 md:mt-4 mb-12 md:mb-0 text-left text-white">
			{@render children()}
		</div>
	</main>
    <footer class="bg-gradient-to-t from-black to-[rgba(8,15,50,0.65)] text-center w-full min-h-[64px] flex items-center justify-center z-10 md:z-30 pb-[60px] md:pb-0">
        <div class="flex justify-between items-center gap-5 px-4 py-3 w-full max-w-[360px] md:max-w-[400px] md:gap-8  md:px-0 md:py-4 ml-5 translate-y-3 md:translate-y-0">
            <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer" aria-label="YouTube Profile">
                <svg class="w-14 h-14 fill-white transition-colors duration-300 hover:fill-red-600" viewBox="0 0 24 24">
                    <path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.01 2.01 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.01 2.01 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31 31 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.01 2.01 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A100 100 0 0 1 7.858 2zM6.4 5.209v4.818l4.157-2.408z"/>
                </svg>
            </a>
            <a href="https://www.github.com/findingfocus" target="_blank" rel="noopener noreferrer" aria-label="GitHub Profile">
                <svg class="w-14 h-14 md:w-14 md:h-14 fill-white transition-colors duration-300 hover:fill-[#6CC644]" viewBox="0 0 24 24">
                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8"/>
                </svg>
            </a>
            <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn Profile">
                <svg class="w-14 h-14 md:w-14 md:h-14 fill-white transition-colors duration-300 hover:fill-[#4875B4]" viewBox="0 0 24 24">
                    <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z"/>
                </svg>
            </a>
            <a href="https://www.twitch.tv/findingfocusdev" target="_blank" rel="noopener noreferrer" aria-label="Twitch Profile">
                <svg class="w-14 h-14 md:w-14 md:h-14 fill-white transition-colors duration-300 hover:fill-[#6441a5]" viewBox="0 0 24 24">
                    <path d="M3.857 0 1 2.857v10.286h3.429V16l2.857-2.857H9.57L14.714 8V0zm9.714 7.429-2.285 2.285H9l-2 2v-2H4.429V1.143h9.142z"/>
                    <path d="M11.857 3.143h-1.143V6.57h1.143zm-3.143 0H7.571V6.57h1.143z"/>
                </svg>
            </a>
        </div>
    </footer>
</div>

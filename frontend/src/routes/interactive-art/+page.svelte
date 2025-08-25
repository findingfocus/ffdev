<script>
    import Tashio from '../../lib/components/Tashio.svelte';
    import {onMount} from "svelte";

    onMount(() => {
        // Create and load the Joust script
        const joustScript = document.createElement('script');
        joustScript.src = "/joust/joust.js";
        joustScript.onload = () => {
            console.log("Joust game loaded");
        };
        joustScript.onerror = (e) => console.error('Failed to load Joust:', e);
        document.body.appendChild(joustScript);
    });
</script>

<div class="md:grid md:grid-cols-2 md:gap-8 items-start mb-4">
    <div class="mb-6 md:mb-0">
        <h2 class="text-xl font-bold mb-2">Tashio Tempo</h2>
        <p class="text-base mb-4">
            Tashio Tempo is my new top-down game filled with adventure, magic, and music. The current version features geckos, bats, spell-casting abilities, and several screens to explore!
        </p>

        <!-- Controls panel for md+ screens (hidden on mobile) -->
        <div class="hidden md:block mt-4 text-center p-4 bg-gray-900 border border-blue-800/30 shadow shadow-blue-900/20 rounded-xl">
            <h3 class="font-bold mb-3 text-white">CONTROLS</h3>
            <div class="grid grid-cols-2 gap-2">
                <div class="text-blue-100 font-mono">'WASD'</div><div>DPAD</div>
                <div class="text-blue-100 font-mono">'P or SPACE'</div><div>A BUTTON</div>
                <div class="text-blue-100 font-mono">'O or SHIFT'</div><div>B BUTTON</div>
                <div class="text-blue-100 font-mono">'H'</div><div>SELECT BUTTON</div>
                <div class="text-blue-100 font-mono">'TAB'</div><div>START BUTTON</div>
            </div>
        </div>
    </div>

    <!-- Right column: Game embed -->
    <div class="flex flex-col items-center">
        <div class="w-full max-w-md">
            <Tashio />
        </div>

        <!-- Controls panel for mobile (hidden on md+) -->
        <div class="md:hidden mt-4 text-center p-4 bg-gray-900 border border-blue-800/30 shadow shadow-blue-900/20 rounded-xl w-full max-w-md">
            <h3 class="font-bold mb-3 text-white">CONTROLS</h3>
            <div class="grid grid-cols-2 gap-2">
                <div class="text-blue-100 font-mono">'WASD'</div><div>DPAD</div>
                <div class="text-blue-100 font-mono">'P or SPACE'</div><div>A BUTTON</div>
                <div class="text-blue-100 font-mono">'O or SHIFT'</div><div>B BUTTON</div>
                <div class="text-blue-100 font-mono">'H'</div><div>SELECT BUTTON</div>
                <div class="text-blue-100 font-mono">'TAB'</div><div>START BUTTON</div>
            </div>
        </div>
    </div>
</div>

<div class="md:grid md:grid-cols-2 md:gap-8 mt-6 md:mt-24">
    <!-- Left column: Game description -->
    <div class="mb-6 md:mb-0">
        <h2 class="text-xl font-bold mb-3">Joust</h2>
        <p class="text-base">
            My remake of the 1982 Williams Electronics game, Joust. Built in
            <a href="https://love2d.org" target="_blank" rel="noopener noreferrer" class="link">Love2d</a> with
            <a href="https://www.lua.org/" target="_blank" rel="noopener noreferrer" class="link">Lua</a>.
            My version comes with 25 waves of enemies, a two-player mode, and a leaderboard!
        </p>
    </div>

    <!-- Right column: Game video -->
    <div class="flex flex-col items-center w-full">
        <video playsinline autoplay muted loop class="w-full h-auto rounded-t-lg shadow-lg mb-0">
            <source src="/video/joust.webm" type="video/webm">
            <source src="/video/joust.mp4" type="video/mp4">
            Your browser does not support the video tag.
        </video>
        <div class="w-full bg-black mt-0 rounded-b-lg overflow-hidden shadow-lg">
            <canvas id="canvas2" width="500" height="120" class="w-full max-w-full h-auto"></canvas>
        </div>
    </div>
</div>
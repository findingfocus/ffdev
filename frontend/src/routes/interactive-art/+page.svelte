<script>
    import Tashio from '../../lib/components/Tashio.svelte';
    import {onMount} from "svelte";

    onMount(() => {
        // Set up title protection first
        const originalTitle = "Finding Focus";
        const observer = new MutationObserver((mutations) => {
            if (document.title !== originalTitle) {
                document.title = originalTitle;
            }
        });

        // Type-safe title element selection
        const titleElement = document.querySelector('title');
        if (titleElement) {
            observer.observe(titleElement, {
                childList: true,
                characterData: true,
                subtree: true
            });
        }

        const joustScript = document.createElement('script');
        joustScript.src = "/joust/joust.js";
        joustScript.onload = () => {
            console.log("Joust game loaded");
        };
        joustScript.onerror = (e) => console.error('Failed to load Joust:', e);
        document.body.appendChild(joustScript);

        return () => {
            observer.disconnect();
        };
    });
</script>

<svelte:head>
    <title>Finding Focus</title>
</svelte:head>

<div class="md:grid md:grid-cols-2 md:gap-8 items-start mb-4">
    <div class="md:mb-0">
        <h2 class="text-xl font-bold mb-2">Tashio Tempo</h2>
        <p class="text-base mb-4">
            <a href="https://www.github.com/findingfocus/tashio" target="_blank" rel="noopener noreferrer" class="link text-cyan-500 hover:text-cyan-400 transition duration-150">Tashio Tempo</a>
            is my new top-down game filled with adventure, magic, and music. The current version features geckos, bats, spell-casting abilities, and a dungeon to explore!
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

<div class="lg:grid lg:grid-cols-2 lg:gap-12 mt-6 lg:mt-24">
    <!-- Left column: Game description -->
    <div class="mb-6 lg:mb-0">
        <h2 class="text-xl font-bold mb-3">Joust</h2>
        <p class="text-base">
            My remake of the 1982 Williams Electronics game, Joust. Built in
            <a href="https://love2d.org" target="_blank" rel="noopener noreferrer" class="link text-cyan-500 hover:text-cyan-400 transition duration-150">Love2d</a> with
            <a href="https://www.lua.org/" target="_blank" rel="noopener noreferrer" class="link text-cyan-500 hover:text-cyan-400 transition duration-150">Lua</a>.
            My version comes with 25 waves of enemies, a two-player mode, and a leaderboard!
        </p>
    </div>

    <!-- For the video -->
    <div class="flex justify-center items-center mx-auto max-w-[500px]">
        <a
                href="https://github.com/findingfocus/joust.git"
                target="_blank"
                rel="noopener noreferrer"
                class="mt-2 block w-full rounded-lg overflow-hidden border-2 border-black hover:border-[#335b7f] transition-transform duration-300 hover:scale-[1.03] hover:shadow-lg"
        >
            <video playsinline autoplay muted loop class="w-[500px] max-w-full rounded-lg shadow-lg">
                <source src="/video/joust.webm" type="video/webm">
                <source src="/video/joust.mp4" type="video/mp4">
                Your browser does not support the video tag.
            </video>
        </a>

    </div>

    <!-- For the game canvas -->
    <div class="text-center mx-auto w-[500px] max-w-full rounded-lg lg:-mt-40">
        <canvas id="canvas2" width="500" height="120" class="w-full h-auto"></canvas>
    </div>
</div>


<div class="flex flex-wrap justify-center text-xs md:text-sm gap-3 md:gap-8 mt-8">
    <a
            href="https://github.com/findingfocus/joust/releases/download/v1.1/Joust_win32-v1.1.zip"
            target="_blank"
            rel="noopener noreferrer"
            title="Joust_win32-v1.1.zip"
            class="px-2 py-2 bg-[#335b7f] text-white rounded-xl hover:bg-[#2d4d6e] shadow-xl flex items-center space-x-2 border-0 border-black hover:border-[#434A73] transition-transform duration-300 hover:scale-[1.03] hover:shadow-lg"
    >
        <span>Download</span>
        <img class="h-3 w-3 md:w-4 md:h-4" src="images/icons/windows-icon.png" alt="Windows" title="Joust Windows Executable Download">
    </a>

    <a
            href="https://github.com/findingfocus/joust/releases/download/v1.1/Joust_osx-v1.1.zip"
            target="_blank"
            rel="noopener noreferrer"
            title="Joust_osx-v1.1.zip"
            class="px-2 py-2 bg-[#335b7f] text-white rounded-xl hover:bg-[#2d4d6e] shadow-xl flex items-center space-x-2 border-black border-0 hover:border-[#434A73] transition-transform duration-300 hover:scale-[1.03] hover:shadow-lg"
    >
        <span>Download</span>
        <img class="h-3 w-3 md:w-4 md:h-4" src="images/icons/apple-icon.png" alt="macOS" title="Joust MacOS Executable Download">
    </a>

    <a
            href="https://github.com/findingfocus/joust/releases/download/v1.1/Joust_linux-v1.1.tar.gz"
            target="_blank"
            rel="noopener noreferrer"
            title="Joust_linux-v1.1.tar.gz"
            class="px-2 py-2 bg-[#335b7f] text-white rounded-xl hover:bg-[#2d4d6e] shadow-xl flex items-center space-x-2 border-black border-0 hover:border-[#434A73] transition-transform duration-300 hover:scale-[1.03] hover:shadow-lg"
    >
        <span>Download</span>
        <img class="h-3 w-3 md:h-4 md:w-4" src="images/icons/linux-icon.png" alt="Linux" title="Joust Linux Executable Download">
    </a>
</div>

<h2 class="text-xl font-bold mb-3 mt-12">Tak: A Beautiful Game</h2>
<p>Tak is a board game from the novel "The Wise Man's Fear", created by James Ernest and Patrick Rothfuss. I programmed my own version of the game in Love2d and Lua. It is a competitive board game for two players, so grab a friend and let the game commence!</p>


<div class="flex justify-center items-center mx-auto mt-6">
    <a
            href="https://github.com/findingfocus/tak"
            target="_blank"
            rel="noopener noreferrer"
            class="mt-2 mx-auto max-w-[500px] block w-[500px] rounded-lg overflow-hidden border-2 border-black hover:border-[#335b7f] transition-transform duration-300 hover:scale-[1.01] hover:shadow-lg"
    >
        <video playsinline autoplay muted loop class="w-[500px] max-w-full rounded-lg shadow-lg">
            <source src="/video/tak.webm" type="video/webm">
            <source src="/video/tak.mp4" type="video/mp4">
            Your browser does not support the video tag.
        </video>
    </a>
</div>

<div class="flex flex-wrap justify-center gap-3 md:gap-12 mt-8 text-xs md:text-sm mb-8">
    <a
            href="https://github.com/findingfocus/tak/releases/download/v1.0/Tak_win32-v1.0.zip"
            target="_blank"
            rel="noopener noreferrer"
            title="Tak_win32-v1.0.zip"
            class="px-2 py-2 bg-[#335b7f] text-white rounded-xl hover:bg-[#2d4d6e] shadow-xl flex items-center space-x-2 border-0 border-black hover:border-[#434A73] transition-transform duration-300 hover:scale-[1.03] hover:shadow-lg"
    >
        <span>Download</span>
        <img class="h-3 w-3 lg:h-4 lg:w-4" src="images/icons/windows-icon.png" alt="Windows" title="Tak Windows Executable Download">
    </a>

    <a
            href="https://github.com/findingfocus/tak/releases/download/v1.0/Tak_osx-v1.0.zip"
            target="_blank"
            rel="noopener noreferrer"
            title="Tak_osx-v1.0.zip"
            class="px-2 py-2 bg-[#335b7f] text-white rounded-xl hover:bg-[#2d4d6e] shadow-xl flex items-center space-x-2 border-0 border-black hover:border-[#434A73] transition-transform duration-300 hover:scale-[1.03] hover:shadow-lg"
    >
        <span>Download</span>
        <img class="h-3 w-3 md:h-4 md:w-4" src="images/icons/apple-icon.png" alt="macOS" title="Tak MacOS Executable Download">
    </a>

    <a
            href="https://github.com/findingfocus/tak/releases/download/v1.0/Tak_linux-v1.0.tar.gz"
            rel="noopener noreferrer"
            type="button"
            title="Tak_linux-v1.0.tar.gz"
            class="px-2 py-2 bg-[#335b7f] text-white rounded-xl hover:bg-[#2d4d6e] shadow-xl flex items-center space-x-2 border-0 border-black hover:border-[#434A73] transition-transform duration-300 hover:scale-[1.03] hover:shadow-lg"
    >
        <span>Download</span>
        <img class="h-3 w-3 md:h-4 md:w-4" src="images/icons/linux-icon.png" alt="Linux" title="Tak Linux Executable Download">
    </a>
</div>
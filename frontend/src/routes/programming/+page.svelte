<script lang="ts">
    import { Card, Button } from "flowbite-svelte";

    // State for the bitrate calculator
    let hours = $state(0);
    let minutes = $state(0);
    let seconds = $state(0);
    let filesizeValue = $state(1024);
    let filesizeUnit = $state("MB");
    let filesize = $state(1024);
    let bitrateResult = $state("Bitrate is 0.00 Mbps");

    // Max values
    const MAX_HOURS = 5;
    const MAX_MINUTES = 59;
    const MAX_SECONDS = 59;
    const MAX_FILESIZE_MB = 200 * 1024; // 200GB in MB
    const MAX_FILESIZE_GB = 200; // 200GB

    // Watch for changes and recalculate
    $effect(() => {
        updateFilesize();
        calculateBitrate();
    });

    function updateFilesize() {
        if (filesizeUnit === "GB") {
            filesize = Math.min(filesizeValue * 1024, MAX_FILESIZE_MB);
        } else {
            filesize = Math.min(filesizeValue, MAX_FILESIZE_MB);
        }
    }

    function calculateBitrate() {
        let filesizeString = "Bitrate is ";

        let totalSeconds = (hours * 3600) + (minutes * 60) + seconds;
        let megabits = filesize * 8; // Convert MB to Mb
        let answer = 0;

        if (totalSeconds > 0) {
            answer = megabits / totalSeconds;
        }

        // Update the bitrateResult
        bitrateResult = filesizeString + answer.toFixed(2) + " Mbps";
    }

    function handleUnitChange() {
        // Convert the value when changing units to maintain the same actual filesize
        if (filesizeUnit === "GB") {
            filesizeValue = parseFloat((filesize / 1024).toFixed(2));
        } else {
            filesizeValue = Math.round(filesize);
        }
    }

    function isNumeric(evt: any) {
        const theEvent = evt || window.event;
        let key = theEvent.keyCode || theEvent.which;
        key = String.fromCharCode(key);

        // Allow decimal points for GB values
        const regex = filesizeUnit === "GB" ? /[0-9]|\./ : /[0-9]/;

        if (!regex.test(key)) {
            theEvent.preventDefault();
            return false;
        }
    }

    import Code from '$lib/components/Code.svelte';
    import trattelCode from '$lib/code/trattel.py?raw';
    import sonicPiCode from '$lib/code/sonicPi.rb?raw';
    import artistPrayerCode from '$lib/code/artistPrayer.c?raw';
</script>

<h2 class="text-xl font-bold mb-2">Saltomanga</h2>
<p>I developed a website to showcase artwork for <a class="text-cyan-500 hover:text-cyan-400 transition duration-150" href="https://saltomanga.com" target="_blank" rel="noopener noreferrer">Saltomanga</a></p>
<p>Built with SvelteKit 5, Tailwind, PostgreSQL, Nginx, and Docker. We now offer a sticker pack sold in the <a class="text-cyan-500 hover:text-cyan-400 transition duration-150" href="https://saltomanga.com/shop" target="_blank" rel="noopener noreferrer">shop</a></p>
<br>
<a
        href="https://saltomanga.com"
        target="_blank"
        rel="noopener noreferrer"
        class="block w-full rounded-lg overflow-hidden border-2 border-black hover:border-[#335b7f] transition-transform duration-300 hover:scale-[1.01] hover:shadow-lg"
>
    <img
            class="w-full rounded-lg"
            alt="Saltomanga website"
            src="https://res.cloudinary.com/dh8nskoaz/image/upload/v1756010386/saltomanga_lo6yyf.webp"
    >
</a>
<h2 class="text-xl font-bold mb-2 mt-6">No Concessions</h2>
<div class="flex flex-col md:flex-row gap-4">
    <div class="md:w-1/2">
        <p>I recently built and deployed a web application called <a class="text-cyan-500 hover:text-cyan-400 transition duration-150" href="https://noconcessions.xyz" target="_blank" rel="noopener noreferrer">No Concessions</a> that allows users to find new movies based on shared taste with other users.</p>
        <br>
        <p><a class="text-cyan-500 hover:text-cyan-400 transition duration-150" href="https://noconcessions.xyz" target="_blank" rel="noopener noreferrer">Create an account</a> to save movies to your watchlist and get new recommendations. Invite your friends and build out your taste profile.</p>
    </div>

    <div class="md:w-7/8">
        <div style="padding:56.25% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/1112629311?badge=0&amp;autoplay=1&amp:title=0&amp;app_id=58479&amp:quality=auto" frameborder="0" allow="web-share" referrerpolicy="strict-origin-when-cross-origin" style="position:absolute;top:0;left:0;width:100%;height:100%;" title="No Concessions - Make connections and get recommendations!"></iframe></div><script src="https://player.vimeo.com/api/player.js"></script>
    </div>
</div>
<h2 class="text-xl font-bold mb-2 mt-6">Comic Strip</h2>
<p>I host my comics on my art website <a class="text-cyan-500 hover:text-cyan-400 transition duration-150" href="https://findingfocus.art" target="_blank" rel="noopener noreferrer">findingfocus.art</a></p>
<p>The site is built using React, TypeScript, Tailwind, and Nginx with pm2 as the process manager. There are over 300 comics included and some are multi-panel and some are animated.</p>
<br>
<div class="flex flex-col md:flex-row gap-6 w-full">
    <a
            href="https://findingfocus.art/?comic=252"
            target="_blank"
            rel="noopener noreferrer"
            class="block w-full rounded-lg overflow-hidden border-2 border-black hover:border-[#335b7f] transition-transform duration-300 hover:scale-[1.02] hover:shadow-lg h-full"
    >
        <img
                class="w-full rounded-lg h-full"
                alt="Comic Strip - Be Prepared"
                src="https://res.cloudinary.com/dh8nskoaz/image/upload/v1756011953/2021-04-20_COMIC_BE-PREPARED_1of1_qhy4hn.webp"
        >
    </a>

    <a
            href="https://findingfocus.art/?comic=325"
            target="_blank"
            rel="noopener noreferrer"
            class="block w-full rounded-lg overflow-hidden border-2 border-black hover:border-[#335b7f] transition-transform duration-300 hover:scale-[1.02] hover:shadow-lg h-full"
    >
        <img
                class="w-full rounded-lg h-full"
                alt="Comic Strip - TMNT"
                src="https://res.cloudinary.com/dh8nskoaz/image/upload/v1756012133/2022-06-17_COMIC_TMNT_1of1_mdnlxs.webp"
        >
    </a>
</div>

<h2 class="text-xl font-bold mt-6 mb-2">Bitrate Calculator</h2>
Enter the duration and filesize of a video to calculate its bitrate with this web application. I use this for analyzing old videos and estimating filesizes for exports.
<br>
<Card class="mt-3 bg-gray-900 border border-blue-800/30 shadow shadow-blue-900/20 p-6 max-w-xl mx-auto rounded-xl mb-8">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div class="time-input">
            <label for="hourSlider" class="block mb-2 text-sm font-medium text-indigo-50">
                Hours: {hours}
            </label>
            <input
                    type="range"
                    id="hourSlider"
                    min="0"
                    max={MAX_HOURS}
                    step="1"
                    bind:value={hours}
                    class="slider-custom w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            >
        </div>

        <div class="time-input">
            <label for="minuteSlider" class="block mb-2 text-sm font-medium text-indigo-50">
                Minutes: {minutes}
            </label>
            <input
                    type="range"
                    id="minuteSlider"
                    min="0"
                    max={MAX_MINUTES}
                    step="1"
                    bind:value={minutes}
                    class="slider-custom w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            >
        </div>

        <div class="time-input">
            <label for="secondSlider" class="block mb-2 text-sm font-medium text-indigo-50">
                Seconds: {seconds}
            </label>
            <input
                    type="range"
                    id="secondSlider"
                    min="0"
                    max={MAX_SECONDS}
                    step="1"
                    bind:value={seconds}
                    class="slider-custom w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            >
        </div>
    </div>

    <div class="time-display mb-6 text-center text-xl font-semibold text-blue-100">
        <span>Total Duration:</span>
        {hours.toString().padStart(2, '0')}:{minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
    </div>

    <div class="filesize-input-group mb-6">
        <label for="filesizeInput" class="block mb-2 text-sm font-medium text-gray-200">Filesize:</label>
        <div class="flex items-center gap-2">
            <input
                    type="number"
                    id="filesizeInput"
                    onkeypress={isNumeric}
                    min="0"
                    max={filesizeUnit === "GB" ? MAX_FILESIZE_GB : MAX_FILESIZE_MB}
                    step={filesizeUnit === "GB" ? "0.01" : "1"}
                    bind:value={filesizeValue}
                    class="bg-gray-800 border border-gray-600 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#335b7f] focus:border-[#335b7f] block w-full p-2.5"
            >
            <select
                    bind:value={filesizeUnit}
                    onchange={handleUnitChange}
                    class="bg-gray-800 border border-gray-600 text-gray-200 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-[#335b7f] focus:border-[#335b7f] p-2.5"
            >
                <option value="MB">MB</option>
                <option value="GB">GB</option>
            </select>
        </div>
    </div>

    <div class="result-display rounded-lg text-center">
        <p class="text-lg font-semibold text-blue-100">{bitrateResult}</p>
    </div>
</Card>

<h2 class="text-xl font-bold mb-2">Video Worksheet Application</h2>
<p>I use this python program to format word document files, making it easier for videographers to do their job. The  <a class="text-cyan-500 hover:text-cyan-400 transition duration-150" href="https://trattel.xyz" target="_blank" rel="noopener noreferrer">application</a> is deployed using gunicorn as the WSGI, with Nginx as the web server.</p>
<Code language="python" code={trattelCode} />

<h2 class="text-xl font-bold mt-6 mb-2">SonicPi music for programming</h2>
<p>This is the ruby code for the soundtrack that backs my live programming streams.</p>
<Code language="ruby" code={sonicPiCode} />

<h2 class="text-xl font-bold mt-6 mb-2">Artist's Prayer in C</h2>
<p>This is a small C program that prints out a prayer that I wrote.</p>
<Code language="c" code={artistPrayerCode} />
<div class="mb-8"></div>

<style>
    /* Custom slider styling for larger thumb (the ball) */
    .slider-custom {
        -webkit-appearance: none;
        appearance: none;
        height: 8px;
        outline: none;
        border-radius: 8px;
        margin: 10px 0;
        width: 100%;
    }

    /* Chrome, Safari, Edge, Opera */
    .slider-custom::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 24px;
        height: 24px;
        background: #3b82f6; /* blue-500 */
        border-radius: 50%;
        cursor: pointer;
        border: 2px solid #1e293b;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
        margin-top: -8px; /* Better vertical alignment */
    }

    /* Firefox */
    .slider-custom::-moz-range-thumb {
        width: 24px;
        height: 24px;
        background: #3b82f6; /* blue-500 */
        border-radius: 50%;
        cursor: pointer;
        border: 2px solid #1e293b;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
    }

    /* Track styling */
    .slider-custom::-webkit-slider-runnable-track {
        height: 8px;
        border-radius: 8px;
        border: 0;
    }

    .slider-custom::-moz-range-track {
        height: 8px;
        border-radius: 8px;
        border: 0;
    }

    /* Focus styles */
    .slider-custom:focus {
        outline: none;
    }

    .slider-custom:focus::-webkit-slider-thumb {
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3); /* blue-500 with opacity */
    }

    .slider-custom:focus::-moz-range-thumb {
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3); /* blue-500 with opacity */
    }

    /* Remove browser default styling */
    .slider-custom::-ms-track {
        width: 100%;
        cursor: pointer;
        background: transparent;
        border-color: transparent;
        color: transparent;
    }

    /* Time input container for better alignment */
    .time-input {
        display: flex;
        flex-direction: column;
        width: 100%;
        padding: 0 5px;
    }
</style>

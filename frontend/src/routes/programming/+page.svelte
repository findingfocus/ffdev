<script lang="ts">
    import { Card, Button } from "flowbite-svelte";

    // State for the bitrate calculator
    let hours = $state(0);
    let minutes = $state(0);
    let seconds = $state(0);
    let filesizeValue = $state(1024);
    let filesizeUnit = $state("MB");
    let filesize = $state(1024);
    let bitrateResult = $state("Bitrate: 0.00 Mbps");

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
</script>


<h3><b>No Concessions</b></h3>
<p>I recently deployed a web application called <a class="text-cyan-500 hover:text-cyan-400" href="http://noconcessions.xyz" target="_blank" rel="noopener noreferrer">No Concessions</a> that allows users to find new movies based on shared taste with other users.</p>
<p>The application was built with React, TypeScript, Express, Tailwind, PostgreSQL, and Docker.</p>
<br>
<h3><b>Finding Focus Comic Strip</b></h3>
<p>I host my comics on my art website <a class="text-cyan-500 hover:text-cyan-400" href="https://findingfocus.art" target="_blank" rel="noopener noreferrer">findingfocus.art</a></p>
<p>The site is built using React, TypeScript, Tailwind, and Nginx with pm2 as the process manager. I have over 200 more comics still needing to be exported and added to the site.</p>
<br>
<h3><b>Bitrate Calculator</b></h3>
Enter the duration and filesize of a video to calculate its bitrate with this web application. I use this for analyzing old videos and estimating filesizes for exports.
<br>
<Card class="p-6 pt-3 max-w-xl mx-auto bg-gray-900 border border-blue-800/30 shadow shadow-blue-900/20 dark:bg-gray-900 dark:border-blue-800/20 mb-8 mt-4">
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

    <div class="time-display mb-6 text-center text-xl">
        <span class="font-semibold">Total Duration:</span>
        {hours.toString().padStart(2, '0')}:{minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
    </div>

    <div class="filesize-input-group mb-6">
        <label for="filesizeInput" class="block mb-2 text-sm font-medium text-indigo-50">Filesize:</label>
        <div class="flex items-center gap-2">
            <input
                    type="number"
                    id="filesizeInput"
                    onkeypress={isNumeric}
                    min="0"
                    max={filesizeUnit === "GB" ? MAX_FILESIZE_GB : MAX_FILESIZE_MB}
                    step={filesizeUnit === "GB" ? "0.01" : "1"}
                    bind:value={filesizeValue}
                    class="bg-gray-50 border border-gray-300 text-indigo-950 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            >
            <select
                    bind:value={filesizeUnit}
                    onchange={handleUnitChange}
                    class="bg-gray-50 border border-gray-300 text-indigo-950 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
            >
                <option value="MB">MB</option>
                <option value="GB">GB</option>
            </select>
        </div>
    </div>

    <div class="result-display p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
        <p class="text-lg font-semibold text-blue-900">{bitrateResult}</p>
    </div>
</Card>

<style>
    .slider-custom {
        -webkit-appearance: none;
        appearance: none;
        height: 10px;
        outline: none;
        border-radius: 10px;
        margin: 10px 0;
        width: 100%;
        background: #d1d5dc;
    }

    .slider-custom::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 24px;
        height: 24px;
        background: #3b82f6;
        border-radius: 50%;
        cursor: pointer;
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        margin-top: -8px;
    }

    .slider-custom::-moz-range-thumb {
        width: 24px;
        height: 24px;
        background: #3b82f6;
        border-radius: 50%;
        cursor: pointer;
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    .slider-custom::-webkit-slider-runnable-track {
        height: 10px;
        border-radius: 10px;
        background: #d1d5dc;
        border: 0;
    }

    .slider-custom::-moz-range-track {
        height: 10px;
        border-radius: 10px;
        background: #d1d5dc;
        border: 0;
    }

    .slider-custom:focus {
        outline: none;
    }

    .slider-custom::-ms-track {
        width: 100%;
        cursor: pointer;
        background: transparent;
        border-color: transparent;
        color: transparent;
    }

    .time-input {
        display: flex;
        flex-direction: column;
        width: 100%;
        padding: 0 5px;
    }
</style>
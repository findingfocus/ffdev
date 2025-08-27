<script>
    import { onDestroy, onMount } from 'svelte';
    import { beforeNavigate } from "$app/navigation";

    function preventContextMenu(event) {
        event.preventDefault();
    }

    onMount(() => {
        const basePath = "/tashio/";

        const loadingContext = document.getElementById('loadingCanvas').getContext('2d');

        window.drawLoadingText = function(text) {
            const canvas = loadingContext.canvas;
            loadingContext.fillStyle = "rgb(0, 0, 27)";
            loadingContext.fillRect(0, 0, canvas.scrollWidth, canvas.scrollHeight);
            loadingContext.font = '1.5em arial';
            loadingContext.textAlign = 'center';
            loadingContext.fillStyle = "rgb(11, 86, 117)";
            loadingContext.fillText(text, canvas.scrollWidth / 2, canvas.scrollHeight / 2);
            loadingContext.fillText("Powered By Emscripten.", canvas.scrollWidth / 2, canvas.scrollHeight / 4);
            loadingContext.fillText("Powered By LÖVE.", canvas.scrollWidth / 2, canvas.scrollHeight / 4 * 3);
        }

        window.onclick = function() { window.focus(); };

        window.addEventListener("keydown", function(e) {
            if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
                e.preventDefault();
            }
        }, false);

        window.Module = {
            arguments: ["game.love"],
            INITIAL_MEMORY: 20971520,
            printErr: function(text) {
                console.error('LÖVE Error:', text);
            },
            print: function(text) {
                console.log('LÖVE:', text);
            },
            canvas: (function() {
                const canvas = document.getElementById('canvas');
                return canvas;
            })(),
            locateFile: function(path, prefix) {
                console.log(`Locating file: ${path} with prefix: ${prefix}`);
                return basePath + path;
            },
            setStatus: function(text) {
                if (text) {
                    window.drawLoadingText(text);
                } else if (window.Module.remainingDependencies === 0) {
                    document.getElementById('loadingCanvas').style.display = 'none';
                    document.getElementById('canvas').style.visibility = 'visible';
                }
            },
            totalDependencies: 0,
            remainingDependencies: 0,
            monitorRunDependencies: function(left) {
                this.remainingDependencies = left;
                this.totalDependencies = Math.max(this.totalDependencies, left);
                window.Module.setStatus(left ? 'Preparing... (' + (this.totalDependencies-left) + '/' + this.totalDependencies + ')' : 'All downloads complete.');
            },
        };

        window.Module.setStatus('Downloading...');

        window.onerror = function(event) {
            console.error('Window error:', event);
            window.Module.setStatus('Exception thrown, see JavaScript console');
            window.Module.setStatus = function(text) {
                if (text) window.Module.printErr('[post-exception status] ' + text);
            };
        };

        window.applicationLoad = function() {
            try {
                console.log("Starting LÖVE engine...");
                window.Love(window.Module);
            } catch (error) {
                console.error('Error in Love initialization:', error);
            }
        }

        fetch(basePath + 'game.love')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                console.log("game.love fetch successful, getting array buffer...");
                return response.arrayBuffer();
            })
            .then(buffer => {
                console.log("game.love downloaded, size:", buffer.byteLength);
                loadScripts();
            })
            .catch(error => {
                console.error('Error fetching game.love:', error);
            });

        function loadScripts() {
            const gameScript = document.createElement('script');
            gameScript.src = basePath + "game.js";
            gameScript.onload = () => {
                console.log("game.js loaded");
                const loveScript = document.createElement('script');
                loveScript.src = basePath + "love.js";
                loveScript.onload = () => {
                    console.log("love.js loaded");
                    window.applicationLoad();
                };
                loveScript.onerror = (e) => console.error('Failed to load love.js:', e);
                document.body.appendChild(loveScript);
            };
            gameScript.onerror = (e) => console.error('Failed to load game.js:', e);
            document.body.appendChild(gameScript);
        }
    });

    // Log navigation for debugging
    beforeNavigate((navigation) => {
        console.log("Navigation detected, will refresh on destroy...", navigation);
    });

    // Refresh page on component destroy
    onDestroy(() => {
        console.log("Component destroying, refreshing page...");
        window.location.reload();
    });
</script>

<div class="flex flex-col items-center justify-center mx-auto my-0 max-h-[574px]">
    <canvas id="loadingCanvas" on:contextmenu={preventContextMenu} width="320" height="580" class="block translate-y-17"></canvas>
    <canvas id="canvas" class="invisible block my-0 p-0" on:contextmenu={preventContextMenu}></canvas>
</div>
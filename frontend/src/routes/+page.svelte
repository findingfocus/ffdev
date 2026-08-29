<script>
    import Link from '$lib/components/Link.svelte';
</script>

<h2 class="text-xl font-bold mb-2">About Me</h2>

<div class="flex flex-col items-center justify-center ml-4 float-right">
    <a href="https://www.linkedin.com/in/findingfocusdev/" target="_blank" rel="noopener noreferrer" title="Paul's Linked-In Profile">
        <!-- Image for mobile with placeholder background -->
        <div class="w-34 h-34 md:hidden bg-blue-950 rounded-xl">
            <img src="/images/headshot-square.webp" alt="Paul Thompson"
                 class="w-full h-full object-cover border-2 rounded-xl border-gray-800 hover:border-[#335b7f] hover:scale-[1.05] transition duration-300">
        </div>

        <!-- Image for desktop with placeholder background -->
        <div class="w-44 h-44 hidden md:block bg-blue-950 rounded-xl">
            <img src="/images/headshot-square.webp" alt="Paul Thompson"
                 class="w-full h-full object-cover border-2 rounded-xl border-gray-800 hover:border-[#335b7f] transition duration-300 hover:scale-[1.03]">
        </div>
    </a>
    <a href="/documents/resume.pdf" target="_blank" rel="noopener noreferrer">
        <button type="button" class="mt-2 px-3 py-2 bg-[#335b7f] text-white rounded-xl hover:bg-[#2d4d6e] border-0 border-black transition shadow-xl duration-300 hover:scale-[1.03]">View Resume</button>
    </a>
    <a href="https://github.com/findingfocus" target="_blank" rel="noopener noreferrer">
        <button type="button" class="mt-2 px-3 py-2 bg-green-700 text-white rounded-xl hover:bg-green-800 border-0 border-black transition shadow-xl duration-300 hover:scale-[1.03]">Github Portfolio</button>
    </a>
</div>


<p>
    My name is Paul Thompson, I am a <Link href="https://ideum.com/team/paul-thompson">hardware technician</Link> and <Link href="https://github.com/findingfocus">software developer</Link> focused on crafting interactive art experiences. I am currently programming <Link href="https://tashio.dev">Tashio Tempo</Link> live on <Link href="https://twitch.tv/findingfocusdev">Twitch</Link> and <Link href="https://youtube.com/findingfocus">Youtube</Link>.
</p>
<br>
<p>
    I believe there should be no barrier to entry in experiencing art. I host my game's <Link href="https://tashio.findingfocus.io">source code</Link> so that anyone can play on Linux, Mac, or Windows. Play the demo and wishlist the game now on <Link href="https://steam.tashio.dev">Steam</Link>.
</p>

<div class="mt-6"></div>

<h1 class="font-bold">Education and Certifications</h1>
<p class="italic">Bachelor of Fine Arts (BFA) in Film & Digital Arts</p>
<div class="mt-4"></div>
<p class="italic">Deep Dive Coding Bootcamp: Fullstack Web Development</p>

<div class="mx-auto text-center mt-5 max-w-2xl border-3 border-black hover:border-[#335b7f] transition-transform duration-300 hover:scale-[1.01] hover:shadow-lg">
    <a href="https://certifications.cnm.edu/certificate/d9358ee5c01351c4a8c1ec16d0eb7288" target="_blank">
        <img src="images/DeepDiveCertificate.webp" class="w-full" alt="Deep Dive Full Stack Blockchain Certificate">
    </a>
</div>

<div class="mt-8"></div>
<p class="italic">Harvard's CS50x: CS50's Introduction to Computer Science</p>
<div class="mx-auto text-center mt-5 max-w-2xl mb-8 border-2 border-black hover:border-[#335b7f] transition-transform duration-300 hover:scale-[1.01] hover:shadow-lg">
    <a href="https://courses.edx.org/certificates/eb843c36ff1d4bd5bfde1bbfdb9925b3">
        <img src="images/CS50xCertificate.png" class="w-full " alt="Deep Dive Full Stack Blockchain Certificate">
    </a>
</div>
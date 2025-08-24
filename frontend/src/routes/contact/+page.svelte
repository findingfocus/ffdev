<script lang="ts">
    import {Card} from "flowbite-svelte";
    import {ArrowRightOutline} from "flowbite-svelte-icons";

    let name = '';
    let email = '';
    let message = '';
    let status = '';
    let type = 'business';

    async function handleSubmit() {
        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, message, type })
            });

            const result = await response.json();

            if (result.success) {
                status = 'Message sent successfully!';
                name = '';
                email = '';
                message = '';
            } else {
                status = 'Failed to send message. Please try again some other year.';
            }
        } catch (error) {
            status = 'An error occurred. Please try again.';
        }
    }
</script>

<div class="md:mx-auto flex flex-col items-center justify-center gap-8 mt-3">
    <div class="flex items-center justify-center w-full">
        <Card class="bg-gray-900 border border-blue-800/30 shadow shadow-blue-900/20 dark:bg-gray-900 dark:border-blue-800/20 max-w-sm rounded-xl p-6 mb-8">
            <h5 class="mb-4 text-xl font-bold tracking-tight text-white">Get in Touch</h5>
            <p class="mb-2 font-normal text-gray-300 dark:text-gray-300 leading-relaxed">
                <span class="block">For business inquiries or general feedback about my work, I'd love to hear from you!</span>
            </p>
            <form on:submit|preventDefault={handleSubmit} class="mt-4 space-y-5">
                <div>
                    <select
                            bind:value={type}
                            class="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#335b7f] focus:border-[#335b7f] transition-all duration-200"
                    >
                        <option value="business">Business Inquiry</option>
                        <option value="feedback">General Feedback</option>
                    </select>
                </div>

                <div>
                    <input
                            type="text"
                            bind:value={name}
                            placeholder="Your Name"
                            required
                            class="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#335b7f] focus:border-[#335b7f] transition-all duration-200"
                    />
                </div>

                <div>
                    <input
                            type="email"
                            bind:value={email}
                            placeholder="Your Email"
                            required
                            class="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#335b7f] focus:border-[#335b7f] transition-all duration-200"
                    />
                </div>

                <div>
            <textarea
                    bind:value={message}
                    placeholder="Your Message"
                    required
                    rows="4"
                    class="resize-none w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#335b7f] focus:border-[#335b7f] transition-all duration-200"
            ></textarea>
                </div>

                <button
                        type="submit"
                        class="w-full bg-[#335b7f] text-white p-3 rounded-lg hover:bg-[#2d4d6e] focus:outline-none focus:ring-4 focus:ring-[#335b7f]/50 transition-all duration-200 font-medium flex items-center justify-center gap-2 shadow-xl"
                >
                    Send Message <ArrowRightOutline class="w-4 h-4" />
                </button>

                {#if status}
                    <p class="mt-4 text-center text-[#a3c5e6] bg-[#335b7f]/20 p-2 rounded-lg">{status}</p>
                {/if}
            </form>
        </Card>
    </div>
</div>
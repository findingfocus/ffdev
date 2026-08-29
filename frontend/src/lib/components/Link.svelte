<script lang="ts">
    let { href, children, ...rest } = $props();
</script>

<a {href} target="_blank" rel="noopener noreferrer" class="link" {...rest}>
    {@render children()}
</a>

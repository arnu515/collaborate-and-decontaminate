<script lang="ts">
    export let href: string;
    export let reloadPage = false;
</script>

{#if !reloadPage}
    <a {href} class="back-arrow">
        <i class="fas fa-arrow-left" />
    </a>
{:else}
    <span on:click={() => (window.location.href = href)} class="back-arrow">
        <i class="fas fa-arrow-left" />
    </span>
{/if}

<style>
    .back-arrow {
        position: absolute;
        top: 0.5rem;
        left: 0.5rem;
        color: white;
        opacity: 0.5;
        text-decoration: none;
        transition: 500ms ease opacity;
    }

    .back-arrow:hover {
        opacity: 1;
    }
</style>

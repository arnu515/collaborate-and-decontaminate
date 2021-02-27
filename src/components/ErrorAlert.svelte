<script lang="ts">
    export let message: string;
</script>

{#if message}
    <div
        class="w3-pale-red w3-border-red w3-text-red w3-panel w3-leftbar w3-border w3-border-red w3-padding"
    >
        {message}
    </div>
{/if}

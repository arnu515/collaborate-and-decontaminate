<script lang="ts">
    import axios from "axios";

    import { getContext, onMount } from "svelte";

    const apiUrl = getContext<string>("apiUrl");

    onMount(async () => {
        try {
            await axios.delete(apiUrl + "/api/auth/logout");
        } catch {
        } finally {
            window.location.href = "/";
        }
    });
</script>

<h1 class="w3-center w3-margin w3-xxxlarge w3-text-gray">Logging you out...</h1>

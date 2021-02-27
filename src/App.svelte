<script lang="ts">
    import { onMount, setContext } from "svelte";
    import page from "page";
    import { parse } from "qs";
    import axios from "axios";
    import Index from "./routes/index.svelte";
    import Login from "./routes/login.svelte";
    import type { Resp, User } from "./types/api";
    import { user } from "./util/stores";
    import Register from "./routes/register.svelte";
    import Chat from "./routes/chat.svelte";
    import Logout from "./routes/logout.svelte";

    export let apiUrl: string;

    axios.defaults.withCredentials = true;

    setContext("apiUrl", apiUrl);
    let component: any, params: any, query: any;
    let loading = true;

    function route(comp: any, path: string) {
        function setupRouteParams(ctx: PageJS.Context, next: any) {
            query = parse(ctx.querystring);
            params = ctx.params;

            next();
        }

        page(path, setupRouteParams, () => (component = comp));
    }

    route(Index, "/");
    route(Login, "/login");
    route(Register, "/register");
    route(Chat, "/chat");
    route(Logout, "/logout");
    page.start();

    onMount(async () => {
        try {
            const { data } = await axios.get<Resp<{ user: User }>>(
                apiUrl + "/api/auth/user"
            );
            $user = data.data.user;
        } catch (e) {
            $user = null;
        }

        loading = false;
    });
</script>

{#if !loading}
    <svelte:component this={component} {...{ query, params }} />
{:else}
    <p class="w3-margin w3-text-light-gray">Loading...</p>
{/if}

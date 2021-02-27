<script lang="ts">
    import { user } from "../util/stores";
</script>

<main>
    <header>
        <h1 class="w3-xxxlarge title">Collaborate and Decontaminate</h1>
        <p class="w3-xlarge tagline">
            Decontaminate the earth by collaborating with others!
        </p>
    </header>
    <section id="buttons">
        {#if $user}
            <a href="/chat" class="w3-button w3-white w3-hover-white" id="login"
                >Connect to a user</a
            >
            <a href="/logout" class="w3-button w3-white w3-hover-white"
                >Logout</a
            >
        {:else}
            <a
                href="/login"
                class="w3-button w3-white w3-hover-white"
                id="login">Login</a
            >
            <a
                href="/register"
                class="w3-button w3-white w3-hover-white"
                id="register">Register</a
            >
        {/if}
    </section>
    <footer>
        <a href="https://therelicans.com"> <i class="fas fa-question" /></a>
        <a href="https://github.com/arnu515/collaborate-and-decontaminate"
            ><i class="fab fa-github" /></a
        >
    </footer>
</main>

<style>
    main {
        background-color: #2ecc71;
        color: white;
        width: 100%;
        height: 100%;
        padding: 1.5rem;
        position: fixed;
    }

    header {
        display: flex;
        flex-direction: column;
        text-align: center;
    }

    header .title {
        font-weight: bolder;
    }

    section#buttons {
        display: flex;
        justify-content: center;
        gap: 1ch;
    }

    section#buttons a {
        border: 1px black solid;
        border-radius: 0.5rem;
    }

    footer {
        display: flex;
        padding: 0.5rem;
        justify-content: center;
        gap: 1ch;
        position: absolute;
        bottom: 1rem;
        width: 100%;
        font-size: 20px;
    }
</style>

<script lang="ts">
    import BackArrow from "../components/BackArrow.svelte";
    import ErrorAlert from "../components/ErrorAlert.svelte";
    import joi from "joi";
    import axios from "axios";
    import page from "page";
    import { getContext } from "svelte";
    import { user } from "../util/stores";
    import type { Resp, User } from "../types/api";

    let e = "";
    const apiUrl = getContext<string>("apiUrl");

    async function s() {
        let email = (document.getElementById("email") as HTMLInputElement)
            .value;
        let password = (document.getElementById("password") as HTMLInputElement)
            .value;
        let username = (document.getElementById("username") as HTMLInputElement)
            .value;

        const schema = joi.object({
            email: joi.string().email({ tlds: false }).required().max(2048),
            password: joi.string().min(8).max(128).required(),
            username: joi
                .string()
                .min(4)
                .max(32)
                .regex(/[\w_]+/)
                .required(),
        });

        const { value, error } = schema.validate({ email, password, username });

        if (error) {
            e = error.message;
        } else e = "";

        email = value.email;
        password = value.password;
        username = value.username;

        if (e) return;

        try {
            const { data } = await axios.post<
                Resp<{ user: User; token: string }>
            >(apiUrl + "/api/auth/register", {
                email,
                password,
                username,
            });

            $user = data.data.user;
            page.redirect("/");
        } catch (err) {
            console.error(err);
            e =
                err?.response?.data?.message ||
                "An unexpected error occured (" +
                    (err?.response?.status || 500) +
                    ")";
        }
    }
</script>

<svelte:head>
    <title>Register</title>
</svelte:head>

<main>
    <BackArrow href="/" />

    <header>
        <h1 class="w3-xxxlarge title">Register</h1>
    </header>

    <form on:submit|preventDefault={s}>
        <ErrorAlert message={e} />

        <p>
            <label for="email">Email</label>
            <input type="email" id="email" placeholder="Enter your email" />
        </p>
        <p>
            <label for="password">Password</label>
            <input
                type="password"
                id="password"
                placeholder="Enter your password"
            />
        </p>
        <p>
            <label for="username">Username</label>
            <input
                type="username"
                id="username"
                placeholder="Enter your username"
            />
        </p>
        <button
            class="w3-button w3-white w3-hover-white w3-border w3-border-black"
            style="width: 100%; border-radius: 0.4rem">Register</button
        >
        <p class="w3-center">
            <a href="/login" class="w3-text-white">or login</a>
        </p>
    </form>
</main>

<style>
    main {
        background-color: #1abc9c;
        padding: 1rem;
        position: fixed;
        width: 100%;
        height: 100%;
        color: white;
    }

    header {
        padding: 1rem;
        text-align: center;
    }

    h1.title {
        font-weight: bold;
    }
</style>

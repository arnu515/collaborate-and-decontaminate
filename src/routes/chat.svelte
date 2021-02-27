<script lang="ts">
    import {
        afterUpdate,
        beforeUpdate,
        getContext,
        onMount,
        tick,
    } from "svelte";
    import { io as socketIO } from "socket.io-client";
    import type { Socket } from "socket.io-client";
    import axios from "axios";
    import type { Resp, User } from "../types/api";
    import { user } from "../util/stores";
    import BackArrow from "../components/BackArrow.svelte";

    const apiUrl = getContext<string>("apiUrl");
    let loading = true;
    let io: Socket | null = null;
    let users: User[] | null = null;
    let remoteUser: User | null = null;
    let isRequesting = false;
    let messages: { self: boolean; message: string }[] = [];
    let chatMessage = "";
    let inCooldown: boolean;

    onMount(async () => {
        let token: string;
        try {
            const {
                data: {
                    data: { token: tkn },
                },
            } = await axios.get<Resp<{ token: string }>>(
                apiUrl + "/api/auth/token"
            );
            token = tkn;
        } catch (e) {
            if (e?.response?.status === 401) {
                window.location.assign("/login");
            } else {
                console.error(e);
                alert(
                    "An unexpected error occured. Check the console for more details."
                );
            }
        }

        io = socketIO(apiUrl + "/chat", { auth: { token } });

        io.on("error:connect", (error: Error | any) => {
            if (error?.data?.status === 401) window.location.assign("/login");
            else {
                console.error(error);
                alert(
                    "An unexpected error occured. Check the console for more details."
                );
            }
        });

        io.on(
            "users",
            (u: User[]) => (users = u.filter((u) => $user.id !== u.id))
        );

        io.on("new-user", (u: User) => {
            if (u.id === $user.id) return;

            users = [...users, u];
        });

        io.on("remove-user", (u: User) => {
            if (u.id === $user.id) return;

            users = users.filter((us) => us.id !== u.id);
        });

        io.on("chat-denied", () => {
            isRequesting = false;
            alert("Your chat request was denied.");
        });

        io.on("chat-accepted", (u: User) => {
            isRequesting = false;
            remoteUser = u;
        });

        io.on("chat-request", (u: User) => {
            const choice = confirm(
                `${u.username} wants to chat with you. Accept?`
            );

            if (choice) {
                io.emit("accept-chat-request", u.id);
                tick().then(() => (remoteUser = u));
            } else {
                io.emit("deny-chat-request", u.id);
            }
        });

        io.on("error:request-chat", (message: string) => alert(message));

        io.on("chat", (message: string) => {
            if (!message?.trim()) return;

            messages = [...messages, { self: false, message }];

            tick().then(() => {
                document.scrollingElement?.scrollTo(0, window.innerHeight * 15);
            });
        });

        io.on("user-left", () => {
            alert(`${remoteUser.username} left`);
            window.location.assign("/");
        });

        loading = false;
    });

    function requestChat(userId: number) {
        if (isRequesting)
            alert(
                "Please wait for your previous request to be either accepted or denied."
            );

        isRequesting = true;
        io.emit("request-chat", userId);
    }

    async function sendMessage(
        e: KeyboardEvent & {
            currentTarget: EventTarget & HTMLInputElement;
        }
    ) {
        if (e.key.toLowerCase() !== "enter") return;

        if (!io) return;

        if (!chatMessage?.trim()) return;

        if (inCooldown) return;

        io.emit("chat", chatMessage?.trim() || "no text");

        messages = [...messages, { self: true, message: chatMessage?.trim() }];

        chatMessage = "";

        inCooldown = true;
        setTimeout(() => (inCooldown = false), 3000);

        await tick();
        document.scrollingElement?.scrollTo(0, 1000000);
    }
</script>

<svelte:head>
    <title>Chat</title>
</svelte:head>

{#if loading}
    <p class="w3-margin w3-text-light-gray">loading...</p>
{:else if $user}
    <main>
        <BackArrow href="/" reloadPage />
        {#if users}
            {#if users.length === 0}
                <p class="w3-center w3-xlarge w3-margin">
                    No users are waiting yet
                </p>
            {:else if !remoteUser}
                <h1 class="w3-center">Choose a user</h1>
                <div class="users-list w3-margin">
                    {#each users as u}
                        <div
                            class="w3-card w3-white w3-hover-light-gray w3-border w3-border-gray w3-padding"
                            style="margin-bottom: 0.5rem; cursor: pointer"
                            on:click={() => requestChat(u.id)}
                        >
                            <h3>{u.username}</h3>
                        </div>
                    {/each}
                </div>
            {:else}
                <div class="chat-window">
                    <div class="messages">
                        <p class="w3-center w3-text-gray w3-large">
                            Chatting with {remoteUser.username}
                        </p>
                        {#each messages as message}
                            <p>
                                <strong
                                    class={message.self
                                        ? "w3-text-red"
                                        : "w3-text-blue"}
                                    >{message.self
                                        ? $user.username
                                        : remoteUser.username}:
                                </strong>
                                <span>{message.message}</span>
                            </p>
                        {/each}
                    </div>

                    <div class="input-leave">
                        <input
                            type="text"
                            class="chat-input"
                            placeholder={!inCooldown
                                ? "Enter message and press Enter"
                                : "3 second cooldown"}
                            bind:value={chatMessage}
                            on:keydown={sendMessage}
                            disabled={inCooldown}
                            class:cooldown={inCooldown}
                        />
                    </div>
                </div>
            {/if}
        {:else}
            <p class="w3-center w3-margin w3-text-gray">loading...</p>
        {/if}
    </main>
{/if}

<style>
    :global(.back-arrow) {
        color: black !important;
    }

    main {
        min-height: 100vh;
    }

    .messages {
        margin: 1rem;
        margin-bottom: 40px;
    }

    .input-leave {
        position: fixed;
        bottom: 0;
        width: 100%;
        display: flex;
        align-items: center;
    }

    .input-leave input {
        border-radius: 0;
        border: none;
        border-top: 1px solid gray;
        font-size: 20px;
    }

    .input-leave input.cooldown {
        border-color: red;
    }
</style>

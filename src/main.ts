import App from "./App.svelte";

declare const __app: { apiUrl: string };
const app = new App({
    target: document.body,
    props: {
        apiUrl: __app.apiUrl,
    },
});

export default app;

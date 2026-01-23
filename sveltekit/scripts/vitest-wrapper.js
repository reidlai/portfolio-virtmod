import { spawn } from "child_process";

// Run vitest with explicit process management for CI stability
console.log("> vitest run");
const vitest = spawn("npx", ["vitest", "run"], {
    stdio: "inherit",
    shell: true,
});

vitest.on("close", (code) => {
    console.log(`> Vitest closed with code ${code}`);
    // Force exit the wrapper process immediately.
    // This kills any lingering JSDOM/Node handles that might hang the CI runner.
    process.exit(code ?? 0);
});

vitest.on("error", (err) => {
    console.error("> Failed to start Vitest:", err);
    process.exit(1);
});

// Safety timeout: If it hangs for more than 5 minutes, kill it.
setTimeout(() => {
    console.error("> Vitest timed out after 5 minutes. Force killing...");
    vitest.kill("SIGKILL");
    process.exit(1);
}, 300000);

const { spawn } = require("child_process");
console.log("I am goint go be an add git to tag script");

(async () => {
    const spwned = spawn("git version ", {
        shell: true,
    });

    /**
     * @param {Buffer} chunk
     */
    const onData = (chunk) => {
        console.log(chunk.toString());
    };

    spwned.stdout.addListener("data", onData);
    spwned.stdout.addListener("close", (evt) => {
        console.log("cls", {evt});
    });
    spwned.stdout.addListener("end", (evt) => {
        console.log("end", {evt});
    });
    spwned.stdout.addListener("error", (evt) => {
        console.log("error", {evt});
    });
    spwned.stdout.addListener("resume", (evt) => {
        console.log("resume", {evt});
    });
    spwned.stderr.addListener("data", onData);

    console.log(spwned.eventNames());
})();

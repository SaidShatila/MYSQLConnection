mailchimp.setConfig({
    apiKey: "896dc5324071591660ad1ae39b9bc68a-us7",
    server: "us7",
});

async function run() {
    const response = await mailchimp.ping.get();
    console.log(response);
}

run();
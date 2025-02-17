<script>
    let counterValue = 0;

    async function increment() {
        const res = await fetch('/api/increment');
        const data = await res.json();
        counterValue = data.value;
    }
</script>

<main>
    <h1>Counter App</h1>
    <button on:click={increment}>Increment Counter</button>
    <p>Counter Value: {counterValue}</p>
</main>

<script lang="ts">
    let count = 0;

    async function increment() {
        try {
            const response = await fetch('/api/increment', {
                method: 'POST'
            });
            const data = await response.json();
            if (data.error) {
                console.error('Error:', data.error);
                return;
            }
            count = data.value;
        } catch (error) {
            console.error('Failed to increment:', error);
        }
    }
</script>

<h1>Counter: {count}</h1>
<button on:click={increment}>Increment</button>
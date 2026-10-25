<script lang="ts">
 let { value, label }: { value: string | number | null; label: string } = $props();
</script>
<option {value}>{label}</option>

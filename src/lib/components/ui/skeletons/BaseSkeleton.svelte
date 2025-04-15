<script lang="ts">
  let {
    width = 'full',
    height = 'auto',
    rounded = 'md',
    className = ''
  } = $props<{
    width?: string;
    height?: string;
    rounded?: string;
    className?: string;
  }>();
</script>

<div class="skeleton h-{height} w-{width} rounded-{rounded} {className}"></div>

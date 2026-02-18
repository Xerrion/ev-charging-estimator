<script lang="ts">
  import type { LayoutData } from '../$types';

  let { children, data } = $props<{
    children: any;
    data: LayoutData;
  }>();
</script>

<div class="container mx-auto px-4 py-8">
  {@render children()}
</div>

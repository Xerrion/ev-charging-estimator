<script lang="ts">
  import successIcon from '$lib/assets/icons/success.svg?raw';
  import infoIcon from '$lib/assets/icons/info.svg?raw';
  import warningIcon from '$lib/assets/icons/warning.svg?raw';
  import errorIcon from '$lib/assets/icons/error.svg?raw';
  import xIcon from '$lib/assets/icons/x.svg?raw';
  import { fade } from 'svelte/transition';

  type AlertType = 'info' | 'success' | 'warning' | 'error';
  type AlertStyle = 'default' | 'soft' | 'outline';

  let {
    type = 'info',
    style = 'default',
    message = '',
    className = '',
    dismissible = false,
    onDismiss = () => {}
  } = $props<{
    type?: AlertType;
    style?: AlertStyle;
    message?: string;
    className?: string;
    dismissible?: boolean;
    onDismiss?: () => void;
  }>();

  let visible = $state(true);
  let icon = $state('');

  $effect(() => {
    // Set icon based on alert type
    switch (type) {
      case 'success':
        icon = successIcon;
        break;
      case 'info':
        icon = infoIcon;
        break;
      case 'warning':
        icon = warningIcon;
        break;
      case 'error':
        icon = errorIcon;
        break;
    }
  });

  // Define style class based on the style prop
  let styleClass = $derived(() => {
    switch (style) {
      case 'soft':
        return 'alert-soft';
      case 'outline':
        return 'alert-outline';
      default:
        return '';
    }
  });

  function dismiss() {
    visible = false;
    onDismiss();
  }
</script>

{#if visible}
  <div transition:fade|global={{ duration: 200 }}>
    <div role="alert" class="alert alert-{type} {styleClass()} {className}">
      {@html icon}
      <span>{message}</span>
      {#if dismissible}
        <button class="btn btn-ghost btn-sm" onclick={dismiss}>
          {@html xIcon}
          <span class="sr-only">Dismiss</span>
        </button>
      {/if}
    </div>
  </div>
{/if}

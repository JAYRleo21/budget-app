import { ref, onUnmounted } from 'vue';

export default function useLongPress(callback, ms = 500) {
  const timeout = ref(null);
  const isLongPress = ref(false);
  const initialPosition = ref({ x: 0, y: 0 });
  const moveThreshold = 10; // pixels

  const start = (event) => {
    isLongPress.value = false;
    
    const isTouchEvent = event.type.startsWith('touch');
    const startX = isTouchEvent ? event.touches[0].clientX : event.clientX;
    const startY = isTouchEvent ? event.touches[0].clientY : event.clientY;
    initialPosition.value = { x: startX, y: startY };

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('touchmove', handleMove);
    
    timeout.value = setTimeout(() => {
      // Only prevent default and fire callback if it's a true long press
      event.preventDefault(); 
      isLongPress.value = true;
      callback(event);
      cleanup();
    }, ms);
  };

  const handleMove = (event) => {
    const isTouchEvent = event.type.startsWith('touch');
    const currentX = isTouchEvent ? event.touches[0].clientX : event.clientX;
    const currentY = isTouchEvent ? event.touches[0].clientY : event.clientY;

    const deltaX = Math.abs(currentX - initialPosition.value.x);
    const deltaY = Math.abs(currentY - initialPosition.value.y);

    if (deltaX > moveThreshold || deltaY > moveThreshold) {
      // Movement detected, so it's a drag, not a long press.
      cancel();
    }
  };

  const cancel = () => {
    clearTimeout(timeout.value);
    cleanup();
  };

  const cleanup = () => {
    document.removeEventListener('mousemove', handleMove);
    document.removeEventListener('touchmove', handleMove);
  };

  onUnmounted(() => {
    clearTimeout(timeout.value);
    cleanup();
  });

  return {
    start,
    cancel,
    isLongPress,
  };
}

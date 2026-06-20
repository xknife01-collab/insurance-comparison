/**
 * Smoothly scrolls to the element with the given ID and applies a temporary highlight effect.
 */
export const scrollToInputAndHighlight = (elementId: string) => {
  const element = document.getElementById(elementId);
  if (element) {
    // Scroll the target element to the center of the viewport smoothly
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Add temporary high-visibility Tailwind border ring classes
    element.classList.add('ring-4', 'ring-orange-500', 'ring-offset-2', 'transition-all', 'duration-500');
    
    // Remove the highlight effect after 2 seconds
    setTimeout(() => {
      element.classList.remove('ring-4', 'ring-orange-500', 'ring-offset-2');
    }, 2000);
  } else {
    console.warn(`[ScrollHelper] Element with ID "${elementId}" not found.`);
  }
};

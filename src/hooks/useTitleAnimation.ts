import { useEffect } from 'react';

export const useTitleAnimation = (text: string) => {
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let currentIndex = 0;
    let isDeleting = false;

    const animateTitle = () => {
      // Create a nice blinking cursor effect when at the start/end
      const cursor = '|';
      
      if (!isDeleting) {
        // Typing forward
        document.title = text.substring(0, currentIndex + 1) + cursor;
        currentIndex++;

        if (currentIndex === text.length) {
          isDeleting = true;
          // Pause when word is completely typed out
          timeoutId = setTimeout(animateTitle, 2000); 
          return;
        }
      } else {
        // Deleting backward
        document.title = text.substring(0, currentIndex - 1) + cursor;
        currentIndex--;

        if (currentIndex === 0) {
          isDeleting = false;
          // Pause when word is completely deleted
          timeoutId = setTimeout(animateTitle, 800); 
          return;
        }
      }

      // Varying typing / deleting speeds for realism
      const typingSpeed = isDeleting ? 75 : 150 + Math.random() * 50;
      timeoutId = setTimeout(animateTitle, typingSpeed);
    };

    // Start animation loop
    animateTitle();

    return () => clearTimeout(timeoutId);
  }, [text]);
};

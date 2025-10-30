document.addEventListener('DOMContentLoaded', () => {
    // Parallax effect (existing code)
    const parallaxSections = document.querySelectorAll('.parallax-section');

    window.addEventListener('scroll', () => {
        parallaxSections.forEach(section => {
            const speed = parseFloat(section.dataset.speed);
            const yPos = -window.scrollY * speed;
            section.style.transform = `translateY(${yPos}px)`;
        });
    });

    // Magazine Navigation
    const magazineSections = document.querySelectorAll('.magazine-section');
    const currentPages = {}; // Object to track current page for each section

    magazineSections.forEach(section => {
        const sectionId = section.id; // Assuming sections might have IDs later for targeting
        const pages = section.querySelectorAll('.page');
        if (pages.length > 0) {
            currentPages[sectionId] = 0; // Initialize to the first page
            // Initially hide all pages except the first one using the 'hidden' class
            pages.forEach((page, index) => {
                if (index !== 0) {
                    page.classList.add('hidden');
                }
            });
        }
    });

    // Function to navigate to a specific page within a section
    function goToPage(sectionId, pageIndex) {
        const section = document.getElementById(sectionId); // Assuming sectionId is the element ID
        if (!section) return;

        const pages = section.querySelectorAll('.page');
        if (pageIndex < 0 || pageIndex >= pages.length) {
             console.warn(`Page index ${pageIndex} out of bounds for section ${sectionId}`);
             return; // Prevent navigating out of bounds
        }

        // Hide the current page using the 'hidden' class
        const currentPageIndex = currentPages[sectionId];
        if (pages[currentPageIndex]) {
             pages[currentPageIndex].classList.add('hidden');
        }


        // Display the target page by removing the 'hidden' class
        pages[pageIndex].classList.remove('hidden');

        // Update the current page tracker
        currentPages[sectionId] = pageIndex;

        // Optional: Trigger animations or transitions here if not solely CSS based
    }

    // Placeholder event listeners for navigation (replace with actual buttons/swipes)
    // Example: Add buttons to your HTML and get references here
    // For demonstration, let's assume the first magazine section is visible and we add dummy buttons
    // In a real scenario, you'd need to link buttons to specific sections or the currently visible one.

    // Dummy navigation for the first magazine section
    const firstMagazineSection = magazineSections[0];
    if (firstMagazineSection) {
         const sectionId = firstMagazineSection.id || 'section1'; // Use a default or actual ID

         // Create dummy buttons for demonstration
         const nextButton = document.createElement('button');
         nextButton.textContent = 'Next Page (Dummy)';
         document.body.appendChild(nextButton); // Append to body for simplicity

         const prevButton = document.createElement('button');
         prevButton.textContent = 'Previous Page (Dummy)';
         document.body.appendChild(prevButton); // Append to body for simplicity


         nextButton.addEventListener('click', () => {
             const nextPage = currentPages[sectionId] + 1;
             goToPage(sectionId, nextPage);
         });

         prevButton.addEventListener('click', () => {
             const prevPage = currentPages[sectionId] - 1;
             goToPage(sectionId, prevPage);
         });
    }

    // Note: A more robust implementation would involve detecting which magazine section is currently in view
    // or linking navigation buttons specifically to a section.
});

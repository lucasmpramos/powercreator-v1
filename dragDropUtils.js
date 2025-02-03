// Utility functions for drag and drop events

/**
 * Handles the drag start event.
 * Adds a visual indicator and sets the dragging element's id.
 */
export function handleDragStart(event) {
    // Add a dragging class for styling feedback
    event.target.classList.add('dragging');
    // Pass the element id so it can be retrieved on drop
    event.dataTransfer.setData("text/plain", event.target.id);
}

/**
 * Handles the drag end event.
 * Removes the visual indicator.
 */
export function handleDragEnd(event) {
    // Remove the dragging class when dragging ends
    event.target.classList.remove('dragging');
}

/**
 * Handles the drag over event.
 * Prevents default to allow dropping and highlights the drop zone.
 */
export function handleDragOver(event) {
    event.preventDefault();
    // Optionally add visual feedback to the drop zone
    event.currentTarget.classList.add('dropzone');
}

/**
 * Handles the drag leave event.
 * Removes drop zone highlight when the element leaves the area.
 */
export function handleDragLeave(event) {
    event.currentTarget.classList.remove('dropzone');
}

/**
 * Handles the drop event.
 * Retrieves the dragged element and appends it.
 */
export function handleDrop(event) {
    event.preventDefault();
    event.currentTarget.classList.remove('dropzone');
    const id = event.dataTransfer.getData("text/plain");
    const draggableElement = document.getElementById(id);
    // Append the element to the new designated drop zone
    event.currentTarget.appendChild(draggableElement);
    // Optionally, notify the admin user about a successful drop
    console.log(`Element ${id} dropped successfully.`);
} 
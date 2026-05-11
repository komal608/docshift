/**
 * Logout Confirmation Dialog
 * This script adds a confirmation popup before logging out
 */

function confirmLogout(event) {
    event.preventDefault();
    
    // Create confirmation dialog
    const confirmation = confirm("Are you sure you want to log out?");
    
    if (confirmation) {
        // User clicked "Yes" - proceed with logout
        window.location.href = "/logout";
    }
    // If user clicked "No", the dialog closes and nothing happens
}

// Attach the confirmation handler to all logout links when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    const logoutLinks = document.querySelectorAll('a[href="/logout"]');
    logoutLinks.forEach(link => {
        link.addEventListener('click', confirmLogout);
    });
});

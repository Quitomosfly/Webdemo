document.addEventListener("DOMContentLoaded", function () {
    async function loadEventDetails() {
        const urlParams = new URLSearchParams(window.location.search);
        const eventId = urlParams.get("eventId");

        if (!eventId) {
            console.error("Missing eventId in URL.");
            alert("Event not found! Please check the link.");
            return;
        }

        console.log("Fetching event with ID:", eventId); // Debugging step

        try {
            const response = await fetch(`/events/${eventId}`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Could not fetch event data.");
            }

            const eventData = await response.json();
            document.getElementById("eventTitle").textContent = eventData.eventName;
            document.getElementById("eventSchedule").textContent = `Schedule Type: ${eventData.scheduleType}`;
            document.getElementById("eventTimeRange").textContent = `Time Range: ${eventData.timeRange}`;
            document.getElementById("eventSelectedDates").textContent = `Selected Dates: ${eventData.selectedDates?.join(", ") || "N/A"}`;
            document.getElementById("eventSelectedDays").textContent = `Selected Days: ${eventData.selectedDays?.join(", ") || "N/A"}`;
        } catch (error) {
            console.error("Error fetching event data:", error);
            alert("Failed to load event details: " + error.message);
        }
    }

    loadEventDetails();
});

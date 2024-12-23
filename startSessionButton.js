document.addEventListener('DOMContentLoaded', function() {
    function getLanIpAddress() {
        return fetch('/get-lan-ip')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => data.lanIpAddress)
            .catch(error => {
                console.error('Error fetching LAN IP:', error);
            });
    }

    getLanIpAddress().then(lanIpAddress => {
        if (!lanIpAddress) {
            console.error('LAN IP address not found');
            return;
        }

        const ws = new WebSocket(`ws://${lanIpAddress}:8080`);

        ws.onopen = function() {
            console.log('Connected to WebSocket server');
        };

        ws.onmessage = function(event) {
            try {
                const data = JSON.parse(event.data);
                console.log('Received:', data);
                // Update the UI based on the received data
                // Example: renderAreas(data.areasData);
            } catch (error) {
                console.error('Error parsing WebSocket message:', error);
            }
        };

        document.getElementById('startSessionButton').addEventListener('click', () => {
            fetch('/start-session', { method: 'POST' })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.success) {
                        const sessionLinkInput = document.getElementById('sessionLinkInput');
                        sessionLinkInput.value = data.lanUrl;

                        const sessionLinkModal = new bootstrap.Modal(document.getElementById('sessionLinkModal'));
                        sessionLinkModal.show();

                        document.getElementById('copySessionLinkButton').addEventListener('click', function() {
                            sessionLinkInput.select();
                            document.execCommand('copy');
                            alert('Link copied to clipboard');
                        });
                    } else {
                        alert('Failed to start session. Check the server.');
                    }
                })
                .catch(err => {
                    console.error('Error starting session:', err);
                });
        });

        // Example function to send data to the WebSocket server
        function sendDataToServer(data) {
            ws.send(JSON.stringify(data));
        }

        // Example usage: send data when an area is updated
        // sendDataToServer({ type: 'updateArea', areasData });
    });
});

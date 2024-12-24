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

    const createSessionLinkButton = document.getElementById('createSessionLinkButton');
    if (createSessionLinkButton) {
        createSessionLinkButton.addEventListener('click', () => {
            getLanIpAddress().then(lanIpAddress => {
                if (!lanIpAddress) {
                    console.error('LAN IP address not found');
                    return;
                }

                const sessionLinkInput = document.getElementById('sessionLinkInput');
                sessionLinkInput.value = `http://${lanIpAddress}:8080`;

                const sessionLinkModal = new bootstrap.Modal(document.getElementById('sessionLinkModal'));
                sessionLinkModal.show();
            });
        });
    } else {
        console.error('Element with ID "createSessionLinkButton" not found');
    }

    const startSessionButton = document.getElementById('startSessionButton');
    if (startSessionButton) {
        startSessionButton.addEventListener('click', () => {
            const lanIpAddress = document.getElementById('sessionLinkInput').value;
            if (!lanIpAddress) {
                console.error('LAN IP address not found');
                return;
            }

            fetch('/start-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ lanIpAddress })
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.success) {
                        alert('Session started successfully');

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

                        // Example function to send data to the WebSocket server
                        function sendDataToServer(data) {
                            ws.send(JSON.stringify(data));
                        }

                        // Example usage: send data when an area is updated
                        // sendDataToServer({ type: 'updateArea', areasData });
                    } else {
                        alert('Failed to start session. Check the server.');
                    }
                })
                .catch(err => {
                    console.error('Error starting session:', err);
                });
        });
    } else {
        console.error('Element with ID "startSessionButton" not found');
    }
});

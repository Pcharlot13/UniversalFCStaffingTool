document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('startSessionButton').addEventListener('click', () => {
        fetch('/start-session', { method: 'POST' })
            .then(response => response.json())
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
                alert('Error starting session. Check the server.');
            });
    });
});

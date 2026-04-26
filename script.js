document.addEventListener('DOMContentLoaded', () => {
    // 1. Fetch Dynamic Policies
    const policyContainer = document.getElementById('policy-display');
    const policyDbId = '91ed6a9d-02c6-442a-8c30-b058fffbb5ae';

    async function loadPolicies() {
        try {
            const response = await fetch(`https://stg-app.baget.ai/api/public/databases/${policyDbId}/rows`);
            if (!response.ok) throw new Error('Failed to fetch policies');
            
            const rows = await response.json();
            if (rows && rows.length > 0) {
                policyContainer.innerHTML = '';
                rows.forEach(row => {
                    const data = row.data;
                    const item = document.createElement('div');
                    item.className = 'policy-item';
                    item.innerHTML = `
                        <div class="policy-name">${data.name || 'Untitled Policy'}</div>
                        <div class="policy-desc">${data.description || 'No description provided.'} <br><br> <code style="font-size: 12px; color: #64748B;">Rule: ${data.rule_definition || ''}</code></div>
                    `;
                    policyContainer.appendChild(item);
                });
            } else {
                policyContainer.innerHTML = '<p style="text-align: center;">No active policies found.</p>';
            }
        } catch (error) {
            console.error('Error loading policies:', error);
            policyContainer.innerHTML = '<p style="text-align: center; color: #E11D48;">Failed to sync with Policy Engine. Please refresh.</p>';
        }
    }

    loadPolicies();

    // 2. Handle Waitlist Form
    const waitlistForm = document.getElementById('waitlist-form');
    const formMessage = document.getElementById('form-message');
    const submitBtn = document.getElementById('submit-btn');
    const waitlistDbId = 'e3bd1017-3951-444f-9634-8306ef607c10';

    waitlistForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(waitlistForm);
        const data = {
            email: formData.get('email'),
            name: formData.get('name'),
            company: formData.get('company'),
            role: formData.get('role')
        };

        submitBtn.disabled = true;
        submitBtn.innerText = 'Syncing...';
        formMessage.innerText = '';

        try {
            const response = await fetch(`https://stg-app.baget.ai/api/public/databases/${waitlistDbId}/rows`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ data })
            });

            if (response.ok) {
                formMessage.style.color = '#C9A96E';
                formMessage.innerText = 'Confirmed. You are in the queue for the Q2 Beta cohort.';
                waitlistForm.reset();
                submitBtn.innerText = 'Request Sent';
            } else {
                throw new Error('Submission failed');
            }
        } catch (error) {
            console.error('Submission error:', error);
            formMessage.style.color = '#E11D48';
            formMessage.innerText = 'Sync failed. Please check your connection.';
            submitBtn.disabled = false;
            submitBtn.innerText = 'Request Early Access';
        }
    });
});
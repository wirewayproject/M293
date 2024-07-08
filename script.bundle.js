fetch('settings.json')
.then(response => response.json())
.then(data => {
    if (!data.webHookUrl) {
        document.getElementById('content').innerHTML = 'This site is not configured. Please contact the administrator.<br>Tip: Edit settings.json to add your webhook URL.';
        document.getElementsByClassName('headerActions')[0].style.display = 'none';
    }
})
.catch(error => console.error('Error:', error));


async function submitFeedback(event) {
    event.preventDefault();

    const name = document.getElementsByName('name')[0].value;
    const email = document.getElementsByName('email')[0].value;
    const content = document.getElementsByName('content')[0].value;
    console.log(name, email, content);

    if (name === '' || email === '' || content === '') {
        alert('Please fill out all fields');
        return;
    }

    const feedback = {
        name: name,
        email: email,
        content: content
    };

    const webhookUrl = await fetch('settings.json')
        .then(response => response.json())
        .then(data => data.webHookUrl)
        .catch(error => console.error('Error:', error));

    fetch(webhookUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            content: `**Feedback Submitted**\n\nName: ${name}\nEmail: ${email}\n\n${content}`
        })
    })
        .then(response => {
            if (response.ok) {
                alert('Feedback submitted successfully');
                document.getElementsByClassName('feedback-form')[0].reset();
            } else {
                alert('Failed to submit feedback');
            }
        })
        .catch(error => {
            alert('Failed to submit feedback');
            console.error('Error:', error);
        });
}
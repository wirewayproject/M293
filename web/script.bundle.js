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

    fetch("/submitFeedback", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(feedback)
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
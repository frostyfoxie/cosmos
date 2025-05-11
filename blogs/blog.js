// Like Button Functionality

const likeButton = document.getElementById('likeButton');

const likeCount = document.getElementById('likeCount');

let liked = false;

let likes = 42;

likeButton.addEventListener('click', function() {

    if (liked) {

        // Unlike

        likes--;

        likeButton.innerHTML = `<i class="far fa-heart"></i> ${likes} Likes`;

        likeButton.classList.remove('liked');

    } else {

        // Like

        likes++;

        likeButton.innerHTML = `<i class="fas fa-heart"></i> ${likes} Likes`;

        likeButton.classList.add('liked');

    }

    liked = !liked;

});

// Comments Functionality

const commentInput = document.getElementById('commentInput');

const submitComment = document.getElementById('submitComment');

const commentsList = document.getElementById('commentsList');

submitComment.addEventListener('click', function() {

    const commentText = commentInput.value.trim();

    

    if (commentText) {

        // Create new comment

        const newComment = document.createElement('div');

        newComment.className = 'comment';

        

        // Get user's first initial (in a real app, this would come from user data)

        const userName = "Anonymous";

        const userInitial = userName.charAt(0).toUpperCase();

        

        // Current date

        const options = { year: 'numeric', month: 'long', day: 'numeric' };

        const currentDate = new Date().toLocaleDateString('en-US', options);

        

        newComment.innerHTML = `

            <div class="comment-header">

                <div class="comment-avatar">${userInitial}</div>

                <div>

                    <span class="comment-author">${userName}</span>

                    <span class="comment-date">${currentDate}</span>

                </div>

            </div>

            <div class="comment-content">

                ${commentText}

            </div>

        `;

        

        // Add to top of comments list

        commentsList.insertBefore(newComment, commentsList.firstChild);

        

        // Clear input

        commentInput.value = '';

        

        // Show success message

        alert('Thank you for your comment!');

    } else {

        alert('Please write a comment before submitting.');

    }

});

// Allow submitting comment with Enter key (but allow Shift+Enter for new lines)

commentInput.addEventListener('keydown', function(e) {

    if (e.key === 'Enter' && !e.shiftKey) {

        e.preventDefault();

        submitComment.click();

    }

});
class RatingService {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5014';
  }

  async getReviewsForBook(bookId, token = null) {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const url = `${this.baseURL}/api/ReviewRating/book/${bookId}`;

    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch reviews: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return await response.json();
  }

  async addReview(reviewData, token) {
    const url = `${this.baseURL}/api/ReviewRating`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(reviewData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to add review: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return await response.text();
  }

  async getAverageRating(bookId, token = null) {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const url = `${this.baseURL}/api/ReviewRating/book/${bookId}/average`;

    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch average rating: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return await response.json();
  }
}

const ratingService = new RatingService();
export default ratingService;

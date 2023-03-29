export function getMotivationalPictures() {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockResponse = [
        "/static/images/motivational-pictures/mountain.jpg",
        "/static/images/motivational-pictures/darts.jpg",
        "/static/images/motivational-pictures/passion.jpg",
      ];
      resolve(mockResponse);
    }, 700);
  });
}

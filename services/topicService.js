


const topics = [
  // Science & Space
  "Mind Blowing Facts About Black Holes",
  "Amazing Facts About the Human Brain",
  "Incredible Facts About Deep Sea Creatures",
  "Surprising Facts About Quantum Physics",
  "Fascinating Facts About DNA and Genetics",

  // Technology & AI
  "Top AI Tools Changing the World",
  "Future Technology That Will Blow Your Mind",
  "Robotics Innovations You Wont Believe",
  "How Blockchain is Changing Everything",
  "Mind Blowing Facts About the Internet",

  // History & Earth
  "Ancient Civilizations That Mysteriously Vanished",
  "Incredible Facts About Planet Earth",
  "Surprising Facts About the Roman Empire",
  "Amazing Facts About Volcanoes and Earthquakes",
  "Mind Blowing Facts About the Ocean",

  // Motivation & Success
  "Habits of the Most Successful People",
  "Startup Stories That Inspire Millions",
  "Life Changing Facts About Human Psychology",
  "Surprising Facts About Sleep and Dreams",
  "Amazing Facts About the Power of the Mind"
];

function getRandomTopic() {
  const index = Math.floor(Math.random() * topics.length);
  return topics[index];
}

module.exports = { getRandomTopic };
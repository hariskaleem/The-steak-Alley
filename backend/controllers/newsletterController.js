const NewsletterSubscriber = require("../models/NewsletterSubscriber");

const getSubscribers = async (req, res) => {
  try {
    const subscribers = await NewsletterSubscriber.find().sort({ createdAt: -1 }).lean();
    return res.json({ subscribers });
  } catch (error) {
    console.error("Get newsletter subscribers error:", error);
    return res.status(500).json({ message: "Could not load newsletter subscribers." });
  }
};

const deleteSubscriber = async (req, res) => {
  try {
    const subscriber = await NewsletterSubscriber.findByIdAndDelete(req.params.id);

    if (!subscriber) {
      return res.status(404).json({ message: "Subscriber not found." });
    }

    return res.json({ message: "Subscriber removed successfully." });
  } catch (error) {
    console.error("Delete newsletter subscriber error:", error);
    return res.status(500).json({ message: "Could not remove subscriber." });
  }
};

const subscribe = async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();

    if (!email) {
      return res.status(400).json({ message: "Email address is required." });
    }

    const subscriber = await NewsletterSubscriber.create({ email });

    return res.status(201).json({
      message: "You are subscribed to our newsletter!",
      subscriber: { id: subscriber._id, email: subscriber.email },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "This email is already subscribed." });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({ message: "Please enter a valid email address." });
    }

    console.error("Newsletter subscription error:", error);
    return res.status(500).json({ message: "Could not subscribe right now. Please try again." });
  }
};

module.exports = { subscribe, getSubscribers, deleteSubscriber };

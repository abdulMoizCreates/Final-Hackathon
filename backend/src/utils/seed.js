import User from "../models/User.js";

// The shared demo account so you can log in instantly every run.
export const DEMO_EMAIL = "demo@hackathon.com";
export const DEMO_PASSWORD = "demo1234";

export async function seedDemoUser() {
  try {
    const exists = await User.findOne({ email: DEMO_EMAIL });
    if (!exists) {
      await User.create({ email: DEMO_EMAIL, password: DEMO_PASSWORD });
      console.log(`Demo user created: ${DEMO_EMAIL} / ${DEMO_PASSWORD}`);
    }
  } catch (err) {
    console.error(`Demo user seed error: ${err.message}`);
  }
}

import { Router } from "express";
import { googleCallbackController, logoutController, meController} from "../controllers/auth.controller";
import { checkAuth, } from "../middleware/auth.middleware";

const router = Router();

// Step 1: Redirect user to Google
router.get("/auth/google", (req, res) => {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: process.env.GOOGLE_REDIRECT_URL!,
    response_type: "code",
    scope: "openid email profile"
  });

  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
});

// Step 2: Google redirects back here
router.get("/auth/google/callback", googleCallbackController);

router.get("/auth/me",checkAuth,meController);
router.get("/auth/logout", logoutController);
export default router;
